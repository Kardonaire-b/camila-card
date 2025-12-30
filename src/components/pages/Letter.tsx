import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Confetti from '../effects/Confetti';

interface LetterProps {
    t: Translations;
}

function useHandwrittenFont() {
    useEffect(() => {
        const href = "https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Marck+Script&display=swap";
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
    const [len, setLen] = useState(phase === "done" ? text.length : 0);

    useEffect(() => {
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
        setLen(phase === "done" ? text.length : 0);
    }, [phase, text, speed, onDone]);

    return <p className="mb-4 whitespace-pre-wrap">{text.slice(0, len)}</p>;
}

export default function Letter({ t }: LetterProps) {
    useHandwrittenFont();

    const targetDate = useMemo(() => {
        return new Date(Date.UTC(2026, 0, 1, 3, 0, 0));
    }, []);

    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const wasLockedRef = useRef(true);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                if (wasLockedRef.current) {
                    wasLockedRef.current = false;
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 4000);
                }
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

    const blocks: string[] = t.letterBlocks ?? [];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            setIdx(blocks.length);
        }
    }, [blocks]);

    useEffect(() => { setIdx(0); }, [blocks]);

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
        <>
            <Confetti active={showConfetti} />
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
        </>
    );
}
