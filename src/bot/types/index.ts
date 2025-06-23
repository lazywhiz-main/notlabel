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
  // Phase 1メタデータ追加
  cancer_types: string[]          // がん種分類
  treatment_outcomes: string[]    // 治療成果分類
  research_stage: string[]       // 研究段階（複数選択の場合）
  japan_availability: string[]   // 日本での利用可能性（複数選択の場合）
  patient_keywords: string[]     // 患者向けキーワード
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' // 理解難易度
  cancer_specificity: 'specific' | 'pan_cancer' | 'general' // 新フィールド追加
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
  // 既存フィールド
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  research_type: string
  original_title: string
  pubmed_id: string
  journal: string
  publish_date: string
  ai_generated: boolean
  ai_generated_at: string
  read_time: string
  // Phase 1新フィールド
  cancer_types?: string[]          // がん種分類
  treatment_outcomes?: string[]    // 治療成果分類
  research_stage?: string[]       // 研究段階（複数選択の場合）
  japan_availability?: string[]   // 日本での利用可能性（複数選択の場合）
  patient_keywords?: string[]     // 患者向けキーワード
}

// microCMS API レスポンス
export interface MicroCMSResponse {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
}

// microCMS記事データ（APIレスポンス用）
export interface MicroCMSArticle {
  id: string
  title: string
  content: string
  summary: string
  cancer_types: string[]
  research_type: string[]
  difficulty: string[] // microCMSでは配列として返される
  author: string
  published_at: string
  tags: string[]
  slug: string
  original_title?: string
  original_url?: string
  evaluation_criteria?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  cancer_specificity: string[] // 新フィールド追加
} 