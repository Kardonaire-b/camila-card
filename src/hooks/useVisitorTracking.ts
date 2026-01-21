import { useEffect, useRef } from 'react';
import { trackVisitor } from '../utils/analytics';

/**
 * Hook for tracking visitors
 * Runs once per page load
 */
export function useVisitorTracking(): void {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent duplicate execution in strict mode
        if (hasTracked.current) return;
        hasTracked.current = true;

        // Run tracking asynchronously to not block rendering
        const runTracking = async () => {
            try {
                // Small delay to let the page fully load
                await new Promise(resolve => setTimeout(resolve, 1000));

                await trackVisitor();
            } catch {
                // Silently ignore errors - don't affect UX
            }
        };

        runTracking();
    }, []);
}
