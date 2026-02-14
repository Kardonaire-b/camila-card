/**
 * Schedule Page Component
 * Interactive calendar showing work shift schedule with 2/2 rotation
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '../../translations/translations';
import Card from '../ui/Card';
import { SCHEDULE_START_DATE } from '../../config';

interface ScheduleProps {
    /** Translation strings */
    t: Translations;
}

type ShiftType = 'day' | 'night' | 'off';

interface DayInfo {
    date: Date;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    shiftType: ShiftType;
}

/**
 * Calculate shift type for a given date based on 2/2 schedule
 * Cycle: 2 day shifts → 2 off → 2 night shifts → 2 off (8 days total)
 */
function getShiftType(date: Date, startDate: Date): ShiftType {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / msPerDay);

    // Handle dates before start - continue pattern backwards
    const cycleDay = ((daysDiff % 8) + 8) % 8; // Always positive modulo

    if (cycleDay < 2) return 'day';      // Days 0-1: Day shift
    if (cycleDay < 4) return 'off';       // Days 2-3: Off
    if (cycleDay < 6) return 'night';     // Days 4-5: Night shift
    return 'off';                          // Days 6-7: Off
}

/**
 * Get calendar days for a month including padding days from prev/next months
 */
function getCalendarDays(year: number, month: number, startDate: Date): DayInfo[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Get the day of week for the first day (0 = Sunday, we want Monday = 0)
    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Convert to Monday-based

    const days: DayInfo[] = [];

    // Add padding days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        days.push({
            date,
            dayOfMonth: date.getDate(),
            isCurrentMonth: false,
            isToday: date.getTime() === today.getTime(),
            shiftType: getShiftType(date, startDate),
        });
    }

    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const date = new Date(year, month, day);
        days.push({
            date,
            dayOfMonth: day,
            isCurrentMonth: true,
            isToday: date.getTime() === today.getTime(),
            shiftType: getShiftType(date, startDate),
        });
    }

    // Add padding days from next month to complete the grid (6 rows max)
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
            date,
            dayOfMonth: i,
            isCurrentMonth: false,
            isToday: date.getTime() === today.getTime(),
            shiftType: getShiftType(date, startDate),
        });
    }

    return days;
}

/** Shift type to Tailwind color class mapping */
const SHIFT_COLORS: Record<ShiftType, string> = {
    day: 'bg-amber-400/70',
    night: 'bg-indigo-500/70',
    off: 'bg-emerald-400/50',
};

/** Shift type to emoji mapping */
const SHIFT_EMOJIS: Record<ShiftType, string> = {
    day: '☀️',
    night: '🌙',
    off: '🏠',
};

export default function Schedule({ t }: ScheduleProps) {
    const [viewDate] = useState(() => new Date());

    // Use centralized translations for weekdays and months
    const weekdays = t.weekdays;
    const months = t.months;

    const calendarDays = useMemo(() =>
        getCalendarDays(viewDate.getFullYear(), viewDate.getMonth(), SCHEDULE_START_DATE),
        [viewDate]
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentShift = getShiftType(today, SCHEDULE_START_DATE);

    const statusMessage = useMemo(() => {
        switch (currentShift) {
            case 'day': return t.scheduleStatusDay;
            case 'night': return t.scheduleStatusNight;
            case 'off': return t.scheduleStatusOff;
        }
    }, [currentShift, t]);

    return (
        <div className="space-y-4">
            <Card className="p-5">
                <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">{t.scheduleTitle}</h2>
                <p className="text-[var(--ink)]/90">{t.scheduleCopy}</p>
            </Card>

            <Card className="p-4">
                {/* Month header */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-[var(--ink)]">
                        {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </h3>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdays.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-[var(--ink)]/60 py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayInfo, idx) => (
                        <div
                            key={idx}
                            className={`
                                relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                                ${dayInfo.isCurrentMonth ? 'text-[var(--ink)]' : 'text-[var(--ink)]/30'}
                                ${dayInfo.isToday ? 'ring-2 ring-[var(--ink)] ring-offset-1' : ''}
                                ${SHIFT_COLORS[dayInfo.shiftType]}
                            `}
                        >
                            <span className={`font-medium ${dayInfo.isToday ? 'font-bold' : ''}`}>
                                {dayInfo.dayOfMonth}
                            </span>
                            {dayInfo.isCurrentMonth && (
                                <span className="text-[10px] leading-none mt-0.5">
                                    {SHIFT_EMOJIS[dayInfo.shiftType]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 text-xs text-[var(--ink)]/80">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-amber-400/70"></div>
                        <span>{t.scheduleLegendDay}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-indigo-500/70"></div>
                        <span>{t.scheduleLegendNight}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-emerald-400/50"></div>
                        <span>{t.scheduleLegendOff}</span>
                    </div>
                </div>
            </Card>

            {/* Current status */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card festive className="p-4 text-center">
                    <p className="text-lg font-medium text-[var(--ink)]">
                        {statusMessage}
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
