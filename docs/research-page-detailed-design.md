# Research ページ 詳細設計書

## 🎯 最終ビジョン（Phase 3完了時）

### **理想的なユーザー体験**
1. **エントリー**: 「乳がんの新しい治療法を知りたい」
2. **ガイド**: システムが段階的に質問・絞り込み
3. **発見**: 関連研究3-5件が分かりやすく表示
4. **理解**: 各研究の「患者目線でのポイント」が明確
5. **行動**: 主治医への相談ポイントが具体的に提示

### **最終的なページ構造**
```
┌─────────────────────────────────────────┐
│ [ヘッダー] がん研究を探す                │
├─────────────────────────────────────────┤
│ [ガイドセクション]                      │
│ 💡 あなたの状況を教えてください         │
│ ┌─ がん種: [乳がん ▼]                  │
│ ├─ 治療段階: [手術後 ▼]               │
│ ├─ 知りたいこと: [新しい治療法 ▼]      │
│ └─ [関連研究を探す]                    │
├─────────────────────────────────────────┤
│ [フィルターサイドバー] │ [メインコンテンツ] │
│ ■ がん種 (5)           │ ┌─────────────────┐ │
│ ☑ 乳がん (12)          │ │ [研究カード1]    │ │
│ □ 肺がん (8)           │ │ 🏷️ 乳がん・免疫療法│ │
│                        │ │ 📈 生存期間延長   │ │
│ ■ 研究成果 (3)         │ │ 🏥 日本で実施中   │ │
│ ☑ 生存期間延長 (15)    │ │ 💬 相談ポイント有 │ │
│ □ 副作用軽減 (10)      │ └─────────────────┘ │
│                        │ ┌─────────────────┐ │
│ ■ 実用性 (2)           │ │ [研究カード2]    │ │
│ ☑ 日本で利用可能 (8)   │ │ ...              │ │
│ □ 臨床試験中 (12)      │ └─────────────────┘ │
├─────────────────────────────────────────┤
│ [関連情報]                              │
│ 📞 相談窓口 | 👥 患者会 | 📖 用語集      │
└─────────────────────────────────────────┘
```

---

## 🚀 Phase 2: ユーザビリティ向上の詳細設計

### **2.1 ガイド式エントリーポイント**

#### **ステップバイステップガイド**
```typescript
interface GuidedSearchState {
  step: 1 | 2 | 3 | 4;
  selections: {
    cancerType?: string;
    treatmentStage?: string;
    interest?: string;
    priorities?: string[];
  };
}

// Step 1: がん種選択
const CancerTypeStep = () => (
  <StepContainer>
    <Question>どちらのがんについて調べたいですか？</Question>
    <OptionGrid>
      <OptionCard onClick={() => select('breast')}>
        <Icon>🎗️</Icon>
        <Title>乳がん</Title>
        <Count>(12件の研究)</Count>
      </OptionCard>
      <OptionCard onClick={() => select('lung')}>
        <Icon>🫁</Icon>
        <Title>肺がん</Title>
        <Count>(8件の研究)</Count>
      </OptionCard>
      // ... 他のオプション
    </OptionGrid>
  </StepContainer>
);

// Step 2: 治療段階
const TreatmentStageStep = () => (
  <StepContainer>
    <Question>現在の治療段階を教えてください</Question>
    <OptionList>
      <Option value="pre-treatment">これから治療を始める</Option>
      <Option value="during-treatment">治療中</Option>
      <Option value="post-treatment">治療後のフォロー中</Option>
      <Option value="recurrence">再発の治療中</Option>
    </OptionList>
  </StepContainer>
);

// Step 3: 関心事
const InterestStep = () => (
  <StepContainer>
    <Question>特に知りたいことはありますか？</Question>
    <OptionList>
      <Option value="new-treatments">新しい治療法</Option>
      <Option value="side-effects">副作用の軽減</Option>
      <Option value="quality-of-life">生活の質の改善</Option>
      <Option value="prognosis">治療成果・予後</Option>
    </OptionList>
  </StepContainer>
);
```

#### **個人化された結果表示**
```typescript
interface PersonalizedResults {
  title: string; // "乳がん手術後の方向けの新しい治療法研究"
  matchingArticles: ResearchArticle[];
  relevanceScore: number; // マッチング度
  explanation: string; // "あなたの条件に合致する理由"
}
```

### **2.2 高度な記事詳細ページ**

