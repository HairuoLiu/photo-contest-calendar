import { useEffect, useRef, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import { LANGS, type Lang } from '../i18n/translations'
import { useT } from '../i18n'
import { cn } from '../lib/utils'

/**
 * Minimal "change language" control: a small globe + current-language code
 * capsule (~36px visual, ≥44px hit area) that opens a compact dropdown. Sits in
 * the top-right cluster, leftmost. Only UI chrome is translated — contest
 * names stay in their original language as proper nouns.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language.toggle')}
        className="press grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <span className="nums pointer-events-none absolute -bottom-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-slate-900 px-1 text-[9px] font-bold leading-none text-white dark:bg-white dark:text-slate-900">
          {current.short}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('language.toggle')}
          className="absolute right-0 z-[80] mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
        >
          {LANGS.map((l) => {
            const active = l.code === lang
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(l.code as Lang)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800',
                    active ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-center text-xs font-semibold text-slate-400">{l.short}</span>
                    {l.label}
                  </span>
                  {active && <Check className="h-4 w-4 text-brand-500" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
