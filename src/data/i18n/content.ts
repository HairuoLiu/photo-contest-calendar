// ---------------------------------------------------------------------------
// Per-language contest *content* localization.
//
// The UI chrome (buttons, labels, weekdays) is handled by src/i18n. This module
// handles the *data* — each contest's name / description / entry criteria — so
// that switching language also localizes the contest cards, not just the shell.
//
// Each language file (en.ts, zhTW.ts, ja.ts, …) is a flat Record keyed by the
// contest `id` from competitions.ts, with at most three fields:
//   name?  — localized proper-noun name (only for CJK variants; elsewhere the
//            English brand name is used as-is, which is the international norm)
//   desc   — localized one/two-sentence description
//   entry  — localized "who can enter" string
//
// Translation is machine-generated and needs native-speaker review. The fallback
// chain in the resolvers below keeps every language working even if a single
// field is missing: specific language → English → original Chinese.
// ---------------------------------------------------------------------------

import type { Competition } from '../competitions'
import type { Lang } from '../../i18n/translations'

import { comp_en } from './en'
import { comp_zhTW } from './zhTW'
import { comp_ja } from './ja'
import { comp_ko } from './ko'
import { comp_es } from './es'
import { comp_fr } from './fr'
import { comp_de } from './de'
import { comp_pt } from './pt'
import { comp_ru } from './ru'
import { comp_it } from './it'
import { comp_nl } from './nl'
import { comp_th } from './th'
import { comp_vi } from './vi'
import { comp_id } from './id'
import { comp_ms } from './ms'

export interface CompLocalized {
  name?: string
  desc: string
  entry: string
}

const TABLES: Partial<Record<Lang, Record<string, CompLocalized>>> = {
  en: comp_en,
  'zh-TW': comp_zhTW,
  ja: comp_ja,
  ko: comp_ko,
  es: comp_es,
  fr: comp_fr,
  de: comp_de,
  pt: comp_pt,
  ru: comp_ru,
  it: comp_it,
  nl: comp_nl,
  th: comp_th,
  vi: comp_vi,
  id: comp_id,
  ms: comp_ms,
}

/** Localized display name. Falls back to the English brand name (proper noun). */
export function localizedName(c: Competition, lang: Lang): string {
  const specific = TABLES[lang]?.[c.id]?.name
  if (specific) return specific
  if (lang === 'zh-CN') return c.nameZh
  return c.name
}

/** Localized description. English → original Chinese fallback. */
export function localizedDesc(c: Competition, lang: Lang): string {
  const specific = TABLES[lang]?.[c.id]?.desc
  if (specific) return specific
  if (lang === 'zh-CN') return c.description
  return TABLES.en?.[c.id]?.desc ?? c.description
}

/** Localized entry criteria. English → original Chinese fallback. */
export function localizedEntry(c: Competition, lang: Lang): string {
  const specific = TABLES[lang]?.[c.id]?.entry
  if (specific) return specific
  if (lang === 'zh-CN') return c.entryType
  return TABLES.en?.[c.id]?.entry ?? c.entryType
}
