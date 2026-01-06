/**
 * Cloudflare Worker для отправки данных о посетителях в Telegram
 * 
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 * 
 * 1. Зайти на https://workers.cloudflare.com
 * 2. Создать аккаунт (бесплатно)
 * 3. Создать новый Worker
 * 4. Вставить этот код
 * 5. Добавить переменные окружения (Settings → Variables):
 *    - TELEGRAM_TOKEN: токен от @BotFather
 *    - CHAT_ID: ваш Chat ID (можно узнать через @userinfobot)
 * 6. Опубликовать Worker
 * 7. Скопировать URL Worker'а в visitorAnalytics.ts (константа WORKER_URL)
 */

export default {
    async fetch(request, env) {
        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders(env),
            });
        }

        // Только POST запросы
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        try {
            const data = await request.json();

            // Форматируем сообщение для Telegram
            const message = formatTelegramMessage(data);

            // Отправляем в Telegram
            await sendToTelegram(env.TELEGRAM_TOKEN, env.CHAT_ID, message);

            return new Response('OK', {
                headers: corsHeaders(env),
            });
        } catch (error) {
            console.error('Error:', error);
            return new Response('Internal error', {
                status: 500,
                headers: corsHeaders(env),
            });
        }
    }
};

// CORS заголовки
function corsHeaders(env) {
    // Замените на ваш домен GitHub Pages
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

// Форматирование сообщения
function formatTelegramMessage(data) {
    const deviceEmoji = {
        mobile: '📱',
        tablet: '📱',
        desktop: '💻',
    };

    const lines = [
        `🔔 <b>Новый посетитель!</b>`,
        ``,
        `<b>━━━ 🌍 Геолокация ━━━</b>`,
        `📍 IP: <code>${data.ip || 'N/A'}</code>`,
        `🏳️ Страна: ${data.country || 'N/A'} ${data.countryCode ? `(${data.countryCode})` : ''}`,
        `🏙️ Город: ${data.city || 'N/A'}${data.region ? `, ${data.region}` : ''}`,
        `🌐 Провайдер: ${data.isp || 'N/A'}`,
        ``,
        `<b>━━━ ${deviceEmoji[data.deviceType] || '💻'} Устройство ━━━</b>`,
        `📟 Тип: ${data.deviceType}`,
        `🖥️ Платформа: ${data.platform}`,
        `📐 Экран: ${data.screenWidth}x${data.screenHeight}`,
        `📏 Viewport: ${data.viewportWidth}x${data.viewportHeight}`,
        `🔋 Батарея: ${data.batteryLevel !== undefined ? `${data.batteryLevel}%${data.batteryCharging ? ' ⚡' : ''}` : 'N/A'}`,
        ``,
        `<b>━━━ 🌐 Браузер ━━━</b>`,
        `🔍 Браузер: ${data.browserName} ${data.browserVersion}`,
        `🗣️ Язык: ${data.language}`,
        `🍪 Cookies: ${data.cookiesEnabled ? '✅' : '❌'}`,
        `🔒 DNT: ${data.doNotTrack || 'N/A'}`,
        ``,
        `<b>━━━ 📶 Сеть ━━━</b>`,
        `📡 Тип: ${data.connectionType || 'N/A'}`,
        `⚡ Скорость: ${data.connectionSpeed ? `${data.connectionSpeed} Mbps` : 'N/A'}`,
        `📊 RTT: ${data.connectionRtt ? `${data.connectionRtt}ms` : 'N/A'}`,
        `🌐 Онлайн: ${data.online ? '✅' : '❌'}`,
        ``,
        `<b>━━━ 🔗 Сессия ━━━</b>`,
        `📄 Страница: ${data.pathname}`,
        `🔙 Откуда: ${data.referrer || 'Прямой заход'}`,
        `⏰ Время: ${data.localTime}`,
        `🌍 Таймзона: ${data.timezone}`,
    ];

    // Добавляем UTM если есть
    if (data.utmSource || data.utmMedium || data.utmCampaign) {
        lines.push(``);
        lines.push(`<b>━━━ 📊 UTM ━━━</b>`);
        if (data.utmSource) lines.push(`📌 Source: ${data.utmSource}`);
        if (data.utmMedium) lines.push(`📌 Medium: ${data.utmMedium}`);
        if (data.utmCampaign) lines.push(`📌 Campaign: ${data.utmCampaign}`);
    }

    // Добавляем fingerprints
    lines.push(``);
    lines.push(`<b>━━━ 🔐 Fingerprints ━━━</b>`);
    lines.push(`🎨 Canvas: <code>${data.canvasFingerprint}</code>`);
    lines.push(`🎵 Audio: <code>${data.audioFingerprint}</code>`);
    lines.push(`🎮 WebGL: ${data.webglRenderer?.substring(0, 50) || 'N/A'}`);

    // Добавляем hardware
    lines.push(``);
    lines.push(`<b>━━━ ⚙️ Hardware ━━━</b>`);
    lines.push(`🧠 CPU cores: ${data.cpuCores}`);
    lines.push(`💾 RAM: ${data.deviceMemory ? `~${data.deviceMemory}GB` : 'N/A'}`);
    lines.push(`👆 Touch: ${data.touchSupport ? `✅ (${data.maxTouchPoints} points)` : '❌'}`);

    // Флаги
    lines.push(``);
    lines.push(`<b>━━━ 🚩 Флаги ━━━</b>`);
    lines.push(`🛡️ AdBlock: ${data.adBlockDetected ? '✅ Detected' : '❌ No'}`);
    lines.push(`👤 Incognito: ${data.incognitoLikely ? '⚠️ Likely' : '❌ No'}`);
    lines.push(`📜 History: ${data.historyLength} entries`);

    return lines.join('\n');
}

// Отправка в Telegram
async function sendToTelegram(token, chatId, message) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Telegram API error: ${error}`);
    }

    return response.json();
}
