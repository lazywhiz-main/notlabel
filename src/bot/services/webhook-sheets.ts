import { ResearchArticle } from '../../lib/microcms';

export class WebhookSheetsService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Webhook経由で投稿をSheetsに追加
   */
  async addTweetDraft(article: ResearchArticle, tweetText: string): Promise<void> {
    try {
      const now = new Date();
      const timestamp = now.toISOString();
      const formattedDate = now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
      });

      const postData = {
        timestamp: formattedDate,
        title: article.title,
        tweetText: tweetText,
        articleUrl: `${process.env.SITE_URL || 'https://your-site.com'}/research/${article.slug}`,
        difficulty: Array.isArray(article.difficulty) ? article.difficulty.join(', ') : '',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
        posted: 'No'
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }

      console.log(`📊 投稿をSheetsに追加: ${article.title}`);
    } catch (error) {
      console.error('Sheets追加エラー:', error);
      throw error;
    }
  }

  /**
   * 接続テスト
   */
  async testConnection(): Promise<boolean> {
    try {
      const testData = {
        timestamp: new Date().toISOString(),
        title: 'テスト投稿',
        tweetText: 'これはテスト投稿です',
        articleUrl: 'https://example.com/test',
        difficulty: 'test',
        tags: 'test',
        posted: 'Test'
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      return response.ok;
    } catch (error) {
      console.error('接続テスト失敗:', error);
      return false;
    }
  }
} 