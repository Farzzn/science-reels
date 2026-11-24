import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { PhotoPlate, ScientistPortraitCard } from "./ui";

// ===========================================================================
// CH 4 — PAGE 4A: ELECTRON AS A TINY ORBITING BAR MAGNET (INTRINSIC SPIN)
// ===========================================================================
export const ElectronBarMagnetAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const ang = t * 2.2;
  const ex = 800 + Math.cos(ang) * 285;
  const ey = 350 + Math.sin(ang) * 145;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Elliptical orbital track */}
      <ellipse cx={800} cy={350} rx={285} ry={145} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="14 10" opacity={0.65} />

      {/* Heavy Bismuth nucleus */}
      <circle cx={800} cy={350} r={58} fill="rgba(255, 194, 77, 0.25)" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 12) }} />
      <text x={800} y={362} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={32}>+83</text>

      {/* Orbiting Electron with intrinsic Spin Bar-Magnet Arrow! */}
      <g transform={`translate(${ex}, ${ey})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        {/* Tiny magnetic dipole loops */}
        <ellipse cx={-34} cy={0} rx={22} ry={34} fill="none" stroke={C.cyan} strokeWidth={2.5} opacity={0.55} />
        <ellipse cx={34} cy={0} rx={22} ry={34} fill="none" stroke={C.cyan} strokeWidth={2.5} opacity={0.55} />
        {/* Electron sphere */}
        <circle r={24} fill="#0a254d" stroke={C.white} strokeWidth={3} />
        {/* Spin N-S arrow piercing straight through */}
        <line x1={0} y1={46} x2={0} y2={-48} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
        <polygon points="0,-64 -13,-42 13,-42" fill={C.red} />
        <text x={24} y={-44} fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={20}>SPIN</text>
      </g>

      <g transform="translate(800, 610)">
        <rect x={-430} y={-36} width={860} height={72} rx={36} fill="rgba(8, 16, 38, 0.92)" stroke={C.cyan} strokeWidth={3} />
        <text x={0} y={9} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.6}>
          EVERY ELECTRON ACTS LIKE A TINY BAR MAGNET
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4B: EINSTEIN'S REFERENCE-FRAME TRICK (NUCLEUS ORBITS ELECTRON!)
// ===========================================================================
export const ElectronFrameMagnetAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const ang = -t * 4.2;
  const nx = 800 + Math.cos(ang) * 265;
  const ny = 350 + Math.sin(ang) * 110;
  const fieldPulse = 0.65 + 0.35 * Math.sin(t * 5.5);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Soaring Induced Magnetic Field Loops passing right through the stationary electron! */}
      {[-1, 1].map((side) => (
        <ellipse
          key={side}
          cx={800 + side * 145}
          cy={350}
          rx={145}
          ry={215}
          fill="none"
          stroke={C.green}
          strokeWidth={4.5}
          strokeDasharray="16 10"
          strokeDashoffset={-t * 85}
          opacity={0.75 * fieldPulse}
          style={{ filter: svgGlow(C.green, 8) }}
        />
      ))}

      {/* Vertical intense B-field arrow straight up through center */}
      <line x1={800} y1={540} x2={800} y2={135} stroke={C.green} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.green, 10) }} />
      <polygon points="800,115 782,148 818,148" fill={C.green} />
      <text x={832} y={155} fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={24}>COLOSSAL B-FIELD ↑</text>

      {/* Blazing circular current ring made by the orbiting +83 nucleus */}
      <ellipse cx={800} cy={350} rx={265} ry={110} fill="none" stroke={C.gold} strokeWidth={5.5} strokeDasharray="24 12" strokeDashoffset={t * 150} style={{ filter: svgGlow(C.gold, 8) }} />

      {/* Center stationary electron watching the nucleus roar around it! */}
      <g transform="translate(800, 350)" style={{ filter: svgGlow(C.cyan, 12) }}>
        <circle r={30} fill={C.cyan} stroke={C.white} strokeWidth={3.5} />
        <text x={0} y={8} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={24}>e⁻</text>
      </g>

      {/* Roaring +83 Bismuth nucleus orbiting the electron! */}
      <g transform={`translate(${nx}, ${ny})`} style={{ filter: svgGlow(C.gold, 12) }}>
        <circle r={42} fill="#382204" stroke={C.gold} strokeWidth={4} />
        <text x={0} y={10} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>+83</text>
      </g>

      <text x={800} y={638} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
        ELECTRON'S VIEW: +83 NUCLEUS RACES AROUND IT → GIANT MAGNETIC FIELD!
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4C: SPIN-ORBIT COUPLING EXPLODES FROM CARBON TO BISMUTH!
// ===========================================================================
export const SpinOrbitScalingAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barP = interpolate(frame, [15, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampP = spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 14, stiffness: 120 } });

  const items = [
    { name: "Carbon", z: "Z = 6", h: 12, col: C.cyan },
    { name: "Nitrogen", z: "Z = 7", h: 16, col: C.cyan },
    { name: "Arsenic", z: "Z = 33", h: 95, col: C.gold },
    { name: "Antimony", z: "Z = 51", h: 195, col: C.gold },
    { name: "Bismuth", z: "Z = 83", h: 395, col: C.red },
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <line x1={220} y1={555} x2={1380} y2={555} stroke={C.dim} strokeWidth={3.5} />

      {items.map((it, idx) => {
        const cx = 330 + idx * 235;
        const hNow = it.h * barP;
        const isBi = idx === 4;
        return (
          <g key={it.name}>
            <rect
              x={cx - 56}
              y={555 - hNow}
              width={112}
              height={Math.max(4, hNow)}
              rx={14}
              fill={it.col}
              opacity={isBi ? 0.95 : 0.72}
              style={isBi ? { filter: svgGlow(C.red, 12) } : undefined}
            />
            <text x={cx} y={602} textAnchor="middle" fill={isBi ? C.red : C.white} fontFamily={INTER} fontWeight={900} fontSize={26}>
              {it.name}
            </text>
            <text x={cx} y={634} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20}>
              {it.z}
            </text>
          </g>
        );
      })}

      {/* Dramatic callout pointing to Bismuth's towering spin-orbit explosion */}
      <g transform={`translate(735, 225) scale(${0.8 + 0.2 * stampP})`} opacity={stampP}>
        <line x1={310} y1={-10} x2={470} y2={-42} stroke={C.red} strokeWidth={3} strokeDasharray="7 6" />
        <rect x={-295} y={-52} width={605} height={104} rx={22} fill="rgba(48, 10, 18, 0.95)" stroke={C.red} strokeWidth={3.5} style={{ filter: svgGlow(C.red, 8) }} />
        <text x={8} y={-6} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={24}>
          SPIN–ORBIT COUPLING EXPLODES
        </text>
        <text x={8} y={30} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
          Locks Electron Spin & Orbital Shape Together!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4D: PURE SIGMA & PI LABELS BEGIN TO DISSOLVE & MIX!
// ===========================================================================
export const SigmaPiWobblePreviewAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const mix = interpolate(frame, [10, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wobble = Math.sin(t * 7) * 26 * mix;
  const rot = Math.sin(t * 4.2) * 24 * mix;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Twisting & merging orbital lobes */}
      <g transform={`translate(800, 355) rotate(${rot})`}>
        {/* Central sigma warping into gold-cyan spiral */}
        <ellipse cx={0} cy={wobble * 0.5} rx={300} ry={66 + mix * 28} fill="rgba(62, 224, 255, 0.25)" stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 10) }} />
        {/* Top/bottom pi clouds pulling inward toward the sigma core! */}
        <ellipse cx={0} cy={-145 + mix * 72 + wobble} rx={290} ry={58} fill="rgba(255, 194, 77, 0.28)" stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 10) }} />
        <ellipse cx={0} cy={145 - mix * 72 - wobble} rx={290} ry={58} fill="rgba(255, 194, 77, 0.28)" stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 10) }} />
      </g>

      {/* Nuclei */}
      <circle cx={460} cy={355} r={46} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
      <text x={460} y={367} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>C</text>

      <circle cx={1140} cy={355} r={68} fill="#362006" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 10) }} />
      <text x={1140} y={369} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={40}>Bi</text>

      <text x={800} y={625} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2.2}>
        SPIN + ORBITAL SHAPE FUSE → PURE σ & π LABELS DISSOLVE
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5A: THEORISTS SUSPECTED IT FOR YEARS — BRUTALLY HARD TO CATCH!
// ===========================================================================
export const TheoristsSuspectedAnim: React.FC<{
  hardAt: number;
}> = ({ hardAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const hardP = interpolate(frame, [Math.max(15, hardAt - 10), hardAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jitterX = Math.sin(t * 7.5) * 28;
  const jitterY = Math.cos(t * 6.2) * 16;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left: Ghostly Relativistic Theory Prediction Blueprint */}
      <g transform="translate(420, 350)">
        <rect x={-285} y={-215} width={570} height={430} rx={28} fill="rgba(8, 16, 38, 0.92)" stroke={C.cyan} strokeWidth={3} style={{ filter: svgGlow(C.cyan, 6) }} />
        <text x={0} y={-155} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          THEORETICAL PREDICTIONS
        </text>
        {/* Ghostly dashed σ-π split waves */}
        <path
          d={`M-220,0 Q-110,${-75 + Math.sin(t * 3.2) * 14} 0,0 T220,0`}
          fill="none"
          stroke={C.cyan}
          strokeWidth={6}
          strokeDasharray="14 10"
          opacity={0.75}
        />
        <path
          d={`M-220,24 Q-110,${95 - Math.sin(t * 3.2) * 14} 0,24 T220,24`}
          fill="none"
          stroke={C.gold}
          strokeWidth={6}
          strokeDasharray="14 10"
          opacity={0.75}
        />
        <text x={0} y={155} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={800} fontSize={22}>
          Predicted Relativistic Breakdown
        </text>
      </g>

      {/* Center dashed connector */}
      <line x1={720} y1={350} x2={875} y2={350} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
      <polygon points="892,350 864,335 864,365" fill={C.gold} />

      {/* Right: Elusive Lab Target Reticle trying to lock onto fleeting CBi⁻ */}
      <g transform="translate(1180, 350)">
        <rect
          x={-285}
          y={-215}
          width={570}
          height={430}
          rx={28}
          fill="rgba(26, 12, 18, 0.92)"
          stroke={hardP > 0.3 ? C.red : C.gold}
          strokeWidth={3.5}
          style={{ filter: svgGlow(hardP > 0.3 ? C.red : C.gold, 8) }}
        />
        <text x={0} y={-155} textAnchor="middle" fill={hardP > 0.3 ? C.red : C.gold} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          DIRECT LAB MEASUREMENT
        </text>

        {/* Scanning laser reticle */}
        <g transform={`translate(${jitterX * 0.45}, ${jitterY * 0.45})`}>
          <circle r={92} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="18 12" strokeDashoffset={-t * 50} opacity={0.8} />
          <line x1={-112} y1={0} x2={-72} y2={0} stroke={C.red} strokeWidth={3.5} />
          <line x1={72} y1={0} x2={112} y2={0} stroke={C.red} strokeWidth={3.5} />
          <line x1={0} y1={-112} x2={0} y2={-72} stroke={C.red} strokeWidth={3.5} />
          <line x1={0} y1={72} x2={0} y2={112} stroke={C.red} strokeWidth={3.5} />
        </g>

        {/* Elusive darting CBi⁻ molecule */}
        <g transform={`translate(${-jitterX * 0.55}, ${-jitterY * 0.55})`}>
          <line x1={-28} y1={0} x2={28} y2={0} stroke={C.gold} strokeWidth={8} />
          <circle cx={-34} cy={0} r={22} fill="#0c284d" stroke={C.cyan} strokeWidth={3} />
          <text x={-34} y={7} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={18}>C</text>
          <circle cx={34} cy={0} r={28} fill="#362006" stroke={C.gold} strokeWidth={3} />
          <text x={34} y={8} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={20}>Bi</text>
        </g>

        <g transform="translate(0, 152)" opacity={0.45 + 0.55 * hardP}>
          <rect x={-230} y={-28} width={460} height={56} rx={28} fill="rgba(48, 10, 18, 0.96)" stroke={C.red} strokeWidth={2.5} />
          <text x={0} y={7} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={20}>
            BRUTALLY HARD TO ISOLATE &amp; PROBE
          </text>
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5B: THE 2026 SCIENCE RESEARCH TEAM (VOICE-LOCKED PORTRAIT REVEALS!)
// ===========================================================================
export const ResearchTeam2026Anim: React.FC<{
  wangAt: number;
  phdAt: number;
  petersonAt: number;
  scienceAt: number;
}> = ({ wangAt, phdAt, petersonAt, scienceAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phdP = spring({ frame: Math.max(0, frame - phdAt), fps, config: { damping: 14, stiffness: 120 } });
  const petCardP = spring({ frame: Math.max(0, frame - petersonAt), fps, config: { damping: 14, stiffness: 120 } });
  const sciP = spring({ frame: Math.max(0, frame - scienceAt), fps, config: { damping: 13, stiffness: 120 } });
  const introP = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });

  return (
    <div style={{ width: 1520, height: 690, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 90px" }}>
      {/* Left: Prof. Lai-Sheng Wang — enters RIGHT when "Professor Lai-Sheng Wang" is spoken! */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 440 }}>
        <ScientistPortraitCard
          src="relbonds/portraits/wang-press.jpg"
          name="Prof. Lai-Sheng Wang"
          subtitle="BROWN UNIVERSITY · LAB LEAD"
          credit="Photo: Brown Univ. / WSU Press"
          color={C.cyan}
          width={410}
          photoHeight={365}
          objectPosition="50% 18%"
          delay={wangAt}
        />
        <div
          style={{
            marginTop: 18,
            padding: "10px 26px",
            borderRadius: 18,
            background: "rgba(8, 18, 42, 0.92)",
            border: `2px solid ${C.cyan}`,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 19,
            color: C.white,
            opacity: phdP,
            transform: `translateY(${(1 - phdP) * 18}px)`,
          }}
        >
          Lead PhD Students: <span style={{ color: C.cyan }}>Deniz Kahraman &amp; Jie Hui</span>
        </div>
      </div>

      {/* Center: 2026 Breakthrough Crest -> upgrades to Science Vol. 393 on scienceAt! */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: introP,
          transform: `scale(${0.88 + 0.12 * Math.max(introP * 0.85, sciP)})`,
        }}
      >
        <div
          style={{
            padding: "18px 36px",
            borderRadius: 24,
            background: sciP > 0.2 ? "rgba(32, 22, 4, 0.96)" : "rgba(8, 16, 38, 0.92)",
            border: `3.5px solid ${sciP > 0.2 ? C.gold : C.cyan}`,
            boxShadow: glow(sciP > 0.2 ? C.gold : C.cyan, 14),
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: INTER, fontStyle: sciP > 0.2 ? "italic" : "normal", fontWeight: 900, fontSize: 44, color: sciP > 0.2 ? C.gold : C.cyan }}>
            {sciP > 0.2 ? "Science" : "2026"}
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 20, color: C.white, letterSpacing: 2, marginTop: 4 }}>
            {sciP > 0.2 ? "VOL. 393 · 2026" : "BREAKTHROUGH"}
          </div>
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 17, color: C.dim, marginTop: 14, letterSpacing: 1.5 }}>
          EXPERIMENT + RELATIVISTIC THEORY
        </div>
      </div>

      {/* Right: Prof. Kirk Peterson — enters RIGHT when "Kirk Peterson" is spoken! */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 440 }}>
        <ScientistPortraitCard
          src="relbonds/portraits/peterson.jpg"
          name="Prof. Kirk Peterson"
          subtitle="WASHINGTON STATE UNIV. · THEORY"
          credit="Photo: Washington State University"
          color={C.gold}
          width={410}
          photoHeight={365}
          objectPosition="50% 18%"
          delay={petersonAt}
        />
        <div
          style={{
            marginTop: 18,
            padding: "10px 26px",
            borderRadius: 18,
            background: "rgba(32, 22, 4, 0.92)",
            border: `2px solid ${C.gold}`,
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 19,
            color: C.white,
            opacity: petCardP,
            transform: `translateY(${(1 - petCardP) * 18}px)`,
          }}
        >
          4-Component <span style={{ color: C.gold }}>Relativistic Dirac Modeling</span>
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// CH 5 — PAGE 5B: PHOTOREALISTIC CRYOGENIC LASER TRAP MAKING CBi⁻ IONS
// ===========================================================================
export const CryoIonTrapLabAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });

  return (
    <PhotoPlate src="relbonds/laser-chamber.jpg" borderColor={C.cyan}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Center pulsing target ring around glowing trapped CBi⁻ ion cloud */}
        <circle cx={740} cy={365} r={54 + 10 * Math.sin(t * 5)} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" opacity={0.85} />
        <rect x={595} y={248} width={290} height={46} rx={14} fill="rgba(6, 12, 30, 0.94)" stroke={C.gold} strokeWidth={2.5} />
        <text x={740} y={279} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
          TRAPPED CBi⁻ IONS
        </text>

        {/* Bottom 2 clean workflow pills */}
        <g transform="translate(345, 645)" opacity={p}>
          <rect x={-295} y={-32} width={590} height={64} rx={32} fill="rgba(6, 14, 34, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>
            1. LASER VAPORIZATION → GAS-PHASE CBi⁻
          </text>
        </g>
        <g transform="translate(1135, 645)" opacity={p}>
          <rect x={-295} y={-32} width={590} height={64} rx={32} fill="rgba(6, 14, 34, 0.94)" stroke={C.gold} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
            2. CRYOGENIC TRAP → NEAR ABSOLUTE ZERO
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 5 — PAGE 5C: PHOTOELECTRON SPECTROSCOPY (LASER KNOCKS ELECTRONS OUT!)
// ===========================================================================
export const PhotoelectronLaserAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Periodic violet laser pulse popping electrons cleanly toward right detector!
  const cyc = (t * 0.55) % 1;
  const eX = interpolate(cyc, [0.22, 0.95], [560, 1140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eVis = cyc >= 0.22;
  const hitCount = Math.min(3, Math.floor(t * 0.45) + 1);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Incoming Violet Probe Laser Beam */}
      <line x1={160} y1={185} x2={495} y2={355} stroke="#b666ff" strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow("#b666ff", 10) }} />
      <text x={245} y={165} textAnchor="middle" fill="#d099ff" fontFamily={MONO} fontWeight={900} fontSize={23}>
        PROBE LASER PULSE ↘
      </text>

      {/* Trapped CBi⁻ molecule */}
      <g transform="translate(500, 355)">
        <line x1={-45} y1={0} x2={52} y2={0} stroke={C.gold} strokeWidth={12} />
        <circle cx={-55} cy={0} r={38} fill="#0c284d" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 8) }} />
        <text x={-55} y={11} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={26}>C</text>
        <circle cx={60} cy={0} r={54} fill="#362006" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={60} y={13} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={34}>Bi</text>
      </g>

      {/* Ejected bonding electron flying straight to detector! */}
      {eVis && (
        <g>
          <line x1={570} y1={355} x2={eX} y2={355} stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" opacity={0.65} />
          <circle cx={eX} cy={355} r={16} fill={C.cyan} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.cyan, 12) }} />
          <text x={eX} y={320} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>e⁻</text>
        </g>
      )}

      {/* Right Electron Energy Detector + Growing Bond Fingerprint Peaks */}
      <g transform="translate(1280, 355)">
        <rect x={-135} y={-205} width={270} height={410} rx={26} fill="rgba(8, 16, 38, 0.94)" stroke={C.gold} strokeWidth={3.5} />
        <text x={0} y={-155} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
          ENERGY DETECTOR
        </text>
        {/* 3 crisp fingerprint bars lighting up as electrons arrive */}
        {[
          { y: -65, w: 165, col: C.cyan, n: 1 },
          { y: 25, w: 195, col: C.gold, n: 2 },
          { y: 115, w: 140, col: C.green, n: 3 },
        ].map((b) => (
          <g key={b.n} opacity={hitCount >= b.n ? 1 : 0.18}>
            <rect x={-100} y={b.y - 18} width={b.w} height={36} rx={10} fill={b.col} style={{ filter: svgGlow(b.col, 6) }} />
          </g>
        ))}
      </g>

      <text x={800} y={645} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
        CRYOGENIC PHOTOELECTRON SPECTROSCOPY · DIRECT BOND FINGERPRINT
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5D: NON-RELATIVISTIC MISSES ✕ vs. DIRAC RELATIVISTIC HITS ✓!
// ===========================================================================
export const SchrodingerVsDiracSpectrumAnim: React.FC<{
  diracAt: number;
}> = ({ diracAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const diracP = interpolate(frame, [Math.max(15, diracAt - 6), diracAt + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampP = spring({ frame: Math.max(0, frame - diracAt - 18), fps, config: { damping: 14, stiffness: 120 } });

  // Experimental peaks (relativistically split Kramers pairs — NOT where classical theory predicts!)
  const expPeaks = [
    { x0: 440, h: 280, w: 28 },
    { x0: 790, h: 255, w: 28 },
    { x0: 1170, h: 215, w: 30 },
  ];
  // Classical non-relativistic prediction (wrong peak positions — completely misses the middle & right peaks!)
  const classPeaks = [
    { x0: 540, h: 230, w: 32 },
    { x0: 985, h: 295, w: 34 },
  ];

  const evalCurve = (peaks: { x0: number; h: number; w: number }[]) => {
    const pts: string[] = [];
    for (let x = 220; x <= 1380; x += 6) {
      let val = 0;
      for (const pk of peaks) val += pk.h / (1 + Math.pow((x - pk.x0) / pk.w, 2));
      pts.push(`${x === 220 ? "M" : "L"}${x},${(555 - val).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <line x1={220} y1={555} x2={1395} y2={555} stroke={C.dim} strokeWidth={3.5} />
      <line x1={220} y1={555} x2={220} y2={155} stroke={C.dim} strokeWidth={3.5} />

      <text x={800} y={625} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={26}>
        Electron Binding Energy →
      </text>

      {/* Lab Experimental Data Trace (crisp cyan dots/line) */}
      <path d={evalCurve(expPeaks)} fill="none" stroke={C.cyan} strokeWidth={10} opacity={0.35} />
      {expPeaks.map((pk, i) => (
        <circle key={i} cx={pk.x0} cy={555 - pk.h} r={11} fill={C.cyan} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.cyan, 8) }} />
      ))}

      {/* Classical Non-Relativistic Curve (RED DASHED — misses completely!) */}
      <g opacity={1 - diracP * 0.72}>
        <path d={evalCurve(classPeaks)} fill="none" stroke={C.red} strokeWidth={5.5} strokeDasharray="14 10" style={{ filter: svgGlow(C.red, 8) }} />
        <g transform="translate(800, 175)">
          <rect x={-395} y={-36} width={790} height={72} rx={20} fill="rgba(48, 10, 18, 0.95)" stroke={C.red} strokeWidth={3} />
          <text x={0} y={9} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22}>
            NON-RELATIVISTIC TEXTBOOK MODEL · MISSES ✕
          </text>
        </g>
      </g>

      {/* 4-Component Relativistic Dirac Curve (GLOWING GOLD — snaps dead-on every peak!) */}
      <g opacity={diracP}>
        <path d={evalCurve(expPeaks)} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 10) }} />
        <g transform={`translate(800, 175) scale(${0.8 + 0.2 * stampP})`} opacity={stampP}>
          <rect x={-430} y={-36} width={860} height={72} rx={20} fill="rgba(6, 36, 24, 0.96)" stroke={C.green} strokeWidth={3.5} style={{ filter: svgGlow(C.green, 10) }} />
          <text x={0} y={9} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
            4-COMPONENT DIRAC RELATIVISTIC · EXACT MATCH ✓
          </text>
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5E: THE RELATIVISTIC COLLAPSE OF THE CLASSICAL TRIPLE BOND!
// ===========================================================================
export const TripleBondCollapseAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const morph = interpolate(frame, [25, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swirl = Math.sin(t * 4.5) * 14;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* LEFT CARD: CLASSICAL CN⁻ (1 PURE σ + 2 PURE π) */}
      <g transform="translate(410, 355)">
        <rect x={-305} y={-230} width={610} height={460} rx={30} fill="rgba(8, 16, 38, 0.88)" stroke={C.dim} strokeWidth={3} />
        <text x={0} y={-175} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2}>
          CLASSICAL TRIPLE BOND · CN⁻
        </text>
        {/* Clean separated 1 sigma + 2 pi */}
        <line x1={-150} y1={-60} x2={150} y2={-60} stroke={C.gold} strokeWidth={11} strokeLinecap="round" />
        <line x1={-150} y1={0} x2={150} y2={0} stroke={C.cyan} strokeWidth={11} strokeLinecap="round" />
        <line x1={-150} y1={60} x2={150} y2={60} stroke={C.gold} strokeWidth={11} strokeLinecap="round" />
        <circle cx={-165} cy={0} r={42} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
        <text x={-165} y={11} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>C</text>
        <circle cx={165} cy={0} r={42} fill="#362409" stroke={C.gold} strokeWidth={3.5} />
        <text x={165} y={11} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>N</text>

        <text x={0} y={145} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
          1 Pure σ  +  2 Pure π
        </text>
        <text x={0} y={185} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={19}>
          Clean & Strictly Separate
        </text>
      </g>

      {/* Center Arrow */}
      <polygon points="815,355 775,332 775,378" fill={C.gold} style={{ filter: svgGlow(C.gold, 8) }} />

      {/* RIGHT CARD: RELATIVISTIC CBi⁻ (1 PURE π + 2 SCRAMBLED σ-π HYBRIDS!) */}
      <g transform="translate(1190, 355)">
        <rect x={-315} y={-230} width={630} height={460} rx={30} fill="rgba(26, 16, 8, 0.92)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={-175} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2}>
          RELATIVISTIC COLLAPSE · CBi⁻
        </text>

        {/* Top bond: 1 surviving Pure π bond */}
        <line x1={-150} y1={-88} x2={150} y2={-88} stroke={C.green} strokeWidth={10} strokeLinecap="round" style={{ filter: svgGlow(C.green, 6) }} />
        <text x={0} y={-108} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={19}>
          1 PURE π BOND (|ω| = 3/2)
        </text>

        {/* Bottom 2 bonds: Intertwined glowing braided σ–π relativistic hybrids! */}
        <path
          d={`M-150,${18} Q-50,${18 - 44 * morph + swirl} 0,${18} T150,${18}`}
          fill="none"
          stroke={C.cyan}
          strokeWidth={11}
          strokeLinecap="round"
          style={{ filter: svgGlow(C.cyan, 8) }}
        />
        <path
          d={`M-150,${42} Q-50,${42 + 44 * morph - swirl} 0,${42} T150,${42}`}
          fill="none"
          stroke={C.gold}
          strokeWidth={11}
          strokeLinecap="round"
          style={{ filter: svgGlow(C.gold, 8) }}
        />

        <circle cx={-165} cy={0} r={40} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
        <text x={-165} y={11} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>C</text>
        <circle cx={165} cy={0} r={58} fill="#362006" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={165} y={13} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={36}>Bi</text>

        <text x={0} y={145} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={27}>
          1 Pure π  +  2 Mixed σ–π Hybrids
        </text>
        <text x={0} y={185} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={19}>
          CLASSICAL σ / π BOUNDARY BROKEN!
        </text>
      </g>
    </svg>
  );
};
