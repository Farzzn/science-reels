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
// Chapter 1 — The Synchronization Trap
// ===========================================================================
export const Chapter1Trap: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = makeOwlCue("ch1");
  const len = cue.len;

  const tTrack = cue("Put Clock A");
  const tLaser = cue("Fire a laser pulse");
  const tNotFast = cue("Not so fast");
  const tSyncFirst = cue("synchronize the two clocks");
  const tAlreadyNeed = cue("already need to know");
  const tCircle = cue("trapped in a circle");
  const tWorkaround = cue("clever workaround");
  const tCarry = cue("gently carry Clock B");
  const tRelativity = cue("Einstein's relativity steps in");
  const tDirDep = cue("direction-dependent");
  const tEveryTrick = cue("Every trick we try");

  // Stage 1: 1 KM Track + Laser attempt + Unsynced Clock B warning (0 -> tSyncFirst)
  // Smoothly draws track & separates clocks right from frame 0 (zero static opening!)
  const trackEnter = easeOutCubic(frame / Math.max(45, tTrack + 30));
  const sepP = easeInOutCubic(frame / Math.max(45, tLaser - 10));
  const clockAX = interpolate(sepP, [0, 1], [760, 400]);
  const clockBX_s1 = interpolate(sepP, [0, 1], [1160, 1520]);
  const laserP = easeInOutCubic(
    (frame - tLaser) / Math.max(45, tNotFast - tLaser - 6),
  );
  const offsetWarn = clamp01((frame - tNotFast) / 26);
  const wrongDrift = interpolate(
    frame,
    [tNotFast, Math.max(tNotFast + 30, tSyncFirst)],
    [0, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Stage 2: Sync signal attempt -> Circular Trap (tSyncFirst -> tCircle)
  const radioP = easeInOutCubic(
    (frame - tSyncFirst) / Math.max(40, tAlreadyNeed - tSyncFirst),
  );
  const loopTighten = easeOutCubic(
    (frame - tAlreadyNeed) / Math.max(36, tCircle - tAlreadyNeed),
  );

  // Kinetic Punch: CIRCULAR TRAP
  const punchDur = Math.max(58, Math.min(82, tWorkaround - tCircle));

  // Stage 3: Slow Clock Transport + Anisotropic Time Dilation (tWorkaround -> tEveryTrick)
  const transportP = easeInOutCubic(
    (frame - tCarry) / Math.max(90, tEveryTrick - tCarry - 20),
  );
  const clockBX = interpolate(transportP, [0, 1], [610, 1480]);
  const relField = clamp01((frame - tRelativity) / 32);
  const dirField = clamp01((frame - tDirDep) / 32);
  const timeA = interpolate(
    frame,
    [tWorkaround, Math.max(tWorkaround + 60, tEveryTrick)],
    [0, 38],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Clock B visibly slows down as it moves rightward through the anisotropic drag field!
  const lostSec = transportP * 8.4;
  const timeB = Math.max(0, timeA - lostSec);

  // Stage 4: Every trick closes into the same trap (tEveryTrick -> len)
  const s4P = clamp01((frame - tEveryTrick) / Math.max(40, len - tEveryTrick));

  return (
    <AbsoluteFill>
      {/* STAGE 1: 1 KM Laser Track Attempt */}
      <CleanStage from={0} to={tSyncFirst + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch1Rail"
              gradientUnits="userSpaceOnUse"
              x1={340}
              y1={690}
              x2={1580}
              y2={690}
            >
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.2} />
              <stop offset="50%" stopColor={C.cyan} stopOpacity={0.85} />
              <stop offset="100%" stopColor={C.gold} stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* Optical Track Base */}
          <g opacity={0.35 + 0.65 * trackEnter}>
            <line
              x1={340}
              y1={690}
              x2={340 + 1240 * Math.max(0.25, trackEnter)}
              y2={690}
              stroke="url(#ch1Rail)"
              strokeWidth={4}
            />
            <text
              x={960}
              y={745}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={28}
              letterSpacing={4}
            >
              1 KILOMETER
            </text>
          </g>

          <MinimalClock
            cx={clockAX}
            cy={500}
            r={112}
            hours={12}
            minutes={0}
            seconds={frame * 0.04}
            color={C.cyan}
            label="CLOCK A"
            digital={`00:00:0${Math.floor(laserP * 3)}`}
            sub="LASER START"
          />

          <MinimalClock
            cx={clockBX_s1}
            cy={500}
            r={112}
            hours={12}
            minutes={0}
            seconds={offsetWarn > 0.1 ? 3.3 + wrongDrift : frame * 0.04}
            color={C.cyan}
            warning={offsetWarn > 0.15}
            label="CLOCK B"
            digital={
              offsetWarn > 0.15
                ? `±${Math.max(1, Math.round(wrongDrift))} µs?`
                : `00:00:0${Math.floor(laserP * 3)}`
            }
            sub={offsetWarn > 0.15 ? "NOT SYNCED!" : "DETECTOR"}
          />

          {/* Laser pulse */}
          {laserP > 0.01 && (
            <PhotonPacket
              id="ch1Laser"
              x1={520}
              y1={500}
              x2={1400}
              y2={500}
              progress={laserP}
              color={offsetWarn > 0.2 ? C.red : C.gold}
              tailLen={230}
              amp={12}
              waves={5}
              label={offsetWarn > 0.2 ? "SPEED INVALID ✕" : "d / t = ?"}
            />
          )}
        </svg>

        <MinimalLabel
          text={offsetWarn > 0.15 ? "REQUIRES SYNCED CLOCKS" : "ONE-WAY TEST"}
          color={offsetWarn > 0.15 ? C.red : C.gold}
          x={960}
          y={114}
          size={44}
        />
      </CleanStage>

      {/* STAGE 2: Radio Sync Signal -> Circular Dependency Ring (stays live cleanly under punch!) */}
      <CleanStage from={tSyncFirst} to={tWorkaround + 10}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <g opacity={1 - loopTighten * 0.4}>
            <MinimalClock
              cx={420}
              cy={540}
              r={102}
              hours={12}
              minutes={0}
              seconds={(frame - tSyncFirst) * 0.12}
              color={C.cyan}
              label="CLOCK A"
            />
            <MinimalClock
              cx={1500}
              cy={540}
              r={102}
              color={C.red}
              warning
              questionMark
              label="CLOCK B"
              sub="TRANSIT TIME = ?"
            />

            {/* Expanding radio arcs from A toward B */}
            {[0, 1, 2].map((k) => {
              const p = clamp01(radioP * 1.4 - k * 0.22);
              if (p <= 0.01) return null;
              return (
                <path
                  key={k}
                  d={`M ${540 + p * 740} ${450 - p * 45} Q ${585 + p * 740} 540 ${540 + p * 740} ${630 + p * 45}`}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={(1 - p * 0.55) * 0.85}
                  style={{ filter: svgGlow(C.gold, 8) }}
                />
              );
            })}
          </g>

          {/* Circular Trap Arrows locking into place */}
          {loopTighten > 0.02 && (
            <g
              transform={`translate(960, 540) rotate(${loopTighten * 32}) scale(${0.72 + loopTighten * 0.3})`}
              opacity={loopTighten}
            >
              <path
                d="M -180,-40 A 185,185 0 0,1 180,-40"
                fill="none"
                stroke={C.cyan}
                strokeWidth={9}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.cyan, 10) }}
              />
              <polyline
                points="154,-64 186,-36 148,-18"
                fill="none"
                stroke={C.cyan}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 180,40 A 185,185 0 0,1 -180,40"
                fill="none"
                stroke={C.red}
                strokeWidth={9}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.red, 10) }}
              />
              <polyline
                points="-154,64 -186,36 -148,18"
                fill="none"
                stroke={C.red}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x={0}
                y={-214}
                textAnchor="middle"
                fill={C.cyan}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={28}
              >
                SYNC CLOCKS
              </text>
              <text
                x={0}
                y={236}
                textAnchor="middle"
                fill={C.red}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={28}
              >
                NEED ONE-WAY c
              </text>
            </g>
          )}
        </svg>

        <MinimalLabel
          text="SYNCING NEEDS ONE-WAY SPEED"
          color={C.gold}
          x={960}
          y={104}
          size={40}
        />
      </CleanStage>

      {/* KINETIC PUNCH: CIRCULAR TRAP */}
      <Sequence from={tCircle} durationInFrames={punchDur}>
        <KineticPunch
          word="CIRCULAR TRAP"
          sub="SYNC ⇄ MEASURE"
          color={C.red}
          accent="cross"
          size={146}
        />
      </Sequence>

      {/* STAGE 3: Slow Clock Transport + Anisotropic Time Dilation */}
      <CleanStage from={tWorkaround} to={tEveryTrick + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch1DragField"
              gradientUnits="userSpaceOnUse"
              x1={560}
              y1={540}
              x2={1560}
              y2={540}
            >
              <stop offset="0%" stopColor={C.gold} stopOpacity={0} />
              <stop offset="50%" stopColor={C.red} stopOpacity={0.28} />
              <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Subtle directional time-dilation field appearing when relativity steps in */}
          {relField > 0.02 && (
            <g opacity={relField}>
              <rect
                x={560}
                y={330}
                width={1000}
                height={420}
                rx={28}
                fill="url(#ch1DragField)"
              />
              {Array.from({ length: 7 }).map((_, i) => {
                const wx = 640 + i * 135 - dirField * 34;
                return (
                  <path
                    key={i}
                    d={`M ${wx} 365 Q ${wx - 28} 540 ${wx} 715`}
                    fill="none"
                    stroke={dirField > 0.2 ? C.red : C.gold}
                    strokeWidth={2.5}
                    opacity={0.35 + dirField * 0.25}
                  />
                );
              })}
            </g>
          )}

          {/* Smooth transport rail */}
          <line
            x1={320}
            y1={720}
            x2={1600}
            y2={720}
            stroke={C.cyan}
            strokeWidth={3}
            opacity={0.4}
          />

          {/* Clock A stays anchored on left */}
          <MinimalClock
            cx={360}
            cy={520}
            r={110}
            hours={12}
            minutes={0}
            seconds={timeA}
            color={C.cyan}
            label="CLOCK A"
            digital={`00:00:${pad2(timeA)}`}
            sub="STATIONARY"
          />

          {/* Clock B starts beside A, then glides slowly rightward and loses time */}
          <MinimalClock
            cx={clockBX}
            cy={520}
            r={110}
            hours={12}
            minutes={0}
            seconds={timeB}
            color={relField > 0.2 ? C.gold : C.cyan}
            warning={dirField > 0.4}
            label="CLOCK B"
            digital={`00:00:${pad2(timeB)}`}
            sub={
              dirField > 0.3
                ? `DRIFT: -${lostSec.toFixed(1)}s`
                : transportP > 0.04
                  ? "MOVING SLOWLY →"
                  : "SYNCED TOGETHER"
            }
          />
        </svg>

        <MinimalLabel
          text={
            dirField > 0.2
              ? "DIRECTIONAL TIME DILATION"
              : relField > 0.2
                ? "MOVING CLOCKS SLOW DOWN"
                : "SLOW CLOCK TRANSPORT"
          }
          sub={
            dirField > 0.2
              ? "SHIFTS CLOCK B BY THE EXACT HIDING OFFSET"
              : undefined
          }
          color={dirField > 0.2 ? C.red : C.gold}
          x={960}
          y={104}
          size={42}
        />
      </CleanStage>

      {/* STAGE 4: Cables / Spinning Gears / Moving Clocks -> All Blocked */}
      <CleanStage from={tEveryTrick} to={len}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {[
            { x: 480, title: "CABLES", t0: 0.05 },
            { x: 960, title: "SPINNING GEARS", t0: 0.28 },
            { x: 1440, title: "MOVING CLOCKS", t0: 0.5 },
          ].map((item, idx) => {
            const p = easeOutCubic((s4P - item.t0) / 0.25);
            const crossP = easeOutCubic((s4P - item.t0 - 0.16) / 0.2);
            return (
              <g
                key={idx}
                transform={`translate(${item.x}, 540) scale(${0.85 + p * 0.15})`}
                opacity={p}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={126}
                  fill="#071024"
                  stroke={crossP > 0.2 ? C.red : C.cyan}
                  strokeWidth={3.5}
                  style={{ filter: svgGlow(crossP > 0.2 ? C.red : C.cyan, 10) }}
                />
                {/* Minimal iconic vector per item */}
                {idx === 0 && (
                  <path
                    d="M -68,18 C -30,-38 30,38 68,-18"
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                )}
                {idx === 1 && (
                  <g transform={`rotate(${s4P * 110})`}>
                    <circle
                      cx={0}
                      cy={0}
                      r={44}
                      fill="none"
                      stroke={C.gold}
                      strokeWidth={10}
                      strokeDasharray="18 14"
                    />
                    <circle cx={0} cy={0} r={14} fill={C.gold} />
                  </g>
                )}
                {idx === 2 && (
                  <g>
                    <circle
                      cx={0}
                      cy={0}
                      r={52}
                      fill="none"
                      stroke={C.cyan}
                      strokeWidth={5}
                    />
                    <line
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={-30}
                      stroke={C.white}
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                    <line
                      x1={0}
                      y1={0}
                      x2={24}
                      y2={12}
                      stroke={C.gold}
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Bold crimson cross-out */}
                {crossP > 0.01 && (
                  <g opacity={crossP}>
                    <line
                      x1={-76}
                      y1={-76}
                      x2={-76 + 152 * crossP}
                      y2={-76 + 152 * crossP}
                      stroke={C.red}
                      strokeWidth={12}
                      strokeLinecap="round"
                      style={{ filter: svgGlow(C.red, 10) }}
                    />
                    <line
                      x1={76}
                      y1={-76}
                      x2={76 - 152 * crossP}
                      y2={-76 + 152 * crossP}
                      stroke={C.red}
                      strokeWidth={12}
                      strokeLinecap="round"
                      style={{ filter: svgGlow(C.red, 10) }}
                    />
                  </g>
                )}

                <text
                  x={0}
                  y={182}
                  textAnchor="middle"
                  fill={C.white}
                  fontFamily={MONO}
                  fontWeight={800}
                  fontSize={28}
                  letterSpacing={2}
                >
                  {item.title}
                </text>
              </g>
            );
          })}
        </svg>

        <MinimalLabel
          text="SAME CIRCULAR TRAP"
          color={C.red}
          x={960}
          y={114}
          size={46}
        />
      </CleanStage>
    </AbsoluteFill>
  );
};
