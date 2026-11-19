import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// 1920x1080 YouTube Thumbnail for Episode 2: "1 BIT FLIP" (Mario + Cosmic Ray + Microchip)
export const CosmicThumbnail: React.FC = () => {
  const bits = ["1", "1", "0", "0", "0", "1", "0", "0"];
  return (
    <AbsoluteFill>
      <Background />

      {/* Right Half: Mario Upwarp Hero Illustration with Golden Glow Frame */}
      <div
        style={{
          position: "absolute",
          right: 54,
          top: 66,
          width: 780,
          height: 948,
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

      {/* Diagonal Cosmic Particle Ray Beam Piercing From Top-Left Into the Bit Register */}
      <svg width={1920} height={1080} style={{ position: "absolute", pointerEvents: "none" }}>
        <g style={{ filter: svgGlow(C.gold, 14) }}>
          <line x1={740} y1={0} x2={935} y2={840} stroke={C.gold} strokeWidth={14} />
          <line x1={740} y1={0} x2={935} y2={840} stroke="#ffffff" strokeWidth={5} />
          <circle cx={935} cy={840} r={24} fill="#ffffff" />
          <circle cx={935} cy={840} r={46} fill="none" stroke={C.red} strokeWidth={6} />
        </g>
      </svg>

      {/* Top-Left Giant Clickbait Headline: "1 BIT FLIP" */}
      <div style={{ position: "absolute", left: 74, top: 82 }}>
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
          COSMIC RAY HIT HIS CONSOLE
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 215,
            lineHeight: 0.91,
            color: C.white,
            letterSpacing: -8,
            marginTop: 18,
            textShadow: "0 14px 45px rgba(0,0,0,0.95)",
          }}
        >
          1 BIT
          <br />
          <span style={{ color: C.gold, textShadow: glow(C.gold, 24) }}>FLIP?!</span>
        </div>
      </div>

      {/* Bottom-Left 8-Bit Register Showing 0xC5 -> 0xC4 Bit Flip */}
      <div style={{ position: "absolute", left: 74, bottom: 84 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 18 }}>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 900,
              fontSize: 46,
              color: C.white,
              background: "rgba(10,20,48,0.92)",
              border: `3px solid ${C.red}`,
              borderRadius: 16,
              padding: "10px 28px",
              boxShadow: glow(C.red, 12),
            }}
          >
            0xC5 → <span style={{ color: C.red }}>0xC4</span>
          </div>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 44, color: C.gold, textShadow: glow(C.gold, 10) }}>
            $1,000 UNSOLVED GLITCH
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {bits.map((b, i) => {
            const isLast = i === 7;
            const col = isLast ? C.red : b === "1" ? C.gold : C.cyan;
            return (
              <div
                key={i}
                style={{
                  width: 102,
                  height: 126,
                  borderRadius: 18,
                  background: isLast ? "rgba(255,77,94,0.32)" : "rgba(10,20,48,0.92)",
                  border: `4px solid ${col}`,
                  boxShadow: isLast ? glow(C.red, 20) : glow(col, 8),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontWeight: 900,
                  fontSize: 74,
                  color: isLast ? "#ffffff" : col,
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
