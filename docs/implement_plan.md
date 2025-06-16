# ⚙️ がん論文要約Bot 実装指示書

このプロジェクトでは、PubMedのがん関連論文を毎日取得し、GPTを活用してスコアリング・要約・記事生成を行い、microCMSにWeb記事として投稿するBotを構築します。

---

## 🎯 プロジェクト目的

- がん患者さんやその家族にとって「有益な情報となる」臨床研究を見つけ出し
- 専門性を保ちながらも平易な日本語で記事化し
- 自動で記事配信できる仕組みを構築する

---

## 🔁 処理の流れ

1. **PubMed API**を使用し、過去1〜3日分のがん関連論文（Title + Abstract）を取得
2. 各論文を**GPT API**に渡し、以下を出力：
   - スコア（0.0〜5.0）
   - 要約
   - わかりやすいタイトル（title_simplified）
   - 配信の可否（shouldPublish）
   - キーワードリスト
3. `score >= 4.0` かつ `shouldPublish == true` の論文を対象に、
4. GPTに再依頼し、**Markdown形式のWeb記事本文**を生成
5. **microCMS API**を使って `articles` モデルに投稿する

---

## 🧠 GPTの役割とプロンプト

プロンプト定義は `bot_prompts.md` にまとめてあります。

- ステップ①：論文のスコア評価・title・summary・keywords の抽出
- ステップ②：Markdown記事本文の生成（記事テンプレートあり）

---

## 📦 投稿先：microCMS `articles` モデル構成（フィールド仕様）

| フィールド名     | 型        | 内容                                      |
|------------------|-----------|-------------------------------------------|
| title            | text      | GPTで平易に言い換えたタイトル            |
| summary          | text      | 一言で要約                                |
| body             | markdown  | 本文（GPTでMarkdown形式出力）           |
| tags             | text[]    | キーワード（GPTが抽出）                 |
| original_url     | text      | PubMedの論文URL                          |
| posted_at        | datetime  | 投稿日                                   |
| slug             | text      | タイトルから自動生成                     |

---

## 🛠 技術スタック・ライブラリ

- Node.js / TypeScript
- axios（API通信）
- dotenv（環境変数管理）
- openai（GPT API）
- date-fns（日付処理）
- fetch API or axios（microCMS POST）

---

## 🔐 .env 設定（ローカル開発用）

`.env.example` も用意してください。

```
# OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# microCMS設定  
MICROCMS_API_KEY=xxxxxxxxxxxxxxxx
# microCMSのサービスドメイン（例：notlabel.microcms.io の場合は "notlabel"）
MICROCMS_SERVICE_DOMAIN=notlabel
```

---

## ⏱ 運用想定

- **実行頻度**：1日1回（cron実行 or CLIからの呼び出しを想定）
- **記事数制限**：スコアの高い上位3件まで投稿（絞り込み処理も含めて）
- **実行コマンド例**：

```bash
npm install
node src/index.ts
```

---

## ✅ 実装スコープ（MVP）

- PubMed → GPT評価 → Markdown生成 → microCMS投稿までの一連自動処理
- ファイル構成やAPI設計はCursorが柔軟に最適化してよし

---

## ✍️ 補足方針（開発者への共有）

- Botは「信頼できる情報を届けるメディア」として正確性と平易さの両立を大切にする
- GPTの出力はそのまま記事になるため、誤解を招くような要約や過剰な期待表現は避けるようプロンプト設計に反映済み
- 今後タグ別の配信・検索機能を追加予定だが、現時点では記事投稿までにフォーカスする

---