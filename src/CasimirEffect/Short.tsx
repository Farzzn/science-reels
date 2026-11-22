import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import shortData from "../../public/casimir/short-words.json";
import { BigText, Kicker, SceneFade } from "../FiveHundredMileEmail/components";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const CASIMIR_SHORT_FRAMES = Math.ceil((shortData.duration + 0.6) * FPS);

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
// BURNED-IN WORD-ALIGNED SUBTITLES
// ===========================================================================
const HIGHLIGHT_SET = new Set([
  "mirrors",
  "nanometers",
  "empty",
  "zero",
  "slam",
  "nothing",
  "quantum",
  "heisenberg's",
  "waves",
  "humming",
  "standing",
  "guitar",
  "banned",
  "outside",
  "pushes",
  "casimir",
  "weld",
  "smartphone",
  "liquid",
  "levitate",
  "gold",
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
        paddingBottom: 195,
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
          background: "rgba(4, 8, 20, 0.84)",
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
// CLEAN TOP PILL
// ===========================================================================
const ShortPill: React.FC<{ text: string; color?: string }> = ({ text, color = C.gold }) => (
  <div
    style={{
      display: "inline-flex",
      padding: "10px 30px",
      borderRadius: 40,
      background: "rgba(8, 15, 36, 0.9)",
      border: `2px solid ${color}`,
      boxShadow: glow(color, 10),
      fontFamily: MONO,
      fontWeight: 900,
      fontSize: 25,
      color,
      letterSpacing: 3,
    }}
  >
    {text}
  </div>
);

// ===========================================================================
// MAIN 9:16 SHORT COMPOSITION: CasimirEffectShort
// ===========================================================================
export const CasimirEffectShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Exact word-synced cues from public/casimir/short-words.json
  const tNoAir = scue("No air");
  const tNoElec = scue("No electricity");
  const tNoGrav = scue("zero gravity");
  const tSlam = scue("Yet the moment");
  const tQuantum = scue("In quantum physics");
  const tMirrors = scue("Between two close");
  const tBanned = scue("Long waves are banned");
  const tOutside = scue("Outside, every wavelength");
  const tCasimir = scue("It's called the Casimir");
  const tWeld = scue("weld microscopic");
  const tLiquid = scue("inside a special liquid");
  const tPushUp = scue("push upward");
  const tFull = scue("I broke down");

  // Beat 1: Slam animation
  const rawSlam = interpolate(frame, [tSlam + 4, tSlam + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slamEase = rawSlam * rawSlam * rawSlam;
  const halfGap1 = 150 * (1 - slamEase) + 12;
  const shock1 = interpolate(frame, [tSlam + 28, tSlam + 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 2: 3D Undulating Quantum Field Ocean helper
  const rows2 = 9;
  const cols2 = 16;
  const fieldPt = (c: number, r: number): [number, number] => {
    const u = c / (cols2 - 1);
    const v = r / (rows2 - 1);
    const x = 95 + u * 890 + (v - 0.5) * 90;
    const wave = Math.sin(u * 10 - frame * 0.16 + v * 3) * 34 + Math.cos(u * 18 + frame * 0.24) * 14;
    const y = 180 + v * 460 + wave;
    return [x, y];
  };

  // Beat 5: MEMS cantilever snap
  const snap5 = interpolate(frame, [tWeld - 4, tWeld + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tipY5 = 280 + snap5 * 290 + (1 - snap5) * Math.sin(frame * 0.65) * 10;

  // Beat 6: Liquid fill + levitating gold sphere
  const fluidP = interpolate(frame, [tLiquid, tLiquid + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const levP = interpolate(frame, [tPushUp, tPushUp + 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sphereY6 = 525 - levP * 205 + Math.sin(frame * 0.12) * 8 * levP;

  // Beat 7: CTA bounce
  const ctaPop = spring({ frame: Math.max(0, frame - tFull), fps, config: { damping: 14, stiffness: 120 } });
  const ctaPulse = 1 + Math.sin(frame * 0.16) * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0, overflow: "hidden" }}>
      <VerticalBackground />
      <Audio src={staticFile("casimir/short-voiceover.wav")} />

      {/* ================================================================= */}
      {/* BEAT 1: TWO UNCHARGED 3D MIRRORS IN EMPTY SPACE -> SLAM TOGETHER! */}
      {/* ================================================================= */}
      <SceneFade from={0} to={tQuantum - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 128 }}>
          <ShortPill text="ABSOLUTE ZERO · 100 nm GAP" color={C.gold} />
          <BigText size={62} style={{ marginTop: 26, maxWidth: 940, textAlign: "center" }}>
            {frame >= tSlam ? (
              <>
                Pushed Together by <span style={{ color: C.red }}>&ldquo;Nothing&rdquo;</span>
              </>
            ) : (
              <>
                Two Uncharged Mirrors in <span style={{ color: C.cyan }}>Empty Space</span>
              </>
            )}
          </BigText>

          <svg width={960} height={740} viewBox="0 0 960 740" style={{ marginTop: 34 }}>
            <defs>
              <linearGradient id="smPlateL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="70%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
              <linearGradient id="smPlateR" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* 3D Perspective Left & Right Mirrors */}
            <g transform={`translate(${480 - halfGap1}, 365)`} style={{ filter: svgGlow(rawSlam > 0.1 ? C.gold : C.cyan, 10) }}>
              <polygon points="-90,-215 -14,-180 -14,180 -90,215" fill="#0f172a" stroke="#64748b" strokeWidth={2.5} />
              <rect x={-28} y={-180} width={28} height={360} rx={5} fill="url(#smPlateL)" stroke={C.gold} strokeWidth={3} />
            </g>
            <g transform={`translate(${480 + halfGap1}, 365)`} style={{ filter: svgGlow(rawSlam > 0.1 ? C.gold : C.cyan, 10) }}>
              <polygon points="90,-215 14,-180 14,180 90,215" fill="#0f172a" stroke="#64748b" strokeWidth={2.5} />
              <rect x={0} y={-180} width={28} height={360} rx={5} fill="url(#smPlateR)" stroke={C.gold} strokeWidth={3} />
            </g>

            {/* Inward Slam Arrows */}
            {rawSlam > 0.05 && (
              <g style={{ filter: svgGlow(C.red, 12) }}>
                <line x1={480 - halfGap1 - 240} y1={365} x2={480 - halfGap1 - 115} y2={365} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
                <polygon points={`${480 - halfGap1 - 85},365 ${480 - halfGap1 - 130},336 ${480 - halfGap1 - 130},394`} fill={C.red} />
                <line x1={480 + halfGap1 + 240} y1={365} x2={480 + halfGap1 + 115} y2={365} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
                <polygon points={`${480 + halfGap1 + 85},365 ${480 + halfGap1 + 130},336 ${480 + halfGap1 + 130},394`} fill={C.red} />
              </g>
            )}

            {/* Slam Impact Shockwave */}
            {shock1 > 0 && shock1 < 1 && (
              <circle cx={480} cy={365} r={30 + shock1 * 290} fill="none" stroke={C.gold} strokeWidth={12 * (1 - shock1)} opacity={1 - shock1} />
            )}
          </svg>

          {/* Sequential Crossed-Out Badges (No Air / No Charge / No Gravity) */}
          <div style={{ display: "flex", gap: 22, marginTop: 12 }}>
            {[
              { label: "NO AIR ✕", at: tNoAir, col: C.cyan },
              { label: "NO CHARGE ✕", at: tNoElec, col: C.gold },
              { label: "NO GRAVITY ✕", at: tNoGrav, col: C.red },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  opacity: frame >= b.at - 4 ? 1 : 0.12,
                  padding: "14px 26px",
                  borderRadius: 16,
                  background: "rgba(8,15,36,0.92)",
                  border: `2.5px solid ${b.col}`,
                  fontFamily: MONO,
                  fontWeight: 900,
                  fontSize: 25,
                  color: b.col,
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 2: LIVING 3D QUANTUM FIELD OCEAN — ALWAYS HUMMING            */}
      {/* ================================================================= */}
      <SceneFade from={tQuantum - 4} to={tMirrors - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 128 }}>
          <ShortPill text="QUANTUM VACUUM" color={C.cyan} />
          <BigText size={62} style={{ marginTop: 26, maxWidth: 940, textAlign: "center" }}>
            Empty Space Is <span style={{ color: C.gold }}>Always Humming</span>
          </BigText>

          <svg width={1040} height={820} viewBox="0 0 1040 820" style={{ marginTop: 34 }}>
            {new Array(rows2).fill(0).map((_, r) => {
              const pts = new Array(cols2)
                .fill(0)
                .map((__, c) => {
                  const [px, py] = fieldPt(c, r);
                  return `${px.toFixed(1)},${py.toFixed(1)}`;
                })
                .join(" ");
              const mid = r === 4;
              return (
                <polyline
                  key={`sr-${r}`}
                  points={pts}
                  fill="none"
                  stroke={mid ? C.gold : C.cyan}
                  strokeWidth={mid ? 6 : 2.5}
                  opacity={mid ? 0.98 : 0.52}
                  style={mid ? { filter: svgGlow(C.gold, 10) } : undefined}
                />
              );
            })}
            {new Array(cols2).fill(0).map((_, c) => {
              const pts = new Array(rows2)
                .fill(0)
                .map((__, r) => {
                  const [px, py] = fieldPt(c, r);
                  return `${px.toFixed(1)},${py.toFixed(1)}`;
                })
                .join(" ");
              return <polyline key={`sc-${c}`} points={pts} fill="none" stroke={C.cyan} strokeWidth={1.6} opacity={0.3} />;
            })}

            <text x={520} y={760} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={36}>
              Heisenberg Forbids Flat Zero
            </text>
          </svg>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 3: PINNED GUITAR-STRING STANDING WAVES — LONG WAVES BANNED   */}
      {/* ================================================================= */}
      <SceneFade from={tMirrors - 4} to={tOutside - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 128 }}>
          <ShortPill text="BOUNDARY RULES" color={C.cyan} />
          <BigText size={60} style={{ marginTop: 26, maxWidth: 940, textAlign: "center" }}>
            Only <span style={{ color: C.cyan }}>Pinned Waves</span> Fit Inside
          </BigText>

          <svg width={980} height={820} viewBox="0 0 980 820" style={{ marginTop: 28 }}>
            {/* Mirror Walls */}
            <rect x={160} y={70} width={38} height={630} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
            <rect x={782} y={70} width={38} height={630} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />

            {/* 3 Pinned Standing Waves */}
            {[
              { n: 1, cy: 195, col: C.cyan, spd: 0.18 },
              { n: 2, cy: 365, col: C.green, spd: 0.24 },
              { n: 3, cy: 525, col: C.gold, spd: 0.3 },
            ].map((m) => {
              const pts = new Array(48)
                .fill(0)
                .map((_, i) => {
                  const u = i / 47;
                  return `${(198 + u * 584).toFixed(1)},${(m.cy + Math.sin(u * m.n * Math.PI) * 44 * Math.cos(frame * m.spd)).toFixed(1)}`;
                })
                .join(" ");
              return (
                <g key={m.n}>
                  <polyline points={pts} fill="none" stroke={m.col} strokeWidth={7} style={{ filter: svgGlow(m.col, 8) }} />
                  <circle cx={198} cy={m.cy} r={10} fill={C.gold} />
                  <circle cx={782} cy={m.cy} r={10} fill={C.gold} />
                </g>
              );
            })}

            {/* Forbidden Long Wave Appears Right on "Long waves are banned" */}
            {frame >= tBanned - 4 && (
              <g opacity={0.75 + 0.25 * Math.sin(frame * 0.25)}>
                <polyline
                  points={new Array(38)
                    .fill(0)
                    .map((_, i) => `${(198 + (i / 37) * 584).toFixed(1)},${(660 + Math.sin((i / 37) * Math.PI * 0.6) * 52 * Math.cos(frame * 0.15)).toFixed(1)}`)
                    .join(" ")}
                  fill="none"
                  stroke={C.red}
                  strokeWidth={7}
                  strokeDasharray="14 10"
                  style={{ filter: svgGlow(C.red, 8) }}
                />
                <text x={490} y={770} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={40}>
                  Long Waves Banned Inside ✕
                </text>
              </g>
            )}
          </svg>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 4: OUTER WAVES HAMMER PLATES -> NET PUSH INWARD              */}
      {/* ================================================================= */}
      <SceneFade from={tOutside - 4} to={tCasimir - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 128 }}>
          <ShortPill text="PRESSURE IMBALANCE" color={C.red} />
          <BigText size={58} style={{ marginTop: 26, maxWidth: 940, textAlign: "center" }}>
            Outer Waves <span style={{ color: C.gold }}>Outnumber</span> the Gap
          </BigText>

          <svg width={1020} height={820} viewBox="0 0 1020 820" style={{ marginTop: 28 }}>
            {/* Wild Multi-Wavelength Outer Waves Slamming Both Sides */}
            {[
              { y: 170, cyc: 4, col: C.cyan, spd: 0.22 },
              { y: 315, cyc: 2.5, col: C.gold, spd: 0.16 },
              { y: 465, cyc: 1.6, col: "#c084fc", spd: 0.11 },
              { y: 615, cyc: 1.0, col: C.red, spd: 0.08 },
            ].map((w, k) => {
              const ptsL = new Array(36).fill(0).map((_, i) => `${(40 + (i / 35) * 335).toFixed(1)},${(w.y + Math.sin((i / 35) * w.cyc * Math.PI * 2 - frame * w.spd) * 34).toFixed(1)}`).join(" ");
              const ptsR = new Array(36).fill(0).map((_, i) => `${(980 - (i / 35) * 335).toFixed(1)},${(w.y + Math.sin((i / 35) * w.cyc * Math.PI * 2 - frame * w.spd) * 34).toFixed(1)}`).join(" ");
              return (
                <React.Fragment key={k}>
                  <polyline points={ptsL} fill="none" stroke={w.col} strokeWidth={5} opacity={0.85} />
                  <polyline points={ptsR} fill="none" stroke={w.col} strokeWidth={5} opacity={0.85} />
                </React.Fragment>
              );
            })}

            {/* Calm Single Small Wave Inside */}
            <polyline
              points={new Array(30).fill(0).map((_, i) => `${(420 + (i / 29) * 180).toFixed(1)},${(390 + Math.sin((i / 29) * Math.PI) * 32 * Math.cos(frame * 0.2)).toFixed(1)}`).join(" ")}
              fill="none"
              stroke={C.cyan}
              strokeWidth={6}
              style={{ filter: svgGlow(C.cyan, 8) }}
            />

            {/* Mirror Plates */}
            <rect x={380} y={115} width={40} height={555} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} />
            <rect x={600} y={115} width={40} height={555} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} />

            {/* Giant Crimson Inward Push Arrows */}
            <g style={{ filter: svgGlow(C.red, 12) }}>
              <line x1={130} y1={390} x2={335} y2={390} stroke={C.red} strokeWidth={20} strokeLinecap="round" />
              <polygon points="368,390 322,358 322,422" fill={C.red} />
              <line x1={890} y1={390} x2={685} y2={390} stroke={C.red} strokeWidth={20} strokeLinecap="round" />
              <polygon points="652,390 698,358 698,422" fill={C.red} />
            </g>

            <text x={510} y={765} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={40}>
              Net Radiation Push Inward!
            </text>
          </svg>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 5: MEMS SMARTPHONE SWITCHES WELDED SHUT (STICTION)           */}
      {/* ================================================================= */}
      <SceneFade from={tCasimir - 4} to={tLiquid - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 128 }}>
          <ShortPill text="THE CASIMIR EFFECT" color={C.red} />
          <BigText size={58} style={{ marginTop: 26, maxWidth: 940, textAlign: "center" }}>
            Strong Enough to <span style={{ color: C.red }}>Weld Microchips Shut</span>
          </BigText>

          <svg width={960} height={820} viewBox="0 0 960 820" style={{ marginTop: 30 }}>
            {/* Chip Substrate Floor */}
            <rect x={70} y={595} width={820} height={74} rx={12} fill="#1e293b" stroke="#64748b" strokeWidth={4} />
            <rect x={390} y={576} width={440} height={20} rx={5} fill={C.gold} />
            <text x={480} y={644} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={900} fontSize={26}>
              SMARTPHONE SILICON CHIP
            </text>

            {/* Anchor Pillar */}
            <rect x={95} y={240} width={96} height={355} rx={10} fill="#334155" stroke={C.cyan} strokeWidth={3.5} />

            {/* Silicon Micro-Cantilever Snapping Down */}
            <path
              d={`M191,280 Q510,${280 + (tipY5 - 280) * 0.28} 810,${tipY5}`}
              fill="none"
              stroke={snap5 > 0.7 ? C.red : C.cyan}
              strokeWidth={32}
              strokeLinecap="round"
              style={{ filter: svgGlow(snap5 > 0.7 ? C.red : C.cyan, 12) }}
            />

            {/* Downward Pull Arrows */}
            {[500, 650, 770].map((ax, i) => (
              <g key={i} style={{ filter: svgGlow(C.red, 8) }}>
                <line x1={ax} y1={tipY5 - 115} x2={ax} y2={tipY5 - 38} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
                <polygon points={`${ax},${tipY5 - 18} ${ax - 16},${tipY5 - 46} ${ax + 16},${tipY5 - 46}`} fill={C.red} />
              </g>
            ))}

            {snap5 > 0.8 && (
              <g style={{ filter: svgGlow(C.red, 12) }}>
                <circle cx={810} cy={576} r={38 + Math.sin(frame * 0.5) * 10} fill="none" stroke={C.red} strokeWidth={6} />
                <text x={480} y={760} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={42}>
                  Stuck Forever (Stiction) ✕
                </text>
              </g>
            )}
          </svg>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 6: REPULSIVE CASIMIR QUANTUM LEVITATION IN LIQUID            */}
      {/* ================================================================= */}
      <SceneFade from={tLiquid - 4} to={tFull - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 128 }}>
          <ShortPill text="REVERSE CASIMIR" color={C.green} />
          <BigText size={58} style={{ marginTop: 26, maxWidth: 940, textAlign: "center" }}>
            Inside Special Liquid, It <span style={{ color: C.green }}>Levitates Gold</span>
          </BigText>

          <svg width={940} height={830} viewBox="0 0 940 830" style={{ marginTop: 24 }}>
            <defs>
              <linearGradient id="sFluid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.48" />
              </linearGradient>
              <radialGradient id="sGoldSph" cx="35%" cy="32%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>

            <rect x={80} y={40} width={780} height={660} rx={30} fill="rgba(8,15,36,0.9)" stroke={C.green} strokeWidth={4} />
            <rect x={86} y={694 - fluidP * 580} width={768} height={fluidP * 580} rx={24} fill="url(#sFluid)" />

            {/* Silica Glass Floor */}
            <rect x={165} y={605} width={610} height={54} rx={12} fill="rgba(147,197,253,0.34)" stroke={C.cyan} strokeWidth={3.5} />
            <text x={470} y={642} textAnchor="middle" fill="#fff" fontFamily={INTER} fontWeight={900} fontSize={28}>
              Silica Glass Plate
            </text>

            {/* Upward Green Repulsive Arrows */}
            {levP > 0.08 &&
              [355, 470, 585].map((ax, i) => (
                <g key={i} opacity={levP} style={{ filter: svgGlow(C.green, 10) }}>
                  <line x1={ax} y1={592} x2={ax} y2={sphereY6 + 135} stroke={C.green} strokeWidth={12} strokeLinecap="round" />
                  <polygon points={`${ax},${sphereY6 + 106} ${ax - 18},${sphereY6 + 142} ${ax + 18},${sphereY6 + 142}`} fill={C.green} />
                </g>
              ))}

            {/* Levitating 3D Gold Sphere */}
            <g transform={`translate(470, ${sphereY6})`} style={{ filter: svgGlow(C.gold, 14) }}>
              <circle cx={0} cy={0} r={96} fill="url(#sGoldSph)" stroke={C.gold} strokeWidth={4.5} />
              <text x={0} y={10} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={32}>
                Gold
              </text>
            </g>

            <text x={470} y={780} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={38}>
              Quantum Levitation — Zero Magnets ✓
            </text>
          </svg>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 7: CTA — ATTACHED YOUTUBE VIDEO CARD + WATCH BUTTON          */}
      {/* ================================================================= */}
      <SceneFade from={tFull - 4} to={CASIMIR_SHORT_FRAMES + 20} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 180 }}>
          <Kicker color={C.gold} style={{ fontSize: 30 }}>
            FULL 12:29 VISUAL BREAKDOWN
          </Kicker>
          <BigText size={58} style={{ marginTop: 14, maxWidth: 940, textAlign: "center" }}>
            Real Gold, Dipoles &amp; <span style={{ color: C.cyan }}>Quantum Levitation</span>
          </BigText>

          {/* Attached YouTube Video Card Hero */}
          <div
            style={{
              marginTop: 58,
              width: 920,
              borderRadius: 28,
              overflow: "hidden",
              border: `4px solid ${C.gold}`,
              background: "#ffffff",
              boxShadow: glow(C.gold, 18),
              transform: `scale(${interpolate(ctaPop, [0, 1], [0.88, 1])})`,
            }}
          >
            <Img src={staticFile("casimir/yt-video-card.png")} style={{ width: "100%", height: "auto", display: "block" }} />
          </div>

          <div
            style={{
              marginTop: 54,
              padding: "24px 58px",
              borderRadius: 54,
              background: C.gold,
              color: "#040814",
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 40,
              boxShadow: glow(C.gold, 16),
              transform: `scale(${ctaPulse})`,
            }}
          >
            WATCH FULL VIDEO ON CHANNEL ↑
          </div>
        </AbsoluteFill>
      </SceneFade>

      <ShortSubtitleLayer />
    </AbsoluteFill>
  );
};
