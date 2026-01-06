import { useEffect, useRef } from 'react';
import { trackVisitor } from '../utils/visitorAnalytics';

/**
 * Hook для отслеживания посетителей
 * Выполняется при каждой загрузке страницы
 */
export function useVisitorTracking(): void {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Предотвращаем повторное выполнение в strict mode
        if (hasTracked.current) return;
        hasTracked.current = true;

        // Запускаем трекинг асинхронно, чтобы не блокировать рендеринг
        const runTracking = async () => {
            try {
                // Небольшая задержка чтобы страница успела загрузиться
                await new Promise(resolve => setTimeout(resolve, 1000));

                await trackVisitor();
            } catch (error) {
                // Молча игнорируем ошибки - не влияем на UX
                console.error('[Analytics] Tracking error:', error);
            }
        };

        runTracking();
    }, []);
}
