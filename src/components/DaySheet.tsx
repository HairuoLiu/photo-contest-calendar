import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { CalendarOff, X } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { Competition } from '../data/competitions'
import { CompetitionCard } from './CompetitionCard'

interface Props {
  /** The day whose details are shown, or null when the sheet is closed. */
  date: Date | null
  /** Competitions whose deadline falls on `date`. */
  items: Competition[]
  onClose: () => void
}

/**
 * Mobile-first bottom sheet for a single day. Tapping a day cell (touch or
 * mouse) slides this up instead of navigating away — so the user keeps the
 * month grid context and still gets the day's competitions at a glance. A
 * desktop hover still shows the floating preview bubble; this is the touch
 * equivalent and works fine with a mouse too.
 */
export function DaySheet({ date, items, onClose }: Props) {
  return (
    <AnimatePresence>
      {date && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info: PanInfo) => {
              if (info.offset.y > 120 || info.velocity.y > 700) onClose()
            }}
            role="dialog"
            aria-modal="true"
            aria-label={format(date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
            className="grain fixed inset-x-0 bottom-0 z-[71] mx-auto flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl border border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex justify-center pt-3">
              <span className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden />
            </div>

            <header className="flex items-start justify-between gap-3 px-5 pb-3 pt-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {format(date, 'EEEE', { locale: zhCN })}
                </p>
                <h3 className="font-serif text-2xl leading-tight text-slate-900 dark:text-white">
                  {format(date, 'M 月 d 日', { locale: zhCN })}
                </h3>
                <p className="nums mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {items.length > 0 ? `当日 ${items.length} 场赛事截稿` : '当日无截稿赛事'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-6 pt-1">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-slate-400">
                  <CalendarOff className="h-8 w-8" />
                  <p className="text-sm">这一天没有赛事截稿</p>
                  <p className="text-xs">圆点只标记有投稿截止的日期</p>
                </div>
              ) : (
                items.map((c) => <CompetitionCard key={c.id} c={c} compact />)
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
