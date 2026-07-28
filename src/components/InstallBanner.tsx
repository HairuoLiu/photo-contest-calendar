import { AnimatePresence, motion } from 'framer-motion'
import { Download, Smartphone, X } from 'lucide-react'
import { cn } from '../lib/utils'
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
          aria-label="安装提示"
          className="fixed inset-x-0 top-0 z-[60] bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/20"
        >
          <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            <Smartphone className="h-5 w-5 shrink-0" aria-hidden />
            <p className="min-w-0 flex-1 text-[13px] leading-snug sm:text-sm">
              {isIOS ? (
                <>
                  把这个日历存到主屏幕：点浏览器右上角
                  <span className="font-semibold"> 分享 ↗ </span>
                  →
                  <span className="font-semibold"> 添加到主屏幕</span>，以后像 App 一样一键打开今天的比赛。
                </>
              ) : (
                <>
                  把这个日历存到主屏幕：点浏览器菜单
                  <span className="font-semibold"> ⋮ </span>
                  →
                  <span className="font-semibold"> 安装应用 / 添加到主屏幕</span>。
                </>
              )}
            </p>

            {!isIOS && canInstall && (
              <button
                type="button"
                onClick={onInstall}
                className="press inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-sm transition hover:bg-white"
              >
                <Download className="h-3.5 w-3.5" />
                一键安装
              </button>
            )}

            <button
              type="button"
              onClick={onDismiss}
              aria-label="关闭提示"
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
