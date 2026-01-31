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
    {
        id: 2,
        author: 'camila',
        text: {
            ru: `...луч света ударил не в привычную пустоту. Туман раздвинулся, как занавес, открывая силуэт, который уверенно шёл по берегу, решив исследовать трещины заброшенного маяка. Тёплый шёпот поднялся по стенам холодного металла; это был не ветер, а голос, знавший имя каждой его трещины. Маяк, привыкший только отдавать, обнаружил, что может и получать: тепло взгляда, который не боялся его одиночества, а находил в нём место для отдыха...`,
            es: `...el rayo de luz no golpeó el vacío de siempre. La niebla se abrió como un telón, revelando una silueta que caminaba firme por la orilla, decidida a explorar las grietas del faro abandonado. Un susurro cálido trepó por las paredes de metal frío; no era el viento, sino una voz que conocía el nombre de cada una de sus grietas. El Faro, acostumbrado a dar, descubrió que también podía recibir: el calor de una mirada que no temía a su soledad, sino que encontraba en ella un lugar para descansar...`
        }
    },
    {
        id: 3,
        author: 'ilya',
        text: {
            ru: `Старый механизм скрипнул, и впервые за вечность луч света остановился. Ему больше не нужно было прочёсывать бесконечный горизонт в поисках несуществующих кораблей. Теперь весь его свет был сосредоточен в одной точке: на Ней.

Камень, привыкший лишь к соли и льду, почувствовал, как этот тёплый шёпот проникает сквозь броню, растапливая холод изнутри. Тяжёлая железная дверь, забывшая, что такое принимать гостей, поддалась с глубоким вздохом, приглашая её войти...`,
            es: `El viejo mecanismo crujió y, por primera vez en la eternidad, el haz de luz se detuvo. Ya no necesitaba barrer el horizonte infinito en busca de barcos inexistentes. Ahora, toda su luz se concentraba en un solo punto: en Ella.

La piedra, acostumbrada solo a la sal y al hielo, sintió cómo ese susurro cálido penetraba la coraza, derritiendo el frío desde adentro. La pesada puerta de hierro, que había olvidado lo que era recibir visitas, cedió con un suspiro profundo, invitándola a entrar...`
        },
        prompt: {
            ru: 'Что случилось с холодным застоявшимся воздухом внутри башни, когда она переступила порог? Что она принесла с собой?',
            es: '¿Qué sucedió con el aire frío y estancado dentro de la torre cuando ella cruzó el umbral? ¿Qué trajo consigo?'
        }
    },
];
