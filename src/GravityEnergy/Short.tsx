import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import shortData from "../../public/gravity/short-words.json";
import { Appear, BigText, Kicker, Panel, SceneFade } from "../FiveHundredMileEmail/components";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const GRAVITY_SHORT_FRAMES = Math.ceil((shortData.duration + 0.6) * FPS);

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
// BURNED-IN WORD-ALIGNED SUBTITLES (SAFE BOTTOM MARGIN ABOVE SHORTS UI)
// ===========================================================================
const HIGHLIGHT_SET = new Set([
  "earth",
  "moon",
  "trillion",
  "rocket",
  "billion",
  "zero",
  "fuel",
  "arm",
  "conservation",
  "energy",
  "muscle",
  "fire",
  "release",
  "regrab",
  "heat",
  "table",
  "hundred",
  "joules",
  "work",
  "force",
  "distance",
  "ninety",
  "degrees",
  "direction",
  "speed",
  "einstein",
  "spacetime",
  "bend",
  "tides",
  "black",
  "waves",
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
          background: "rgba(4, 8, 20, 0.84)",
          border: "1.5px solid rgba(62, 224, 255, 0.28)",
          borderRadius: 24,
          padding: "20px 32px",
          textAlign: "center",
          maxWidth: 960,
          boxShadow: "0 14px 40px rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        {activeChunk.words.map((w, idx) => {
          const isCurrent = t >= w.s - 0.05 && t <= w.e + 0.18;
          const clean = norm(w.w);
          const isKeyword = HIGHLIGHT_SET.has(clean);
          const color = isCurrent ? C.gold : isKeyword ? "#ffe082" : C.white;
          return (
            <span
              key={`${idx}-${w.s}`}
              style={{
                display: "inline-block",
                marginRight: "0.32em",
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 52,
                lineHeight: 1.25,
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
// TOP BADGE PILL FOR VERTICAL SHORT
// ===========================================================================
const ShortPill: React.FC<{ label: string; sub: string; color?: string }> = ({
  label,
  sub,
  color = C.gold,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 28px",
      borderRadius: 40,
      background: "rgba(8, 15, 36, 0.9)",
      border: `2px solid ${color}`,
      boxShadow: glow(color, 10),
    }}
  >
    <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 28, color, letterSpacing: 2 }}>
      {label}
    </span>
    <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, color: C.white, letterSpacing: 1 }}>
      · {sub}
    </span>
  </div>
);

