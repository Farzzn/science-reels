import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GlobalEntropyNodesHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 315 (70s to 80.5s)
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [305, 315], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const globalSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const nodes = [
    {
      city: "SAN FRANCISCO",
      source: "100 LAVA LAMPS",
      metric: "OPTICAL RGB CHAOS",
      color: "#F5D061",
    },
    {
      city: "LONDON",
      source: "DOUBLE PENDULUM",
      metric: "KINETIC ANGLES",
      color: "#00F0FF",
    },
    {
      city: "SINGAPORE",
      source: "URANIUM DECAY",
      metric: "QUANTUM GEIGER",
      color: "#39E508",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: 56,
        right: 56,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        transform: `scale(${globalSpring * punchScale})`,
        opacity: fadeOut,
      }}
    >
      {nodes.map((node) => (
        <div
          key={node.city}
          style={{
            padding: "24px 32px",
            borderRadius: 18,
            backgroundColor: "rgba(5, 5, 8, 0.85)",
            border: `2px solid ${node.color}`,
            boxShadow: "0 12px 32px rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                color: node.color,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              NODE // {node.city}
            </div>
            <div
              style={{
                fontSize: 34,
                color: "#FFFFFF",
                fontWeight: 900,
                marginTop: 4,
              }}
            >
              {node.source}
            </div>
          </div>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: node.color,
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {node.metric}
          </div>
        </div>
      ))}

      {/* 20% of the Entire Internet Badge (appears at 1:16 -> local frame 180) */}
      {frame >= 180 && (
        <div
          style={{
            marginTop: 12,
            padding: "26px 34px",
            borderRadius: 18,
            backgroundColor: "rgba(245, 208, 97, 0.18)",
            border: "3px solid #F5D061",
            boxShadow: "0 0 40px rgba(245, 208, 97, 0.45)",
            textAlign: "center",
            fontSize: 38,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
          }}
        >
          SECURES <span style={{ color: "#F5D061" }}>~20%</span> OF THE ENTIRE
          INTERNET
        </div>
      )}
    </div>
  );
};

export const TelemetryLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  let modeLabel = "CLOUDFLARE // LAVA_RAND_WALL";
  let locationLabel = "37.7749° N, 122.4194° W // SAN FRANCISCO HQ";
  let statusColor = "#F5D061";
  let rightMetric = "100 LAMPS ACTIVE";

  if (seconds >= 8 && seconds < 22) {
    modeLabel = "CPU // DETERMINISTIC_PRNG";
    locationLabel = "SILICON LOGIC GATE // SEED: 1709382";
    statusColor = "#00F0FF";
    rightMetric = "PREDICTABLE WAVE";
  } else if (seconds >= 22 && seconds < 38) {
    modeLabel = "SECURITY ALERT // SEED_CLONED";
    locationLabel = "MITM INTERCEPT // ZERO ENTROPY";
    statusColor = "#FF3B30";
    rightMetric = "BREACH DETECTED";
  } else if (seconds >= 38 && seconds < 52) {
    modeLabel = "OPTICAL SENSOR // 24/7 CAMERA FEED";
    locationLabel = "CLOUDFLARE LOBBY // FLUID TRACKING";
    statusColor = "#F5D061";
    rightMetric = "CHAOS STREAMING";
  } else if (seconds >= 52 && seconds < 70) {
    modeLabel = "PIXEL_TO_HEX // THERMAL_ENTROPY";
    locationLabel = "6x6 RGB MATRIX -> SHA-256 CSPRNG";
    statusColor = "#F5D061";
    rightMetric = "UNBREAKABLE HASH";
  } else if (seconds >= 70) {
    modeLabel = "GLOBAL ENTROPY // 20% OF INTERNET";
    locationLabel = "SF: LAVA  |  LDN: PENDULUM  |  SGP: URANIUM";
    statusColor = "#00F0FF";
    rightMetric = "TLS_SECURED: TRUE";
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
      }}
    >
      {/* Top Telemetry Bar */}
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 48,
          right: 48,
          padding: "18px 28px",
          borderRadius: 16,
          backgroundColor: "rgba(5, 5, 8, 0.82)",
          border: `2px solid ${statusColor}`,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
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
              {modeLabel}
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
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: 1.5,
          }}
        >
          <span>{locationLabel}</span>
          <span>T+{seconds.toFixed(2)}s</span>
        </div>
      </div>

      {/* Strict Sequence Unmounting for Global Nodes HUD (1:10 to 1:20.5 = Frames 2100 to 2415) */}
      <Sequence from={2100} durationInFrames={315}>
        <GlobalEntropyNodesHUD />
      </Sequence>
    </AbsoluteFill>
  );
};
