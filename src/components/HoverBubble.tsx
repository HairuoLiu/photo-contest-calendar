import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { MousePointerClick } from 'lucide-react'
import type { Competition } from '../data/competitions'
import { categoryStyle, cn, daysLeftLabel, feeInfo, regionFlag } from '../lib/utils'

interface Props {
  hovered: { date: string; items: Competition[] } | null
}

const BUBBLE_W = 340
const GAP = 18
const MAX_ROWS = 5
const FALLBACK_H = 260

/**
 * A cursor-following preview bubble that floats over the calendar (to the right
 * of the pointer) when a marked day is hovered. It does NOT occupy page layout —
 * it is fixed-positioned and pointer-events-none, so it never shifts the
 * composition. Position is tracked via a window mousemove listener while shown.
 */
export function HoverBubble({ hovered }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hovered) return
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [hovered])

  const items = hovered?.items ?? []
  const overflow = items.length - MAX_ROWS

  // Edge-flip: keep the bubble inside the viewport.
  const h = ref.current?.offsetHeight ?? FALLBACK_H
  const flipLeft = pos.x + GAP + BUBBLE_W > window.innerWidth
  const left = flipLeft ? Math.max(12, pos.x - GAP - BUBBLE_W) : pos.x + GAP
  const top =
    pos.y + GAP + h > window.innerHeight ? Math.max(12, window.innerHeight - h - 12) : pos.y + GAP

  return (
    <AnimatePresence>
      {hovered && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          style={{ position: 'fixed', left, top, width: BUBBLE_W }}
          className="pointer-events-none z-50 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-900/25 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95"
          role="tooltip"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">悬停预览</p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {format(parseISO(hovered.date), 'M 月 d 日')} · 共 {items.length} 场截止
              </h3>
            </div>
            <MousePointerClick className="h-5 w-5 shrink-0 text-brand-400" />
          </div>

          <div className="space-y-2">
            {items.slice(0, MAX_ROWS).map((c) => {
              const fee = feeInfo(c.fee)
              const flag = regionFlag(c.region)
              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-2 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start gap-1.5">
                    {flag && <span className="text-sm leading-none" aria-hidden>{flag}</span>}
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {c.nameZh}
                    </p>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-medium', categoryStyle(c.category))}>
                      {c.category}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                        fee.cls,
                      )}
                    >
                      {fee.free ? '免费' : `费用 ${fee.label}`}
                    </span>
                    <span className="ml-auto text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {daysLeftLabel(c.deadline)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {overflow > 0 && (
            <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
              还有 {overflow} 场 · 点击该日期查看全部 →
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
