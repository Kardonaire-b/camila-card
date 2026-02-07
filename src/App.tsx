/**
 * Main Application Component
 * Multi-page greeting card with swipe navigation and dynamic theming
 */

import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';

// Analytics
import { useVisitorTracking } from './hooks/useVisitorTracking';

// Styles
import './styles/animations.css';

// Translations
import { translations, type Lang } from './translations/translations';

// Config
import { PALETTES, type Horizon } from './config';

// Effects
import Petals from './components/effects/Petals';

// Layout
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import PageWrap from './components/layout/PageWrap';

// Pages (lazy loaded for better performance)
const Home = lazy(() => import('./components/pages/Home'));
const Lighthouse = lazy(() => import('./components/pages/Lighthouse'));
const Letter = lazy(() => import('./components/pages/Letter'));
const History = lazy(() => import('./components/pages/History'));
const Schedule = lazy(() => import('./components/pages/Schedule'));
const Thanks = lazy(() => import('./components/pages/Thanks'));

const PAGES = ["home", "lighthouse", "letter", "history", "schedule", "thanks"] as const;
type Page = typeof PAGES[number];

export default function CamilaPostcardV5() {
  // Visitor analytics - runs once per session
  useVisitorTracking();

  const [lang, setLang] = useState<Lang>((localStorage.getItem('lang') as Lang) ?? 'ru');
  const [horizon, setHorizon] = useState<Horizon>("night");
  const [page, setPage] = useState<Page>("home");
  const directionRef = useRef(1);

  const t = useMemo(() => translations[lang], [lang]);

  const bg = useMemo(() => `linear-gradient(to top, ${PALETTES[horizon][0]}, ${PALETTES[horizon][1]})`, [horizon]);

  // Sync language to localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Update CSS variables based on horizon
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--glass", horizon === "night" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.75)");
    root.style.setProperty("--nav-glass", horizon === "night" ? "rgba(30,40,80,0.85)" : "rgba(255,255,255,0.85)");
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
      case "history":
        return (
          <PageWrap key="history" {...props}>
            <History t={t} lang={lang} />
          </PageWrap>
        );
      case "schedule":
        return (
          <PageWrap key="schedule" {...props}>
            <Schedule t={t} />
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
    <>
      <TopBar
        title={t.topbarTitle}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === "es" ? "ru" : "es"))}
        ariaLabel={lang === "es" ? t.a11y.switchToRU : t.a11y.switchToES}
      />

      <div className="min-h-dvh w-full flex flex-col items-center relative overflow-x-hidden" style={{ background: bg }}>
        {/* Skip to content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg"
        >
          Skip to content
        </a>

        <Petals />

        <main id="main-content" className="relative z-[2] w-full max-w-md flex-1 px-4 pt-20 pb-[calc(90px+env(safe-area-inset-bottom,0))]">
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
      </div>

      <BottomNav t={t} page={page} onNavigate={(p) => navigateTo(p as Page)} />
    </>
  );
}

