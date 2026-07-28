import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
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
  subMonths,
  addMonths,
} from 'date-fns'
import type { Competition } from '../data/competitions'
import { categoryDot, cn } from '../lib/utils'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']
const WEEKDAYS_FULL = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

interface Props {
  cursor: Date
  setCursor: (d: Date) => void
  byDate: Map<string, Competition[]>
  onSelectDay: (d: Date) => void
  onHoverDay?: (info: { date: Date; items: Competition[] } | null) => void
  onToday?: () => void
}

export function MonthView({ cursor, setCursor, byDate, onSelectDay, onHoverDay, onToday }: Props) {
  const [direction, setDirection] = useState(1)

  const handlePrev = () => {
    setDirection(-1)
    setCursor(subMonths(cursor, 1))
  }
  const handleNext = () => {
    setDirection(1)
    setCursor(addMonths(cursor, 1))
  }

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
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="上个月"
            className="press grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="下个月"
            className="press grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="press inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm transition hover:bg-brand-100 dark:border-brand-500/40 dark:bg-brand-900/20 dark:text-brand-300 dark:hover:bg-brand-900/40"
          >
            <CalendarDays className="h-4 w-4" />
            今天
          </button>
        </div>
        <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">将鼠标移到有标记的日期，右侧会显示当天比赛详情</p>
      </div>

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
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-7"
          >
            {days.map((d) => (
              <DayCell
                key={format(d, 'yyyy-MM-dd')}
                day={d}
                outside={!isSameMonth(d, monthStart)}
                items={byDate.get(format(d, 'yyyy-MM-dd')) ?? []}
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
  onSelectDay,
  onHoverDay,
}: {
  day: Date
  outside: boolean
  items: Competition[]
  onSelectDay: (d: Date) => void
  onHoverDay?: (info: { date: Date; items: Competition[] } | null) => void
}) {
  const today = isToday(day)
  return (
    <button
      type="button"
      onClick={() => onSelectDay(day)}
      onMouseEnter={() => onHoverDay?.(items.length ? { date: day, items } : null)}
      className={cn(
        'relative flex min-h-[76px] flex-col gap-1.5 border-b border-r border-slate-100 p-2 text-left transition hover:bg-brand-50/60 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-800 dark:hover:bg-brand-900/10 sm:min-h-[104px] lg:min-h-[128px] xl:min-h-[152px] 2xl:min-h-[176px]',
        outside && 'bg-slate-50/60 text-slate-300 dark:bg-slate-900/40 dark:text-slate-600',
        today && 'bg-brand-50/70 ring-1 ring-inset ring-brand-400/60 dark:bg-brand-900/20',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold sm:h-9 sm:w-9 sm:text-base lg:h-10 lg:w-10 lg:text-lg',
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
            <span key={c.id} className={cn('h-2.5 w-2.5 rounded-full', categoryDot(c.category))} />
          ))}
          {items.length > 4 && <span className="text-[11px] font-medium text-slate-400 sm:text-xs">+{items.length - 4}</span>}
          <span className="ml-0.5 hidden text-[11px] font-medium text-slate-400 sm:inline sm:text-xs">{items.length} 场</span>
        </div>
      )}
    </button>
  )
}
