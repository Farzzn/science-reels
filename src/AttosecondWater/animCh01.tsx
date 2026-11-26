import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH 0 — PAGE 0A: TEXTBOOK BILLIARD-BALL WATER (ELECTRONS KEEP UP INSTANTLY)
// ===========================================================================
export const BilliardWaterAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Smooth symmetric stretch + gentle breathing of O-H bonds while electron cloud tracks effortlessly
  const stretch = Math.sin(t * 2.6) * 26;
  const h1x = 800 - 165 - stretch;
  const h1y = 430 + stretch * 0.45;
  const h2x = 800 + 165 + stretch;
  const h2y = 430 + stretch * 0.45;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <radialGradient id="awO" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="45%" stopColor={C.gold} />
          <stop offset="100%" stopColor="#8a4c00" />
        </radialGradient>
        <radialGradient id="awH" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={C.cyan} />
          <stop offset="100%" stopColor="#084582" />
        </radialGradient>
      </defs>

      {/* Smooth glowing electron cloud snugly wrapping O and both H atoms */}
      <path
        d={`M${h1x - 52},${h1y + 15} Q660,210 800,195 Q940,210 ${h2x + 52},${h2y + 15} Q${h2x + 35},${h2y + 85} ${h2x - 40},${h2y + 62} Q800,370 ${h1x + 40},${h1y + 62} Q${h1x - 35},${h1y + 85} ${h1x - 52},${h1y + 15} Z`}
        fill="rgba(62, 224, 255, 0.14)"
        stroke={C.cyan}
        strokeWidth={3.5}
        strokeDasharray="16 10"
        strokeDashoffset={-t * 50}
        style={{ filter: svgGlow(C.cyan, 8) }}
      />

      {/* O-H spring-like smooth chemical bonds */}
      <line x1={800} y1={280} x2={h1x} y2={h1y} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" opacity={0.85} />
      <line x1={800} y1={280} x2={h2x} y2={h2y} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" opacity={0.85} />

      {/* Oxygen Nucleus */}
      <g transform="translate(800, 280)" style={{ filter: svgGlow(C.gold, 10) }}>
        <circle r={66} fill="url(#awO)" stroke={C.white} strokeWidth={3.5} />
        <text x={0} y={14} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={44}>O</text>
      </g>

      {/* Two Hydrogen Nuclei */}
      <g transform={`translate(${h1x}, ${h1y})`} style={{ filter: svgGlow(C.cyan, 8) }}>
        <circle r={42} fill="url(#awH)" stroke={C.white} strokeWidth={3} />
        <text x={0} y={11} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={30}>H</text>
      </g>
      <g transform={`translate(${h2x}, ${h2y})`} style={{ filter: svgGlow(C.cyan, 8) }}>
        <circle r={42} fill="url(#awH)" stroke={C.white} strokeWidth={3} />
        <text x={0} y={11} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={30}>H</text>
      </g>

      {/* Generously wide bottom pill */}
      <g transform="translate(800, 620)">
        <rect x={-480} y={-34} width={960} height={68} rx={34} fill="rgba(6, 16, 38, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          TEXTBOOK PICTURE: ELECTRON CLOUDS GLIDE &amp; ADJUST INSTANTLY
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 0 — PAGE 0B: NOV 2026 PRL SHOCK — BOTH O–H BONDS SNAP IN < 4 FS!
// ===========================================================================
export const FourFsRaceColdOpenAnim: React.FC<{
  hitAt: number;
  ripAt: number;
}> = ({ hitAt, ripAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hitP = interpolate(frame, [Math.max(6, hitAt - 8), hitAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripP = interpolate(frame, [Math.max(18, ripAt - 6), ripAt + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Electronic Auger cleanup clock ticks more slowly than the two exploding hydrogens!
  const fsClock = interpolate(frame, [Math.max(8, hitAt), Math.max(40, ripAt + 85)], [0, 3.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const augerPct = Math.min(92, Math.round((fsClock / 4.0) * 100));

  const h1x = 640 - ripP * 290;
  const h1y = 455 + ripP * 68;
  const h2x = 960 + ripP * 290;
  const h2y = 455 + ripP * 68;
  const snapPop = spring({ frame: Math.max(0, frame - ripAt - 6), fps, config: { damping: 12, stiffness: 135 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Top 4-fs Electronic Cleanup Progress Bar */}
      <g transform="translate(800, 88)">
        <rect x={-420} y={-36} width={840} height={72} rx={20} fill="rgba(8, 16, 38, 0.94)" stroke={C.gold} strokeWidth={2.5} />
        <text x={-390} y={-6} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={18}>
          OXYGEN ELECTRONIC CLEANUP (4.0 fs CLOCK)
        </text>
        <text x={390} y={-6} textAnchor="end" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>
          {fsClock.toFixed(1)} fs · {augerPct}%
        </text>
        <rect x={-390} y={8} width={780} height={16} rx={8} fill="rgba(127,147,196,0.22)" />
        <rect x={-390} y={8} width={780 * (augerPct / 100)} height={16} rx={8} fill={C.gold} style={{ filter: svgGlow(C.gold, 6) }} />
      </g>

      {/* Incoming High-Energy X-Ray Beam striking Oxygen's core */}
      {hitP > 0.05 && (
        <g opacity={hitP}>
          <line
            x1={1265}
            y1={178}
            x2={interpolate(hitP, [0, 1], [1265, 830])}
            y2={interpolate(hitP, [0, 1], [178, 325])}
            stroke="#b666ff"
            strokeWidth={9}
            strokeLinecap="round"
            style={{ filter: svgGlow("#b666ff", 12) }}
          />
          <text x={1275} y={168} textAnchor="middle" fill="#d8a8ff" fontFamily={MONO} fontWeight={900} fontSize={21}>
            HIGH-ENERGY X-RAY ↙
          </text>
        </g>
      )}

      {/* Shattering Bond Lines */}
      <line
        x1={800}
        y1={335}
        x2={h1x}
        y2={h1y}
        stroke={ripP > 0.2 ? C.red : C.cyan}
        strokeWidth={10}
        strokeDasharray={ripP > 0.15 ? "14 14" : undefined}
        opacity={1 - ripP * 0.72}
      />
      <line
        x1={800}
        y1={335}
        x2={h2x}
        y2={h2y}
        stroke={ripP > 0.2 ? C.red : C.cyan}
        strokeWidth={10}
        strokeDasharray={ripP > 0.15 ? "14 14" : undefined}
        opacity={1 - ripP * 0.72}
      />

      {/* Core-Ionized Oxygen Atom with pulsing inner core hole */}
      <g transform="translate(800, 335)">
        <circle r={68} fill="#382204" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 12) }} />
        <circle r={24} fill="#14040a" stroke={C.red} strokeWidth={3.5} strokeDasharray="6 4" opacity={hitP} />
        <text x={0} y={10} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>O</text>
      </g>

      {/* Flying Left & Right Hydrogens */}
      <g transform={`translate(${h1x}, ${h1y})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle r={42} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>H</text>
      </g>
      <g transform={`translate(${h2x}, ${h2y})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle r={42} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>H</text>
      </g>

      {/* Bottom Verdict Pill — generous width */}
      <g transform={`translate(800, 628) scale(${0.86 + 0.14 * snapPop})`} opacity={0.25 + 0.75 * snapPop}>
        <rect x={-525} y={-34} width={1050} height={68} rx={34} fill="rgba(48, 10, 18, 0.95)" stroke={C.red} strokeWidth={3} style={{ filter: svgGlow(C.red, 8) }} />
        <text x={0} y={8} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          BOTH O–H BONDS SNAPPED IN &lt; 4 fs — BEFORE ELECTRONS FINISHED!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 0 — PAGE 0C: 100-YEAR ASSUMPTION CRACKS UNDER ATTOSECOND X-RAY STROBES
// ===========================================================================
export const CenturyAssumptionCrackAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const crackP = interpolate(frame, [20, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strobeX = ((t * 280) % 520) - 260;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left Card: 100-Year Textbook Assumption Cracking */}
      <g transform="translate(425, 355)">
        <rect x={-300} y={-215} width={600} height={430} rx={28} fill="rgba(26, 12, 18, 0.92)" stroke={C.red} strokeWidth={3.5} style={{ filter: svgGlow(C.red, 8) }} />
        <text x={0} y={-152} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          1927 TEXTBOOK ASSUMPTION
        </text>
        <text x={0} y={-32} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>
          Slow Heavy Nuclei
        </text>
        <line x1={-210} y1={14} x2={210} y2={14} stroke={C.dim} strokeWidth={3} strokeDasharray="10 8" />
        <text x={0} y={76} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={36}>
          Instant Electron Cloud
        </text>
        {/* Jagged crack slicing right down the center */}
        <polyline
          points="-18,-195 22,-95 -28,-10 34,75 -16,185"
          fill="none"
          stroke={C.red}
          strokeWidth={5.5}
          opacity={crackP}
          style={{ filter: svgGlow(C.red, 12) }}
        />
        <text x={0} y={165} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={21}>
          THE CLEAN DIVIDE CRACKS
        </text>
      </g>

      {/* Center Arrow */}
      <line x1={745} y1={355} x2={845} y2={355} stroke={C.gold} strokeWidth={6} />
      <polygon points="862,355 832,338 832,372" fill={C.gold} />

      {/* Right Card: Ultrafast Attosecond X-Ray Strobe Camera */}
      <g transform="translate(1180, 355)">
        <rect x={-300} y={-215} width={600} height={430} rx={28} fill="rgba(6, 18, 42, 0.94)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 10) }} />
        <text x={0} y={-152} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          ULTRAFAST X-RAY STROBE
        </text>
        {/* Flashing attosecond laser pulse train */}
        {[-180, -60, 60, 180].map((px, i) => {
          const h = 75 + 40 * Math.max(0, Math.cos((px - strobeX) * 0.035));
          return (
            <path
              key={i}
              d={`M${px - 36},30 Q${px},${30 - h} ${px + 36},30`}
              fill="none"
              stroke={i % 2 === 0 ? C.cyan : C.gold}
              strokeWidth={6}
              style={{ filter: svgGlow(i % 2 === 0 ? C.cyan : C.gold, 8) }}
            />
          );
        })}
        <text x={0} y={115} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={38}>
          10⁻¹⁸ SECONDS
        </text>
        <text x={0} y={162} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
          First Quintillionth of a Second
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1A: SPLIT-TIMESCALE CLOCK ZOOM (1 s → ms → ns → ps → fs → as!)
// ===========================================================================
export const TimescaleClockZoomAnim: React.FC<{
  msAt: number;
  nsAt: number;
  psAt: number;
  fsAt: number;
  asAt: number;
}> = ({ msAt, nsAt, psAt, fsAt, asAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const stops = [
    { label: "1 s", exp: "10⁰ s", name: "SECOND", desc: "One Human Heartbeat", col: C.white, at: 0 },
    { label: "1 ms", exp: "10⁻³ s", name: "MILLISECOND", desc: "Camera Shutter Blink", col: "#9cc8ff", at: msAt },
    { label: "1 ns", exp: "10⁻⁹ s", name: "NANOSECOND", desc: "Light Crosses 1 Foot (30 cm)", col: C.cyan, at: nsAt },
    { label: "1 ps", exp: "10⁻¹² s", name: "PICOSECOND", desc: "Water Molecules Tumble", col: C.green, at: psAt },
    { label: "1 fs", exp: "10⁻¹⁵ s", name: "FEMTOSECOND", desc: "Atoms Vibrate & Bonds Snap", col: C.gold, at: fsAt },
    { label: "1 as", exp: "10⁻¹⁸ s", name: "ATTOSECOND", desc: "Electrons Race Inside Atoms!", col: C.red, at: asAt },
  ];

  let activeIdx = 0;
  for (let i = 0; i < stops.length; i++) {
    if (frame >= stops[i].at - 6) activeIdx = i;
  }
  const cur = stops[activeIdx];
  const cursorX = interpolate(activeIdx, [0, 5], [190, 1410]);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Top Interactive Powers-of-10 Ruler */}
      <line x1={190} y1={115} x2={1410} y2={115} stroke="rgba(127,147,196,0.35)" strokeWidth={6} strokeLinecap="round" />
      <line x1={190} y1={115} x2={cursorX} y2={115} stroke={cur.col} strokeWidth={7} strokeLinecap="round" style={{ filter: svgGlow(cur.col, 8) }} />

      {stops.map((st, idx) => {
        const x = 190 + idx * 244;
        const isAct = idx === activeIdx;
        const isPast = idx <= activeIdx;
        return (
          <g key={st.label} transform={`translate(${x}, 115)`}>
            <circle
              r={isAct ? 20 : 12}
              fill={isPast ? st.col : "#0c1836"}
              stroke={st.col}
              strokeWidth={3.5}
              style={isAct ? { filter: svgGlow(st.col, 10) } : undefined}
            />
            <text x={0} y={-34} textAnchor="middle" fill={isAct ? st.col : C.dim} fontFamily={MONO} fontWeight={900} fontSize={isAct ? 26 : 20}>
              {st.exp}
            </text>
            <text x={0} y={48} textAnchor="middle" fill={isAct ? C.white : C.dim} fontFamily={MONO} fontWeight={800} fontSize={18}>
              {st.label}
            </text>
          </g>
        );
      })}

      {/* Giant Active Scale Showcase Viewport */}
      <g transform="translate(800, 445)">
        <rect x={-560} y={-205} width={1120} height={410} rx={32} fill="rgba(7, 15, 36, 0.94)" stroke={cur.col} strokeWidth={3.5} style={{ filter: svgGlow(cur.col, 8) }} />

        {/* Left half: Big Digital Readout */}
        <g transform="translate(-265, 0)">
          <text x={0} y={-78} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2.5}>
            CURRENT TIMESCALE
          </text>
          <text x={0} y={14} textAnchor="middle" fill={cur.col} fontFamily={MONO} fontWeight={900} fontSize={88} style={{ filter: svgGlow(cur.col, 8) }}>
            {cur.exp}
          </text>
          <text x={0} y={76} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>
            {cur.name}
          </text>
          <text x={0} y={124} textAnchor="middle" fill={cur.col} fontFamily={INTER} fontWeight={800} fontSize={24}>
            {cur.desc}
          </text>
        </g>

        <line x1={30} y1={-155} x2={30} y2={155} stroke="rgba(127,147,196,0.28)" strokeWidth={2.5} />

        {/* Right half: Live Bespoke Motion Graphic for EACH Scale! */}
        <g transform="translate(290, 0)">
          {activeIdx === 0 && (
            /* 1s Heartbeat ECG trace */
            <path
              d={`M-200,10 L-110,10 L-85,-35 L-55,75 L-25,${-105 - Math.sin(t * 7) * 18} L10,55 L40,10 L200,10`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={7}
              strokeLinejoin="round"
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
          )}
          {activeIdx === 1 && (
            /* 1ms Camera Shutter Aperture Blades */
            <g transform={`rotate(${t * 35})`}>
              <circle r={108} fill="rgba(156,200,255,0.12)" stroke="#9cc8ff" strokeWidth={5} />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <line key={deg} x1={0} y1={0} x2={Math.cos((deg * Math.PI) / 180) * 102} y2={Math.sin((deg * Math.PI) / 180) * 102} stroke="#9cc8ff" strokeWidth={4} />
              ))}
              <circle r={34 + Math.sin(t * 8) * 14} fill="#040814" stroke={C.white} strokeWidth={4} />
            </g>
          )}
          {activeIdx === 2 && (
            /* 1ns Photon racing across a 1-foot ruler */
            <g>
              <line x1={-185} y1={48} x2={185} y2={48} stroke={C.dim} strokeWidth={5} />
              <line x1={-185} y1={32} x2={-185} y2={64} stroke={C.dim} strokeWidth={4} />
              <line x1={185} y1={32} x2={185} y2={64} stroke={C.dim} strokeWidth={4} />
              <text x={0} y={96} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={22}>1 FOOT (30 cm)</text>
              <circle cx={interpolate((t * 0.9) % 1, [0, 1], [-175, 175])} cy={-16} r={18} fill={C.gold} stroke={C.white} strokeWidth={3} style={{ filter: svgGlow(C.gold, 12) }} />
            </g>
          )}
          {activeIdx === 3 && (
            /* 1ps Tumbling Water Molecules */
            <g>
              {[-85, 85].map((ox, k) => (
                <g key={k} transform={`translate(${ox}, ${k === 0 ? -24 : 26}) rotate(${t * (k === 0 ? 75 : -65)})`}>
                  <line x1={0} y1={0} x2={-36} y2={28} stroke={C.green} strokeWidth={6} />
                  <line x1={0} y1={0} x2={36} y2={28} stroke={C.green} strokeWidth={6} />
                  <circle r={22} fill={C.gold} />
                  <circle cx={-36} cy={28} r={13} fill={C.cyan} />
                  <circle cx={36} cy={28} r={13} fill={C.cyan} />
                </g>
              ))}
            </g>
          )}
          {activeIdx === 4 && (
            /* 1fs Rapidly vibrating & snapping O-H bond */
            <g>
              <line x1={0} y1={-32} x2={-90 - Math.sin(t * 14) * 32} y2={58} stroke={C.gold} strokeWidth={9} />
              <line x1={0} y1={-32} x2={90 + Math.sin(t * 14) * 32} y2={58} stroke={C.gold} strokeWidth={9} />
              <circle cx={0} cy={-32} r={34} fill="#382204" stroke={C.gold} strokeWidth={4} />
              <circle cx={-90 - Math.sin(t * 14) * 32} cy={58} r={22} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
              <circle cx={90 + Math.sin(t * 14) * 32} cy={58} r={22} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
            </g>
          )}
          {activeIdx === 5 && (
            /* 1as Blazing Electron Whipping Around Atomic Core */
            <g>
              <circle r={105} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={-t * 220} style={{ filter: svgGlow(C.red, 10) }} />
              <circle r={34} fill="rgba(255,194,77,0.3)" stroke={C.gold} strokeWidth={4} />
              <circle cx={Math.cos(t * 11) * 105} cy={Math.sin(t * 11) * 105} r={16} fill={C.white} stroke={C.red} strokeWidth={4} style={{ filter: svgGlow(C.red, 12) }} />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1B: 1 SECOND (10¹⁸ ATTOSECONDS) > 2× AGE OF THE UNIVERSE!
// ===========================================================================
export const AttosecondVsUniverseAnim: React.FC<{
  oneSecAt: number;
  ratioAt: number;
}> = ({ oneSecAt, ratioAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const univP = interpolate(frame, [10, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secP = interpolate(frame, [Math.max(20, oneSecAt - 6), oneSecAt + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ratioPop = spring({ frame: Math.max(0, frame - ratioAt), fps, config: { damping: 12, stiffness: 130 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <line x1={260} y1={525} x2={1340} y2={525} stroke={C.dim} strokeWidth={3.5} />

      {/* Left Bar: Entire 13.8-Billion-Year History of the Universe in Seconds (4.35 x 10^17) */}
      <g transform="translate(540, 525)">
        <rect x={-160} y={-165 * univP} width={320} height={Math.max(6, 165 * univP)} rx={18} fill="rgba(62, 224, 255, 0.35)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 8) }} />
        <text x={0} y={-165 * univP - 24} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={32} opacity={univP}>
          4.35 × 10¹⁷ s
        </text>
        <text x={0} y={42} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
          Age of the Universe
        </text>
        <text x={0} y={76} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20}>
          13.8 BILLION YEARS IN SECONDS
        </text>
      </g>

      {/* Right Bar: ONE SINGLE SECOND IN ATTOSECONDS (1.0 x 10^18 — 2.3x TALLER!) */}
      <g transform="translate(1060, 525)">
        <rect x={-160} y={-380 * secP} width={320} height={Math.max(6, 380 * secP)} rx={18} fill={C.gold} opacity={0.92} style={{ filter: svgGlow(C.gold, 14) }} />
        <text x={0} y={-380 * secP - 24} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={36} opacity={secP}>
          1.00 × 10¹⁸ as
        </text>
        <text x={0} y={42} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28}>
          One Single Second
        </text>
        <text x={0} y={76} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={20}>
          OVER 2× AS MANY ATTOSECONDS!
        </text>
      </g>

      {/* Mind-Bending Ratio Pill below */}
      <g transform={`translate(800, 658) scale(${0.86 + 0.14 * ratioPop})`} opacity={ratioPop}>
        <rect x={-520} y={-34} width={1040} height={68} rx={34} fill="rgba(34, 24, 4, 0.96)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.4}>
          1 ATTOSECOND : 1 SECOND  ≈  1 SECOND : 31.7 BILLION YEARS!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1C: TWO ULTRAFAST CLOCKS RECAP (BRIDGE FOR NATURAL LIKE TOAST!)
// ===========================================================================
export const TwoClocksLikeBridgeAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p1 = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const p2 = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 110 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <g transform={`translate(445, 315) scale(${0.9 + 0.1 * p1})`} opacity={p1}>
        <rect x={-310} y={-215} width={620} height={430} rx={30} fill="rgba(8, 16, 38, 0.94)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 8) }} />
        <text x={0} y={-140} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2}>
          FEMTOSECOND CLOCK · 10⁻¹⁵ s
        </text>
        {/* Vibrating water bond */}
        <line x1={0} y1={-25} x2={-85 - Math.sin(t * 8) * 18} y2={58} stroke={C.cyan} strokeWidth={9} />
        <line x1={0} y1={-25} x2={85 + Math.sin(t * 8) * 18} y2={58} stroke={C.cyan} strokeWidth={9} />
        <circle cx={0} cy={-25} r={32} fill="#382204" stroke={C.gold} strokeWidth={4} />
        <circle cx={-85 - Math.sin(t * 8) * 18} cy={58} r={20} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
        <circle cx={85 + Math.sin(t * 8) * 18} cy={58} r={20} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
        <text x={0} y={145} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Atoms &amp; Bonds Move
        </text>
      </g>

      <g transform={`translate(1155, 315) scale(${0.9 + 0.1 * p2})`} opacity={p2}>
        <rect x={-310} y={-215} width={620} height={430} rx={30} fill="rgba(26, 18, 6, 0.94)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={0} y={-140} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2}>
          ATTOSECOND CLOCK · 10⁻¹⁸ s
        </text>
        <circle cx={0} cy={14} r={78} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="18 10" strokeDashoffset={-t * 170} />
        <circle cx={0} cy={14} r={26} fill="rgba(255,194,77,0.3)" stroke={C.gold} strokeWidth={3.5} />
        <circle cx={Math.cos(t * 9) * 78} cy={14 + Math.sin(t * 9) * 78} r={14} fill={C.white} stroke={C.gold} strokeWidth={3.5} />
        <text x={0} y={145} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Electrons Race Inside Atoms
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1D: MOTION-BLUR SHUTTER → 2023 NOBEL → 300-AS EUROPEAN XFEL!
// ===========================================================================
export const HummingbirdShutterXFELAnim: React.FC<{
  nobelAt: number;
  xfelAt: number;
}> = ({ nobelAt, xfelAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const nobelP = spring({ frame: Math.max(0, frame - nobelAt), fps, config: { damping: 13, stiffness: 120 } });
  const xfelP = spring({ frame: Math.max(0, frame - xfelAt), fps, config: { damping: 13, stiffness: 120 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left: Slow Shutter = Muddy Electron Blur */}
      <g transform="translate(420, 295)">
        <rect x={-295} y={-185} width={590} height={370} rx={28} fill="rgba(8, 16, 38, 0.9)" stroke={C.dim} strokeWidth={3} />
        <text x={0} y={-130} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={21}>
          OLD SLOW SHUTTER · BLURRED
        </text>
        {/* Multiple overlapping blurry ghost electron rings */}
        {[-16, -8, 0, 8, 16].map((d, i) => (
          <ellipse key={i} cx={d * 1.4} cy={10} rx={115} ry={60} fill="none" stroke={C.cyan} strokeWidth={12} opacity={0.14} transform={`rotate(${d * 1.2 + t * 18})`} />
        ))}
        <circle cx={0} cy={10} r={24} fill={C.dim} />
        <text x={0} y={138} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={800} fontSize={24}>
          Electrons Smear Into a Cloud
        </text>
      </g>

      {/* Right: Attosecond X-Ray Strobe = Razor-Sharp Frozen Electron */}
      <g transform="translate(1180, 295)">
        <rect x={-295} y={-185} width={590} height={370} rx={28} fill="rgba(6, 22, 46, 0.95)" stroke={xfelP > 0.3 ? C.gold : C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(xfelP > 0.3 ? C.gold : C.cyan, 10) }} />
        <text x={0} y={-130} textAnchor="middle" fill={xfelP > 0.3 ? C.gold : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          {xfelP > 0.3 ? "OCT 2026 · EUROPEAN XFEL RECORD" : "ATTOSECOND STROBE · FROZEN SHARP"}
        </text>
        <ellipse cx={0} cy={10} rx={115} ry={60} fill="none" stroke={C.cyan} strokeWidth={3.5} strokeDasharray="10 8" />
        <circle cx={0} cy={10} r={24} fill={C.gold} />
        {/* Razor-sharp strobe-frozen electron snapshot */}
        <circle cx={115 * Math.cos(Math.floor(t * 4) * 0.9)} cy={10 + 60 * Math.sin(Math.floor(t * 4) * 0.9)} r={15} fill={C.white} stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 12) }} />
        <text x={0} y={138} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={25}>
          {xfelP > 0.3 ? "300-Attosecond Hard X-Ray Flashes!" : "Sharp Frame-by-Frame Electron Motion"}
        </text>
      </g>

      {/* Bottom Milestone Ribbon (2023 Nobel -> Oct 2026 300-as European XFEL) */}
      <g transform="translate(800, 610)">
        <g transform={`translate(-360, 0) scale(${0.86 + 0.14 * nobelP})`} opacity={nobelP}>
          <rect x={-325} y={-38} width={650} height={76} rx={38} fill="rgba(8, 22, 48, 0.94)" stroke={C.cyan} strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
            2023 NOBEL PRIZE · ATTOSECOND LIGHT FLASHES
          </text>
        </g>
        <g transform={`translate(360, 0) scale(${0.86 + 0.14 * xfelP})`} opacity={xfelP}>
          <rect x={-335} y={-38} width={670} height={76} rx={38} fill="rgba(36, 24, 4, 0.96)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
          <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>
            OCT 2026 OPTICA · 300-ATTOSECOND HARD X-RAYS!
          </text>
        </g>
      </g>
    </svg>
  );
};
