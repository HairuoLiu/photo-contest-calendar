import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { endOfWeek, format, startOfWeek } from 'date-fns'
import type { View } from '../lib/types'
import { cn } from '../lib/utils'
import { useT } from '../i18n'

interface Props {
  view: View
  setView: (v: View) => void
  cursor: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

const VIEW_KEYS: [View, string][] = [
  ['year', 'view.year'],
  ['month', 'view.month'],
  ['week', 'view.week'],
]

/**
 * Calendar navigation + view switch, kept on one row directly above the grid.
 *
 * The period that used to sit in its own "2026年7月" heading is now folded into
 * the "今天" button (e.g. "今天 · 2026年7月28日"), so the whole control stays on
 * a single line — on mobile the view switch and the prev/today/next group share
 * one row instead of wrapping.
 *
 * NOTE: each button carries its own active background. We deliberately avoid a
 * single shared `layoutId` pill — on touch devices the absolute-positioned
 * shared element would ghost over the sibling labels and blank them out after a
 * tap. Self-contained per-button state is bulletproof on mobile.
 */
export function CalendarControls({ view, setView, cursor, onPrev, onNext, onToday }: Props) {
  const { t, dateLocale } = useT()

  const weekStart = startOfWeek(cursor, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(cursor, { weekStartsOn: 1 })
  const periodFull =
    view === 'year'
      ? format(cursor, 'yyyy')
      : view === 'month'
        ? format(cursor, t('monthTitle'), { locale: dateLocale })
        : view === 'week'
          ? `${format(weekStart, t('weekTitle'), { locale: dateLocale })} – ${format(weekEnd, t('weekTitle'), { locale: dateLocale })}`
          : format(cursor, t('dayTitle'), { locale: dateLocale })
  const periodShort = view === 'year' ? format(cursor, 'yyyy') : format(cursor, 'yyyy/M/d')

  return (
    <div className="mt-8 flex flex-nowrap items-center justify-between gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {VIEW_KEYS.map(([v, key]) => {
          const active = view === v
          return (
            <button
              key={v}
              type="button"
              aria-pressed={active}
              onClick={() => setView(v)}
              className={cn(
                'press rounded-lg px-2.5 py-2 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm',
                active
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              {t(key)}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label={t('nav.prev')}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="press inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3"
        >
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {t('nav.today')}
          <span className="nums hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300 sm:inline">
            {periodFull}
          </span>
          <span className="nums rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300 sm:hidden">
            {periodShort}
          </span>
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={t('nav.next')}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
