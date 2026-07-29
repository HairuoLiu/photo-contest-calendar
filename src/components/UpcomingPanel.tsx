import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Flame, CalendarClock } from 'lucide-react'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'
import { isSameMonth, isSameWeek, parseISO, startOfDay, startOfWeek } from 'date-fns'
import { useT } from '../i18n'
import { cn } from '../lib/utils'

interface Props {
  byDate: Map<string, Competition[]>
  onSelectDay: (d: Date) => void
}

type Tab = 'week' | 'month'

export function UpcomingPanel({ byDate, onSelectDay }: Props) {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>('week')
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
    <div className="space-y-3">
      {/* Mobile-only tab switcher: collapse the two stacked deadline panels into
          a single selectable view so the calendar sits higher on first paint.
          Hidden on sm+ where the two-column grid already shows both sections. */}
      <div
        className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 sm:hidden"
        role="tablist"
        aria-label={`${t('upcoming.week')} / ${t('upcoming.month')}`}
      >
        <TabButton label={t('upcoming.week')} count={week.length} active={tab === 'week'} onClick={() => setTab('week')} />
        <TabButton label={t('upcoming.month')} count={month.length} active={tab === 'month'} onClick={() => setTab('month')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          className={cn('min-w-0', tab !== 'week' && 'hidden sm:block')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Section
            title={t('upcoming.week')}
            icon={<Flame className="h-4 w-4 text-rose-500" />}
            items={week}
            empty={t('upcoming.week.empty')}
            onSelectDay={onSelectDay}
          />
        </motion.div>
        <motion.div
          className={cn('min-w-0', tab !== 'month' && 'hidden sm:block')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
        >
          <Section
            title={t('upcoming.month')}
            icon={<CalendarClock className="h-4 w-4 text-amber-500" />}
            items={month}
            empty={t('upcoming.month.empty')}
            onSelectDay={onSelectDay}
          />
        </motion.div>
      </div>
    </div>
  )
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition',
        active
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
      )}
    >
      <span className="truncate">{label}</span>
      <span
        className={cn(
          'shrink-0 rounded-full px-1.5 py-0.5 text-xs font-semibold',
          active
            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
            : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
        )}
      >
        {count}
      </span>
    </button>
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
  const { t } = useT()
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      {/* On mobile the Tab already names the section, so the header is hidden
          there (sm:flex) to avoid duplication; on desktop both headers show. */}
      <div className="mb-2 hidden items-center gap-2 px-1 sm:flex">
        {icon}
        <h2 className="font-serif text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
        <span className="nums ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800">
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
              action={{ label: t('card.viewDay'), onClick: () => onSelectDay(parseISO(c.deadline)) }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
