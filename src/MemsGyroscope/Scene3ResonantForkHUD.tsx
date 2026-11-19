import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 3 (0:18 – 0:30 = 360 frames):
// Background public/silicon-fork-vibrate.mp4.
// Render a live procedural schematic card (DRIVE AXIS // RESONANT FREQUENCY: 28,000 Hz)
// showing two cyan proof-mass blocks oscillating strictly vertically
// (Y-AXIS DRIVE: ACTIVE, X-AXIS DEFLECTION: 0.00 nm).
export const Scene3ResonantForkHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 360
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [352, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strict anti-phase vertical oscillation along Y-axis (zero X-axis deflection)
  const oscY = Math.sin(frame * 0.55) * 34;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Lower-Middle Glassmorphic Procedural Schematic Card */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 58,
          right: 58,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 28px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.68)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 16px 42px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 240, 255, 0.25)",
            paddingBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1.5,
            }}
          >
            DRIVE AXIS // RESONANT FREQUENCY:{" "}
            <span style={{ color: "#F5D061" }}>28,000 Hz</span>
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(0, 240, 255, 0.16)",
              border: "1px solid #00F0FF",
              fontSize: 15,
              fontWeight: 900,
              color: "#00F0FF",
            }}
          >
            ELECTROSTATIC DRIVE
          </span>
        </div>

        {/* Procedural Schematic Canvas Showing Two Cyan Proof-Mass Blocks Oscillating Strictly Vertically */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 235,
            borderRadius: 14,
            backgroundColor: "rgba(5, 8, 15, 0.55)",
            border: "1px solid rgba(0, 240, 255, 0.22)",
            overflow: "hidden",
          }}
        >
          {/* Reference X and Y Axis Grid Lines */}
          <svg width={900} height={235}>
            <line
              x1={40}
              y1={117}
              x2={860}
              y2={117}
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth={1.5}
              strokeDasharray="6 6"
            />
            <line
              x1={275}
              y1={16}
              x2={275}
              y2={220}
              stroke="rgba(0, 240, 255, 0.35)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <line
              x1={625}
              y1={16}
              x2={625}
              y2={220}
              stroke="rgba(0, 240, 255, 0.35)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />

            {/* Vertical Velocity Vectors (+v_y / -v_y) */}
            <line
              x1={140}
              y1={117}
              x2={140}
              y2={117 + oscY * 1.6}
              stroke="#F5D061"
              strokeWidth={4}
            />
            <circle cx={140} cy={117 + oscY * 1.6} r={6} fill="#F5D061" />

            <line
              x1={760}
              y1={117}
              x2={760}
              y2={117 - oscY * 1.6}
              stroke="#F5D061"
              strokeWidth={4}
            />
            <circle cx={760} cy={117 - oscY * 1.6} r={6} fill="#F5D061" />
          </svg>

          {/* Left Cyan Proof-Mass Block (Moves +oscY Strictly Vertically) */}
          <div
            style={{
              position: "absolute",
              left: 185,
              top: 72 + oscY,
              width: 180,
              height: 90,
              borderRadius: 12,
              backgroundColor: "rgba(0, 240, 255, 0.2)",
              border: "2.5px solid #00F0FF",
              boxShadow: "0 0 24px rgba(0, 240, 255, 0.55)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              PROOF MASS A
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#00F0FF",
              }}
            >
              ↕ +v_y (STRICT Y)
            </span>
          </div>

          {/* Right Cyan Proof-Mass Block (Moves -oscY Strictly Vertically in Anti-Phase) */}
          <div
            style={{
              position: "absolute",
              left: 535,
              top: 72 - oscY,
              width: 180,
              height: 90,
              borderRadius: 12,
              backgroundColor: "rgba(0, 240, 255, 0.2)",
              border: "2.5px solid #00F0FF",
              boxShadow: "0 0 24px rgba(0, 240, 255, 0.55)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              PROOF MASS B
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#00F0FF",
              }}
            >
              ↕ -v_y (STRICT Y)
            </span>
          </div>
        </div>

        {/* Status Readout Bar: Y-AXIS DRIVE: ACTIVE, X-AXIS DEFLECTION: 0.00 nm */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 10,
              backgroundColor: "rgba(0, 240, 255, 0.14)",
              border: "1px solid #00F0FF",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#00F0FF",
              letterSpacing: 1.5,
            }}
          >
            Y-AXIS DRIVE: ACTIVE
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 10,
              backgroundColor: "rgba(245, 208, 97, 0.12)",
              border: "1px solid #F5D061",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            X-AXIS DEFLECTION: 0.00 nm
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
