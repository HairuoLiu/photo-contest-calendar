import { motion } from 'framer-motion'
import { eachDayOfInterval, endOfMonth, endOfWeek, format, getMonth, getYear, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns'
import type { Competition } from '../data/competitions'
import { cn } from '../lib/utils'
import type { View } from '../lib/types'
import { useT } from '../i18n'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.035, delayChildren: 0.02 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
}

interface Props {
  cursor: Date
  onSelectMonth: (d: Date) => void
  byDate: Map<string, Competition[]>
}

export function YearView({ cursor, onSelectMonth, byDate }: Props) {
  const { weekdays } = useT()
  const year = getYear(cursor)
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))

  return (
    <motion.div variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: -12 }}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((m) => (
          <MiniMonth key={getMonth(m)} month={m} onSelect={() => onSelectMonth(m)} byDate={byDate} />
        ))}
      </div>
    </motion.div>
  )
}

function MiniMonth({
  month,
  onSelect,
  byDate,
}: {
  month: Date
  onSelect: () => void
  byDate: Map<string, Competition[]>
}) {
  const { weekdays, t, dateLocale } = useT()
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })
  const count = days.filter((d) => byDate.has(format(d, 'yyyy-MM-dd'))).length
  const now = new Date()
  const isCurrent = isSameMonth(month, now) && getYear(month) === getYear(now)

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      variants={item}
      whileHover={{ scale: 1.015 }}
      className={cn(
        'group rounded-2xl border p-3 text-left shadow-sm transition hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700',
        isCurrent
          ? 'border-brand-400 bg-brand-50/60 dark:border-brand-500/50 dark:bg-brand-900/10'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={cn('text-sm font-semibold', isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200')}>
          {format(month, t('miniMonth'), { locale: dateLocale })}
        </span>
        {count > 0 && (
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            {t('count', { n: count })}
          </span>
        )}
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[9px] text-slate-400">
        {weekdays.short.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const has = byDate.has(key)
          const outside = !isSameMonth(d, month)
          const today = isToday(d)
          return (
            <span
              key={key}
              className={cn(
                'relative grid h-4 w-full place-items-center rounded text-[9px]',
                outside ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400',
                today && 'font-bold text-brand-600 dark:text-brand-400',
              )}
            >
              {format(d, 'd')}
              {has && <span className="absolute bottom-0 right-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 ring-2 ring-brand-200 dark:ring-brand-800/80" />}
            </span>
          )
        })}
      </div>
    </motion.button>
  )
}
