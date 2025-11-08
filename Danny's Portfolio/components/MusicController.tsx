'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface MusicControllerHandle {
  play: () => Promise<void>;
  pause: () => void;
  isReady: () => boolean;
}

interface MusicControllerProps {
  src: string;
  loop?: boolean;
  volume?: number;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

const MusicController = forwardRef<MusicControllerHandle, MusicControllerProps>(
  ({ src, loop = true, volume = 0.35, onReady, onError }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const readyRef = useRef(false);

    useImperativeHandle(
      ref,
      () => ({
        play: async () => {
          const audio = audioRef.current;
          if (!audio) return;
          try {
            if (audio.paused) {
              await audio.play();
            }
          } catch (error) {
            readyRef.current = false;
            if (onError) onError(error as Error);
            throw error;
          }
        },
        pause: () => {
          const audio = audioRef.current;
          if (!audio) return;
          audio.pause();
        },
        isReady: () => readyRef.current,
      }),
      [onError]
    );

    useEffect(() => {
      readyRef.current = false;
      const audio = audioRef.current;
      if (!audio) return;

      const handleCanPlay = () => {
        readyRef.current = true;
        if (onReady) onReady();
      };

      const handleError = () => {
        readyRef.current = false;
        if (onError) {
          onError(new Error('Audio failed to load'));
        }
      };

      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.volume = volume;
      audio.load();

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }, [src, volume, onError, onReady]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = volume;
    }, [volume]);

    return (
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        preload="auto"
        playsInline
        aria-hidden="true"
        style={{ display: 'none' }}
      />
    );
  }
);

MusicController.displayName = 'MusicController';

export default MusicController;

