import React from "react";
import { C, svgGlow } from "./theme";

type P = { size?: number; color?: string; style?: React.CSSProperties };

const Svg: React.FC<P & { children: React.ReactNode; vb?: string }> = ({
  size = 200,
  color = C.cyan,
  style,
  children,
  vb = "0 0 100 100",
}) => (
  <svg
    width={size}
    height={size}
    viewBox={vb}
    fill="none"
    stroke={color}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: svgGlow(color, 4), overflow: "visible", ...style }}
  >
    {children}
  </svg>
);

export const PhoneIcon: React.FC<P & { lift?: number }> = ({ lift = 0, ...p }) => (
  <Svg {...p}>
    <g transform={`translate(0 ${-lift * 10}) rotate(${-lift * 12} 50 30)`}>
      <path d="M14 30 Q14 18 30 18 L70 18 Q86 18 86 30 L86 34 Q86 40 78 40 L68 40 Q62 40 62 34 L62 28 L38 28 L38 34 Q38 40 32 40 L22 40 Q14 40 14 34 Z" />
    </g>
    <path d="M24 48 L76 48 L84 82 Q85 88 78 88 L22 88 Q15 88 16 82 Z" />
    <circle cx={50} cy={68} r={11} />
    <circle cx={50} cy={68} r={3} fill={p.color ?? C.cyan} />
  </Svg>
);

export const ServerIcon: React.FC<P & { label?: string; blink?: number }> = ({ blink = 0, ...p }) => (
  <Svg {...p}>
    {[12, 40, 68].map((y, i) => (
      <g key={y}>
        <rect x={14} y={y} width={72} height={22} rx={4} />
        <circle cx={26} cy={y + 11} r={3} fill={(Math.floor(blink / 6) + i) % 3 === 0 ? C.green : "none"} />
        <line x1={40} y1={y + 11} x2={76} y2={y + 11} opacity={0.5} />
      </g>
    ))}
  </Svg>
);

export const LaptopIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x={20} y={20} width={60} height={42} rx={4} />
    <path d="M8 74 L92 74 L86 82 L14 82 Z" />
    <line x1={30} y1={34} x2={60} y2={34} opacity={0.6} />
    <line x1={30} y1={44} x2={70} y2={44} opacity={0.6} />
  </Svg>
);

export const EnvelopeIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x={12} y={24} width={76} height={52} rx={5} />
    <path d="M12 28 L50 56 L88 28" />
  </Svg>
);

export const PlaneIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8 52 L92 18 L66 86 L50 60 Z" />
    <path d="M50 60 L92 18" />
  </Svg>
);

export const RouterIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x={14} y={50} width={72} height={26} rx={6} />
    <line x1={30} y1={50} x2={22} y2={24} />
    <line x1={70} y1={50} x2={78} y2={24} />
    <circle cx={30} cy={63} r={3} fill={p.color ?? C.cyan} />
    <circle cx={44} cy={63} r={3} fill={p.color ?? C.cyan} />
  </Svg>
);

export const BookIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M18 18 L46 22 L46 86 L18 82 Z" />
    <path d="M82 18 L54 22 L54 86 L82 82 Z" />
    <line x1={24} y1={36} x2={40} y2={38} opacity={0.6} />
    <line x1={24} y1={48} x2={40} y2={50} opacity={0.6} />
    <line x1={60} y1={38} x2={76} y2={36} opacity={0.6} />
  </Svg>
);

export const Stopwatch: React.FC<P & { t: number; max?: number; danger?: boolean }> = ({
  t,
  max = 1,
  danger = false,
  ...p
}) => {
  const col = danger ? C.red : p.color ?? C.cyan;
  const a = (Math.min(t, max) / max) * Math.PI * 2;
  return (
    <Svg {...p} color={col}>
      <circle cx={50} cy={56} r={34} />
      <line x1={50} y1={14} x2={50} y2={22} />
      <line x1={42} y1={12} x2={58} y2={12} />
      <path
        d={`M50 56 L50 22 A34 34 0 ${a > Math.PI ? 1 : 0} 1 ${50 + 34 * Math.sin(a)} ${56 - 34 * Math.cos(a)} Z`}
        fill={col}
        fillOpacity={0.18}
        stroke="none"
      />
      <line x1={50} y1={56} x2={50 + 28 * Math.sin(a)} y2={56 - 28 * Math.cos(a)} strokeWidth={4} />
      <circle cx={50} cy={56} r={3} fill={col} />
    </Svg>
  );
};

export const TowerIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M50 14 L30 90 M50 14 L70 90 M36 66 L64 66 M40 46 L60 46" />
    <path d="M38 22 Q50 12 62 22 M30 16 Q50 0 70 16" opacity={0.7} />
  </Svg>
);
