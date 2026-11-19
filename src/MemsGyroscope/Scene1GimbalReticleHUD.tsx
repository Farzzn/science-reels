import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 1 (0:00 – 0:08 = 240 frames):
// Background public/phone-tilt-xray.mp4.
// Top HUD: IMU_SENSOR // 6-AXIS_MEMS_GYRO // ACTIVE.
// Overlay a sleek 3-axis Pitch / Roll / Yaw gimbal reticle in the upper-middle
// where angles (PITCH: +14.2°, ROLL: -38.6°, YAW: +02.1°) tick live using Math.sin(frame / 10).
export const Scene1GimbalReticleHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 240
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Live angles ticking around (+14.2°, -38.6°, +02.1°) using Math.sin(frame / 10)
  const sinWave = Math.sin(frame / 10);
  const cosWave = Math.cos(frame / 10);

  const pitchVal = 14.2 + sinWave * 4.8;
  const rollVal = -38.6 + cosWave * 6.4;
  const yawVal = 2.1 + Math.sin(frame / 10 + 1.2) * 1.9;

  const fmtAngle = (val: number) => {
    const sign = val >= 0 ? "+" : "-";
    const absStr = Math.abs(val).toFixed(1).padStart(4, "0");
    return `${sign}${absStr}°`;
  };

  // Upper-middle gimbal reticle center
  const cx = 540;
  const cy = 535;
  const horizonTilt = sinWave * 14;
  const pitchOffset = cosWave * 18;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "monospace",
        opacity: fadeOut,
      }}
    >
      {/* Sleek 3-Axis Pitch / Roll / Yaw Gimbal Reticle in Upper-Middle */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g
          transform={`translate(${cx}, ${cy}) scale(${interpolate(
            enterSpring,
            [0, 1],
            [0.85, 1],
          )})`}
        >
          {/* Outer Roll Ring */}
          <circle
            cx={0}
            cy={0}
            r={155}
            fill="rgba(5, 8, 15, 0.25)"
            stroke="rgba(0, 240, 255, 0.45)"
            strokeWidth={2.5}
            strokeDasharray="16 8"
          />

          {/* Middle Pitch Gimbal Ellipse */}
          <g transform={`rotate(${horizonTilt})`}>
            <ellipse
              cx={0}
              cy={0}
              rx={128}
              ry={72}
              fill="none"
              stroke="rgba(245, 208, 97, 0.7)"
              strokeWidth={2.5}
            />
            {/* Artificial Horizon Bar */}
            <line
              x1={-110}
              y1={pitchOffset}
              x2={110}
              y2={pitchOffset}
              stroke="#00F0FF"
              strokeWidth={3.5}
              style={{ filter: "drop-shadow(0 0 8px #00F0FF)" }}
            />
            {/* Pitch Ladder Ticks */}
            {[-28, 28].map((py) => (
              <line
                key={py}
                x1={-45}
                y1={pitchOffset + py}
                x2={45}
                y2={pitchOffset + py}
                stroke="rgba(0, 240, 255, 0.65)"
                strokeWidth={2}
              />
            ))}
          </g>

          {/* Inner Yaw Gimbal Ring */}
          <ellipse
            cx={0}
            cy={0}
            rx={56}
            ry={128}
            fill="none"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth={2}
            strokeDasharray="6 6"
          />

          {/* Center Crosshair */}
          <circle cx={0} cy={0} r={8} fill="#F5D061" />
          <circle
            cx={0}
            cy={0}
            r={24}
            fill="none"
            stroke="#F5D061"
            strokeWidth={2}
          />
        </g>
      </svg>

      {/* Glassmorphic 3-Axis Angle Readout Card (Upper-Middle below Gimbal Ring) */}
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
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            3-AXIS GIMBAL TELEMETRY // REAL-TIME EULER ANGLES
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#F5D061",
              letterSpacing: 1.5,
            }}
          >
            RATE: 1,000 Hz
          </span>
        </div>

        {/* 3-Column Live Angle Readout: PITCH: +14.2°, ROLL: -38.6°, YAW: +02.1° */}
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
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(0, 240, 255, 0.1)",
              border: "1px solid rgba(0, 240, 255, 0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 2,
              }}
            >
              X-AXIS // PITCH
            </span>
            <span
              style={{
                fontSize: 27,
                fontWeight: 900,
                color: "#00F0FF",
                letterSpacing: 1.5,
              }}
            >
              PITCH: {fmtAngle(pitchVal)}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(245, 208, 97, 0.12)",
              border: "1px solid rgba(245, 208, 97, 0.45)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 2,
              }}
            >
              Y-AXIS // ROLL
            </span>
            <span
              style={{
                fontSize: 27,
                fontWeight: 900,
                color: "#F5D061",
                letterSpacing: 1.5,
              }}
            >
              ROLL: {fmtAngle(rollVal)}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(0, 240, 255, 0.1)",
              border: "1px solid rgba(0, 240, 255, 0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 2,
              }}
            >
              Z-AXIS // YAW
            </span>
            <span
              style={{
                fontSize: 27,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.5,
              }}
            >
              YAW: {fmtAngle(yawVal)}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
