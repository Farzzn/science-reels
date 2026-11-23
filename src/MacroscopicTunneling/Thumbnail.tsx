import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// YOUTUBE THUMBNAIL (1920x1080) — "QUANTUM TUNNELING ON A CHIP?"
// Clean deep-navy left third + photorealistic 3D superconducting chip tunneling art
// ===========================================================================
export const MacroscopicThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040814", overflow: "hidden" }}>
      {/* Hero 3D Superconducting Chip & Quantum Barrier Artwork */}
      <Img
        src={staticFile("macrotunnel/thumb-art.jpg")}
        style={{
          position: "absolute",
          width: "106%",
          height: "106%",
          left: "3%",
          top: "-3%",
          objectFit: "cover",
        }}
      />

      {/* Deep Left-Side Contrast Gradient so Text Pops at Mobile Size */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(4,8,20,0.97) 0%, rgba(4,8,20,0.9) 36%, rgba(4,8,20,0.22) 58%, rgba(4,8,20,0.04) 100%)",
        }}
      />

      {/* Left Focal Typography — Punchy, Clean, High-CTR */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 175,
          width: 840,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 34,
            color: C.cyan,
            letterSpacing: 5,
            textShadow: glow(C.cyan, 10),
          }}
        >
          2025 NOBEL PRIZE IN PHYSICS
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 152,
            lineHeight: 0.96,
            letterSpacing: -6,
            color: "#ffffff",
            marginTop: 22,
            textShadow: "0 12px 38px rgba(0,0,0,0.95)",
          }}
        >
          QUANTUM
          <br />
          TUNNELING
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 154,
            lineHeight: 0.98,
            letterSpacing: -6,
            color: C.gold,
            marginTop: 8,
            textShadow: `${glow(C.gold, 22)}, 0 12px 42px rgba(0,0,0,0.98)`,
          }}
        >
          ON A CHIP?
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 44,
            color: "#e2e8f0",
            marginTop: 32,
            letterSpacing: -1,
            whiteSpace: "nowrap",
            textShadow: "0 8px 24px rgba(0,0,0,0.95)",
          }}
        >
          Billions of Electrons as <span style={{ color: C.cyan }}>One Atom</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
