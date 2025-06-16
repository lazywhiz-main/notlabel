import Navigation from '@/components/Navigation'
import { getResearchArticles, type ResearchArticle } from '@/lib/microcms'
import Link from 'next/link'

const getDifficultyColor = (difficulty: string[] | string) => {
  const level = Array.isArray(difficulty) ? difficulty[0] : difficulty
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-700'
    case 'intermediate': return 'bg-yellow-100 text-yellow-700'
    case 'advanced': return 'bg-red-100 text-red-700'
    default: return 'bg-stone-100 text-stone-700'
  }
}

const getDifficultyLabel = (difficulty: string[] | string) => {
  const level = Array.isArray(difficulty) ? difficulty[0] : difficulty
  switch (level) {
    case 'beginner': return '基礎'
    case 'intermediate': return '中級'
    case 'advanced': return '専門'
    default: return '中級'
  }
}

export default async function Research() {
  let articles: ResearchArticle[] = []
  let articlesData: any = { contents: [], totalCount: 0 }
  let error: string | null = null

  try {
    // microCMSから記事データを取得
    console.log('🔍 microCMSからデータを取得中...')
    articlesData = await getResearchArticles(20)
    articles = articlesData.contents
    console.log(`✅ ${articles.length}件の記事を取得`)
  } catch (err) {
    console.error('❌ データ取得エラー:', err)
    error = err instanceof Error ? err.message : 'データ取得に失敗しました'
  }

  return (
    <main className="min-h-screen pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
              <span className="text-accent">🤖</span>
              <span className="text-accent text-sm font-medium">AI Research Bot</span>
            </div>
            <div className="text-sm text-stone-500">毎日 6:00 自動更新</div>
          </div>
          
          <h1 className="heading-xl mb-8">RESEARCH</h1>
          <div className="max-w-3xl">
            <p className="body-lg text-secondary mb-6">
              PubMedから毎日収集されるがん関連の最新論文を、AI技術により患者・当事者目線でわかりやすく要約しています。
            </p>
            

            
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="text-accent text-xl">ℹ️</span>
                <div>
                  <h3 className="font-medium text-stone-900 mb-2">AI生成コンテンツについて</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    これらの記事は人工知能により自動生成されています。医療判断の参考としての使用は避け、
                    詳細については必ず医療専門家にご相談ください。内容の正確性については編集部で確認していますが、
                    最新の研究動向を知るための参考情報としてご活用ください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* エラー表示 */}
      {error && (
        <section className="py-12 bg-red-50">
          <div className="container-custom">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
              <strong>データ取得エラー:</strong> {error}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">{articles.length}</div>
              <div className="text-sm text-secondary">今月の要約記事</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">{articlesData.totalCount}</div>
              <div className="text-sm text-secondary">累計論文数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">15</div>
              <div className="text-sm text-secondary">対象ジャーナル数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">6:00</div>
              <div className="text-sm text-secondary">毎日更新時刻</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest AI Articles */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading-lg">最新のAI要約記事</h2>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span>自動更新中</span>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary">記事がまだありません。</p>
              <p className="text-sm text-stone-400 mt-2">
                Bot実行後、記事が表示されます。
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {articles.map((article) => (
                <article key={article.id} className="border border-stone-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* AI生成バッジ */}
                  <div className="bg-accent text-white px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🤖</span>
                        <span className="font-medium">AI生成記事</span>
                        <span className="text-teal-200 text-sm">|</span>
                        <span className="text-teal-200 text-sm">
                          {article.ai_generated_at ? new Date(article.ai_generated_at).toLocaleString('ja-JP', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '不明'}に生成
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty || 'intermediate')}`}>
                          {getDifficultyLabel(article.difficulty || 'intermediate')}
                        </span>
                        <span className="text-teal-200 text-sm">{article.read_time || '3分'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-2">
                        <span className="bg-stone-100 px-2 py-1 rounded">{article.research_type || '研究'}</span>
                        <span>{article.journal || 'Journal'}</span>
                        <span>{article.publish_date ? new Date(article.publish_date).toLocaleDateString('ja-JP') : '日付不明'}</span>
                        <span className="font-mono">{article.pubmed_id || 'PMID: 不明'}</span>
                      </div>
                    </div>

                    <Link href={`/research/${article.slug}`}>
                      <h3 className="heading-md mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                        {article.title}
                      </h3>
                    </Link>

                    {article.original_title && (
                      <div className="mb-4">
                        <div className="text-xs text-stone-400 mb-1">原論文タイトル：</div>
                        <div className="text-sm text-stone-600 italic">{article.original_title}</div>
                      </div>
                    )}

                    <p className="text-secondary mb-6 leading-relaxed">
                      {article.summary}
                    </p>

                    {/* タグ表示 */}
                    {article.tags && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {article.tags.split(', ').map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-stone-100 text-xs rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Link 
                          href={`/research/${article.slug}`}
                          className="text-accent hover:text-teal-800 text-sm font-medium transition-colors"
                        >
                          続きを読む →
                        </Link>
                        <a 
                          href={article.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:text-primary text-sm transition-colors"
                        >
                          PubMedで確認
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span>🔄 自動翻訳・要約</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More */}
          {articlesData.totalCount > articles.length && (
            <div className="mt-12 text-center">
              <button className="px-8 py-3 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors">
                過去の記事を見る（{articlesData.totalCount - articles.length}件）
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-stone-100">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 text-center">AI要約の仕組み</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-serif text-xl mb-3">1. 論文収集</h3>
              <p className="text-secondary">
                PubMed APIを通じて、がん関連の最新論文を毎日自動収集しています。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-serif text-xl mb-3">2. AI要約</h3>
              <p className="text-secondary">
                専門用語を一般向けに翻訳し、患者・当事者の視点から重要なポイントを抽出します。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-serif text-xl mb-3">3. 品質確認</h3>
              <p className="text-secondary">
                編集部による内容確認を経て、読みやすい形で配信しています。
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