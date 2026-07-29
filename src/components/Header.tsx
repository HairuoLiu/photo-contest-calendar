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

      {/* Right: a borderless cluster that blends into the background.
          Top = GitHub (logo only). Bottom row = language + share.
          No theme button here — that lives as a floating action button. */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('github')}
          className="press grid h-9 w-9 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Github className="h-5 w-5" />
        </a>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ShareButton />
        </div>
      </div>
    </header>
  )
}
