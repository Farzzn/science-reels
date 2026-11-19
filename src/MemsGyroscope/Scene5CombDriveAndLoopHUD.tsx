import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 5A (0:42 – 0:50 = 240 frames):
// Play public/capacitive-comb-teeth.mp4 from 0:42 to 0:50.
// Overlay an animated interlocking comb-drive capacitor meter showing gap distance
// shrinking (Δd: 0.4 nanometers) and capacitance spiking
// (ΔC: +14.8 Femtofarads -> SCREEN ROTATION LOCKED).
const CombDriveCapacitorHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 240
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gap distance shrinking down to 0.4 nm while capacitance spikes up to +14.8 Femtofarads
  const squeezeProgress = interpolate(frame, [15, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gapNm = interpolate(squeezeProgress, [0, 1], [2.4, 0.4]).toFixed(1);
  const capFf = interpolate(squeezeProgress, [0, 1], [0.8, 14.8]).toFixed(1);
  const isLocked = frame >= 125;

  const lockSpring = spring({
    frame: Math.max(0, frame - 125),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Interlocking comb teeth shift closer together as squeezeProgress -> 1
  const toothShift = squeezeProgress * 22;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Lower-Middle Glassmorphic Interlocking Comb-Drive Capacitor Meter */}
      <div
        style={{
          position: "absolute",
          top: 710,
          left: 56,
          right: 56,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          padding: "22px 28px",
          borderRadius: 20,
          backgroundColor: "rgba(5, 8, 15, 0.68)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 16px 44px rgba(0, 0, 0, 0.65)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Header */}
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
              letterSpacing: 1.8,
            }}
          >
            CAPACITIVE COMB-DRIVE // DIFFERENTIAL SENSE
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(245, 208, 97, 0.2)",
              border: "1px solid #F5D061",
              fontSize: 16,
              fontWeight: 900,
              color: "#F5D061",
            }}
          >
            C = ε·A / d
          </span>
        </div>

        {/* Animated Interlocking Comb-Drive Teeth Diagram */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 195,
            borderRadius: 14,
            backgroundColor: "rgba(5, 8, 15, 0.58)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            overflow: "hidden",
          }}
        >
          <svg width={900} height={195}>
            {/* Fixed Stator Comb Spine (Top, Cyan) */}
            <rect
              x={80}
              y={16}
              width={740}
              height={18}
              rx={4}
              fill="rgba(0, 240, 255, 0.35)"
              stroke="#00F0FF"
              strokeWidth={2}
            />
            {/* Movable Proof-Mass Comb Spine (Bottom, Golden Yellow, Shifts Left by toothShift) */}
            <rect
              x={80 - toothShift}
              y={160}
              width={740}
              height={18}
              rx={4}
              fill="rgba(245, 208, 97, 0.35)"
              stroke="#F5D061"
              strokeWidth={2}
            />

            {/* Interlocking Comb Teeth Pairs */}
            {Array.from({ length: 6 }).map((_, idx) => {
              const statorX = 140 + idx * 115;
              const rotorX = statorX + 52 - toothShift;
              return (
                <g key={idx}>
                  {/* Stator Finger (Cyan, Hanging Down) */}
                  <rect
                    x={statorX}
                    y={34}
                    width={20}
                    height={102}
                    rx={3}
                    fill="rgba(0, 240, 255, 0.28)"
                    stroke="#00F0FF"
                    strokeWidth={2}
                  />
                  {/* Rotor Finger (Golden, Reaching Up, Closing Gap Δd) */}
                  <rect
                    x={rotorX}
                    y={58}
                    width={20}
                    height={102}
                    rx={3}
                    fill="rgba(245, 208, 97, 0.35)"
                    stroke="#F5D061"
                    strokeWidth={2}
                  />
                  {/* Electric Field Glow in the Shrinking Gap */}
                  <rect
                    x={statorX + 21}
                    y={62}
                    width={Math.max(4, rotorX - (statorX + 21))}
                    height={70}
                    fill={`rgba(255, 59, 48, ${0.25 + squeezeProgress * 0.55})`}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Live Telemetry Readout Row: Δd: 0.4 nanometers & ΔC: +14.8 Femtofarads */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: 12,
              backgroundColor: "rgba(0, 240, 255, 0.12)",
              border: "1px solid rgba(0, 240, 255, 0.45)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 1.5,
              }}
            >
              GAP DISTANCE SHRINKING
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#00F0FF",
              }}
            >
              Δd: {gapNm} nanometers
            </span>
          </div>

          <div
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: 12,
              backgroundColor: "rgba(245, 208, 97, 0.14)",
              border: "1px solid rgba(245, 208, 97, 0.55)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 1.5,
              }}
            >
              CAPACITANCE SPIKING
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#F5D061",
              }}
            >
              ΔC: +{capFf} Femtofarads
            </span>
          </div>
        </div>

        {/* Bottom Status Lock Badge: SCREEN ROTATION LOCKED */}
        <div
          style={{
            transform: isLocked ? `scale(${lockSpring})` : "scale(1)",
            padding: "12px 22px",
            borderRadius: 12,
            backgroundColor: isLocked
              ? "rgba(0, 240, 255, 0.22)"
              : "rgba(255, 255, 255, 0.08)",
            border: `1.5px solid ${isLocked ? "#00F0FF" : "rgba(0, 240, 255, 0.35)"}`,
            boxShadow: isLocked ? "0 0 24px rgba(0, 240, 255, 0.45)" : "none",
            textAlign: "center",
            fontSize: 21,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
          }}
        >
          ΔC: +{capFf} Femtofarads →{" "}
          <span style={{ color: "#F5D061" }}>SCREEN ROTATION LOCKED</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5B (0:50 – 0:52.93 = 88 frames): Reverse Phone Tilt X-Ray Loop Sync HUD
const ReverseTiltLoopHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 88
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Converges gimbal angles cleanly back to (+14.2°, -38.6°, +02.1°) at frame 88 (voice end -> 0:00)
  const decay = interpolate(frame, [0, 82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sinWave = Math.sin(frame / 10) * decay;
  const cosWave = Math.cos(frame / 10) * decay;

  const pitchVal = 14.2 + sinWave * 4.8;
  const rollVal = -38.6 + cosWave * 6.4;
  const yawVal = 2.1 + Math.sin(frame / 10 + 1.2) * 1.9 * decay;

  const fmtAngle = (val: number) => {
    const sign = val >= 0 ? "+" : "-";
    const absStr = Math.abs(val).toFixed(1).padStart(4, "0");
    return `${sign}${absStr}°`;
  };

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
      }}
    >
      {/* Matching Upper-Middle Gimbal Reticle so 0:56 visually matches 0:00 */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g
          transform={`translate(540, 535) scale(${interpolate(
            enterSpring,
            [0, 1],
            [0.9, 1],
          )})`}
        >
          <circle
            cx={0}
            cy={0}
            r={155}
            fill="rgba(5, 8, 15, 0.25)"
            stroke="rgba(0, 240, 255, 0.45)"
            strokeWidth={2.5}
            strokeDasharray="16 8"
          />
          <ellipse
            cx={0}
            cy={0}
            rx={128}
            ry={72}
            fill="none"
            stroke="rgba(245, 208, 97, 0.7)"
            strokeWidth={2.5}
          />
          <line
            x1={-110}
            y1={0}
            x2={110}
            y2={0}
            stroke="#00F0FF"
            strokeWidth={3.5}
          />
          <circle cx={0} cy={0} r={8} fill="#F5D061" />
        </g>
      </svg>

      {/* Glassmorphic Gimbal Lock Card */}
      <div
        style={{
          position: "absolute",
          top: 730,
          left: 64,
          right: 64,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.92, 1])})`,
          padding: "20px 28px",
          borderRadius: 18,
          backgroundColor: "rgba(5, 8, 15, 0.68)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.35)",
          boxShadow: "0 14px 36px rgba(0, 0, 0, 0.55)",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 900, color: "#00F0FF" }}>
          PITCH: {fmtAngle(pitchVal)}
        </span>
        <span style={{ fontSize: 24, fontWeight: 900, color: "#F5D061" }}>
          ROLL: {fmtAngle(rollVal)}
        </span>
        <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF" }}>
          YAW: {fmtAngle(yawVal)}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Scene5CombDriveAndLoopHUD: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Strictly unmounts at 0:50 (local frame 240) */}
      <Sequence from={0} durationInFrames={240}>
        <CombDriveCapacitorHUD />
      </Sequence>
      {/* Strictly mounts from 0:50 to 0:52.93 (local frames 240 to 328) */}
      <Sequence from={240} durationInFrames={88}>
        <ReverseTiltLoopHUD />
      </Sequence>
    </AbsoluteFill>
  );
};
