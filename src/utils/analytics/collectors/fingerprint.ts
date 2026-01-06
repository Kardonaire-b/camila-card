/**
 * Browser Fingerprinting Collectors
 */

// Canvas Fingerprint
export function getCanvasFingerprint(): string {
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

// WebGL information
export function getWebGLInfo(): { vendor: string; renderer: string; supported: boolean } {
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
export function getAudioFingerprint(): string {
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

// Detect installed fonts (limited)
export function detectFonts(): string[] {
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
