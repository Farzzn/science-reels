import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 4 (0:26 – 0:42 = 480 frames — Pure #000000 Code Animation):
// Pure black #000000 canvas. Build a 3-stage split comparison card that snaps in
// with spring() physics at each timestamp:
// - 0:26 – 0:31 (T = 10 SECONDS): Left Cyan SVG pulsing dot NEUTRINO (10^-24 m)
//   vs. Right Gold SVG ring RING NEBULA (1.3 LIGHT-YEARS / 10^16 m).
// - 0:31 – 0:36 (T = 20 SECONDS): Left Cyan SVG sphere PROTON (10^-15 m)
//   vs. Right Gold SVG cratered sphere THE MOON (10^6 m).
// - 0:36 – 0:42 (T = 24 SECONDS): Left Cyan SVG orbital rings OXYGEN ATOM (10^-10 m)
//   vs. Right Gold SVG wireframe pyramid GREAT PYRAMID OF GIZA (10^2 m).

interface SplitStageProps {
  stageIndex: 1 | 2 | 3;
  durationInFrames: number;
  timeLabel: string;
  gapOrdersLabel: string;
  leftTitle: string;
  leftScale: string;
  leftSub: string;
  rightTitle: string;
  rightScale: string;
  rightSub: string;
}

const SplitComparisonStage: React.FC<SplitStageProps> = ({
  stageIndex,
  durationInFrames,
  timeLabel,
  gapOrdersLabel,
  leftTitle,
  leftScale,
  leftSub,
  rightTitle,
  rightScale,
  rightSub,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const snapSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.8 },
  });

  const leftCardSpring = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const rightCardSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 7, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const pulse = 0.65 + 0.35 * Math.sin(frame * 0.3);
  const rotDeg = frame * 1.8;

  // Convergence progress bar at top (shows YOU and FRIEND closing the gap)
  const convPct = stageIndex === 1 ? 0.32 : stageIndex === 2 ? 0.64 : 0.82;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "monospace",
        opacity: fadeOut,
        pointerEvents: "none",
      }}
    >
      {/* Top Timestamp & Convergence Header */}
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 52,
          right: 52,
          transform: `scale(${interpolate(snapSpring, [0, 1], [0.88, 1])})`,
          padding: "20px 28px",
          borderRadius: 18,
          backgroundColor: "#000000",
          border: "2px solid #F5D061",
          boxShadow: "0 0 32px rgba(245, 208, 97, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                backgroundColor: "rgba(0, 240, 255, 0.16)",
                border: "1.5px solid #00F0FF",
                fontSize: 18,
                fontWeight: 900,
                color: "#00F0FF",
                letterSpacing: 1.5,
              }}
            >
              CHECKPOINT 0{stageIndex} / 03
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#F5D061",
                letterSpacing: 2,
                textShadow: "0 0 16px rgba(245, 208, 97, 0.55)",
              }}
            >
              {timeLabel}
            </span>
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1.5,
            }}
          >
            {gapOrdersLabel}
          </span>
        </div>

        {/* Horizontal Convergence Track: YOU (Cyan) -> <- FRIEND (Gold) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 22,
            borderRadius: 11,
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.22)",
            overflow: "hidden",
          }}
        >
          {/* Left Cyan Fill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${convPct * 50}%`,
              backgroundColor: "#00F0FF",
              boxShadow: "0 0 16px #00F0FF",
            }}
          />
          {/* Right Gold Fill */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: `${convPct * 50}%`,
              backgroundColor: "#F5D061",
              boxShadow: "0 0 16px #F5D061",
            }}
          />
          {/* Center Midpoint Line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: "#FFFFFF",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      {/* Main Split Comparison Container (Left Cyan vs Right Gold) */}
      <div
        style={{
          position: "absolute",
          top: 285,
          left: 48,
          right: 48,
          height: 940,
          display: "flex",
          gap: 28,
          alignItems: "stretch",
        }}
      >
        {/* ============================================================
            LEFT CARD: CYAN (#00F0FF) — YOU (QUANTUM REALM)
           ============================================================ */}
        <div
          style={{
            flex: 1,
            transform: `scale(${interpolate(
              leftCardSpring,
              [0, 1],
              [0.84, 1],
            )}) translateY(${interpolate(leftCardSpring, [0, 1], [40, 0])}px)`,
            borderRadius: 24,
            backgroundColor: "#000000",
            border: "2.5px solid #00F0FF",
            boxShadow:
              "0 0 38px rgba(0, 240, 255, 0.25), inset 0 0 28px rgba(0, 240, 255, 0.08)",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Top Tag */}
          <div
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(0, 240, 255, 0.12)",
              border: "1px solid rgba(0, 240, 255, 0.45)",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            YOU // ×10/SEC UP
          </div>

          {/* Center Crisp Cyan SVG Artwork */}
          <div
            style={{
              width: 360,
              height: 410,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg width={360} height={380} viewBox="-180 -180 360 360">
              {stageIndex === 1 && (
                /* Stage 1: Pulsing Dot NEUTRINO (10^-24 m) */
                <g>
                  {[1, 2, 3].map((ring) => {
                    const r = ((frame * 2.2 + ring * 42) % 135) + 18;
                    const op = interpolate(r, [18, 153], [0.85, 0]);
                    return (
                      <circle
                        key={ring}
                        cx={0}
                        cy={0}
                        r={r}
                        fill="none"
                        stroke="#00F0FF"
                        strokeWidth={2.5}
                        opacity={op}
                      />
                    );
                  })}
                  <circle
                    cx={0}
                    cy={0}
                    r={56}
                    fill="rgba(0, 240, 255, 0.1)"
                    stroke="rgba(0, 240, 255, 0.45)"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={18 + 6 * Math.sin(frame * 0.4)}
                    fill="#00F0FF"
                    style={{ filter: "drop-shadow(0 0 22px #00F0FF)" }}
                  />
                  <circle cx={0} cy={0} r={7} fill="#FFFFFF" />
                </g>
              )}

              {stageIndex === 2 && (
                /* Stage 2: Cyan SVG Sphere PROTON (10^-15 m) */
                <g>
                  <circle
                    cx={0}
                    cy={0}
                    r={125}
                    fill="rgba(0, 240, 255, 0.1)"
                    stroke="#00F0FF"
                    strokeWidth={4}
                    style={{ filter: "drop-shadow(0 0 18px #00F0FF)" }}
                  />
                  {/* Latitude / Longitude Wireframe Rings */}
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={125}
                    ry={48}
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.65)"
                    strokeWidth={2.5}
                  />
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={52}
                    ry={125}
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.65)"
                    strokeWidth={2.5}
                    transform={`rotate(${Math.sin(frame * 0.08) * 18})`}
                  />
                  {/* 3 Internal Quarks (u, u, d) */}
                  {[0, 120, 240].map((deg, idx) => {
                    const rad = ((deg + rotDeg) * Math.PI) / 180;
                    const qx = Math.cos(rad) * 48;
                    const qy = Math.sin(rad) * 48;
                    return (
                      <g key={idx}>
                        <line
                          x1={0}
                          y1={0}
                          x2={qx}
                          y2={qy}
                          stroke="#00F0FF"
                          strokeWidth={3}
                          strokeDasharray="5 4"
                        />
                        <circle
                          cx={qx}
                          cy={qy}
                          r={16}
                          fill="#00F0FF"
                          style={{ filter: "drop-shadow(0 0 12px #00F0FF)" }}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {stageIndex === 3 && (
                /* Stage 3: Cyan SVG Orbital Rings OXYGEN ATOM (10^-10 m) */
                <g>
                  {[0, 60, 120].map((angle, idx) => {
                    const eAngle = ((frame * 4 + idx * 120) * Math.PI) / 180;
                    const ex = Math.cos(eAngle) * 135;
                    const ey = Math.sin(eAngle) * 52;
                    return (
                      <g key={idx} transform={`rotate(${angle})`}>
                        <ellipse
                          cx={0}
                          cy={0}
                          rx={135}
                          ry={52}
                          fill="none"
                          stroke="#00F0FF"
                          strokeWidth={3.5}
                          style={{ filter: "drop-shadow(0 0 10px #00F0FF)" }}
                        />
                        <circle
                          cx={ex}
                          cy={ey}
                          r={10}
                          fill="#FFFFFF"
                          stroke="#00F0FF"
                          strokeWidth={4}
                        />
                      </g>
                    );
                  })}
                  {/* Atomic Nucleus */}
                  <circle
                    cx={0}
                    cy={0}
                    r={22}
                    fill="#00F0FF"
                    style={{ filter: "drop-shadow(0 0 18px #00F0FF)" }}
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Label Block */}
          <div
            style={{
              width: "100%",
              padding: "20px 18px",
              borderRadius: 16,
              backgroundColor: "rgba(0, 240, 255, 0.08)",
              border: "1.5px solid rgba(0, 240, 255, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
                textAlign: "center",
              }}
            >
              {leftTitle}
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#00F0FF",
                letterSpacing: 1,
                textShadow: `0 0 ${18 * pulse}px #00F0FF`,
              }}
            >
              {leftScale}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 1.2,
                textAlign: "center",
              }}
            >
              {leftSub}
            </span>
          </div>
        </div>

        {/* ============================================================
            RIGHT CARD: GOLD (#F5D061) — FRIEND (COSMIC REALM)
           ============================================================ */}
        <div
          style={{
            flex: 1,
            transform: `scale(${interpolate(
              rightCardSpring,
              [0, 1],
              [0.84, 1],
            )}) translateY(${interpolate(rightCardSpring, [0, 1], [40, 0])}px)`,
            borderRadius: 24,
            backgroundColor: "#000000",
            border: "2.5px solid #F5D061",
            boxShadow:
              "0 0 38px rgba(245, 208, 97, 0.25), inset 0 0 28px rgba(245, 208, 97, 0.08)",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Top Tag */}
          <div
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(245, 208, 97, 0.12)",
              border: "1px solid rgba(245, 208, 97, 0.45)",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 2,
            }}
          >
            FRIEND // ÷10/SEC DOWN
          </div>

          {/* Center Crisp Gold SVG Artwork */}
          <div
            style={{
              width: 360,
              height: 410,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg width={360} height={380} viewBox="-180 -180 360 360">
              {stageIndex === 1 && (
                /* Stage 1: Gold SVG Ring RING NEBULA (1.3 LIGHT-YEARS / 10^16 m) */
                <g transform={`rotate(${frame * 0.45})`}>
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={142}
                    ry={102}
                    fill="rgba(245, 208, 97, 0.08)"
                    stroke="#F5D061"
                    strokeWidth={8}
                    style={{ filter: "drop-shadow(0 0 22px #F5D061)" }}
                  />
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={116}
                    ry={80}
                    fill="none"
                    stroke="rgba(245, 208, 97, 0.65)"
                    strokeWidth={3}
                    strokeDasharray="12 8"
                  />
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={82}
                    ry={54}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth={2}
                  />
                  {/* Central White Dwarf Star */}
                  <circle
                    cx={0}
                    cy={0}
                    r={10}
                    fill="#FFFFFF"
                    style={{ filter: "drop-shadow(0 0 14px #F5D061)" }}
                  />
                </g>
              )}

              {stageIndex === 2 && (
                /* Stage 2: Gold SVG Cratered Sphere THE MOON (10^6 m) */
                <g>
                  <circle
                    cx={0}
                    cy={0}
                    r={125}
                    fill="rgba(245, 208, 97, 0.1)"
                    stroke="#F5D061"
                    strokeWidth={4.5}
                    style={{ filter: "drop-shadow(0 0 20px #F5D061)" }}
                  />
                  {/* Craters */}
                  <circle
                    cx={-42}
                    cy={-36}
                    r={28}
                    fill="rgba(245, 208, 97, 0.14)"
                    stroke="#F5D061"
                    strokeWidth={3}
                  />
                  <circle
                    cx={48}
                    cy={-18}
                    r={19}
                    fill="rgba(245, 208, 97, 0.14)"
                    stroke="#F5D061"
                    strokeWidth={2.5}
                  />
                  <circle
                    cx={18}
                    cy={52}
                    r={34}
                    fill="rgba(245, 208, 97, 0.14)"
                    stroke="#F5D061"
                    strokeWidth={3}
                  />
                  <circle
                    cx={-54}
                    cy={44}
                    r={16}
                    fill="rgba(245, 208, 97, 0.14)"
                    stroke="#F5D061"
                    strokeWidth={2.5}
                  />
                  {/* Equatorial horizon arc */}
                  <path
                    d="M -125 0 A 125 38 0 0 0 125 0"
                    fill="none"
                    stroke="rgba(245, 208, 97, 0.5)"
                    strokeWidth={2}
                    strokeDasharray="8 6"
                  />
                </g>
              )}

              {stageIndex === 3 && (
                /* Stage 3: Gold SVG Wireframe Pyramid GREAT PYRAMID OF GIZA (10^2 m) */
                <g>
                  {/* 3D Wireframe Pyramid */}
                  {/* Apex at (0, -125), Base corners at (-135, 65), (15, 115), (140, 50), (-10, 10) */}
                  {/* Back hidden edges */}
                  <line
                    x1={-135}
                    y1={65}
                    x2={-10}
                    y2={15}
                    stroke="rgba(245, 208, 97, 0.4)"
                    strokeWidth={2.5}
                    strokeDasharray="6 6"
                  />
                  <line
                    x1={140}
                    y1={50}
                    x2={-10}
                    y2={15}
                    stroke="rgba(245, 208, 97, 0.4)"
                    strokeWidth={2.5}
                    strokeDasharray="6 6"
                  />
                  <line
                    x1={0}
                    y1={-125}
                    x2={-10}
                    y2={15}
                    stroke="rgba(245, 208, 97, 0.4)"
                    strokeWidth={2.5}
                    strokeDasharray="6 6"
                  />

                  {/* Front left face */}
                  <polygon
                    points="0,-125 -135,65 15,115"
                    fill="rgba(245, 208, 97, 0.12)"
                    stroke="#F5D061"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    style={{ filter: "drop-shadow(0 0 16px #F5D061)" }}
                  />
                  {/* Front right face */}
                  <polygon
                    points="0,-125 15,115 140,50"
                    fill="rgba(245, 208, 97, 0.06)"
                    stroke="#F5D061"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    style={{ filter: "drop-shadow(0 0 16px #F5D061)" }}
                  />
                  {/* Horizontal structural tiers */}
                  {[-65, -10, 45].map((ty, idx) => {
                    const t = (ty - -125) / (115 - -125);
                    const lx = -135 * t;
                    const ly = -125 + (65 - -125) * t;
                    const cx = 15 * t;
                    const cy = -125 + (115 - -125) * t;
                    const rx = 140 * t;
                    const ry = -125 + (50 - -125) * t;
                    return (
                      <polyline
                        key={idx}
                        points={`${lx},${ly} ${cx},${cy} ${rx},${ry}`}
                        fill="none"
                        stroke="rgba(245, 208, 97, 0.5)"
                        strokeWidth={2}
                      />
                    );
                  })}
                  {/* Glowing Apex Capstone */}
                  <circle
                    cx={0}
                    cy={-125}
                    r={8}
                    fill="#FFFFFF"
                    stroke="#F5D061"
                    strokeWidth={3}
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Label Block */}
          <div
            style={{
              width: "100%",
              padding: "20px 18px",
              borderRadius: 16,
              backgroundColor: "rgba(245, 208, 97, 0.08)",
              border: "1.5px solid rgba(245, 208, 97, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.2,
                textAlign: "center",
              }}
            >
              {rightTitle}
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#F5D061",
                letterSpacing: 1,
                textShadow: `0 0 ${18 * pulse}px #F5D061`,
                textAlign: "center",
              }}
            >
              {rightScale}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 1.2,
                textAlign: "center",
              }}
            >
              {rightSub}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene4SplitComparison: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", pointerEvents: "none" }}>
      {/* Stage 1: 29.43s – 34.67s (local frames 0 – 157, 157 frames) */}
      <Sequence from={0} durationInFrames={157}>
        <SplitComparisonStage
          stageIndex={1}
          durationInFrames={157}
          timeLabel="T = 10 SECONDS"
          gapOrdersLabel="GAP: 40 ORDERS OF MAGNITUDE"
          leftTitle="NEUTRINO"
          leftScale="10^-24 m"
          leftSub="FIRST SUBATOMIC GHOST PARTICLE"
          rightTitle="RING NEBULA"
          rightScale="1.3 LIGHT-YEARS / 10^16 m"
          rightSub="PLANETARY NEBULA SHELL"
        />
      </Sequence>

      {/* Stage 2: 34.67s – 38.03s (local frames 157 – 258, 101 frames) */}
      <Sequence from={157} durationInFrames={101}>
        <SplitComparisonStage
          stageIndex={2}
          durationInFrames={101}
          timeLabel="T = 20 SECONDS"
          gapOrdersLabel="GAP: 21 ORDERS OF MAGNITUDE"
          leftTitle="PROTON"
          leftScale="10^-15 m"
          leftSub="ATOMIC NUCLEUS HADRON (1 FEMTOMETER)"
          rightTitle="THE MOON"
          rightScale="10^6 m"
          rightSub="LUNAR DIAMETER (3,474 KM)"
        />
      </Sequence>

      {/* Stage 3: 38.03s – 42.23s (local frames 258 – 384, 126 frames) */}
      <Sequence from={258} durationInFrames={126}>
        <SplitComparisonStage
          stageIndex={3}
          durationInFrames={126}
          timeLabel="T = 24 SECONDS"
          gapOrdersLabel="GAP: 12 ORDERS OF MAGNITUDE"
          leftTitle="OXYGEN ATOM"
          leftScale="10^-10 m"
          leftSub="ELECTRON ORBITAL CLOUD (1 ANGSTROM)"
          rightTitle="GREAT PYRAMID OF GIZA"
          rightScale="10^2 m"
          rightSub="HUMAN ARCHITECTURAL SCALE (138 METERS)"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
