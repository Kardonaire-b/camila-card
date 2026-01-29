/**
 * PageWrap Component
 * Wrapper for page transitions with swipe navigation support
 */

import { motion, type PanInfo } from 'framer-motion';

/** Minimum swipe distance to trigger navigation */
const SWIPE_THRESHOLD = 50;

interface PageWrapProps {
    children: React.ReactNode;
    /** Animation direction: -1 = came from left, 1 = came from right */
    direction: number;
    /** Callback when user swipes */
    onSwipe: (dir: 'left' | 'right') => void;
}

export default function PageWrap({ children, direction, onSwipe }: PageWrapProps) {
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
