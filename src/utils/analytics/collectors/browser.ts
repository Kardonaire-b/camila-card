/**
 * Browser and Device Information Collectors
 */

// Parse User-Agent
export function parseUserAgent(ua: string): { browser: string; version: string } {
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

// Determine device type
export function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
    const tabletRegex = /tablet|ipad|playbook|silk/i;
    const mobileRegex = /mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i;

    if (tabletRegex.test(ua)) return 'tablet';
    if (mobileRegex.test(ua)) return 'mobile';
    return 'desktop';
}

// Get UTM parameters
export function getUTMParams(): Record<string, string | undefined> {
    const params = new URLSearchParams(window.location.search);
    return {
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        utmTerm: params.get('utm_term') || undefined,
        utmContent: params.get('utm_content') || undefined,
    };
}

// Get all query parameters
export function getAllQueryParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}