#### **詳細ページの構造**
```jsx
const ResearchDetailPage = ({ article }) => (
  <DetailContainer>
    {/* ヘッダー部分 */}
    <Header>
      <BreadcrumbNavigation />
      <ArticleTitle>{article.title}</ArticleTitle>
      <ArticleMeta>
        <PublishDate>{article.published_at}</PublishDate>
        <ReadingTime>{article.estimated_reading_time}分で読める</ReadingTime>
        <RelevanceScore>あなたの条件との一致度: 85%</RelevanceScore>
      </ArticleMeta>
    </Header>

    {/* 研究概要ボックス */}
    <ResearchSummaryBox>
      <SummaryTitle>この研究について</SummaryTitle>
      <SummaryGrid>
        <SummaryItem>
          <Label>対象患者</Label>
          <Value>乳がんステージII-III、手術後の方</Value>
        </SummaryItem>
        <SummaryItem>
          <Label>研究方法</Label>
          <Value>新しい免疫療法と従来治療の比較試験</Value>
        </SummaryItem>
        <SummaryItem>
          <Label>主な結果</Label>
          <Value>5年生存率が15%向上、副作用は同程度</Value>
        </SummaryItem>
        <SummaryItem>
          <Label>実用性</Label>
          <Value>日本で臨床試験実施中（2024年内に結果予定）</Value>
        </SummaryItem>
      </SummaryGrid>
    </ResearchSummaryBox>

    {/* 主治医相談ボックス */}
    <ConsultationBox>
      <BoxTitle>主治医への相談ポイント</BoxTitle>
      <QuestionList>
        <Question>
          「この免疫療法は私の場合にも適用できる可能性がありますか？」
        </Question>
        <Question>
          「現在の治療計画と組み合わせることは可能でしょうか？」
        </Question>
        <Question>
          「この研究の臨床試験に参加する方法はありますか？」
        </Question>
      </QuestionList>
      <ImportantNote>
        ⚠️ この情報は研究内容の要約であり、医療的推奨ではありません。
        必ず主治医と相談してください。
      </ImportantNote>
    </ConsultationBox>

    {/* 記事本文 */}
    <ArticleContent>
      <GlossaryEnhancedContent content={article.content} />
    </ArticleContent>

    {/* 関連情報 */}
    <RelatedInformation>
      <RelatedResearch />
      <ExternalResources />
      <PatientSupportInfo />
    </RelatedInformation>
  </DetailContainer>
);
```

### **2.3 用語解説システム**

#### **インタラクティブ用語解説**
```typescript
interface GlossarySystem {
  // ホバー・タップで表示される用語解説
  terms: {
    [key: string]: {
      definition: string;
      pronunciation?: string;
      relatedTerms: string[];
      moreInfoUrl?: string;
    };
  };
}

const GlossaryTooltip = ({ term, children }) => (
  <TooltipContainer>
    <Trigger>{children}</Trigger>
    <TooltipContent>
      <TermName>{term.name}</TermName>
      {term.pronunciation && (
        <Pronunciation>読み方: {term.pronunciation}</Pronunciation>
      )}
      <Definition>{term.definition}</Definition>
      <RelatedTerms>
        関連用語: {term.relatedTerms.join(', ')}
      </RelatedTerms>
      {term.moreInfoUrl && (
        <MoreInfoLink href={term.moreInfoUrl}>
          詳しく知る
        </MoreInfoLink>
      )}
    </TooltipContent>
  </TooltipContainer>
);
```

---

## 🎨 Phase 3: 高度な機能の詳細設計

### **3.1 AI駆動の個人化推奨**

#### **推奨エンジンの設計**
```typescript
interface RecommendationEngine {
  // ユーザーの行動パターン分析
  analyzeUserBehavior(userId: string): UserProfile;
  
  // 類似ユーザーの発見
  findSimilarUsers(profile: UserProfile): string[];
  
  // パーソナライズされた推奨
  generateRecommendations(profile: UserProfile): Recommendation[];
}

interface UserProfile {
  interests: string[]; // 閲覧した記事のタグから抽出
  stage: TreatmentStage;
  preferences: {
    contentLength: 'short' | 'medium' | 'long';
    complexityLevel: 'basic' | 'intermediate' | 'advanced';
    focusAreas: string[];
  };
}

interface Recommendation {
  article: ResearchArticle;
  reason: string; // "類似の状況の方がよく読んでいます"
  confidence: number; // 0-1の推奨度
  personalizedHighlights: string[]; // この人に特に関連する部分
}
```

