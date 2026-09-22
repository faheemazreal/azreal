import React from 'react';
import { 
  Play, Plus, Check, Disc, Volume2, Sparkles, 
  ChevronRight, ChevronLeft, Eye, Star, Flame, 
  Info, Tv, Layers, ArrowRight
} from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  featuredMovies: Movie[];
  onPlayMovie: (movie: Movie, episodeId?: string) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredMovies,
  onPlayMovie,
  onOpenDetails,
  onToggleWatchlist,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  // Auto rotate banner every 9 seconds
  React.useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;
  const current = featuredMovies[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  return (
    <div id="anime-hero-spotlight" className="relative w-full h-[72vh] min-h-[520px] max-h-[760px] overflow-hidden group select-none">
      {/* Dynamic Anime Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 group-hover:scale-100"
        style={{
          backgroundImage: `url(${current.backdropUrl || current.posterUrl})`,
        }}
      >
        {/* Layered Vignette and Gradient Fades inspired by Animelok & AniWatch */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent w-full md:w-4/5 lg:w-3/5" />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Spotlight Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 z-20">
        <div className="max-w-2xl space-y-4">
          
          {/* Spotlight Ranking & Season Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
            {current.trendingRank && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                <Flame className="w-3.5 h-3.5 fill-black" />
                <span>#{current.trendingRank} Spotlight</span>
              </span>
            )}

            {/* SUB & DUB Badges */}
            <div className="flex items-center rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900/90 text-[11px] font-bold">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border-r border-zinc-700 flex items-center gap-1">
                <span>SUB</span>
                <span className="text-[10px] text-zinc-300">{current.subCount || current.episodesCount || 12}</span>
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 flex items-center gap-1">
                <span>DUB</span>
                <span className="text-[10px] text-zinc-300">{current.dubCount || current.episodesCount || 12}</span>
              </span>
            </div>

            {/* Format & Quality */}
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              {current.type || 'Anime'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-amber-400 font-semibold">
              {current.quality || '1080p HD'}
            </span>

            {current.studio && (
              <span className="hidden sm:inline-block text-zinc-400">
                • {current.studio}
              </span>
            )}
          </div>

          {/* Anime Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {current.title}
            </h1>
            {current.japaneseTitle && (
              <p className="text-sm sm:text-base text-zinc-400 font-medium mt-1 font-mono-tech">
                {current.japaneseTitle} {current.romajiTitle ? `• ${current.romajiTitle}` : ''}
              </p>
            )}
          </div>

          {/* Quick Meta Row: Rating, Duration, Genres */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{current.userRating || 9.8}</span>
            </div>
            <span>•</span>
            <span>{current.year}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold">
              {current.rating}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{current.views || '1.8M'} views</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              {current.genres.slice(0, 3).join(', ')}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed max-w-xl text-shadow">
            {current.synopsis}
          </p>

          {/* Action Buttons: Watch Now & Queue */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-watch-now-btn"
              onClick={() => onPlayMovie(current)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all duration-200 active:scale-95 group/play"
            >
              <Play className="w-5 h-5 fill-black transform group-hover/play:scale-110 transition-transform" />
              <span>Watch Now</span>
            </button>

            <button
              id="hero-watchlist-toggle-btn"
              onClick={() => onToggleWatchlist(current.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold backdrop-blur-md transition-all active:scale-95 ${
                current.inWatchlist
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg'
                  : 'bg-zinc-900/80 text-zinc-200 border-zinc-700/80 hover:bg-zinc-800'
              }`}
            >
              {current.inWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to List</span>
                </>
              )}
            </button>

            <button
              id="hero-details-btn"
              onClick={() => onOpenDetails(current)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-sm font-medium backdrop-blur-md transition"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators & Navigation Chevrons */}
      <div className="absolute bottom-8 right-6 sm:right-12 z-30 flex items-center gap-3">
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="p-2.5 rounded-full bg-black/60 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-2">
          {featuredMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i 
                  ? 'w-7 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' 
                  : 'w-2 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="p-2.5 rounded-full bg-black/60 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition backdrop-blur-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
