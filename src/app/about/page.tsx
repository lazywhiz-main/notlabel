import Navigation from '@/components/Navigation'

export default function About() {
  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h1 className="heading-xl mb-8">ME≠LABELとは</h1>
          <p className="body-lg text-secondary max-w-2xl">
            病気や肩書きによって人が社会からラベリングされ、排除される構造に抗い、
            "ただのわたし"として生きることを応援するメディアです。
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="prose prose-stone lg:prose-lg max-w-4xl mx-auto">
            <h2>なぜ今、ラベリングに抗うのか</h2>
            <p>
              私たちは、医療や福祉の現場で、そして日常生活の中で、様々なラベルを付与されます。
              診断名、障害名、症状名—。それらは時として必要な「名付け」かもしれません。
              しかし同時に、そのラベルによって、個人の豊かな生が単純化され、
              社会からの理解や共感が遮断されてしまう現実があります。
            </p>

            <h2>医療の"外"から世界を編みなおす</h2>
            <p>
              ME≠LABELは、医療の枠組みの中だけでは捉えきれない人間の生を見つめ直すメディアです。
              病いや障害とともに生きることは、単なる「患者」や「当事者」としてではなく、
              一人の人間として世界と向き合うことでもあります。
              私たちは、そんな視点から新しい物語を紡ぎ出していきたいと考えています。
            </p>

            <h2>編集部について</h2>
            <p>
              ME≠LABELは、医療・ビジネス・デザインなど、
              様々な分野の専門性を持つメンバーによって運営されています。
              医療の現場経験、ビジネス開発の知見、UXデザインの視点を組み合わせることで、
              医療と社会の接点に新しい対話の場を作ることを目指しています。
            </p>

            <blockquote>
              私たちは、誰もが自分らしく生きられる社会を目指して、
              既存の枠組みを問い直し、新しい物語を紡ぎ出していきます。
            </blockquote>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h2 className="heading-lg mb-12">編集チーム</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member Card - メンバーA */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="aspect-square bg-stone-200 rounded-full w-32 mx-auto mb-6" />
              <h3 className="heading-md text-center mb-2">メンバーA</h3>
              <p className="text-secondary text-center">
                医療機器メーカー、製薬会社、医療ベンチャーでの事業開発経験を持つ。
                医療を「外側」から捉える視点で、新しい価値創造に取り組んでいる。
              </p>
            </div>
            
            {/* Team Member Card - メンバーB */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="aspect-square bg-stone-200 rounded-full w-32 mx-auto mb-6" />
              <h3 className="heading-md text-center mb-2">メンバーB</h3>
              <p className="text-secondary text-center">
                デザイナーとして医療分野でのUXリサーチに豊富な経験を持つ。
                人間中心設計の視点から、医療における新しい体験を創造している。
              </p>
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