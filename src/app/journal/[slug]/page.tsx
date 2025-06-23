import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { getContentBySlug, type ContentArticle } from '@/lib/microcms'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// タグからコンテンツタイプを取得
const getTypeLabel = (tags: string[]) => {
  const typeTags = ['分析', '体験談', '対話', '観察']
  const typeTag = tags.find(tag => typeTags.includes(tag))
  return typeTag || '分析'
}

// generateStaticParams関数（静的生成のため）
export async function generateStaticParams() {
  // 本番環境では全記事のスラッグを取得して事前生成
  // 開発環境では空配列を返してオンデマンド生成
  return []
}

interface Props {
  params: {
    slug: string
  }
}

export default async function JournalArticle({ params }: Props) {
  const article = await getContentBySlug(params.slug)

  // 記事が見つからない、またはJournalカテゴリでない場合は404
  if (!article || !article.category.includes('journal')) {
    notFound()
  }

  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 bg-stone-100">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Category and Date */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-accent text-white text-sm rounded-full">
                {getTypeLabel(article.tags)}
              </span>
              <span className="text-stone-500 text-sm">
                {formatDate(article.published_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mb-6">
              {article.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 text-stone-600">
              <span>著者: {article.author}</span>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <p className="text-lg text-stone-700 italic">
                  {article.excerpt}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
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
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-stone-200">
                <h3 className="text-lg font-semibold mb-4">タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-stone-100">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <a
                href="/journal"
                className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
              >
                ← 記事一覧に戻る
              </a>
              
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-stone-600 text-white rounded-full hover:bg-stone-700 transition-colors">
                  この記事をシェア
                </button>
              </div>
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