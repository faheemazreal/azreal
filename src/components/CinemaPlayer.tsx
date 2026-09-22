import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, 
  RotateCw, Disc, ArrowLeft, Settings, Subtitles, Film, 
  Sparkles, Monitor, FastForward, Check, Info, SkipForward,
  SkipBack, Server, ListVideo, Layers
} from 'lucide-react';
import { Movie, AspectRatio, Episode } from '../types';

interface CinemaPlayerProps {
  movie: Movie;
  initialEpisodeId?: string;
  onClose: () => void;
  onUpdateProgress: (movieId: string, time: number, completed: boolean) => void;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  movie,
  initialEpisodeId,
  onClose,
  onUpdateProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Episodes list
  const episodes = movie.episodes || [
    { id: 'ep-1', number: 1, title: 'Episode 1: The Awakening', duration: 24, videoUrl: movie.videoUrl },
    { id: 'ep-2', number: 2, title: 'Episode 2: The Trial of Sorrows', duration: 24, videoUrl: movie.videoUrl },
    { id: 'ep-3', number: 3, title: 'Episode 3: Strike of Destiny', duration: 24, videoUrl: movie.videoUrl },
  ];

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(() => {
    if (initialEpisodeId) {
      const idx = episodes.findIndex(e => e.id === initialEpisodeId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const activeEpisode = episodes[currentEpisodeIndex] || episodes[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(movie.discInfo.aspectRatio || '16:9');
  const [ambientGlow, setAmbientGlow] = useState<boolean>(true);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<string>(
    movie.audioTracks?.[0]?.label || movie.discInfo.audioCodec || 'Japanese (Original Master)'
  );
  const [activeSubtitle, setActiveSubtitle] = useState<string>('English [CC]');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showAudioMenu, setShowAudioMenu] = useState<boolean>(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showEpisodesDrawer, setShowEpisodesDrawer] = useState<boolean>(false);
  const [showServerMenu, setShowServerMenu] = useState<boolean>(false);
  const [currentServer, setCurrentServer] = useState<string>('VidStreaming (CDN)');
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [showResumePrompt, setShowResumePrompt] = useState<boolean>(
    Boolean(movie.lastPlayedTime && movie.lastPlayedTime > 10 && movie.lastPlayedTime < (movie.duration * 60 - 30))
  );

  // Initialize playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (movie.lastPlayedTime && !showResumePrompt && currentEpisodeIndex === 0) {
      video.currentTime = movie.lastPlayedTime;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentEpisodeIndex]);

  // Hide controls on idle
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
        setShowAudioMenu(false);
        setShowSubtitlesMenu(false);
        setShowSpeedMenu(false);
        setShowEpisodesDrawer(false);
        setShowServerMenu(false);
      }
    }, 3500);
  }, [isPlaying]);

  const handleMouseMove = () => {
    resetControlsTimer();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);

    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(bufferedEnd);
    }

    if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
      onUpdateProgress(movie.id, Math.floor(videoRef.current.currentTime), false);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    resetControlsTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      setCurrentEpisodeIndex(prev => prev + 1);
      setCurrentTime(0);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(prev => prev - 1);
      setCurrentTime(0);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = Math.floor(secs % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    }
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '2.39:1':
        return 'aspect-[2.39/1] max-h-[82vh]';
      case '1.85:1':
        return 'aspect-[1.85/1] max-h-[88vh]';
      case '4:3':
        return 'aspect-[4/3] max-h-[92vh]';
      case '16:9':
      default:
        return 'aspect-video max-h-[92vh]';
    }
  };

  return (
    <div 
      ref={containerRef}
      id="animelok-cinema-player"
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Dynamic Ambient Glow */}
      {ambientGlow && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-45 blur-3xl scale-110 transition-opacity duration-1000 -z-10 overflow-hidden"
          style={{
            backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(75px) brightness(0.6) saturate(1.4)'
          }}
        />
      )}

      {/* Top Header Controls */}
      <div 
        className={`absolute top-0 inset-x-0 z-50 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (videoRef.current) {
                onUpdateProgress(movie.id, Math.floor(videoRef.current.currentTime), false);
              }
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white backdrop-blur-md border border-zinc-700/60 shadow-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Exit</span>
          </button>

          <div className="hidden sm:block">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{movie.title}</span>
              <span className="text-emerald-400 font-mono-tech text-xs">
                EP {activeEpisode.number}: {activeEpisode.title}
              </span>
            </h3>
          </div>
        </div>

        {/* Top Right Badges */}
        <div className="flex items-center gap-2">
          {/* Episode Quick Drawer button */}
          <button
            onClick={() => setShowEpisodesDrawer(!showEpisodesDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 text-zinc-200 border border-zinc-700 text-xs font-medium backdrop-blur-md hover:bg-zinc-800"
          >
            <ListVideo className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Episodes ({activeEpisode.number}/{episodes.length})</span>
          </button>

          {/* Ambient Glow Toggle */}
          <button
            onClick={() => setAmbientGlow(!ambientGlow)}
            title="Toggle Ambient Glow"
            className={`p-2 rounded-lg border backdrop-blur-md transition ${
              ambientGlow 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div 
        className={`relative w-full flex items-center justify-center shadow-2xl transition-all duration-300 ${getAspectRatioStyle()}`}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          id="main-cinema-video"
          src={activeEpisode.videoUrl || movie.videoUrl}
          className="w-full h-full object-contain cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            if (autoNext && currentEpisodeIndex < episodes.length - 1) {
              handleNextEpisode();
            } else {
              setIsPlaying(false);
              onUpdateProgress(movie.id, duration, true);
            }
          }}
          playsInline
        />

        {/* Skip Intro & Outro Button Overlay (Animelok & AniWatch feature) */}
        {currentTime > 5 && currentTime < 90 && (
          <div className="absolute bottom-24 right-8 z-40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                skipTime(85);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-xl active:scale-95 transition"
            >
              <FastForward className="w-4 h-4 fill-black" />
              <span>Skip Intro (+85s)</span>
            </button>
          </div>
        )}

        {/* Live Subtitle Simulated Render */}
        {activeSubtitle !== 'Off' && (
          <div className="absolute bottom-16 inset-x-0 pointer-events-none flex justify-center px-8 z-30">
            <span className="bg-black/75 px-4 py-1.5 rounded-md text-emerald-300 font-medium text-lg sm:text-xl drop-shadow-md text-center max-w-2xl border border-zinc-800/40">
              [Subtitle: {activeSubtitle} - Synced to {selectedAudioTrack}]
            </span>
          </div>
        )}

        {/* Big Center Play Indicator on Pause */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/60 border border-emerald-500/50 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform transform scale-100 hover:scale-105">
              <Play className="w-10 h-10 text-emerald-400 fill-emerald-400 ml-1.5" />
            </div>
          </div>
        )}
      </div>

      {/* Floating Episodes Sidebar Drawer */}
      {showEpisodesDrawer && (
        <div 
          className="absolute top-20 right-6 w-80 max-h-[70vh] bg-zinc-950/95 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-emerald-400" />
              <span>All Episodes ({episodes.length})</span>
            </span>
            <button 
              onClick={() => setShowEpisodesDrawer(false)}
              className="text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto space-y-2 py-3 pr-1 flex-1">
            {episodes.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => {
                  setCurrentEpisodeIndex(idx);
                  setCurrentTime(0);
                  setShowEpisodesDrawer(false);
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left text-xs transition ${
                  currentEpisodeIndex === idx
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-mono-tech">
                  {ep.number}
                </div>
                <div className="truncate flex-1">
                  <div className="truncate">{ep.title}</div>
                  <div className="text-[10px] text-zinc-500 font-mono-tech">{ep.duration}m</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div 
        className={`absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-14 pb-5 px-6 sm:px-10 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Progress Scrubber */}
        <div 
          className="relative w-full h-2 group/progress cursor-pointer flex items-center mb-3"
          onClick={handleSeek}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
        >
          {/* Track background */}
          <div className="w-full h-1 group-hover/progress:h-2 bg-zinc-800 rounded-full overflow-hidden transition-all relative">
            {/* Buffered */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-zinc-600/50"
              style={{ width: `${(buffered / duration) * 100}%` }}
            />
            {/* Played */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-emerald-500"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Hover preview tooltip */}
          {hoverTime !== null && (
            <div 
              className="absolute -top-8 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-zinc-700 text-[10px] font-mono-tech text-white rounded-md shadow-lg pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Prev / Next Episode Buttons */}
            <button
              onClick={handlePrevEpisode}
              disabled={currentEpisodeIndex === 0}
              className="p-2 rounded-lg text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="Previous Episode"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextEpisode}
              disabled={currentEpisodeIndex === episodes.length - 1}
              className="p-2 rounded-lg text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="Next Episode"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Time display */}
            <div className="text-xs font-mono-tech text-zinc-400 ml-2">
              <span className="text-zinc-200">{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <button onClick={toggleMute} className="text-zinc-300 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-emerald-500 cursor-pointer h-1 bg-zinc-700 rounded-lg"
              />
            </div>
          </div>

          {/* Right Controls: Subtitles, Audio, Servers, Speed, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Audio selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAudioMenu(!showAudioMenu);
                  setShowSubtitlesMenu(false);
                  setShowSpeedMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-800"
              >
                <span>Audio</span>
              </button>

              {showAudioMenu && (
                <div className="absolute bottom-12 right-0 w-60 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl z-50 text-xs">
                  <div className="px-3 py-1.5 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800 mb-1">
                    Select Audio Track
                  </div>
                  {(movie.audioTracks || [
                    { label: 'Japanese Audio (Original)', channels: '2 Ch', format: 'FLAC Lossless' },
                    { label: 'English Dub Master', channels: '5.1 Ch', format: 'Dolby Digital' }
                  ]).map((t) => (
                    <button
                      key={t.label}
                      onClick={() => {
                        setSelectedAudioTrack(t.label);
                        setShowAudioMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-zinc-300 hover:bg-zinc-800"
                    >
                      <span>{t.label}</span>
                      {selectedAudioTrack === t.label && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSubtitlesMenu(!showSubtitlesMenu);
                  setShowAudioMenu(false);
                  setShowSpeedMenu(false);
                }}
                className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs hover:bg-zinc-800"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {showSubtitlesMenu && (
                <div className="absolute bottom-12 right-0 w-44 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl z-50 text-xs">
                  <div className="px-3 py-1.5 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800 mb-1">
                    Subtitles
                  </div>
                  {['Off', 'English [CC]', 'Spanish', 'French', 'Japanese Kanji'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setActiveSubtitle(s);
                        setShowSubtitlesMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-zinc-300 hover:bg-zinc-800"
                    >
                      <span>{s}</span>
                      {activeSubtitle === s && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Playback speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-mono-tech"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 w-32 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl z-50 text-xs">
                  {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800"
                    >
                      <span>{spd}x</span>
                      {playbackSpeed === spd && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
