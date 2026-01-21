/**
 * TopBar Component
 * Fixed header with app title and language toggle button
 */

interface TopBarProps {
    /** Display title text */
    title: string;
    /** Current language code (e.g., 'ru', 'es') */
    lang: string;
    /** Callback to toggle between languages */
    onToggleLang: () => void;
    /** Accessibility label for the language button */
    ariaLabel: string;
}

export default function TopBar({ title, lang, onToggleLang, ariaLabel }: TopBarProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-10">
            <div className="mx-auto max-w-md px-4 pt-5">
                <div className="glass soft-card festive-glow flex items-center justify-between rounded-2xl px-3 py-2">
                    <h1 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--ink)] truncate">{title}</h1>
                    <button
                        onClick={onToggleLang}
                        className="rounded-xl border border-white/50 px-2 py-1 text-xs sm:text-sm text-[var(--ink)] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-black/10 shrink-0"
                        aria-label={ariaLabel}
                    >
                        {lang.toUpperCase()}
                    </button>
                </div>
            </div>
        </div>
    );
}
