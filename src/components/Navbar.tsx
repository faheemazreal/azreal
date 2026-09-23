import React, { useState, useEffect, useRef } from 'react';
import { 
  Bookmark, Clock, Search, 
  Flame, X, Tv, Shuffle, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ViewFilter } from '../types';
import { searchAnime, AnimeResult } from '../services/api';

interface NavbarProps {
  currentFilter: ViewFilter;
  onSelectFilter: (filter: ViewFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRandomAnime: () => void;
  watchlistCount: number;
  continueWatchingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  onRandomAnime,
  watchlistCount,
  continueWatchingCount,
}) => {
  const navigate = useNavigate();
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      const data = await searchAnime(searchQuery);
      setResults(data.slice(0, 5)); // show top 5
      setIsSearching(false);
    };

    const debounce = setTimeout(() => fetchResults(), 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAnime = (id: string) => {
    setShowDropdown(false);
    onSearchChange('');
    navigate(`/anime/${id}`);
  };

  const SearchDropdown = () => {
    if (!showDropdown || !searchQuery.trim()) return null;
    
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-center text-zinc-500 text-sm">Searching...</div>
        ) : results.length > 0 ? (
          <div className="flex flex-col">
            {results.map((anime) => (
              <button
                key={anime.id}
                onMouseDown={() => handleSelectAnime(anime.id)}
                className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition text-left"
              >
                <img src={anime.image} alt={anime.title.english || anime.title.romaji} className="w-10 h-14 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{anime.title.english || anime.title.romaji || anime.title.native}</p>
                  <p className="text-xs text-emerald-400 mt-1">{anime.releaseDate} • {anime.type}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-zinc-500 text-sm">No results found for "{searchQuery}"</div>
        )}
      </div>
    );
  };

  return (
    <header 
      id="animelok-navbar"
      className="sticky top-0 z-40 w-full transition-colors duration-300 border-b bg-zinc-950/90 border-zinc-800/80 backdrop-blur-xl shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onSelectFilter('all')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Glowing Logo Icon */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Tv className="w-5 h-5 text-emerald-400 transform group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  AZREAL
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono-tech uppercase font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                  STREAM
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono-tech tracking-tight hidden sm:block">
                Watch Anime Online • Sub & Dub
              </p>
            </div>
          </div>

          {/* Navigation Filter Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-2">
            <button
              id="filter-all-btn"
              onClick={() => onSelectFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === 'all'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              Home
            </button>

            <button
              id="filter-trending-btn"
              onClick={() => onSelectFilter('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === 'trending'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Trending</span>
            </button>

            <button
              id="filter-top-rated-btn"
              onClick={() => onSelectFilter('top-rated')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === 'top-rated'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <span>Top Rated</span>
            </button>

            <button
              id="filter-watchlist-btn"
              onClick={() => onSelectFilter('watchlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentFilter === 'watchlist'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
                  {watchlistCount}
                </span>
              )}
            </button>

            {continueWatchingCount > 0 && (
              <button
                id="filter-continue-btn"
                onClick={() => onSelectFilter('continue-watching')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentFilter === 'continue-watching'
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Continue</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
                  {continueWatchingCount}
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search Input */}
          <div ref={searchRef} className="relative hidden md:block w-64 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search anime, genre, studio..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 text-xs text-zinc-200 placeholder-zinc-500 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            
            {/* SEARCH DROPDOWN */}
            <SearchDropdown />
          </div>

          {/* Random Anime Picker */}
          <button
            id="random-anime-btn"
            onClick={onRandomAnime}
            title="Random Anime Discovery"
            className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 transition"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search anime, genres..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                setShowDropdown(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {/* SEARCH DROPDOWN MOBILE */}
          <SearchDropdown />
        </div>
      </div>
    </header>
  );
};

