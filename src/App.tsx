import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import thanksSketch from "./assets/quartz.png";

import stonesImg from "./assets/gallery/stones.png";
import snailImg from "./assets/gallery/snail.png";
import musicImg from "./assets/gallery/music.png";
import cabinImg from "./assets/gallery/lighthouse.png";

import songUrl from "./assets/audio/melody.mp3";

type Horizon = "dawn" | "day" | "sunset" | "night";

export default function CamilaPostcardV5() {
  const [lang, setLang] = useState("es");
  const [horizon, setHorizon] = useState<Horizon>("day");; // dawn | day | sunset | night
  const [page, setPage] = useState("home"); // home | lighthouse | letter | gallery | thanks

  const t = useMemo(() => translations[lang], [lang]);

  const palettes = {
    dawn: ["#fde2f3", "#dbeafe"],
    day: ["#b3e5fc", "#e0f7fa"],
    sunset: ["#fde68a", "#fca5a5"],
    night: ["#0f172a", "#1e293b"],
  };
  
  const bg = useMemo(() => `linear-gradient(to top, ${palettes[horizon][0]}, ${palettes[horizon][1]})`, [horizon]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--glass", "rgba(255,255,255,0.75)");
    root.style.setProperty("--ink", "#0b1020");
  }, []);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center" style={{ background: bg }}>
      <TopBar
        title={t.topbarTitle}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === "es" ? "ru" : "es"))}
        ariaLabel={lang === "es" ? t.a11y.switchToRU : t.a11y.switchToES}
      />

      <main className="relative z-0 w-full max-w-md flex-1 px-4 pt-20 pb-[calc(90px+env(safe-area-inset-bottom,0))]">
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
          {page === "gallery" && (
            <PageWrap key="gallery">
              <Gallery t={t} />
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
        .glass { background: var(--glass); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .soft-card { box-shadow: 0 10px 30px rgba(8,12,30,0.15); border: 1px solid rgba(255,255,255,0.45); }
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
        <div className="glass soft-card flex items-center justify-between rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <SparkleIcon className="h-5 w-5" />
            <h1 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{title}</h1>
          </div>
          <button
            onClick={onToggleLang}
            className="rounded-xl border border-white/50 px-3 py-1 text-sm text-[var(--ink)] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-black/10"
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
        className="glass soft-card w-full rounded-3xl p-5 text-center"
      >
        <p className="text-base leading-relaxed text-[var(--ink)]">
          {t.homeIntro}
        </p>
      </motion.div>

      {/* 2) Инструкции/навигация */}
      <div className="glass soft-card w-full rounded-3xl p-5">
        <ul className="space-y-2 text-sm text-[var(--ink)]/90">
          <li>• {t.tipsNav}</li>
          <li>• {t.tipsHorizon}</li>
          <li>• {t.tipsLang}</li>
        </ul>
      </div>

      {/* 3) Кнопка «Зажечь свет…» — перенесена ниже */}
      <motion.button
        onClick={onStart}
        whileTap={{ scale: 0.97 }}
        className="rounded-2xl border border-white/50 bg-white/60 px-5 py-3 text-[var(--ink)] shadow focus:outline-none focus:ring-2 focus:ring-black/10"
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

        <div className="mt-4 flex items-center justify-center gap-2">
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

function LighthouseSVG({ horizon }: { horizon: "dawn" | "day" | "sunset" | "night" }) {
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
      <motion.path
        d="M0 170 C 40 165, 80 175, 120 170 C 160 165, 200 175, 240 170 C 280 165, 320 175, 360 170 L 360 240 L 0 240 Z"
        fill={isNight ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.20)"}
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
            <motion.g
              initial={{ rotate: -6 }}
              animate={{ rotate: 6 }}
              transition={{ duration: 4.0, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              style={{ transformOrigin: "0px 0px" }}
            >
              <path
                d={`
            M 0 0 L ${BEAM_LEN} ${-BEAM_SPAN / 2} L ${BEAM_LEN} ${BEAM_SPAN / 2} Z
            M 0 0 L ${-BEAM_LEN} ${-BEAM_SPAN / 2} L ${-BEAM_LEN} ${BEAM_SPAN / 2} Z
          `}
                fill={BEAM_COL}
                opacity={BEAM_OPA}
                shapeRendering="geometricPrecision"
              />
            </motion.g>
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

      {/* Облака */}
      <g opacity="0.7" fill="#ffffff">
        <motion.ellipse cx="60" cy="60" rx="22" ry="10" animate={{ y: [0, 1.5, 0] }} transition={{ duration: 5.5, repeat: Infinity }} />
        <motion.ellipse cx="84" cy="60" rx="16" ry="8" animate={{ y: [0, 1.2, 0] }} transition={{ duration: 4.8, repeat: Infinity }} />
        <motion.ellipse cx="102" cy="55" rx="14" ry="7" animate={{ y: [0, 1.8, 0] }} transition={{ duration: 6.2, repeat: Infinity }} />
        <motion.ellipse cx="250" cy="42" rx="18" ry="9" animate={{ y: [0, 1.1, 0] }} transition={{ duration: 5.2, repeat: Infinity }} />
        <motion.ellipse cx="270" cy="44" rx="12" ry="7" animate={{ y: [0, 1.4, 0] }} transition={{ duration: 5.6, repeat: Infinity }} />
      </g>
    </svg>
  );
}

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

  // Берём новые блоки письма, если уже завели; иначе fallback на старые p1..p3
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



// ─────────────────────────── Gallery ───────────────────────
function Gallery({ t }: { t: any }) {
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    if (!tip) return;
    const id = setTimeout(() => setTip(null), 2600);
    return () => clearTimeout(id);
  }, [tip]);

  const cards = [
    { key: "stones", title: t.iconStones, src: stonesImg, caption: t.stones },
    { key: "snail", title: t.iconSnail, src: snailImg, caption: t.snail },
    { key: "music", title: t.iconMusic, src: musicImg, caption: t.music },
    { key: "cabin", title: t.iconCabin, src: cabinImg, caption: t.cabin },
  ];

  return (
    <div className="space-y-4">
      <div className="glass soft-card rounded-3xl p-5">
        <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.galleryTitle}</h2>
        <p className="text-[var(--ink)]/90">{t.galleryCopy}</p>
      </div>

      {/* 2×2 карточки, крупнее и аккуратнее */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map(c => (
          <ImageCard
            key={c.key}
            title={c.title}
            src={c.src}
            onClick={() => setTip(c.caption)}
          />
        ))}
      </div>

      <CaptionBar text={tip} />
    </div>
  );
}


function ImageCard({ title, src, onClick }: { title: string; src: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/60 ring-1 ring-white/50 shadow"
      aria-label={title}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <img
        src={src}
        alt={title}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 45vw, 320px"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* мягкий градиент снизу для читаемости */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

      {/* компактная плашка-бейдж с названием */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
        <span className="inline-block rounded-xl bg-white/80 px-2 py-1 text-[12px] font-medium text-[var(--ink)] shadow-sm backdrop-blur">
          {title}
        </span>
      </div>
    </motion.button>
  );
}


function CaptionBar({ text }: { text: string | null }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 z-10"
          style={{ bottom: "calc(86px + env(safe-area-inset-bottom,0))" }}
          aria-live="polite"
          role="status"
        >
          <div className="mx-auto max-w-md px-4">
            <div className="glass soft-card rounded-2xl px-4 py-3 text-center text-[var(--ink)] shadow">
              {text}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
    { key: "home", label: t.navHome, icon: <HomeIcon className="h-5 w-5" /> },
    { key: "lighthouse", label: t.navLighthouse, icon: <LightIcon className="h-5 w-5" /> },
    { key: "letter", label: t.navLetter, icon: <LetterIcon className="h-5 w-5" /> },
    { key: "gallery", label: t.navGallery, icon: <GalleryIcon className="h-5 w-5" /> },
    { key: "thanks", label: t.navThanks, icon: <HeartIcon className="h-5 w-5" /> },
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

// ─────────────────────────── Icons ─────────────────────────
function HomeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 11 L12 4 L21 11" />
      <path d="M5 10 V20 H19 V10" />
    </svg>
  );
}
function LightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3 L15 6 L12 9 L9 6 Z" />
      <path d="M12 9 V21" />
      <path d="M8 21 H16" />
    </svg>
  );
}
function LetterIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  );
}
function GalleryIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="7" height="7" rx="1.5" />
      <rect x="14" y="4" width="7" height="7" rx="1.5" />
      <rect x="3" y="15" width="7" height="7" rx="1.5" />
      <rect x="14" y="15" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function HeartIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 21 C 6 16, 3 13, 3 9 A4 4 0 0 1 7 5 C 9 5 10.5 6 12 8 C 13.5 6 15 5 17 5 A4 4 0 0 1 21 9 C 21 13 18 16 12 21 Z" />
    </svg>
  );
}
function SparkleIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2 L14 8 L20 10 L14 12 L12 18 L10 12 L4 10 L10 8 Z" />
    </svg>
  );
}

