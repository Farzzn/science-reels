import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import shortData from "../../public/cosmiclimit/short-words.json";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const COSMIC_LIMIT_SHORT_FRAMES = Math.ceil((shortData.duration + 0.55) * FPS);

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
// 9:16 CLEAN DARK-SPACE VERTICAL BACKGROUND (1080x1920, ZERO BUSY GRID)
// ===========================================================================
const VerticalSpaceBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const driftY = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, -34]);

  const stars = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 68; i++) {
      const h1 = Math.sin(i * 127.1 + 19.3) * 43758.5453;
      const h2 = Math.sin(i * 269.5 + 73.1) * 43758.5453;
      const h3 = Math.sin(i * 419.2 + 11.7) * 43758.5453;
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
        background: "radial-gradient(ellipse at 50% 38%, #0b1633 0%, #050a18 70%, #02050d 100%)",
      }}
    >
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        <g transform={`translate(0, ${driftY.toFixed(1)})`}>
          {stars.map((st, idx) => (
            <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#d8e9ff" opacity={st.o} />
          ))}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 44%, transparent 52%, rgba(0,0,0,0.72) 100%)",
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
  "einstein",
  "faster",
  "light",
  "twice",
  "relativity",
  "stretching",
  "ant",
  "rubber",
  "five",
  "expanding",
  "dark",
  "energy",
  "horizon",
  "ninetyfive",
  "ninety-five",
  "forever",
  "upstream",
  "elevenminute",
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
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
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
          columnGap: 18,
          rowGap: 6,
          background: "rgba(5, 10, 24, 0.84)",
          border: "1.5px solid rgba(62, 224, 255, 0.28)",
          borderRadius: 24,
          padding: "16px 32px",
          textAlign: "center",
          maxWidth: 920,
          boxShadow: "0 14px 42px rgba(0,0,0,0.82)",
        }}
      >
        {activeChunk.words.map((w, idx) => {
          const isCurrent = t >= w.s - 0.03 && t <= w.e + 0.04;
          const clean = norm(w.w);
          const isKey = KEYWORD_SET.has(clean);
          const color = isCurrent ? C.gold : isKey ? "#ffe082" : C.white;
          return (
            <span
              key={`${idx}-${w.s}`}
              style={{
                display: "inline-block",
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 48,
                lineHeight: 1.24,
                color,
                transform: isCurrent ? "scale(1.06)" : "scale(1)",
                textShadow: isCurrent ? glow(C.gold, 10) : "0 4px 16px rgba(0,0,0,0.95)",
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
// CLEAN STAGE WRAPPER & MINIMAL ANCHOR HEADER
// ===========================================================================
const BeatWrap: React.FC<{ from: number; to: number; fade?: number; children: React.ReactNode }> = ({
  from,
  to,
  fade = 6,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 2) return null;
  const inO =
    from <= 2
      ? 1
      : interpolate(frame, [from, from + fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(frame, [to - fade, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>
      <Sequence from={from} durationInFrames={Math.max(20, to - from)}>
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};

const TopTag: React.FC<{ text: string; sub?: string; color?: string }> = ({ text, sub, color = C.cyan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 175,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: sp,
        transform: `translateY(${(1 - sp) * -18}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 900,
          fontSize: 44,
          color,
          letterSpacing: 4,
          textShadow: glow(color, 14),
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 28,
            color: "rgba(220,235,255,0.82)",
            letterSpacing: 2,
            marginTop: 10,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

// ===========================================================================
// BEAT 0: EINSTEIN'S COSMIC SPEED LIMIT -> FORBIDDEN ✕ SLAM!
// ===========================================================================
const Beat0SpeedLimitForbid: React.FC<{ forbidAt: number }> = ({ forbidAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const einP = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const raceP = interpolate(frame, [2, Math.max(22, forbidAt)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const forbP = spring({ frame: Math.max(0, frame - forbidAt), fps, config: { damping: 14, stiffness: 150 } });
  const push = interpolate(frame, [forbidAt, Math.max(forbidAt + 20, durationInFrames)], [0.95, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wallX = 835;
  const photonX = interpolate(raceP, [0, 1], [115, wallX - 20]);
  const rocketX = interpolate(raceP, [0, 1], [115, wallX - 95]);

  return (
    <AbsoluteFill>
      {/* Compact Einstein Portrait Chip top-center */}
      <div
        style={{
          position: "absolute",
          top: 175,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: einP * (1 - forbP * 0.45),
          transform: `translateY(${(1 - einP) * -20}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            padding: "12px 30px 12px 12px",
            borderRadius: 64,
            background: "rgba(6, 13, 30, 0.92)",
            border: `2.5px solid ${C.gold}`,
            boxShadow: glow(C.gold, 10),
          }}
        >
          <div style={{ width: 92, height: 92, borderRadius: "50%", overflow: "hidden", border: `2.5px solid ${C.gold}` }}>
            <Img
              src={staticFile("cosmiclimit/portraits/einstein.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "56% 18%" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 30, color: C.white }}>Albert Einstein</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 19, color: C.gold, letterSpacing: 2 }}>
              c = 300,000 km/s
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Light & Rocket Race Into Glowing c Wall */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        <defs>
          <linearGradient id="shortBeamGrad" gradientUnits="userSpaceOnUse" x1="115" y1="790" x2={photonX} y2="790">
            <stop offset="0%" stopColor={C.gold} stopOpacity="0.1" />
            <stop offset="100%" stopColor={C.gold} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="shortWallGrad" gradientUnits="userSpaceOnUse" x1={wallX} y1="540" x2={wallX} y2="1180">
            <stop offset="0%" stopColor={C.red} stopOpacity="0" />
            <stop offset="50%" stopColor={C.red} stopOpacity="1" />
            <stop offset="100%" stopColor={C.red} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Glowing vertical c speed limit wall */}
        <line x1={wallX} y1={540} x2={wallX} y2={1180} stroke="url(#shortWallGrad)" strokeWidth={9} style={{ filter: svgGlow(C.red, 14) }} />
        <text x={wallX + 26} y={620} fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={44}>
          c
        </text>

        {/* Golden photon beam */}
        <line x1={115} y1={790} x2={photonX} y2={790} stroke="url(#shortBeamGrad)" strokeWidth={11} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 12) }} />
        <circle cx={photonX} cy={790} r={14} fill="#ffffff" stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 16) }} />
        <text x={115} y={745} fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={26} letterSpacing={3}>
          LIGHT · 1.0 c
        </text>

        {/* Crisp Vector Rocket hitting the barrier */}
        <g transform={`translate(${rocketX}, 985)`}>
          <path d="M-95,0 L-45,-12 L-45,12 Z" fill={C.cyan} opacity={0.75} />
          <path d="M-45,-18 L18,-18 L48,0 L18,18 L-45,18 Z" fill="#e2eeff" stroke={C.cyan} strokeWidth={3} />
          <circle cx={-6} cy={0} r={7} fill="#08142b" stroke={C.cyan} strokeWidth={2} />
        </g>

        {/* Kinetic FORBIDDEN ✕ Slam right on "faster than light"! */}
        {forbP > 0.02 && (
          <g transform={`translate(540, 880) scale(${(0.84 + 0.16 * forbP) * push})`} opacity={forbP}>
            <circle r={295} fill="rgba(5,10,24,0.88)" stroke={C.red} strokeWidth={4} strokeDasharray="16 14" opacity={0.85} />
            <line x1={-165} y1={-165} x2={165} y2={165} stroke={C.red} strokeWidth={24} strokeLinecap="round" opacity={0.34} style={{ filter: svgGlow(C.red, 16) }} />
            <line x1={165} y1={-165} x2={-165} y2={165} stroke={C.red} strokeWidth={24} strokeLinecap="round" opacity={0.34} style={{ filter: svgGlow(C.red, 16) }} />
            <text x={0} y={14} textAnchor="middle" fill="#ffffff" fontFamily={INTER} fontWeight={900} fontSize={114} letterSpacing={4} style={{ filter: svgGlow(C.red, 14) }}>
              FORBIDDEN
            </text>
            <text x={0} y={96} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={40} letterSpacing={6}>
              v &gt; c
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 1: JWST DEEP FIELD -> JADES-GS-z14-0 RECEDING > 2x c!
// ===========================================================================
const Beat1JwstGalaxy: React.FC<{ arrowAt: number }> = ({ arrowAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Smooth continuous zoom centered directly on the crimson galaxy in jwst-deepfield.jpg (67.6%, 50%)
  const zoom = interpolate(frame, [0, Math.max(40, durationInFrames)], [1.05, 1.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrowP = interpolate(frame, [Math.max(12, arrowAt - 6), Math.max(50, durationInFrames - 6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cx = 414;
  const cy = 880;
  const arrowLen = 110 + arrowP * 330;
  const speedVal = interpolate(arrowP, [0, 1], [1.0, 2.3]);

  return (
    <AbsoluteFill>
      <TopTag text="JWST DEEP FIELD" sub="JADES-GS-z14-0" color={C.red} />

      {/* Full-width dark-vignetted JWST Deep Field framed cleanly in vertical safe zone */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 44,
          right: 44,
          height: 1080,
          borderRadius: 34,
          overflow: "hidden",
          border: `2.5px solid rgba(255, 84, 112, 0.55)`,
          boxShadow: `${glow(C.red, 12)}, 0 24px 64px rgba(0,0,0,0.9)`,
          background: "#050a18",
        }}
      >
        <Img
          src={staticFile("cosmiclimit/jwst-deepfield.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "100% 50%",
            transform: `scale(${zoom})`,
            transformOrigin: "37.3% 50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 38% 50%, transparent 34%, rgba(5,10,24,0.78) 100%)",
          }}
        />
      </div>

      {/* Crisp Target Reticle & Outward > 2x c Arrow */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        <defs>
          <linearGradient id="shortJadesArrow" gradientUnits="userSpaceOnUse" x1={cx + 55} y1={cy} x2={cx + 55 + arrowLen} y2={cy}>
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.red} />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r={54} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="16 10" style={{ filter: svgGlow(C.red, 12) }} />
        <circle cx={cx} cy={cy} r={22} fill="none" stroke="rgba(255,84,112,0.55)" strokeWidth={2} />

        {arrowP > 0.02 && (
          <g>
            <line
              x1={cx + 55}
              y1={cy}
              x2={cx + 55 + arrowLen}
              y2={cy}
              stroke="url(#shortJadesArrow)"
              strokeWidth={12}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.red, 14) }}
            />
            <polygon
              points={`${cx + 76 + arrowLen},${cy} ${cx + 42 + arrowLen},${cy - 22} ${cx + 42 + arrowLen},${cy + 22}`}
              fill={C.red}
            />
            {/* 1.0 c dashed reference tick */}
            <line x1={cx + 215} y1={cy - 34} x2={cx + 215} y2={cy + 34} stroke={C.gold} strokeWidth={3.5} strokeDasharray="6 6" />
            <text x={cx + 215} y={cy + 68} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
              1.0 c
            </text>
            <text
              x={cx + 55 + arrowLen * 0.65}
              y={cy - 48}
              textAnchor="middle"
              fill={C.red}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={52}
              style={{ filter: svgGlow(C.red, 12) }}
            >
              {speedVal.toFixed(1)}× c
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 2: FULL-SCREEN KINETIC PUNCH — HOW?
// ===========================================================================
const Beat2HowPunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const scale = interpolate(frame, [0, Math.max(15, durationInFrames)], [0.94, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringR = interpolate(frame, [0, Math.max(20, durationInFrames)], [180, 440], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        <g transform={`translate(540, 860) scale(${(0.84 + 0.16 * pop) * scale})`}>
          <circle r={ringR} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="18 16" opacity={0.35} />
          <circle r={ringR * 0.72} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.28} />
          <text
            x={0}
            y={42}
            textAnchor="middle"
            fill="#ffffff"
            fontFamily={INTER}
            fontWeight={900}
            fontSize={220}
            letterSpacing={6}
            style={{ filter: svgGlow(C.gold, 18) }}
          >
            HOW?
          </text>
          <text x={0} y={132} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={32} letterSpacing={6}>
            WITHOUT BREAKING EINSTEIN
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 3: NOT ROCKETING ✕ -> BRAND-NEW SPACE TILES SPAWNING!
// ===========================================================================
const Beat3NewSpaceStretch: React.FC<{ stretchAt: number }> = ({ stretchAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const xPop = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 14, stiffness: 160 } });
  const spawnP = interpolate(frame, [Math.max(15, stretchAt - 4), Math.max(45, durationInFrames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const tileCount = Math.min(5, Math.max(1, Math.floor(1 + spawnP * 4.9)));
  const tileW = 112;
  const totalW = tileCount * tileW;
  const leftX = 540 - totalW / 2 - 75;
  const rightX = 540 + totalW / 2 + 75;
  const inStretch = frame >= stretchAt - 4;

  return (
    <AbsoluteFill>
      <TopTag
        text={inStretch ? "SPACE IS STRETCHING" : "NOT ROCKETING"}
        sub={inStretch ? "+ BRAND-NEW SPACE" : "LOCAL SPEED = 0"}
        color={inStretch ? C.green : C.red}
      />

      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        {/* Phase 1: Crossed-out rocket thrusters */}
        {!inStretch && (
          <g transform="translate(540, 880)">
            {/* Left & Right galaxies with fiery thrusters */}
            <polygon points="-240,-24 -325,0 -240,24" fill={C.gold} opacity={0.75} />
            <polygon points="240,-24 325,0 240,24" fill={C.gold} opacity={0.75} />
            <circle cx={-190} cy={0} r={54} fill="rgba(62,224,255,0.22)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 10) }} />
            <circle cx={190} cy={0} r={54} fill="rgba(255,84,112,0.22)" stroke={C.red} strokeWidth={4} style={{ filter: svgGlow(C.red, 10) }} />
            {/* Giant crimson X stamping out rocket motion */}
            <g transform={`scale(${xPop})`}>
              <line x1={-250} y1={-165} x2={250} y2={165} stroke={C.red} strokeWidth={24} strokeLinecap="round" style={{ filter: svgGlow(C.red, 16) }} />
              <line x1={250} y1={-165} x2={-250} y2={165} stroke={C.red} strokeWidth={24} strokeLinecap="round" style={{ filter: svgGlow(C.red, 16) }} />
            </g>
          </g>
        )}

        {/* Phase 2: Fresh glowing space tiles literally popping in between galaxies! */}
        {inStretch && (
          <g>
            <line x1={60} y1={880} x2={1020} y2={880} stroke="rgba(62,224,255,0.22)" strokeWidth={2.5} strokeDasharray="10 12" />
            {Array.from({ length: tileCount }, (_, i) => {
              const tx = 540 - totalW / 2 + i * tileW;
              const isCenter = i === Math.floor(tileCount / 2);
              return (
                <g key={i}>
                  <rect
                    x={tx + 6}
                    y={740}
                    width={tileW - 12}
                    height={280}
                    rx={16}
                    fill={isCenter ? "rgba(61, 255, 160, 0.24)" : "rgba(62, 224, 255, 0.1)"}
                    stroke={isCenter ? C.green : C.cyan}
                    strokeWidth={isCenter ? 3.5 : 2}
                    style={{ filter: isCenter ? svgGlow(C.green, 12) : undefined }}
                  />
                  <text x={tx + tileW / 2} y={894} textAnchor="middle" fill={isCenter ? C.green : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={40}>
                    +
                  </text>
                </g>
              );
            })}

            {/* Left Milky Way & Right Distant Galaxy pushed apart monotonically */}
            <circle cx={leftX} cy={880} r={42} fill="rgba(62,224,255,0.22)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 12) }} />
            <text x={leftX} y={965} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
              v = 0
            </text>

            <circle cx={rightX} cy={880} r={42} fill="rgba(255,84,112,0.22)" stroke={C.red} strokeWidth={4} style={{ filter: svgGlow(C.red, 12) }} />
            <text x={rightX} y={965} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22}>
              v = 0
            </text>

            <text x={540} y={1105} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={32} letterSpacing={3}>
              NEW SPACE CELLS: {tileCount}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 4: ANT (1 cm/s) ON STRETCHING RUBBER BAND (5 cm/s)!
// ===========================================================================
const Beat4RubberBandAnt: React.FC<{ pullAt: number; fiveAt: number }> = ({ pullAt, fiveAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const walkP = interpolate(frame, [0, Math.max(30, durationInFrames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stretchP = interpolate(frame, [Math.max(12, pullAt - 4), Math.max(40, durationInFrames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const fiveOn = frame >= fiveAt - 4;

  const bandY = 910;
  const leftEnd = interpolate(stretchP, [0, 1], [270, 96]);
  const rightEnd = interpolate(stretchP, [0, 1], [810, 984]);
  const bandLen = rightEnd - leftEnd;
  const antFrac = 0.18 + walkP * 0.34;
  const antX = leftEnd + antFrac * bandLen;

  return (
    <AbsoluteFill>
      <TopTag
        text={fiveOn ? "5× FASTER THAN ANT" : "THE RUBBER BAND"}
        sub="ANT: 1 cm/s · END: 5 cm/s"
        color={fiveOn ? C.gold : C.cyan}
      />

      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        {/* Elastic Rubber Band + evenly stretching tick marks */}
        <rect
          x={leftEnd}
          y={bandY - 18}
          width={bandLen}
          height={36}
          rx={18}
          fill="rgba(62, 224, 255, 0.2)"
          stroke={C.cyan}
          strokeWidth={4}
          style={{ filter: svgGlow(C.cyan, 10) }}
        />
        {Array.from({ length: 9 }, (_, k) => {
          const tx = leftEnd + ((k + 1) / 10) * bandLen;
          return <line key={k} x1={tx} y1={bandY - 16} x2={tx} y2={bandY + 16} stroke={C.cyan} strokeWidth={2.5} opacity={0.65} />;
        })}

        {/* Pull grips & outward arrows on both ends */}
        <rect x={leftEnd - 22} y={bandY - 46} width={22} height={92} rx={8} fill={C.gold} />
        <rect x={rightEnd} y={bandY - 46} width={22} height={92} rx={8} fill={C.red} style={{ filter: svgGlow(C.red, 10) }} />
        {stretchP > 0.02 && (
          <>
            <text x={rightEnd - 15} y={bandY + 106} textAnchor="end" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={32}>
              5 cm/s →
            </text>
            <text x={leftEnd + 15} y={bandY + 106} textAnchor="start" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={32}>
              ← PULL
            </text>
          </>
        )}

        {/* Crisp Vector Ant walking steadily locally on top of the band */}
        <g transform={`translate(${antX}, ${bandY - 38})`}>
          {/* Legs */}
          <line x1={-16} y1={10} x2={-26} y2={22} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={10} x2={0} y2={22} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          <line x1={16} y1={10} x2={26} y2={22} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          {/* 3-segment body */}
          <ellipse cx={-20} cy={0} rx={15} ry={11} fill={C.gold} />
          <ellipse cx={0} cy={-2} rx={11} ry={9} fill={C.gold} />
          <circle cx={19} cy={-4} r={10} fill="#ffffff" stroke={C.gold} strokeWidth={3} />
          {/* Antennae */}
          <path d="M25,-12 Q34,-24 42,-22" fill="none" stroke={C.gold} strokeWidth={3} strokeLinecap="round" />
          {/* Local speed callout riding right above the ant */}
          <text x={0} y={-52} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={30} style={{ filter: svgGlow(C.gold, 8) }}>
            1 cm/s ✓
          </text>
        </g>

        {/* Clean visual rule summary below */}
        <text x={540} y={1185} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={28} letterSpacing={3}>
          LOCAL LIMIT NEVER BROKEN
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 5: EXPANDING SPACE GRID — NO SPEED LIMIT ON EMPTY SPACE!
// ===========================================================================
const Beat5ExpandingGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const p = interpolate(frame, [0, Math.max(25, durationInFrames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cell = interpolate(p, [0, 1], [150, 235]);
  const originX = 140;
  const y0 = 900;
  const photonX = originX + cell + interpolate(p, [0, 1], [-55, 165]);

  return (
    <AbsoluteFill>
      <TopTag text="GENERAL RELATIVITY" sub="NO LIMIT ON SPACE ITSELF" color={C.cyan} />

      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        {/* Stretching vertical grid lines */}
        {[0, 1, 2, 3, 4].map((k) => {
          const x = originX + k * cell;
          return <line key={k} x1={x} y1={520} x2={x} y2={1280} stroke={C.cyan} strokeWidth={2} opacity={0.3} />;
        })}
        {[640, 900, 1160].map((y) => (
          <line key={y} x1={60} y1={y} x2={1020} y2={y} stroke={C.cyan} strokeWidth={2} opacity={0.28} />
        ))}

        {/* Galaxies pinned strictly on nodes 0, 1, 2, 3 */}
        {[
          { k: 0, col: C.cyan, lbl: "0" },
          { k: 1, col: C.cyan, lbl: "1×" },
          { k: 2, col: C.gold, lbl: "2×" },
          { k: 3, col: C.red, lbl: "> c" },
        ].map((g) => {
          const gx = originX + g.k * cell;
          if (gx > 1030) return null;
          const aLen = g.k * 64 * p;
          return (
            <g key={g.k}>
              <circle cx={gx} cy={y0} r={24} fill={`${g.col}33`} stroke={g.col} strokeWidth={4} style={{ filter: svgGlow(g.col, 10) }} />
              {g.k > 0 && (
                <>
                  <line x1={gx} y1={y0 - 52} x2={gx + aLen} y2={y0 - 52} stroke={g.col} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(g.col, 10) }} />
                  <polygon points={`${gx + aLen + 14},${y0 - 52} ${gx + aLen - 6},${y0 - 64} ${gx + aLen - 6},${y0 - 40}`} fill={g.col} />
                  <text x={gx + aLen * 0.5} y={y0 - 80} textAnchor="middle" fill={g.col} fontFamily={MONO} fontWeight={900} fontSize={32}>
                    {g.lbl}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Local golden photon passing cleanly beside Node 1 at exact speed c */}
        <circle cx={photonX} cy={y0 + 78} r={11} fill="#ffffff" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 14) }} />
        <text x={photonX} y={y0 + 124} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
          LOCAL PHOTON = c ✓
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 6: 16.5 B ly COSMIC EVENT HORIZON -> 95% GONE FOREVER!
// ===========================================================================
const Beat6EventHorizon95: React.FC<{ horizonAt: number; pctAt: number }> = ({ horizonAt, pctAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const ehP = spring({ frame: Math.max(0, frame - horizonAt), fps, config: { damping: 16, stiffness: 120 } });
  const pctP = interpolate(frame, [Math.max(15, pctAt - 4), Math.max(48, pctAt + 42)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const beamP = interpolate(frame, [Math.max(20, pctAt), Math.max(55, durationInFrames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 540;
  const cy = 920;
  const outerR = 415;
  const innerR = 148;
  const pctNum = Math.round(interpolate(pctP, [0, 1], [5, 95]));

  const outerGals = useMemo(() => {
    const pts: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 64; i++) {
      const a = i * 2.39996;
      const rad = innerR + 34 + ((i * 37) % (outerR - innerR - 56));
      pts.push({ x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad, r: 2.5 + (i % 3) * 1.4 });
    }
    return pts;
  }, []);

  const beamR = interpolate(beamP, [0, 1], [12, innerR + 95]);

  return (
    <AbsoluteFill>
      <TopTag
        text={pctP > 0.2 ? `${pctNum}% GONE FOREVER` : "16.5 B ly"}
        sub={pctP > 0.2 ? "BEYOND OUR REACH" : "COSMIC EVENT HORIZON"}
        color={pctP > 0.2 ? C.red : C.cyan}
      />

      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        {/* Colossal 46.5 B ly Observable Universe Outer Sphere (95% unreachable volume) */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill={pctP > 0.15 ? "rgba(255, 58, 92, 0.13)" : "rgba(255, 194, 77, 0.08)"}
          stroke={pctP > 0.15 ? C.red : C.gold}
          strokeWidth={4.5}
          style={{ filter: svgGlow(pctP > 0.15 ? C.red : C.gold, 12) }}
        />

        {/* 64 Outer Galaxies turning crimson */}
        {outerGals.map((g, i) => (
          <circle
            key={i}
            cx={g.x}
            cy={g.y}
            r={g.r}
            fill={pctP > 0.2 ? C.red : C.gold}
            opacity={0.45 + 0.5 * pctP}
          />
        ))}

        {/* 16.5 B ly Inner Reachable Core (5% Volume) */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR * (0.4 + 0.6 * ehP)}
          fill="rgba(62, 224, 255, 0.2)"
          stroke={C.cyan}
          strokeWidth={5}
          style={{ filter: svgGlow(C.cyan, 16) }}
        />
        <circle cx={cx} cy={cy} r={10} fill="#ffffff" />

        {/* Outbound Golden Beam fading cleanly before reaching outer galaxies */}
        {beamP > 0.02 && (
          <g opacity={1 - beamP * 0.55}>
            <line
              x1={cx}
              y1={cy}
              x2={cx + beamR}
              y2={cy - beamR * 0.45}
              stroke={C.gold}
              strokeWidth={6}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.gold, 12) }}
            />
            <circle cx={cx + beamR} cy={cy - beamR * 0.45} r={9} fill="#ffffff" stroke={C.gold} strokeWidth={3} />
          </g>
        )}

        {/* Crisp Callout Numbers */}
        <text x={cx} y={cy + 64} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={34}>
          5%
        </text>
        <text x={cx} y={cy + outerR + 62} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={32} letterSpacing={3}>
          EVENT HORIZON · 16.5 B ly
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 7: FULL 11:06 VIDEO FUNNEL CTA CARD (UPLOADED YOUTUBE CARD!)
// ===========================================================================
const Beat7FullVideoCta: React.FC = () => {
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
          top: 230,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: pop,
        }}
      >
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 28, color: C.gold, letterSpacing: 4 }}>
          FULL 11:06 VISUAL BREAKDOWN
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 54,
            color: C.white,
            marginTop: 14,
            lineHeight: 1.12,
            maxWidth: 940,
          }}
        >
          How Light Swims Upstream <span style={{ color: C.cyan }}>Past Light Speed</span>
        </div>

        {/* User's Actual Uploaded YouTube Video Card */}
        <div
          style={{
            marginTop: 46,
            width: 920,
            borderRadius: 34,
            overflow: "hidden",
            background: "#ffffff",
            border: `4px solid ${C.gold}`,
            boxShadow: `${glow(C.gold, 22)}, 0 28px 72px rgba(0,0,0,0.92)`,
            transform: `scale(${(0.88 + 0.12 * pop) * push})`,
          }}
        >
          <Img
            src={staticFile("cosmiclimit/yt-video-card.jpg")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* High-Contrast CTA Pill */}
        <div
          style={{
            marginTop: 44,
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
// MAIN 9:16 SHORT COMPOSITION: CosmicSpeedLimitShort
// ===========================================================================
export const CosmicSpeedLimitShort: React.FC = () => {
  const b1 = scue("yet right now");
  const b2 = scue("How doesn't");
  const b3 = scue("Because those galaxies");
  const b4 = scue("Picture an ant");
  const b5 = scue("General relativity");
  const b6 = scue("Even wilder");
  const b7 = scue("I broke down");
  const end = COSMIC_LIMIT_SHORT_FRAMES;

  return (
    <AbsoluteFill>
      <VerticalSpaceBg />

      <BeatWrap from={0} to={b1}>
        <Beat0SpeedLimitForbid forbidAt={Math.max(12, scue("faster than light"))} />
      </BeatWrap>

      <BeatWrap from={b1} to={b2}>
        <Beat1JwstGalaxy arrowAt={Math.max(12, scue("racing away") - b1)} />
      </BeatWrap>

      <BeatWrap from={b2} to={b3} fade={5}>
        <Beat2HowPunch />
      </BeatWrap>

      <BeatWrap from={b3} to={b4}>
        <Beat3NewSpaceStretch stretchAt={Math.max(15, scue("Space itself is stretching") - b3)} />
      </BeatWrap>

      <BeatWrap from={b4} to={b5}>
        <Beat4RubberBandAnt
          pullAt={Math.max(15, scue("Pull the band") - b4)}
          fiveAt={Math.max(30, scue("five times faster") - b4)}
        />
      </BeatWrap>

      <BeatWrap from={b5} to={b6}>
        <Beat5ExpandingGrid />
      </BeatWrap>

      <BeatWrap from={b6} to={b7}>
        <Beat6EventHorizon95
          horizonAt={Math.max(12, scue("sixteen-point-five") - b6)}
          pctAt={Math.max(24, scue("ninety-five percent") - b6)}
        />
      </BeatWrap>

      <BeatWrap from={b7} to={end}>
        <Beat7FullVideoCta />
      </BeatWrap>

      <ShortSubtitleLayer />
      <Audio src={staticFile("cosmiclimit/short-voiceover.wav")} />
    </AbsoluteFill>
  );
};
