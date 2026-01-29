/**
 * useTimeSince Hook
 * Counts time elapsed since a given date
 */

import { useState, useCallback } from 'react';
import { useInterval } from './useInterval';
import { calculateTimeDiff, type TimeUnits } from '../utils/time';

/**
 * Hook for counting time since a past date
 * @param startDate - Date to count from
 * @param intervalMs - Update interval in ms (default: 1000)
 */
export function useTimeSince(startDate: Date, intervalMs = 1000): TimeUnits {
    const [time, setTime] = useState<TimeUnits>(() =>
        calculateTimeDiff(startDate)
    );

    const updateTime = useCallback(() => {
        setTime(calculateTimeDiff(startDate));
    }, [startDate]);

    useInterval(updateTime, intervalMs);

    return time;
}
