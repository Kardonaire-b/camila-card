/**
 * Unified Cloudflare Worker
 * - Analytics: visitor tracking & story submissions → Telegram
 * - Voice call signaling: WebRTC signaling via KV polling
 *
 * Environment bindings:
 *   Secrets:  TELEGRAM_TOKEN, CHAT_ID
 *   Vars:     ALLOWED_ORIGIN, INVITE_KEYS
 *   KV:       CALL_KV
 *
 * Endpoints:
 *   POST /              → analytics (visitor data / story submission → Telegram)
 *   POST /call/join     → join/create call room
 *   GET  /call/status   → room status
 *   POST /call/signal   → send signal to peer
 *   GET  /call/poll     → get pending signals
 *   POST /call/leave    → leave room
 */

// ── Cloudflare Workers type (not in project tsconfig) ──
declare class KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

// ── Types ──

interface Env {
  // Analytics
  TELEGRAM_TOKEN: string;
  CHAT_ID: string;
  ALLOWED_ORIGIN?: string;
  // Call signaling
  CALL_KV: KVNamespace;
  INVITE_KEYS: string; // comma-separated, e.g. "estrella"
}

interface Room {
  peers: string[];
  createdAt: number;
}

interface SignalMessage {
  from: string;
  data: any;
  ts: number;
}

interface VisitorData {
  type?: string;
  [key: string]: any;
}

// ── Constants ──

const ROOM_TTL = 3600; // 1 hour
const INBOX_TTL = 120; // 2 minutes

// ── Helpers ──

function corsHeaders(env: Env): Record<string, string> {
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data: any, status: number, env: Env): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

// ── Analytics: Telegram formatters ──

function formatTelegramMessage(data: VisitorData): string {
  const deviceEmoji: Record<string, string> = {
    mobile: "📱",
    tablet: "📱",
    desktop: "💻",
  };

  const lines = [
    `🔔 <b>Новый посетитель!</b>`,
    ``,
    `<b>━━━ 🌍 Геолокация ━━━</b>`,
    `📍 IP: <code>${data.ip || "N/A"}</code>`,
    `🏳️ Страна: ${data.country || "N/A"} ${data.countryCode ? `(${data.countryCode})` : ""}`,
    `🏙️ Город: ${data.city || "N/A"}${data.region ? `, ${data.region}` : ""}`,
    `🌐 Провайдер: ${data.isp || "N/A"}`,
    ``,
    `<b>━━━ ${deviceEmoji[data.deviceType] || "💻"} Устройство ━━━</b>`,
    `📟 Тип: ${data.deviceType}`,
    `🖥️ Платформа: ${data.platform}`,
    `📐 Экран: ${data.screenWidth}x${data.screenHeight}`,
    `📏 Viewport: ${data.viewportWidth}x${data.viewportHeight}`,
    `🔋 Батарея: ${data.batteryLevel !== undefined ? `${data.batteryLevel}%${data.batteryCharging ? " ⚡" : ""}` : "N/A"}`,
    ``,
    `<b>━━━ 🌐 Браузер ━━━</b>`,
    `🔍 Браузер: ${data.browserName} ${data.browserVersion}`,
    `🗣️ Язык: ${data.language}`,
    `🍪 Cookies: ${data.cookiesEnabled ? "✅" : "❌"}`,
    `🔒 DNT: ${data.doNotTrack || "N/A"}`,
    ``,
    `<b>━━━ 📶 Сеть ━━━</b>`,
    `📡 Тип: ${data.connectionType || "N/A"}`,
    `⚡ Скорость: ${data.connectionSpeed ? `${data.connectionSpeed} Mbps` : "N/A"}`,
    `📊 RTT: ${data.connectionRtt ? `${data.connectionRtt}ms` : "N/A"}`,
    `🌐 Онлайн: ${data.online ? "✅" : "❌"}`,
    ``,
    `<b>━━━ 🔗 Сессия ━━━</b>`,
    `📄 Страница: ${data.pathname}`,
    `🔙 Откуда: ${data.referrer || "Прямой заход"}`,
    `⏰ Время: ${data.localTime}`,
    `🌍 Таймзона: ${data.timezone}`,
  ];

  // UTM
  if (data.utmSource || data.utmMedium || data.utmCampaign) {
    lines.push(``);
    lines.push(`<b>━━━ 📊 UTM ━━━</b>`);
    if (data.utmSource) lines.push(`📌 Source: ${data.utmSource}`);
    if (data.utmMedium) lines.push(`📌 Medium: ${data.utmMedium}`);
    if (data.utmCampaign) lines.push(`📌 Campaign: ${data.utmCampaign}`);
  }

  // Fingerprints
  lines.push(``);
  lines.push(`<b>━━━ 🔐 Fingerprints ━━━</b>`);
  lines.push(`🎨 Canvas: <code>${data.canvasFingerprint}</code>`);
  lines.push(`🎵 Audio: <code>${data.audioFingerprint}</code>`);
  lines.push(`🎮 WebGL: ${data.webglRenderer?.substring(0, 50) || "N/A"}`);

  // Hardware
  lines.push(``);
  lines.push(`<b>━━━ ⚙️ Hardware ━━━</b>`);
  lines.push(`🧠 CPU cores: ${data.cpuCores}`);
  lines.push(`💾 RAM: ${data.deviceMemory ? `~${data.deviceMemory}GB` : "N/A"}`);
  lines.push(`👆 Touch: ${data.touchSupport ? `✅ (${data.maxTouchPoints} points)` : "❌"}`);

  // Flags
  lines.push(``);
  lines.push(`<b>━━━ 🚩 Флаги ━━━</b>`);
  lines.push(`🛡️ AdBlock: ${data.adBlockDetected ? "✅ Detected" : "❌ No"}`);
  lines.push(`👤 Incognito: ${data.incognitoLikely ? "⚠️ Likely" : "❌ No"}`);
  lines.push(`📜 History: ${data.historyLength} entries`);

  return lines.join("\n");
}

