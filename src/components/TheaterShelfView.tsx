import React, { useState } from 'react';
import { Disc, Play, Info, ArrowLeft, Plus, Star, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface TheaterShelfViewProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onClose: () => void;
}

export const TheaterShelfView: React.FC<TheaterShelfViewProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  onClose,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movies[0] || null);

  return (
    <div id="theater-shelf-view" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-cinzel text-white">
                Optical Disc & CD Media Shelf
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Interactive Collector Shelf
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono-tech mt-0.5">
              Physical CD jewel cases and boxsets digitized for home theater bitstream playback
            </p>
          </div>
        </div>

        <div className="text-xs font-mono-tech text-zinc-400 flex items-center gap-2">
          <Disc className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>{movies.length} Optical Titles Cataloged</span>
        </div>
      </div>

      {/* Featured Disc Turntable / Collector Inspection Stage */}
      {selectedMovie && (
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 sm:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8">
          {/* Subtle background glow */}
          <div 
            className="absolute right-0 top-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{
              backgroundImage: `url(${selectedMovie.posterUrl})`,
              backgroundSize: 'cover',
            }}
          />

          {/* Left: 3D Jewel Case & Disc Presentation */}
          <div className="relative flex-none flex items-center justify-center py-4">
            {/* Jewel Case */}
            <div className="relative w-44 sm:w-52 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-zinc-700/80 bg-zinc-950 z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white/20 to-transparent border-r border-white/10" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono-tech uppercase bg-black/85 text-amber-400 border border-amber-500/40">
                {selectedMovie.discInfo.format}
              </div>
            </div>

            {/* Extracted Spinning Optical Disc */}
            <div 
              className="relative -ml-16 sm:-ml-20 w-40 sm:w-48 h-40 sm:h-48 rounded-full border border-zinc-600 shadow-2xl flex items-center justify-center cd-shimmer z-10 animate-spin"
              style={{ animationDuration: '10s' }}
            >
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-zinc-950 border-2 border-zinc-600 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border border-zinc-500" />
              </div>
              <div className="absolute top-4 text-[8px] font-mono-tech uppercase text-zinc-300 font-bold max-w-[100px] truncate text-center">
                {selectedMovie.discInfo.cdLabel || selectedMovie.title}
              </div>
            </div>
          </div>

          {/* Right: Disc Details & Quick Play */}
          <div className="flex-1 space-y-4 text-center md:text-left z-20">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono-tech">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                {selectedMovie.discInfo.format}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                {selectedMovie.discInfo.resolution}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                {selectedMovie.discInfo.audioCodec}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {selectedMovie.discInfo.aspectRatio}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
              {selectedMovie.title}
            </h3>

            <p className="text-xs text-amber-400 font-mono-tech">
              Archive Label: {selectedMovie.discInfo.cdLabel} • Duration: {selectedMovie.duration} mins
            </p>

            <p className="text-sm text-zinc-300 max-w-xl line-clamp-3">
              {selectedMovie.synopsis}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => onPlay(selectedMovie)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Stream This Disc</span>
              </button>

              <button
                onClick={() => onOpenDetails(selectedMovie)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
              >
                <Info className="w-4 h-4" />
                <span>View Full Disc Specs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Physical Media Rack Shelf Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono-tech uppercase text-zinc-400 tracking-wider">
            CD & DVD Media Rack (Click to select & inspect)
          </h3>
          <span className="text-xs text-amber-400/90 font-mono-tech">
            Select a case to inspect disc
          </span>
        </div>

        {/* The Wooden/Obsidian Cinema Rack */}
        <div className="relative p-6 rounded-3xl bg-zinc-950 border border-zinc-850 shadow-inner">
          <div className="flex items-end gap-4 overflow-x-auto no-scrollbar py-6 px-4">
            {movies.map((movie) => {
              const isSelected = selectedMovie?.id === movie.id;
              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className={`flex-none cursor-pointer transition-all duration-300 transform ${
                    isSelected 
                      ? '-translate-y-4 scale-105' 
                      : 'hover:-translate-y-2 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Jewel Case on shelf */}
                  <div className={`relative w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border-2 transition-all shadow-xl ${
                    isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'border-zinc-800'
                  }`}>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Plastic spine reflection */}
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/20 to-transparent border-r border-white/10" />

                    {/* CD badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-mono-tech font-bold uppercase bg-black/80 text-amber-400">
                      {movie.discInfo.format}
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/80 to-transparent text-[10px]">
                      <div className="font-semibold text-white truncate">{movie.title}</div>
                      <div className="text-[9px] text-zinc-400 font-mono-tech">{movie.year}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wooden / Brushed Metal Shelf Base Plank */}
          <div className="w-full h-4 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded-b-xl border-t border-zinc-600 shadow-2xl" />
        </div>
      </div>
    </div>
  );
};
