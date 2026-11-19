import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 4 (0:30 – 0:42 = 360 frames):
// Background public/coriolis-hurricane.mp4.
// Overlay a red/golden physics telemetry card (CORIOLIS ACCELERATION // F_c = -2m(Ω × v)).
// Animate a vector diagram where a vertical velocity arrow (v) plus angular rotation (Ω)
// forces the oscillating mass to slam sideways along the red X-axis (CORIOLIS DEFLECTION DETECTED).
export const Scene4CoriolisVectorHUD: React.FC = () => {
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

  // Sideways X-axis deflection builds up as angular rotation Ω interacts with vertical velocity v
  const deflectProgress = interpolate(frame, [25, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const oscY = Math.sin(frame * 0.35) * 28;
  // Slam sideways along the red X-axis
  const slamX =
    deflectProgress * (110 + Math.abs(Math.sin(frame * 0.25)) * 45);
  const pulse = 0.65 + 0.35 * Math.sin(frame * 0.35);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Lower-Middle Red/Golden Glassmorphic Physics Telemetry Card */}
      <div
        style={{
          position: "absolute",
          top: 710,
          left: 56,
          right: 56,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 28px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.68)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: `0 16px 44px rgba(0, 0, 0, 0.65), 0 0 ${
            28 * pulse
          }px rgba(255, 59, 48, 0.28)`,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Top Formula Header: CORIOLIS ACCELERATION // F_c = -2m(Ω × v) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(245, 208, 97, 0.35)",
            paddingBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            CORIOLIS ACCELERATION //{" "}
            <span style={{ color: "#FFFFFF" }}>F_c = -2m(Ω × v)</span>
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(255, 59, 48, 0.24)",
              border: "1px solid #FF3B30",
              fontSize: 15,
              fontWeight: 900,
              color: "#FF3B30",
            }}
          >
            CROSS PRODUCT
          </span>
        </div>

        {/* Interactive Vector Diagram Canvas */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 245,
            borderRadius: 14,
            backgroundColor: "rgba(5, 8, 15, 0.58)",
            border: "1px solid rgba(255, 59, 48, 0.4)",
            overflow: "hidden",
          }}
        >
          <svg width={900} height={245}>
            {/* Y-Axis (Drive) and X-Axis (Coriolis Sense) */}
            <line
              x1={320}
              y1={15}
              x2={320}
              y2={230}
              stroke="rgba(0, 240, 255, 0.35)"
              strokeWidth={2}
              strokeDasharray="6 6"
            />
            <line
              x1={60}
              y1={125}
              x2={840}
              y2={125}
              stroke="rgba(255, 59, 48, 0.45)"
              strokeWidth={2}
              strokeDasharray="6 6"
            />

            {/* Vertical Velocity Vector (v) in Cyan */}
            <line
              x1={320}
              y1={125}
              x2={320}
              y2={34}
              stroke="#00F0FF"
              strokeWidth={4}
              style={{ filter: "drop-shadow(0 0 8px #00F0FF)" }}
            />
            <polygon points="320,20 311,38 329,38" fill="#00F0FF" />
            <text
              x={195}
              y={46}
              fill="#00F0FF"
              fontSize={17}
              fontWeight="bold"
            >
              VELOCITY (v)
            </text>

            {/* Angular Rotation Arc (Ω) in Golden Yellow */}
            <path
              d="M 135 95 A 48 48 0 1 1 135 155"
              fill="none"
              stroke="#F5D061"
              strokeWidth={4}
              style={{ filter: "drop-shadow(0 0 8px #F5D061)" }}
            />
            <polygon points="135,162 126,144 146,148" fill="#F5D061" />
            <text
              x={72}
              y={130}
              fill="#F5D061"
              fontSize={18}
              fontWeight="bold"
            >
              ROTATION (Ω)
            </text>

            {/* Red X-Axis Coriolis Force Arrow (F_c) Slamming Right */}
            <line
              x1={320}
              y1={125}
              x2={320 + slamX + 55}
              y2={125}
              stroke="#FF3B30"
              strokeWidth={6}
              style={{ filter: "drop-shadow(0 0 12px #FF3B30)" }}
            />
            <polygon
              points={`${320 + slamX + 72},125 ${320 + slamX + 50},113 ${
                320 + slamX + 50
              },137`}
              fill="#FF3B30"
            />
            <text
              x={380}
              y={46}
              fill="#FF3B30"
              fontSize={18}
              fontWeight="bold"
            >
              F_c SIDEWAYS SLAM (+X AXIS)
            </text>
          </svg>

          {/* Oscillating Proof Mass Slamming Sideways along Red X-Axis */}
          <div
            style={{
              position: "absolute",
              left: 265 + slamX,
              top: 90 + oscY * 0.45,
              width: 150,
              height: 76,
              borderRadius: 12,
              backgroundColor: "rgba(255, 59, 48, 0.28)",
              border: "3px solid #FF3B30",
              boxShadow: "0 0 28px rgba(255, 59, 48, 0.75)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#FFFFFF",
              }}
            >
              PROOF MASS
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#F5D061",
              }}
            >
              → ΔX SLAM
            </span>
          </div>

          {/* Right Impact Wall Marker */}
          <div
            style={{
              position: "absolute",
              right: 42,
              top: 40,
              bottom: 40,
              width: 8,
              borderRadius: 4,
              backgroundColor: "#FF3B30",
              boxShadow: "0 0 18px #FF3B30",
            }}
          />
        </div>

        {/* Bottom Alert Pill: CORIOLIS DEFLECTION DETECTED */}
        <div
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            backgroundColor: "rgba(255, 59, 48, 0.24)",
            border: "1.5px solid #FF3B30",
            boxShadow: `0 0 ${22 * pulse}px rgba(255, 59, 48, 0.5)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            ⚠ CORIOLIS DEFLECTION DETECTED
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            ORTHOGONAL X-FORCE ACTIVE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
