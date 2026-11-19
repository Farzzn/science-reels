import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  Scene1SplitHook,
  Scene2MacroDive,
  Scene3RGBSubpixelCanyon,
} from "./ScenesPart1";
import {
  Scene4HostPivot1,
  Scene5RetinalConeOverlap,
  Scene6RGBFakeout,
  Scene7PWMBrightnessSteps,
} from "./ScenesPart2";
import {
  Scene8HostPivot2,
  Scene9OLEDTrueBlack,
  Scene10RasterScanWave,
  Scene11HostOutro,
} from "./ScenesPart3";
import { BG_VOID_COLOR } from "./shared";

// ============================================================================
// EXACT <Series> CLIP DURATIONS (30fps, 104 seconds = 3120 frames total):
// - Clips 1, 4, 8 are 8 seconds (240 frames each) = 720 frames
// - Clips 2, 3, 5, 6, 7, 9, 10, 11 are 10 seconds (300 frames each) = 2400 frames
// Total = 3120 frames
// ============================================================================
export const HOW_RGB_TRICKS_DURATION_FRAMES = 3120;

export const HowRGBTricksYourBrain3D: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_VOID_COLOR }}>
      <Series>
        {/* Scene 1 (Frames 0 to 240 / 8s — 50/50 Horizontal Split-Screen Hook) */}
        <Series.Sequence durationInFrames={240}>
          <Scene1SplitHook />
        </Series.Sequence>

        {/* Scene 2 (Frames 240 to 540 / 10s — Full-Screen 3D Macro Dive Into the Glass) */}
        <Series.Sequence durationInFrames={300}>
          <Scene2MacroDive />
        </Series.Sequence>

        {/* Scene 3 (Frames 540 to 840 / 10s — Full-Screen 3D RGB Subpixel Canyon) */}
        <Series.Sequence durationInFrames={300}>
          <Scene3RGBSubpixelCanyon />
        </Series.Sequence>

        {/* Scene 4 (Frames 840 to 1080 / 8s — Full-Screen Host Pivot 1) */}
        <Series.Sequence durationInFrames={240}>
          <Scene4HostPivot1 />
        </Series.Sequence>

        {/* Scene 5 (Frames 1080 to 1380 / 10s — Full-Screen 3D Retinal Cone Wavelength Overlap) */}
        <Series.Sequence durationInFrames={300}>
          <Scene5RetinalConeOverlap />
        </Series.Sequence>

        {/* Scene 6 (Frames 1380 to 1680 / 10s — Full-Screen 3D The RGB Fakeout) */}
        <Series.Sequence durationInFrames={300}>
          <Scene6RGBFakeout />
        </Series.Sequence>

        {/* Scene 7 (Frames 1680 to 1980 / 10s — Full-Screen 3D 8-Bit PWM Brightness Steps) */}
        <Series.Sequence durationInFrames={300}>
          <Scene7PWMBrightnessSteps />
        </Series.Sequence>

        {/* Scene 8 (Frames 1980 to 2220 / 8s — Full-Screen Host Pivot 2) */}
        <Series.Sequence durationInFrames={240}>
          <Scene8HostPivot2 />
        </Series.Sequence>

        {/* Scene 9 (Frames 2220 to 2520 / 10s — Full-Screen 3D OLED True-Black Contrast Canyon) */}
        <Series.Sequence durationInFrames={300}>
          <Scene9OLEDTrueBlack />
        </Series.Sequence>

        {/* Scene 10 (Frames 2520 to 2820 / 10s — Full-Screen 3D 120Hz Raster Scan Wave) */}
        <Series.Sequence durationInFrames={300}>
          <Scene10RasterScanWave />
        </Series.Sequence>

        {/* Scene 11 (Frames 2820 to 3120 / 10s — Full-Screen Host Outro CTA) */}
        <Series.Sequence durationInFrames={300}>
          <Scene11HostOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
