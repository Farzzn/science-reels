import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Top HUD Header: Keep our signature top telemetry bar (NAND_FLASH // QUANTUM_TUNNEL_ARRAY),
// updating its status per scene.
export const QuantumTelemetryHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  const mainTitle = "NAND_FLASH // QUANTUM_TUNNEL_ARRAY";
  let subLabel = "DEAD PHONE X-RAY // ZERO BATTERY";
  let statusColor = "#FF3B30";
  let rightMetric = "POWER: 0.00V";

  if (seconds >= 3.8 && seconds < 8) {
    subLabel = "NON-VOLATILE STORAGE // PHOTOS INTACT";
    statusColor = "#00F0FF";
    rightMetric = "RETENTION: 100%";
  } else if (seconds >= 8 && seconds < 14) {
    subLabel = "DRAM CAPACITOR CELLS // HOLDING CHARGE";
    statusColor = "#00F0FF";
    rightMetric = "VOLATILE RAM: ON";
  } else if (seconds >= 14 && seconds < 22) {
    subLabel = "DRAM CAPACITOR DRAIN // BITS RESET TO 0";
    statusColor = "#FF3B30";
    rightMetric = "DATA LOST";
  } else if (seconds >= 22 && seconds < 36) {
    subLabel = "3D NAND CATHEDRAL // FLOATING GATE TRAP";
    statusColor = "#F5D061";
    rightMetric = "ISOLATED CAGE";
  } else if (seconds >= 36 && seconds < 52) {
    subLabel = "CLASSICAL PHYSICS MODE // SiO2 BARRIER (10nm)";
    statusColor = "#00F0FF";
    rightMetric = "PENETRATION: 0%";
  } else if (seconds >= 52 && seconds < 70) {
    subLabel = "QUANTUM TUNNELING ENGAGED // V_PROG: +20V";
    statusColor = "#F5D061";
    rightMetric = "BIT STATE: LOCKED";
  } else if (seconds >= 70 && seconds < 78) {
    subLabel = "P/E CYCLES: 10,000 // OXIDE BREAKDOWN";
    statusColor = "#FF3B30";
    rightMetric = "BARRIER WEAR";
  } else if (seconds >= 78) {
    subLabel = "SSD LIFESPAN LIMIT // SEAMLESS LOOP";
    statusColor = "#00F0FF";
    rightMetric = "LOOP_SYNC: 0:00";
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
          padding: "18px 28px",
          borderRadius: 16,
          backgroundColor: "rgba(5, 5, 8, 0.85)",
          border: `2px solid ${statusColor}`,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
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
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: statusColor,
                boxShadow: `0 0 12px ${statusColor}`,
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 2,
              }}
            >
              {mainTitle}
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: statusColor,
              letterSpacing: 2,
            }}
          >
            {rightMetric}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 17,
            color: "rgba(255, 255, 255, 0.72)",
            letterSpacing: 1.5,
          }}
        >
          <span>{subLabel}</span>
          <span>T+{seconds.toFixed(2)}s</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
