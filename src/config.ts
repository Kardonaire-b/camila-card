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

// Snowflakes configuration
export const SNOWFLAKE_BASE_COUNT = 60;
export const SNOWFLAKE_BONUS_COUNT = 40;
export const SNOWFLAKE_PARALLAX_AMOUNT = 15;

// Shake detection configuration
export const SHAKE_MAGNITUDE_THRESHOLD = 20;
export const SHAKE_DEBOUNCE_MS = 300;
export const BONUS_SNOWFLAKE_CLEANUP_MS = 20000;

// Work schedule start date (January 11, 2026 - first day shift)
export const SCHEDULE_START_DATE = new Date(2026, 0, 11); // Month is 0-indexed

