/**
 * Incognito Mode Detection (Heuristic)
 */

export async function detectIncognito(): Promise<boolean> {
    try {
        // Check via storage quota
        if (navigator.storage && navigator.storage.estimate) {
            const { quota } = await navigator.storage.estimate();
            // In incognito mode, limit is usually ~120MB
            if (quota && quota < 150000000) return true;
        }

        // Check FileSystem API
        const fs = (window as unknown as { webkitRequestFileSystem?: unknown }).webkitRequestFileSystem;
        if (fs) {
            return new Promise<boolean>((resolve) => {
                (fs as (type: number, size: number, success: () => void, error: () => void) => void)(
                    0, 1,
                    () => resolve(false),
                    () => resolve(true)
                );
            });
        }

        return false;
    } catch {
        return false;
    }
}
