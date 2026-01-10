import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import { hapticPatterns } from '../../utils/haptic';

interface ScratchCardProps {
    t: Translations;
    children: React.ReactNode;
}

const REVEAL_THRESHOLD = 0.65; // 65% scratched to auto-reveal

export default function ScratchCard({ t, children }: ScratchCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    // Initialize canvas with scratch layer
    useEffect(() => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create gradient scratch layer
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f0e6d3');
        gradient.addColorStop(0.5, '#e8dcc8');
        gradient.addColorStop(1, '#f5ede0');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle pattern
        ctx.fillStyle = 'rgba(212, 165, 116, 0.15)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }, [isRevealed]);

    const calculateScratchPercentage = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;

        const ctx = canvas.getContext('2d');
        if (!ctx) return 0;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        return transparentPixels / (pixels.length / 4);
    }, []);

    const scratch = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();

        if (lastPosRef.current) {
            ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
            ctx.lineTo(canvasX, canvasY);
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        ctx.arc(canvasX, canvasY, 20, 0, Math.PI * 2);
        ctx.fill();

        lastPosRef.current = { x: canvasX, y: canvasY };

        // Haptic feedback (gentle vibration)
        hapticPatterns.tap();

        // Check if enough is scratched
        const percentage = calculateScratchPercentage();
        if (percentage > REVEAL_THRESHOLD) {
            setIsRevealed(true);
        }
    }, [calculateScratchPercentage]);

    const handleStart = useCallback((x: number, y: number) => {
        setIsScratching(true);
        lastPosRef.current = null;
        scratch(x, y);
    }, [scratch]);

    const handleMove = useCallback((x: number, y: number) => {
        if (!isScratching) return;
        scratch(x, y);
    }, [isScratching, scratch]);

    const handleEnd = useCallback(() => {
        setIsScratching(false);
        lastPosRef.current = null;
    }, []);

    // Mouse events
    const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => handleEnd();

    // Touch events - stop propagation to prevent page swipe
    const onTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        e.stopPropagation();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation();
        handleEnd();
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full rounded-3xl overflow-hidden glass soft-card"
            style={{ minHeight: '140px' }}
        >
            {/* Content underneath */}
            <div className="p-5">
                {children}
            </div>

            {/* Scratch layer */}
            <AnimatePresence>
                {!isRevealed && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 cursor-pointer"
                        style={{ touchAction: 'none' }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onPointerMoveCapture={(e) => e.stopPropagation()}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.p
                                className="text-amber-800/70 text-sm font-medium text-center px-4"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {t.scratchHint}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
