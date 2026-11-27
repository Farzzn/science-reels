import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import shortData from "../../public/onewaylight/short-words.json";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import {
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  MinimalClock,
  pad2,
  PhotonPacket,
  SpiralGalaxy,
} from "./visuals";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const ONE_WAY_LIGHT_SHORT_FRAMES = Math.ceil((shortData.duration + 0.55) * FPS);

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9']/g, "");

const scue = (phrase: string, offsetSec = 0): number => {
  const target = norm(phrase);
  for (let i = 0; i < SHORT_WORDS.length; i++) {
    let acc = "";
    for (let j = i; j < SHORT_WORDS.length && acc.length < target.length; j++) {
      acc += norm(SHORT_WORDS[j].w);
      if (acc === target) return Math.round((SHORT_WORDS[i].s + offsetSec) * FPS);
      if (!target.startsWith(acc)) break;
    }
  }
  return 0;
};

// ===========================================================================
// 9:16 CLEAN DARK-SPACE VERTICAL BACKGROUND (1080x1920)
// ===========================================================================
const VerticalSpaceBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const driftY = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, -38]);

  const stars = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 72; i++) {
      const h1 = Math.sin(i * 127.1 + 31.7) * 43758.5453;
      const h2 = Math.sin(i * 269.5 + 89.3) * 43758.5453;
      const h3 = Math.sin(i * 419.2 + 17.1) * 43758.5453;
      const fx = h1 - Math.floor(h1);
      const fy = h2 - Math.floor(h2);
      const fr = h3 - Math.floor(h3);
      out.push({ x: fx * 1080, y: fy * 1960, r: 1.0 + fr * 2.1, o: 0.14 + fr * 0.42 });
    }
    return out;
  }, []);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 38%, #0b1633 0%, #050a18 70%, #02050d 100%)",
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <g transform={`translate(0, ${driftY.toFixed(1)})`}>
          {stars.map((st, idx) => (
            <circle
              key={idx}
              cx={st.x}
              cy={st.y}
              r={st.r}
              fill="#d8e9ff"
              opacity={st.o}
            />
          ))}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, transparent 52%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CLEAN WORD-ALIGNED BURNED-IN CAPTIONS (SHORTS & REELS SAFE ZONE)
// ===========================================================================
const KEYWORD_SET = new Set([
  "nobody",
  "never",
  "oneway",
  "light",
  "mirror",
  "synchronized",
  "clocks",
  "mars",
  "half",
  "twenty",
  "instantaneously",
  "zero",
  "twelvetwenty",
  "einstein",
  "definition",
  "tilts",
  "andromeda",
  "eight",
  "days",
  "causality",
  "twelveminute",
  "channel",
]);

const ShortSubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const chunks = useMemo(() => {
    const out: { words: ShortWord[]; s: number; e: number }[] = [];
    let cur: ShortWord[] = [];
    for (let i = 0; i < SHORT_WORDS.length; i++) {
      const w = SHORT_WORDS[i];
      cur.push(w);
      const isEnd = /[.?!:"]$/.test(w.w) || cur.length >= 4;
      if (isEnd) {
        out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
        cur = [];
      }
    }
    if (cur.length) {
      out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    }
    return out;
  }, []);

  const activeChunk = useMemo(() => {
    for (let i = 0; i < chunks.length; i++) {
      const nextS = i + 1 < chunks.length ? chunks[i + 1].s : 999;
      if (t >= chunks[i].s - 0.1 && t < nextS) return chunks[i];
    }
    return chunks[chunks.length - 1];
  }, [chunks, t]);

  if (!activeChunk || t > shortData.duration + 0.3) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 235,
        paddingLeft: 56,
        paddingRight: 56,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 16,
          rowGap: 6,
          background: "rgba(5, 10, 24, 0.84)",
          border: "1.5px solid rgba(62, 224, 255, 0.28)",
          borderRadius: 24,
          padding: "16px 32px",
          maxWidth: 940,
          textAlign: "center",
          boxShadow: "0 14px 42px rgba(0,0,0,0.82)",
        }}
      >
        {activeChunk.words.map((w, idx) => {
          const isCurrent = t >= w.s - 0.04 && t <= w.e + 0.06;
          const isKey = KEYWORD_SET.has(norm(w.w));
          const col = isCurrent ? C.gold : isKey ? "#ffe082" : C.white;
          return (
            <span
              key={`${w.s}-${idx}`}
              style={{
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 48,
                lineHeight: 1.24,
                color: col,
                letterSpacing: 0.5,
                transform: isCurrent ? "scale(1.06)" : "scale(1)",
                display: "inline-block",
                textShadow: isCurrent
                  ? glow(C.gold, 12)
                  : "0 4px 16px rgba(0,0,0,0.95)",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// SHARED BEAT WRAPPER & TOP TAG
// ===========================================================================
const BeatWrap: React.FC<{
  from: number;
  to: number;
  fade?: number;
  children: React.ReactNode;
}> = ({ from, to, fade = 8, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 1) return null;
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
  return (
    <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>
      <Sequence from={from} durationInFrames={Math.max(20, to - from)}>
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};

const TopTag: React.FC<{
  text: string;
  sub?: string;
  color?: string;
}> = ({ text, sub, color = C.gold }) => (
  <div
    style={{
      position: "absolute",
      top: 205,
      left: 48,
      right: 48,
      textAlign: "center",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontWeight: 900,
        fontSize: 48,
        color,
        letterSpacing: 3,
        lineHeight: 1.12,
        textShadow: `0 6px 24px rgba(4,8,20,0.96), ${glow(color, 12)}`,
      }}
    >
      {text}
    </div>
    {sub && (
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 25,
          color: C.dim,
          letterSpacing: 3.5,
          marginTop: 10,
          textTransform: "uppercase",
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

// ===========================================================================
// BEAT 0: NEVER MEASURED (One-Way Speed of Light Hook)
// ===========================================================================
const Beat0NeverMeasured: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / Math.max(24, dur));
  const beamP = easeInOutCubic(p * 1.15);
  const crossP = easeOutCubic((p - 0.32) / 0.35);

  return (
    <AbsoluteFill>
      <TopTag
        text="NEVER MEASURED ✕"
        sub="ONE-WAY SPEED OF LIGHT"
        color={C.red}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        {/* Two Glowing Clocks Across Vertical Frame */}
        <MinimalClock
          cx={230}
          cy={860}
          r={112}
          hours={3}
          minutes={0}
          seconds={p * 12}
          color={C.cyan}
          label="CLOCK A"
          digital="03:00"
        />
        <MinimalClock
          cx={850}
          cy={860}
          r={112}
          hours={3}
          minutes={0}
          seconds={p * 12}
          color={C.red}
          warning
          questionMark
          label="CLOCK B"
          digital="??:??"
        />

        {/* One-Way Laser Attempt */}
        <line
          x1={355}
          y1={860}
          x2={725}
          y2={860}
          stroke={C.gold}
          strokeWidth={3}
          strokeDasharray="12 12"
          opacity={0.35}
        />
        <PhotonPacket
          id="sh0Beam"
          x1={355}
          y1={860}
          x2={725}
          y2={860}
          progress={beamP}
          color={C.gold}
          tailLen={170}
          label="c (ONE WAY) = ?"
        />

        {/* Dramatic Crimson Cross Slash */}
        {crossP > 0.02 && (
          <g transform="translate(540, 1185)" opacity={crossP}>
            <circle
              cx={0}
              cy={0}
              r={84 + crossP * 20}
              fill="rgba(255, 58, 92, 0.1)"
              stroke={C.red}
              strokeWidth={4}
              style={{ filter: svgGlow(C.red, 12) }}
            />
            <line
              x1={-52}
              y1={-52}
              x2={-52 + 104 * crossP}
              y2={-52 + 104 * crossP}
              stroke={C.red}
              strokeWidth={14}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.red, 14) }}
            />
            <line
              x1={52}
              y1={-52}
              x2={52 - 104 * crossP}
              y2={-52 + 104 * crossP}
              stroke={C.red}
              strokeWidth={14}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.red, 14) }}
            />
            <text
              x={0}
              y={148}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={34}
              letterSpacing={3}
            >
              0 EXPERIMENTS IN HISTORY
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 1: TWO-WAY MIRROR ROUND TRIP -> CIRCULAR SYNC TRAP
// ===========================================================================
const Beat1MirrorAndTrap: React.FC<{ trapAt: number; dur: number }> = ({
  trapAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const mOutP = easeInOutCubic(frame / Math.max(28, trapAt * 0.48));
  const mBackP = easeInOutCubic(
    (frame - trapAt * 0.48) / Math.max(28, trapAt * 0.5),
  );
  const trapP = easeOutCubic((frame - trapAt) / Math.max(26, (dur - trapAt) * 0.45));
  const trapRot = interpolate(
    frame,
    [trapAt, Math.max(trapAt + 30, dur)],
    [0, 58],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <TopTag
        text={frame >= trapAt ? "CIRCULAR TRAP ✕" : "TWO-WAY ONLY"}
        sub={frame >= trapAt ? "SYNC CLOCKS ⇄ MEASURE c" : "BOUNCED OFF A MIRROR"}
        color={frame >= trapAt ? C.red : C.cyan}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        {/* Top half: Single Clock + Mirror (fades out completely as Circular Trap locks in!) */}
        <g opacity={Math.max(0, 1 - trapP * 1.45)}>
          <MinimalClock
            cx={220}
            cy={820}
            r={104}
            hours={12}
            minutes={0}
            seconds={frame * 0.14}
            color={C.cyan}
            label="1 CLOCK"
          />
          <rect
            x={870}
            y={665}
            width={22}
            height={310}
            rx={8}
            fill="#7dd3fc"
            style={{ filter: svgGlow(C.cyan, 16) }}
          />
          <text
            x={881}
            y={635}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={26}
          >
            MIRROR
          </text>
          {mOutP > 0.01 && mBackP < 0.02 && (
            <PhotonPacket
              id="sh1Out"
              x1={340}
              y1={792}
              x2={862}
              y2={792}
              progress={mOutP}
              color={C.gold}
              tailLen={170}
              label="OUT"
            />
          )}
          {mBackP > 0.01 && (
            <PhotonPacket
              id="sh1Back"
              x1={862}
              y1={848}
              x2={340}
              y2={848}
              progress={mBackP}
              color={C.cyan}
              tailLen={170}
              label="ROUND TRIP"
            />
          )}
        </g>

        {/* Circular Dependency Trap Ring locking in */}
        {trapP > 0.02 && (
          <g
            transform={`translate(540, 1020) scale(${0.65 + 0.35 * trapP})`}
            opacity={trapP}
          >
            <g transform={`rotate(${trapRot})`}>
              <path
                d="M -215,-45 A 220,220 0 0,1 215,-45"
                fill="none"
                stroke={C.cyan}
                strokeWidth={12}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.cyan, 12) }}
              />
              <polyline
                points="182,-76 222,-40 176,-16"
                fill="none"
                stroke={C.cyan}
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 215,45 A 220,220 0 0,1 -215,45"
                fill="none"
                stroke={C.red}
                strokeWidth={12}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.red, 12) }}
              />
              <polyline
                points="-182,76 -222,40 -176,16"
                fill="none"
                stroke={C.red}
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <text
              x={0}
              y={-260}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={32}
            >
              NEED SYNCED CLOCKS
            </text>
            <text
              x={0}
              y={292}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={32}
            >
              NEED ONE-WAY SPEED
            </text>
            <text
              x={0}
              y={18}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={56}
              style={{ filter: svgGlow(C.gold, 12) }}
            >
              TRAP
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 2: VERTICAL KINETIC PUNCH — "HOW STRANGE?"
// ===========================================================================
const Beat2HowStrangePunch: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = clamp01(frame / Math.max(20, dur));
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 190 } });
  const sc = interpolate(pop, [0, 1], [0.84, 0.96]) + p * 0.1;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 48%, rgba(251, 191, 36, 0.2) 0%, rgba(4, 8, 20, 0.96) 72%)",
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        {[0, 1, 2, 3].map((k) => {
          const r = 170 + k * 90 + p * 180;
          return (
            <circle
              key={k}
              cx={540}
              cy={880}
              r={r}
              fill="none"
              stroke={C.gold}
              strokeWidth={4 - k * 0.6}
              strokeDasharray={`${r * 0.9} ${r * 0.55}`}
              opacity={(0.48 - k * 0.08) * (1 - p * 0.4)}
              transform={`rotate(${k * 35 + p * 28} 540 880)`}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          top: 760,
          left: 48,
          right: 48,
          textAlign: "center",
          transform: `scale(${sc})`,
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 132,
            color: C.white,
            lineHeight: 0.98,
            letterSpacing: 3,
            textShadow: `0 12px 44px rgba(0,0,0,0.95), ${glow(C.gold, 22)}`,
          }}
        >
          HOW
          <br />
          STRANGE?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 3: MARS CALL — c/2 OUT (20m) + INSTANT BACK (0s) = 12:20!
// ===========================================================================
const Beat3MarsInstant: React.FC<{ instantAt: number; dur: number }> = ({
  instantAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const outP = easeInOutCubic(frame / Math.max(40, instantAt - 4));
  const flashP = easeOutCubic(
    (frame - instantAt) / Math.max(20, (dur - instantAt) * 0.4),
  );
  const clockMin = interpolate(frame, [0, Math.max(30, instantAt)], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <TopTag
        text={flashP > 0.15 ? "0 SECONDS BACK!" : "EARTH ↔ MARS"}
        sub={flashP > 0.15 ? "BOTH CLOCKS READ 12:20 ✓" : "c/2 OUT (20 MIN) · ∞ BACK (0s)"}
        color={flashP > 0.15 ? "#4ade80" : C.gold}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <defs>
          <linearGradient
            id="sh3Instant"
            gradientUnits="userSpaceOnUse"
            x1={230}
            y1={930}
            x2={850}
            y2={930}
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor={C.cyan} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Earth & Mars */}
        <circle
          cx={210}
          cy={880}
          r={88}
          fill="#0b3a6e"
          stroke={C.cyan}
          strokeWidth={4.5}
          style={{ filter: svgGlow(C.cyan, 16) }}
        />
        <text x={210} y={760} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={32}>
          EARTH
        </text>
        <text x={210} y={1035} textAnchor="middle" fill={flashP > 0.2 ? "#4ade80" : C.white} fontFamily={MONO} fontWeight={900} fontSize={52}>
          {`12:${pad2(clockMin)}`}
        </text>

        <circle
          cx={870}
          cy={880}
          r={76}
          fill="#882817"
          stroke="#fb923c"
          strokeWidth={4.5}
          style={{ filter: svgGlow("#fb923c", 16) }}
        />
        <text x={870} y={760} textAnchor="middle" fill="#fb923c" fontFamily={MONO} fontWeight={900} fontSize={32}>
          MARS
        </text>
        <text x={870} y={1035} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={52}>
          {`12:${pad2(Math.max(0, clockMin - 10))}`}
        </text>

        <line x1={310} y1={880} x2={780} y2={880} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="12 12" opacity={0.35} />

        {/* Outbound Half-Speed Wave */}
        {flashP < 0.2 && (
          <PhotonPacket
            id="sh3Slow"
            x1={310}
            y1={858}
            x2={780}
            y2={858}
            progress={outP}
            color={C.red}
            tailLen={220}
            amp={20}
            waves={5}
            label="c / 2 · 20 MIN"
          />
        )}

        {/* Blazing Instantaneous Return Beam */}
        {flashP > 0.02 && (
          <g opacity={flashP}>
            <line
              x1={310}
              y1={906}
              x2={780}
              y2={906}
              stroke="url(#sh3Instant)"
              strokeWidth={12}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.cyan, 18) }}
            />
            <rect
              x={210}
              y={1140}
              width={660}
              height={110}
              rx={24}
              fill="#071024"
              stroke="#4ade80"
              strokeWidth={4}
              style={{ filter: svgGlow("#4ade80", 14) }}
            />
            <text
              x={540}
              y={1210}
              textAnchor="middle"
              fill="#4ade80"
              fontFamily={MONO}
              fontWeight={900}
              fontSize={40}
              letterSpacing={2}
            >
              12:20 · 100% IDENTICAL ✓
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 4: EINSTEIN 1905 ARCHIVAL PRINTED PAPER ("BY DEFINITION")
// ===========================================================================
const Beat4EinsteinPaper: React.FC<{ byDefAt: number; dur: number }> = ({
  byDefAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, Math.max(30, dur)], [0.94, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hl1 = easeOutCubic((frame - 12) / 36);
  const ink = easeOutCubic((frame - byDefAt) / Math.max(20, dur - byDefAt - 6));

  return (
    <AbsoluteFill>
      <TopTag
        text="EINSTEIN · 1905"
        sub="NOT A PROOF — A CHOSEN RULE"
        color={C.gold}
      />

      {/* Archival 1905 Paper Card (centered cleanly in vertical sweet spot!) */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 68,
          right: 68,
          padding: "46px 50px",
          borderRadius: 16,
          background:
            "radial-gradient(ellipse at 50% 44%, #f8f1e1 0%, #eee2c6 62%, #dfd0ad 100%)",
          boxShadow: "0 30px 84px rgba(0,0,0,0.92)",
          transform: `scale(${zoom}) rotate(-1deg)`,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          color: "#1b150e",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid rgba(46,35,22,0.42)",
            paddingBottom: 14,
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 18, letterSpacing: 2, color: "#4a3b29", textTransform: "uppercase" }}>
              Annalen der Physik · 1905
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>
              § 1. Definition of Simultaneity
            </div>
          </div>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 46,
              overflow: "hidden",
              border: "3px solid #92400e",
            }}
          >
            <Img
              src={staticFile("onewaylight/portraits/einstein.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "56% 18%",
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 33,
            lineHeight: 1.56,
            paddingLeft: 20,
            borderLeft: "5px solid #991b1b",
          }}
        >
          <span
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(251, 191, 36, 0.48) 0%, rgba(251, 191, 36, 0.48) 100%)",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${Math.round(hl1 * 100)}% 85%`,
              backgroundPosition: "0 75%",
            }}
          >
            &ldquo;Equal light travel time from <i>A</i> to <i>B</i> and <i>B</i> to <i>A</i> is{" "}
            <b>not a physical fact</b> &mdash; it is a rule we establish{" "}
          </span>
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontWeight: 700,
              color: ink > 0.1 ? "#991b1b" : "#1b150e",
            }}
          >
            by definition.&rdquo;
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: -3,
                height: 6,
                width: `${Math.round(ink * 100)}%`,
                borderRadius: 3,
                backgroundColor: "#b91c1c",
              }}
            />
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 5: VERTICAL 3D ANDROMEDA PARADOX (5 km/h -> 8 FULL DAYS APART!)
// ===========================================================================
const Beat5AndromedaVertical: React.FC<{ daysAt: number; dur: number }> = ({
  daysAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / Math.max(40, dur));
  const sliceP = easeInOutCubic(frame / Math.max(36, daysAt));
  const badgeP = easeOutCubic((frame - daysAt) / 22);

  const ox = 165;
  const oy = 900;
  const colX = 875;
  const ex = ox + (colX - ox) * sliceP;
  const cyEnd = oy + (1135 - oy) * sliceP;
  const goEnd = oy + (640 - oy) * sliceP;

  return (
    <AbsoluteFill>
      <TopTag
        text={badgeP > 0.1 ? "8 DAYS APART!" : "WALKING TILTS \"NOW\""}
        sub={badgeP > 0.1 ? "5 KM/H ON EARTH → ANDROMEDA" : "2.5 MILLION LIGHT-YEARS AWAY"}
        color={badgeP > 0.1 ? C.gold : "#e879f9"}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <defs>
          <linearGradient id="sh5Cyan" gradientUnits="userSpaceOnUse" x1={ox} y1={oy} x2={colX} y2={1135}>
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.5} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id="sh5Gold" gradientUnits="userSpaceOnUse" x1={ox} y1={oy} x2={colX} y2={640}>
            <stop offset="0%" stopColor={C.gold} stopOpacity={0.5} />
            <stop offset="100%" stopColor={C.red} stopOpacity={0.62} />
          </linearGradient>
        </defs>

        {/* Earth Sidewalk Horizon (Left) */}
        <path
          d="M 45,985 Q 175,925 305,985"
          fill="none"
          stroke={C.cyan}
          strokeWidth={4}
          style={{ filter: svgGlow(C.cyan, 10) }}
        />
        <circle cx={145 - p * 22} cy={900} r={14} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 10) }} />
        <circle cx={195 + p * 22} cy={900} r={14} fill={C.gold} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={175} y={1035} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
          5 KM/H
        </text>

        {/* Andromeda 3D Vertical Time Column (Right) */}
        <SpiralGalaxy cx={colX} cy={885} scale={1.15} rotation={-20 + p * 18} opacity={0.85} />
        <rect
          x={colX - 86}
          y={540}
          width={172}
          height={680}
          fill="#c084fc"
          fillOpacity={0.14}
          stroke="#e879f9"
          strokeOpacity={0.45}
          strokeWidth={2.5}
        />
        <ellipse cx={colX} cy={540} rx={86} ry={22} fill="none" stroke="#e879f9" strokeWidth={2.5} />
        <ellipse cx={colX} cy={1220} rx={86} ry={22} fill="none" stroke="#c084fc" strokeOpacity={0.5} strokeWidth={2} />
        <text x={colX} y={502} textAnchor="middle" fill="#f0abfc" fontFamily={MONO} fontWeight={900} fontSize={24}>
          ANDROMEDA ↑
        </text>

        {/* Milestones inside Andromeda Time Column */}
        <ellipse cx={colX} cy={1070} rx={86} ry={20} fill={C.cyan} fillOpacity={0.22} stroke={C.cyan} strokeWidth={3} />
        <text x={colX} y={1077} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={800} fontSize={20}>
          VOTE
        </text>
        <ellipse cx={colX} cy={715} rx={86} ry={20} fill={C.red} fillOpacity={0.24} stroke={C.gold} strokeWidth={3} />
        <text x={colX} y={722} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={800} fontSize={20}>
          LAUNCH!
        </text>

        {/* Dual 3D Translucent Glass "NOW" Ribbons */}
        {sliceP > 0.02 && (
          <>
            <polygon
              points={`${ox - 12},${oy - 8} ${ex - 36},${cyEnd - 18} ${ex + 36},${cyEnd + 18} ${ox + 12},${oy + 8}`}
              fill="url(#sh5Cyan)"
              stroke={C.cyan}
              strokeWidth={3.2}
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
            <polygon
              points={`${ox - 12},${oy - 8} ${ex - 36},${goEnd - 18} ${ex + 36},${goEnd + 18} ${ox + 12},${oy + 8}`}
              fill="url(#sh5Gold)"
              stroke={C.gold}
              strokeWidth={3.2}
              style={{ filter: svgGlow(C.gold, 12) }}
            />
          </>
        )}

        {/* Blazing 8-Day Rift Badge */}
        {badgeP > 0.02 && (
          <g transform={`translate(560, 885) scale(${0.8 + 0.2 * badgeP})`} opacity={badgeP}>
            <rect
              x={-145}
              y={-44}
              width={290}
              height={88}
              rx={20}
              fill="#071024"
              stroke={C.gold}
              strokeWidth={4}
              style={{ filter: svgGlow(C.gold, 16) }}
            />
            <text x={0} y={14} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={40}>
              ≈ 8 DAYS
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 6: SELF-GENERATED YOUTUBE VIDEO END-CARD (Carter Option 1 + Title 1!)
// ===========================================================================
const Beat6YouTubeCardCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 16, stiffness: 115 } });
  const push = interpolate(frame, [0, Math.max(30, durationInFrames)], [0.96, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 195,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: pop,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 28,
            color: C.gold,
            letterSpacing: 4,
          }}
        >
          FULL 12:25 VISUAL BREAKDOWN
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 52,
            color: C.white,
            marginTop: 12,
            lineHeight: 1.12,
            maxWidth: 940,
          }}
        >
          Why &ldquo;Right Now&rdquo;{" "}
          <span style={{ color: C.cyan }}>Doesn&rsquo;t Exist</span>
        </div>

        {/* Self-Generated Pixel-Authentic YouTube Video Card */}
        <div
          style={{
            marginTop: 42,
            width: 920,
            borderRadius: 30,
            overflow: "hidden",
            background: "#ffffff",
            border: `4px solid ${C.gold}`,
            boxShadow: `${glow(C.gold, 22)}, 0 28px 72px rgba(0,0,0,0.92)`,
            transform: `scale(${(0.88 + 0.12 * pop) * push})`,
            textAlign: "left",
          }}
        >
          {/* 16:9 Carter Studio Thumbnail + Authentic YouTube Duration Badge */}
          <div style={{ position: "relative", width: "100%", height: 516, background: "#000000" }}>
            <Img
              src={staticFile("onewaylight/thumbnail.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* YouTube Timestamp Pill */}
            <div
              style={{
                position: "absolute",
                right: 18,
                bottom: 18,
                padding: "7px 14px",
                borderRadius: 10,
                backgroundColor: "rgba(0, 0, 0, 0.86)",
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 26,
                color: "#ffffff",
                letterSpacing: 0.6,
              }}
            >
              12:25
            </div>
            {/* Authentic Red YouTube Accent Bar along bottom edge */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 6,
                backgroundColor: "rgba(255,255,255,0.28)",
              }}
            >
              <div style={{ width: "22%", height: "100%", backgroundColor: "#e62429" }} />
            </div>
          </div>

          {/* Crisp YouTube Card White Footer with Exact Title */}
          <div
            style={{
              padding: "24px 28px 26px 28px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 18,
              backgroundColor: "#ffffff",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: INTER,
                  fontWeight: 800,
                  fontSize: 31,
                  lineHeight: 1.24,
                  color: "#0f0f0f",
                  letterSpacing: -0.3,
                }}
              >
                Why &ldquo;Right Now&rdquo; Doesn&rsquo;t Exist Across Space (And Nobody Has Measured Light One-Way)
              </div>
              <div
                style={{
                  fontFamily: INTER,
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#606060",
                  marginTop: 10,
                }}
              >
                Full Physics Breakdown · Watch Now
              </div>
            </div>
            {/* Authentic 3-dot YouTube overflow icon */}
            <svg width={10} height={36} viewBox="0 0 10 36" style={{ marginTop: 6, flexShrink: 0 }}>
              <circle cx={5} cy={6} r={3.2} fill="#0f0f0f" />
              <circle cx={5} cy={18} r={3.2} fill="#0f0f0f" />
              <circle cx={5} cy={30} r={3.2} fill="#0f0f0f" />
            </svg>
          </div>
        </div>

        {/* High-Contrast CTA Pill (sits cleanly above captions!) */}
        <div
          style={{
            marginTop: 40,
            padding: "22px 54px",
            borderRadius: 50,
            background: C.gold,
            boxShadow: glow(C.gold, 16),
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 32,
            color: "#050a18",
            letterSpacing: 1,
          }}
        >
          WATCH FULL VIDEO ON CHANNEL ↑
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// MAIN 9:16 SHORT COMPOSITION: OneWayLightShort
// ===========================================================================
export const OneWayLightShort: React.FC = () => {
  const b1 = scue("Every measurement ever made");
  const b2 = scue("So how strange");
  const b3 = scue("Imagine calling Mars");
  const b4 = scue("In nineteen oh five");
  const b5 = scue("Even wilder");
  const b6 = scue("I unpacked");
  const end = ONE_WAY_LIGHT_SHORT_FRAMES;

  return (
    <AbsoluteFill>
      <VerticalSpaceBg />

      <BeatWrap from={0} to={b1}>
        <Beat0NeverMeasured dur={Math.max(45, b1)} />
      </BeatWrap>

      <BeatWrap from={b1} to={b2}>
        <Beat1MirrorAndTrap
          trapAt={Math.max(36, scue("synchronized clocks") - b1)}
          dur={Math.max(60, b2 - b1)}
        />
      </BeatWrap>

      <BeatWrap from={b2} to={b3} fade={5}>
        <Beat2HowStrangePunch dur={Math.max(36, b3 - b2)} />
      </BeatWrap>

      <BeatWrap from={b3} to={b4}>
        <Beat3MarsInstant
          instantAt={Math.max(45, scue("teleport back instantaneously") - b3)}
          dur={Math.max(60, b4 - b3)}
        />
      </BeatWrap>

      <BeatWrap from={b4} to={b5}>
        <Beat4EinsteinPaper
          byDefAt={Math.max(30, scue("by definition") - b4)}
          dur={Math.max(50, b5 - b4)}
        />
      </BeatWrap>

      <BeatWrap from={b5} to={b6}>
        <Beat5AndromedaVertical
          daysAt={Math.max(40, scue("eight full days") - b5)}
          dur={Math.max(60, b6 - b5)}
        />
      </BeatWrap>

      <BeatWrap from={b6} to={end}>
        <Beat6YouTubeCardCta />
      </BeatWrap>

      <ShortSubtitleLayer />
      <Audio src={staticFile("onewaylight/short-voiceover.wav")} />
    </AbsoluteFill>
  );
};
