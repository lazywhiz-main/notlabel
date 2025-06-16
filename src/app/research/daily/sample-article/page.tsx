import Navigation from '@/components/Navigation'

const article = {
  id: 1,
  title: 'がん免疫療法の新たな可能性：CD8+ T細胞活性化メカニズムの解明',
  originalTitle: 'Enhanced CD8+ T Cell Activation Through Novel Checkpoint Inhibitor Combinations in Advanced Melanoma',
  authors: 'Smith JA, Johnson KL, Williams RF, et al.',
  summary: '進行性メラノーマ患者において、新しいチェックポイント阻害薬の組み合わせによりCD8+ T細胞の活性化が大幅に向上し、従来の治療法と比較して生存率が30%改善されたことが報告されました。',
  pubmedId: 'PMID: 38234567',
  pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/38234567/',
  journal: 'Nature Medicine',
  publishDate: '2024.03.21',
  researchType: '臨床試験',
  difficulty: 'intermediate',
  readTime: '3分',
  aiGeneratedAt: '2024.03.22 06:00',
  aiModel: 'GPT-4',
  lastUpdated: '2024.03.22 08:30',
}

export default function AIArticlePage() {
  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* AI Notice Header */}
      <div className="bg-accent text-white">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="font-medium">AI生成記事</span>
              </div>
              <div className="text-teal-200 text-sm">
                {article.aiGeneratedAt}に{article.aiModel}により生成
              </div>
            </div>
            <div className="text-right text-sm text-teal-200">
              <div>最終更新: {article.lastUpdated}</div>
              <div>読了時間: {article.readTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 bg-stone-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-stone-500">
              <a href="/" className="hover:text-stone-700">TOP</a>
              <span className="mx-2">&gt;</span>
              <a href="/research" className="hover:text-stone-700">RESEARCH</a>
              <span className="mx-2">&gt;</span>
              <span>AI要約記事</span>
            </nav>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">中級</span>
              <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded text-sm">{article.researchType}</span>
              <span className="text-stone-500 text-sm">{article.journal}</span>
              <span className="text-stone-500 text-sm">{article.publishDate}</span>
            </div>

            {/* Title */}
            <h1 className="heading-xl mb-6">{article.title}</h1>

            {/* Original Title */}
            <div className="mb-8 p-4 bg-stone-100 rounded-lg">
              <div className="text-sm text-stone-600 mb-2">📄 原論文タイトル</div>
              <div className="italic text-stone-800">{article.originalTitle}</div>
              <div className="text-sm text-stone-600 mt-2">
                著者: {article.authors}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* AI Disclaimer */}
            <div className="mb-8 bg-stone-50 border-l-4 border-accent p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl mt-1">⚠️</span>
                <div>
                  <h3 className="font-medium text-stone-900 mb-2">重要な注意事項</h3>
                  <p className="text-secondary text-sm leading-relaxed mb-3">
                    この記事はAIにより自動生成されています。医療に関する決定を行う際は、必ず医療専門家にご相談ください。
                    内容の正確性について編集部で確認していますが、最新の研究動向を知るための参考情報としてご利用ください。
                  </p>
                  <div className="flex items-center gap-4 text-xs text-accent">
                    <span>使用AI: {article.aiModel}</span>
                    <span>生成日時: {article.aiGeneratedAt}</span>
                    <a href={article.pubmedUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      PubMed原文を確認 →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-stone lg:prose-lg max-w-none">
              {/* Summary */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-serif text-stone-900 mt-0 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>研究の要約</span>
                </h2>
                <p className="text-secondary text-base leading-relaxed mb-0">
                  {article.summary}
                </p>
              </div>

              {/* Main Content */}
              <h2>🔬 研究内容をわかりやすく</h2>
              <p>
                この研究では、進行性メラノーマ（皮膚がんの一種）の患者さん180名を対象に、
                新しいタイプの免疫治療薬の組み合わせを試験しました。
                免疫治療とは、患者さん自身の免疫システムを活性化してがん細胞と戦わせる治療法です。
              </p>

              <h3>🧬 CD8+ T細胞とは？</h3>
              <p>
                CD8+ T細胞は、私たちの体の中でがん細胞を直接攻撃する「戦士」のような働きをする免疫細胞です。
                しかし、がん細胞は巧妙にこの免疫システムから逃れようとします。
                今回の研究では、この「戦士」をより強力に活性化する方法が見つかりました。
              </p>

              <h3>📊 研究結果のポイント</h3>
              <ul>
                <li><strong>生存率の改善</strong>: 従来の治療と比較して30%の生存率向上</li>
                <li><strong>副作用の管理</strong>: 重篤な副作用は従来治療と同程度</li>
                <li><strong>効果の持続性</strong>: 治療効果が12ヶ月以上持続</li>
              </ul>

              <h2>💭 ME≠LABEL視点での考察</h2>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                <p className="text-secondary italic">
                  この研究結果は確かに希望的ですが、私たちは「治療の数字」だけでなく、
                  それが患者さんの日常生活にどのような意味を持つのかを考える必要があります。
                  生存率の向上は重要ですが、その間の生活の質、家族との時間、
                  自分らしく生きることの意味も同じくらい大切です。
                </p>
              </div>

              <h2>🏥 患者・当事者にとっての意味</h2>
              <h3>現在治療中の方へ</h3>
              <p>
                この研究は将来的な治療選択肢の可能性を示していますが、
                現在の治療を急に変更する必要はありません。
                気になることがあれば、担当医師との相談の際にこの研究について聞いてみることをお勧めします。
              </p>

              <h3>ご家族の方へ</h3>
              <p>
                新しい治療法の研究は続いていることを知り、希望を持ち続けることは大切です。
                同時に、今この瞬間の大切な人との時間を大切にすることも忘れないでください。
              </p>

              <h2>🔗 関連情報</h2>
              <div className="bg-stone-50 rounded-lg p-6">
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href={article.pubmedUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      📄 PubMed原文 ({article.pubmedId})
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-accent hover:underline">
                      🏥 免疫治療について - がん情報サービス
                    </a>
                  </li>
                  <li>
                    <a href="/voices" className="text-accent hover:underline">
                      💬 治療体験談 - ME≠LABEL VOICES
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Generation Info */}
            <div className="mt-12 bg-stone-100 rounded-lg p-6">
              <h3 className="font-medium text-stone-900 mb-4 flex items-center gap-2">
                <span>🤖</span>
                <span>AI生成情報</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-stone-600">
                <div>
                  <div className="font-medium mb-2">生成設定</div>
                  <ul className="space-y-1">
                    <li>使用AI: {article.aiModel}</li>
                    <li>生成日時: {article.aiGeneratedAt}</li>
                    <li>翻訳言語: 英語 → 日本語</li>
                    <li>対象読者: 一般向け</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-2">品質管理</div>
                  <ul className="space-y-1">
                    <li>医学的内容: 編集部確認済み</li>
                    <li>最終更新: {article.lastUpdated}</li>
                    <li>校正状況: 自動校正完了</li>
                    <li>ファクトチェック: 基本情報のみ</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="mt-8 text-center">
              <div className="bg-white border border-stone-200 rounded-lg p-6">
                <h3 className="font-medium text-stone-900 mb-4">この記事についてのフィードバック</h3>
                <div className="flex items-center justify-center gap-4">
                  <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors">
                    👍 わかりやすい
                  </button>
                                      <button className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors">
                      💡 改善提案
                    </button>
                  <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors">
                    💬 コメントする
                  </button>
                </div>
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