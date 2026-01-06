/**
 * Analytics Data Sender
 */

import type { VisitorData } from './types';
import { ANALYTICS_URL } from '../../config';

// Send data to Worker
export async function sendVisitorData(data: VisitorData): Promise<boolean> {
    try {
        const response = await fetch(ANALYTICS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error('[Analytics] Failed to send data:', error);
        return false;
    }
}