function formatStoryMessage(data: VisitorData): string {
  const lines = [
    `📖 <b>Новая глава истории!</b>`,
    ``,
    `<b>━━━ ✍️ Камила написала ━━━</b>`,
    ``,
    `<i>${data.text}</i>`,
    ``,
    `<b>━━━ 📝 Метаданные ━━━</b>`,
    `🔢 Глава: ${data.chapterId || "N/A"}`,
    `⏰ Время: ${data.timestamp || new Date().toISOString()}`,
  ];
  return lines.join("\n");
}

async function sendToTelegram(token: string, chatId: string, message: string): Promise<any> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  return response.json();
}

// ── Analytics handler ──

async function handleAnalytics(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = (await request.json()) as VisitorData;

    const message =
      data.type === "story_submission"
        ? formatStoryMessage(data)
        : formatTelegramMessage(data);

    await sendToTelegram(env.TELEGRAM_TOKEN, env.CHAT_ID, message);

    return new Response("OK", { headers: corsHeaders(env) });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal error", {
      status: 500,
      headers: corsHeaders(env),
    });
  }
}

// ── Call signaling handlers ──

async function handleCallJoin(request: Request, env: Env): Promise<Response> {
  const { key } = (await request.json()) as { key: string };
  const validKeys = (env.INVITE_KEYS || "").split(",").map((k) => k.trim());

  if (!validKeys.includes(key)) {
    return json({ error: "invalid_key" }, 403, env);
  }

  const roomKey = `room:${key}`;
  const raw = await env.CALL_KV.get(roomKey);
  let room: Room = raw ? JSON.parse(raw) : { peers: [], createdAt: Date.now() };

  if (room.peers.length >= 2) {
    return json({ error: "room_full" }, 409, env);
  }

  const peerId = room.peers.length === 0 ? "peer-a" : "peer-b";
  room.peers.push(peerId);

  await env.CALL_KV.put(roomKey, JSON.stringify(room), {
    expirationTtl: ROOM_TTL,
  });

  // Clear any stale inbox
  await env.CALL_KV.delete(`inbox:${key}:${peerId}`);

  return json(
    {
      peerId,
      peerCount: room.peers.length,
      isInitiator: false,
    },
    200,
    env
  );
}

