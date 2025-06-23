import dotenv from 'dotenv'
import { PubMedService } from './services/pubmed'
import { OpenAIService } from './services/openai'
import { MicroCMSService } from './services/microcms'
import { TwitterService } from './services/twitter'
import { GoogleSheetsService } from './services/google-sheets'
import { WebhookSheetsService } from './services/webhook-sheets'
import { ArticleProcessor } from './processors/article-processor'
import { selectOptimalTemplate, adjustTweetLength } from './templates/tweet-templates'

// 環境変数の読み込み
dotenv.config()

// ツイート文生成関数（テンプレートシステム使用）
function generateTweetText(article: any, siteUrl: string): string {
  // 最適なテンプレートを選択
  const template = selectOptimalTemplate(article);
  
  // テンプレートを使用して投稿文を生成
  const tweetText = template.pattern(article, siteUrl);
  
  // 280文字制限に合わせて調整
  return adjustTweetLength(tweetText);
}

// 旧関数は templates/tweet-templates.ts に移動済み

async function main() {
  console.log('🤖 がん論文要約Bot - 実行開始')
  
  try {
    // サービスの初期化
    const pubmedService = new PubMedService()
    const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!)
    const microcmsService = new MicroCMSService(
      process.env.MICROCMS_API_KEY!,
      process.env.MICROCMS_SERVICE_DOMAIN!
    )
    
    // SNS投稿サービスの初期化
    let snsService: TwitterService | GoogleSheetsService | WebhookSheetsService | null = null
    let snsType = 'none'

    // Twitter設定の確認
    if (process.env.TWITTER_API_KEY && 
        process.env.TWITTER_API_SECRET && 
        process.env.TWITTER_ACCESS_TOKEN && 
        process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      
      const twitterService = new TwitterService(
        process.env.TWITTER_API_KEY,
        process.env.TWITTER_API_SECRET,
        process.env.TWITTER_ACCESS_TOKEN,
        process.env.TWITTER_ACCESS_TOKEN_SECRET
      )
      
      // Twitter API接続テスト
      const isConnected = await twitterService.testConnection()
      if (isConnected) {
        snsService = twitterService
        snsType = 'twitter'
        console.log('✅ Twitter使用モード')
      } else {
        console.log('⚠️ Twitter API接続に失敗、Google Sheetsモードを試行中...')
      }
    }

    // Twitterが利用できない場合、Google Sheetsを試行
    if (!snsService && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
        process.env.GOOGLE_PRIVATE_KEY && 
        process.env.GOOGLE_SPREADSHEET_ID) {
      
      const googleSheetsService = new GoogleSheetsService(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        process.env.GOOGLE_PRIVATE_KEY,
        process.env.GOOGLE_SPREADSHEET_ID
      )
      
      const isConnected = await googleSheetsService.testConnection()
      if (isConnected) {
        snsService = googleSheetsService
        snsType = 'sheets'
        console.log('✅ Google Sheets使用モード')
        
        // 初回のヘッダー設定（エラーになっても続行）
        try {
          await googleSheetsService.setupHeaders()
        } catch (error) {
          console.log('ℹ️ ヘッダーは既に設定済みです')
        }
      } else {
        console.log('⚠️ Google Sheets接続に失敗')
      }
    }

    // Webhook Sheets設定の確認（Google Sheetsが利用できない場合）
    if (!snsService && process.env.WEBHOOK_SHEETS_URL) {
      console.log('🔗 Webhook Sheets方式を試行中...')
      const webhookService = new WebhookSheetsService(process.env.WEBHOOK_SHEETS_URL)
      
      // Webhook接続テスト
      const isConnected = await webhookService.testConnection()
      if (isConnected) {
        snsService = webhookService
        snsType = 'webhook-sheets'
        console.log('✅ Webhook Sheets使用モード')
      } else {
        console.log('⚠️ Webhook接続に失敗')
      }
    }

    if (!snsService) {
      console.log('ℹ️ SNS投稿サービスが利用できません。投稿内容はコンソールに出力されます')
    }
    
    // 論文処理プロセッサーの初期化
    const processor = new ArticleProcessor(openaiService, microcmsService)
    
    // 1. PubMedから論文を取得
    console.log('📄 PubMedからがん関連論文を取得中...')
    
    const papers = await pubmedService.fetchCancerPapers(14) // 14日間に拡張
    console.log(`📄 ${papers.length}件の論文を取得しました`)
    
    // 2. 各論文をGPTでスコアリング
    console.log('🧠 GPTによる論文評価を開始...')
    const evaluatedPapers = await processor.evaluateAll(papers)
    
    // 評価統計を出力
    processor.printStatistics(evaluatedPapers)
    
    // 3. 一定得点以上の論文を選別（環境変数で閾値設定可能、デフォルト4.5）
    const scoreThreshold = parseFloat(process.env.SCORE_THRESHOLD || '4.0') // テスト用に一時的に4.0に変更
    const publishablePapers = evaluatedPapers.filter(
      paper => paper.evaluation.score >= scoreThreshold && paper.evaluation.shouldPublish
    )
    
    console.log(`\n✨ 配信対象 (スコア≥${scoreThreshold}): ${publishablePapers.length}件の論文`)
    
    // 4. 全ての対象論文を記事化してmicroCMSに投稿（スコア順にソート）
    const targetPapers = publishablePapers
      .sort((a, b) => b.evaluation.score - a.evaluation.score)
    
    const publishedArticles: any[] = []
    
    for (const paper of targetPapers) {
      console.log(`📝 記事生成中: ${paper.evaluation.title_simplified}`)
      const articleData = await processor.generateAndPublish(paper)
      
      if (articleData) {
        publishedArticles.push(articleData)
        console.log(`✅ 投稿完了: ${paper.evaluation.title_simplified}`)
      }
    }
    
    // 5. SNS投稿
    if (snsService && publishedArticles.length > 0) {
      console.log('\n🐦 SNS投稿を開始...')
      
      for (const article of publishedArticles) {
        try {
          if (snsType === 'twitter') {
            // Twitter投稿
            await (snsService as TwitterService).postNewArticle(article, process.env.SITE_URL || 'https://your-site.com')
            console.log(`🎉 Twitter投稿完了: ${article.title}`)
            
          } else if (snsType === 'sheets') {
            // Google Sheets投稿
            const tweetText = generateTweetText(article, process.env.SITE_URL || 'https://your-site.com')
            await (snsService as GoogleSheetsService).addTweetDraft(article, tweetText)
            console.log(`🎉 Google Sheets追加完了: ${article.title}`)
            
          } else if (snsType === 'webhook-sheets') {
            // Webhook Sheets投稿
            const tweetText = generateTweetText(article, process.env.SITE_URL || 'https://your-site.com')
            await (snsService as WebhookSheetsService).addTweetDraft(article, tweetText)
            console.log(`🎉 Webhook Sheets追加完了: ${article.title}`)
          }
          
          // 投稿間隔を空ける（API制限対策）
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          console.error(`❌ SNS投稿エラー (${article.title}):`, error)
          // SNS投稿エラーでもbot処理は継続
        }
      }
    }

    // SNSサービスが利用できない場合、投稿内容をコンソールに出力
    if (!snsService && publishedArticles.length > 0) {
      console.log('\n📄 投稿予定内容:')
      for (const article of publishedArticles) {
        const tweetText = generateTweetText(article, process.env.SITE_URL || 'https://your-site.com')
        console.log(`\n--- ${article.title} ---`)
        console.log(tweetText)
        console.log('---')
      }
    }
    
    console.log('🎉 Bot実行完了')
    
  } catch (error) {
    console.error('❌ Bot実行中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// メイン処理の実行
main() 