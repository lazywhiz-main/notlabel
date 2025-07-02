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

// 単一リクエスト用（通常のページネーション用）
export async function getResearchArticlesClient(limit = 10, offset = 0): Promise<{ contents: ResearchArticleClient[], totalCount: number }> {
  try {
    // limitは最大100件まで
    const actualLimit = Math.min(limit, 100)
    // Next.js API Route経由でmicroCMSにアクセス
    const response = await fetch(`/api/research?limit=${actualLimit}&offset=${offset}`)
    
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

// 全件取得用（公式ドキュメントに従った実装）
export async function getAllResearchArticlesClient(): Promise<{ contents: ResearchArticleClient[], totalCount: number }> {
  try {
    console.log('🔍 microCMSから全件データを取得中...')
    
    const getAllContents = async (limit = 100, offset = 0): Promise<ResearchArticleClient[]> => {
      const response = await fetch(`/api/research?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      // 次のページがある場合は再帰的に取得
      if (data.offset + data.limit < data.totalCount) {
        const nextContents = await getAllContents(data.limit, data.offset + data.limit)
        return [...data.contents, ...nextContents]
      }
      
      return data.contents
    }
    
    // 最初のリクエストで総数を取得
    const firstResponse = await fetch(`/api/research?limit=100&offset=0`)
    if (!firstResponse.ok) {
      throw new Error(`API request failed: ${firstResponse.status}`)
    }
    
    const firstData = await firstResponse.json()
    const totalCount = firstData.totalCount
    
    // 全件取得
    const allContents = await getAllContents()
    
    console.log(`✅ ${allContents.length}件の記事を取得（総数: ${totalCount}件）`)
    
    return {
      contents: allContents,
      totalCount: totalCount
    }
  } catch (error) {
    console.error('Failed to fetch all research articles:', error)
    throw error
  }
} 