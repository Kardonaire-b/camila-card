/**
 * useCountdown Hook
 * Countdown timer that returns time remaining until target date
 */

import { useState, useCallback } from 'react';
import { useInterval } from './useInterval';
import { calculateCountdown, type TimeUnits } from '../utils/time';

interface UseCountdownResult {
    /** Time remaining, null if countdown is complete */
    timeLeft: TimeUnits | null;
    /** Whether the countdown has reached zero */
    isComplete: boolean;
}

/**
 * Hook for countdown timers
 * @param targetDate - Date to count down to
 * @param intervalMs - Update interval in ms (default: 1000)
 */
export function useCountdown(targetDate: Date, intervalMs = 1000): UseCountdownResult {
    const [timeLeft, setTimeLeft] = useState<TimeUnits | null>(() =>
        calculateCountdown(targetDate)
    );

    const updateCountdown = useCallback(() => {
        const countdown = calculateCountdown(targetDate);
        setTimeLeft(countdown);
    }, [targetDate]);

    useInterval(updateCountdown, intervalMs);

    return {
        timeLeft,
        isComplete: timeLeft === null,
    };
}
