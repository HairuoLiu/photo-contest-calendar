import { AnimatePresence, motion } from 'framer-motion'
import { Download, Smartphone, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useT } from '../i18n'
import type { MobileOS } from '../lib/useInstallBanner'

interface Props {
  visible: boolean
  os: MobileOS
  canInstall: boolean
  onInstall: () => void
  onDismiss: () => void
}

/**
 * A dismissible top banner shown to mobile (iOS / Android) visitors, teaching
 * them how to add the page to their home screen so it opens like a native app.
 * On Android, when the browser supports it, a one-click "install" button is
 * offered via the captured beforeinstallprompt event.
 */
export function InstallBanner({ visible, os, canInstall, onInstall, onDismiss }: Props) {
  const { t } = useT()
  const isIOS = os === 'ios'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="region"
          aria-label={t('install.aria')}
          className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-slate-900 text-white shadow-lg shadow-black/20"
        >
          <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            <Smartphone className="h-5 w-5 shrink-0" aria-hidden />
            <p className="min-w-0 flex-1 text-[13px] leading-snug sm:text-sm">
              {isIOS ? t('install.ios') : t('install.android')}
            </p>

            {!isIOS && canInstall && (
              <button
                type="button"
                onClick={onInstall}
                className="press inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                <Download className="h-3.5 w-3.5" />
                {t('install.button')}
              </button>
            )}

            <button
              type="button"
              onClick={onDismiss}
              aria-label={t('install.close')}
              className={cn(
                'press grid h-7 w-7 shrink-0 place-items-center rounded-full transition hover:bg-white/20',
                !isIOS && canInstall ? '' : 'ml-1',
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
