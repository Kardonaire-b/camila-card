/**
 * Application Configuration
 * Centralized configuration values for the app
 */

// New Year letter unlock date (Buenos Aires time, UTC-3)
// December 31, 2025, 23:35 UTC = January 1, 2026, 02:35 Buenos Aires
export const LETTER_UNLOCK_DATE = new Date(Date.UTC(2025, 11, 31, 23, 35, 0));

// Analytics API URL (can be overridden via environment variable)
export const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'https://calm-night-8d6b.ilyarokieplus.workers.dev/';

// Language settings
export const DEFAULT_LANGUAGE = 'ru' as const;
export const SUPPORTED_LANGUAGES = ['ru', 'es'] as const;

// Relationship start date (July 5, 2025)
export const RELATIONSHIP_START_DATE = new Date(2025, 6, 5); // Month is 0-indexed

// Petals configuration
export const PETAL_BASE_COUNT = 45;
export const PETAL_BONUS_COUNT = 30;
export const PETAL_PARALLAX_AMOUNT = 12;

/**
 * Get optimal petal count based on device performance
 * Reduces particles on weaker devices to maintain smooth animations
 */
export function getOptimalPetalCount(): number {
    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 2) return 20;  // Low-end devices
    if (cores <= 4) return 35;  // Mid-range devices
    return PETAL_BASE_COUNT;    // High-end devices
}

// Shake detection configuration
export const SHAKE_MAGNITUDE_THRESHOLD = 20;
export const SHAKE_DEBOUNCE_MS = 300;
export const BONUS_PETAL_CLEANUP_MS = 18000;

// Work schedule start date (January 11, 2026 - first day shift)
export const SCHEDULE_START_DATE = new Date(2026, 0, 11); // Month is 0-indexed

// Theme configuration

/** Time of day theme options */
export type Horizon = "dawn" | "day" | "sunset" | "night";

/** Color palettes for each time of day - spring/summer theme */
export const PALETTES: Record<Horizon, [string, string]> = {
    dawn: ["#ffecd2", "#fcb69f"],     // Warm sunrise
    day: ["#a8edea", "#fed6e3"],      // Fresh spring day
    sunset: ["#ff9a9e", "#fecfef"],   // Pink sunset
    night: ["#0c1445", "#1e3c72"],    // Warm summer night
};
