import { Camera, Github } from 'lucide-react'
import { REPO_URL } from '../lib/config'
import { useT } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ShareButton } from './ShareButton'

export function Header() {
  const { t } = useT()
  return (
    <header className="flex items-center justify-between gap-3">
      {/* Left: brand — stays pinned to the left, never wraps */}
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

      {/* Square right cluster: a full-width GitHub bar on top, and two
          equal-width buttons (language + share) below whose combined width
          exactly matches the bar — so the whole block reads as one square. */}
      <div className="flex shrink-0 flex-col items-stretch gap-2">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('github')}
          className="press flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Github className="h-4 w-4" />
          <span className="text-sm font-semibold">GitHub</span>
        </a>
        <div className="grid grid-cols-2 gap-2">
          <LanguageSwitcher className="h-11 w-full" />
          <ShareButton className="h-11 w-full" />
        </div>
      </div>
    </header>
  )
}
