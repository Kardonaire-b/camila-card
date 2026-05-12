import { useRef, useState, useCallback, useEffect } from "react";
import { SignalingService, type SignalMessage } from "../services/signaling";

export type CallState =
  | "idle" // ввод ключа
  | "joining" // подключаемся к комнате
  | "waiting" // ждём второго участника
  | "connecting" // WebRTC handshake
  | "connected" // разговор идёт
  | "error"; // что-то пошло не так

export interface CallStats {
  rtt: number | null;
  packetLoss: number | null;
  bitrate: number | null;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function useWebRTC() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [stats, setStats] = useState<CallStats>({
    rtt: null,
    packetLoss: null,
    bitrate: null,
  });

  const signalingRef = useRef<SignalingService | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const waitPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevBytesRef = useRef<number>(0);
  const prevTimestampRef = useRef<number>(0);

  // ── Cleanup ──
  const cleanup = useCallback(() => {
    if (waitPollRef.current) clearInterval(waitPollRef.current);
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    if (statsTimerRef.current) clearInterval(statsTimerRef.current);

    signalingRef.current?.leave();
    signalingRef.current = null;

    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    setCallDuration(0);
    setStats({ rtt: null, packetLoss: null, bitrate: null });
    prevBytesRef.current = 0;
    prevTimestampRef.current = 0;
  }, []);

  // ── Stats collection ──
  const startStatsCollection = useCallback(() => {
    statsTimerRef.current = setInterval(async () => {
      const pc = pcRef.current;
      if (!pc) return;

      try {
        const report = await pc.getStats();
        report.forEach((s) => {
          if (s.type === "candidate-pair" && s.state === "succeeded") {
            setStats((prev) => ({
              ...prev,
              rtt: s.currentRoundTripTime
                ? Math.round(s.currentRoundTripTime * 1000)
                : prev.rtt,
            }));
          }
          if (s.type === "inbound-rtp" && s.kind === "audio") {
            const now = s.timestamp;
            const bytes = s.bytesReceived || 0;

            if (prevTimestampRef.current > 0) {
              const dt = (now - prevTimestampRef.current) / 1000;
              const db = bytes - prevBytesRef.current;
              const bitrate = dt > 0 ? Math.round((db * 8) / dt / 1000) : 0;

              setStats((prev) => ({
                ...prev,
                bitrate,
                packetLoss: s.packetsLost ?? prev.packetLoss,
              }));
            }

            prevBytesRef.current = bytes;
            prevTimestampRef.current = now;
          }
        });
      } catch {
        // stats not critical
      }
    }, 3000);
  }, []);

  // ── Create peer connection ──
  const createPC = useCallback(
    (signaling: SignalingService) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      // Send ICE candidates
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          signaling.send({
            type: "ice-candidate",
            candidate: e.candidate.toJSON(),
          });
        }
      };

      // Receive remote audio
      pc.ontrack = (e) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = e.streams[0];
          remoteAudioRef.current.play().catch(() => {});
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === "connected") {
          setCallState("connected");
          // Start duration timer
          const start = Date.now();
          durationTimerRef.current = setInterval(() => {
            setCallDuration(Math.floor((Date.now() - start) / 1000));
          }, 1000);
          startStatsCollection();
        }
        if (state === "disconnected" || state === "failed") {
          setCallState("error");
          setError("connection_lost");
        }
      };

      pcRef.current = pc;
      return pc;
    },
    [startStatsCollection]
  );

  // ── Handle incoming signals ──
  const handleSignal = useCallback(
    async (msg: SignalMessage) => {
      const pc = pcRef.current;
      if (!pc) return;

      const { data } = msg;

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        signalingRef.current?.send({
          type: "answer",
          sdp: pc.localDescription,
        });
      }

      if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }

      if (data.type === "ice-candidate" && data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch {
          // non-fatal
        }
      }

      if (data.type === "peer-left") {
        setCallState("error");
        setError("peer_left");
      }
    },
    []
  );

  // ── Start call (initiator) ──
  const startAsInitiator = useCallback(
    async (signaling: SignalingService) => {
      setCallState("connecting");

      const pc = createPC(signaling);

      // Add local audio
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // Listen for signals
      signaling.startPolling(handleSignal);

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await signaling.send({ type: "offer", sdp: pc.localDescription });
    },
    [createPC, handleSignal]
  );

  // ── Join call ──
  const joinCall = useCallback(
    async (key: string) => {
      try {
        setError(null);
        setCallState("joining");

        const signaling = new SignalingService(key);
        signalingRef.current = signaling;

        const { peerCount } = await signaling.join();

        if (peerCount === 2) {
          // We're the second one — wait for offer
          setCallState("connecting");

          const pc = createPC(signaling);

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          localStreamRef.current = stream;
          stream.getTracks().forEach((t) => pc.addTrack(t, stream));

          signaling.startPolling(handleSignal);
        } else {
          // We're first — wait for the other person
          setCallState("waiting");

          // Poll room status until someone joins
          waitPollRef.current = setInterval(async () => {
            const status = await signaling.getStatus();
            if (status.peerCount === 2) {
              clearInterval(waitPollRef.current!);
              waitPollRef.current = null;
              // We were first, so we initiate
              await startAsInitiator(signaling);
            }
          }, 2000);
        }
      } catch (e: any) {
        setCallState("error");
        setError(e.message || "unknown_error");
      }
    },
    [createPC, handleSignal, startAsInitiator]
  );

  // ── Hang up ──
  const hangUp = useCallback(() => {
    cleanup();
    setCallState("idle");
    setError(null);
  }, [cleanup]);

  // ── Toggle mute ──
  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const track = stream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    callState,
    error,
    isMuted,
    callDuration,
    stats,
    joinCall,
    hangUp,
    toggleMute,
    remoteAudioRef,
  };
}
