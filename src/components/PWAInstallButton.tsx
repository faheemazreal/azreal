import React, { useState } from 'react';
import { Download, Smartphone, Apple, Check, Share, PlusSquare, X, Monitor, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'modal';
  onDismissBanner?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar', onDismissBanner }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isMobile, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // If already running as standalone installed app, don't show the button
  if (isInstalled) {
    return null;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Navbar compact button */}
      {variant === 'navbar' && (
        <button
          id="pwa-install-nav-btn"
          onClick={handleTriggerInstall}
          title="Install Home Cinema as Native App on Mobile / Tablet / PC"
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-medium shadow-sm transition-all active:scale-95 group"
        >
          <Smartphone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline font-mono-tech">Install App</span>
          <span className="md:hidden font-mono-tech">Install</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>
      )}

      {/* Banner variant for mobile users */}
      {variant === 'banner' && (
        <div id="pwa-mobile-banner" className="bg-gradient-to-r from-amber-950/70 via-zinc-900 to-zinc-950 border-b border-amber-500/30 px-4 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex-shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-semibold text-zinc-200">Install Home Theater Cinema</span>
                <span className="hidden sm:inline text-zinc-400 ml-1.5">
                  • Fullscreen playback, remote control, and fast home-screen access on Android & iOS.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                id="pwa-banner-install-action"
                onClick={handleTriggerInstall}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition active:scale-95"
              >
                {isInstallable ? 'Install Now' : 'How to Install'}
              </button>
              {onDismissBanner && (
                <button
                  onClick={onDismissBanner}
                  className="p-1 text-zinc-500 hover:text-zinc-300"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Installation Guide Modal (Especially for iOS Safari, Chrome on Android, and Desktop) */}
      {showGuideModal && (
        <div 
          id="pwa-install-modal" 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setShowGuideModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6 text-zinc-200 relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold font-cinzel text-white">
                  Install on Mobile & Tablet
                </h3>
                <p className="text-xs text-zinc-400 font-mono-tech">
                  Native standalone Progressive Web App (PWA)
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              You can install <strong className="text-amber-400">Home Theater Cinema</strong> directly to your iPhone, iPad, Android phone, or tablet home screen without needing an app store!
            </p>

            {/* Platform Instructions */}
            <div className="space-y-3">
              {/* iOS Instructions */}
              <div className="rounded-xl bg-zinc-950/70 border border-zinc-800 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Apple className="w-4 h-4" />
                  <span>iPhone / iPad (Safari)</span>
                </div>
                <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                  <li>
                    Tap the <strong className="text-zinc-200 inline-flex items-center gap-1"><Share className="w-3 h-3 text-amber-400 inline" /> Share</strong> button in Safari toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-zinc-200 inline-flex items-center gap-1"><PlusSquare className="w-3 h-3 text-amber-400 inline" /> Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong className="text-zinc-200">Add</strong> in the top-right corner. It will launch full-screen from your home screen.
                  </li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="rounded-xl bg-zinc-950/70 border border-zinc-800 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Android (Chrome / Brave / Edge)</span>
                </div>
                {isInstallable ? (
                  <button
                    onClick={async () => {
                      setShowGuideModal(false);
                      await install();
                    }}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition shadow-lg shadow-amber-500/20"
                  >
                    <Download className="w-4 h-4" />
                    Tap to Install Automatically
                  </button>
                ) : (
                  <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                    <li>
                      Tap the <strong className="text-zinc-200">three dots menu (⋮)</strong> in Chrome.
                    </li>
                    <li>
                      Tap <strong className="text-zinc-200">Install app</strong> or <strong className="text-zinc-200">Add to Home screen</strong>.
                    </li>
                    <li>
                      Confirm <strong className="text-zinc-200">Install</strong>.
                    </li>
                  </ol>
                )}
              </div>

              {/* Desktop / Laptop Instructions */}
              <div className="rounded-xl bg-zinc-950/70 border border-zinc-800 p-3.5 space-y-1 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-300 font-medium">
                  <Monitor className="w-4 h-4 text-amber-400" />
                  <span>PC / Mac / ChromeOS:</span>
                </div>
                <p className="leading-relaxed">
                  Click the install icon in your browser address bar (top right) to run as an independent desktop theater client.
                </p>
              </div>
            </div>

            {/* Quick Share / Copy URL */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">App URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Share className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy URL to Open on Mobile</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowGuideModal(false)}
                className="py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
