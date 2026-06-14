/**
 * Confetti Effect Component
 * One-shot festive burst shown when the birthday letter opens.
 * Renders nothing for users who prefer reduced motion, and removes
 * itself from the DOM once the animation has finished.
 */

import { useState, useEffect, useMemo, memo, type CSSProperties } from 'react';

interface ConfettiPiece {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    drift: number;
    rotation: number;
    color: string;
    emoji?: string;
}

/** Total number of confetti pieces in the burst */
const PIECE_COUNT = 70;

/** Every Nth piece is rendered as a festive emoji instead of a paper chip */
const EMOJI_EVERY = 6;

const EMOJI = ['🎉', '🎈', '🎂', '🎊', '✨', '💖'];
const COLORS = ['#ffb7c5', '#ffd4a3', '#ffe08a', '#a3d9ff', '#c5a3ff', '#ff8fa3'];

/** Longest possible piece lifetime (max duration + max delay) in ms, used for cleanup */
const MAX_LIFETIME_MS = 6000;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const Confetti = memo(function Confetti() {
    const [active, setActive] = useState(() => !prefersReducedMotion());

    const pieces = useMemo<ConfettiPiece[]>(() => {
        if (prefersReducedMotion()) return [];
        return Array.from({ length: PIECE_COUNT }).map((_, i) => {
            const isEmoji = i % EMOJI_EVERY === 0;
            return {
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 1.2,
                duration: 3 + Math.random() * 2.5,
                size: 8 + Math.random() * 10,
                drift: (Math.random() - 0.5) * 160,
                rotation: Math.random() * 360,
                color: COLORS[i % COLORS.length],
                emoji: isEmoji ? EMOJI[Math.floor(Math.random() * EMOJI.length)] : undefined,
            };
        });
    }, []);

    // Self-cleanup: unmount the pieces after the burst is done
    useEffect(() => {
        if (!active) return;
        const timer = window.setTimeout(() => setActive(false), MAX_LIFETIME_MS);
        return () => clearTimeout(timer);
    }, [active]);

    if (!active || pieces.length === 0) return null;

    return (
        <div className="confetti-container" aria-hidden="true">
            {pieces.map((p) => {
                const style = {
                    left: `${p.left}%`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                    '--drift': `${p.drift}px`,
                    '--rot': `${p.rotation}deg`,
                } as CSSProperties;

                if (p.emoji) {
                    style.fontSize = `${p.size + 8}px`;
                } else {
                    style.width = `${p.size}px`;
                    style.height = `${p.size * 0.6}px`;
                    style.background = p.color;
                }

                return (
                    <span
                        key={p.id}
                        className={p.emoji ? 'confetti-piece confetti-emoji' : 'confetti-piece'}
                        style={style}
                    >
                        {p.emoji}
                    </span>
                );
            })}
        </div>
    );
});

export default Confetti;
