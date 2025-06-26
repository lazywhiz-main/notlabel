import { getResearchArticles } from '@/lib/microcms'
import type { ResearchArticle } from '@/lib/microcms'

export async function GET() {
  try {
    const data = await getResearchArticles(1000) // 全記事取得
    const articles: ResearchArticle[] = data.contents
    
    const baseUrl = process.env.SITE_URL || 'https://no-label.me'
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/research</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${articles.map((article: ResearchArticle) => `
  <url>
    <loc>${baseUrl}/research/${article.slug}</loc>
    <lastmod>${article.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600' // 1時間キャッシュ
      }
    })
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 