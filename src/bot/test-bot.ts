import dotenv from 'dotenv'
import { OpenAIService } from './services/openai'
import { ArticleProcessor } from './processors/article-processor'
import { PubMedPaper } from './types'

// 環境変数の読み込み
dotenv.config()

// テスト用のモックデータ
const mockPapers: PubMedPaper[] = [
  {
    id: '12345678',
    title: 'Phase II trial of novel immunotherapy XYZ-101 in advanced non-small cell lung cancer',
    abstract: 'Background: XYZ-101 is a novel PD-1 inhibitor showing promising results in preclinical studies. Methods: This Phase II clinical trial enrolled 120 patients with advanced NSCLC who had progressed on standard therapy. Results: The overall response rate was 35% with a median progression-free survival of 8.2 months. Grade 3-4 adverse events occurred in 15% of patients. Conclusion: XYZ-101 demonstrates encouraging efficacy with manageable toxicity in advanced NSCLC patients.',
    authors: ['Smith, J.', 'Johnson, M.', 'Williams, S.'],
    publishDate: '2024-01-15',
    journal: 'Journal of Clinical Oncology',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/12345678/'
  },
  {
    id: '87654321',
    title: 'Molecular mechanisms of resistance to targeted therapy in breast cancer',
    abstract: 'This study investigates the molecular basis of acquired resistance to HER2-targeted therapy in breast cancer. Using RNA sequencing and proteomics analysis of tumor samples from 50 patients, we identified novel resistance pathways. Our findings suggest that combination therapy targeting multiple pathways may overcome resistance.',
    authors: ['Davis, L.', 'Brown, K.'],
    publishDate: '2024-01-10',
    journal: 'Nature Medicine',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/87654321/'
  },
  {
    id: '11223344',
    title: 'Cost-effectiveness analysis of CAR-T cell therapy in relapsed lymphoma',
    abstract: 'Background: CAR-T cell therapy has shown remarkable efficacy in relapsed B-cell lymphomas but comes with high costs. This economic evaluation compared CAR-T therapy with standard salvage chemotherapy. Methods: We used a Markov model to project lifetime costs and quality-adjusted life years. Results: CAR-T therapy had an incremental cost-effectiveness ratio of $150,000 per QALY gained.',
    authors: ['Wilson, P.', 'Taylor, R.'],
    publishDate: '2024-01-08',
    journal: 'Health Economics',
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/11223344/'
  }
]

// モックmicroCMSサービス（コンソール出力のみ）
class MockMicroCMSService {
  generateSlug(title: string, pubmedId: string): string {
    const sanitized = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    if (sanitized.length < 10) {
      return `research-${pubmedId}-${Date.now()}`
    }
    
    return sanitized.substring(0, 50)
  }
  
  async checkArticleExists(_slug: string): Promise<boolean> {
    return false // 常に新規として扱う
  }
  
  async publishArticle(articleData: any): Promise<any> {
    console.log('📮 [MOCK] microCMS投稿シミュレーション:')
    console.log(`  タイトル: ${articleData.title}`)
    console.log(`  要約: ${articleData.summary}`)
    console.log(`  タグ: ${articleData.tags}`)
    console.log(`  URL: ${articleData.original_url}`)
    console.log(`  本文長: ${articleData.body.length}文字`)
    console.log('✅ [MOCK] 投稿完了（実際の投稿は行われません）\n')
    
    return {
      id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      revisedAt: new Date().toISOString()
    }
  }
  
  validateArticleData(articleData: any): boolean {
    const required = ['title', 'summary', 'body', 'original_url', 'slug']
    
    for (const field of required) {
      if (!articleData[field as keyof typeof articleData]) {
        console.error(`❌ 必須フィールドが不足: ${field}`)
        return false
      }
    }
    
    return true
  }
}

async function testBot() {
  console.log('🤖 がん論文要約Bot - テスト実行開始')
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEYが設定されていません')
    process.exit(1)
  }
  
  try {
    // サービスの初期化
    const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!)
    const mockMicrocmsService = new MockMicroCMSService()
    
    // プロセッサーの初期化
    const processor = new ArticleProcessor(openaiService, mockMicrocmsService as any)
    
    console.log(`📄 ${mockPapers.length}件のテスト論文を使用`)
    
    // 各論文をGPTでスコアリング
    console.log('🧠 GPTによる論文評価を開始...')
    const evaluatedPapers = await processor.evaluateAll(mockPapers)
    
    // 評価統計を出力
    processor.printStatistics(evaluatedPapers)
    
    // 高スコア論文を選別
    const publishablePapers = evaluatedPapers.filter(
      paper => paper.evaluation.score >= 3.0 && paper.evaluation.shouldPublish
    )
    
    console.log(`\n✨ 配信対象: ${publishablePapers.length}件の論文`)
    
    // 上位2件を記事化（テスト用に制限）
    const topPapers = publishablePapers
      .sort((a, b) => b.evaluation.score - a.evaluation.score)
      .slice(0, 2)
    
    for (const paper of topPapers) {
      console.log(`📝 記事生成中: ${paper.evaluation.title_simplified}`)
      await processor.generateAndPublish(paper)
    }
    
    console.log('🎉 テストBot実行完了')
    
  } catch (error) {
    console.error('❌ テストBot実行中にエラーが発生しました:', error)
    process.exit(1)
  }
}

// テスト実行
testBot() 