/**
 * useInterval Hook
 * Declarative interval that properly handles cleanup
 */

import { useEffect, useRef } from 'react';

type Callback = () => void;

/**
 * Custom hook for declarative intervals
 * @param callback - Function to call on each interval
 * @param delay - Interval delay in ms, or null to pause
 */
export function useInterval(callback: Callback, delay: number | null): void {
    const savedCallback = useRef<Callback>(callback);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        if (delay === null) return;

        const tick = () => savedCallback.current();
        const id = setInterval(tick, delay);

        return () => clearInterval(id);
    }, [delay]);
}
