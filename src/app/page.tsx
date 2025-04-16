import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-stone-100">
        <div className="container-custom text-center space-y-8">
          <h1 className="heading-xl">
            ME≠LABEL
          </h1>
          <p className="body-lg text-secondary max-w-2xl mx-auto">
            わたしは病名じゃない。
          </p>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 bg-stone-50">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">最新の記事</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article Card Placeholder */}
            {[1, 2, 3].map((i) => (
              <article key={i} className="group">
                <div className="aspect-[16/9] bg-stone-200 mb-4" />
                <div className="space-y-2">
                  <span className="text-xs text-accent">JOURNAL</span>
                  <h3 className="heading-md group-hover:text-accent transition-colors">
                    記事タイトルがここに入ります
                  </h3>
                  <p className="text-secondary">
                    記事の要約がここに入ります。このテキストは実際の記事の内容を反映して更新される予定です。
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">編集部からの問い</h2>
          <div className="prose prose-stone lg:prose-lg max-w-4xl">
            <blockquote className="text-2xl font-serif not-italic border-l-accent">
              医療の"外"から世界を編みなおすとき、わたしたちは何を見出すのだろうか。
            </blockquote>
            <p className="text-secondary">
              病気や障害によって社会から与えられるラベルは、時として私たちの存在を矮小化します。
              しかし、そのラベルを超えて、一人の人間として生きる術を探ることは可能なはずです。
            </p>
          </div>
        </div>
      </section>

      {/* Voices Section */}
      <section className="py-24 bg-stone-50">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">VOICES</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="space-y-4">
              <span className="text-xs text-accent">#生きる言葉</span>
              <h3 className="heading-md">
                ラベルの向こう側で見つけたもの
              </h3>
              <p className="text-secondary">
                診断名を告げられた日から、私の人生は大きく変わりました。
                しかし、それは終わりではなく、新しい始まりでした...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-stone-900 text-stone-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="font-serif text-xl mb-4">ME≠LABEL</h4>
              <p className="text-stone-400 text-sm">
                わたしは病名じゃない。<br />
                医療の外縁やその先にある生のまなざしをテーマに、
                当事者、医療者、表現者の声を交差させるメディア。
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">メニュー</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="/about" className="hover:text-stone-50 transition-colors">ABOUT</a></li>
                <li><a href="/journal" className="hover:text-stone-50 transition-colors">JOURNAL</a></li>
                <li><a href="/philosophy" className="hover:text-stone-50 transition-colors">PHILOSOPHY</a></li>
                <li><a href="/voices" className="hover:text-stone-50 transition-colors">VOICES</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">SNS</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="#" className="hover:text-stone-50 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-stone-50 transition-colors">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">お問い合わせ</h4>
              <a href="/contact" className="text-stone-400 hover:text-stone-50 transition-colors">
                取材・掲載のご相談
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-stone-400 text-sm">
            © 2024 ME≠LABEL All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
