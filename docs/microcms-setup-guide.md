# microCMS セットアップガイド

ME≠LABELサイトのmicroCMS設定手順を説明します。

## 必要なAPI

### 1. articles API（研究記事用）- 既存
すでに設定済みのResearch記事用APIです。

### 2. contents API（統合コンテンツ用）- 新規作成
Philosophy、Journal、Voicesの全コンテンツを管理する統合APIです。

## contents API の設定

### API作成手順

1. microCMSダッシュボードにログイン
2. 「API」→「新しいAPI」をクリック
3. API情報を入力：
   - **API名**: `contents`
   - **エンドポイント**: `contents`
   - **APIの種類**: リスト形式

### フィールド設定

以下のフィールドを順番に追加してください：

#### 基本情報
- **title** (テキストフィールド)
  - フィールドID: `title`
  - 表示名: `タイトル`
  - 必須: ✓

- **excerpt** (テキストエリア)
  - フィールドID: `excerpt`
  - 表示名: `要約・抜粋`
  - 必須: ✓

- **content** (リッチエディタ)
  - フィールドID: `content`
  - 表示名: `本文`
  - 必須: ✓

#### メタデータ
- **author** (テキストフィールド)
  - フィールドID: `author`
  - 表示名: `著者`
  - 必須: ✓

- **category** (セレクトフィールド)
  - フィールドID: `category`
  - 表示名: `カテゴリ`
  - 必須: ✓
  - 選択肢:
    - `philosophy` - Philosophy（哲学・思想）
    - `journal` - Journal（分析記事）
    - `voices` - Voices（体験談）

- **tags** (複数選択フィールド)
  - フィールドID: `tags`
  - 表示名: `タグ`
  - 選択肢（例）:
    - `医療人類学`
    - `インフォームドコンセント`
    - `患者体験`
    - `医療社会学`
    - `病院文化`
    - `医療コミュニケーション`
    - `病気の意味`
    - `医療の外`

#### システム
- **published_at** (日時フィールド)
  - フィールドID: `published_at`
  - 表示名: `公開日時`
  - 必須: ✓

- **slug** (テキストフィールド)
  - フィールドID: `slug`
  - 表示名: `スラッグ`
  - 必須: ✓
  - 説明: URL用の識別子（例: why-we-speak-outside-medicine）

## コンテンツ投稿手順

### 推奨投稿順序

1. **Philosophy記事** (2記事)
   - サイトの思想的基盤を確立
   - category: `philosophy`

2. **Journal記事** (2記事)
   - 分析的な内容でサイトの専門性を示す
   - category: `journal`

3. **Voices記事** (1記事)
   - 個人的体験で親しみやすさを提供
   - category: `voices`

### 各記事の設定例

#### Philosophy記事例
```
title: わたしたちは、なぜ"医療の外"を語るのか
excerpt: ME≠LABELが医療を「外」から見つめる理由と、その意義について考察します。
category: philosophy
author: ME≠LABEL編集部
tags: [医療の外, 医療人類学, 病気の意味]
slug: why-we-speak-outside-medicine
```

#### Journal記事例
```
title: 病院という"劇場"で演じられるもの
excerpt: 病院空間における役割演技と、そこで生まれる複雑な人間関係を分析します。
category: journal
author: ME≠LABEL編集部
tags: [病院文化, 医療社会学, 医療コミュニケーション]
slug: hospital-as-theater
```

#### Voices記事例
```
title: ラベルの向こう側で見つけたもの
excerpt: 診断名という「ラベル」を超えて見えてきた、病気と向き合う新しい視点。
category: voices
author: 患者の声
tags: [患者体験, 病気の意味]
slug: beyond-the-label
```

## 利点

### 統合API構造の利点
1. **管理の簡素化**: 1つのAPIで3つのカテゴリを管理
2. **一貫性**: 全コンテンツで統一されたフィールド構造
3. **柔軟性**: categoryフィールドで簡単に分類・フィルタリング
4. **効率性**: 単一のエンドポイントでの取得が可能
5. **シンプルさ**: 研究記事と異なり、難易度分けが不要

### 従来の分離API構造との比較
- ❌ 3つの別々のAPI (philosophy, journal, voices)
- ❌ 重複するフィールド定義
- ❌ 複数のエンドポイント管理
- ✅ 1つの統合API (contents)
- ✅ categoryフィールドでの分類
- ✅ 統一されたデータ構造

## 技術的な詳細

### API呼び出し例

```typescript
// 全コンテンツ取得
const allContent = await getContentArticles()

// カテゴリ別取得
const philosophy = await getContentArticles('philosophy')
const journal = await getContentArticles('journal')
const voices = await getContentArticles('voices')

// 個別記事取得
const article = await getContentBySlug('why-we-speak-outside-medicine')
```

### フィルタリング
microCMSのfiltersクエリを使用してカテゴリ別に取得：
```
filters: category[equals]philosophy
```

## トラブルシューティング

### よくある問題

1. **categoryフィールドが選択できない**
   - セレクトフィールドの選択肢が正しく設定されているか確認
   - 必須フィールドの設定を確認

2. **記事が表示されない**
   - published_atフィールドが設定されているか確認
   - slugフィールドが一意になっているか確認

3. **APIキーエラー**
   - .envファイルのMICROCMS_API_KEYが正しく設定されているか確認
   - microCMSダッシュボードでAPIキーの権限を確認

### サポート
問題が解決しない場合は、microCMSの公式ドキュメントを参照するか、開発チームにお問い合わせください。 