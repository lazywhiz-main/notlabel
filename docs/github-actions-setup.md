# GitHub Actions ボット自動実行設定ガイド

## 1. GitHub Secrets の設定

### 必須環境変数

GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」で以下を設定：

#### 基本設定
- `OPENAI_API_KEY`: OpenAI APIキー
- `MICROCMS_API_KEY`: microCMS APIキー
- `MICROCMS_SERVICE_DOMAIN`: microCMSサービスドメイン（例: your-service.microcms.io）
- `SITE_URL`: サイトURL（例: https://your-site.com）

#### SNS投稿設定（オプション）
- `TWITTER_API_KEY`: Twitter API Key
- `TWITTER_API_SECRET`: Twitter API Secret
- `TWITTER_ACCESS_TOKEN`: Twitter Access Token
- `TWITTER_ACCESS_TOKEN_SECRET`: Twitter Access Token Secret
- `WEBHOOK_SHEETS_URL`: Webhook Sheets URL（代替SNS投稿方法）

#### その他の設定
- `SCORE_THRESHOLD`: スコア閾値（デフォルト: 4.0）

## 2. ワークフローファイルの説明

### daily-research-bot.yml
- **実行時間**: 毎日午前6時（JST）= UTC 21時
- **機能**: 本番用の自動実行
- **手動実行**: 可能（デバッグモード、ドライランモード選択可）

### test-bot-execution.yml
- **実行**: 手動実行のみ
- **テストモード**:
  - `env_check`: 環境変数の確認のみ
  - `mock_run`: テスト実行（実際の投稿なし）
  - `real_run`: 本番実行（実際に投稿される）

## 3. テスト手順

### ステップ1: 環境変数チェック
1. GitHubリポジトリの「Actions」タブを開く
2. 「Test Bot Execution」ワークフローを選択
3. 「Run workflow」をクリック
4. `test_mode` を `env_check` に設定して実行
5. ログで環境変数が正しく設定されているか確認

### ステップ2: モック実行テスト
1. `test_mode` を `mock_run` に設定して実行
2. ボットの動作ログを確認
3. エラーがないか確認

### ステップ3: 本番テスト実行
1. `test_mode` を `real_run` に設定して実行
2. 実際にmicroCMSに記事が投稿されることを確認
3. 投稿内容の品質を確認

### ステップ4: 自動実行の有効化
- `daily-research-bot.yml` ワークフローが毎日自動実行されることを確認

## 4. トラブルシューティング

### よくある問題と解決方法

#### 「Successfully completed」だが記事が投稿されない
1. **環境変数チェック**: テストワークフローの `env_check` で設定確認
2. **APIキーの有効性**: OpenAI、microCMSのAPIキーが有効か確認
3. **権限設定**: microCMS APIキーに記事投稿権限があるか確認
4. **実行ログ確認**: Artifactからダウンロードできる詳細ログを確認

#### GitHub Actions実行時のエラー
```bash
# ローカルでの事前テスト
npm run bot:test

# 環境変数の確認
echo $OPENAI_API_KEY | wc -c  # 文字数確認
```

#### API制限エラー
- OpenAI API: レート制限を確認
- PubMed API: 1秒間に3リクエスト以下に制限
- microCMS API: プランの制限を確認

## 5. ログの確認方法

### GitHub Actionsログ
1. リポジトリの「Actions」タブ
2. 該当するワークフロー実行を選択
3. 各ステップのログを確認

### Artifactダウンロード
1. ワークフロー実行ページの下部「Artifacts」セクション
2. `bot-execution-logs-XXX` をダウンロード
3. 詳細な実行ログを確認

## 6. 本番運用時の監視

### 推奨監視項目
- [ ] 毎日の実行ステータス
- [ ] 取得論文数の推移
- [ ] 投稿記事数の推移
- [ ] エラー発生状況
- [ ] API使用量（OpenAI、microCMS）

### アラート設定
GitHub Actionsの失敗時にメール通知を受け取るよう設定することを推奨。

## 7. コスト管理

### OpenAI API コスト見積もり
- 50論文/日 × $0.05/論文 = $2.50/日
- 月額コスト: 約$75
- 年額コスト: 約$900

### 運用コスト削減策
- `SCORE_THRESHOLD` を上げる（高品質な記事のみ投稿）
- PubMed取得件数を調整（現在50件/日）
- 週末の実行を停止

## 8. セキュリティ

### APIキー管理
- [ ] GitHub Secretsに保存（リポジトリメンバーも見ることができない）
- [ ] 定期的なAPIキーのローテーション
- [ ] 不要な権限の削除

### アクセス制御
- [ ] リポジトリアクセス権限の定期見直し
- [ ] Actionsの実行権限設定 