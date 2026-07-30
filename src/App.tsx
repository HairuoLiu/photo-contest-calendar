import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import { competitions, type Competition } from './data/competitions'
import { Header } from './components/Header'
import { CalendarControls } from './components/CalendarControls'
import { YearView } from './components/YearView'
import { MonthView } from './components/MonthView'
import { WeekView } from './components/WeekView'
import { HoverBubble } from './components/HoverBubble'
import { DaySheet } from './components/DaySheet'
import { UpcomingPanel } from './components/UpcomingPanel'
import { WatchlistPanel } from './components/WatchlistPanel'
import { InstallBanner } from './components/InstallBanner'
import { ThemeFab } from './components/ThemeFab'
import { useInstallBanner } from './lib/useInstallBanner'
import type { View } from './lib/types'
import { REPO_URL } from './lib/config'
import { cn } from './lib/utils'
import { useT } from './i18n'
import { Coffee, Heart } from 'lucide-react'

export default function App() {
  const [view, setView] = useState<View>('month')
  const [cursor, setCursor] = useState<Date>(new Date())
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const [hovered, setHovered] = useState<{ date: string; items: Competition[] } | null>(null)
  const [daySheet, setDaySheet] = useState<{ date: Date; items: Competition[] } | null>(null)
  const { visible: bannerVisible, os, canInstall, dismiss: dismissBanner, install: installApp } = useInstallBanner()
  const { t } = useT()
  // Footer hint reuses the (now-orphaned) "data lives in this repo" string,
  // with the {github} placeholder swapped for a real link — no innerHTML.
  const hintParts = t('upcoming.hint').split('{github}')
  const hintBefore = hintParts[0]
  const hintAfter = hintParts[1] ?? ''

  // Tap a day cell → open the bottom sheet (touch-friendly, keeps the month
  // grid in context). The week view stays reachable via the 周 segmented tab.
  const openDay = (d: Date) => {
    const items = byDate.get(format(d, 'yyyy-MM-dd')) ?? []
    setDaySheet({ date: d, items })
    setHovered(null)
  }

  // Lock background scroll while the sheet is open (mobile address-bar jitter
  // avoidance + no accidental scroll behind the sheet).
  useEffect(() => {
    if (!daySheet) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [daySheet])

  const handleHoverDay = (info: { date: Date; items: Competition[] } | null) => {
    setHovered(info ? { date: format(info.date, 'yyyy-MM-dd'), items: info.items } : null)
  }

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const byDate = useMemo(() => {
    const m = new Map<string, Competition[]>()
    const iso = /^\d{4}-\d{2}-\d{2}$/
    for (const c of competitions) {
      if (!iso.test(c.deadline)) continue // 'TBD' entries live in the watchlist, not the date grid
      const arr = m.get(c.deadline) ?? []
      arr.push(c)
      m.set(c.deadline, arr)
    }
    return m
  }, [])

  const watchlist = useMemo(
    () => competitions.filter((c) => !/^\d{4}-\d{2}-\d{2}$/.test(c.deadline)),
    [],
  )

  const goToMonth = (d: Date) => {
    setCursor(d)
    setView('month')
    setHovered(null)
  }
  const goToWeek = (d: Date) => {
    setCursor(d)
    setView('week')
    // Leaving the month grid: drop any hover preview so it doesn't stick
    // onto the clicked day after we navigate into the week detail view.
    setHovered(null)
  }
  const goToday = () => {
    setCursor(new Date())
    setView('month')
    setHovered(null)
  }

  const handlePrev = () => {
    if (view === 'year') setCursor(subYears(cursor, 1))
    else if (view === 'month') setCursor(subMonths(cursor, 1))
    else if (view === 'week') setCursor(subWeeks(cursor, 1))
    else setCursor(subDays(cursor, 1))
  }
  const handleNext = () => {
    if (view === 'year') setCursor(addYears(cursor, 1))
    else if (view === 'month') setCursor(addMonths(cursor, 1))
    else if (view === 'week') setCursor(addWeeks(cursor, 1))
    else setCursor(addDays(cursor, 1))
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-full app-bg">
        <InstallBanner
          visible={bannerVisible}
          os={os}
          canInstall={canInstall}
          onInstall={installApp}
          onDismiss={dismissBanner}
        />

        <div
          className={cn(
            'mx-auto max-w-[1500px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 2xl:max-w-[1800px]',
            bannerVisible && 'pt-20',
          )}
        >
          <Header />

          <section className="mt-6">
            <UpcomingPanel byDate={byDate} onSelectDay={goToWeek} />
          </section>

          <CalendarControls
            view={view}
            setView={setView}
            cursor={cursor}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={goToday}
          />

          <main className="mt-4">
            <AnimatePresence mode="wait">
              {view === 'year' && (
                <YearView key="year" cursor={cursor} onSelectMonth={goToMonth} byDate={byDate} />
              )}
              {view === 'month' && (
                <MonthView
                  key="month"
                  cursor={cursor}
                  byDate={byDate}
                  onSelectDay={openDay}
                  onHoverDay={handleHoverDay}
                  hoveredDate={hovered?.date ?? null}
                />
              )}
              {view === 'week' && (
                <WeekView key="week" cursor={cursor} byDate={byDate} onBack={() => setView('month')} />
              )}
            </AnimatePresence>
          </main>

          {/* 待官宣赛事沉到日历下方：未证实的 TBD 不应抢占首屏，
              避免用户一进来就看到一堆"待官宣/不确定"的条目。 */}
          <WatchlistPanel items={watchlist} />

          <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800">
            <p>{t('footer.text')}</p>
            <p className="mt-2">
              {hintBefore}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline dark:text-brand-400"
              >
                GitHub
              </a>
              {hintAfter}
            </p>
            <p className="mt-1">
              {t('footer.mit')}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline dark:text-brand-400"
              >
                {t('footer.contrib')}
              </a>
            </p>

            {/* 捐赠入口：轻量变现，契合开源无广告定位。
                GitHub Sponsors + Ko-fi 双通道，仅生产/公开站点展示。 */}
            <div className="mt-5 flex flex-col items-center gap-2.5">
              <p className="text-slate-500 dark:text-slate-400">{t('footer.support')}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://github.com/sponsors/HairuoLiu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  {t('footer.sponsor')}
                </a>
                <a
                  href="https://ko-fi.com/liuhaier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  <Coffee className="h-3.5 w-3.5" aria-hidden />
                  {t('footer.kofi')}
                </a>
              </div>
            </div>
          </footer>
        </div>

        {/* The hover bubble only belongs to the month grid; never show it in
            year/week views (and it is already cleared on navigation above). */}
        <HoverBubble hovered={view === 'month' ? hovered : null} />

        {/* Mobile-first day detail: tap any day → bottom sheet with that day's
            competitions, without leaving the month grid. */}
        <DaySheet
          date={daySheet?.date ?? null}
          items={daySheet?.items ?? []}
          onClose={() => setDaySheet(null)}
        />

        <ThemeFab theme={theme} setTheme={setTheme} hidden={daySheet !== null} />
      </div>
    </MotionConfig>
  )
}
