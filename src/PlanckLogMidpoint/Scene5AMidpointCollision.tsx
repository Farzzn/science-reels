import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 5A (0:42 – 0:44 = 60 frames — Pure #000000 Collision Animation):
// The cyan and gold markers slam together at the exact center of the screen
// (T = 31.0 SECONDS // MIDPOINT COLLISION: 10^-4 METERS / 0.1 mm)
// with a golden shockwave ring.
export const Scene5AMidpointCollision: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 96 (42.23s – 45.43s)
  const { fps } = useVideoConfig();

  const impactFrame = 26;
  const isImpacted = frame >= impactFrame;

  // Slam approach (frames 0 -> 26)
  const slamProgress = interpolate(frame, [0, impactFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Impact spring after frame 26
  const impactSpring = spring({
    frame: Math.max(0, frame - impactFrame),
    fps,
    config: { damping: 11, stiffness: 180, mass: 0.7 },
  });

  // Expanding golden shockwave rings
  const ring1Radius = interpolate(frame, [impactFrame, 88], [40, 490], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring1Opacity = interpolate(frame, [impactFrame, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ring2Radius = interpolate(frame, [impactFrame + 6, 92], [30, 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring2Opacity = interpolate(frame, [impactFrame + 6, 92], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [89, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center collision point at (540, 585) — centered cleanly above the collision telemetry card
  const centerX = 540;
  const centerY = 585;

  // Gold drops from y=220 to centerY; Cyan climbs from y=950 to centerY
  const goldY = interpolate(slamProgress, [0, 1], [220, centerY]);
  const cyanY = interpolate(slamProgress, [0, 1], [950, centerY]);

  const timeVal = interpolate(frame, [0, impactFrame], [24.0, 31.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }).toFixed(1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "monospace",
        opacity: fadeOut,
        pointerEvents: "none",
      }}
    >
      {/* Top Stopwatch Banner: T = 31.0 SECONDS */}
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 56,
          right: 56,
          padding: "20px 28px",
          borderRadius: 18,
          backgroundColor: "#000000",
          border: `2px solid ${isImpacted ? "#F5D061" : "#00F0FF"}`,
          boxShadow: isImpacted
            ? "0 0 38px rgba(245, 208, 97, 0.45)"
            : "0 0 24px rgba(0, 240, 255, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#00F0FF",
            letterSpacing: 1.5,
            whiteSpace: "nowrap",
          }}
        >
          LOGARITHMIC CONVERGENCE // 31 STEPS
        </span>
        <span
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#F5D061",
            letterSpacing: 1.5,
            whiteSpace: "nowrap",
            textShadow: "0 0 18px #F5D061",
          }}
        >
          T = {timeVal} SECONDS
        </span>
      </div>

      {/* Center Collision & Shockwave SVG */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Vertical Spine Guide */}
        <line
          x1={centerX}
          y1={210}
          x2={centerX}
          y2={960}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={3}
          strokeDasharray="8 8"
        />

        {/* Gold Trail from Top */}
        <line
          x1={centerX}
          y1={220}
          x2={centerX}
          y2={goldY}
          stroke="#F5D061"
          strokeWidth={8}
          style={{ filter: "drop-shadow(0 0 16px #F5D061)" }}
        />

        {/* Cyan Trail from Bottom */}
        <line
          x1={centerX}
          y1={950}
          x2={centerX}
          y2={cyanY}
          stroke="#00F0FF"
          strokeWidth={8}
          style={{ filter: "drop-shadow(0 0 16px #00F0FF)" }}
        />

        {/* Pre-impact Moving Markers */}
        {!isImpacted && (
          <>
            <g transform={`translate(${centerX}, ${goldY})`}>
              <circle
                cx={0}
                cy={0}
                r={26}
                fill="#F5D061"
                style={{ filter: "drop-shadow(0 0 22px #F5D061)" }}
              />
              <text
                x={42}
                y={8}
                fill="#F5D061"
                fontSize={24}
                fontWeight="bold"
              >
                FRIEND (÷10/s)
              </text>
            </g>
            <g transform={`translate(${centerX}, ${cyanY})`}>
              <circle
                cx={0}
                cy={0}
                r={26}
                fill="#00F0FF"
                style={{ filter: "drop-shadow(0 0 22px #00F0FF)" }}
              />
              <text
                x={-42}
                y={8}
                textAnchor="end"
                fill="#00F0FF"
                fontSize={24}
                fontWeight="bold"
              >
                YOU (×10/s)
              </text>
            </g>
          </>
        )}

        {/* Golden Shockwave Rings Upon Collision */}
        {isImpacted && (
          <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Primary Golden Shockwave Ring */}
            <circle
              cx={0}
              cy={0}
              r={ring1Radius}
              fill="none"
              stroke="#F5D061"
              strokeWidth={10 * ring1Opacity + 2}
              opacity={ring1Opacity}
              style={{ filter: "drop-shadow(0 0 28px #F5D061)" }}
            />
            {/* Secondary Cyan/Gold Harmonic Shockwave Ring */}
            <circle
              cx={0}
              cy={0}
              r={ring2Radius}
              fill="none"
              stroke="#00F0FF"
              strokeWidth={6 * ring2Opacity + 1.5}
              opacity={ring2Opacity}
              style={{ filter: "drop-shadow(0 0 20px #00F0FF)" }}
            />
            {/* Core Collision Singularity */}
            <circle
              cx={0}
              cy={0}
              r={interpolate(impactSpring, [0, 1], [15, 64])}
              fill="rgba(245, 208, 97, 0.22)"
              stroke="#F5D061"
              strokeWidth={5}
              style={{ filter: "drop-shadow(0 0 32px #F5D061)" }}
            />
            <circle
              cx={0}
              cy={0}
              r={24}
              fill="#FFFFFF"
              stroke="#00F0FF"
              strokeWidth={5}
              style={{ filter: "drop-shadow(0 0 24px #00F0FF)" }}
            />
          </g>
        )}
      </svg>

      {/* Center Collision Telemetry Card Snapping In on Impact */}
      {isImpacted && (
        <div
          style={{
            position: "absolute",
            top: 970,
            left: 52,
            right: 52,
            transform: `scale(${interpolate(impactSpring, [0, 1], [0.78, 1])})`,
            padding: "28px 32px",
            borderRadius: 24,
            backgroundColor: "#000000",
            border: "3px solid #F5D061",
            boxShadow:
              "0 0 50px rgba(245, 208, 97, 0.45), inset 0 0 30px rgba(0, 240, 255, 0.16)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#00F0FF",
              letterSpacing: 2.5,
            }}
          >
            T = 31.0 SECONDS // EXACT GEOMETRIC MEAN
          </span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
              textAlign: "center",
              textShadow: "0 0 22px rgba(245, 208, 97, 0.65)",
            }}
          >
            MIDPOINT COLLISION: 10^-4 METERS / 0.1 mm
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1.5,
            }}
          >
            WIDTH OF A SINGLE HUMAN EGG CELL
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
