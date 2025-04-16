import Navigation from '@/components/Navigation'

const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'series', label: '連載' },
  { id: 'interview', label: 'インタビュー' },
  { id: 'column', label: 'コラム' },
]

const articles = [
  {
    id: 1,
    title: '医療の境界線を超えて：ある精神科医の問い',
    excerpt: '診断名は、時として人を理解する助けとなり、時として壁となる。30年の臨床経験から見えてきた、医療の可能性と限界について。',
    category: 'interview',
    image: '/placeholder.jpg',
    date: '2024.03.21',
  },
  {
    id: 2,
    title: '「普通」という幻想：社会が作るラベルの正体',
    excerpt: '私たちは知らず知らずのうちに、「普通」という基準で人を判断していないだろうか。その無意識の排除の構造を考える。',
    category: 'series',
    image: '/placeholder.jpg',
    date: '2024.03.18',
  },
  {
    id: 3,
    title: '病いとともに、それでも前を向いて',
    excerpt: '慢性疾患と共に生きる中で見つけた、新しい生き方のヒント。医療の枠を超えた、もうひとつの物語。',
    category: 'column',
    image: '/placeholder.jpg',
    date: '2024.03.15',
  },
  // Add more articles as needed
]

export default function Journal() {
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

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="group">
                <div className="aspect-[16/9] bg-stone-200 mb-4" />
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-accent">
                      {categories.find(c => c.id === article.category)?.label}
                    </span>
                    <span className="text-xs text-stone-400">{article.date}</span>
                  </div>
                  <h3 className="heading-md group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-secondary">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            ))}
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