import { useEffect, useState } from 'react'

export type MobileOS = 'ios' | 'android' | null

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pcc-install-dismissed'

/**
 * Decides whether to show the "add to home screen" banner and captures the
 * native Android install prompt when available. The banner only appears on
 * iOS / Android, only on first visits (dismissal is persisted), and never when
 * the page is already running as an installed PWA.
 */
export function useInstallBanner() {
  const [visible, setVisible] = useState(false)
  const [os, setOs] = useState<MobileOS>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Already installed as a PWA → don't nag.
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) return

    // User already dismissed it.
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      /* ignore */
    }

    const ua = navigator.userAgent
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      // iPadOS 13+ reports as Mac but is touch-capable.
      (navigator.platform === 'MacIntel' && (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1)
    const isAndroid = /Android/.test(ua)

    if (isIOS) setOs('ios')
    else if (isAndroid) setOs('android')
    else return

    setVisible(true)

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener)
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  return { visible, os, canInstall: deferredPrompt !== null, dismiss, install }
}
