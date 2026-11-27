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
import short2Data from "../../public/cosmiclimit/short2-words.json";
import { C, FPS, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import {
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  PhotonPacket,
  SpiralGalaxy,
} from "../OneWayLight/visuals";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT2_WORDS = short2Data.words as ShortWord[];
export const COSMIC_LIMIT_SHORT2_FRAMES = Math.ceil((short2Data.duration + 0.35) * FPS);

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9']/g, "");

const scue2 = (phrase: string, offsetSec = 0): number => {
  const target = norm(phrase);
  for (let i = 0; i < SHORT2_WORDS.length; i++) {
    let acc = "";
    for (let j = i; j < SHORT2_WORDS.length && acc.length < target.length; j++) {
      acc += norm(SHORT2_WORDS[j].w);
      if (acc === target) return Math.round((SHORT2_WORDS[i].s + offsetSec) * FPS);
      if (!target.startsWith(acc)) break;
    }
  }
  return 0;
};

// ===========================================================================
// 9:16 DEEP COSMOS VERTICAL BACKGROUND
// ===========================================================================
const VerticalCosmosBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const driftY = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, -42]);

  const stars = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 76; i++) {
      const h1 = Math.sin(i * 151.3 + 47.1) * 43758.5453;
      const h2 = Math.sin(i * 293.7 + 19.9) * 43758.5453;
      const h3 = Math.sin(i * 467.1 + 61.3) * 43758.5453;
      const fx = h1 - Math.floor(h1);
      const fy = h2 - Math.floor(h2);
      const fr = h3 - Math.floor(h3);
      out.push({ x: fx * 1080, y: fy * 1980, r: 1.0 + fr * 2.1, o: 0.16 + fr * 0.44 });
    }
    return out;
  }, []);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 36%, #0f1938 0%, #050a18 68%, #02050d 100%)",
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <g transform={`translate(0, ${driftY.toFixed(1)})`}>
          {stars.map((st, idx) => (
            <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#dbeafe" opacity={st.o} />
          ))}
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, transparent 50%, rgba(0,0,0,0.74) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CLEAN WORD-SYNCED BURNED-IN CAPTIONS (SHORTS & REELS SAFE ZONE)
// ===========================================================================
const KEYWORD_SET = new Set([
  "universe",
  "thirteenpointeight",
  "thirtythreepointeight",
  "backward",
  "fifteenpointfive",
  "faster",
  "light",
  "dragged",
  "hubble",
  "sphere",
  "overtakes",
  "stranded",
  "photon",
  "earth",
  "baby",
  "photo",
  "elevenminute",
  "ninetyfive",
  "forever",
  "channel",
]);

const DISPLAY_NUM: Record<string, string> = {
  "thirteen-point-eight": "13.8",
  "thirty-three-point-eight": "33.8",
  "fifteen-point-five": "15.5",
  "thirteen-point-five-billion-year-old": "13.5B-year-old",
  "ninety-five": "95",
  "eleven-minute": "11-minute",
};

const formatCapWord = (w: string): string => {
  const m = w.match(/^([^A-Za-z0-9]*)([A-Za-z0-9-]+)([^A-Za-z0-9]*)$/);
  if (!m) return w;
  const rep = DISPLAY_NUM[m[2].toLowerCase()];
  return rep ? `${m[1]}${rep}${m[3]}` : w;
};

