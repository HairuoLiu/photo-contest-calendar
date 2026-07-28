import { Camera, Github, Moon, Sun } from 'lucide-react'
import { REPO_URL } from '../lib/config'
import { cn } from '../lib/utils'
import { useT } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

interface Props {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

export function Header({ theme, setTheme }: Props) {
  const { t } = useT()
  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Photo Contest Calendar
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t('tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
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
      </div>
    </header>
  )
}
