
import { Home as HomeIcon, Signal, Mail, Stars, Gift } from 'lucide-react';
import type { Translations } from '../../translations/translations';

interface BottomNavProps {
    t: Translations;
    page: string;
    onNavigate: (key: string) => void;
}

export default function BottomNav({ t, page, onNavigate }: BottomNavProps) {
    const items = [
        { key: "home", label: t.navHome, icon: <HomeIcon className="h-5 w-5" strokeWidth={1.5} /> },
        { key: "lighthouse", label: t.navLighthouse, icon: <Signal className="h-5 w-5" strokeWidth={1.5} /> },
        { key: "letter", label: t.navLetter, icon: <Mail className="h-5 w-5" strokeWidth={1.5} /> },
        { key: "sky", label: t.navSky, icon: <Stars className="h-5 w-5" strokeWidth={1.5} /> },
        { key: "thanks", label: t.navThanks, icon: <Gift className="h-5 w-5" strokeWidth={1.5} /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-10">
            <div className="mx-auto max-w-md px-4" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom,0))" }}>
                <div className="glass soft-card grid grid-cols-5 gap-1 rounded-2xl p-2">
                    {items.map(it => (
                        <button
                            key={it.key}
                            onClick={() => onNavigate(it.key)}
                            className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 ${page === it.key ? "bg-white/85 text-[var(--ink)] shadow" : "text-[var(--ink)]/80 hover:bg-white/50"
                                }`}
                            aria-current={page === it.key ? "page" : undefined}
                            aria-label={it.label}
                        >
                            {it.icon}
                            <span className="mt-1 leading-none">{it.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
