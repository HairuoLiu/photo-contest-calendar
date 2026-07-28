import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format an ISO date string (YYYY-MM-DD) for display. */
export function formatDeadline(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${y} 年 ${m} 月 ${d} 日`
}

/** Human-friendly "days left" label, relative to today (midnight). */
export function daysLeftLabel(iso: string, today = new Date()): string {
  const deadline = new Date(iso + 'T00:00:00')
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = Math.round(
    (deadline.getTime() - base.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diff < 0) return `已截止 ${Math.abs(diff)} 天`
  if (diff === 0) return '今天截止'
  if (diff === 1) return '明天截止'
  if (diff <= 7) return `本周截止 · 剩 ${diff} 天`
  if (diff <= 30) return `剩 ${diff} 天`
  return `还有 ${diff} 天`
}

/** Tailwind classes for the category badge. */
export const CATEGORY_STYLES: Record<string, string> = {
  Nature: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Wildlife: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  Portrait: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Street: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Documentary: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  Landscape: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Mobile: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Underwater: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  Architecture: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  Open: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Abstract: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  Travel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
}

export function categoryStyle(category: string): string {
  return (
    CATEGORY_STYLES[category] ??
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  )
}

/** Tailwind dot color for a competition category (used in month cells). */
export const CATEGORY_DOT: Record<string, string> = {
  Nature: 'bg-emerald-400',
  Wildlife: 'bg-lime-400',
  Portrait: 'bg-rose-400',
  Street: 'bg-amber-400',
  Documentary: 'bg-sky-400',
  Landscape: 'bg-teal-400',
  Mobile: 'bg-violet-400',
  Underwater: 'bg-cyan-400',
  Architecture: 'bg-indigo-400',
  Open: 'bg-orange-400',
  Abstract: 'bg-fuchsia-400',
  Travel: 'bg-blue-400',
}

export function categoryDot(category: string): string {
  return CATEGORY_DOT[category] ?? 'bg-slate-400'
}

/** Country flag emoji for a competition's region. Global has no country flag. */
export const REGION_FLAG: Record<string, string> = {
  Global: '',
  Japan: '🇯🇵',
  UK: '🇬🇧',
  USA: '🇺🇸',
  France: '🇫🇷',
  Germany: '🇩🇪',
  China: '🇨🇳',
  Italy: '🇮🇹',
  Netherlands: '🇳🇱',
  Switzerland: '🇨🇭',
  Spain: '🇪🇸',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
}

export function regionFlag(region: string): string {
  return REGION_FLAG[region] ?? ''
}

/** Resolve a fee string (e.g. 'Free', '$30', '€25', '£12') to display info. */
export function feeInfo(fee: string): { free: boolean; label: string; cls: string } {
  const f = (fee ?? '').trim()
  if (f === '' || f.toLowerCase() === 'free') {
    return {
      free: true,
      label: '免费',
      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    }
  }
  return {
    free: false,
    label: f,
    cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  }
}
