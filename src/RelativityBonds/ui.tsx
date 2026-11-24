import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
// CLEAN SINGLE-FOCUS PAGE HEADER
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
// CINEMA-GRADE SCIENTIST PORTRAIT CARD (Shown cleanly whenever a scientist is named!)
// ===========================================================================
export const ScientistPortraitCard: React.FC<{
  src: string;
  name: string;
  subtitle: string;
  credit?: string;
  color?: string;
  width?: number;
  photoHeight?: number;
  objectPosition?: string;
  delay?: number;
}> = ({
  src,
  name,
  subtitle,
  credit,
  color = C.gold,
  width = 360,
  photoHeight = 380,
  objectPosition = "50% 20%",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16, stiffness: 105 } });
  const zoom = interpolate(frame, [delay, delay + 260], [1.0, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width,
        borderRadius: 28,
        overflow: "hidden",
        background: "rgba(7, 15, 36, 0.94)",
        border: `3px solid ${color}`,
        boxShadow: `${glow(color, 12)}, 0 22px 58px rgba(0,0,0,0.85)`,
        opacity: sp,
        transform: `translateY(${(1 - sp) * 28}px)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: photoHeight, overflow: "hidden", background: "#060c1e" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            transform: `scale(${zoom})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(4,8,20,0) 68%, rgba(7,15,36,0.96) 100%)",
          }}
        />
      </div>
      <div style={{ padding: "14px 22px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 28, color: C.white, lineHeight: 1.15 }}>
          {name}
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 17, color, letterSpacing: 1.2, marginTop: 6 }}>
          {subtitle}
        </div>
        {credit && (
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 13, color: C.dim, marginTop: 5, opacity: 0.78 }}>
            {credit}
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================================================
// SEAMLESS PHOTOREALISTIC AI STUDIO PLATE WRAPPER
// ===========================================================================
export const PhotoPlate: React.FC<{
  src: string;
  width?: number;
  height?: number;
  borderColor?: string;
  filterCss?: string;
  kenBurnsTo?: number;
  children?: React.ReactNode;
}> = ({
  src,
  width = 1480,
  height = 720,
  borderColor = "rgba(62, 224, 255, 0.3)",
  filterCss,
  kenBurnsTo = 1.08,
  children,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 280], [1.0, kenBurnsTo], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 32,
        overflow: "hidden",
        border: `2.5px solid ${borderColor}`,
        boxShadow: "0 26px 75px rgba(0,0,0,0.88)",
        background: "#040814",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          filter: filterCss,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(4,8,20,0) 54%, rgba(4,8,20,0.68) 86%, rgba(4,8,20,0.94) 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

// ===========================================================================
// NATURAL MIND-BLOWN LIKE PROMPT TOAST
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
        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 23, color: clicked ? C.gold : C.white }}>
          {label}
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: C.dim, letterSpacing: 1.5, marginTop: 2 }}>
          {clicked ? "LIKED · THANK YOU!" : "HELPS MORE PEOPLE SEE THIS"}
        </div>
      </div>
    </div>
  );
};
