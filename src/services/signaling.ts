/**
 * Signaling service — polling-based WebRTC signaling via Cloudflare Worker
 */

import { WORKER_URL } from '../config';

const POLL_INTERVAL = 1500; // ms

export interface SignalMessage {
  from: string;
  data: any;
  ts: number;
}

export class SignalingService {
  private key: string;
  private peerId: string | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private onMessage: ((msg: SignalMessage) => void) | null = null;

  constructor(key: string) {
    this.key = key;
  }

  /** Join room, get assigned peer ID */
  async join(): Promise<{ peerId: string; peerCount: number }> {
    const res = await fetch(`${WORKER_URL}/call/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: this.key }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "join_failed");
    }

    const data = await res.json();
    this.peerId = data.peerId;
    return data;
  }

  /** Check room status (how many peers connected) */
  async getStatus(): Promise<{ peers: string[]; peerCount: number }> {
    const res = await fetch(
      `${WORKER_URL}/call/status?key=${encodeURIComponent(this.key)}`
    );
    return res.json();
  }

  /** Send signaling data to the other peer */
  async send(data: any): Promise<void> {
    if (!this.peerId) throw new Error("not_joined");

    const to = this.peerId === "peer-a" ? "peer-b" : "peer-a";

    await fetch(`${WORKER_URL}/call/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: this.key,
        from: this.peerId,
        to,
        data,
      }),
    });
  }

  /** Start polling for incoming signals */
  startPolling(onMessage: (msg: SignalMessage) => void): void {
    this.onMessage = onMessage;

    this.pollTimer = setInterval(async () => {
      if (!this.peerId) return;

      try {
        const res = await fetch(
          `${WORKER_URL}/call/poll?key=${encodeURIComponent(this.key)}&peer=${this.peerId}`
        );
        const { messages } = await res.json();

        if (messages?.length) {
          for (const msg of messages) {
            this.onMessage?.(msg);
          }
        }
      } catch (e) {
        console.warn("[signaling] poll error:", e);
      }
    }, POLL_INTERVAL);
  }

  /** Stop polling */
  stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /** Leave room and clean up */
  async leave(): Promise<void> {
    this.stopPolling();

    if (this.peerId) {
      try {
        await fetch(`${WORKER_URL}/call/leave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: this.key, peer: this.peerId }),
        });
      } catch {
        // best-effort cleanup
      }
    }

    this.peerId = null;
  }

  getPeerId(): string | null {
    return this.peerId;
  }
}
