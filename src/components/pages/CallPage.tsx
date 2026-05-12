/**
 * CallPage Component
 * Voice call page with WebRTC — premium glassmorphism design
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic, MicOff, Wifi, WifiOff, ShieldCheck, ShieldAlert } from "lucide-react";
import { useWebRTC, type CallState } from "../../hooks/useWebRTC";
import type { Lang } from "../../translations/translations";

/* ── Helpers ── */

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Signal quality: 0-3 bars based on RTT */
function signalQuality(rtt: number | null): 0 | 1 | 2 | 3 {
  if (rtt === null) return 0;
  if (rtt < 80) return 3;
  if (rtt < 200) return 2;
  return 1;
}

/* ── Localisation ── */

const STATUS_TEXT: Record<CallState, { ru: string; es: string }> = {
  idle: { ru: "Введи ключ для звонка", es: "Ingresá la clave para llamar" },
  joining: { ru: "Подключаюсь…", es: "Conectando…" },
  waiting: { ru: "Жду тебя на линии…", es: "Esperándote en la línea…" },
  connecting: { ru: "Устанавливаю соединение…", es: "Estableciendo conexión…" },
  connected: { ru: "Соединение установлено", es: "Conexión establecida" },
  error: { ru: "Ошибка соединения", es: "Error de conexión" },
};

const ERROR_TEXT: Record<string, { ru: string; es: string }> = {
  invalid_key: { ru: "Неверный ключ", es: "Clave incorrecta" },
  room_full: { ru: "Линия занята", es: "Línea ocupada" },
  connection_lost: { ru: "Связь потеряна", es: "Se perdió la conexión" },
  peer_left: { ru: "Собеседник отключился", es: "Se desconectó" },
  unknown_error: { ru: "Что-то пошло не так", es: "Algo salió mal" },
};

/* ── Signal-quality bar component ── */

function SignalBars({ quality }: { quality: 0 | 1 | 2 | 3 }) {
  const colors = ["bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-400"];
  const color = quality === 0 ? "bg-white/20" : colors[quality - 1];

  return (
    <div className="flex items-end gap-[3px] h-4">
      {[1, 2, 3].map((bar) => (
        <motion.div
          key={bar}
          className={`w-[4px] rounded-full transition-colors duration-500 ${bar <= quality ? color : "bg-white/15"}`}
          style={{ height: `${bar * 5 + 2}px` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: bar * 0.1, type: "spring" }}
        />
      ))}
    </div>
  );
}

/* ── Main component ── */

interface CallPageProps {
  lang?: Lang;
}

