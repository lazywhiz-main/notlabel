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

// Journal記事の型定義
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

// microCMSクライアント
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
})

// Research記事取得
export async function getResearchArticles(limit = 10, offset = 0) {
  try {
    const response = await client.get({
      endpoint: 'articles',
      queries: {
        limit,
        offset,
        orders: '-createdAt',
        filters: 'ai_generated[equals]true',
      },
    })
    
    return response
  } catch (error) {
    console.error('Failed to fetch research articles:', error)
    throw error
  }
}

// Journal記事取得
export async function getJournalArticles(limit = 10, offset = 0) {
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

// 記事詳細取得
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
    console.error(`Failed to fetch article by slug: ${slug}`, error)
    throw error
  }
}

// Research記事詳細取得
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
    console.error(`Failed to fetch research article by slug: ${slug}`, error)
    throw error
  }
} 