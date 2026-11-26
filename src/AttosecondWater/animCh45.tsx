import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { PhotoPlate, ScientistPortraitCard } from "../RelativityBonds/ui";

// ===========================================================================
// CH 4 — PAGE 4A: PHOTOREALISTIC EUROPEAN SYNCHROTRONS (PETRA III & MAX IV!)
// ===========================================================================
export const SynchrotronFacilitiesAnim: React.FC<{
  petraAt: number;
  maxAt: number;
}> = ({ petraAt, maxAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p1 = spring({ frame: Math.max(0, frame - petraAt), fps, config: { damping: 14, stiffness: 120 } });
  const p2 = spring({ frame: Math.max(0, frame - maxAt), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <PhotoPlate src="attowater/xfel-beamline.jpg" borderColor={C.cyan}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Left Facility Card: PETRA III (DESY, Hamburg) */}
        <g transform={`translate(345, 585) scale(${0.86 + 0.14 * p1})`} opacity={p1}>
          <rect x={-295} y={-68} width={590} height={136} rx={24} fill="rgba(6, 14, 34, 0.94)" stroke={C.cyan} strokeWidth={3} style={{ filter: svgGlow(C.cyan, 8) }} />
          <text x={0} y={-14} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={28}>
            PETRA III · DESY
          </text>
          <text x={0} y={26} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
            Hamburg, Germany · Beamline P04
          </text>
        </g>

        {/* Right Facility Card: MAX IV (Lund, Sweden) */}
        <g transform={`translate(1135, 585) scale(${0.86 + 0.14 * p2})`} opacity={p2}>
          <rect x={-295} y={-68} width={590} height={136} rx={24} fill="rgba(26, 18, 6, 0.94)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
          <text x={0} y={-14} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={28}>
            MAX IV · LUND UNIV.
          </text>
          <text x={0} y={26} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
            Lund, Sweden · FlexPES Beamline
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 4 — PAGE 4B: DR. FLORIAN TRINTER & NOV 2026 PRL RESEARCH TEAM!
// ===========================================================================
export const TrinterPRLTeamAnim: React.FC<{
  trinterAt: number;
  prlAt: number;
}> = ({ trinterAt, prlAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prlP = spring({ frame: Math.max(0, frame - prlAt), fps, config: { damping: 14, stiffness: 115 } });

  return (
    <div style={{ width: 1520, height: 690, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 85px" }}>
      <ScientistPortraitCard
        src="attowater/portraits/trinter.jpg"
        name="Dr. Florian Trinter"
        subtitle="FRITZ HABER INSTITUTE · DESY"
        credit="Photo: Fritz Haber Institute (MPG)"
        color={C.cyan}
        width={410}
        photoHeight={420}
        objectPosition="50% 18%"
        delay={trinterAt}
      />

      <svg viewBox="0 0 880 620" style={{ width: 880, height: 620, overflow: "visible" }}>
        <g transform={`translate(440, 225) scale(${0.88 + 0.12 * prlP})`} opacity={0.25 + 0.75 * prlP}>
          <rect x={-360} y={-155} width={720} height={310} rx={28} fill="rgba(26, 18, 6, 0.95)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 10) }} />
          <text x={0} y={-92} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={2.2}>
            PHYSICAL REVIEW LETTERS · NOV 5, 2026
          </text>
          <text x={0} y={-18} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={34}>
            Ultrafast Double Dissociation of Water
          </text>
          <text x={0} y={32} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={800} fontSize={24}>
            Producing Neutral Atomic Oxygen Above O 1s
          </text>
          <text x={0} y={102} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={19}>
            FHI BERLIN · LUND UNIV. · DESY · UPPSALA · KYOTO
          </text>
        </g>

        <g transform="translate(440, 505)">
          <rect x={-370} y={-36} width={740} height={72} rx={36} fill="rgba(6, 16, 38, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={9} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={1.4}>
            HIGH-RESOLUTION RESONANT AUGER SPECTROSCOPY
          </text>
        </g>
      </svg>
    </div>
  );
};

// ===========================================================================
// CH 4 — PAGE 4C: WHAT RADIATION CHEMISTS EXPECTED (ONLY ONE H DETACHES -> OH!)
// ===========================================================================
export const SingleBondExpectationAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [16, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Surviving OH fragment on left */}
      <g transform="translate(650, 345)">
        <line x1={0} y1={-40} x2={-135} y2={85} stroke={C.cyan} strokeWidth={13} strokeLinecap="round" />
        <circle cx={0} cy={-40} r={62} fill="#382204" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={-26} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={40}>O</text>
        <circle cx={-135} cy={85} r={40} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
        <text x={-135} y={97} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>H</text>
        <rect x={-215} y={165} width={310} height={54} rx={16} fill="rgba(8, 18, 42, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={-60} y={200} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          OH FRAGMENT INTACT
        </text>
      </g>

      {/* Single detached H drifting right */}
      <line
        x1={715}
        y1={345}
        x2={830 + split * 210}
        y2={425}
        stroke={C.dim}
        strokeWidth={6}
        strokeDasharray="12 10"
        opacity={1 - split * 0.5}
      />
      <g transform={`translate(${860 + split * 220}, 430)`}>
        <circle r={40} fill="#0c284d" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={12} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>H</text>
        <text x={0} y={84} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
          1 H BREAKS OFF
        </text>
      </g>

      <g transform="translate(800, 635)">
        <rect x={-465} y={-34} width={930} height={68} rx={34} fill="rgba(8, 16, 38, 0.94)" stroke={C.dim} strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          OLD ASSUMPTION: BREAKING BOTH BONDS IN 4 fs WAS OUT OF THE RACE
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4D: DOUBLE DISSOCIATION RACE — BOTH O–H BONDS EXPLODE < 4 FS!
// ===========================================================================
export const DoubleDissociationRaceAnim: React.FC<{
  explodeAt: number;
  winAt: number;
}> = ({ explodeAt, winAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const expP = interpolate(frame, [Math.max(12, explodeAt - 8), explodeAt + 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const winPop = spring({ frame: Math.max(0, frame - winAt), fps, config: { damping: 12, stiffness: 135 } });
  const fs = interpolate(frame, [Math.max(8, explodeAt - 10), Math.max(45, winAt + 55)], [0, 3.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const h1x = 640 - expP * 335;
  const h2x = 960 + expP * 335;
  const hy = 420 + expP * 55;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Live Race Telemetry Header */}
      <g transform="translate(800, 86)">
        <rect x={-480} y={-36} width={960} height={72} rx={22} fill="rgba(8, 16, 38, 0.94)" stroke={C.gold} strokeWidth={3} />
        <text x={-445} y={8} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>
          CORE-HOLE LIFETIME: {fs.toFixed(1)} / 4.0 fs
        </text>
        <text x={445} y={8} textAnchor="end" fill={expP > 0.6 ? C.red : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
          {expP > 0.6 ? "BOTH BONDS RUPTURED FIRST! ⚡" : "ABOVE O 1s THRESHOLD → REPULSION!"}
        </text>
      </g>

      {/* Outward Explosive Force Arrows */}
      <g opacity={expP}>
        <line x1={690} y1={340} x2={h1x + 56} y2={hy - 12} stroke={C.red} strokeWidth={7} strokeDasharray="16 12" />
        <line x1={910} y1={340} x2={h2x - 56} y2={hy - 12} stroke={C.red} strokeWidth={7} strokeDasharray="16 12" />
      </g>

      {/* Center Stripped Neutral Excited Atomic Oxygen O* */}
      <g transform="translate(800, 325)" style={{ filter: svgGlow(C.gold, 14) }}>
        <circle r={74} fill="#382204" stroke={C.gold} strokeWidth={5} />
        <circle r={28} fill="#16040a" stroke={C.red} strokeWidth={3.5} strokeDasharray="6 4" />
        <text x={0} y={14} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={44}>O*</text>
        <text x={0} y={118} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
          NEUTRAL EXCITED ATOMIC OXYGEN
        </text>
      </g>

      {/* Both Hydrogens Catapulting Outward Simultaneously! */}
      <g transform={`translate(${h1x}, ${hy})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle r={42} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>H</text>
      </g>
      <g transform={`translate(${h2x}, ${hy})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle r={42} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>H</text>
      </g>

      <g transform={`translate(800, 630) scale(${0.86 + 0.14 * winPop})`} opacity={0.25 + 0.75 * winPop}>
        <rect x={-500} y={-34} width={1000} height={68} rx={34} fill="rgba(48, 10, 18, 0.96)" stroke={C.red} strokeWidth={3} style={{ filter: svgGlow(C.red, 8) }} />
        <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          NUCLEAR MOTION WINS THE RACE AGAINST AUGER RELAXATION!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 4 — PAGE 4E: HIGH-RES ELECTRON DETECTOR — SHARP ATOMIC OXYGEN SPIKES!
// ===========================================================================
export const AtomicOxygenSpectrumAnim: React.FC<{ spikeAt: number }> = ({ spikeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spikeP = interpolate(frame, [Math.max(10, spikeAt - 8), spikeAt + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const calloutP = spring({ frame: Math.max(0, frame - spikeAt - 12), fps, config: { damping: 13, stiffness: 120 } });

  // Broad molecular smear + razor-sharp neutral atomic oxygen spikes!
  const evalSmear = (x: number) =>
    125 * Math.exp(-Math.pow((x - 560) / 185, 2)) + 105 * Math.exp(-Math.pow((x - 980) / 210, 2));
  const evalSpikes = (x: number) =>
    210 * Math.exp(-Math.pow((x - 735) / 14, 2)) +
    245 * Math.exp(-Math.pow((x - 865) / 13, 2)) +
    190 * Math.exp(-Math.pow((x - 1105) / 14, 2));

  const smearPts: string[] = [];
  const atomicPts: string[] = [];
  for (let x = 220; x <= 1380; x += 6) {
    const sm = evalSmear(x);
    const sp = evalSpikes(x);
    smearPts.push(`${x === 220 ? "M" : "L"}${x},${(545 - sm).toFixed(1)}`);
    atomicPts.push(`${x === 220 ? "M" : "L"}${x},${(545 - sm - sp * spikeP).toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <line x1={220} y1={545} x2={1395} y2={545} stroke={C.dim} strokeWidth={3.5} />
      <line x1={220} y1={545} x2={220} y2={145} stroke={C.dim} strokeWidth={3.5} />
      <text x={800} y={608} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={26}>
        Ejected Auger Electron Kinetic Energy →
      </text>

      {/* Messy Broad Molecular Smear */}
      <path d={smearPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={5} strokeDasharray="10 8" opacity={0.55} />

      {/* Razor-Sharp Atomic Oxygen Spikes rising cleanly on spikeAt! */}
      <path d={atomicPts.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 10) }} />

      {/* Exact Peak Tip Markers */}
      {[735, 865, 1105].map((px) => (
        <circle
          key={px}
          cx={px}
          cy={545 - evalSmear(px) - evalSpikes(px) * spikeP}
          r={10}
          fill={C.white}
          stroke={C.gold}
          strokeWidth={3.5}
          opacity={spikeP}
          style={{ filter: svgGlow(C.gold, 10) }}
        />
      ))}

      {/* Spacious Callout Pill cleanly clear above all spikes! */}
      <g transform={`translate(800, 110) scale(${0.86 + 0.14 * calloutP})`} opacity={calloutP}>
        <rect x={-445} y={-36} width={890} height={72} rx={22} fill="rgba(34, 24, 4, 0.96)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
          RAZOR-SHARP NEUTRAL ATOMIC OXYGEN (O*) SPIKES ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5A: FLIP THE LENS — STEPPING BELOW 1 FEMTOSECOND!
// ===========================================================================
export const FlipToAttosecondLensAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const zoomP = interpolate(frame, [15, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left: 4 fs (Nuclei moving) */}
      <g transform="translate(420, 355)" opacity={1 - zoomP * 0.45}>
        <rect x={-270} y={-190} width={540} height={380} rx={28} fill="rgba(26, 14, 18, 0.9)" stroke={C.red} strokeWidth={3} />
        <text x={0} y={-120} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22}>
          4 FEMTOSECONDS (4,000 as)
        </text>
        <text x={0} y={10} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>
          Hydrogens Fly Apart
        </text>
        <text x={0} y={62} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={700} fontSize={24}>
          Nuclei Outrun Auger Decay
        </text>
      </g>

      {/* Center Zoom Arrow */}
      <line x1={715} y1={355} x2={870} y2={355} stroke={C.cyan} strokeWidth={6} />
      <polygon points="890,355 858,336 858,374" fill={C.cyan} />
      <text x={795} y={325} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>10× FASTER</text>

      {/* Right: < 1 fs (ATTOSECOND REGIME — Hydrogens Frozen Still!) */}
      <g transform="translate(1190, 355)" style={{ filter: svgGlow(C.cyan, 10) }}>
        <rect x={-285} y={-195} width={570} height={390} rx={28} fill="rgba(6, 22, 46, 0.96)" stroke={C.cyan} strokeWidth={4} />
        <text x={0} y={-122} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
          ATTOSECOND REGIME (&lt; 1 fs)
        </text>
        {/* Frozen H-O-H with shimmering electron halo */}
        <circle cx={0} cy={-8} r={76 + Math.sin(t * 7) * 5} fill="rgba(62,224,255,0.16)" stroke={C.cyan} strokeWidth={3.5} strokeDasharray="12 8" />
        <circle cx={0} cy={-26} r={24} fill={C.gold} />
        <circle cx={-52} cy={22} r={14} fill={C.white} />
        <circle cx={52} cy={22} r={14} fill={C.white} />
        <text x={0} y={118} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Hydrogens Frozen Still!
        </text>
        <text x={0} y={156} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
          PURE ELECTRON MOTION ISOLATED
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5B: PROF. LINDA YOUNG PORTRAIT + PHOTOREALISTIC WATER MICROJET!
// ===========================================================================
export const LindaYoungWaterJetAnim: React.FC<{
  youngAt: number;
}> = ({ youngAt }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 260], [1.0, 1.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: 1540, height: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 55px" }}>
      <ScientistPortraitCard
        src="attowater/portraits/young.jpg"
        name="Prof. Linda Young"
        subtitle="ARGONNE NAT'L LAB · UCHICAGO"
        credit="Photo: Univ. of Chicago / Argonne"
        color={C.cyan}
        width={395}
        photoHeight={405}
        objectPosition="50% 20%"
        delay={youngAt}
      />

      {/* Right: Photorealistic Vacuum Chamber Liquid Water Microjet Hit by X-Ray! */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 970,
            height: 545,
            borderRadius: 30,
            overflow: "hidden",
            border: `3px solid ${C.cyan}`,
            boxShadow: `${glow(C.cyan, 14)}, 0 24px 64px rgba(0,0,0,0.88)`,
            position: "relative",
          }}
        >
          <Img
            src={staticFile("attowater/water-microjet.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "12px 36px",
                borderRadius: 36,
                background: "rgba(6, 14, 34, 0.94)",
                border: `2.5px solid ${C.gold}`,
                fontFamily: MONO,
                fontWeight: 900,
                fontSize: 21,
                color: C.gold,
                letterSpacing: 1.5,
              }}
            >
              SLAC LCLS · SCIENCE (2024) · LIQUID WATER MICROJET
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// CH 5 — PAGE 5C: ATTOSECOND-PUMP / ATTOSECOND-PROBE (FREEZING HYDROGENS!)
// ===========================================================================
export const AttosecondPumpProbeAnim: React.FC<{
  probeAt: number;
  debateAt: number;
}> = ({ probeAt, debateAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const probeP = interpolate(frame, [Math.max(12, probeAt - 6), probeAt + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const debatePop = spring({ frame: Math.max(0, frame - debateAt), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Two Synchronized Sub-Femtosecond X-Ray Pulses on Left */}
      <g transform="translate(360, 325)">
        <rect x={-230} y={-155} width={460} height={310} rx={26} fill="rgba(8, 16, 38, 0.92)" stroke={C.cyan} strokeWidth={3} />
        <text x={0} y={-105} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>
          TWIN ATTOSECOND PULSES
        </text>
        {/* Pulse 1: PUMP */}
        <path d="M-185,-10 Q-130,-95 -75,-10" fill="none" stroke={C.cyan} strokeWidth={7} style={{ filter: svgGlow(C.cyan, 10) }} />
        <text x={-130} y={32} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={18}>1. PUMP</text>
        {/* Pulse 2: PROBE arriving hundreds of attoseconds later */}
        <g opacity={0.25 + 0.75 * probeP}>
          <path d="M55,-10 Q110,-95 165,-10" fill="none" stroke={C.gold} strokeWidth={7} style={{ filter: svgGlow(C.gold, 10) }} />
          <text x={110} y={32} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={18}>2. PROBE</text>
        </g>
        <text x={0} y={108} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={21}>
          DELAY &lt; 1 FEMTOSECOND!
        </text>
      </g>

      {/* Right: Frozen Water Molecule + Pure Shimmering Electron Response */}
      <g transform="translate(1110, 325)">
        <circle r={175 + Math.sin(t * 7) * 8} fill="rgba(62, 224, 255, 0.14)" stroke={C.cyan} strokeWidth={4.5} strokeDasharray="18 10" strokeDashoffset={-t * 95} style={{ filter: svgGlow(C.cyan, 10) }} />
        <line x1={0} y1={-40} x2={-110} y2={62} stroke={C.dim} strokeWidth={11} />
        <line x1={0} y1={-40} x2={110} y2={62} stroke={C.dim} strokeWidth={11} />
        <circle cx={0} cy={-40} r={46} fill="#382204" stroke={C.gold} strokeWidth={4} />
        <text x={0} y={-28} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={32}>O</text>
        <circle cx={-110} cy={62} r={30} fill="#0c284d" stroke={C.white} strokeWidth={3.5} />
        <text x={-110} y={72} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={22}>H</text>
        <circle cx={110} cy={62} r={30} fill="#0c284d" stroke={C.white} strokeWidth={3.5} />
        <text x={110} y={72} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={22}>H</text>
        <text x={0} y={-205} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={21}>
          HYDROGENS FROZEN STILL (Δx ≈ 0) ✓
        </text>
      </g>

      {/* Bottom Resolution Banner */}
      <g transform={`translate(800, 625) scale(${0.88 + 0.12 * debatePop})`} opacity={0.25 + 0.75 * debatePop}>
        <rect x={-520} y={-34} width={1040} height={68} rx={34} fill="rgba(6, 36, 24, 0.96)" stroke={C.green} strokeWidth={3} />
        <text x={0} y={8} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={1.4}>
          SETTLED LIQUID WATER DEBATE: DYNAMIC MOTION, NOT TWO STATIC LIQUIDS ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 5 — PAGE 5D: OCT 2026 EUROPEAN XFEL WORLD RECORD (300-ATTOSECOND FLASH!)
// ===========================================================================
export const EuropeanXFEL300AsAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const flash = Math.pow(0.5 + 0.5 * Math.sin(t * 6), 4);

  return (
    <PhotoPlate src="attowater/xfel-beamline.jpg" borderColor={C.gold}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Glowing centered 300-as Hard X-Ray Strobe Core */}
        <circle cx={740} cy={325} r={55 + flash * 35} fill="rgba(62, 224, 255, 0.22)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 14) }} />
        <circle cx={740} cy={325} r={18 + flash * 10} fill={C.white} style={{ filter: svgGlow(C.gold, 16) }} />

        <g transform="translate(740, 125)">
          <rect x={-370} y={-44} width={740} height={88} rx={24} fill="rgba(6, 14, 34, 0.94)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 10) }} />
          <text x={0} y={-4} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2}>
            EUROPEAN XFEL · OPTICA (OCT 2026)
          </text>
          <text x={0} y={30} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>
            300-Attosecond Hard X-Ray World Record
          </text>
        </g>

        <g transform="translate(740, 635)">
          <rect x={-485} y={-32} width={970} height={64} rx={32} fill="rgba(6, 14, 34, 0.95)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={1.4}>
            A TRUE STROBE CAMERA WHERE BORN–OPPENHEIMER BREAKS DOWN
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};
