export function dateToStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayStr(): string {
  return dateToStr(new Date())
}

export function strToDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/** Whole days from date `a` to date `b` (b - a). */
export function daysBetween(a: string, b: string): number {
  const da = strToDate(a)
  const db = strToDate(b)
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24))
}

export function prettyDate(s: string): string {
  const d = strToDate(s)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff === -1) return '明天'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
