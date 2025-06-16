import { GoogleSheetsService } from './services/google-sheets';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

async function testGoogleSheets() {
  console.log('📊 Google Sheets接続テスト開始');
  
  // 必要な環境変数をチェック
  const requiredEnvVars = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SPREADSHEET_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ 不足している環境変数:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n💡 Google Sheets API設定が必要です:');
    console.log('1. Google Cloud Consoleでサービスアカウントを作成');
    console.log('2. Google Sheets APIを有効化');
    console.log('3. サービスアカウントキーをダウンロード');
    console.log('4. スプレッドシートを作成し、サービスアカウントに編集権限を付与');
    process.exit(1);
  }
  
  console.log('✅ 必要な環境変数は全て設定されています');
  
  try {
    const googleSheetsService = new GoogleSheetsService(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      process.env.GOOGLE_PRIVATE_KEY!,
      process.env.GOOGLE_SPREADSHEET_ID!
    );
    
    // 接続テスト
    console.log('🔄 Google Sheets接続テスト中...');
    const success = await googleSheetsService.testConnection();
    
    if (success) {
      console.log('✅ Google Sheets接続成功！');
      
      // ヘッダー設定テスト
      console.log('🔄 ヘッダー設定テスト中...');
      await googleSheetsService.setupHeaders();
      console.log('✅ ヘッダー設定完了！');
      
      // テストデータ追加
      console.log('🔄 テストデータ追加中...');
      const testArticle = {
        title: 'テスト記事: 新しいがん治療法の研究',
        summary: 'これはGoogle Sheets接続テスト用のサンプル記事です。',
        slug: 'test-article-' + Date.now(),
        difficulty: ['intermediate'] as string[],
        tags: 'がん治療, 研究, テスト',
        research_type: 'cancer_research'
      };
      
      const testTweetText = '📄 新しい研究記事を公開しました\n\n🟡 テスト記事: 新しいがん治療法の研究\n\nこれはGoogle Sheets接続テスト用のサンプル記事です。\n\n🔗 https://your-site.com/research/test-article\n\n#がん治療 #研究 #テスト #がん研究 #医療 #研究';
      
      await googleSheetsService.addTweetDraft(testArticle as any, testTweetText);
      console.log('✅ テストデータ追加完了！');
      
      // 投稿予定リスト取得テスト
      console.log('🔄 投稿予定リスト取得テスト中...');
      const pendingTweets = await googleSheetsService.getPendingTweets();
      console.log(`✅ 投稿予定: ${pendingTweets.length}件`);
      
      if (pendingTweets.length > 0) {
        console.log('\n📄 投稿予定リスト:');
        pendingTweets.forEach((tweet, index) => {
          console.log(`${index + 1}. ${tweet.title}`);
          console.log(`   投稿文: ${tweet.tweetText.substring(0, 50)}...`);
          console.log(`   ステータス: ${tweet.status}`);
        });
      }
      
      console.log('\n🎉 Google Sheetsセットアップ完了！');
      console.log(`📊 スプレッドシートURL: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SPREADSHEET_ID}/edit`);
      
    } else {
      console.log('❌ Google Sheets接続失敗');
    }
    
  } catch (error) {
    console.log('❌ Google Sheetsエラー:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('PERMISSION_DENIED')) {
        console.log('💡 権限エラー: スプレッドシートにサービスアカウントの編集権限を追加してください');
        console.log(`   サービスアカウント: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
      } else if (error.message.includes('UNAUTHENTICATED')) {
        console.log('💡 認証エラー: サービスアカウントキーが正しくありません');
      } else if (error.message.includes('NOT_FOUND')) {
        console.log('💡 スプレッドシートが見つかりません: IDを確認してください');
        console.log(`   現在のID: ${process.env.GOOGLE_SPREADSHEET_ID}`);
      }
    }
  }
}

testGoogleSheets(); 