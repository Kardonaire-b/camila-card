import React, { useState, useRef, useEffect, useMemo } from 'react';

const Snowflakes = React.memo(function Snowflakes() {
    const [shakeBoost, setShakeBoost] = useState(0);
    const lastShakeRef = useRef(0);

    const snowflakes = useMemo(() => {
        const count = 25 + shakeBoost * 35;
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 8,
            duration: (10 + Math.random() * 10) / (1 + shakeBoost * 0.5),
            size: 8 + Math.random() * 10,
            opacity: 0.5 + Math.random() * 0.4,
        }));
    }, [shakeBoost]);

    useEffect(() => {
        const handleMotion = (e: DeviceMotionEvent) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
            const now = Date.now();

            if (magnitude > 20 && now - lastShakeRef.current > 200) {
                lastShakeRef.current = now;
                setShakeBoost(1);
                setTimeout(() => setShakeBoost(0), 2000);
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
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, []);

    return (
        <div className="snowflakes-container">
            {snowflakes.map((flake) => (
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
