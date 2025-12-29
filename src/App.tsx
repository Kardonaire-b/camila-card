import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, Signal, Mail, Stars, Gift } from "lucide-react";

import thanksSketch from "./assets/quartz.png";
import songUrl from "./assets/audio/melody.mp3";

type Horizon = "dawn" | "day" | "sunset" | "night";
type Lang = 'ru' | 'es';

// ─────────────────────────── Snowflakes (CSS-optimized) ───────────────────────────
const Snowflakes = React.memo(function Snowflakes() {
  // Reduced count and using CSS animations for GPU acceleration
  const snowflakes = useMemo(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 10,
      size: 8 + Math.random() * 10,
      opacity: 0.5 + Math.random() * 0.4,
    })), []
  );

  return (
    <div className="snowflakes-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            fontSize: flake.size,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
});

export default function CamilaPostcardV5() {
  const [lang, setLang] = useState<Lang>((localStorage.getItem('lang') as Lang) ?? 'ru');
  const [horizon, setHorizon] = useState<Horizon>("night");; // dawn | day | sunset | night - default to night for New Year atmosphere
  const [page, setPage] = useState("home"); // home | lighthouse | letter | gallery | thanks

  const t = useMemo(() => translations[lang], [lang]);

  // New Year themed palettes - more festive and wintery
  const palettes = {
    dawn: ["#e8d5e7", "#c5cae9"],      // Soft pink-lavender winter morning
    day: ["#cce5ff", "#e3f2fd"],       // Crisp winter day blue
    sunset: ["#ffcccb", "#ffd1dc"],    // Rosy winter sunset
    night: ["#1a1a2e", "#16213e"],     // Deep magical New Year night
  };

  const bg = useMemo(() => `linear-gradient(to top, ${palettes[horizon][0]}, ${palettes[horizon][1]})`, [horizon]);

  useEffect(() => {
    const root = document.documentElement;
    // Festive glass with slight golden tint
    root.style.setProperty("--glass", horizon === "night" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.75)");
    root.style.setProperty("--ink", horizon === "night" ? "#f0f0f0" : "#0b1020");
  }, [horizon]);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center relative" style={{ background: bg }}>
      {/* Falling snowflakes */}
      <Snowflakes />

      <TopBar
        title={t.topbarTitle}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === "es" ? "ru" : "es"))}
        ariaLabel={lang === "es" ? t.a11y.switchToRU : t.a11y.switchToES}
      />

      <main className="relative z-[2] w-full max-w-md flex-1 px-4 pt-20 pb-[calc(90px+env(safe-area-inset-bottom,0))]">
        <AnimatePresence mode="wait">
          {page === "home" && (
            <PageWrap key="home">
              <Home t={t} onStart={() => setPage("lighthouse")} />
            </PageWrap>
          )}
          {page === "lighthouse" && (
            <PageWrap key="lighthouse">
              <Lighthouse t={t} horizon={horizon} setHorizon={setHorizon} />
            </PageWrap>
          )}
          {page === "letter" && (
            <PageWrap key="letter">
              <Letter t={t} />
            </PageWrap>
          )}
          {page === "sky" && (
            <PageWrap key="sky">
              <Sky t={t} />
            </PageWrap>
          )}
          {page === "thanks" && (
            <PageWrap key="thanks">
              <Thanks t={t} onRelight={() => setPage("lighthouse")} />
            </PageWrap>
          )}
        </AnimatePresence>
      </main>

      <BottomNav t={t} page={page} onNavigate={setPage} />

      <style>{`
        @keyframes sweep { 0% { transform: rotate(-14deg); opacity: .92; } 50% { transform: rotate(14deg); opacity: .98; } 100% { transform: rotate(-14deg); opacity: .92; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        
        /* GPU-accelerated snowfall animation */
        @keyframes snowfall {
          0% { transform: translateY(-20px) translateZ(0); }
          100% { transform: translateY(100vh) translateZ(0); }
        }
        .snowflakes-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }
        .snowflake {
          position: absolute;
          top: -20px;
          color: white;
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        
        /* Wave animation */
        @keyframes wave-sway {
          0%, 100% { transform: translateX(0) translateZ(0); }
          50% { transform: translateX(-10px) translateZ(0); }
        }
        .wave-animation {
          animation: wave-sway 6s ease-in-out infinite;
          will-change: transform;
        }
        
        /* Beam rotation animation */
        @keyframes beam-sweep {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .beam-animation {
          animation: beam-sweep 4s ease-in-out infinite;
          will-change: transform;
        }
        
        /* Cloud floating animations */
        @keyframes cloud-float {
          0%, 100% { transform: translateY(0) translateZ(0); }
          50% { transform: translateY(1.5px) translateZ(0); }
        }
        .cloud-animation {
          will-change: transform;
        }
        .cloud-1 { animation: cloud-float 5.5s ease-in-out infinite; }
        .cloud-2 { animation: cloud-float 4.8s ease-in-out infinite; animation-delay: 0.2s; }
        .cloud-3 { animation: cloud-float 6.2s ease-in-out infinite; animation-delay: 0.4s; }
        .cloud-4 { animation: cloud-float 5.2s ease-in-out infinite; animation-delay: 0.1s; }
        .cloud-5 { animation: cloud-float 5.6s ease-in-out infinite; animation-delay: 0.3s; }
        
        .glass { 
          background: var(--glass); 
          backdrop-filter: blur(12px); 
          -webkit-backdrop-filter: blur(12px); 
        }
        .soft-card { 
          box-shadow: 0 10px 30px rgba(8,12,30,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset; 
          border: 1px solid rgba(255,255,255,0.35); 
          border-radius: 1.5rem;
        }
        .festive-glow { 
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.4), 0 0 50px rgba(255, 100, 100, 0.25), 0 10px 30px rgba(0,0,0,0.2);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        /* Better text contrast on dark mode */
        .text-shadow-glow {
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        /* Navigation bar animation */
        @keyframes nav-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.2); }
          50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
        }
        
        /* Star twinkle animation for Sky page */
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        .star-twinkle {
          animation: star-twinkle 2s ease-in-out infinite;
          will-change: opacity, transform;
        }
        
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; } }
      `}</style>
    </div>
  );
}

