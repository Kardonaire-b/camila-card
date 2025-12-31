import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Confetti from '../effects/Confetti';
import handImage from '../../assets/my_hand.png';

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

// Тип сегмента: обычный текст или форматированный
type TextSegment =
    | { type: 'plain'; text: string }
    | { type: 'bold'; text: string }
    | { type: 'italic'; text: string }
    | { type: 'highlight'; text: string };

// Парсер текста в сегменты без рендеринга
function parseTextToSegments(text: string): TextSegment[] {
    const segments: TextSegment[] = [];
    let remaining = text;

    const patterns: { regex: RegExp; type: 'bold' | 'italic' | 'highlight' }[] = [
        { regex: /\*\*(.+?)\*\*/, type: 'bold' },
        { regex: /\*(.+?)\*/, type: 'italic' },
        { regex: /\{\{(.+?)\}\}/, type: 'highlight' }
    ];

    while (remaining.length > 0) {
        let earliestMatch: { index: number; fullLength: number; content: string; type: 'bold' | 'italic' | 'highlight' } | null = null;

        for (const { regex, type } of patterns) {
            const match = remaining.match(regex);
            if (match && match.index !== undefined) {
                if (!earliestMatch || match.index < earliestMatch.index) {
                    earliestMatch = {
                        index: match.index,
                        fullLength: match[0].length,
                        content: match[1],
                        type
                    };
                }
            }
        }

        if (earliestMatch) {
            if (earliestMatch.index > 0) {
                segments.push({ type: 'plain', text: remaining.slice(0, earliestMatch.index) });
            }
            segments.push({ type: earliestMatch.type, text: earliestMatch.content });
            remaining = remaining.slice(earliestMatch.index + earliestMatch.fullLength);
        } else {
            segments.push({ type: 'plain', text: remaining });
            break;
        }
    }

    return segments;
}

// Рендер сегментов с учётом количества показанных символов
function renderSegmentsWithLength(segments: TextSegment[], visibleLength: number): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    let consumed = 0;

    for (let i = 0; i < segments.length && consumed < visibleLength; i++) {
        const seg = segments[i];
        const segLen = seg.text.length;
        const remaining = visibleLength - consumed;
        const showLen = Math.min(segLen, remaining);
        const displayText = seg.text.slice(0, showLen);

        if (displayText.length === 0) continue;

        switch (seg.type) {
            case 'plain':
                result.push(displayText);
                break;
            case 'bold':
                result.push(<strong key={i} className="font-bold">{displayText}</strong>);
                break;
            case 'italic':
                result.push(<em key={i} className="italic">{displayText}</em>);
                break;
            case 'highlight':
                result.push(
                    <span
                        key={i}
                        className="font-semibold"
                        style={{
                            color: '#d4a574',
                            textShadow: '0 0 8px rgba(212, 165, 116, 0.4)'
                        }}
                    >
                        {displayText}
                    </span>
                );
                break;
        }

        consumed += showLen;
    }

    return result;
}

// Получить общую длину "видимого" текста (без разметки)
function getVisibleTextLength(segments: TextSegment[]): number {
    return segments.reduce((acc, seg) => acc + seg.text.length, 0);
}

// Мерцающий курсор
const BlinkingCursor = () => (
    <span
        className="inline-block w-[2px] h-[1.2em] ml-[1px] align-middle animate-pulse"
        style={{ backgroundColor: 'var(--ink)', opacity: 0.7 }}
    />
);

