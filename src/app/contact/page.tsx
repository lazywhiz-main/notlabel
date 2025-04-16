import Navigation from '@/components/Navigation'

export default function Contact() {
  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h1 className="heading-xl mb-8">CONTACT</h1>
          <p className="body-lg text-secondary max-w-2xl">
            取材依頼、掲載相談、共創パートナーのご提案など、
            お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  お名前 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  メールアドレス <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">
                  お問い合わせ種別 <span className="text-accent">*</span>
                </label>
                <select
                  id="type"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="interview">取材依頼</option>
                  <option value="publish">掲載相談</option>
                  <option value="partnership">共創パートナー提案</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  お問い合わせ内容 <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-accent text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  送信する
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="heading-lg">共創パートナー募集</h2>
            <p className="body-lg text-secondary">
              ME≠LABELは、医療と社会の新しい関係性を探求する仲間を募集しています。
              医療者、研究者、アーティスト、デザイナー、エンジニアなど、
              様々な分野の方々との協働を歓迎します。
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="heading-md">取材協力</h3>
                <p className="text-secondary">
                  医療現場や当事者の声を丁寧に拾い上げ、
                  新しい物語を紡ぎ出すお手伝いをしていただける方
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="heading-md">コンテンツ制作</h3>
                <p className="text-secondary">
                  文章、写真、イラスト、動画など、
                  様々な表現方法で医療の現場を描き出せる方
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="heading-md">企画運営</h3>
                <p className="text-secondary">
                  オフラインイベントやワークショップの
                  企画・運営にご協力いただける方
                </p>
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