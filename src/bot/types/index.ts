// PubMed論文の基本情報
export interface PubMedPaper {
  id: string
  title: string
  abstract: string
  authors: string[]
  publishDate: string
  journal: string
  pubmedUrl: string
}

// GPTによる論文評価結果
export interface PaperEvaluation {
  score: number
  shouldPublish: boolean
  reason: string
  summary: string
  title_simplified: string
  keywords: string[]
}

// 評価済み論文
export interface EvaluatedPaper {
  paper: PubMedPaper
  evaluation: PaperEvaluation
}

// microCMS記事投稿用データ
export interface ArticleData {
  title: string
  summary: string
  body: string
  tags: string // カンマ区切り文字列（microCMS制約により）
  original_url: string
  posted_at: string
  slug: string
  // 新しく追加したフィールド
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  research_type: string
  original_title: string
  pubmed_id: string
  journal: string
  publish_date: string
  ai_generated: boolean
  ai_generated_at: string
  read_time: string
}

// microCMS API レスポンス
export interface MicroCMSResponse {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
} 