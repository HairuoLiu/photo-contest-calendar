import { AnimatePresence, motion } from 'framer-motion'
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import type { Competition } from '../data/competitions'
import { categoryDotMuted, cn } from '../lib/utils'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']
const WEEKDAYS_FULL = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

interface Props {
  cursor: Date
  byDate: Map<string, Competition[]>
  onSelectDay: (d: Date) => void
  onHoverDay?: (info: { date: Date; items: Competition[] } | null) => void
  /** ISO date (yyyy-MM-dd) of the day currently previewed in the hover bubble,
   *  used to highlight that cell in place (a calm complement to the bubble). */
  hoveredDate?: string | null
}

export function MonthView({ cursor, byDate, onSelectDay, onHoverDay, hoveredDate }: Props) {
  const monthStart = startOfMonth(cursor)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const key = `${getYear(cursor)}-${getMonth(cursor)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 py-1 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400 sm:py-3 sm:text-base lg:text-lg">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className="py-2.5">
              <span className="sm:hidden">{w}</span>
              <span className="hidden sm:inline">{WEEKDAYS_FULL[i]}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-7"
          >
            {days.map((d) => (
              <DayCell
                key={format(d, 'yyyy-MM-dd')}
                day={d}
                outside={!isSameMonth(d, monthStart)}
                items={byDate.get(format(d, 'yyyy-MM-dd')) ?? []}
                hovered={hoveredDate === format(d, 'yyyy-MM-dd')}
                onSelectDay={onSelectDay}
                onHoverDay={onHoverDay}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function DayCell({
  day,
  outside,
  items,
  hovered,
  onSelectDay,
  onHoverDay,
}: {
  day: Date
  outside: boolean
  items: Competition[]
  hovered: boolean
  onSelectDay: (d: Date) => void
  onHoverDay?: (info: { date: Date; items: Competition[] } | null) => void
}) {
  const today = isToday(day)
  return (
    <button
      type="button"
      onClick={() => onSelectDay(day)}
      onMouseEnter={() => onHoverDay?.(items.length ? { date: day, items } : null)}
      onMouseLeave={() => onHoverDay?.(null)}
      className={cn(
        'group relative flex min-h-[76px] flex-col gap-1.5 border-b border-r border-slate-100 p-2 text-left transition focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 sm:min-h-[104px] lg:min-h-[128px] xl:min-h-[152px] 2xl:min-h-[176px]',
        outside && 'bg-slate-50/60 text-slate-300 dark:bg-slate-900/40 dark:text-slate-600',
        today && 'bg-brand-50/70 ring-1 ring-inset ring-brand-400/60 dark:bg-brand-900/20',
        hovered && 'bg-brand-50/90 ring-2 ring-inset ring-brand-400/70 dark:bg-brand-900/30',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition sm:h-9 sm:w-9 sm:text-base lg:h-10 lg:w-10 lg:text-lg',
          today ? 'bg-brand-500 text-white' : 'text-slate-700 dark:text-slate-200',
        )}
      >
        {format(day, 'd')}
      </span>
      {today && (
        <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white shadow">
          今天
        </span>
      )}
      {items.length > 0 && (
        <div className="mt-auto flex flex-wrap items-center gap-1">
          {items.slice(0, 4).map((c) => (
            <span
              key={c.id}
              className={cn('h-2 w-2 rounded-full ring-1 ring-black/5', categoryDotMuted(c.category))}
            />
          ))}
          {items.length > 4 && (
            <span className="nums text-[11px] font-medium text-slate-400 sm:text-xs">+{items.length - 4}</span>
          )}
          <span className="nums ml-0.5 hidden text-[11px] font-medium text-slate-400 sm:inline sm:text-xs">{items.length} 场</span>
        </div>
      )}
    </button>
  )
}
