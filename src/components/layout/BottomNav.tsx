/**
 * BottomNav Component
 * Fixed bottom navigation bar with page icons and labels
 */

import { memo, useMemo } from 'react';
import { Home as HomeIcon, Signal, Mail, BookOpen, Calendar, Gift } from 'lucide-react';
import type { Translations } from '../../translations/translations';

interface BottomNavProps {
    /** Translation strings */
    t: Translations;
    /** Current active page key */
    page: string;
    /** Navigation callback */
    onNavigate: (key: string) => void;
}

/** Navigation item configuration */
interface NavItem {
    key: string;
    label: string;
    icon: React.ReactNode;
}

/** Icon components - memoized to prevent re-renders */
const NavIcons = {
    home: <HomeIcon className="h-5 w-5" strokeWidth={1.5} />,
    lighthouse: <Signal className="h-5 w-5" strokeWidth={1.5} />,
    letter: <Mail className="h-5 w-5" strokeWidth={1.5} />,
    history: <BookOpen className="h-5 w-5" strokeWidth={1.5} />,
    schedule: <Calendar className="h-5 w-5" strokeWidth={1.5} />,
    thanks: <Gift className="h-5 w-5" strokeWidth={1.5} />,
} as const;

/** Individual nav button - memoized */
const NavButton = memo(function NavButton({
    item,
    isActive,
    onClick
}: {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 ${isActive
                ? "bg-white/85 text-[var(--ink)] shadow"
                : "text-[var(--ink)]/80 hover:bg-white/50"
                }`}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
        >
            {item.icon}
            <span className="mt-1 leading-none">{item.label}</span>
        </button>
    );
});

export default function BottomNav({ t, page, onNavigate }: BottomNavProps) {
    // Memoize items array to prevent recreation on each render
    const items: NavItem[] = useMemo(() => [
        { key: "home", label: t.navHome, icon: NavIcons.home },
        { key: "lighthouse", label: t.navLighthouse, icon: NavIcons.lighthouse },
        { key: "letter", label: t.navLetter, icon: NavIcons.letter },
        { key: "history", label: t.navHistory, icon: NavIcons.history },
        { key: "schedule", label: t.navSchedule, icon: NavIcons.schedule },
        { key: "thanks", label: t.navThanks, icon: NavIcons.thanks },
    ], [t.navHome, t.navLighthouse, t.navLetter, t.navHistory, t.navSchedule, t.navThanks]);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-10">
            <div className="mx-auto max-w-md px-4" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom,0))" }}>
                <div className="bottom-nav-glass soft-card grid grid-cols-6 gap-1 rounded-2xl p-2">
                    {items.map(it => (
                        <NavButton
                            key={it.key}
                            item={it}
                            isActive={page === it.key}
                            onClick={() => onNavigate(it.key)}
                        />
                    ))}
                </div>
            </div>
        </nav>
    );
}
