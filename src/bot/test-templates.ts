import { TWEET_TEMPLATES, selectOptimalTemplate, selectTemplateByCategory, adjustTweetLength } from './templates/tweet-templates';

// テスト用の記事データ
const testArticles = [
  {
    title: 'リジン補給で肝細胞癌治療の効果を向上',
    slug: 'test-liver-cancer-lysine',
    summary: 'リジン補給により肝細胞癌患者の治療効果が大幅に改善されることが臨床試験で明らかになりました。この革新的な治療法は副作用が少なく、従来の治療との併用も可能です。',
    tags: ['肝細胞癌', 'リジン', '栄養療法'],
    difficulty: ['intermediate'],
    research_type: ['clinical-trial']
  },
  {
    title: 'AI技術を活用した新しいがん診断システム',
    slug: 'test-ai-diagnosis',
    summary: '深層学習技術を使った画像解析により、従来の診断精度を大幅に上回るがん診断システムが開発されました。早期発見率の向上が期待されます。',
    tags: ['AI', '診断技術', '画像解析'],
    difficulty: ['advanced'],
    research_type: ['basic-research']
  },
  {
    title: 'がん予防に効果的な生活習慣の新知見',
    slug: 'test-lifestyle-prevention',
    summary: '大規模疫学調査により、特定の生活習慣ががん発症リスクを大幅に低下させることが判明しました。日常生活で実践可能な予防法を紹介します。',
    tags: ['がん予防', '生活習慣', '疫学'],
    difficulty: ['beginner'],
    research_type: ['epidemiology']
  }
] as any[];

const SITE_URL = 'https://no-label.me';

function testAllTemplates() {
  console.log('🧪 投稿文テンプレートテスト開始\n');

  testArticles.forEach((article, index) => {
    console.log(`\n📝 記事 ${index + 1}: ${article.title}`);
    console.log(`難易度: ${article.difficulty[0]}, 研究タイプ: ${article.research_type[0]}\n`);

    // 最適なテンプレートを自動選択
    const optimalTemplate = selectOptimalTemplate(article);
    console.log(`🎯 選択されたテンプレート: ${optimalTemplate.name} (${optimalTemplate.category})`);
    
    const tweetText = optimalTemplate.pattern(article, SITE_URL);
    const adjustedText = adjustTweetLength(tweetText);
    
    console.log(`📊 文字数: ${adjustedText.length}/280文字`);
    console.log('📄 投稿文:');
    console.log('---');
    console.log(adjustedText);
    console.log('---\n');
  });
}

function testTemplateCategories() {
  console.log('\n🎨 カテゴリ別テンプレートテスト\n');

  const categories = ['standard', 'engaging', 'informative', 'friendly'];
  const testArticle = testArticles[0];

  categories.forEach(category => {
    console.log(`\n📂 カテゴリ: ${category}`);
    
    const template = selectTemplateByCategory(category);
    const tweetText = template.pattern(testArticle, SITE_URL);
    const adjustedText = adjustTweetLength(tweetText);
    
    console.log(`📝 テンプレート: ${template.name}`);
    console.log(`📊 文字数: ${adjustedText.length}/280文字`);
    console.log('---');
    console.log(adjustedText);
    console.log('---');
  });
}

function testAllTemplateVariations() {
  console.log('\n🔄 全テンプレートバリエーションテスト\n');

  const testArticle = testArticles[1]; // AI診断の記事を使用

  TWEET_TEMPLATES.forEach(template => {
    console.log(`\n📋 テンプレート: ${template.name} (${template.category})`);
    
    const tweetText = template.pattern(testArticle, SITE_URL);
    const adjustedText = adjustTweetLength(tweetText);
    
    console.log(`📊 文字数: ${adjustedText.length}/280文字`);
    console.log('---');
    console.log(adjustedText);
    console.log('---');
  });
}

function testLongTextAdjustment() {
  console.log('\n✂️ 長文調整テスト\n');

  // 非常に長い要約を持つテスト記事
  const longArticle = {
    title: '非常に長いタイトルを持つがん研究の包括的な臨床試験結果',
    slug: 'very-long-article-title-test',
    summary: 'これは非常に長い要約文です。この研究では複数の治療法を組み合わせた包括的なアプローチを採用し、大規模な臨床試験を通じて驚くべき結果を得ることができました。患者さんの生活の質の向上と生存期間の延長が確認され、副作用も従来の治療法と比較して大幅に軽減されています。この革新的な治療法は、がん治療の新たな標準となる可能性があります。',
    tags: ['臨床試験', '包括的治療', '生活の質'],
    difficulty: ['advanced'],
    research_type: ['clinical-trial']
  } as any;

  const template = TWEET_TEMPLATES[0]; // 標準テンプレート
  const originalText = template.pattern(longArticle, SITE_URL);
  const adjustedText = adjustTweetLength(originalText);

  console.log(`📏 元の文字数: ${originalText.length}文字`);
  console.log(`📏 調整後文字数: ${adjustedText.length}文字`);
  console.log('\n📄 調整前:');
  console.log('---');
  console.log(originalText);
  console.log('---');
  console.log('\n📄 調整後:');
  console.log('---');
  console.log(adjustedText);
  console.log('---');
}

// 実行
console.log('🎯 SNS投稿文テンプレートシステム テスト');
console.log('=' + '='.repeat(50));

testAllTemplates();
testTemplateCategories();
testAllTemplateVariations();
testLongTextAdjustment();

console.log('\n🎉 テスト完了！'); 