'use client'

import { useState } from 'react'

export interface FilterOptions {
  cancer_types: string[]
  treatment_outcomes: string[]
  research_stage: string[]
  japan_availability: string[]
  difficulty: string[]
  cancer_specificity: string[]
  patient_keywords: string[]
  searchTerm: string
}

interface Props {
  onFilterChange: (filters: FilterOptions) => void
  articlesCount?: number
}

// フィルタ選択肢の定義（OpenAIサービスと一致）
const FILTER_OPTIONS = {
  cancer_types: [
    { value: 'lung_cancer', label: '肺がん' },
    { value: 'breast_cancer', label: '乳がん' },
    { value: 'colorectal_cancer', label: '大腸がん' },
    { value: 'stomach_cancer', label: '胃がん' },
    { value: 'liver_cancer', label: '肝がん' },
    { value: 'pancreatic_cancer', label: '膵がん' },
    { value: 'prostate_cancer', label: '前立腺がん' },
    { value: 'ovarian_cancer', label: '卵巣がん' },
    { value: 'cervical_cancer', label: '子宮頸がん' },
    { value: 'endometrial_cancer', label: '子宮体がん' },
    { value: 'bladder_cancer', label: '膀胱がん' },
    { value: 'kidney_cancer', label: '腎がん' },
    { value: 'thyroid_cancer', label: '甲状腺がん' },
    { value: 'brain_tumor', label: '脳腫瘍' },
    { value: 'bone_cancer', label: '骨がん' },
    { value: 'leukemia', label: '白血病' },
    { value: 'lymphoma', label: 'リンパ腫' },
    { value: 'multiple_myeloma', label: '多発性骨髄腫' },
    { value: 'skin_cancer', label: '皮膚がん' },
    { value: 'other', label: 'その他' }
  ],
  treatment_outcomes: [
    { value: 'survival_improvement', label: '生存率向上' },
    { value: 'symptom_relief', label: '症状緩和' },
    { value: 'qol_improvement', label: 'QOL向上' },
    { value: 'side_effect_reduction', label: '副作用軽減' },
    { value: 'progression_delay', label: '進行抑制' },
    { value: 'early_detection', label: '早期発見' }
  ],
  research_stage: [
    { value: 'clinical_trial_phase1', label: '臨床試験（第1相）' },
    { value: 'clinical_trial_phase2', label: '臨床試験（第2相）' },
    { value: 'clinical_trial_phase3', label: '臨床試験（第3相）' },
    { value: 'basic_research', label: '基礎研究' },
    { value: 'observational_study', label: '観察研究' },
    { value: 'meta_analysis', label: 'メタ解析' }
  ],
  japan_availability: [
    { value: 'available', label: '利用可能・保険適用含む' },
    { value: 'clinical_trial', label: '臨床試験中・治験参加可能' },
    { value: 'approval_pending', label: '承認申請中・薬事申請済み' },
    { value: 'under_review', label: '審査中・規制当局審査中' },
    { value: 'not_approved', label: '未承認・日本未導入' },
    { value: 'unknown', label: '不明・情報不足' }
  ],
  difficulty: [
    { value: 'beginner', label: '基礎レベル' },
    { value: 'intermediate', label: '中級レベル' },
    { value: 'advanced', label: '専門レベル' }
  ],
  cancer_specificity: [
    { value: 'specific', label: '特定がん種限定' },
    { value: 'pan_cancer', label: '複数がん種共通' },
    { value: 'general', label: 'がん全般' }
  ],
  patient_keywords: [
    { value: 'new_drug', label: '新薬' },
    { value: 'side_effects', label: '副作用' },
    { value: 'survival_rate', label: '生存率' },
    { value: 'quality_of_life', label: '生活の質' },
    { value: 'clinical_trial', label: '臨床試験' },
    { value: 'immunotherapy', label: '免疫療法' },
    { value: 'chemotherapy', label: '化学療法' },
    { value: 'radiation_therapy', label: '放射線療法' },
    { value: 'surgery', label: '手術' },
    { value: 'targeted_therapy', label: '分子標的療法' },
    { value: 'precision_medicine', label: '精密医療' },
    { value: 'biomarker', label: 'バイオマーカー' }
  ]
}

