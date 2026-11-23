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
import shortData from "../../public/macrotunnel/short-words.json";
import { BigText } from "../FiveHundredMileEmail/components";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const MACRO_TUNNEL_SHORT_FRAMES = Math.ceil((shortData.duration + 0.55) * FPS);

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
// BURNED-IN WORD-ALIGNED SUBTITLES (Zero word-touching flex gap!)
// ===========================================================================
const HIGHLIGHT_SET = new Set([
  "quantum",
  "tunneling",
  "atoms",
  "2025",
  "nobel",
  "hand",
  "superconducting",
  "billions",
  "synchronized",
  "wave",
  "zero",
  "voltage",
  "marble",
  "hill",
  "tunnels",
  "spike",
  "microwaves",
  "uneven",
  "rungs",
  "computers",
  "qubits",
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
        paddingBottom: 205,
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
          columnGap: 22,
          rowGap: 6,
          background: "rgba(4, 8, 20, 0.86)",
          border: "1.5px solid rgba(62, 224, 255, 0.28)",
          borderRadius: 24,
          padding: "20px 34px",
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
                fontSize: 48,
                lineHeight: 1.25,
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
// CLEAN TOP PILL & BEAT WRAPPER
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
      letterSpacing: 3,
    }}
  >
    {text}
  </div>
);

