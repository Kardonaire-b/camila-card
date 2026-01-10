import { useState, useEffect, useRef } from 'react';
import type { Translations } from '../../translations/translations';
import type { Horizon } from '../../App';
import LighthouseSVG from '../svg/LighthouseSVG';
import Card from '../ui/Card';
import songUrl from '../../assets/audio/melody.mp3';

interface LighthouseProps {
    t: Translations;
    horizon: Horizon;
    setHorizon: (h: Horizon) => void;
}

export default function Lighthouse({ t, horizon, setHorizon }: LighthouseProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setPlaying] = useState(false);

    useEffect(() => {
        const a = new Audio(songUrl);
        a.loop = true;
        a.preload = "auto";
        a.volume = 0.9;
        audioRef.current = a;
        return () => { a.pause(); audioRef.current = null; };
    }, []);

    const toggleAudio = async () => {
        const a = audioRef.current;
        if (!a) return;
        try {
            if (a.paused) { await a.play(); setPlaying(true); }
            else { a.pause(); setPlaying(false); }
        } catch {
            // Silent fail - audio errors should not affect UX
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-5">
                <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.lighthouseTitle}</h2>
                <p className="text-[var(--ink)]/90">{t.lighthouseCopy}</p>
            </Card>

            <Card className="overflow-hidden p-5">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
                    <LighthouseSVG horizon={horizon} />

                    <button
                        onClick={toggleAudio}
                        className={`absolute right-2 top-2 rounded-xl border border-white/60 bg-white/80 p-2 text-[var(--ink)] shadow
                        hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/10`}
                        aria-label={isPlaying ? t.a11y.pauseMelody : t.a11y.playMelody}
                        title={isPlaying ? t.a11y.pauseMelody : t.a11y.playMelody}
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M9 5 V17 A3 3 0 1 1 7 14" />
                            <path d="M15 5 V13 A3 3 0 1 1 13 10" />
                        </svg>
                    </button>

                    <div className={`absolute right-2 top-2 -mr-1 -mt-1 h-2 w-2 rounded-full ${isPlaying ? "bg-green-500/80" : "bg-transparent"}`} />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <HorizonChip label={t.horizonDawn} active={horizon === "dawn"} onClick={() => setHorizon("dawn")} />
                    <HorizonChip label={t.horizonDay} active={horizon === "day"} onClick={() => setHorizon("day")} />
                    <HorizonChip label={t.horizonSunset} active={horizon === "sunset"} onClick={() => setHorizon("sunset")} />
                    <HorizonChip label={t.horizonNight} active={horizon === "night"} onClick={() => setHorizon("night")} />
                </div>

                <p className="mt-3 text-center text-sm text-[var(--ink)]/80">{t.horizonHint}</p>
            </Card>
        </div>
    );
}

function HorizonChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-xl border px-3 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-black/10 ${active ? "border-white/70 bg-white/85 text-[var(--ink)] shadow" : "border-white/40 bg-white/30 text-[var(--ink)]/90 hover:bg-white/50"
                }`}
            aria-pressed={active}
        >
            {label}
        </button>
    );
}
