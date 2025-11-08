'use client';

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import TopNavbar from '@/components/TopNavbar/TopNavbar';
import Stars from '@/components/Stars/Stars';
import SolarSystem from '@/components/SolarSystem/SolarSystem';
import Particles from '@/components/Particles/Particles';
import MusicController, { MusicControllerHandle } from '@/components/MusicController';
import './PremiumSpaceLayout.css';

interface PremiumSpaceLayoutProps {
  children: ReactNode;
}

const SESSION_KEY = 'danny-portfolio-entered';

export default function PremiumSpaceLayout({ children }: PremiumSpaceLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = useMemo(() => pathname.startsWith('/admin'), [pathname]);

  const [audioReady, setAudioReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [hasAttemptedPlayback, setHasAttemptedPlayback] = useState(false);
  const musicRef = useRef<MusicControllerHandle>(null);
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return isAdminRoute;
    }
    if (isAdminRoute) return true;
    return window.sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  useEffect(() => {
    if (isAdminRoute) {
      setHasEntered(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem(SESSION_KEY) === 'true';
      if (stored) {
        setHasEntered(true);
      }
    }
  }, [isAdminRoute]);

  useEffect(() => {
    if (!hasEntered || isAdminRoute) return;
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(SESSION_KEY, 'true');
  }, [hasEntered, isAdminRoute]);

  const overlayVisible = !hasEntered && !isAdminRoute;
  const explosionActive = useMemo(
    () => pathname.startsWith('/photography') || pathname.startsWith('/renders'),
    [pathname]
  );
  const backgroundsActive = isAdminRoute ? true : hasEntered;
  const solarDetailsActive = isAdminRoute ? true : hasEntered;

  useEffect(() => {
    if (!overlayVisible) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [overlayVisible]);

  const finalizeEntry = useCallback(() => {
    setHasEntered(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }, []);

  const tryStartAudio = useCallback(async () => {
    if (hasEntered || isAdminRoute) {
      return;
    }

    const controller = musicRef.current;
    if (!controller) {
      finalizeEntry();
      return;
    }

    if (!controller.isReady()) {
      return;
    }

    if (isActivating) return;
    setIsActivating(true);
    try {
      setAudioError(null);
      await controller.play();
      finalizeEntry();
    } catch (error) {
      setAudioError('Audio playback blocked. Please enable sound and tap again.');
      console.warn('Audio playback failed', error);
    } finally {
      setIsActivating(false);
    }
  }, [finalizeEntry, hasEntered, isAdminRoute, isActivating]);

  const handleEnter = useCallback(() => {
    if (!overlayVisible || isActivating) return;
    setHasAttemptedPlayback(true);
    setAudioError(null);
    tryStartAudio();
  }, [overlayVisible, isActivating, tryStartAudio]);

  const handleOverlayKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!overlayVisible) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleEnter();
      }
    },
    [overlayVisible, handleEnter]
  );

  useEffect(() => {
    if (!hasAttemptedPlayback) return;
    if (hasEntered || isAdminRoute) return;
    if (!audioReady) return;
    tryStartAudio();
  }, [hasAttemptedPlayback, hasEntered, isAdminRoute, audioReady, tryStartAudio]);

  const stageClassName = `premium-stage${overlayVisible ? ' is-pre-entry' : ''}`;

  return (
    <div className="premium-root">
      <div className={stageClassName}>
        <TopNavbar />
        {!isAdminRoute && (
          <div className={`full-version-card ${overlayVisible ? 'full-version-card--muted' : ''}`}>
            <span className="full-version-card__title">Full Version Coming Soon…</span>
            <p className="full-version-card__copy">
              Expanded galleries, live admin tools, and interactive experiences are on the horizon.
            </p>
          </div>
        )}
        <Stars starCount={400} parallaxStrength={0.04} twinkle className="stars-monochrome" />
        <Particles
          particleCount={80}
          particleSpread={8}
          speed={0.06}
          particleColors={['#f0f0f0', '#cfcfcf', '#9c9c9c']}
          enabled={backgroundsActive}
        />
        <SolarSystem
          enabled={backgroundsActive}
          showMoons={solarDetailsActive}
          showRings={solarDetailsActive}
          explosionMode={explosionActive}
        />
        <div className="content-area" style={{ marginTop: 0 }} aria-hidden={overlayVisible}>
          {children}
        </div>
      </div>

      {!isAdminRoute && (
        <MusicController
          ref={musicRef}
          src="/music/Interstellar.mp3"
          onReady={() => setAudioReady(true)}
          onError={(error) => {
            setAudioError(error.message);
            console.warn('Audio error', error);
          }}
        />
      )}

      {overlayVisible && (
        <div
          className="entry-overlay"
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onClick={handleEnter}
          onKeyDown={handleOverlayKeyDown}
        >
          <Stars
            starCount={220}
            parallaxStrength={0}
            twinkle
            className="entry-overlay-stars"
          />
          <div className="entry-overlay-backdrop" />
          <div className="entry-overlay-content">
            <span className="entry-tag">Audio On Recommended</span>
            <h1>Press anywhere to enter</h1>
            <p>
              Step into the void. The soundtrack begins the moment you cross the event horizon.
            </p>
            <div className="entry-status">
              {audioError ? (
                <span className="entry-status-error">{audioError}</span>
              ) : audioReady ? (
                'Soundtrack ready.'
              ) : (
                'Preparing soundtrack...'
              )}
            </div>
            <div className="entry-hint">
              Click • Tap • Press Enter
              {isActivating && <span className="entry-hint-loading"> Activating…</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

