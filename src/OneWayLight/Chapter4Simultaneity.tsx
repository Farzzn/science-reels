import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { C, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import {
  CleanStage,
  KineticPunch,
  MinimalLabel,
} from "../CosmicSpeedLimit/ui";
import { makeOwlCue } from "./timing";
import {
  clamp01,
  easeInOutCubic,
  easeOutCubic,
} from "./visuals";

// ===========================================================================
// Chapter 4 — When "Now" Splits Apart (Einstein's Train + Tilted Spacetime)
// ===========================================================================
export const Chapter4Simultaneity: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = makeOwlCue("ch4");
  const len = cue.len;

  const tTrain = cue("glass train");
  const tBolts = cue("two bolts of lightning");
  const tPlatform = cue("observer standing still");
  const tInside = cue("step inside the moving train");
  const tFrontFirst = cue("front flash hits");
  const tWhoRight = cue("Who is right");
  const tMap = cue("spacetime map");
  const tTilts = cue("tilts upward");

  // Stage 1: Platform Frame — Glass train approaches, twin lightning hits at alignment (0 -> tInside)
  const approachX = interpolate(
    frame,
    [0, Math.max(40, tBolts)],
    [420, 960],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const boltFlash = clamp01((frame - tBolts) / 14);
  const platformWaveR = easeInOutCubic(
    (frame - tPlatform) / Math.max(45, tInside - tPlatform - 10),
  ) * 440;
  // Train keeps gliding slightly forward after strike!
  const trainPostStrike = interpolate(
    frame,
    [tBolts, Math.max(tBolts + 30, tInside)],
    [0, 145],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const s1TrainX = frame < tBolts ? approachX : 960 + trainPostStrike;

  // Stage 2: Moving Train Perspective — Front flash reaches passenger FIRST! (tInside -> tWhoRight)
  const s2Dur = Math.max(70, tWhoRight - tInside);
  const s2P = clamp01((frame - tInside) / s2Dur);
  // In platform coords visualized live: light expands symmetrically from strike spots x=520 & x=1400,
  // while the train & passenger rush rightward from 960 -> 1190!
  const waveDist = s2P * 520;
  const passengerShift = s2P * 220;
  const frontHit = clamp01((frame - tFrontFirst) / 18);

  // Kinetic Punch: BOTH ARE RIGHT.
  const punchDur = Math.max(48, Math.min(72, tMap - tWhoRight));

  // Stage 3: 2D Spacetime Diagram & Tilting "NOW" Slice (tMap -> len)
  const axesP = easeOutCubic((frame - tMap) / 36);
  const tiltP = easeInOutCubic(
    (frame - tTilts) / Math.max(55, len - tTilts - 16),
  );
  const tiltDeg = -tiltP * 24; // Tilts upward in +x direction!
  const flatNowY = interpolate(
    frame,
    [tMap, Math.max(tMap + 60, len)],
    [760, 440],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      {/* STAGE 1: Platform Observer — Simultaneous Flashes */}
      <CleanStage from={0} to={tInside + 6}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Station Platform */}
          <rect x={160} y={670} width={1600} height={24} rx={8} fill="#16294f" stroke={C.cyan} strokeWidth={2} />
          {/* Platform Observer (center x=960) */}
          <circle cx={960} cy={740} r={20} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 12) }} />
          <text x={960} y={804} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={24} letterSpacing={2}>
            PLATFORM OBSERVER
          </text>

          {/* Sleek Translucent Glass Train */}
          <g transform={`translate(${s1TrainX}, 540)`}>
            <rect
              x={-440}
              y={-95}
              width={880}
              height={185}
              rx={28}
              fill="#0c1f3f"
              fillOpacity={0.72}
              stroke={C.gold}
              strokeWidth={3.5}
              style={{ filter: svgGlow(C.gold, 8) }}
            />
            {/* Glass windows */}
            {[-340, -170, 0, 170, 340].map((wx) => (
              <rect
                key={wx}
                x={wx - 58}
                y={-58}
                width={116}
                height={88}
                rx={12}
                fill="#1e3a6e"
                fillOpacity={0.45}
                stroke={C.gold}
                strokeOpacity={0.35}
                strokeWidth={1.5}
              />
            ))}
            {/* Passenger in center of train */}
            <circle cx={0} cy={12} r={20} fill={C.gold} style={{ filter: svgGlow(C.gold, 12) }} />
            <text x={0} y={-120} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={22} letterSpacing={2}>
              GLASS TRAIN →
            </text>
          </g>

          {/* Twin Lightning Bolts at x=520 (Rear) & x=1400 (Front) */}
          {boltFlash > 0.02 && (
            <g opacity={boltFlash}>
              {[520, 1400].map((bx, i) => (
                <g key={i}>
                  <polyline
                    points={`${bx},190 ${bx - 24},315 ${bx + 20},330 ${bx - 12},455`}
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: svgGlow(C.gold, 16) }}
                  />
                  {/* Expanding symmetric light rings */}
                  {platformWaveR > 4 && (
                    <circle
                      cx={bx}
                      cy={555}
                      r={platformWaveR}
                      fill="none"
                      stroke={C.cyan}
                      strokeWidth={4.5}
                      opacity={Math.max(0.18, 1 - platformWaveR / 560)}
                      style={{ filter: svgGlow(C.cyan, 10) }}
                    />
                  )}
                </g>
              ))}
            </g>
          )}
        </svg>

        <MinimalLabel
          text={
            frame >= tPlatform
              ? "PLATFORM: BOTH HIT TOGETHER"
              : frame >= tTrain
                ? "EINSTEIN'S TRAIN"
                : "MOTION SPLITS \"NOW\""
          }
          color={frame >= tPlatform ? C.cyan : C.gold}
          x={960}
          y={94}
          size={44}
        />
      </CleanStage>

      {/* STAGE 2: Passenger Rushes INTO Front Beam (stays live under BOTH ARE RIGHT punch!) */}
      <CleanStage from={tInside} to={tMap + 10}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Strike origin markers fixed on tracks */}
          {[520, 1400].map((bx, idx) => (
            <g key={idx}>
              <circle cx={bx} cy={550} r={10} fill={idx === 1 ? C.gold : C.cyan} />
              <text
                x={bx}
                y={755}
                textAnchor="middle"
                fill={idx === 1 ? C.gold : C.cyan}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={24}
              >
                {idx === 0 ? "REAR STRIKE" : "FRONT STRIKE"}
              </text>
              {/* Expanding light rings at identical speed c */}
              <circle
                cx={bx}
                cy={550}
                r={Math.max(12, waveDist)}
                fill="none"
                stroke={idx === 1 ? C.gold : C.cyan}
                strokeWidth={5}
                opacity={0.85}
                style={{ filter: svgGlow(idx === 1 ? C.gold : C.cyan, 12) }}
              />
            </g>
          ))}

          {/* Moving Train rushing rightward */}
          <g transform={`translate(${960 + passengerShift}, 550)`}>
            <rect
              x={-440}
              y={-95}
              width={880}
              height={185}
              rx={28}
              fill="#0c1f3f"
              fillOpacity={0.78}
              stroke={C.gold}
              strokeWidth={4}
            />
            <circle
              cx={0}
              cy={0}
              r={24}
              fill={frontHit > 0.2 ? "#ffffff" : C.gold}
              style={{ filter: svgGlow(C.gold, 16) }}
            />
            <text
              x={0}
              y={-124}
              textAnchor="middle"
              fill={C.white}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={28}
            >
              {frontHit > 0.2 ? "FRONT FLASH HITS 1ST!" : "RUSHING TOWARD FRONT →"}
            </text>
          </g>
        </svg>

        <MinimalLabel
          text={frontHit > 0.2 ? "TRAIN: FRONT STRUCK FIRST!" : "INSIDE THE MOVING TRAIN"}
          sub={frontHit > 0.2 ? "REAR FLASH ARRIVES LATER" : "MEETS FRONT BEAM EARLY"}
          color={C.gold}
          x={960}
          y={94}
          size={44}
        />
      </CleanStage>

      {/* KINETIC PUNCH: BOTH ARE RIGHT. */}
      <Sequence from={tWhoRight} durationInFrames={punchDur}>
        <KineticPunch
          word="BOTH ARE RIGHT."
          sub="SIMULTANEITY IS RELATIVE"
          color={C.cyan}
          accent="burst"
          size={146}
        />
      </Sequence>

      {/* STAGE 3: 2D Spacetime Diagram — Horizontal "NOW" vs Tilted "NOW" */}
      <CleanStage from={tMap} to={len}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Subtle coordinate grid */}
          <g opacity={axesP * 0.24}>
            {Array.from({ length: 11 }).map((_, i) => {
              const x = 360 + i * 120;
              return (
                <line key={`v${i}`} x1={x} y1={220} x2={x} y2={880} stroke={C.cyan} strokeWidth={1.2} />
              );
            })}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 260 + i * 110;
              return (
                <line key={`h${i}`} x1={320} y1={y} x2={1600} y2={y} stroke={C.cyan} strokeWidth={1.2} />
              );
            })}
          </g>

          {/* Main Axes: SPACE (x) & TIME (t) */}
          <g opacity={axesP}>
            <line x1={300} y1={840} x2={1620} y2={840} stroke={C.white} strokeWidth={3.5} />
            <polyline points="1600,828 1624,840 1600,852" fill="none" stroke={C.white} strokeWidth={3.5} />
            <text x={1610} y={892} textAnchor="end" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={26} letterSpacing={2}>
              SPACE (x)
            </text>

            <line x1={960} y1={880} x2={960} y2={200} stroke={C.white} strokeWidth={3.5} />
            <polyline points="948,220 960,196 972,220" fill="none" stroke={C.white} strokeWidth={3.5} />
            <text x={988} y={222} textAnchor="start" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={26} letterSpacing={2}>
              TIME (t)
            </text>
          </g>

          {/* Platform Observer Flat Horizontal "NOW" Slice sweeping upward */}
          <g opacity={axesP}>
            <line
              x1={340}
              y1={flatNowY}
              x2={1580}
              y2={flatNowY}
              stroke={C.cyan}
              strokeWidth={5}
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
            <text
              x={360}
              y={flatNowY - 18}
              textAnchor="start"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={800}
              fontSize={26}
            >
              PLATFORM &ldquo;NOW&rdquo;
            </text>
          </g>

          {/* Moving Passenger Tilted Worldline + Tilted "NOW" Slice */}
          {tiltP > 0.01 && (
            <g opacity={tiltP}>
              {/* Moving observer tilted time axis */}
              <line
                x1={960 - 110 * tiltP}
                y1={840}
                x2={960 + 230 * tiltP}
                y2={230}
                stroke={C.gold}
                strokeWidth={3.5}
                strokeDasharray="10 10"
                opacity={0.75}
              />
              {/* Tilted "NOW" plane rotating upward in +x */}
              <g transform={`translate(960, ${flatNowY}) rotate(${tiltDeg})`}>
                <line
                  x1={-630}
                  y1={0}
                  x2={630}
                  y2={0}
                  stroke={C.gold}
                  strokeWidth={6}
                  style={{ filter: svgGlow(C.gold, 14) }}
                />
                <text
                  x={590}
                  y={-22}
                  textAnchor="end"
                  fill={C.gold}
                  fontFamily={MONO}
                  fontWeight={900}
                  fontSize={30}
                  style={{ filter: svgGlow(C.gold, 8) }}
                >
                  MOVING &ldquo;NOW&rdquo; ↗
                </text>
              </g>
            </g>
          )}

          {/* Central Intersection Event */}
          <circle cx={960} cy={flatNowY} r={12} fill="#ffffff" style={{ filter: svgGlow(C.gold, 12) }} />
        </svg>

        <MinimalLabel
          text={tiltP > 0.2 ? "MOTION TILTS THE PRESENT" : "SPACETIME MAP"}
          color={tiltP > 0.2 ? C.gold : C.cyan}
          x={960}
          y={94}
          size={44}
        />
      </CleanStage>
    </AbsoluteFill>
  );
};
