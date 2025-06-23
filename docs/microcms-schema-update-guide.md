# microCMS articles API スキーマ更新ガイド（Phase 1）

## 🎯 目的
Research ページのフィルター・検索機能実装のため、`articles` APIに新しいメタデータフィールドを追加します。

## 📋 追加するフィールド

### **1. cancer_types（がん種分類）**
- **フィールドID**: `cancer_types`
- **表示名**: がん種分類
- **フィールドタイプ**: 複数選択
- **必須**: いいえ（オプショナル）
- **選択肢**:
  ```
  breast_cancer - 乳がん
  lung_cancer - 肺がん
  colorectal_cancer - 大腸がん
  stomach_cancer - 胃がん
  liver_cancer - 肝がん
  pancreatic_cancer - 膵がん
  prostate_cancer - 前立腺がん
  ovarian_cancer - 卵巣がん
  cervical_cancer - 子宮頸がん
  endometrial_cancer - 子宮体がん
  bladder_cancer - 膀胱がん
  kidney_cancer - 腎がん
  thyroid_cancer - 甲状腺がん
  brain_tumor - 脳腫瘍
  bone_cancer - 骨がん
  leukemia - 白血病
  lymphoma - リンパ腫
  multiple_myeloma - 多発性骨髄腫
  skin_cancer - 皮膚がん
  other - その他
  ```

### **2. treatment_outcomes（治療成果分類）**
- **フィールドID**: `treatment_outcomes`
- **表示名**: 治療成果分類
- **フィールドタイプ**: 複数選択
- **必須**: いいえ（オプショナル）
- **選択肢**:
  ```
  survival_extension - 生存期間延長
  qol_improvement - QOL改善
  side_effect_reduction - 副作用軽減
  new_treatment - 新治療法
  diagnostic_accuracy - 診断精度向上
  early_detection - 早期発見
  recurrence_prevention - 再発予防
  pain_management - 疼痛管理
  treatment_response - 治療効果予測
  personalized_medicine - 個別化医療
  ```

### **3. research_stage（研究段階）**
- **フィールドID**: `research_stage`
- **表示名**: 研究段階
- **フィールドタイプ**: セレクト（単一選択）
- **必須**: いいえ（オプショナル）
- **選択肢**:
  ```
  basic_research - 基礎研究・メカニズム解明
  preclinical - 前臨床研究・動物実験
  clinical_trial_phase1 - 臨床試験（第1相）・安全性確認
  clinical_trial_phase2 - 臨床試験（第2相）・有効性評価
  clinical_trial_phase3 - 臨床試験（第3相）・大規模比較試験
  clinical_trial_phase4 - 臨床試験（第4相）・市販後調査
  approved - 承認済み・規制当局が承認
  in_practice - 実用化済み・医療現場で使用中
  unknown - 不明・判定できない
  ```

### **4. japan_availability（日本での利用可能性）**
- **フィールドID**: `japan_availability`
- **表示名**: 日本での利用可能性
- **フィールドタイプ**: セレクト（単一選択）
- **必須**: いいえ（オプショナル）
- **選択肢**:
  ```
  available - 利用可能・保険適用含む
  clinical_trial - 臨床試験中・治験参加可能
  approval_pending - 承認申請中・薬事申請済み
  under_review - 審査中・規制当局審査中
  not_approved - 未承認・日本未導入
  unknown - 不明・情報不足
  ```

### **5. patient_keywords（患者向けキーワード）**
- **フィールドID**: `patient_keywords`
- **表示名**: 患者向けキーワード
- **フィールドタイプ**: 複数選択
- **必須**: いいえ（オプショナル）
- **選択肢**:
  ```
  new_drug - 新薬
  side_effects - 副作用
  survival_rate - 生存率
  quality_of_life - 生活の質
  clinical_trial - 臨床試験
  immunotherapy - 免疫療法
  chemotherapy - 化学療法
  radiation_therapy - 放射線療法
  surgery - 手術
  targeted_therapy - 分子標的療法
  precision_medicine - 精密医療
  biomarker - バイオマーカー
  screening - 検診
  early_stage - 早期
  advanced_stage - 進行期
  metastasis - 転移
  recurrence - 再発
  palliative_care - 緩和ケア
  family_support - 家族支援
  second_opinion - セカンドオピニオン
  ```

## 🔧 設定手順

### **Step 1: microCMSダッシュボードにアクセス**
1. microCMSダッシュボードにログイン
2. 「API」メニューから「articles」を選択
3. 「フィールド編集」をクリック

### **Step 2: フィールドを順番に追加**
各フィールドを上記の仕様通りに追加してください。

**注意事項**:
- 全てのフィールドを「必須ではない」に設定
- 既存記事への影響を避けるため、オプショナルフィールドとして追加
- フィールドIDは正確に入力（コードで参照されるため）

### **Step 3: 保存と確認**
1. 全フィールド追加後、「保存」をクリック
2. 既存記事が正常に表示されることを確認
3. 新しいフィールドが正常に表示されることを確認

## 🤖 ボット動作への影響

### **既存記事への影響**
- **影響なし**: 既存の32記事は全て正常に動作継続
- 新フィールドは`undefined`として扱われ、エラーは発生しません

### **新規記事投稿**
- ボット更新後の新規記事には自動でメタデータが設定されます
- 投稿処理に失敗した場合、ログで原因を確認できます

## 📊 期待される効果

### **フィルター機能**
- がん種別フィルター
- 治療成果別フィルター  
- 研究段階別フィルター
- 日本での利用可能性フィルター

### **検索機能**
- 患者向けキーワードでの検索
- 複合条件での絞り込み

### **ユーザー体験向上**
- 記事発見効率の大幅向上
- 患者・家族のニーズに合った情報提供

## ⚠️ 注意事項

1. **フィールドID**: 必ず指定された通りに設定してください
2. **下位互換性**: 既存フィールドは絶対に変更しないでください
3. **テスト**: 設定後は必ず動作確認を行ってください
4. **バックアップ**: 設定前に現在の状態を記録しておいてください

## 🚀 実装後の次のステップ

1. **ボット更新**: 新フィールドを生成するようボットを更新
2. **フロントエンド実装**: フィルター・検索機能の実装
3. **テスト**: 全体的な動作確認
4. **最適化**: パフォーマンス調整

この更新により、Researchページが劇的に使いやすくなります！🎯 