const Short2SubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const chunks = useMemo(() => {
    const out: { words: ShortWord[]; s: number; e: number }[] = [];
    let cur: ShortWord[] = [];
    for (let i = 0; i < SHORT2_WORDS.length; i++) {
      const w = SHORT2_WORDS[i];
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

  if (!activeChunk || t > short2Data.duration + 0.3) return null;

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
          background: "rgba(5, 10, 24, 0.86)",
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
                textShadow: isCurrent ? glow(C.gold, 12) : "0 4px 16px rgba(0,0,0,0.95)",
              }}
            >
              {formatCapWord(w.w)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// SHARED BEAT WRAPPER & HEADER TAG
// ===========================================================================
const BeatWrap: React.FC<{
  from: number;
  to: number;
  fade?: number;
  children: React.ReactNode;
}> = ({ from, to, fade = 7, children }) => {
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
  return (
    <AbsoluteFill style={{ opacity: Math.min(inO, outO) }}>
      <Sequence from={from} durationInFrames={Math.max(20, to - from)}>
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};

const TopTag: React.FC<{ text: string; sub?: string; color?: string }> = ({
  text,
  sub,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 135 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 192,
        left: 48,
        right: 48,
        textAlign: "center",
        opacity: sp,
        transform: `translateY(${(1 - sp) * -16}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 900,
          fontSize: 48,
          color,
          letterSpacing: 2.5,
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
            fontSize: 24,
            color: C.dim,
            letterSpacing: 3.2,
            marginTop: 10,
            textTransform: "uppercase",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

// ===========================================================================
// BEAT 0: 13.8 BILLION YEARS OLD vs 33.8 BILLION LIGHT-YEARS AWAY!
// ===========================================================================
const Beat0AgeVsDistance: React.FC<{ distAt: number; dur: number }> = ({
  distAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const ageP = easeOutCubic(frame / Math.max(30, distAt));
  const distP = easeOutCubic((frame - distAt) / Math.max(32, dur - distAt));

  const ageW = 350 * ageP;
  const distW = 840 * distP;
  const ageVal = (13.8 * ageP).toFixed(1);
  const distVal = (33.8 * distP).toFixed(1);

  return (
    <AbsoluteFill>
      <TopTag
        text={distP > 0.15 ? "33.8 BILLION LY?!" : "13.8 BILLION YRS"}
        sub={distP > 0.15 ? "2.4× FARTHER THAN UNIVERSE AGE" : "AGE OF THE UNIVERSE"}
        color={distP > 0.15 ? "#e879f9" : C.cyan}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <defs>
          <linearGradient id="s2DistGrad" gradientUnits="userSpaceOnUse" x1={120} y1={980} x2={960} y2={980}>
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="55%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Bar 1: Universe Age Limit (13.8 B ly) */}
        <text x={120} y={670} fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={28} letterSpacing={2}>
          UNIVERSE AGE LIMIT
        </text>
        <rect x={120} y={695} width={840} height={68} rx={16} fill="#0c1936" stroke="#1e3a5f" strokeWidth={2} />
        <rect
          x={120}
          y={695}
          width={Math.max(16, ageW)}
          height={68}
          rx={16}
          fill={C.cyan}
          fillOpacity={0.35}
          stroke={C.cyan}
          strokeWidth={3.5}
          style={{ filter: svgGlow(C.cyan, 10) }}
        />
        <text x={145 + ageW} y={741} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={34}>
          {`${ageVal} B yrs`}
        </text>

        {/* Vertical dashed naive limit wall at 13.8 */}
        <line x1={120 + 350} y1={670} x2={120 + 350} y2={1120} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="10 10" opacity={0.45} />

        {/* Bar 2: Observed Galaxy Distance blasting right past the 13.8 wall to 33.8 B ly! */}
        {distP > 0.01 && (
          <g opacity={distP}>
            <text x={120} y={915} fill="#f0abfc" fontFamily={MONO} fontWeight={800} fontSize={28} letterSpacing={2}>
              OBSERVED GALAXY (JADES-GS-z14-0)
            </text>
            <rect x={120} y={940} width={840} height={78} rx={18} fill="#180d2b" stroke="#581c87" strokeWidth={2} />
            <rect
              x={120}
              y={940}
              width={Math.max(20, distW)}
              height={78}
              rx={18}
              fill="url(#s2DistGrad)"
              fillOpacity={0.42}
              stroke="#e879f9"
              strokeWidth={4}
              style={{ filter: svgGlow("#c084fc", 14) }}
            />
            <text x={540} y={992} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={900} fontSize={40}>
              {`${distVal} BILLION LIGHT-YEARS`}
            </text>

            {/* Spinning Distant Galaxy sitting right at the far tip */}
            <SpiralGalaxy
              cx={540}
              cy={1245}
              scale={1.35 + distP * 0.25}
              rotation={-18 + distP * 28}
              color="#e879f9"
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 1: VERTICAL KINETIC PUNCH — "WAIT... HOW?!"
// ===========================================================================
const Beat1HowPossiblePunch: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = clamp01(frame / Math.max(18, dur));
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 195 } });
  const sc = interpolate(pop, [0, 1], [0.84, 0.96]) + p * 0.1;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 48%, rgba(62, 224, 255, 0.22) 0%, rgba(4, 8, 20, 0.96) 72%)",
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        {[0, 1, 2, 3].map((k) => {
          const r = 170 + k * 92 + p * 190;
          return (
            <circle
              key={k}
              cx={540}
              cy={880}
              r={r}
              fill="none"
              stroke={k % 2 === 0 ? C.cyan : C.gold}
              strokeWidth={4 - k * 0.6}
              strokeDasharray={`${r * 0.85} ${r * 0.55}`}
              opacity={(0.5 - k * 0.08) * (1 - p * 0.35)}
              transform={`rotate(${k * 38 + p * 32} 540 880)`}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 745,
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
            fontSize: 124,
            color: C.white,
            lineHeight: 0.98,
            letterSpacing: 3,
            textShadow: `0 12px 44px rgba(0,0,0,0.95), ${glow(C.cyan, 22)}`,
          }}
        >
          HOW IS THAT
          <br />
          POSSIBLE?!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 2: PHOTON DRAGGED BACKWARD BY FASTER-THAN-LIGHT SPACE!
// ===========================================================================
const Beat2PhotonDraggedBack: React.FC<{ dragAt: number; dur: number }> = ({
  dragAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / Math.max(40, dur));
  const dragP = easeInOutCubic((frame - Math.max(0, dragAt - 20)) / Math.max(45, dur - dragAt + 20));

  // Photon starts at y=860 aiming DOWN toward Earth (y=1380), YET space sweeps it UPWARD to y=560!
  const photonY = interpolate(p, [0, 1], [860, 560]);
  const currentShift = p * 260;

  return (
    <AbsoluteFill>
      <TopTag
        text={dragP > 0.15 ? "DRAGGED BACKWARD! ↑" : "15.5 BILLION LY"}
        sub="SWIMMING AT c ↓ · SPACE EXPANDING > c ↑"
        color={C.red}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <defs>
          <linearGradient id="s2RedRiver" gradientUnits="userSpaceOnUse" x1={540} y1={1340} x2={540} y2={420}>
            <stop offset="0%" stopColor={C.red} stopOpacity={0.04} />
            <stop offset="50%" stopColor={C.red} stopOpacity={0.22} />
            <stop offset="100%" stopColor={C.red} stopOpacity={0.04} />
          </linearGradient>
        </defs>

        {/* Upward Faster-Than-Light Cosmic River Corridor */}
        <rect x={220} y={420} width={640} height={880} rx={44} fill="url(#s2RedRiver)" stroke={C.red} strokeOpacity={0.32} strokeWidth={2.5} />

        {/* Upward-sweeping expansion current chevrons (monotonic drift!) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const baseY = 1240 - i * 145 - currentShift * 0.55;
          if (baseY < 455 || baseY > 1270) return null;
          return (
            <g key={i} opacity={0.48}>
              <polyline
                points={`300,${baseY + 26} 335,${baseY} 370,${baseY + 26}`}
                fill="none"
                stroke={C.red}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={`710,${baseY + 26} 745,${baseY} 780,${baseY + 26}`}
                fill="none"
                stroke={C.red}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* Red Space Expansion Label on right edge */}
        <text x={745} y={880} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={26}>
          SPACE ↑
        </text>
        <text x={745} y={916} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={30}>
          1.1 × c
        </text>

        {/* Blazing Golden Photon aiming DOWN toward Earth, yet drifting UPWARD! */}
        <g transform={`translate(540, ${photonY})`}>
          {/* Downward local velocity vector (c) */}
          <line x1={0} y1={18} x2={0} y2={115} stroke={C.gold} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 12) }} />
          <polyline points="-16,94 0,120 16,94" fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <text x={28} y={84} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
            PHOTON ↓ (c)
          </text>

          {/* Upward Net Drag Trail */}
          <line x1={0} y1={-16} x2={0} y2={-95} stroke={C.red} strokeWidth={5} strokeDasharray="10 10" />
          <text x={0} y={-114} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={28}>
            NET MOTION: BACKWARD ↑
          </text>

          {/* Glowing Photon Core */}
          <circle cx={0} cy={0} r={22} fill={C.gold} opacity={0.42} style={{ filter: svgGlow(C.gold, 16) }} />
          <circle cx={0} cy={0} r={11} fill="#ffffff" />
        </g>

        {/* Earth Target Far Below */}
        <circle cx={540} cy={1380} r={54} fill="#0b3a6e" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 14) }} />
        <text x={540} y={1476} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={28} letterSpacing={3}>
          EARTH
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 3: THE HUBBLE SPHERE RESCUE — BOUNDARY OVERTAKES PHOTON -> HITS EARTH!
// ===========================================================================
const Beat3HubbleRescue: React.FC<{ overtakeAt: number; dur: number }> = ({
  overtakeAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const earthY = 1360;

  // Expanding Hubble Sphere Dome grows steadily upward from r=380 -> r=940, crossing photon at overtakeAt!
  const domeR = interpolate(frame, [0, Math.max(40, dur)], [380, 920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const overtakeR = interpolate(overtakeAt, [0, Math.max(40, dur)], [380, 920]);
  const crossY = earthY - overtakeR;

  // Before overtakeAt: photon drifts slightly upward toward crossY; AFTER overtakeAt: rockets DOWN to Earth!
  const preP = clamp01(frame / Math.max(20, overtakeAt));
  const postP = easeInOutCubic((frame - overtakeAt) / Math.max(30, dur - overtakeAt - 8));
  const photonY =
    frame < overtakeAt
      ? interpolate(preP, [0, 1], [crossY + 55, crossY])
      : interpolate(postP, [0, 1], [crossY, earthY - 56]);
  const rescued = frame >= overtakeAt;
  const flashRing = easeOutCubic((frame - overtakeAt) / 28);

  return (
    <AbsoluteFill>
      <TopTag
        text={rescued ? "PHOTON RESCUED! ✓" : "HUBBLE SPHERE GROWING"}
        sub={rescued ? "ENTERS < c ZONE → REACHES EARTH" : "OVERTAKING THE STRANDED PHOTON"}
        color={rescued ? "#4ade80" : C.cyan}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        <defs>
          <radialGradient id="s2DomeFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.22} />
            <stop offset="82%" stopColor={C.cyan} stopOpacity={0.08} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0.34} />
          </radialGradient>
        </defs>

        {/* Growing Cyan Hubble Sphere Dome centered on Earth */}
        <circle
          cx={540}
          cy={earthY}
          r={domeR}
          fill="url(#s2DomeFill)"
          stroke={C.cyan}
          strokeWidth={5.5}
          style={{ filter: svgGlow(C.cyan, 16) }}
        />
        <text
          x={540}
          y={earthY - domeR - 22}
          textAnchor="middle"
          fill={C.cyan}
          fontFamily={MONO}
          fontWeight={900}
          fontSize={28}
          letterSpacing={2.5}
        >
          HUBBLE SPHERE (v = c) ↑
        </text>
        <text
          x={540}
          y={earthY - domeR + 42}
          textAnchor="middle"
          fill="#67e8f9"
          fontFamily={MONO}
          fontWeight={800}
          fontSize={22}
          opacity={0.85}
        >
          INSIDE: SPACE &lt; c
        </text>

        {/* Rescue Shockwave Flash the moment the dome overtakes the photon! */}
        {rescued && flashRing < 0.99 && (
          <circle
            cx={540}
            cy={crossY}
            r={24 + flashRing * 150}
            fill="none"
            stroke="#4ade80"
            strokeWidth={5 * (1 - flashRing)}
            opacity={1 - flashRing}
            style={{ filter: svgGlow("#4ade80", 14) }}
          />
        )}

        {/* Rescued Photon Trail streaking straight down to Earth */}
        {rescued && (
          <PhotonPacket
            id="s2RescuedBeam"
            x1={540}
            y1={crossY}
            x2={540}
            y2={earthY - 56}
            progress={postP}
            color="#4ade80"
            tailLen={220}
            amp={14}
            waves={4}
          />
        )}

        {/* Photon Core before rescue */}
        {!rescued && (
          <g transform={`translate(540, ${photonY})`}>
            <circle cx={0} cy={0} r={22} fill={C.gold} opacity={0.48} style={{ filter: svgGlow(C.gold, 14) }} />
            <circle cx={0} cy={0} r={10} fill="#ffffff" />
            <text x={32} y={8} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
              STRANDED PHOTON
            </text>
          </g>
        )}

        {/* Earth Telescope Anchor */}
        <circle cx={540} cy={earthY} r={54} fill="#0b3a6e" stroke={rescued ? "#4ade80" : C.cyan} strokeWidth={4.5} style={{ filter: svgGlow(rescued ? "#4ade80" : C.cyan, 16) }} />
        <text x={540} y={earthY + 94} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={28} letterSpacing={3}>
          EARTH TELESCOPE
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 4: 13.5 BILLION YEAR OLD COSMIC BABY PHOTO!
// ===========================================================================
const Beat4BabyPhoto: React.FC<{ photoAt: number; dur: number }> = ({
  photoAt,
  dur,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / Math.max(30, dur));
  const stampP = easeOutCubic((frame - Math.max(10, photoAt - 12)) / 24);
  const galStretchX = interpolate(p, [0, 1], [360, 860]);

  return (
    <AbsoluteFill>
      <TopTag
        text="COSMIC BABY PHOTO"
        sub="LIGHT EMITTED 13.5 BILLION YRS AGO"
        color={C.gold}
      />

      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
      >
        {/* Top Expansion Strip: Galaxy drifts from 2 B ly -> 33.8 B ly while light travels! */}
        <line x1={160} y1={590} x2={920} y2={590} stroke="#e879f9" strokeWidth={3} strokeDasharray="10 10" opacity={0.45} />
        <circle cx={160} cy={590} r={26} fill="#0b3a6e" stroke={C.cyan} strokeWidth={3.5} />
        <text x={160} y={655} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>
          EARTH
        </text>
        <SpiralGalaxy cx={galStretchX} cy={590} scale={0.78} rotation={-18 + p * 22} color="#e879f9" />
        <text x={galStretchX} y={668} textAnchor="middle" fill="#f0abfc" fontFamily={MONO} fontWeight={900} fontSize={24}>
          {`${(2 + 31.8 * p).toFixed(1)} B ly NOW`}
        </text>

        {/* Center Illuminated Telescope Snapshot Frame ("BABY PHOTO") */}
        <g transform={`translate(540, 1020) scale(${0.92 + 0.08 * stampP}) rotate(${-2 + p * 2})`}>
          <rect
            x={-330}
            y={-230}
            width={660}
            height={480}
            rx={22}
            fill="#0a1329"
            stroke={C.gold}
            strokeWidth={4}
            style={{ filter: svgGlow(C.gold, 14) }}
          />
          {/* Inner viewfinder photo area */}
          <rect x={-295} y={-195} width={590} height={320} rx={12} fill="#040814" stroke="#334155" strokeWidth={2} />
          <SpiralGalaxy cx={0} cy={-35} scale={1.45 + p * 0.14} rotation={-20 + p * 18} color="#38bdf8" />
          {/* Viewfinder corner brackets */}
          <polyline points="-265,-145 -265,-170 -240,-170" fill="none" stroke={C.cyan} strokeWidth={3.5} />
          <polyline points="265,-145 265,-170 240,-170" fill="none" stroke={C.cyan} strokeWidth={3.5} />
          <polyline points="-265,75 -265,100 -240,100" fill="none" stroke={C.cyan} strokeWidth={3.5} />
          <polyline points="265,75 265,100 240,100" fill="none" stroke={C.cyan} strokeWidth={3.5} />

          {/* Polaroid Bottom Caption */}
          <text x={0} y={182} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={36} letterSpacing={2}>
            13.5B-YEAR-OLD SNAPSHOT
          </text>
          <text x={0} y={222} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={2}>
            EMITTED WHEN ONLY 2 B LY AWAY
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// BEAT 5: CRISP SELF-GENERATED YOUTUBE VIDEO END-CARD (Updated Title & Carter Thumb!)
// ===========================================================================
const Beat5FullVideoCard: React.FC = () => {
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
          FULL 11:06 VISUAL BREAKDOWN
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
          Why 95% of Galaxies Are{" "}
          <span style={{ color: C.red }}>Gone Forever</span>
        </div>

        {/* Crisp Retina-Sharp YouTube Video Card (Zero Hover Icons!) */}
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
          <div style={{ position: "relative", width: "100%", height: 516, background: "#000000" }}>
            <Img
              src={staticFile("cosmiclimit/thumb-carter-1.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
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
              11:06
            </div>
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
              <div style={{ width: "24%", height: "100%", backgroundColor: "#e62429" }} />
            </div>
          </div>

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
                  fontSize: 33,
                  lineHeight: 1.24,
                  color: "#0f0f0f",
                  letterSpacing: -0.3,
                }}
              >
                We Found Galaxies Moving 2× Faster Than Light &mdash; Here&rsquo;s How
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
            <svg width={10} height={36} viewBox="0 0 10 36" style={{ marginTop: 6, flexShrink: 0 }}>
              <circle cx={5} cy={6} r={3.2} fill="#0f0f0f" />
              <circle cx={5} cy={18} r={3.2} fill="#0f0f0f" />
              <circle cx={5} cy={30} r={3.2} fill="#0f0f0f" />
            </svg>
          </div>
        </div>

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
          CHECK FULL VIDEO ON CHANNEL ↑
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// MAIN 9:16 SHORT #2 COMPOSITION: CosmicSpeedLimitShort2
// ===========================================================================
export const CosmicSpeedLimitShort2: React.FC = () => {
  const b1 = scue2("Wait");
  const b2 = scue2("Even wilder");
  const b3 = scue2("So how can it ever");
  const b4 = scue2("And the galaxy we see");
  const b5 = scue2("Check out the full");
  const end = COSMIC_LIMIT_SHORT2_FRAMES;

  return (
    <AbsoluteFill>
      <VerticalCosmosBg />

      <BeatWrap from={0} to={b1}>
        <Beat0AgeVsDistance
          distAt={Math.max(24, scue2("yet right now"))}
          dur={Math.max(50, b1)}
        />
      </BeatWrap>

      <BeatWrap from={b1} to={b2} fade={5}>
        <Beat1HowPossiblePunch dur={Math.max(30, b2 - b1)} />
      </BeatWrap>

      <BeatWrap from={b2} to={b3}>
        <Beat2PhotonDraggedBack
          dragAt={Math.max(36, scue2("dragged farther away") - b2)}
          dur={Math.max(60, b3 - b2)}
        />
      </BeatWrap>

      <BeatWrap from={b3} to={b4}>
        <Beat3HubbleRescue
          overtakeAt={Math.max(45, scue2("overtakes the stranded photon") - b3)}
          dur={Math.max(60, b4 - b3)}
        />
      </BeatWrap>

      <BeatWrap from={b4} to={b5}>
        <Beat4BabyPhoto
          photoAt={Math.max(24, scue2("baby photo") - b4)}
          dur={Math.max(50, b5 - b4)}
        />
      </BeatWrap>

      <BeatWrap from={b5} to={end}>
        <Beat5FullVideoCard />
      </BeatWrap>

      <Short2SubtitleLayer />
      <Audio src={staticFile("cosmiclimit/short2-voiceover.wav")} />
    </AbsoluteFill>
  );
};
