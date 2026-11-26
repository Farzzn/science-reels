import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { ScientistPortraitCard } from "../RelativityBonds/ui";

// ===========================================================================
// CH 2 — PAGE 2A: MANY-BODY QUANTUM NIGHTMARE (EVERY PARTICLE PULLS EVERY OTHER)
// ===========================================================================
export const ManyBodyNightmareAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const pts = [
    { x: 800, y: 270, r: 34, col: C.gold, lbl: "O" },
    { x: 645, y: 415, r: 24, col: C.gold, lbl: "H" },
    { x: 955, y: 415, r: 24, col: C.gold, lbl: "H" },
    ...Array.from({ length: 7 }, (_, i) => {
      const ang = t * (1.8 + (i % 3) * 0.5) + i * 0.92;
      const radX = 185 + (i % 2) * 95;
      const radY = 120 + (i % 3) * 42;
      return {
        x: 800 + Math.cos(ang) * radX,
        y: 345 + Math.sin(ang) * radY,
        r: 12,
        col: C.cyan,
        lbl: "e⁻",
      };
    }),
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Tangled interaction lines linking nuclei & electrons simultaneously */}
      {pts.map((a, i) =>
        pts.slice(i + 1).map((b, j) => (
          <line
            key={`${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={i < 3 && i + 1 + j >= 3 ? C.cyan : C.red}
            strokeWidth={1.8}
            opacity={0.28}
          />
        ))
      )}

      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y})`}>
          <circle r={p.r} fill={i < 3 ? "#362006" : "#0a2a52"} stroke={p.col} strokeWidth={3.5} style={{ filter: svgGlow(p.col, 8) }} />
          {i < 3 && (
            <text x={0} y={8} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={p.r * 0.75}>
              {p.lbl}
            </text>
          )}
        </g>
      ))}

      <g transform="translate(800, 625)">
        <rect x={-465} y={-34} width={930} height={68} rx={34} fill="rgba(46, 10, 18, 0.94)" stroke={C.red} strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          EVERY ELECTRON &amp; NUCLEUS PUSHES &amp; PULLS AT THE SAME TIME
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 2 — PAGE 2B: MAX BORN & J. ROBERT OPPENHEIMER PORTRAITS (1927, VOICE-LOCKED!)
// ===========================================================================
export const BornOppenheimerPortraitsAnim: React.FC<{
  bornAt: number;
  oppAt: number;
}> = ({ bornAt, oppAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgeP = spring({ frame: Math.max(0, frame - oppAt), fps, config: { damping: 14, stiffness: 115 } });

  return (
    <div style={{ width: 1520, height: 690, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 95px" }}>
      <ScientistPortraitCard
        src="attowater/portraits/born.jpg"
        name="Max Born"
        subtitle="GÖTTINGEN · 1927"
        credit="Wikimedia Commons · Public Domain"
        color={C.cyan}
        width={405}
        photoHeight={415}
        objectPosition="50% 18%"
        delay={bornAt}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.25 + 0.75 * badgeP,
          transform: `scale(${0.86 + 0.14 * badgeP})`,
        }}
      >
        <div
          style={{
            padding: "20px 38px",
            borderRadius: 24,
            background: "rgba(32, 22, 4, 0.96)",
            border: `3.5px solid ${C.gold}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 42, color: C.gold }}>1927</div>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 22, color: C.white, marginTop: 6 }}>
            Born–Oppenheimer
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, color: C.cyan, letterSpacing: 1.6, marginTop: 4 }}>
            APPROXIMATION
          </div>
        </div>
      </div>

      <ScientistPortraitCard
        src="attowater/portraits/oppenheimer.jpg"
        name="J. Robert Oppenheimer"
        subtitle="GÖTTINGEN · 1927"
        credit="Los Alamos · Public Domain"
        color={C.gold}
        width={405}
        photoHeight={415}
        objectPosition="50% 16%"
        delay={oppAt}
      />
    </div>
  );
};

// ===========================================================================
// CH 2 — PAGE 2C: THE 1,836× MASS GAP (BOWLING BALL VS. WEIGHTLESS GNAT!)
// ===========================================================================
export const MassGapBowlingGnatAnim: React.FC<{
  oxygenAt: number;
}> = ({ oxygenAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const oxP = interpolate(frame, [Math.max(15, oxygenAt - 8), oxygenAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nucR = interpolate(oxP, [0, 1], [105, 148]);
  const eAng = t * 8.5;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Sluggish giant heavy nucleus drifting barely millimeters */}
      <g transform={`translate(${540 + Math.sin(t * 0.9) * 14}, 345)`}>
        <circle r={nucR} fill="rgba(255, 194, 77, 0.2)" stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 12) }} />
        <text x={0} y={-10} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={36}>
          {oxP > 0.5 ? "OXYGEN NUCLEUS" : "1 PROTON (H⁺)"}
        </text>
        <text x={0} y={38} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={34}>
          {oxP > 0.5 ? "~30,000 × MASS" : "1,836 × MASS"}
        </text>
      </g>

      {/* Zipping featherweight electron orbiting frantically on right */}
      <g transform="translate(1150, 345)">
        <ellipse cx={0} cy={0} rx={210} ry={130} fill="none" stroke={C.cyan} strokeWidth={3.5} strokeDasharray="14 10" strokeDashoffset={-t * 150} opacity={0.75} />
        <ellipse cx={0} cy={0} rx={210} ry={130} fill="none" stroke={C.cyan} strokeWidth={2.5} transform="rotate(35)" opacity={0.45} />
        <circle cx={Math.cos(eAng) * 210} cy={Math.sin(eAng) * 130} r={14} fill={C.white} stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 12) }} />
        <text x={0} y={10} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={32}>
          1 ELECTRON
        </text>
        <text x={0} y={48} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
          1 × MASS · ZIPS LIKE A GNAT
        </text>
      </g>

      <g transform="translate(800, 628)">
        <rect x={-450} y={-34} width={900} height={68} rx={34} fill="rgba(6, 16, 38, 0.94)" stroke={C.gold} strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.5}>
          SLUGGISH BOWLING BALLS VS. AGILE WEIGHTLESS GNATS
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 2 — PAGE 2D: CLEAN DIVORCE (SMOOTH ENERGY VALLEY) → CRACKS UNDER X-RAY!
// ===========================================================================
export const CleanDivorceCrackAnim: React.FC<{
  crackAt: number;
}> = ({ crackAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const crackP = interpolate(frame, [Math.max(20, crackAt - 6), crackAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ballX = 520 + Math.sin(t * 2.1) * 165;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Smooth Potential Energy Valley (Textbook Chemistry) */}
      <path d="M220,175 Q520,545 820,175" fill="none" stroke={C.cyan} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />
      <circle cx={ballX} cy={355 - Math.pow((ballX - 520) / 170, 2) * 125} r={24} fill={C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />
      <text x={520} y={510} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
        SMOOTH ENERGY VALLEY · ROOM TEMP ✓
      </text>

      {/* Right Box: Clean Divorce vs X-Ray Collision */}
      <g transform="translate(1165, 340)">
        <rect
          x={-285}
          y={-205}
          width={570}
          height={410}
          rx={28}
          fill={crackP > 0.3 ? "rgba(46, 10, 18, 0.94)" : "rgba(6, 24, 42, 0.94)"}
          stroke={crackP > 0.3 ? C.red : C.green}
          strokeWidth={3.5}
          style={{ filter: svgGlow(crackP > 0.3 ? C.red : C.green, 8) }}
        />
        <text x={0} y={-135} textAnchor="middle" fill={crackP > 0.3 ? C.red : C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
          {crackP > 0.3 ? "ENERGETIC X-RAY STRIKE!" : "BORN–OPPENHEIMER RULE"}
        </text>
        <text x={0} y={-20} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
          {crackP > 0.3 ? "Nuclei & Electrons Collide" : "1. Freeze Heavy Nuclei"}
        </text>
        <text x={0} y={42} textAnchor="middle" fill={crackP > 0.3 ? C.gold : C.cyan} fontFamily={INTER} fontWeight={900} fontSize={32}>
          {crackP > 0.3 ? "On One Razor-Thin Clock!" : "2. Solve Instant Electrons"}
        </text>
        <text x={0} y={138} textAnchor="middle" fill={crackP > 0.3 ? C.red : C.green} fontFamily={MONO} fontWeight={900} fontSize={21}>
          {crackP > 0.3 ? "SHORTCUT BREAKS DOWN ✕" : "WORKS FOR GENTLE CHEMISTRY ✓"}
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3A: X-RAY PUNCHES OXYGEN'S INNERMOST 1s CORE ELECTRON OUT!
// ===========================================================================
export const CoreHolePunchAnim: React.FC<{
  punchAt: number;
}> = ({ punchAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const punchP = interpolate(frame, [Math.max(10, punchAt - 6), punchAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eOutX = interpolate(punchP, [0, 1], [68, 490]);
  const eOutY = interpolate(punchP, [0, 1], [0, -185]);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Incoming X-Ray Bolt plunging straight past valence shell into 1s */}
      <line
        x1={230}
        y1={145}
        x2={interpolate(punchP, [0, 0.35], [230, 845], { extrapolateRight: "clamp" })}
        y2={interpolate(punchP, [0, 0.35], [145, 345], { extrapolateRight: "clamp" })}
        stroke="#b666ff"
        strokeWidth={9}
        strokeLinecap="round"
        style={{ filter: svgGlow("#b666ff", 12) }}
      />
      <text x={320} y={132} textAnchor="middle" fill="#d8a8ff" fontFamily={MONO} fontWeight={900} fontSize={22}>
        HIGH-ENERGY X-RAY PHOTON ↘
      </text>

      {/* Oxygen Shell System */}
      <g transform="translate(800, 355)">
        {/* Outer Valence Shell */}
        <circle r={215} fill="rgba(62, 224, 255, 0.08)" stroke={C.cyan} strokeWidth={4} strokeDasharray="16 10" />
        <text x={0} y={-232} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>
          OUTER VALENCE BONDING SHELL
        </text>

        {/* Innermost 1s Core Orbit */}
        <circle r={92} fill="rgba(255, 194, 77, 0.12)" stroke={C.gold} strokeWidth={4.5} />
        <text x={-160} y={125} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
          DEEPEST 1s CORE ORBIT →
        </text>

        {/* +8 Oxygen Nucleus */}
        <circle r={42} fill="#382204" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={0} y={11} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={28}>+8</text>

        {/* Remaining 1s electron on left */}
        <circle cx={-92} cy={0} r={14} fill={C.cyan} stroke={C.white} strokeWidth={2.5} />

        {/* Empty Pulsing Crimson Core Hole left behind on right of 1s! */}
        <circle
          cx={92}
          cy={0}
          r={18 + Math.sin(t * 9) * 3}
          fill="#16040a"
          stroke={C.red}
          strokeWidth={4}
          strokeDasharray="6 4"
          opacity={punchP}
          style={{ filter: svgGlow(C.red, 10) }}
        />

        {/* Knocked-out 1s Core Electron rocketing away! */}
        <circle cx={eOutX} cy={eOutY} r={15} fill={C.white} stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 10) }} />
        {punchP > 0.35 && (
          <text x={eOutX} y={eOutY - 26} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
            1s ELECTRON EJECTED ↗
          </text>
        )}
      </g>

      <g transform="translate(800, 640)">
        <rect x={-420} y={-34} width={840} height={68} rx={34} fill="rgba(46, 10, 18, 0.94)" stroke={C.red} strokeWidth={3} />
        <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.5}>
          UNSTABLE EMPTY 1s CORE HOLE RIGHT NEXT TO NUCLEUS!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3B: LISE MEITNER PORTRAIT (1922) + AUGER–MEITNER DECAY CASCADE!
// ===========================================================================
export const AugerMeitnerDecayAnim: React.FC<{
  meitnerAt: number;
  dropAt: number;
}> = ({ meitnerAt, dropAt }) => {
  const frame = useCurrentFrame();
  const dropP = interpolate(frame, [Math.max(15, dropAt - 6), dropAt + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ejectP = interpolate(frame, [Math.max(30, dropAt + 24), dropAt + 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: 1540, height: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 65px" }}>
      <ScientistPortraitCard
        src="attowater/portraits/meitner.jpg"
        name="Lise Meitner"
        subtitle="AUGER–MEITNER DECAY · 1922"
        credit="OeNB / USIS (1953) · Public Domain"
        color={C.gold}
        width={400}
        photoHeight={430}
        objectPosition="50% 18%"
        delay={meitnerAt}
      />

      <svg viewBox="0 0 920 650" style={{ width: 920, height: 650, overflow: "visible" }}>
        {/* Energy Shells Diagram: Valence -> Inner 1s Core */}
        <rect x={85} y={145} width={540} height={64} rx={16} fill="rgba(62, 224, 255, 0.16)" stroke={C.cyan} strokeWidth={3.5} />
        <text x={355} y={186} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={23}>
          OUTER VALENCE SHELL
        </text>

        <rect x={85} y={425} width={540} height={64} rx={16} fill="rgba(255, 194, 77, 0.16)" stroke={C.gold} strokeWidth={3.5} />
        <text x={355} y={466} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23}>
          DEEP 1s CORE SHELL
        </text>

        {/* Empty 1s hole target cleanly at far left of 1s shell */}
        <circle cx={136} cy={457} r={18} fill="#14040a" stroke={C.red} strokeWidth={3.5} strokeDasharray="6 4" opacity={1 - dropP * 0.7} />

        {/* Step 1: Outer electron drops cleanly down far left into 1s hole */}
        <line x1={136} y1={218} x2={136} y2={420} stroke={C.gold} strokeWidth={5} strokeDasharray="10 8" opacity={0.4 + 0.6 * dropP} />
        <circle cx={136} cy={interpolate(dropP, [0, 1], [177, 457])} r={16} fill={C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={242} y={325} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
          ← 1. DROPS IN ↓
        </text>

        {/* Step 2: Energy transferred -> Second outer electron rockets cleanly out far right! */}
        <line x1={590} y1={162} x2={825} y2={72} stroke={C.green} strokeWidth={5} strokeDasharray="12 8" opacity={ejectP} />
        <circle
          cx={interpolate(ejectP, [0, 1], [590, 845])}
          cy={interpolate(ejectP, [0, 1], [162, 64])}
          r={16}
          fill={C.green}
          stroke={C.white}
          strokeWidth={3}
          style={{ filter: svgGlow(C.green, 12) }}
        />
        <text x={780} y={162} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={20} opacity={0.3 + 0.7 * ejectP}>
          2. AUGER e⁻ EJECTED ↗
        </text>

        <g transform="translate(460, 585)">
          <rect x={-370} y={-32} width={740} height={64} rx={32} fill="rgba(8, 18, 42, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
            ALSO INDEPENDENTLY FOUND BY PIERRE AUGER (1925)
          </text>
        </g>
      </svg>
    </div>
  );
};

// ===========================================================================
// CH 3 — PAGE 3C: THE ~4.0 FEMTOSECOND OXYGEN CORE-HOLE STOPWATCH!
// ===========================================================================
export const FourFemtosecondStopwatchAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [6, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fsVal = (sweep * 4.0).toFixed(1);
  const ang = sweep * 360 - 90;
  const rad = (ang * Math.PI) / 180;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <g transform="translate(800, 330)">
        {/* Stopwatch Crown */}
        <rect x={-34} y={-246} width={68} height={32} rx={8} fill={C.gold} />
        <circle r={210} fill="rgba(7, 16, 38, 0.95)" stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 10) }} />
        <circle
          r={186}
          fill="none"
          stroke={C.gold}
          strokeWidth={14}
          strokeDasharray={`${sweep * 1168} 1168`}
          transform="rotate(-90)"
          style={{ filter: svgGlow(C.gold, 10) }}
        />

        {/* Tick marks */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1={Math.cos((deg * Math.PI) / 180) * 155}
            y1={Math.sin((deg * Math.PI) / 180) * 155}
            x2={Math.cos((deg * Math.PI) / 180) * 174}
            y2={Math.sin((deg * Math.PI) / 180) * 174}
            stroke={C.white}
            strokeWidth={4}
          />
        ))}

        {/* Sweeping hand */}
        <line x1={0} y1={0} x2={Math.cos(rad) * 140} y2={Math.sin(rad) * 140} stroke={C.red} strokeWidth={6} strokeLinecap="round" style={{ filter: svgGlow(C.red, 10) }} />
        <circle r={12} fill={C.white} />

        {/* Big digital center readout */}
        <text x={0} y={82} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={58} style={{ filter: svgGlow(C.gold, 8) }}>
          {fsVal} fs
        </text>
      </g>

      <g transform="translate(800, 628)">
        <rect x={-450} y={-34} width={900} height={68} rx={34} fill="rgba(34, 24, 4, 0.95)" stroke={C.gold} strokeWidth={3} />
        <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.5}>
          OXYGEN 1s CORE-HOLE LIFETIME · ONLY ~4 FEMTOSECONDS!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3D: THE CORE-HOLE CLOCK PRINCIPLE (INTACT VS. BROKEN SIGNATURE!)
// ===========================================================================
export const CoreHoleClockPrincipleAnim: React.FC<{
  intactAt: number;
  snappedAt: number;
}> = ({ intactAt, snappedAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftP = spring({ frame: Math.max(0, frame - intactAt), fps, config: { damping: 14, stiffness: 115 } });
  const rightP = spring({ frame: Math.max(0, frame - snappedAt), fps, config: { damping: 14, stiffness: 115 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left Card: Molecule STILL INTACT when Auger fires -> Broad smeared molecular hump */}
      <g transform={`translate(425, 360) scale(${0.92 + 0.08 * leftP})`} opacity={0.2 + 0.8 * leftP}>
        <rect x={-320} y={-235} width={640} height={470} rx={30} fill="rgba(8, 16, 38, 0.94)" stroke={C.cyan} strokeWidth={3.5} />
        <text x={0} y={-172} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          CASE 1: WATER STILL INTACT AT 4 fs
        </text>
        {/* Broad smeared molecular curve */}
        <line x1={-250} y1={85} x2={250} y2={85} stroke={C.dim} strokeWidth={3} />
        <path d="M-230,85 Q-110,-65 0,25 Q110,-45 230,85" fill="rgba(62,224,255,0.22)" stroke={C.cyan} strokeWidth={6} style={{ filter: svgGlow(C.cyan, 8) }} />
        <text x={0} y={145} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
          Broad Smeared Molecular Hump
        </text>
        <text x={0} y={185} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={19}>
          ELECTRONS BEAT THE NUCLEI
        </text>
      </g>

      {/* Right Card: Bonds ALREADY SNAPPED before 4 fs -> Razor-sharp atomic spike! */}
      <g transform={`translate(1175, 360) scale(${0.92 + 0.08 * rightP})`} opacity={0.2 + 0.8 * rightP}>
        <rect x={-320} y={-235} width={640} height={470} rx={30} fill="rgba(30, 18, 8, 0.95)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={-172} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>
          CASE 2: BONDS SNAPPED BEFORE 4 fs!
        </text>
        {/* Razor-sharp atomic peak */}
        <line x1={-250} y1={85} x2={250} y2={85} stroke={C.dim} strokeWidth={3} />
        <path d="M-230,85 L-75,85 L-55,-95 L-35,85 L45,85 L65,-65 L85,85 L230,85" fill="rgba(255,194,77,0.25)" stroke={C.gold} strokeWidth={6} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={0} y={145} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28}>
          Razor-Sharp Atomic Spikes!
        </text>
        <text x={0} y={185} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={19}>
          NUCLEI BEAT ELECTRONIC CLEANUP!
        </text>
      </g>
    </svg>
  );
};
