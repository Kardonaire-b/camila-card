import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Fireworks from '../effects/Fireworks';
import thanksSketch from '../../assets/my_icon.png';
import { useHandwrittenFont } from '../../hooks/useHandwrittenFont';

interface ThanksProps {
    t: Translations;
    onRelight: () => void;
}

export default function Thanks({ t, onRelight }: ThanksProps) {
    useHandwrittenFont();
    const [showFireworks, setShowFireworks] = useState(false);

    const handleFireworks = () => {
        setShowFireworks(true);
    };

    const handleFireworksComplete = () => {
        setShowFireworks(false);
        onRelight();
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[50vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Fireworks active={showFireworks} onComplete={handleFireworksComplete} />

            <motion.div
                className="glass relative overflow-hidden rounded-[2rem] p-8 text-center max-w-md w-full border border-white/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(12px)'
                }}
            >
                {/* Decorative glow behind the card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-500/20 blur-[60px] rounded-full -z-10" />

                <motion.h2
                    className="mb-4 text-4xl font-bold text-[var(--ink)]"
                    style={{ fontFamily: "'Caveat', cursive" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {t.thanksTitle}
                </motion.h2>

                <motion.p
                    className="mx-auto max-w-sm text-lg text-[var(--ink)]/90 leading-relaxed mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {t.thanksCopy}
                </motion.p>

                <motion.div
                    className="relative mx-auto mb-8 w-fit rounded-full p-1 bg-gradient-to-tr from-amber-200 via-purple-300 to-amber-200 shadow-lg shadow-purple-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="rounded-full overflow-hidden border-4 border-white shadow-inner">
                        <img
                            src={thanksSketch}
                            alt="Sketch"
                            className="w-48 h-48 object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </motion.div>

                <motion.button
                    onClick={handleFireworks}
                    className="relative group overflow-hidden rounded-xl px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-90 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />

                    <span className="relative flex items-center justify-center gap-2">
                        <span>{t.shareBtn}</span>
                    </span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
