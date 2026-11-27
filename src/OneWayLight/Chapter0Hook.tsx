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
  MinimalClock,
  pad2,
  PhotonPacket,
} from "./visuals";

// ===========================================================================
// Chapter 0 — The Impossible Clock Test
// ===========================================================================
export const Chapter0Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = makeOwlCue("ch0");
  const len = cue.len;

  const tSameNow = cue("showing the same now");
  const tQuestion = cue("how do you actually know");
  const tLightTime = cue("light takes time");
  const tOld = cue("already slightly old");
  const tOneDir = cue("one direction");
  const tNever = cue("no experiment in human history");
  const tTwoWay = cue("Every measurement we have");
  const tNoNow = cue("no natural way");

  // Stage 1: Two clocks across a room (0 -> tTwoWay, staying alive cleanly beneath NEVER MEASURED!)
  const roomDolly = interpolate(frame, [0, Math.max(60, tTwoWay)], [0.95, 1.11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secFloat = interpolate(frame, [0, Math.max(60, tTwoWay)], [0, 38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secInt = Math.floor(secFloat);
  const delayedSec = Math.max(0, secFloat - 3.2);
  const delayedInt = Math.floor(delayedSec);

  const sameNowIn = easeOutCubic((frame - tSameNow) / 18);
  const sameNowOut = 1 - clamp01((frame - (tQuestion - 6)) / 14);
  const sameNowAlpha = frame >= tSameNow ? sameNowIn * sameNowOut : 0;

  const qPulse = clamp01((frame - tQuestion) / 36);
  const waveP = easeInOutCubic(
    (frame - tLightTime) / Math.max(45, tNever - tLightTime - 10),
  );
  const oldHighlight = clamp01((frame - tOld) / 28);
  const oneDirPop = easeOutCubic((frame - tOneDir) / 22);

  // Crisp 2.4s Kinetic Punch on NEVER MEASURED. (no redundant earlier punch!)
  const punch2Dur = Math.max(54, Math.min(76, tTwoWay - tNever - 4));

  // Stage 3: Two-way round trip vs fracturing "NOW" plane (tTwoWay -> len)
  const s3Len = Math.max(60, len - tTwoWay);
  const bounceOutP = easeInOutCubic(
    (frame - tTwoWay) / Math.max(40, (tNoNow - tTwoWay) * 0.48),
  );
  const bounceBackP = easeInOutCubic(
    (frame - (tTwoWay + (tNoNow - tTwoWay) * 0.48)) /
      Math.max(40, (tNoNow - tTwoWay) * 0.5),
  );
  const fractureP = easeOutCubic(
    (frame - tNoNow) / Math.max(45, len - tNoNow),
  );

  return (
    <AbsoluteFill>
      {/* STAGE 1: Two Clocks Across a Room + Delayed Light Image (stays live under punches!) */}
      <CleanStage from={0} to={tTwoWay + 10}>
        <AbsoluteFill
          style={{
            transform: `scale(${roomDolly})`,
            transformOrigin: "50% 52%",
          }}
        >
          <svg width={1920} height={1080} viewBox="0 0 1920 1080">
            <defs>
              <linearGradient
                id="ch0Floor"
                gradientUnits="userSpaceOnUse"
                x1={220}
                y1={740}
                x2={1700}
                y2={740}
              >
                <stop offset="0%" stopColor={C.cyan} stopOpacity={0} />
                <stop offset="20%" stopColor={C.cyan} stopOpacity={0.35} />
                <stop offset="50%" stopColor={C.gold} stopOpacity={0.45} />
                <stop offset="80%" stopColor={C.cyan} stopOpacity={0.35} />
                <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Clean minimal room axis & subtle distance grid */}
            <line
              x1={260}
              y1={740}
              x2={1660}
              y2={740}
              stroke="url(#ch0Floor)"
              strokeWidth={2.5}
            />
            {Array.from({ length: 9 }).map((_, i) => {
              const gx = 360 + i * 150;
              return (
                <line
                  key={i}
                  x1={gx}
                  y1={728}
                  x2={gx}
                  y2={752}
                  stroke={C.cyan}
                  strokeWidth={1.6}
                  opacity={0.32}
                />
              );
            })}

            {/* Dashed connection line across room */}
            <line
              x1={520}
              y1={500}
              x2={1400}
              y2={500}
              stroke={qPulse > 0 ? C.gold : C.cyan}
              strokeWidth={2.4}
              strokeDasharray="14 14"
              opacity={0.38 + qPulse * 0.3}
            />

            {/* "THE SAME 'NOW'" pill centered cleanly between the two clocks at 0:12 */}
            {sameNowAlpha > 0.01 && (
              <g
                transform={`translate(960, 500) scale(${0.9 + 0.1 * sameNowIn})`}
                opacity={sameNowAlpha}
              >
                <rect
                  x={-215}
                  y={-36}
                  width={430}
                  height={72}
                  rx={18}
                  fill="#071024"
                  stroke={C.cyan}
                  strokeWidth={2.8}
                  style={{ filter: svgGlow(C.cyan, 12) }}
                />
                <text
                  x={0}
                  y={12}
                  textAnchor="middle"
                  fill={C.cyan}
                  fontFamily={MONO}
                  fontWeight={900}
                  fontSize={34}
                  letterSpacing={2.5}
                  style={{ filter: svgGlow(C.cyan, 8) }}
                >
                  THE SAME &ldquo;NOW&rdquo;
                </text>
              </g>
            )}

            {/* Question mark blooming between clocks */}
            {qPulse > 0.01 && waveP < 0.05 && (
              <g opacity={qPulse * (1 - waveP * 8)}>
                <circle
                  cx={960}
                  cy={500}
                  r={46 + qPulse * 14}
                  fill="#071024"
                  stroke={C.gold}
                  strokeWidth={3}
                  style={{ filter: svgGlow(C.gold, 10) }}
                />
                <text
                  x={960}
                  y={520}
                  textAnchor="middle"
                  fill={C.gold}
                  fontFamily={MONO}
                  fontWeight={900}
                  fontSize={58}
                  style={{ filter: svgGlow(C.gold, 8) }}
                >
                  ?
                </text>
              </g>
            )}

            {/* Clock A (left — your wall) */}
            <MinimalClock
              cx={410}
              cy={500}
              r={118}
              hours={3}
              minutes={0}
              seconds={secFloat}
              color={C.cyan}
              label="CLOCK A"
              digital={`03:00:${pad2(secInt)}`}
              sub="HERE"
            />

            {/* Clock B (right — opposite wall) */}
            <MinimalClock
              cx={1510}
              cy={500}
              r={118}
              hours={3}
              minutes={0}
              seconds={secFloat}
              color={oldHighlight > 0.2 ? C.gold : C.cyan}
              label="CLOCK B"
              digital={`03:00:${pad2(secInt)}`}
              sub={oldHighlight > 0.2 ? "FAR WALL" : "ACROSS ROOM"}
            />

            {/* Light image traveling from Clock B -> your eyes at Clock A */}
            {waveP > 0.01 && (
              <>
                <PhotonPacket
                  id="ch0LightFromB"
                  x1={1385}
                  y1={500}
                  x2={545}
                  y2={500}
                  progress={waveP}
                  color={C.gold}
                  tailLen={220}
                  amp={16}
                  waves={4}
                  label={oldHighlight > 0.2 ? "DELAYED IMAGE" : "LIGHT IN TRANSIT"}
                />
                {/* Ghost delayed clock face riding on the photon */}
                <g
                  transform={`translate(${1385 - waveP * 840}, ${392})`}
                  opacity={Math.min(1, waveP * 3) * (0.45 + 0.55 * oldHighlight)}
                >
                  <rect
                    x={-110}
                    y={-28}
                    width={220}
                    height={52}
                    rx={12}
                    fill="#071024"
                    stroke={C.gold}
                    strokeWidth={2.2}
                    style={{ filter: svgGlow(C.gold, 8) }}
                  />
                  <text
                    x={0}
                    y={9}
                    textAnchor="middle"
                    fill={C.gold}
                    fontFamily={MONO}
                    fontWeight={800}
                    fontSize={28}
                  >
                    {`03:00:${pad2(delayedInt)}`}
                  </text>
                </g>
              </>
            )}
          </svg>

          {frame >= tQuestion && frame < tLightTime && (
            <MinimalLabel
              text="HOW DO YOU KNOW?"
              color={C.gold}
              x={960}
              y={116}
              size={46}
              delay={tQuestion}
            />
          )}
          {frame >= tLightTime && frame < tOneDir && (
            <MinimalLabel
              text="LIGHT TAKES TIME"
              sub="MUST SUBTRACT TRAVEL TIME"
              color={C.gold}
              x={960}
              y={104}
              size={42}
              delay={tLightTime}
            />
          )}
          {frame >= tOneDir && (
            <MinimalLabel
              text="ONE-WAY SPEED OF LIGHT = ?"
              sub="B → A TRAVEL SPEED UNKNOWN"
              color={C.red}
              x={960}
              y={104}
              size={42 + oneDirPop * 4}
              delay={tOneDir}
            />
          )}
        </AbsoluteFill>
      </CleanStage>

      {/* KINETIC PUNCH: NEVER MEASURED. */}
      <Sequence from={tNever} durationInFrames={punch2Dur}>
        <KineticPunch
          word="NEVER MEASURED."
          sub="ONE-WAY SPEED OF LIGHT"
          color={C.red}
          accent="cross"
          size={142}
        />
      </Sequence>

      {/* STAGE 3: Two-Way Round Trip Only -> Fracturing "NOW" Plane */}
      <CleanStage from={tTwoWay} to={len}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch0FractureLine"
              gradientUnits="userSpaceOnUse"
              x1={260}
              y1={560}
              x2={1660}
              y2={560}
            >
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.95} />
              <stop offset="50%" stopColor={C.gold} stopOpacity={0.95} />
              <stop offset="100%" stopColor={C.red} stopOpacity={0.95} />
            </linearGradient>
          </defs>

          {/* Left: Two-Way Round Trip fades out as "Now" plane fractures */}
          <g opacity={1 - fractureP * 0.85}>
            <MinimalClock
              cx={420}
              cy={540}
              r={104}
              hours={3}
              minutes={0}
              seconds={(frame - tTwoWay) * 0.15}
              color={C.cyan}
              label="SINGLE CLOCK"
            />
            {/* Mirror on right */}
            <rect
              x={1485}
              y={380}
              width={20}
              height={320}
              rx={6}
              fill="#7dd3fc"
              style={{ filter: svgGlow(C.cyan, 14) }}
            />
            <text
              x={1495}
              y={352}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={24}
              letterSpacing={2}
            >
              MIRROR
            </text>

            {bounceOutP > 0.01 && bounceBackP < 0.02 && (
              <PhotonPacket
                id="ch0TwoOut"
                x1={535}
                y1={510}
                x2={1475}
                y2={510}
                progress={bounceOutP}
                color={C.gold}
                label="OUT"
              />
            )}
            {bounceBackP > 0.01 && (
              <PhotonPacket
                id="ch0TwoBack"
                x1={1475}
                y1={570}
                x2={535}
                y2={570}
                progress={bounceBackP}
                color={C.cyan}
                label="BACK · ROUND TRIP"
              />
            )}
          </g>

          {/* Right/End: Horizontal "NOW" plane splitting & tilting apart */}
          {fractureP > 0.01 && (
            <g opacity={fractureP}>
              {[-2, -1, 0, 1, 2].map((idx) => {
                const angle = idx * fractureP * 11;
                const col =
                  idx === 0 ? C.white : idx > 0 ? C.gold : C.cyan;
                return (
                  <g
                    key={idx}
                    transform={`translate(960, 560) rotate(${angle})`}
                    opacity={idx === 0 ? 0.95 : 0.65}
                  >
                    <line
                      x1={-680}
                      y1={0}
                      x2={680}
                      y2={0}
                      stroke={col}
                      strokeWidth={idx === 0 ? 4 : 2.5}
                      strokeDasharray={idx === 0 ? undefined : "16 12"}
                      style={{ filter: svgGlow(col, 8) }}
                    />
                  </g>
                );
              })}
              <circle
                cx={960}
                cy={560}
                r={14 + fractureP * 6}
                fill={C.white}
                style={{ filter: svgGlow(C.cyan, 14) }}
              />
              <text
                x={960}
                y={840 - fractureP * 24}
                textAnchor="middle"
                fill={C.white}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={44}
                letterSpacing={3}
                style={{ filter: svgGlow(C.gold, 12) }}
              >
                NO UNIVERSAL &ldquo;RIGHT NOW&rdquo;
              </text>
            </g>
          )}

          {/* Subtle progress sweep line so no static border */}
          <line
            x1={260}
            y1={960}
            x2={260 + clamp01((frame - tTwoWay) / s3Len) * 1400}
            y2={960}
            stroke="url(#ch0FractureLine)"
            strokeWidth={3}
            opacity={0.45}
          />
        </svg>

        {frame < tNoNow && (
          <MinimalLabel
            text="TWO-WAY ROUND TRIP ONLY"
            color={C.cyan}
            x={960}
            y={108}
            size={42}
            delay={tTwoWay}
          />
        )}
      </CleanStage>
    </AbsoluteFill>
  );
};
