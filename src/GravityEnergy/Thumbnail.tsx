import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// 1920x1080 YouTube Thumbnail — Carter Studios Style:
// Simple & Clear: "FREE ENERGY?" + Earth bending spacetime grid holding the Moon + curved arrow
export const GravityThumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      {/* Full-bleed Spacetime Well Illustration Positioned on Right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Img
          src={staticFile("gravity/spacetime-well.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "75% 50%",
          }}
        />
        {/* Clean dark left gradient vignette so headline pops with 100% contrast */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(4,8,20,0.94) 0%, rgba(4,8,20,0.72) 38%, rgba(4,8,20,0.12) 68%, rgba(4,8,20,0) 100%)",
          }}
        />
      </div>

      {/* Top-Left Giant Clickbait Headline: "FREE ENERGY?" */}
      <div style={{ position: "absolute", left: 82, top: 105, zIndex: 5 }}>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 900,
            fontSize: 38,
            color: C.cyan,
            letterSpacing: 6,
            textShadow: glow(C.cyan, 10),
          }}
        >
          4.5 BILLION YEARS · 0 FUEL
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 220,
            lineHeight: 0.92,
            color: C.white,
            letterSpacing: -8,
            marginTop: 18,
            textShadow: "0 14px 48px rgba(0,0,0,0.95)",
          }}
        >
          FREE
          <br />
          <span style={{ color: C.gold, textShadow: glow(C.gold, 26) }}>ENERGY?</span>
        </div>

        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 66,
            color: C.white,
            marginTop: 34,
            textShadow: "0 8px 28px rgba(0,0,0,0.95)",
          }}
        >
          How Gravity Pulls <span style={{ color: C.cyan }}>Forever</span>
        </div>
      </div>

      {/* Crisp Red Curved Arrow Pointing to Earth's Bent Spacetime Funnel */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
        <g style={{ filter: svgGlow(C.red, 10) }}>
          <path
            d="M 850 610 Q 1040 540 1165 655"
            fill="none"
            stroke={C.red}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <polygon points="1185,675 1135,668 1165,625" fill={C.red} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
