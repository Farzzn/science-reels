import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 1 (0:00 - 0:08, 240 frames):
// Overlay a red blinking battery telemetry widget (BATTERY: 0.00V // POWER LOST)
// that switches to cyan (DATA RETENTION: 100% ACTIVE).
export const Scene1BatteryHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 240
  const { fps } = useVideoConfig();

  const isRetentionMode = frame >= 115; // Switch at ~3.8s

  const cardSpring = spring({
    frame: isRetentionMode ? frame - 115 : frame,
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  const fadeOut = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Blinking effect for red battery warning
  const redBlink = 0.55 + 0.45 * Math.sin(frame * 0.45);
  const accentColor = isRetentionMode ? "#00F0FF" : "#FF3B30";

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 250,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.88, 1])})`,
          width: 900,
          padding: "28px 38px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 5, 8, 0.86)",
          border: `3px solid ${accentColor}`,
          boxShadow: isRetentionMode
            ? "0 0 38px rgba(0, 240, 255, 0.5), inset 0 0 20px rgba(0, 240, 255, 0.18)"
            : `0 0 ${42 * redBlink}px rgba(255, 59, 48, 0.75), inset 0 0 22px rgba(255, 59, 48, 0.25)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "monospace",
        }}
      >
        {/* Battery / Memory Icon SVG */}
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ position: "relative", width: 92, height: 48 }}>
            <div
              style={{
                width: 82,
                height: 48,
                borderRadius: 8,
                border: `3px solid ${accentColor}`,
                padding: 5,
                display: "flex",
                gap: 4,
                alignItems: "center",
                opacity: isRetentionMode ? 1 : redBlink,
              }}
            >
              {isRetentionMode ? (
                <>
                  <div
                    style={{
                      flex: 1,
                      height: "100%",
                      backgroundColor: "#00F0FF",
                      borderRadius: 3,
                      boxShadow: "0 0 10px #00F0FF",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "100%",
                      backgroundColor: "#00F0FF",
                      borderRadius: 3,
                      boxShadow: "0 0 10px #00F0FF",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "100%",
                      backgroundColor: "#00F0FF",
                      borderRadius: 3,
                      boxShadow: "0 0 10px #00F0FF",
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    width: "18%",
                    height: "100%",
                    backgroundColor: "#FF3B30",
                    borderRadius: 3,
                  }}
                />
              )}
            </div>
            {/* Battery Terminal Tip */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 13,
                width: 7,
                height: 22,
                borderRadius: "0 4px 4px 0",
                backgroundColor: accentColor,
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: 3,
              }}
            >
              {isRetentionMode
                ? "NON-VOLATILE NAND_ARRAY // STATE_CHECK"
                : "SYSTEM POWER RAIL // CRITICAL_DROPOUT"}
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: accentColor,
                letterSpacing: 2,
                textShadow: `0 0 16px ${accentColor}`,
              }}
            >
              {isRetentionMode
                ? "DATA RETENTION: 100% ACTIVE"
                : "BATTERY: 0.00V // POWER LOST"}
            </span>
          </div>
        </div>

        {/* Status Indicator Dot */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: accentColor,
            boxShadow: `0 0 18px ${accentColor}`,
            opacity: isRetentionMode ? 1 : redBlink,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
