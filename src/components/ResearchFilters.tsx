'use client'

import { useState } from 'react'

export interface FilterOptions {
  cancer_types: string[]
  treatment_outcomes: string[]
  research_stage: string[]
  japan_availability: string[]
  difficulty: string[]
  cancer_specificity: string[]
  searchTerm: string
}

interface Props {
  onFilterChange: (filters: FilterOptions) => void
  articlesCount: number
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
    <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-stone-900">記事を絞り込む</h3>
          <span className="text-sm text-stone-500">
            {articlesCount}件の記事が見つかりました
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-accent hover:underline"
            >
              フィルタをクリア ({getActiveFilterCount()})
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            {isExpanded ? '詳細フィルタを閉じる' : '詳細フィルタを開く'}
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>
      </div>

      {/* 検索ボックス */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="記事タイトルや内容を検索..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      {/* 基本フィルタ（常に表示） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* がん種 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">がん種</label>
          <div className="grid grid-cols-2 gap-2 border border-stone-200 rounded p-3">
            {FILTER_OPTIONS.cancer_types.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.cancer_types.includes(option.value)}
                  onChange={() => handleCheckboxChange('cancer_types', option.value)}
                  className="mr-2 text-accent focus:ring-accent"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 治療成果 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">治療成果</label>
          <div className="space-y-2">
            {FILTER_OPTIONS.treatment_outcomes.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.treatment_outcomes.includes(option.value)}
                  onChange={() => handleCheckboxChange('treatment_outcomes', option.value)}
                  className="mr-2 text-accent focus:ring-accent"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 難易度 */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">難易度</label>
          <div className="space-y-2">
            {FILTER_OPTIONS.difficulty.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.difficulty.includes(option.value)}
                  onChange={() => handleCheckboxChange('difficulty', option.value)}
                  className="mr-2 text-accent focus:ring-accent"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 詳細フィルタ（展開時のみ表示） */}
      {isExpanded && (
        <div className="border-t border-stone-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 研究段階 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">研究段階</label>
              <div className="space-y-2">
                {FILTER_OPTIONS.research_stage.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.research_stage.includes(option.value)}
                      onChange={() => handleCheckboxChange('research_stage', option.value)}
                      className="mr-2 text-accent focus:ring-accent"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 日本での利用可能性 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">日本での利用可能性</label>
              <div className="space-y-2">
                {FILTER_OPTIONS.japan_availability.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.japan_availability.includes(option.value)}
                      onChange={() => handleCheckboxChange('japan_availability', option.value)}
                      className="mr-2 text-accent focus:ring-accent"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* がん腫特異性 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">がん腫特異性</label>
              <div className="space-y-2">
                {FILTER_OPTIONS.cancer_specificity.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.cancer_specificity.includes(option.value)}
                      onChange={() => handleCheckboxChange('cancer_specificity', option.value)}
                      className="mr-2 text-accent focus:ring-accent"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 