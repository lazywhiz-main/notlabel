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

export default async function PhilosophyArticle({ params }: Props) {
  const article = await getContentBySlug(params.slug)

  // 記事が見つからない、またはPhilosophyカテゴリでない場合は404
  if (!article || !article.category.includes('philosophy')) {
    notFound()
  }

  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-stone-100 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="px-4 py-2 bg-accent text-white text-sm rounded-full">
                哲学的エッセイ
              </span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mb-8 font-serif">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex justify-center items-center gap-6 text-stone-600 mb-8">
              <span>著者: {article.author}</span>
              <span>•</span>
              <span>{formatDate(article.published_at)}</span>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="max-w-2xl mx-auto">
                <blockquote className="text-xl font-serif text-stone-700 italic leading-relaxed">
                  "{article.excerpt}"
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-stone lg:prose-xl max-w-none font-serif prose-headings:font-serif prose-blockquote:border-l-accent prose-blockquote:text-stone-700">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-serif font-bold mb-8 text-primary border-b border-stone-200 pb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-serif font-bold mb-6 text-primary mt-10">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-serif font-semibold mb-4 text-primary mt-8">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-lg font-serif font-semibold mb-3 text-secondary mt-6">{children}</h4>,
                  p: ({ children }) => <p className="mb-6 leading-loose text-secondary text-lg font-serif">{children}</p>,
                  ul: ({ children }) => <ul className="mb-6 ml-8 list-disc space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-6 ml-8 list-decimal space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-secondary font-serif">{children}</li>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-6 my-8 italic text-stone-700 bg-stone-50 py-4 font-serif text-xl">{children}</blockquote>,
                  strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                  em: ({ children }) => <em className="italic text-stone-600">{children}</em>,
                  code: ({ children }) => <code className="bg-stone-100 px-2 py-1 rounded text-sm font-mono text-stone-800">{children}</code>,
                  pre: ({ children }) => <pre className="bg-stone-100 p-6 rounded-lg overflow-x-auto mb-6">{children}</pre>,
                  a: ({ href, children }) => <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Author Bio Section */}
            <div className="mt-16 pt-8 border-t border-stone-200">
              <div className="bg-stone-50 p-8 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">著者について</h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-stone-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-stone-900 mb-2">{article.author}</h4>
                    <p className="text-stone-600 text-sm">
                      医療と社会の関係性について哲学的視点から探求を続けています。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-stone-200">
                <h3 className="text-lg font-semibold mb-4">関連テーマ</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-stone-100 text-stone-700 text-sm rounded-full hover:bg-stone-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Thinking */}
      <section className="py-16 bg-stone-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="heading-lg mb-6">この問いについて考える</h3>
            <p className="text-stone-600 mb-8">
              この記事で提起された問いについて、あなたはどう思いますか？<br />
              新しい視点や異なる解釈を共有し、対話を深めていきましょう。
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-accent text-white rounded-full hover:bg-red-600 transition-colors">
                議論に参加する
              </button>
              <button className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
                この記事をシェア
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <a
                href="/philosophy"
                className="px-6 py-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
              >
                ← エッセイ一覧に戻る
              </a>
              
              <div className="text-center">
                <p className="text-sm text-stone-500 mb-2">次の探求へ</p>
                <a 
                  href="/philosophy"
                  className="text-accent hover:underline"
                >
                  他の哲学的エッセイを読む →
                </a>
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