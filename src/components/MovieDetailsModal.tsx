import React, { useState } from 'react';
import { 
  X, Play, Plus, Check, Star, Eye, Tv, Layers, 
  Calendar, Clock, Film, Disc, Server, Share2, Sparkles
} from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie, episodeId?: string) => void;
  onToggleWatchlist: (movieId: string) => void;
  onDeleteMovie?: (movieId: string) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlay,
  onToggleWatchlist,
  onDeleteMovie,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('Season 1');
  const [selectedServer, setSelectedServer] = useState<string>('Server 1 (Fast HD)');
  const [activeTab, setActiveTab] = useState<'episodes' | 'info' | 'servers'>('episodes');

  if (!movie) return null;

  const episodes = movie.episodes || [
    { id: 'ep-1', number: 1, title: 'Episode 1: The Awakening', duration: 24, videoUrl: movie.videoUrl },
    { id: 'ep-2', number: 2, title: 'Episode 2: The Trial of Sorrows', duration: 24, videoUrl: movie.videoUrl },
    { id: 'ep-3', number: 3, title: 'Episode 3: Strike of Destiny', duration: 24, videoUrl: movie.videoUrl },
    { id: 'ep-4', number: 4, title: 'Episode 4: Beyond the Gates', duration: 24, videoUrl: movie.videoUrl },
  ];

  return (
    <div 
      id="anime-details-drawer"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-6 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white border border-zinc-700 backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner Header with Gradient */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-transparent to-transparent" />

          {/* Animelok style top badges */}
          <div className="absolute top-5 left-6 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-bold text-xs uppercase shadow-md">
              {movie.type || 'Anime'}
            </span>
            <div className="flex items-center rounded-md overflow-hidden border border-zinc-700 bg-black/70 backdrop-blur-md text-xs font-bold">
              <span className="px-2 py-0.5 text-emerald-400 border-r border-zinc-700">
                SUB {movie.subCount || movie.episodesCount || 12}
              </span>
              <span className="px-2 py-0.5 text-amber-300">
                DUB {movie.dubCount || movie.episodesCount || 12}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-black/70 border border-zinc-700 text-zinc-200 text-xs font-mono-tech">
              {movie.quality || '1080p'}
            </span>
          </div>

          {/* Quick Play Float button */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {movie.title}
              </h2>
              {movie.japaneseTitle && (
                <p className="text-xs sm:text-sm text-zinc-300 font-mono-tech">
                  {movie.japaneseTitle} • {movie.studio || 'Studio Animation'}
                </p>
              )}
            </div>

            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition active:scale-95 flex-shrink-0"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Ep 1</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Episodes / Anime Info / Servers */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 bg-zinc-950/50">
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('episodes')}
              className={`py-3.5 border-b-2 transition ${
                activeTab === 'episodes'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Episodes ({episodes.length})
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3.5 border-b-2 transition ${
                activeTab === 'info'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Overview & Cast
            </button>
            <button
              onClick={() => setActiveTab('servers')}
              className={`py-3.5 border-b-2 transition ${
                activeTab === 'servers'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Servers & Streams
            </button>
          </div>

          <button
            onClick={() => onToggleWatchlist(movie.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              movie.inWatchlist
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-750'
            }`}
          >
            {movie.inWatchlist ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{movie.inWatchlist ? 'In List' : 'Add to List'}</span>
          </button>
        </div>

        {/* Tab 1: Episode Grid (Animelok & AniWatch episode picker) */}
        {activeTab === 'episodes' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-zinc-200">Episode Selection</span>
                <span>• 1 - {episodes.length}</span>
              </div>
              <div className="text-[11px] font-mono-tech">
                Source: {movie.discInfo.sourceType}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => onPlay(movie, ep.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 text-left transition group/ep"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold font-mono-tech text-emerald-400 group-hover/ep:bg-emerald-500 group-hover/ep:text-black transition">
                    {ep.number}
                  </div>
                  <div className="truncate min-w-0">
                    <div className="text-xs font-semibold text-zinc-200 group-hover/ep:text-emerald-300 truncate">
                      {ep.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono-tech">
                      {ep.duration}m • 1080p
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Overview & Cast Details */}
        {activeTab === 'info' && (
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-mono-tech tracking-wider text-zinc-400 font-bold">
                Synopsis
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-tech pt-2 border-t border-zinc-800">
              <div>
                <span className="text-zinc-500 block">Studio</span>
                <span className="text-zinc-200 font-semibold">{movie.studio || 'Animation Studio'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Season</span>
                <span className="text-zinc-200 font-semibold">{movie.season || `${movie.year}`}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Director</span>
                <span className="text-zinc-200 font-semibold">{movie.director}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Score</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.userRating || 9.5} / 10
                </span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 text-xs font-mono-tech block mb-2">Voice Cast</span>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span key={actor} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Streaming Servers (Animelok Fast Stream & Backup Links) */}
        {activeTab === 'servers' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Available High-Speed Video Mirrors</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'VidStreaming (Master CDN)', speed: 'Ultra Fast', type: 'SUB / DUB', res: '1080p 60fps' },
                { name: 'StreamSB (Direct)', speed: 'Fast', type: 'SUB', res: '1080p' },
                { name: 'DoodStream (Mobile)', speed: 'Optimized', type: 'SUB', res: '720p HD' },
                { name: 'CD-ROM Local Vault Archive', speed: 'Lossless Local', type: 'Master Bitstream', res: '4K HDR' },
              ].map((srv) => (
                <div 
                  key={srv.name}
                  onClick={() => setSelectedServer(srv.name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedServer === srv.name
                      ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{srv.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">
                      {srv.speed}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono-tech mt-1">
                    {srv.type} • {srv.res}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-mono-tech">
            <Disc className="w-3.5 h-3.5 text-amber-400" />
            <span>Format: {movie.discInfo.format} ({movie.discInfo.audioCodec})</span>
          </div>

          {onDeleteMovie && movie.isUserUpload && (
            <button
              onClick={() => onDeleteMovie(movie.id)}
              className="text-red-400 hover:text-red-300 text-xs"
            >
              Remove from Library
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
