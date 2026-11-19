import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 5A (1:10 to 1:18 = 240 frames):
// Animate the cyan SiO2 barrier cracking/degrading in crimson red
// (P/E CYCLES: 10,000 // OXIDE BREAKDOWN).
export const Scene5OxideWear: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 240
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // P/E Cycles counter ticking up to 10,000
  const peCycles = Math.min(
    10000,
    Math.floor(
      interpolate(frame, [0, 120], [1200, 10000], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  const crackProgress = interpolate(frame, [15, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isBrokenDown = frame >= 95;
  const alertSpring = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const pulse = 0.65 + 0.35 * Math.sin(frame * 0.35);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050508",
        overflow: "hidden",
        fontFamily: "monospace",
        transform: `scale(${punchScale})`,
        opacity: fadeOut,
      }}
    >
      {/* Dark Grid + Crimson Breakdown Glow */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 59, 48, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 59, 48, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "54px 54px",
          backgroundPosition: `0px ${(frame * 1.2) % 54}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 59, 48, 0.22) 0%, rgba(5, 5, 8, 0.95) 75%)",
        }}
      />

      {/* Top P/E Cycle Counter Banner */}
      <div
        style={{
          position: "absolute",
          top: 225,
          left: 60,
          right: 60,
          padding: "22px 32px",
          borderRadius: 16,
          backgroundColor: "rgba(255, 59, 48, 0.16)",
          border: "3px solid #FF3B30",
          boxShadow: `0 0 ${38 * pulse}px rgba(255, 59, 48, 0.6)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: 2,
        }}
      >
        <span style={{ color: "#FF3B30" }}>
          P/E CYCLES: {peCycles.toLocaleString()}
        </span>
        <span style={{ color: "#F5D061" }}>// OXIDE BREAKDOWN</span>
      </div>

      {/* Floating Gate Chamber Leaking Electrons Through Cracks */}
      <div
        style={{
          position: "absolute",
          top: 365,
          left: 110,
          right: 110,
          height: 220,
          borderRadius: "18px 18px 0 0",
          backgroundColor: "rgba(255, 59, 48, 0.08)",
          border: "3px solid rgba(255, 59, 48, 0.65)",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
          }}
        >
          FLOATING GATE // CHARGE LEAKAGE DETECTED
        </span>
      </div>

      {/* Cracking/Degrading SiO2 Barrier (Cyan -> Crimson Red #FF3B30) */}
      <div
        style={{
          position: "absolute",
          top: 585,
          left: 90,
          right: 90,
          height: 150,
          borderRadius: 14,
          backgroundColor: isBrokenDown
            ? "rgba(255, 59, 48, 0.28)"
            : "rgba(0, 240, 255, 0.22)",
          border: `4px solid ${isBrokenDown ? "#FF3B30" : "#00F0FF"}`,
          boxShadow: `0 0 ${48 * pulse}px ${
            isBrokenDown ? "rgba(255, 59, 48, 0.85)" : "rgba(0, 240, 255, 0.6)"
          }`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Jagged Crimson Red Fracture Lines SVG */}
        <svg
          width={900}
          height={150}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: crackProgress,
          }}
        >
          <polyline
            points="160,0 195,45 150,92 210,150"
            fill="none"
            stroke="#FF3B30"
            strokeWidth={6}
            style={{ filter: "drop-shadow(0 0 12px #FF3B30)" }}
          />
          <polyline
            points="440,0 410,52 468,98 425,150"
            fill="none"
            stroke="#FF3B30"
            strokeWidth={7}
            style={{ filter: "drop-shadow(0 0 14px #FF3B30)" }}
          />
          <polyline
            points="710,0 745,48 690,104 735,150"
            fill="none"
            stroke="#FF3B30"
            strokeWidth={6}
            style={{ filter: "drop-shadow(0 0 12px #FF3B30)" }}
          />
        </svg>

        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
            textShadow: "0 2px 12px #050508",
            zIndex: 2,
          }}
        >
          SiO₂ GLASS OXIDE BARRIER // FRACTURED
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#F5D061",
            letterSpacing: 2,
            marginTop: 6,
            zIndex: 2,
          }}
        >
          ATOMIC DEFECTS TRAP & LEAK ELECTRONS
        </span>
      </div>

      {/* Leaking Golden Electrons Falling Out Through the Oxide Cracks */}
      {Array.from({ length: 12 }).map((_, idx) => {
        const crackX = [250, 530, 800][idx % 3] + (idx % 2 === 0 ? -16 : 16);
        const fallOffset = ((frame * 4.5 + idx * 38) % 440);
        const y = 470 + fallOffset;
        const opacity = interpolate(fallOffset, [0, 340, 440], [1, 0.9, 0]);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: crackX,
              top: y,
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: idx % 2 === 0 ? "#FF3B30" : "#F5D061",
              boxShadow: "0 0 18px #FF3B30",
              opacity: opacity * crackProgress,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 14,
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            e⁻
          </div>
        );
      })}

      {/* Critical Breakdown Alert Box */}
      {isBrokenDown && (
        <div
          style={{
            position: "absolute",
            top: 980,
            left: 80,
            right: 80,
            transform: `scale(${alertSpring})`,
            padding: "28px 38px",
            borderRadius: 18,
            backgroundColor: "rgba(255, 59, 48, 0.24)",
            border: "4px solid #FF3B30",
            boxShadow: `0 0 ${45 * pulse}px rgba(255, 59, 48, 0.85)`,
            textAlign: "center",
            fontSize: 38,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
          }}
        >
          ⚠ P/E CYCLES: 10,000 // OXIDE BREAKDOWN
        </div>
      )}
    </AbsoluteFill>
  );
};
