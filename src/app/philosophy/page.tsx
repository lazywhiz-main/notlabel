import Navigation from '@/components/Navigation'

const essays = [
  {
    id: 1,
    title: 'わたしたちは、なぜ"医療の外"を語るのか',
    excerpt: '医療は人を救うためのシステムであり、同時に人を分類し、ラベリングするシステムでもある。その二重性の中で、私たちは何を見出すことができるのか。',
    author: '編集部',
    date: '2024.03.21',
  },
  {
    id: 2,
    title: '"健康"という言葉が持つ暴力性',
    excerpt: '「健康であること」は、しばしば道徳的な価値として語られる。しかし、その価値観は本当に普遍的なものなのだろうか。',
    author: '編集部',
    date: '2024.03.18',
  },
  {
    id: 3,
    title: '治すことは救うことか？',
    excerpt: '医療の究極の目的は「治療」なのか。それとも、別の可能性があるのか。医療の本質的な意味を問い直す。',
    author: '編集部',
    date: '2024.03.15',
  },
]

export default function Philosophy() {
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {essays.map((essay) => (
              <article key={essay.id} className="bg-white p-8 rounded-lg shadow-sm group">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-stone-400">
                    <span>{essay.author}</span>
                    <span>{essay.date}</span>
                  </div>
                  <h3 className="heading-md group-hover:text-accent transition-colors">
                    {essay.title}
                  </h3>
                  <p className="text-secondary">
                    {essay.excerpt}
                  </p>
                  <div className="pt-4">
                    <button className="text-accent hover:underline">
                      続きを読む →
                    </button>
                  </div>
                </div>
              </article>
            ))}
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