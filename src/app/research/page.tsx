'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import ResearchFilters, { type FilterOptions } from '@/components/ResearchFilters'
import { getResearchArticlesClient, type ResearchArticleClient } from '@/lib/microcms-client'
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

// フィルタリング関数
const filterArticles = (articles: ResearchArticleClient[], filters: FilterOptions): ResearchArticleClient[] => {
  return articles.filter(article => {
    // 検索テキストでのフィルタリング
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      const titleMatch = article.title.toLowerCase().includes(searchTerm)
      const summaryMatch = article.summary.toLowerCase().includes(searchTerm)
      const tagsMatch = article.tags?.toLowerCase().includes(searchTerm)
      if (!titleMatch && !summaryMatch && !tagsMatch) return false
    }

    // がん種フィルタ
    if (filters.cancer_types.length > 0) {
      const articleCancerTypes = article.cancer_types || []
      const hasMatch = filters.cancer_types.some(filter => 
        articleCancerTypes.some(type => type.includes(filter))
      )
      if (!hasMatch) return false
    }

    // 治療成果フィルタ
    if (filters.treatment_outcomes.length > 0) {
      const articleOutcomes = article.treatment_outcomes || []
      const hasMatch = filters.treatment_outcomes.some(filter => 
        articleOutcomes.some(outcome => outcome.includes(filter))
      )
      if (!hasMatch) return false
    }

    // 研究段階フィルタ
    if (filters.research_stage.length > 0) {
      const articleStages = Array.isArray(article.research_stage) ? article.research_stage : []
      const hasMatch = filters.research_stage.some(filter => 
        articleStages.some((stage: string) => stage.includes(filter))
      )
      if (!hasMatch) return false
    }

    // 日本での利用可能性フィルタ
    if (filters.japan_availability.length > 0) {
      const articleAvailabilities = Array.isArray(article.japan_availability) ? article.japan_availability : []
      const hasMatch = filters.japan_availability.some(filter => 
        articleAvailabilities.some((availability: string) => availability.includes(filter))
      )
      if (!hasMatch) return false
    }

    // がん腫特異性フィルタ
    if (filters.cancer_specificity.length > 0) {
      const articleSpecificities = Array.isArray(article.cancer_specificity) ? article.cancer_specificity : []
      const hasMatch = filters.cancer_specificity.some(filter => 
        articleSpecificities.some((specificity: string) => specificity.includes(filter))
      )
      if (!hasMatch) return false
    }

    // 難易度フィルタ
    if (filters.difficulty.length > 0) {
      const articleDifficulties = Array.isArray(article.difficulty) ? article.difficulty : []
      const hasMatch = filters.difficulty.some(filter => 
        articleDifficulties.some((difficulty: string) => difficulty.includes(filter))
      )
      if (!hasMatch) return false
    }

    return true
  })
}

export default function Research() {
  const [allArticles, setAllArticles] = useState<ResearchArticleClient[]>([])
  const [filteredArticles, setFilteredArticles] = useState<ResearchArticleClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初期データ取得
  useEffect(() => {
    async function fetchArticles() {
      try {
        console.log('🔍 microCMSからデータを取得中...')
        // API Route経由でデータを取得
        const data = await getResearchArticlesClient(100)
        const articles = data.contents
        console.log(`✅ ${articles.length}件の記事を取得`)
        
        setAllArticles(articles)
        setFilteredArticles(articles)
      } catch (err) {
        console.error('❌ データ取得エラー:', err)
        setError(err instanceof Error ? err.message : 'データ取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // フィルタ変更時の処理
  const handleFilterChange = (filters: FilterOptions) => {
    const filtered = filterArticles(allArticles, filters)
    setFilteredArticles(filtered)
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-16">
        <Navigation />
        <div className="container-custom py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p>記事を読み込み中...</p>
          </div>
        </div>
      </main>
    )
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
              <div className="text-2xl font-bold text-accent mb-1">{filteredArticles.length}</div>
              <div className="text-sm text-secondary">表示中の記事</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">{allArticles.length}</div>
              <div className="text-sm text-secondary">総記事数</div>
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

      {/* Main Content */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="heading-lg">AI要約記事</h2>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span>自動更新中</span>
            </div>
          </div>

          {/* フィルタリングコンポーネント */}
          <ResearchFilters 
            onFilterChange={handleFilterChange}
            articlesCount={filteredArticles.length}
          />

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary">
                {allArticles.length === 0 
                  ? '記事がまだありません。Bot実行後、記事が表示されます。'
                  : '選択した条件に一致する記事が見つかりませんでした。フィルタを調整してください。'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredArticles.map((article) => (
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
                            minute: '2-digit',
                            timeZone: 'Asia/Tokyo'
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
                    {/* メタデータ表示 */}
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-2">
                        <span className="bg-stone-100 px-2 py-1 rounded">{article.research_type || '研究'}</span>
                        <span>{article.journal || 'Journal'}</span>
                        <span>{article.publish_date ? new Date(article.publish_date).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '日付不明'}</span>
                        <span className="font-mono">{article.pubmed_id || 'PMID: 不明'}</span>
                      </div>
                      
                      {/* Phase 1 メタデータ */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {article.cancer_types?.map((type, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                            🎯 {type}
                          </span>
                        ))}
                        {article.treatment_outcomes?.map((outcome, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                            📈 {outcome}
                          </span>
                        ))}
                        {article.research_stage && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                            🔬 {article.research_stage}
                          </span>
                        )}
                        {article.japan_availability && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                            🏥 {article.japan_availability}
                          </span>
                        )}
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
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 患者向けキーワード */}
                    {article.patient_keywords && article.patient_keywords.length > 0 && (
                      <div className="border-t border-stone-100 pt-4">
                        <div className="text-xs text-stone-500 mb-2">患者・当事者向けキーワード：</div>
                        <div className="flex flex-wrap gap-2">
                          {article.patient_keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <Link 
                        href={`/research/${article.slug}`}
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        記事を読む →
                      </Link>
                      {article.original_url && (
                        <a 
                          href={article.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-500 hover:text-stone-700 text-xs"
                        >
                          原論文を見る ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
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