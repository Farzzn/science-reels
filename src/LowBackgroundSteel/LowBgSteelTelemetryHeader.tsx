import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Glassmorphic Top Telemetry Header:
// Scene 1 (0:00 - 0:08): SONAR_SCAN // SCAPA_FLOW_WRECK // DEPTH: 42m
// Updates per scene while keeping Cinema-First Glassmorphic HUD styling:
// backgroundColor: 'rgba(5, 8, 15, 0.65)', backdropFilter: 'blur(12px)',
// border: '1px solid rgba(0, 240, 255, 0.35)'
export const LowBgSteelTelemetryHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  let mainTitle = "SONAR_SCAN // SCAPA_FLOW_WRECK // DEPTH: 42m";
  let subLabel = "METALLURGY: 1918 PRE-ATOMIC STEEL // 0.00 Bq";
  let dotColor = "#00F0FF";
  let borderColor = "rgba(0, 240, 255, 0.35)";
  let badgeText = "LOCK: ACTIVE";

  if (seconds >= 8 && seconds < 13) {
    mainTitle = "TRINITY_TEST // JULY 16, 1945 // JORNADA DEL MUERTO";
    subLabel = "FIRST ATOMIC DETONATION // ATMOSPHERIC SPIKE";
    dotColor = "#FF3B30";
    borderColor = "rgba(255, 59, 48, 0.55)";
    badgeText = "YIELD: 21 KT";
  } else if (seconds >= 13 && seconds < 18) {
    mainTitle = "GLOBAL_FALLOUT // +500 ATMOSPHERIC DETONATIONS";
    subLabel = "STRATOSPHERIC RADIONUCLIDE ENVELOPE // 1945–1963";
    dotColor = "#FF3B30";
    borderColor = "rgba(255, 59, 48, 0.55)";
    badgeText = "FALLOUT: GLOBAL";
  } else if (seconds >= 18 && seconds < 30) {
    mainTitle = "FOUNDRY_SMELTING // BESSEMER / BOS OXYGEN INJECTION";
    subLabel = "AIRBORNE 60Co ISOTOPES TRAPPED IN MOLTEN IRON";
    dotColor = "#F5D061";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "60Co DETECTED";
  } else if (seconds >= 30 && seconds < 42) {
    mainTitle = "GAMMA_SPECTROMETRY // GEIGER-MULLER SHIELDING TEST";
    subLabel = "MODERN POST-1945 STEEL vs. PRE-1945 WRECK STEEL";
    dotColor = "#00F0FF";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "0.00 Bq REQUIRED";
  } else if (seconds >= 42 && seconds < 50) {
    mainTitle = "DEEP_SALVAGE // LOW-BACKGROUND STEEL RECOVERY";
    subLabel = "PRE-1945 BATTLESHIP HULL EXTRACTION // SCAPA FLOW";
    dotColor = "#F5D061";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "PURE FE-ALLOY";
  } else if (seconds >= 50) {
    mainTitle = "SONAR_SCAN // SCAPA_FLOW_WRECK // DEPTH: 42m";
    subLabel = "PRE-ATOMIC ARCHIVE // SEAMLESS LOOP SYNC 0:00";
    dotColor = "#00F0FF";
    borderColor = "rgba(0, 240, 255, 0.35)";
    badgeText = "LOOP: LOCKED";
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
          backgroundColor: "rgba(5, 8, 15, 0.65)",
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
