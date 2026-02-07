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

/** Time constants in milliseconds */
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/**
 * Convert milliseconds difference to time units
 * @param diffMs - Difference in milliseconds (positive value)
 */
function msToTimeUnits(diffMs: number): TimeUnits {
    return {
        days: Math.floor(diffMs / MS_PER_DAY),
        hours: Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR),
        minutes: Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE),
        seconds: Math.floor((diffMs % MS_PER_MINUTE) / MS_PER_SECOND),
    };
}

/**
 * Calculate time difference between two dates
 * @param from - Start date
 * @param to - End date (defaults to now)
 * @returns Object with days, hours, minutes, seconds
 */
export function calculateTimeDiff(from: Date, to: Date = new Date()): TimeUnits {
    const diff = to.getTime() - from.getTime();
    return msToTimeUnits(diff);
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

    return msToTimeUnits(diff);
}
