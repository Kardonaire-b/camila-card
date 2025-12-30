import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Translations } from '../../translations/translations';

interface SkyProps {
    t: Translations;
}

export default function Sky({ t }: SkyProps) {
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

            <div className="glass soft-card rounded-3xl p-4 overflow-hidden">
                <div
                    className="relative w-full aspect-square rounded-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%)',
                        boxShadow: 'inset 0 0 60px rgba(100, 100, 200, 0.15)'
                    }}
                >
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

                {!isComplete && (
                    <p className="mt-3 text-center text-sm text-[var(--ink)]/70">
                        {t.skyHint} ({connectedCount}/{heartStars.length})
                    </p>
                )}
            </div>
        </div>
    );
}
