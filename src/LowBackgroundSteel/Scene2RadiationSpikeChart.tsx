import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 2 (0:08 – 0:18 = 300 frames):
// Play public/trinity-1945.mp4 (0:08–0:13) and public/earth-fallout.mp4 (0:13–0:18).
// Overlay a sleek glassmorphic line chart (GLOBAL ATMOSPHERIC BACKGROUND RADIATION)
// that stays flat from 1900 to 1944, then spikes violently in crimson red at
// JULY 16, 1945 (TRINITY TEST + 500 DETONATIONS).
export const Scene2RadiationSpikeChart: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 300
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [292, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chart progress:
  // Frames 0..65: draws flat cyan baseline from 1900 to 1944
  // Frame 65 (~0:10.2s, right on "July 16, 1945"): spikes violently in crimson red
  // Frames 65..220: continues jagged high fallout oscillation across +500 detonations
  const flatProgress = interpolate(frame, [8, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spikeProgress = interpolate(frame, [65, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isSpiked = frame >= 65;
  const spikeAlertSpring = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 11, stiffness: 150 },
  });

  // Chart dimensions inside glassmorphic card: width 840, height 230
  // X: 0 -> 1900, 440 -> 1944, 465 -> July 16 1945 spike, 820 -> 1963+
  const flatEndX = 40 + flatProgress * 400; // 40 to 440
  const baselineY = 195;

  // Crimson spike points from x=440 to x=810
  const spikeKeyframes = [
    { x: 440, y: 195 },
    { x: 468, y: 26 }, // Violent Trinity + early tests spike
    { x: 505, y: 58 },
    { x: 545, y: 18 }, // Peak thermonuclear atmospheric tests
    { x: 590, y: 42 },
    { x: 640, y: 24 },
    { x: 695, y: 48 },
    { x: 750, y: 34 },
    { x: 810, y: 40 },
  ];

  const activeSpikePoints: Array<{ x: number; y: number }> = [];
  if (spikeProgress > 0) {
    const maxX = 440 + spikeProgress * (810 - 440);
    for (let i = 0; i < spikeKeyframes.length; i++) {
      const pt = spikeKeyframes[i];
      if (pt.x <= maxX) {
        activeSpikePoints.push(pt);
      } else if (i > 0) {
        const prev = spikeKeyframes[i - 1];
        const t = (maxX - prev.x) / (pt.x - prev.x);
        activeSpikePoints.push({
          x: maxX,
          y: prev.y + t * (pt.y - prev.y),
        });
        break;
      }
    }
  }

  const crimsonPath =
    activeSpikePoints.length > 1
      ? activeSpikePoints
          .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
          .join(" ")
      : "";

  const crimsonAreaPath =
    activeSpikePoints.length > 1
      ? `${crimsonPath} L ${activeSpikePoints[activeSpikePoints.length - 1].x.toFixed(1)} ${baselineY} L 440 ${baselineY} Z`
      : "";

  const currentYear = !isSpiked
    ? Math.round(interpolate(flatProgress, [0, 1], [1900, 1944]))
    : Math.round(interpolate(spikeProgress, [0, 1], [1945, 1963]));

  const detCount = !isSpiked
    ? 0
    : Math.min(
        528,
        Math.max(1, Math.round(interpolate(spikeProgress, [0, 1], [1, 528]))),
      );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Lower-Middle Glassmorphic Line Chart Card — B-Roll Mushroom Cloud & Earth Fallout Fully Visible Above */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 64,
          right: 64,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          padding: "24px 30px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${
            isSpiked ? "rgba(255, 59, 48, 0.6)" : "rgba(0, 240, 255, 0.35)"
          }`,
          boxShadow: isSpiked
            ? "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 32px rgba(255, 59, 48, 0.28)"
            : "0 14px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Card Header */}
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
              letterSpacing: 1.8,
            }}
          >
            GLOBAL ATMOSPHERIC BACKGROUND RADIATION
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: isSpiked
                ? "rgba(255, 59, 48, 0.24)"
                : "rgba(0, 240, 255, 0.16)",
              border: `1px solid ${isSpiked ? "#FF3B30" : "#00F0FF"}`,
              fontSize: 18,
              fontWeight: 900,
              color: isSpiked ? "#FF3B30" : "#00F0FF",
              letterSpacing: 1.5,
            }}
          >
            YEAR: {currentYear}
          </span>
        </div>

        {/* SVG Line Chart */}
        <div style={{ position: "relative", width: "100%", height: 235 }}>
          <svg width={880} height={235} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="crimsonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 59, 48, 0.52)" />
                <stop offset="100%" stopColor="rgba(255, 59, 48, 0.02)" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[40, 92, 144, 195].map((gy) => (
              <line
                key={gy}
                x1={40}
                y1={gy}
                x2={830}
                y2={gy}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={1}
                strokeDasharray="6 6"
              />
            ))}

            {/* 1945 Vertical Threshold Line */}
            <line
              x1={440}
              y1={14}
              x2={440}
              y2={205}
              stroke={isSpiked ? "#FF3B30" : "rgba(0, 240, 255, 0.35)"}
              strokeWidth={2}
              strokeDasharray="6 4"
            />

            {/* Flat Cyan Pre-Atomic Baseline (1900 - 1944) */}
            <line
              x1={40}
              y1={baselineY}
              x2={flatEndX}
              y2={baselineY}
              stroke="#00F0FF"
              strokeWidth={5}
              style={{ filter: "drop-shadow(0 0 10px #00F0FF)" }}
            />

            {/* Crimson Area Under Spike */}
            {crimsonAreaPath && <path d={crimsonAreaPath} fill="url(#crimsonGrad)" />}

            {/* Violent Crimson Red Spike (July 16, 1945 -> +500 Detonations) */}
            {crimsonPath && (
              <path
                d={crimsonPath}
                fill="none"
                stroke="#FF3B30"
                strokeWidth={6}
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 14px #FF3B30)" }}
              />
            )}

            {/* Glowing Cursor Dot */}
            {!isSpiked ? (
              <circle
                cx={flatEndX}
                cy={baselineY}
                r={8}
                fill="#00F0FF"
                style={{ filter: "drop-shadow(0 0 10px #00F0FF)" }}
              />
            ) : (
              activeSpikePoints.length > 0 && (
                <circle
                  cx={activeSpikePoints[activeSpikePoints.length - 1].x}
                  cy={activeSpikePoints[activeSpikePoints.length - 1].y}
                  r={9}
                  fill="#FF3B30"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                  style={{ filter: "drop-shadow(0 0 14px #FF3B30)" }}
                />
              )
            )}

            {/* X-Axis Labels */}
            <text x={40} y={225} fill="rgba(255,255,255,0.75)" fontSize={16} fontWeight="bold">
              1900 (0.00 Bq)
            </text>
            <text x={355} y={225} fill="#00F0FF" fontSize={16} fontWeight="bold">
              1944 (PRE-ATOMIC)
            </text>
            <text x={595} y={225} fill="#FF3B30" fontSize={16} fontWeight="bold">
              POST-1945 FALLOUT ERA
            </text>
          </svg>

          {/* Spike Callout Pill Inside Chart */}
          {isSpiked && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 38,
                transform: `scale(${spikeAlertSpring})`,
                padding: "10px 18px",
                borderRadius: 10,
                backgroundColor: "rgba(255, 59, 48, 0.25)",
                border: "1.5px solid #FF3B30",
                boxShadow: "0 0 20px rgba(255, 59, 48, 0.5)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: 1.5,
                }}
              >
                ⚠ JULY 16, 1945 // TRINITY TEST
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#F5D061",
                  letterSpacing: 1.5,
                }}
              >
                +{detCount} ATMOSPHERIC DETONATIONS
              </span>
            </div>
          )}
        </div>

        {/* Footer Telemetry Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 6,
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)" }}>
            ISOTOPE SIGNATURE:{" "}
            <span style={{ color: isSpiked ? "#FF3B30" : "#00F0FF" }}>
              {isSpiked ? "COBALT-60 / CESIUM-137 SPIKE" : "NATURAL BASELINE"}
            </span>
          </span>
          <span style={{ color: "#F5D061" }}>
            {isSpiked ? "PLANETARY FALLOUT: 100%" : "CONTAMINATION: 0.0%"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
