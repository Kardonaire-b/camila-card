/**
 * Visitor Analytics - Comprehensive Data Collection
 */

// Типы для Network Info API
interface NetworkInformation {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
}

// Типы для Battery API
interface BatteryManager {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

// Расширение Navigator
interface ExtendedNavigator extends Navigator {
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

export interface VisitorData {
    // Время
    timestamp: string;
    timezone: string;
    utcOffset: number;
    localTime: string;

    // IP и гео (из внешнего API)
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

    // Браузер
    userAgent: string;
    browserName: string;
    browserVersion: string;
    language: string;
    languages: string[];
    cookiesEnabled: boolean;
    doNotTrack: string | null;

    // Устройство
    platform: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    vendor: string;
    cpuCores: number;
    deviceMemory: number | null;
    touchSupport: boolean;
    maxTouchPoints: number;

    // Экран
    screenWidth: number;
    screenHeight: number;
    screenColorDepth: number;
    viewportWidth: number;
    viewportHeight: number;
    devicePixelRatio: number;
    orientation: string;

    // Сеть
    connectionType?: string;
    connectionSpeed?: number;
    connectionRtt?: number;
    saveData?: boolean;
    online: boolean;

    // Батарея
    batteryLevel?: number;
    batteryCharging?: boolean;

    // Сессия
    referrer: string;
    currentPage: string;
    pageTitle: string;
    pathname: string;
    queryParams: Record<string, string>;

    // UTM метки
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

    // Локальные данные
    localStorageSupported: boolean;
    sessionStorageSupported: boolean;
    indexedDBSupported: boolean;

    // Plugins
    plugins: string[];

    // Fonts (limited detection)
    fontsDetected: string[];

    // Дополнительно
    adBlockDetected: boolean;
    incognitoLikely: boolean;
    historyLength: number;
}

// Парсинг User-Agent
function parseUserAgent(ua: string): { browser: string; version: string } {
    const browsers = [
        { name: 'Edge', regex: /Edg(?:e|A|iOS)?\/(\d+[\d.]*)/ },
        { name: 'Opera', regex: /(?:OPR|Opera)\/(\d+[\d.]*)/ },
        { name: 'Chrome', regex: /Chrome\/(\d+[\d.]*)/ },
        { name: 'Firefox', regex: /Firefox\/(\d+[\d.]*)/ },
        { name: 'Safari', regex: /Version\/(\d+[\d.]*).*Safari/ },
        { name: 'IE', regex: /(?:MSIE |rv:)(\d+[\d.]*)/ },
    ];

    for (const { name, regex } of browsers) {
        const match = ua.match(regex);
        if (match) return { browser: name, version: match[1] };
    }
    return { browser: 'Unknown', version: 'Unknown' };
}

// Определение типа устройства
function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
    const tabletRegex = /tablet|ipad|playbook|silk/i;
    const mobileRegex = /mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i;

    if (tabletRegex.test(ua)) return 'tablet';
    if (mobileRegex.test(ua)) return 'mobile';
    return 'desktop';
}

// Canvas Fingerprint
function getCanvasFingerprint(): string {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'unsupported';

        canvas.width = 200;
        canvas.height = 50;

        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 17);

        const dataUrl = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataUrl.length; i++) {
            const char = dataUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    } catch {
        return 'error';
    }
}

// WebGL информация
function getWebGLInfo(): { vendor: string; renderer: string; supported: boolean } {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
        if (!gl) return { vendor: 'unsupported', renderer: 'unsupported', supported: false };

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return {
            vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
            renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
            supported: true,
        };
    } catch {
        return { vendor: 'error', renderer: 'error', supported: false };
    }
}

// Audio Fingerprint
function getAudioFingerprint(): string {
    try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        if (!AudioContext) return 'unsupported';

        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const analyser = context.createAnalyser();
        const gain = context.createGain();
        const processor = context.createScriptProcessor(4096, 1, 1);

        gain.gain.value = 0;
        oscillator.type = 'triangle';
        oscillator.frequency.value = 10000;

        oscillator.connect(analyser);
        analyser.connect(processor);
        processor.connect(gain);
        gain.connect(context.destination);

        oscillator.start(0);

        const bins = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(bins);

        oscillator.stop();
        context.close();

        let hash = 0;
        for (let i = 0; i < bins.length; i++) {
            hash = ((hash << 5) - hash) + (bins[i] || 0);
            hash = hash & hash;
        }
        return hash.toString(16);
    } catch {
        return 'error';
    }
}

// Получение UTM параметров
function getUTMParams(): Record<string, string | undefined> {
    const params = new URLSearchParams(window.location.search);
    return {
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        utmTerm: params.get('utm_term') || undefined,
        utmContent: params.get('utm_content') || undefined,
    };
}

// Все query параметры
function getAllQueryParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

