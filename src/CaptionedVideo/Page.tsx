import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";

const fontFamily = TheBoldFont;

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 390,
  height: 200,
  paddingLeft: 48,
  paddingRight: 96,
};

const DESIRED_FONT_SIZE = 104;
const HIGHLIGHT_COLOR = "#FFB800";

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width * 0.86,
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: "#FFFFFF",
          WebkitTextStroke: "18px #07070C",
          paintOrder: "stroke",
          textShadow: "0px 10px 28px rgba(0, 0, 0, 0.85)",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.84, 1])),
            translateY(interpolate(enterProgress, [0, 1], [32, 0])),
          ]),
          fontFamily,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.15,
          letterSpacing: "1.5px",
        }}
      >
        {page.tokens.map((t, index) => {
          const startRelativeToSequence = t.fromMs - page.startMs;
          const endRelativeToSequence = t.toMs - page.startMs;

          const active =
            startRelativeToSequence <= timeInMs &&
            endRelativeToSequence > timeInMs;

          return (
            <span
              key={`${t.fromMs}-${index}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                color: active ? HIGHLIGHT_COLOR : "#FFFFFF",
                transform: active ? "scale(1.09)" : "scale(1)",
                transformOrigin: "center bottom",
                filter: active
                  ? "drop-shadow(0px 0px 18px rgba(255, 184, 0, 0.65))"
                  : "none",
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
