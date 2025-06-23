// クライアントサイド用のmicroCMS API アクセス

export interface ResearchArticleClient {
  id: string
  title: string
  summary: string
  body: string
  tags: string
  difficulty: string[]
  research_type: string
  original_title: string
  original_url: string
  pubmed_id: string
  journal: string
  publish_date: string
  ai_generated: boolean
  ai_generated_at: string
  read_time: string
  slug: string
  published_at: string
  createdAt: string
  updatedAt: string
  // Phase 1メタデータフィールド
  cancer_types?: string[]
  treatment_outcomes?: string[]
  research_stage?: string[]
  japan_availability?: string[]
  patient_keywords?: string[]
  cancer_specificity?: string[]
}

// クライアントサイドでのAPI呼び出し
export async function getResearchArticlesClient(limit = 10, offset = 0): Promise<{ contents: ResearchArticleClient[], totalCount: number }> {
  try {
    // Next.js API Route経由でmicroCMSにアクセス
    const response = await fetch(`/api/research?limit=${limit}&offset=${offset}`)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch research articles:', error)
    throw error
  }
} 