/**
 * Time calculation utilities
 * Centralized time diff calculations to avoid code duplication
 */

export interface TimeUnits {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Calculate time difference between two dates
 * @param from - Start date
 * @param to - End date (defaults to now)
 * @returns Object with days, hours, minutes, seconds
 */
export function calculateTimeDiff(from: Date, to: Date = new Date()): TimeUnits {
    const diff = to.getTime() - from.getTime();

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}

/**
 * Calculate countdown to a future date
 * @param targetDate - Target date to count down to
 * @returns Object with days, hours, minutes, seconds or null if target is in the past
 */
export function calculateCountdown(targetDate: Date): TimeUnits | null {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
        return null;
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}
