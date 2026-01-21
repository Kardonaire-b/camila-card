/**
 * Type declarations for iOS-specific Device Event APIs
 * These APIs require permission on iOS 13+
 */

export type PermissionState = 'granted' | 'denied' | 'default';

/**
 * Extended DeviceOrientationEvent with iOS permission API
 */
export interface DeviceOrientationEventStatic {
    new(type: string, eventInitDict?: DeviceOrientationEventInit): DeviceOrientationEvent;
    prototype: DeviceOrientationEvent;
    requestPermission?: () => Promise<PermissionState>;
}

/**
 * Extended DeviceMotionEvent with iOS permission API
 */
export interface DeviceMotionEventStatic {
    new(type: string, eventInitDict?: DeviceMotionEventInit): DeviceMotionEvent;
    prototype: DeviceMotionEvent;
    requestPermission?: () => Promise<PermissionState>;
}

/**
 * Helper to check if DeviceOrientation permission API is available
 */
export function hasOrientationPermissionAPI(): boolean {
    return typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventStatic).requestPermission === 'function';
}

/**
 * Helper to check if DeviceMotion permission API is available
 */
export function hasMotionPermissionAPI(): boolean {
    return typeof (DeviceMotionEvent as unknown as DeviceMotionEventStatic).requestPermission === 'function';
}

/**
 * Request DeviceOrientation permission (iOS 13+)
 */
export async function requestOrientationPermission(): Promise<PermissionState | null> {
    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
    if (typeof DOE.requestPermission === 'function') {
        return await DOE.requestPermission();
    }
    return null;
}

/**
 * Request DeviceMotion permission (iOS 13+)
 */
export async function requestMotionPermission(): Promise<PermissionState | null> {
    const DME = DeviceMotionEvent as unknown as DeviceMotionEventStatic;
    if (typeof DME.requestPermission === 'function') {
        return await DME.requestPermission();
    }
    return null;
}
