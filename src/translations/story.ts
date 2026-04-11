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
    {
        id: 6,
        author: 'camila',
        text: {
            ru: `Она раскрыла ладони. В них покоился необработанный опал — кусок живого камня, словно укравший все краски, которые туман столетиями отнимал у Маяка. При соприкосновении с янтарным светом самоцвет вспыхнул изнутри, являя отблески закатов, которые он считал забытыми. Этот предмет был зеркалом его собственной души: структура, которая, выдержав удары времени, превратила свои трещины в убежище цвета.

Под влиянием этого камня Маяк содрогнулся. Его стены завибрировали, отпуская тяжесть древних карт и начертанных имён, которые забвение не смогло стереть. Тогда он понял, что никогда не ждал корабля — он ждал того, кто сможет прочесть его историю без слов. Его каменное сердце издало мягкий хруст; оно не ломалось — оно пробуждалось. Словно воздух вновь нашёл свой путь, Маяк наконец решился выдохнуть.`,
            es: `Ella abrió sus manos. En sus palmas descansaba un ópalo en bruto, una pieza de roca viva que parecía haber robado los colores que la niebla le negó al Faro durante siglos. Al contacto con la luz ámbar, la gema se encendió desde adentro, revelando destellos de atardeceres que él creía olvidados. Aquel objeto era el espejo de su propia alma: una estructura que, tras ser golpeada por el tiempo, transformó sus fracturas en un refugio de color.

Bajo el influjo de esa piedra, el Faro se estremeció. Sus paredes vibraron, dejando escapar el peso de mapas antiguos y nombres grabados que el olvido no logró borrar. Comprendió entonces que nunca esperó a un barco, sino a alguien capaz de leer su historia sin palabras. Su corazón de piedra dio un crujido dulce; no se estaba rompiendo, estaba despertándose. Como si el aire volviera a encontrar su camino, se atrevió, finalmente, a exhalar.`
        }
    },
    {
        id: 7,
        author: 'ilya',
        text: {
            ru: `Этот выдох обернулся ударной волной. Стекло фонаря задрожало, и на мгновение янтарный свет погас, оставив Маяк в кромешной тьме.

Но это была не холодная тьма. Это была тёплая, бархатная тьма утробы — тишина перед первым ударом сердца.

В этой тишине опал в её руках начал сиять. Не отражённым светом, а собственным. Мягкое, переливчатое сияние заполнило башню танцующими тенями цветов, которым нет названия.

Маяк, всегда смотревший наружу, на пустой горизонт, впервые заглянул внутрь себя. И увидел, что он больше не пуст.

Старый механизм остановился. Ему больше не нужно было вращаться. Время Поиска закончилось. Теперь начиналось время Творения.`,
            es: `Ese exhalar se convirtió en una onda expansiva. El vidrio de la linterna tembló, y por un instante, la luz ámbar se apagó, dejando al Faro en la oscuridad total.

Pero no era una oscuridad fría. Era la oscuridad cálida y aterciopelada de un útero, el silencio antes del primer latido.

En ese silencio, el ópalo en sus manos comenzó a brillar. No con luz reflejada, sino con luz propia. Un resplandor suave, iridiscente, que llenó la torre de sombras danzantes de colores que no tienen nombre.

El Faro, que siempre había mirado hacia afuera, hacia el horizonte vacío, por primera vez miró hacia adentro. Y vio que ya no estaba vacío.

El viejo mecanismo se detuvo. Ya no necesitaba girar. El tiempo de la búsqueda había terminado. Ahora comenzaba el tiempo de la Creación.`
        },
    },
    {
        id: 8,
        author: 'camila',
        text: {
            ru: `Наблюдая, как драгоценный камень в её руках словно обретает собственную жизнь, вопрос пронзил её кровь электрическим разрядом: а что, если это сияние... и есть его голос?

С необъяснимой уверенностью она поместила опал в сердце фонаря. Камень источал мягкое мерцание звёздного неба, и его свет становился всё ярче.

Маяк заговорил через эти цвета, проецируя на стены из слоновой кости сцены, которые двигались и дышали. Он пытался говорить с ней так, как слова никогда не позволяли; огни танцевали по его воле, рисуя на камне новый язык, который могла прочесть только она.

В тот момент она почувствовала, что магия этого мгновения — не бред, а окончательный ответ на поиск, сопровождавший её всю жизнь. Глядя на цвета, проецируемые на её кожу, она обратилась в пустоту: — Ты тоже чувствуешь... что это конец нашего одиночества? —`,
            es: `Mientras ella observaba cómo la piedra preciosa en sus manos parecía cobrar vida propia, una pregunta llegó como una descarga eléctrica por su sangre: ¿y si este brillo... fuera su voz?

Con una extraña certeza, colocó el ópalo en el corazón de la linterna. La piedra emanó el titilo suave de un cielo estrellado y su luz se volvió, poco a poco, más intensa.

El Faro comenzó a hablar a través de esos colores, proyectando sobre las paredes de marfil escenas que se movían y respiraban. Estaba tratando de comunicarse con ella de una forma que las palabras nunca permitieron; las luces danzaban bajo su dirección, dibujando en la piedra un lenguaje nuevo que solo ella podía leer.

En ese momento, sintió que la magia de aquel instante no era un delirio, sino la respuesta definitiva a una búsqueda que la había acompañado toda su vida. Mirando los colores proyectados en su piel, lanzó una pregunta al aire: —¿Tú también sientes... que este es el final de nuestra soledad?—`
        }
    },
    {
        id: 9,
        author: 'ilya',
        text: {
            ru: `Маяк не ответил словами. Они ему не были нужны. Вместо этого свет опала пульсировал один раз — глубоким, гулким ударом, от которого каменный пол под её ногами мягко завибрировал.

Цвета, проецируемые на стены, перестали танцевать хаотично. Внезапно они скользнули к ней, обволакивая, как тёплый плащ, как объятие, сотканное из чистого света и безусловного принятия. Холод и сырость, веками населявшие башню, исчезли без следа, сменившись ароматом тёплого дерева и спокойного моря.

И в этом светящемся объятии ответ впечатался прямо в её сердце — ясный и безоговорочный, не оставляющий места для сомнений:

«Это не просто конец нашего одиночества. Это начало всего».

Старый механизм перестал быть двигателем выживания. Маяк, некогда бывший холодной каменной темницей на краю мира, только что превратился в самое живое и безопасное место во вселенной. Потому что впервые свет не искал ничего в тумане. Свет нашёл её.`,
            es: `El Faro no usó palabras para responder. No las necesitaba. En lugar de eso, la luz del ópalo pulsó una vez, con un latido profundo y resonante que hizo vibrar suavemente el suelo de piedra bajo los pies de ella.

Los colores que se proyectaban en las paredes dejaron de danzar al azar. De pronto, se deslizaron hacia ella, envolviéndola como un manto cálido, como un abrazo hecho de luz pura y absoluta aceptación. El frío y la humedad que durante siglos habían habitado la torre se desvanecieron por completo, reemplazados por el aroma a madera cálida y a un mar en calma.

Y en ese abrazo luminoso, la respuesta se grabó directamente en su corazón, clara y rotunda, sin dejar espacio a la duda:

"No es solo el final de nuestra soledad. Es el principio de todo".

El viejo mecanismo ya no era un motor de supervivencia. El Faro, que alguna vez fue una fría prisión de piedra al borde del mundo, acababa de convertirse en el lugar más vivo y seguro del universo. Porque por primera vez, la luz no buscaba nada en la niebla. La luz la había encontrado a ella.`
        }
    },
];
