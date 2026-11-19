import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, glow, INTER, MONO } from "./theme";

// ---------------------------------------------------------------------------
// Background: deep navy gradient, drifting grid, floating dust, vignette
// ---------------------------------------------------------------------------
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 80;
  const dust = React.useMemo(
    () =>
      new Array(70).fill(0).map((_, i) => ({
        x: random(`dx${i}`) * 1920,
        y: random(`dy${i}`) * 1080,
        r: 0.6 + random(`dr${i}`) * 1.8,
        sp: 0.05 + random(`ds${i}`) * 0.25,
        o: 0.15 + random(`do${i}`) * 0.4,
      })),
    [],
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${C.bg1} 0%, ${C.bg0} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {dust.map((d, i) => (
          <circle
            key={i}
            cx={(d.x + frame * d.sp * 2) % 1920}
            cy={(d.y - frame * d.sp + 1080) % 1080}
            r={d.r}
            fill={C.cyan}
            opacity={d.o * (0.6 + 0.4 * Math.sin(frame / 30 + i))}
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Appear: spring in at `at`, optional fade-out at `out` (frames, local)
// ---------------------------------------------------------------------------
export const useAppear = (at: number, out?: number, outLen = 10) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({
    frame: frame - at,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const o =
    out === undefined
      ? 1
      : interpolate(frame, [out, out + outLen], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return { p: frame < at ? 0 : inn, o: (frame < at ? 0 : 1) * o, frame };
};

export const Appear: React.FC<{
  at: number;
  out?: number;
  from?: "up" | "down" | "left" | "right" | "scale";
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, out, from = "up", dist = 40, style, children }) => {
  const { p, o } = useAppear(at, out);
  const d = (1 - p) * dist;
  const t =
    from === "up"
      ? `translateY(${d}px)`
      : from === "down"
        ? `translateY(${-d}px)`
        : from === "left"
          ? `translateX(${-d}px)`
          : from === "right"
            ? `translateX(${d}px)`
            : `scale(${0.6 + 0.4 * p})`;
  return (
    <div style={{ opacity: Math.min(p * 1.4, 1) * o, transform: t, ...style }}>
      {children}
    </div>
  );
};

// Fades a whole scene in/out over its local window.
export const SceneFade: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  zoom?: boolean;
}> = ({ from, to, children, zoom = true }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 12) return null;
  const o = interpolate(frame, [from, from + 10, to, to + 12], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = zoom
    ? interpolate(frame, [from, to + 12], [1.0, 1.045], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
export const BigText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  glowColor?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 96, color = C.white, glowColor, weight = 900, style }) => (
  <div
    style={{
      fontFamily: INTER,
      fontWeight: weight,
      fontSize: size,
      color,
      letterSpacing: -size * 0.025,
      lineHeight: 1.05,
      textShadow: glowColor
        ? glow(glowColor, 16)
        : "0 6px 30px rgba(0,0,0,0.8)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.cyan,
  style,
}) => (
  <div
    style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: 6,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

// Typewriter text
export const Typed: React.FC<{
  text: string;
  at: number;
  cps?: number;
  style?: React.CSSProperties;
  cursor?: boolean;
}> = ({ text, at, cps = 28, style, cursor = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - at) / fps) * cps));
  const shown = text.slice(0, Math.min(text.length, n));
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {shown}
      {cursor && (n < text.length || blink) ? (
        <span style={{ opacity: 0.9 }}>▌</span>
      ) : null}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Panel (glass card)
// ---------------------------------------------------------------------------
export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  border?: string;
}> = ({ children, style, border = C.panelBorder }) => (
  <div
    style={{
      background: C.panel,
      border: `1.5px solid ${border}`,
      borderRadius: 22,
      boxShadow: `0 20px 60px rgba(0,0,0,0.55), inset 0 0 40px rgba(62,224,255,0.05)`,
      backdropFilter: "blur(6px)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------
export type TermLine = {
  at: number;
  text: string;
  color?: string;
  prompt?: boolean;
  cps?: number;
};

export const Terminal: React.FC<{
  lines: TermLine[];
  width?: number;
  height?: number;
  title?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ lines, width = 860, height = 520, title = "mailhost — ssh", fontSize = 28, style }) => {
  const frame = useCurrentFrame();
  const visible = lines.filter((l) => frame >= l.at);
  const last = visible[visible.length - 1];
  return (
    <Panel style={{ width, height, overflow: "hidden", padding: 0, ...style }}>
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          borderBottom: `1px solid ${C.panelBorder}`,
          background: "rgba(62,224,255,0.05)",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
        ))}
        <div style={{ fontFamily: MONO, color: C.dim, fontSize: 18, marginLeft: 14 }}>{title}</div>
      </div>
      <div
        style={{
          padding: "22px 28px",
          fontFamily: MONO,
          fontSize,
          lineHeight: 1.55,
          color: C.white,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: height - 48 - 44,
        }}
      >
        {visible.slice(-9).map((l, i) => (
          <div key={`${l.at}-${i}`} style={{ color: l.color ?? C.white, whiteSpace: "pre" }}>
            {l.prompt ? <span style={{ color: C.green }}>$ </span> : null}
            <Typed text={l.text} at={l.at} cps={l.cps ?? (l.prompt ? 26 : 200)} cursor={l === last && l.prompt} />
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ---------------------------------------------------------------------------
// Chapter card: big number + title, shown at chapter start
// ---------------------------------------------------------------------------
export const ChapterCard: React.FC<{ num: number; title: string; len?: number }> = ({
  num,
  title,
  len = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame > len + 15) return null;
  const p = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const o = interpolate(frame, [len, len + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line = interpolate(frame, [4, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: o,
        background: `rgba(4,8,20,${0.98 * o})`,
        backdropFilter: `blur(${Math.round(14 * o)}px)`,
      }}
    >
      <div style={{ textAlign: "center", transform: `translateY(${(1 - p) * 30}px)` }}>
        <Kicker style={{ fontSize: 30, opacity: p }}>Chapter {num < 10 ? `0${num}` : num}</Kicker>
        <div
          style={{
            width: 520 * line,
            height: 3,
            margin: "22px auto",
            background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
          }}
        />
        <BigText size={92} style={{ opacity: p }}>
          {title}
        </BigText>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Lower third
// ---------------------------------------------------------------------------
export const LowerThird: React.FC<{ at: number; out: number; title: string; sub: string }> = ({
  at,
  out,
  title,
  sub,
}) => {
  const { p, o } = useAppear(at, out);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        bottom: 120,
        opacity: o,
        transform: `translateX(${(1 - p) * -60}px)`,
        display: "flex",
        alignItems: "stretch",
        gap: 22,
      }}
    >
      <div style={{ width: 6, background: C.gold, boxShadow: glow(C.gold, 8), borderRadius: 3 }} />
      <div>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 52, color: C.white }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: C.gold, letterSpacing: 3 }}>{sub}</div>
      </div>
    </div>
  );
};

export const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", ...style }}>{children}</AbsoluteFill>
);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const prog = (frame: number, a: number, b: number, ease = true) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.inOut(Easing.cubic) : undefined,
  });
