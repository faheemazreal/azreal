import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, Disc, Bookmark, Clock, Plus, Search, Sparkles, 
  Flame, Filter, ArrowUpDown, ChevronDown, Shuffle,
  Layers, UploadCloud, Star, Play
} from 'lucide-react';
import { Movie, ViewFilter } from './types';
import { INITIAL_MOVIES } from './data/mockMovies';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieRow } from './components/MovieRow';
import { MovieCard } from './components/MovieCard';
import { CinemaPlayer } from './components/CinemaPlayer';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ImportMovieModal } from './components/ImportMovieModal';
import { TheaterShelfView } from './components/TheaterShelfView';
import { ShortcutsModal } from './components/ShortcutsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const STORAGE_KEY = 'animelok_theater_movies_v2';

export default function App() {
  // Load movies from localStorage or initial mock data
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_MOVIES;
  });

  // State management
  const [currentFilter, setCurrentFilter] = useState<ViewFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'rating' | 'title' | 'year' | 'recent'>('trending');
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | undefined>(undefined);
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isShelfOpen, setIsShelfOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [dismissInstallBanner, setDismissInstallBanner] = useState<boolean>(() => {
    return sessionStorage.getItem('dismiss_pwa_banner') === 'true';
  });

  // Save movies whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch {
      // ignore quota errors
    }
  }, [movies]);

  // Movie actions
  const handleToggleWatchlist = (movieId: string) => {
    setMovies(prev =>
      prev.map(m => (m.id === movieId ? { ...m, inWatchlist: !m.inWatchlist } : m))
    );
  };

  const handlePlayMovie = (movie: Movie, episodeId?: string) => {
    setActiveEpisodeId(episodeId);
    setActiveMovie(movie);
  };

  const handleUpdateProgress = (movieId: string, time: number, completed: boolean) => {
    setMovies(prev =>
      prev.map(m =>
        m.id === movieId
          ? {
              ...m,
              lastPlayedTime: time,
              completed: completed || m.completed,
            }
          : m
      )
    );
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies(prev => [newMovie, ...prev]);
    setIsImportOpen(false);
  };

  const handleDeleteMovie = (movieId: string) => {
    setMovies(prev => prev.filter(m => m.id !== movieId));
    if (detailsMovie?.id === movieId) {
      setDetailsMovie(null);
    }
  };

  // Random Anime Selector (Animelok feature)
  const handleRandomAnime = () => {
    if (!movies.length) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    setDetailsMovie(movies[randomIndex]);
  };

  // All available genres computed dynamically
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach(m => m.genres.forEach(g => set.add(g)));
    return ['All', ...Array.from(set).sort()];
  }, [movies]);

  // Categorized movie selections
  const featuredMovies = useMemo(() => movies.filter(m => m.featured), [movies]);
  const trendingAnime = useMemo(() => [...movies].sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)), [movies]);
  const topRatedAnime = useMemo(() => [...movies].sort((a, b) => (b.userRating || 0) - (a.userRating || 0)), [movies]);
  const cdVaultMovies = useMemo(
    () => movies.filter(m => m.discInfo.sourceType === 'Physical CD Rip' || m.discInfo.format === 'CD-Video'),
    [movies]
  );
  const continueWatchingMovies = useMemo(
    () => movies.filter(m => m.lastPlayedTime && m.lastPlayedTime > 0 && !m.completed),
    [movies]
  );
  const watchlistMovies = useMemo(() => movies.filter(m => m.inWatchlist), [movies]);

  // Primary Filtered + Sorted Movie List for catalog grids
  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      // Filter tab
      if (currentFilter === 'watchlist' && !m.inWatchlist) return false;
      if (currentFilter === 'continue-watching' && (!m.lastPlayedTime || m.completed)) return false;
      if (currentFilter === 'cd-vault' && m.discInfo.sourceType !== 'Physical CD Rip' && m.discInfo.format !== 'CD-Video') return false;
      if (currentFilter === 'trending' && !m.trendingRank) return false;
      if (currentFilter === 'top-rated' && (m.userRating || 0) < 9.5) return false;

      // Genre filter
      if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesOriginal = m.originalTitle?.toLowerCase().includes(query);
        const matchesJapanese = m.japaneseTitle?.toLowerCase().includes(query);
        const matchesRomaji = m.romajiTitle?.toLowerCase().includes(query);
        const matchesDirector = m.director.toLowerCase().includes(query);
        const matchesStudio = m.studio?.toLowerCase().includes(query);
        const matchesCast = m.cast.some(c => c.toLowerCase().includes(query));
        const matchesGenre = m.genres.some(g => g.toLowerCase().includes(query));
        const matchesFormat = m.discInfo.format.toLowerCase().includes(query);
        const matchesCd = m.discInfo.cdLabel?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesOriginal && !matchesJapanese && !matchesRomaji && !matchesDirector && !matchesStudio && !matchesCast && !matchesGenre && !matchesFormat && !matchesCd) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') return (a.trendingRank || 99) - (b.trendingRank || 99);
      if (sortBy === 'rating') return (b.userRating || 0) - (a.userRating || 0);
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'recent') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [movies, currentFilter, selectedGenre, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Mobile PWA Install Banner */}
      {!dismissInstallBanner && (
        <PWAInstallButton
          variant="banner"
          onDismissBanner={() => {
            setDismissInstallBanner(true);
            sessionStorage.setItem('dismiss_pwa_banner', 'true');
          }}
        />
      )}

      {/* Top Navigation */}
      <Navbar
        currentFilter={currentFilter}
        onSelectFilter={(filter) => {
          setCurrentFilter(filter);
          setIsShelfOpen(false);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenShelf={() => setIsShelfOpen(!isShelfOpen)}
        isShelfOpen={isShelfOpen}
        onRandomAnime={handleRandomAnime}
        watchlistCount={watchlistMovies.length}
        continueWatchingCount={continueWatchingMovies.length}
      />

      {/* Main Content Area */}
      <main className="pb-24">
        {/* 3D CD Shelf View Mode */}
        {isShelfOpen ? (
          <TheaterShelfView
            movies={movies}
            onPlay={handlePlayMovie}
            onOpenDetails={setDetailsMovie}
            onClose={() => setIsShelfOpen(false)}
          />
        ) : (
          <>
            {/* Spotlight Hero Banner (Shown on default 'all' view when not searching) */}
            {currentFilter === 'all' && !searchQuery && (
              <HeroBanner
                featuredMovies={featuredMovies.length ? featuredMovies : movies.slice(0, 3)}
                onPlayMovie={handlePlayMovie}
                onOpenDetails={setDetailsMovie}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}

            {/* Curated Streaming Rows (Animelok & AniWatch Category Rows) */}
            {currentFilter === 'all' && !searchQuery && selectedGenre === 'All' && (
              <div className="space-y-8 pt-6">
                {/* Continue Watching Row */}
                {continueWatchingMovies.length > 0 && (
                  <MovieRow
                    id="row-continue-watching"
                    title="Continue Watching"
                    subtitle="Pick up your anime episodes and movies right where you left off"
                    badge="In Progress"
                    movies={continueWatchingMovies}
                    onPlay={handlePlayMovie}
                    onOpenDetails={setDetailsMovie}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                )}

                {/* Trending Anime Spotlight Row */}
                <MovieRow
                  id="row-trending-anime"
                  title="Trending Anime"
                  subtitle="Most watched episodes and high-octane seasonal series"
                  badge="Hot & Airing"
                  movies={trendingAnime}
                  onPlay={handlePlayMovie}
                  onOpenDetails={setDetailsMovie}
                  onToggleWatchlist={handleToggleWatchlist}
                />

                {/* Top Rated & Masterpieces */}
                <MovieRow
                  id="row-top-rated"
                  title="Top Rated Masterpieces"
                  subtitle="Critically acclaimed cinematic features and studio classics"
                  badge="Rating 9.5+"
                  movies={topRatedAnime}
                  onPlay={handlePlayMovie}
                  onOpenDetails={setDetailsMovie}
                  onToggleWatchlist={handleToggleWatchlist}
                />

                {/* CD-ROM & Disc Rips Vault */}
                <MovieRow
                  id="row-cd-vault"
                  title="CD-ROM & Physical Disc Vault"
                  subtitle="Digitized VCD, DVD, and LaserDisc physical media collections"
                  badge="Optical Archive"
                  movies={cdVaultMovies}
                  onPlay={handlePlayMovie}
                  onOpenDetails={setDetailsMovie}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </div>
            )}

            {/* Filter Bar & Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {searchQuery
                        ? `Search Results for "${searchQuery}"`
                        : currentFilter === 'watchlist'
                        ? 'Your Anime Watchlist'
                        : currentFilter === 'continue-watching'
                        ? 'Continue Watching'
                        : currentFilter === 'cd-vault'
                        ? 'CD-ROM Optical Vault'
                        : currentFilter === 'trending'
                        ? 'Trending Top Airing'
                        : currentFilter === 'top-rated'
                        ? 'Top Rated Masterpieces'
                        : 'Explore Anime & Movies'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {filteredMovies.length} Titles
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono-tech">
                    Filter by genres, stream servers, or optical disc formats
                  </p>
                </div>

                {/* Controls: Genre pills + Sort dropdown */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Genre selector */}
                  <div className="relative">
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {availableGenres.map(g => (
                        <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="trending">Sort: Trending Rank</option>
                      <option value="rating">Sort: Top Rating</option>
                      <option value="recent">Sort: Recently Added</option>
                      <option value="year">Sort: Release Year</option>
                      <option value="title">Sort: A-Z Title</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid content */}
              <div className="pt-8">
                {filteredMovies.length === 0 ? (
                  <div className="py-20 text-center space-y-4 bg-zinc-900/30 rounded-3xl border border-zinc-800/80 p-8">
                    <Tv className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-lg font-bold text-zinc-200">
                      No titles matched your selection
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono-tech max-w-md mx-auto">
                      Try clearing your search query, adjusting the genre filter, or upload your CD movies to your personal theater library.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGenre('All');
                        setCurrentFilter('all');
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {filteredMovies.map((movie) => (
                      <div key={movie.id} className="flex justify-center">
                        <MovieCard
                          movie={movie}
                          onPlay={handlePlayMovie}
                          onOpenDetails={setDetailsMovie}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-center text-xs font-mono-tech text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Tv className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-zinc-200">Animelok Home Theater</span>
            <span>• Full-fidelity optical disc rips & HD streaming</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>1080p / 4K Multi-Audio Master</span>
            <span>•</span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Shortcuts
            </button>
            <span>•</span>
            <button
              onClick={() => setIsImportOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Upload CD
            </button>
          </div>
        </div>
      </footer>

      {/* Cinema Player (Full screen overlay when a movie or episode is playing) */}
      {activeMovie && (
        <CinemaPlayer
          movie={activeMovie}
          initialEpisodeId={activeEpisodeId}
          onClose={() => {
            setActiveMovie(null);
            setActiveEpisodeId(undefined);
          }}
          onUpdateProgress={handleUpdateProgress}
        />
      )}

      {/* Movie Details Modal Drawer with Episodes Grid */}
      <MovieDetailsModal
        movie={detailsMovie}
        onClose={() => setDetailsMovie(null)}
        onPlay={handlePlayMovie}
        onToggleWatchlist={handleToggleWatchlist}
        onDeleteMovie={handleDeleteMovie}
      />

      {/* Import / Add Movie Modal */}
      <ImportMovieModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onAddMovie={handleAddMovie}
      />

      {/* Remote & Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Connectivity & Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