// Определение AdBlock
async function detectAdBlock(): Promise<boolean> {
    try {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox ad-banner ad-placement';
        testAd.style.cssText = 'position:absolute;top:-1000px;left:-1000px;';
        document.body.appendChild(testAd);

        await new Promise(r => setTimeout(r, 100));

        const blocked = testAd.offsetHeight === 0 || testAd.clientHeight === 0;
        document.body.removeChild(testAd);
        return blocked;
    } catch {
        return false;
    }
}

// Определение инкогнито режима (эвристика)
async function detectIncognito(): Promise<boolean> {
    try {
        // Проверка через storage quota
        if (navigator.storage && navigator.storage.estimate) {
            const { quota } = await navigator.storage.estimate();
            // В инкогнито обычно лимит ~120MB
            if (quota && quota < 150000000) return true;
        }

        // Проверка FileSystem API
        const fs = (window as unknown as { webkitRequestFileSystem?: unknown }).webkitRequestFileSystem;
        if (fs) {
            return new Promise<boolean>((resolve) => {
                (fs as (type: number, size: number, success: () => void, error: () => void) => void)(
                    0, 1,
                    () => resolve(false),
                    () => resolve(true)
                );
            });
        }

        return false;
    } catch {
        return false;
    }
}

// Определение установленных шрифтов (ограниченное)
function detectFonts(): string[] {
    const testFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
        'Georgia', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Arial Black',
        'Roboto', 'Open Sans', 'Segoe UI', 'San Francisco', 'Ubuntu',
    ];

    const detected: string[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return detected;

    const testString = 'mmmmmmmmmmlli';
    const baseFont = 'monospace';

    ctx.font = `72px ${baseFont}`;
    const baseWidth = ctx.measureText(testString).width;

    for (const font of testFonts) {
        ctx.font = `72px "${font}", ${baseFont}`;
        const width = ctx.measureText(testString).width;
        if (width !== baseWidth) detected.push(font);
    }

    return detected;
}

// Получить информацию о батарее
async function getBatteryInfo(): Promise<{ level?: number; charging?: boolean }> {
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

// Получить информацию о сети
function getNetworkInfo(): { type?: string; speed?: number; rtt?: number; saveData?: boolean } {
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

// Получить IP и гео данные (через CORS-friendly API)
async function getIPData(): Promise<Partial<VisitorData>> {
    try {
        // ipinfo.io поддерживает CORS
        const response = await fetch('https://ipinfo.io/json', {
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error('IP API failed');

        const data = await response.json();
        // ipinfo возвращает loc как "lat,lng"
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
        // Запасной вариант - только IP
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

// Основная функция сбора данных
export async function collectVisitorData(): Promise<VisitorData> {
    const ua = navigator.userAgent;
    const { browser, version } = parseUserAgent(ua);
    const webgl = getWebGLInfo();
    const utmParams = getUTMParams();
    const networkInfo = getNetworkInfo();
    const nav = navigator as ExtendedNavigator;

    // Параллельный сбор асинхронных данных
    const [ipData, batteryInfo, adBlockDetected, incognitoLikely] = await Promise.all([
        getIPData(),
        getBatteryInfo(),
        detectAdBlock(),
        detectIncognito(),
    ]);

    const now = new Date();

    const data: VisitorData = {
        // Время
        timestamp: now.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utcOffset: -now.getTimezoneOffset() / 60,
        localTime: now.toLocaleString('ru-RU'),

        // IP и гео
        ...ipData,

        // Браузер
        userAgent: ua,
        browserName: browser,
        browserVersion: version,
        language: navigator.language,
        languages: [...navigator.languages],
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,

        // Устройство
        platform: navigator.platform,
        deviceType: getDeviceType(ua),
        vendor: navigator.vendor,
        cpuCores: navigator.hardwareConcurrency || 0,
        deviceMemory: nav.deviceMemory || null,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        maxTouchPoints: navigator.maxTouchPoints || 0,

        // Экран
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: screen.orientation?.type || 'unknown',

        // Сеть
        connectionType: networkInfo.type,
        connectionSpeed: networkInfo.speed,
        connectionRtt: networkInfo.rtt,
        saveData: networkInfo.saveData,
        online: navigator.onLine,

        // Батарея
        batteryLevel: batteryInfo.level,
        batteryCharging: batteryInfo.charging,

        // Сессия
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

        // Дополнительно
        adBlockDetected,
        incognitoLikely,
        historyLength: history.length,
    };

    return data;
}

// URL Cloudflare Worker для отправки данных
const WORKER_URL = 'https://calm-night-8d6b.ilyarokieplus.workers.dev/';

// Отправка данных в Worker
export async function sendVisitorData(data: VisitorData): Promise<boolean> {
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error('[Analytics] Failed to send data:', error);
        return false;
    }
}

// Главная функция для вызова
export async function trackVisitor(): Promise<void> {
    try {
        const data = await collectVisitorData();
        await sendVisitorData(data);
    } catch (error) {
        console.error('[Analytics] Tracking failed:', error);
    }
}
