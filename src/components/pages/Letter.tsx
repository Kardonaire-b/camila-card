/**
 * Letter Page Component
 * Letter with typewriter effect
 */

import { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import handImage from '../../assets/my_hand.png';
import { useInterval } from '../../hooks';
import {
    parseTextToSegments,
    renderSegmentsWithLength,
    getVisibleTextLength
} from '../../utils/textParser';

interface LetterProps {
    /** Translation strings */
    t: Translations;
}

/** Typewriter animation speed in milliseconds per character */
const TYPEWRITER_SPEED_MS = 65;

/** Delay before starting next paragraph in milliseconds */
const PARAGRAPH_TRANSITION_DELAY_MS = 250;

type Phase = "done" | "active" | "pending";

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
    ({ text, phase, speed = TYPEWRITER_SPEED_MS, onDone, isLast }, ref) => {
        // Parse text into segments once
        const segments = useMemo(() => parseTextToSegments(text), [text]);
        const totalVisibleLength = useMemo(() => getVisibleTextLength(segments), [segments]);

        const [len, setLen] = useState(phase === "done" ? totalVisibleLength : 0);

        const onDoneRef = useRef(onDone);
        onDoneRef.current = onDone;

        // Use interval for typewriter effect
        useInterval(
            () => {
                setLen(prev => {
                    const next = prev + 1;
                    if (next >= totalVisibleLength) {
                        onDoneRef.current?.();
                        return totalVisibleLength;
                    }
                    return next;
                });
            },
            phase === "active" && len < totalVisibleLength ? speed : null
        );

        // Reset on phase change
        useEffect(() => {
            if (phase === "active") {
                setLen(0);
            } else if (phase === "done") {
                setLen(totalVisibleLength);
            } else {
                setLen(0);
            }
        }, [phase, totalVisibleLength]);

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

TypewriterParagraph.displayName = 'TypewriterParagraph';

export default function Letter({ t }: LetterProps) {
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

    // Check if letter is complete
    const isLetterComplete = idx >= blocks.length;

    return (
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
                                onDone={() => setTimeout(() => setIdx(prev => Math.max(prev, i + 1)), PARAGRAPH_TRANSITION_DELAY_MS)}
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
    );
}
