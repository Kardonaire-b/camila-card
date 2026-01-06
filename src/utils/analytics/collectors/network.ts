/**
 * Network and IP Data Collectors
 */

import type { ExtendedNavigator, VisitorData } from '../types';

// Get network information
export function getNetworkInfo(): { type?: string; speed?: number; rtt?: number; saveData?: boolean } {
    const nav = navigator as ExtendedNavigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) return {};

    return {
        type: connection.effectiveType || connection.type,
        speed: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
    };
}

// Get battery information
export async function getBatteryInfo(): Promise<{ level?: number; charging?: boolean }> {
    try {
        const nav = navigator as ExtendedNavigator;
        if (!nav.getBattery) return {};

        const battery = await nav.getBattery();
        return {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
        };
    } catch {
        return {};
    }
}

// Get IP and geo data (via CORS-friendly API)
export async function getIPData(): Promise<Partial<VisitorData>> {
    try {
        // ipinfo.io supports CORS
        const response = await fetch('https://ipinfo.io/json', {
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error('IP API failed');

        const data = await response.json();
        // ipinfo returns loc as "lat,lng"
        const [lat, lng] = (data.loc || '').split(',').map(Number);

        return {
            ip: data.ip,
            country: data.country,
            countryCode: data.country,
            region: data.region,
            city: data.city,
            postal: data.postal,
            latitude: lat || undefined,
            longitude: lng || undefined,
            isp: data.org,
            org: data.org,
        };
    } catch {
        // Fallback - only IP
        try {
            const response = await fetch('https://api.ipify.org?format=json', {
                signal: AbortSignal.timeout(3000),
            });
            const data = await response.json();
            return { ip: data.ip };
        } catch {
            return {};
        }
    }
}
