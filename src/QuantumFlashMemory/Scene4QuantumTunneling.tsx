import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Phase 1: 0:36 to 0:52 (480 frames) — CLASSICAL PHYSICS MODE
// Animate golden electron spheres shooting from the bottom SOURCE CHANNEL,
// slamming into a solid cyan barrier labeled SiO2 GLASS OXIDE BARRIER (10nm),
// and bouncing back (0% penetration).
const ClassicalPhysicsCrossSection: React.FC = () => {
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

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // 6 Electron spheres cycling upward from Source Channel (y=960) to Oxide Barrier bottom (y=680) and bouncing back
  const particles = Array.from({ length: 6 }).map((_, idx) => {
    const cycleLen = 46;
    const localT = ((frame + idx * 8) % cycleLen) / cycleLen; // 0..1
    // 0 -> 0.5: shoots up from 940 to 688; 0.5 -> 1.0: bounces back down to 940
    const isHitting = localT >= 0.44 && localT <= 0.56;
    const y =
      localT < 0.5
        ? interpolate(localT, [0, 0.5], [930, 686])
        : interpolate(localT, [0.5, 1], [686, 930]);
    const x =
      230 +
      idx * 124 +
      (localT >= 0.5 ? Math.sin(localT * Math.PI) * (idx % 2 === 0 ? -24 : 24) : 0);

    return { id: idx, x, y, isHitting };
  });

  const anyImpact = particles.some((p) => p.isHitting);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${punchScale * enterSpring})`,
        opacity: fadeOut,
        fontFamily: "monospace",
      }}
    >
      {/* Mode Header Banner */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 60,
          right: 60,
          padding: "18px 28px",
          borderRadius: 14,
          backgroundColor: "rgba(0, 240, 255, 0.08)",
          border: "2px solid #00F0FF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 25,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: 2.5,
        }}
      >
        <span style={{ color: "#00F0FF" }}>CLASSICAL PHYSICS MODE</span>
        <span style={{ color: "#FF3B30" }}>PENETRATION: 0.00%</span>
      </div>

      {/* FLOATING GATE (EMPTY) Top Chamber */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 110,
          right: 110,
          height: 220,
          borderRadius: "18px 18px 0 0",
          backgroundColor: "rgba(12, 18, 28, 0.85)",
          border: "3px dashed rgba(0, 240, 255, 0.45)",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "rgba(255, 255, 255, 0.55)",
            letterSpacing: 3,
          }}
        >
          FLOATING GATE CHAMBER
        </span>
        <span
          style={{
            padding: "8px 22px",
            borderRadius: 8,
            backgroundColor: "rgba(255, 59, 48, 0.16)",
            border: "2px solid #FF3B30",
            fontSize: 24,
            fontWeight: 900,
            color: "#FF3B30",
            letterSpacing: 2,
          }}
        >
          BIT STATE: UNLOCKED (0 ELECTRONS)
        </span>
      </div>

      {/* SOLID CYAN BARRIER: SiO2 GLASS OXIDE BARRIER (10nm) */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 90,
          right: 90,
          height: 115,
          borderRadius: 12,
          backgroundColor: anyImpact
            ? "rgba(0, 240, 255, 0.38)"
            : "rgba(0, 240, 255, 0.24)",
          border: "4px solid #00F0FF",
          boxShadow: anyImpact
            ? "0 0 48px rgba(0, 240, 255, 0.95), inset 0 0 28px rgba(0, 240, 255, 0.55)"
            : "0 0 28px rgba(0, 240, 255, 0.6), inset 0 0 18px rgba(0, 240, 255, 0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
            textShadow: "0 0 14px #00F0FF",
          }}
        >
          SiO₂ GLASS OXIDE BARRIER (10nm)
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#F5D061",
            letterSpacing: 3,
            marginTop: 4,
          }}
        >
          SOLID DIELECTRIC INSULATOR // IMPENETRABLE WALL
        </span>
      </div>

      {/* Bouncing Electron Spheres Zone */}
      {particles.map((p) => (
        <React.Fragment key={p.id}>
          {p.isHitting && (
            <div
              style={{
                position: "absolute",
                left: p.x - 36,
                top: 650,
                width: 72,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "rgba(245, 208, 97, 0.85)",
                boxShadow: "0 0 28px 8px #F5D061",
                zIndex: 6,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              left: p.x - 22,
              top: p.y - 22,
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: "#F5D061",
              boxShadow: "0 0 22px #F5D061, 0 0 8px #FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#050508",
              zIndex: 4,
            }}
          >
            e⁻
          </div>
        </React.Fragment>
      ))}

      {/* Bottom SOURCE CHANNEL */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 110,
          right: 110,
          height: 150,
          borderRadius: "0 0 18px 18px",
          backgroundColor: "rgba(245, 208, 97, 0.12)",
          border: "3px solid #F5D061",
          boxShadow: "0 0 28px rgba(245, 208, 97, 0.25)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#F5D061",
            letterSpacing: 3,
          }}
        >
          SOURCE — DRAIN SILICON CHANNEL
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: 2,
          }}
        >
          CLASSICAL ENERGY {"<"} BARRIER POTENTIAL (E {"<"} V₀)
        </span>
      </div>

      {/* Bottom Telemetry Callout */}
      <div
        style={{
          position: "absolute",
          top: 1115,
          left: 90,
          right: 90,
          padding: "22px 32px",
          borderRadius: 16,
          backgroundColor: "rgba(5, 5, 8, 0.9)",
          border: "2px solid rgba(0, 240, 255, 0.6)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 26,
          fontWeight: 900,
          color: "#FFFFFF",
        }}
      >
        <span>TUNNELING PROBABILITY:</span>
        <span style={{ color: "#FF3B30" }}>P(T) = 0.000000% (BOUNCING BACK)</span>
      </div>
    </AbsoluteFill>
  );
};

// Phase 2: 0:52 to 1:10 (540 frames) — QUANTUM TUNNELING ENGAGED // V_PROG: +20V
// Transform the golden spheres into a glowing oscillating sine/probability wave (ψ(x))
// that phases right through the solid cyan barrier, materializing as trapped golden
// particles inside the FLOATING GATE above (BIT STATE: LOCKED). Include a live probability ticker.
const QuantumTunnelingWaveCrossSection: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 540
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [532, 540], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lockSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  // Number of materialized golden electrons inside Floating Gate grows as wave tunnels through
  const trappedCount = Math.min(16, Math.floor(interpolate(frame, [15, 220], [1, 16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  // Build vertical oscillating wave path ψ(x) from Source (y=940) straight through Oxide Barrier (675..560) into Floating Gate (y=430)
  const wavePaths = [-180, 0, 180].map((xOffset, wIdx) => {
    const pts: string[] = [];
    const startY = 940;
    const endY = 420;
    const steps = 65;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const y = startY - progress * (startY - endY);
      // Amplitude attenuates inside barrier then revives in floating gate
      const inBarrier = y <= 675 && y >= 560;
      const amp = inBarrier ? 26 : 52;
      const x =
        540 +
        xOffset +
        Math.sin(progress * Math.PI * 8 - frame * 0.28 + wIdx * 1.4) * amp;
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Live Probability Ticker value
  const probVal = (
    84.2 +
    14.6 * Math.abs(Math.sin(frame * 0.07)) +
    ((frame * 7) % 10) * 0.09
  ).toFixed(4);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${punchScale})`,
        opacity: fadeOut,
        fontFamily: "monospace",
      }}
    >
      {/* Mode Header Banner */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 56,
          right: 56,
          padding: "18px 28px",
          borderRadius: 14,
          backgroundColor: "rgba(245, 208, 97, 0.16)",
          border: "3px solid #F5D061",
          boxShadow: "0 0 32px rgba(245, 208, 97, 0.4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 23,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: 2,
        }}
      >
        <span style={{ color: "#F5D061" }}>
          ⚡ QUANTUM TUNNELING ENGAGED // V_PROG: +20V
        </span>
        <span style={{ color: "#00F0FF" }}>WAVE: ψ(x) ACTIVE</span>
      </div>

      {/* FLOATING GATE (Materializing Trapped Electrons) */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 110,
          right: 110,
          height: 230,
          borderRadius: "18px 18px 0 0",
          backgroundColor: "rgba(245, 208, 97, 0.12)",
          border: "3px solid #F5D061",
          borderBottom: "none",
          boxShadow: "0 0 36px rgba(245, 208, 97, 0.3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 24px",
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            FLOATING GATE TRAP
          </span>
          <span
            style={{
              transform: `scale(${lockSpring})`,
              padding: "6px 18px",
              borderRadius: 8,
              backgroundColor: "#F5D061",
              color: "#050508",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            BIT STATE: LOCKED (1)
          </span>
        </div>

        {/* Materialized Golden Particles Inside Floating Gate */}
        {Array.from({ length: trappedCount }).map((_, idx) => {
          const col = idx % 8;
          const row = Math.floor(idx / 8);
          const x =
            75 + col * 96 + Math.sin(frame * 0.15 + idx * 1.3) * 14;
          const y =
            78 + row * 68 + Math.cos(frame * 0.18 + idx * 2.1) * 12;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: "#F5D061",
                boxShadow: "0 0 20px #F5D061, 0 0 8px #FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 15,
                fontWeight: 900,
                color: "#050508",
              }}
            >
              e⁻
            </div>
          );
        })}
      </div>

      {/* SOLID CYAN BARRIER Being Phased Through */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 90,
          right: 90,
          height: 115,
          borderRadius: 12,
          backgroundColor: "rgba(0, 240, 255, 0.22)",
          border: "4px solid #00F0FF",
          boxShadow:
            "0 0 42px rgba(0, 240, 255, 0.75), inset 0 0 28px rgba(245, 208, 97, 0.45)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
            textShadow: "0 0 14px #00F0FF",
          }}
        >
          SiO₂ GLASS OXIDE BARRIER (10nm)
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#F5D061",
            letterSpacing: 3,
            marginTop: 4,
          }}
        >
          WAVE FUNCTION ψ(x) PHASING THROUGH SOLID WALL
        </span>
      </div>

      {/* Oscillating Quantum Probability Waves ψ(x) Phasing Right Through Barrier */}
      <svg
        width={1080}
        height={1920}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 6,
          pointerEvents: "none",
        }}
      >
        {wavePaths.map((d, idx) => (
          <path
            key={idx}
            d={d}
            fill="none"
            stroke="#F5D061"
            strokeWidth={6}
            style={{
              filter:
                "drop-shadow(0px 0px 16px #F5D061) drop-shadow(0px 0px 28px rgba(0, 240, 255, 0.8))",
            }}
          />
        ))}
      </svg>

      {/* ψ(x) Wave Function Label Pill */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 330,
          width: 420,
          padding: "12px 24px",
          borderRadius: 12,
          backgroundColor: "rgba(5, 5, 8, 0.9)",
          border: "2px solid #F5D061",
          boxShadow: "0 0 24px rgba(245, 208, 97, 0.55)",
          textAlign: "center",
          fontSize: 26,
          fontWeight: 900,
          color: "#F5D061",
          zIndex: 8,
        }}
      >
        ψ(x) = A·e^(−κx) WAVE GHOST
      </div>

      {/* Bottom SOURCE CHANNEL (+20V High Voltage Field) */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 110,
          right: 110,
          height: 150,
          borderRadius: "0 0 18px 18px",
          backgroundColor: "rgba(0, 240, 255, 0.14)",
          border: "3px solid #00F0FF",
          boxShadow: "0 0 32px rgba(0, 240, 255, 0.35)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#00F0FF",
            letterSpacing: 3,
          }}
        >
          SOURCE CHANNEL // FOWLER-NORDHEIM FIELD
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#F5D061",
            letterSpacing: 2,
          }}
        >
          ELECTRONS DISSOLVE INTO PROBABILITY WAVES
        </span>
      </div>

      {/* Live Quantum Probability Ticker */}
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 80,
          right: 80,
          padding: "22px 34px",
          borderRadius: 16,
          backgroundColor: "rgba(5, 5, 8, 0.92)",
          border: "3px solid #F5D061",
          boxShadow: "0 0 35px rgba(245, 208, 97, 0.4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            LIVE QUANTUM TUNNELING PROBABILITY TICKER
          </span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            |ψ(x)|² TRANSMISSION:{" "}
            <span style={{ color: "#F5D061" }}>{probVal}%</span>
          </span>
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            backgroundColor: "rgba(57, 229, 8, 0.2)",
            border: "2px solid #39E508",
            color: "#39E508",
            fontSize: 22,
            fontWeight: 900,
          }}
        >
          LOCKED: {trappedCount} e⁻
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene4QuantumTunneling: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 1020 (0:36 to 1:10)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050508",
        overflow: "hidden",
      }}
    >
      {/* Procedural Dark Grid Background */}
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

      {/* Strict Sequence Unmounting for Classical Physics Mode (0:36 - 0:52 = 480 frames) */}
      <Sequence from={0} durationInFrames={480}>
        <ClassicalPhysicsCrossSection />
      </Sequence>

      {/* Strict Sequence Unmounting for Quantum Tunneling Mode (0:52 - 1:10 = 540 frames) */}
      <Sequence from={480} durationInFrames={540}>
        <QuantumTunnelingWaveCrossSection />
      </Sequence>
    </AbsoluteFill>
  );
};
