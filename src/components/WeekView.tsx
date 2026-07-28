import { motion } from 'framer-motion'
import { eachDayOfInterval, endOfWeek, format, isToday, startOfWeek } from 'date-fns'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'
import { cn } from '../lib/utils'

interface Props {
  cursor: Date
  byDate: Map<string, Competition[]>
  onBack: () => void
}

const WEEKDAY = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function WeekView({ cursor, byDate, onBack }: Props) {
  const start = startOfWeek(cursor, { weekStartsOn: 1 })
  const end = endOfWeek(cursor, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <button
        type="button"
        onClick={onBack}
        className="press mb-4 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        返回月视图
      </button>

      <div className="grid gap-3">
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const items = byDate.get(key) ?? []
          const today = isToday(d)
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={cn(
                'rounded-2xl border p-3 shadow-sm sm:p-4',
                today
                  ? 'border-brand-400 bg-brand-50/50 dark:border-brand-500/50 dark:bg-brand-900/15'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {WEEKDAY[(d.getDay() + 6) % 7]}
                  </span>
                  {format(d, 'M 月 d 日')}
                  {today && (
                    <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">今天</span>
                  )}
                </h3>
                <span className="nums rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {items.length} 场
                </span>
              </div>

              {items.length === 0 ? (
                <p className="py-1 text-sm text-slate-400">这一天没有收录的比赛截止</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((c) => (
                    <CompetitionCard key={c.id} c={c} compact />
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
