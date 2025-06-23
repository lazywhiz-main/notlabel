# Research ページ安全実装戦略

## 🔍 現在の状況分析

### **ボット運用の現状**
- **エンドポイント**: `articles` (microCMS)
- **投稿頻度**: 毎日 6:00 自動実行
- **データ構造**: 32記事が正常運用中
- **重要**: ボットは止めてはならない🚫

### **Phase 1改善に必要な新フィールド**
改善提案で必要なフィールド vs 現在のスキーマ：

```typescript
// 現在のResearchArticle（既存）
interface ResearchArticle {
  // 既存フィールド ✅
  id, title, summary, body, tags
  difficulty, research_type, original_title
  original_url, pubmed_id, journal, publish_date
  ai_generated, ai_generated_at, read_time, slug
  
  // ❌ Phase 1で必要だが不足しているフィールド
  cancer_types?: string[]          // がん種分類
  treatment_outcomes?: string[]    // 治療成果分類 
  research_stage?: string         // 研究段階
  japan_availability?: string     // 日本での利用可能性
  patient_demographics?: string[] // 対象患者層
  study_design?: string          // 研究デザイン
}
```

## 🛡️ 安全実装戦略

### **戦略1: 既存スキーマを活用した段階的拡張**

#### **Step 1: 既存データの活用最大化**
現在のフィールドから最大限の情報を抽出：

```typescript
// 既存フィールドからの情報抽出
interface ExtractedMetadata {
  // tagsから抽出
  cancer_types: string[]     // "乳がん", "肺がん" など
  keywords: string[]         // その他のキーワード
  
  // research_typeの詳細化
  study_category: string     // "治療効果", "QOL改善" など
  
  // difficultyの活用
  complexity_level: string   // 既存のbeginner/intermediate/advanced
  
  // 新規計算フィールド
  relevance_score: number    // 関連度スコア（自動計算）
  recency_score: number      // 新しさスコア（publish_dateから）
}
```

#### **Step 2: 非破壊的フィールド追加**
microCMS側でオプショナルフィールドを追加：

```typescript
// microCMS新フィールド（全てoptional）
interface ResearchArticleExtended extends ResearchArticle {
  // フィルタリング用
  cancer_types?: string[]          // 複数選択
  treatment_outcomes?: string[]    // 複数選択
  research_stage?: string         // 選択肢
  japan_availability?: string     // 選択肢
  
  // 検索用
  patient_keywords?: string[]     // 患者向けキーワード
  medical_keywords?: string[]     // 医学用語
  
  // UI表示用
  key_findings?: string          // 重要な発見（要約）
  clinical_significance?: string  // 臨床的意義
}
```

### **戦略2: ボット影響を最小化する実装順序**

#### **Phase A: フロントエンド優先実装（ボット無変更）**
1. **データ抽出ロジック追加**
   - 既存の32記事から情報を自動抽出
   - フロントエンドで動的分類
   - microCMS変更なし

2. **UI改善実装**
   - フィルター機能（抽出データ使用）
   - 検索機能（既存title, summary, tags使用）
   - カード表示改善

#### **Phase B: バックエンド拡張（ボット段階的更新）**
1. **microCMSスキーマ拡張**
   - 新フィールド追加（optional）
   - 既存記事は影響なし

2. **ボット更新**
   - 新フィールドの自動生成ロジック追加
   - 既存フィールドは維持

### **戦略3: データ構造の段階的設計**

#### **Level 1: 既存データ活用（即実装可能）**
```typescript
// 自動抽出関数
function extractMetadataFromExisting(article: ResearchArticle) {
  return {
    // tagsから抽出
    cancer_types: extractCancerTypes(article.tags),
    treatment_methods: extractTreatmentMethods(article.tags),
    
    // summaryから抽出
    study_type: classifyStudyType(article.summary),
    patient_outcome: extractOutcomes(article.summary),
    
    // 計算フィールド
    recency_score: calculateRecency(article.publish_date),
    relevance_tags: generateRelevanceTags(article.title, article.summary)
  }
}
```

