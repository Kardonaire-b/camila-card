import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RELATIONSHIP_START_DATE } from '../../config';
import type { Translations } from '../../translations/translations';

interface DaysCounterProps {
    t: Translations;
}

interface TimeUnits {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTime(): TimeUnits {
    const now = new Date();
    const diff = now.getTime() - RELATIONSHIP_START_DATE.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

function AnimatedNumber({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <motion.span
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-[var(--ink)]"
            >
                {value}
            </motion.span>
            <span className="text-xs text-[var(--ink)]/70 uppercase tracking-wide">
                {label}
            </span>
        </div>
    );
}

export default function DaysCounter({ t }: DaysCounterProps) {
    const [time, setTime] = useState<TimeUnits>(calculateTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(calculateTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center space-y-4">
            <p className="text-sm text-[var(--ink)]/80 font-medium">
                {t.togetherFor}
            </p>

            <div className="flex justify-center gap-4">
                <AnimatedNumber value={time.days} label={t.daysLabel} />
                <AnimatedNumber value={time.hours} label={t.hoursLabel} />
                <AnimatedNumber value={time.minutes} label={t.minutesLabel} />
                <AnimatedNumber value={time.seconds} label={t.secondsLabel} />
            </div>

            <motion.p
                className="text-sm text-[var(--ink)]/70 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {t.togetherMessage}
            </motion.p>
        </div>
    );
}
