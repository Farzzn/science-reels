import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 2 (0:08 - 0:22 — Pure Code Animation, 420 frames):
// On a #050508 dark grid, render 4 glowing cyan memory buckets (DRAM CELL 01–04)
// filled with golden electron particles. At 0:14 (local frame 180), animate POWER_OFF
// in red, draining the particles out the bottom as the bits flip from 1 to 0
// (VOLATILE MEMORY // DATA LOST).
export const Scene2DramBuckets: React.FC = () => {
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

  // At 0:14 -> local frame 180
  const isPowerOff = frame >= 180;
  const drainProgress = interpolate(frame, [180, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const alertSpring = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const buckets = [
    { id: "DRAM CELL 01", delay: 0 },
    { id: "DRAM CELL 02", delay: 6 },
    { id: "DRAM CELL 03", delay: 12 },
    { id: "DRAM CELL 04", delay: 18 },
  ];

  const primaryColor = isPowerOff ? "#FF3B30" : "#00F0FF";

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
      {/* #050508 Dark Cyber Grid Background */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "54px 54px",
          backgroundPosition: `0px ${(frame * 1.2) % 54}px`,
        }}
      />

      {/* Radial Glow */}
      <AbsoluteFill
        style={{
          background: isPowerOff
            ? "radial-gradient(circle at 50% 45%, rgba(255, 59, 48, 0.18) 0%, rgba(5, 5, 8, 0.95) 75%)"
            : "radial-gradient(circle at 50% 45%, rgba(0, 240, 255, 0.15) 0%, rgba(5, 5, 8, 0.95) 75%)",
        }}
      />

      {/* Section Subheader */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${primaryColor}`,
          paddingBottom: 16,
          fontSize: 24,
          fontWeight: 800,
          color: primaryColor,
          letterSpacing: 3,
        }}
      >
        <span>
          {isPowerOff
            ? "VOLATILE_RAM // CAPACITOR_DISCHARGE"
            : "VOLATILE_RAM // CAPACITOR_HOLDING_CHARGE"}
        </span>
        <span style={{ color: isPowerOff ? "#FF3B30" : "#F5D061" }}>
          {isPowerOff ? "POWER_OFF (0.0V)" : "VDD: +1.10V ACTIVE"}
        </span>
      </div>

      {/* Power Status Banner */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: isPowerOff ? `scale(${alertSpring})` : "scale(1)",
            padding: "18px 44px",
            borderRadius: 16,
            backgroundColor: isPowerOff
              ? "rgba(255, 59, 48, 0.2)"
              : "rgba(0, 240, 255, 0.1)",
            border: `3px solid ${primaryColor}`,
            boxShadow: `0 0 32px ${
              isPowerOff ? "rgba(255, 59, 48, 0.7)" : "rgba(0, 240, 255, 0.45)"
            }`,
            fontSize: 38,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
          }}
        >
          {isPowerOff ? "⚡ POWER_OFF // LEAKING CHARGE" : "⚡ POWER_ON // HOLDING BITS"}
        </div>
      </div>

      {/* 4 Glowing Cyan Memory Buckets (DRAM CELL 01–04) */}
      <div
        style={{
          position: "absolute",
          top: 450,
          left: 56,
          right: 56,
          height: 620,
          display: "flex",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {buckets.map((bucket, bIdx) => {
          const enterSpring = spring({
            frame: frame - bucket.delay,
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const cellDrain = interpolate(
            frame,
            [180 + bIdx * 10, 275 + bIdx * 10],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          const bitFlipped = cellDrain > 0.55;
          const fillHeightPct = (1 - cellDrain) * 78;

          return (
            <div
              key={bucket.id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${enterSpring})`,
              }}
            >
              {/* Cell Label */}
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: primaryColor,
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                {bucket.id}
              </div>

              {/* Bucket Container (Open top, draining bottom valve) */}
              <div
                style={{
                  width: "100%",
                  height: 410,
                  borderRadius: "8px 8px 22px 22px",
                  backgroundColor: "rgba(9, 16, 26, 0.85)",
                  borderLeft: `4px solid ${primaryColor}`,
                  borderRight: `4px solid ${primaryColor}`,
                  borderBottom: isPowerOff
                    ? "4px dashed rgba(255, 59, 48, 0.45)"
                    : `6px solid #00F0FF`,
                  boxShadow: isPowerOff
                    ? "0 0 26px rgba(255, 59, 48, 0.35)"
                    : "0 0 28px rgba(0, 240, 255, 0.45), inset 0 0 20px rgba(0, 240, 255, 0.18)",
                  position: "relative",
                  overflow: "visible",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {/* Golden Charge Liquid Level */}
                <div
                  style={{
                    width: "100%",
                    height: `${fillHeightPct}%`,
                    background:
                      "linear-gradient(180deg, rgba(245, 208, 97, 0.35) 0%, rgba(245, 208, 97, 0.12) 100%)",
                    borderTop:
                      fillHeightPct > 3 ? "2px solid #F5D061" : "none",
                    borderRadius: "0 0 18px 18px",
                    transition: "height 0.05s linear",
                  }}
                />

                {/* 10 Golden Electron Particles per Bucket */}
                {Array.from({ length: 10 }).map((_, pIdx) => {
                  const col = pIdx % 2;
                  const row = Math.floor(pIdx / 2);
                  const baseX = 48 + col * 78 + Math.sin(frame * 0.12 + pIdx) * 10;
                  const baseY =
                    115 + row * 54 + Math.cos(frame * 0.15 + pIdx * 2) * 8;

                  // When power turns off, electrons fall straight out the bottom of the bucket
                  const particleDrop =
                    Math.max(0, cellDrain - pIdx * 0.04) * 460;
                  const particleOpacity = interpolate(
                    particleDrop,
                    [0, 260, 420],
                    [1, 0.85, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  );

                  return (
                    <div
                      key={pIdx}
                      style={{
                        position: "absolute",
                        left: baseX,
                        top: baseY + particleDrop,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        backgroundColor: "#F5D061",
                        boxShadow: "0 0 16px #F5D061, 0 0 6px #FFFFFF",
                        opacity: particleOpacity,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 13,
                        fontWeight: 900,
                        color: "#050508",
                      }}
                    >
                      e⁻
                    </div>
                  );
                })}
              </div>

              {/* Bit State Readout (1 -> 0) */}
              <div
                style={{
                  marginTop: 26,
                  padding: "14px 28px",
                  borderRadius: 14,
                  backgroundColor: bitFlipped
                    ? "rgba(255, 59, 48, 0.22)"
                    : "rgba(0, 240, 255, 0.16)",
                  border: `3px solid ${bitFlipped ? "#FF3B30" : "#00F0FF"}`,
                  boxShadow: `0 0 20px ${
                    bitFlipped
                      ? "rgba(255, 59, 48, 0.55)"
                      : "rgba(0, 240, 255, 0.45)"
                  }`,
                  fontSize: 44,
                  fontWeight: 900,
                  color: "#FFFFFF",
                }}
              >
                BIT: <span style={{ color: bitFlipped ? "#FF3B30" : "#F5D061" }}>{bitFlipped ? "0" : "1"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status Alert Banner */}
      <div
        style={{
          position: "absolute",
          top: 1130,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "24px 36px",
            borderRadius: 18,
            backgroundColor: isPowerOff
              ? "rgba(255, 59, 48, 0.24)"
              : "rgba(0, 240, 255, 0.1)",
            border: `3px solid ${primaryColor}`,
            boxShadow: `0 0 36px ${
              isPowerOff ? "rgba(255, 59, 48, 0.75)" : "rgba(0, 240, 255, 0.35)"
            }`,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
          }}
        >
          {drainProgress > 0.3
            ? "⚠ VOLATILE MEMORY // DATA LOST"
            : "STANDARD RAM // REQUIRES CONSTANT ELECTRICITY"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
