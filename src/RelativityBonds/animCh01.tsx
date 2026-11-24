import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { PhotoPlate, ScientistPortraitCard } from "./ui";

// ===========================================================================
// CH 0 — PAGE 0A: SACRED TEXTBOOK TRIPLE BOND (1 SIGMA + 2 PI)
// ===========================================================================
export const TextbookTripleBondAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const sigmaP = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 110 } });
  const piP = spring({ frame: Math.max(0, frame - 52), fps, config: { damping: 14, stiffness: 110 } });
  const pulse = 0.75 + 0.25 * Math.sin(t * 4);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <radialGradient id="cAtom" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={C.cyan} />
          <stop offset="100%" stopColor="#0a4480" />
        </radialGradient>
        <radialGradient id="nAtom" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={C.gold} />
          <stop offset="100%" stopColor="#995800" />
        </radialGradient>
      </defs>

      {/* Two Pi bond glowing bridges above & below */}
      <g opacity={piP}>
        <path
          d="M520,255 Q800,195 1080,255"
          fill="none"
          stroke={C.gold}
          strokeWidth={22}
          strokeLinecap="round"
          opacity={0.28 * pulse}
        />
        <path
          d="M520,255 Q800,195 1080,255"
          fill="none"
          stroke={C.gold}
          strokeWidth={7}
          strokeLinecap="round"
          style={{ filter: svgGlow(C.gold, 8) }}
        />
        <path
          d="M520,455 Q800,515 1080,455"
          fill="none"
          stroke={C.gold}
          strokeWidth={22}
          strokeLinecap="round"
          opacity={0.28 * pulse}
        />
        <path
          d="M520,455 Q800,515 1080,455"
          fill="none"
          stroke={C.gold}
          strokeWidth={7}
          strokeLinecap="round"
          style={{ filter: svgGlow(C.gold, 8) }}
        />

        <rect x={655} y={142} width={290} height={46} rx={14} fill="rgba(26,18,4,0.94)" stroke={C.gold} strokeWidth={2.5} />
        <text x={800} y={173} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
          2 PI (π) BONDS
        </text>
      </g>

      {/* Center Head-on Sigma Bond */}
      <g opacity={sigmaP}>
        <line x1={520} y1={355} x2={1080} y2={355} stroke={C.cyan} strokeWidth={26} opacity={0.24 * pulse} strokeLinecap="round" />
        <line x1={520} y1={355} x2={1080} y2={355} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 10) }} />
        <rect x={640} y={331} width={320} height={48} rx={14} fill="rgba(4,16,38,0.96)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={800} y={363} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
          1 SIGMA (σ) BOND
        </text>
      </g>

      {/* Left & Right Nuclei */}
      <g transform="translate(480, 355)" style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle r={62} fill="url(#cAtom)" stroke={C.white} strokeWidth={3} />
        <text x={0} y={12} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={36}>
          C
        </text>
      </g>
      <g transform="translate(1120, 355)" style={{ filter: svgGlow(C.gold, 10) }}>
        <circle r={62} fill="url(#nAtom)" stroke={C.white} strokeWidth={3} />
        <text x={0} y={12} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={36}>
          N
        </text>
      </g>

      <text x={800} y={625} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2.2}>
        TEXTBOOK LAW: STRICTLY SEPARATE · NEVER MIXING
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 0 — PAGE 0B: 2026 SCIENCE BREAKTHROUGH SHATTERS THE TEXTBOOK RULE!
// (Plays across 0:17–0:31 so Bismuth crystal appears RIGHT when spoken!)
// ===========================================================================
export const ScienceRuleShatterAnim: React.FC<{
  breakAt: number;
  swapAt: number;
}> = ({ breakAt, swapAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cardIn = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const breakP = interpolate(frame, [Math.max(10, breakAt - 6), breakAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampP = spring({ frame: Math.max(0, frame - breakAt), fps, config: { damping: 11, stiffness: 150 } });
  const swapP = interpolate(frame, [Math.max(20, swapAt - 4), swapAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtle camera jolt right at the moment the rule shatters
  const shakeX = breakP > 0 && breakP < 0.85 ? Math.sin(frame * 2.9) * 9 * (1 - breakP) : 0;
  const shakeY = breakP > 0 && breakP < 0.85 ? Math.cos(frame * 3.4) * 6 * (1 - breakP) : 0;
  const scanX = ((t * 170) % 540) - 270;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <g transform={`translate(${shakeX}, ${shakeY})`}>
        {/* Left: Luminous Science Journal 2026 Report Card */}
        <g transform={`translate(${335 - (1 - cardIn) * 60}, 355)`} opacity={cardIn}>
          <rect
            x={-205}
            y={-230}
            width={410}
            height={460}
            rx={28}
            fill="rgba(10, 18, 42, 0.94)"
            stroke={breakP > 0.2 ? C.gold : C.cyan}
            strokeWidth={3.5}
            style={{ filter: svgGlow(breakP > 0.2 ? C.gold : C.cyan, 10) }}
          />
          <rect x={-165} y={-188} width={330} height={82} rx={16} fill="rgba(255, 194, 77, 0.14)" stroke={C.gold} strokeWidth={2} />
          <text x={0} y={-136} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontStyle="italic" fontWeight={900} fontSize={44}>
            Science
          </text>
          <text x={0} y={-72} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20} letterSpacing={2.2}>
            VOL. 393 · 2026
          </text>

          {/* Animated spectral readout wave inside journal card */}
          <rect x={-165} y={-35} width={330} height={140} rx={16} fill="rgba(4, 10, 26, 0.92)" stroke="rgba(62,224,255,0.3)" strokeWidth={2} />
          <path
            d={`M-145,55 Q-95,${25 - Math.sin(t * 4) * 14} -55,55 T35,${35 + Math.cos(t * 3.5) * 18} T145,55`}
            fill="none"
            stroke={C.cyan}
            strokeWidth={4.5}
            style={{ filter: svgGlow(C.cyan, 6) }}
          />
          <path
            d={`M-145,55 Q-75,${65 + Math.sin(t * 4.5) * 20} 0,20 T145,55`}
            fill="none"
            stroke={C.gold}
            strokeWidth={3.5}
            strokeDasharray="8 6"
            opacity={0.85}
          />
          <text x={0} y={148} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
            Direct Lab Evidence
          </text>
          <text x={0} y={182} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={18}>
            BROWN UNIV. &amp; WSU
          </text>
        </g>

        {/* Right: Textbook Rule Glass Blueprint that CRACKS & EJECTS Light Atom! */}
        <g transform="translate(1045, 355)">
          <rect
            x={-410}
            y={-230}
            width={820}
            height={460}
            rx={30}
            fill="rgba(6, 14, 34, 0.92)"
            stroke={breakP > 0.25 ? C.red : C.cyan}
            strokeWidth={3.5}
            style={{ filter: svgGlow(breakP > 0.25 ? C.red : C.cyan, 8) }}
          />

          {/* Subtle cyan scanner sweep before the break */}
          {breakP < 0.8 && (
            <line
              x1={scanX}
              y1={-215}
              x2={scanX}
              y2={215}
              stroke={C.cyan}
              strokeWidth={3}
              opacity={(1 - breakP) * 0.22}
            />
          )}

          {/* Header inside rule box */}
          <text x={0} y={-168} textAnchor="middle" fill={breakP > 0.3 ? C.red : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2.2}>
            {swapP > 0.25 ? "SWAPPING OUT THE LIGHT ATOM..." : breakP > 0.3 ? "TEXTBOOK TRIPLE-BOND LAW SHATTERED!" : "TEXTBOOK TRIPLE-BOND LAW · 1 σ + 2 π"}
          </text>

          {/* Triple-bond lines: clean before break, jittering & fractured after break */}
          {[-54, 0, 54].map((dy, idx) => {
            const twist = breakP * Math.sin(t * 9 + idx * 1.6) * 20;
            const col = idx === 1 ? C.cyan : C.gold;
            return (
              <path
                key={dy}
                d={`M-180,${dy} Q0,${dy + twist} ${180 + swapP * 40},${dy - twist * 0.5}`}
                fill="none"
                stroke={breakP > 0.45 && idx !== 0 ? C.red : col}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={breakP > 0.3 ? "28 12" : undefined}
                opacity={1 - swapP * 0.35}
                style={{ filter: svgGlow(col, 8) }}
              />
            );
          })}

          {/* Left Carbon Nucleus */}
          <g transform="translate(-210, 0)" style={{ filter: svgGlow(C.cyan, 10) }}>
            <circle r={58} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
            <text x={0} y={13} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={40}>C</text>
            <text x={0} y={96} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={19}>Z = 6</text>
          </g>

          {/* Right Light Nitrogen Atom -> EJECTS OUTWARD on swapAt! */}
          <g
            transform={`translate(${210 + swapP * 240}, ${-swapP * 60}) rotate(${swapP * 28})`}
            opacity={1 - swapP * 0.9}
            style={{ filter: svgGlow(C.gold, 8) }}
          >
            <circle r={58} fill="#362409" stroke={C.gold} strokeWidth={4} />
            <text x={0} y={13} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={40}>N</text>
            <text x={0} y={96} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={19}>LIGHT · Z = 7</text>
          </g>

          {/* Pulsing Heavy Atom Replacement Socket appearing right as N ejects! */}
          <g transform="translate(210, 0)" opacity={swapP}>
            <circle
              r={74 + Math.sin(t * 7) * 5}
              fill="rgba(255, 194, 77, 0.14)"
              stroke={C.gold}
              strokeWidth={4}
              strokeDasharray="14 10"
              strokeDashoffset={-t * 60}
              style={{ filter: svgGlow(C.gold, 12) }}
            />
            <text x={0} y={14} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={46}>?</text>
            <text x={0} y={114} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
              SUPER-HEAVY ATOM
            </text>
          </g>

          {/* Lightning Fracture Cracks Across Rule Glass right on "breaking that rule"! */}
          {breakP > 0.05 && (
            <g opacity={breakP * (1 - swapP * 0.55)}>
              <polyline
                points="-40,-215 15,-125 -35,-40 35,35 -18,125 22,215"
                fill="none"
                stroke={C.red}
                strokeWidth={5.5}
                strokeLinejoin="round"
                style={{ filter: svgGlow(C.red, 12) }}
              />
              <polyline
                points="15,-125 110,-95 165,-135"
                fill="none"
                stroke={C.gold}
                strokeWidth={3.5}
              />
              <polyline
                points="-35,-40 -135,-12 -180,-45"
                fill="none"
                stroke={C.gold}
                strokeWidth={3.5}
              />
            </g>
          )}

          {/* Bottom status pill — generous width */}
          <g transform={`translate(0, 175) scale(${0.86 + 0.14 * Math.max(0.2, stampP)})`} opacity={Math.max(0.2, breakP)}>
            <rect x={-320} y={-32} width={640} height={64} rx={32} fill="rgba(48, 10, 18, 0.95)" stroke={C.red} strokeWidth={3} style={{ filter: svgGlow(C.red, 8) }} />
            <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.6}>
              {swapP > 0.35 ? "REPLACING LIGHT ATOM IN TRIPLE BOND →" : "A REAL MOLECULE BROKE THE RULE!"}
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 0 — PAGE 0C: PHOTOREALISTIC BISMUTH CRYSTAL — APPEARS RIGHT ON "BISMUTH"!
// ===========================================================================
export const BismuthRuleBreakAnim: React.FC<{
  bendAt: number;
  collapseAt: number;
}> = ({ bendAt, collapseAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const badgeIn = spring({ frame, fps, config: { damping: 13, stiffness: 130 } });
  const bendP = interpolate(frame, [Math.max(8, bendAt - 10), bendAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colP = interpolate(frame, [Math.max(12, collapseAt - 8), collapseAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Two live σ & π ribbons at bottom that stay active, bend inward on "bend", and braid/collapse on "collapsed completely"!
  const sigmaPts: string[] = [];
  const piPts: string[] = [];
  for (let x = 220; x <= 1260; x += 12) {
    const u = (x - 220) / 1040;
    const bow = Math.sin(u * Math.PI) * 28 * bendP;
    const scramble = Math.sin(x * 0.028 - t * 8.5) * 32 * colP;
    const baseSigma = 552 + bow * 0.7 + scramble;
    const basePi = 602 - bow * 0.7 - scramble;
    sigmaPts.push(`${x === 220 ? "M" : "L"}${x},${baseSigma.toFixed(1)}`);
    piPts.push(`${x === 220 ? "M" : "L"}${x},${basePi.toFixed(1)}`);
  }

  return (
    <PhotoPlate src="relbonds/bismuth-crystal.jpg" borderColor={colP > 0.4 ? C.red : C.gold}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Element badge top right snapping in dynamically on reveal */}
        <g transform={`translate(1285, 130) scale(${0.75 + 0.25 * badgeIn})`} opacity={badgeIn}>
          <rect x={-115} y={-80} width={230} height={160} rx={22} fill="rgba(6, 12, 30, 0.92)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 10) }} />
          <text x={-86} y={-42} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24}>83</text>
          <text x={0} y={18} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={62}>Bi</text>
          <text x={0} y={58} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={19} letterSpacing={2}>BISMUTH</text>
        </g>

        {/* Continuous live σ & π waves that bend then collapse in sync with voiceover! */}
        <path d={sigmaPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={6} opacity={0.9} style={{ filter: svgGlow(C.cyan, 8) }} />
        <path d={piPts.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} opacity={0.9} style={{ filter: svgGlow(C.gold, 8) }} />

        {/* Bottom pill transitioning smoothly from "CBi⁻" to "COLLAPSED!" */}
        <g transform="translate(740, 658)">
          <rect
            x={-415}
            y={-32}
            width={830}
            height={64}
            rx={32}
            fill={colP > 0.4 ? "rgba(46, 10, 18, 0.95)" : "rgba(6, 14, 34, 0.92)"}
            stroke={colP > 0.4 ? C.red : C.gold}
            strokeWidth={3}
            style={{ filter: svgGlow(colP > 0.4 ? C.red : C.gold, 8) }}
          />
          <text x={0} y={8} textAnchor="middle" fill={colP > 0.4 ? C.red : C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.6}>
            {colP > 0.4 ? "SIGMA / PI BOUNDARY COLLAPSED IN CBi⁻!" : "SUPER-HEAVY BISMUTH INSIDE A TRIPLE BOND (CBi⁻)"}
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 0 — PAGE 0D: ALBERT EINSTEIN PORTRAIT + RELATIVISTIC ATOM
// ===========================================================================
export const EinsteinInAtomAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div style={{ width: 1540, height: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 70px" }}>
      <ScientistPortraitCard
        src="relbonds/portraits/einstein.jpg"
        name="Albert Einstein"
        subtitle="SPECIAL RELATIVITY · 1905"
        credit="Photo: F. Schmutzer (1921) · Public Domain"
        color={C.gold}
        width={420}
        photoHeight={450}
        objectPosition="55% 18%"
      />

      {/* Heavy atom glowing right beside Einstein with relativistic speed streak */}
      <svg viewBox="0 0 880 640" style={{ width: 880, height: 640, overflow: "visible" }}>
        <ellipse cx={440} cy={310} rx={155} ry={155} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="24 14" strokeDashoffset={-t * 160} style={{ filter: svgGlow(C.gold, 8) }} />
        <ellipse cx={440} cy={310} rx={280} ry={130} fill="none" stroke={C.cyan} strokeWidth={3.5} transform="rotate(-24 440 310)" opacity={0.65} />
        <ellipse cx={440} cy={310} rx={280} ry={130} fill="none" stroke={C.cyan} strokeWidth={3.5} transform="rotate(24 440 310)" opacity={0.65} />

        <circle cx={440} cy={310} r={54} fill="rgba(255, 194, 77, 0.25)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 12) }} />
        <text x={440} y={322} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={32}>+83</text>

        <circle
          cx={440 + Math.cos(t * 7.5) * 155}
          cy={310 + Math.sin(t * 7.5) * 155}
          r={16}
          fill={C.white}
          stroke={C.gold}
          strokeWidth={4}
          style={{ filter: svgGlow(C.gold, 12) }}
        />

        <rect x={115} y={545} width={650} height={64} rx={32} fill="rgba(8, 16, 38, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={440} y={585} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.6}>
          RELATIVITY INSIDE A LAB MOLECULE
        </text>
      </svg>
    </div>
  );
};

// ===========================================================================
// CH 1 — PAGE 1A: RELATIVITY IN THE COSMOS (GPS SATELLITE · BLACK HOLE · SPACESHIP!)
// ===========================================================================
export const RelativityCosmosAnim: React.FC<{
  cosmosAt: number;
  gpsAt: number;
  bhAt: number;
  shipAt: number;
}> = ({ cosmosAt, gpsAt, bhAt, shipAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Phase 1 (0 -> cosmosAt): Warped spacetime vs tiny molecule "?" hook
  // Phase 2 (cosmosAt -> end): 3 animated cosmic cards lighting up on GPS -> Black Hole -> Spaceship!
  const phase2 = interpolate(frame, [Math.max(10, cosmosAt - 12), cosmosAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gpsSp = spring({ frame: Math.max(0, frame - gpsAt + 6), fps, config: { damping: 13, stiffness: 120 } });
  const bhSp = spring({ frame: Math.max(0, frame - bhAt + 6), fps, config: { damping: 13, stiffness: 120 } });
  const shipSp = spring({ frame: Math.max(0, frame - shipAt + 6), fps, config: { damping: 13, stiffness: 120 } });

  // GPS satellite orbital angle around Earth
  const satAng = t * 1.45 - 0.6;
  const satX = Math.cos(satAng) * 145;
  const satY = Math.sin(satAng) * 56;
  const satInFront = Math.sin(satAng) >= 0;
  const sigWave = (t * 1.6) % 1;

  // Starfield streaks for relativistic spaceship
  const starLines = [
    { y: -125, len: 95, spd: 260, off: 0 },
    { y: -78, len: 130, spd: 340, off: 120 },
    { y: -32, len: 80, spd: 220, off: 260 },
    { y: 24, len: 140, spd: 380, off: 60 },
    { y: 74, len: 110, spd: 290, off: 190 },
    { y: 118, len: 90, spd: 240, off: 310 },
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <radialGradient id="earthGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6be4ff" />
          <stop offset="45%" stopColor="#1b6fd6" />
          <stop offset="100%" stopColor="#071d4d" />
        </radialGradient>
        <radialGradient id="bhGlow" cx="50%" cy="50%" r="50%">
          <stop offset="52%" stopColor="#000000" />
          <stop offset="68%" stopColor="#ff9b24" stopOpacity="0.95" />
          <stop offset="84%" stopColor="#ff531a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff531a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ionPlume" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor={C.cyan} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
        </linearGradient>
        <clipPath id="earthClip">
          <circle cx={0} cy={0} r={68} />
        </clipPath>
        <clipPath id="shipCardClip">
          <rect x={-205} y={-200} width={410} height={310} rx={22} />
        </clipPath>
      </defs>

      {/* PHASE 1: Spacetime curvature vs tiny molecule question */}
      <g opacity={1 - phase2} transform={`scale(${1 - phase2 * 0.08})`} style={{ transformOrigin: "800px 350px" }}>
        {[-3, -2, -1, 0, 1, 2, 3].map((r) => (
          <path
            key={r}
            d={`M220,${360 + r * 48} Q800,${445 + r * 48 + Math.sin(t * 2.5 + r) * 8} 1380,${360 + r * 48}`}
            fill="none"
            stroke="rgba(62, 224, 255, 0.28)"
            strokeWidth={2.5}
          />
        ))}
        <g transform="translate(800, 330)">
          <circle r={135 + Math.sin(t * 3.5) * 6} fill="rgba(255, 194, 77, 0.08)" stroke={C.gold} strokeWidth={4} strokeDasharray="20 12" strokeDashoffset={-t * 85} style={{ filter: svgGlow(C.gold, 10) }} />
          {/* Tiny glowing molecule inside the giant relativistic ring */}
          <line x1={-34} y1={0} x2={34} y2={0} stroke={C.cyan} strokeWidth={8} />
          <circle cx={-38} cy={0} r={22} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
          <circle cx={38} cy={0} r={26} fill="#362006" stroke={C.gold} strokeWidth={3.5} />
          <text x={0} y={-168} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2}>
            EINSTEIN'S RELATIVITY INSIDE A TINY MOLECULE?
          </text>
        </g>
      </g>

      {/* PHASE 2: THREE ANIMATED COSMIC RELATIVITY VIEWPORTS */}
      <g opacity={phase2}>
        {/* CARD 1: GPS SATELLITE ORBITING EARTH */}
        <g transform={`translate(300, 360) scale(${0.92 + 0.08 * gpsSp})`} opacity={0.35 + 0.65 * gpsSp}>
          <rect
            x={-225}
            y={-225}
            width={450}
            height={450}
            rx={30}
            fill="rgba(7, 15, 36, 0.94)"
            stroke={gpsSp > 0.3 ? C.cyan : "rgba(127,147,196,0.35)"}
            strokeWidth={gpsSp > 0.3 ? 3.5 : 2.5}
            style={gpsSp > 0.3 ? { filter: svgGlow(C.cyan, 10) } : undefined}
          />
          <g transform="translate(0, -40)">
            {/* Back half of tilted orbit */}
            <ellipse cx={0} cy={0} rx={145} ry={56} fill="none" stroke="rgba(62,224,255,0.45)" strokeWidth={3} strokeDasharray="10 8" transform="rotate(-18)" />

            {/* Satellite behind Earth when sin(satAng) < 0 */}
            {!satInFront && (
              <g transform={`rotate(-18) translate(${satX}, ${satY}) rotate(18)`}>
                <rect x={-32} y={-8} width={22} height={16} rx={2} fill="#1d78d8" stroke={C.cyan} strokeWidth={1.5} />
                <rect x={10} y={-8} width={22} height={16} rx={2} fill="#1d78d8" stroke={C.cyan} strokeWidth={1.5} />
                <rect x={-9} y={-10} width={18} height={20} rx={4} fill={C.gold} stroke={C.white} strokeWidth={1.5} />
              </g>
            )}

            {/* Earth Globe with rotating continents + atmosphere */}
            <circle r={74} fill="none" stroke="rgba(62,224,255,0.35)" strokeWidth={8} />
            <circle r={68} fill="url(#earthGrad)" stroke={C.cyan} strokeWidth={2.5} />
            <g clipPath="url(#earthClip)">
              <path
                d={`M${-55 + ((t * 18) % 140) - 40},-38 Q${-20 + ((t * 18) % 140) - 40},-20 ${-30 + ((t * 18) % 140) - 40},10 Q${-50 + ((t * 18) % 140) - 40},25 ${-65 + ((t * 18) % 140) - 40},-5 Z`}
                fill="#2ecc8f"
                opacity={0.78}
              />
              <path
                d={`M${15 + ((t * 18) % 140) - 40},-15 Q${52 + ((t * 18) % 140) - 40},-25 ${58 + ((t * 18) % 140) - 40},15 Q${28 + ((t * 18) % 140) - 40},38 ${8 + ((t * 18) % 140) - 40},12 Z`}
                fill="#2ecc8f"
                opacity={0.75}
              />
            </g>

            {/* Satellite in front of Earth + pulsing GPS clock signal arcs */}
            {satInFront && (
              <g transform={`rotate(-18) translate(${satX}, ${satY}) rotate(18)`}>
                {/* Radio signal ring toward Earth */}
                <circle cx={0} cy={0} r={14 + sigWave * 42} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={(1 - sigWave) * 0.9} />
                <rect x={-34} y={-9} width={23} height={18} rx={2} fill="#2589f5" stroke={C.cyan} strokeWidth={1.8} />
                <rect x={11} y={-9} width={23} height={18} rx={2} fill="#2589f5" stroke={C.cyan} strokeWidth={1.8} />
                <rect x={-10} y={-11} width={20} height={22} rx={4} fill={C.gold} stroke={C.white} strokeWidth={2} style={{ filter: svgGlow(C.gold, 8) }} />
              </g>
            )}
          </g>
          <text x={0} y={138} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>
            GPS Satellites
          </text>
          <text x={0} y={176} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={19}>
            ATOMIC CLOCKS IN ORBIT
          </text>
        </g>

        {/* CARD 2: SPINNING RELATIVISTIC BLACK HOLE */}
        <g transform={`translate(800, 360) scale(${0.92 + 0.08 * bhSp})`} opacity={0.35 + 0.65 * bhSp}>
          <rect
            x={-225}
            y={-225}
            width={450}
            height={450}
            rx={30}
            fill="rgba(16, 10, 12, 0.94)"
            stroke={bhSp > 0.3 ? C.gold : "rgba(127,147,196,0.35)"}
            strokeWidth={bhSp > 0.3 ? 3.5 : 2.5}
            style={bhSp > 0.3 ? { filter: svgGlow(C.gold, 10) } : undefined}
          />
          <g transform="translate(0, -42)">
            {/* Warped gravitational-lensing upper & lower photon halo */}
            <circle r={112} fill="url(#bhGlow)" opacity={0.85} />
            <ellipse cx={0} cy={-16} rx={78} ry={58} fill="none" stroke={C.gold} strokeWidth={8} opacity={0.5} style={{ filter: svgGlow(C.gold, 8) }} />
            <ellipse cx={0} cy={14} rx={74} ry={46} fill="none" stroke="#ff7a29" strokeWidth={5} opacity={0.4} />

            {/* Back half of accretion disk */}
            <ellipse cx={0} cy={0} rx={165} ry={38} fill="none" stroke="#ff8224" strokeWidth={18} opacity={0.55} transform="rotate(-10)" />

            {/* Event Horizon Shadow + Razor-Thin Photon Ring */}
            <circle r={56} fill="#020308" stroke="#fff0c2" strokeWidth={3} style={{ filter: svgGlow(C.gold, 12) }} />

            {/* Swirling front accretion streaks */}
            <g transform="rotate(-10)">
              <path d="M-165,0 A165,38 0 0,0 165,0" fill="none" stroke="#ff9a2e" strokeWidth={14} opacity={0.85} style={{ filter: svgGlow(C.gold, 8) }} />
              <path
                d="M-158,0 A158,34 0 0,0 158,0"
                fill="none"
                stroke="#fff2c4"
                strokeWidth={5}
                strokeDasharray="34 24"
                strokeDashoffset={-t * 140}
              />
              <path
                d="M-132,0 A132,26 0 0,0 132,0"
                fill="none"
                stroke={C.gold}
                strokeWidth={4}
                strokeDasharray="20 18"
                strokeDashoffset={-t * 195}
              />
            </g>
          </g>
          <text x={0} y={138} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>
            Black Holes
          </text>
          <text x={0} y={176} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={19}>
            EXTREME WARPED SPACETIME
          </text>
        </g>

        {/* CARD 3: RELATIVISTIC SPACESHIP BLASTING THROUGH COSMOS */}
        <g transform={`translate(1300, 360) scale(${0.92 + 0.08 * shipSp})`} opacity={0.35 + 0.65 * shipSp}>
          <rect
            x={-225}
            y={-225}
            width={450}
            height={450}
            rx={30}
            fill="rgba(7, 15, 36, 0.94)"
            stroke={shipSp > 0.3 ? C.green : "rgba(127,147,196,0.35)"}
            strokeWidth={shipSp > 0.3 ? 3.5 : 2.5}
            style={shipSp > 0.3 ? { filter: svgGlow(C.green, 10) } : undefined}
          />

          {/* Clipped star-warp window */}
          <g clipPath="url(#shipCardClip)">
            <g transform="translate(0, -45) rotate(-18)">
              {/* Streaming relativistic star streaks */}
              {starLines.map((s, i) => {
                const sx = 240 - (((t * s.spd + s.off) % 520));
                return (
                  <line
                    key={i}
                    x1={sx}
                    y1={s.y}
                    x2={sx + s.len}
                    y2={s.y}
                    stroke={i % 2 === 0 ? C.cyan : C.white}
                    strokeWidth={i % 2 === 0 ? 3 : 2}
                    strokeLinecap="round"
                    opacity={0.62}
                  />
                );
              })}

              {/* Sleek Spaceship gliding with slight engine hover + blazing ion plume */}
              <g transform={`translate(${Math.sin(t * 5) * 6}, ${Math.cos(t * 4) * 5})`}>
                {/* Ion engine exhaust flame */}
                <polygon
                  points={`${-145 - Math.sin(t * 24) * 16},0 -42,-16 -42,16`}
                  fill="url(#ionPlume)"
                  style={{ filter: svgGlow(C.cyan, 10) }}
                />
                {/* Swept wings */}
                <polygon points="-46,-10 -70,-52 8,-16" fill="#1b3a6b" stroke={C.cyan} strokeWidth={2.5} />
                <polygon points="-46,10 -70,52 8,16" fill="#1b3a6b" stroke={C.cyan} strokeWidth={2.5} />
                {/* Fuselage nose cone */}
                <path d="M-48,-18 L48,-14 Q98,0 48,14 L-48,18 Z" fill="#e2eeff" stroke={C.white} strokeWidth={2.5} />
                {/* Glowing cyan cockpit canopy */}
                <ellipse cx={26} cy={0} rx={22} ry={8} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 6) }} />
                {/* Gold relativistic bow shockwave arc */}
                <path d="M72,-48 Q114,0 72,48" fill="none" stroke={C.gold} strokeWidth={3.5} opacity={0.8} style={{ filter: svgGlow(C.gold, 8) }} />
              </g>
            </g>
          </g>

          <text x={0} y={138} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>
            Relativistic Ships
          </text>
          <text x={0} y={176} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={800} fontSize={19}>
            NEAR LIGHT-SPEED TRAVEL
          </text>
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1B: LIGHT CARBON ATOM (Z = 6 · LAZY 4% SPEED OF LIGHT)
// ===========================================================================
export const LightCarbonSpeedAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Calm Carbon atom on left */}
      <g transform="translate(540, 355)">
        <circle r={120} fill="none" stroke={C.cyan} strokeWidth={3.5} opacity={0.75} />
        <circle r={215} fill="none" stroke="rgba(62,224,255,0.38)" strokeWidth={3} strokeDasharray="10 8" />
        <circle r={42} fill="rgba(62,224,255,0.28)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 8) }} />
        <text x={0} y={10} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={26}>+6</text>

        {[0, Math.PI].map((ang, i) => (
          <circle key={i} cx={Math.cos(t * 1.4 + ang) * 120} cy={Math.sin(t * 1.4 + ang) * 120} r={12} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 6) }} />
        ))}
        {[0.4, 2.0, 3.6, 5.1].map((ang, i) => (
          <circle key={i} cx={Math.cos(t * 0.8 + ang) * 215} cy={Math.sin(t * 0.8 + ang) * 215} r={10} fill={C.white} opacity={0.8} />
        ))}
        <text x={0} y={280} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Carbon (Z = 6)
        </text>
      </g>

      {/* Clean Speedometer on right showing barely 4% c */}
      <g transform="translate(1140, 365)">
        <rect x={-235} y={-195} width={470} height={370} rx={30} fill="rgba(8, 16, 38, 0.92)" stroke={C.green} strokeWidth={3} />
        <text x={0} y={-135} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20} letterSpacing={2}>
          INNER ELECTRON SPEED
        </text>
        <path d="M-140,25 A140,140 0 0,1 140,25" fill="none" stroke="rgba(127,147,196,0.22)" strokeWidth={18} strokeLinecap="round" />
        <g transform={`translate(0, 25) rotate(${-81 + Math.sin(t * 3) * 1.5})`}>
          <line x1={0} y1={10} x2={0} y2={-122} stroke={C.green} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.green, 8) }} />
          <circle r={14} fill={C.white} />
        </g>
        <text x={0} y={96} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={44}>
          4% c
        </text>
        <text x={0} y={138} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
          Too Slow for Relativity ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1C: ANIMATED PERIODIC TABLE ZOOM INTO GOLD (79) & BISMUTH (83)!
// ===========================================================================
type PtCell = { c: number; r: number; z?: number; sym?: string; name?: string };

const PT_CELLS: PtCell[] = (() => {
  const cells: PtCell[] = [];
  const named: Record<string, { z: number; sym: string; name?: string }> = {
    "1,1": { z: 1, sym: "H" },
    "18,1": { z: 2, sym: "He" },
    "14,2": { z: 6, sym: "C", name: "Carbon" },
    "15,2": { z: 7, sym: "N" },
    "16,2": { z: 8, sym: "O" },
    "11,4": { z: 29, sym: "Cu" },
    "11,5": { z: 47, sym: "Ag", name: "Silver" },
    "12,5": { z: 48, sym: "Cd" },
    "15,5": { z: 51, sym: "Sb" },
    "9,6": { z: 77, sym: "Ir" },
    "10,6": { z: 78, sym: "Pt", name: "Platinum" },
    "11,6": { z: 79, sym: "Au", name: "Gold" },
    "12,6": { z: 80, sym: "Hg", name: "Mercury" },
    "13,6": { z: 81, sym: "Tl" },
    "14,6": { z: 82, sym: "Pb", name: "Lead" },
    "15,6": { z: 83, sym: "Bi", name: "Bismuth" },
    "16,6": { z: 84, sym: "Po" },
    "17,6": { z: 85, sym: "At" },
    "18,6": { z: 86, sym: "Rn" },
    "6,9": { z: 92, sym: "U" },
  };
  for (let r = 1; r <= 7; r++) {
    for (let c = 1; c <= 18; c++) {
      if (r === 1 && c > 1 && c < 18) continue;
      if ((r === 2 || r === 3) && c > 2 && c < 13) continue;
      const meta = named[`${c},${r}`];
      cells.push({ c, r, ...meta });
    }
  }
  // Lanthanides (r=8.2) & Actinides (r=9.2) silhouettes
  for (let c = 4; c <= 17; c++) {
    cells.push({ c, r: 8 });
    const meta = named[`${c},9`];
    cells.push({ c, r: 9, ...meta });
  }
  return cells;
})();

export const PeriodicTableZoomAnim: React.FC<{
  goldAt: number;
  bismuthAt: number;
}> = ({ goldAt, bismuthAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Tile geometry inside 1440 x 660 viewport
  const tileW = 66;
  const tileH = 58;
  const gap = 7;
  const ox = 68;
  const oy = 32;
  const cellPos = (c: number, r: number) => ({
    x: ox + (c - 1) * (tileW + gap),
    y: oy + (r <= 7 ? (r - 1) * (tileH + gap) : (r - 1) * (tileH + gap) + 18),
  });

  const cPos = cellPos(14, 2);
  const auPos = cellPos(11, 6);
  const biPos = cellPos(15, 6);

  // Smooth zoom from full Periodic Table (1.0x) right down into Gold (79 Au), then pan right to Bismuth (83 Bi)!
  const marchP = interpolate(frame, [12, Math.max(45, goldAt - 10)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const biPanP = interpolate(frame, [Math.max(55, bismuthAt - 18), bismuthAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const zoom = interpolate(marchP, [0, 1], [1.0, 2.75]);
  // Camera focus point smoothly travels from table center -> Gold (79) -> between Gold & Bismuth (centered toward Bi 83)
  const focusX = interpolate(marchP, [0, 1], [720, auPos.x + tileW / 2 + 55]) + biPanP * 175;
  const focusY = interpolate(marchP, [0, 1], [330, auPos.y + tileH / 2 + 8]);

  const goldGlow = spring({ frame: Math.max(0, frame - goldAt + 10), fps, config: { damping: 12, stiffness: 120 } });
  const biGlow = spring({ frame: Math.max(0, frame - bismuthAt + 10), fps, config: { damping: 12, stiffness: 120 } });

  return (
    <div
      style={{
        width: 1480,
        height: 690,
        borderRadius: 30,
        overflow: "hidden",
        border: `3px solid ${biGlow > 0.3 ? C.red : goldGlow > 0.3 ? C.gold : C.cyan}`,
        background: "radial-gradient(circle at 50% 45%, #0c1836 0%, #050a18 100%)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.85)",
        position: "relative",
      }}
    >
      <svg viewBox="0 0 1440 660" style={{ width: "100%", height: "100%" }}>
        {/* Camera transform group */}
        <g transform={`translate(720, 330) scale(${zoom}) translate(${-focusX}, ${-focusY})`}>
          {/* Row period guides on far left */}
          {[1, 2, 3, 4, 5, 6, 7].map((r) => {
            const p = cellPos(1, r);
            return (
              <text key={r} x={p.x - 24} y={p.y + 36} textAnchor="middle" fill={r === 6 ? C.gold : "rgba(127,147,196,0.45)"} fontFamily={MONO} fontWeight={900} fontSize={18}>
                {r}
              </text>
            );
          })}

          {/* All Periodic Table Cells */}
          {PT_CELLS.map((cell) => {
            const { x, y } = cellPos(cell.c, cell.r);
            const isC = cell.z === 6;
            const isAu = cell.z === 79;
            const isBi = cell.z === 83;
            const isHeavyRow = cell.r === 6 && cell.c >= 10 && cell.c <= 16;

            let fill = "rgba(14, 28, 62, 0.72)";
            let stroke = "rgba(62, 224, 255, 0.24)";
            let sw = 1.4;

            if (isC) {
              fill = "rgba(12, 54, 46, 0.9)";
              stroke = C.green;
              sw = 2.4;
            } else if (isAu) {
              fill = goldGlow > 0.1 ? "rgba(84, 54, 6, 0.96)" : "rgba(48, 34, 8, 0.9)";
              stroke = C.gold;
              sw = 2.2 + goldGlow * 2.2;
            } else if (isBi) {
              fill = biGlow > 0.1 ? "rgba(74, 16, 30, 0.96)" : "rgba(42, 18, 28, 0.88)";
              stroke = biGlow > 0.1 ? C.red : C.gold;
              sw = 2.0 + biGlow * 2.4;
            } else if (isHeavyRow) {
              fill = "rgba(22, 34, 68, 0.88)";
              stroke = "rgba(255, 194, 77, 0.45)";
            }

            return (
              <g
                key={`${cell.c}-${cell.r}`}
                transform={`translate(${x}, ${y})`}
                style={
                  isAu && goldGlow > 0.2
                    ? { filter: svgGlow(C.gold, 8) }
                    : isBi && biGlow > 0.2
                      ? { filter: svgGlow(C.red, 8) }
                      : undefined
                }
              >
                <rect width={tileW} height={tileH} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} />
                {cell.z !== undefined && (
                  <text x={7} y={16} fill={isAu ? C.gold : isBi ? C.red : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={12}>
                    {cell.z}
                  </text>
                )}
                {cell.sym && (
                  <text
                    x={tileW / 2}
                    y={cell.name ? 36 : 40}
                    textAnchor="middle"
                    fill={isAu ? C.gold : isBi ? "#ff8298" : C.white}
                    fontFamily={INTER}
                    fontWeight={900}
                    fontSize={22}
                  >
                    {cell.sym}
                  </text>
                )}
                {cell.name && (
                  <text x={tileW / 2} y={51} textAnchor="middle" fill={isAu ? "#ffe4a0" : isBi ? "#ffd1da" : C.dim} fontFamily={MONO} fontWeight={800} fontSize={9.5}>
                    {cell.name.toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}

          {/* Animated glowing golden descent path from Carbon (6 C) straight down to Gold (79 Au)! */}
          <path
            d={`M${cPos.x + tileW / 2},${cPos.y + tileH + 4} C${cPos.x + tileW / 2},${cPos.y + 150} ${auPos.x + tileW / 2},${auPos.y - 120} ${auPos.x + tileW / 2},${auPos.y - 8}`}
            fill="none"
            stroke={C.gold}
            strokeWidth={4 / Math.sqrt(zoom)}
            strokeDasharray="10 8"
            strokeDashoffset={-t * 45}
            opacity={0.85 * (1 - biPanP * 0.5)}
            style={{ filter: svgGlow(C.gold, 6) }}
          />

          {/* Pulsing target halo around Gold (79 Au) */}
          {goldGlow > 0.05 && (
            <rect
              x={auPos.x - 5}
              y={auPos.y - 5}
              width={tileW + 10}
              height={tileH + 10}
              rx={11}
              fill="none"
              stroke={C.gold}
              strokeWidth={2.5}
              opacity={goldGlow * (0.65 + 0.35 * Math.sin(t * 7))}
            />
          )}

          {/* Pulsing target halo around Bismuth (83 Bi) */}
          {biGlow > 0.05 && (
            <rect
              x={biPos.x - 5}
              y={biPos.y - 5}
              width={tileW + 10}
              height={tileH + 10}
              rx={11}
              fill="none"
              stroke={C.red}
              strokeWidth={2.5}
              opacity={biGlow * (0.65 + 0.35 * Math.sin(t * 7))}
            />
          )}
        </g>

        {/* Crisp HUD Overlay Banner at bottom of viewport */}
        <g transform="translate(720, 608)">
          <rect
            x={-415}
            y={-32}
            width={830}
            height={64}
            rx={32}
            fill="rgba(5, 11, 28, 0.94)"
            stroke={biGlow > 0.3 ? C.red : goldGlow > 0.3 ? C.gold : C.cyan}
            strokeWidth={3}
          />
          <text
            x={0}
            y={8}
            textAnchor="middle"
            fill={biGlow > 0.3 ? C.red : goldGlow > 0.3 ? C.gold : C.cyan}
            fontFamily={MONO}
            fontWeight={900}
            fontSize={22}
            letterSpacing={1.5}
          >
            {biGlow > 0.3
              ? "PERIOD 6 HEAVY ELEMENTS: GOLD (+79) & BISMUTH (+83)!"
              : goldGlow > 0.3
                ? "ZOOMING INTO GOLD · 79 PROTONS IN ONE NUCLEUS"
                : "MARCHING DOWN TO THE BOTTOM OF THE PERIODIC TABLE ↓"}
          </text>
        </g>
      </svg>
    </div>
  );
};

// ===========================================================================
// CH 1 — PAGE 1D: HEAVY NUCLEAR PULL → 60% LIGHT SPEED!
// ===========================================================================
export const HeavySpeedClimbAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Starts from heavy pull ramping straight into 60% c Relativistic Zone!
  const climb = interpolate(frame, [6, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zVal = Math.round(interpolate(climb, [0, 0.55, 1], [79, 82, 83]));
  const pctC = Math.round(interpolate(climb, [0, 0.45, 1], [22, 52, 61]));
  const elemName = zVal < 81 ? "Gold (Au)" : "Bismuth (Bi)";
  const col = pctC < 45 ? C.gold : C.red;
  const orbitSpeed = 3.2 + climb * 8.5;
  const orbitR = 160 - climb * 54;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Accelerating heavy atom on left */}
      <g transform="translate(520, 355)">
        {/* Inward ferocious electrical pull arrows */}
        {[45, 135, 225, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`} opacity={0.45 + 0.55 * climb}>
            <line x1={215} y1={0} x2={orbitR + 22} y2={0} stroke={C.gold} strokeWidth={4.5} strokeLinecap="round" />
            <polygon points={`${orbitR + 8},0 ${orbitR + 28},-10 ${orbitR + 28},10`} fill={C.gold} />
          </g>
        ))}

        <circle r={orbitR} fill="none" stroke={col} strokeWidth={5} strokeDasharray="18 10" strokeDashoffset={-t * 165 * (0.4 + climb)} style={{ filter: svgGlow(col, 8) }} />
        <circle r={48 + climb * 16} fill="rgba(255, 194, 77, 0.26)" stroke={col} strokeWidth={4} style={{ filter: svgGlow(col, 12) }} />
        <text x={0} y={11} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={30}>
          +{zVal}
        </text>
        <circle cx={Math.cos(t * orbitSpeed) * orbitR} cy={Math.sin(t * orbitSpeed) * orbitR} r={14} fill={C.white} stroke={col} strokeWidth={4} style={{ filter: svgGlow(col, 10) }} />
        <text x={0} y={265} textAnchor="middle" fill={col} fontFamily={INTER} fontWeight={900} fontSize={36}>
          {elemName} · Z = {zVal}
        </text>
      </g>

      {/* Speedometer rocketing into the crimson/gold Relativistic Zone! */}
      <g transform="translate(1140, 365)">
        <rect x={-245} y={-195} width={490} height={370} rx={30} fill="rgba(8, 16, 38, 0.92)" stroke={col} strokeWidth={3.5} />
        <text x={0} y={-135} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20} letterSpacing={2}>
          SPEED OF INNER 1s ELECTRONS
        </text>
        <path d="M-145,25 A145,145 0 0,1 145,25" fill="none" stroke="rgba(127,147,196,0.22)" strokeWidth={18} strokeLinecap="round" />
        <path d="M25,-118 A145,145 0 0,1 145,25" fill="none" stroke={C.red} strokeWidth={18} strokeLinecap="round" opacity={0.45} />
        <g transform={`translate(0, 25) rotate(${interpolate(pctC, [0, 100], [-88, 88])})`}>
          <line x1={0} y1={10} x2={0} y2={-126} stroke={col} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(col, 10) }} />
          <circle r={14} fill={C.white} />
        </g>
        <text x={0} y={96} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={900} fontSize={48}>
          {pctC}% c
        </text>
        <text x={0} y={138} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
          {pctC > 50 ? "RELATIVISTIC SPEED ZONE!" : "Ferocious Nuclear Pull..."}
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1E: DIRECT RELATIVISTIC CONTRACTION (INNER s ORBITALS SHRINK!)
// ===========================================================================
export const RelativisticContractionAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const shrink = interpolate(frame, [18, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rNow = interpolate(shrink, [0, 1], [235, 138]);
  const massMult = interpolate(shrink, [0, 1], [1.0, 1.26]);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <g transform="translate(800, 345)">
        <circle r={235} fill="none" stroke={C.dim} strokeWidth={3.5} strokeDasharray="12 10" opacity={0.55} />
        <text x={255} y={-155} fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={21}>
          NON-RELATIVISTIC s SHELL
        </text>

        <circle r={rNow} fill="rgba(62, 224, 255, 0.14)" stroke={C.cyan} strokeWidth={7} style={{ filter: svgGlow(C.cyan, 10) }} />

        {[0, 90, 180, 270].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`} opacity={0.4 + 0.6 * shrink}>
            <line x1={222} y1={0} x2={rNow + 24} y2={0} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
            <polygon points={`${rNow + 10},0 ${rNow + 32},-11 ${rNow + 32},11`} fill={C.gold} />
          </g>
        ))}

        <circle r={48} fill="rgba(255, 194, 77, 0.3)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={0} y={10} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>+83</text>

        <circle cx={Math.cos(t * 7.5) * rNow} cy={Math.sin(t * 7.5) * rNow} r={14 + shrink * 5} fill={C.white} stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 10) }} />
      </g>

      {/* Live Effective Inertia Pill — widened cleanly! */}
      <g transform="translate(800, 645)">
        <rect x={-485} y={-36} width={970} height={72} rx={36} fill="rgba(6, 14, 34, 0.94)" stroke={C.gold} strokeWidth={3} />
        <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.5}>
          EFFECTIVE MASS ×{massMult.toFixed(2)} → s ORBITALS SHRINK INWARD
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1F: INDIRECT DOMINO EFFECT (OUTER d & f SHELLS PUFF OUTWARD!)
// ===========================================================================
export const IndirectExpansionDominoAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const expand = interpolate(frame, [18, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outerR = interpolate(expand, [0, 1], [190, 278]);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <g transform="translate(800, 345)">
        <circle r={128} fill="rgba(62, 224, 255, 0.24)" stroke={C.cyan} strokeWidth={6} style={{ filter: svgGlow(C.cyan, 10) }} />
        <circle r={42} fill="rgba(255, 194, 77, 0.3)" stroke={C.gold} strokeWidth={3.5} />
        <text x={0} y={10} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>+83</text>

        <circle
          r={outerR}
          fill="none"
          stroke={C.gold}
          strokeWidth={7}
          strokeDasharray="22 10"
          strokeDashoffset={t * 50}
          style={{ filter: svgGlow(C.gold, 10) }}
        />

        {[45, 135, 225, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`} opacity={0.4 + 0.6 * expand}>
            <line x1={148} y1={0} x2={outerR - 24} y2={0} stroke={C.green} strokeWidth={5} strokeLinecap="round" />
            <polygon points={`${outerR - 10},0 ${outerR - 32},-11 ${outerR - 32},11`} fill={C.green} />
          </g>
        ))}

        <g transform="translate(-495, -145)">
          <rect x={-175} y={-36} width={350} height={72} rx={16} fill="rgba(6, 18, 42, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={-4} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>SHRUNKEN s SHELL</text>
          <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={700} fontSize={19}>Shields the Nucleus</text>
        </g>

        <g transform="translate(500, 135)">
          <rect x={-185} y={-36} width={370} height={72} rx={16} fill="rgba(26, 20, 4, 0.94)" stroke={C.gold} strokeWidth={2.5} />
          <text x={0} y={-4} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>OUTER d &amp; f SHELLS</text>
          <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={700} fontSize={19}>Puff Outward &amp; Loosen!</text>
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1G: PAUL DIRAC PORTRAIT (1928) — FUSING QUANTUM + RELATIVITY
// ===========================================================================
export const DiracEquationLegacyAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const mergeP = interpolate(frame, [20, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: 1540, height: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 70px" }}>
      <ScientistPortraitCard
        src="relbonds/portraits/dirac.jpg"
        name="Paul Dirac"
        subtitle="RELATIVISTIC ELECTRON · 1928"
        credit="Nobel Foundation (1933) · Public Domain"
        color={C.cyan}
        width={410}
        photoHeight={445}
        objectPosition="50% 18%"
      />

      <svg viewBox="0 0 880 640" style={{ width: 880, height: 640, overflow: "visible" }}>
        <g transform={`translate(${220 + mergeP * 110}, 280)`}>
          <circle r={120} fill="rgba(62, 224, 255, 0.14)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 8) }} />
          <text x={0} y={-10} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24}>QUANTUM</text>
          <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>Wave Mechanics</text>
        </g>

        <g transform={`translate(${660 - mergeP * 110}, 280)`}>
          <circle r={120} fill="rgba(255, 194, 77, 0.14)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
          <text x={0} y={-10} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>EINSTEIN</text>
          <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>Special Relativity</text>
        </g>

        <circle cx={440} cy={280} r={30 + 6 * Math.sin(t * 5)} fill={C.white} opacity={mergeP * 0.85} style={{ filter: svgGlow(C.gold, 14) }} />

        <g transform="translate(440, 520)" opacity={mergeP}>
          <rect x={-360} y={-40} width={720} height={80} rx={40} fill="rgba(8, 16, 38, 0.94)" stroke={C.gold} strokeWidth={3} />
          <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.6}>
            ONE UNIFIED THEORY OF THE ELECTRON
          </text>
        </g>
      </svg>
    </div>
  );
};
