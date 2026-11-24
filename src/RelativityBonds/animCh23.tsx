import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { PhotoPlate, ScientistPortraitCard } from "./ui";

// ===========================================================================
// CH 2 — PAGE 2A: PHOTOREALISTIC GOLD TURNING SILVER WHEN RELATIVITY SWITCHES OFF!
// ===========================================================================
export const GoldWithoutRelativityAnim: React.FC<{
  switchOffAt: number;
}> = ({ switchOffAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Live animation: starts warm golden, then smoothly drains color into cold mirror SILVER right when "switch relativity off" is spoken!
  const offP = interpolate(frame, [Math.max(10, switchOffAt - 6), switchOffAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sat = interpolate(offP, [0, 1], [1.05, 0.02]);
  const bright = interpolate(offP, [0, 1], [1.0, 1.18]);
  const contrast = interpolate(offP, [0, 1], [1.02, 1.08]);
  const knobX = interpolate(offP, [0, 1], [48, -48]);
  const badgeP = spring({ frame: Math.max(0, frame - switchOffAt - 12), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <PhotoPlate
      src="relbonds/gold-bar.jpg"
      borderColor={offP > 0.5 ? "#cbd5e1" : C.gold}
      filterCss={`saturate(${sat.toFixed(2)}) brightness(${bright.toFixed(2)}) contrast(${contrast.toFixed(2)})`}
    >
      {/* Sleek Live Relativity Toggle Switch top-right */}
      <div
        style={{
          position: "absolute",
          top: 38,
          right: 44,
          padding: "16px 30px",
          borderRadius: 24,
          background: "rgba(6, 12, 30, 0.92)",
          border: `2.5px solid ${offP > 0.5 ? C.red : C.gold}`,
          boxShadow: glow(offP > 0.5 ? C.red : C.gold, 10),
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 16, color: C.dim, letterSpacing: 2 }}>
            EINSTEIN RELATIVITY
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 28, color: offP > 0.5 ? C.red : C.gold, marginTop: 2 }}>
            {offP > 0.5 ? "SWITCHED OFF" : "ON (REALITY)"}
          </div>
        </div>
        <svg width={128} height={58} viewBox="-64 -29 128 58">
          <rect x={-60} y={-26} width={120} height={52} rx={26} fill={offP > 0.5 ? "#331119" : "#382806"} stroke={offP > 0.5 ? C.red : C.gold} strokeWidth={3} />
          <circle cx={knobX * 0.72} cy={0} r={19} fill={offP > 0.5 ? "#e2e8f0" : C.gold} />
        </svg>
      </div>

      {/* Verdict banner bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: badgeP,
          transform: `translateY(${(1 - badgeP) * 20}px)`,
        }}
      >
        <div
          style={{
            padding: "15px 40px",
            borderRadius: 40,
            background: "rgba(6, 12, 30, 0.92)",
            border: "2.5px solid #cbd5e1",
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 26,
            color: "#e2e8f0",
            letterSpacing: 2,
          }}
        >
          GOLD WITHOUT RELATIVITY → COLD MIRROR SILVER!
        </div>
      </div>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 2 — PAGE 2B: WHY GOLD SWALLOWS BLUE LIGHT & REFLECTS GOLDEN YELLOW!
// ===========================================================================
export const GoldBlueAbsorptionAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Gap pinches smoothly from wide (3.5 eV UV) -> 2.4 eV (Blue light!)
  const pinch = interpolate(frame, [10, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topY = interpolate(pinch, [0, 1], [155, 235]);
  const botY = interpolate(pinch, [0, 1], [505, 420]);

  // Incoming blue light gets absorbed; warm yellow/gold light reflects cleanly off gold!
  const rayProgress = (t * 0.65) % 1;

  return (
    <div style={{ width: 1540, height: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 45px" }}>
      {/* Left: Clean Orbital Gap Pinch Diagram */}
      <svg viewBox="0 0 820 680" style={{ width: 820, height: 680, overflow: "visible" }}>
        {/* 6s contracted band (drops down) */}
        <rect x={110} y={topY - 26} width={580} height={52} rx={14} fill="rgba(62, 224, 255, 0.22)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 6) }} />
        <text x={400} y={topY + 9} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24}>
          CONTRACTED 6s ORBITAL ↓
        </text>

        {/* 5d expanded band (rises up) */}
        <rect x={110} y={botY - 26} width={580} height={52} rx={14} fill="rgba(255, 194, 77, 0.22)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 6) }} />
        <text x={400} y={botY + 9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
          EXPANDED 5d ORBITAL ↑
        </text>

        {/* Blue photon absorbed cleanly across the pinched 2.4 eV gap! */}
        <line x1={380} y1={botY - 34} x2={380} y2={topY + 34} stroke="#4d8bff" strokeWidth={6} strokeDasharray="10 8" style={{ filter: svgGlow("#4d8bff", 10) }} />
        <polygon points={`380,${topY + 28} 366,${topY + 52} 394,${topY + 52}`} fill="#4d8bff" />
        <rect x={412} y={(topY + botY) / 2 - 30} width={388} height={60} rx={16} fill="rgba(12, 24, 64, 0.96)" stroke="#4d8bff" strokeWidth={2.5} />
        <text x={606} y={(topY + botY) / 2 + 8} textAnchor="middle" fill="#7cb0ff" fontFamily={MONO} fontWeight={900} fontSize={21}>
          EATS BLUE LIGHT (2.4 eV)
        </text>

        {/* Incoming white/blue vs reflected gold light visual below */}
        <g transform="translate(0, 560)">
          <line x1={120} y1={0} x2={340} y2={0} stroke="#4d8bff" strokeWidth={7} strokeLinecap="round" strokeDasharray="18 12" strokeDashoffset={-rayProgress * 120} />
          <text x={230} y={42} textAnchor="middle" fill="#7cb0ff" fontFamily={MONO} fontWeight={800} fontSize={20}>BLUE ABSORBED ✕</text>

          <line x1={440} y1={0} x2={700} y2={0} stroke={C.gold} strokeWidth={8} strokeLinecap="round" strokeDasharray="22 10" strokeDashoffset={-rayProgress * 140} style={{ filter: svgGlow(C.gold, 10) }} />
          <text x={570} y={42} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>YELLOW + RED REFLECTED →</text>
        </g>
      </svg>

      {/* Right: Real Gold Ingot snapping back to gleaming 24K Gold! */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 600,
            height: 440,
            borderRadius: 28,
            overflow: "hidden",
            border: `3.5px solid ${C.gold}`,
            boxShadow: `${glow(C.gold, 16)}, 0 22px 60px rgba(0,0,0,0.88)`,
          }}
        >
          <Img
            src={staticFile("relbonds/gold-bar.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `saturate(${interpolate(pinch, [0, 1], [0.05, 1.15]).toFixed(2)}) brightness(${interpolate(pinch, [0, 1], [1.15, 1.02]).toFixed(2)})`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 26,
            padding: "12px 34px",
            borderRadius: 36,
            background: "rgba(32, 22, 4, 0.94)",
            border: `2.5px solid ${C.gold}`,
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 24,
            color: C.gold,
            letterSpacing: 2,
          }}
        >
          RELATIVITY ON → PURE GOLD!
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// CH 2 — PAGE 2C: MERCURY (Z = 80) — WHY IT STAYS LIQUID AT ROOM TEMPERATURE!
// ===========================================================================
export const LiquidMercuryRelativityAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Two Hg atoms with tightly clamped 6s2 shells gently bouncing off each other instead of locking solid!
  const bounce = Math.abs(Math.sin(t * 2.5)) * 42;

  return (
    <PhotoPlate src="relbonds/liquid-mercury.jpg" borderColor={C.cyan}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Element + Melting point badge top-left */}
        <g transform="translate(185, 120)">
          <rect x={-135} y={-72} width={270} height={144} rx={22} fill="rgba(6, 14, 34, 0.92)" stroke={C.cyan} strokeWidth={3} style={{ filter: svgGlow(C.cyan, 8) }} />
          <text x={0} y={-22} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>MERCURY · Z = 80</text>
          <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={40}>-39 °C</text>
          <text x={0} y={54} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={16}>MELTING POINT</text>
        </g>

        {/* Two tightly clamped Hg atoms bouncing gently apart top-right */}
        <g transform="translate(1210, 145)">
          <rect x={-215} y={-95} width={430} height={190} rx={24} fill="rgba(6, 14, 34, 0.9)" stroke={C.gold} strokeWidth={2.5} />
          <g transform={`translate(${-74 - bounce * 0.65}, -12)`}>
            <circle r={42} fill="rgba(62, 224, 255, 0.24)" stroke={C.cyan} strokeWidth={4} />
            <text x={0} y={8} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={22}>Hg</text>
          </g>
          <g transform={`translate(${74 + bounce * 0.65}, -12)`}>
            <circle r={42} fill="rgba(62, 224, 255, 0.24)" stroke={C.cyan} strokeWidth={4} />
            <text x={0} y={8} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={22}>Hg</text>
          </g>
          <text x={0} y={70} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={18}>
            TIGHT 6s² SHELL → WEAK BONDS
          </text>
        </g>

        {/* Bottom crisp label */}
        <g transform="translate(740, 650)">
          <rect x={-465} y={-32} width={930} height={64} rx={32} fill="rgba(6, 14, 34, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={1.8}>
            LIQUID METAL AT ROOM TEMPERATURE — THANKS TO EINSTEIN
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 2 — PAGE 2D: PEKKA PYYKKÖ PORTRAIT + 80% RELATIVISTIC CAR BATTERY (2011)
// ===========================================================================
export const LeadCarBatteryAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barP = interpolate(frame, [20, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampP = spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div style={{ width: 1540, height: 700, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 65px" }}>
      <ScientistPortraitCard
        src="relbonds/portraits/pyykko.jpg"
        name="Pekka Pyykkö"
        subtitle="UNIV. OF HELSINKI · 2011"
        credit="Photo: Wikimedia Commons (CC BY 4.0)"
        color={C.cyan}
        width={385}
        photoHeight={420}
        objectPosition="52% 24%"
      />

      {/* Clean Lead-Acid Battery Cell Voltage Split (PRL 2011) */}
      <svg viewBox="0 0 920 640" style={{ width: 920, height: 640, overflow: "visible" }}>
        {/* Car Battery Silhouette Frame */}
        <rect x={110} y={135} width={700} height={315} rx={28} fill="rgba(8, 16, 38, 0.92)" stroke={C.gold} strokeWidth={4} />
        {/* Battery Terminals */}
        <rect x={210} y={96} width={78} height={39} rx={8} fill={C.dim} />
        <rect x={630} y={96} width={78} height={39} rx={8} fill={C.red} />
        <text x={249} y={124} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={26}>−</text>
        <text x={669} y={124} textAnchor="middle" fill="#ffffff" fontFamily={MONO} fontWeight={900} fontSize={26}>+</text>

        <text x={460} y={195} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>
          Lead-Acid Car Battery Cell (Pb · Z = 82)
        </text>

        {/* Stacked Voltage Bar: 0.4 V Classical (20%) + 1.7 V Relativistic (80%) */}
        <rect x={165} y={240} width={590} height={115} rx={18} fill="#060c1e" stroke="rgba(127,147,196,0.35)" strokeWidth={2.5} />

        {/* Classical 20% slice */}
        <rect x={171} y={246} width={118 * barP} height={103} rx={14} fill="rgba(127, 147, 196, 0.45)" />
        <text x={230} y={306} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={22} opacity={barP}>
          0.4 V
        </text>

        {/* Massive Relativistic 80% slice */}
        <rect
          x={295}
          y={246}
          width={454 * barP}
          height={103}
          rx={14}
          fill={C.gold}
          style={{ filter: svgGlow(C.gold, 10) }}
        />
        <text x={522} y={295} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={34} opacity={barP}>
          ~1.7 V (80%)
        </text>
        <text x={522} y={330} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={20} opacity={barP}>
          FROM EINSTEIN'S RELATIVITY!
        </text>

        <text x={222} y={396} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={17}>
          CLASSICAL
        </text>
        <text x={552} y={396} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={18}>
          RELATIVISTIC BOOST (~2.1 V TOTAL)
        </text>

        {/* Bottom punchline */}
        <g transform={`translate(460, 540) scale(${0.85 + 0.15 * stampP})`} opacity={stampP}>
          <rect x={-390} y={-38} width={780} height={76} rx={38} fill="rgba(34, 24, 4, 0.95)" stroke={C.gold} strokeWidth={3} />
          <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.4}>
            WITHOUT RELATIVITY, YOUR CAR WON'T START!
          </text>
        </g>
      </svg>
    </div>
  );
};

// ===========================================================================
// CH 2 — PAGE 2E: EVERYDAY RELATIVITY RECAP (BRIDGE FOR MIND-BLOWN LIKE TOAST!)
// ===========================================================================
export const EverydayRelativityRecapAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cards = [
    { title: "Golden Color", sub: "Gold · Z = 79", img: "relbonds/gold-bar.jpg", col: C.gold, delay: 0 },
    { title: "Liquid Metal", sub: "Mercury · Z = 80", img: "relbonds/liquid-mercury.jpg", col: C.cyan, delay: 14 },
    { title: "80% Car Voltage", sub: "Lead · Z = 82", img: null, col: C.green, delay: 28 },
  ];

  return (
    <div style={{ width: 1520, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 40px" }}>
      {cards.map((c) => {
        const sp = spring({ frame: Math.max(0, frame - c.delay), fps, config: { damping: 14, stiffness: 110 } });
        return (
          <div
            key={c.title}
            style={{
              width: 445,
              borderRadius: 28,
              overflow: "hidden",
              background: "rgba(8, 16, 38, 0.94)",
              border: `3px solid ${c.col}`,
              boxShadow: `${glow(c.col, 10)}, 0 20px 50px rgba(0,0,0,0.8)`,
              opacity: sp,
              transform: `translateY(${(1 - sp) * 32}px)`,
            }}
          >
            <div style={{ height: 270, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#050b1c" }}>
              {c.img ? (
                <Img src={staticFile(c.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg viewBox="0 0 360 220" style={{ width: 340, height: 210 }}>
                  <rect x={40} y={50} width={280} height={135} rx={20} fill="rgba(8,22,42,0.95)" stroke={C.green} strokeWidth={4} />
                  <rect x={85} y={26} width={44} height={24} rx={6} fill={C.dim} />
                  <rect x={230} y={26} width={44} height={24} rx={6} fill={C.red} />
                  <rect x={60} y={82} width={52} height={70} rx={10} fill="rgba(127,147,196,0.45)" />
                  <rect x={120} y={82} width={180} height={70} rx={10} fill={C.green} style={{ filter: svgGlow(C.green, 8) }} />
                  <text x={210} y={127} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={30}>80%</text>
                </svg>
              )}
            </div>
            <div style={{ padding: "22px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 32, color: C.white }}>{c.title}</div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: c.col, marginTop: 6 }}>{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ===========================================================================
// CH 3 — PAGE 3A: CYANIDE ION [C≡N]⁻ — THREE SHARED ELECTRON PAIRS
// ===========================================================================
export const CyanideTripleBondAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const snap = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const sep = interpolate(snap, [0, 1], [380, 240]);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Three parallel glowing shared bond bars */}
      {[-54, 0, 54].map((dy, idx) => (
        <g key={dy}>
          <line
            x1={800 - sep + 72}
            y1={350 + dy}
            x2={800 + sep - 72}
            y2={350 + dy}
            stroke={idx === 1 ? C.cyan : C.gold}
            strokeWidth={11}
            strokeLinecap="round"
            style={{ filter: svgGlow(idx === 1 ? C.cyan : C.gold, 8) }}
          />
          {/* Shared electron pair dots gliding gently along each bond */}
          <circle cx={755 + Math.sin(t * 3 + idx) * 28} cy={350 + dy} r={10} fill={C.white} />
          <circle cx={845 - Math.sin(t * 3 + idx) * 28} cy={350 + dy} r={10} fill={C.white} />
        </g>
      ))}

      {/* Carbon nucleus */}
      <g transform={`translate(${800 - sep}, 350)`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <circle r={74} fill="#0c284d" stroke={C.cyan} strokeWidth={4.5} />
        <text x={0} y={14} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={44}>C</text>
        <text x={0} y={118} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>Z = 6</text>
      </g>

      {/* Nitrogen nucleus */}
      <g transform={`translate(${800 + sep}, 350)`} style={{ filter: svgGlow(C.gold, 10) }}>
        <circle r={74} fill="#362409" stroke={C.gold} strokeWidth={4.5} />
        <text x={0} y={14} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={44}>N</text>
        <text x={0} y={118} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={22}>Z = 7</text>
      </g>

      <text x={800} y={590} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={27} letterSpacing={2.2}>
        CYANIDE ION [C≡N]⁻ · 3 SHARED ELECTRON PAIRS
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3B: 1 SIGMA (σ) BOND — HEAD-ON AXIS OVERLAP
// ===========================================================================
export const SigmaHeadOnAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const merge = interpolate(frame, [0, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const push = interpolate(merge, [0, 1], [110, 0]);
  const glowR = 52 + Math.sin(t * 4.5) * 6;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Internuclear dashed centerline */}
      <line x1={220} y1={350} x2={1380} y2={350} stroke="rgba(62,224,255,0.35)" strokeWidth={3} strokeDasharray="12 10" />

      {/* Left head-on orbital lobe sliding inward */}
      <ellipse
        cx={680 - push}
        cy={350}
        rx={210}
        ry={78}
        fill="rgba(62, 224, 255, 0.24)"
        stroke={C.cyan}
        strokeWidth={4.5}
        style={{ filter: svgGlow(C.cyan, 8) }}
      />
      {/* Right head-on orbital lobe sliding inward */}
      <ellipse
        cx={920 + push}
        cy={350}
        rx={210}
        ry={78}
        fill="rgba(62, 224, 255, 0.24)"
        stroke={C.cyan}
        strokeWidth={4.5}
        style={{ filter: svgGlow(C.cyan, 8) }}
      />

      {/* Intense central head-on overlap core */}
      <ellipse cx={800} cy={350} rx={120 * merge + 10} ry={glowR * merge + 6} fill="rgba(62, 224, 255, 0.55)" style={{ filter: svgGlow(C.cyan, 14) }} />

      {/* Nuclei */}
      <circle cx={460} cy={350} r={44} fill="#0b1f40" stroke={C.white} strokeWidth={3.5} />
      <text x={460} y={362} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>C</text>

      <circle cx={1140} cy={350} r={44} fill="#332208" stroke={C.white} strokeWidth={3.5} />
      <text x={1140} y={362} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>N</text>

      <g transform="translate(800, 565)">
        <rect x={-395} y={-36} width={790} height={72} rx={36} fill="rgba(6, 18, 42, 0.94)" stroke={C.cyan} strokeWidth={3} />
        <text x={0} y={9} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24} letterSpacing={1.8}>
          1 SIGMA (σ) · DIRECT HEAD-ON BRIDGE
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3C: 2 PI (π) BONDS — SIDE-BY-SIDE CLOUDS (NEVER MIXING!)
// ===========================================================================
export const TwoPiSideBySideAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const p2 = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 14, stiffness: 100 } });
  const breathe = Math.sin(t * 3.5) * 6;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Faint central sigma bridge */}
      <line x1={480} y1={360} x2={1120} y2={360} stroke={C.cyan} strokeWidth={10} opacity={0.45} />

      {/* PI BOND 1: Top & Bottom Glowing Gold Arching Clouds */}
      <g>
        <ellipse cx={800} cy={220 - breathe} rx={290} ry={58} fill="rgba(255, 194, 77, 0.28)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
        <ellipse cx={800} cy={500 + breathe} rx={290} ry={58} fill="rgba(255, 194, 77, 0.28)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={800} y={136} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23}>
          PI BOND #1 (ABOVE & BELOW)
        </text>
      </g>

      {/* PI BOND 2: Front & Back Skewed Emerald-Violet Clouds */}
      <g opacity={p2}>
        <ellipse
          cx={800}
          cy={320}
          rx={300}
          ry={34}
          fill="rgba(61, 255, 160, 0.2)"
          stroke={C.green}
          strokeWidth={3.5}
          strokeDasharray="10 6"
          style={{ filter: svgGlow(C.green, 6) }}
        />
        <ellipse
          cx={800}
          cy={400}
          rx={300}
          ry={34}
          fill="rgba(61, 255, 160, 0.2)"
          stroke={C.green}
          strokeWidth={3.5}
          style={{ filter: svgGlow(C.green, 6) }}
        />
        <text x={1275} y={368} textAnchor="start" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
          PI BOND #2
        </text>
        <text x={1275} y={398} textAnchor="start" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={18}>
          (FRONT & BACK)
        </text>
      </g>

      {/* Nuclei */}
      <circle cx={480} cy={360} r={42} fill="#0b1f40" stroke={C.white} strokeWidth={3.5} />
      <text x={480} y={372} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>C</text>
      <circle cx={1120} cy={360} r={42} fill="#332208" stroke={C.white} strokeWidth={3.5} />
      <text x={1120} y={372} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>N</text>

      <text x={800} y={638} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={25} letterSpacing={2}>
        IN LIGHT MOLECULES: 1 σ + 2 π NEVER MIX
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 3 — PAGE 3D: GROUP 15 PERIODIC TABLE COLUMN (N → P → As → Sb → Bi!)
// ===========================================================================
export const Group15SwapBismuthAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elems = [
    { z: "7", sym: "N", name: "Nitrogen", col: C.cyan },
    { z: "15", sym: "P", name: "Phosphorus", col: "#6eb5ff" },
    { z: "33", sym: "As", name: "Arsenic", col: "#9bb3e0" },
    { z: "51", sym: "Sb", name: "Antimony", col: "#d4b483" },
    { z: "83", sym: "Bi", name: "Bismuth", col: C.gold },
  ];

  // Elevator highlight marches down N -> P -> As -> Sb -> Bi!
  const activeIdx = Math.min(4, Math.floor(interpolate(frame, [0, 160], [0, 4.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const swapP = spring({ frame: Math.max(0, frame - 150), fps, config: { damping: 14, stiffness: 110 } });

  return (
    <div style={{ width: 1520, height: 680, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 90px" }}>
      {/* Left: Vertical Group 15 Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 20, color: C.dim, letterSpacing: 2.5, textAlign: "center", marginBottom: 4 }}>
          GROUP 15 COLUMN
        </div>
        {elems.map((el, idx) => {
          const isAct = idx === activeIdx;
          return (
            <div
              key={el.sym}
              style={{
                width: 310,
                padding: "12px 26px",
                borderRadius: 18,
                background: isAct ? "rgba(32, 24, 6, 0.96)" : "rgba(8, 16, 38, 0.78)",
                border: `3px solid ${isAct ? el.col : "rgba(127,147,196,0.28)"}`,
                boxShadow: isAct ? glow(el.col, 10) : "none",
                transform: `scale(${isAct ? 1.07 : 0.96})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 22, color: C.dim }}>{el.z}</span>
              <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 34, color: isAct ? el.col : C.white }}>{el.sym}</span>
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 20, color: isAct ? C.white : C.dim }}>{el.name}</span>
            </div>
          );
        })}
      </div>

      {/* Right: Swapping N -> Bi inside [C≡Bi]⁻ */}
      <svg viewBox="0 0 880 620" style={{ width: 880, height: 620, overflow: "visible" }}>
        {/* Triple bond bars */}
        {[-44, 0, 44].map((dy, i) => (
          <line key={dy} x1={270} y1={285 + dy} x2={580} y2={285 + dy} stroke={i === 1 ? C.cyan : C.gold} strokeWidth={9} strokeDasharray="14 8" />
        ))}
        {/* Carbon */}
        <circle cx={220} cy={285} r={66} fill="#0c284d" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 8) }} />
        <text x={220} y={298} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={40}>C</text>

        {/* Massive Heavy Bismuth Swapped In! */}
        <g transform={`translate(660, 285) scale(${0.75 + 0.25 * swapP})`} style={{ filter: svgGlow(C.gold, 12) }}>
          <circle r={98} fill="#362006" stroke={C.gold} strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={54}>Bi</text>
          <text x={0} y={56} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={20}>Z = 83</text>
        </g>

        <g transform="translate(440, 495)" opacity={swapP}>
          <rect x={-350} y={-44} width={700} height={88} rx={24} fill="rgba(12, 22, 48, 0.94)" stroke={C.gold} strokeWidth={3} />
          <text x={0} y={-4} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23}>
            TEXTBOOK PREDICTION FOR CBi⁻:
          </text>
          <text x={0} y={29} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={24}>
            Same Column → Same 1 σ + 2 π Triple Bond?
          </text>
        </g>
      </svg>
    </div>
  );
};
