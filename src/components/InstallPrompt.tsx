import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                               (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt after 5 seconds if not dismissed recently (7 days cooldown)
    if (!isInStandaloneMode && daysSinceDismissed > 7) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Desktop Chrome/Edge
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } else if (isIOS) {
      // iOS - just show the prompt, user will follow instructions
      // Keep it visible until they dismiss
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border-2 border-primary rounded-xl shadow-2xl p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download size={24} className="text-primary" />
          </div>

          <div className="flex-1">
            <h3 className="font-display font-bold text-lg mb-1 text-foreground">
              Install RadioTRN App
            </h3>

            {isIOS ? (
              <div className="text-sm space-y-2 mb-3">
                <p className="text-muted-foreground">Add to your home screen for quick access!</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Tap the Share button <span className="inline-block">⬆️</span></li>
                  <li>Scroll and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to install</li>
                </ol>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">
                Get the app experience! Install RadioTRN for faster access and offline support.
              </p>
            )}

            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Install Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
