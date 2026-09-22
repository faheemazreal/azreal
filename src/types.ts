export type DiscFormat = 'CD-Video' | 'DVD-Rip' | 'Blu-Ray' | 'LaserDisc' | '4K-Remaster' | 'Web-Master';

export type AspectRatio = '2.39:1' | '1.85:1' | '16:9' | '4:3';

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: number; // in minutes
  videoUrl: string;
  thumbnailUrl?: string;
  isFiller?: boolean;
}

export interface ServerSource {
  id: string;
  name: string;
  quality: '1080p Ultra' | '720p HD' | '4K HDR' | '480p SD';
  type: 'SUB' | 'DUB' | 'RAW';
}

export interface Chapter {
  title: string;
  time: number; // in seconds
}

export interface DiscInfo {
  format: DiscFormat;
  discCount?: number;
  currentDisc?: number;
  audioCodec: string;
  resolution: string;
  aspectRatio: AspectRatio;
  cdLabel?: string;
  fileSize?: string;
  sourceType: 'Physical CD Rip' | 'Digital Master' | 'LaserDisc Transfer' | 'Local File' | 'Network Stream';
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  japaneseTitle?: string;
  romajiTitle?: string;
  type?: 'Anime' | 'Movie' | 'OVA' | 'Special';
  season?: string;
  episodesCount?: number;
  subCount?: number;
  dubCount?: number;
  quality?: string;
  episodes?: Episode[];
  year: number;
  rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'Unrated';
  duration: number; // in minutes
  genres: string[];
  director: string;
  studio?: string;
  status?: 'Completed' | 'Airing' | 'Upcoming';
  cast: string[];
  synopsis: string;
  videoUrl: string;
  backdropUrl: string;
  posterUrl: string;
  discInfo: DiscInfo;
  featured?: boolean;
  trendingRank?: number;
  inWatchlist?: boolean;
  userRating?: number; // e.g. 9.4
  views?: string;
  lastPlayedTime?: number; // in seconds
  completed?: boolean;
  dateAdded: string;
  isUserUpload?: boolean;
  chapters?: Chapter[];
  subtitles?: { label: string; src: string; lang: string }[];
  audioTracks?: { label: string; channels: string; format: string }[];
}

export type ViewFilter = 'all' | 'anime' | 'watchlist' | 'continue-watching' | 'cd-vault' | 'top-rated' | 'trending';
