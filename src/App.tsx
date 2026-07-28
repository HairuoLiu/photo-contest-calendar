import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  startOfWeek,
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
import { UpcomingPanel } from './components/UpcomingPanel'
import { WatchlistPanel } from './components/WatchlistPanel'
import { InstallBanner } from './components/InstallBanner'
import { useInstallBanner } from './lib/useInstallBanner'
import type { View } from './lib/types'
import { REPO_URL } from './lib/config'
import { cn } from './lib/utils'

export default function App() {
  const [view, setView] = useState<View>('month')
  const [cursor, setCursor] = useState<Date>(new Date())
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const [hovered, setHovered] = useState<{ date: string; items: Competition[] } | null>(null)
  const { visible: bannerVisible, os, canInstall, dismiss: dismissBanner, install: installApp } = useInstallBanner()

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

  const weekStart = startOfWeek(cursor, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(cursor, { weekStartsOn: 1 })
  const title =
    view === 'year'
      ? format(cursor, 'yyyy')
      : view === 'month'
        ? format(cursor, 'yyyy 年 M 月')
        : view === 'week'
          ? `${format(weekStart, 'M/d')} – ${format(weekEnd, 'M/d')}`
          : format(cursor, 'yyyy 年 M 月 d 日')

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
            'mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 2xl:max-w-[1800px]',
            bannerVisible && 'pt-20',
          )}
        >
          <Header theme={theme} setTheme={setTheme} />

          <section className="mt-6">
            <UpcomingPanel byDate={byDate} onSelectDay={goToWeek} />
          </section>

          <CalendarControls
            view={view}
            setView={setView}
            title={title}
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
                  onSelectDay={goToWeek}
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
            <p>Photo Contest Calendar · 一个开源、无后端的摄影赛事提醒工具 · 比赛数据保存在仓库本地文件</p>
            <p className="mt-1">
              以 MIT 协议开源 ·{' '}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline dark:text-brand-400"
              >
                在 GitHub 上贡献比赛
              </a>
            </p>
          </footer>
        </div>

        {/* The hover bubble only belongs to the month grid; never show it in
            year/week views (and it is already cleared on navigation above). */}
        <HoverBubble hovered={view === 'month' ? hovered : null} />
      </div>
    </MotionConfig>
  )
}
