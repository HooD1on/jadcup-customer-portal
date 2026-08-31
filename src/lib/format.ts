export function formatCurrency(value: number, locale = 'en-NZ'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
  }).format(value);
}

// 后端的 DateTime 字段存的是 UTC,但 EF Core/Pomelo 读出来的 Kind 是 Unspecified,
// 序列化时不会带 Z 后缀(比如 "2026-07-28T04:54:54")。这种"有时间但没有时区标记"的
// 字符串,JS 的 Date 构造函数会当成浏览器本地时间解析,而不是 UTC——等于完全没转换,
// 会导致显示的日期在新西兰时区下错后(最多)一天。这里补上 Z 强制按 UTC 解析,再交给
// Intl.DateTimeFormat 用浏览器本地时区渲染。纯日期字符串(没有 T,比如 "2026-08-14")
// 不受影响,规范本身就把它当 UTC 午夜处理,不需要补。
function parseAsUtc(dateStr: string): Date {
  const hasTimezoneMarker = /Z$|[+-]\d{2}:\d{2}$/.test(dateStr);
  const hasTimeComponent = dateStr.includes('T');
  return new Date(hasTimeComponent && !hasTimezoneMarker ? `${dateStr}Z` : dateStr);
}

export function formatDate(dateStr: string, locale = 'en-NZ'): string {
  const date = parseAsUtc(dateStr);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDate(dateStr: string, locale = 'en-NZ'): string {
  const date = parseAsUtc(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale.startsWith('zh') ? '今天' : 'Today';
  if (diffDays === 1) return locale.startsWith('zh') ? '昨天' : 'Yesterday';
  if (diffDays < 7) return locale.startsWith('zh') ? `${diffDays} 天前` : `${diffDays} days ago`;
  return formatDate(dateStr, locale);
}
