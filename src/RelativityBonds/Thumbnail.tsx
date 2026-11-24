import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// YOUTUBE THUMBNAIL (1920x1080) — "EINSTEIN BROKE THIS BOND"
// High-CTR, ultra-clean left navy typography + shattering bismuth triple-bond art
// ===========================================================================
export const RelativityBondsThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040814", overflow: "hidden" }}>
      {/* Hero 3D Relativistic Triple Bond Shattering Artwork */}
      <Img
        src={staticFile("relbonds/thumb-art.jpg")}
        style={{
          position: "absolute",
          width: "105%",
          height: "105%",
          left: "2%",
          top: "-2.5%",
          objectFit: "cover",
        }}
      />

      {/* Deep Left-Side Contrast Gradient so Text Pops at Mobile Size */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(4,8,20,0.97) 0%, rgba(4,8,20,0.9) 36%, rgba(4,8,20,0.18) 58%, rgba(4,8,20,0.03) 100%)",
        }}
      />

      {/* Left Focal Typography — Punchy, Clean, High-CTR */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 175,
          width: 860,
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
          2026 SCIENCE BREAKTHROUGH
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 158,
            lineHeight: 0.95,
            letterSpacing: -6,
            color: "#ffffff",
            marginTop: 22,
            textShadow: "0 12px 38px rgba(0,0,0,0.95)",
          }}
        >
          EINSTEIN
          <br />
          BROKE
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 156,
            lineHeight: 0.98,
            letterSpacing: -6,
            color: C.gold,
            marginTop: 8,
            textShadow: `${glow(C.gold, 22)}, 0 12px 42px rgba(0,0,0,0.98)`,
          }}
        >
          CHEMISTRY?
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
          Why Heavy Bonds <span style={{ color: C.cyan }}>Defy Textbooks</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
