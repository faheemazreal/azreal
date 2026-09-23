import axios from 'axios';

// Using vite proxy to bypass CORS when running locally. In production on Vercel, use vercel.json rewrites.
const ANIKOTO_URL = '/api';

const api = axios.create({
  baseURL: ANIKOTO_URL,
  timeout: 30000, // Increased timeout — large series like One Piece (1179 eps) take longer
});

export interface AnimeResult {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  image: string;
  cover: string;
  description: string;
  rating: number;
  releaseDate: number;
  totalEpisodes: number;
  genres: string[];
  type: string;
  status: string;
}

export interface AnimeInfo extends AnimeResult {
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  number: number;
  image: string;
  embedId?: string;
}

// Map Anikoto's format to our expected AnimeResult format
const mapAnikoto = (anime: any): AnimeResult => {
  const releaseYear = anime.year || parseInt(anime.aired) || new Date().getFullYear();
  const score = anime.score ? parseFloat(anime.score) * 10 : 80;

  // episodes can be a string number ("19") or a number or an array — handle all cases
  let totalEps = 12;
  if (typeof anime.episodes === 'string') {
    totalEps = parseInt(anime.episodes) || 12;
  } else if (typeof anime.episodes === 'number') {
    totalEps = anime.episodes;
  } else if (typeof anime.is_sub === 'number') {
    totalEps = anime.is_sub;
  }

  return {
    id: String(anime.id),
    title: {
      romaji: anime.alternative || anime.title || '',
      english: anime.title || '',
      native: anime.native || anime.title || '',
    },
    image: anime.poster || '',
    cover: anime.background_image || anime.poster || '',
    description: anime.description || '',
    rating: score,
    releaseDate: releaseYear,
    totalEpisodes: totalEps,
    genres: anime.terms_by_type?.genre || ['Anime'],
    type: anime.terms_by_type?.type?.[0] || 'TV',
    status: anime.status || 'Ongoing'
  };
};

export const getTrendingAnime = async (): Promise<AnimeResult[]> => {
  try {
    const { data } = await api.get('/recent-anime?page=1&per_page=20');
    if (!data.ok || !data.data) return [];
    return data.data.map(mapAnikoto);
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
};

export const getRecentEpisodes = async (): Promise<AnimeResult[]> => {
  try {
    const { data } = await api.get('/recent-anime?page=2&per_page=20');
    if (!data.ok || !data.data) return [];
    return data.data.map(mapAnikoto);
  } catch (error) {
    console.error('Error fetching recent episodes:', error);
    return [];
  }
};

export const getAnimeDetails = async (id: string): Promise<AnimeInfo | null> => {
  try {
    const { data } = await api.get(`/series/${id}`);
    if (!data.ok || !data.data) return null;
    
    // IMPORTANT: The Anikoto /series/{id} API returns:
    //   data.data.anime  — the series info object
    //   data.data.episodes — the array of episode objects
    const anime = data.data.anime;
    if (!anime) return null;

    const baseResult = mapAnikoto(anime);
    
    let mappedEpisodes: Episode[] = [];
    if (data.data.episodes && Array.isArray(data.data.episodes)) {
      mappedEpisodes = data.data.episodes.map((ep: any) => ({
        id: String(ep.id),
        title: ep.title || `Episode ${ep.number}`,
        description: ep.jp_title || ep.title || `Episode ${ep.number}`,
        number: ep.number,
        image: anime.poster || '',
        embedId: ep.episode_embed_id
      }));
    }
    
    return {
      ...baseResult,
      totalEpisodes: mappedEpisodes.length || baseResult.totalEpisodes,
      episodes: mappedEpisodes
    };
  } catch (error) {
    console.error(`Error fetching anime details for ${id}:`, error);
    return null;
  }
};

export const searchAnime = async (query: string): Promise<AnimeResult[]> => {
  try {
    // Fetch a large set and filter client-side since Anikoto doesn't have a public search endpoint
    const { data } = await api.get('/recent-anime?page=1&per_page=40');
    if (!data.ok || !data.data) return [];
    
    const all = data.data.map(mapAnikoto);
    const lowerQuery = query.toLowerCase();
    return all.filter((a: AnimeResult) => 
      a.title.english.toLowerCase().includes(lowerQuery) || 
      a.title.romaji.toLowerCase().includes(lowerQuery) ||
      a.title.native.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error(`Error searching anime for ${query}:`, error);
    return [];
  }
};