function TopBar(
  { title, lang, onToggleLang, ariaLabel }: {
    title: string;
    lang: string;
    onToggleLang: () => void;
    ariaLabel: string;
  }
) {
  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <div className="mx-auto max-w-md px-4 pt-5">
        <div className="glass soft-card festive-glow flex items-center justify-between rounded-2xl px-3 py-2">
          <h1 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--ink)] truncate">{title}</h1>
          <button
            onClick={onToggleLang}
            className="rounded-xl border border-white/50 px-2 py-1 text-xs sm:text-sm text-[var(--ink)] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-black/10 shrink-0"
            aria-label={ariaLabel}
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}


function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-4">
      {children}
    </motion.section>
  );
}  // :contentReference[oaicite:3]{index=3}

// ─────────────────────────── Home ───────────────────────────
function Home({ t, onStart }: { t: any; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* 1) Интро */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass soft-card festive-glow w-full rounded-3xl p-5 text-center"
      >
        <p className="text-base leading-relaxed text-[var(--ink)]">
          {t.homeIntro}
        </p>
      </motion.div>

      {/* 2) Инструкции/навигация */}
      <div className="glass soft-card w-full rounded-3xl p-5">
        <ul className="space-y-2 text-sm text-[var(--ink)]/90">
          <li>🎁 {t.tipsNav}</li>
          <li>❄️ {t.tipsHorizon}</li>
          <li>🌟 {t.tipsLang}</li>
        </ul>
      </div>

      {/* 3) Кнопка «Зажечь свет…» — перенесена ниже */}
      <motion.button
        onClick={onStart}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className="rounded-2xl border border-yellow-300/50 bg-gradient-to-r from-red-500/80 to-green-600/80 px-5 py-3 text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
        aria-label={t.a11y.openCard}
      >
        {t.homeOpen}
      </motion.button>
    </div>
  );
}  // :contentReference[oaicite:4]{index=4}

// ─────────────────────────── Lighthouse ─────────────────────
function Lighthouse(
  { t, horizon, setHorizon }: { t: any; horizon: "dawn" | "day" | "sunset" | "night"; setHorizon: (h: "dawn" | "day" | "sunset" | "night") => void }
) {
  // ► аудио: создаём и храним один экземпляр
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(songUrl);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0.9;
    audioRef.current = a;
    return () => { a.pause(); audioRef.current = null; }; // автостоп при уходе со страницы
  }, []);

  const toggleAudio = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) { await a.play(); setPlaying(true); }
      else { a.pause(); setPlaying(false); }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass soft-card rounded-3xl p-5">
        <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.lighthouseTitle}</h2>
        <p className="text-[var(--ink)]/90">{t.lighthouseCopy}</p>
      </div>

      <div className="glass soft-card overflow-hidden rounded-3xl p-5">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          <LighthouseSVG horizon={horizon} />

          {/* маленькая нота в правом верхнем углу */}
          <button
            onClick={toggleAudio}
            className={`absolute right-2 top-2 rounded-xl border border-white/60 bg-white/80 p-2 text-[var(--ink)] shadow
                        hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/10`}
            aria-label={isPlaying ? t.a11y.pauseMelody : t.a11y.playMelody}
            title={isPlaying ? t.a11y.pauseMelody : t.a11y.playMelody}
          >
            {/* простая иконка-нота; можно заменить на твою */}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 5 V17 A3 3 0 1 1 7 14" />
              <path d="M15 5 V13 A3 3 0 1 1 13 10" />
            </svg>
          </button>

          {/* маленькая точка-индикатор состояния (опционально) */}
          <div className={`absolute right-2 top-2 -mr-1 -mt-1 h-2 w-2 rounded-full ${isPlaying ? "bg-green-500/80" : "bg-transparent"}`} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <HorizonChip label={t.horizonDawn} active={horizon === "dawn"} onClick={() => setHorizon("dawn")} />
          <HorizonChip label={t.horizonDay} active={horizon === "day"} onClick={() => setHorizon("day")} />
          <HorizonChip label={t.horizonSunset} active={horizon === "sunset"} onClick={() => setHorizon("sunset")} />
          <HorizonChip label={t.horizonNight} active={horizon === "night"} onClick={() => setHorizon("night")} />
        </div>

        <p className="mt-3 text-center text-sm text-[var(--ink)]/80">{t.horizonHint}</p>
      </div>
    </div>
  );
}  // :contentReference[oaicite:5]{index=5}


function HorizonChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-black/10 ${active ? "border-white/70 bg-white/85 text-[var(--ink)] shadow" : "border-white/40 bg-white/30 text-[var(--ink)]/90 hover:bg-white/50"
        }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

const LighthouseSVG = React.memo(function LighthouseSVG({ horizon }: { horizon: "dawn" | "day" | "sunset" | "night" }) {
  const isNight = horizon === "night";
  const isDay = horizon === "day";
  const isDawn = horizon === "dawn";
  const isSunset = horizon === "sunset";

  const BEAM_APEX_X = 161;           // точка-апекс внутри фонаря
  const BEAM_APEX_Y = 112;

  const BEAM_LEN = 175;             // насколько далеко уходят лучи
  const BEAM_SPAN = isNight ? 58 : 42; // ширина на дальнем конце
  const BEAM_OPA = isNight ? 0.62 : 0.36;
  const BEAM_COL = isNight ? "#fff3cf" : "#fff8e1";



  const stars = React.useMemo(
    () => Array.from({ length: 22 }).map(() => ({
      cx: 20 + Math.random() * 280,
      cy: 20 + Math.random() * 80,
      r: Math.random() * 1.2 + 0.4,
    })),
    []
  );

  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="Escena con faro junto al mar / Сцена с маяком у моря">
      <defs>
        <linearGradient id="seaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isNight ? "#94a3b8" : isSunset ? "#fbbf24" : isDawn ? "#c7d2fe" : "#a7e0ff"} stopOpacity={isNight ? 0.08 : 0.18} />
          <stop offset="100%" stopColor={isNight ? "#64748b" : isSunset ? "#fb7185" : isDawn ? "#93c5fd" : "#6ec3ff"} stopOpacity={isNight ? 0.25 : 0.38} />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="beamClip" clipPathUnits="userSpaceOnUse">
          <rect x="0" y="36" width="320" height="130" rx="10" />
        </clipPath>
        {/* Мягкие края луча */}
        <linearGradient id="beamFill" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={BEAM_COL} stopOpacity="0" />
          <stop offset="0.35" stopColor={BEAM_COL} stopOpacity={BEAM_OPA} />
          <stop offset="0.65" stopColor={BEAM_COL} stopOpacity={BEAM_OPA} />
          <stop offset="1" stopColor={BEAM_COL} stopOpacity="0" />
        </linearGradient>

        {/* Лёгкое свечение вокруг апекса, чтобы скрыть шов */}
        <filter id="beamSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Солнце/Луна */}
      {isDay && <circle cx="260" cy="40" r="12" fill="#fff59d" opacity="0.9" />}
      {isDawn && <circle cx="260" cy="44" r="10" fill="#ffe082" opacity="0.85" />}
      {isSunset && <circle cx="60" cy="36" r="11" fill="#ffd166" opacity="0.85" />}
      {isNight && <circle cx="55" cy="35" r="9" fill="#f8fafc" opacity="0.9" />}

      {/* Звёзды */}
      {isNight && (
        <g fill="#ffffff" opacity="0.85">
          {stars.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
          ))}
        </g>
      )}

      {/* Море */}
      <rect x="0" y="150" width="320" height="90" fill="url(#seaFill)" />
      <path
        className="wave-animation"
        d="M0 170 C 40 165, 80 175, 120 170 C 160 165, 200 175, 240 170 C 280 165, 320 175, 360 170 L 360 240 L 0 240 Z"
        fill={isNight ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.20)"}
        style={{ filter: "blur(0.3px)" }}
      />

      {/* Берег */}
      <path d="M0 182 C 60 165, 80 210, 140 198 C 200 190, 260 210, 320 190 L 320 240 L 0 240 Z" fill="#2b344a" opacity="0.28" />

      {/* Тень от маяка */}
      <ellipse cx="160" cy="212" rx="18" ry="5" fill={isNight ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.12)"} />


      {/* ЕДИНЫЙ двухсторонний луч: один path с двумя подпутями; апекс фиксирован */}
      {isNight && (
        <g clipPath="url(#beamClip)">
          <g transform={`translate(${BEAM_APEX_X}, ${BEAM_APEX_Y})`}>
            <g className="beam-animation" style={{ transformOrigin: "0px 0px" }}>
              <path
                d={`
            M 0 0 L ${BEAM_LEN} ${-BEAM_SPAN / 2} L ${BEAM_LEN} ${BEAM_SPAN / 2} Z
            M 0 0 L ${-BEAM_LEN} ${-BEAM_SPAN / 2} L ${-BEAM_LEN} ${BEAM_SPAN / 2} Z
          `}
                fill={BEAM_COL}
                opacity={BEAM_OPA}
                shapeRendering="geometricPrecision"
              />
            </g>
          </g>
        </g>
      )}




      {/* Маяк из предоставленного SVG (вписан, слегка смягчены цвета) */}
      <g filter="url(#softGlow)">
        <g
          transform="translate(160,210) scale(0.28) translate(-256,-472)"
          style={{ filter: isNight ? "saturate(0.85) brightness(0.95)" : "saturate(0.95) brightness(1.04)" }}
        >
          {/* Убраны: внешнее солнце и большие жёлтые треугольники — используем сцену сайта */}
          {/* Начало вставки путей из предоставленного SVG */}
          <path fill="#2FB49F" d="M304.266 91.162c0 26.657-21.609 28.266-48.266 28.266s-48.266-1.609-48.266-28.266S229.343 42.896 256 42.896s48.266 21.61 48.266 48.266z" />
          <path fill="#E3E3E3" d="M200.679 419.659h110.642l-1.708-31.087H202.387z" />
          <path fill="#A6A6A6" d="M309.967 395.015H202.033l-1.354 25h110.642z" />
          <path fill="#E3E3E3" d="M204.275 354.213h103.45l-1.753-31.904h-99.944zM207.916 287.95h96.168l-1.708-31.087h-92.752zM213.265 190.6l-1.753 31.905h88.976l-1.753-31.905z" />
          <path fill="#FF6650" d="M296.848 156.015h-81.696l-1.887 35h85.47zM209.624 257.015h92.752l-1.888-34h-88.976zM206.028 322.015h99.944l-1.888-34h-96.168zM202.387 389.015h107.226l-1.888-35h-103.45zM166.068 472.015h179.864l-3.888-64H169.956z" />
          <path fill="#CF5341" d="M214.163 174.239h83.674l-.899-16.362h-81.876z" />
          <path fill="#FFD161" d="M206.949 87.89h98.102v68.351h-98.102z" />
          <path fill="#FFF" d="M219.93 89.526h72.14v66.715h-72.14z" />
          <path fill="#FF6650" d="M311.393 166.058H200.607a8.181 8.181 0 0 1 0-16.362h110.786a8.181 8.181 0 0 1 0 16.362zM311.393 96.071H200.607a8.181 8.181 0 0 1 0-16.362h110.786a8.181 8.181 0 0 1 0 16.362z" />
          <path fill="#4A4A4A" d="M240.991 257.015v-8.634c0-8.191 6.64-14.832 14.832-14.832h.354c8.191 0 14.832 6.64 14.832 14.832v8.634M238.886 322.015v-9.845c0-9.34 7.572-16.912 16.912-16.912h.403c9.34 0 16.912 7.572 16.912 16.912v9.845M235.943 389.015v-11.539c0-10.946 8.874-19.82 19.82-19.82h.473c10.946 0 19.82 8.874 19.82 19.82v11.539M227 472.015v-16.684c0-15.827 12.831-28.658 28.658-28.658h.684c15.827 0 28.658 12.831 28.658 28.658v16.684" />
          <path fill="#E3E3E3" d="M267.592 44.896h-23.184a5.941 5.941 0 0 1 0-11.882h23.184a5.94 5.94 0 1 1 0 11.882z" />
          {/* Конец вставки путей */}
        </g>
      </g>

      {/* Облака - CSS animated */}
      <g opacity="0.7" fill="#ffffff">
        <ellipse className="cloud-animation cloud-1" cx="60" cy="60" rx="22" ry="10" />
        <ellipse className="cloud-animation cloud-2" cx="84" cy="60" rx="16" ry="8" />
        <ellipse className="cloud-animation cloud-3" cx="102" cy="55" rx="14" ry="7" />
        <ellipse className="cloud-animation cloud-4" cx="250" cy="42" rx="18" ry="9" />
        <ellipse className="cloud-animation cloud-5" cx="270" cy="44" rx="12" ry="7" />
      </g>
    </svg>
  );
});