#### **Level 2: microCMS拡張（2週間後）**
```typescript
// microCMS新フィールド
interface NewResearchFields {
  // AI自動生成（ボットが追加）
  auto_cancer_types: string[]      // AIが自動分類
  auto_treatment_outcomes: string[] // AIが自動分類
  auto_patient_keywords: string[]   // 患者向けキーワード
  auto_clinical_relevance: string   // 臨床的関連性
  
  // 手動設定（後で追加可能）
  manual_categories?: string[]      // 手動カテゴリ
  editor_notes?: string            // 編集者メモ
}
```

#### **Level 3: 完全拡張版（1ヶ月後）**
```typescript
// フルスペック
interface FullResearchArticle extends ResearchArticle {
  // 自動分類
  cancer_types: string[]
  treatment_outcomes: string[]
  research_stage: string
  japan_availability: string
  patient_demographics: string[]
  
  // 検索・フィルター
  difficulty_factors: string[]
  medical_specialties: string[]
  target_symptoms: string[]
  
  // ユーザー体験
  patient_friendly_summary: string
  doctor_consultation_points: string[]
  related_questions: string[]
}
```

## 🚀 実装ロードマップ

### **Week 1: 既存データ活用最大化**
- [ ] データ抽出関数の実装
- [ ] フロントエンドフィルター機能
- [ ] 検索機能の改善
- [ ] カード表示の改善

### **Week 2: microCMSスキーマ拡張**
- [ ] 新フィールドの追加（optional）
- [ ] 既存記事の互換性確認
- [ ] ボット更新の準備

### **Week 3: ボット段階的更新**
- [ ] AI分類ロジックの追加
- [ ] 新フィールドの自動生成
- [ ] 段階的ロールアウト

### **Week 4: 統合・最適化**
- [ ] 全機能の統合テスト
- [ ] パフォーマンス最適化
- [ ] ユーザビリティテスト

## 💡 実装の具体例

### **既存データからの自動抽出**
```typescript
// tags から がん種を抽出
function extractCancerTypes(tags: string): string[] {
  const cancerPatterns = [
    /乳がん|乳癌|breast.*cancer/i,
    /肺がん|肺癌|lung.*cancer/i,
    /大腸がん|大腸癌|colorectal.*cancer/i,
    // ... その他のパターン
  ]
  
  return cancerPatterns
    .filter(pattern => pattern.test(tags))
    .map(pattern => extractCancerName(pattern))
}

// summary から治療成果を分類
function classifyTreatmentOutcome(summary: string): string[] {
  const outcomes = []
  
  if (/生存期間|survival|延命/.test(summary)) {
    outcomes.push('生存期間延長')
  }
  if (/QOL|生活の質|quality.*life/.test(summary)) {
    outcomes.push('QOL改善')
  }
  if (/副作用|有害事象|adverse/.test(summary)) {
    outcomes.push('副作用軽減')
  }
  
  return outcomes
}
```

### **段階的フィルター実装**
```typescript
// Phase 1: 基本フィルター
interface BasicFilters {
  cancer_types: string[]     // 自動抽出
  difficulty: string[]       // 既存フィールド
  recency: 'week' | 'month' | 'year'  // 計算フィールド
}

// Phase 2: 拡張フィルター
interface AdvancedFilters extends BasicFilters {
  treatment_outcomes: string[]  // 新フィールド
  research_stage: string[]     // 新フィールド
  japan_availability: string[] // 新フィールド
}
```

## ⚠️ リスク管理

### **ボット運用継続のための対策**
1. **既存フィールド保護**: 既存フィールドは絶対に変更しない
2. **段階的ロールアウト**: 新機能は段階的に追加
3. **バックアップ体制**: ロールバック可能な設計
4. **監視体制**: ボット動作の継続監視

### **データ整合性の確保**
1. **下位互換性**: 新フィールドは全てoptional
2. **デフォルト値**: 新フィールドには適切なデフォルト値
3. **検証ロジック**: データ不整合の自動検出・修正

## 📊 成功指標

### **Technical Metrics**
- ボット正常稼働率: 100%維持
- 新機能エラー率: < 1%
- ページ読み込み速度: < 2秒

### **User Experience Metrics**
- 記事発見効率: 現在の3倍
- フィルター使用率: > 30%
- ページ滞在時間: 現在の2倍

この戦略により、ボット運用を害することなく、段階的にResearchページを改善できます！🎯 