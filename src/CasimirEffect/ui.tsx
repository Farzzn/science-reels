import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BigText, Kicker } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// TRANSIENT YEAR BADGE — Appears cleanly when a year is spoken, holds ~4.5s,
// then smoothly slides & fades away so the screen stays uncluttered!
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
}> = ({ kicker, kickerColor = C.cyan, top = 52, children }) => (
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
    <BigText size={52} style={{ marginTop: kicker ? 6 : 0, maxWidth: 1620, textAlign: "center" }}>
      {children}
    </BigText>
  </div>
);
