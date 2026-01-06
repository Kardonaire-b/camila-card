/**
 * Visitor Analytics - Main Entry Point
 * Modular analytics collection and tracking
 */

import type { VisitorData, ExtendedNavigator } from './types';
import { parseUserAgent, getDeviceType, getUTMParams, getAllQueryParams } from './collectors/browser';
import { getNetworkInfo, getBatteryInfo, getIPData } from './collectors/network';
import { getCanvasFingerprint, getWebGLInfo, getAudioFingerprint, detectFonts } from './collectors/fingerprint';
import { detectAdBlock } from './detectors/adblock';
import { detectIncognito } from './detectors/incognito';
import { sendVisitorData } from './sender';

// Re-export types for external use
export type { VisitorData } from './types';

// Main data collection function
export async function collectVisitorData(): Promise<VisitorData> {
    const ua = navigator.userAgent;
    const { browser, version } = parseUserAgent(ua);
    const webgl = getWebGLInfo();
    const utmParams = getUTMParams();
    const networkInfo = getNetworkInfo();
    const nav = navigator as ExtendedNavigator;

    // Parallel async data collection
    const [ipData, batteryInfo, adBlockDetected, incognitoLikely] = await Promise.all([
        getIPData(),
        getBatteryInfo(),
        detectAdBlock(),
        detectIncognito(),
    ]);

    const now = new Date();

    const data: VisitorData = {
        // Time
        timestamp: now.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utcOffset: -now.getTimezoneOffset() / 60,
        localTime: now.toLocaleString('ru-RU'),

        // IP and geo
        ...ipData,

        // Browser
        userAgent: ua,
        browserName: browser,
        browserVersion: version,
        language: navigator.language,
        languages: [...navigator.languages],
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,

        // Device
        platform: navigator.platform,
        deviceType: getDeviceType(ua),
        vendor: navigator.vendor,
        cpuCores: navigator.hardwareConcurrency || 0,
        deviceMemory: nav.deviceMemory || null,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        maxTouchPoints: navigator.maxTouchPoints || 0,

        // Screen
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: screen.orientation?.type || 'unknown',

        // Network
        connectionType: networkInfo.type,
        connectionSpeed: networkInfo.speed,
        connectionRtt: networkInfo.rtt,
        saveData: networkInfo.saveData,
        online: navigator.onLine,

        // Battery
        batteryLevel: batteryInfo.level,
        batteryCharging: batteryInfo.charging,

        // Session
        referrer: document.referrer || 'direct',
        currentPage: window.location.href,
        pageTitle: document.title,
        pathname: window.location.pathname,
        queryParams: getAllQueryParams(),

        // UTM
        ...utmParams,

        // Fingerprints
        canvasFingerprint: getCanvasFingerprint(),
        webglVendor: webgl.vendor,
        webglRenderer: webgl.renderer,
        audioFingerprint: getAudioFingerprint(),

        // Capabilities
        webglSupported: webgl.supported,
        webrtcSupported: !!(window.RTCPeerConnection),
        webassemblySupported: typeof WebAssembly === 'object',
        serviceWorkerSupported: 'serviceWorker' in navigator,
        notificationsSupported: 'Notification' in window,
        geolocationSupported: 'geolocation' in navigator,

        // Storage
        localStorageSupported: (() => { try { return !!localStorage; } catch { return false; } })(),
        sessionStorageSupported: (() => { try { return !!sessionStorage; } catch { return false; } })(),
        indexedDBSupported: !!window.indexedDB,

        // Plugins
        plugins: Array.from(navigator.plugins || []).map(p => p.name),

        // Fonts
        fontsDetected: detectFonts(),

        // Additional
        adBlockDetected,
        incognitoLikely,
        historyLength: history.length,
    };

    return data;
}

// Main function to call
export async function trackVisitor(): Promise<void> {
    try {
        const data = await collectVisitorData();
        await sendVisitorData(data);
    } catch (error) {
        console.error('[Analytics] Tracking failed:', error);
    }
}
