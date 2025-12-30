import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Styles
import './styles/animations.css';

// Translations
import { translations, type Lang } from './translations/translations';

// Effects
import Snowflakes from './components/effects/Snowflakes';

// Layout
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';

// Pages
import Home from './components/pages/Home';
import Lighthouse, { type Horizon } from './components/pages/Lighthouse';
import Letter from './components/pages/Letter';
import Sky from './components/pages/Sky';
import Thanks from './components/pages/Thanks';

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-4"
    >
      {children}
    </motion.section>
  );
}

export default function CamilaPostcardV5() {
  const [lang, setLang] = useState<Lang>((localStorage.getItem('lang') as Lang) ?? 'ru');
  const [horizon, setHorizon] = useState<Horizon>("night");
  const [page, setPage] = useState("home");

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

  return (
    <div className="min-h-dvh w-full flex flex-col items-center relative" style={{ background: bg }}>
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
    </div>
  );
}