export default function ResearchFilters({ onFilterChange, articlesCount }: Props) {
  const [filters, setFilters] = useState<FilterOptions>({
    cancer_types: [],
    treatment_outcomes: [],
    research_stage: [],
    japan_availability: [],
    difficulty: [],
    cancer_specificity: [],
    patient_keywords: [],
    searchTerm: ''
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (category: keyof FilterOptions, value: string | string[]) => {
    const newFilters = {
      ...filters,
      [category]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleCheckboxChange = (category: keyof FilterOptions, option: string) => {
    const currentValues = filters[category] as string[]
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option]
    
    handleFilterChange(category, newValues)
  }

  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      cancer_types: [],
      treatment_outcomes: [],
      research_stage: [],
      japan_availability: [],
      difficulty: [],
      cancer_specificity: [],
      patient_keywords: [],
      searchTerm: ''
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const getActiveFilterCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'searchTerm') return count + (value ? 1 : 0)
      return count + (Array.isArray(value) ? value.length : 0)
    }, 0)
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg mb-8 lg:mb-0 lg:h-fit lg:sticky lg:top-4">
      {/* ヘッダー（コンパクト） */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-stone-900">記事を絞り込む</h3>
          {articlesCount !== undefined && (
            <span className="text-xs text-stone-500">
              {articlesCount}件の記事が見つかりました
            </span>
          )}
          <div className="flex items-center justify-between">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-accent hover:underline"
              >
                クリア ({getActiveFilterCount()})
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              {isExpanded ? '詳細を閉じる' : '詳細を開く'}
              <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* スクロール可能なフィルターコンテンツ */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-150px)]">
        <div className="p-4 space-y-4">
          {/* 検索ボックス */}
          <div>
            <input
              type="text"
              placeholder="記事タイトルや内容を検索..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>

          {/* がん種 */}
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">🔵 がん種</label>
            <div className="grid grid-cols-1 gap-1 border border-blue-200 rounded p-2 max-h-48 overflow-y-auto">
              {FILTER_OPTIONS.cancer_types.map((option) => (
                <label key={option.value} className="flex items-center hover:bg-blue-50 px-1 py-0.5 rounded">
                  <input
                    type="checkbox"
                    checked={filters.cancer_types.includes(option.value)}
                    onChange={() => handleCheckboxChange('cancer_types', option.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 治療成果 */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">🟢 治療成果</label>
            <div className="space-y-1">
              {FILTER_OPTIONS.treatment_outcomes.map((option) => (
                <label key={option.value} className="flex items-center hover:bg-green-50 px-1 py-0.5 rounded">
                  <input
                    type="checkbox"
                    checked={filters.treatment_outcomes.includes(option.value)}
                    onChange={() => handleCheckboxChange('treatment_outcomes', option.value)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-xs">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 難易度 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">📊 難易度</label>
            <div className="space-y-1">
              {FILTER_OPTIONS.difficulty.map((option) => (
                <label key={option.value} className="flex items-center hover:bg-stone-50 px-1 py-0.5 rounded">
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(option.value)}
                    onChange={() => handleCheckboxChange('difficulty', option.value)}
                    className="mr-2 text-accent focus:ring-accent"
                  />
                  <span className="text-xs">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 詳細フィルタ（展開時のみ表示） */}
          {isExpanded && (
            <div className="border-t border-stone-200 pt-4 space-y-4">
              {/* 研究段階 */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">🟣 研究段階</label>
                <div className="space-y-1">
                  {FILTER_OPTIONS.research_stage.map((option) => (
                    <label key={option.value} className="flex items-center hover:bg-purple-50 px-1 py-0.5 rounded">
                      <input
                        type="checkbox"
                        checked={filters.research_stage.includes(option.value)}
                        onChange={() => handleCheckboxChange('research_stage', option.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 日本での利用可能性 */}
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">🟠 日本での利用可能性</label>
                <div className="space-y-1">
                  {FILTER_OPTIONS.japan_availability.map((option) => (
                    <label key={option.value} className="flex items-center hover:bg-orange-50 px-1 py-0.5 rounded">
                      <input
                        type="checkbox"
                        checked={filters.japan_availability.includes(option.value)}
                        onChange={() => handleCheckboxChange('japan_availability', option.value)}
                        className="mr-2 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-xs">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* がん腫特異性 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">⚫ がん腫特異性</label>
                <div className="space-y-1">
                  {FILTER_OPTIONS.cancer_specificity.map((option) => (
                    <label key={option.value} className="flex items-center hover:bg-gray-50 px-1 py-0.5 rounded">
                      <input
                        type="checkbox"
                        checked={filters.cancer_specificity.includes(option.value)}
                        onChange={() => handleCheckboxChange('cancer_specificity', option.value)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-xs">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 患者向けキーワード */}
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-2">🔵 患者向けキーワード</label>
                <div className="grid grid-cols-1 gap-1 border border-teal-200 rounded p-2 max-h-48 overflow-y-auto">
                  {FILTER_OPTIONS.patient_keywords.map((option) => (
                    <label key={option.value} className="flex items-center hover:bg-teal-50 px-1 py-0.5 rounded">
                      <input
                        type="checkbox"
                        checked={filters.patient_keywords.includes(option.value)}
                        onChange={() => handleCheckboxChange('patient_keywords', option.value)}
                        className="mr-2 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-xs">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 