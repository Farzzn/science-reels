import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 3 (0:22 - 0:36, 420 frames):
// Background public/nand-cathedral.mp4. Draw a crisp 2D/SVG schematic callout box
// highlighting a single FLOATING GATE TRAP with glowing golden particles locked
// inside cyan oxide walls.
export const Scene3FloatingGateCallout: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 420
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [412, 420], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boxSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.12);

  // 14 trapped golden electrons bouncing inside the floating gate chamber
  const electrons = Array.from({ length: 14 }).map((_, idx) => {
    const col = idx % 7;
    const row = Math.floor(idx / 7);
    const x =
      85 +
      col * 78 +
      Math.sin(frame * 0.14 + idx * 1.7) * 18;
    const y =
      52 +
      row * 56 +
      Math.cos(frame * 0.17 + idx * 2.3) * 14;
    return { id: idx, x, y };
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        transform: `scale(${punchScale})`,
        opacity: fadeOut,
      }}
    >
      {/* Target Reticle on the 3D NAND Cathedral Background */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Leader Lines from Target Reticle to Schematic Callout Box */}
        <circle
          cx={540}
          cy={380}
          r={48}
          fill="rgba(0, 240, 255, 0.12)"
          stroke="#00F0FF"
          strokeWidth={3}
          strokeDasharray="10 6"
        />
        <circle cx={540} cy={380} r={8} fill="#F5D061" />
        <line
          x1={492}
          y1={380}
          x2={140}
          y2={520}
          stroke="#00F0FF"
          strokeWidth={2.5}
          strokeDasharray="8 6"
          opacity={boxSpring}
        />
        <line
          x1={588}
          y1={380}
          x2={940}
          y2={520}
          stroke="#00F0FF"
          strokeWidth={2.5}
          strokeDasharray="8 6"
          opacity={boxSpring}
        />
      </svg>

      {/* Center 2D/SVG Schematic Callout Box */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 80,
          right: 80,
          transform: `scale(${boxSpring})`,
          padding: "32px 38px",
          borderRadius: 24,
          backgroundColor: "rgba(5, 5, 8, 0.9)",
          border: "3px solid #00F0FF",
          boxShadow: `0 0 ${42 * pulse}px rgba(0, 240, 255, 0.5), inset 0 0 28px rgba(0, 240, 255, 0.15)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Callout Header */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
            borderBottom: "2px solid rgba(0, 240, 255, 0.3)",
            paddingBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 3,
            }}
          >
            SCHEMATIC // FLOATING GATE TRAP
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            ISOLATION: 100% SEALED
          </span>
        </div>

        {/* Control Gate Top Bar */}
        <div
          style={{
            width: 720,
            padding: "12px 0",
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "2px solid rgba(255, 255, 255, 0.35)",
            textAlign: "center",
            fontSize: 20,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: 3,
            marginBottom: 14,
          }}
        >
          CONTROL GATE ELECTRODE
        </div>

        {/* Top Cyan Oxide Wall */}
        <div
          style={{
            width: 720,
            height: 36,
            backgroundColor: "rgba(0, 240, 255, 0.25)",
            border: "3px solid #00F0FF",
            boxShadow: "0 0 22px rgba(0, 240, 255, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 17,
            fontWeight: 900,
            color: "#00F0FF",
            letterSpacing: 3,
          }}
        >
          TOP SiO₂ OXIDE INSULATOR WALL
        </div>

        {/* Floating Gate Chamber with Locked Golden Particles */}
        <div
          style={{
            width: 720,
            height: 165,
            backgroundColor: "rgba(245, 208, 97, 0.09)",
            borderLeft: "6px solid #00F0FF",
            borderRight: "6px solid #00F0FF",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 18,
              fontSize: 18,
              fontWeight: 900,
              color: "rgba(245, 208, 97, 0.85)",
              letterSpacing: 2,
            }}
          >
            FLOATING GATE CHAMBER (SOLID SILICON CAGE)
          </div>

          {electrons.map((el) => (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#F5D061",
                boxShadow: "0 0 18px #F5D061, 0 0 6px #FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 14,
                fontWeight: 900,
                color: "#050508",
              }}
            >
              e⁻
            </div>
          ))}
        </div>

        {/* Bottom Cyan Oxide Wall */}
        <div
          style={{
            width: 720,
            height: 36,
            backgroundColor: "rgba(0, 240, 255, 0.25)",
            border: "3px solid #00F0FF",
            boxShadow: "0 0 22px rgba(0, 240, 255, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 17,
            fontWeight: 900,
            color: "#00F0FF",
            letterSpacing: 3,
          }}
        >
          BOTTOM SiO₂ GLASS OXIDE WALL (10nm)
        </div>

        {/* Footer Callout Badge */}
        <div
          style={{
            marginTop: 24,
            padding: "14px 32px",
            borderRadius: 12,
            backgroundColor: "rgba(245, 208, 97, 0.16)",
            border: "2px solid #F5D061",
            fontSize: 26,
            fontWeight: 900,
            color: "#F5D061",
            letterSpacing: 3,
          }}
        >
          NO WIRES IN OR OUT // TRAPPED FOR 10+ YEARS
        </div>
      </div>
    </AbsoluteFill>
  );
};
