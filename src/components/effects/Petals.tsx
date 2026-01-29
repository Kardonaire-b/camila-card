/**
 * Petals Effect Component
 * Animated falling flower petals with parallax based on device orientation
 * Supports shake-to-add-more-petals on mobile devices
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import { hasMotionPermissionAPI, requestMotionPermission } from '../../types/device-events';
import {
    getOptimalPetalCount,
    PETAL_BONUS_COUNT,
    PETAL_PARALLAX_AMOUNT,
    SHAKE_MAGNITUDE_THRESHOLD,
    SHAKE_DEBOUNCE_MS,
    BONUS_PETAL_CLEANUP_MS
} from '../../config';

interface Petal {
    id: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
    rotation: number;
    type: 'sakura' | 'white' | 'orange';
}

const PETAL_TYPES: Petal['type'][] = ['sakura', 'sakura', 'sakura', 'white', 'orange'];

const generatePetal = (id: string, speedMultiplier = 1, maxDelay = 12): Petal => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: (14 + Math.random() * 10) / speedMultiplier,
    size: 12 + Math.random() * 10,
    opacity: 0.6 + Math.random() * 0.35,
    rotation: Math.random() * 360,
    type: PETAL_TYPES[Math.floor(Math.random() * PETAL_TYPES.length)],
});

const createInitialPetals = () =>
    Array.from({ length: getOptimalPetalCount() }).map((_, i) =>
        generatePetal(`base-${i}`)
    );

const Petals = React.memo(function Petals() {
    const { tiltX, tiltY } = useDeviceOrientation();

    const basePetals = useMemo(() => createInitialPetals(), []);
    const [bonusPetals, setBonusPetals] = useState<Petal[]>([]);
    const lastShakeRef = useRef(0);
    const bonusTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
            const now = Date.now();

            if (magnitude > SHAKE_MAGNITUDE_THRESHOLD && now - lastShakeRef.current > SHAKE_DEBOUNCE_MS) {
                lastShakeRef.current = now;

                const newBonus = Array.from({ length: PETAL_BONUS_COUNT }).map((_, i) =>
                    generatePetal(`bonus-${now}-${i}`, 1.5, 2)
                );
                setBonusPetals(prev => [...prev, ...newBonus]);

                if (bonusTimeoutRef.current) {
                    clearTimeout(bonusTimeoutRef.current);
                }

                bonusTimeoutRef.current = window.setTimeout(() => {
                    setBonusPetals([]);
                }, BONUS_PETAL_CLEANUP_MS);
            }
        };

        const requestPermission = async () => {
            if (hasMotionPermissionAPI()) {
                try {
                    const permission = await requestMotionPermission();
                    if (permission === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    }
                } catch {
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

    const allPetals = [...basePetals, ...bonusPetals];

    const parallaxX = tiltX * PETAL_PARALLAX_AMOUNT;
    const parallaxY = tiltY * PETAL_PARALLAX_AMOUNT * 0.5;

    const getPetalColor = (type: Petal['type']) => {
        switch (type) {
            case 'sakura': return '#ffb7c5';
            case 'white': return '#fff5f5';
            case 'orange': return '#ffd4a3';
            default: return '#ffb7c5';
        }
    };

    return (
        <div
            className="petals-container"
            style={{
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                transition: 'transform 0.1s ease-out',
            }}
        >
            {allPetals.map((petal) => (
                <div
                    key={petal.id}
                    className="petal"
                    style={{
                        left: `${petal.left}%`,
                        fontSize: petal.size,
                        opacity: petal.opacity,
                        animationDuration: `${petal.duration}s`,
                        animationDelay: `${petal.delay}s`,
                        color: getPetalColor(petal.type),
                        '--rotation': `${petal.rotation}deg`,
                    } as React.CSSProperties}
                >
                    🌸
                </div>
            ))}
        </div>
    );
});

export default Petals;
