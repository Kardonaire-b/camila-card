/**
 * AdBlock Detection
 */

export async function detectAdBlock(): Promise<boolean> {
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
