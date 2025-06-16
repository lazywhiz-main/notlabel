import OpenAI from 'openai'
import { PubMedPaper, PaperEvaluation } from '../types'

export class OpenAIService {
  private openai: OpenAI
  
  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey
    })
  }
  
  /**
   * 論文をスコアリングして評価を返す
   */
  async evaluatePaper(paper: PubMedPaper): Promise<PaperEvaluation> {
    try {
      const prompt = this.buildEvaluationPrompt(paper)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'あなたはがん研究に詳しい医療ライターです。論文をスコアリングして、患者さんや家族にとって価値のある内容かどうかを評価してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
      
      const result = response.choices[0].message.content
      if (!result) {
        throw new Error('OpenAI APIからの応答が空です')
      }
      
      return JSON.parse(result) as PaperEvaluation
      
    } catch (error) {
      console.error('❌ 論文評価エラー:', error)
      
      // デフォルト値を返す
      return {
        score: 0,
        shouldPublish: false,
        reason: 'エラーにより評価できませんでした',
        summary: '評価エラー',
        title_simplified: paper.title,
        keywords: []
      }
    }
  }
  
  /**
   * 評価済み論文から記事本文を生成
   */
  async generateArticle(paper: PubMedPaper, evaluation: PaperEvaluation): Promise<string> {
    try {
      const prompt = this.buildArticlePrompt(paper, evaluation)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'あなたはがん領域に詳しい医療ライターです。がん患者と家族が理解できるよう配慮したMarkdown記事を生成してください。HTMLタグは使わず、純粋なMarkdown形式で出力してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
      
      return response.choices[0].message.content || ''
      
    } catch (error) {
      console.error('❌ 記事生成エラー:', error)
      throw error
    }
  }
  
  /**
   * 論文評価用プロンプトを構築
   */
  private buildEvaluationPrompt(paper: PubMedPaper): string {
    return `以下の論文が、がん患者さんや家族にとって価値のある内容かどうか、5点満点で評価し、わかりやすいタイトルと要約を作ってください。

【評価観点】
1. 臨床研究であるか（人間対象）
2. 治療・予後など、生活に関わる成果があるか
3. がん種が明確であるか
4. 治療選択肢の拡大や生活の質向上に関わるか

【論文情報】
タイトル: ${paper.title}
要旨: ${paper.abstract}
ジャーナル: ${paper.journal}

【出力形式】JSONで以下の形式で返してください:
{
  "score": 4.5,
  "shouldPublish": true,
  "reason": "評価の理由を簡潔に説明",
  "summary": "一言で要約した内容",
  "title_simplified": "一般の方にもわかりやすいタイトル",
  "keywords": ["がん種", "治療法", "臨床試験"]
}`
  }
  
  /**
   * 記事生成用プロンプトを構築
   */
  private buildArticlePrompt(paper: PubMedPaper, evaluation: PaperEvaluation): string {
    return `以下の情報を元に、がん患者と家族が理解できるよう配慮した記事をMarkdown形式で生成してください。

【論文情報】
タイトル: ${paper.title}
要旨: ${paper.abstract}
ジャーナル: ${paper.journal}
PubMed URL: ${paper.pubmedUrl}

【評価結果】
わかりやすいタイトル: ${evaluation.title_simplified}
要約: ${evaluation.summary}
キーワード: ${evaluation.keywords.join(', ')}

【記事構成】
# ${evaluation.title_simplified}

## 🔍 一言で言うと
${evaluation.summary}

## 🧪 研究の概要
論文の内容を平易に解説してください。専門用語は避け、一般の方にもわかりやすく説明してください。

## 💡 なぜこの研究が大事なの？
臨床的な意義、患者さんにとっての意味を説明してください。

## 🔬 今後の展望
今後の臨床試験、実用化の可能性について説明してください。

## 🧠 用語の補足
専門用語がある場合は、わかりやすく解説してください。

## 🔗 出典情報
- 論文タイトル：${paper.title}
- ジャーナル：${paper.journal}
- PubMedリンク：${paper.pubmedUrl}

【注意事項】
- 過度な期待を抱かせるような表現は避けてください
- 「必ず治る」「万能薬」などの断定的な表現は使用しないでください
- 患者さんの心に寄り添うような温かみのある文章にしてください
- 医療判断については必ず医師に相談するよう促してください

【出力形式】
- 純粋なMarkdown形式で出力してください
- HTMLタグ（<p>、<div>等）は一切使用しないでください
- 見出しは#、##、###を使用してください`
  }
} 