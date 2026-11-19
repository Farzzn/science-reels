import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const HEX_CHARS = "0123456789abcdef";

function deterministicHash(seed: number): string {
  let out = "";
  for (let i = 0; i < 64; i++) {
    const val = Math.floor(
      Math.abs(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453),
    );
    out += HEX_CHARS[val % 16];
  }
  return out;
}

export const EntropyTicker: React.FC<{ frame: number }> = ({ frame }) => {
  // Cycles through a 64-character hexadecimal SHA-256 hash every 2 frames
  const tickStep = Math.floor(frame / 2);
  const hash = deterministicHash(tickStep + 104729);

  return (
    <div
      style={{
        marginTop: 28,
        width: 920,
        padding: "22px 30px",
        borderRadius: 16,
        backgroundColor: "rgba(5, 5, 8, 0.88)",
        border: "2px solid #F5D061",
        boxShadow:
          "0 0 32px rgba(245, 208, 97, 0.35), inset 0 0 18px rgba(245, 208, 97, 0.12)",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: 800,
          color: "#F5D061",
          letterSpacing: 3,
        }}
      >
        <span>SHA-256 CSPRNG ENTROPY DIGEST</span>
        <span style={{ color: "#00F0FF" }}>256-BIT // LIVE</span>
      </div>
      <div
        style={{
          fontSize: 27,
          fontWeight: 900,
          color: "#FFFFFF",
          letterSpacing: 3,
          lineHeight: 1.35,
          wordBreak: "break-all",
          textShadow: "0 0 12px rgba(245, 208, 97, 0.65)",
        }}
      >
        <span style={{ color: "#F5D061" }}>{hash.slice(0, 16)}</span>
        {hash.slice(16, 32)}
        <br />
        {hash.slice(32, 48)}
        <span style={{ color: "#00F0FF" }}>{hash.slice(48, 64)}</span>
      </div>
    </div>
  );
};

// Strictly mounted only from 0:38 to 0:52 (420 frames)
export const BlobTargetingBoxesHUD: React.FC = () => {
  const frame = useCurrentFrame();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [412, 420], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetBoxes = [
    {
      id: "BLOB_TRK_01",
      baseX: 210,
      baseY: 420,
      size: 210,
      phaseX: 0,
      phaseY: 1.2,
      ampX: 95,
      ampY: 70,
    },
    {
      id: "BLOB_TRK_02",
      baseX: 640,
      baseY: 580,
      size: 240,
      phaseX: 2.1,
      phaseY: 0.4,
      ampX: 110,
      ampY: 85,
    },
    {
      id: "BLOB_TRK_03",
      baseX: 340,
      baseY: 960,
      size: 195,
      phaseX: 4.2,
      phaseY: 2.9,
      ampX: 120,
      ampY: 65,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        transform: `scale(${punchScale})`,
        opacity: fadeOut,
      }}
    >
      {targetBoxes.map((box, idx) => {
        const dx = Math.sin(frame / 20 + box.phaseX) * box.ampX;
        const dy = Math.cos(frame / 20 + box.phaseY) * box.ampY;
        const x = box.baseX + dx;
        const y = box.baseY + dy;

        return (
          <div
            key={box.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: box.size,
              height: box.size,
              border: "3px solid #F5D061",
              boxShadow:
                "0 0 22px rgba(245, 208, 97, 0.55), inset 0 0 14px rgba(245, 208, 97, 0.2)",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -26,
                left: 0,
                backgroundColor: "#F5D061",
                color: "#050508",
                fontFamily: "monospace",
                fontSize: 16,
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {box.id} [{Math.round(x)},{Math.round(y)}]
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 16,
                height: 16,
                marginLeft: -8,
                marginTop: -8,
                border: "2px solid #F5D061",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 6,
                right: 8,
                fontFamily: "monospace",
                fontSize: 15,
                fontWeight: 700,
                color: "#F5D061",
                textShadow: "0 2px 6px rgba(0,0,0,0.9)",
              }}
            >
              ΔT: {(0.42 + idx * 0.19 + Math.sin(frame / 10) * 0.08).toFixed(2)}
              K
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Strictly mounted only from 0:52 to 1:10 (540 frames)
export const PixelMagnifierMatrixHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punchScale = interpolate(frame, [0, 6], [1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [532, 540], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const tickFrame = Math.floor(frame / 2);
  const liveR = (241 + tickFrame * 17) % 256;
  const liveG = (89 + tickFrame * 31) % 256;
  const liveB = (194 + tickFrame * 43) % 256;
  const pad3 = (n: number) => String(n).padStart(3, "0");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 230,
        pointerEvents: "none",
        transform: `scale(${punchScale})`,
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          transform: `scale(${gridSpring})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Live Ticking RGB Header Banner */}
        <div
          style={{
            marginBottom: 18,
            padding: "14px 34px",
            borderRadius: 14,
            backgroundColor: "rgba(5, 5, 8, 0.9)",
            border: "2px solid #F5D061",
            boxShadow: "0 0 25px rgba(0, 0, 0, 0.85)",
            fontFamily: "monospace",
            fontSize: 34,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
            display: "flex",
            gap: 26,
          }}
        >
          <span style={{ color: "#FF5E5E" }}>R:{pad3(liveR)}</span>
          <span style={{ color: "#5EFF8E" }}>G:{pad3(liveG)}</span>
          <span style={{ color: "#58B8FF" }}>B:{pad3(liveB)}</span>
        </div>

        {/* 6x6 Pixel Magnifier Grid */}
        <div
          style={{
            width: 600,
            height: 600,
            padding: 14,
            borderRadius: 20,
            backgroundColor: "rgba(5, 5, 8, 0.88)",
            border: "3px solid #F5D061",
            boxShadow:
              "0 0 45px rgba(245, 208, 97, 0.45), inset 0 0 24px rgba(245, 208, 97, 0.2)",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(6, 1fr)",
            gap: 8,
          }}
        >
          {Array.from({ length: 36 }).map((_, cellIdx) => {
            const r =
              (170 +
                Math.floor(85 * Math.sin(frame * 0.22 + cellIdx * 0.73))) &
              255;
            const g =
              (75 +
                Math.floor(70 * Math.cos(frame * 0.19 + cellIdx * 1.13))) &
              255;
            const b =
              (155 +
                Math.floor(95 * Math.sin(frame * 0.27 + cellIdx * 0.41))) &
              255;

            return (
              <div
                key={cellIdx}
                style={{
                  backgroundColor: `rgb(${r}, ${g}, ${b})`,
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.28)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "monospace",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  textShadow: "0 1px 4px rgba(0,0,0,0.95)",
                  lineHeight: 1.15,
                }}
              >
                <span>R:{pad3(r)}</span>
                <span>G:{pad3(g)}</span>
                <span>B:{pad3(b)}</span>
              </div>
            );
          })}
        </div>

        {/* 64-Character SHA-256 EntropyTicker cycling every 2 frames */}
        <EntropyTicker frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

export const PixelHexScannerOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Strictly unmounts at local frame 420 (0:52) */}
      <Sequence from={0} durationInFrames={420}>
        <BlobTargetingBoxesHUD />
      </Sequence>
      {/* Strictly mounts at local frame 420 (0:52) and unmounts at 960 (1:10) */}
      <Sequence from={420} durationInFrames={540}>
        <PixelMagnifierMatrixHUD />
      </Sequence>
    </AbsoluteFill>
  );
};
