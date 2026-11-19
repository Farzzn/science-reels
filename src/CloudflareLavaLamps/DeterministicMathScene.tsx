import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PREDICTED_NUMBERS = ["42", "19", "88", "04", "73", "11", "65", "90"];

// Strictly mounted only from 0:08 to 0:22 (420 frames)
const Phase1PredictableSineHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [412, 420], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seedBoxSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const processorSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const pulseGlow = 0.65 + 0.35 * Math.sin(frame / 5);

  const wavePoints: string[] = [];
  const waveWidth = 860;
  const waveStartX = 110;
  for (let i = 0; i <= 60; i++) {
    const x = waveStartX + (i / 60) * waveWidth;
    const angle = (i / 60) * Math.PI * 4 - frame * 0.08;
    const y = Math.sin(angle) * 68;
    wavePoints.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const sinePathData = wavePoints.join(" ");

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${punchScale})`,
        opacity: fadeOut,
      }}
    >
      {/* Top Section Header */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 240, 255, 0.25)",
          paddingBottom: 16,
          fontFamily: "monospace",
          color: "#00F0FF",
          fontSize: 24,
          letterSpacing: 3,
        }}
      >
        <span>PRNG // DETERMINISTIC_LOGIC_ENGINE</span>
        <span style={{ color: "#F5D061" }}>ENTROPY: 0.00%</span>
      </div>

      {/* SEED: 1709382 Box + Central Processor Node */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${seedBoxSpring})`,
            padding: "20px 44px",
            borderRadius: 14,
            backgroundColor: "rgba(0, 240, 255, 0.1)",
            border: "3px solid #00F0FF",
            boxShadow: `0 0 ${28 * pulseGlow}px rgba(0, 240, 255, 0.65), inset 0 0 18px rgba(0, 240, 255, 0.25)`,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#00F0FF",
              boxShadow: "0 0 12px #00F0FF",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 42,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 4,
            }}
          >
            SEED: <span style={{ color: "#00F0FF" }}>1709382</span>
          </span>
        </div>

        <div
          style={{
            width: 4,
            height: 70,
            background: "linear-gradient(180deg, #00F0FF, #F5D061)",
            boxShadow: "0 0 14px #00F0FF",
            opacity: processorSpring,
          }}
        />

        <div
          style={{
            transform: `scale(${processorSpring})`,
            padding: "18px 38px",
            borderRadius: 16,
            backgroundColor: "#0B0E17",
            border: "2px solid rgba(245, 208, 97, 0.8)",
            boxShadow: "0 0 30px rgba(245, 208, 97, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: 800,
              color: "#F5D061",
              letterSpacing: 2,
            }}
          >
            CPU LOGIC NODE: f(x) = (a·x + c) mod m
          </span>
        </div>
      </div>

      {/* Sine Wave & 42 -> 19 -> 88 -> 04 Spring Nodes */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          height: 440,
        }}
      >
        <svg
          width={1080}
          height={360}
          style={{ position: "absolute", top: 40, left: 0 }}
        >
          <g transform="translate(0, 180)">
            <path
              d={sinePathData}
              fill="none"
              stroke="#00F0FF"
              strokeWidth={5}
              strokeDasharray="12 6"
              style={{
                filter: "drop-shadow(0px 0px 12px rgba(0, 240, 255, 0.8))",
              }}
            />
          </g>
        </svg>

        {["42", "19", "88", "04"].map((num, idx) => {
          const nodeDelay = 35 + idx * 32;
          const nodeScale = spring({
            frame: frame - nodeDelay,
            fps,
            config: { damping: 11, stiffness: 140 },
          });

          const xPos = 190 + idx * 230;
          const waveY = Math.sin((idx / 3) * Math.PI * 2 - frame * 0.08) * 68;

          return (
            <div
              key={num}
              style={{
                position: "absolute",
                left: xPos - 68,
                top: 220 + waveY - 68,
                width: 136,
                height: 136,
                borderRadius: 24,
                backgroundColor: "#09131C",
                border: "3px solid #00F0FF",
                boxShadow: "0 0 28px rgba(0, 240, 255, 0.55)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transform: `scale(${nodeScale})`,
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 16,
                  color: "rgba(0, 240, 255, 0.7)",
                  marginBottom: 4,
                }}
              >
                OUT_0{idx + 1}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 54,
                  fontWeight: 900,
                  color: "#FFFFFF",
                }}
              >
                {num}
              </span>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            bottom: -20,
            width: "100%",
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: 28,
            color: "#F5D061",
            letterSpacing: 3,
          }}
        >
          100% PREDICTABLE SEQUENCE: 42 → 19 → 88 → 04
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Strictly mounted only from 0:22 to 0:38 (480 frames)
const Phase2HackerCloneHUD: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 480
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [472, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const splitSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const scanProgress = interpolate(frame, [35, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const alertSpring = spring({
    frame: frame - 310,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  const pulseGlow = 0.65 + 0.35 * Math.sin(frame / 5);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${punchScale})`,
        opacity: fadeOut,
      }}
    >
      {/* Top Section Header */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 59, 48, 0.35)",
          paddingBottom: 16,
          fontFamily: "monospace",
          color: "#00F0FF",
          fontSize: 24,
          letterSpacing: 3,
        }}
      >
        <span>PRNG // CLONE_SYNCHRONIZATION_DETECTED</span>
        <span style={{ color: "#FF3B30" }}>STATUS: VULNERABLE</span>
      </div>

      {/* Compact SEED & Processor Header */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "20px 44px",
            borderRadius: 14,
            backgroundColor: "rgba(0, 240, 255, 0.1)",
            border: "3px solid #00F0FF",
            boxShadow: `0 0 ${28 * pulseGlow}px rgba(0, 240, 255, 0.65), inset 0 0 18px rgba(0, 240, 255, 0.25)`,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#00F0FF",
              boxShadow: "0 0 12px #00F0FF",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 42,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 4,
            }}
          >
            SEED: <span style={{ color: "#00F0FF" }}>1709382</span>
          </span>
        </div>

        <div
          style={{
            width: 4,
            height: 42,
            background: "linear-gradient(180deg, #00F0FF, #F5D061)",
            boxShadow: "0 0 14px #00F0FF",
          }}
        />

        <div
          style={{
            padding: "18px 38px",
            borderRadius: 16,
            backgroundColor: "#0B0E17",
            border: "2px solid rgba(245, 208, 97, 0.8)",
            boxShadow: "0 0 30px rgba(245, 208, 97, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: 800,
              color: "#F5D061",
              letterSpacing: 2,
            }}
          >
            CPU LOGIC NODE: f(x) = (a·x + c) mod m
          </span>
        </div>
      </div>

      {/* Dual Parallel Tracks */}
      <div
        style={{
          position: "absolute",
          top: 570,
          left: 60,
          right: 60,
          height: 760,
          opacity: splitSpring,
        }}
      >
        {/* Track 1: USER DEVICE (Top, Cyan) */}
        <div
          style={{
            padding: "26px 32px",
            borderRadius: 20,
            backgroundColor: "rgba(0, 240, 255, 0.06)",
            border: "2px solid rgba(0, 240, 255, 0.6)",
            marginBottom: 44,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              fontFamily: "monospace",
              fontSize: 26,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            <span>USER DEVICE // STREAM_A</span>
            <span>SEED: 1709382</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            {PREDICTED_NUMBERS.map((num, idx) => {
              const itemProgress = idx / (PREDICTED_NUMBERS.length - 1);
              const isScanned = scanProgress >= itemProgress;
              return (
                <div
                  key={`user-${num}`}
                  style={{
                    flex: 1,
                    height: 110,
                    borderRadius: 14,
                    backgroundColor: isScanned
                      ? "rgba(0, 240, 255, 0.22)"
                      : "#080D14",
                    border: `2px solid ${
                      isScanned ? "#00F0FF" : "rgba(0, 240, 255, 0.3)"
                    }`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "monospace",
                    fontSize: 40,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    boxShadow: isScanned
                      ? "0 0 18px rgba(0, 240, 255, 0.5)"
                      : "none",
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: ATTACKER CLONE (Bottom, Crimson Red #FF3B30) */}
        <div
          style={{
            padding: "26px 32px",
            borderRadius: 20,
            backgroundColor: "rgba(255, 59, 48, 0.08)",
            border: "2px solid #FF3B30",
            boxShadow: "0 0 32px rgba(255, 59, 48, 0.25)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              fontFamily: "monospace",
              fontSize: 26,
              fontWeight: 800,
              color: "#FF3B30",
              letterSpacing: 2,
            }}
          >
            <span>ATTACKER CLONE // MIRROR_STREAM</span>
            <span>MATCH: 100.0%</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            {PREDICTED_NUMBERS.map((num, idx) => {
              const itemProgress = idx / (PREDICTED_NUMBERS.length - 1);
              const isMatched = scanProgress >= itemProgress;
              return (
                <div
                  key={`hacker-${num}`}
                  style={{
                    flex: 1,
                    height: 110,
                    borderRadius: 14,
                    backgroundColor: isMatched
                      ? "rgba(255, 59, 48, 0.32)"
                      : "#140808",
                    border: `2px solid ${
                      isMatched ? "#FF3B30" : "rgba(255, 59, 48, 0.3)"
                    }`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "monospace",
                    fontSize: 40,
                    fontWeight: 900,
                    color: isMatched ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                    boxShadow: isMatched
                      ? "0 0 22px rgba(255, 59, 48, 0.75)"
                      : "none",
                    transform: isMatched ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        {/* Red Vertical Scanning Bar matching numbers 1-to-1 */}
        {scanProgress > 0 && scanProgress < 1 && (
          <div
            style={{
              position: "absolute",
              top: -16,
              height: 460,
              left: `${4 + scanProgress * 92}%`,
              width: 6,
              backgroundColor: "#FF3B30",
              boxShadow:
                "0 0 28px 6px rgba(255, 59, 48, 0.95), 0 0 60px 12px rgba(255, 59, 48, 0.55)",
              borderRadius: 4,
            }}
          />
        )}

        {/* Glowing Red KEY COMPROMISED HUD Alert */}
        {frame >= 300 && (
          <div
            style={{
              marginTop: 46,
              transform: `scale(${alertSpring})`,
              padding: "26px 40px",
              borderRadius: 18,
              backgroundColor: "rgba(255, 59, 48, 0.22)",
              border: "4px solid #FF3B30",
              boxShadow: `0 0 ${45 * pulseGlow}px rgba(255, 59, 48, 0.9), inset 0 0 24px rgba(255, 59, 48, 0.45)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#FF3B30",
                boxShadow: "0 0 18px #FF3B30",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 48,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 5,
                textShadow: "0 0 18px #FF3B30",
              }}
            >
              ⚠ KEY COMPROMISED
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const DeterministicMathScene: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 900 (0:08 to 0:38)
  const isPhase2 = frame >= 420;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050508",
        overflow: "hidden",
        fontFamily: "'Inter', 'Montserrat', sans-serif",
      }}
    >
      {/* Procedural Animated Cyber Grid Background */}
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

      {/* Radial Ambient Glow */}
      <AbsoluteFill
        style={{
          background: isPhase2
            ? "radial-gradient(circle at 50% 45%, rgba(255, 59, 48, 0.16) 0%, rgba(0, 240, 255, 0.08) 45%, rgba(5, 5, 8, 0.95) 80%)"
            : "radial-gradient(circle at 50% 45%, rgba(0, 240, 255, 0.16) 0%, rgba(5, 5, 8, 0.95) 75%)",
        }}
      />

      {/* Strict Sequence Unmounting for Phase 1 (0:08 - 0:22) */}
      <Sequence from={0} durationInFrames={420}>
        <Phase1PredictableSineHUD />
      </Sequence>

      {/* Strict Sequence Unmounting for Phase 2 (0:22 - 0:38) */}
      <Sequence from={420} durationInFrames={480}>
        <Phase2HackerCloneHUD />
      </Sequence>
    </AbsoluteFill>
  );
};
