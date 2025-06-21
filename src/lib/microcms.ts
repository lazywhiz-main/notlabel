import { createClient } from 'microcms-js-sdk'

// Research記事の型定義
export interface ResearchArticle {
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
}

// 統合コンテンツ記事の型定義
export interface ContentArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: 'philosophy' | 'journal' | 'voices'
  tags: string[]
  published_at: string
  slug: string
  createdAt: string
  updatedAt: string
}

// Journal記事の型定義（既存API用）
export interface JournalArticle {
  id: string
  title: string
  excerpt: string
  body: string
  category: 'series' | 'interview' | 'column'
  author: string
  featured_image?: string
  ai_generated: boolean
  slug: string
  published_at: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

// Philosophy記事の型定義
export interface PhilosophyArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: 'philosophy'
  tags: string[]
  published_at: string
  difficulty: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

// Voices記事の型定義
export interface VoicesArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: 'voices'
  tags: string[]
  published_at: string
  difficulty: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

// 新Journal記事の型定義（新しいコンテンツ用）
export interface NewJournalArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: 'journal'
  tags: string[]
  published_at: string
  difficulty: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

// microCMSクライアント
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

// Research記事取得
// TODO: 記事数が100件を超えたらページネーション実装を検討
export async function getResearchArticles(limit = 10, offset = 0) {
  try {
    console.log('📡 microCMS API 呼び出し:', { limit, offset })
    const response = await client.get({
      endpoint: 'articles',
      queries: {
        limit,
        offset,
        orders: '-createdAt',
        filters: 'ai_generated[equals]true',
      },
    })
    
    console.log('📊 API レスポンス:', { totalCount: response.totalCount, contents: response.contents.length })
    return response
  } catch (error) {
    console.error('Failed to fetch research articles:', error)
    throw error
  }
}

// コンテンツ記事取得（カテゴリ別）
export async function getContentArticles(
  category?: 'philosophy' | 'journal' | 'voices',
  limit = 10,
  offset = 0
) {
  try {
    const queries: any = {
      limit,
      offset,
      orders: '-published_at',
    }

    if (category) {
      queries.filters = `category[equals]${category}`
    }

    const response = await client.get({
      endpoint: 'contents',
      queries,
    })
    
    return response
  } catch (error) {
    console.error('Failed to fetch content articles:', error)
    throw error
  }
}

// Philosophy記事取得
export async function getPhilosophyArticles(limit = 10, offset = 0) {
  return getContentArticles('philosophy', limit, offset)
}

// Journal記事取得（新しいコンテンツ用）
export async function getJournalArticles(limit = 10, offset = 0) {
  return getContentArticles('journal', limit, offset)
}

// Voices記事取得
export async function getVoicesArticles(limit = 10, offset = 0) {
  return getContentArticles('voices', limit, offset)
}

// 既存Journal記事取得（既存API用）
export async function getOldJournalArticles(limit = 10, offset = 0) {
  try {
    const response = await client.get({
      endpoint: 'journals',
      queries: {
        limit,
        offset,
        orders: '-published_at',
      },
    })
    return response
  } catch (error) {
    console.error('Failed to fetch journal articles:', error)
    throw error
  }
}

// 全コンテンツ取得（最新記事表示用）
export async function getAllContent(limit = 6) {
  try {
    // 統合されたcontentsエンドポイントから全て取得
    const response = await getContentArticles(undefined, limit * 3, 0)
    
    // カテゴリ別に分類
    const philosophy = response.contents.filter((item: ContentArticle) => item.category === 'philosophy')
    const journal = response.contents.filter((item: ContentArticle) => item.category === 'journal')
    const voices = response.contents.filter((item: ContentArticle) => item.category === 'voices')

    // 各カテゴリから最新のものを取得
    const allContent = [
      ...philosophy.slice(0, limit).map((item: ContentArticle) => ({ ...item, type: 'philosophy' })),
      ...journal.slice(0, limit).map((item: ContentArticle) => ({ ...item, type: 'journal' })),
      ...voices.slice(0, limit).map((item: ContentArticle) => ({ ...item, type: 'voices' })),
    ]

    // 公開日順でソート
    allContent.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

    return {
      contents: allContent.slice(0, limit),
      totalCount: allContent.length,
    }
  } catch (error) {
    console.error('Failed to fetch all content:', error)
    throw error
  }
}

// 記事をスラッグで取得（既存API用）
export async function getArticleBySlug(endpoint: 'articles' | 'journals', slug: string) {
  try {
    const response = await client.get({
      endpoint,
      queries: {
        filters: `slug[equals]${slug}`,
      },
    })
    
    return response.contents[0] || null
  } catch (error) {
    console.error(`Failed to fetch article by slug from ${endpoint}:`, error)
    return null
  }
}

// コンテンツ記事をスラッグで取得
export async function getContentBySlug(slug: string): Promise<ContentArticle | null> {
  try {
    const response = await client.get({
      endpoint: 'contents',
      queries: {
        filters: `slug[equals]${slug}`,
      },
    })
    
    return response.contents[0] || null
  } catch (error) {
    console.error('Failed to fetch content by slug:', error)
    return null
  }
}

// Research記事をスラッグで取得
export async function getResearchArticleBySlug(slug: string): Promise<ResearchArticle | null> {
  try {
    const response = await client.get({
      endpoint: 'articles',
      queries: {
        filters: `slug[equals]${slug}`,
      },
    })
    
    return response.contents[0] || null
  } catch (error) {
    console.error('Failed to fetch research article by slug:', error)
    return null
  }
} 