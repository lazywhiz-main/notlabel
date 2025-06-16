# ME≠LABEL サンプル記事リスト

このフォルダには、ME≠LABELプロジェクトで使用されているサンプル記事のコンテンツが含まれています。
将来の動的ページ作成時の参考資料として活用してください。

## ファイル構成

- `journal-articles.md` - JOURNALカテゴリーのサンプル記事
- `philosophy-essays.md` - PHILOSOPHYカテゴリーのサンプル記事  
- `voices-stories.md` - VOICESカテゴリーのサンプル記事
- `editorial-content.md` - トップページなどの編集部コンテンツ

## 使用方法

これらのマークダウンファイルは、将来のCMS導入やデータベース設計時の参考資料として活用できます。
記事の構造、カテゴリー分類、文体の参考にしてください。

## コンテンツの特徴

- **医療の外からの視点**: 医療制度の枠組みを相対化した内容
- **当事者性**: 病気や障害を持つ人の生の声
- **社会批判**: ラベリングの構造に対する問題提起
- **哲学的思考**: 深い問いかけと対話への誘い

## 🤖 AI論文要約Bot

プロジェクトには、PubMedからがん関連論文を自動取得し、GPTで評価・要約してmicroCMSに投稿するBotが実装されています。

### 🚀 Bot実行方法

```bash
# テスト実行（モックデータ使用、OpenAI APIのみ使用）
npm run bot:test

# 本番実行（PubMed + OpenAI + microCMS API使用）
npm run bot

# 開発モード（ファイル変更を監視）
npm run bot:dev
```

### 🔐 環境変数設定

以下の環境変数を`.env`ファイルに設定してください：

```env
# OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# microCMS設定
MICROCMS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# microCMSのサービスドメイン（例：notlabel.microcms.io の場合は "notlabel"）
MICROCMS_SERVICE_DOMAIN=notlabel
```

### 📋 実装詳細

- **PubMed API**: がん関連論文の自動取得
- **OpenAI GPT-4o**: 論文評価とMarkdown記事生成
- **microCMS API**: 自動記事投稿
- **評価システム**: 5点満点スコアと配信判定
- **重複チェック**: 既存記事の重複投稿防止

詳細は `implement_plan.md` と `bot_prompts.md` を参照してください。 