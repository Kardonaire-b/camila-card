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

// Snowflakes configuration
export const SNOWFLAKE_BASE_COUNT = 60;
export const SNOWFLAKE_BONUS_COUNT = 40;
export const SNOWFLAKE_PARALLAX_AMOUNT = 15;
