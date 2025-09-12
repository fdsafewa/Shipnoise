import React, { useRef, useState, useEffect } from 'react';

interface AudioWavePlayerProps {
  src: string;
  onClose?: () => void;
}

const AudioWavePlayer: React.FC<AudioWavePlayerProps> = ({ src, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveBars, setWaveBars] = useState<number[]>([]);

  useEffect(() => {
    const bars: number[] = [];
    for (let i = 0; i < 120; i++) {
      bars.push(Math.random() * 40 + 10); // random height for bars
    }
    setWaveBars(bars);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = src;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoaded = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const setProgress = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeBarIndex = duration
    ? Math.floor((currentTime / duration) * waveBars.length)
    : -1;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 flex items-center gap-4 z-50">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-2 rounded-full"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => (audioRef.current!.currentTime = Math.max(0, audioRef.current!.currentTime - 15))}
          className="text-gray-400 hover:text-white p-2 rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button onClick={togglePlay} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => (audioRef.current!.currentTime = Math.min(duration, audioRef.current!.currentTime + 15))}
          className="text-gray-400 hover:text-white p-2 rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
        </button>
      </div>

      <div
        className="flex-1 h-16 bg-gray-800 rounded-lg flex items-end gap-1 cursor-pointer px-3 overflow-hidden"
        onClick={setProgress}
      >
        {waveBars.map((height, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full ${idx < activeBarIndex ? 'bg-green-500' : 'bg-gray-600'}`}
            style={{ height: `${height}px`, minHeight: '4px' }}
          />
        ))}
      </div>

      <div className="text-gray-400 text-sm min-w-24">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <audio ref={audioRef} />
    </div>
  );
};

export default AudioWavePlayer;



