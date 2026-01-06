import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

// Analytics
import { useVisitorTracking } from './hooks/useVisitorTracking';

// Styles
import './styles/animations.css';

// Translations
import { translations, type Lang } from './translations/translations';

// Effects
import Snowflakes from './components/effects/Snowflakes';

// Layout
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';

// Pages (lazy loaded for better performance)
const Home = lazy(() => import('./components/pages/Home'));
const Lighthouse = lazy(() => import('./components/pages/Lighthouse'));
const Letter = lazy(() => import('./components/pages/Letter'));
const Sky = lazy(() => import('./components/pages/Sky'));
const Thanks = lazy(() => import('./components/pages/Thanks'));

export type Horizon = "dawn" | "day" | "sunset" | "night";

const PAGES = ["home", "lighthouse", "letter", "sky", "thanks"] as const;
type Page = typeof PAGES[number];

const SWIPE_THRESHOLD = 50;

interface PageWrapProps {
  children: React.ReactNode;
  direction: number; // -1 = came from left, 1 = came from right
  onSwipe: (dir: 'left' | 'right') => void;
}

function PageWrap({ children, direction, onSwipe }: PageWrapProps) {
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: direction * 50, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -direction * 50, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-4"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </motion.section>
  );
}

export default function CamilaPostcardV5() {
  // Visitor analytics - runs once per session
  useVisitorTracking();

  const [lang, setLang] = useState<Lang>((localStorage.getItem('lang') as Lang) ?? 'ru');
  const [horizon, setHorizon] = useState<Horizon>("night");
  const [page, setPage] = useState<Page>("home");
  const directionRef = useRef(1);

  const t = useMemo(() => translations[lang], [lang]);

  const palettes = {
    dawn: ["#e8d5e7", "#c5cae9"],
    day: ["#cce5ff", "#e3f2fd"],
    sunset: ["#ffcccb", "#ffd1dc"],
    night: ["#1a1a2e", "#16213e"],
  };

  const bg = useMemo(() => `linear-gradient(to top, ${palettes[horizon][0]}, ${palettes[horizon][1]})`, [horizon]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--glass", horizon === "night" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.75)");
    root.style.setProperty("--ink", horizon === "night" ? "#f0f0f0" : "#0b1020");
  }, [horizon]);

  const navigateTo = (newPage: Page) => {
    const currentIdx = PAGES.indexOf(page);
    const newIdx = PAGES.indexOf(newPage);
    directionRef.current = newIdx > currentIdx ? 1 : -1;
    setPage(newPage);
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    const currentIdx = PAGES.indexOf(page);
    if (dir === 'left' && currentIdx < PAGES.length - 1) {
      navigateTo(PAGES[currentIdx + 1]);
    } else if (dir === 'right' && currentIdx > 0) {
      navigateTo(PAGES[currentIdx - 1]);
    }
  };

  const renderPage = () => {
    const props = { direction: directionRef.current, onSwipe: handleSwipe };

    switch (page) {
      case "home":
        return (
          <PageWrap key="home" {...props}>
            <Home t={t} onStart={() => navigateTo("lighthouse")} />
          </PageWrap>
        );
      case "lighthouse":
        return (
          <PageWrap key="lighthouse" {...props}>
            <Lighthouse t={t} horizon={horizon} setHorizon={setHorizon} />
          </PageWrap>
        );
      case "letter":
        return (
          <PageWrap key="letter" {...props}>
            <Letter t={t} />
          </PageWrap>
        );
      case "sky":
        return (
          <PageWrap key="sky" {...props}>
            <Sky t={t} />
          </PageWrap>
        );
      case "thanks":
        return (
          <PageWrap key="thanks" {...props}>
            <Thanks t={t} onRelight={() => navigateTo("lighthouse")} />
          </PageWrap>
        );
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center relative overflow-x-hidden" style={{ background: bg }}>
      <Snowflakes />

      <TopBar
        title={t.topbarTitle}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === "es" ? "ru" : "es"))}
        ariaLabel={lang === "es" ? t.a11y.switchToRU : t.a11y.switchToES}
      />

      <main className="relative z-[2] w-full max-w-md flex-1 px-4 pt-20 pb-[calc(90px+env(safe-area-inset-bottom,0))]">
        <Suspense fallback={
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse text-[var(--ink)]/60">✨</div>
          </div>
        }>
          <AnimatePresence mode="wait" initial={false}>
            {renderPage()}
          </AnimatePresence>
        </Suspense>
      </main>

      <BottomNav t={t} page={page} onNavigate={(p) => navigateTo(p as Page)} />
    </div>
  );
}

