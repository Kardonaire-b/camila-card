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
        }
    },
    {
        id: 4,
        author: 'camila',
        text: {
            ru: `Переступив порог, она положила конец бесплодной тишине. Застоявшийся воздух наполнился робким, но живым эхом: песней, напоминавшей башне, что мир — это не только забвение. Её глаза не задержались на ржавчине — они воздали честь следам времени, которые Маяк нёс с благородством.

Вместо того чтобы вторгаться, она замурлыкала мелодию, что текла вместе с волнами, и несла тепло, пробивавшееся сквозь синеву холода. Она села перед самой сутью Маяка — не как та, кто зашёл мимоходом, а как та, кто нашла конец своего пути. Там, где воздух превратился в танец золотых частиц, она просто остановилась, чтобы созерцать свет за стеклом.

— Я никогда не видела такого сияния, — прошептала она.`,
            es: `Al cruzar el umbral, ella puso fin al silencio estéril. El aire estancado se llenó de un eco tímido pero vivo: una canción que recordaba a la torre que el mundo no era solo olvido. Sus ojos no se detuvieron en el óxido, sino que honraron las huellas del tiempo que el Faro portaba con nobleza.

En lugar de forzar su entrada, ella tarareó una melodía que fluía con las olas y una calidez que brotaba entre los azules del frío. Se sentó frente a la esencia del Faro, no como quien está de paso, sino como quien ha encontrado el final de su camino. Allí, donde el aire se volvió un baile de partículas doradas, ella simplemente se detuvo a contemplar la luz tras el cristal.

—Nunca había visto un brillo igual— susurró.`
        }
    },
    {
        id: 5,
        author: 'ilya',
        text: {
            ru: `Маяк задрожал. Не громовым раскатом бури, а еле уловимой дрожью того, кого впервые за столетия коснулись.

Свет в фонаре, всегда бывший белым и холодным, как далёкая звезда, вдруг изменился. Он стал янтарным, густым и мягким, как мёд, пролитый на море. Он больше не рассекал тьму — он обнимал её.

Каменные стены, хранившие эхо тысячи ледяных ветров, начали излучать забытое тепло, откликаясь на её мелодию. Старый механизм перестал скрипеть и начал мурлыкать, подстраиваясь под ритм её дыхания. Маяк перестал быть просто путеводной звездой для других. Он стал Домом для неё.`,
            es: `El Faro tembló. No con el estruendo de una tormenta, sino con el estremecimiento sutil de quien ha sido tocado por primera vez en siglos.

La luz en la linterna, que siempre había sido blanca y fría como una estrella distante, de repente cambió. Se volvió ámbar, densa y suave, como la miel derramada sobre el mar. Ya no cortaba la oscuridad; la abrazaba.

Las paredes de piedra, que guardaban el eco de mil vientos helados, empezaron a irradiar un calor olvidado, respondiendo a su melodía. El viejo mecanismo dejó de rechinar y empezó a ronronear, acompasándose al ritmo de su respiración. El Faro había dejado de ser solo una guía para los demás. Se había convertido en un Hogar para ella.`
        },
        prompt: {
            ru: 'Она раскрыла ладони. В них было что-то, что она принесла издалека, сквозь туман. Что это было?',
            es: 'Ella abrió sus manos. En sus palmas había algo que había traído desde muy lejos, a través de la niebla. ¿Qué era?'
        }
    },
];
