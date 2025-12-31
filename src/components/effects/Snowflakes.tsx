import React, { useState, useRef, useEffect } from 'react';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';

interface Snowflake {
    id: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
}

const generateSnowflake = (id: string, speedMultiplier = 1, maxDelay = 10): Snowflake => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: (12 + Math.random() * 12) / speedMultiplier,
    size: 6 + Math.random() * 12,
    opacity: 0.4 + Math.random() * 0.5,
});

const BASE_COUNT = 60;
const BONUS_COUNT = 40;
const PARALLAX_AMOUNT = 15; // Max pixels shift

const Snowflakes = React.memo(function Snowflakes() {
    // Parallax from device orientation
    const { tiltX, tiltY } = useDeviceOrientation();

    // Base snowflakes - generated once and never change
    const baseSnowflakesRef = useRef<Snowflake[]>([]);
    const [bonusSnowflakes, setBonusSnowflakes] = useState<Snowflake[]>([]);
    const lastShakeRef = useRef(0);
    const bonusTimeoutRef = useRef<number | null>(null);

    // Initialize base snowflakes only once
    if (baseSnowflakesRef.current.length === 0) {
        baseSnowflakesRef.current = Array.from({ length: BASE_COUNT }).map((_, i) =>
            generateSnowflake(`base-${i}`)
        );
    }

    useEffect(() => {
        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
            const now = Date.now();

            if (magnitude > 20 && now - lastShakeRef.current > 300) {
                lastShakeRef.current = now;

                // Add bonus snowflakes with faster speed and less delay
                const newBonus = Array.from({ length: BONUS_COUNT }).map((_, i) =>
                    generateSnowflake(`bonus-${now}-${i}`, 1.5, 2)
                );
                setBonusSnowflakes(prev => [...prev, ...newBonus]);

                // Clear previous timeout
                if (bonusTimeoutRef.current) {
                    clearTimeout(bonusTimeoutRef.current);
                }

                // Remove bonus snowflakes after they finish falling (max duration ~16s + delay 2s = 18s)
                bonusTimeoutRef.current = window.setTimeout(() => {
                    setBonusSnowflakes([]);
                }, 20000);
            }
        };

        const requestPermission = async () => {
            if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceMotionEvent as any).requestPermission();
                    if (permission === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    }
                } catch (e) {
                    console.warn('DeviceMotion permission denied');
                }
            } else {
                window.addEventListener('devicemotion', handleMotion);
            }
        };

        requestPermission();
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
            if (bonusTimeoutRef.current) {
                clearTimeout(bonusTimeoutRef.current);
            }
        };
    }, []);

    const allSnowflakes = [...baseSnowflakesRef.current, ...bonusSnowflakes];

    // Calculate parallax offset
    const parallaxX = tiltX * PARALLAX_AMOUNT;
    const parallaxY = tiltY * PARALLAX_AMOUNT * 0.5; // Less vertical shift

    return (
        <div
            className="snowflakes-container"
            style={{
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                transition: 'transform 0.1s ease-out',
            }}
        >
            {allSnowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}%`,
                        fontSize: flake.size,
                        opacity: flake.opacity,
                        animationDuration: `${flake.duration}s`,
                        animationDelay: `${flake.delay}s`,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
});

export default Snowflakes;
