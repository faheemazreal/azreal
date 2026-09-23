import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Server, Settings } from 'lucide-react';
import { getAnimeDetails, getStreamingLinks, AnimeInfo, StreamingData } from '../services/api';
import { Navbar } from '../components/Navbar';
import { HlsPlayer } from '../components/HlsPlayer';

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const epId = searchParams.get('ep');
  
  const [anime, setAnime] = useState<AnimeInfo | null>(null);
  const [streamData, setStreamData] = useState<StreamingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuality, setActiveQuality] = useState<string>('default');

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !epId) return;
      setIsLoading(true);
      
      // Fetch concurrently
      const [animeData, streamLinks] = await Promise.all([
        getAnimeDetails(id),
        getStreamingLinks(epId)
      ]);
      
      setAnime(animeData);
      setStreamData(streamLinks);
      
      if (streamLinks?.sources) {
        // Try to find auto or default, otherwise pick the best available
        const defaultSrc = streamLinks.sources.find(s => s.quality === 'default' || s.quality === 'auto');
        if (defaultSrc) {
          setActiveQuality(defaultSrc.quality);
        } else if (streamLinks.sources.length > 0) {
          setActiveQuality(streamLinks.sources[0].quality);
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

  if (!anime || !streamData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Episode or stream not found.</h2>
        <button onClick={() => navigate(`/anime/${id}`)} className="px-4 py-2 bg-emerald-500 rounded text-black font-bold">Go Back</button>
      </div>
    );
  }

  const currentSource = streamData.sources.find(s => s.quality === activeQuality) || streamData.sources[0];
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
            {currentSource ? (
              <HlsPlayer src={currentSource.url} poster={currentEpisode?.image} />
            ) : (
              <div className="w-full aspect-video bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                <p className="text-zinc-500">No stream available.</p>
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
                <Server className="w-4 h-4" /> Server:
              </div>
              <select
                value={activeQuality}
                onChange={(e) => setActiveQuality(e.target.value)}
                className="bg-zinc-800 text-white text-sm rounded-lg px-3 py-1.5 border border-zinc-700 outline-none"
              >
                {streamData.sources.map(src => (
                  <option key={src.quality} value={src.quality}>
                    {src.quality}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Sidebar: Episode List */}
        <div className="lg:col-span-1 flex flex-col h-full max-h-[80vh]">
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-500" /> All Episodes ({anime.episodes?.length})
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
