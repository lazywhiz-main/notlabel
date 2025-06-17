/**
 * Google Apps Script: Webhook to Sheets (GAS対応版)
 * このスクリプトをそのままGoogle Apps Scriptにコピー&ペーストしてください
 */

// ========== 設定項目 ==========
// スプレッドシートのIDを設定（URLのd/xxxxx/editの部分）
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME = 'Twitter投稿リスト';

/**
 * POST リクエストを処理する関数
 * ボットからWebhookで呼び出される
 */
function doPost(e) {
  try {
    // リクエストボディの確認
    if (!e.postData || !e.postData.contents) {
      return createErrorResponse('POSTデータが見つかりません');
    }

    // JSONデータをパース
    var data = JSON.parse(e.postData.contents);
    
    // スプレッドシートを開く
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    }
    
    // データを追加
    addDataToSheet(sheet, data);
    
    // 成功レスポンス
    return createSuccessResponse('データが正常に追加されました', sheet.getLastRow());
      
  } catch (error) {
    // エラーレスポンス
    return createErrorResponse('エラー: ' + error.toString());
  }
}

/**
 * GET リクエストを処理する関数（接続テスト用）
 */
function doGet(e) {
  return createSuccessResponse('Webhook is working! Use POST method to add data.', null);
}

/**
 * ヘッダーを設定する関数
 */
function setupHeaders(sheet) {
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
  
  // ヘッダー行を設定
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

/**
 * データをシートに追加する関数
 */
function addDataToSheet(sheet, data) {
  var newRow = [
    data.timestamp || Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm'),
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
}

/**
 * 成功レスポンスを作成
 */
function createSuccessResponse(message, rowAdded) {
  var response = {
    status: 'success',
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (rowAdded !== null) {
    response.rowAdded = rowAdded;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * エラーレスポンスを作成
 */
function createErrorResponse(message) {
  var response = {
    status: 'error',
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 手動でテストデータを追加する関数（デバッグ用）
 * Google Apps Scriptエディタで実行してテストできます
 */
function testAddData() {
  var testData = {
    timestamp: Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd HH:mm'),
    title: 'テスト記事: がん研究の新たな発見',
    tweetText: '📄 新しい研究記事を公開しました\n\n🟡 テスト記事: がん研究の新たな発見\n\nこれはテスト投稿です。\n\n🔗 https://example.com/test\n\n#テスト #がん研究 #医療',
    articleUrl: 'https://example.com/test',
    difficulty: 'intermediate',
    tags: 'test, cancer-research',
    posted: 'Test'
  };
  
  var e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  var result = doPost(e);
  console.log('テスト結果:', result.getContent());
  
  // スプレッドシートのURLも表示
  console.log('スプレッドシートURL: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit');
}

/**
 * 設定確認用の関数
 * Google Apps Scriptエディタで実行して設定を確認できます
 */
function checkConfiguration() {
  console.log('=== 設定確認 ===');
  console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
  console.log('SHEET_NAME:', SHEET_NAME);
  
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.log('⚠️ SPREADSHEET_IDを実際のIDに変更してください');
    return;
  }
  
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ スプレッドシートにアクセス成功');
    console.log('スプレッドシート名:', spreadsheet.getName());
    console.log('URL: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit');
  } catch (error) {
    console.log('❌ スプレッドシートアクセスエラー:', error.toString());
  }
} 