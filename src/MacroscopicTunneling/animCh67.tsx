import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH 6 — PAGE 6A1: THE HIDDEN CLUE INSIDE THE THREE 1985 PEAKS (UNEVEN GAPS!)
// (Replaces the 46.8s Ch 6 loop with 3 distinct voice-matched pages!)
// ===========================================================================
export const PeaksGapClueAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const peaks = [
    { x0: 410, h: 270, w: 28, label: "0 → 1", col: C.cyan },
    { x0: 840, h: 225, w: 26, label: "1 → 2", col: C.gold },
    { x0: 1170, h: 175, w: 24, label: "2 → 3", col: C.green },
  ];
  const pts: string[] = [];
  for (let x = 220; x <= 1380; x += 6) {
    let val = 0;
    for (const pk of peaks) val += pk.h / (1 + Math.pow((x - pk.x0) / pk.w, 2));
    pts.push(`${x === 220 ? "M" : "L"}${x},${(540 - val).toFixed(1)}`);
  }

  const cal1 = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 14, stiffness: 120 } });
  const cal2 = spring({ frame: Math.max(0, frame - 64), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <line x1={220} y1={540} x2={1380} y2={540} stroke={C.dim} strokeWidth={3} />
      <path d={pts.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} style={{ filter: svgGlow(C.gold, 8) }} />

      {peaks.map((pk) => (
        <g key={pk.label}>
          <line x1={pk.x0} y1={540 - pk.h} x2={pk.x0} y2={185} stroke={pk.col} strokeWidth={2.5} strokeDasharray="7 7" opacity={0.65} />
          <text x={pk.x0} y={585} textAnchor="middle" fill={pk.col} fontFamily={MONO} fontWeight={900} fontSize={24}>
            {pk.label}
          </text>
        </g>
      ))}

      {/* Caliper 1: WIDER gap (430px) */}
      <g opacity={cal1} transform="translate(0, 175)">
        <line x1={410} y1={0} x2={840} y2={0} stroke={C.cyan} strokeWidth={4.5} style={{ filter: svgGlow(C.cyan, 6) }} />
        <line x1={410} y1={-14} x2={410} y2={14} stroke={C.cyan} strokeWidth={4} />
        <line x1={840} y1={-14} x2={840} y2={14} stroke={C.cyan} strokeWidth={4} />
        <rect x={535} y={-24} width={180} height={46} rx={14} fill="#060c1e" stroke={C.cyan} strokeWidth={2.5} />
        <text x={625} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          WIDER GAP
        </text>
      </g>

      {/* Caliper 2: TIGHTER gap (330px) */}
      <g opacity={cal2} transform="translate(0, 235)">
        <line x1={840} y1={0} x2={1170} y2={0} stroke={C.green} strokeWidth={4.5} style={{ filter: svgGlow(C.green, 6) }} />
        <line x1={840} y1={-14} x2={840} y2={14} stroke={C.green} strokeWidth={4} />
        <line x1={1170} y1={-14} x2={1170} y2={14} stroke={C.green} strokeWidth={4} />
        <rect x={910} y={-24} width={190} height={46} rx={14} fill="#060c1e" stroke={C.green} strokeWidth={2.5} />
        <text x={1005} y={8} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={21}>
          SMALLER GAP!
        </text>
      </g>

      <text x={800} y={658} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2} opacity={0.75 + 0.25 * Math.sin(t * 4)}>
        NOT EQUALLY SPACED — THE SECRET THAT MADE QUBITS POSSIBLE
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6A2: LINEAR LC COIL+CAPACITOR → SYMMETRIC BOWL WITH EQUAL RUNGS
// ===========================================================================
export const SymmetricLCBowlAnim: React.FC<{
  bowlAt: number;
}> = ({ bowlAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const bowlP = spring({ frame: Math.max(0, frame - bowlAt), fps, config: { damping: 16, stiffness: 100 } });

  const paraPts: string[] = [];
  for (let x = 580; x <= 1260; x += 8) {
    const u = (x - 920) / 320;
    const y = 575 - u * u * 425;
    paraPts.push(`${x === 580 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  const rungsY = [515, 410, 305, 200];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left: Crisp Superconducting Coil + Capacitor Circuit Diagram */}
      <g transform="translate(310, 355)">
        <rect x={-165} y={-155} width={330} height={310} rx={28} fill="rgba(8, 16, 38, 0.92)" stroke={C.cyan} strokeWidth={3} />
        {/* Coil (Inductor L) */}
        <path d="M-85,-55 Q-60,-102 -36,-55 Q-12,-102 12,-55 Q36,-102 60,-55 Q84,-102 95,-55" fill="none" stroke={C.cyan} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 6) }} />
        {/* Capacitor C */}
        <line x1={-48} y1={36} x2={48} y2={36} stroke={C.gold} strokeWidth={7} />
        <line x1={-48} y1={58} x2={48} y2={58} stroke={C.gold} strokeWidth={7} />
        <line x1={-85} y1={-55} x2={-85} y2={47} stroke={C.dim} strokeWidth={4} />
        <line x1={-85} y1={47} x2={-48} y2={47} stroke={C.dim} strokeWidth={4} />
        <line x1={95} y1={-55} x2={95} y2={47} stroke={C.dim} strokeWidth={4} />
        <line x1={48} y1={47} x2={95} y2={47} stroke={C.dim} strokeWidth={4} />
        {/* Gentle AC slosh dot */}
        <circle cx={Math.sin(t * 4) * 55} cy={-55} r={8} fill={C.white} style={{ filter: svgGlow(C.cyan, 6) }} />
        <text x={0} y={118} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          CLASSIC LINEAR LC CIRCUIT
        </text>
      </g>

      {/* Arrow linking circuit -> symmetric energy bowl */}
      <line x1={495} y1={355} x2={565} y2={355} stroke={C.dim} strokeWidth={4} strokeDasharray="8 6" opacity={bowlP} />

      {/* Right: Perfectly Symmetric Parabolic Bowl + Identical Rung Rulers */}
      <g opacity={bowlP}>
        <path d={paraPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 6) }} />

        {rungsY.map((y, idx) => {
          const halfW = Math.sqrt((575 - y) / 425) * 300;
          const rungP = spring({ frame: Math.max(0, frame - bowlAt - 18 - idx * 18), fps, config: { damping: 14, stiffness: 120 } });
          return (
            <g key={idx} opacity={rungP}>
              <line x1={920 - halfW} y1={y} x2={920 + halfW} y2={y} stroke={C.gold} strokeWidth={4.5} />
              <text x={920 - halfW - 22} y={y + 8} textAnchor="end" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={23}>
                |{idx}⟩
              </text>
              {idx < 3 && (
                <g transform={`translate(1285, ${(y + rungsY[idx + 1]) / 2})`}>
                  <line x1={0} y1={-40} x2={0} y2={40} stroke={C.gold} strokeWidth={3.5} />
                  <line x1={-10} y1={-40} x2={10} y2={-40} stroke={C.gold} strokeWidth={2.5} />
                  <line x1={-10} y1={40} x2={10} y2={40} stroke={C.gold} strokeWidth={2.5} />
                  <text x={20} y={7} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
                    EQUAL GAP
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      <text x={800} y={662} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
        SYMMETRIC BOWL → EVERY SINGLE RUNG HAS THE EXACT SAME GAP
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6A3: ONE PULSE LEAKS UNCONTROLLABLY 0 → 1 → 2 → 3!
// ===========================================================================
export const HarmonicLadderLeakAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Perfectly symmetric parabola U(x) = a*x^2
  const paraPts: string[] = [];
  for (let x = 440; x <= 1160; x += 8) {
    const u = (x - 800) / 340;
    const y = 565 - u * u * 420;
    paraPts.push(`${x === 440 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  // 4 PERFECTLY EQUALLY SPACED RUNGS (105px apart!)
  const rungsY = [505, 400, 295, 190];
  // Fires smoothly one step after another right as narrator says "from zero to one, one to two, and two to three"!
  const stepIdx = frame < 35 ? 0 : frame < 95 ? 1 : frame < 155 ? 2 : 3;
  const orbY = interpolate(
    frame,
    [0, 35, 55, 95, 115, 155, 175],
    [505, 505, 400, 400, 295, 295, 190],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const alarmP = spring({ frame: Math.max(0, frame - 175), fps, config: { damping: 12, stiffness: 130 } });

  // Incoming golden microwave beam from left trying to address 0 -> 1
  const mwPts: string[] = [];
  for (let x = 160; x <= 530; x += 8) {
    const y = 450 + Math.sin(x * 0.14 - t * 18) * 18;
    mwPts.push(`${x === 160 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Incoming microwave pulse */}
      <path d={mwPts.join(" ")} fill="none" stroke={C.gold} strokeWidth={5.5} style={{ filter: svgGlow(C.gold, 8) }} />
      <text x={330} y={402} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
        PULSE FOR 0 → 1
      </text>

      {/* Symmetric Parabolic Well */}
      <path d={paraPts.join(" ")} fill="none" stroke={C.dim} strokeWidth={7} strokeLinecap="round" />

      {/* Equally spaced rungs */}
      {rungsY.map((y, idx) => {
        const halfW = Math.sqrt((565 - y) / 420) * 320;
        const hit = idx <= stepIdx;
        return (
          <g key={idx}>
            <line
              x1={800 - halfW}
              y1={y}
              x2={800 + halfW}
              y2={y}
              stroke={hit && idx >= 2 ? C.red : hit ? C.gold : C.cyan}
              strokeWidth={hit ? 6 : 3.5}
              opacity={hit ? 1 : 0.45}
            />
            <text x={800 - halfW - 22} y={y + 8} textAnchor="end" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={24}>
              |{idx}⟩
            </text>
            {idx >= 2 && hit && (
              <text x={800 + halfW + 24} y={y + 8} fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={21}>
                UNWANTED LEAK!
              </text>
            )}
          </g>
        );
      })}

      {/* Cascade leak arrows */}
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={stepIdx > i ? 1 : 0.15}>
          <line x1={800} y1={rungsY[i] - 18} x2={800} y2={rungsY[i + 1] + 22} stroke={i >= 1 ? C.red : C.gold} strokeWidth={5.5} />
          <polygon points={`800,${rungsY[i + 1] + 10} 788,${rungsY[i + 1] + 30} 812,${rungsY[i + 1] + 30}`} fill={i >= 1 ? C.red : C.gold} />
        </g>
      ))}

      {/* Active orb leaking uncontrollably up the whole ladder */}
      <circle cx={800} cy={orbY} r={22} fill={stepIdx >= 2 ? C.red : C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(stepIdx >= 2 ? C.red : C.gold, 10) }} />

      {/* Clear takeaway pill */}
      <g transform={`translate(800, 648) scale(${0.8 + 0.2 * alarmP})`} opacity={alarmP}>
        <rect x={-410} y={-34} width={820} height={68} rx={34} fill="rgba(46, 10, 16, 0.95)" stroke={C.red} strokeWidth={3.5} style={{ filter: svgGlow(C.red, 8) }} />
        <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          ONE PULSE LEAKS 0 → 1 → 2 → 3 · NOT A QUBIT ✕
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6B: JOSEPHSON ANHARMONICITY (CLEAN ISOLATED |0⟩ ↔ |1⟩ QUBIT!)
// ===========================================================================
export const AnharmonicJosephsonQubitAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Asymmetric curved cosine/Josephson well (flares wider at top -> uneven rungs!)
  const wellPts: string[] = [];
  for (let x = 420; x <= 1180; x += 8) {
    const u = (x - 800) / 360;
    const y = 552 - 410 * (1 - Math.cos(u * Math.PI * 0.62));
    wellPts.push(`${x === 420 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  // UNEVEN RUNGS: 0->1 is 148px wide! 1->2 is only 104px! 2->3 is only 72px!
  const rungs = [
    { n: 0, y: 498, hw: 175, col: C.cyan },
    { n: 1, y: 350, hw: 245, col: C.gold },
    { n: 2, y: 246, hw: 300, col: C.dim },
    { n: 3, y: 174, hw: 345, col: C.dim },
  ];

  // Orb flips cleanly ONLY between |0⟩ and |1⟩ while |2⟩ and |3⟩ remain dark!
  const flip = Math.sin(t * 2.6) > 0 ? 1 : 0;
  const orbY = interpolate(Math.sin(t * 2.6), [-0.35, 0.35], [498, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Josephson Junction X symbol badge on left */}
      <g transform="translate(225, 310)">
        <rect x={-110} y={-95} width={220} height={190} rx={22} fill="rgba(8,22,42,0.92)" stroke={C.gold} strokeWidth={3} />
        <line x1={-36} y1={-46} x2={36} y2={26} stroke={C.gold} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 8) }} />
        <line x1={36} y1={-46} x2={-36} y2={26} stroke={C.gold} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={76} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={18}>
          JOSEPHSON JUNCTION
        </text>
      </g>

      {/* Curved Josephson well */}
      <path d={wellPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />

      {/* Uneven rungs */}
      {rungs.map((r) => {
        const isQubit = r.n <= 1;
        return (
          <g key={r.n}>
            <line
              x1={800 - r.hw}
              y1={r.y}
              x2={800 + r.hw}
              y2={r.y}
              stroke={r.col}
              strokeWidth={isQubit ? 6 : 3}
              strokeDasharray={isQubit ? undefined : "10 8"}
              opacity={isQubit ? 1 : 0.4}
              style={isQubit ? { filter: svgGlow(r.col, 6) } : undefined}
            />
            <text x={800 - r.hw - 22} y={r.y + 8} textAnchor="end" fill={isQubit ? r.col : C.dim} fontFamily={MONO} fontWeight={900} fontSize={25}>
              |{r.n}⟩
            </text>
          </g>
        );
      })}

      {/* Gap labels on right proving mismatch */}
      <g transform="translate(1155, 424)">
        <line x1={-60} y1={-66} x2={-60} y2={66} stroke={C.green} strokeWidth={4.5} />
        <rect x={-42} y={-26} width={270} height={52} rx={14} fill="rgba(6,34,24,0.95)" stroke={C.green} strokeWidth={2.5} />
        <text x={93} y={8} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
          QUBIT GAP (f₀₁) ✓
        </text>
      </g>

      <g transform="translate(1195, 298)" opacity={0.65}>
        <line x1={-60} y1={-44} x2={-60} y2={44} stroke={C.dim} strokeWidth={3} strokeDasharray="5 5" />
        <text x={-35} y={8} fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={21}>
          SMALLER GAP · IGNORED
        </text>
      </g>

      {/* Clean double-headed flip arrow between |0⟩ and |1⟩ */}
      <line x1={800} y1={480} x2={800} y2={368} stroke={C.green} strokeWidth={5} />
      <circle cx={800} cy={orbY} r={22} fill={flip ? C.gold : C.cyan} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.green, 10) }} />

      {/* Bottom payoff pill */}
      <g transform="translate(800, 648)">
        <rect x={-420} y={-34} width={840} height={68} rx={34} fill="rgba(6, 36, 24, 0.95)" stroke={C.green} strokeWidth={3} style={{ filter: svgGlow(C.green, 8) }} />
        <text x={0} y={8} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          UNEVEN RUNGS → CLEAN ISOLATED |0⟩ ↔ |1⟩ QUBIT ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6C: FOUR-DECADE SUPERCONDUCTING QUBIT LINEAGE
// ===========================================================================
export const QubitLineageAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cards = [
    { year: "1985", title: "Artificial Atom", sub: "Clarke · Devoret · Martinis", color: C.cyan, delay: 0 },
    { year: "1999", title: "Cooper-Pair Box", sub: "Nakamura · First Qubit Flip", color: C.gold, delay: 25 },
    { year: "2002", title: "Phase Qubit", sub: "John Martinis · UCSB", color: C.green, delay: 50 },
    { year: "2007", title: "Transmon Qubit", sub: "Devoret · Yale University", color: "#ff7de9", delay: 75 },
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Connecting horizontal timeline glow spine */}
      <line x1={180} y1={350} x2={1420} y2={350} stroke="rgba(62,224,255,0.28)" strokeWidth={6} strokeLinecap="round" />

      {cards.map((c, idx) => {
        const sp = spring({ frame: Math.max(0, frame - c.delay), fps, config: { damping: 14, stiffness: 110 } });
        const cx = 240 + idx * 373;
        const pulse = 1 + 0.06 * Math.sin(t * 4 + idx);
        return (
          <g key={c.year} transform={`translate(${cx}, ${350 + (1 - sp) * 45})`} opacity={sp}>
            {/* Card */}
            <rect x={-160} y={-150} width={320} height={300} rx={26} fill="rgba(8, 16, 38, 0.92)" stroke={c.color} strokeWidth={3.5} />

            {/* Year pill */}
            <rect x={-72} y={-174} width={144} height={48} rx={24} fill="#060c1e" stroke={c.color} strokeWidth={3} style={{ filter: svgGlow(c.color, 6) }} />
            <text x={0} y={-142} textAnchor="middle" fill={c.color} fontFamily={MONO} fontWeight={900} fontSize={24}>
              {c.year}
            </text>

            {/* Glowing Josephson Cross Icon at the heart of EVERY generation! */}
            <g transform={`translate(0, -35) scale(${pulse})`}>
              <circle r={48} fill="rgba(255,255,255,0.05)" stroke={c.color} strokeWidth={2.5} strokeDasharray="6 6" />
              <line x1={-22} y1={-22} x2={22} y2={22} stroke={c.color} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(c.color, 6) }} />
              <line x1={22} y1={-22} x2={-22} y2={22} stroke={c.color} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(c.color, 6) }} />
            </g>

            <text x={0} y={66} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
              {c.title}
            </text>
            <text x={0} y={104} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={700} fontSize={18}>
              {c.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6D: MODERN SUPERCONDUCTING QUANTUM PROCESSOR GRID
// ===========================================================================
export const QuantumProcessorGridAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cols = 5;
  const rows = 3;
  const nodes: { x: number; y: number; idx: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({ x: 400 + c * 200, y: 205 + r * 165, idx: r * cols + c });
    }
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Gleaming chip package */}
      <rect x={260} y={105} width={1080} height={530} rx={36} fill="rgba(7, 14, 34, 0.92)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 8) }} />

      {/* Coupler links between neighboring transmon qubits */}
      {nodes.map((n) => {
        const c = n.idx % cols;
        const r = Math.floor(n.idx / cols);
        const pulse = 0.35 + 0.65 * Math.pow(Math.sin(t * 3.2 + n.idx * 0.9), 2);
        return (
          <g key={`link-${n.idx}`}>
            {c < cols - 1 && (
              <line x1={n.x + 36} y1={n.y} x2={n.x + 164} y2={n.y} stroke={C.gold} strokeWidth={4} opacity={pulse} />
            )}
            {r < rows - 1 && (
              <line x1={n.x} y1={n.y + 36} x2={n.x} y2={n.y + 129} stroke={C.cyan} strokeWidth={4} opacity={pulse} />
            )}
          </g>
        );
      })}

      {/* Coupled Transmon Qubits */}
      {nodes.map((n) => {
        const wave = Math.sin(t * 3.8 + n.idx * 1.3);
        const isOne = wave > 0;
        const col = isOne ? C.gold : C.cyan;
        return (
          <g key={n.idx} transform={`translate(${n.x}, ${n.y})`} style={{ filter: svgGlow(col, 8) }}>
            <rect x={-36} y={-36} width={72} height={72} rx={16} fill="#08122b" stroke={col} strokeWidth={3.5} />
            {/* Tiny Josephson cross inside each qubit */}
            <line x1={-12} y1={-12} x2={12} y2={12} stroke={col} strokeWidth={4} strokeLinecap="round" />
            <line x1={12} y1={-12} x2={-12} y2={12} stroke={col} strokeWidth={4} strokeLinecap="round" />
          </g>
        );
      })}

      <text x={800} y={682} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={2.5}>
        COUPLED JOSEPHSON TRANSMONS · MODERN QUANTUM PROCESSORS
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7A: CALDEIRA–LEGGETT DISSIPATION (FRICTION CHOKES TUNNELING!)
// ===========================================================================
export const CaldeiraLeggettHoneyAnim: React.FC<{
  honeyStartAt: number;
  honeyEndAt: number;
}> = ({ honeyStartAt, honeyEndAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Honey friction ramps smoothly across exact spoken cues ("connect even a tiny trace" -> "chokes off macroscopic tunneling")!
  const friction = interpolate(frame, [Math.max(10, honeyStartAt), Math.max(honeyStartAt + 60, honeyEndAt)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Well curve
  const wellPath = "M220,210 Q380,550 610,550 Q800,550 940,305 Q1075,305 1380,620";

  // Marble sluggishly dragging in honey
  const marbleX = 590 + Math.sin(t * (5 - friction * 3.8)) * (18 * (1 - friction * 0.7));
  const tunnelAlpha = Math.max(0.05, 1 - friction * 0.95);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <linearGradient id="honeyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.82" />
        </linearGradient>
      </defs>

      {/* Thick amber "honey" filling bottom of the valley as resistance connects */}
      <path
        d={`M345,${560 - friction * 165} Q610,${545 - friction * 145 + Math.sin(t * 2) * 8} 865,${560 - friction * 165} L865,610 L345,610 Z`}
        fill="url(#honeyFill)"
        opacity={friction}
      />

      {/* Washboard hill */}
      <path d={wellPath} fill="none" stroke={C.cyan} strokeWidth={7} style={{ filter: svgGlow(C.cyan, 6) }} />

      {/* Tunneling ghost arrow shrinking & dying as friction rises! */}
      <g opacity={tunnelAlpha}>
        <line x1={635} y1={485} x2={1145} y2={485} stroke={C.cyan} strokeWidth={5.5} strokeDasharray="14 10" />
        <polygon points="1165,485 1132,468 1132,502" fill={C.cyan} />
      </g>

      {/* Energy leaking out as jagged heat waves into resistor */}
      {friction > 0.2 && (
        <g opacity={friction}>
          {[0, 1, 2].map((i) => {
            const dy = ((t * 90 + i * 50) % 150);
            return (
              <circle
                key={i}
                cx={590 + (i - 1) * 44}
                cy={455 - dy}
                r={10}
                fill={C.red}
                opacity={1 - dy / 150}
              />
            );
          })}
          {/* Resistor zig-zag badge top-left */}
          <g transform="translate(310, 195)">
            <rect x={-135} y={-48} width={270} height={96} rx={18} fill="rgba(42,14,16,0.94)" stroke={C.red} strokeWidth={3} />
            <path d="M-85,-10 L-58,-10 L-46,-26 L-24,6 L-2,-26 L20,6 L42,-26 L56,-10 L85,-10" fill="none" stroke={C.red} strokeWidth={4.5} strokeLinejoin="round" />
            <text x={0} y={32} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={19}>
              TINY RESISTANCE ON
            </text>
          </g>
        </g>
      )}

      {/* Sluggish marble stuck inside honey */}
      <circle cx={marbleX} cy={502} r={25} fill={friction > 0.5 ? C.gold : C.cyan} stroke={C.white} strokeWidth={2.5} />

      <text x={800} y={668} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2}>
        DISSIPATION EAVESDROPS → CHOKES TUNNELING EXPONENTIALLY
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7B: GOLDEN DILUTION REFRIGERATOR CHANDELIER (300 K → 15 mK)
// ===========================================================================
export const GoldenChandelierFridgeAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const stages = [
    { y: 150, w: 460, temp: "300 K", label: "Room Temperature Flange", col: "#ff6b6b" },
    { y: 270, w: 380, temp: "4 K", label: "Liquid Helium Stage", col: C.gold },
    { y: 390, w: 300, temp: "100 mK", label: "Cold Plate", col: "#7ce6ff" },
    { y: 510, w: 220, temp: "15 mK", label: "Mixing Chamber · Qubit Chip", col: C.cyan },
  ];

  // Stray red environmental noise photons bouncing off outer magnetic shield!
  const strayAngles = [0.4, 1.1, 2.2, 3.8, 4.9, 5.6];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <linearGradient id="goldPlate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9c6b14" />
          <stop offset="50%" stopColor="#ffd970" />
          <stop offset="100%" stopColor="#85550a" />
        </linearGradient>
      </defs>

      {/* Protective Cryo Shield Rings */}
      <ellipse cx={800} cy={355} rx={365} ry={285} fill="none" stroke="rgba(62,224,255,0.28)" strokeWidth={3.5} strokeDasharray="16 12" />

      {/* Deflected stray noise photons bouncing cleanly off outer shield */}
      {strayAngles.map((ang, i) => {
        const bounce = Math.abs(Math.sin(t * 2.2 + i * 1.1));
        const r = 385 + bounce * 115;
        const sx = 800 + Math.cos(ang) * r;
        const sy = 355 + Math.sin(ang) * (r * 0.72);
        return (
          <g key={i} opacity={0.8}>
            <circle cx={sx} cy={sy} r={9} fill={C.red} style={{ filter: svgGlow(C.red, 6) }} />
          </g>
        );
      })}

      {/* Golden vertical coax wiring rods linking stages */}
      {[-95, -45, 45, 95].map((dx) => (
        <line key={dx} x1={800 + dx} y1={155} x2={800 + dx * 0.65} y2={515} stroke="#d49e35" strokeWidth={4} opacity={0.75} />
      ))}

      {/* Four golden dilution-fridge plates */}
      {stages.map((st, idx) => {
        const sp = spring({ frame: Math.max(0, frame - idx * 14), fps, config: { damping: 16, stiffness: 110 } });
        return (
          <g key={st.temp} opacity={sp}>
            <rect
              x={800 - st.w / 2}
              y={st.y - 16}
              width={st.w}
              height={32}
              rx={10}
              fill="url(#goldPlate)"
              stroke="#ffe9a6"
              strokeWidth={2}
              style={{ filter: svgGlow("#ffc24d", 5) }}
            />
            {/* Temperature pill on right */}
            <line x1={800 + st.w / 2 + 12} y1={st.y} x2={1085} y2={st.y} stroke={st.col} strokeWidth={2} strokeDasharray="6 6" />
            <text x={1105} y={st.y - 2} fill={st.col} fontFamily={MONO} fontWeight={900} fontSize={26}>
              {st.temp}
            </text>
            <text x={1105} y={st.y + 24} fill={C.dim} fontFamily={INTER} fontWeight={700} fontSize={18}>
              {st.label}
            </text>
          </g>
        );
      })}

      {/* Glowing Quantum Chip suspended under bottom 15 mK mixing chamber */}
      <g transform="translate(800, 575)" style={{ filter: svgGlow(C.cyan, 10) }}>
        <rect x={-48} y={-28} width={96} height={56} rx={12} fill="#081838" stroke={C.cyan} strokeWidth={3.5} />
        <circle r={11 + 3 * Math.sin(t * 5)} fill={C.gold} />
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7C: CLOSING HERO — NOISE CURTAINS PART TO REVEAL PURE QUANTUM CHIP
// ===========================================================================
export const FinalChipTakeawayAnim: React.FC<{
  partAt: number;
}> = ({ partAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const partP = interpolate(frame, [partAt - 10, partAt + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pure glowing macroscopic wave expanding smoothly once the red noise curtain parts!
  const wavePts: string[] = [];
  for (let x = 160; x <= 1440; x += 10) {
    const env = Math.exp(-Math.pow((x - 800) / 480, 2));
    const y = 340 + Math.sin(x * 0.025 - t * 4.5) * 82 * env;
    wavePts.push(`${x === 160 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Pure sweeping quantum wave */}
      <path d={wavePts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={7} opacity={0.35 + 0.65 * partP} style={{ filter: svgGlow(C.cyan, 10) }} />

      {/* Glowing centimeter-sized silicon chip center */}
      <g transform={`translate(800, ${340 + Math.sin(t * 2.2) * 6})`} style={{ filter: svgGlow(C.gold, 12) }}>
        <rect x={-110} y={-110} width={220} height={220} rx={26} fill="#0b1734" stroke={C.gold} strokeWidth={4} />
        <line x1={-68} y1={0} x2={68} y2={0} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={-68} x2={0} y2={68} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
        <circle r={18 + 3 * Math.sin(t * 5)} fill={C.gold} />
      </g>

      {/* Red "Noise Curtain" walls sliding smoothly outward & fading away! */}
      <g opacity={1 - partP * 0.88}>
        <rect x={440 - partP * 320} y={135} width={160} height={410} rx={20} fill="rgba(64, 14, 22, 0.72)" stroke={C.red} strokeWidth={3} strokeDasharray="10 8" />
        <text x={520 - partP * 320} y={348} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} transform={`rotate(-90 ${520 - partP * 320} 348)`}>
          ENVIRONMENTAL NOISE
        </text>
        <rect x={1000 + partP * 320} y={135} width={160} height={410} rx={20} fill="rgba(64, 14, 22, 0.72)" stroke={C.red} strokeWidth={3} strokeDasharray="10 8" />
        <text x={1080 + partP * 320} y={348} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} transform={`rotate(90 ${1080 + partP * 320} 348)`}>
          ENVIRONMENTAL NOISE
        </text>
      </g>

      {/* Final poetic banner */}
      <g transform="translate(800, 600)" opacity={partP}>
        <rect x={-460} y={-44} width={920} height={88} rx={44} fill="rgba(6, 14, 34, 0.94)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={10} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={30}>
          Not a Wall of Nature — Just Noise.
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7D: CLEAN SUBSCRIBE + BELL OUTRO (WITH END-SCREEN SPACE ON RIGHT)
// ===========================================================================
export const SubscribeOutroAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enterP = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const clicked = frame >= 52;
  const clickPop = spring({ frame: Math.max(0, frame - 52), fps, config: { damping: 10, stiffness: 170 } });
  const bellSwing = clicked ? Math.sin((frame - 52) * 0.55) * Math.exp(-(frame - 52) / 38) * 24 : 0;

  return (
    <div
      style={{
        position: "relative",
        width: 1600,
        height: 720,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 90px",
      }}
    >
      {/* Left Hero Column: Glowing Chip Preview + Subscribe CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: 760,
          opacity: enterP,
          transform: `translateY(${(1 - enterP) * 24}px)`,
        }}
      >
        <div
          style={{
            width: 440,
            height: 245,
            borderRadius: 24,
            overflow: "hidden",
            border: `2.5px solid ${C.cyan}`,
            boxShadow: `${glow(C.cyan, 10)}, 0 18px 46px rgba(0,0,0,0.8)`,
            marginBottom: 36,
          }}
        >
          <Img
            src={staticFile("macrotunnel/hand-chip.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + Math.sin(t) * 0.02})` }}
          />
        </div>

        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 48, color: C.white, lineHeight: 1.15 }}>
          More Frontier Physics,
          <br />
          <span style={{ color: C.gold }}>Explained Visually.</span>
        </div>

        {/* Animated Subscribe Button + Ringing Bell */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 34 }}>
          <div
            style={{
              padding: "20px 50px",
              borderRadius: 50,
              background: clicked ? "rgba(18, 34, 62, 0.96)" : "#ff2b45",
              border: `3px solid ${clicked ? C.green : "#ff6b7d"}`,
              boxShadow: clicked ? glow(C.green, 14) : glow("#ff2b45", 16),
              transform: `scale(${clicked ? 0.95 + 0.08 * clickPop : 1 + 0.025 * Math.sin(t * 5)})`,
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 30,
              color: clicked ? C.green : "#ffffff",
              letterSpacing: 1.5,
            }}
          >
            {clicked ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
          </div>

          {/* Ringing Bell Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(12, 24, 52, 0.94)",
              border: `2.5px solid ${clicked ? C.gold : C.dim}`,
              boxShadow: clicked ? glow(C.gold, 10) : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={38} height={38} viewBox="0 0 38 38" style={{ transform: `rotate(${bellSwing}deg)` }}>
              <path
                d="M19 5 C13 5 10 9.5 10 15.5 V22 L7 26.5 H31 L28 22 V15.5 C28 9.5 25 5 19 5 Z"
                fill={clicked ? C.gold : "none"}
                stroke={clicked ? C.gold : C.white}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              <path d="M15.5 29 C16.3 31.5 21.7 31.5 22.5 29" fill="none" stroke={clicked ? C.gold : C.white} strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column: Subtle Framed End-Screen Zone for YouTube Next Video */}
      <div
        style={{
          width: 560,
          height: 360,
          borderRadius: 28,
          border: "2.5px dashed rgba(62, 224, 255, 0.35)",
          background: "rgba(6, 14, 34, 0.48)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: enterP * 0.85,
        }}
      >
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: C.cyan, letterSpacing: 3 }}>
          WATCH NEXT ↑
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 22, color: C.dim, marginTop: 10 }}>
          Next Deep Physics Breakdown
        </div>
      </div>
    </div>
  );
};
