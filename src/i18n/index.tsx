import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { DICT, FEE_DICT, DATE_LOCALE, detectLang, LANGS, type Lang } from './translations'
import type { Fee, FeeNoteKind } from '../data/competitions'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const STORAGE_KEY = 'pcc-lang'

/** Read a language code from the URL path, e.g. /zh-CN, /en, /ja, /zh-TW.
 *  Returns null when the URL carries no language segment (the default page). */
function langFromPath(pathname: string): Lang | null {
  const segs = pathname.split('/').filter(Boolean)
  for (const s of segs) {
    if (LANGS.some((l) => l.code === s)) return s as Lang
  }
  return null
}

/** The app's base path (repo root on GitHub Pages, or '/' locally), used to
 *  construct clean language URLs like <base>/zh-CN regardless of deploy depth. */
function appBase(): string {
  const path = window.location.pathname
  const segs = path.split('/')
  const idx = segs.findIndex((s) => LANGS.some((l) => l.code === s))
  if (idx >= 0) return segs.slice(0, idx).join('/') + '/'
  if (path.endsWith('/')) return path
  return path.replace(/\/[^/]*$/, '') + '/'
}

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** Forget any manual choice and fall back to the browser's detected language. */
  setAuto: () => void
  /** True when the active language is the browser-detected default (no URL / storage lock). */
  isAuto: boolean
  /** Translate a key, with optional `{name}` placeholders. */
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Active date-fns locale for the current language. */
  dateLocale: (typeof DATE_LOCALE)[Lang]
  /** Localized "days left" label relative to today. */
  daysLeft: (iso: string, today?: Date) => string
  /** Localized full deadline (e.g. "July 15, 2026"). */
  formatDeadline: (iso: string) => string
  /** Resolve a fee to display info (label localized; class language-agnostic). */
  fee: (raw: Fee) => { free: boolean; label: string; cls: string }
  weekdays: { short: string[]; full: string[] }
  patterns: { monthTitle: string; weekTitle: string; dayTitle: string; miniMonth: string }
}

const Ctx = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      // Priority: explicit URL segment > saved preference > browser locale.
      const fromUrl = langFromPath(window.location.pathname)
      if (fromUrl) return fromUrl
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (saved && DICT[saved]) return saved
    } catch {
      /* ignore */
    }
    return detectLang()
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
      // Reflect the choice in the URL so the page is shareable & survives refresh.
      const target = appBase() + l
      if (window.location.pathname !== target) {
        window.history.pushState({ lang: l }, '', target)
      }
    } catch {
      /* ignore */
    }
  }

  /** Drop any explicit lock (URL segment + localStorage) and re-detect. */
  const setAuto = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      const target = appBase()
      if (window.location.pathname !== target) {
        window.history.pushState({}, '', target)
      }
    } catch {
      /* ignore */
    }
    setLangState(detectLang())
  }

  const isAuto = (() => {
    try {
      return langFromPath(window.location.pathname) === null && !localStorage.getItem(STORAGE_KEY)
    } catch {
      return false
    }
  })()

  // React to browser back/forward: re-derive the language from the URL.
  useEffect(() => {
    const onPop = () => {
      const fromUrl = langFromPath(window.location.pathname)
      if (fromUrl) {
        setLangState(fromUrl)
        return
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
        if (saved && DICT[saved]) {
          setLangState(saved)
          return
        }
      } catch {
        /* ignore */
      }
      setLangState(detectLang())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Keep <html lang> in sync so screen readers + fonts behave, and give each
  // language sub-page its own browser-tab title (e.g. /en vs /zh-CN).
  useEffect(() => {
    document.documentElement.lang = lang
    const title = DICT[lang]?.siteTitle ?? DICT.en.siteTitle
    if (title) document.title = title
  }, [lang])

  const value = useMemo<I18nValue>(() => {
    const d = DICT[lang]

    const t = (key: string, vars?: Record<string, string | number>) => {
      let s = d[key] ?? FEE_DICT[lang]?.[key] ?? DICT.en[key] ?? FEE_DICT.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
        }
      }
      return s
    }

    const daysLeft = (iso: string, today = new Date()): string => {
      if (!ISO_DATE.test(iso)) return t('daysLeft.unknown')
      const deadline = new Date(iso + 'T00:00:00')
      const base = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const diff = Math.round((deadline.getTime() - base.getTime()) / 86_400_000)
      if (diff < 0) return t('daysLeft.past', { n: Math.abs(diff) })
      if (diff === 0) return t('daysLeft.today')
      if (diff === 1) return t('daysLeft.tomorrow')
      if (diff <= 7) return t('daysLeft.thisWeek', { n: diff })
      if (diff <= 30) return t('daysLeft.soon', { n: diff })
      return t('daysLeft.far', { n: diff })
    }

    const formatDeadline = (iso: string): string => {
      if (!ISO_DATE.test(iso)) return t('deadline.unknown')
      const [y, m, dd] = iso.split('-').map(Number)
      return format(new Date(y, m - 1, dd), t('deadlineFull'), { locale: DATE_LOCALE[lang] })
    }

    const fee = (raw: Fee) => {
      const FREE_CLS = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      const PAID_CLS = 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'

      const noteText = (n: { kind: FeeNoteKind; amt?: string }): string => {
        switch (n.kind) {
          case 'someCategoriesFree':
            return t('fee.note.someCategoriesFree')
          case 'youthFree':
            return t('fee.note.youthFree')
          case 'every5thFree':
            return t('fee.note.every5thFree')
          case 'byCategory':
            return t('fee.note.byCategory')
          case 'firstFreeExtra':
            return t('fee.note.firstFreeExtra', { amt: n.amt ?? '' })
          case 'firstFreeSeries':
            return t('fee.note.firstFreeSeries', { amt: n.amt ?? '' })
          case 'portfolioYouth':
            return t('fee.note.portfolioYouth', { amt: n.amt ?? '' })
          default:
            return ''
        }
      }

      const isFree = raw.free === true
      if (isFree && !raw.note) {
        return { free: true, label: t('card.free'), cls: FREE_CLS }
      }

      let amountPart = raw.amount ?? ''
      if (raw.perImage) amountPart = `${raw.amount ?? ''}${t('fee.perImage')}`
      else if (raw.approx && raw.from) amountPart = t('fee.approxFrom', { amount: raw.amount ?? '' })
      else if (raw.from) amountPart = t('fee.from', { amount: raw.amount ?? '' })

      if (isFree && raw.note) {
        return { free: true, label: `${t('card.free')} (${noteText(raw.note)})`, cls: FREE_CLS }
      }

      const label = raw.note
        ? raw.note.kind === 'byCategory'
          ? `${noteText(raw.note)} (${amountPart})`
          : `${amountPart} (${noteText(raw.note)})`
        : amountPart

      return { free: false, label, cls: PAID_CLS }
    }

    const splitWd = (s: string) => s.split('|')

    return {
      lang,
      setLang,
      setAuto,
      isAuto,
      t,
      dateLocale: DATE_LOCALE[lang],
      daysLeft,
      formatDeadline,
      fee,
      weekdays: { short: splitWd(d.wdShort), full: splitWd(d.wdFull) },
      patterns: {
        monthTitle: d.monthTitle,
        weekTitle: d.weekTitle,
        dayTitle: d.dayTitle,
        miniMonth: d.miniMonth,
      },
    }
  }, [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useT(): I18nValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useT must be used within <I18nProvider>')
  return v
}
