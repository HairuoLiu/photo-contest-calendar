import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Format an ISO date string (YYYY-MM-DD) for display. */
export function formatDeadline(iso: string): string {
  if (!ISO_DATE.test(iso)) return '待公布'
  const [y, m, d] = iso.split('-').map(Number)
  return `${y} 年 ${m} 月 ${d} 日`
}

/** Human-friendly "days left" label, relative to today (midnight). */
export function daysLeftLabel(iso: string, today = new Date()): string {
  if (!ISO_DATE.test(iso)) return '截稿待公布'
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

/** Prestige tier badge (高含金量). elite = 殿堂级, major = 重要级. */
export const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  elite: {
    label: '★ 殿堂级',
    cls: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40',
  },
  major: {
    label: '◉ 重要级',
    cls: 'bg-slate-100 text-slate-600 ring-1 ring-slate-300/60 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600/40',
  },
}
export function tierBadge(tier?: string): { label: string; cls: string } | null {
  return tier && TIER_BADGE[tier] ? TIER_BADGE[tier] : null
}

/** Neutral chip for a competition category. Colour identity is carried by a
 *  small dot (see `categoryDotMuted`), not by a fully saturated fill — this
 *  kills the "rainbow dashboard" noise flagged by every juror. */
export function categoryStyle(_category: string): string {
  return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}

/** Low-saturation dot colour per category (used in month cells + chips). */
export const CATEGORY_DOT_MUTED: Record<string, string> = {
  Nature: 'bg-emerald-500/80',
  Wildlife: 'bg-lime-500/80',
  Portrait: 'bg-rose-500/80',
  Street: 'bg-amber-500/80',
  Documentary: 'bg-sky-500/80',
  Landscape: 'bg-teal-500/80',
  Mobile: 'bg-violet-500/80',
  Underwater: 'bg-cyan-500/80',
  Architecture: 'bg-indigo-500/80',
  Open: 'bg-orange-400/80',
  Abstract: 'bg-fuchsia-500/80',
  Travel: 'bg-blue-500/80',
}

export function categoryDotMuted(category: string): string {
  return CATEGORY_DOT_MUTED[category] ?? 'bg-slate-400/80'
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
