# Research ページ実装計画書

## 現状の課題と目標

### **現在の状態**
- 32件の研究記事が単純にリスト表示されている
- フィルタリング機能なし
- 検索機能なし
- 患者・家族が関連する研究を見つけにくい

### **目標**
患者・家族が自分に関連する研究を効率的に見つけ、主治医との相談材料として活用できるページにする

---

## Phase 1: 基本的な検索性向上（最優先）

### **実装期間**: 1-2週間
### **目標**: 利用者が記事を見つけやすくする

### **1.1 記事カードの改善**
#### **現在の問題**
- タイトルのみの表示で内容が分からない
- 研究の重要ポイントが見えない

#### **実装内容**
```typescript
interface ArticleCard {
  title: string;
  summary: string; // AI要約の抜粋（100文字程度）
  tags: string[]; // がん種、治療法などのタグ
  publishedDate: string;
  category: 'treatment_outcome' | 'quality_of_life' | 'new_approach';
  availability: 'japan_available' | 'clinical_trial' | 'research_stage';
}
```

#### **具体的タスク**
1. `ResearchCard` コンポーネントの作成
2. 記事データへのタグ付けロジック追加
3. カテゴリ分類ロジックの実装
4. レスポンシブデザインの適用

### **1.2 基本的なフィルター機能**
#### **実装するフィルター**
1. **がん種別** (必須)
   - 乳がん、肺がん、大腸がん、胃がんなど
   - AI要約から自動抽出

2. **研究成果別** (必須)
   - 生存期間延長
   - 副作用軽減
   - QOL向上
   - 新治療法

3. **発表時期別** (必須)
   - 最新6ヶ月
   - 最新1年
   - 最新2年

#### **具体的タスク**
1. フィルターコンポーネントの作成
2. 記事データの自動タグ付け機能
3. フィルター状態管理（URLパラメータ対応）
4. フィルター結果のリアルタイム表示

### **1.3 基本的な検索機能**
#### **実装内容**
- キーワード検索（タイトル・要約対象）
- 日本語対応（ひらがな・カタカナ・漢字）
- 検索サジェスト機能

#### **具体的タスク**
1. 検索APIエンドポイントの作成
2. 検索結果ハイライト機能
3. 検索履歴の保存（ローカルストレージ）
4. よく検索される単語の分析

---

## Phase 2: ユーザビリティ向上（中期）

### **実装期間**: 2-3週間
### **目標**: より使いやすく、理解しやすいインターフェース

### **2.1 ガイド式エントリーポイント**
#### **実装内容**
```jsx
// トップセクション
<GuidedEntry>
  <WelcomeMessage>
    あなたに関連する研究を見つけましょう
  </WelcomeMessage>
  
  <QuickNavigation>
    <NavButton icon="🎯" onClick={filterByCancer}>
      がん種から探す
    </NavButton>
    <NavButton icon="💊" onClick={filterByTreatment}>
      治療方法から探す
    </NavButton>
    <NavButton icon="📅" onClick={filterByRecent}>
      最新の研究から探す
    </NavButton>
  </QuickNavigation>
</GuidedEntry>
```

### **2.2 記事詳細ページの充実**
#### **追加要素**
1. **研究概要ボックス**
   - 対象患者
   - 研究方法
   - 主な結果
   - 実用性レベル

2. **主治医相談ポイント**
   - 具体的な質問例
   - 注意点

3. **関連記事の表示**
   - 同じがん種の研究
   - 同じ治療法の研究

### **2.3 用語解説機能**
#### **実装内容**
- 医療用語のツールチップ表示
- 専門用語の平易な説明
- 読み方の提供

---

## Phase 3: 高度な機能（長期）

### **実装期間**: 3-4週間
### **目標**: 個人化された情報提供

### **3.1 個人化推奨機能**
- ユーザーの閲覧履歴に基づく推奨
- 類似ケースの研究提案

### **3.2 アクセシビリティ強化**
- 音声読み上げ対応
- 視覚障害者向け最適化
- 高齢者向けUI調整

### **3.3 外部連携**
- 病院情報との連携
- 患者会情報の表示
- セカンドオピニオン外来の紹介

---

## 技術実装詳細（Phase 1）

### **1. データ構造の拡張**