#### **推奨表示UI**
```jsx
const PersonalizedRecommendations = ({ recommendations }) => (
  <RecommendationSection>
    <SectionTitle>あなたにおすすめの研究</SectionTitle>
    {recommendations.map(rec => (
      <RecommendationCard key={rec.article.id}>
        <ArticlePreview article={rec.article} />
        <RecommendationReason>
          <Icon>💡</Icon>
          <Text>{rec.reason}</Text>
        </RecommendationReason>
        <PersonalizedHighlights>
          <HighlightTitle>あなたに関連するポイント:</HighlightTitle>
          {rec.personalizedHighlights.map(highlight => (
            <HighlightItem key={highlight}>{highlight}</HighlightItem>
          ))}
        </PersonalizedHighlights>
      </RecommendationCard>
    ))}
  </RecommendationSection>
);
```

### **3.2 アクセシビリティ強化**

#### **音声読み上げシステム**
```typescript
interface VoiceSystem {
  // 記事の音声読み上げ
  readArticle(articleId: string, options: ReadingOptions): void;
  
  // 音声検索
  voiceSearch(): Promise<string>;
  
  // 音声ナビゲーション
  voiceNavigation(command: string): void;
}

interface ReadingOptions {
  speed: 'slow' | 'normal' | 'fast';
  voice: 'male' | 'female';
  skipSections?: string[]; // 技術的な部分をスキップ
  highlightMode: boolean; // 読み上げ箇所をハイライト
}
```

#### **高齢者・視覚障害者向けUI**
```jsx
const AccessibleResearchCard = ({ article, isHighContrast, largeText }) => (
  <CardContainer 
    className={classNames({
      'high-contrast': isHighContrast,
      'large-text': largeText
    })}
    role="article"
    aria-label={`研究記事: ${article.title}`}
  >
    <CardHeader>
      <Title tabIndex={0}>{article.title}</Title>
      <VoiceControls>
        <PlayButton 
          onClick={() => readAloud(article.summary)}
          aria-label="要約を読み上げ"
        >
          🔊 読み上げ
        </PlayButton>
      </VoiceControls>
    </CardHeader>
    
    <Summary 
      tabIndex={0}
      aria-describedby={`summary-${article.id}`}
    >
      {article.summary}
    </Summary>
    
    <TagList role="list" aria-label="関連タグ">
      {article.tags.map(tag => (
        <Tag 
          key={tag} 
          role="listitem"
          tabIndex={0}
        >
          {tag}
        </Tag>
      ))}
    </TagList>
  </CardContainer>
);
```

---

## 📊 逆算したPhase 1の具体的設計

### **Phase 1で作るべき基盤**

#### **1. データ構造の設計（最終形を見据えた）**
```typescript
// Phase 3まで拡張可能な設計
interface ResearchArticle {
  // 基本情報（既存）
  id: string;
  title: string;
  summary: string;
  content: string;
  published_at: string;
  
  // Phase 1で実装
  extracted_metadata: {
    cancer_types: string[];
    treatment_methods: string[];
    outcomes: string[];
    target_patients: string[];
    availability_status: 'available' | 'trial' | 'research';
  };
  
  // Phase 2で拡張予定
  detailed_analysis?: {
    reading_time: number;
    complexity_level: 'basic' | 'intermediate' | 'advanced';
    key_takeaways: string[];
    consultation_points: string[];
  };
  
  // Phase 3で拡張予定
  personalization_data?: {
    user_engagement_score: number;
    similar_user_preferences: string[];
    accessibility_features: string[];
  };
}
```

#### **2. コンポーネント設計（段階的拡張可能）**
```typescript
// Phase 1: 基本的なカード
interface ResearchCardProps {
  article: ResearchArticle;
  displayMode: 'compact' | 'detailed'; // Phase 2で詳細モード追加
  personalization?: PersonalizationData; // Phase 3で追加
  accessibility?: AccessibilityOptions; // Phase 3で追加
}

const ResearchCard: React.FC<ResearchCardProps> = ({ 
  article, 
  displayMode = 'compact',
  personalization,
  accessibility 
}) => {
  // Phase 1: 基本実装
  const basicCard = (
    <Card className="research-card">
      <CardHeader>
        <Title>{article.title}</Title>
        <MetaTags tags={article.extracted_metadata.cancer_types} />
      </CardHeader>
      <CardBody>
        <Summary>{truncate(article.summary, 150)}</Summary>
        <TagRow>
          {article.extracted_metadata.outcomes.map(outcome => (
            <OutcomeTag key={outcome}>{outcome}</OutcomeTag>
          ))}
        </TagRow>
      </CardBody>
      <CardFooter>
        <AvailabilityBadge status={article.extracted_metadata.availability_status} />
        <ReadMoreLink to={`/research/${article.id}`} />
      </CardFooter>
    </Card>
  );
  
  // Phase 2以降で条件分岐追加予定
  if (displayMode === 'detailed' && article.detailed_analysis) {
    // 詳細モードのレンダリング
  }
  
  if (personalization) {
    // パーソナライゼーション要素の追加
  }
  
  return basicCard;
};
```

