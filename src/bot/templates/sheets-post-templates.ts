import { ResearchArticle } from '../../lib/microcms';

export interface SheetsPostTemplate {
  name: string;
  generatePost: (article: ResearchArticle, siteUrl: string) => {
    platform: string;
    content: string;
    hashtags: string;
    difficulty: string;
    category: string;
  };
}

/**
 * Google Sheets用投稿文テンプレート
 */
export const SHEETS_POST_TEMPLATES: SheetsPostTemplate[] = [
  {
    name: 'twitter-standard',
    generatePost: (article, siteUrl) => ({
      platform: 'Twitter',
      content: generateTwitterPost(article, siteUrl, 'standard'),
      hashtags: generateHashtags(article.tags),
      difficulty: getDifficultyText(article.difficulty),
      category: 'Standard'
    })
  },
  {
    name: 'twitter-engaging',
    generatePost: (article, siteUrl) => ({
      platform: 'Twitter',
      content: generateTwitterPost(article, siteUrl, 'engaging'),
      hashtags: generateHashtags(article.tags),
      difficulty: getDifficultyText(article.difficulty),
      category: 'Engaging'
    })
  },
  {
    name: 'instagram-story',
    generatePost: (article, siteUrl) => ({
      platform: 'Instagram Story',
      content: generateInstagramStory(article, siteUrl),
      hashtags: generateHashtags(article.tags),
      difficulty: getDifficultyText(article.difficulty),
      category: 'Visual'
    })
  },
  {
    name: 'facebook-detailed',
    generatePost: (article, siteUrl) => ({
      platform: 'Facebook',
      content: generateFacebookPost(article, siteUrl),
      hashtags: generateHashtags(article.tags),
      difficulty: getDifficultyText(article.difficulty),
      category: 'Detailed'
    })
  },
  {
    name: 'linkedin-professional',
    generatePost: (article, siteUrl) => ({
      platform: 'LinkedIn',
      content: generateLinkedInPost(article, siteUrl),
      hashtags: generateProfessionalHashtags(article.tags),
      difficulty: getDifficultyText(article.difficulty),
      category: 'Professional'
    })
  }
];

// Twitter投稿文生成
function generateTwitterPost(article: ResearchArticle, siteUrl: string, style: 'standard' | 'engaging'): string {
  const difficulty = getDifficultyEmoji(article.difficulty);
  const url = `${siteUrl}/research/${article.slug}`;
  
  if (style === 'engaging') {
    return `🔬 最新のがん研究をお届け！

✨ ${article.title}

${article.summary}

詳細はこちら👇
🔗 ${url}`;
  }
  
  return `📄 新しい研究記事を公開しました

${difficulty} ${article.title}

${article.summary}

🔗 ${url}`;
}

// Instagram Story用投稿文生成
function generateInstagramStory(article: ResearchArticle, siteUrl: string): string {
  const difficulty = getDifficultyEmoji(article.difficulty);
  
  return `【最新研究情報】

${difficulty} ${article.title}

${article.summary}

詳細はプロフィールリンクから📖
↗️ ${siteUrl}

#がん研究 #医療情報 #健康`;
}

// Facebook投稿文生成
function generateFacebookPost(article: ResearchArticle, siteUrl: string): string {
  const difficulty = getDifficultyEmoji(article.difficulty);
  const url = `${siteUrl}/research/${article.slug}`;
  
  return `【がん研究の最新情報をお届けします】

${difficulty} ${article.title}

${article.summary}

この研究について詳しく知りたい方は、以下のリンクから記事をご覧ください。
皆さんのご意見やコメントもお待ちしております。

🔗 ${url}

医学の進歩により、多くの患者さんに希望の光が届くことを願っています。`;
}

// LinkedIn投稿文生成
function generateLinkedInPost(article: ResearchArticle, siteUrl: string): string {
  const url = `${siteUrl}/research/${article.slug}`;
  
  return `Healthcare professionals and researchers,

I'm excited to share important findings from recent cancer research:

${article.title}

Key insights:
${article.summary}

This research represents significant progress in oncology and may have important implications for clinical practice.

Read the full analysis: ${url}

What are your thoughts on these findings? I'd love to hear from fellow professionals in the comments.`;
}

// ハッシュタグ生成（一般用）
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
    .filter(tag => tag && tag.trim())
    .slice(0, 5) // Sheets用は最大5つまで
    .map(tag => '#' + tag.replace(/\s+/g, '').replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, ''))
    .filter(tag => tag.length > 1)
    .join(' ');
  
  const baseHashtags = '#がん研究 #医療 #研究 #健康';
  return hashtags ? `${hashtags} ${baseHashtags}` : baseHashtags;
}

// プロフェッショナル向けハッシュタグ生成
function generateProfessionalHashtags(tags: string | string[]): string {
  let tagList: string[];
  
  if (typeof tags === 'string') {
    tagList = tags.split(',').map(tag => tag.trim());
  } else if (Array.isArray(tags)) {
    tagList = tags;
  } else {
    tagList = [];
  }

  const hashtags = tagList
    .filter(tag => tag && tag.trim())
    .slice(0, 3)
    .map(tag => '#' + tag.replace(/\s+/g, '').replace(/[^\w]/g, ''))
    .filter(tag => tag.length > 1)
    .join(' ');
  
  const professionalHashtags = '#Oncology #MedicalResearch #Healthcare #CancerResearch';
  return hashtags ? `${hashtags} ${professionalHashtags}` : professionalHashtags;
}

// 難易度テキスト変換
function getDifficultyText(difficulty: string[]): string {
  const level = difficulty?.[0] || 'intermediate';
  switch (level) {
    case 'beginner': return '初心者向け';
    case 'intermediate': return '中級者向け';
    case 'advanced': return '上級者向け';
    default: return '中級者向け';
  }
}

// 難易度絵文字取得
function getDifficultyEmoji(difficulty: string[]): string {
  const level = difficulty?.[0] || 'intermediate';
  switch (level) {
    case 'beginner': return '🟢';
    case 'intermediate': return '🟡';
    case 'advanced': return '🔴';
    default: return '🟡';
  }
}

/**
 * 記事に基づいて複数のSNS投稿文を生成
 */
export function generateAllSocialPosts(article: ResearchArticle, siteUrl: string) {
  return SHEETS_POST_TEMPLATES.map(template => ({
    template: template.name,
    ...template.generatePost(article, siteUrl),
    timestamp: new Date().toISOString(),
    article_title: article.title,
    article_slug: article.slug
  }));
}

/**
 * 特定プラットフォーム用の投稿文を生成
 */
export function generatePostForPlatform(
  article: ResearchArticle, 
  siteUrl: string, 
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin'
) {
  const templateMap = {
    twitter: 'twitter-standard',
    instagram: 'instagram-story',
    facebook: 'facebook-detailed',
    linkedin: 'linkedin-professional'
  };
  
  const templateName = templateMap[platform];
  const template = SHEETS_POST_TEMPLATES.find(t => t.name === templateName);
  
  if (!template) {
    throw new Error(`Template not found for platform: ${platform}`);
  }
  
  return {
    template: template.name,
    ...template.generatePost(article, siteUrl),
    timestamp: new Date().toISOString(),
    article_title: article.title,
    article_slug: article.slug
  };
} 