#### **現在の記事データ**
```typescript
interface ResearchArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  published_at: string;
}
```

#### **拡張後のデータ構造**
```typescript
interface EnhancedResearchArticle extends ResearchArticle {
  // 自動抽出されるメタデータ
  extracted_tags: {
    cancer_types: string[];
    treatment_methods: string[];
    outcomes: string[];
    keywords: string[];
  };
  
  // 分類情報
  categories: {
    primary: 'treatment_outcome' | 'quality_of_life' | 'new_approach';
    secondary: string[];
  };
  
  // 実用性評価
  availability: {
    status: 'japan_available' | 'clinical_trial' | 'research_stage';
    note: string;
  };
  
  // SEO用
  meta: {
    excerpt: string; // 100文字程度の要約
    reading_time: number;
  };
}
```

### **2. 自動タグ抽出ロジック**

```typescript
// utils/articleTagExtractor.ts
export function extractTags(content: string): ExtractedTags {
  const cancerTypes = extractCancerTypes(content);
  const treatments = extractTreatments(content);
  const outcomes = extractOutcomes(content);
  
  return {
    cancer_types: cancerTypes,
    treatment_methods: treatments,
    outcomes: outcomes,
    keywords: [...cancerTypes, ...treatments, ...outcomes]
  };
}

function extractCancerTypes(content: string): string[] {
  const patterns = [
    /乳がん|乳癌/g,
    /肺がん|肺癌/g,
    /大腸がん|大腸癌/g,
    /胃がん|胃癌/g,
    // ... その他のパターン
  ];
  
  // 実装詳細
}
```

### **3. フィルターコンポーネント**

```tsx
// components/ResearchFilter.tsx
interface FilterState {
  cancerTypes: string[];
  outcomes: string[];
  timeRange: string;
  searchQuery: string;
}

export function ResearchFilter({ 
  onFilterChange 
}: { 
  onFilterChange: (filters: FilterState) => void 
}) {
  const [filters, setFilters] = useState<FilterState>({
    cancerTypes: [],
    outcomes: [],
    timeRange: 'all',
    searchQuery: ''
  });

  // 実装詳細
  
  return (
    <FilterContainer>
      <SearchBox />
      <CancerTypeFilter />
      <OutcomeFilter />
      <TimeRangeFilter />
    </FilterContainer>
  );
}
```

### **4. 検索機能の実装**

```typescript
// lib/searchEngine.ts
export function searchArticles(
  articles: EnhancedResearchArticle[],
  query: string,
  filters: FilterState
): EnhancedResearchArticle[] {
  
  let results = articles;
  
  // テキスト検索
  if (query) {
    results = results.filter(article => 
      article.title.includes(query) ||
      article.summary.includes(query) ||
      article.extracted_tags.keywords.some(tag => 
        tag.includes(query)
      )
    );
  }
  
  // フィルター適用
  if (filters.cancerTypes.length > 0) {
    results = results.filter(article =>
      filters.cancerTypes.some(type =>
        article.extracted_tags.cancer_types.includes(type)
      )
    );
  }
  
  return results;
}
```

---

## 実装スケジュール

### **Week 1: データ構造とタグ抽出**
- [ ] データ構造の設計・実装
- [ ] 自動タグ抽出ロジック開発
- [ ] 既存32記事へのタグ付け実行
- [ ] テストデータの準備

### **Week 2: UI コンポーネント開発**
- [ ] ResearchCard コンポーネント
- [ ] FilterComponent 実装
- [ ] SearchBox コンポーネント
- [ ] レスポンシブデザイン調整

### **Week 3: 統合とテスト**
- [ ] フィルター機能の統合
- [ ] 検索機能の統合
- [ ] パフォーマンス最適化
- [ ] ユーザビリティテスト

---

## 成功指標

### **定量的指標**
- ページ滞在時間の増加（現在の2倍以上）
- 記事詳細ページへの遷移率向上（現在の3倍以上）
- 検索機能の利用率（30%以上のユーザーが使用）

### **定性的指標**
- ユーザーが「関連する研究を見つけやすくなった」と感じる
- 主治医への相談材料として活用される

---

この計画で Phase 1 を実装すれば、現在の「ただの記事リスト」から「使える研究検索ツール」に大きく進化できます！💪 