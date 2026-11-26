import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { PhotoPlate } from "../RelativityBonds/ui";

// ===========================================================================
// CH 6 — PAGE 6A: 60-70% OF EVERY LIVING HUMAN CELL IS LIQUID WATER!
// ===========================================================================
export const HumanCellWaterStatAnim: React.FC<{ statAt: number }> = ({ statAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const fillP = interpolate(frame, [Math.max(10, statAt - 10), statAt + 45], [0.15, 0.68], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pct = Math.round(fillP * 100);
  const waterY = interpolate(fillP, [0, 1], [190, -190]);

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <clipPath id="cellClip">
          <circle cx={0} cy={0} r={190} />
        </clipPath>
      </defs>

      {/* Stylized Glowing Human Cell Filling With Liquid Water */}
      <g transform="translate(535, 345)">
        <circle r={206} fill="none" stroke="rgba(62,224,255,0.28)" strokeWidth={8} />
        <g clipPath="url(#cellClip)">
          <circle r={190} fill="#061028" />
          <path
            d={`M-210,${waterY} Q-105,${waterY - 18 * Math.sin(t * 3)} 0,${waterY} T210,${waterY} L210,210 L-210,210 Z`}
            fill="rgba(62, 224, 255, 0.42)"
          />
        </g>
        <circle r={190} fill="none" stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 10) }} />
        <text x={0} y={14} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={72} style={{ filter: svgGlow(C.cyan, 8) }}>
          ~{pct}%
        </text>
        <text x={0} y={62} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
          LIQUID WATER
        </text>
      </g>

      {/* Right Callout Card */}
      <g transform="translate(1125, 345)">
        <rect x={-305} y={-165} width={610} height={330} rx={28} fill="rgba(8, 16, 38, 0.94)" stroke={C.cyan} strokeWidth={3.5} />
        <text x={0} y={-95} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          WHY WATER CHEMISTRY MATTERS
        </text>
        <text x={0} y={-10} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={38}>
          Not Just Lab Trivia —
        </text>
        <text x={0} y={44} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={38}>
          It's What You're Made Of.
        </text>
        <text x={0} y={114} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20}>
          60 – 70% OF EVERY LIVING HUMAN CELL
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6B: PHOTOREALISTIC DNA & WATER RADIOLYSIS!
// ===========================================================================
export const DnaWaterRadiolysisAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 14, stiffness: 110 } });

  return (
    <PhotoPlate src="attowater/dna-radiation.jpg" borderColor={C.cyan}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(740, 642)" opacity={p}>
          <rect x={-505} y={-32} width={1010} height={64} rx={32} fill="rgba(6, 14, 34, 0.94)" stroke={C.gold} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={1.4}>
            RADIATION BLASTS SURROUNDING WATER FIRST → FRAGMENTS SLICE DNA
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 6 — PAGE 6B: CLASSICAL RADIOLYSIS VS. NEW < 4 FS ATOMIC OXYGEN CHANNEL!
// ===========================================================================
export const RadiotherapyChannelsAnim: React.FC<{
  newChannelAt: number;
}> = ({ newChannelAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const newP = spring({ frame: Math.max(0, frame - newChannelAt), fps, config: { damping: 13, stiffness: 120 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left: Classical Radiation Biology */}
      <g transform="translate(425, 345)">
        <rect x={-320} y={-220} width={640} height={440} rx={30} fill="rgba(8, 16, 38, 0.92)" stroke={C.dim} strokeWidth={3} />
        <text x={0} y={-155} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          CLASSICAL RADIATION MODELS
        </text>
        <circle cx={-95} cy={-15} r={54} fill="rgba(62,224,255,0.18)" stroke={C.cyan} strokeWidth={4} />
        <text x={-95} y={-3} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={28}>OH•</text>
        <circle cx={95} cy={-15} r={54} fill="rgba(127,147,196,0.18)" stroke={C.dim} strokeWidth={4} />
        <text x={95} y={-3} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={28}>e⁻</text>
        <text x={0} y={108} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
          Hydroxyl Radicals &amp; Loose Electrons
        </text>
        <text x={0} y={148} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={19}>
          SLOWER SINGLE-BOND BREAKUP
        </text>
      </g>

      {/* Right: New 2026 < 4 fs Atomic Oxygen Discovery! */}
      <g transform={`translate(1175, 345) scale(${0.9 + 0.1 * newP})`} opacity={0.25 + 0.75 * newP}>
        <rect x={-320} y={-220} width={640} height={440} rx={30} fill="rgba(34, 20, 8, 0.95)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 10) }} />
        <text x={0} y={-155} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={2}>
          NEW 2026 ULTRAFAST CHANNEL
        </text>
        <circle cx={0} cy={-15} r={66} fill="rgba(255, 194, 77, 0.24)" stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 12) }} />
        <text x={0} y={2} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={46}>O*</text>
        <text x={0} y={108} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28}>
          Reactive Neutral Atomic Oxygen
        </text>
        <text x={0} y={148} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={19}>
          SHARPENS CANCER RADIOTHERAPY MODELS ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6C: PHOTOREALISTIC DEEP SPACE COSMIC RADIATION & ASTROCHEMISTRY!
// ===========================================================================
export const SpaceRadiationPlateAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: Math.max(0, frame - 14), fps, config: { damping: 14, stiffness: 110 } });

  return (
    <PhotoPlate src="attowater/space-radiation.jpg" borderColor={C.gold}>
      <svg viewBox="0 0 1480 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <g transform="translate(360, 628)" opacity={p}>
          <rect x={-310} y={-34} width={620} height={68} rx={34} fill="rgba(6, 14, 34, 0.94)" stroke={C.cyan} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20}>
            DEEP-SPACE ASTRONAUT RADIATION SHIELDING
          </text>
        </g>
        <g transform="translate(1115, 628)" opacity={p}>
          <rect x={-315} y={-34} width={630} height={68} rx={34} fill="rgba(26, 18, 6, 0.94)" stroke={C.gold} strokeWidth={2.5} />
          <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
            ATOMIC OXYGEN IN COMETS &amp; ATMOSPHERES
          </text>
        </g>
      </svg>
    </PhotoPlate>
  );
};

