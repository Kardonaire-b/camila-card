
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Card from '../ui/Card';

interface HomeProps {
    t: Translations;
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

            <Card className="w-full p-5">
                <ul className="space-y-2 text-sm text-[var(--ink)]/90">
                    <li>🎁 {t.tipsNav}</li>
                    <li>❄️ {t.tipsHorizon}</li>
                    <li>🌟 {t.tipsLang}</li>
                </ul>
            </Card>

            <motion.button
                onClick={onStart}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-yellow-300/50 bg-gradient-to-r from-red-500/80 to-green-600/80 px-5 py-3 text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
                aria-label={t.a11y.openCard}
            >
                {t.homeOpen}
            </motion.button>
        </div>
    );
}
