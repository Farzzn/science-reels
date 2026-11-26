import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// YOUTUBE THUMBNAIL (1920x1080) — "FASTER THAN LIGHT?"
// High-CTR dark-space thumbnail: giant left typography + warped spacetime art
// ===========================================================================
export const CosmicSpeedLimitThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050a18", overflow: "hidden" }}>
      {/* Hero Deep-Space Galaxy & Warped Spacetime Artwork */}
      <Img
        src={staticFile("cosmiclimit/thumb-art.jpg")}
        style={{
          position: "absolute",
          width: "104%",
          height: "104%",
          left: "1%",
          top: "-2%",
          objectFit: "cover",
        }}
      />

      {/* Deep Left-Side Gradient Scrim for Maximum Mobile Legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,10,24,0.98) 0%, rgba(5,10,24,0.92) 38%, rgba(5,10,24,0.28) 58%, rgba(5,10,24,0.04) 100%)",
        }}
      />

      {/* Left Punchy 3-Line Headline + Clean Sub-Badge */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 148,
          width: 860,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 184,
            lineHeight: 0.92,
            letterSpacing: -7,
            color: "#ffffff",
            textShadow: "0 14px 40px rgba(0, 0, 0, 0.96)",
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
            fontSize: 188,
            lineHeight: 0.96,
            letterSpacing: -7,
            color: C.gold,
            marginTop: 6,
            textShadow: `${glow(C.gold, 24)}, 0 14px 44px rgba(0, 0, 0, 0.98)`,
          }}
        >
          LIGHT?
        </div>

        {/* Crisp High-Contrast Sub-Badge */}
        <div
          style={{
            marginTop: 42,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 32px",
            borderRadius: 18,
            background: "rgba(5, 10, 24, 0.88)",
            border: `3px solid ${C.cyan}`,
            boxShadow: `${glow(C.cyan, 14)}, 0 14px 34px rgba(0, 0, 0, 0.85)`,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: C.gold,
              boxShadow: glow(C.gold, 8),
            }}
          />
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 40,
              color: C.white,
              letterSpacing: 2.5,
              whiteSpace: "nowrap",
            }}
          >
            HOW GALAXIES BEAT{" "}
            <span style={{ color: C.gold }}>c</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
