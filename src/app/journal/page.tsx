import Navigation from '@/components/Navigation'
import { getJournalArticles, type ContentArticle } from '@/lib/microcms'
import Link from 'next/link'

const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'analysis', label: '分析' },
  { id: 'experience', label: '体験談' },
  { id: 'dialogue', label: '対話' },
  { id: 'observation', label: '観察' },
]

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit'
  }).replace(/\//g, '.')
}

// タグからコンテンツタイプを取得
const getContentType = (tags: string[]) => {
  const typeMap = {
    '分析': 'analysis',
    '体験談': 'experience', 
    '対話': 'dialogue',
    '観察': 'observation'
  }
  
  for (const tag of tags) {
    if (typeMap[tag as keyof typeof typeMap]) {
      return typeMap[tag as keyof typeof typeMap]
    }
  }
  return 'analysis' // デフォルト
}

// コンテンツタイプのラベルを取得
const getTypeLabel = (tags: string[]) => {
  const typeTags = ['分析', '体験談', '対話', '観察']
  const typeTag = tags.find(tag => typeTags.includes(tag))
  return typeTag || '分析'
}

export default async function Journal() {
  let articles: ContentArticle[] = []
  let error: string | null = null

  try {
    const response = await getJournalArticles(12)
    articles = response.contents

  } catch (err) {
    console.error('❌ Journal記事取得エラー:', err)
    error = err instanceof Error ? err.message : 'データ取得に失敗しました'
  }
  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h1 className="heading-xl mb-8">JOURNAL</h1>
          <p className="body-lg text-secondary max-w-2xl">
            医療の外縁から見える景色を、様々な視点で描き出すエッセイやインタビュー。
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-6 py-2 rounded-full border border-stone-200 hover:bg-stone-100 transition-colors"
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-8">
              <strong>データ取得エラー:</strong> {error}
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-secondary">記事がまだありません。</p>
              </div>
            ) : (
              articles.map((article) => (
                <Link key={article.id} href={`/journal/${article.slug === '1234' ? article.id : article.slug}`}>
                  <article className="group cursor-pointer">
                    <div className="aspect-[16/9] bg-stone-200 mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-accent">
                          {getTypeLabel(article.tags)}
                        </span>
                        <span className="text-xs text-stone-400">
                          {formatDate(article.published_at)}
                        </span>
                      </div>
                      <h3 className="heading-md group-hover:text-accent transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-secondary">
                        {article.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 border border-stone-200 rounded-full hover:bg-stone-100 transition-colors">
              もっと読む
            </button>
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