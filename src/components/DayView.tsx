import { motion } from 'framer-motion'
import { ArrowLeft, CalendarOff } from 'lucide-react'
import { format, isToday } from 'date-fns'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'

interface Props {
  date: Date
  byDate: Map<string, Competition[]>
  onBack: () => void
}

export function DayView({ date, byDate, onBack }: Props) {
  const key = format(date, 'yyyy-MM-dd')
  const items = byDate.get(key) ?? []
  const today = isToday(date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="press inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> 返回
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{format(date, 'yyyy 年 M 月 d 日')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {today ? '就是今天 · ' : ''}共 {items.length} 场投稿截止
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <CalendarOff className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">这一天没有收录的比赛截止 📭</p>
          <p className="mt-1 text-sm text-slate-400">换个日期，或到 GitHub 补充数据</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.05 }}
            >
              <CompetitionCard c={c} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
