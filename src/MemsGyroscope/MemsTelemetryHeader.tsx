import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Top Glassmorphic Telemetry Header for MEMS Gyroscope & Coriolis Effect:
// Scene 1 (0:00 – 0:08): IMU_SENSOR // 6-AXIS_MEMS_GYRO // ACTIVE
// Uses strict Cinema-First Glassmorphic styling:
// backgroundColor: 'rgba(5, 8, 15, 0.68)', backdropFilter: 'blur(12px)',
// border: '1px solid rgba(0, 240, 255, 0.35)'
export const MemsTelemetryHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  let mainTitle = "IMU_SENSOR // 6-AXIS_MEMS_GYRO // ACTIVE";
  let subLabel = "GIMBAL TELEMETRY // PITCH · ROLL · YAW LOCK";
  let dotColor = "#00F0FF";
  let borderColor = "rgba(0, 240, 255, 0.35)";
  let badgeText = "ACTIVE";

  if (seconds >= 8 && seconds < 18) {
    mainTitle = "MEMS_ARCHITECTURE // SILICON_PROOF_MASS";
    subLabel = "DIE SIZE: 0.8mm // GAP WIDTH: 2 MICRONS";
    dotColor = "#00F0FF";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "LOCKED: 2μm";
  } else if (seconds >= 18 && seconds < 30) {
    mainTitle = "DRIVE_AXIS // RESONANT_TUNING_FORK";
    subLabel = "RESONANT FREQUENCY: 28,000 Hz // Y-AXIS OSCILLATION";
    dotColor = "#00F0FF";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "28.0 kHz";
  } else if (seconds >= 30 && seconds < 42) {
    mainTitle = "CORIOLIS_EFFECT // F_c = -2m(Ω × v)";
    subLabel = "ORTHOGONAL DEFLECTION // X-AXIS SENSE ACTIVE";
    dotColor = "#FF3B30";
    borderColor = "rgba(255, 59, 48, 0.55)";
    badgeText = "DEFLECTION!";
  } else if (seconds >= 42 && seconds < 50) {
    mainTitle = "CAPACITIVE_SENSE // INTERLOCKING_COMB_DRIVE";
    subLabel = "Δd: 0.4 nm // ΔC: +14.8 fF -> SCREEN ROTATION";
    dotColor = "#F5D061";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "+14.8 fF";
  } else if (seconds >= 50) {
    mainTitle = "IMU_SENSOR // 6-AXIS_MEMS_GYRO // ACTIVE";
    subLabel = "CONTINUOUS ORIENTATION LOCK // SEAMLESS LOOP 0:00";
    dotColor = "#00F0FF";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "LOOP: SYNC";
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 48,
          right: 48,
          padding: "16px 26px",
          borderRadius: 16,
          backgroundColor: "rgba(5, 8, 15, 0.68)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.55)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: dotColor,
                boxShadow: `0 0 12px ${dotColor}`,
              }}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              {mainTitle}
            </span>
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: dotColor,
              letterSpacing: 1.5,
            }}
          >
            {badgeText}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.78)",
            letterSpacing: 1.2,
          }}
        >
          <span>{subLabel}</span>
          <span>T+{seconds.toFixed(2)}s</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
