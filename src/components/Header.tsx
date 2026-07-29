import { Camera, Github, Moon, Sun } from 'lucide-react'
import { REPO_URL } from '../lib/config'
import { cn } from '../lib/utils'
import { useT } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ShareButton } from './ShareButton'

interface Props {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

export function Header({ theme, setTheme }: Props) {
  const { t } = useT()
  return (
    <header>
      <div className="flex items-start justify-between gap-3">
        {/* Left: brand (always) */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Camera className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Photo Contest Calendar
            </h1>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{t('tagline')}</p>
          </div>
        </div>

        {/* Right (desktop): inline cluster */}
        <div className="hidden items-center gap-2 sm:flex">
          <LanguageSwitcher />
          <ShareButton />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Github className="h-4 w-4" /> {t('github')}
          </a>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={t('themeToggle')}
            className="press grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Right (mobile): square box — GitHub (top), theme (top-right), language + share (bottom) */}
        <div className="grid shrink-0 grid-cols-2 gap-1.5 rounded-2xl border border-slate-200 bg-white/70 p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 sm:hidden">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid h-9 w-full place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Github className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={t('themeToggle')}
            className="grid h-9 w-full place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <LanguageSwitcher className="h-9 w-full" />
          <ShareButton className="h-9 w-full" />
        </div>
      </div>
    </header>
  )
}
