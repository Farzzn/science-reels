import {
  Caption,
  createTikTokStyleCaptions,
  TikTokPage,
} from "@remotion/captions";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";

const SWITCH_CAPTIONS_EVERY_MS = 850;
const HIGHLIGHT_COLOR = "#F5D061";

const SCIENCE_KEYWORDS = new Set([
  "NASA",
  "WARSHIPS",
  "1945",
  "1918",
  "ATOMIC",
  "BOMB",
  "500",
  "NUCLEAR",
  "RADIOACTIVE",
  "FALLOUT",
  "STEEL",
  "MOLTEN",
  "IRON",
  "COBALT-60",
  "RADIATION",
  "DARK",
  "MATTER",
  "BLINDS",
  "SENSOR",
  "LOW-BACKGROUND",
  "BATTLESHIPS",
  "QUANTUM",
  "TUNNELING",
  "FLOATING",
  "GATE",
  "OXIDE",
  "ELECTRONS",
  "WAVE",
  "LAVA",
  "ENTROPY",
  "SHA-256",
  "HACKER",
  "SEED",
  "MEMS",
  "GYROSCOPE",
  "SILICON",
  "CORIOLIS",
  "HURRICANES",
  "TUNING",
  "FORK",
  "TEETH",
  "BILLIONTH",
  "ROTATION",
  "PLANCK",
  "PLANK",
  "UNIVERSE",
  "DESERT",
  "NEUTRINO",
  "NEBULA",
  "PROTON",
  "MOON",
  "OXYGEN",
  "PYRAMID",
  "GIZA",
  "COLLIDE",
  "EGG",
  "MIDPOINT",
  "COSMOS",
  "10",
  "20",
  "24",
  "31",
  "LIGHT",
  "REFRACTION",
  "LIFEGUARD",
  "SAND",
  "WATER",
  "SWIMMING",
  "FASTEST",
  "FERMAT",
  "FERMATS",
  "SNELL",
  "SNELLS",
  "FEYNMAN",
  "PHOTON",
  "PATHS",
  "INTERFERENCE",
  "PHASE",
  "SHORTEST",
  "TIME",
  "LASER",
  "BOUNDARY",
]);

function cleanWord(w: string): string {
  return w.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
}

const KineticPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 180,
      stiffness: 220,
    },
    durationInFrames: 6,
  });

  // Split tokens cleanly so EVERY individual word has its own <span> with display: 'inline-block' and marginRight: '0.32em'
  const words = useMemo(() => {
    const out: Array<{ text: string; fromMs: number; toMs: number }> = [];
    for (const t of page.tokens) {
      const parts = t.text.trim().split(/\s+/).filter(Boolean);
      for (const part of parts) {
        out.push({
          text: part,
          fromMs: t.fromMs,
          toMs: t.toMs,
        });
      }
    }
    return out;
  }, [page.tokens]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 380,
        paddingLeft: 64,
        paddingRight: 110,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "8px",
          maxWidth: 880,
          transform: `scale(${interpolate(enter, [0, 1], [0.88, 1])}) translateY(${interpolate(
            enter,
            [0, 1],
            [26, 0],
          )}px)`,
        }}
      >
        {words.map((word, idx) => {
          const startRelative = word.fromMs - page.startMs;
          const endRelative = word.toMs - page.startMs;
          const isActive =
            startRelative <= timeInMs && endRelative > timeInMs;
          const isKeyword = SCIENCE_KEYWORDS.has(cleanWord(word.text));
          const isYellow = isActive || isKeyword;

          return (
            <span
              key={`${word.fromMs}-${idx}`}
              style={{
                display: "inline-block",
                marginRight: "0.32em",
                fontFamily: `'Montserrat', 'Inter', ${TheBoldFont}, sans-serif`,
                fontWeight: 900,
                fontSize: 64,
                textTransform: "uppercase",
                color: isYellow ? HIGHLIGHT_COLOR : "#FFFFFF",
                WebkitTextStroke: "14px #050508",
                paintOrder: "stroke",
                textShadow: isYellow
                  ? "0px 0px 24px rgba(245, 208, 97, 0.75), 0px 8px 20px rgba(0, 0, 0, 0.95)"
                  : "0px 8px 20px rgba(0, 0, 0, 0.9)",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                lineHeight: 1.15,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const KineticSubtitleLayer: React.FC<{
  subtitles: Caption[];
}> = ({ subtitles }) => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles ?? [],
    });
  }, [subtitles]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps + 15,
        );
        const durationInFrames = Math.round(
          subtitleEndFrame - subtitleStartFrame,
        );
        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={Math.round(subtitleStartFrame)}
            durationInFrames={durationInFrames}
          >
            <KineticPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
