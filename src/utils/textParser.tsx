/**
 * Text Parser Utility
 * Parses markdown-like text into styled segments for typewriter effect
 */

/** Text segment type: plain text or formatted */
export type TextSegment =
    | { type: 'plain'; text: string }
    | { type: 'bold'; text: string }
    | { type: 'italic'; text: string }
    | { type: 'highlight'; text: string };

/** Parses text into segments without rendering */
export function parseTextToSegments(text: string): TextSegment[] {
    const segments: TextSegment[] = [];
    let remaining = text;

    const patterns: { regex: RegExp; type: 'bold' | 'italic' | 'highlight' }[] = [
        { regex: /\*\*(.+?)\*\*/, type: 'bold' },
        { regex: /\*(.+?)\*/, type: 'italic' },
        { regex: /\{\{(.+?)\}\}/, type: 'highlight' }
    ];

    while (remaining.length > 0) {
        let earliestMatch: { index: number; fullLength: number; content: string; type: 'bold' | 'italic' | 'highlight' } | null = null;

        for (const { regex, type } of patterns) {
            const match = remaining.match(regex);
            if (match && match.index !== undefined) {
                if (!earliestMatch || match.index < earliestMatch.index) {
                    earliestMatch = {
                        index: match.index,
                        fullLength: match[0].length,
                        content: match[1],
                        type
                    };
                }
            }
        }

        if (earliestMatch) {
            if (earliestMatch.index > 0) {
                segments.push({ type: 'plain', text: remaining.slice(0, earliestMatch.index) });
            }
            segments.push({ type: earliestMatch.type, text: earliestMatch.content });
            remaining = remaining.slice(earliestMatch.index + earliestMatch.fullLength);
        } else {
            segments.push({ type: 'plain', text: remaining });
            break;
        }
    }

    return segments;
}

/** Renders segments with respect to visible character count */
export function renderSegmentsWithLength(segments: TextSegment[], visibleLength: number): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    let consumed = 0;

    for (let i = 0; i < segments.length && consumed < visibleLength; i++) {
        const seg = segments[i];
        const segLen = seg.text.length;
        const remaining = visibleLength - consumed;
        const showLen = Math.min(segLen, remaining);
        const displayText = seg.text.slice(0, showLen);

        if (displayText.length === 0) continue;

        switch (seg.type) {
            case 'plain':
                result.push(displayText);
                break;
            case 'bold':
                result.push(<strong key={i} className="font-bold">{displayText}</strong>);
                break;
            case 'italic':
                result.push(<em key={i} className="italic">{displayText}</em>);
                break;
            case 'highlight':
                result.push(
                    <span
                        key={i}
                        className="font-semibold"
                        style={{
                            color: '#d4a574',
                            textShadow: '0 0 8px rgba(212, 165, 116, 0.4)'
                        }}
                    >
                        {displayText}
                    </span>
                );
                break;
        }

        consumed += showLen;
    }

    return result;
}

/** Gets total visible text length (without markup) */
export function getVisibleTextLength(segments: TextSegment[]): number {
    return segments.reduce((acc, seg) => acc + seg.text.length, 0);
}
