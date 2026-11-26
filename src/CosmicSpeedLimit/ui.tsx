import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// Deterministic PRNG (no external deps, ES2015 safe)
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface StarDef {
  x: number;
  y: number;
  r: number;
  alpha: number;
  color: string;
  drift: number;
}

const STAR_CACHE: Record<number, StarDef[]> = {};

function getStars(seed: number): StarDef[] {
  if (STAR_CACHE[seed]) return STAR_CACHE[seed];
  const rand = mulberry32(seed);
  const palette = ["#eef4ff", "#d4e7ff", "#ffecc8", "#b9dcff", "#ffffff"];
  const stars: StarDef[] = [];
  for (let i = 0; i < 115; i++) {
    stars.push({
      x: rand() * 1920,
      y: rand() * 1080,
      r: 0.75 + rand() * 1.55,
      alpha: 0.14 + rand() * 0.42,
      color: palette[Math.floor(rand() * palette.length)],
      drift: 0.025 + rand() * 0.065,
    });
  }
  STAR_CACHE[seed] = stars;
  return stars;
}

// ===========================================================================
// 1. SpaceBackground — Deep obsidian cosmos (#050a18) + subtle starfield
// ===========================================================================
export const SpaceBackground: React.FC<{ starSeed?: number }> = ({
  starSeed = 42,
}) => {
  const frame = useCurrentFrame();
  const stars = getStars(starSeed);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050a18",
        backgroundImage:
          "radial-gradient(ellipse 75% 65% at 50% 44%, rgba(16, 32, 74, 0.52) 0%, rgba(8, 16, 38, 0.35) 48%, rgba(5, 10, 24, 1) 100%)",
        overflow: "hidden",
      }}
    >
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {stars.map((s, idx) => {
          const x = (s.x - frame * s.drift + 3840) % 1920;
          return (
            <circle
              key={idx}
              cx={x}
              cy={s.y}
              r={s.r}
              fill={s.color}
              opacity={s.alpha}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. CleanStage — Full-screen crossfade wrapper for each scene beat
// ===========================================================================
export const CleanStage: React.FC<{
  from: number;
  to: number;
  fade?: number;
  children: React.ReactNode;
}> = ({ from, to, fade = 14, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 2) return null;

  const inO =
    from <= 2
      ? 1
      : interpolate(frame, [from, from + fade], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const outO = interpolate(frame, [to - fade, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(inO, outO);
  const scale = interpolate(inO, [0, 1], [0.992, 1]);

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. MinimalLabel — Clean floating 1-4 word anchor label (no heavy box)
// ===========================================================================
export const MinimalLabel: React.FC<{
  text: string;
  sub?: string;
  color?: string;
  x?: number;
  y?: number;
  align?: "left" | "center" | "right";
  size?: number;
  delay?: number;
}> = ({
  text,
  sub,
  color = C.white,
  x,
  y,
  align = "center",
  size = 34,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < delay - 1) return null;

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 125 },
  });
  const opacity = Math.min(1, p * 1.25);
  const dy = (1 - p) * 12;

  const isPositioned = x !== undefined || y !== undefined;
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0%";

  return (
    <div
      style={{
        position: isPositioned ? "absolute" : "relative",
        left: isPositioned ? x ?? 0 : undefined,
        top: isPositioned ? y ?? 0 : undefined,
        transform: isPositioned
          ? `translate(${tx}, ${dy}px)`
          : `translateY(${dy}px)`,
        opacity,
        textAlign: align,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: size,
          color,
          letterSpacing: 1.6,
          lineHeight: 1.1,
          textShadow: `0 4px 18px rgba(5, 10, 24, 0.96), ${glow(color, 10)}`,
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 600,
            fontSize: Math.max(16, Math.round(size * 0.52)),
            color: C.dim,
            letterSpacing: 2,
            marginTop: 6,
            textShadow: "0 3px 14px rgba(5, 10, 24, 0.96)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

// ===========================================================================
// 4. CleanPortrait — Sleek framed scientist portrait with Ken Burns drift
// ===========================================================================
export const CleanPortrait: React.FC<{
  src: string;
  name: string;
  year: string;
  credit?: string;
  accent?: string;
  width?: number;
  height?: number;
  objectPosition?: string;
  delay?: number;
}> = ({
  src,
  name,
  year,
  credit,
  accent = C.gold,
  width = 330,
  height = 440,
  objectPosition = "50% 20%",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (frame < delay - 1) return null;

  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 17, stiffness: 110 },
  });
  const zoomEnd = Math.max(delay + 180, durationInFrames);
  const zoom = interpolate(frame, [delay, zoomEnd], [1.0, 1.075], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: "#060d20",
        border: `2px solid ${accent}bb`,
        boxShadow: `0 22px 58px rgba(0, 0, 0, 0.85), 0 0 26px ${accent}33`,
        opacity: Math.min(1, p * 1.2),
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
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
          background:
            "linear-gradient(180deg, rgba(5,10,24,0) 52%, rgba(5,10,24,0.82) 78%, rgba(5,10,24,0.97) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 18,
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 18,
            color: accent,
            letterSpacing: 2.2,
            textShadow: glow(accent, 8),
          }}
        >
          {year}
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 26,
            color: C.white,
            lineHeight: 1.15,
            marginTop: 4,
            textShadow: "0 3px 14px rgba(0, 0, 0, 0.9)",
          }}
        >
          {name}
        </div>
        {credit && (
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 400,
              fontSize: 11,
              color: C.dim,
              opacity: 0.72,
              marginTop: 4,
            }}
          >
            {credit}
          </div>
        )}
      </div>
    </div>
  );
};

// ===========================================================================
// 5. CleanPhotoPlate — Full-bleed dark-vignetted AI studio plate
// ===========================================================================
export const CleanPhotoPlate: React.FC<{
  src: string;
  kenBurnsFrom?: number;
  kenBurnsTo?: number;
  dim?: number;
  children?: React.ReactNode;
}> = ({ src, kenBurnsFrom = 1.0, kenBurnsTo = 1.1, dim = 0.34, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(
    frame,
    [0, Math.max(120, durationInFrames)],
    [kenBurnsFrom, kenBurnsTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#050a18", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(5, 10, 24, ${dim})`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(5,10,24,0) 44%, rgba(5,10,24,0.62) 84%, rgba(5,10,24,0.92) 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6. CornerBadge — Compact transient corner date badge (~4s hold)
// ===========================================================================
export const CornerBadge: React.FC<{
  year: string;
  label: string;
  at: number;
  dur?: number;
  color?: string;
}> = ({ year, label, at, dur = 120, color = C.gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < at - 2 || frame > at + dur + 20) return null;

  const enterP = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const exitO = interpolate(frame, [at + dur, at + dur + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dy = (1 - enterP) * -22 - (1 - exitO) * 14;

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 52,
        zIndex: 40,
        opacity: Math.min(1, enterP * 1.3) * exitO,
        transform: `translateY(${dy}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 22px",
        borderRadius: 14,
        background: "rgba(5, 10, 24, 0.82)",
        border: `1.5px solid ${color}88`,
        boxShadow: `0 10px 28px rgba(0, 0, 0, 0.72), 0 0 18px ${color}28`,
      }}
    >
      <div
        style={{
          width: 4,
          height: 36,
          borderRadius: 4,
          backgroundColor: color,
          boxShadow: glow(color, 8),
        }}
      />
      <div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            color,
            letterSpacing: 2,
            lineHeight: 1.05,
          }}
        >
          {year}
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 600,
            fontSize: 14,
            color: C.white,
            letterSpacing: 1.6,
            marginTop: 2,
            opacity: 0.9,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// 7. LikePromptToast — Clean bottom-right like prompt for Chapter 3 bridge
// ===========================================================================
export const LikePromptToast: React.FC<{
  at: number;
  dur?: number;
  label?: string;
}> = ({ at, dur = 155, label = "Hit Like!" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < at - 2 || frame > at + dur + 20) return null;

  const enterP = spring({
    frame: Math.max(0, frame - at),
    fps,
    config: { damping: 15, stiffness: 125 },
  });
  const exitO = interpolate(frame, [at + dur, at + dur + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clicked = frame >= at + 24;
  const clickPop = spring({
    frame: Math.max(0, frame - (at + 24)),
    fps,
    config: { damping: 11, stiffness: 180 },
  });
  const ringR = interpolate(frame, [at + 24, at + 50], [16, 44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringO = interpolate(frame, [at + 24, at + 50], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 52,
        right: 64,
        zIndex: 50,
        opacity: Math.min(1, enterP * 1.35) * exitO,
        transform: `translateY(${(1 - enterP) * 26}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "13px 28px",
        borderRadius: 48,
        background: "rgba(5, 10, 24, 0.9)",
        border: `2px solid ${clicked ? C.gold : C.cyan}`,
        boxShadow: `${glow(clicked ? C.gold : C.cyan, 12)}, 0 12px 32px rgba(0, 0, 0, 0.78)`,
      }}
    >
      <svg
        width={40}
        height={40}
        viewBox="0 0 44 44"
        style={{ overflow: "visible" }}
      >
        {clicked && (
          <circle
            cx={22}
            cy={22}
            r={ringR}
            fill="none"
            stroke={C.gold}
            strokeWidth={3}
            opacity={ringO}
          />
        )}
        <g
          transform={`translate(22, 22) scale(${clicked ? 0.92 + 0.15 * clickPop : 1}) translate(-22, -22)`}
        >
          <path
            d="M14 20 V33 H9 V20 Z M18 33 H29.5 C31 33 32.3 32 32.7 30.6 L35 22.8 C35.5 21 34.1 19.2 32.2 19.2 H25.5 L26.8 13.4 C27.1 12 26 10.6 24.5 10.6 H23.6 L18 19.5 Z"
            fill={clicked ? C.gold : "none"}
            stroke={clicked ? C.gold : C.cyan}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 24,
          color: clicked ? C.gold : C.white,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ===========================================================================
// 8. KineticPunch — Cinematic full-screen kinetic word punch (2–3.5s)
// ===========================================================================
function clampUnit(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutPow3(t: number): number {
  const u = 1 - clampUnit(t);
  return 1 - u * u * u;
}

const BURST_ANGLES = [
  -174, -160, -146, -132, -118, -104, -76, -62, -48, -34, -20, -6,
  6, 20, 34, 48, 62, 76, 104, 118, 132, 146, 160, 174,
];

export const KineticPunch: React.FC<{
  word: string;
  sub?: string;
  color?: string;
  accent?: "cross" | "question" | "burst" | "none";
  size?: number;
}> = ({
  word,
  sub,
  color = C.gold,
  accent = "none",
  size = 170,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const dur = Math.max(24, durationInFrames);
  const progress = clampUnit(frame / dur);

  // Crisp punch spring + continuous monotonic push-in (0.94 -> 1.07, NEVER static!)
  const enterP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 185, mass: 0.85 },
  });
  const punchScale =
    interpolate(enterP, [0, 1], [0.84, 0.94]) + progress * 0.13;
  const wordOpacity = clampUnit(enterP * 1.4);

  // Ambient radial glow expanding monotonically behind typography
  const glowRadX = 38 + progress * 24;
  const glowRadY = 34 + progress * 22;

  // Sub-label delayed crisp reveal + monotonic tracking drift
  const subP = spring({
    frame: Math.max(0, frame - 7),
    fps,
    config: { damping: 16, stiffness: 140 },
  });
  const subOpacity = frame < 6 ? 0 : clampUnit(subP * 1.25);
  const subTracking = 5 + progress * 4.5;

  // Accent: cross — two crisp diagonal crimson slashes + radial shockwave rings
  const crossSlash1 = easeOutPow3((frame - 2) / 14);
  const crossSlash2 = easeOutPow3((frame - 9) / 14);
  const crossScale = 0.96 + progress * 0.14;
  const ring1P = easeOutPow3(frame / Math.max(28, dur * 0.65));
  const ring2P = easeOutPow3(Math.max(0, frame - 8) / Math.max(32, dur * 0.82));
  const slashLen = 460;

  // Accent: question — staggered expanding concentric question-pulse arcs
  const qArcCount = 5;

  // Accent: none — sleek horizontal light horizon sweep
  const barW = 140 + easeOutPow3(frame / Math.max(26, dur * 0.6)) * 680 + progress * 160;

  const isLongPhrase = word.length > 14;
  const effectiveSize =
    size === 170 && word.length > 16
      ? 118
      : size === 170 && word.length > 11
        ? 144
        : size;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "rgba(4, 8, 20, 0.92)",
      }}
    >
      {/* Expanding dark cinematic radial glow behind text */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(ellipse ${glowRadX}% ${glowRadY}% at 50% 50%, ${color}2e 0%, ${color}12 42%, rgba(4, 8, 20, 0.96) 82%)`,
          pointerEvents: "none",
        }}
      />

      {/* Dynamic Monotonic SVG Accent Backdrop */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <linearGradient
            id="cslPunchBar"
            gradientUnits="userSpaceOnUse"
            x1={960 - barW * 0.5}
            y1={540}
            x2={960 + barW * 0.5}
            y2={540}
          >
            <stop offset="0%" stopColor={color} stopOpacity={0} />
            <stop offset="50%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {accent === "cross" && (
          <g>
            {/* Radial shockwave rings */}
            <circle
              cx={960}
              cy={540}
              r={70 + ring1P * 420}
              fill="none"
              stroke={color}
              strokeWidth={4 * (1 - ring1P * 0.55)}
              opacity={0.72 * (1 - ring1P * 0.85)}
              style={{ filter: svgGlow(color, 10) }}
            />
            <circle
              cx={960}
              cy={540}
              r={36 + ring2P * 540}
              fill="none"
              stroke={C.red}
              strokeWidth={2.4}
              strokeDasharray="16 14"
              opacity={0.5 * (1 - ring2P * 0.82)}
            />
            {/* Thick dynamic diagonal cross behind text center */}
            <g
              transform={`translate(960, 540) scale(${crossScale})`}
              opacity={0.28 + 0.08 * (1 - progress)}
            >
              <line
                x1={-slashLen * 0.5}
                y1={-slashLen * 0.5}
                x2={slashLen * 0.5}
                y2={slashLen * 0.5}
                stroke={C.red}
                strokeWidth={34}
                strokeLinecap="round"
                strokeDasharray={`${slashLen * 1.45}`}
                strokeDashoffset={`${slashLen * 1.45 * (1 - crossSlash1)}`}
                style={{ filter: svgGlow(C.red, 14) }}
              />
              <line
                x1={slashLen * 0.5}
                y1={-slashLen * 0.5}
                x2={-slashLen * 0.5}
                y2={slashLen * 0.5}
                stroke={C.red}
                strokeWidth={34}
                strokeLinecap="round"
                strokeDasharray={`${slashLen * 1.45}`}
                strokeDashoffset={`${slashLen * 1.45 * (1 - crossSlash2)}`}
                style={{ filter: svgGlow(C.red, 14) }}
              />
            </g>
          </g>
        )}

        {accent === "question" && (
          <g>
            {/* Expanding glowing concentric question-pulse arcs */}
            {Array.from({ length: qArcCount }).map((_, idx) => {
              const startF = idx * Math.max(8, dur * 0.14);
              const localP = easeOutPow3((frame - startF) / Math.max(36, dur * 0.65));
              if (localP <= 0.005) return null;
              const r = 135 + idx * 55 + localP * 320;
              const op = (0.52 - idx * 0.06) * (1 - localP * 0.68);
              const rot = -35 + idx * 24 + localP * 22;
              return (
                <g key={idx} transform={`rotate(${rot} 960 540)`}>
                  <circle
                    cx={960}
                    cy={540}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={3.2 - idx * 0.35}
                    strokeDasharray={`${r * 0.95} ${r * 0.55} ${r * 0.45} ${r * 1.2}`}
                    strokeLinecap="round"
                    opacity={Math.max(0, op)}
                    style={idx < 2 ? { filter: svgGlow(color, 8) } : undefined}
                  />
                </g>
              );
            })}
          </g>
        )}

        {accent === "burst" && (
          <g>
            {/* Subtle expanding radial shock halo */}
            <circle
              cx={960}
              cy={540}
              r={120 + ring1P * 440}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              opacity={0.42 * (1 - ring1P * 0.8)}
            />
            {/* 24 monotonic outward radial speed lines */}
            {BURST_ANGLES.map((deg, idx) => {
              const rad = (deg * Math.PI) / 180;
              const tier = idx % 3;
              const rInner = 250 + tier * 52 + progress * 175;
              const len = (110 + tier * 65) * (0.45 + 0.55 * easeOutPow3(frame / 22)) + progress * 120;
              const rOuter = rInner + len;
              return (
                <line
                  key={deg}
                  x1={960 + Math.cos(rad) * rInner}
                  y1={540 + Math.sin(rad) * rInner}
                  x2={960 + Math.cos(rad) * rOuter}
                  y2={540 + Math.sin(rad) * rOuter}
                  stroke={color}
                  strokeWidth={tier === 0 ? 3.2 : 2}
                  strokeLinecap="round"
                  opacity={(tier === 0 ? 0.42 : 0.24) * (1 - progress * 0.35)}
                  style={tier === 0 ? { filter: svgGlow(color, 5) } : undefined}
                />
              );
            })}
          </g>
        )}

        {accent === "none" && (
          <g>
            <circle
              cx={960}
              cy={540}
              r={180 + progress * 240}
              fill="none"
              stroke={color}
              strokeWidth={1.8}
              opacity={0.22 * (1 - progress * 0.65)}
            />
            <line
              x1={960 - barW * 0.5}
              y1={540 + effectiveSize * 0.64}
              x2={960 + barW * 0.5}
              y2={540 + effectiveSize * 0.64}
              stroke="url(#cslPunchBar)"
              strokeWidth={3.5}
              strokeLinecap="round"
              opacity={0.78}
            />
          </g>
        )}
      </svg>

      {/* Giant Centered Kinetic Typography */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
          pointerEvents: "none",
          opacity: wordOpacity,
          transform: `scale(${punchScale})`,
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: effectiveSize,
            color: C.white,
            letterSpacing: isLongPhrase ? 2 : 5,
            lineHeight: 1.04,
            textAlign: "center",
            textTransform: "uppercase",
            maxWidth: 1720,
            whiteSpace: isLongPhrase ? "normal" : "nowrap",
            textShadow: `0 14px 48px rgba(4, 8, 20, 0.96), ${glow(color, 20)}`,
          }}
        >
          {word}
        </div>
        {sub && (
          <div
            style={{
              marginTop: 32,
              opacity: subOpacity,
              transform: `translateY(${(1 - subP) * 16}px)`,
              display: "inline-flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                width: 44 + progress * 26,
                height: 3,
                borderRadius: 2,
                backgroundColor: color,
                boxShadow: glow(color, 8),
              }}
            />
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: Math.max(24, Math.round(effectiveSize * 0.21)),
                color,
                letterSpacing: subTracking,
                textTransform: "uppercase",
                textShadow: `0 6px 24px rgba(4, 8, 20, 0.95), ${glow(color, 10)}`,
              }}
            >
              {sub}
            </div>
            <div
              style={{
                width: 44 + progress * 26,
                height: 3,
                borderRadius: 2,
                backgroundColor: color,
                boxShadow: glow(color, 8),
              }}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
