import React, { useState } from 'react';
import { Play, Plus, Check, Star, Eye, Disc, Volume2, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Watch progress calculation
  const totalSeconds = movie.duration * 60;
  const progressPercent = movie.lastPlayedTime 
    ? Math.min(100, Math.round((movie.lastPlayedTime / totalSeconds) * 100))
    : 0;

  return (
    <div
      id={`anime-card-${movie.id}`}
      className="relative flex-none w-44 sm:w-52 md:w-56 group cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CD Optical Disc that slides out on hover for CD/Vault collectors */}
      <div 
        className={`absolute -top-3 right-2 w-28 h-28 rounded-full border border-zinc-700/60 shadow-2xl transition-all duration-500 ease-out pointer-events-none flex items-center justify-center cd-shimmer -z-10 ${
          isHovered 
            ? 'translate-x-10 -translate-y-7 rotate-90 opacity-100' 
            : 'translate-x-0 translate-y-0 opacity-0'
        }`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255,255,255,0.4)'
        }}
      >
        <div className="w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-700 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-transparent border border-zinc-500" />
        </div>
      </div>

      {/* Main Poster Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 group-hover:border-emerald-500/60 group-hover:shadow-[0_12px_30px_rgba(16,185,129,0.18)] transition-all duration-300">
        
        {/* Poster Image Container */}
        <div className="relative aspect-[3/4] sm:aspect-[2/3] w-full overflow-hidden bg-zinc-950">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges (18+ / Quality / SUB & DUB) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none z-10">
            <div className="flex items-center gap-1.5">
              {movie.rating === 'R' && (
                <span className="px-1.5 py-0.5 rounded bg-red-600/90 text-white font-bold text-[9px]">
                  18+
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-emerald-400 font-bold text-[9px] border border-emerald-500/30">
                {movie.quality || 'HD'}
              </span>
            </div>

            {/* SUB / DUB count tag */}
            <div className="flex items-center rounded overflow-hidden border border-zinc-800 bg-black/80 backdrop-blur-md text-[9px] font-bold">
              <span className="px-1.5 py-0.5 text-emerald-400 border-r border-zinc-800">
                SUB {movie.subCount || movie.episodesCount || 12}
              </span>
              <span className="px-1.5 py-0.5 text-amber-300">
                DUB {movie.dubCount || movie.episodesCount || 12}
              </span>
            </div>
          </div>

          {/* Quick Play & Action Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20">
            <div className="flex items-center justify-center mb-3">
              <button
                id={`play-btn-${movie.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(movie);
                }}
                className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 transform hover:scale-110 active:scale-95 transition-all"
                title="Play Now"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(movie.id);
                }}
                className={`p-2 rounded-xl border backdrop-blur-md transition ${
                  movie.inWatchlist
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                }`}
                title={movie.inWatchlist ? "Remove from list" : "Add to list"}
              >
                {movie.inWatchlist ? <Check className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(movie);
                }}
                className="flex-1 py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium text-center transition"
              >
                Episodes
              </button>
            </div>
          </div>

          {/* Watch Progress Bar if started */}
          {progressPercent > 0 && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-800 z-10">
              <div 
                className="h-full bg-emerald-400" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          )}
        </div>

        {/* Card Metadata Footer */}
        <div 
          className="p-3 text-left space-y-1.5"
          onClick={() => onOpenDetails(movie)}
        >
          {/* Release info & type */}
          <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
            <span className="text-zinc-400 font-semibold">{movie.type || 'TV Series'}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{movie.userRating || 9.4}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 line-clamp-1 transition-colors">
            {movie.title}
          </h3>

          {/* Episode count & Season / Disc */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
            <span className="truncate max-w-[120px]">
              {movie.episodesCount ? `EP ${movie.episodesCount}` : `${movie.duration}m`} • {movie.genres[0]}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 text-[9px] font-mono-tech">
              {movie.discInfo.format}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
