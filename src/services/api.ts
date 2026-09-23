import axios from 'axios';

// We are using a public, working Consumet API instance for the demo to ensure the UI populates.
// Your specific Vercel deployment (https://hianime-api-self.vercel.app) is currently misconfigured 
// and serving raw source code instead of running as a server. 
const BASE_URL = 'https://api-consumet.vercel.app/meta/anilist';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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
}

export interface StreamingSource {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface StreamingData {
  sources: StreamingSource[];
  subtitles?: { url: string; lang: string }[];
}

export const getTrendingAnime = async (): Promise<AnimeResult[]> => {
  try {
    const { data } = await api.get('/trending');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
};

export const getRecentEpisodes = async (): Promise<AnimeResult[]> => {
  try {
    const { data } = await api.get('/recent-episodes');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching recent episodes:', error);
    return [];
  }
};

export const getAnimeDetails = async (id: string): Promise<AnimeInfo | null> => {
  try {
    const { data } = await api.get(`/info/${id}`);
    return data as AnimeInfo;
  } catch (error) {
    console.error(`Error fetching anime details for ${id}:`, error);
    return null;
  }
};

export const getStreamingLinks = async (episodeId: string): Promise<StreamingData | null> => {
  try {
    const { data } = await api.get(`/watch/${episodeId}`);
    return data as StreamingData;
  } catch (error) {
    console.error(`Error fetching streaming links for ${episodeId}:`, error);
    return null;
  }
};

export const searchAnime = async (query: string): Promise<AnimeResult[]> => {
  try {
    const { data } = await api.get(`/${query}`);
    return data.results || [];
  } catch (error) {
    console.error(`Error searching anime for ${query}:`, error);
    return [];
  }
};
