import { useEffect } from 'react';

export function useHandwrittenFont() {
    useEffect(() => {
        const href = "https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Marck+Script&display=swap";
        if ([...document.styleSheets].some(s => (s.href || "").includes("fonts.googleapis.com"))) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }, []);
}
