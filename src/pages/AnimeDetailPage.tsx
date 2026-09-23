import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, ArrowLeft, Calendar, LayoutGrid, Clock } from 'lucide-react';
import { getAnimeDetails, AnimeInfo } from '../services/api';
import { Navbar } from '../components/Navbar';

export default function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      const details = await getAnimeDetails(id);
      setAnime(details);
      setIsLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Anime not found</h2>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-emerald-500 rounded text-black font-bold">Go Home</button>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji || anime.title.native;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar
        currentFilter={'all'}
        onSelectFilter={() => navigate('/')}
        searchQuery={''}
        onSearchChange={() => {}}
        onRandomAnime={() => {}}
        watchlistCount={0}
        continueWatchingCount={0}
      />
      
      {/* Banner */}
      <div className="relative h-[40vh] sm:h-[50vh] w-full">
        <div className="absolute inset-0">
          <img src={anime.cover || anime.image} alt={title} className="w-full h-full object-cover opacity-30 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <img src={anime.image} alt={title} className="w-32 md:w-48 rounded-lg shadow-2xl border-2 border-zinc-800" />
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-white">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-zinc-300">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {anime.rating ? (anime.rating / 10).toFixed(1) : 'N/A'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-emerald-500" /> {anime.releaseDate}</span>
                <span className="flex items-center gap-1"><LayoutGrid className="w-4 h-4 text-blue-500" /> {anime.type}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-purple-500" /> {anime.totalEpisodes || '?'} Episodes</span>
                <span className={`px-2 py-0.5 rounded ${anime.status === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {anime.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {anime.genres?.map(g => (
                  <span key={g} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300">
                    {g}
                  </span>
                ))}
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => anime.episodes?.length && navigate(`/watch/${anime.id}?ep=${anime.episodes[0].id}`)}
                  disabled={!anime.episodes?.length}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition disabled:opacity-50"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {anime.episodes?.length ? 'Watch First Episode' : 'No Episodes Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Synopsis</h2>
            <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: anime.description || 'No synopsis available.' }}>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Episodes ({anime.episodes?.length || 0})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {anime.episodes?.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => navigate(`/watch/${anime.id}?ep=${ep.id}`)}
                  className="flex items-center gap-4 p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl border border-zinc-800 hover:border-emerald-500/50 transition text-left group"
                >
                  <div className="relative w-24 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                    {ep.image ? (
                      <img src={ep.image} alt={ep.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-zinc-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition flex items-center justify-center">
                      <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-emerald-400 font-mono-tech mb-1">Episode {ep.number}</p>
                    <p className="text-sm font-medium text-white truncate">{ep.title || `Episode ${ep.number}`}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
