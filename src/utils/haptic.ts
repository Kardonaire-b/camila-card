/**
 * Haptic feedback utilities
 * Centralized vibration helper to avoid code duplication
 */

/**
 * Trigger haptic feedback (vibration) if supported
 * @param duration - Duration in milliseconds
 */
export function vibrate(duration: number): void {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

/**
 * Preset haptic patterns
 */
export const hapticPatterns = {
    /** Light tap - for button presses */
    tap: () => vibrate(5),
    /** Short feedback - for star connections */
    short: () => vibrate(15),
    /** Medium feedback - for completions */
    medium: () => vibrate(50),
    /** Success pattern */
    success: () => vibrate(100),
} as const;
