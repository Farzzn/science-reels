import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 4 (0:30 – 0:42 = 360 frames):
// Background public/medical-scanner.mp4.
// Render a split glassmorphic Geiger-Muller comparison widget:
// - Left side: POST-1945 MODERN STEEL (NOISE FLOOR: HIGH // SENSOR BLINDED) flashing red static waves
// - Right side: PRE-1945 WRECK STEEL (0.00 Bq // ULTRA-QUIET) showing a clean cyan baseline.
export const Scene4GeigerComparisonHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 360
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [352, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Left side chaotic red static wave path (width 400, height 130)
  const staticPts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = 14 + (i / 40) * 372;
    const spike =
      Math.sin(frame * 0.85 + i * 2.7) * 34 +
      Math.cos(frame * 1.3 - i * 4.1) * 22;
    const y = Math.max(12, Math.min(118, 65 + spike));
    staticPts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const redStaticPath = staticPts.join(" ");

  // Right side ultra-quiet clean cyan baseline path (width 400, height 130)
  const cyanBaselinePath = "M 14 65 L 386 65";

  const flashAlpha = 0.65 + 0.35 * Math.sin(frame * 0.55);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Split Glassmorphic Geiger-Muller Comparison Widget in Lower-Middle */}
      <div
        style={{
          position: "absolute",
          top: 725,
          left: 52,
          right: 52,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 24px",
          borderRadius: 22,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 16px 44px rgba(0, 0, 0, 0.65)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Top Banner */}
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
              fontSize: 19,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            GEIGER-MULLER DETECTOR // SHIELDING COMPARISON
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            GAMMA BACKGROUND TEST
          </span>
        </div>

        {/* Split Two-Column Comparison */}
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "space-between",
          }}
        >
          {/* LEFT SIDE: POST-1945 MODERN STEEL */}
          <div
            style={{
              flex: 1,
              padding: "18px 18px",
              borderRadius: 16,
              backgroundColor: "rgba(255, 59, 48, 0.14)",
              border: "1.5px solid rgba(255, 59, 48, 0.75)",
              boxShadow: `0 0 ${24 * flashAlpha}px rgba(255, 59, 48, 0.35)`,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              POST-1945 MODERN STEEL
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#FF3B30",
                letterSpacing: 1.2,
              }}
            >
              NOISE FLOOR: HIGH // SENSOR BLINDED
            </div>

            {/* Oscilloscope Window with Flashing Red Static Waves */}
            <div
              style={{
                width: "100%",
                height: 130,
                borderRadius: 10,
                backgroundColor: "rgba(5, 8, 15, 0.72)",
                border: "1px solid rgba(255, 59, 48, 0.45)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg width={400} height={130}>
                <line
                  x1={0}
                  y1={65}
                  x2={400}
                  y2={65}
                  stroke="rgba(255, 59, 48, 0.25)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <path
                  d={redStaticPath}
                  fill="none"
                  stroke="#FF3B30"
                  strokeWidth={3.5}
                  style={{ filter: "drop-shadow(0 0 8px #FF3B30)" }}
                />
              </svg>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: `rgba(255, 59, 48, ${0.22 + 0.15 * flashAlpha})`,
                border: "1px solid #FF3B30",
                textAlign: "center",
                fontSize: 16,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              ⚠ ⁶⁰Co STATIC BLINDS SENSOR
            </div>
          </div>

          {/* RIGHT SIDE: PRE-1945 WRECK STEEL */}
          <div
            style={{
              flex: 1,
              padding: "18px 18px",
              borderRadius: 16,
              backgroundColor: "rgba(0, 240, 255, 0.1)",
              border: "1.5px solid rgba(0, 240, 255, 0.65)",
              boxShadow: "0 0 22px rgba(0, 240, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              PRE-1945 WRECK STEEL
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#00F0FF",
                letterSpacing: 1.2,
              }}
            >
              0.00 Bq // ULTRA-QUIET
            </div>

            {/* Oscilloscope Window with Clean Cyan Baseline */}
            <div
              style={{
                width: "100%",
                height: 130,
                borderRadius: 10,
                backgroundColor: "rgba(5, 8, 15, 0.72)",
                border: "1px solid rgba(0, 240, 255, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg width={400} height={130}>
                <path
                  d={cyanBaselinePath}
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth={4}
                  style={{ filter: "drop-shadow(0 0 10px #00F0FF)" }}
                />
                <circle
                  cx={14 + ((frame * 4) % 372)}
                  cy={65}
                  r={6}
                  fill="#F5D061"
                  style={{ filter: "drop-shadow(0 0 8px #F5D061)" }}
                />
              </svg>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: "rgba(0, 240, 255, 0.18)",
                border: "1px solid #00F0FF",
                textAlign: "center",
                fontSize: 16,
                fontWeight: 900,
                color: "#F5D061",
                letterSpacing: 1.5,
              }}
            >
              ✓ ZERO FALLOUT // PURE SHIELD
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
