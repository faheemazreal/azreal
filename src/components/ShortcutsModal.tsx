import React from 'react';
import { X, Keyboard, Tv, Disc, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', description: 'Play / Pause Video' },
    { key: 'F', description: 'Toggle Fullscreen Cinema Mode' },
    { key: 'M', description: 'Toggle Audio Mute / Unmute' },
    { key: '← (Left Arrow)', description: 'Replay / Skip Back 10 Seconds' },
    { key: '→ (Right Arrow)', description: 'Fast Forward / Skip Ahead 10 Seconds' },
    { key: '↑ / ↓ (Up / Down)', description: 'Adjust Master Volume' },
    { key: 'Esc', description: 'Exit Theater View / Close Dialog' },
  ];

  return (
    <div 
      id="shortcuts-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-cinzel text-white">
                Home Theater Remote & Keys
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono-tech">
                Couch remote & keyboard controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-850"
            >
              <span className="text-xs text-zinc-300">{sc.description}</span>
              <kbd className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 font-mono-tech text-[11px] font-bold text-amber-400 shadow">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-mono-tech">
            <Tv className="w-3.5 h-3.5" />
            <span>Optimized for 4K TV & Projectors</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
