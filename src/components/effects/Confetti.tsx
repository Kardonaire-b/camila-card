/**
 * Confetti Effect Component
 * Colorful falling confetti particles for celebrations
 */

import { useMemo } from 'react';

interface ConfettiProps {
    /** Whether the confetti should be visible and animating */
    active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
    const confettiPieces = useMemo(() => {
        if (!active) return [];
        const colors = ['#ffd700', '#ff6b6b', '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            duration: 2 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            size: 8 + Math.random() * 8,
        }));
    }, [active]);

    if (!active || confettiPieces.length === 0) return null;

    return (
        <div className="confetti-container">
            {confettiPieces.map((piece) => (
                <div
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                        left: `${piece.left}%`,
                        backgroundColor: piece.color,
                        width: piece.size,
                        height: piece.size * 0.6,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                        transform: `rotate(${piece.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
}
