import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Disc } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  id,
  title,
  subtitle,
  badge,
  movies,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  if (!movies.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;
    rowRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id={id} className="relative py-4 group/row">
      {/* Row Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white tracking-wide">
              {title}
            </h2>
            {badge && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Disc className="w-2.5 h-2.5" />
                {badge}
              </span>
            )}
            <span className="text-xs font-mono-tech text-zinc-500">
              ({movies.length})
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-400 font-mono-tech mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Buttons */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition shadow"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition shadow"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div
        ref={rowRef}
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 py-4"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} style={{ scrollSnapAlign: 'start' }}>
            <MovieCard
              movie={movie}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              onToggleWatchlist={onToggleWatchlist}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
