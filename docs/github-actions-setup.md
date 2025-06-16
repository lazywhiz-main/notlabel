# GitHub Actions 設定ガイド

このガイドでは、がん研究論文の自動収集・投稿システムをGitHub Actionsで設定する方法を説明します。

## 📋 概要

**自動化される処理**:
1. 毎日午前9時（JST）にPubMedから最新論文を取得
2. GPTによる論文評価・フィルタリング
3. 高品質論文のmicroCMS記事作成
4. Twitter自動投稿（またはGoogle Sheets保存）

## 🔧 初期設定

### 1. GitHub Secretsの設定

GitHubリポジトリの `Settings` > `Secrets and variables` > `Actions` で以下のシークレットを設定してください：

#### 🤖 OpenAI API
```
OPENAI_API_KEY=sk-your-openai-api-key
```

#### 📝 microCMS API
```
MICROCMS_API_KEY=your-microcms-api-key
MICROCMS_SERVICE_DOMAIN=your-service-domain
```

#### 🐦 Twitter API (オプション)
```
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-access-token-secret
```

#### 🌐 サイト設定
```
SITE_URL=https://your-site.com
```

#### ⚙️ Bot設定 (オプション)
```
SCORE_THRESHOLD=4.5
```
**説明**: 記事投稿の最低スコア閾値
- デフォルト: 4.5（厳格な品質基準）
- 推奨範囲: 4.0-5.0
- 低く設定 → より多くの記事が投稿
- 高く設定 → より厳選された記事のみ投稿

#### 📊 Google Sheets Webhook (オプション)
```
WEBHOOK_URL=https://script.google.com/macros/s/your-webhook-id/exec
```

### 2. ワークフローファイルの確認

`.github/workflows/daily-research-bot.yml` が正しく配置されていることを確認してください。

## ⚙️ Secretsの詳細設定

### OpenAI API Key 取得方法

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. `API keys` ページで新しいキーを作成
3. `sk-` で始まるキーをコピー

### microCMS API設定

1. [microCMS](https://microcms.io/) にログイン
2. プロジェクト設定 > API設定 でAPIキーを確認
3. サービスドメインは `your-service.microcms.io` の `your-service` 部分

### Twitter API設定（オプション）

1. [Twitter Developer Portal](https://developer.twitter.com/) でアプリケーション作成
2. Keys and Tokens タブで必要な情報を取得
3. **重要**: App permissions を「Read and Write」に設定

### Google Sheets Webhook設定（オプション）

1. [Google Apps Script設定ガイド](./google-apps-script-setup.md) を参照
2. デプロイしたWebアプリのURLを使用

## 🚀 実行スケジュール

### 自動実行
- **毎日午前9時（JST）** に自動実行
- Cronスケジュール: `0 0 * * *` (UTC時間)

### 手動実行
1. GitHubリポジトリの `Actions` タブに移動
2. `Daily Cancer Research Bot` ワークフローを選択
3. `Run workflow` をクリック
4. オプションで「デバッグモード」を有効化可能

## 📊 実行結果の確認

### GitHub Actions UI
1. `Actions` タブで実行履歴を確認
2. 各ステップの詳細ログを表示
3. エラーがある場合は赤いマークで表示

### ログファイル
- 実行後にログファイルがArtifactとして保存される
- 7日間保持される
- デバッグに有用な詳細情報を含む

## 🐛 トラブルシューティング

### よくある問題

#### 1. Secrets設定エラー
```
Error: Missing required environment variable
```
**解決方法**: GitHub Secretsの設定を再確認

#### 2. API制限エラー
```
Error: Rate limit exceeded
```
**解決方法**: 
- OpenAI: 使用量プランを確認
- Twitter: API使用制限を確認

#### 3. 権限エラー
```
Error: Forbidden
```
**解決方法**:
- Twitter: App permissions を確認
- microCMS: APIキーの権限を確認

### デバッグモード

詳細なログ出力でトラブルシューティング：

```bash
# ローカルでのデバッグ
npm run bot:debug

# GitHub Actions でのデバッグ
# 手動実行時に「デバッグモード」をONにする
```

## 📈 監視とメンテナンス

### 定期確認項目

1. **実行状況の確認** (週1回)
   - GitHub Actions の実行履歴
   - エラーログの有無

2. **API使用量の確認** (月1回)
   - OpenAI API使用量
   - Twitter API使用制限

3. **記事品質の確認** (週1回)
   - 生成された記事の内容
   - 投稿されたSNSコンテンツ

### アラート設定

GitHub Actions の失敗時にメール通知を受け取る設定：

1. GitHub設定 > Notifications
2. Actions で失敗時の通知を有効化

## 🔄 設定変更

### スケジュール変更

`.github/workflows/daily-research-bot.yml` の cron 設定を変更：

```yaml
schedule:
  # 毎日午後2時（JST）に変更する場合
  - cron: '0 5 * * *'  # UTC 5時 = JST 14時
```

### 処理内容の変更

#### スコア閾値の調整

GitHub Secrets で `SCORE_THRESHOLD` を設定：

```
SCORE_THRESHOLD=4.0  # より多くの記事を投稿
SCORE_THRESHOLD=4.5  # デフォルト（厳格な品質基準）
SCORE_THRESHOLD=5.0  # 最高品質のみ投稿
```

#### その他のカスタマイズ

`src/bot/index.ts` を編集して処理ロジックを調整

## 💡 最適化のヒント

### パフォーマンス向上
- 並列処理の活用
- API呼び出し回数の最適化
- キャッシュの活用

### コスト削減
- OpenAI API の使用量監視
- 不要な実行の回避
- 効率的なプロンプト設計

### 品質向上
- GPT評価基準の調整
- テンプレートの改善
- ユーザーフィードバックの反映

## 📚 関連ドキュメント

- [SNS投稿文テンプレート](./sns-post-templates.md)
- [Google Apps Script設定](./google-apps-script-setup.md)
- [ボットシステム概要](./bot-system-overview.md)

## 🆘 サポート

問題が発生した場合：

1. GitHub Issues で報告
2. ログファイルを添付
3. 再現手順を記載

これで完全自動化されたがん研究論文収集・投稿システムが稼働開始です！🎉 