interface TypewriterParagraphProps {
    text: string;
    phase: Phase;
    speed?: number;
    onDone?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

const TypewriterParagraph = forwardRef<HTMLParagraphElement, TypewriterParagraphProps>(
    ({ text, phase, speed = 65, onDone, isLast }, ref) => {
        // Парсим текст в сегменты один раз
        const segments = useMemo(() => parseTextToSegments(text), [text]);
        const totalVisibleLength = useMemo(() => getVisibleTextLength(segments), [segments]);

        const [len, setLen] = useState(phase === "done" ? totalVisibleLength : 0);

        const onDoneRef = useRef(onDone);
        onDoneRef.current = onDone;

        useEffect(() => {
            if (phase === "active") {
                setLen(0);
                let i = 0;
                const id = setInterval(() => {
                    i++;
                    if (i >= totalVisibleLength) {
                        setLen(totalVisibleLength);
                        clearInterval(id);
                        onDoneRef.current?.();
                    } else {
                        setLen(i);
                    }
                }, speed);
                return () => clearInterval(id);
            }
            setLen(phase === "done" ? totalVisibleLength : 0);
        }, [phase, totalVisibleLength, speed]);

        const isTyping = phase === "active" && len < totalVisibleLength;
        const isDone = phase === "done";

        // Определяем, является ли это подписью (последний параграф)
        const isSignature = isLast && isDone;

        return (
            <p
                className={`mb-4 whitespace-pre-wrap ${isDone ? 'paragraph-done' : ''} ${isSignature ? 'letter-signature' : ''}`}
                ref={ref}
            >
                {renderSegmentsWithLength(segments, len)}
                {isTyping && <BlinkingCursor />}
            </p>
        );
    }
);

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
    // TODO: Вернуть false после проверки текста письма
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

    const blocks: string[] = useMemo(() => t.letterBlocks ?? [], [t.letterBlocks]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeParaRef = useRef<HTMLParagraphElement>(null);

    // Ключ для сохранения прогресса в localStorage
    const storageKey = 'letter-progress-idx';

    // Загружаем сохранённый прогресс при монтировании
    const [idx, setIdx] = useState(() => {
        if (typeof window === 'undefined') return 0;

        // Проверяем режим уменьшенной анимации
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            return blocks.length;
        }

        // Пытаемся восстановить прогресс из localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
            const savedIdx = parseInt(saved, 10);
            if (!isNaN(savedIdx) && savedIdx >= 0) {
                return Math.min(savedIdx, blocks.length);
            }
        }
        return 0;
    });

    // Сохраняем прогресс при изменении idx
    useEffect(() => {
        localStorage.setItem(storageKey, String(idx));
    }, [idx]);

    // Автоскролл за активным параграфом
    useEffect(() => {
        if (activeParaRef.current && scrollContainerRef.current) {
            activeParaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    });

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

    // Проверяем, завершено ли письмо
    const isLetterComplete = idx >= blocks.length;

    return (
        <>
            <Confetti active={showConfetti} />
            <div className="space-y-4">
                <div className="glass soft-card letter-paper letter-decorations letter-vignette rounded-3xl p-5 overflow-hidden">
                    <h2 className="mb-3 text-xl font-semibold text-[var(--ink)]">{t.letterTitle}</h2>

                    <div
                        ref={scrollContainerRef}
                        className="letter-scroll letter-content text-[var(--ink)]/95 text-lg leading-7 max-h-[50vh] overflow-y-auto pr-2"
                        style={{
                            fontFamily: "'Caveat','Marck Script','Segoe Print','Bradley Hand',cursive"
                        }}
                        aria-live="polite"
                    >
                        {blocks.map((text, i) => {
                            const phase: Phase = i < idx ? "done" : i === idx ? "active" : "pending";
                            const isLast = i === blocks.length - 1;
                            return (
                                <TypewriterParagraph
                                    key={`${i}-${text.length}`}
                                    ref={i === idx ? activeParaRef : undefined}
                                    text={text}
                                    phase={phase}
                                    isFirst={i === 0}
                                    isLast={isLast}
                                    onDone={() => setTimeout(() => setIdx(prev => Math.max(prev, i + 1)), 250)}
                                />
                            );
                        })}
                    </div>

                    {/* Декоративные элементы после завершения письма */}
                    {isLetterComplete && (
                        <motion.div
                            className="letter-complete-decoration flex flex-col items-center mt-6 space-y-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            <div className="relative h-48 md:h-64 w-auto rounded-2xl overflow-hidden border-4 border-[rgba(212,165,116,0.3)] shadow-lg sepia-[0.3]">
                                <img
                                    src={handImage}
                                    alt="My Hand"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span style={{ fontSize: '2rem' }}>❤️✨💌</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
