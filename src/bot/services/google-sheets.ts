import { google, sheets_v4 } from 'googleapis';
import { ResearchArticle } from '../../lib/microcms';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor(
    serviceAccountEmail: string,
    privateKey: string,
    spreadsheetId: string
  ) {
    // Google認証設定
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
  }

  /**
   * 新しい投稿をSheetsに追加
   */
  async addTweetDraft(article: ResearchArticle, tweetText: string): Promise<void> {
    try {
      const now = new Date();
      const timestamp = now.toISOString();
      const formattedDate = now.toLocaleDateString('ja-JP');
      const formattedTime = now.toLocaleTimeString('ja-JP');

      // 投稿データの行を作成
      const values = [
        [
          timestamp,           // A列: タイムスタンプ
          formattedDate,      // B列: 日付
          formattedTime,      // C列: 時刻
          article.title,      // D列: 記事タイトル
          tweetText,          // E列: 投稿文
          article.slug,       // F列: 記事スラッグ
          `https://your-site.com/research/${article.slug}`, // G列: 記事URL
          this.getDifficultyEmoji(article.difficulty), // H列: 難易度
          article.tags,       // I列: タグ
          '未投稿'            // J列: ステータス
        ]
      ];

      const request = {
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:J',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values,
        },
      };

      console.log('📊 Google Sheetsに投稿案を追加中...');
      await this.sheets.spreadsheets.values.append(request);
      console.log('✅ Google Sheetsに追加完了');

    } catch (error) {
      console.error('❌ Google Sheets追加エラー:', error);
      throw error;
    }
  }

  /**
   * Sheetsのヘッダー行を設定（初回のみ実行）
   */
  async setupHeaders(): Promise<void> {
    try {
      const headers = [
        'タイムスタンプ',
        '日付',
        '時刻',
        '記事タイトル',
        '投稿文',
        'スラッグ',
        '記事URL',
        '難易度',
        'タグ',
        'ステータス'
      ];

      const request = {
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A1:J1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [headers],
        },
      };

      console.log('📊 Google Sheetsヘッダー設定中...');
      await this.sheets.spreadsheets.values.update(request);
      console.log('✅ ヘッダー設定完了');

    } catch (error) {
      console.error('❌ ヘッダー設定エラー:', error);
      throw error;
    }
  }

  /**
   * 投稿ステータスを更新
   */
  async updateTweetStatus(rowIndex: number, status: '投稿済み' | 'エラー' | 'スキップ'): Promise<void> {
    try {
      const request = {
        spreadsheetId: this.spreadsheetId,
        range: `Sheet1!J${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[status]],
        },
      };

      await this.sheets.spreadsheets.values.update(request);
      console.log(`✅ ステータス更新: 行${rowIndex} → ${status}`);

    } catch (error) {
      console.error('❌ ステータス更新エラー:', error);
      throw error;
    }
  }

  /**
   * 投稿予定リストを取得
   */
  async getPendingTweets(): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:J',
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return []; // ヘッダーのみの場合

      // ヘッダーを除き、未投稿のもののみ返す
      return rows
        .slice(1)
        .map((row, index) => ({
          rowIndex: index + 2, // Sheetsは1-indexedで、ヘッダーがあるので+2
          timestamp: row[0],
          date: row[1],
          time: row[2],
          title: row[3],
          tweetText: row[4],
          slug: row[5],
          url: row[6],
          difficulty: row[7],
          tags: row[8],
          status: row[9] || '未投稿'
        }))
        .filter(item => item.status === '未投稿');

    } catch (error) {
      console.error('❌ 投稿リスト取得エラー:', error);
      throw error;
    }
  }

  /**
   * 難易度に応じた絵文字を取得
   */
  private getDifficultyEmoji(difficulty: string[]): string {
    const level = difficulty[0] || 'intermediate';
    switch (level) {
      case 'beginner': return '🟢 初級';
      case 'intermediate': return '🟡 中級';
      case 'advanced': return '🔴 上級';
      default: return '🟡 中級';
    }
  }

  /**
   * 接続テスト
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      
      console.log('✅ Google Sheets接続成功:', response.data.properties?.title);
      return true;
    } catch (error) {
      console.error('❌ Google Sheets接続失敗:', error);
      return false;
    }
  }
} 