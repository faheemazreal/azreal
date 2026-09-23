import React, { useState, useEffect } from 'react';
import { Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTrendingAnime, getRecentEpisodes, AnimeResult } from '../services/api';
import { Navbar } from '../components/Navbar';
import { MovieCard } from '../components/MovieCard';
import { MovieRow } from '../components/MovieRow';
import { HeroBanner } from '../components/HeroBanner';
import { ShortcutsModal } from '../components/ShortcutsModal';
import { OfflineIndicator } from '../components/OfflineIndicator';

export default function HomePage() {
  const [trending, setTrending] = useState<AnimeResult[]>([]);
  const [recent, setRecent] = useState<AnimeResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [trendingData, recentData] = await Promise.all([
        getTrendingAnime(),
        getRecentEpisodes()
      ]);
      setTrending(trendingData);
      setRecent(recentData);
      setIsLoading(false);
    };
    
    try {
      const stored = JSON.parse(localStorage.getItem('recent_watched') || '[]');
      setContinueWatching(stored);
    } catch (e) {}

    fetchData();
  }, []);

  const handlePlayMovie = (anime: any) => {
    if (anime.episodeId) {
      navigate(`/watch/${anime.id}?ep=${anime.episodeId}`);
    } else {
      navigate(`/anime/${anime.id}`);
    }
  };

  const handleOpenDetails = (anime: any) => {
    navigate(`/anime/${anime.id}`);
  };

  // Convert AnimeResult to our internal Movie type for UI components
  const mapToMovie = (a: AnimeResult): any => ({
    id: a.id,
    title: a.title.english || a.title.romaji || a.title.native,
    originalTitle: a.title.native,
    description: a.description,
    posterUrl: a.image,
    backdropUrl: a.cover,
    rating: 'PG-13', // default
    userRating: a.rating ? a.rating / 10 : 0,
    year: a.releaseDate,
    genres: a.genres || [],
    duration: 24,
    episodesCount: a.totalEpisodes,
    status: a.status,
    type: a.type,
    discInfo: { format: 'Web-Master', sourceType: 'Digital Master' },
    cast: [],
    director: 'Various',
  });

  const featured = trending.slice(0, 5).map(mapToMovie);
  const trendingMovies = trending.map(mapToMovie);
  const recentMovies = recent.map(mapToMovie);
  
  const continueWatchingMovies = continueWatching.map(cw => ({
    id: cw.id,
    episodeId: cw.episodeId,
    title: cw.title,
    originalTitle: cw.title,
    description: `Resume playing episode...`,
    posterUrl: cw.image,
    backdropUrl: cw.cover || cw.image,
    rating: 'PG-13',
    userRating: 0,
    year: 'Recent',
    genres: [],
    duration: 24,
    episodesCount: 0,
    status: '',
    type: 'TV',
    discInfo: { format: 'Web', sourceType: 'Stream' },
    cast: [],
    director: 'Various',
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      <Navbar
        currentFilter={'all'}
        onSelectFilter={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRandomAnime={() => {
          if (trending.length > 0) {
            const randomId = trending[Math.floor(Math.random() * trending.length)].id;
            navigate(`/anime/${randomId}`);
          }
        }}
        watchlistCount={0}
        continueWatchingCount={continueWatching.length}
      />

      <main className="pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <HeroBanner
                featuredMovies={featured}
                onPlayMovie={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={() => {}}
              />
            )}
            
            <div className="space-y-8 pt-6">
              {continueWatchingMovies.length > 0 && (
                <MovieRow
                  id="row-continue-watching"
                  title="Continue Watching"
                  subtitle="Pick up where you left off"
                  badge="Recent"
                  movies={continueWatchingMovies}
                  onPlay={handlePlayMovie}
                  onOpenDetails={handleOpenDetails}
                  onToggleWatchlist={() => {}}
                />
              )}

              <MovieRow
                id="row-recent-episodes"
                title="Latest Episodes"
                subtitle="Just updated, watch them first"
                badge="New"
                movies={recentMovies}
                onPlay={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={() => {}}
              />

              <MovieRow
                id="row-trending-anime"
                title="Trending Anime"
                subtitle="Most watched right now"
                badge="Hot"
                movies={trendingMovies}
                onPlay={handlePlayMovie}
                onOpenDetails={handleOpenDetails}
                onToggleWatchlist={() => {}}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-center text-xs font-mono-tech text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Tv className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-zinc-200">Azreal</span>
            <span>• Watch Anime Online for Free</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Sub & Dub • 1080p HD</span>
            <span>•</span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Keyboard Shortcuts
            </button>
          </div>
        </div>
      </footer>
      
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <OfflineIndicator />
    </div>
  );
}
