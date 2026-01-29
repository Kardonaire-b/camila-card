/**
 * Lighthouse SVG Component
 * An animated lighthouse scene with dynamic horizon/time-of-day effects
 */

import { memo, useMemo } from 'react';
import type { Horizon } from '../../config';

interface LighthouseSVGProps {
    horizon: Horizon;
}

const LighthouseSVG = memo(function LighthouseSVG({ horizon }: LighthouseSVGProps) {
    const isNight = horizon === "night";
    const isDay = horizon === "day";
    const isDawn = horizon === "dawn";
    const isSunset = horizon === "sunset";

    const BEAM_APEX_X = 161;
    const BEAM_APEX_Y = 112;
    const BEAM_LEN = 175;
    const BEAM_SPAN = isNight ? 58 : 42;
    const BEAM_OPA = isNight ? 0.62 : 0.36;
    const BEAM_COL = isNight ? "#fff3cf" : "#fff8e1";

    const stars = useMemo(
        () => Array.from({ length: 22 }).map(() => ({
            cx: 20 + Math.random() * 280,
            cy: 20 + Math.random() * 80,
            r: Math.random() * 1.2 + 0.4,
        })),
        []
    );

    return (
        <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="Lighthouse scene">
            <defs>
                <linearGradient id="seaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isNight ? "#4a5568" : isSunset ? "#fbbf24" : isDawn ? "#fcd5ce" : "#7dd3fc"} stopOpacity={isNight ? 0.12 : 0.22} />
                    <stop offset="100%" stopColor={isNight ? "#2d3748" : isSunset ? "#fb7185" : isDawn ? "#f9a8d4" : "#38bdf8"} stopOpacity={isNight ? 0.28 : 0.42} />
                </linearGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <clipPath id="beamClip" clipPathUnits="userSpaceOnUse">
                    <rect x="0" y="36" width="320" height="130" rx="10" />
                </clipPath>
                <linearGradient id="beamFill" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor={BEAM_COL} stopOpacity="0" />
                    <stop offset="0.35" stopColor={BEAM_COL} stopOpacity={BEAM_OPA} />
                    <stop offset="0.65" stopColor={BEAM_COL} stopOpacity={BEAM_OPA} />
                    <stop offset="1" stopColor={BEAM_COL} stopOpacity="0" />
                </linearGradient>
                <filter id="beamSoft" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" />
                </filter>
            </defs>

            {isDay && <circle cx="260" cy="40" r="12" fill="#fff59d" opacity="0.9" />}
            {isDawn && <circle cx="260" cy="44" r="10" fill="#ffe082" opacity="0.85" />}
            {isSunset && <circle cx="60" cy="36" r="11" fill="#ffd166" opacity="0.85" />}
            {isNight && <circle cx="55" cy="35" r="9" fill="#f8fafc" opacity="0.9" />}

            {isNight && (
                <g fill="#ffffff" opacity="0.85">
                    {stars.map((s, i) => (
                        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
                    ))}
                </g>
            )}

            <rect x="0" y="150" width="320" height="90" fill="url(#seaFill)" />
            <path
                className="wave-animation"
                d="M0 170 C 40 165, 80 175, 120 170 C 160 165, 200 175, 240 170 C 280 165, 320 175, 360 170 L 360 240 L 0 240 Z"
                fill={isNight ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.20)"}
                style={{ filter: "blur(0.3px)" }}
            />

            <path d="M0 182 C 60 165, 80 210, 140 198 C 200 190, 260 210, 320 190 L 320 240 L 0 240 Z" fill="#2b344a" opacity="0.28" />
            <ellipse cx="160" cy="212" rx="18" ry="5" fill={isNight ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.12)"} />

            {isNight && (
                <g clipPath="url(#beamClip)">
                    <g transform={`translate(${BEAM_APEX_X}, ${BEAM_APEX_Y})`}>
                        <g className="beam-animation" style={{ transformOrigin: "0px 0px" }}>
                            <path
                                d={`M 0 0 L ${BEAM_LEN} ${-BEAM_SPAN / 2} L ${BEAM_LEN} ${BEAM_SPAN / 2} Z M 0 0 L ${-BEAM_LEN} ${-BEAM_SPAN / 2} L ${-BEAM_LEN} ${BEAM_SPAN / 2} Z`}
                                fill={BEAM_COL}
                                opacity={BEAM_OPA}
                                shapeRendering="geometricPrecision"
                            />
                        </g>
                    </g>
                </g>
            )}

            <g filter="url(#softGlow)">
                <g
                    transform="translate(160,210) scale(0.28) translate(-256,-472)"
                    style={{ filter: isNight ? "saturate(0.85) brightness(0.95)" : "saturate(0.95) brightness(1.04)" }}
                >
                    <path fill="#2FB49F" d="M304.266 91.162c0 26.657-21.609 28.266-48.266 28.266s-48.266-1.609-48.266-28.266S229.343 42.896 256 42.896s48.266 21.61 48.266 48.266z" />
                    <path fill="#E3E3E3" d="M200.679 419.659h110.642l-1.708-31.087H202.387z" />
                    <path fill="#A6A6A6" d="M309.967 395.015H202.033l-1.354 25h110.642z" />
                    <path fill="#E3E3E3" d="M204.275 354.213h103.45l-1.753-31.904h-99.944zM207.916 287.95h96.168l-1.708-31.087h-92.752zM213.265 190.6l-1.753 31.905h88.976l-1.753-31.905z" />
                    <path fill="#FF6650" d="M296.848 156.015h-81.696l-1.887 35h85.47zM209.624 257.015h92.752l-1.888-34h-88.976zM206.028 322.015h99.944l-1.888-34h-96.168zM202.387 389.015h107.226l-1.888-35h-103.45zM166.068 472.015h179.864l-3.888-64H169.956z" />
                    <path fill="#CF5341" d="M214.163 174.239h83.674l-.899-16.362h-81.876z" />
                    <path fill="#FFD161" d="M206.949 87.89h98.102v68.351h-98.102z" />
                    <path fill="#FFF" d="M219.93 89.526h72.14v66.715h-72.14z" />
                    <path fill="#FF6650" d="M311.393 166.058H200.607a8.181 8.181 0 0 1 0-16.362h110.786a8.181 8.181 0 0 1 0 16.362zM311.393 96.071H200.607a8.181 8.181 0 0 1 0-16.362h110.786a8.181 8.181 0 0 1 0 16.362z" />
                    <path fill="#4A4A4A" d="M240.991 257.015v-8.634c0-8.191 6.64-14.832 14.832-14.832h.354c8.191 0 14.832 6.64 14.832 14.832v8.634M238.886 322.015v-9.845c0-9.34 7.572-16.912 16.912-16.912h.403c9.34 0 16.912 7.572 16.912 16.912v9.845M235.943 389.015v-11.539c0-10.946 8.874-19.82 19.82-19.82h.473c10.946 0 19.82 8.874 19.82 19.82v11.539M227 472.015v-16.684c0-15.827 12.831-28.658 28.658-28.658h.684c15.827 0 28.658 12.831 28.658 28.658v16.684" />
                    <path fill="#E3E3E3" d="M267.592 44.896h-23.184a5.941 5.941 0 0 1 0-11.882h23.184a5.94 5.94 0 1 1 0 11.882z" />
                </g>
            </g>

            <g opacity="0.7" fill="#ffffff">
                <ellipse className="cloud-animation cloud-1" cx="60" cy="60" rx="22" ry="10" />
                <ellipse className="cloud-animation cloud-2" cx="84" cy="60" rx="16" ry="8" />
                <ellipse className="cloud-animation cloud-3" cx="102" cy="55" rx="14" ry="7" />
                <ellipse className="cloud-animation cloud-4" cx="250" cy="42" rx="18" ry="9" />
                <ellipse className="cloud-animation cloud-5" cx="270" cy="44" rx="12" ry="7" />
            </g>
        </svg>
    );
});

export default LighthouseSVG;