// ===========================================================================
// MAIN 9:16 SHORT COMPOSITION: GravityEnergyShort
// ===========================================================================
export const GravityEnergyShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Exact word-synced cues from public/gravity/short-words.json
  const tZeroFuel = scue("Yet it burns");
  const tHold = scue("Hold a heavy");
  const tBreak = scue("So how doesn't");
  const tFirst = scue("First, your arm");
  const tHeat = scue("burning food");
  const tTable = scue("A wooden table");
  const tWork = scue("work equals");
  const tMoon = scue("And what about");
  const tEinstein = scue("Even better");
  const tFull = scue("I broke down");

  // Reusable animation parameters
  const armShake = Math.sin(frame * 2.1) * 5;
  const orbitAngle = frame * 0.045;
  const heatParticles = useMemo(
    () =>
      new Array(22).fill(0).map((_, i) => ({
        x: 90 + random(`shx${i}`) * 780,
        phase: random(`shp${i}`),
        size: 5 + random(`shs${i}`) * 7,
        speed: 0.015 + random(`shv${i}`) * 0.02,
      })),
    [],
  );

  // Beat 6: Vertical 3D-Projected Geodesic Spacetime Bowl helper
  const bowlCx = 490;
  const bowlCy = 355;
  const bowlProj = (r: number, theta: number): [number, number] => {
    const x = bowlCx + Math.cos(theta) * r;
    const dip = 250 / (1 + Math.pow(r / 125, 1.85));
    const y = bowlCy + Math.sin(theta) * (r * 0.42) + dip - 65;
    return [x, y];
  };
  const bAngle = frame * 0.045;
  const [bmX, bmY] = bowlProj(245, bAngle);
  const bTrail = new Array(24).fill(0).map((_, i) => bowlProj(245, bAngle - i * 0.05));

  // Beat 7: CTA spring pop + gentle pulse
  const ctaPop = spring({
    frame: Math.max(0, frame - tFull),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const ctaBounce = 1 + Math.sin(frame * 0.16) * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0, overflow: "hidden" }}>
      <VerticalBackground />
      <Audio src={staticFile("gravity/short-voiceover.wav")} />

      {/* ================================================================= */}
      {/* BEAT 1: EARTH PULLING MOON — 10 TRILLION ROCKETS, 0 FUEL          */}
      {/* ================================================================= */}
      <SceneFade from={0} to={tHold - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 118 }}>
          <ShortPill label="4.5 BILLION YEARS" sub="NONSTOP PULL" color={C.gold} />
          <BigText size={82} color={C.gold} glowColor={C.gold} style={{ marginTop: 28, textAlign: "center" }}>
            1.98 × 10²⁰ N
          </BigText>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 40, color: C.white, marginTop: 8, textAlign: "center" }}>
            = <span style={{ color: C.red }}>10 Trillion</span> Rocket Engines
          </div>

          {/* Animated Earth <-> Moon Gravity Pull Diagram */}
          <svg width={960} height={740} viewBox="0 0 960 740" style={{ marginTop: 24 }}>
            <defs>
              <radialGradient id="sEarth1" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#091634" />
              </radialGradient>
              <radialGradient id="sMoon1" cx="32%" cy="32%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="65%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>
              <clipPath id="sEarthClip1">
                <circle cx={0} cy={0} r={145} />
              </clipPath>
            </defs>

            {/* Orbital Arc */}
            <circle cx={480} cy={520} r={370} fill="none" stroke="rgba(255,194,77,0.22)" strokeWidth={3} strokeDasharray="12 10" />

            {/* Pulsing Gravity Force Beam Earth -> Moon */}
            <line
              x1={480}
              y1={520}
              x2={480}
              y2={150}
              stroke={C.gold}
              strokeWidth={8}
              strokeDasharray="16 10"
              style={{ filter: svgGlow(C.gold, 10) }}
            />
            {/* Animated force pull chevrons moving downward from Moon to Earth */}
            {[0, 1, 2, 3].map((k) => {
              const p = (frame * 0.025 + k * 0.25) % 1;
              const cy = 205 + p * 180;
              return (
                <polygon
                  key={k}
                  points={`480,${cy + 18} 462,${cy - 8} 498,${cy - 8}`}
                  fill={C.gold}
                  opacity={Math.sin(p * Math.PI)}
                />
              );
            })}

            {/* Cratered Moon at Top */}
            <g transform="translate(480, 145)" style={{ filter: svgGlow(C.gold, 10) }}>
              <circle cx={0} cy={0} r={62} fill="url(#sMoon1)" stroke={C.gold} strokeWidth={4} />
              <circle cx={-18} cy={-16} r={14} fill="rgba(51,65,85,0.45)" />
              <circle cx={20} cy={14} r={17} fill="rgba(51,65,85,0.38)" />
              <text x={88} y={10} fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={28}>
                MOON
              </text>
            </g>

            {/* Rotating 3D Earth at Bottom */}
            <g transform="translate(480, 520)" style={{ filter: svgGlow(C.cyan, 14) }}>
              <circle cx={0} cy={0} r={145} fill="url(#sEarth1)" stroke={C.cyan} strokeWidth={4} />
              <g clipPath="url(#sEarthClip1)">
                <g transform={`rotate(${frame * 0.8})`}>
                  <path d="M-90,-64 Q-30,-94 22,-54 Q46,-8 -16,22 Q-76,32 -90,-64 Z" fill="#10b981" opacity={0.58} />
                  <path d="M38,-20 Q104,-40 120,24 Q84,84 34,54 Q18,16 38,-20 Z" fill="#10b981" opacity={0.52} />
                  <path d="M-84,54 Q-32,44 -8,94 Q-54,124 -94,94 Z" fill="#10b981" opacity={0.48} />
                </g>
              </g>
              <text x={0} y={10} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={34}>
                EARTH
              </text>
            </g>
          </svg>

          {/* Zero Fuel Stamp pops in right on "Yet it burns zero fuel" */}
          <Appear at={tZeroFuel - 4} from="scale" style={{ marginTop: 10 }}>
            <div
              style={{
                padding: "22px 48px",
                borderRadius: 22,
                background: "rgba(61, 255, 155, 0.14)",
                border: `3px solid ${C.green}`,
                boxShadow: glow(C.green, 14),
                fontFamily: MONO,
                fontWeight: 900,
                fontSize: 38,
                color: C.green,
              }}
            >
              FUEL BURNED: 0.0000 JOULES ✓
            </div>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 2: SHAKING 3D ARM vs CONSERVATION OF ENERGY PARADOX          */}
      {/* ================================================================= */}
      <SceneFade from={tHold - 4} to={tFirst - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 118 }}>
          <ShortPill label="THE PARADOX" sub="BIOLOGY vs. PHYSICS" color={C.red} />
          <BigText size={62} style={{ marginTop: 24, maxWidth: 940, textAlign: "center" }}>
            Your Arm Gives Out in <span style={{ color: C.red }}>2 Minutes</span>
          </BigText>

          {/* Top Panel: Sculpted 3D Trembling Arm Holding Dumbbell */}
          <Panel style={{ width: 920, height: 420, marginTop: 34, padding: "20px 28px" }} border={C.red}>
            <svg width={860} height={375} viewBox="0 0 860 375">
              <defs>
                <linearGradient id="sArm3d" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff9ca6" />
                  <stop offset="48%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
                <linearGradient id="sTorso" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#082f49" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#082f49" />
                </linearGradient>
              </defs>
              <circle cx={145} cy={82} r={42} fill="url(#sTorso)" stroke={C.cyan} strokeWidth={3.5} />
              <path d="M98,136 Q145,122 192,136 L204,350 Q145,362 86,350 Z" fill="url(#sTorso)" stroke={C.cyan} strokeWidth={3.5} />
              <g transform={`translate(0, ${armShake})`}>
                <path
                  d="M188,162 Q325,112 455,168 L635,170 L635,216 L455,218 Q325,228 188,208 Z"
                  fill="url(#sArm3d)"
                  stroke="#fda4af"
                  strokeWidth={3.5}
                  style={{ filter: svgGlow(C.red, 10) }}
                />
                {/* Dumbbell */}
                <rect x={620} y={114} width={32} height={154} rx={8} fill={C.gold} stroke="#fef08a" strokeWidth={2} />
                <rect x={718} y={114} width={32} height={154} rx={8} fill={C.gold} stroke="#fef08a" strokeWidth={2} />
                <rect x={652} y={178} width={66} height={26} rx={5} fill="#e2e8f0" />
                <text x={685} y={96} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
                  20 kg
                </text>
                {/* Rising strain heat waves */}
                {[280, 340, 400].map((hx, idx) => {
                  const dy = (frame * 2.2 + idx * 20) % 62;
                  return (
                    <line
                      key={idx}
                      x1={hx}
                      y1={132 - dy}
                      x2={hx}
                      y2={106 - dy}
                      stroke={C.red}
                      strokeWidth={5}
                      strokeLinecap="round"
                      opacity={1 - dy / 62}
                    />
                  );
                })}
                <text x={410} y={56} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={28}>
                  SHAKING · BURNING ATP!
                </text>
              </g>
            </svg>
          </Panel>

          {/* Bottom Rotating Conservation of Energy Circle */}
          <Appear at={tBreak - 4} from="scale" style={{ marginTop: 38 }}>
            <svg width={470} height={470} viewBox="0 0 470 470">
              <circle cx={235} cy={235} r={202} fill="rgba(255,77,94,0.12)" />
              <circle
                cx={235}
                cy={235}
                r={202}
                fill="none"
                stroke={C.red}
                strokeWidth={6}
                strokeDasharray="20 12"
                transform={`rotate(${frame * 0.5} 235 235)`}
                style={{ filter: svgGlow(C.red, 10) }}
              />
              <text x={235} y={178} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={58}>
                ΔE = 0
              </text>
              <text x={235} y={236} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={29}>
                CONSERVATION
              </text>
              <text x={235} y={272} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={29}>
                OF ENERGY
              </text>
              <text x={235} y={332} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={38}>
                BROKEN?!
              </text>
            </svg>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 3: ×10,000 MICROSCOPIC MUSCLE FILAMENTS FIRING + ATP HEAT    */}
      {/* ================================================================= */}
      <SceneFade from={tFirst - 4} to={tTable - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 118 }}>
          <ShortPill label="×10,000 ZOOM" sub="INSIDE YOUR BICEP" color={C.gold} />
          <BigText size={58} style={{ marginTop: 22, maxWidth: 940, textAlign: "center" }}>
            {frame >= tHeat ? (
              <>
                Every Twitch Burns <span style={{ color: C.gold }}>ATP</span> → <span style={{ color: C.red }}>Heat</span>
              </>
            ) : (
              <>
                Muscle Fibers <span style={{ color: C.red }}>Can&apos;t Lock</span>
              </>
            )}
          </BigText>

          <Panel style={{ width: 960, height: 820, marginTop: 32, padding: "24px 20px" }} border={frame >= tHeat ? C.red : C.gold}>
            <svg width={920} height={770} viewBox="0 0 920 770">
              <defs>
                <linearGradient id="smMyosin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff9ca6" />
                  <stop offset="48%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#6b0c17" />
                </linearGradient>
                <linearGradient id="smActin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a5f3fc" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#082f49" />
                </linearGradient>
              </defs>

              {/* Top Legend */}
              <text x={460} y={36} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
                FIRE → RELEASE → RE-GRAB (DOZENS / SEC)
              </text>

              {[175, 400, 625].map((cy, row) => (
                <g key={row}>
                  <rect x={36} y={cy - 76} width={848} height={24} rx={12} fill="url(#smActin)" style={{ filter: svgGlow(C.cyan, 4) }} />
                  <rect x={36} y={cy + 52} width={848} height={24} rx={12} fill="url(#smActin)" style={{ filter: svgGlow(C.cyan, 4) }} />
                  <rect x={76} y={cy - 18} width={768} height={36} rx={18} fill="url(#smMyosin)" style={{ filter: svgGlow(C.red, 6) }} />

                  {new Array(6).fill(0).map((_, i) => {
                    const hx = 135 + i * 130;
                    const cycle = (frame * 0.28 + i * 0.85 + row * 1.4) % (Math.PI * 2);
                    const grab = Math.sin(cycle);
                    const firing = grab > 0.7;
                    return (
                      <g key={i}>
                        <line x1={hx} y1={cy - 16} x2={hx + grab * 24} y2={cy - 52} stroke={firing ? "#fff" : C.gold} strokeWidth={firing ? 7 : 5} strokeLinecap="round" />
                        <circle cx={hx + grab * 24} cy={cy - 52} r={firing ? 11 : 8} fill={firing ? C.gold : C.red} />
                        <line x1={hx + 22} y1={cy + 16} x2={hx + 22 - grab * 24} y2={cy + 52} stroke={firing ? "#fff" : C.gold} strokeWidth={firing ? 7 : 5} strokeLinecap="round" />
                        <circle cx={hx + 22 - grab * 24} cy={cy + 52} r={firing ? 11 : 8} fill={firing ? C.gold : C.red} />
                        {firing && frame >= tHeat - 10 && (
                          <text x={hx + 10} y={cy - 86} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
                            ATP⚡
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              ))}

              {/* Rising Heat Particles */}
              {frame >= tHeat - 10 &&
                heatParticles.map((p, idx) => {
                  const yp = (p.phase + frame * p.speed) % 1;
                  return (
                    <circle
                      key={idx}
                      cx={p.x + Math.sin(frame * 0.12 + idx) * 14}
                      cy={740 - yp * 660}
                      r={p.size}
                      fill={idx % 2 === 0 ? C.red : C.gold}
                      opacity={Math.sin(yp * Math.PI) * 0.78}
                    />
                  );
                })}
            </svg>
          </Panel>

          <div
            style={{
              marginTop: 26,
              width: 960,
              padding: "20px 32px",
              borderRadius: 18,
              background: "rgba(8, 15, 36, 0.92)",
              border: `2.5px solid ${C.red}`,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: MONO,
              fontWeight: 900,
              fontSize: 27,
            }}
          >
            <span style={{ color: C.red }}>BODY HEAT BURNED 🔥</span>
            <span style={{ color: C.green }}>WORK ON BOX: 0.00 J ✓</span>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 4: WOODEN TABLE + WORK = FORCE × DISTANCE (W = 196 × 0 = 0)  */}
      {/* ================================================================= */}
      <SceneFade from={tTable - 4} to={tMoon - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 118 }}>
          <ShortPill label="CLUE #1" sub="FORCE vs. WORK" color={C.green} />
          <BigText size={58} style={{ marginTop: 22, maxWidth: 940, textAlign: "center" }}>
            A Wooden Table Uses <span style={{ color: C.green }}>Zero Joules</span>
          </BigText>

          {/* Animated Wooden Table + 3D 20kg Box */}
          <svg width={880} height={500} viewBox="0 0 880 500" style={{ marginTop: 16 }}>
            <line x1={80} y1={455} x2={800} y2={455} stroke={C.dim} strokeWidth={4} />
            <rect x={165} y={275} width={550} height={32} rx={6} fill="rgba(255,194,77,0.24)" stroke={C.gold} strokeWidth={4} />
            <rect x={215} y={307} width={30} height={148} fill="rgba(255,194,77,0.18)" stroke={C.gold} strokeWidth={3} />
            <rect x={635} y={307} width={30} height={148} fill="rgba(255,194,77,0.18)" stroke={C.gold} strokeWidth={3} />

            {/* 3D 20kg Crate */}
            <g style={{ filter: svgGlow(C.cyan, 8) }}>
              <polygon points="345,130 515,130 515,275 345,275" fill="rgba(62,224,255,0.18)" stroke={C.cyan} strokeWidth={4} />
              <polygon points="345,130 385,98 555,98 515,130" fill="rgba(62,224,255,0.28)" stroke={C.cyan} strokeWidth={3} />
              <polygon points="515,130 555,98 555,243 515,275" fill="rgba(62,224,255,0.1)" stroke={C.cyan} strokeWidth={3} />
              <text x={430} y={216} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={46}>
                20 kg
              </text>
            </g>

            {/* Balanced Force Arrows */}
            <line x1={440} y1={88} x2={440} y2={28} stroke={C.green} strokeWidth={9} strokeLinecap="round" style={{ filter: svgGlow(C.green, 8) }} />
            <polygon points="440,8 422,42 458,42" fill={C.green} />
            <text x={476} y={56} fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={26}>
              196 N ↑
            </text>

            <line x1={440} y1={314} x2={440} y2={412} stroke={C.gold} strokeWidth={9} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 8) }} />
            <polygon points="440,434 422,400 458,400" fill={C.gold} />
            <text x={476} y={390} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
              196 N ↓
            </text>
          </svg>

          {/* Work = Force x Distance Live Formula Panel */}
          <Appear at={tWork - 8} from="up" style={{ marginTop: 18 }}>
            <Panel style={{ width: 920, padding: "32px 42px", textAlign: "center" }} border={C.gold}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 25, color: C.cyan }}>
                THE PHYSICS EQUATION
              </div>
              <BigText size={62} color={C.gold} glowColor={C.gold} style={{ marginTop: 12 }}>
                WORK = FORCE × DISTANCE
              </BigText>
              <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 44, color: C.green, marginTop: 18 }}>
                196 N × 0 m = 0 JOULES ✓
              </div>
              <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: C.white, marginTop: 14 }}>
                No Motion = Zero Energy Spent
              </div>
            </Panel>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 5: 90-DEGREE ORBITAL GEOMETRY PROOF                          */}
      {/* ================================================================= */}
      <SceneFade from={tMoon - 4} to={tEinstein - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 118 }}>
          <ShortPill label="90° ORBIT PROOF" sub="PERPETUAL FREE-FALL" color={C.cyan} />
          <BigText size={58} style={{ marginTop: 22, maxWidth: 940, textAlign: "center" }}>
            Changes <span style={{ color: C.gold }}>Direction</span>, Never <span style={{ color: C.cyan }}>Speed</span>
          </BigText>

          <svg width={900} height={740} viewBox="0 0 900 740" style={{ marginTop: 24 }}>
            <defs>
              <radialGradient id="sEarth5" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#091d45" />
              </radialGradient>
            </defs>
            {/* Orbit Ring */}
            <circle cx={450} cy={370} r={255} fill="none" stroke="rgba(255,194,77,0.38)" strokeWidth={4} strokeDasharray="12 8" />
            {/* Earth */}
            <circle cx={450} cy={370} r={86} fill="url(#sEarth5)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 10) }} />
            <text x={450} y={381} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={28}>
              EARTH
            </text>

            {(() => {
              const mx = 450 + Math.cos(orbitAngle) * 255;
              const my = 370 + Math.sin(orbitAngle) * 255;
              const ux = Math.cos(orbitAngle);
              const uy = Math.sin(orbitAngle);
              // Inward Gravity (-u) & Tangent Velocity (-uy, ux)
              const gx = -ux * 135;
              const gy = -uy * 135;
              const vx = -uy * 145;
              const vy = ux * 145;
              // 90-degree square corner points
              const s = 26;
              const p1x = mx - ux * s;
              const p1y = my - uy * s;
              const p2x = mx - ux * s - uy * s;
              const p2y = my - uy * s + ux * s;
              const p3x = mx - uy * s;
              const p3y = my + ux * s;
              return (
                <>
                  {/* 90-degree right-angle symbol */}
                  <polyline
                    points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
                    fill="none"
                    stroke={C.gold}
                    strokeWidth={3.5}
                  />
                  {/* Gravity Force Vector (Red) */}
                  <line x1={mx} y1={my} x2={mx + gx} y2={my + gy} stroke={C.red} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.red, 8) }} />
                  {/* Velocity Vector (Cyan) */}
                  <line x1={mx} y1={my} x2={mx + vx} y2={my + vy} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />
                  {/* Moon */}
                  <circle cx={mx} cy={my} r={28} fill="#e2e8f0" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
                  <text x={mx + vx * 1.15} y={my + vy * 1.15} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={28}>
                    v
                  </text>
                  <text x={mx + gx * 1.18} y={my + gy * 1.18} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={26}>
                    F (90°)
                  </text>
                </>
              );
            })()}
          </svg>

          <Panel style={{ width: 920, padding: "28px 36px", textAlign: "center", marginTop: 10 }} border={C.green}>
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 44, color: C.gold }}>
              W = F · d · cos(90°)
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 40, color: C.green, marginTop: 12 }}>
              cos(90°) = 0  →  0 FUEL BURNED ✓
            </div>
          </Panel>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 6: EINSTEIN'S TWIST — 3D CURVED SPACETIME GEODESIC BOWL      */}
      {/* ================================================================= */}
      <SceneFade from={tEinstein - 4} to={tFull - 5} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 118 }}>
          <ShortPill label="1915 · EINSTEIN" sub="GENERAL RELATIVITY" color={C.gold} />
          <BigText size={60} style={{ marginTop: 22, maxWidth: 940, textAlign: "center" }}>
            Gravity Isn&apos;t a Pull — It&apos;s <span style={{ color: C.gold }}>Curved Spacetime</span>
          </BigText>

          {/* Vertical 3D-Projected Curved Spacetime Bowl */}
          <svg width={980} height={780} viewBox="0 0 980 780" style={{ marginTop: 18 }}>
            <defs>
              <radialGradient id="sBowlEarth" cx="35%" cy="32%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="55%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#081a3e" />
              </radialGradient>
              <clipPath id="sBowlClip">
                <circle cx={0} cy={0} r={68} />
              </clipPath>
            </defs>

            {/* Radial Curved Spokes */}
            {new Array(18).fill(0).map((_, s) => {
              const th = (s / 18) * Math.PI * 2 + frame * 0.003;
              const pts: string[] = [];
              for (let st = 0; st <= 24; st++) {
                const r = 56 + (st / 24) * 410;
                const [px, py] = bowlProj(r, th);
                pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
              }
              return <polyline key={`sp-${s}`} points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={1.8} opacity={0.36} />;
            })}

            {/* Concentric Bowl Contours */}
            {new Array(8).fill(0).map((_, k) => {
              const r = 74 + k * 56;
              const pts: string[] = [];
              for (let st = 0; st <= 64; st++) {
                const th = (st / 64) * Math.PI * 2;
                const [px, py] = bowlProj(r, th);
                pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
              }
              const isTrack = k === 3;
              return (
                <polyline
                  key={`rg-${k}`}
                  points={pts.join(" ")}
                  fill="none"
                  stroke={isTrack ? C.gold : C.cyan}
                  strokeWidth={isTrack ? 3.5 : 1.8}
                  opacity={isTrack ? 0.78 : 0.42}
                />
              );
            })}

            {/* Moon Geodesic Comet Trail */}
            {bTrail.map(([tx, ty], i) => (
              <circle key={i} cx={tx} cy={ty} r={14 * (1 - i / 24)} fill={C.gold} opacity={0.85 * (1 - i / 24)} />
            ))}

            {/* Central Earth Bending Spacetime */}
            <g transform={`translate(${bowlCx}, ${bowlCy + 135})`} style={{ filter: svgGlow(C.cyan, 14) }}>
              <circle cx={0} cy={0} r={68} fill="url(#sBowlEarth)" stroke={C.cyan} strokeWidth={3.5} />
              <g clipPath="url(#sBowlClip)" transform={`rotate(${frame * 0.6})`}>
                <path d="M-42,-30 Q-10,-46 16,-20 Q28,6 -12,18 Q-40,20 -42,-30 Z" fill="#10b981" opacity={0.62} />
                <path d="M16,-6 Q48,-16 54,18 Q34,44 12,26 Z" fill="#10b981" opacity={0.55} />
              </g>
              <text x={0} y={102} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={26}>
                MASS CURVES SPACETIME
              </text>
            </g>

            {/* Coasting Moon */}
            <g transform={`translate(${bmX}, ${bmY})`} style={{ filter: svgGlow(C.gold, 10) }}>
              <circle cx={0} cy={0} r={22} fill="#f8fafc" stroke={C.gold} strokeWidth={3.5} />
            </g>
          </svg>

          <div
            style={{
              padding: "20px 44px",
              borderRadius: 20,
              background: "rgba(8, 15, 36, 0.9)",
              border: `2.5px solid ${C.green}`,
              boxShadow: glow(C.green, 10),
              fontFamily: MONO,
              fontWeight: 900,
              fontSize: 30,
              color: C.green,
            }}
          >
            NO ROPE · NO ENGINE · PURE GEOMETRY ✓
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* ================================================================= */}
      {/* BEAT 7: CTA — TIDES + BLACK HOLE TEASERS + YOUTUBE VIDEO CARD     */}
      {/* ================================================================= */}
      <SceneFade from={tFull - 4} to={GRAVITY_SHORT_FRAMES + 20} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 108 }}>
          <Kicker color={C.gold} style={{ fontSize: 28 }}>
            FULL 9:34 PHYSICS BREAKDOWN
          </Kicker>
          <BigText size={54} style={{ marginTop: 10, maxWidth: 940, textAlign: "center" }}>
            Ocean Tides &amp; <span style={{ color: C.cyan }}>Black Hole Waves</span>
          </BigText>

          {/* Dual Live Mini-Animations (Tides + Binary Black Holes) */}
          <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
            {/* Mini Animated Tidal Bulge */}
            <Panel style={{ width: 455, height: 270, padding: "14px 18px", textAlign: "center" }} border={C.cyan}>
              <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 20, color: C.cyan }}>
                OCEAN TIDES (+3.8 cm/yr)
              </div>
              <svg width={415} height={210} viewBox="0 0 415 210">
                <g transform="translate(130, 105) rotate(-16)">
                  <ellipse cx={0} cy={0} rx={82} ry={58} fill="rgba(56,189,248,0.28)" stroke={C.cyan} strokeWidth={3} />
                </g>
                <circle cx={130} cy={105} r={46} fill="#1d4ed8" stroke="#60a5fa" strokeWidth={2.5} />
                <line x1={210} y1={85} x2={325} y2={105} stroke={C.gold} strokeWidth={4} strokeDasharray="8 6" />
                <circle cx={340} cy={105} r={22} fill="#e2e8f0" stroke={C.gold} strokeWidth={3} />
              </svg>
            </Panel>

            {/* Mini Animated Binary Black Hole Waves */}
            <Panel style={{ width: 455, height: 270, padding: "14px 18px", textAlign: "center" }} border={C.gold}>
              <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 20, color: C.gold }}>
                2015 LIGO · BLACK HOLES
              </div>
              <svg width={415} height={210} viewBox="0 0 415 210">
                {[0, 1, 2, 3].map((i) => {
                  const rp = (frame * 0.025 + i * 0.25) % 1;
                  return (
                    <circle
                      key={i}
                      cx={207}
                      cy={105}
                      r={24 + rp * 82}
                      fill="none"
                      stroke={i % 2 === 0 ? C.gold : C.cyan}
                      strokeWidth={2.5}
                      opacity={1 - rp}
                    />
                  );
                })}
                <circle cx={207 + Math.cos(frame * 0.14) * 28} cy={105 + Math.sin(frame * 0.14) * 28} r={14} fill="#000" stroke={C.gold} strokeWidth={3} />
                <circle cx={207 - Math.cos(frame * 0.14) * 28} cy={105 - Math.sin(frame * 0.14) * 28} r={14} fill="#000" stroke={C.gold} strokeWidth={3} />
              </svg>
            </Panel>
          </div>

          {/* Attached YouTube Video Card Hero */}
          <div
            style={{
              marginTop: 34,
              width: 900,
              borderRadius: 28,
              overflow: "hidden",
              border: `4px solid ${C.gold}`,
              background: "#ffffff",
              boxShadow: glow(C.gold, 18),
              transform: `scale(${interpolate(ctaPop, [0, 1], [0.88, 1])})`,
            }}
          >
            <Img
              src={staticFile("gravity/yt-video-card.png")}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Pulsing Watch CTA Pill */}
          <div
            style={{
              marginTop: 34,
              padding: "22px 54px",
              borderRadius: 50,
              background: C.gold,
              color: "#040814",
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 38,
              boxShadow: glow(C.gold, 16),
              transform: `scale(${ctaBounce})`,
            }}
          >
            WATCH FULL VIDEO ON CHANNEL ↑
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Word-by-word animated captions */}
      <ShortSubtitleLayer />
    </AbsoluteFill>
  );
};
