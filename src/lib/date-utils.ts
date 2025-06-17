/**
 * 日本時間（JST）を統一的に扱うためのユーティリティ関数
 */

/**
 * 日本時間でフォーマットされた日付文字列を取得
 */
export function formatDateJST(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    ...options,
    timeZone: 'Asia/Tokyo'
  });
}

/**
 * 日本時間でフォーマットされた日時文字列を取得
 */
export function formatDateTimeJST(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ja-JP', {
    ...options,
    timeZone: 'Asia/Tokyo'
  });
}

/**
 * 日本時間での現在の時刻（時）を取得
 */
export function getCurrentHourJST(): number {
  return parseInt(new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: 'numeric',
    hour12: false
  }));
}

/**
 * 日本時間での短縮形式（月/日 時:分）
 */
export function formatShortDateTimeJST(date: Date | string): string {
  return formatDateTimeJST(date, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 日本時間での詳細形式（年月日 時:分）
 */
export function formatDetailedDateTimeJST(date: Date | string): string {
  return formatDateTimeJST(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} 