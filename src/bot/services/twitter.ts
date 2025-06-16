import { TwitterApi } from 'twitter-api-v2'
import { ResearchArticle } from '../../lib/microcms'

export class TwitterService {
  private client: TwitterApi

  constructor(
    apiKey: string,
    apiSecret: string,
    accessToken: string,
    accessTokenSecret: string
  ) {
    this.client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    })
  }

  /**
   * 新しい記事をTwitterに投稿
   */
  async postNewArticle(article: ResearchArticle, siteUrl: string = 'https://your-site.com'): Promise<void> {
    try {
      // 投稿テキストを生成
      const tweetText = this.generateTweetText(article, siteUrl)
      
      console.log('🐦 Twitter投稿中...')
      console.log('投稿内容:', tweetText)
      
      // ツイート投稿
      const tweet = await this.client.v2.tweet(tweetText)
      
      console.log(`✅ Twitter投稿完了: ${tweet.data.id}`)
      
    } catch (error) {
      console.error('❌ Twitter投稿エラー:', error)
      throw error
    }
  }

  /**
   * ツイート本文を生成
   */
  private generateTweetText(article: ResearchArticle, siteUrl: string): string {
    const difficulty = this.getDifficultyEmoji(article.difficulty)
    const tags = this.generateHashtags(article.tags)
    const articleUrl = `${siteUrl}/research/${article.slug}`
    
    // 280文字制限を考慮してテキストを生成
    const baseText = `📄 新しい研究記事を公開しました\n\n${difficulty} ${article.title}\n\n${article.summary}\n\n🔗 ${articleUrl}\n\n${tags}`
    
    // 280文字を超える場合は調整
    if (baseText.length > 280) {
      const maxSummaryLength = 280 - (baseText.length - article.summary.length) - 3 // "..." 分
      const truncatedSummary = article.summary.length > maxSummaryLength 
        ? article.summary.substring(0, maxSummaryLength) + '...'
        : article.summary
      
      return `📄 新しい研究記事を公開しました\n\n${difficulty} ${article.title}\n\n${truncatedSummary}\n\n🔗 ${articleUrl}\n\n${tags}`
    }
    
    return baseText
  }

  /**
   * 難易度に応じた絵文字を取得
   */
  private getDifficultyEmoji(difficulty: string[]): string {
    const level = difficulty[0] || 'intermediate'
    switch (level) {
      case 'beginner': return '🟢'
      case 'intermediate': return '🟡'
      case 'advanced': return '🔴'
      default: return '🟡'
    }
  }

  /**
   * ハッシュタグを生成
   */
  private generateHashtags(tags: string): string {
    const tagList = tags.split(',').map(tag => tag.trim()).slice(0, 3) // 最大3つまで
    const hashtags = tagList.map(tag => 
      '#' + tag.replace(/\s+/g, '').replace(/[^\w]/g, '')
    ).join(' ')
    
    return `${hashtags} #がん研究 #医療 #研究`
  }

  /**
   * API接続テスト
   */
  async testConnection(): Promise<boolean> {
    try {
      const me = await this.client.v2.me()
      console.log('✅ Twitter API接続成功:', me.data.username)
      return true
    } catch (error) {
      console.error('❌ Twitter API接続失敗:', error)
      return false
    }
  }
} 