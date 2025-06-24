# GitHub Secrets設定トラブルシューティング

## 問題：「Successfully completed」だが環境変数が「未設定」と表示される

### 原因
GitHub ActionsでSecretsが正しく読み込まれていない。主な原因：
1. **環境設定の不一致**
2. **Repository vs Environment Secretsの混同**
3. **変数名の大文字小文字間違い**

## 解決手順

### 1. GitHub Secretsの設定場所を確認

#### Option A: Repository Secrets (推奨)
```
リポジトリ → Settings → Secrets and variables → Actions → Repository secrets
```

#### Option B: Environment Secrets
```
リポジトリ → Settings → Secrets and variables → Actions → Environment secrets
```

### 2. 必要なSecrets一覧

#### 必須項目
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
MICROCMS_API_KEY=xxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=notlabel
SITE_URL=https://no-label.me/
```

#### オプション項目
```
TWITTER_API_KEY=xxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxxx
TWITTER_ACCESS_TOKEN_SECRET=xxxxxxxxxx
WEBHOOK_SHEETS_URL=https://script.google.com/macros/s/xxxxxxxxxx/exec
SCORE_THRESHOLD=4.0
```

### 3. 設定確認方法

1. **Repository Secretsで設定する場合**:
   - ワークフローファイルから `environment: production` 行を削除
   
2. **Environment Secretsで設定する場合**:
   - ワークフローファイルに `environment: production` 行を保持
   - GitHubで「production」環境を作成
   - 各Secretsを「production」環境に設定

### 4. テスト実行手順

1. GitHub リポジトリの「Actions」タブを開く
2. 「Test Bot Execution」を選択
3. 「Run workflow」をクリック
4. `test_mode: env_check` を選択して実行
5. ログで環境変数が「✅ 設定済み」になるまで調整

### 5. よくある間違い

#### 変数名の間違い
```
❌ OPENAI_API_KEY（全角スペース含む）
✅ OPENAI_API_KEY

❌ openai_api_key（小文字）
✅ OPENAI_API_KEY（大文字）
```

#### ドメイン設定の間違い
```
❌ MICROCMS_SERVICE_DOMAIN=https://notlabel.microcms.io
✅ MICROCMS_SERVICE_DOMAIN=notlabel

❌ SITE_URL=no-label.me
✅ SITE_URL=https://no-label.me/
```

### 6. 最終確認

環境変数が正しく設定されると、テスト実行で以下のような出力になります：

```
✅ OPENAI_API_KEY 設定済み (長さ: 56文字)
✅ MICROCMS_API_KEY 設定済み
✅ MICROCMS_SERVICE_DOMAIN 設定済み (notlabel)
✅ SITE_URL 設定済み (https://no-label.me/)
``` 