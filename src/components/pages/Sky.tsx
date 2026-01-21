/**
 * Sky Page Component
 * Interactive constellation puzzle with parallax star field
 * Features: Aurora Borealis, Moon phases, Secret star messages
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import Card from '../ui/Card';
import { hapticPatterns } from '../../utils/haptic';

interface SkyProps {
    /** Translation strings */
    t: Translations;
}

const PARALLAX_AMOUNT = 8;
const LONG_PRESS_DURATION = 500; // ms
const SECRET_STARS_COUNT = 5;

/**
 * Calculate the current moon phase (0-1)
 * 0 = new moon, 0.5 = full moon
 */
function getMoonPhase(): number {
    const now = new Date();
    // Known new moon: January 6, 2000
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const lunarCycle = 29.53058867; // days

    const daysSinceNew = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNew % lunarCycle) / lunarCycle;
    return phase;
}

/**
 * Get moon emoji based on phase
 */
function getMoonEmoji(phase: number): string {
    if (phase < 0.03 || phase > 0.97) return '🌑';
    if (phase < 0.22) return '🌒';
    if (phase < 0.28) return '🌓';
    if (phase < 0.47) return '🌔';
    if (phase < 0.53) return '🌕';
    if (phase < 0.72) return '🌖';
    if (phase < 0.78) return '🌗';
    return '🌘';
}

/**
 * Aurora Borealis effect component
 */
function AuroraBorealis() {
    return (
        <div className="aurora-container">
            <div className="aurora-layer" />
            <div className="aurora-layer" />
            <div className="aurora-layer" />
        </div>
    );
}

/**
 * Moon component with quote on tap
 */
function Moon({ quotes, onQuoteShow }: { quotes: string[]; onQuoteShow: (quote: string) => void }) {
    const phase = useMemo(() => getMoonPhase(), []);
    const emoji = useMemo(() => getMoonEmoji(phase), [phase]);

    const handleClick = () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        hapticPatterns.tap();
        onQuoteShow(randomQuote);
    };

    return (
        <button
            onClick={handleClick}
            className="absolute top-3 right-3 text-3xl moon-glow z-10"
            aria-label="Moon"
            title="Tap for a message"
        >
            {emoji}
        </button>
    );
}

interface SecretStar {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    message?: string;
}

/**
 * Secret Star component with long-press message
 */
function SecretStarComponent({
    star,
    parallaxX,
    parallaxY,
    onReveal
}: {
    star: SecretStar;
    parallaxX: number;
    parallaxY: number;
    onReveal: (star: SecretStar) => void;
}) {
    const pressTimer = useRef<number | null>(null);
    const [isPressed, setIsPressed] = useState(false);

    const startPress = useCallback(() => {
        if (!star.message) return;
        setIsPressed(true);
        pressTimer.current = window.setTimeout(() => {
            hapticPatterns.medium();
            onReveal(star);
            setIsPressed(false);
        }, LONG_PRESS_DURATION);
    }, [star, onReveal]);

    const cancelPress = useCallback(() => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
        setIsPressed(false);
    }, []);

    return (
        <div
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            className={`absolute rounded-full bg-white star-twinkle ${isPressed ? 'secret-star-active' : ''} ${star.message ? 'cursor-pointer secret-star-hint' : ''}`}
            style={{
                left: `calc(${star.x}% + ${parallaxX}px)`,
                top: `calc(${star.y}% + ${parallaxY}px)`,
                width: star.size,
                height: star.size,
                opacity: 0.3 + Math.random() * 0.4,
                animationDelay: `${star.delay}s`,
                transition: 'transform 0.1s ease-out',
            }}
        />
    );
}

