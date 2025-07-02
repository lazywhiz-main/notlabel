'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import ResearchFilters, { type FilterOptions } from '@/components/ResearchFilters'
import { getAllResearchArticlesClient, type ResearchArticleClient } from '@/lib/microcms-client'
import Link from 'next/link'


const ARTICLES_PER_PAGE = 20 // 1ページあたりの記事数

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

    // 患者向けキーワードフィルタ
    if (filters.patient_keywords.length > 0) {
      const articleKeywords = Array.isArray(article.patient_keywords) ? article.patient_keywords : []
      const hasMatch = filters.patient_keywords.some(filter => 
        articleKeywords.some((keyword: string) => keyword.includes(filter))
      )
      if (!hasMatch) return false
    }

    return true
  })
}

export default function Research() {
  const [allArticles, setAllArticles] = useState<ResearchArticleClient[]>([])
  const [displayedArticles, setDisplayedArticles] = useState<ResearchArticleClient[]>([])
  const [filteredArticles, setFilteredArticles] = useState<ResearchArticleClient[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)

  // 初期データ取得（全件取得してフィルタリング用）
  useEffect(() => {
    async function fetchAllArticles() {
      try {
        console.log('🔍 microCMSからデータを取得中...')
        // 公式ドキュメントに従った全件取得を実行
        const data = await getAllResearchArticlesClient() // 全件取得
        const articles = data.contents
        console.log(`✅ ${articles.length}件の記事を取得`)
        
        setAllArticles(articles)
        setFilteredArticles(articles)
        setTotalCount(data.totalCount)
        
        // 最初のページを表示
        const firstPageArticles = articles.slice(0, ARTICLES_PER_PAGE)
        setDisplayedArticles(firstPageArticles)
        setHasNextPage(articles.length > ARTICLES_PER_PAGE)
      } catch (err) {
        console.error('❌ データ取得エラー:', err)
        setError(err instanceof Error ? err.message : 'データ取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchAllArticles()
  }, [])

  // SEO用のStructured Data
  useEffect(() => {
    if (typeof window !== 'undefined' && allArticles.length > 0) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "がん研究論文 AI要約記事一覧",
        "description": "PubMedから収集されたがん関連の最新論文をAI技術により患者・当事者目線でわかりやすく要約した記事コレクション",
        "url": window.location.href,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": allArticles.length,
          "itemListElement": allArticles.slice(0, 10).map((article, index) => ({
            "@type": "Article",
            "position": index + 1,
            "name": article.title,
            "description": article.summary,
            "url": `${window.location.origin}/research/${article.slug}`,
            "datePublished": article.published_at,
            "dateModified": article.updatedAt,
            "author": {
              "@type": "Organization",
              "name": "ME≠LABEL AI Research Bot"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ME≠LABEL",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            }
          }))
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "ホーム",
              "item": window.location.origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Research",
              "item": window.location.href
            }
          ]
        }
      }

      // 既存のstructured dataを削除
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }

      // 新しいstructured dataを追加
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)

      // ページタイトルとメタデータを動的に設定
      document.title = `がん研究AI要約 (${allArticles.length}件) - ME≠LABEL Research`
      
      // メタデータの設定
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `PubMedから毎日収集される${allArticles.length}件のがん関連最新論文をAI技術により患者・当事者目線でわかりやすく要約。生存率向上、症状緩和、QOL向上に関する研究情報を提供。`
        )
      }

      return () => {
        // クリーンアップ
        const script = document.querySelector('script[type="application/ld+json"]')
        if (script) {
          script.remove()
        }
      }
    }
  }, [allArticles])

  // フィルタ変更時の処理
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    const filtered = filterArticles(allArticles, filters)
    setFilteredArticles(filtered)
    
    // フィルタ適用後は最初のページを表示
    setCurrentPage(1)
    const firstPageArticles = filtered.slice(0, ARTICLES_PER_PAGE)
    setDisplayedArticles(firstPageArticles)
    setHasNextPage(filtered.length > ARTICLES_PER_PAGE)
  }, [allArticles])

  // 無限スクロール用の記事追加読み込み
  const loadMoreArticles = useCallback(() => {
    if (loadingMore || !hasNextPage) return
    
    setLoadingMore(true)
    
    // 次のページの記事を取得
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * ARTICLES_PER_PAGE
    const endIndex = startIndex + ARTICLES_PER_PAGE
    const nextPageArticles = filteredArticles.slice(startIndex, endIndex)
    
    if (nextPageArticles.length > 0) {
      setDisplayedArticles(prev => [...prev, ...nextPageArticles])
      setCurrentPage(nextPage)
      setHasNextPage(endIndex < filteredArticles.length)
    } else {
      setHasNextPage(false)
    }
    
    setLoadingMore(false)
  }, [currentPage, filteredArticles, loadingMore, hasNextPage])

  // ページネーション（ページ番号クリック）
  const goToPage = useCallback((page: number) => {
    const startIndex = (page - 1) * ARTICLES_PER_PAGE
    const endIndex = startIndex + ARTICLES_PER_PAGE
    const pageArticles = filteredArticles.slice(0, endIndex) // 指定ページまでの全記事
    
    setDisplayedArticles(pageArticles)
    setCurrentPage(page)
    setHasNextPage(endIndex < filteredArticles.length)
    
    // スクロール位置をトップに移動
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filteredArticles])

  // 無限スクロールの監視
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreArticles()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreArticles])

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

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)

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
              <div className="text-3xl font-bold text-accent mb-2">{totalCount}</div>
              <div className="text-sm text-stone-600">総記事数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{filteredArticles.length}</div>
              <div className="text-sm text-stone-600">検索結果</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{displayedArticles.length}</div>
              <div className="text-sm text-stone-600">表示中</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{Math.ceil(totalCount / 30)}</div>
              <div className="text-sm text-stone-600">月間更新数</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Articles */}
      <section className="py-16">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <ResearchFilters 
                  onFilterChange={handleFilterChange}
                  articlesCount={filteredArticles.length}
                />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="lg:col-span-3">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-stone-400 text-xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-stone-700 mb-2">検索結果が見つかりません</h3>
                  <p className="text-stone-500">フィルターを調整して再度お試しください。</p>
                </div>
              ) : (
                <>
                  {/* 記事一覧 */}
                  <div className="grid gap-8 mb-12">
                    {displayedArticles.map((article) => (
                      <article 
                        key={article.id} 
                        className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        itemScope
                        itemType="http://schema.org/Article"
                      >
                        {/* 記事のヘッダー情報 */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
                            {getDifficultyLabel(article.difficulty)}
                          </span>
                          <span className="text-stone-500 text-sm">{article.read_time}</span>
                          <time className="text-stone-400 text-sm" itemProp="datePublished" dateTime={article.published_at}>
                            {new Date(article.published_at).toLocaleDateString('ja-JP')}
                          </time>
                        </div>

                        {/* タイトルと要約 */}
                        <h2 className="text-xl font-semibold text-stone-900 mb-3 leading-tight" itemProp="headline">
                          <Link 
                            href={`/research/${article.slug}`}
                            className="hover:text-accent transition-colors"
                            itemProp="url"
                          >
                            {article.title}
                          </Link>
                        </h2>
                        
                        <p className="text-stone-600 mb-4 leading-relaxed line-clamp-3" itemProp="description">
                          {article.summary}
                        </p>

                        {/* メタデータバッジ */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {/* がん種 */}
                          {article.cancer_types?.slice(0, 2).map((type, index) => (
                            <span key={`cancer-${index}`} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded" itemProp="about">
                              {type.split(' - ')[1] || type}
                            </span>
                          ))}
                          
                          {/* 治療成果 */}
                          {article.treatment_outcomes?.slice(0, 1).map((outcome, index) => (
                            <span key={`outcome-${index}`} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {outcome.split(' - ')[1] || outcome}
                            </span>
                          ))}
                          
                          {/* 研究段階 */}
                          {article.research_stage && article.research_stage.length > 0 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              {article.research_stage[0]?.split(' - ')[1] || article.research_stage[0]}
                            </span>
                          )}
                          
                          {/* 日本での利用可能性 */}
                          {article.japan_availability && article.japan_availability.length > 0 && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                              {article.japan_availability[0]?.split(' - ')[1] || article.japan_availability[0]}
                            </span>
                          )}
                          
                          {/* 患者向けキーワード（最大2個） */}
                          {article.patient_keywords?.slice(0, 2).map((keyword, index) => (
                            <span key={`keyword-${index}`} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                              {keyword.split(' - ')[1] || keyword}
                            </span>
                          ))}
                          
                          {/* がん腫特異性 */}
                          {article.cancer_specificity && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {Array.isArray(article.cancer_specificity)
                                ? (article.cancer_specificity[0] === 'specific' ? '特定がん種' : 
                                   article.cancer_specificity[0] === 'pan_cancer' ? '複数がん種' : 'がん全般')
                                : (article.cancer_specificity === 'specific' ? '特定がん種' : 
                                   article.cancer_specificity === 'pan_cancer' ? '複数がん種' : 'がん全般')
                              }
                            </span>
                          )}
                        </div>

                        {/* 記事情報 */}
                        <div className="flex items-center justify-between text-sm text-stone-500">
                          <div className="flex items-center gap-4">
                            <span itemProp="publisher">📄 {article.journal}</span>
                            <span>🔗 PubMed ID: {article.pubmed_id}</span>
                          </div>
                          <Link 
                            href={`/research/${article.slug}`}
                            className="text-accent hover:text-accent-dark font-medium"
                          >
                            詳細を読む →
                          </Link>
                        </div>

                        {/* 隠れたStructured Data */}
                        <meta itemProp="author" content="ME≠LABEL AI Research Bot" />
                        <meta itemProp="dateModified" content={article.updatedAt} />
                      </article>
                    ))}
                  </div>

                  {/* ページネーション */}
                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <nav className="flex items-center gap-2" role="navigation" aria-label="ページネーション">
                        {/* 前のページ */}
                        <button
                          onClick={() => goToPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="前のページへ"
                        >
                          前へ
                        </button>

                        {/* ページ番号 */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index
                          if (pageNum > totalPages) return null
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-2 text-sm border rounded-md ${
                                pageNum === currentPage
                                  ? 'bg-accent text-white border-accent'
                                  : 'border-stone-300 hover:bg-stone-50'
                              }`}
                              aria-label={`ページ${pageNum}へ`}
                              aria-current={pageNum === currentPage ? 'page' : undefined}
                            >
                              {pageNum}
                            </button>
                          )
                        })}

                        {/* 次のページ */}
                        <button
                          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm border border-stone-300 rounded-md hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="次のページへ"
                        >
                          次へ
                        </button>
                      </nav>
                    </div>
                  )}

                  {/* 無限スクロール読み込み中 */}
                  {loadingMore && (
                    <div className="text-center py-8" role="status" aria-live="polite">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
                      <p className="text-stone-500">記事を読み込み中...</p>
                    </div>
                  )}

                  {/* すべて読み込み完了 */}
                  {!hasNextPage && displayedArticles.length > ARTICLES_PER_PAGE && (
                    <div className="text-center py-8">
                      <p className="text-stone-500">すべての記事を表示しました</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 