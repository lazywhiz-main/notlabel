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
        summary: '評価エラーのため要約を生成できませんでした',
        title_simplified: paper.title,
        keywords: [],
        cancer_types: [],
        treatment_outcomes: [],
        research_stage: ['unknown - 不明・判定できない'],
        japan_availability: ['unknown - 不明・情報不足'],
        patient_keywords: [],
        difficulty_level: 'intermediate' as const,
        cancer_specificity: 'general'
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

【生成内容】
- score: 1-5点の評価スコア
- shouldPublish: 投稿価値があるかの判定（true/false）
- reason: 評価理由を簡潔に説明
- summary: 研究内容を患者・家族向けに1-2文で要約
- title_simplified: 患者・家族が理解しやすいタイトルに変換
- keywords: 患者・家族が検索しそうなキーワード（3-5個）

【論文情報】
タイトル: ${paper.title}
要旨: ${paper.abstract}
ジャーナル: ${paper.journal}

【出力形式】JSONで以下の形式で返してください。
**重要**: すべてのメタデータフィールドの値は、下記のPhase 1メタデータフィールドで定義されている完全な文字列を使用してください:
\`\`\`json
{
  "score": 4.5,
  "shouldPublish": true,
  "reason": "新しい治療法の有効性を示す臨床試験データで、患者さんの治療選択に役立つ",
  "summary": "新しい免疫療法薬XYZ-101が進行非小細胞肺がんに対して35%の奏効率を示し、副作用も管理可能でした",
  "title_simplified": "進行肺がんに新しい免疫療法薬が効果を示す臨床試験結果",
  "keywords": ["免疫療法", "肺がん", "臨床試験", "新薬"],
  "cancer_types": ["lung_cancer - 肺がん"],
  "treatment_outcomes": ["survival_extension - 生存期間延長", "qol_improvement - QOL改善", "side_effect_reduction - 副作用軽減"],
  "research_stage": ["clinical_trial_phase2 - 臨床試験（第2相）・有効性評価"],
  "japan_availability": ["clinical_trial - 臨床試験中・治験参加可能"],
  "patient_keywords": ["new_drug - 新薬", "side_effects - 副作用", "survival_rate - 生存率", "immunotherapy - 免疫療法"],
  "difficulty_level": "intermediate"
}
\`\`\`

【メタデータ生成ガイド】
以下のフィールドは、下記の完全な文字列から選択してください。選択肢以外の値は使用しないでください。

- cancer_types: 対象のがん種（配列形式）
- treatment_outcomes: 期待される成果（配列形式）  
- research_stage: 研究段階（単一文字列）
- japan_availability: 日本での利用可能性（単一文字列）
- patient_keywords: 患者・家族が検索しそうなキーワード（配列形式）
- difficulty_level: 理解の難易度（"beginner": 一般向け, "intermediate": 医療知識必要, "advanced": 専門的）

**重要**: 各フィールドの値は、以下のPhase 1メタデータフィールドで定義されている完全な文字列を使用してください。

## Phase 1 メタデータフィールド（必須）

**研究段階** (research_stage - 複数選択、通常は1個選択):
- basic_research - 基礎研究・メカニズム解明
- preclinical - 前臨床研究・動物実験
- clinical_trial_phase1 - 臨床試験（第1相）・安全性確認
- clinical_trial_phase2 - 臨床試験（第2相）・有効性評価
- clinical_trial_phase3 - 臨床試験（第3相）・大規模比較試験
- clinical_trial_phase4 - 臨床試験（第4相）・市販後調査
- approved - 承認済み・規制当局が承認
- in_practice - 実用化済み・医療現場で使用中
- unknown - 不明・判定できない

**日本での利用可能性** (japan_availability - 複数選択、通常は1個選択):
- available - 利用可能・保険適用含む
- clinical_trial - 臨床試験中・治験参加可能
- approval_pending - 承認申請中・薬事申請済み
- under_review - 審査中・規制当局審査中
- not_approved - 未承認・日本未導入
- unknown - 不明・情報不足

**がん種分類** (cancer_types - 複数選択可):
- breast_cancer - 乳がん, lung_cancer - 肺がん, colorectal_cancer - 大腸がん, stomach_cancer - 胃がん, liver_cancer - 肝がん, pancreatic_cancer - 膵がん, prostate_cancer - 前立腺がん, ovarian_cancer - 卵巣がん, cervical_cancer - 子宮頸がん, endometrial_cancer - 子宮体がん, bladder_cancer - 膀胱がん, kidney_cancer - 腎がん, thyroid_cancer - 甲状腺がん, brain_tumor - 脳腫瘍, bone_cancer - 骨がん, leukemia - 白血病, lymphoma - リンパ腫, multiple_myeloma - 多発性骨髄腫, skin_cancer - 皮膚がん, other - その他

**治療成果分類** (treatment_outcomes - 複数選択可):
- survival_extension - 生存期間延長, qol_improvement - QOL改善, side_effect_reduction - 副作用軽減, new_treatment - 新治療法, diagnostic_accuracy - 診断精度向上, early_detection - 早期発見, recurrence_prevention - 再発予防, pain_management - 疼痛管理, treatment_response - 治療効果予測, personalized_medicine - 個別化医療

**患者向けキーワード** (patient_keywords - 複数選択可):
- new_drug - 新薬, side_effects - 副作用, survival_rate - 生存率, quality_of_life - 生活の質, clinical_trial - 臨床試験, immunotherapy - 免疫療法, chemotherapy - 化学療法, radiation_therapy - 放射線療法, surgery - 手術, targeted_therapy - 分子標的療法, precision_medicine - 精密医療, biomarker - バイオマーカー, screening - 検診, early_stage - 早期, advanced_stage - 進行期, metastasis - 転移, recurrence - 再発, palliative_care - 緩和ケア, family_support - 家族支援, second_opinion - セカンドオピニオン

## Phase 2 メタデータフィールド（任意）

**がん種分類** (cancer_types - 複数選択可):
- 追加のがん種がある場合は、ここに追加してください

**治療成果分類** (treatment_outcomes - 複数選択可):
- 追加の治療成果がある場合は、ここに追加してください

**患者向けキーワード** (patient_keywords - 複数選択可):
- 追加の患者向けキーワードがある場合は、ここに追加してください

**がん腫特異性の分類**:
- cancer_specificity: 以下から選択
  * 'specific': 特定のがん種に限定された研究（例：乳がんのHER2標的療法）
  * 'pan_cancer': 複数がん種に共通する研究（例：免疫チェックポイント阻害薬）
  * 'general': がん全般に関する研究（例：緩和ケア、QOL改善）

**判定基準**:
- タイトルと要約で言及されるがん種が1つ → 'specific'
- 複数がん種または「cancer」「tumor」「neoplasm」等の一般用語 → 'pan_cancer'  
- 症状管理、QOL、緩和ケア等の横断的テーマ → 'general'

レスポンスはJSONフォーマットで：
{
  "score": 数値,
  "shouldPublish": boolean,
  "summary": "要約文",
  "cancer_types": ["配列"],
  "treatment_outcomes": ["配列"], 
  "research_stage": "値",
  "japan_availability": "値",
  "patient_keywords": ["配列"],
  "difficulty_level": "値",
  "cancer_specificity": "値"
}

**重要**: 各フィールドの値は、以下のPhase 1メタデータフィールドで定義されている完全な文字列を使用してください。

## Phase 1 メタデータフィールド（必須）

**研究段階** (research_stage - 複数選択、通常は1個選択):
- basic_research - 基礎研究・メカニズム解明
- preclinical - 前臨床研究・動物実験
- clinical_trial_phase1 - 臨床試験（第1相）・安全性確認
- clinical_trial_phase2 - 臨床試験（第2相）・有効性評価
- clinical_trial_phase3 - 臨床試験（第3相）・大規模比較試験
- clinical_trial_phase4 - 臨床試験（第4相）・市販後調査
- approved - 承認済み・規制当局が承認
- in_practice - 実用化済み・医療現場で使用中
- unknown - 不明・判定できない

**日本での利用可能性** (japan_availability - 複数選択、通常は1個選択):
- available - 利用可能・保険適用含む
- clinical_trial - 臨床試験中・治験参加可能
- approval_pending - 承認申請中・薬事申請済み
- under_review - 審査中・規制当局審査中
- not_approved - 未承認・日本未導入
- unknown - 不明・情報不足

**がん種分類** (cancer_types - 複数選択可):
- breast_cancer - 乳がん, lung_cancer - 肺がん, colorectal_cancer - 大腸がん, stomach_cancer - 胃がん, liver_cancer - 肝がん, pancreatic_cancer - 膵がん, prostate_cancer - 前立腺がん, ovarian_cancer - 卵巣がん, cervical_cancer - 子宮頸がん, endometrial_cancer - 子宮体がん, bladder_cancer - 膀胱がん, kidney_cancer - 腎がん, thyroid_cancer - 甲状腺がん, brain_tumor - 脳腫瘍, bone_cancer - 骨がん, leukemia - 白血病, lymphoma - リンパ腫, multiple_myeloma - 多発性骨髄腫, skin_cancer - 皮膚がん, other - その他

**治療成果分類** (treatment_outcomes - 複数選択可):
- survival_extension - 生存期間延長, qol_improvement - QOL改善, side_effect_reduction - 副作用軽減, new_treatment - 新治療法, diagnostic_accuracy - 診断精度向上, early_detection - 早期発見, recurrence_prevention - 再発予防, pain_management - 疼痛管理, treatment_response - 治療効果予測, personalized_medicine - 個別化医療

**患者向けキーワード** (patient_keywords - 複数選択可):
- new_drug - 新薬, side_effects - 副作用, survival_rate - 生存率, quality_of_life - 生活の質, clinical_trial - 臨床試験, immunotherapy - 免疫療法, chemotherapy - 化学療法, radiation_therapy - 放射線療法, surgery - 手術, targeted_therapy - 分子標的療法, precision_medicine - 精密医療, biomarker - バイオマーカー, screening - 検診, early_stage - 早期, advanced_stage - 進行期, metastasis - 転移, recurrence - 再発, palliative_care - 緩和ケア, family_support - 家族支援, second_opinion - セカンドオピニオン

## Phase 2 メタデータフィールド（任意）

**がん種分類** (cancer_types - 複数選択可):
- 追加のがん種がある場合は、ここに追加してください

**治療成果分類** (treatment_outcomes - 複数選択可):
- 追加の治療成果がある場合は、ここに追加してください

**患者向けキーワード** (patient_keywords - 複数選択可):
- 追加の患者向けキーワードがある場合は、ここに追加してください`
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