export default function Sky({ t }: SkyProps) {
    const { tiltX, tiltY } = useDeviceOrientation();

    // Heart constellation stars
    const heartStars = useMemo(() => [
        { id: 0, x: 50, y: 85 },
        { id: 1, x: 35, y: 65 },
        { id: 2, x: 20, y: 45 },
        { id: 3, x: 15, y: 25 },
        { id: 4, x: 25, y: 12 },
        { id: 5, x: 40, y: 15 },
        { id: 6, x: 50, y: 28 },
        { id: 7, x: 60, y: 15 },
        { id: 8, x: 75, y: 12 },
        { id: 9, x: 85, y: 25 },
        { id: 10, x: 80, y: 45 },
        { id: 11, x: 65, y: 65 },
    ], []);

    // Background stars with some having secret messages
    const bgStars = useMemo(() => {
        const secretMessages = (t as { secretStarMessages?: string[] }).secretStarMessages || [];
        const stars: SecretStar[] = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 1 + Math.random() * 2,
            delay: Math.random() * 3,
            message: undefined,
        }));

        // Assign all available secret messages to random unique stars
        const availableIndices = Array.from({ length: 60 }, (_, i) => i);
        // Shuffle indices using Fisher-Yates
        for (let i = availableIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }

        // Take only 5 random messages
        const selectedMessages = [...secretMessages]
            .sort(() => Math.random() - 0.5)
            .slice(0, SECRET_STARS_COUNT);

        // Take 5 random stars
        const selectedIndices = availableIndices.slice(0, SECRET_STARS_COUNT);

        selectedIndices.forEach((idx, i) => {
            if (stars[idx]) {
                stars[idx].message = selectedMessages[i];
                stars[idx].size = 2.5 + Math.random() * 1.5; // Slightly larger for secret stars
            }
        });

        return stars;
    }, [t]);

    const [connectedCount, setConnectedCount] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [moonQuote, setMoonQuote] = useState<string | null>(null);
    const [revealedStar, setRevealedStar] = useState<SecretStar | null>(null);

    const currentStarIndex = connectedCount;
    const isComplete = connectedCount >= heartStars.length;

    const handleStarClick = (starId: number) => {
        if (starId === currentStarIndex && !isComplete) {
            hapticPatterns.short();
            setConnectedCount(prev => {
                const next = prev + 1;
                if (next >= heartStars.length) {
                    hapticPatterns.medium();
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

    const handleMoonQuote = (quote: string) => {
        setMoonQuote(quote);
        setTimeout(() => setMoonQuote(null), 3000);
    };

    const handleStarReveal = (star: SecretStar) => {
        setRevealedStar(star);
        setTimeout(() => setRevealedStar(null), 3000);
    };

    const parallaxX = tiltX * PARALLAX_AMOUNT;
    const parallaxY = tiltY * PARALLAX_AMOUNT * 0.5;

    const moonQuotes = (t as { moonQuotes?: string[] }).moonQuotes || [
        "We're looking at the same moon...",
    ];

    return (
        <div className="space-y-4">
            <Card className="p-5">
                <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.skyTitle}</h2>
                <p className="text-[var(--ink)]/90">{t.skyCopy}</p>
            </Card>

            <Card className="p-4 overflow-hidden">
                <div
                    className="relative w-full aspect-square rounded-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%)',
                        boxShadow: 'inset 0 0 60px rgba(100, 100, 200, 0.15)'
                    }}
                >
                    {/* Aurora Borealis - appears when constellation is complete */}
                    <AnimatePresence>
                        {isComplete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <AuroraBorealis />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Moon with phase */}
                    <Moon quotes={moonQuotes} onQuoteShow={handleMoonQuote} />

                    {/* Moon quote tooltip */}
                    <AnimatePresence>
                        {moonQuote && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-14 right-2 z-20 secret-star-tooltip"
                            >
                                {moonQuote}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Background stars with parallax and secrets */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: -PARALLAX_AMOUNT,
                        }}
                    >
                        {bgStars.map(star => (
                            <SecretStarComponent
                                key={`bg-${star.id}`}
                                star={star}
                                parallaxX={parallaxX}
                                parallaxY={parallaxY}
                                onReveal={handleStarReveal}
                            />
                        ))}
                    </div>

                    {/* Secret star message tooltip */}
                    <AnimatePresence>
                        {revealedStar && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="secret-star-tooltip"
                                style={{
                                    left: `clamp(10%, ${revealedStar.x}%, 90%)`,
                                    top: `${Math.max(12, revealedStar.y - 8)}%`,
                                    transform: 'translateX(-50%)',
                                    maxWidth: '80%',
                                    whiteSpace: 'normal',
                                    textAlign: 'center',
                                }}
                            >
                                {revealedStar.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Constellation lines */}
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
                                className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
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

                    {/* Completion message - semi-transparent to show aurora */}
                    <AnimatePresence>
                        {showMessage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)' }}
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

                {!isComplete && (
                    <p className="mt-3 text-center text-sm text-[var(--ink)]/70">
                        {t.skyHint} ({connectedCount}/{heartStars.length})
                    </p>
                )}
            </Card>
        </div>
    );
}
