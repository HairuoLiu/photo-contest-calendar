import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { addDays, addMonths, addYears, format, parseISO, startOfDay, subDays, subMonths, subYears } from 'date-fns'
import { competitions, type Competition } from './data/competitions'
import { Header } from './components/Header'
import { YearView } from './components/YearView'
import { MonthView } from './components/MonthView'
import { DayView } from './components/DayView'
import { DayDetailPanel } from './components/DayDetailPanel'
import { UpcomingPanel } from './components/UpcomingPanel'
import type { View } from './lib/types'
import { REPO_URL } from './lib/config'

export default function App() {
  const [view, setView] = useState<View>('month')
  const [cursor, setCursor] = useState<Date>(new Date())
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const [hovered, setHovered] = useState<{ date: string; items: Competition[] } | null>(null)

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
    for (const c of competitions) {
      const arr = m.get(c.deadline) ?? []
      arr.push(c)
      m.set(c.deadline, arr)
    }
    return m
  }, [])

  const goToMonth = (d: Date) => {
    setCursor(d)
    setView('month')
  }
  const goToDay = (d: Date) => {
    setCursor(d)
    setView('day')
  }
  const goToday = () => {
    setCursor(new Date())
    setView('month')
  }

  const handlePrev = () => {
    if (view === 'year') setCursor(subYears(cursor, 1))
    else if (view === 'month') setCursor(subMonths(cursor, 1))
    else setCursor(subDays(cursor, 1))
  }
  const handleNext = () => {
    if (view === 'year') setCursor(addYears(cursor, 1))
    else if (view === 'month') setCursor(addMonths(cursor, 1))
    else setCursor(addDays(cursor, 1))
  }

  const title =
    view === 'year'
      ? format(cursor, 'yyyy')
      : view === 'month'
        ? format(cursor, 'yyyy 年 M 月')
        : format(cursor, 'yyyy 年 M 月 d 日')

  return (
    <div className="min-h-full app-bg">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 2xl:max-w-[1800px]">
        <Header
          view={view}
          setView={setView}
          title={title}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={goToday}
          theme={theme}
          setTheme={setTheme}
        />

        <section className="mt-6">
          <UpcomingPanel byDate={byDate} onSelectDay={goToDay} />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <main className="min-w-0">
            <AnimatePresence mode="wait">
              {view === 'year' && (
                <YearView key="year" cursor={cursor} onSelectMonth={goToMonth} byDate={byDate} />
              )}
              {view === 'month' && (
                <MonthView
                  key="month"
                  cursor={cursor}
                  setCursor={setCursor}
                  byDate={byDate}
                  onSelectDay={goToDay}
                  onHoverDay={handleHoverDay}
                  onToday={goToday}
                />
              )}
              {view === 'day' && <DayView key="day" date={cursor} byDate={byDate} onBack={() => setView('month')} />}
            </AnimatePresence>
          </main>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            {hovered && view === 'month' ? (
              <DayDetailPanel date={hovered.date} items={hovered.items} />
            ) : view === 'month' ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900/40">
                将鼠标移到有标记的日期，这里会显示当天的比赛详情。
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900/40">
                切到「月」视图，悬停有标记的日期即可查看当天详情。
              </div>
            )}
          </aside>
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800">
          <p>Photo Contest Calendar · 一个开源、无后端的摄影赛事提醒工具 · 比赛数据保存在仓库本地文件</p>
          <p className="mt-1">
            以 MIT 协议开源 ·{' '}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline dark:text-brand-400">
              在 GitHub 上贡献比赛
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
