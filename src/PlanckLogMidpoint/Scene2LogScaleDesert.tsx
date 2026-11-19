import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 2 (0:08 – 0:18 = 300 frames — Pure #000000 Code Animation):
// Pure black #000000 canvas.
// Render a sleek vertical logarithmic scale from 10^-35 m (PLANCK LENGTH) at the bottom
// to 10^27 m (OBSERVABLE UNIVERSE) at the top.
// Animate a cyan marker (YOU: ×10/sec) climbing from 10^-35 m to 10^-25 m through a
// bracketed zone labeled QUANTUM DESERT // 0 PARTICLES FOUND, while a gold marker
// (FRIEND: ÷10/sec) drops from 10^27 m to 10^17 m with a live stopwatch ticking
// T = 00.0s to T = 10.0s.
export const Scene2LogScaleDesert: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 300 (10 seconds at 30fps)
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [224, 232], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress from T = 0.0s to T = 10.0s across the scene (232 frames)
  const progress = interpolate(frame, [10, 218], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stopwatchSec = (progress * 10).toFixed(1).padStart(4, "0");

  // Exponents ticking live:
  // YOU climbs from -35 to -25 (10^-35 m -> 10^-25 m)
  const youExp = (-35 + progress * 10).toFixed(1);
  // FRIEND drops from 27 to 17 (10^27 m -> 10^17 m)
  const friendExp = (27 - progress * 10).toFixed(1);

  // Vertical ruler coordinates (kept above y=1300 so subtitles at bottom never touch)
  const topY = 330; // 10^27 m (OBSERVABLE UNIVERSE)
  const friendEndY = 630; // 10^17 m
  const desertTopY = 890; // 10^-25 m
  const bottomY = 1230; // 10^-35 m (PLANCK LENGTH)

  const youY = interpolate(progress, [0, 1], [bottomY, desertTopY]);
  const friendY = interpolate(progress, [0, 1], [topY, friendEndY]);

  const pulse = 0.65 + 0.35 * Math.sin(frame * 0.25);

  const scaleTicks = [
    { y: topY, exp: "10^27 m", label: "OBSERVABLE UNIVERSE", color: "#F5D061", major: true },
    { y: 480, exp: "10^22 m", label: "LOCAL SUPERCLUSTER", color: "rgba(245,208,97,0.55)", major: false },
    { y: friendEndY, exp: "10^17 m", label: "10 LIGHT-YEARS", color: "#F5D061", major: true },
    { y: 760, exp: "10^-4 m", label: "LOGARITHMIC MIDPOINT", color: "rgba(255,255,255,0.45)", major: false },
    { y: desertTopY, exp: "10^-25 m", label: "UPPER DESERT BOUNDARY", color: "#00F0FF", major: true },
    { y: 1060, exp: "10^-30 m", label: "SUB-QUARK VOID", color: "rgba(0,240,255,0.55)", major: false },
    { y: bottomY, exp: "10^-35 m", label: "PLANCK LENGTH", color: "#00F0FF", major: true },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "monospace",
        opacity: fadeOut,
        pointerEvents: "none",
      }}
    >
      {/* Top Stopwatch & Scale Header on Pure #000000 */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 56,
          right: 56,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.94, 1])})`,
          padding: "20px 28px",
          borderRadius: 18,
          backgroundColor: "#000000",
          border: "1.5px solid #00F0FF",
          boxShadow: "0 0 28px rgba(0, 240, 255, 0.22)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#00F0FF",
              letterSpacing: 2,
            }}
          >
            LOGARITHMIC SCALE // 62 ORDERS OF MAGNITUDE
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1.5,
            }}
          >
            10^-35 m (PLANCK) ↔ 10^27 m (COSMOS)
          </span>
        </div>

        {/* Live Stopwatch T = 00.0s to T = 10.0s */}
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            backgroundColor: "rgba(245, 208, 97, 0.12)",
            border: "2px solid #F5D061",
            boxShadow: "0 0 20px rgba(245, 208, 97, 0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#F5D061",
              letterSpacing: 2,
            }}
          >
            STOPWATCH
          </span>
          <span
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "#F5D061",
              letterSpacing: 1,
            }}
          >
            T = {stopwatchSec}s
          </span>
        </div>
      </div>

      {/* Main SVG Logarithmic Ruler & Animated Markers */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="logSpineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5D061" />
            <stop offset="48%" stopColor="#FFFFFF" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
        </defs>

        {/* Central Vertical Logarithmic Spine (x = 460) */}
        <line
          x1={460}
          y1={topY}
          x2={460}
          y2={bottomY}
          stroke="url(#logSpineGrad)"
          strokeWidth={4}
        />

        {/* Active Gold Path Traversed (10^27 m down to friendY) */}
        <line
          x1={460}
          y1={topY}
          x2={460}
          y2={friendY}
          stroke="#F5D061"
          strokeWidth={8}
          style={{ filter: "drop-shadow(0 0 12px #F5D061)" }}
        />

        {/* Active Cyan Path Traversed (10^-35 m up to youY) */}
        <line
          x1={460}
          y1={bottomY}
          x2={460}
          y2={youY}
          stroke="#00F0FF"
          strokeWidth={8}
          style={{ filter: "drop-shadow(0 0 12px #00F0FF)" }}
        />

        {/* Minor Sub-Ticks Along the Spine */}
        {Array.from({ length: 37 }).map((_, idx) => {
          const ty = topY + (idx * (bottomY - topY)) / 36;
          return (
            <line
              key={idx}
              x1={450}
              y1={ty}
              x2={470}
              y2={ty}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Scale Ticks & Labels (auto-dim left label when YOU pill passes over it) */}
        {scaleTicks.map((t, idx) => {
          const pillOverlap = !t.major && Math.abs(youY - t.y) < 58;
          return (
            <g key={idx}>
              <line
                x1={436}
                y1={t.y}
                x2={484}
                y2={t.y}
                stroke={t.color}
                strokeWidth={t.major ? 3.5 : 2}
              />
              {!pillOverlap && (
                <>
                  <text
                    x={418}
                    y={t.y - 6}
                    textAnchor="end"
                    fill={t.color}
                    fontSize={t.major ? 24 : 18}
                    fontWeight="bold"
                  >
                    {t.exp}
                  </text>
                  <text
                    x={418}
                    y={t.y + 18}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.75)"
                    fontSize={14}
                    fontWeight="bold"
                    letterSpacing={1.2}
                  >
                    {t.label}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Bracketed Zone on Right: QUANTUM DESERT // 0 PARTICLES FOUND (10^-35 m to 10^-25 m) */}
        <g>
          {/* Shaded Quantum Desert Zone */}
          <rect
            x={468}
            y={desertTopY}
            width={540}
            height={bottomY - desertTopY}
            rx={14}
            fill="rgba(0, 240, 255, 0.06)"
            stroke="rgba(0, 240, 255, 0.35)"
            strokeWidth={2}
            strokeDasharray="8 6"
          />
          {/* Crisp Cyan Bracket */}
          <path
            d={`M 495 ${desertTopY + 8} L 525 ${desertTopY + 8} L 525 ${
              bottomY - 8
            } L 495 ${bottomY - 8}`}
            fill="none"
            stroke="#00F0FF"
            strokeWidth={4}
            style={{ filter: "drop-shadow(0 0 8px #00F0FF)" }}
          />
          <text
            x={548}
            y={(desertTopY + bottomY) / 2 - 14}
            fill="#00F0FF"
            fontSize={23}
            fontWeight="bold"
            letterSpacing={1.5}
          >
            QUANTUM DESERT
          </text>
          <text
            x={548}
            y={(desertTopY + bottomY) / 2 + 18}
            fill="#F5D061"
            fontSize={20}
            fontWeight="bold"
            letterSpacing={1.5}
          >
            // 0 PARTICLES FOUND
          </text>
          <text
            x={548}
            y={(desertTopY + bottomY) / 2 + 46}
            fill="rgba(255,255,255,0.7)"
            fontSize={15}
            fontWeight="bold"
          >
            10^-35 m → 10^-25 m PURE VACUUM FOAM
          </text>
        </g>

        {/* GOLD MARKER: FRIEND: ÷10/sec dropping from 10^27 m to 10^17 m */}
        <g transform={`translate(460, ${friendY})`}>
          <circle
            cx={0}
            cy={0}
            r={18}
            fill="#000000"
            stroke="#F5D061"
            strokeWidth={5}
            style={{ filter: "drop-shadow(0 0 14px #F5D061)" }}
          />
          <circle cx={0} cy={0} r={7} fill="#F5D061" />
          {/* Downward motion arrow */}
          <polygon points="0,34 -9,21 9,21" fill="#F5D061" />

          {/* Gold Callout Pill on Right */}
          <line
            x1={22}
            y1={0}
            x2={78}
            y2={0}
            stroke="#F5D061"
            strokeWidth={3}
          />
          <rect
            x={78}
            y={-42}
            width={450}
            height={84}
            rx={14}
            fill="#000000"
            stroke="#F5D061"
            strokeWidth={3}
            style={{ filter: "drop-shadow(0 0 16px rgba(245, 208, 97, 0.45))" }}
          />
          <text
            x={102}
            y={-8}
            fill="#F5D061"
            fontSize={22}
            fontWeight="bold"
            letterSpacing={1.2}
          >
            FRIEND: ÷10/sec (SHRINKING)
          </text>
          <text
            x={102}
            y={24}
            fill="#FFFFFF"
            fontSize={22}
            fontWeight="bold"
          >
            SCALE: 10^{friendExp} m
          </text>
        </g>

        {/* CYAN MARKER: YOU: ×10/sec climbing from 10^-35 m to 10^-25 m */}
        <g transform={`translate(460, ${youY})`}>
          <circle
            cx={0}
            cy={0}
            r={18}
            fill="#000000"
            stroke="#00F0FF"
            strokeWidth={5}
            style={{ filter: `drop-shadow(0 0 ${14 * pulse}px #00F0FF)` }}
          />
          <circle cx={0} cy={0} r={7} fill="#00F0FF" />
          {/* Upward motion arrow */}
          <polygon points="0,-34 -9,-21 9,-21" fill="#00F0FF" />

          {/* Cyan Callout Pill on Left */}
          <line
            x1={-22}
            y1={0}
            x2={-62}
            y2={0}
            stroke="#00F0FF"
            strokeWidth={3}
          />
          <rect
            x={-405}
            y={-42}
            width={343}
            height={84}
            rx={14}
            fill="#000000"
            stroke="#00F0FF"
            strokeWidth={3}
            style={{ filter: "drop-shadow(0 0 16px rgba(0, 240, 255, 0.5))" }}
          />
          <text
            x={-382}
            y={-8}
            fill="#00F0FF"
            fontSize={22}
            fontWeight="bold"
            letterSpacing={1.2}
          >
            YOU: ×10/sec (GROWING)
          </text>
          <text
            x={-382}
            y={24}
            fill="#FFFFFF"
            fontSize={22}
            fontWeight="bold"
          >
            SCALE: 10^{youExp} m
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