#### **3. フィルターシステム（拡張可能設計）**
```typescript
interface FilterSystem {
  // Phase 1: 基本フィルター
  basicFilters: {
    cancerTypes: string[];
    outcomes: string[];
    availability: string[];
    timeRange: string;
  };
  
  // Phase 2で追加予定
  advancedFilters?: {
    treatmentStage: string[];
    complexityLevel: string[];
    readingTime: number[];
  };
  
  // Phase 3で追加予定
  personalizedFilters?: {
    relevanceScore: number;
    similarUserPreferences: boolean;
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterSystem>({
    basicFilters: {
      cancerTypes: [],
      outcomes: [],
      availability: [],
      timeRange: 'all'
    }
  });
  
  return (
    <FilterContainer>
      {/* Phase 1: 基本フィルター */}
      <FilterSection title="がん種">
        <CheckboxGroup 
          options={CANCER_TYPE_OPTIONS}
          selected={filters.basicFilters.cancerTypes}
          onChange={(selected) => updateFilter('cancerTypes', selected)}
        />
      </FilterSection>
      
      <FilterSection title="研究成果">
        <CheckboxGroup 
          options={OUTCOME_OPTIONS}
          selected={filters.basicFilters.outcomes}
          onChange={(selected) => updateFilter('outcomes', selected)}
        />
      </FilterSection>
      
      {/* Phase 2以降で追加予定のフィルター用のスペース確保 */}
      {filters.advancedFilters && (
        <AdvancedFilterSection filters={filters.advancedFilters} />
      )}
    </FilterContainer>
  );
};
```

#### **4. 検索システム（段階的高度化）**
```typescript
interface SearchSystem {
  // Phase 1: 基本検索
  performBasicSearch(query: string, articles: ResearchArticle[]): ResearchArticle[];
  
  // Phase 2で追加予定
  performSemanticSearch?(query: string): Promise<ResearchArticle[]>;
  
  // Phase 3で追加予定
  performPersonalizedSearch?(
    query: string, 
    userProfile: UserProfile
  ): Promise<PersonalizedSearchResult[]>;
}

// Phase 1実装
export const basicSearchEngine: SearchSystem = {
  performBasicSearch(query: string, articles: ResearchArticle[]): ResearchArticle[] {
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    return articles.filter(article => {
      const searchableText = [
        article.title,
        article.summary,
        ...article.extracted_metadata.cancer_types,
        ...article.extracted_metadata.outcomes
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    }).sort((a, b) => {
      // 関連性スコアでソート（Phase 1は単純な文字列マッチング数）
      const scoreA = calculateRelevanceScore(query, a);
      const scoreB = calculateRelevanceScore(query, b);
      return scoreB - scoreA;
    });
  }
};
```

---

## 🎯 Phase 1の実装優先順位（再定義）

### **Week 1: データ基盤構築**
1. **拡張可能なデータ構造の実装**
2. **32記事への自動メタデータ抽出**
3. **基本的なタグ分類システム**

### **Week 2: コンポーネント基盤**
1. **拡張可能なResearchCardコンポーネント**
2. **基本フィルターシステム**
3. **基本検索機能**

### **Week 3: 統合と最適化**
1. **フィルター + 検索の統合**
2. **パフォーマンス最適化**
3. **Phase 2への拡張ポイントの確認**

---

## 🚧 Phase間の連携設計

### **Phase 1 → Phase 2への移行**
- データ構造: `detailed_analysis`フィールドの追加のみ
- コンポーネント: `displayMode`プロパティの拡張
- 既存機能: 無変更で動作継続

### **Phase 2 → Phase 3への移行**
- データ構造: `personalization_data`フィールドの追加
- 新機能: 既存インターフェースに段階的追加
- 下位互換性: 完全維持

この設計により、Phase 1で作った基盤が無駄にならず、段階的に高度化できる構造になります！💪 