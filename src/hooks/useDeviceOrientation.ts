import { useState, useEffect, useRef } from 'react';

interface DeviceOrientation {
    tiltX: number; // -1 to 1 (left-right)
    tiltY: number; // -1 to 1 (forward-back)
    isSupported: boolean;
}

/**
 * Hook to access device orientation/gyroscope for parallax effects.
 * Returns normalized tilt values from -1 to 1.
 */
export function useDeviceOrientation(): DeviceOrientation {
    const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0 });
    const [isSupported, setIsSupported] = useState(false);
    const smoothedRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma === null || e.beta === null) return;

            // gamma: -90 to 90 (left-right tilt)
            // beta: -180 to 180 (forward-back tilt)
            const rawX = Math.max(-45, Math.min(45, e.gamma)) / 45; // Clamp and normalize
            const rawY = Math.max(-45, Math.min(45, e.beta - 45)) / 45; // Center at 45° (natural phone holding angle)

            // Smooth the values to reduce jitter
            const smoothing = 0.15;
            smoothedRef.current.x += (rawX - smoothedRef.current.x) * smoothing;
            smoothedRef.current.y += (rawY - smoothedRef.current.y) * smoothing;

            setTilt({
                tiltX: smoothedRef.current.x,
                tiltY: smoothedRef.current.y,
            });
        };

        const requestPermission = async () => {
            // Check if API exists
            if (!('DeviceOrientationEvent' in window)) {
                setIsSupported(false);
                return;
            }

            // iOS 13+ requires permission
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceOrientationEvent as any).requestPermission();
                    if (permission === 'granted') {
                        setIsSupported(true);
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                } catch (e) {
                    console.warn('DeviceOrientation permission denied');
                    setIsSupported(false);
                }
            } else {
                // Non-iOS or older browsers
                setIsSupported(true);
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        requestPermission();
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    return { ...tilt, isSupported };
}

export default useDeviceOrientation;
