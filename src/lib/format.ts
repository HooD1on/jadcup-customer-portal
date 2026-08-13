export function formatCurrency(value: number, locale = 'en-NZ'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string, locale = 'en-NZ'): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDate(dateStr: string, locale = 'en-NZ'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale.startsWith('zh') ? '今天' : 'Today';
  if (diffDays === 1) return locale.startsWith('zh') ? '昨天' : 'Yesterday';
  if (diffDays < 7) return locale.startsWith('zh') ? `${diffDays} 天前` : `${diffDays} days ago`;
  return formatDate(dateStr, locale);
}
