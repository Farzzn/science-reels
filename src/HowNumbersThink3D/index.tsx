import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Series,
  staticFile,
} from "remotion";
import { loadFont } from "../load-font";
import {
  Scene1SplitHook,
  Scene2Tokenization,
  Scene3GalaxyOfMeaning,
} from "./ScenesPart1";
import {
  Scene4HostPivot1,
  Scene5VectorArithmetic,
  Scene6SelfAttention,
  Scene7NeuralWeightsCity,
} from "./ScenesPart2";
import {
  Scene8HostPivot2,
  Scene9TransformerSkyscraper,
  Scene10ProbabilityWave,
  Scene11HostOutro,
} from "./ScenesPart3";
import { WhisperCaptionWord } from "./shared";

// 104 seconds / 3120 frames total at 30fps:
// Clips 1, 4, 8 = 240 frames (8s each) -> 720 frames
// Clips 2, 3, 5, 6, 7, 9, 10, 11 = 300 frames (10s each) -> 2400 frames
export const HOW_NUMBERS_THINK_DURATION_FRAMES = 3120;

export const HowNumbersThink3D: React.FC = () => {
  const [captionsMap, setCaptionsMap] = useState<
    Record<number, WhisperCaptionWord[]>
  >({});
  const [handle] = useState(() =>
    delayRender("Loading clip-1..clip-11 captions for HowNumbersThink3D"),
  );

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        await loadFont();
        const entries = await Promise.all(
          Array.from({ length: 11 }, async (_, i) => {
            const clipNum = i + 1;
            try {
              const res = await fetch(staticFile(`clip-${clipNum}.json`));
              if (!res.ok) return [clipNum, [] as WhisperCaptionWord[]] as const;
              const data = (await res.json()) as WhisperCaptionWord[];
              return [clipNum, data] as const;
            } catch {
              return [clipNum, [] as WhisperCaptionWord[]] as const;
            }
          }),
        );
        if (!cancelled) {
          const map: Record<number, WhisperCaptionWord[]> = {};
          for (const [k, v] of entries) {
            map[k] = v;
          }
          setCaptionsMap(map);
          continueRender(handle);
        }
      } catch {
        if (!cancelled) {
          continueRender(handle);
        }
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050811", overflow: "hidden" }}>
      <Series>
        {/* Scene 1 (Frames 0 to 240 / 8s — 50/50 Horizontal Split-Screen Hook) */}
        <Series.Sequence durationInFrames={240}>
          <Scene1SplitHook captions={captionsMap[1] ?? []} />
        </Series.Sequence>

        {/* Scene 2 (Frames 240 to 540 / 10s — Full-Screen 3D Tokenization & Vectors) */}
        <Series.Sequence durationInFrames={300}>
          <Scene2Tokenization captions={captionsMap[2] ?? []} />
        </Series.Sequence>

        {/* Scene 3 (Frames 540 to 840 / 10s — Full-Screen 3D Galaxy of Meaning) */}
        <Series.Sequence durationInFrames={300}>
          <Scene3GalaxyOfMeaning captions={captionsMap[3] ?? []} />
        </Series.Sequence>

        {/* Scene 4 (Frames 840 to 1080 / 8s — Full-Screen Host Pivot 1) */}
        <Series.Sequence durationInFrames={240}>
          <Scene4HostPivot1 captions={captionsMap[4] ?? []} />
        </Series.Sequence>

        {/* Scene 5 (Frames 1080 to 1380 / 10s — Full-Screen 3D Vector Arithmetic & Context Ambiguity) */}
        <Series.Sequence durationInFrames={300}>
          <Scene5VectorArithmetic captions={captionsMap[5] ?? []} />
        </Series.Sequence>

        {/* Scene 6 (Frames 1380 to 1680 / 10s — Full-Screen 3D Self-Attention Matrix) */}
        <Series.Sequence durationInFrames={300}>
          <Scene6SelfAttention captions={captionsMap[6] ?? []} />
        </Series.Sequence>

        {/* Scene 7 (Frames 1680 to 1980 / 10s — Full-Screen 3D Neural Weights City) */}
        <Series.Sequence durationInFrames={300}>
          <Scene7NeuralWeightsCity captions={captionsMap[7] ?? []} />
        </Series.Sequence>

        {/* Scene 8 (Frames 1980 to 2220 / 8s — Full-Screen Host Pivot 2) */}
        <Series.Sequence durationInFrames={240}>
          <Scene8HostPivot2 captions={captionsMap[8] ?? []} />
        </Series.Sequence>

        {/* Scene 9 (Frames 2220 to 2520 / 10s — Full-Screen 3D 96-Layer Transformer Skyscraper) */}
        <Series.Sequence durationInFrames={300}>
          <Scene9TransformerSkyscraper captions={captionsMap[9] ?? []} />
        </Series.Sequence>

        {/* Scene 10 (Frames 2520 to 2820 / 10s — Full-Screen 3D Next-Token Probability Wave) */}
        <Series.Sequence durationInFrames={300}>
          <Scene10ProbabilityWave captions={captionsMap[10] ?? []} />
        </Series.Sequence>

        {/* Scene 11 (Frames 2820 to 3120 / 10s — Full-Screen Host Outro CTA) */}
        <Series.Sequence durationInFrames={300}>
          <Scene11HostOutro captions={captionsMap[11] ?? []} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
