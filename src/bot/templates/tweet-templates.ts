import { ResearchArticle } from '../../lib/microcms';

export interface TweetTemplate {
  name: string;
  pattern: (article: ResearchArticle, siteUrl: string) => string;
  category: 'standard' | 'engaging' | 'informative' | 'friendly';
}

/**
 * 投稿文テンプレート集
 */
export const TWEET_TEMPLATES: TweetTemplate[] = [
  // 標準テンプレート
  {
    name: 'standard',
    category: 'standard',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      const tags = generateHashtags(article.tags);
      return `📄 新しい研究記事を公開しました

${difficulty} ${article.title}

${article.summary}

🔗 ${siteUrl}/research/${article.slug}

${tags}`;
    }
  },

  // 発見強調型
  {
    name: 'discovery',
    category: 'engaging',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      const tags = generateHashtags(article.tags);
      return `🔬 最新のがん研究をお届け！

✨ ${article.title}

${article.summary}

詳細はこちら👇
🔗 ${siteUrl}/research/${article.slug}

${tags}`;
    }
  },

  // 問題提起型
  {
    name: 'question',
    category: 'engaging',
    pattern: (article, siteUrl) => {
      const tags = generateHashtags(article.tags);
      return `💡 こんな治療法があることをご存知ですか？

${article.title}

${article.summary}

研究の詳細📖
🔗 ${siteUrl}/research/${article.slug}

${tags}`;
    }
  },

  // 臨床試験特化型
  {
    name: 'clinical',
    category: 'informative',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      const tags = generateHashtags(article.tags);
      return `🩺 臨床試験の重要な成果

${difficulty} ${article.title}

${article.summary}

患者さんにとって希望となる研究です。

🔗 ${siteUrl}/research/${article.slug}

#臨床試験 #がん治療 #医療進歩`;
    }
  },

  // 希望メッセージ型
  {
    name: 'hopeful',
    category: 'friendly',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      const tags = generateHashtags(article.tags);
      return `🌟 希望の光となる研究

${difficulty} ${article.title}

${article.summary}

医学の進歩に心から感謝です🙏

🔗 ${siteUrl}/research/${article.slug}

${tags}`;
    }
  },

  // データ強調型
  {
    name: 'data-focused',
    category: 'informative',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      const tags = generateHashtags(article.tags);
      return `📊 注目の研究データ

${difficulty} ${article.title}

${article.summary}

数字が物語る医学の進歩です📈

🔗 ${siteUrl}/research/${article.slug}

${tags}`;
    }
  },

  // 基礎研究型
  {
    name: 'basic-research',
    category: 'informative',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      return `🔬 基礎研究から新たな発見

${difficulty} ${article.title}

${article.summary}

将来の治療法開発につながる重要な研究です。

🔗 ${siteUrl}/research/${article.slug}

#基礎研究 #がん #創薬 #医学研究`;
    }
  },

  // 時間帯別テンプレート（朝）
  {
    name: 'morning',
    category: 'friendly',
    pattern: (article, siteUrl) => {
      const difficulty = getDifficultyEmoji(article.difficulty);
      const tags = generateHashtags(article.tags);
      return `🌅 今日の医学ニュース

${difficulty} ${article.title}

${article.summary}

今日も素晴らしい1日を！

🔗 ${siteUrl}/research/${article.slug}

${tags}`;
    }
  }
];

/**
 * 記事に最適なテンプレートを選択
 */
export function selectOptimalTemplate(article: ResearchArticle): TweetTemplate {
  // 研究タイプに基づく選択
  if (article.research_type?.includes('clinical-trial')) {
    return TWEET_TEMPLATES.find(t => t.name === 'clinical') || TWEET_TEMPLATES[0];
  }
  
  if (article.research_type?.includes('basic-research')) {
    return TWEET_TEMPLATES.find(t => t.name === 'basic-research') || TWEET_TEMPLATES[0];
  }

  // 時間帯に基づく選択（日本時間）
  const hour = parseInt(new Date().toLocaleString('ja-JP', { 
    timeZone: 'Asia/Tokyo', 
    hour: 'numeric', 
    hour12: false 
  }));
  if (hour >= 6 && hour <= 10) {
    return TWEET_TEMPLATES.find(t => t.name === 'morning') || TWEET_TEMPLATES[0];
  }

  // 難易度に基づく選択
  const difficulty = article.difficulty?.[0];
  if (difficulty === 'beginner') {
    return TWEET_TEMPLATES.find(t => t.name === 'hopeful') || TWEET_TEMPLATES[0];
  }
  
  if (difficulty === 'advanced') {
    return TWEET_TEMPLATES.find(t => t.name === 'data-focused') || TWEET_TEMPLATES[0];
  }

  // ランダム選択（エンゲージメント向上）
  const templates = TWEET_TEMPLATES.filter(t => t.category === 'engaging');
  return templates[Math.floor(Math.random() * templates.length)] || TWEET_TEMPLATES[0];
}

/**
 * カテゴリ指定でテンプレート選択
 */
export function selectTemplateByCategory(category: string): TweetTemplate {
  const templates = TWEET_TEMPLATES.filter(t => t.category === category);
  return templates[Math.floor(Math.random() * templates.length)] || TWEET_TEMPLATES[0];
}

/**
 * 280文字制限に合わせてテキストを調整
 */
export function adjustTweetLength(text: string, maxLength: number = 280): string {
  if (text.length <= maxLength) {
    return text;
  }

  // 要約部分を短縮
  const lines = text.split('\n');
  let summaryLineIndex = -1;
  
  // 要約行を特定（通常は3行目または4行目）
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > 50 && !lines[i].includes('🔗') && !lines[i].includes('#')) {
      summaryLineIndex = i;
      break;
    }
  }

  if (summaryLineIndex >= 0) {
    const summaryLine = lines[summaryLineIndex];
    const otherLinesLength = lines.filter((_, i) => i !== summaryLineIndex).join('\n').length;
    const maxSummaryLength = maxLength - otherLinesLength - 10; // マージン
    
    if (summaryLine.length > maxSummaryLength) {
      lines[summaryLineIndex] = summaryLine.substring(0, maxSummaryLength - 3) + '...';
    }
  }

  return lines.join('\n');
}

// ヘルパー関数
function getDifficultyEmoji(difficulty: string[]): string {
  const level = difficulty?.[0] || 'intermediate';
  switch (level) {
    case 'beginner': return '🟢';
    case 'intermediate': return '🟡';
    case 'advanced': return '🔴';
    default: return '🟡';
  }
}

function generateHashtags(tags: string | string[]): string {
  let tagList: string[];
  
  if (typeof tags === 'string') {
    tagList = tags.split(',').map(tag => tag.trim());
  } else if (Array.isArray(tags)) {
    tagList = tags;
  } else {
    tagList = [];
  }

  const hashtags = tagList
    .filter(tag => tag && tag.trim()) // 空のタグを除外
    .slice(0, 3) // 最大3つまで
    .map(tag => '#' + tag.replace(/\s+/g, '').replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')) // 日本語対応
    .filter(tag => tag.length > 1) // 1文字のハッシュタグを除外
    .join(' ');
  
  const baseHashtags = '#がん研究 #医療 #研究';
  return hashtags ? `${hashtags} ${baseHashtags}` : baseHashtags;
} 