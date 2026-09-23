import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
  poster?: string;
}

export const HlsPlayer: React.FC<HlsPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Ready to play
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error encountered while loading the stream.');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error encountered. Trying to recover...');
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              setError('Fatal playback error.');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    } else {
      setError('HLS is not supported in this browser.');
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="relative w-full bg-black aspect-video rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-10 p-4 text-center">
          <p className="text-red-400 font-mono-tech">{error}</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        poster={poster}
        className="w-full h-full"
        playsInline
      />
    </div>
  );
};
