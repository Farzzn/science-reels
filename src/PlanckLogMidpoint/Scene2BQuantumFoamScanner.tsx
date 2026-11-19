import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 2B (0:17.00 – 0:23.27 = Frames 510 – 698, 188 frames — Pure #000000 Code Animation):
// Plays right before galaxy-shrink.mp4 (at 23.27s) in exact sync with the voiceover:
// - Part 1 (17.00s – 20.30s, frames 0 – 99):
//   "Between the Planck length and a subatomic neutrino, there is literally nothing,"
// - Part 2 (20.30s – 23.27s, frames 99 – 188):
//   "just 35 powers of empty quantum foam."

const VoidScannerBeat: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 99
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const scanProgress = interpolate(frame, [6, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentExp = (-35 + scanProgress * 11).toFixed(1);
  const scanX = interpolate(scanProgress, [0, 1], [130, 950]);

  const fadeOut = interpolate(frame, [92, 99], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const powers = [
    "-35",
    "-34",
    "-33",
    "-32",
    "-31",
    "-30",
    "-29",
    "-28",
    "-27",
    "-26",
    "-25",
    "-24",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "monospace",
        opacity: fadeOut,
        pointerEvents: "none",
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 52,
          right: 52,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.9, 1])})`,
          padding: "20px 28px",
          borderRadius: 18,
          backgroundColor: "#000000",
          border: "2px solid #00F0FF",
          boxShadow: "0 0 32px rgba(0, 240, 255, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            SUB-ATOMIC VOID SCANNER // PLANCK → NEUTRINO
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1.5,
            }}
          >
            10^-35 m (PLANCK) → 10^-24 m (NEUTRINO)
          </span>
        </div>
        <div
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            backgroundColor: "rgba(245, 208, 97, 0.12)",
            border: "2px solid #F5D061",
            fontSize: 22,
            fontWeight: 900,
            color: "#F5D061",
          }}
        >
          10^{currentExp} m
        </div>
      </div>

      {/* Center Radar Bridge SVG */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Left Anchor: PLANCK LENGTH (10^-35 m) */}
        <g transform="translate(130, 560)">
          <circle
            cx={0}
            cy={0}
            r={38}
            fill="#000000"
            stroke="#00F0FF"
            strokeWidth={4}
            style={{ filter: "drop-shadow(0 0 16px #00F0FF)" }}
          />
          <circle cx={0} cy={0} r={8} fill="#00F0FF" />
          <text
            x={0}
            y={72}
            textAnchor="middle"
            fill="#00F0FF"
            fontSize={20}
            fontWeight="bold"
          >
            PLANCK LENGTH
          </text>
          <text
            x={0}
            y={98}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={18}
            fontWeight="bold"
          >
            10^-35 m
          </text>
        </g>

        {/* Right Anchor: SUBATOMIC NEUTRINO (10^-24 m) */}
        <g transform="translate(950, 560)">
          <circle
            cx={0}
            cy={0}
            r={38}
            fill="#000000"
            stroke="#F5D061"
            strokeWidth={4}
            style={{ filter: "drop-shadow(0 0 16px #F5D061)" }}
          />
          <circle cx={0} cy={0} r={12} fill="#F5D061" />
          <text
            x={0}
            y={72}
            textAnchor="middle"
            fill="#F5D061"
            fontSize={20}
            fontWeight="bold"
          >
            NEUTRINO
          </text>
          <text
            x={0}
            y={98}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={18}
            fontWeight="bold"
          >
            10^-24 m
          </text>
        </g>

        {/* Horizontal Void Axis */}
        <line
          x1={168}
          y1={560}
          x2={912}
          y2={560}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={4}
          strokeDasharray="10 8"
        />
        <line
          x1={168}
          y1={560}
          x2={Math.max(168, Math.min(912, scanX))}
          y2={560}
          stroke="#00F0FF"
          strokeWidth={6}
          style={{ filter: "drop-shadow(0 0 14px #00F0FF)" }}
        />

        {/* Sweeping Laser Reticle */}
        <g transform={`translate(${scanX}, 560)`}>
          <line
            x1={0}
            y1={-165}
            x2={0}
            y2={165}
            stroke="#00F0FF"
            strokeWidth={3.5}
            style={{ filter: "drop-shadow(0 0 12px #00F0FF)" }}
          />
          <circle
            cx={0}
            cy={0}
            r={74}
            fill="rgba(0, 240, 255, 0.08)"
            stroke="#00F0FF"
            strokeWidth={3}
            strokeDasharray="12 6"
          />
          <rect
            x={-170}
            y={-215}
            width={340}
            height={44}
            rx={10}
            fill="#000000"
            stroke="#F5D061"
            strokeWidth={2.5}
          />
          <text
            x={0}
            y={-186}
            textAnchor="middle"
            fill="#F5D061"
            fontSize={20}
            fontWeight="bold"
            letterSpacing={1.5}
          >
            SCANNING: 0 PARTICLES
          </text>
        </g>
      </svg>

      {/* 12-Slot Order-of-Magnitude Void Verification Grid */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 52,
          right: 52,
          padding: "26px 28px",
          borderRadius: 22,
          backgroundColor: "#000000",
          border: "2px solid rgba(0, 240, 255, 0.55)",
          boxShadow: "0 0 36px rgba(0, 240, 255, 0.18)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#00F0FF",
              letterSpacing: 1.5,
              whiteSpace: "nowrap",
            }}
          >
            MATTER DENSITY // 10^-35 m → 10^-24 m
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
              whiteSpace: "nowrap",
            }}
          >
            LITERALLY NOTHING FOUND
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {powers.map((p, idx) => {
            const isScanned = scanProgress * 12 >= idx;
            return (
              <div
                key={p}
                style={{
                  padding: "14px 12px",
                  borderRadius: 12,
                  backgroundColor: "#000000",
                  border: `2px solid ${
                    isScanned ? "#00F0FF" : "rgba(255,255,255,0.18)"
                  }`,
                  boxShadow: isScanned
                    ? "0 0 16px rgba(0, 240, 255, 0.28)"
                    : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: isScanned ? "#00F0FF" : "rgba(255,255,255,0.4)",
                  }}
                >
                  10^{p} m
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: isScanned ? "#F5D061" : "rgba(255,255,255,0.25)",
                    letterSpacing: 1,
                  }}
                >
                  {isScanned ? "EMPTY VOID" : "WAITING..."}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QuantumFoamMatrixBeat: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 89 (20.30s to 23.27s)
  const { fps } = useVideoConfig();

  const snapSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.8 },
  });

  const fadeOut = interpolate(frame, [82, 89], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const powerCount = Math.min(
    35,
    Math.max(1, Math.round(interpolate(frame, [0, 52], [1, 35], { extrapolateRight: "clamp" }))),
  );

  // Deterministic virtual quantum foam bubbles popping in and out on pure #000000
  const bubbles = Array.from({ length: 18 }).map((_, i) => {
    const cx = 140 + ((i * 173) % 800);
    const cy = 410 + ((i * 137) % 520);
    const phase = frame * 0.22 + i * 1.1;
    const wave = (Math.sin(phase) + 1) * 0.5;
    const r = 16 + wave * 42;
    const isGold = i % 2 === 1;
    return { cx, cy, r, wave, isGold };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "monospace",
        opacity: fadeOut,
        pointerEvents: "none",
      }}
    >
      {/* Top Header */}
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
          border: "2.5px solid #F5D061",
          boxShadow: "0 0 36px rgba(245, 208, 97, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            HEISENBERG UNCERTAINTY // ΔE · Δt ≥ ℏ/2
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            35 POWERS OF EMPTY QUANTUM FOAM
          </span>
        </div>

        <div
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            backgroundColor: "rgba(0, 240, 255, 0.14)",
            border: "2px solid #00F0FF",
            fontSize: 28,
            fontWeight: 900,
            color: "#00F0FF",
          }}
        >
          10^-{powerCount}
        </div>
      </div>

      {/* Center Quantum Foam Wave-Field SVG */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Outer Frame Box */}
        <rect
          x={56}
          y={310}
          width={968}
          height={680}
          rx={24}
          fill="#000000"
          stroke="#00F0FF"
          strokeWidth={3}
          style={{ filter: "drop-shadow(0 0 28px rgba(0, 240, 255, 0.25))" }}
        />

        {/* Oscillating Spacetime Metric Wave Lines */}
        {[0, 1, 2, 3, 4].map((row) => {
          const baseY = 400 + row * 120;
          const pts: string[] = [];
          for (let x = 90; x <= 990; x += 30) {
            const dy =
              Math.sin(x * 0.02 + frame * 0.28 + row) * 24 +
              Math.cos(x * 0.035 - frame * 0.22 + row * 2) * 14;
            pts.push(`${x},${baseY + dy}`);
          }
          return (
            <polyline
              key={row}
              points={pts.join(" ")}
              fill="none"
              stroke={row % 2 === 0 ? "rgba(0, 240, 255, 0.45)" : "rgba(245, 208, 97, 0.45)"}
              strokeWidth={2.5}
            />
          );
        })}

        {/* Virtual Quantum Foam Fluctuation Bubbles */}
        {bubbles.map((b, idx) => {
          const color = b.isGold ? "#F5D061" : "#00F0FF";
          return (
            <g key={idx} transform={`translate(${b.cx}, ${b.cy})`}>
              <circle
                cx={0}
                cy={0}
                r={b.r}
                fill="none"
                stroke={color}
                strokeWidth={3}
                opacity={0.35 + b.wave * 0.65}
                strokeDasharray={b.isGold ? "8 5" : undefined}
                style={{ filter: `drop-shadow(0 0 12px ${color})` }}
              />
              <circle
                cx={0}
                cy={0}
                r={5 + b.wave * 5}
                fill={color}
                opacity={0.5 + b.wave * 0.5}
              />
            </g>
          );
        })}
      </svg>

      {/* Bottom 35-Power Telemetry Summary Card */}
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 56,
          right: 56,
          transform: `scale(${interpolate(snapSpring, [0, 1], [0.9, 1])})`,
          padding: "24px 30px",
          borderRadius: 20,
          backgroundColor: "#000000",
          border: "2.5px solid #F5D061",
          boxShadow: "0 0 36px rgba(245, 208, 97, 0.28)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            VACUUM FLUCTUATION FIELD
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1.5,
            }}
          >
            ZERO MATTER // PURE QUANTUM FOAM
          </span>
        </div>
        <span
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: "#F5D061",
            letterSpacing: 1.5,
            textShadow: "0 0 18px #F5D061",
          }}
        >
          {powerCount} POWERS
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Scene2BQuantumFoamScanner: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", pointerEvents: "none" }}>
      {/* Beat 1 (17.00s – 20.30s = 99 frames): "Between the Planck length and a subatomic neutrino, there is literally nothing" */}
      <Sequence from={0} durationInFrames={99}>
        <VoidScannerBeat />
      </Sequence>
      {/* Beat 2 (20.30s – 23.27s = 89 frames): "just 35 powers of empty quantum foam." */}
      <Sequence from={99} durationInFrames={89}>
        <QuantumFoamMatrixBeat />
      </Sequence>
    </AbsoluteFill>
  );
};
