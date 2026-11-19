import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 3 (0:18 – 0:30 = 360 frames):
// Background public/molten-steel.mp4.
// Overlay an animated schematic pill (BESSEMER / BOS OXYGEN INJECTION) showing red
// 60Co (COBALT-60) isotope tags binding into the iron lattice, with a live contamination counter ticking up.
export const Scene3MoltenSteelHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 360
  const { fps } = useVideoConfig();

  const pillSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [352, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Contamination counter ticking up continuously
  const contaminationBq = interpolate(frame, [10, 310], [0.02, 18.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }).toFixed(2);

  const boundCount = Math.min(
    8,
    Math.floor(
      interpolate(frame, [20, 260], [1, 8.9], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  // 8 Iron (Fe) Lattice Nodes in a 4x2 grid inside the glassmorphic schematic pill
  const latticeNodes = Array.from({ length: 8 }).map((_, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = 140 + col * 185;
    const y = 78 + row * 92;
    const isContaminated = idx < boundCount;
    return { id: idx, x, y, isContaminated };
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Upper-Third Glassmorphic BESSEMER / BOS OXYGEN INJECTION Pill */}
      <div
        style={{
          position: "absolute",
          top: 235,
          left: 68,
          right: 68,
          transform: `scale(${interpolate(pillSpring, [0, 1], [0.9, 1])})`,
          padding: "18px 28px",
          borderRadius: 18,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 12px 34px rgba(0, 0, 0, 0.55)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            FOUNDRY CONVERTER // AIR INTAKE ACTIVE
          </span>
          <span
            style={{
              fontSize: 25,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            BESSEMER / BOS OXYGEN INJECTION
          </span>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            backgroundColor: "rgba(255, 59, 48, 0.22)",
            border: "1.5px solid #FF3B30",
            boxShadow: "0 0 18px rgba(255, 59, 48, 0.45)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            CONTAMINATION COUNTER
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#FF3B30",
              letterSpacing: 1.5,
            }}
          >
            +{contaminationBq} Bq/kg
          </span>
        </div>
      </div>

      {/* Lower-Middle Glassmorphic Iron Lattice Schematic Card (Leaves Center Molten Pour Uncovered) */}
      <div
        style={{
          position: "absolute",
          top: 785,
          left: 68,
          right: 68,
          transform: `scale(${interpolate(pillSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 30px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 240, 255, 0.25)",
            paddingBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1.5,
              whiteSpace: "nowrap",
            }}
          >
            FE-C CRYSTAL LATTICE // ISOTOPE ENTRAPMENT
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#FF3B30",
              letterSpacing: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            ⁶⁰Co (COBALT-60) BOUND: {boundCount}/8 SITES
          </span>
        </div>

        {/* Animated Iron Lattice + Binding 60Co Tags */}
        <div style={{ position: "relative", width: "100%", height: 225 }}>
          <svg width={880} height={225}>
            {/* Horizontal & Vertical Crystal Lattice Bonds */}
            {latticeNodes.map((n, i) => {
              const rightNeighbor =
                i % 4 < 3 ? latticeNodes[i + 1] : null;
              const bottomNeighbor =
                i < 4 ? latticeNodes[i + 4] : null;
              return (
                <React.Fragment key={`bond-${n.id}`}>
                  {rightNeighbor && (
                    <line
                      x1={n.x}
                      y1={n.y}
                      x2={rightNeighbor.x}
                      y2={rightNeighbor.y}
                      stroke="rgba(0, 240, 255, 0.35)"
                      strokeWidth={3}
                    />
                  )}
                  {bottomNeighbor && (
                    <line
                      x1={n.x}
                      y1={n.y}
                      x2={bottomNeighbor.x}
                      y2={bottomNeighbor.y}
                      stroke="rgba(0, 240, 255, 0.35)"
                      strokeWidth={3}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </svg>

          {/* Render Fe Nodes and Red 60Co (COBALT-60) Isotope Tags */}
          {latticeNodes.map((node) => {
            const tagPop = spring({
              frame: Math.max(0, frame - (20 + node.id * 30)),
              fps,
              config: { damping: 11, stiffness: 150 },
            });

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: node.x - 36,
                  top: node.y - 36,
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  backgroundColor: node.isContaminated
                    ? "rgba(255, 59, 48, 0.28)"
                    : "rgba(0, 240, 255, 0.16)",
                  border: `2.5px solid ${
                    node.isContaminated ? "#FF3B30" : "#00F0FF"
                  }`,
                  boxShadow: node.isContaminated
                    ? "0 0 22px rgba(255, 59, 48, 0.75)"
                    : "0 0 14px rgba(0, 240, 255, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#FFFFFF",
                  }}
                >
                  {node.isContaminated ? "⁶⁰Co" : "Fe"}
                </span>

                {/* Red 60Co (COBALT-60) Tag Badge */}
                {node.isContaminated && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -16,
                      transform: `scale(${tagPop})`,
                      padding: "2px 8px",
                      borderRadius: 5,
                      backgroundColor: "#FF3B30",
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                      boxShadow: "0 0 12px #FF3B30",
                    }}
                  >
                    COBALT-60
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 17,
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.85)",
            paddingTop: 6,
            borderTop: "1px solid rgba(255, 255, 255, 0.14)",
          }}
        >
          <span>AIRBORNE FALLOUT MIXED INTO BLAST FURNACE</span>
          <span style={{ color: "#F5D061" }}>ALL POST-1945 STEEL AFFECTED</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
