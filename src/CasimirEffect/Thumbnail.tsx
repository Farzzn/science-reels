import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// YOUTUBE THUMBNAIL (1920x1080) — "FORCE FROM NOTHING?"
// Ultra-high contrast, 3 words, gleaming parallel mirror plates + inward pressure arrows
// ===========================================================================
export const CasimirThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040814", overflow: "hidden" }}>
      {/* Hero 3D Mirror Plates & Quantum Fluctuations Artwork */}
      <Img
        src={staticFile("casimir/thumb-art.jpg")}
        style={{
          position: "absolute",
          width: "106%",
          height: "106%",
          left: "4%",
          top: "-3%",
          objectFit: "cover",
        }}
      />

      {/* Deep Left-Side Contrast Gradient so Text Pops at Mobile Size */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(4,8,20,0.96) 0%, rgba(4,8,20,0.88) 38%, rgba(4,8,20,0.18) 60%, rgba(4,8,20,0.05) 100%)",
        }}
      />

      {/* Bold Curved Crimson/Gold Inward Force Arrows Pushing the Two Plates Together */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        {/* Left outer inward push arrow */}
        <g style={{ filter: svgGlow(C.red, 12) }}>
          <path d="M760,555 L930,555" stroke={C.red} strokeWidth={22} strokeLinecap="round" />
          <polygon points="970,555 912,516 912,594" fill={C.red} />
        </g>
        {/* Right outer inward push arrow */}
        <g style={{ filter: svgGlow(C.red, 12) }}>
          <path d="M1800,555 L1630,555" stroke={C.red} strokeWidth={22} strokeLinecap="round" />
          <polygon points="1590,555 1648,516 1648,594" fill={C.red} />
        </g>
      </svg>

      {/* Left Focal Typography — 3 Giant High-Contrast Words */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 195,
          width: 820,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 36,
            color: C.cyan,
            letterSpacing: 6,
            textShadow: glow(C.cyan, 10),
          }}
        >
          EMPTY SPACE PUSHES BACK
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 162,
            lineHeight: 0.96,
            letterSpacing: -6,
            color: "#ffffff",
            marginTop: 22,
            textShadow: "0 12px 38px rgba(0,0,0,0.95)",
          }}
        >
          FORCE
          <br />
          FROM
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 168,
            lineHeight: 0.98,
            letterSpacing: -6,
            color: C.gold,
            marginTop: 6,
            textShadow: `${glow(C.gold, 22)}, 0 12px 42px rgba(0,0,0,0.98)`,
          }}
        >
          NOTHING?
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 48,
            color: "#e2e8f0",
            marginTop: 30,
            letterSpacing: -1,
            textShadow: "0 8px 24px rgba(0,0,0,0.95)",
          }}
        >
          The <span style={{ color: C.cyan }}>Casimir Effect</span> Explained
        </div>
      </div>
    </AbsoluteFill>
  );
};
