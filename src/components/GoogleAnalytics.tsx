'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// Google Analytics tracking function
export const trackGAEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Page view tracking
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
    })
  }
}

// Research-specific events
export const trackResearchEvent = {
  // 記事閲覧
  viewArticle: (articleTitle: string, articleId: string) => {
    trackGAEvent({
      action: 'view_article',
      category: 'research',
      label: `${articleTitle} (${articleId})`,
    })
  },
  
  // フィルタ使用
  useFilter: (filterType: string, filterValue: string) => {
    trackGAEvent({
      action: 'use_filter',
      category: 'research',
      label: `${filterType}: ${filterValue}`,
    })
  },
  
  // 検索使用
  search: (searchTerm: string, resultsCount: number) => {
    trackGAEvent({
      action: 'search',
      category: 'research',
      label: searchTerm,
      value: resultsCount,
    })
  },
  
  // 外部リンククリック
  clickExternalLink: (linkType: 'pubmed' | 'original_paper', articleId: string) => {
    trackGAEvent({
      action: 'click_external_link',
      category: 'research',
      label: `${linkType} - ${articleId}`,
    })
  },
  
  // ページネーション
  changePage: (pageNumber: number, totalPages: number) => {
    trackGAEvent({
      action: 'change_page',
      category: 'research',
      label: `Page ${pageNumber} of ${totalPages}`,
      value: pageNumber,
    })
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // Load Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    // Initialize Google Analytics
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        send_page_view: true
      });
    `
    document.head.appendChild(script2)

    return () => {
      // Cleanup
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  // Track page changes
  useEffect(() => {
    if (pathname && GA_MEASUREMENT_ID) {
      trackPageView(window.location.href)
    }
  }, [pathname])

  return null
} 