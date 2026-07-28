import { useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Flame, CalendarClock } from 'lucide-react'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'
import { isSameMonth, isSameWeek, parseISO, startOfDay, startOfWeek } from 'date-fns'
import { REPO_URL } from '../lib/config'

interface Props {
  byDate: Map<string, Competition[]>
  onSelectDay: (d: Date) => void
}

export function UpcomingPanel({ byDate, onSelectDay }: Props) {
  const { week, month } = useMemo(() => {
    const today = startOfDay(new Date())
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const w: Competition[] = []
    const m: Competition[] = []
    for (const c of Array.from(byDate.values()).flat()) {
      const d = parseISO(c.deadline)
      if (d < today) continue
      if (isSameWeek(d, weekStart, { weekStartsOn: 1 })) w.push(c)
      if (isSameMonth(d, today)) m.push(c)
    }
    w.sort((a, b) => a.deadline.localeCompare(b.deadline))
    m.sort((a, b) => a.deadline.localeCompare(b.deadline))
    return { week: w, month: m }
  }, [byDate])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Section title="本周截止" icon={<Flame className="h-4 w-4 text-rose-500" />} items={week} empty="本周暂无截止的比赛 🎉" onSelectDay={onSelectDay} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.06 }}>
          <Section title="本月截止" icon={<CalendarClock className="h-4 w-4 text-amber-500" />} items={month} empty="本月暂无截止的比赛" onSelectDay={onSelectDay} />
        </motion.div>
      </div>
      <p className="px-1 text-center text-xs text-slate-400">
        数据保存在仓库本地文件，欢迎到{' '}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          GitHub
        </a>{' '}
        补充或更新比赛
      </p>
    </div>
  )
}

function Section({
  title,
  icon,
  items,
  empty,
  onSelectDay,
}: {
  title: string
  icon: ReactNode
  items: Competition[]
  empty: string
  onSelectDay: (d: Date) => void
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-2 flex items-center gap-2 px-1">
        {icon}
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="px-1 py-3 text-center text-sm text-slate-400">{empty}</p>
      ) : (
        <div className="space-y-2">
          {items.map((c) => (
            <CompetitionCard
              key={c.id}
              c={c}
              compact
              action={{ label: '查看这天', onClick: () => onSelectDay(parseISO(c.deadline)) }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
