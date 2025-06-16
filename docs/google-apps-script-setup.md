# Google Apps Script Webhook 設定手順

組織のGoogle Cloud Consoleでサービスアカウントキーが作成できない場合の代替案として、Google Apps Scriptを使ったWebhook方式を使用します。

## 📋 設定手順

### 1. Google Sheetsの作成

1. **Google Sheets** (https://sheets.google.com/) を開く
2. 新しいスプレッドシートを作成
3. スプレッドシート名を「notlabel-twitter-posts」に変更
4. **URLからスプレッドシートIDを取得**
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
   この`[SPREADSHEET_ID]`部分をコピー

### 2. Google Apps Scriptの設定

1. **Google Apps Script** (https://script.google.com/) を開く
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「notlabel-webhook」に変更
4. `Code.gs`ファイルの内容を全て削除
5. **`google-apps-script/gas-ready-webhook.js`の内容をそのままコピー&ペースト**
6. **9行目の`SPREADSHEET_ID`を実際のIDに変更**
   ```javascript
   var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // ← ここを変更
   ```
7. **設定確認**: 「実行」→「checkConfiguration」を実行して設定を確認

### 3. Webhookとしてデプロイ

1. 「デプロイ」→「新しいデプロイ」をクリック
2. 「種類を選択」→「ウェブアプリ」を選択
3. 設定項目：
   - **説明**: notlabel webhook
   - **次のユーザーとして実行**: 自分（your-email@gmail.com）
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. **権限の承認**が求められた場合：
   - 「権限を確認」をクリック
   - Googleアカウントでログイン
   - 「詳細」→「notlabel-webhook（安全ではないページ）に移動」
   - 「許可」をクリック
6. **WebアプリのURL**をコピー
   ```
   https://script.google.com/macros/s/[SCRIPT_ID]/exec
   ```

### 4. 環境変数の設定

`.env`ファイルに以下を追加：

```bash
# Webhook Sheets設定
WEBHOOK_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
SITE_URL=https://your-domain.com
```

### 5. 動作テスト

**Google Apps Script側でのテスト:**
1. Google Apps Scriptエディタで「実行」→「testAddData」を実行
2. 権限の許可を求められた場合は承認
3. スプレッドシートにテストデータが追加されることを確認

**ボット側でのテスト:**
```bash
npx tsx src/bot/test-webhook.ts
```

## 🔧 トラブルシューティング

### スクリプトの権限エラー
- Google Apps Scriptで「実行」→「testAddData」を実行
- 権限の承認を行う

### Webhookが403エラー
- デプロイ設定で「アクセスできるユーザー」が「全員」になっているか確認
- 新しいデプロイを作成してみる

### スプレッドシートにデータが追加されない
- スプレッドシートIDが正しいか確認
- Google Apps Scriptのログを確認（「実行数」→「ログを表示」）

## 📊 スプレッドシートの構造

自動的に以下の列が作成されます：

| 列 | 内容 | 説明 |
|---|---|---|
| A | 日時 | 投稿生成日時 |
| B | 記事タイトル | microCMSの記事タイトル |
| C | ツイート文 | 実際の投稿文（280文字以内） |
| D | 記事URL | 記事へのリンク |
| E | 難易度 | beginner/intermediate/advanced |
| F | タグ | 記事のタグ |
| G | 投稿済み | 手動投稿後に「Yes」に変更 |
| H | メモ | 自由記入欄 |

## 🚀 使用方法

1. ボットが自動実行される
2. 新しい記事がスプレッドシートに追加される
3. スプレッドシートで内容を確認
4. 手動でTwitter/Xに投稿
5. 「投稿済み」列を「Yes」に変更

これで、サービスアカウントキーを使わずにGoogle Sheetsへの投稿が可能になります！ 