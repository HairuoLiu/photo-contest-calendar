import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import type { View } from '../lib/types'
import { cn } from '../lib/utils'

interface Props {
  view: View
  setView: (v: View) => void
  title: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

const VIEWS: [View, string][] = [
  ['year', '年'],
  ['month', '月'],
  ['week', '周'],
]

/**
 * Calendar navigation + view switch. Kept in one place (and placed directly
 * above the calendar grid) so the controls that drive the calendar sit next to
 * the calendar — not on top of the "本周/本月截止" panels, which they don't
 * control.
 *
 * NOTE: each button carries its own active background. We deliberately avoid a
 * single shared `layoutId` pill — on touch devices the absolute-positioned
 * shared element would ghost over the sibling labels and blank them out after a
 * tap. Self-contained per-button state is bulletproof on mobile.
 */
export function CalendarControls({ view, setView, title, onPrev, onNext, onToday }: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {VIEWS.map(([v, label]) => {
          const active = view === v
          return (
            <button
              key={v}
              type="button"
              aria-pressed={active}
              onClick={() => setView(v)}
              className={cn(
                'press rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="上一个"
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="press inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <CalendarDays className="h-4 w-4 text-slate-400" />
          今天
          <span className="nums rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {format(new Date(), 'M/d')}
          </span>
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="下一个"
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="nums ml-1 min-w-[7.5rem] text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </span>
      </div>
    </div>
  )
}
