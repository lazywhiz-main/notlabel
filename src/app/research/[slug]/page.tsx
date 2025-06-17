import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { getResearchArticleBySlug, type ResearchArticle } from '@/lib/microcms'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const getDifficultyColor = (difficulty: string[] | string) => {
  const level = Array.isArray(difficulty) ? difficulty[0] : difficulty
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-700'
    case 'intermediate': return 'bg-yellow-100 text-yellow-700'
    case 'advanced': return 'bg-red-100 text-red-700'
    default: return 'bg-stone-100 text-stone-700'
  }
}

const getDifficultyLabel = (difficulty: string[] | string) => {
  const level = Array.isArray(difficulty) ? difficulty[0] : difficulty
  switch (level) {
    case 'beginner': return '基礎'
    case 'intermediate': return '中級'
    case 'advanced': return '専門'
    default: return '中級'
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: PageProps) {
  let article: ResearchArticle | null = null
  let error: string | null = null

  try {
    article = await getResearchArticleBySlug(params.slug)
    if (!article) {
      notFound()
    }
  } catch (err) {
    console.error('❌ 記事取得エラー:', err)
    error = err instanceof Error ? err.message : '記事の取得に失敗しました'
  }

  if (error || !article) {
    return (
      <main className="min-h-screen pt-16">
        <Navigation />
        <div className="container-custom py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">記事が見つかりません</h1>
            <p className="text-secondary mb-8">{error || '指定された記事は存在しません。'}</p>
            <Link 
              href="/research"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              研究記事一覧に戻る
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Breadcrumb */}
      <section className="py-6 bg-stone-50 border-b border-stone-200">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-secondary">
            <Link href="/" className="hover:text-primary">
              ホーム
            </Link>
            <span>›</span>
            <Link href="/research" className="hover:text-primary">
              RESEARCH
            </Link>
            <span>›</span>
            <span className="text-primary">{article.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl">
          {/* AI Generated Badge */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full">
                <span className="text-lg">🤖</span>
                <span className="font-medium">AI生成記事</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty || 'intermediate')}`}>
                {getDifficultyLabel(article.difficulty || 'intermediate')}
              </span>
              <span className="text-sm text-secondary">{article.read_time || '3分'}</span>
            </div>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-6">
              <span className="bg-stone-100 px-2 py-1 rounded">{article.research_type || '研究'}</span>
              <span>{article.journal || 'Journal'}</span>
              <span>{article.publish_date ? new Date(article.publish_date).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '日付不明'}</span>
              <span className="font-mono">{article.pubmed_id || 'PMID: 不明'}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="heading-xl mb-6">{article.title}</h1>

          {/* Original Title */}
          {article.original_title && (
            <div className="mb-8 p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="text-xs text-stone-400 mb-2">原論文タイトル：</div>
              <div className="text-sm text-stone-600 italic">{article.original_title}</div>
            </div>
          )}

          {/* Summary */}
          <div className="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">
            <h2 className="font-semibold text-accent mb-3">📋 要約</h2>
            <p className="text-secondary leading-relaxed">{article.summary}</p>
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.split(', ').map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-stone-100 text-sm rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Body */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl">

          
          <div className="prose prose-lg max-w-none prose-stone prose-headings:font-serif prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-6 text-primary border-b border-stone-200 pb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-4 text-primary mt-8">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mb-3 text-primary mt-6">{children}</h3>,
                h4: ({ children }) => <h4 className="text-base font-semibold mb-2 text-secondary mt-4">{children}</h4>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-secondary">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-secondary">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 my-4 italic text-stone-600 bg-stone-50 py-2">{children}</blockquote>,
                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                em: ({ children }) => <em className="italic text-stone-600">{children}</em>,
                code: ({ children }) => <code className="bg-stone-100 px-1 py-0.5 rounded text-sm font-mono text-stone-800">{children}</code>,
                pre: ({ children }) => <pre className="bg-stone-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                a: ({ href, children }) => <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
              }}
            >
              {article.body}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Article Footer */}
      <section className="py-12 bg-stone-50 border-t border-stone-200">
        <div className="container-custom max-w-4xl">
          {/* AI Notice */}
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">AI生成コンテンツについて</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  この記事は人工知能により自動生成されています。医療判断の参考としての使用は避け、
                  詳細については必ず医療専門家にご相談ください。内容の正確性については編集部で確認していますが、
                  最新の研究動向を知るための参考情報としてご活用ください。
                </p>
              </div>
            </div>
          </div>

          {/* Original Paper Link */}
          <div className="flex items-center justify-between p-6 bg-white border border-stone-200 rounded-lg mb-8">
            <div>
              <h3 className="font-medium mb-2">原論文を確認</h3>
              <p className="text-sm text-secondary">より詳細な情報は元の論文をご確認ください。</p>
            </div>
            <a 
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              PubMedで確認 →
            </a>
          </div>

          {/* Generation Info */}
          <div className="text-center text-sm text-stone-500">
            <p>
              この記事は {article.ai_generated_at ? new Date(article.ai_generated_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Tokyo'
              }) : '不明な日時'} にAIによって生成されました。
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="container-custom max-w-4xl">
          <div className="flex justify-between items-center">
            <Link 
              href="/research"
              className="flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            >
              ← 研究記事一覧に戻る
            </Link>
            <div className="text-sm text-secondary">
              記事ID: {article.id}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-stone-900 text-stone-50">
        <div className="container-custom text-center">
          <p className="text-stone-400">
            © 2024 ME≠LABEL All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
} 