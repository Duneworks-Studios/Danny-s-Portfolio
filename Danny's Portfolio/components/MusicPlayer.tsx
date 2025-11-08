'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface MusicPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export default function MusicPlayer({ src, autoPlay = false, loop = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('AudioContext initialized');
      } catch (error) {
        console.log('AudioContext initialization failed:', error);
      }
    };
    initAudioContext();
  }, []);

  // Ensure audio is loaded and ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlayThrough = () => {
      console.log('Audio can play through, duration:', audio.duration);
      setIsLoaded(true);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  // Start paused and wait for user action
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, [src]);

  // Define all control functions using useCallback
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error('Audio element not found');
      return;
    }

    console.log('Toggle play/pause clicked, current state:', isPlaying);
    console.log('Audio readyState:', audio.readyState);
    console.log('Audio src:', audio.src);
    
    if (isPlaying) {
      audio.pause();
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      console.log('Audio paused');
    } else {
      try {
        // Ensure audio context is resumed if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('AudioContext resumed');
        }
        
        await audio.play();
        console.log('Audio play successful');
      } catch (error) {
        console.error('Play failed:', error);
        // Try Web Audio API fallback
        try {
          if (audioContextRef.current) {
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = loop;
            source.connect(audioContextRef.current.destination);
            source.start();
            
            sourceRef.current = source;
            console.log('Web Audio API play successful');
          }
        } catch (webAudioError) {
          console.error('Web Audio API play failed:', webAudioError);
        }
      }
    }
    // Remove manual state update - let audio events handle it
  }, [isPlaying, src, loop]);

  const skipBack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  }, [duration]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(isFinite(audio.duration) ? audio.duration : 0);
      setIsLoaded(true);
    };

    const handleCanPlay = () => {
      if (!isLoaded) setIsLoaded(true);
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [loop, isSeeking, isLoaded]);

  // Keyboard shortcuts (global Spacebar to play/pause)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBack();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'KeyR':
          e.preventDefault();
          restart();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'Escape':
          if (isExpanded) setIsExpanded(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isExpanded, isPlaying, togglePlayPause, skipBack, skipForward, restart, toggleMute]);

  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="auto"
        autoPlay={autoPlay}
        muted={false}
        playsInline
        style={{ display: 'none' }}
      />

      {/* Music Player */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-strong rounded-2xl p-4 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Music size={20} className="text-white" />
                  <span className="text-white font-medium">Background Music</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.01"
                    value={currentTime}
                    onChange={(e) => {
                      const t = parseFloat(e.target.value);
                      setCurrentTime(t);
                      seekTo(t);
                    }}
                    onMouseDown={() => setIsSeeking(true)}
                    onMouseUp={() => setIsSeeking(false)}
                    onTouchStart={() => setIsSeeking(true)}
                    onTouchEnd={() => setIsSeeking(false)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    onClick={skipBack}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full glass-light flex items-center justify-center text-white hover:text-white transition-colors"
                    disabled={!isLoaded}
                  >
                    <SkipBack size={16} />
                  </motion.button>

                  <motion.button
                    onClick={restart}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full glass-light flex items-center justify-center text-white hover:text-white transition-colors"
                    disabled={!isLoaded}
                  >
                    <RotateCcw size={16} />
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Play button clicked, isLoaded:', isLoaded, 'isPlaying:', isPlaying);
                      togglePlayPause();
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    disabled={!isLoaded}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>

                  <motion.button
                    onClick={skipForward}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full glass-light flex items-center justify-center text-white hover:text-white transition-colors"
                    disabled={!isLoaded}
                  >
                    <SkipForward size={16} />
                  </motion.button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Volume</span>
                    <button
                      onClick={toggleMute}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Settings</span>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-gray-400 hover:text-white transition-colors text-xs"
                    >
                      {showSettings ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Playback Speed</label>
                        <div className="flex gap-2">
                          {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`px-2 py-1 text-xs rounded ${
                                playbackRate === rate
                                  ? 'bg-white/30 text-white border border-white/50'
                                  : 'glass-light text-white hover:text-white'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Status */}
                <div className="text-center">
                  <span className="text-xs text-gray-400">
                    {isLoaded ? (isPlaying ? 'Playing' : 'Paused') : 'Loading...'}
                  </span>
                  {isLoaded && (
                    <div className="text-xs text-gray-500 mt-1">
                      {loop ? 'Loop: On' : 'Loop: Off'} • Speed: {playbackRate}x
                    </div>
                  )}
                  <div className="text-xs text-gray-600 mt-2">
                    <div>⌨️ Shortcuts:</div>
                    <div className="text-xs">Space: Play/Pause • ←/→: Skip • R: Restart • M: Mute</div>
                  </div>
                  {/* Debug info */}
                  <div className="text-xs text-gray-700 mt-2">
                    <div>Debug: Loaded: {isLoaded ? 'Yes' : 'No'}</div>
                    <div>Audio Ready: {audioRef.current?.readyState || 'N/A'}</div>
                    <div>Duration: {duration ? formatTime(duration) : 'N/A'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full glass-strong flex items-center justify-center text-white hover:text-white transition-all group"
              aria-label="Open music player"
            >
              <Music size={24} className="group-hover:scale-110 transition-transform" />
              {isPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #1a1a1a;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #1a1a1a;
        }
      `}</style>
    </>
  );
}