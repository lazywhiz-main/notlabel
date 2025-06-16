/**
 * Google Apps Script: Webhook to Sheets
 * このスクリプトをGoogle Apps Scriptにデプロイして、WebhookとしてURLを取得
 */

// スプレッドシートのIDを設定（URLから取得）
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'Twitter投稿リスト';

/**
 * POST リクエストを処理する関数
 */
function doPost(e) {
  try {
    // POSTデータをJSON形式でパース
    var data = JSON.parse(e.postData.contents);
    
    // スプレッドシートを開く
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // ヘッダーを設定
      var headers = [
        '日時',
        '記事タイトル',
        'ツイート文',
        '記事URL',
        '難易度',
        'タグ',
        '投稿済み',
        'メモ'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // ヘッダーのスタイルを設定
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      
      // 列幅を調整
      sheet.setColumnWidth(1, 120); // 日時
      sheet.setColumnWidth(2, 300); // タイトル
      sheet.setColumnWidth(3, 400); // ツイート文
      sheet.setColumnWidth(4, 200); // URL
      sheet.setColumnWidth(5, 100); // 難易度
      sheet.setColumnWidth(6, 150); // タグ
      sheet.setColumnWidth(7, 80);  // 投稿済み
      sheet.setColumnWidth(8, 200); // メモ
    }
    
    // 新しい行のデータを追加
    var newRow = [
      data.timestamp || new Date().toLocaleString('ja-JP'),
      data.title || '',
      data.tweetText || '',
      data.articleUrl || '',
      data.difficulty || '',
      data.tags || '',
      data.posted || 'No',
      '' // メモ欄（空）
    ];
    
    // 最後の行の次に追加
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'データが正常に追加されました',
        rowAdded: lastRow + 1
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET リクエストを処理する関数（テスト用）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Webhook is working! Use POST method to add data.',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 手動でテストデータを追加する関数（デバッグ用）
 */
function testAddData() {
  var testData = {
    timestamp: new Date().toLocaleString('ja-JP'),
    title: 'テスト記事',
    tweetText: 'これはテスト投稿です #テスト',
    articleUrl: 'https://example.com/test',
    difficulty: 'beginner',
    tags: 'test, sample',
    posted: 'Test'
  };
  
  var e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  var result = doPost(e);
  console.log(result.getContent());
} 