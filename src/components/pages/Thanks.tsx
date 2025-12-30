import { useState } from 'react';
import type { Translations } from '../../translations/translations';
import Fireworks from '../effects/Fireworks';
import thanksSketch from '../../assets/quartz.png';

interface ThanksProps {
    t: Translations;
    onRelight: () => void;
}

export default function Thanks({ t, onRelight }: ThanksProps) {
    const [showFireworks, setShowFireworks] = useState(false);

    const handleFireworks = () => {
        setShowFireworks(true);
    };

    const handleFireworksComplete = () => {
        setShowFireworks(false);
        onRelight();
    };

    return (
        <>
            <Fireworks active={showFireworks} onComplete={handleFireworksComplete} />
            <div className="glass soft-card overflow-hidden rounded-3xl p-6 text-center">
                <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.thanksTitle}</h2>
                <p className="mx-auto max-w-sm text-[var(--ink)]/90">{t.thanksCopy}</p>

                <img src={thanksSketch} alt="Sketch"
                    className="mx-auto mt-4 max-h-64 w-auto rounded-2xl border border-white/50 shadow object-contain"
                    loading="lazy" decoding="async" />

                <button
                    onClick={handleFireworks}
                    className="mt-4 rounded-xl border border-white/50 bg-white/70 px-4 py-2 text-sm text-[var(--ink)] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/10">
                    {t.shareBtn}
                </button>
            </div>
        </>
    );
}
