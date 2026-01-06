/**
 * Analytics Type Definitions
 */

// Network Info API types
export interface NetworkInformation {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
}

// Battery API types
export interface BatteryManager {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

// Extended Navigator interface
export interface ExtendedNavigator extends Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
    deviceMemory?: number;
    getBattery?: () => Promise<BatteryManager>;
    userAgentData?: {
        brands: Array<{ brand: string; version: string }>;
        mobile: boolean;
        platform: string;
        getHighEntropyValues?: (hints: string[]) => Promise<{
            architecture?: string;
            model?: string;
            platformVersion?: string;
            fullVersionList?: Array<{ brand: string; version: string }>;
        }>;
    };
}

// Main visitor data interface
export interface VisitorData {
    // Time
    timestamp: string;
    timezone: string;
    utcOffset: number;
    localTime: string;

    // IP and geo (from external API)
    ip?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    postal?: string;
    latitude?: number;
    longitude?: number;
    isp?: string;
    org?: string;
    asn?: string;

    // Browser
    userAgent: string;
    browserName: string;
    browserVersion: string;
    language: string;
    languages: string[];
    cookiesEnabled: boolean;
    doNotTrack: string | null;

    // Device
    platform: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    vendor: string;
    cpuCores: number;
    deviceMemory: number | null;
    touchSupport: boolean;
    maxTouchPoints: number;

    // Screen
    screenWidth: number;
    screenHeight: number;
    screenColorDepth: number;
    viewportWidth: number;
    viewportHeight: number;
    devicePixelRatio: number;
    orientation: string;

    // Network
    connectionType?: string;
    connectionSpeed?: number;
    connectionRtt?: number;
    saveData?: boolean;
    online: boolean;

    // Battery
    batteryLevel?: number;
    batteryCharging?: boolean;

    // Session
    referrer: string;
    currentPage: string;
    pageTitle: string;
    pathname: string;
    queryParams: Record<string, string>;

    // UTM tags
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;

    // Fingerprints
    canvasFingerprint: string;
    webglVendor: string;
    webglRenderer: string;
    audioFingerprint: string;

    // Capabilities
    webglSupported: boolean;
    webrtcSupported: boolean;
    webassemblySupported: boolean;
    serviceWorkerSupported: boolean;
    notificationsSupported: boolean;
    geolocationSupported: boolean;

    // Local storage
    localStorageSupported: boolean;
    sessionStorageSupported: boolean;
    indexedDBSupported: boolean;

    // Plugins
    plugins: string[];

    // Fonts (limited detection)
    fontsDetected: string[];

    // Additional
    adBlockDetected: boolean;
    incognitoLikely: boolean;
    historyLength: number;
}
