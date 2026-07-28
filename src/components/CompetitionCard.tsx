import { Globe, Send, Users } from 'lucide-react'
import type { Competition } from '../data/competitions'
import {
  categoryDotMuted,
  categoryStyle,
  cn,
  daysLeftLabel,
  feeInfo,
  tierBadge,
} from '../lib/utils'
import { TIER_MAP } from '../data/tiers'
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns'

type Urgency = 'past' | 'urgent' | 'soon' | 'future'

function urgency(deadline: string): { level: Urgency; bar: string; text: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline))
    return { level: 'future', bar: 'bg-slate-300 dark:bg-slate-700', text: 'text-slate-500' }
  const today = startOfDay(new Date())
  const dl = startOfDay(parseISO(deadline))
  const diff = differenceInCalendarDays(dl, today)
  if (diff < 0) return { level: 'past', bar: 'bg-slate-300 dark:bg-slate-700', text: 'text-slate-500' }
  if (diff <= 7) return { level: 'urgent', bar: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' }
  if (diff <= 30) return { level: 'soon', bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' }
  return { level: 'future', bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }
}

interface Props {
  c: Competition
  compact?: boolean
  /** Optional action shown as a button (e.g. "view this day"). */
  action?: { label: string; onClick: () => void }
}

export function CompetitionCard({ c, compact = false, action }: Props) {
  const u = urgency(c.deadline)
  const fee = feeInfo(c.fee)
  const tier = tierBadge(c.tier ?? TIER_MAP[c.id])
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 card-lift',
        compact ? 'p-3' : 'p-4',
      )}
    >
      <span className={cn('absolute inset-y-0 left-0 w-1.5', u.bar)} aria-hidden />
      <div className={cn('pl-2', compact ? 'space-y-1.5' : 'space-y-2')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <Globe className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{c.name}</p>
              <h3 className={cn('truncate font-semibold text-slate-900 dark:text-slate-100', compact ? 'text-sm' : 'text-base')}>
                {c.nameZh}
              </h3>
            </div>
          </div>
          <span
            className={cn(
              'nums shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-800',
              u.text,
            )}
          >
            {daysLeftLabel(c.deadline)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tier && (
            <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', tier.cls)}>
              {tier.label}
            </span>
          )}
          {c.confidence && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              预估·{c.confidence === 'high' ? '高' : c.confidence === 'medium' ? '中' : '低'}
            </span>
          )}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
              categoryStyle(c.category),
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', categoryDotMuted(c.category))} />
            {c.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {c.region}
          </span>
          {!fee.free && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-500 dark:bg-violet-900/30">
              费用
            </span>
          )}
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
              fee.cls,
            )}
          >
            {fee.label}
          </span>
        </div>

        {compact ? (
          <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{c.description}</p>
        ) : (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.description}</p>
        )}

        {c.entryType && (
          <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Users className="h-3 w-3 shrink-0" aria-hidden />
            {c.entryType}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <a
            href={c.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5" /> 官网
          </a>
          <a
            href={c.submitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-1 rounded-lg border border-brand-300 px-2.5 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20"
          >
            <Send className="h-3.5 w-3.5" /> 去投稿
          </a>
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="press ml-auto text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              {action.label} →
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
