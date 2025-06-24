import { getResearchArticles } from '@/lib/microcms'
import type { ResearchArticle } from '@/lib/microcms'

export async function GET() {
  try {
    const data = await getResearchArticles(50) // 最新50件
    const articles: ResearchArticle[] = data.contents
    
    const baseUrl = process.env.SITE_URL || 'https://notlabel.com'
    const buildDate = new Date().toUTCString()
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>ME≠LABEL Research - がん研究AI要約</title>
    <description>PubMedから収集されたがん関連の最新論文をAI技術により患者・当事者目線でわかりやすく要約した記事フィード</description>
    <link>${baseUrl}/research</link>
    <atom:link href="${baseUrl}/research/rss.xml" rel="self" type="application/rss+xml"/>
    <language>ja</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>ME≠LABEL AI Research Bot</generator>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>ME≠LABEL Research</title>
      <link>${baseUrl}/research</link>
    </image>
    
    ${articles.map((article: ResearchArticle) => {
      const pubDate = new Date(article.published_at).toUTCString()
      const articleUrl = `${baseUrl}/research/${article.slug}`
      
      // メタデータタグの生成
      const cancerTypes = article.cancer_types?.join(', ') || ''
      const treatmentOutcomes = article.treatment_outcomes?.join(', ') || ''
      const researchStage = Array.isArray(article.research_stage) ? article.research_stage.join(', ') : (article.research_stage || '')
      
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.summary}]]></description>
      <content:encoded><![CDATA[
        <h2>${article.title}</h2>
        <p><strong>要約:</strong> ${article.summary}</p>
        
        <h3>研究情報</h3>
        <ul>
          <li><strong>ジャーナル:</strong> ${article.journal}</li>
          <li><strong>PubMed ID:</strong> ${article.pubmed_id}</li>
          <li><strong>発表日:</strong> ${article.publish_date ? new Date(article.publish_date).toLocaleDateString('ja-JP') : '不明'}</li>
          <li><strong>難易度:</strong> ${Array.isArray(article.difficulty) ? article.difficulty.join(', ') : (article.difficulty || '中級')}</li>
          <li><strong>読了時間:</strong> ${article.read_time || '3分'}</li>
        </ul>
        
        ${cancerTypes ? `<p><strong>対象がん種:</strong> ${cancerTypes}</p>` : ''}
        ${treatmentOutcomes ? `<p><strong>治療成果:</strong> ${treatmentOutcomes}</p>` : ''}
        ${researchStage ? `<p><strong>研究段階:</strong> ${researchStage}</p>` : ''}
        
        <p><a href="${articleUrl}">記事の詳細を読む</a></p>
        
        ${article.original_url ? `<p><a href="${article.original_url}" target="_blank">原論文を見る</a></p>` : ''}
        
        <hr/>
        <p><small>この記事はAI技術により自動生成されています。医療判断の参考としての使用は避け、詳細については必ず医療専門家にご相談ください。</small></p>
      ]]></content:encoded>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@notlabel.com (ME≠LABEL AI Research Bot)</author>
      <category>がん研究</category>
      <category>AI要約</category>
      ${cancerTypes.split(', ').map(type => type ? `<category>${type}</category>` : '').join('')}
      ${treatmentOutcomes.split(', ').map(outcome => outcome ? `<category>${outcome}</category>` : '').join('')}
    </item>`
    }).join('')}
    
  </channel>
</rss>`

    return new Response(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800' // 30分キャッシュ
      }
    })
  } catch (error) {
    console.error('RSS feed generation failed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 