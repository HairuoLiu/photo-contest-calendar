import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useT } from '../i18n'

/**
 * Tiny "share this page" control: copies the current URL (which already carries
 * the active language code, e.g. /zh-CN) to the clipboard. h-9 w-9, icon-only,
 * with a 2s check confirmation so it stays out of the way. Pass `className` to
 * override sizing (e.g. fill a grid cell in the mobile header box).
 */
export function ShareButton({ className }: { className?: string }) {
  const { t } = useT()
  const [copied, setCopied] = useState(false)

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={copied ? t('share.copied') : t('share.copy')}
      title={copied ? t('share.copied') : t('share.copy')}
      className={cn(
        'press grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        className,
      )}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </button>
  )
}
