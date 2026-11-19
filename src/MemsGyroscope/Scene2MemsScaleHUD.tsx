import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 2 (0:08 – 0:18 = 300 frames):
// Background public/mems-grain-macro.mp4.
// Overlay a glassmorphic scale-comparison card (DIE SIZE: 0.8mm // GAP WIDTH: 2 MICRONS)
// with a cyan laser bounding box locking onto the suspended silicon proof mass.
export const Scene2MemsScaleHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 300
  const { fps } = useVideoConfig();

  const lockSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [292, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const boxScale = interpolate(lockSpring, [0, 1], [1.35, 1]);
  const scanY = interpolate(frame % 75, [0, 75], [0, 260]);
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.2);

  // Cyan Laser Bounding Box over the suspended silicon proof mass in upper-center
  const bx = 340 + Math.sin(frame * 0.05) * 6;
  const by = 420 + Math.cos(frame * 0.05) * 6;
  const bw = 400;
  const bh = 260;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Cyan Laser Bounding Box Locking onto Suspended Silicon Proof Mass */}
      <div
        style={{
          position: "absolute",
          left: bx,
          top: by,
          width: bw,
          height: bh,
          transform: `scale(${boxScale})`,
          border: "2px solid rgba(0, 240, 255, 0.7)",
          boxShadow: `0 0 ${26 * pulse}px rgba(0, 240, 255, 0.45), inset 0 0 18px rgba(0, 240, 255, 0.15)`,
          borderRadius: 10,
        }}
      >
        {/* Top Tag Pill */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: 0,
            padding: "4px 12px",
            borderRadius: 6,
            backgroundColor: "#00F0FF",
            color: "#05080F",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          LOCK // SUSPENDED SILICON PROOF MASS
        </div>

        {/* Corner Laser Brackets */}
        <div
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            width: 28,
            height: 28,
            borderTop: "5px solid #F5D061",
            borderLeft: "5px solid #F5D061",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 28,
            height: 28,
            borderTop: "5px solid #F5D061",
            borderRight: "5px solid #F5D061",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -4,
            left: -4,
            width: 28,
            height: 28,
            borderBottom: "5px solid #F5D061",
            borderLeft: "5px solid #F5D061",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 28,
            height: 28,
            borderBottom: "5px solid #F5D061",
            borderRight: "5px solid #F5D061",
          }}
        />

        {/* Laser Horizontal Scan Beam */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            backgroundColor: "#00F0FF",
            boxShadow: "0 0 12px #00F0FF",
          }}
        />
      </div>

      {/* Leader Line to Glassmorphic Scale-Comparison Card */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <line
          x1={bx + bw / 2}
          y1={by + bh}
          x2={540}
          y2={790}
          stroke="rgba(0, 240, 255, 0.65)"
          strokeWidth={2.5}
          strokeDasharray="8 6"
        />
      </svg>

      {/* Glassmorphic Scale-Comparison Card (DIE SIZE: 0.8mm // GAP WIDTH: 2 MICRONS) */}
      <div
        style={{
          position: "absolute",
          top: 790,
          left: 64,
          right: 64,
          transform: `scale(${interpolate(lockSpring, [0, 1], [0.92, 1])})`,
          padding: "24px 30px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.68)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
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
              fontSize: 21,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1.8,
            }}
          >
            DIE SIZE: <span style={{ color: "#00F0FF" }}>0.8mm</span> // GAP
            WIDTH: <span style={{ color: "#F5D061" }}>2 MICRONS</span>
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(0, 240, 255, 0.16)",
              border: "1px solid #00F0FF",
              fontSize: 16,
              fontWeight: 900,
              color: "#00F0FF",
            }}
          >
            LITHOGRAPHY: 3D-MEMS
          </span>
        </div>

        {/* Visual Scale Bars: Human Hair (75 μm) vs MEMS Trench Gap (2 μm) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                fontWeight: 800,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <span>HUMAN HAIR DIAMETER (REFERENCE)</span>
              <span>75.0 MICRONS (μm)</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 14,
                borderRadius: 7,
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                fontWeight: 900,
                color: "#F5D061",
              }}
            >
              <span>SUSPENDED SILICON PROOF MASS TRENCH GAP</span>
              <span style={{ color: "#00F0FF" }}>2.0 MICRONS (37x THINNER)</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 14,
                borderRadius: 7,
                backgroundColor: "rgba(5, 8, 15, 0.7)",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                padding: 2,
              }}
            >
              <div
                style={{
                  width: "6%",
                  height: "100%",
                  borderRadius: 5,
                  backgroundColor: "#F5D061",
                  boxShadow: "0 0 12px #F5D061",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.8)",
            paddingTop: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span>ETCHED FROM SINGLE-CRYSTAL SILICON</span>
          <span style={{ color: "#00F0FF" }}>ZERO ROTATING BEARINGS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
