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
import shortData from "../../public/relbonds/short-words.json";
import { BigText } from "../FiveHundredMileEmail/components";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const REL_BONDS_SHORT_FRAMES = Math.ceil((shortData.duration + 0.55) * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, "");

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
// 9:16 VERTICAL BACKGROUND (1080x1920)
// ===========================================================================
const VerticalBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 72;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 34%, ${C.bg1} 0%, ${C.bg0} 76%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 35%, transparent 82%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// BURNED-IN WORD-ALIGNED SUBTITLES (Clean spacing, Shorts/Reels UI safe zone)
// ===========================================================================
const HIGHLIGHT_SET = new Set([
  "einstein's",
  "einstein",
  "relativity",
  "gold",
  "silver",
  "seventynine",
  "seventy-nine",
  "sixty",
  "light",
  "shrink",
  "blue",
  "yellow",
  "mercury",
  "liquid",
  "triple",
  "sigma",
  "pi",
  "twentysix",
  "twenty-six",
  "bismuth",
  "collapsed",
  "fusing",
  "eighty",
  "battery's",
  "voltage",
  "periodic",
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
      if (t >= chunks[i].s - 0.12 && t < nextS) return chunks[i];
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
        paddingBottom: 215,
        paddingLeft: 54,
        paddingRight: 54,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 20,
          rowGap: 6,
          background: "rgba(4, 8, 20, 0.88)",
          border: "1.5px solid rgba(62, 224, 255, 0.28)",
          borderRadius: 24,
          padding: "18px 34px",
          textAlign: "center",
          maxWidth: 960,
          boxShadow: "0 14px 40px rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        {activeChunk.words.map((w, idx) => {
          const isCurrent = t >= w.s - 0.03 && t <= w.e + 0.04;
          const clean = norm(w.w);
          const isKeyword = HIGHLIGHT_SET.has(clean);
          const color = isCurrent ? C.gold : isKeyword ? "#ffe082" : C.white;
          return (
            <span
              key={`${idx}-${w.s}`}
              style={{
                display: "inline-block",
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 47,
                lineHeight: 1.24,
                color,
                transform: isCurrent ? "scale(1.05)" : "scale(1)",
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
// SHARED TOP PILL, HEADER & BEAT WRAPPER
// ===========================================================================
const ShortPill: React.FC<{ text: string; color?: string }> = ({ text, color = C.gold }) => (
  <div
    style={{
      display: "inline-flex",
      padding: "10px 30px",
      borderRadius: 40,
      background: "rgba(8, 15, 36, 0.92)",
      border: `2px solid ${color}`,
      boxShadow: glow(color, 10),
      fontFamily: MONO,
      fontWeight: 900,
      fontSize: 24,
      color,
      letterSpacing: 2.8,
    }}
  >
    {text}
  </div>
);

const BeatWrap: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 2) return null;
  const inO = from <= 2 ? 1 : interpolate(frame, [from, from + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(frame, [to - 8, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>
      <Sequence from={from} durationInFrames={Math.max(20, to - from)}>
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};

const ShortHeader: React.FC<{ pill: string; pillColor?: string; children: React.ReactNode }> = ({
  pill,
  pillColor = C.cyan,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      top: 155,
      left: 54,
      right: 54,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <ShortPill text={pill} color={pillColor} />
    <BigText size={56} style={{ marginTop: 20, lineHeight: 1.12, maxWidth: 960 }}>
      {children}
    </BigText>
  </div>
);

// ===========================================================================
// BEAT 1: GOLD TURNS INTO COLD MIRROR SILVER WHEN RELATIVITY SWITCHES OFF!
// ===========================================================================
const Beat1GoldToSilver: React.FC<{
  einsteinAt: number;
  switchOffAt: number;
}> = ({ einsteinAt, switchOffAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const offP = interpolate(frame, [Math.max(8, switchOffAt - 10), switchOffAt + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const einIn = spring({ frame: Math.max(0, frame - einsteinAt), fps, config: { damping: 14, stiffness: 120 } });
  const sat = interpolate(offP, [0, 1], [1.1, 0.02]);
  const bright = interpolate(offP, [0, 1], [1.02, 1.2]);
  const knobX = interpolate(offP, [0, 1], [34, -34]);
  const zoom = interpolate(frame, [0, 220], [1.02, 1.11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <ShortHeader pill="EINSTEIN INSIDE MATTER" pillColor={offP > 0.5 ? "#cbd5e1" : C.gold}>
        Without Relativity, Gold Turns{" "}
        <span style={{ color: offP > 0.5 ? "#cbd5e1" : C.gold }}>{offP > 0.5 ? "Cold Silver" : "Into Silver"}</span>
      </ShortHeader>

      <div
        style={{
          position: "absolute",
          top: 470,
          left: 65,
          right: 65,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Photorealistic 24K Gold Ingot Plate draining to mirror silver live! */}
        <div
          style={{
            position: "relative",
            width: 940,
            height: 615,
            borderRadius: 34,
            overflow: "hidden",
            border: `3.5px solid ${offP > 0.5 ? "#cbd5e1" : C.gold}`,
            boxShadow: `${glow(offP > 0.5 ? "#cbd5e1" : C.gold, 14)}, 0 24px 65px rgba(0,0,0,0.88)`,
          }}
        >
          <Img
            src={staticFile("relbonds/gold-bar.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`,
              filter: `saturate(${sat.toFixed(2)}) brightness(${bright.toFixed(2)}) contrast(1.06)`,
            }}
          />

          {/* Compact Real Einstein Portrait Chip top-left popping in on "Einstein's"! */}
          <div
            style={{
              position: "absolute",
              top: 26,
              left: 26,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "10px 22px 10px 10px",
              borderRadius: 56,
              background: "rgba(6, 12, 30, 0.92)",
              border: `2.5px solid ${C.gold}`,
              boxShadow: glow(C.gold, 8),
              opacity: einIn,
              transform: `scale(${0.8 + 0.2 * einIn})`,
            }}
          >
            <div style={{ width: 76, height: 76, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.gold}` }}>
              <Img
                src={staticFile("relbonds/portraits/einstein.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 18%" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 22, color: C.white }}>Albert Einstein</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 15, color: C.gold }}>RELATIVITY · 1905</div>
            </div>
          </div>

          {/* Live Relativity Toggle top-right */}
          <div
            style={{
              position: "absolute",
              top: 26,
              right: 26,
              padding: "14px 24px",
              borderRadius: 24,
              background: "rgba(6, 12, 30, 0.94)",
              border: `2.5px solid ${offP > 0.5 ? C.red : C.gold}`,
              boxShadow: glow(offP > 0.5 ? C.red : C.gold, 10),
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 14, color: C.dim, letterSpacing: 1.8 }}>
                RELATIVITY
              </div>
              <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 24, color: offP > 0.5 ? C.red : C.gold }}>
                {offP > 0.5 ? "OFF" : "ON"}
              </div>
            </div>
            <svg width={104} height={48} viewBox="-52 -24 104 48">
              <rect x={-48} y={-21} width={96} height={42} rx={21} fill={offP > 0.5 ? "#331119" : "#382806"} stroke={offP > 0.5 ? C.red : C.gold} strokeWidth={2.8} />
              <circle cx={knobX} cy={0} r={15} fill={offP > 0.5 ? "#e2e8f0" : C.gold} />
            </svg>
          </div>
        </div>

        {/* Clean verdict pill below */}
        <div
          style={{
            marginTop: 34,
            padding: "15px 40px",
            borderRadius: 40,
            background: "rgba(6, 14, 34, 0.94)",
            border: `2.5px solid ${offP > 0.5 ? "#cbd5e1" : C.gold}`,
            boxShadow: glow(offP > 0.5 ? "#cbd5e1" : C.gold, 8),
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 25,
            color: offP > 0.5 ? "#e2e8f0" : C.gold,
            letterSpacing: 2,
          }}
        >
          {offP > 0.5 ? "GOLD WITHOUT EINSTEIN → MIRROR SILVER!" : "PURE 24K GOLD · ELEMENT 79"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 2: 79 PROTONS WHIP GOLD'S INNER ELECTRONS TO ~60% SPEED OF LIGHT!
// ===========================================================================
const Beat2GoldSpeed60: React.FC<{ speedAt: number }> = ({ speedAt }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const ramp = interpolate(frame, [10, Math.max(45, speedAt + 20)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pct = Math.round(interpolate(ramp, [0, 1], [6, 58]));
  const orbitR = 175 - ramp * 42;
  const col = pct > 42 ? C.red : C.gold;

  return (
    <AbsoluteFill>
      <ShortHeader pill="GOLD NUCLEUS · Z = 79" pillColor={C.gold}>
        Electrons Whip at <span style={{ color: C.red }}>Nearly 60% Light Speed</span>
      </ShortHeader>

      <div style={{ position: "absolute", top: 455, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 840" style={{ width: 1000, height: 840 }}>
          {/* Accelerating Gold Atom centered top */}
          <g transform="translate(500, 265)">
            {[45, 135, 225, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`} opacity={0.45 + 0.55 * ramp}>
                <line x1={230} y1={0} x2={orbitR + 26} y2={0} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
                <polygon points={`${orbitR + 10},0 ${orbitR + 32},-11 ${orbitR + 32},11`} fill={C.gold} />
              </g>
            ))}
            <circle
              r={orbitR}
              fill="none"
              stroke={col}
              strokeWidth={6}
              strokeDasharray="20 12"
              strokeDashoffset={-t * (120 + ramp * 160)}
              style={{ filter: svgGlow(col, 10) }}
            />
            <circle r={62} fill="rgba(255, 194, 77, 0.25)" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 12) }} />
            <text x={0} y={13} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={36}>
              +79
            </text>
            <circle
              cx={Math.cos(t * (3.5 + ramp * 8)) * orbitR}
              cy={Math.sin(t * (3.5 + ramp * 8)) * orbitR}
              r={16}
              fill={C.white}
              stroke={col}
              strokeWidth={4}
              style={{ filter: svgGlow(col, 12) }}
            />
          </g>

          {/* Clean Speedometer Gauge below */}
          <g transform="translate(500, 668)">
            <rect x={-375} y={-158} width={750} height={304} rx={30} fill="rgba(8, 16, 38, 0.94)" stroke={col} strokeWidth={3.5} />
            <text x={0} y={-108} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22} letterSpacing={2}>
              INNER 1s ELECTRON SPEED
            </text>
            <path d="M-126,52 A126,126 0 0,1 126,52" fill="none" stroke="rgba(127,147,196,0.22)" strokeWidth={18} strokeLinecap="round" />
            <path d="M22,-72 A126,126 0 0,1 126,52" fill="none" stroke={C.red} strokeWidth={18} strokeLinecap="round" opacity={0.48} />
            <g transform={`translate(0, 52) rotate(${interpolate(pct, [0, 100], [-86, 86])})`}>
              <line x1={0} y1={10} x2={0} y2={-106} stroke={col} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(col, 10) }} />
              <circle r={13} fill={C.white} />
            </g>
            <text x={0} y={114} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={900} fontSize={42}>
              {pct}% SPEED OF LIGHT
            </text>
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 3: CONTRACTED ORBITALS MAKE GOLD SWALLOW BLUE LIGHT TO GLOW YELLOW!
// ===========================================================================
const Beat3GoldBlueLight: React.FC<{ blueAt: number }> = ({ blueAt }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const pinch = interpolate(frame, [8, Math.max(40, blueAt)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const topY = interpolate(pinch, [0, 1], [115, 225]);
  const botY = interpolate(pinch, [0, 1], [475, 415]);
  const ray = (t * 0.7) % 1;

  return (
    <AbsoluteFill>
      <ShortHeader pill="RELATIVISTIC CONTRACTION" pillColor={C.cyan}>
        Gold Swallows <span style={{ color: "#6ea8ff" }}>Blue Light</span> &amp; Glows{" "}
        <span style={{ color: C.gold }}>Yellow</span>
      </ShortHeader>

      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 810" style={{ width: 1000, height: 810 }}>
          {/* 6s contracted orbital dropping down */}
          <rect x={140} y={topY - 30} width={720} height={60} rx={16} fill="rgba(62, 224, 255, 0.22)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 8) }} />
          <text x={500} y={topY + 9} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={26}>
            SHRUNKEN 6s ORBITAL ↓
          </text>

          {/* 5d expanded orbital rising up */}
          <rect x={140} y={botY - 30} width={720} height={60} rx={16} fill="rgba(255, 194, 77, 0.22)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 8) }} />
          <text x={500} y={botY + 9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
            PUFFED-OUT 5d ORBITAL ↑
          </text>

          {/* Pinched 2.4 eV Blue-Light Absorption Gap (spacious pill!) */}
          <line x1={260} y1={botY - 36} x2={260} y2={topY + 36} stroke="#4d8bff" strokeWidth={7} strokeDasharray="10 8" style={{ filter: svgGlow("#4d8bff", 10) }} />
          <polygon points={`260,${topY + 32} 245,${topY + 58} 275,${topY + 58}`} fill="#4d8bff" />
          <rect x={315} y={(topY + botY) / 2 - 32} width={485} height={64} rx={18} fill="rgba(12, 24, 64, 0.96)" stroke="#4d8bff" strokeWidth={3} />
          <text x={558} y={(topY + botY) / 2 + 9} textAnchor="middle" fill="#7cb0ff" fontFamily={MONO} fontWeight={900} fontSize={24}>
            ABSORBS BLUE LIGHT (2.4 eV)
          </text>

          {/* Light reflection panel below */}
          <g transform="translate(0, 575)">
            <rect x={85} y={-50} width={830} height={195} rx={28} fill="rgba(8, 16, 38, 0.94)" stroke={C.gold} strokeWidth={3} />
            <line x1={145} y1={22} x2={425} y2={22} stroke="#4d8bff" strokeWidth={9} strokeLinecap="round" strokeDasharray="20 12" strokeDashoffset={-ray * 130} />
            <text x={285} y={88} textAnchor="middle" fill="#7cb0ff" fontFamily={MONO} fontWeight={900} fontSize={23}>
              BLUE ABSORBED ✕
            </text>

            <line x1={515} y1={22} x2={855} y2={22} stroke={C.gold} strokeWidth={10} strokeLinecap="round" strokeDasharray="24 10" strokeDashoffset={-ray * 150} style={{ filter: svgGlow(C.gold, 10) }} />
            <text x={685} y={88} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23}>
              GOLDEN YELLOW REFLECTED →
            </text>
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 4: LIQUID MERCURY AT ROOM TEMPERATURE (-39 °C)
// ===========================================================================
const Beat4LiquidMercury: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterP = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const zoom = interpolate(frame, [0, 90], [1.03, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <ShortHeader pill="MERCURY · Z = 80" pillColor={C.cyan}>
        Why Mercury Stays <span style={{ color: C.cyan }}>Liquid at Room Temp</span>
      </ShortHeader>

      <div
        style={{
          position: "absolute",
          top: 475,
          left: 65,
          right: 65,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${0.92 + 0.08 * enterP})`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 940,
            height: 615,
            borderRadius: 34,
            overflow: "hidden",
            border: `3.5px solid ${C.cyan}`,
            boxShadow: `${glow(C.cyan, 14)}, 0 24px 65px rgba(0,0,0,0.88)`,
          }}
        >
          <Img
            src={staticFile("relbonds/liquid-mercury.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }}
          />
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 28,
              padding: "16px 28px",
              borderRadius: 22,
              background: "rgba(6, 14, 34, 0.94)",
              border: `2.5px solid ${C.cyan}`,
              boxShadow: glow(C.cyan, 8),
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 18, color: C.cyan }}>MELTING POINT</div>
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 42, color: C.white }}>-39 °C</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 34,
            padding: "15px 38px",
            borderRadius: 40,
            background: "rgba(6, 14, 34, 0.94)",
            border: `2.5px solid ${C.cyan}`,
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 24,
            color: C.cyan,
            letterSpacing: 1.8,
          }}
        >
          TIGHT 6s² SHELL → WEAK METAL BONDS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 5: SACRED TEXTBOOK TRIPLE BOND (1 SIGMA + 2 SEPARATE PI)
// ===========================================================================
const Beat5TextbookTriple: React.FC<{ sigmaAt: number; piAt: number }> = ({ sigmaAt, piAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  const sigP = spring({ frame: Math.max(0, frame - sigmaAt + 6), fps, config: { damping: 13, stiffness: 120 } });
  const piP = spring({ frame: Math.max(0, frame - piAt + 6), fps, config: { damping: 13, stiffness: 120 } });
  const pulse = 0.78 + 0.22 * Math.sin(t * 4.5);

  return (
    <AbsoluteFill>
      <ShortHeader pill="THE TEXTBOOK RULE" pillColor={C.cyan}>
        Every Triple Bond: <span style={{ color: C.cyan }}>1 Sigma</span> + <span style={{ color: C.gold }}>2 Pi</span>
      </ShortHeader>

      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 800" style={{ width: 1000, height: 800 }}>
          {/* 2 Pi bonds above & below */}
          <g opacity={0.18 + 0.82 * piP}>
            <path d="M220,275 Q500,190 780,275" fill="none" stroke={C.gold} strokeWidth={24} opacity={0.25 * pulse} strokeLinecap="round" />
            <path d="M220,275 Q500,190 780,275" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 9) }} />
            <path d="M220,485 Q500,570 780,485" fill="none" stroke={C.gold} strokeWidth={24} opacity={0.25 * pulse} strokeLinecap="round" />
            <path d="M220,485 Q500,570 780,485" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 9) }} />
            <rect x={335} y={145} width={330} height={54} rx={16} fill="rgba(26,18,4,0.95)" stroke={C.gold} strokeWidth={3} />
            <text x={500} y={180} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={25}>
              2 SEPARATE PI (π)
            </text>
          </g>

          {/* 1 Sigma head-on center bridge */}
          <g opacity={0.25 + 0.75 * sigP}>
            <line x1={220} y1={380} x2={780} y2={380} stroke={C.cyan} strokeWidth={28} opacity={0.24 * pulse} />
            <line x1={220} y1={380} x2={780} y2={380} stroke={C.cyan} strokeWidth={9} style={{ filter: svgGlow(C.cyan, 10) }} />
            <rect x={335} y={352} width={330} height={56} rx={16} fill="rgba(4,16,38,0.96)" stroke={C.cyan} strokeWidth={3} />
            <text x={500} y={388} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={25}>
              1 PURE SIGMA (σ)
            </text>
          </g>

          {/* Left C & Right N atoms */}
          <g transform="translate(175, 380)" style={{ filter: svgGlow(C.cyan, 10) }}>
            <circle r={66} fill="#0c284d" stroke={C.cyan} strokeWidth={4.5} />
            <text x={0} y={14} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={44}>C</text>
          </g>
          <g transform="translate(825, 380)" style={{ filter: svgGlow(C.gold, 10) }}>
            <circle r={66} fill="#362409" stroke={C.gold} strokeWidth={4.5} />
            <text x={0} y={14} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={44}>N</text>
          </g>

          <rect x={115} y={665} width={770} height={72} rx={36} fill="rgba(6, 14, 34, 0.94)" stroke={C.cyan} strokeWidth={3} />
          <text x={500} y={710} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={1.8}>
            TEXTBOOK LAW: CLEAN &amp; STRICTLY SEPARATE
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 6: 2026 SCIENCE BREAKTHROUGH — BISMUTH CBi⁻ COLLAPSES SIGMA & PI!
// ===========================================================================
const Beat6BismuthCollapse: React.FC<{ bismuthAt: number; collapseAt: number }> = ({ bismuthAt, collapseAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  const biP = interpolate(frame, [Math.max(8, bismuthAt - 6), bismuthAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colP = interpolate(frame, [Math.max(15, collapseAt - 6), collapseAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgePop = spring({ frame: Math.max(0, frame - bismuthAt), fps, config: { damping: 13, stiffness: 125 } });

  // Live σ & π waves that start parallel and braid/fuse together right on "completely collapsed"!
  const sigPts: string[] = [];
  const piPts: string[] = [];
  for (let x = 70; x <= 870; x += 10) {
    const twist = Math.sin(x * 0.032 - t * 9) * 32 * colP;
    const ySig = interpolate(colP, [0, 1], [472, 502]) + twist;
    const yPi = interpolate(colP, [0, 1], [532, 502]) - twist;
    sigPts.push(`${x === 70 ? "M" : "L"}${x},${ySig.toFixed(1)}`);
    piPts.push(`${x === 70 ? "M" : "L"}${x},${yPi.toFixed(1)}`);
  }

  return (
    <AbsoluteFill>
      <ShortHeader pill="2026 SCIENCE BREAKTHROUGH" pillColor={colP > 0.35 ? C.red : C.gold}>
        Heavy Bismuth <span style={{ color: C.red }}>Fused Sigma &amp; Pi Together</span>
      </ShortHeader>

      <div
        style={{
          position: "absolute",
          top: 475,
          left: 65,
          right: 65,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 940,
            height: 615,
            borderRadius: 34,
            overflow: "hidden",
            border: `3.5px solid ${colP > 0.35 ? C.red : C.gold}`,
            boxShadow: `${glow(colP > 0.35 ? C.red : C.gold, 14)}, 0 24px 65px rgba(0,0,0,0.88)`,
            background: "#050b1c",
          }}
        >
          {/* Photorealistic Bismuth Hopper Crystal reveals right on "super-heavy bismuth"! */}
          <Img
            src={staticFile("relbonds/bismuth-crystal.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.2 + 0.8 * biP,
              transform: `scale(${1.02 + biP * 0.08})`,
            }}
          />

          <svg viewBox="0 0 940 615" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {/* Science 2026 Badge top-left */}
            <g transform="translate(155, 72)">
              <rect x={-125} y={-44} width={250} height={88} rx={20} fill="rgba(26, 18, 4, 0.94)" stroke={C.gold} strokeWidth={3} />
              <text x={0} y={-2} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontStyle="italic" fontWeight={900} fontSize={32}>
                Science
              </text>
              <text x={0} y={28} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={16} letterSpacing={2}>
                VOL. 393 · 2026
              </text>
            </g>

            {/* 83 Bi Element Badge top-right pops in ON "super-heavy bismuth"! */}
            <g transform={`translate(815, 92) scale(${0.75 + 0.25 * badgePop})`} opacity={biP}>
              <rect x={-95} y={-68} width={190} height={136} rx={20} fill="rgba(6, 12, 30, 0.94)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 8) }} />
              <text x={-70} y={-34} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>83</text>
              <text x={0} y={16} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={54}>Bi</text>
              <text x={0} y={48} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={17}>BISMUTH</text>
            </g>

            {/* Live σ & π Ribbons slamming & braiding together on "completely collapsed"! */}
            <path d={sigPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />
            <path d={piPts.join(" ")} fill="none" stroke={colP > 0.4 ? C.red : C.gold} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(colP > 0.4 ? C.red : C.gold, 8) }} />
          </svg>
        </div>

        {/* Wide crisp collapse pill below */}
        <div
          style={{
            marginTop: 34,
            padding: "15px 38px",
            borderRadius: 40,
            background: colP > 0.35 ? "rgba(48, 10, 18, 0.95)" : "rgba(6, 14, 34, 0.94)",
            border: `2.5px solid ${colP > 0.35 ? C.red : C.gold}`,
            boxShadow: glow(colP > 0.35 ? C.red : C.gold, 10),
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 24,
            color: colP > 0.35 ? C.red : C.gold,
            letterSpacing: 1.8,
          }}
        >
          {colP > 0.35 ? "σ / π BOUNDARY COLLAPSED IN CBi⁻!" : "TRIPLE BOND WITH HEAVY BISMUTH (CBi⁻)"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 7: 80% OF YOUR CAR BATTERY VOLTAGE COMES FROM RELATIVITY!
// ===========================================================================
const Beat7CarBattery80: React.FC = () => {
  const frame = useCurrentFrame();
  const barP = interpolate(frame, [4, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <ShortHeader pill="LEAD · Z = 82" pillColor={C.gold}>
        80% of Your Car Battery Is <span style={{ color: C.gold }}>Relativity</span>
      </ShortHeader>

      <div style={{ position: "absolute", top: 475, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 760" style={{ width: 1000, height: 760 }}>
          {/* Car Battery Silhouette */}
          <rect x={110} y={135} width={780} height={385} rx={32} fill="rgba(8, 16, 38, 0.95)" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 10) }} />
          <rect x={225} y={88} width={96} height={47} rx={10} fill={C.dim} />
          <rect x={680} y={88} width={96} height={47} rx={10} fill={C.red} />
          <text x={273} y={122} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={32}>−</text>
          <text x={728} y={122} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={900} fontSize={32}>+</text>

          <text x={500} y={210} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={34}>
            Lead-Acid Car Battery Cell
          </text>

          {/* Voltage Split Bar */}
          <rect x={165} y={260} width={670} height={140} rx={22} fill="#060c1e" stroke="rgba(127,147,196,0.35)" strokeWidth={3} />
          <rect x={173} y={268} width={130 * barP} height={124} rx={16} fill="rgba(127, 147, 196, 0.45)" />
          <text x={238} y={342} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={26} opacity={barP}>
            0.4 V
          </text>

          <rect x={312} y={268} width={515 * barP} height={124} rx={16} fill={C.gold} style={{ filter: svgGlow(C.gold, 12) }} />
          <text x={568} y={325} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={40} opacity={barP}>
            ~1.7 V (80%)
          </text>
          <text x={568} y={366} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={22} opacity={barP}>
            FROM EINSTEIN'S RELATIVITY!
          </text>

          <text x={238} y={455} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20}>
            CLASSICAL
          </text>
          <text x={580} y={455} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
            RELATIVISTIC BOOST (~2.1 V TOTAL)
          </text>

          <rect x={110} y={595} width={780} height={76} rx={38} fill="rgba(34, 24, 4, 0.95)" stroke={C.gold} strokeWidth={3} />
          <text x={500} y={642} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={1.4}>
            WITHOUT RELATIVITY, YOUR CAR WON'T START!
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 8: FULL 11:01 VIDEO FUNNEL CTA CARD (UPLOADED YOUTUBE CARD!)
// ===========================================================================
const Beat8CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 105 } });
  const pulse = 1 + 0.025 * Math.sin(t * 5);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 165,
          left: 54,
          right: 54,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 28, color: C.gold, letterSpacing: 4 }}>
          FULL 11:01 VISUAL BREAKDOWN
        </div>
        <BigText size={52} style={{ marginTop: 14, lineHeight: 1.12, maxWidth: 960 }}>
          How Relativity Rewrites <span style={{ color: C.cyan }}>The Periodic Table</span>
        </BigText>

        {/* Glowing Uploaded YouTube Video Card */}
        <div
          style={{
            marginTop: 48,
            width: 920,
            borderRadius: 34,
            overflow: "hidden",
            background: "#ffffff",
            border: `4px solid ${C.gold}`,
            boxShadow: `${glow(C.gold, 20)}, 0 26px 70px rgba(0,0,0,0.92)`,
            transform: `scale(${0.86 + 0.14 * pop})`,
          }}
        >
          <Img
            src={staticFile("relbonds/yt-video-card.jpg")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* High-Contrast CTA Pill */}
        <div
          style={{
            marginTop: 46,
            padding: "22px 54px",
            borderRadius: 50,
            background: C.gold,
            boxShadow: glow(C.gold, 16),
            transform: `scale(${pulse})`,
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 32,
            color: "#040814",
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
// MAIN 9:16 SHORT COMPOSITION: RelativityBondsShort
// ===========================================================================
export const RelativityBondsShort: React.FC = () => {
  const b1 = scue("Why?");
  const b2 = scue("At relativistic");
  const b3 = scue("keeping mercury");
  const b4 = scue("Even wilder");
  const b5 = scue("Yet in");
  const b6 = scue("Relativity even");
  const b7 = scue("I broke down");
  const end = REL_BONDS_SHORT_FRAMES;

  return (
    <AbsoluteFill>
      <VerticalBackground />

      <BeatWrap from={0} to={b1}>
        <Beat1GoldToSilver
          einsteinAt={Math.max(6, scue("Einstein's"))}
          switchOffAt={Math.max(15, scue("instantly turn"))}
        />
      </BeatWrap>

      <BeatWrap from={b1} to={b2}>
        <Beat2GoldSpeed60 speedAt={Math.max(20, scue("nearly sixty") - b1)} />
      </BeatWrap>

      <BeatWrap from={b2} to={b3}>
        <Beat3GoldBlueLight blueAt={Math.max(15, scue("swallow blue") - b2)} />
      </BeatWrap>

      <BeatWrap from={b3} to={b4}>
        <Beat4LiquidMercury />
      </BeatWrap>

      <BeatWrap from={b4} to={b5}>
        <Beat5TextbookTriple
          sigmaAt={Math.max(10, scue("one pure sigma") - b4)}
          piAt={Math.max(20, scue("two separate pi") - b4)}
        />
      </BeatWrap>

      <BeatWrap from={b5} to={b6}>
        <Beat6BismuthCollapse
          bismuthAt={Math.max(10, scue("super-heavy bismuth") - b5)}
          collapseAt={Math.max(20, scue("completely collapsed") - b5)}
        />
      </BeatWrap>

      <BeatWrap from={b6} to={b7}>
        <Beat7CarBattery80 />
      </BeatWrap>

      <BeatWrap from={b7} to={end}>
        <Beat8CtaCard />
      </BeatWrap>

      <ShortSubtitleLayer />
      <Audio src={staticFile("relbonds/short-voiceover.wav")} />
    </AbsoluteFill>
  );
};
