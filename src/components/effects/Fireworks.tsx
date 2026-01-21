/**
 * Fireworks Effect Component
 * Animated firework explosions with sparks
 */

import React, { useState, useEffect } from 'react';

interface FireworksProps {
    /** Whether the fireworks should be visible and animating */
    active: boolean;
    /** Callback when fireworks animation completes */
    onComplete: () => void;
}

export default function Fireworks({ active, onComplete }: FireworksProps) {
    const [rockets, setRockets] = useState<Array<{
        id: number;
        x: number;
        y: number;
        color: string;
        delay: number;
    }>>([]);

    useEffect(() => {
        if (active) {
            const colors = ['#ffd700', '#ff6b6b', '#fff', '#4caf50', '#ff9800', '#e91e63'];
            const newRockets = Array.from({ length: 6 }).map((_, i) => ({
                id: i,
                x: 15 + Math.random() * 70,
                y: 20 + Math.random() * 40,
                color: colors[i % colors.length],
                delay: i * 0.3,
            }));
            setRockets(newRockets);

            const timeout = setTimeout(() => {
                setRockets([]);
                onComplete();
            }, 3500);

            return () => clearTimeout(timeout);
        }
    }, [active, onComplete]);

    if (!active || rockets.length === 0) return null;

    return (
        <div className="fireworks-container">
            {rockets.map((rocket) => (
                <div
                    key={rocket.id}
                    className="firework"
                    style={{
                        left: `${rocket.x}%`,
                        top: `${rocket.y}%`,
                        animationDelay: `${rocket.delay}s`,
                    }}
                >
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="spark"
                            style={{
                                '--angle': `${i * 30}deg`,
                                '--color': rocket.color,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
