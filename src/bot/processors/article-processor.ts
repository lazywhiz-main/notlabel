import { OpenAIService } from '../services/openai'
import { MicroCMSService } from '../services/microcms'
import { PubMedPaper, EvaluatedPaper, ArticleData } from '../types'

export class ArticleProcessor {
  private openaiService: OpenAIService
  private microcmsService: MicroCMSService
  
  constructor(openaiService: OpenAIService, microcmsService: MicroCMSService) {
    this.openaiService = openaiService
    this.microcmsService = microcmsService
  }
  
  /**
   * 論文配列を全て評価
   */
  async evaluateAll(papers: PubMedPaper[]): Promise<EvaluatedPaper[]> {
    const evaluatedPapers: EvaluatedPaper[] = []
    
    console.log(`🧠 ${papers.length}件の論文を評価中...`)
    
    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i]
      console.log(`📝 評価中 ${i + 1}/${papers.length}: ${paper.title.substring(0, 50)}...`)
      
      try {
        const evaluation = await this.openaiService.evaluatePaper(paper)
        evaluatedPapers.push({
          paper,
          evaluation
        })
        
        console.log(`  📊 スコア: ${evaluation.score}, 投稿可否: ${evaluation.shouldPublish}`)
        
        // API制限対策で少し待機
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ 論文評価エラー (${paper.id}):`, error)
        continue
      }
    }
    
    return evaluatedPapers
  }
  
  /**
   * 評価済み論文から記事を生成してmicroCMSに投稿
   */
  async generateAndPublish(evaluatedPaper: EvaluatedPaper): Promise<ArticleData | null> {
    const { paper, evaluation } = evaluatedPaper
    
    try {
      // 1. slugを生成
      const slug = this.microcmsService.generateSlug(evaluation.title_simplified, paper.id)
      
      // 2. 重複チェック
      const exists = await this.microcmsService.checkArticleExists(slug)
      if (exists) {
        console.log(`⚠️ 既存記事をスキップ: ${slug}`)
        return null
      }
      
      // 3. 記事本文を生成
      console.log(`📝 記事本文生成中...`)
      const body = await this.openaiService.generateArticle(paper, evaluation)
      
      // TODO: microCMSのフィールドがリッチテキスト形式の場合、MarkdownをHTMLに変換する
      // const bodyHtml = this.convertMarkdownToHtml(body)
      
      // 4. 記事データを構築（全フィールド）
      const articleData: any = {
        title: evaluation.title_simplified,
        summary: evaluation.summary,
        body: body,
        tags: evaluation.keywords.join(', '),
        original_url: paper.pubmedUrl,
        posted_at: new Date().toISOString(),
        slug: slug,
        // 既存フィールド
        research_type: 'cancer_research',
        original_title: paper.title,
        pubmed_id: paper.id,
        journal: paper.journal || '',
        publish_date: paper.publishDate ? new Date(paper.publishDate).toISOString() : new Date().toISOString(),
        ai_generated_at: new Date().toISOString(),
        ai_generated: true,
        read_time: '5分',
        // Phase 1新フィールド
        cancer_types: evaluation.cancer_types,
        treatment_outcomes: evaluation.treatment_outcomes,
        research_stage: [evaluation.research_stage],  // 配列として送信
        japan_availability: [evaluation.japan_availability],  // 配列として送信  
        patient_keywords: evaluation.patient_keywords,
        difficulty: [evaluation.difficulty_level],
        cancer_specificity: [evaluation.cancer_specificity]
      }
      
      console.log('🔍 投稿データを確認:', JSON.stringify(articleData, null, 2))
      
      console.log('📝 全フィールドで投稿中...')
      
      // 5. データ検証
      if (!this.microcmsService.validateArticleData(articleData)) {
        throw new Error('記事データの検証に失敗しました')
      }
      
      // 6. microCMSに投稿
      await this.microcmsService.publishArticle(articleData)
      
      console.log(`🎉 記事投稿完了: ${evaluation.title_simplified}`)
      
      return articleData
      
    } catch (error) {
      console.error(`❌ 記事生成・投稿エラー (${paper.id}):`, error)
      throw error
    }
  }
  
  /**
   * 評価結果の統計を出力
   */
  printStatistics(evaluatedPapers: EvaluatedPaper[]): void {
    const total = evaluatedPapers.length
    const publishable = evaluatedPapers.filter(p => p.evaluation.shouldPublish).length
    const highScore = evaluatedPapers.filter(p => p.evaluation.score >= 4.0).length
    const excellentScore = evaluatedPapers.filter(p => p.evaluation.score >= 4.5).length
    const averageScore = evaluatedPapers.reduce((sum, p) => sum + p.evaluation.score, 0) / total
    
    console.log('\n📊 評価統計:')
    console.log(`  総論文数: ${total}`)
    console.log(`  投稿可能: ${publishable} (${((publishable / total) * 100).toFixed(1)}%)`)
    console.log(`  高スコア (≥4.0): ${highScore} (${((highScore / total) * 100).toFixed(1)}%)`)
    console.log(`  厳選論文 (≥4.5): ${excellentScore} (${((excellentScore / total) * 100).toFixed(1)}%)`)
    console.log(`  平均スコア: ${averageScore.toFixed(2)}`)
    
    // 高スコア論文を表示
    const qualifiedPapers = evaluatedPapers
      .filter(p => p.evaluation.shouldPublish)
      .sort((a, b) => b.evaluation.score - a.evaluation.score)
    
    if (qualifiedPapers.length > 0) {
      console.log('\n🏆 投稿対象論文:')
      qualifiedPapers.forEach((paper, index) => {
        console.log(`  ${index + 1}. [${paper.evaluation.score}] ${paper.evaluation.title_simplified}`)
      })
    }
  }
} 