// ===========================================================================
// CH 7 — PAGE 7A: TEXTBOOK V-SHAPED STICK FIGURE → SHATTERED BY ULTRAFAST REALITY!
// ===========================================================================
export const TextbookStickToWaveAnim: React.FC<{ explodeAt: number }> = ({ explodeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const expP = interpolate(frame, [Math.max(10, explodeAt - 6), explodeAt + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spread = expP * 115;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Textbook Paper Blueprint Grid disappearing as quantum wave explodes */}
      <rect x={460} y={110} width={680} height={415} rx={28} fill="rgba(8, 16, 38, 0.85)" stroke={expP > 0.35 ? C.gold : C.dim} strokeWidth={3} strokeDasharray={expP > 0.35 ? undefined : "12 8"} />

      {/* Energy shock rings blooming on "explodes into a violent, breathtaking choreography" */}
      {expP > 0.05 &&
        [1, 2].map((k) => (
          <circle
            key={k}
            cx={800}
            cy={315}
            r={90 + expP * (130 * k) + Math.sin(t * 5) * 12}
            fill="none"
            stroke={k === 1 ? C.cyan : C.gold}
            strokeWidth={4}
            opacity={(1 - expP * 0.35) * 0.65}
            style={{ filter: svgGlow(k === 1 ? C.cyan : C.gold, 8) }}
          />
        ))}

      {/* Quiet V-shaped stick figure morphing into energetic glowing choreography */}
      <line x1={800} y1={245} x2={680 - spread} y2={385 + spread * 0.3} stroke={expP > 0.35 ? C.cyan : C.dim} strokeWidth={10} strokeLinecap="round" />
      <line x1={800} y1={245} x2={920 + spread} y2={385 + spread * 0.3} stroke={expP > 0.35 ? C.cyan : C.dim} strokeWidth={10} strokeLinecap="round" />

      <circle cx={800} cy={245} r={54} fill={expP > 0.35 ? "#382204" : "#182442"} stroke={expP > 0.35 ? C.gold : C.white} strokeWidth={4} />
      <text x={800} y={258} textAnchor="middle" fill={expP > 0.35 ? C.gold : C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>O</text>

      <circle cx={680 - spread} cy={385 + spread * 0.3} r={34} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
      <text x={680 - spread} y={396} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={24}>H</text>

      <circle cx={920 + spread} cy={385 + spread * 0.3} r={34} fill="#0c284d" stroke={C.cyan} strokeWidth={3.5} />
      <text x={920 + spread} y={396} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={24}>H</text>

      <g transform="translate(800, 615)">
        <rect x={-465} y={-34} width={930} height={68} rx={34} fill="rgba(6, 14, 34, 0.94)" stroke={expP > 0.35 ? C.gold : C.dim} strokeWidth={3} />
        <text x={0} y={8} textAnchor="middle" fill={expP > 0.35 ? C.gold : C.white} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          {expP > 0.35 ? "ZOOM TO 10⁻¹⁸ s → A BREATHTAKING QUANTUM CHOREOGRAPHY!" : "TEXTBOOK WATER: A QUIET V-SHAPED STICK FIGURE"}
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7B: BEYOND FROZEN TEXTBOOKS — LIVE SUB-FEMTOSECOND DANCE!
// ===========================================================================
export const QuantumDanceSynthesisAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const morph = interpolate(frame, [20, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spread = Math.sin(t * 2.8) * 32 * morph;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Live glowing shimmering electron density rings */}
      {[1, 2, 3].map((k) => (
        <ellipse
          key={k}
          cx={800}
          cy={330}
          rx={195 + k * 56}
          ry={88 + k * 28}
          fill="none"
          stroke={k === 2 ? C.gold : C.cyan}
          strokeWidth={3.5}
          strokeDasharray="18 12"
          strokeDashoffset={-t * (60 + k * 35)}
          opacity={0.25 + 0.5 * morph}
          transform={`rotate(${(k - 2) * 24 + t * 10} 800 330)`}
          style={{ filter: svgGlow(k === 2 ? C.gold : C.cyan, 8) }}
        />
      ))}

      {/* Dynamic O-H Bonds pulsing between textbook sticks & shimmering quantum wave */}
      <line x1={800} y1={275} x2={640 - spread} y2={415 + spread * 0.4} stroke={C.cyan} strokeWidth={11} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />
      <line x1={800} y1={275} x2={960 + spread} y2={415 + spread * 0.4} stroke={C.cyan} strokeWidth={11} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />

      <circle cx={800} cy={275} r={58} fill="#382204" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 12) }} />
      <text x={800} y={289} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={38}>O</text>

      <circle cx={640 - spread} cy={415 + spread * 0.4} r={36} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
      <text x={640 - spread} y={427} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={26}>H</text>

      <circle cx={960 + spread} cy={415 + spread * 0.4} r={36} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
      <text x={960 + spread} y={427} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={26}>H</text>

      <g transform="translate(800, 618)">
        <rect x={-485} y={-36} width={970} height={72} rx={36} fill="rgba(6, 14, 34, 0.95)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          300 ATTOSECONDS ↔ 4 FEMTOSECONDS · WATCHING CHEMISTRY LIVE
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7B: CLEAN SUBSCRIBE + BELL OUTRO (WITH END-SCREEN SPACE ON RIGHT)
// ===========================================================================
export const AttoSubscribeOutroAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enterP = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const clicked = frame >= 48;
  const clickPop = spring({ frame: Math.max(0, frame - 48), fps, config: { damping: 10, stiffness: 170 } });
  const bellSwing = clicked ? Math.sin((frame - 48) * 0.55) * Math.exp(-(frame - 48) / 38) * 24 : 0;

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
      {/* Left Hero Column: Water Microjet X-Ray Preview + Subscribe CTA */}
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
            marginBottom: 34,
          }}
        >
          <Img
            src={staticFile("attowater/water-microjet.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + Math.sin(t) * 0.02})` }}
          />
        </div>

        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 48, color: C.white, lineHeight: 1.15 }}>
          Frontier Physics &amp; Chemistry,
          <br />
          <span style={{ color: C.gold }}>Explained Visually.</span>
        </div>

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

      {/* Right Column: Clean End-Screen Zone for YouTube Next Video */}
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
          Next Deep Science Breakdown
        </div>
      </div>
    </div>
  );
};