export default function CallPage({ lang = "ru" }: CallPageProps) {
  const [key, setKey] = useState("");
  const {
    callState,
    error,
    isMuted,
    callDuration,
    stats,
    joinCall,
    hangUp,
    toggleMute,
    remoteAudioRef,
  } = useWebRTC();

  const audioRef = useRef<HTMLAudioElement>(null);

  // Link the audio ref from the hook to our element
  useEffect(() => {
    if (audioRef.current) {
      (remoteAudioRef as React.MutableRefObject<HTMLAudioElement | null>).current =
        audioRef.current;
    }
  }, [remoteAudioRef]);

  const handleJoin = () => {
    const trimmed = key.trim().toLowerCase();
    if (trimmed) joinCall(trimmed);
  };

  const statusText = STATUS_TEXT[callState][lang];
  const errorText = error ? ERROR_TEXT[error]?.[lang] || error : null;
  const isActive = ["waiting", "connecting", "connected"].includes(callState);
  const quality = signalQuality(stats.rtt);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      {/* Hidden audio element for remote stream */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* ── Ambient glow behind the card ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] -z-10 transition-colors duration-1000"
        style={{
          background:
            callState === "connected"
              ? "radial-gradient(circle, rgba(52,211,153,0.25), transparent 70%)"
              : callState === "error"
                ? "radial-gradient(circle, rgba(248,113,113,0.2), transparent 70%)"
                : "radial-gradient(circle, rgba(147,130,220,0.2), transparent 70%)",
        }}
      />

      {/* ── Glass card ── */}
      <motion.div
        className="w-full max-w-sm rounded-3xl p-6 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >

        {/* ── Status area ── */}
        <div className="text-center mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={callState + (error || "")}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className={`text-base font-medium ${callState === "error"
                ? "text-red-300"
                : callState === "connected"
                  ? "text-emerald-300"
                  : "text-[var(--ink)]/80"
                }`}
            >
              {callState === "error" && (
                <ShieldAlert className="inline w-4 h-4 mr-1.5 -mt-0.5" />
              )}
              {callState === "connected" && (
                <ShieldCheck className="inline w-4 h-4 mr-1.5 -mt-0.5" />
              )}
              {errorText || statusText}
            </motion.p>
          </AnimatePresence>

          {/* Timer */}
          {callState === "connected" && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-mono mt-3 tabular-nums tracking-wider text-[var(--ink)]"
            >
              {formatTime(callDuration)}
            </motion.p>
          )}
        </div>

        {/* ── Pulse rings (waiting / connecting) ── */}
        {(callState === "waiting" || callState === "connecting") && (
          <div className="relative flex items-center justify-center mb-8 h-28">
            {[0, 0.7, 1.4].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-20 rounded-full border border-current opacity-20"
                animate={{ scale: [1, 2.2], opacity: [0.25, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay,
                }}
              />
            ))}
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.07)" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Phone className="w-7 h-7 text-[var(--ink)]/60" />
            </motion.div>
          </div>
        )}

        {/* ── Key input (idle / error) ── */}
        {(callState === "idle" || callState === "error") && (
          <motion.div
            className="flex flex-col items-center gap-5 mb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder={lang === "ru" ? "Секретный ключ…" : "Clave secreta…"}
              className="w-full px-5 py-3.5 rounded-2xl text-center text-base
                         bg-white/[0.06] border border-white/15
                         placeholder:text-[var(--ink)]/30 text-[var(--ink)]
                         outline-none transition-all duration-300
                         focus:border-white/35 focus:bg-white/[0.09]
                         focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              id="call-key-input"
            />

            <motion.button
              onClick={handleJoin}
              disabled={!key.trim()}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-full flex items-center justify-center
                         transition-all duration-300 shadow-lg
                         disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none"
              style={{
                background: key.trim()
                  ? "linear-gradient(135deg, #34d399, #059669)"
                  : "rgba(255,255,255,0.06)",
                boxShadow: key.trim()
                  ? "0 8px 25px rgba(52,211,153,0.35)"
                  : "none",
              }}
              id="call-start-button"
            >
              <Phone className="w-7 h-7 text-white" />
            </motion.button>
          </motion.div>
        )}

        {/* ── Call controls (active call) ── */}
        {isActive && (
          <motion.div
            className="flex items-center justify-center gap-5 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Mute */}
            <motion.button
              onClick={toggleMute}
              whileTap={{ scale: 0.88 }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border"
              style={{
                background: isMuted
                  ? "rgba(248,113,113,0.2)"
                  : "rgba(255,255,255,0.06)",
                borderColor: isMuted
                  ? "rgba(248,113,113,0.3)"
                  : "rgba(255,255,255,0.1)",
              }}
              id="call-mute-button"
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-red-300" />
              ) : (
                <Mic className="w-5 h-5 text-[var(--ink)]/80" />
              )}
            </motion.button>

            {/* Hang up */}
            <motion.button
              onClick={hangUp}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.05 }}
              className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 8px 25px rgba(239,68,68,0.35)",
              }}
              id="call-hangup-button"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </motion.button>
          </motion.div>
        )}

        {/* ── Connection stats (connected) ── */}
        {callState === "connected" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 pt-4 border-t border-white/[0.07]"
          >
            <div className="flex items-center justify-center gap-4 text-xs text-[var(--ink)]/40">
              <div className="flex items-center gap-1.5">
                <SignalBars quality={quality} />
                <span>{quality === 3 ? (lang === "ru" ? "Отлично" : "Excelente") : quality === 2 ? (lang === "ru" ? "Хорошо" : "Bueno") : lang === "ru" ? "Слабо" : "Débil"}</span>
              </div>

              {stats.rtt !== null && (
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span>{stats.rtt}ms</span>
                </div>
              )}

              {stats.bitrate !== null && (
                <span>{stats.bitrate}kbps</span>
              )}

              {stats.packetLoss !== null && stats.packetLoss > 0 && (
                <span className="text-red-400/70">
                  <WifiOff className="inline w-3 h-3 mr-0.5" />
                  -{stats.packetLoss}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Encrypted badge ── */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-5 flex items-center gap-1.5 text-[10px] text-[var(--ink)]/25 tracking-wide uppercase"
        >
          <ShieldCheck className="w-3 h-3" />
          {lang === "ru" ? "Зашифровано" : "Cifrado"} · WebRTC P2P
        </motion.div>
      )}
    </div>
  );
}
