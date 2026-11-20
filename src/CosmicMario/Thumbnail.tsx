import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, svgGlow } from "../FiveHundredMileEmail/theme";

// 1920x1080 YouTube Thumbnail — Simple & Clear:
// "Ghost from Space?" (bigger font) + "teleported Mario" (smaller font)
// + a flash of light from the top hitting the "M" of Mario + Mario upwarp illustration on right
export const CosmicThumbnail: React.FC = () => {
  // Exact coordinates of the "M" in "teleported Mario" (left: 88, 3 lines of 184px above it)
  const hitX = 636;
  const hitY = 824;

  return (
    <AbsoluteFill>
      <Background />

      {/* Right Half: Mario Upwarp Hero Illustration */}
      <div
        style={{
          position: "absolute",
          right: 56,
          top: 64,
          width: 790,
          height: 952,
          borderRadius: 36,
          overflow: "hidden",
          border: `5px solid ${C.gold}`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.9), ${glow(C.gold, 22)}`,
        }}
      >
        <Img
          src={staticFile("cosmic/mario-upwarp.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "18% 50%" }}
        />
      </div>

      {/* Left Typography: Bigger "Ghost from Space?" + Smaller "teleported Mario" */}
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 190,
          width: 960,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 184,
            lineHeight: 0.96,
            letterSpacing: -6,
            color: C.white,
            textShadow: "0 14px 45px rgba(0,0,0,0.95)",
          }}
        >
          Ghost
          <br />
          from <span style={{ color: C.gold, textShadow: glow(C.gold, 24) }}>Space?</span>
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1.1,
            letterSpacing: -2,
            color: C.cyan,
            marginTop: 64,
            textShadow: `0 10px 32px rgba(0,0,0,0.95), ${glow(C.cyan, 12)}`,
            whiteSpace: "nowrap",
          }}
        >
          teleported{" "}
          <span style={{ color: C.white, textShadow: glow(C.gold, 16) }}>Mario</span>
        </div>
      </div>

      {/* Flash of Light from Top Hitting the "M" of Mario */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}
      >
        <defs>
          <radialGradient id="impactFlash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="28%" stopColor="#ffe58f" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#ffb84d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffd666" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer soft beam halo coming down cleanly from upper-right-of-text to the "M" */}
        <line
          x1={hitX + 240}
          y1={-20}
          x2={hitX}
          y2={hitY}
          stroke={C.gold}
          strokeWidth={34}
          strokeOpacity={0.28}
          style={{ filter: svgGlow(C.gold, 18) }}
        />
        {/* Core razor beam */}
        <line
          x1={hitX + 240}
          y1={-20}
          x2={hitX}
          y2={hitY}
          stroke="url(#beamGrad)"
          strokeWidth={10}
          style={{ filter: svgGlow(C.gold, 12) }}
        />
        <line x1={hitX + 240} y1={-20} x2={hitX} y2={hitY} stroke="#ffffff" strokeWidth={4} />

        {/* Impact Starburst Flash directly on the "M" of Mario */}
        <circle cx={hitX} cy={hitY} r={115} fill="url(#impactFlash)" />
        {/* Horizontal & vertical lens flare spikes */}
        <line
          x1={hitX - 140}
          y1={hitY}
          x2={hitX + 140}
          y2={hitY}
          stroke="#ffffff"
          strokeWidth={5}
          strokeOpacity={0.85}
          style={{ filter: svgGlow(C.gold, 8) }}
        />
        <line
          x1={hitX}
          y1={hitY - 95}
          x2={hitX}
          y2={hitY + 95}
          stroke="#ffffff"
          strokeWidth={4}
          strokeOpacity={0.8}
          style={{ filter: svgGlow(C.gold, 8) }}
        />
        {/* Spark rays scattering outward */}
        {[
          [-75, -55],
          [80, -45],
          [-65, 58],
          [70, 52],
        ].map(([dx, dy], i) => (
          <line
            key={i}
            x1={hitX}
            y1={hitY}
            x2={hitX + dx}
            y2={hitY + dy}
            stroke={C.gold}
            strokeWidth={3.5}
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
        <circle cx={hitX} cy={hitY} r={18} fill="#ffffff" />
      </svg>
    </AbsoluteFill>
  );
};
