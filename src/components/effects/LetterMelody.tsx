/**
 * Letter Melody Component
 * Plays a looping birthday kalimba recording on the letter page.
 *
 * - Tries to autoplay on mount; if the browser blocks autoplay, it starts
 *   on the first user interaction anywhere on the page.
 * - A note icon in the corner toggles pause / resume.
 * - A clear "now playing" indicator (pulse ring, equalizer, status line)
 *   makes it obvious that sound is playing so the user can raise the volume.
 */

import { useState, useEffect, useRef } from 'react';
import melodyUrl from '../../assets/music/birthday-kalimba.mp3';

interface LetterMelodyProps {
    /** Status text shown while the melody is playing */
    playingLabel: string;
    /** Status text shown while the melody is paused */
    pausedLabel: string;
    /** Accessible label for the button when it will start playback */
    playAria: string;
    /** Accessible label for the button when it will pause playback */
    pauseAria: string;
}

export default function LetterMelody({ playingLabel, pausedLabel, playAria, pauseAria }: LetterMelodyProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const a = new Audio(melodyUrl);
        a.loop = true;
        a.preload = 'auto';
        a.volume = 0.9;
        audioRef.current = a;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        a.addEventListener('play', onPlay);
        a.addEventListener('pause', onPause);

        // Attempt continuous autoplay; browsers may block it until a gesture.
        const tryPlay = () => a.play().catch(() => { /* blocked — wait for a gesture */ });
        tryPlay();

        // If autoplay was blocked, start on the first interaction anywhere.
        const onFirstGesture = () => {
            if (a.paused) tryPlay();
        };
        window.addEventListener('pointerdown', onFirstGesture, { once: true });
        window.addEventListener('keydown', onFirstGesture, { once: true });

        return () => {
            a.pause();
            a.removeEventListener('play', onPlay);
            a.removeEventListener('pause', onPause);
            window.removeEventListener('pointerdown', onFirstGesture);
            window.removeEventListener('keydown', onFirstGesture);
            audioRef.current = null;
        };
    }, []);

    const toggle = async () => {
        const a = audioRef.current;
        if (!a) return;
        try {
            if (a.paused) await a.play();
            else a.pause();
        } catch {
            // Silent fail — audio errors should not affect UX
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? pauseAria : playAria}
                title={isPlaying ? pauseAria : playAria}
                className={`absolute right-3 top-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[var(--ink)] shadow transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-black/10 ${isPlaying ? 'melody-pulse' : ''}`}
            >
                {isPlaying ? (
                    <span className="melody-eq" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M9 18V5l10-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="16" cy="16" r="3" />
                    </svg>
                )}
            </button>

            <p
                className={`mb-3 flex items-center gap-1.5 pr-12 text-sm ${isPlaying ? 'melody-status-playing text-[var(--ink)]/90' : 'text-[var(--ink)]/70'}`}
                aria-live="polite"
            >
                {isPlaying ? playingLabel : pausedLabel}
            </p>
        </>
    );
}
