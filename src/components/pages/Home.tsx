/**
 * Home Page Component
 * Landing page with greeting card, scratch-to-reveal counter, and start button
 */

import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Card from '../ui/Card';
import ScratchCard from '../ui/ScratchCard';
import DaysCounter from '../ui/DaysCounter';

interface HomeProps {
    /** Translation strings */
    t: Translations;
    /** Callback when user clicks to start the experience */
    onStart: () => void;
}

export default function Home({ t, onStart }: HomeProps) {
    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card festive className="w-full p-5 text-center">
                    <p className="text-base leading-relaxed text-[var(--ink)]">
                        {t.homeIntro}
                    </p>
                </Card>
            </motion.div>

            <ScratchCard t={t}>
                <DaysCounter t={t} />
            </ScratchCard>

            <motion.button
                onClick={onStart}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-pink-300/50 bg-gradient-to-r from-pink-400/80 to-amber-400/80 px-5 py-3 text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300/50"
                aria-label={t.a11y.openCard}
            >
                {t.homeOpen}
            </motion.button>
        </div>
    );
}
