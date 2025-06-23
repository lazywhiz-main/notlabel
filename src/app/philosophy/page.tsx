import Navigation from '@/components/Navigation'
import { getPhilosophyArticles, type ContentArticle } from '@/lib/microcms'
import Link from 'next/link'

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit'
  }).replace(/\//g, '.')
}

export default async function Philosophy() {
  let essays: ContentArticle[] = []
  let error: string | null = null

  try {
    const response = await getPhilosophyArticles(9)
    essays = response.contents
  } catch (err) {
    console.error('❌ Philosophy記事取得エラー:', err)
    error = err instanceof Error ? err.message : 'データ取得に失敗しました'
  }
  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h1 className="heading-xl mb-8">PHILOSOPHY</h1>
          <p className="body-lg text-secondary max-w-2xl">
            医療と社会の接点で生まれる問いを、哲学的な視点から掘り下げます。
          </p>
        </div>
      </section>

      {/* Featured Essay */}
      <section className="py-24">
        <div className="container-custom">
          <div className="prose prose-stone lg:prose-lg max-w-4xl mx-auto">
            <h2 className="heading-lg !mt-0">編集部からの問い</h2>
            <blockquote className="text-2xl font-serif not-italic border-l-accent">
              医療は、人間の生をどこまで理解できるのか。
              そして、その限界の先に何があるのか。
            </blockquote>
            <p className="text-secondary">
              ME≠LABELは、医療という枠組みを相対化しながら、
              人間の生の複雑さと豊かさを捉えなおすことを試みています。
              それは、既存の価値観や制度に対する批判的な問いかけであると同時に、
              新しい物語の可能性を探る営みでもあります。
            </p>
          </div>
        </div>
      </section>

      {/* Essays Grid */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">哲学的エッセイ</h2>
          
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-8">
              <strong>データ取得エラー:</strong> {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {essays.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-secondary">記事がまだありません。</p>
              </div>
            ) : (
              essays.map((essay) => (
                <Link key={essay.id} href={`/philosophy/${essay.slug}`}>
                  <article className="bg-white p-8 rounded-lg shadow-sm group cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-stone-400">
                        <span>{essay.author}</span>
                        <span>{formatDate(essay.published_at)}</span>
                      </div>
                      <h3 className="heading-md group-hover:text-accent transition-colors">
                        {essay.title}
                      </h3>
                      <p className="text-secondary">
                        {essay.excerpt}
                      </p>
                      <div className="pt-4">
                        <span className="text-accent hover:underline">
                          続きを読む →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="heading-lg">対話への招待</h2>
            <p className="body-lg text-secondary">
              私たちの問いかけに、あなたの視点を重ねてみませんか？
              医療と社会の新しい関係性を、共に探っていきましょう。
            </p>
            <button className="px-8 py-3 bg-accent text-white rounded-full hover:bg-red-600 transition-colors">
              議論に参加する
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