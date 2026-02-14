/**
 * Fireworks Effect Component
 * Animated firework explosions with sparks
 */

import { useState, useEffect, useRef, type CSSProperties } from 'react';

interface FireworksProps {
    /** Whether the fireworks should be visible and animating */
    active: boolean;
    /** Callback when fireworks animation completes */
    onComplete: () => void;
}

const ROCKET_COUNT = 6;
const SPARK_COUNT = 12;
const FIREWORK_DURATION_MS = 3500;
const FIREWORK_COLORS = ['#ffd700', '#ff6b6b', '#fff', '#4caf50', '#ff9800', '#e91e63'];

export default function Fireworks({ active, onComplete }: FireworksProps) {
    const [rockets, setRockets] = useState<Array<{
        id: number;
        x: number;
        y: number;
        color: string;
        delay: number;
    }>>([]);

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (active) {
            const newRockets = Array.from({ length: ROCKET_COUNT }).map((_, i) => ({
                id: i,
                x: 15 + Math.random() * 70,
                y: 20 + Math.random() * 40,
                color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
                delay: i * 0.3,
            }));
            setRockets(newRockets);

            const timeout = setTimeout(() => {
                setRockets([]);
                onCompleteRef.current();
            }, FIREWORK_DURATION_MS);

            return () => clearTimeout(timeout);
        }
    }, [active]);

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
                    {Array.from({ length: SPARK_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="spark"
                            style={{
                                '--angle': `${i * 30}deg`,
                                '--color': rocket.color,
                            } as CSSProperties}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
