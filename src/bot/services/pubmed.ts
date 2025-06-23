import axios from 'axios'
import { subDays, format } from 'date-fns'
import { PubMedPaper } from '../types'

export class PubMedService {
  private readonly baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
  
  /**
   * 指定した日数前からのがん関連論文を取得
   * @param days 過去何日分を取得するか
   * @returns 論文配列
   */
  async fetchCancerPapers(days: number = 14): Promise<PubMedPaper[]> {
    try {
      // 検索クエリの構築
      const endDate = new Date()
      const startDate = subDays(endDate, days)
      
      const query = this.buildSearchQuery(startDate, endDate)
      
      // 1. 論文IDを検索
      const pmids = await this.searchPapers(query)
      
      if (pmids.length === 0) {
        console.log('⚠️ 該当する論文が見つかりませんでした')
        return []
      }
      
      console.log(`🔍 ${pmids.length}件の論文IDを取得`)
      
      // 2. 論文の詳細情報を取得
      const papers = await this.fetchPaperDetails(pmids)
      
      return papers
      
    } catch (error) {
      console.error('❌ PubMed論文取得エラー:', error)
      throw error
    }
  }
  
  /**
   * がん関連論文の検索クエリを構築
   */
  private buildSearchQuery(startDate: Date, endDate: Date): string {
    const startDateStr = format(startDate, 'yyyy/MM/dd')
    const endDateStr = format(endDate, 'yyyy/MM/dd')
    
    // がん関連キーワード + 臨床試験 + 日付範囲
    const cancerTerms = [
      'cancer',
      'neoplasm',
      'tumor',
      'carcinoma',
      'oncology'
    ].join(' OR ')
    
    const clinicalTerms = [
      'clinical trial',
      'randomized controlled trial',
      'phase I',
      'phase II',
      'phase III',
      'treatment',
      'therapy'
    ].join(' OR ')
    
    return `(${cancerTerms}) AND (${clinicalTerms}) AND ${startDateStr}:${endDateStr}[pdat]`
  }
  
  /**
   * 論文IDを検索
   */
  private async searchPapers(query: string): Promise<string[]> {
    const response = await axios.get(`${this.baseUrl}/esearch.fcgi`, {
      params: {
        db: 'pubmed',
        term: query,
        retmax: 500, // 500件でテスト実行
        retmode: 'json',
        sort: 'relevance'
      }
    })
    
    return response.data.esearchresult?.idlist || []
  }
  
  /**
   * 論文の詳細情報を取得
   */
  private async fetchPaperDetails(pmids: string[]): Promise<PubMedPaper[]> {
    const batchSize = 20 // APIの制限に配慮
    const papers: PubMedPaper[] = []
    
    for (let i = 0; i < pmids.length; i += batchSize) {
      const batch = pmids.slice(i, i + batchSize)
      const batchPapers = await this.fetchBatch(batch)
      papers.push(...batchPapers)
      
      // API制限対策で少し待機
      if (i + batchSize < pmids.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    return papers
  }
  
  /**
   * バッチで論文詳細を取得
   */
  private async fetchBatch(pmids: string[]): Promise<PubMedPaper[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/efetch.fcgi`, {
        params: {
          db: 'pubmed',
          id: pmids.join(','),
          retmode: 'xml'
        }
      })
      
      return this.parseXmlResponse(response.data, pmids)
      
    } catch (error) {
      console.error('❌ 論文詳細取得エラー:', error)
      return []
    }
  }
  
  /**
   * PubMed XMLレスポンスをパース
   */
  private parseXmlResponse(xmlData: string, pmids: string[]): PubMedPaper[] {
    // 簡単なXMLパース（本格実装ではxml2jsライブラリを使用）
    const papers: PubMedPaper[] = []
    
    try {
      // タイトルの抽出
      const titleMatches = xmlData.match(/<ArticleTitle>(.*?)<\/ArticleTitle>/g) || []
      // アブストラクトの抽出
      const abstractMatches = xmlData.match(/<AbstractText[^>]*>(.*?)<\/AbstractText>/g) || []
      // ジャーナルの抽出
      const journalMatches = xmlData.match(/<Title>(.*?)<\/Title>/g) || []
      
      pmids.forEach((pmid, index) => {
        if (index < titleMatches.length) {
          const title = titleMatches[index]?.replace(/<[^>]*>/g, '') || ''
          const abstract = abstractMatches[index]?.replace(/<[^>]*>/g, '') || ''
          const journal = journalMatches[index]?.replace(/<[^>]*>/g, '') || ''
          
          if (title && abstract) {
            papers.push({
              id: pmid,
              title: title.trim(),
              abstract: abstract.trim(),
              authors: [], // 簡易版では省略
              publishDate: new Date().toISOString(),
              journal: journal.trim(),
              pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
            })
          }
        }
      })
      
    } catch (error) {
      console.error('❌ XMLパースエラー:', error)
    }
    
    return papers
  }
} 