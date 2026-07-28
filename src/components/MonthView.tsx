import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
}

export function MonthView({ cursor, setCursor, byDate, onSelectDay }: Props) {
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
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="上个月"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="下个月"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">点选任意日期，查看当天截止的投稿</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className="py-2">
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
            {days.map((d, i) => (
              <DayCell
                key={format(d, 'yyyy-MM-dd')}
                day={d}
                outside={!isSameMonth(d, monthStart)}
                items={byDate.get(format(d, 'yyyy-MM-dd')) ?? []}
                index={i}
                onSelectDay={onSelectDay}
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
  index,
  onSelectDay,
}: {
  day: Date
  outside: boolean
  items: Competition[]
  index: number
  onSelectDay: (d: Date) => void
}) {
  const today = isToday(day)
  return (
    <button
      type="button"
      onClick={() => onSelectDay(day)}
      style={{ animationDelay: `${Math.min(index, 30) * 12}ms` }}
      className={cn(
        'animate-fade-in relative flex min-h-[72px] flex-col gap-1 border-b border-r border-slate-100 p-1.5 text-left transition hover:bg-brand-50/50 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-800 dark:hover:bg-brand-900/10 sm:min-h-[88px]',
        index % 7 === 6 && 'border-r-0',
        outside && 'bg-slate-50/60 text-slate-300 dark:bg-slate-900/40 dark:text-slate-600',
        today && 'bg-brand-50/70 dark:bg-brand-900/20',
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
          today ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-300',
        )}
      >
        {format(day, 'd')}
      </span>
      <div className="flex flex-col gap-0.5">
        {items.slice(0, 2).map((c) => (
          <span
            key={c.id}
            className="flex items-center gap-1 truncate rounded bg-slate-100 px-1 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', categoryDot(c.category))} />
            <span className="truncate">{c.nameZh}</span>
          </span>
        ))}
        {items.length > 2 && <span className="px-1 text-[10px] text-slate-400">+{items.length - 2} 场</span>}
      </div>
    </button>
  )
}
