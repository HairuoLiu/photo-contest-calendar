import { motion } from 'framer-motion'
import { CalendarDays, Camera, ChevronLeft, ChevronRight, Github, Moon, Sun } from 'lucide-react'
import { format } from 'date-fns'
import type { View } from '../lib/types'
import { cn } from '../lib/utils'
import { REPO_URL } from '../lib/config'

interface Props {
  view: View
  setView: (v: View) => void
  title: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

const VIEWS: [View, string][] = [
  ['year', '年'],
  ['month', '月'],
  ['week', '周'],
]

export function Header({ view, setView, title, onPrev, onNext, onToday, theme, setTheme }: Props) {
  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Photo Contest Calendar
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">全球摄影赛事日历 · 投稿截止提醒</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="切换深色 / 浅色主题"
            className="press grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {VIEWS.map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="press relative rounded-lg px-4 py-1.5 text-sm font-medium transition"
            >
              {view === v && (
                <motion.span
                  layoutId="view-pill"
                  className="absolute inset-0 rounded-lg bg-brand-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={cn('relative z-10', view === v ? 'text-white' : 'text-slate-600 dark:text-slate-300')}>
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="上一个"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="press inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <CalendarDays className="h-4 w-4 text-brand-500" />
            今天
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {format(new Date(), 'M/d')}
            </span>
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="下一个"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="ml-1 min-w-[7.5rem] text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </span>
        </div>
      </div>
    </header>
  )
}
