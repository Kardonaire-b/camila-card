/**
 * Letter Page Component
 * Time-locked letter with typewriter effect and countdown timer
 */

import { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Confetti from '../effects/Confetti';
import handImage from '../../assets/my_hand.png';
import { LETTER_UNLOCK_DATE } from '../../config';
import { calculateCountdown, type TimeUnits } from '../../utils/time';

interface LetterProps {
    /** Translation strings */
    t: Translations;
}


type Phase = "done" | "active" | "pending";

/** Text segment type: plain text or formatted */
type TextSegment =
    | { type: 'plain'; text: string }
    | { type: 'bold'; text: string }
    | { type: 'italic'; text: string }
    | { type: 'highlight'; text: string };

/** Parses text into segments without rendering */
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

/** Renders segments with respect to visible character count */
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

/** Gets total visible text length (without markup) */
function getVisibleTextLength(segments: TextSegment[]): number {
    return segments.reduce((acc, seg) => acc + seg.text.length, 0);
}

/** Blinking cursor component */
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
    isLast?: boolean;
}

const TypewriterParagraph = forwardRef<HTMLParagraphElement, TypewriterParagraphProps>(
    ({ text, phase, speed = 65, onDone, isLast }, ref) => {
        // Parse text into segments once
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

        // Check if this is the signature (last paragraph)
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

    const [timeLeft, setTimeLeft] = useState<TimeUnits | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(() => new Date() >= LETTER_UNLOCK_DATE);
    const [showConfetti, setShowConfetti] = useState(false);
    const wasLockedRef = useRef(true);

    useEffect(() => {
        const checkTime = () => {
            const countdown = calculateCountdown(LETTER_UNLOCK_DATE);

            if (countdown === null) {
                if (wasLockedRef.current) {
                    wasLockedRef.current = false;
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 4000);
                }
                setIsUnlocked(true);
                setTimeLeft(null);
            } else {
                setTimeLeft(countdown);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const blocks: string[] = useMemo(() => t.letterBlocks ?? [], [t.letterBlocks]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeParaRef = useRef<HTMLParagraphElement>(null);

    // Key for saving progress in localStorage
    const storageKey = 'letter-progress-idx';

    // Load saved progress on mount
    const [idx, setIdx] = useState(() => {
        if (typeof window === 'undefined') return 0;

        // Check for reduced motion preference
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            return blocks.length;
        }

        // Try to restore progress from localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
            const savedIdx = parseInt(saved, 10);
            if (!isNaN(savedIdx) && savedIdx >= 0) {
                return Math.min(savedIdx, blocks.length);
            }
        }
        return 0;
    });

    // Save progress when idx changes
    useEffect(() => {
        localStorage.setItem(storageKey, String(idx));
    }, [idx]);

    // Auto-scroll to active paragraph
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

    // Check if letter is complete
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
                                    isLast={isLast}
                                    onDone={() => setTimeout(() => setIdx(prev => Math.max(prev, i + 1)), 250)}
                                />
                            );
                        })}
                    </div>

                    {/* Decorative elements after letter completion */}
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
