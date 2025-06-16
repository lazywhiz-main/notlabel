#!/bin/bash

# GitHub Actions 設定スクリプト
# このスクリプトはGitHub Actionsの設定を支援します

set -e

echo "🚀 GitHub Actions 設定スクリプト"
echo "================================"

# 色付きメッセージ関数
print_success() {
    echo -e "\033[32m✅ $1\033[0m"
}

print_warning() {
    echo -e "\033[33m⚠️  $1\033[0m"
}

print_error() {
    echo -e "\033[31m❌ $1\033[0m"
}

print_info() {
    echo -e "\033[34mℹ️  $1\033[0m"
}

# 必須ファイルの確認
echo ""
echo "📋 必須ファイルの確認..."

required_files=(
    ".github/workflows/daily-research-bot.yml"
    ".github/workflows/test-research-bot.yml"
    "src/bot/index.ts"
    "package.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file が存在します"
    else
        print_error "$file が見つかりません"
        exit 1
    fi
done

# package.json のスクリプト確認
echo ""
echo "📦 package.json スクリプトの確認..."

if grep -q '"bot":' package.json; then
    print_success "bot スクリプトが設定されています"
else
    print_error "bot スクリプトが見つかりません"
    echo "package.json に以下を追加してください:"
    echo '"bot": "tsx src/bot/index.ts",'
fi

if grep -q '"bot:debug":' package.json; then
    print_success "bot:debug スクリプトが設定されています"
else
    print_warning "bot:debug スクリプトを追加することをお勧めします"
    echo '"bot:debug": "tsx src/bot/index.ts --debug",'
fi

# 環境変数テンプレートの生成
echo ""
echo "🔧 環境変数テンプレートの生成..."

cat > .env.example << EOF
# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# microCMS API
MICROCMS_API_KEY=your-microcms-api-key
MICROCMS_SERVICE_DOMAIN=your-service-domain

# Twitter API (オプション)
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-access-token-secret

# サイト設定
SITE_URL=https://your-site.com

# Google Sheets Webhook (オプション)
WEBHOOK_URL=https://script.google.com/macros/s/your-webhook-id/exec
EOF

print_success ".env.example を生成しました"

# GitHub Secrets設定チェックリスト
echo ""
echo "📝 GitHub Secrets 設定チェックリスト"
echo "================================"

secrets=(
    "OPENAI_API_KEY:必須:OpenAI APIキー"
    "MICROCMS_API_KEY:必須:microCMS APIキー"
    "MICROCMS_SERVICE_DOMAIN:必須:microCMSサービスドメイン"
    "SITE_URL:必須:サイトURL"
    "TWITTER_API_KEY:オプション:Twitter APIキー"
    "TWITTER_API_SECRET:オプション:Twitter APIシークレット"
    "TWITTER_ACCESS_TOKEN:オプション:Twitter アクセストークン"
    "TWITTER_ACCESS_TOKEN_SECRET:オプション:Twitter アクセストークンシークレット"
    "WEBHOOK_URL:オプション:Google Sheets WebhookURL"
)

echo ""
echo "以下のSecretsをGitHubリポジトリに設定してください:"
echo "Settings > Secrets and variables > Actions"
echo ""

for secret in "${secrets[@]}"; do
    IFS=':' read -r name required description <<< "$secret"
    if [ "$required" = "必須" ]; then
        echo "🔴 $name ($description) - $required"
    else
        echo "🟡 $name ($description) - $required"
    fi
done

# 次のステップの案内
echo ""
echo "🎯 次のステップ"
echo "============="
echo ""
echo "1. GitHub Secretsを設定"
echo "   https://github.com/your-username/your-repo/settings/secrets/actions"
echo ""
echo "2. テスト実行"
echo "   Actions タブ > Test Research Bot > Run workflow"
echo ""
echo "3. 本番実行の確認"
echo "   Actions タブ > Daily Cancer Research Bot"
echo ""
echo "4. ログの確認方法"
echo "   実行後のArtifactsからログファイルをダウンロード"
echo ""

# 設定確認用のローカルテスト
echo "🧪 ローカル設定テスト"
echo "=================="
echo ""

if [ -f ".env" ]; then
    print_info ".env ファイルが存在します。ローカルテストを実行できます:"
    echo "npm run bot:debug"
else
    print_warning ".env ファイルが存在しません。"
    echo "ローカルテストを行う場合は .env.example をコピーして .env を作成し、"
    echo "実際のAPIキーを設定してください。"
fi

echo ""
echo "📚 詳細なドキュメント"
echo "=================="
echo "- docs/github-actions-setup.md"
echo "- docs/sns-post-templates.md"
echo "- docs/google-apps-script-setup.md"
echo ""

print_success "GitHub Actions 設定スクリプトが完了しました！"

echo ""
echo "🎉 おめでとうございます！"
echo "自動化されたがん研究論文収集・投稿システムの準備が整いました。"
echo "GitHub Secretsを設定後、テスト実行で動作確認を行ってください。" 