const BeatWrap: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 2) return null;
  const inO = from <= 2 ? 1 : interpolate(frame, [from, from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(frame, [to - 10, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
      top: 165,
      left: 54,
      right: 54,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <ShortPill text={pill} color={pillColor} />
    <BigText size={58} style={{ marginTop: 22, lineHeight: 1.12, maxWidth: 960 }}>
      {children}
    </BigText>
  </div>
);

// ===========================================================================
// BEAT 1: SUBATOMIC QUANTUM TUNNELING (ATOMS ONLY?)
// ===========================================================================
const Beat1AtomTunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const waveCenter = interpolate((t * 0.45) % 1, [0, 1], [140, 880]);
  const pts: string[] = [];
  for (let x = 70; x <= 930; x += 6) {
    const env = Math.exp(-Math.pow((x - waveCenter) / 115, 2));
    const damp = x >= 445 && x <= 555 ? Math.exp(-(x - 445) / 68) : x > 555 ? 0.46 : 1;
    const y = 410 - env * damp * Math.sin(x * 0.11 - t * 14) * 125;
    pts.push(`${x === 70 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  return (
    <AbsoluteFill>
      <ShortHeader pill="THE OLD ASSUMPTION" pillColor={C.cyan}>
        Only Inside <span style={{ color: C.cyan }}>Invisible Atoms?</span>
      </ShortHeader>
      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 800" style={{ width: 1000, height: 800 }}>
          <defs>
            <linearGradient id="sWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.cyan} stopOpacity="0.65" />
              <stop offset="100%" stopColor="#103d78" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <line x1={70} y1={410} x2={930} y2={410} stroke="rgba(127,147,196,0.22)" strokeWidth={2.5} strokeDasharray="8 8" />
          <rect x={445} y={140} width={110} height={530} rx={16} fill="url(#sWall)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 10) }} />
          <text x={500} y={110} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2}>
            ENERGY BARRIER
          </text>
          <path d={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 9) }} />
          {waveCenter > 545 && (
            <circle cx={Math.min(890, waveCenter)} cy={410} r={24} fill={C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />
          )}
          <text x={500} y={735} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={27} letterSpacing={2}>
            QUANTUM WAVE SLIPS STRAIGHT THROUGH →
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 2: 2025 NOBEL PRIZE — PHOTOREALISTIC HAND HOLDING SUPERCONDUCTING CHIP
// ===========================================================================
const Beat2HandChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterP = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const zoom = interpolate(frame, [0, 180], [1.02, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <ShortHeader pill="2025 NOBEL PRIZE IN PHYSICS" pillColor={C.gold}>
        A Quantum Circuit You Can <span style={{ color: C.gold }}>Hold in Your Hand</span>
      </ShortHeader>
      <div
        style={{
          position: "absolute",
          top: 505,
          left: 65,
          right: 65,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${0.9 + 0.1 * enterP})`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 940,
            height: 620,
            borderRadius: 34,
            overflow: "hidden",
            border: `3.5px solid ${C.gold}`,
            boxShadow: `${glow(C.gold, 14)}, 0 24px 65px rgba(0,0,0,0.88)`,
          }}
        >
          <Img
            src={staticFile("macrotunnel/hand-chip.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(4,8,20,0.72) 100%)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "14px 38px",
            borderRadius: 40,
            background: "rgba(6, 14, 34, 0.94)",
            border: `2.5px solid ${C.cyan}`,
            boxShadow: glow(C.cyan, 8),
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 28,
            color: C.cyan,
            letterSpacing: 2.5,
          }}
        >
          ~1 cm SUPERCONDUCTING CHIP
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 3: BILLIONS OF ELECTRONS LOCK INTO ONE SYNCHRONIZED QUANTUM WAVE
// ===========================================================================
const Beat3CooperWave: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const lockP = interpolate(frame, [0, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const makeWave = (layer: number) => {
    const spread = layer * 62 * (1 - lockP * 0.88);
    const phase = layer * 1.1 * (1 - lockP);
    const pts: string[] = [];
    for (let x = 70; x <= 930; x += 8) {
      const y = 400 + spread + Math.sin(x * 0.018 - t * 5.2 + phase) * (105 + lockP * 28);
      pts.push(`${x === 70 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <AbsoluteFill>
      <ShortHeader pill="NEAR ABSOLUTE ZERO" pillColor={C.cyan}>
        Billions Locked Into <span style={{ color: C.gold }}>One Quantum Wave</span>
      </ShortHeader>
      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 800" style={{ width: 1000, height: 800 }}>
          {[-2, -1, 0, 1, 2].map((ly) => (
            <path
              key={ly}
              d={makeWave(ly)}
              fill="none"
              stroke={ly === 0 ? C.gold : C.cyan}
              strokeWidth={ly === 0 ? 8 : 4}
              opacity={ly === 0 ? 1 : 0.72 - lockP * 0.3}
              strokeLinecap="round"
              style={ly === 0 ? { filter: svgGlow(C.gold, 10) } : undefined}
            />
          ))}
          {Array.from({ length: 10 }, (_, i) => {
            const x = 115 + i * 86;
            const y = 400 + Math.sin(x * 0.018 - t * 5.2) * (105 + lockP * 28);
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <circle cx={-9} cy={0} r={9} fill={C.white} />
                <circle cx={9} cy={0} r={9} fill={C.cyan} />
              </g>
            );
          })}
          <text x={500} y={690} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={27} letterSpacing={2}>
            0.02 K · COOPER PAIRS IN TOTAL LOCKSTEP
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 4: TILTED WASHBOARD TRAP (0.00 V MARBLE BEHIND HILL)
// ===========================================================================
const Beat4TrappedMarble: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ramp = interpolate(frame, [0, 95], [0.2, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const evalY = (x: number) => {
    const phi = ((x - 450) / 145) * Math.PI;
    const tilt = ramp * 0.82 * ((x - 450) / 145) * 98;
    return 335 - Math.cos(phi) * 92 + tilt;
  };
  const pts: string[] = [];
  for (let x = 70; x <= 930; x += 8) {
    pts.push(`${x === 70 ? "M" : "L"}${x},${evalY(x).toFixed(1)}`);
  }

  const mx = 310 + ramp * 34 + Math.sin(t * 5) * 7;
  const my = evalY(mx) - 26;

  return (
    <AbsoluteFill>
      <ShortHeader pill="JOSEPHSON JUNCTION TRAP" pillColor={C.gold}>
        Trapped Behind a Hill at <span style={{ color: C.cyan }}>Zero Volts</span>
      </ShortHeader>
      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 800" style={{ width: 1000, height: 800 }}>
          <path d={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 9) }} />
          <circle cx={mx} cy={my} r={28} fill={C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.gold, 12) }} />

          {/* Clean 0.00 V flat readout */}
          <rect x={165} y={620} width={670} height={110} rx={24} fill="rgba(6, 14, 34, 0.94)" stroke={C.cyan} strokeWidth={3} />
          <line x1={215} y1={675} x2={560} y2={675} stroke={C.cyan} strokeWidth={6} style={{ filter: svgGlow(C.cyan, 8) }} />
          <text x={700} y={687} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={40}>
            0.00 V
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 5: TUNNELS STRAIGHT THROUGH HILL → SNAPS INTO LIVE VOLTAGE SPIKE!
// ===========================================================================
const Beat5TunnelSnap: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Marble tunnels straight horizontally through the hill over 0..1.8s, then tumbles!
  const p = interpolate(t, [0.3, 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const snapped = p > 0.52;
  const mx = interpolate(p, [0, 0.55, 1], [315, 620, 885]);
  const my = p > 0.62 ? interpolate(p, [0.62, 1], [345, 535]) : 345;
  const inWall = mx > 410 && mx < 595;

  const vPts: string[] = [];
  for (let x = 150; x <= 610; x += 6) {
    let vy = 695;
    if (snapped && x >= 355) {
      const step = interpolate(x, [355, 378], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      vy = 695 - step * (66 + Math.sin(x * 0.16 - t * 22) * 8);
    }
    vPts.push(`${x === 150 ? "M" : "L"}${x},${vy.toFixed(1)}`);
  }

  return (
    <AbsoluteFill>
      <ShortHeader pill="MACROSCOPIC TUNNELING" pillColor={C.gold}>
        Tunnels Straight Through → <span style={{ color: C.gold }}>Voltage Spike!</span>
      </ShortHeader>
      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 800" style={{ width: 1000, height: 800 }}>
          <path d="M90,210 Q230,455 340,425 Q450,395 510,200 Q595,210 910,580" fill="none" stroke={C.cyan} strokeWidth={8} style={{ filter: svgGlow(C.cyan, 8) }} />

          {/* Ghost horizontal tunnel path piercing straight through hill */}
          <line x1={315} y1={345} x2={690} y2={345} stroke={C.gold} strokeWidth={5.5} strokeDasharray="14 10" opacity={0.85} />
          <polygon points="710,345 680,330 680,360" fill={C.gold} />

          {/* Tunneling marble */}
          <circle
            cx={mx}
            cy={my}
            r={28}
            fill={snapped ? C.gold : C.cyan}
            stroke={C.white}
            strokeWidth={3}
            opacity={inWall ? 0.48 : 1}
            style={{ filter: svgGlow(snapped ? C.gold : C.cyan, 12) }}
          />

          {/* Live Snapping Oscilloscope Meter */}
          <rect x={115} y={600} width={770} height={135} rx={24} fill="rgba(6, 14, 34, 0.94)" stroke={snapped ? C.gold : C.cyan} strokeWidth={3.5} />
          <path d={vPts.join(" ")} fill="none" stroke={snapped ? C.gold : C.cyan} strokeWidth={6.5} style={{ filter: svgGlow(snapped ? C.gold : C.cyan, 8) }} />
          <text x={755} y={680} textAnchor="middle" fill={snapped ? C.gold : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={38}>
            {snapped ? "2.80 mV" : "0.00 mV"}
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 6: MICROWAVES + UNEVEN QUANTUM RUNGS = MODERN SUPERCONDUCTING QUBITS!
// ===========================================================================
const Beat6UnevenRungs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Uneven curved Josephson well
  const wellPts: string[] = [];
  for (let x = 200; x <= 800; x += 8) {
    const u = (x - 500) / 290;
    const y = 635 - 480 * (1 - Math.cos(u * Math.PI * 0.62));
    wellPts.push(`${x === 200 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  const rungs = [
    { n: 0, y: 565, hw: 145, col: C.cyan },
    { n: 1, y: 390, hw: 210, col: C.gold },
    { n: 2, y: 270, hw: 255, col: C.dim },
    { n: 3, y: 185, hw: 290, col: C.dim },
  ];
  const orbY = interpolate(Math.sin(t * 3.4), [-0.35, 0.35], [565, 390], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Incoming golden microwave ripple on left
  const mwPts: string[] = [];
  for (let x = 55; x <= 260; x += 6) {
    const y = 475 + Math.sin(x * 0.16 - t * 20) * 18;
    mwPts.push(`${x === 55 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  return (
    <AbsoluteFill>
      <ShortHeader pill="ARTIFICIAL ATOM → QUBIT" pillColor={C.green}>
        Uneven Rungs Power <span style={{ color: C.green }}>Quantum Computers</span>
      </ShortHeader>
      <div style={{ position: "absolute", top: 470, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 1000 800" style={{ width: 1000, height: 800 }}>
          <path d={mwPts.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} style={{ filter: svgGlow(C.gold, 8) }} />
          <path d={wellPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />

          {rungs.map((r) => {
            const isQubit = r.n <= 1;
            return (
              <g key={r.n}>
                <line
                  x1={500 - r.hw}
                  y1={r.y}
                  x2={500 + r.hw}
                  y2={r.y}
                  stroke={r.col}
                  strokeWidth={isQubit ? 7 : 3.5}
                  strokeDasharray={isQubit ? undefined : "10 8"}
                  opacity={isQubit ? 1 : 0.42}
                />
                <text x={500 - r.hw - 20} y={r.y + 9} textAnchor="end" fill={isQubit ? r.col : C.dim} fontFamily={MONO} fontWeight={900} fontSize={28}>
                  |{r.n}⟩
                </text>
              </g>
            );
          })}

          <line x1={500} y1={542} x2={500} y2={412} stroke={C.green} strokeWidth={6} />
          <circle cx={500} cy={orbY} r={25} fill={C.green} stroke={C.white} strokeWidth={3.5} style={{ filter: svgGlow(C.green, 12) }} />

          <rect x={140} y={675} width={720} height={74} rx={37} fill="rgba(6, 36, 24, 0.95)" stroke={C.green} strokeWidth={3} style={{ filter: svgGlow(C.green, 8) }} />
          <text x={500} y={721} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={1.5}>
            CLEAN ISOLATED |0⟩ ↔ |1⟩ QUBIT ✓
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 7: FULL VIDEO FUNNEL CTA CARD (12:28 YOUTUBE VIDEO SHOWCASE!)
// ===========================================================================
const Beat7CtaCard: React.FC = () => {
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
          top: 175,
          left: 54,
          right: 54,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 28, color: C.gold, letterSpacing: 4 }}>
          FULL 12:28 VISUAL BREAKDOWN
        </div>
        <BigText size={54} style={{ marginTop: 14, lineHeight: 1.12, maxWidth: 960 }}>
          Copper Shields, Magnetic Proof & <span style={{ color: C.cyan }}>Qubits</span>
        </BigText>

        {/* Glowing Uploaded YouTube Video Card */}
        <div
          style={{
            marginTop: 52,
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
            src={staticFile("macrotunnel/yt-video-card.png")}
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
// MAIN 9:16 SHORT COMPOSITION: MacroscopicTunnelingShort
// ===========================================================================
export const MacroscopicTunnelingShort: React.FC = () => {
  const b1 = scue("Yet the 2025");
  const b2 = scue("Cool a superconducting");
  const b3 = scue("Send current through");
  const b4 = scue("Then, with zero");
  const b5 = scue("Even wilder");
  const b6 = scue("I broke down");
  const end = MACRO_TUNNEL_SHORT_FRAMES;

  return (
    <AbsoluteFill>
      <VerticalBackground />

      <BeatWrap from={0} to={b1}>
        <Beat1AtomTunnel />
      </BeatWrap>
      <BeatWrap from={b1} to={b2}>
        <Beat2HandChip />
      </BeatWrap>
      <BeatWrap from={b2} to={b3}>
        <Beat3CooperWave />
      </BeatWrap>
      <BeatWrap from={b3} to={b4}>
        <Beat4TrappedMarble />
      </BeatWrap>
      <BeatWrap from={b4} to={b5}>
        <Beat5TunnelSnap />
      </BeatWrap>
      <BeatWrap from={b5} to={b6}>
        <Beat6UnevenRungs />
      </BeatWrap>
      <BeatWrap from={b6} to={end}>
        <Beat7CtaCard />
      </BeatWrap>

      <ShortSubtitleLayer />
      <Audio src={staticFile("macrotunnel/short-voiceover.wav")} />
    </AbsoluteFill>
  );
};
