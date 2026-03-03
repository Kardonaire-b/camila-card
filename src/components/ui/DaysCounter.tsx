/**
 * DaysCounter Component
 * Real-time countdown showing days, hours, minutes, seconds since relationship start
 */

import { RELATIONSHIP_START_DATE } from '../../config';
import type { Translations } from '../../translations/translations';
import { useTimeSince } from '../../hooks';

interface DaysCounterProps {
    /** Translation strings */
    t: Translations;
}

function AnimatedNumber({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">
                {value}
            </span>
            <span className="text-xs text-[var(--ink)]/70 uppercase tracking-wide">
                {label}
            </span>
        </div>
    );
}

export default function DaysCounter({ t }: DaysCounterProps) {
    const time = useTimeSince(RELATIONSHIP_START_DATE);

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

            <p
                className="text-sm text-[var(--ink)]/70 italic animate-[fadeIn_0.5s_ease-in_0.5s_both]"
            >
                {t.togetherMessage}
            </p>
        </div>
    );
}
