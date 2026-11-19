import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import {
  Scene1SplitHook,
  Scene2MechanicalDrift,
  Scene3PiezoelectricLattice,
} from './ScenesPart1';
import {
  Scene4HostPivot1,
  Scene5MicroscopicTuningFork,
  Scene6BinaryFlipFlopTower,
  Scene7HalvingCascade,
} from './ScenesPart2';
import {
  Scene8HostPivot2,
  Scene9CesiumHyperfine,
  Scene10GlobalAtomicSync,
  Scene11HostOutro,
} from './ScenesPart3';

export const HOW_QUARTZ_SLICES_TIME_DURATION_FRAMES = 3120;

export const HowQuartzSlicesTime3D: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#050811' }}>
      <Series>
        {/* Scene 1: 8s (240 frames) — 50/50 Split-Screen Hook with quartz.jpg -> 3D Fork + clip-1.mp4 */}
        <Series.Sequence durationInFrames={240}>
          <Scene1SplitHook />
        </Series.Sequence>

        {/* Scene 2: 10s (300 frames) — Mechanical Pendulum vs Quartz Crystal Drift */}
        <Series.Sequence durationInFrames={300}>
          <Scene2MechanicalDrift />
        </Series.Sequence>

        {/* Scene 3: 10s (300 frames) — Piezoelectric Atomic Lattice */}
        <Series.Sequence durationInFrames={300}>
          <Scene3PiezoelectricLattice />
        </Series.Sequence>

        {/* Scene 4: 8s (240 frames) — Full-Screen Host Pivot 1 */}
        <Series.Sequence durationInFrames={240}>
          <Scene4HostPivot1 />
        </Series.Sequence>

        {/* Scene 5: 10s (300 frames) — Microscopic Quartz Tuning Fork & Gold Electrodes */}
        <Series.Sequence durationInFrames={300}>
          <Scene5MicroscopicTuningFork />
        </Series.Sequence>

        {/* Scene 6: 10s (300 frames) — 15-Stage Binary Flip-Flop Divider Tower */}
        <Series.Sequence durationInFrames={300}>
          <Scene6BinaryFlipFlopTower />
        </Series.Sequence>

        {/* Scene 7: 10s (300 frames) — The 2^15 Halving Cascade */}
        <Series.Sequence durationInFrames={300}>
          <Scene7HalvingCascade />
        </Series.Sequence>

        {/* Scene 8: 8s (240 frames) — Full-Screen Host Pivot 2 */}
        <Series.Sequence durationInFrames={240}>
          <Scene8HostPivot2 />
        </Series.Sequence>

        {/* Scene 9: 10s (300 frames) — Cesium-133 Hyperfine Atomic Transition */}
        <Series.Sequence durationInFrames={300}>
          <Scene9CesiumHyperfine />
        </Series.Sequence>

        {/* Scene 10: 10s (300 frames) — Global GPS & Internet Atomic Synchronization */}
        <Series.Sequence durationInFrames={300}>
          <Scene10GlobalAtomicSync />
        </Series.Sequence>

        {/* Scene 11: 10s (300 frames) — Full-Screen Host Outro */}
        <Series.Sequence durationInFrames={300}>
          <Scene11HostOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
