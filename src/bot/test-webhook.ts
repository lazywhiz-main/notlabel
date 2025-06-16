import { WebhookSheetsService } from './services/webhook-sheets';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

async function testWebhookSheets() {
  console.log('🔗 Webhook Sheets接続テスト開始');
  
  // 必要な環境変数をチェック
  if (!process.env.WEBHOOK_SHEETS_URL) {
    console.log('❌ WEBHOOK_SHEETS_URL環境変数が設定されていません');
    console.log('💡 設定手順:');
    console.log('1. Google Sheets (https://sheets.google.com/) で新しいスプレッドシートを作成');
    console.log('2. Google Apps Script (https://script.google.com/) で新しいプロジェクトを作成');
    console.log('3. google-apps-script/webhook-to-sheets.js の内容をコピー');
    console.log('4. ウェブアプリとしてデプロイして、WebhookのURLを取得');
    console.log('5. .envファイルに WEBHOOK_SHEETS_URL=your_webhook_url を追加');
    process.exit(1);
  }
  
  console.log('✅ Webhook URL設定済み');
  console.log(`🔗 URL: ${process.env.WEBHOOK_SHEETS_URL}`);
  
  try {
    const webhookService = new WebhookSheetsService(process.env.WEBHOOK_SHEETS_URL);
    
    // 接続テスト
    console.log('🔄 Webhook接続テスト中...');
    const isConnected = await webhookService.testConnection();
    
    if (isConnected) {
      console.log('✅ Webhook接続成功！');
      
      // テストデータの投稿
      console.log('📝 テストデータを投稿中...');
      const testArticle = {
        id: 'test-article',
        title: 'テスト記事: がん研究の新たな発見',
        slug: 'test-article-slug',
        summary: 'これはWebhook機能のテスト用記事です。実際のがん研究に関する重要な発見について説明しています。',
        body: 'テスト用のボディ内容',
        tags: ['test', 'cancer-research', 'breakthrough'],
        difficulty: ['intermediate'],
        research_type: ['clinical-trial'],
        original_title: 'Test Article: New Discovery in Cancer Research',
        original_url: 'https://example.com/original',
        authors: ['Test Author'],
        journal: 'Test Journal',
        published_date: new Date().toISOString().split('T')[0],
        ai_generated: true,
        ai_generated_at: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any;
      
      const testTweetText = `📄 新しい研究記事を公開しました

🟡 ${testArticle.title}

${testArticle.summary}

🔗 https://example.com/research/${testArticle.slug}

#test #がん研究 #医療 #研究`;
      
      await webhookService.addTweetDraft(testArticle, testTweetText);
      console.log('✅ テストデータの投稿完了！');
      
      console.log('\\n🎉 Webhook Sheets設定完了！');
      console.log('💡 Google Sheetsを確認して、テストデータが追加されているか確認してください。');
      
    } else {
      console.log('❌ Webhook接続失敗');
      console.log('💡 確認事項:');
      console.log('1. WebhookのURLが正しいか');
      console.log('2. Google Apps Scriptが正しくデプロイされているか');
      console.log('3. デプロイ設定で「アクセスできるユーザー」が「全員」になっているか');
    }
    
  } catch (error) {
    console.error('❌ テスト実行中にエラーが発生:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.log('💡 ネットワークエラーの可能性があります。URLを確認してください。');
      } else if (error.message.includes('403')) {
        console.log('💡 権限エラーです。Google Apps Scriptのデプロイ設定を確認してください。');
      } else if (error.message.includes('404')) {
        console.log('💡 URLが見つかりません。WebhookのURLを確認してください。');
      }
    }
  }
}

// テスト実行
testWebhookSheets(); 