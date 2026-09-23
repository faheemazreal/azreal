import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Languages } from 'lucide-react';
import { getAnimeDetails, AnimeInfo } from '../services/api';
import { Navbar } from '../components/Navbar';

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const epId = searchParams.get('ep');
  
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !epId) return;
      setIsLoading(true);
      
      const animeData = await getAnimeDetails(id);
      setAnime(animeData);
      
      // Save to recently watched
      if (animeData) {
        try {
          const recent = JSON.parse(localStorage.getItem('recent_watched') || '[]');
          // Remove if exists
          const filtered = recent.filter((r: any) => r.id !== animeData.id);
          // Add to front
          filtered.unshift({
            id: animeData.id,
            title: animeData.title.english || animeData.title.romaji || animeData.title.native,
            image: animeData.image,
            cover: animeData.cover,
            episodeId: epId,
            watchedAt: new Date().toISOString()
          });
          // Keep only top 20
          localStorage.setItem('recent_watched', JSON.stringify(filtered.slice(0, 20)));
        } catch (e) {
          console.error("Failed to save recent watched:", e);
        }
      }

      setIsLoading(false);
    };
    
    fetchData();
  }, [id, epId]);

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
        <h2 className="text-2xl font-bold mb-4">Episode or stream not found.</h2>
        <button onClick={() => navigate(`/anime/${id}`)} className="px-4 py-2 bg-emerald-500 rounded text-black font-bold">Go Back</button>
      </div>
    );
  }

  const currentEpisode = anime.episodes?.find(e => e.id === epId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar
        currentFilter={'all'}
        onSelectFilter={() => navigate('/')}
        searchQuery={''}
        onSearchChange={() => {}}
        onRandomAnime={() => {}}
        watchlistCount={0}
        continueWatchingCount={0}
      />
      
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Player Area */}
        <div className="lg:col-span-3 space-y-6">
          <button onClick={() => navigate(`/anime/${id}`)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Details
          </button>
          
          <div className="w-full">
            {currentEpisode?.embedId ? (
              <iframe 
                src={`https://megaplay.buzz/stream/s-2/${currentEpisode.embedId}/${language}`} 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                referrerPolicy="no-referrer"
                className="w-full aspect-video rounded-xl bg-black border border-zinc-800"
              ></iframe>
            ) : (
              <div className="w-full aspect-video bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                <p className="text-zinc-500">No stream available for this episode.</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 p-6 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
            <div>
              <h1 className="text-xl font-bold text-white mb-2">{anime.title.english || anime.title.romaji}</h1>
              <p className="text-emerald-400 font-mono-tech text-sm">
                Episode {currentEpisode?.number} {currentEpisode?.title ? `- ${currentEpisode.title}` : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Languages className="w-4 h-4" /> Language:
              </div>
              <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                <button
                  onClick={() => setLanguage('sub')}
                  className={`px-3 py-1 text-sm rounded-md transition ${language === 'sub' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-300 hover:text-white'}`}
                >
                  Sub
                </button>
                <button
                  onClick={() => setLanguage('dub')}
                  className={`px-3 py-1 text-sm rounded-md transition ${language === 'dub' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-300 hover:text-white'}`}
                >
                  Dub
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar: Episode List */}
        <div className="lg:col-span-1 flex flex-col h-full max-h-[80vh]">
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-500" /> All Episodes ({anime.episodes?.length || 0})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {anime.episodes?.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => navigate(`/watch/${anime.id}?ep=${ep.id}`)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition ${
                    ep.id === epId 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                      : 'hover:bg-zinc-800/50 text-zinc-300'
                  }`}
                >
                  <span className="font-mono-tech text-sm">Episode {ep.number}</span>
                  {ep.id === epId && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
