This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🤖 AI論文要約Bot

このプロジェクトには、PubMedからがん関連論文を自動取得し、GPTで評価・要約してmicroCMSに投稿し、SNSに自動投稿するBotが実装されています。

### 🚀 Bot実行方法

```bash
# テスト実行（モックデータ使用、OpenAI APIのみ使用）
npm run bot:test

# 本番実行（PubMed + OpenAI + microCMS + SNS API使用）
npm run bot

# 開発モード（ファイル変更を監視）
npm run bot:dev

# プロダクション実行（GitHub Actions用）
npm run bot:production
```

### 🔐 環境変数設定

以下の環境変数を`.env`ファイルに設定してください：

```env
# OpenAI API設定
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# microCMS設定
MICROCMS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=notlabel

# X (Twitter) API設定（SNS投稿機能を使用する場合）
TWITTER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWITTER_ACCESS_TOKEN_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# サイトURL（SNS投稿時のリンク生成用）
SITE_URL=https://your-site.com
```

### ⏰ 定期実行の設定

#### GitHub Actions（推奨）

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. 上記の環境変数を「Repository secrets」として追加
3. `.github/workflows/daily-bot.yml`が自動的に毎日日本時間9:00に実行されます

#### 手動実行

GitHub Actionsページから「Daily Research Bot」→「Run workflow」で手動実行も可能です。

### 📱 SNS投稿機能

- **対応SNS**: X (Twitter)
- **投稿内容**: 記事タイトル、要約、サイトURL、ハッシュタグ
- **制限**: 280文字以内に自動調整
- **投稿タイミング**: microCMSへの記事投稿完了後に自動実行

### 📋 機能詳細

- **PubMed API**: がん関連論文の自動取得（過去3日分）
- **OpenAI GPT-4o**: 論文評価（5点満点）とMarkdown記事生成
- **microCMS API**: 自動記事投稿（全フィールド対応）
- **SNS API**: 記事公開と同時にSNS投稿
- **重複チェック**: 既存記事の重複投稿防止
- **エラーハンドリング**: SNS投稿失敗でもBot処理は継続

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