// ─────────────────────────── Translations ──────────────────
const translations = {
  es: {
    topbarTitle: "Para Camila",
    homeIntro: "Para la Guardiana del Faro y la Cartógrafa de nuestros mundos",
    homeOpen: "Encender la luz en el Faro 🕯️",
    tipsNav: "Es el mapa de nuestra casa... Un lugar construido de susurro, música y silencio. Viaja por él cuando quieras. La luz aquí arde siempre",
    tipsHorizon: "En la página ‘Faro’ se puede cambiar el horizonte: Amanecer/Día/Atardecer/Noche.",
    tipsLang: "El botón ES/RU arriba cambia el idioma del sitio.",
    lighthouseTitle: "Faro",
    lighthouseCopy: "Nuestra luz — es casa y silencio, donde se puede ser uno mismo. Tú ves mi historia en líneas torcidas; mis ojos ven tu paleta en el cielo.",
    playMelody: "Reproducir melodía",
    pauseMelody: "Pausa de la melodía",
    horizonDawn: "Amanecer",
    horizonDay: "Día",
    horizonSunset: "Atardecer",
    horizonNight: "Noche",
    horizonHint: "El color del horizonte se puede cambiar",
    letterTitle: "Carta",
    letterBlocks: [
      "Camila. Gracias por la luz y por ver una historia en mis líneas torcidas — eso es magia. Yo levanté contornos grises; tu color dio vida a nuestro mundo, y confío plenamente en tu visión.",
      "Nuestro Faro es un hogar. Un lugar donde la Guardiana enciende la luz, el Narrador escribe, el Observador sonríe, y el Guerrero, por fin, baja las armas.",
      "Nuestra \"cabaña junto al lago\" sigue en pie. Y cada día se vuelve más cálida. Gracias por estar aquí.",
      "— Tu Guardián, Ilya"
    ],
    galleryTitle: "Galería",
    stones: "Los dos encontramos belleza donde otros ven solo algo cotidiano",
    snail: "La encarnación del «búnker» que se convirtió en «hogar»",
    music: "La melodía que nos encontró a los dos",
    cabin: "Nuestra casa — allí donde siempre hay calor",
    galleryCopy: "Pequeños símbolos de nuestro mundo: piedras-talismán, caracoles-meditadores, tu música y mis líneas que se convierten en historias.",
    iconStones: "Piedras",
    iconSnail: "Caracol",
    iconLibrary: "Biblioteca",
    iconObserver: "Observador",
    iconMusic: "Música",
    iconCabin: "Cabaña",
    thanksTitle: "Gracias",
    thanksCopy: "Gracias por que tú — eres tú. Por tu valentía, tu profundidad, tu música. Por convertir mi «búnker» en «hogar». Este pequeño mundo — es mi manera de decirte «gracias» por todo",
    shareBtn: "Encender nuestra luz una vez más ✨",
    shareTitle: "Tarjeta para Camila",
    shareText: "Una pequeña tarjeta para Camila — con faro y calor.",
    shareCopied: "El texto ha sido copiado al portapapeles.",
    navHome: "Inicio",
    navLighthouse: "Faro",
    navLetter: "Carta",
    navGallery: "Galería",
    navThanks: "Gracias",
    a11y: {
      switchToRU: "Cambiar idioma a ruso",
      switchToES: "Cambiar idioma a español",
      openCard: "Abrir la tarjeta",
    },
  },
  ru: {
    topbarTitle: "Камиле",
    homeIntro: "Для Хранительницы Маяка и Картографа наших миров",
    homeOpen: "Зажечь свет в Маяке 🕯️",
    tipsNav: "Это карта нашего дома... Места, построенного из шёпота, музыки и тишины. Путешествуй по нему, когда захочешь. Свет здесь горит всегда",
    tipsHorizon: "На странице ‘Маяк’ можно менять горизонт: Рассвет/День/Закат/Ночь.",
    tipsLang: "Кнопка ES/RU вверху переключает язык сайта.",
    lighthouseTitle: "Маяк",
    lighthouseCopy: "Наш свет — это дом и тишина, где можно быть собой. Ты видишь мою историю в кривых линиях; мои глаза видят твою палитру в небе.",
    playMelody: "Воспроизвести мелодию",
    pauseMelody: "Пауза мелодии",
    horizonDawn: "Рассвет",
    horizonDay: "День",
    horizonSunset: "Закат",
    horizonNight: "Ночь",
    horizonHint: "Цвет горизонта можно менять",
    letterTitle: "Письмо",
    letterBlocks: [
      "Камила. Спасибо за свет и за то, как ты увидела историю в моих кривых линиях — это волшебство. Я построил серые контуры; твой цвет оживил наш мир, и я полностью доверяю твоему видению.",
      "Наш Маяк — это дом. Место, где Хранительница зажигает свет, Рассказчик пишет, Наблюдатель улыбается, а Воин, наконец, опускает оружие.",
      "Наша «избушка у озера» всё так же стоит. И с каждым днём в ней становится теплее. Спасибо, что ты здесь.",
      "— Твой Хранитель, Илья"
    ],
    galleryTitle: "Галерея",
    stones: "Мы оба находим красоту там, где другие видят лишь что-то обыденное",
    snail: "Воплощение «бункера», который стал «домом»",
    music: "Мелодия, которая нашла нас обоих",
    cabin: "Наш дом - там, где всегда тепло",
    galleryCopy: "Маленькие символы нашего мира: камни‑талисманы, улитки‑медитаторы, твоя музыка и мои линии, что превращаются в истории.",
    iconStones: "Камни",
    iconSnail: "Улитка",
    iconLibrary: "Библиотека",
    iconObserver: "Наблюдатель",
    iconMusic: "Музыка",
    iconCabin: "Избушка",
    thanksTitle: "Спасибо",
    thanksCopy: "Спасибо за то, что ты — это ты. За твою смелость, твою глубину, твою музыку. За то, что превратила мой 'бункер' в 'дом'. Этот маленький мир — мой способ сказать тебе 'спасибо' за всё",
    shareBtn: "Зажечь наш свет ещё раз ✨",
    shareTitle: "Открытка для Камилы",
    shareText: "Небольшая открытка для Камилы — с маяком и теплом.",
    shareCopied: "Текст скопирован в буфер обмена.",
    navHome: "Главная",
    navLighthouse: "Маяк",
    navLetter: "Письмо",
    navGallery: "Галерея",
    navThanks: "Спасибо",
    a11y: {
      switchToRU: "Переключить язык на русский",
      switchToES: "Переключить язык на испанский",
      openCard: "Открыть открытку",
    },
  },
};
