import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// YOUTUBE THUMBNAIL (1920x1080) — "FASTER THAN ELECTRONS?"
// High-CTR dark left typography + shattering H2O X-ray studio render on right
// ===========================================================================
export const AttosecondWaterThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#040814", overflow: "hidden" }}>
      {/* Hero 3D Shattering Water Molecule + Lagging Electron Cloud Art */}
      <Img
        src={staticFile("attowater/thumb-art.jpg")}
        style={{
          position: "absolute",
          width: "104%",
          height: "104%",
          left: "1%",
          top: "-2%",
          objectFit: "cover",
        }}
      />

      {/* Deep Left-Side Contrast Gradient so Text Pops at Mobile Size */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(4,8,20,0.97) 0%, rgba(4,8,20,0.9) 37%, rgba(4,8,20,0.16) 56%, rgba(4,8,20,0.02) 100%)",
        }}
      />

      {/* Left Focal Typography — Punchy, Clean, High-CTR */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 170,
          width: 870,
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
            letterSpacing: 4.5,
            textShadow: glow(C.cyan, 10),
          }}
        >
          ATTOSECOND CHEMISTRY · 2026
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 162,
            lineHeight: 0.94,
            letterSpacing: -6,
            color: "#ffffff",
            marginTop: 22,
            textShadow: "0 12px 38px rgba(0,0,0,0.95)",
          }}
        >
          FASTER
          <br />
          THAN
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 146,
            lineHeight: 0.98,
            letterSpacing: -5.5,
            color: C.gold,
            marginTop: 8,
            textShadow: `${glow(C.gold, 22)}, 0 12px 42px rgba(0,0,0,0.98)`,
          }}
        >
          ELECTRONS?
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
          Water Caught Ripping Apart in <span style={{ color: C.cyan }}>0.000000000000004 s</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