// ─────────────────────────── Letter ─────────────────────────

function useHandwrittenFont() {
  React.useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Marck+Script&display=swap";
    if ([...document.styleSheets].some(s => (s.href || "").includes("fonts.googleapis.com"))) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, []);
}

type Phase = "done" | "active" | "pending";

function TypewriterParagraph({
  text,
  phase,
  speed = 65,
  onDone,
}: {
  text: string;
  phase: Phase;
  speed?: number;
  onDone?: () => void;
}) {
  const [len, setLen] = React.useState(phase === "done" ? text.length : 0);

  React.useEffect(() => {
    if (phase === "active") {
      setLen(0);
      let i = 0;
      const id = setInterval(() => {
        i++;
        if (i >= text.length) {
          setLen(text.length);
          clearInterval(id);
          onDone?.();
        } else {
          setLen(i);
        }
      }, speed);
      return () => clearInterval(id);
    }
    // В остальных фазах выставляем целиком/пусто без анимации
    setLen(phase === "done" ? text.length : 0);
  }, [phase, text, speed, onDone]);

  return <p className="mb-4 whitespace-pre-wrap">{text.slice(0, len)}</p>;
}

function Letter({ t }: { t: any }) {
  useHandwrittenFont();

  // Target: Midnight Argentina time (UTC-3) on December 31, 2025
  const targetDate = useMemo(() => {
    // Argentina is UTC-3, so midnight Argentina = 03:00 UTC on Jan 1
    return new Date(Date.UTC(2026, 0, 1, 3, 0, 0)); // January 1, 2026, 03:00 UTC = Midnight Argentina
  }, []);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsUnlocked(true);
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Берём новые блоки письма
  const blocks: string[] = t.letterBlocks ?? [t.letterP1, t.letterP2, t.letterP3];
  const [idx, setIdx] = React.useState(0);

  // Уважить reduce motion — сразу показать всё
  React.useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setIdx(blocks.length);
    }
  }, [blocks]);

  // Переключили язык/текст — начать заново
  React.useEffect(() => { setIdx(0); }, [blocks]);

  // Show countdown if not unlocked
  if (!isUnlocked && timeLeft) {
    return (
      <div className="space-y-4">
        <div className="glass soft-card festive-glow rounded-3xl p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-5xl mb-4 block">🔒</span>
            <h2 className="mb-4 text-xl font-semibold text-[var(--ink)]">{t.letterLockedTitle}</h2>
            <p className="text-[var(--ink)]/80 mb-6">{t.letterLockedCopy}</p>

            {/* Countdown display */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="glass rounded-xl p-3">
                <div className="text-3xl font-bold text-[var(--ink)]">{timeLeft.days}</div>
                <div className="text-xs text-[var(--ink)]/70">{t.countdownDays}</div>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="text-3xl font-bold text-[var(--ink)]">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-[var(--ink)]/70">{t.countdownHours}</div>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="text-3xl font-bold text-[var(--ink)]">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-[var(--ink)]/70">{t.countdownMinutes}</div>
              </div>
              <div className="glass rounded-xl p-3">
                <motion.div
                  key={timeLeft.seconds}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold text-[var(--ink)]"
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </motion.div>
                <div className="text-xs text-[var(--ink)]/70">{t.countdownSeconds}</div>
              </div>
            </div>

            <p className="text-sm text-[var(--ink)]/60 italic">{t.letterLockedHint}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass soft-card rounded-3xl p-5">
        <h2 className="mb-3 text-xl font-semibold text-[var(--ink)]">{t.letterTitle}</h2>

        <div
          className="text-[var(--ink)]/95 text-lg leading-7"
          style={{ fontFamily: "'Caveat','Marck Script','Segoe Print','Bradley Hand',cursive" }}
          aria-live="polite"
        >
          {blocks.map((text, i) => {
            const phase: Phase = i < idx ? "done" : i === idx ? "active" : "pending";
            return (
              <TypewriterParagraph
                key={`${i}-${text.length}`}
                text={text}
                phase={phase}
                onDone={() => setTimeout(() => setIdx(i + 1), 250)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}



// ─────────────────────────── Sky (Constellation) ───────────────────────
function Sky({ t }: { t: any }) {
  // Heart-shaped constellation points (normalized 0-100 coordinate system)
  const heartStars = useMemo(() => [
    { id: 0, x: 50, y: 85 },   // bottom point
    { id: 1, x: 35, y: 65 },   // left lower
    { id: 2, x: 20, y: 45 },   // left middle
    { id: 3, x: 15, y: 25 },   // left upper
    { id: 4, x: 25, y: 12 },   // left top curve
    { id: 5, x: 40, y: 15 },   // left inner top
    { id: 6, x: 50, y: 28 },   // center dip
    { id: 7, x: 60, y: 15 },   // right inner top
    { id: 8, x: 75, y: 12 },   // right top curve
    { id: 9, x: 85, y: 25 },   // right upper
    { id: 10, x: 80, y: 45 },  // right middle
    { id: 11, x: 65, y: 65 },  // right lower
  ], []);

  // Background decorative stars
  const bgStars = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 3,
    })), []
  );

  const [connectedCount, setConnectedCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const currentStarIndex = connectedCount;
  const isComplete = connectedCount >= heartStars.length;

  const handleStarClick = (starId: number) => {
    if (starId === currentStarIndex && !isComplete) {
      setConnectedCount(prev => {
        const next = prev + 1;
        if (next >= heartStars.length) {
          setTimeout(() => setShowMessage(true), 500);
        }
        return next;
      });
    }
  };

  const resetConstellation = () => {
    setConnectedCount(0);
    setShowMessage(false);
  };

  return (
    <div className="space-y-4">
      <div className="glass soft-card rounded-3xl p-5">
        <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.skyTitle}</h2>
        <p className="text-[var(--ink)]/90">{t.skyCopy}</p>
      </div>

      {/* Sky window with constellation */}
      <div className="glass soft-card rounded-3xl p-4 overflow-hidden">
        <div
          className="relative w-full aspect-square rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%)',
            boxShadow: 'inset 0 0 60px rgba(100, 100, 200, 0.15)'
          }}
        >
          {/* Background stars */}
          {bgStars.map(star => (
            <div
              key={`bg-${star.id}`}
              className="absolute rounded-full bg-white star-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: 0.3 + Math.random() * 0.4,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {heartStars.slice(0, connectedCount).map((star, i) => {
              if (i === 0) return null;
              const prevStar = heartStars[i - 1];
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={prevStar.x}
                  y1={prevStar.y}
                  x2={star.x}
                  y2={star.y}
                  stroke="rgba(255, 200, 100, 0.8)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
            {/* Close the heart when complete */}
            {isComplete && (
              <motion.line
                x1={heartStars[heartStars.length - 1].x}
                y1={heartStars[heartStars.length - 1].y}
                x2={heartStars[0].x}
                y2={heartStars[0].y}
                stroke="rgba(255, 200, 100, 0.8)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </svg>

          {/* Constellation stars */}
          {heartStars.map((star, index) => {
            const isConnected = index < connectedCount;
            const isNext = index === currentStarIndex;
            const isClickable = isNext && !isComplete;

            return (
              <motion.button
                key={`star-${star.id}`}
                onClick={() => handleStarClick(star.id)}
                disabled={!isClickable}
                className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: isNext ? 16 : isConnected ? 10 : 6,
                  height: isNext ? 16 : isConnected ? 10 : 6,
                  backgroundColor: isConnected ? '#ffd700' : isNext ? '#fff' : 'rgba(255,255,255,0.4)',
                  boxShadow: isNext
                    ? '0 0 20px 8px rgba(255, 215, 0, 0.6), 0 0 40px 15px rgba(255, 215, 0, 0.3)'
                    : isConnected
                      ? '0 0 10px 3px rgba(255, 215, 0, 0.5)'
                      : 'none',
                }}
                animate={isNext ? {
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 20px 8px rgba(255, 215, 0, 0.6)',
                    '0 0 30px 12px rgba(255, 215, 0, 0.8)',
                    '0 0 20px 8px rgba(255, 215, 0, 0.6)',
                  ]
                } : {}}
                transition={isNext ? { duration: 1.5, repeat: Infinity } : {}}
                aria-label={`${t.a11y?.connectStar || 'Star'} ${index + 1}`}
              />
            );
          })}

          {/* Completion message overlay */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <div className="text-center px-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-4xl">💫</span>
                  </motion.div>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-lg font-medium text-white/95 leading-relaxed"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                  >
                    {t.skyComplete}
                  </motion.p>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={resetConstellation}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
                  >
                    {t.skyReset}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress hint */}
        {!isComplete && (
          <p className="mt-3 text-center text-sm text-[var(--ink)]/70">
            {t.skyHint} ({connectedCount}/{heartStars.length})
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── Thanks ────────────────────────
function Thanks({ t, onRelight }: { t: any; onRelight: () => void }) {
  return (
    <div className="glass soft-card overflow-hidden rounded-3xl p-6 text-center">
      <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.thanksTitle}</h2>
      <p className="mx-auto max-w-sm text-[var(--ink)]/90">{t.thanksCopy}</p>

      <img src={thanksSketch} alt="Рисунок"
        className="mx-auto mt-4 max-h-64 w-auto rounded-2xl border border-white/50 shadow object-contain"
        loading="lazy" decoding="async" />

      <button
        onClick={onRelight}
        className="mt-4 rounded-xl border border-white/50 bg-white/70 px-4 py-2 text-sm text-[var(--ink)] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/10">
        {t.shareBtn}
      </button>
    </div>
  );
}

// ─────────────────────────── BottomNav ─────────────────────
function BottomNav(
  { t, page, onNavigate }: { t: any; page: string; onNavigate: (k: string) => void }
) {
  const items = [
    { key: "home", label: t.navHome, icon: <HomeIcon className="h-5 w-5" strokeWidth={1.5} /> },
    { key: "lighthouse", label: t.navLighthouse, icon: <Signal className="h-5 w-5" strokeWidth={1.5} /> },
    { key: "letter", label: t.navLetter, icon: <Mail className="h-5 w-5" strokeWidth={1.5} /> },
    { key: "sky", label: t.navSky, icon: <Stars className="h-5 w-5" strokeWidth={1.5} /> },
    { key: "thanks", label: t.navThanks, icon: <Gift className="h-5 w-5" strokeWidth={1.5} /> },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10">
      <div className="mx-auto max-w-md px-4" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom,0))" }}>
        <div className="glass soft-card grid grid-cols-5 gap-1 rounded-2xl p-2">
          {items.map(it => (
            <button
              key={it.key}
              onClick={() => onNavigate(it.key)}
              className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 ${page === it.key ? "bg-white/85 text-[var(--ink)] shadow" : "text-[var(--ink)]/80 hover:bg-white/50"
                }`}
              aria-current={page === it.key ? "page" : undefined}
              aria-label={it.label}
            >
              {it.icon}
              <span className="mt-1 leading-none">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

const translations = {
  es: {
    topbarTitle: "Feliz Año Nuevo, Camila",
    homeIntro: "Para la Guardiana del Faro y la Cartógrafa de nuestros mundos — ¡Que el Año Nuevo traiga más luz a nuestra cabaña!",
    homeOpen: "Encender las luces del Año Nuevo",
    tipsNav: "Es el mapa de nuestra casa mágica de invierno... Un lugar donde los copos de nieve guardan nuestros secretos",
    tipsHorizon: "En la página 'Faro' puedes ver la noche de Año Nuevo o un día nevado",
    tipsLang: "El botón ES/RU arriba cambia el idioma del sitio.",
    lighthouseTitle: "Nuestro Faro de Año Nuevo",
    lighthouseCopy: "En esta noche mágica, nuestro faro brilla más que nunca. Cada copo de nieve lleva un deseo para ti, mi Guardiana.",
    playMelody: "Reproducir melodía",
    pauseMelody: "Pausa de la melodía",
    horizonDawn: "❄️ Amanecer",
    horizonDay: "☃️ Día",
    horizonSunset: "🌅 Atardecer",
    horizonNight: "🌙 Noche",
    horizonHint: "Cambia el cielo de Año Nuevo",
    letterTitle: "🎁 Carta de Año Nuevo",
    letterBlocks: [
      "Camila, mi Guardiana. En esta noche mágica de Año Nuevo, quiero agradecerte por todo el calor que trajiste a mi vida este año.",
      "Nuestro Faro brilló incluso en las noches más oscuras, porque tú estabas ahí para encender la luz. Cada momento contigo fue un regalo.",
      "Que el Año Nuevo nos traiga más aventuras, más risas, más música, y que nuestra cabaña junto al lago se llene de aún más calidez.",
      "¡Feliz Año Nuevo, mi amor!\n— Tu Guardián, Ilya"
    ],
    // Countdown translations
    letterLockedTitle: "🔐 El sobre está sellado",
    letterLockedCopy: "Esta carta se abrirá exactamente a la medianoche de Año Nuevo...",
    letterLockedHint: "🌟 Hora de Buenos Aires (Argentina)",
    countdownDays: "días",
    countdownHours: "horas",
    countdownMinutes: "min",
    countdownSeconds: "seg",
    thanksTitle: "Feliz Año Nuevo",
    thanksCopy: "Gracias por este año increíble. Por cada sonrisa, cada abrazo, cada momento de luz en la oscuridad. Que el próximo año nos traiga aún más magia. ¡Te quiero!",
    shareBtn: "Encender los fuegos artificiales",
    shareTitle: "Tarjeta de Año Nuevo para Camila",
    shareText: "Una pequeña tarjeta de Año Nuevo para Camila — con nieve, magia y amor.",
    shareCopied: "El texto ha sido copiado al portapapeles.",
    // Sky (constellation) page
    skyTitle: "⭐ Cielo",
    skyCopy: "Conecta las estrellas para encontrar algo especial...",
    skyHint: "Toca la estrella brillante",
    skyComplete: "Conectamos los puntos en el caos y nos encontramos el uno al otro ❤️",
    skyReset: "Dibujar de nuevo ✨",
    navHome: "Inicio",
    navLighthouse: "Faro",
    navLetter: "Carta",
    navSky: "Cielo",
    navThanks: "Gracias",
    a11y: {
      switchToRU: "Cambiar idioma a ruso",
      switchToES: "Cambiar idioma a español",
      openCard: "Abrir la tarjeta de Año Nuevo",
      playMelody: "Reproducir melodía",
      pauseMelody: "Pausar melodía",
      connectStar: "Estrella",
    },
  },
  ru: {
    topbarTitle: "🎄 С Новым Годом, Камила 🎄",
    homeIntro: "✨ Для Хранительницы Маяка и Картографа наших миров — Пусть Новый Год принесёт ещё больше света в нашу избушку! ✨",
    homeOpen: "Зажечь огни Нового Года 🎄✨",
    tipsNav: "Это карта нашего волшебного зимнего дома... Места, где снежинки хранят наши секреты",
    tipsHorizon: "На странице 'Маяк' можно увидеть новогоднюю ночь или снежный день",
    tipsLang: "Кнопка ES/RU вверху переключает язык сайта.",
    lighthouseTitle: "🏠 Наш Новогодний Маяк",
    lighthouseCopy: "В эту волшебную ночь наш маяк светит ярче, чем когда-либо. Каждая снежинка несёт пожелание для тебя, моя Хранительница.",
    playMelody: "Воспроизвести мелодию",
    pauseMelody: "Пауза мелодии",
    horizonDawn: "❄️ Рассвет",
    horizonDay: "☃️ День",
    horizonSunset: "🌅 Закат",
    horizonNight: "🌙 Ночь",
    horizonHint: "Меняй новогоднее небо",
    letterTitle: "🎁 Новогоднее письмо",
    letterBlocks: [
      "Камила, моя Хранительница. В эту волшебную новогоднюю ночь я хочу поблагодарить тебя за всё тепло, которое ты принесла в мою жизнь в этом году.",
      "Наш Маяк светил даже в самые тёмные ночи, потому что ты была рядом, чтобы зажечь свет. Каждое мгновение с тобой было подарком.",
      "Пусть Новый Год принесёт нам ещё больше приключений, смеха, музыки, и пусть наша избушка у озера наполнится ещё большим теплом.",
      "С Новым Годом, любовь моя!\n— Твой Хранитель, Илья"
    ],
    // Countdown translations
    letterLockedTitle: "Конверт запечатан",
    letterLockedCopy: "Это письмо откроется ровно в полночь на Новый Год...",
    letterLockedHint: "По времени Буэнос-Айреса (Аргентина)",
    countdownDays: "дней",
    countdownHours: "часов",
    countdownMinutes: "мин",
    countdownSeconds: "сек",
    thanksTitle: "С Новым Годом 🎆",
    thanksCopy: "Спасибо за этот невероятный год. За каждую улыбку, каждое объятие, каждый момент света во тьме. Пусть следующий год принесёт нам ещё больше волшебства. Люблю тебя!",
    shareBtn: "Запустить фейерверк",
    shareTitle: "Новогодняя открытка для Камилы",
    shareText: "Небольшая новогодняя открытка для Камилы — со снегом, магией и любовью.",
    shareCopied: "Текст скопирован в буфер обмена.",
    // Sky (constellation) page
    skyTitle: "⭐ Небо",
    skyCopy: "Соедини звёзды, чтобы найти кое-что особенное...",
    skyHint: "Нажми на яркую звезду",
    skyComplete: "Мы соединили точки в хаосе и нашли друг друга ❤️",
    skyReset: "Нарисовать снова ✨",
    navHome: "Главная",
    navLighthouse: "Маяк",
    navLetter: "Письмо",
    navSky: "Небо",
    navThanks: "Спасибо",
    a11y: {
      switchToRU: "Переключить язык на русский",
      switchToES: "Переключить язык на испанский",
      openCard: "Открыть новогоднюю открытку",
      playMelody: "Воспроизвести мелодию",
      pauseMelody: "Приостановить мелодию",
      connectStar: "Звезда",
    },
  },
};
