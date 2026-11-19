import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 1 (0:00 – 0:08 = 240 frames):
// Background public/shipwreck-sonar.mp4.
// Top HUD: SONAR_SCAN // SCAPA_FLOW_WRECK // DEPTH: 42m.
// Animate a cyan laser targeting reticle locking onto the hull (METALLURGY: 1918 PRE-ATOMIC STEEL).
export const Scene1ShipwreckSonarHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 240
  const { fps } = useVideoConfig();

  const lockSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isLocked = frame >= 38;
  const reticleScale = interpolate(lockSpring, [0, 1], [1.45, 1]);
  const reticleRotate = interpolate(lockSpring, [0, 1], [-45, 0]);
  const scanLineY = interpolate(frame % 90, [0, 90], [-110, 110]);
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.2);

  // Reticle center in upper-middle over the wreck hull while leaving full B-roll visible
  const cx = 540 + Math.sin(frame * 0.04) * 10;
  const cy = 620 + Math.cos(frame * 0.05) * 8;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Cyan Laser Targeting Reticle SVG */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Diagonal Cyan Laser Lock Beams from Upper Corners */}
        <line
          x1={120}
          y1={240}
          x2={cx - 88}
          y2={cy - 88}
          stroke="rgba(0, 240, 255, 0.45)"
          strokeWidth={2}
          strokeDasharray="10 6"
        />
        <line
          x1={960}
          y1={240}
          x2={cx + 88}
          y2={cy - 88}
          stroke="rgba(0, 240, 255, 0.45)"
          strokeWidth={2}
          strokeDasharray="10 6"
        />

        <g
          transform={`translate(${cx}, ${cy}) scale(${reticleScale}) rotate(${reticleRotate})`}
        >
          {/* Outer Rotating Sonar Ring */}
          <circle
            cx={0}
            cy={0}
            r={130}
            fill="rgba(0, 240, 255, 0.04)"
            stroke="rgba(0, 240, 255, 0.55)"
            strokeWidth={2.5}
            strokeDasharray="18 10"
          />
          {/* Inner Lock Ring */}
          <circle
            cx={0}
            cy={0}
            r={82}
            fill="none"
            stroke={isLocked ? "#00F0FF" : "#F5D061"}
            strokeWidth={3}
          />
          {/* Corner Brackets */}
          <path
            d="M -115 -75 L -115 -115 L -75 -115"
            fill="none"
            stroke="#00F0FF"
            strokeWidth={5}
          />
          <path
            d="M 75 -115 L 115 -115 L 115 -75"
            fill="none"
            stroke="#00F0FF"
            strokeWidth={5}
          />
          <path
            d="M -115 75 L -115 115 L -75 115"
            fill="none"
            stroke="#00F0FF"
            strokeWidth={5}
          />
          <path
            d="M 75 115 L 115 115 L 115 75"
            fill="none"
            stroke="#00F0FF"
            strokeWidth={5}
          />
          {/* Horizontal Laser Sweep Line inside Reticle */}
          <line
            x1={-105}
            y1={scanLineY}
            x2={105}
            y2={scanLineY}
            stroke="#00F0FF"
            strokeWidth={2.5}
            opacity={0.85}
          />
          {/* Center Bullseye Dot */}
          <circle cx={0} cy={0} r={7} fill="#F5D061" />
        </g>

        {/* Connector Line from Reticle down to Lower-Middle Glassmorphic Callout */}
        <line
          x1={cx}
          y1={cy + 130}
          x2={540}
          y2={860}
          stroke="rgba(0, 240, 255, 0.65)"
          strokeWidth={2.5}
          strokeDasharray="6 6"
        />
      </svg>

      {/* Glassmorphic Target Lock Callout Card (Lower-Middle, Transparent Blur) */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 84,
          right: 84,
          transform: `scale(${interpolate(lockSpring, [0, 1], [0.9, 1])})`,
          padding: "22px 32px",
          borderRadius: 18,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: `0 12px 36px rgba(0, 0, 0, 0.55), 0 0 ${
            24 * pulse
          }px rgba(0, 240, 255, 0.22)`,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 240, 255, 0.25)",
            paddingBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2.5,
            }}
          >
            TARGET_LOCK // SMS KRONPRINZ WILHELM HULL
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(0, 240, 255, 0.16)",
              border: "1px solid rgba(0, 240, 255, 0.45)",
              fontSize: 16,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            DEPTH: 42.0m
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
              textShadow: "0 0 16px rgba(0, 240, 255, 0.55)",
            }}
          >
            METALLURGY:{" "}
            <span style={{ color: "#F5D061" }}>1918 PRE-ATOMIC STEEL</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 17,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: 1.5,
          }}
        >
          <span>RADIONUCLIDE ISOTOPES: 0.00 Bq/kg</span>
          <span style={{ color: "#00F0FF" }}>SHIELDING GRADE: NASA / MRI</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
