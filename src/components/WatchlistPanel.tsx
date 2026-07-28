import { motion } from 'framer-motion'
import { Hourglass, Sparkles } from 'lucide-react'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'
import { useT } from '../i18n'

interface Props {
  items: Competition[]
}

/**
 * Surfaces competitions whose 2026/2027 deadline is not yet announced
 * (`deadline: 'TBD'`). These are intentionally excluded from the date-based
 * calendar/upcoming panels, so they get their own "watchlist" section.
 */
export function WatchlistPanel({ items }: Props) {
  const { t } = useT()
  if (items.length === 0) return null
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
          <Hourglass className="h-4 w-4" />
        </span>
        <div>
          <h2 className="flex items-center gap-1.5 font-serif text-base font-bold text-slate-900 dark:text-white">
            {t('watchlist.title')}
            <Sparkles className="h-4 w-4 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('watchlist.desc')}</p>
        </div>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800">
          {items.length}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: Math.min(i * 0.03, 0.3), ease: 'easeOut' }}
          >
            <CompetitionCard c={c} compact />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