async function handleCallStatus(url: URL, env: Env): Promise<Response> {
  const key = url.searchParams.get("key");
  const validKeys = (env.INVITE_KEYS || "").split(",").map((k) => k.trim());

  if (!key || !validKeys.includes(key)) {
    return json({ error: "invalid_key" }, 403, env);
  }

  const raw = await env.CALL_KV.get(`room:${key}`);
  if (!raw) return json({ peers: [], peerCount: 0 }, 200, env);

  const room: Room = JSON.parse(raw);
  return json({ peers: room.peers, peerCount: room.peers.length }, 200, env);
}

async function handleCallSignal(request: Request, env: Env): Promise<Response> {
  const { key, from, to, data } = (await request.json()) as {
    key: string;
    from: string;
    to: string;
    data: any;
  };

  const validKeys = (env.INVITE_KEYS || "").split(",").map((k) => k.trim());
  if (!validKeys.includes(key)) {
    return json({ error: "invalid_key" }, 403, env);
  }

  const inboxKey = `inbox:${key}:${to}`;
  const raw = await env.CALL_KV.get(inboxKey);
  const inbox: SignalMessage[] = raw ? JSON.parse(raw) : [];

  inbox.push({ from, data, ts: Date.now() });

  await env.CALL_KV.put(inboxKey, JSON.stringify(inbox), {
    expirationTtl: INBOX_TTL,
  });

  return json({ ok: true }, 200, env);
}

async function handleCallPoll(url: URL, env: Env): Promise<Response> {
  const key = url.searchParams.get("key");
  const peer = url.searchParams.get("peer");
  const validKeys = (env.INVITE_KEYS || "").split(",").map((k) => k.trim());

  if (!key || !peer || !validKeys.includes(key)) {
    return json({ error: "invalid_key" }, 403, env);
  }

  const inboxKey = `inbox:${key}:${peer}`;
  const raw = await env.CALL_KV.get(inboxKey);
  const messages: SignalMessage[] = raw ? JSON.parse(raw) : [];

  // Clear inbox after reading
  if (messages.length > 0) {
    await env.CALL_KV.delete(inboxKey);
  }

  return json({ messages }, 200, env);
}

async function handleCallLeave(request: Request, env: Env): Promise<Response> {
  const { key, peer } = (await request.json()) as {
    key: string;
    peer: string;
  };

  const validKeys = (env.INVITE_KEYS || "").split(",").map((k) => k.trim());
  if (!validKeys.includes(key)) {
    return json({ error: "invalid_key" }, 403, env);
  }

  const roomKey = `room:${key}`;
  const raw = await env.CALL_KV.get(roomKey);
  if (raw) {
    const room: Room = JSON.parse(raw);
    room.peers = room.peers.filter((p) => p !== peer);

    if (room.peers.length === 0) {
      await env.CALL_KV.delete(roomKey);
    } else {
      await env.CALL_KV.put(roomKey, JSON.stringify(room), {
        expirationTtl: ROOM_TTL,
      });
    }
  }

  // Clean up inboxes & signal the other peer
  await env.CALL_KV.delete(`inbox:${key}:${peer}`);
  const otherPeer = peer === "peer-a" ? "peer-b" : "peer-a";
  const otherInboxKey = `inbox:${key}:${otherPeer}`;
  const otherRaw = await env.CALL_KV.get(otherInboxKey);
  const otherInbox: SignalMessage[] = otherRaw ? JSON.parse(otherRaw) : [];
  otherInbox.push({
    from: peer,
    data: { type: "peer-left" },
    ts: Date.now(),
  });
  await env.CALL_KV.put(otherInboxKey, JSON.stringify(otherInbox), {
    expirationTtl: INBOX_TTL,
  });

  return json({ ok: true }, 200, env);
}

// ── Main router ──

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ── Call signaling routes ──
      if (path === "/call/join" && request.method === "POST") {
        return handleCallJoin(request, env);
      }
      if (path === "/call/status" && request.method === "GET") {
        return handleCallStatus(url, env);
      }
      if (path === "/call/signal" && request.method === "POST") {
        return handleCallSignal(request, env);
      }
      if (path === "/call/poll" && request.method === "GET") {
        return handleCallPoll(url, env);
      }
      if (path === "/call/leave" && request.method === "POST") {
        return handleCallLeave(request, env);
      }

      // ── Analytics (default — root POST) ──
      return handleAnalytics(request, env);
    } catch (e: any) {
      return json({ error: e.message }, 500, env);
    }
  },
};
