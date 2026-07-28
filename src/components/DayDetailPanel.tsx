import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { MousePointerClick } from 'lucide-react'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'

interface Props {
  date: string
  items: Competition[]
}

/** Right-rail panel that appears when hovering a marked day on the month grid. */
export function DayDetailPanel({ date, items }: Props) {
  const d = parseISO(date)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">悬停预览</p>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {format(d, 'M 月 d 日')} · 共 {items.length} 场截止
          </h3>
        </div>
        <MousePointerClick className="h-5 w-5 shrink-0 text-brand-400" />
      </div>

      <div className="space-y-2.5">
        {items.map((c) => (
          <CompetitionCard key={c.id} c={c} compact />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-slate-400">点击该日期可查看完整详情页 →</p>
    </motion.div>
  )
}
