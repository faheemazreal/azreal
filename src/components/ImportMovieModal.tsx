import React, { useState } from 'react';
import { 
  X, Upload, Film, Disc, Volume2, Link as LinkIcon, 
  Image as ImageIcon, Sparkles, Check, AlertCircle, FileVideo
} from 'lucide-react';
import { Movie, DiscFormat, AspectRatio } from '../types';

interface ImportMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (newMovie: Movie) => void;
}

export const ImportMovieModal: React.FC<ImportMovieModalProps> = ({
  isOpen,
  onClose,
  onAddMovie,
}) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [duration, setDuration] = useState<number>(90);
  const [genres, setGenres] = useState('Sci-Fi, Action');
  const [director, setDirector] = useState('Personal Home Cinema');
  const [cast, setCast] = useState('Archive Collection');
  const [synopsis, setSynopsis] = useState('');
  const [format, setFormat] = useState<DiscFormat>('CD-Video');
  const [audioCodec, setAudioCodec] = useState('5.1 Surround / DTS-HD');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [cdLabel, setCdLabel] = useState('Disc 1 - Personal CD Rip');
  
  // Video Source mode: local file or URL
  const [sourceMode, setSourceMode] = useState<'url' | 'local'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  // Poster & Backdrop
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80');
  const [backdropUrl, setBackdropUrl] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setSelectedFileName(file.name);
      if (!title) {
        // Automatically extract cleaner name from filename
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_.]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        setTitle(cleanName);
      }
    }
  };

  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPosterUrl(url);
      setBackdropUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    const newMovie: Movie = {
      id: `user-movie-${Date.now()}`,
      title: title.trim(),
      year: Number(year) || 2024,
      rating: 'PG-13',
      duration: Number(duration) || 90,
      genres: genres.split(',').map(g => g.trim()).filter(Boolean),
      director: director.trim() || 'Home Cinema Vault',
      cast: cast.split(',').map(c => c.trim()).filter(Boolean),
      synopsis: synopsis.trim() || 'Digitized personal optical CD media converted for home theater streaming.',
      videoUrl: videoUrl.trim(),
      posterUrl: posterUrl.trim(),
      backdropUrl: backdropUrl.trim() || posterUrl.trim(),
      discInfo: {
        format,
        audioCodec,
        resolution: format === '4K-Remaster' ? '4K UltraHD' : '1080p Master Rip',
        aspectRatio,
        cdLabel: cdLabel.trim() || `Disc 1: ${title.trim()}`,
        sourceType: sourceMode === 'local' ? 'Local File' : 'Physical CD Rip',
        fileSize: selectedFileName ? 'Local Storage' : 'Personal Stream'
      },
      featured: false,
      inWatchlist: true,
      userRating: 9.0,
      lastPlayedTime: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      isUserUpload: true
    };

    onAddMovie(newMovie);
    onClose();
  };

  return (
    <div 
      id="import-movie-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-cinzel text-white">
                Add CD Movie to Home Theater
              </h2>
              <p className="text-xs text-zinc-400 font-mono-tech">
                Import digitized CD-ROM rips, local movie files, or streaming links
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Source Selector Tab */}
          <div>
            <label className="block text-zinc-400 font-mono-tech uppercase mb-2">
              Video Source (CD Rip or Direct Stream)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSourceMode('url')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                  sourceMode === 'url'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Streaming URL / NAS</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceMode('local')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                  sourceMode === 'local'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
                }`}
              >
                <FileVideo className="w-4 h-4" />
                <span>Upload Local Movie File</span>
              </button>
            </div>

            {sourceMode === 'url' ? (
              <div>
                <input
                  id="import-video-url-input"
                  type="url"
                  placeholder="https://... or http://home-theater-nas/movie.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
                />
                <p className="text-[10px] text-zinc-500 font-mono-tech mt-1">
                  Supports MP4, WebM, HLS streaming links from your server or cloud database.
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-700/80 hover:border-amber-500/60 rounded-2xl p-6 text-center bg-zinc-950/60 transition group cursor-pointer relative">
                <input
                  id="import-local-video-file"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/mkv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-zinc-200 font-medium">
                  {selectedFileName ? selectedFileName : 'Drag & drop CD rip video file or click to browse'}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono-tech mt-1">
                  MP4, WebM, MKV, QuickTime (instantly playable in theater mode)
                </div>
              </div>
            )}
          </div>

          {/* Title & Release Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Movie Title *
              </label>
              <input
                id="import-title-input"
                type="text"
                placeholder="e.g. Blade Runner, Matrix, Pulp Fiction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Release Year
              </label>
              <input
                id="import-year-input"
                type="number"
                min="1900"
                max="2035"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Disc Format, Audio Codec, Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Disc Media Format
              </label>
              <select
                id="import-format-select"
                value={format}
                onChange={(e) => setFormat(e.target.value as DiscFormat)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              >
                <option value="CD-Video">CD-Video (VCD Rip)</option>
                <option value="DVD-Rip">DVD-Rip (Disc)</option>
                <option value="Blu-Ray">Blu-Ray Master</option>
                <option value="LaserDisc">LaserDisc Transfer</option>
                <option value="4K-Remaster">4K UHD Remaster</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Audio Codec
              </label>
              <input
                id="import-audio-input"
                type="text"
                placeholder="Dolby 5.1, DTS, PCM"
                value={audioCodec}
                onChange={(e) => setAudioCodec(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Aspect Ratio
              </label>
              <select
                id="import-aspect-select"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              >
                <option value="16:9">16:9 Widescreen</option>
                <option value="2.39:1">2.39:1 Anamorphic Scope</option>
                <option value="1.85:1">1.85:1 Theatrical Flat</option>
                <option value="4:3">4:3 Vintage CD-ROM</option>
              </select>
            </div>
          </div>

          {/* CD Boxset Label & Runtime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Disc Label / Archive ID
              </label>
              <input
                id="import-disc-label-input"
                type="text"
                placeholder="Disc 1 of 2 - Special Edition"
                value={cdLabel}
                onChange={(e) => setCdLabel(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
                Duration (Minutes)
              </label>
              <input
                id="import-duration-input"
                type="number"
                min="1"
                max="600"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Genres & Synopsis */}
          <div>
            <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
              Genres (comma separated)
            </label>
            <input
              id="import-genres-input"
              type="text"
              placeholder="Action, Sci-Fi, Thriller"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-mono-tech uppercase mb-1">
              Synopsis / Notes
            </label>
            <textarea
              id="import-synopsis-input"
              rows={2}
              placeholder="A brief overview or disc condition details..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Poster Image URL with Custom File Option */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-zinc-400 font-mono-tech uppercase">
                Poster Cover Image URL
              </label>
              <label className="text-[10px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <input
              id="import-poster-url-input"
              type="url"
              value={posterUrl}
              onChange={(e) => {
                setPosterUrl(e.target.value);
                setBackdropUrl(e.target.value);
              }}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              id="submit-import-movie-btn"
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Add to Home Theater</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
