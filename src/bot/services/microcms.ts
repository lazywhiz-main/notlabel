import axios from 'axios'
import { ArticleData, MicroCMSResponse } from '../types'

export class MicroCMSService {
  private apiKey: string
  private serviceDomain: string
  private baseUrl: string
  
  /**
   * @param apiKey microCMS API Key
   * @param serviceDomain microCMSサービスドメイン（例：notlabel.microcms.io の場合は "notlabel"）
   */
  constructor(apiKey: string, serviceDomain: string) {
    this.apiKey = apiKey
    this.serviceDomain = serviceDomain
    this.baseUrl = `https://${serviceDomain}.microcms.io/api/v1`
  }
  
  /**
   * 記事をmicroCMSに投稿
   */
  async publishArticle(articleData: ArticleData): Promise<MicroCMSResponse> {
    try {
      console.log(`📮 microCMSに記事投稿中: ${articleData.title}`)
      
      // 投稿データの詳細をログ出力
      console.log('📝 投稿データ詳細:')
      console.log('  - title:', articleData.title)
      console.log('  - difficulty:', articleData.difficulty)
      console.log('  - research_type:', articleData.research_type)
      console.log('  - ai_generated:', articleData.ai_generated)
      console.log('  - journal:', articleData.journal)
      console.log('  - pubmed_id:', articleData.pubmed_id)
      console.log('  - read_time:', articleData.read_time)
      console.log('  - slug:', articleData.slug)
      
      const response = await axios.post(
        `${this.baseUrl}/articles`,
        articleData,
        {
          headers: {
            'X-MICROCMS-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
          }
          // status=draftを指定しない = 公開状態で投稿
        }
      )
      
      console.log(`✅ 投稿完了: ${response.data.id}`)
      return response.data
      
    } catch (error) {
      console.error('❌ microCMS投稿エラー:', error)
      
      if (axios.isAxiosError(error)) {
        console.error('エラー詳細:', error.response?.data)
      }
      
      throw error
    }
  }
  
  /**
   * 記事の存在チェック（重複投稿防止）
   */
  async checkArticleExists(slug: string): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/articles/${slug}`, {
        headers: {
          'X-MICROCMS-API-KEY': this.apiKey
        }
      })
      
      return true // 記事が存在する
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false // 記事が存在しない
      }
      
      console.error('❌ 記事存在チェックエラー:', error)
      return false
    }
  }
  
  /**
   * タイトルからslugを生成（日本語対応）
   */
  generateSlug(title: string, pubmedId: string): string {
    // 日本語タイトルの場合はPubMed IDをベースにslugを生成
    const sanitized = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 特殊文字を除去
      .replace(/\s+/g, '-') // スペースをハイフンに
      .replace(/-+/g, '-') // 連続ハイフンを単一に
      .trim()
    
    // 日本語が含まれている場合やslugが短すぎる場合
    if (sanitized.length < 10 || /[^\x00-\x7F]/.test(title)) {
      return `research-${pubmedId}-${Date.now()}`
    }
    
    return sanitized.substring(0, 50) // 長さを制限
  }
  
  /**
   * 記事データの検証
   */
  validateArticleData(articleData: ArticleData): boolean {
    const required = [
      'title', 'summary', 'body', 'original_url', 'slug',
      'difficulty', 'research_type', 'original_title', 
      'pubmed_id', 'journal', 'publish_date', 
      'ai_generated', 'ai_generated_at', 'read_time'
    ]
    
    for (const field of required) {
      if (!articleData[field as keyof ArticleData]) {
        console.error(`❌ 必須フィールドが不足: ${field} = ${articleData[field as keyof ArticleData]}`)
        return false
      }
    }
    
    console.log('✅ 記事データ検証完了')
    return true
  }
} 