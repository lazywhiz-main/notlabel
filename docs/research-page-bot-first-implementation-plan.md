# Research ページ改善 - ボット優先実装計画

## 🎯 戦略転換の理由

**データ抽出 vs ボット生成**の比較：
- ❌ **データ抽出**: 32記事から正規表現で抽出 → 精度60-70%
- ✅ **ボット生成**: GPT-4で論文解析 → 精度95%+、自動分類

**結論**: ボット修正を先行し、高品質なメタデータを最初から生成する方が効率的！

## 📋 実装フェーズ

### **Phase 1: ボット＆スキーマ更新（1週間）**

#### **Day 1-2: microCMSスキーマ拡張**
- [ ] `articles` APIに5つの新フィールド追加
- [ ] 既存記事の動作確認
- [ ] フィールド設定のテスト

#### **Day 3-4: ボットコード更新**
- [x] 型定義の更新（完了）
- [x] OpenAIプロンプトの拡張（完了）
- [x] 記事投稿データの拡張（完了）
- [ ] テスト実行＆デバッグ

#### **Day 5-7: 統合テスト**
- [ ] 新ボットでの記事生成テスト
- [ ] メタデータ生成精度の確認
- [ ] 本番デプロイ

### **Phase 2: フロントエンド実装（1週間）**

#### **Day 8-10: 基本フィルター機能**
- [ ] がん種別フィルター
- [ ] 治療成果別フィルター
- [ ] 研究段階別フィルター
- [ ] 日本利用可能性フィルター

#### **Day 11-12: 検索機能**
- [ ] キーワード検索（title, summary, patient_keywords）
- [ ] 複合検索（フィルター + キーワード）
- [ ] 検索結果のハイライト

#### **Day 13-14: UI改善**
- [ ] カード表示の最適化
- [ ] レスポンシブデザイン
- [ ] ローディング状態の改善

### **Phase 3: 高度化（2週間）**

#### **Week 3: ユーザー体験向上**
- [ ] 保存した検索条件
- [ ] 関連記事推奨
- [ ] 閲覧履歴
- [ ] ソート機能拡張

#### **Week 4: パフォーマンス最適化**
- [ ] 無限スクロール
- [ ] キャッシュ最適化
- [ ] SEO対応
- [ ] アクセシビリティ改善

## 🛠️ 技術実装詳細

### **新しいメタデータフィールド**

```typescript
interface ResearchArticle {
  // ... 既存フィールド
  
  // 🆕 Phase 1追加フィールド
  cancer_types?: string[]          // ["乳がん", "肺がん"]
  treatment_outcomes?: string[]    // ["生存期間延長", "QOL改善"]
  research_stage?: string         // "臨床試験"
  japan_availability?: string     // "利用可能"
  patient_keywords?: string[]     // ["新薬", "副作用", "生存率"]
}
```

### **フィルター機能の実装**

```typescript
interface FilterState {
  cancer_types: string[]
  treatment_outcomes: string[]
  research_stage: string[]
  japan_availability: string[]
  keyword: string
  difficulty: string[]
  recency: 'week' | 'month' | 'year' | 'all'
}

// フィルター適用ロジック
function applyFilters(articles: ResearchArticle[], filters: FilterState) {
  return articles.filter(article => {
    // がん種フィルター
    if (filters.cancer_types.length > 0) {
      const hasMatchingCancer = filters.cancer_types.some(cancer => 
        article.cancer_types?.includes(cancer)
      )
      if (!hasMatchingCancer) return false
    }
    
    // 治療成果フィルター
    if (filters.treatment_outcomes.length > 0) {
      const hasMatchingOutcome = filters.treatment_outcomes.some(outcome => 
        article.treatment_outcomes?.includes(outcome)
      )
      if (!hasMatchingOutcome) return false
    }
    
    // その他のフィルター...
    
    return true
  })
}
```

### **検索機能の実装**

```typescript
function searchArticles(articles: ResearchArticle[], query: string) {
  const searchFields = ['title', 'summary', 'patient_keywords']
  const queryLower = query.toLowerCase()
  
  return articles.filter(article => {
    return searchFields.some(field => {
      const value = article[field as keyof ResearchArticle]
      if (Array.isArray(value)) {
        return value.some(item => item.toLowerCase().includes(queryLower))
      }
      return value?.toString().toLowerCase().includes(queryLower)
    })
  })
}
```

## 📊 期待される成果

### **定量的指標**
- **記事発見効率**: 3倍向上（フィルターで即座に絞り込み）
- **検索精度**: 90%以上（患者向けキーワードで最適化）
- **ページ滞在時間**: 2倍向上（関連記事が見つけやすい）
- **フィルター使用率**: 50%以上

### **定性的改善**
- **患者・家族**: 自分に関連する研究を素早く発見
- **医療従事者**: 専門分野の最新研究を効率的に収集
- **研究者**: 関連研究の動向を把握

## 🚀 実装開始

### **今すぐできること**
1. ✅ **ボットコード更新完了** - 新メタデータ生成準備完了
2. 📋 **microCMSスキーマ更新** - ガイドに従って実行
3. 🧪 **テスト実行** - 新しいボットでの記事生成テスト

### **実装順序**
1. **microCMS更新** → **ボットテスト** → **フロントエンド**
2. 段階的リリースで安全性確保
3. 各段階での動作確認とフィードバック収集

## ⚠️ リスク管理

### **ボット動作保護**
- 既存フィールドは絶対変更しない
- 新フィールドは全てオプショナル
- 失敗時のフォールバック機能

### **データ整合性**
- 型定義の厳密な管理
- バリデーション処理の強化
- エラーハンドリングの充実

この計画により、**2週間で劇的に使いやすいResearchページ**を実現できます！🎯

次の手順：
1. microCMSスキーマ更新
2. ボットのテスト実行
3. フロントエンド実装開始 