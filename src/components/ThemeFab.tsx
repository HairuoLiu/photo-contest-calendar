import { Moon, Sun } from 'lucide-react'
import { useT } from '../i18n'

interface Props {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  /** Hide the FAB when a modal/bottom-sheet owns the screen (e.g. the day sheet). */
  hidden?: boolean
}

/**
 * Floating theme toggle. Sits in the bottom-right corner on every screen size
 * (mobile + desktop) so it never competes with the header controls for space.
 */
export function ThemeFab({ theme, setTheme, hidden }: Props) {
  const { t } = useT()
  if (hidden) return null
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={t('themeToggle')}
      title={t('themeToggle')}
      className="press fixed bottom-5 right-5 z-[90] grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-900/10 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
