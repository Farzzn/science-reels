import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 5A (0:42 – 0:50 = 240 frames): Salvage Crane Recovery HUD
const SalvageCraneHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 240
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tonnage = interpolate(frame, [10, 200], [12.4, 148.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }).toFixed(1);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Lower-Middle Glassmorphic Salvage Telemetry Card */}
      <div
        style={{
          position: "absolute",
          top: 840,
          left: 72,
          right: 72,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 30px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
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
              fontWeight: 900,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            MARINE SALVAGE // PRE-1945 ARMOR PLATE
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(245, 208, 97, 0.18)",
              border: "1px solid #F5D061",
              fontSize: 16,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            EXTRACTED: {tonnage} TONS
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
            }}
          >
            LOW-BACKGROUND STEEL:{" "}
            <span style={{ color: "#00F0FF" }}>0.00 Bq PURE</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <span>SHIELDING WATER COLUMN: 42m NORTH SEA</span>
          <span style={{ color: "#F5D061" }}>ZERO FALLOUT EXPOSURE</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5B (0:50 – 0:56 = 180 frames): Reverse Sonar Loop Sync HUD
const ReverseSonarLoopHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 180
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Smoothly converge reticle to match Scene 1's opening geometry
  const cx = 540;
  const cy = 620;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
      }}
    >
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g
          transform={`translate(${cx}, ${cy}) scale(${interpolate(
            enterSpring,
            [0, 1],
            [1.18, 1],
          )})`}
        >
          <circle
            cx={0}
            cy={0}
            r={130}
            fill="rgba(0, 240, 255, 0.04)"
            stroke="rgba(0, 240, 255, 0.55)"
            strokeWidth={2.5}
            strokeDasharray="18 10"
          />
          <circle
            cx={0}
            cy={0}
            r={82}
            fill="none"
            stroke="#00F0FF"
            strokeWidth={3}
          />
          <circle cx={0} cy={0} r={7} fill="#F5D061" />
        </g>
      </svg>

      {/* Glassmorphic Pre-Atomic Archive Pill */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 84,
          right: 84,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 32px",
          borderRadius: 18,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
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
            SCAPA FLOW UNDERWATER VAULT // 1918–1945
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            PRE-NUCLEAR TIME CAPSULE:{" "}
            <span style={{ color: "#F5D061" }}>UNCONTAMINATED</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene5SalvageAndLoopHUD: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Strictly unmounts at 0:50 (local frame 240) */}
      <Sequence from={0} durationInFrames={240}>
        <SalvageCraneHUD />
      </Sequence>
      {/* Strictly mounts from 0:50 to 0:56 (local frames 240 to 420) */}
      <Sequence from={240} durationInFrames={180}>
        <ReverseSonarLoopHUD />
      </Sequence>
    </AbsoluteFill>
  );
};
