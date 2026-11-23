import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BigText, Kicker } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// TRANSIENT YEAR BADGE — Pops in cleanly when spoken, holds ~4.5s, vanishes!
// ===========================================================================
export const TransientYearBadge: React.FC<{
  year: string;
  location: string;
  at: number;
  dur?: number;
  color?: string;
}> = ({ year, location, at, dur = 135, color = C.gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < at - 2 || frame > at + dur + 18) return null;

  const enterP = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const exitO = interpolate(frame, [at + dur, at + dur + 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideY = (1 - enterP) * -28 - (1 - exitO) * 20;

  return (
    <div
      style={{
        position: "absolute",
        top: 38,
        left: 52,
        zIndex: 40,
        opacity: Math.min(1, enterP * 1.3) * exitO,
        transform: `translateY(${slideY}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "12px 28px",
        borderRadius: 18,
        background: "rgba(6, 12, 30, 0.94)",
        border: `2.5px solid ${color}`,
        boxShadow: `${glow(color, 12)}, 0 12px 32px rgba(0,0,0,0.7)`,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: color,
          boxShadow: glow(color, 8),
        }}
      />
      <div>
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 30, color, letterSpacing: 2, lineHeight: 1.05 }}>
          {year}
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 17, color: C.white, letterSpacing: 1.5, marginTop: 3 }}>
          {location}
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// CLEAN SINGLE-FOCUS PAGE HEADER (Never overflows, never crowds)
// ===========================================================================
export const PageHeader: React.FC<{
  kicker?: string;
  kickerColor?: string;
  top?: number;
  children: React.ReactNode;
}> = ({ kicker, kickerColor = C.cyan, top = 48, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      pointerEvents: "none",
      zIndex: 10,
    }}
  >
    {kicker && <Kicker color={kickerColor}>{kicker}</Kicker>}
    <BigText size={50} style={{ marginTop: kicker ? 6 : 0, maxWidth: 1620, textAlign: "center" }}>
      {children}
    </BigText>
  </div>
);

// ===========================================================================
// FRESH PAGE STAGE — Clean full-screen crossfade wrapper for one concept/page
// ===========================================================================
export const PageStage: React.FC<{
  from: number;
  to: number;
  fade?: number;
  children: React.ReactNode;
}> = ({ from, to, fade = 14, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 2) return null;

  const inO = from <= 2 ? 1 : interpolate(frame, [from, from + fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(frame, [to - fade, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(inO, outO);
  const scale = interpolate(inO, [0, 1], [0.985, 1]);

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// ===========================================================================
// CRISP FLOATING CALLOUT PILL (Short 2-6 word label — zero text walls!)
// ===========================================================================
export const CalloutPill: React.FC<{
  text: string;
  color?: string;
  bottom?: number;
  opacity?: number;
}> = ({ text, color = C.cyan, bottom = 58, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      bottom,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      opacity,
      pointerEvents: "none",
      zIndex: 12,
    }}
  >
    <div
      style={{
        padding: "13px 34px",
        borderRadius: 40,
        background: "rgba(6, 12, 30, 0.9)",
        border: `2px solid ${color}`,
        boxShadow: `${glow(color, 10)}, 0 10px 28px rgba(0,0,0,0.65)`,
        fontFamily: INTER,
        fontWeight: 800,
        fontSize: 27,
        color: C.white,
        letterSpacing: 0.4,
      }}
    >
      {text}
    </div>
  </div>
);

// ===========================================================================
// NATURAL MIND-BLOWN LIKE PROMPT TOAST — Crisp, sleek, zero cringe!
// ===========================================================================
export const LikePromptToast: React.FC<{
  at: number;
  dur?: number;
  label?: string;
}> = ({ at, dur = 165, label = "Mind blown? Hit Like!" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < at - 2 || frame > at + dur + 20) return null;

  const enterP = spring({ frame: Math.max(0, frame - at), fps, config: { damping: 14, stiffness: 120 } });
  const exitO = interpolate(frame, [at + dur, at + dur + 16], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Click pop happens 0.8s after appearing!
  const clicked = frame >= at + 24;
  const clickPop = spring({ frame: Math.max(0, frame - (at + 24)), fps, config: { damping: 10, stiffness: 180 } });
  const ringR = interpolate(frame, [at + 24, at + 48], [16, 46], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringO = interpolate(frame, [at + 24, at + 48], [0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 54,
        right: 68,
        zIndex: 50,
        opacity: Math.min(1, enterP * 1.4) * exitO,
        transform: `translateY(${(1 - enterP) * 32}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 30px",
        borderRadius: 50,
        background: "rgba(6, 14, 34, 0.94)",
        border: `2.5px solid ${clicked ? C.gold : C.cyan}`,
        boxShadow: `${glow(clicked ? C.gold : C.cyan, 14)}, 0 14px 34px rgba(0,0,0,0.75)`,
      }}
    >
      <svg width={44} height={44} viewBox="0 0 44 44" style={{ overflow: "visible" }}>
        {clicked && (
          <circle cx={22} cy={22} r={ringR} fill="none" stroke={C.gold} strokeWidth={3} opacity={ringO} />
        )}
        <g transform={`translate(22, 22) scale(${clicked ? 0.92 + 0.16 * clickPop : 1}) translate(-22, -22)`}>
          <path
            d="M14 20 V33 H9 V20 Z M18 33 H29.5 C31 33 32.3 32 32.7 30.6 L35 22.8 C35.5 21 34.1 19.2 32.2 19.2 H25.5 L26.8 13.4 C27.1 12 26 10.6 24.5 10.6 H23.6 L18 19.5 Z"
            fill={clicked ? C.gold : "none"}
            stroke={clicked ? C.gold : C.cyan}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <div>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 23, color: clicked ? C.gold : C.white, letterSpacing: 0.2 }}>
          {label}
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: C.dim, letterSpacing: 1.5, marginTop: 2 }}>
          {clicked ? "LIKED · THANK YOU!" : "HELPS MORE PEOPLE SEE THIS"}
        </div>
      </div>
    </div>
  );
};
