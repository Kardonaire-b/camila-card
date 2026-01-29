/**
 * Story Content
 * Collaborative story chapters with translations
 * Edit this file to add new chapters
 */

import type { Lang } from './translations';

export interface StoryChapter {
    id: number;
    author: 'ilya' | 'camila';
    text: Record<Lang, string>;
    prompt?: Record<Lang, string>;
}

export const STORY_CHAPTERS: StoryChapter[] = [
    {
        id: 1,
        author: 'ilya',
        text: {
            ru: `Жил-был Маяк на краю мира...

Он стоял там так долго, что забыл, зачем начал светить. Каждую ночь его луч прорезал туман, но никто не приплывал. Годы шли, и Маяк думал, что его свет — просто привычка, эхо давно забытой цели.

Но однажды...`,
            es: `Había una vez un Faro en el borde del mundo...

Había estado allí tanto tiempo que olvidó por qué empezó a brillar. Cada noche su rayo atravesaba la niebla, pero nadie llegaba. Pasaron los años, y el Faro pensaba que su luz era solo una costumbre, un eco de un propósito olvidado.

Pero un día...`
        },
        prompt: {
            ru: 'Что увидел Маяк в тумане той ночью?',
            es: '¿Qué vio el Faro en la niebla esa noche?'
        }
    },
];
