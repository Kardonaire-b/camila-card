/**
 * Device Permissions Utility
 * Centralized handling of device motion/orientation permissions
 */

import { hasMotionPermissionAPI, hasOrientationPermissionAPI, requestMotionPermission, requestOrientationPermission } from '../types/device-events';

export type PermissionType = 'motion' | 'orientation';

/**
 * Request device permission and set up event listener
 * @param type - Type of permission to request
 * @param eventName - Event name to listen for
 * @param handler - Event handler function
 * @returns Cleanup function to remove the listener
 */
export async function setupDeviceEventListener(
    type: PermissionType,
    handler: EventListener
): Promise<() => void> {
    const eventName = type === 'motion' ? 'devicemotion' : 'deviceorientation';
    const hasPermissionAPI = type === 'motion' ? hasMotionPermissionAPI : hasOrientationPermissionAPI;
    const requestPermission = type === 'motion' ? requestMotionPermission : requestOrientationPermission;

    const addListener = () => {
        window.addEventListener(eventName, handler);
        return () => window.removeEventListener(eventName, handler);
    };

    // Check if permission API exists (iOS 13+)
    if (hasPermissionAPI()) {
        try {
            const permission = await requestPermission();
            if (permission === 'granted') {
                return addListener();
            }
            // Permission denied - return no-op cleanup
            console.warn(`${type} permission denied`);
            return () => { };
        } catch {
            console.warn(`Failed to request ${type} permission`);
            return () => { };
        }
    }

    // No permission API needed (Android, older browsers)
    return addListener();
}

/**
 * Check if device motion/orientation is supported
 */
export function isDeviceEventSupported(type: PermissionType): boolean {
    if (type === 'motion') {
        return 'DeviceMotionEvent' in window;
    }
    return 'DeviceOrientationEvent' in window;
}
