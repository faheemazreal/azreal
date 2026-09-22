import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-950/90 border border-emerald-500/40 px-3.5 py-2 text-xs font-mono-tech text-emerald-300 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
        <Wifi className="w-4 h-4 text-emerald-400" />
        <span>Back Online • Syncing Home Cinema Library</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-xl bg-amber-950/90 border border-amber-500/50 px-4 py-2.5 text-xs font-mono-tech text-amber-300 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
      </span>
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Offline Mode — Playing locally cached and indexed media</span>
    </div>
  );
};
