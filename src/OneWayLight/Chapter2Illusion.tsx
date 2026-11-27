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
  LikePromptToast,
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
// Chapter 2 — The Two-Way Illusion (Earth <-> Mars: c/c vs c/2 + Instant!)
// ===========================================================================
export const Chapter2Illusion: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = makeOwlCue("ch2");
  const len = cue.len;

  const tMirror = cue("By cheating");
  const tTwoWay = cue("two-way speed of light");
  const tMars = cue("astronaut standing on Mars");
  const tWorld1 = cue("full light speed going out");
  const tWorld2Intro = cue("wildly different universe");
  const tInstant = cue("instantaneous");
  const tCheckClocks = cue("Let's check the clocks");
  const tEvenWorse = cue("Even worse");
  const tIdentical = cue("one hundred percent identical");
  const tLike = cue("hit the like button");

  // Stage 1: Single Clock + Mirror (0 -> tMars) — smooth live count-up before mirror enters!
  const s1Len = Math.max(60, tMars);
  const speedCount = Math.round(
    easeOutCubic(frame / Math.max(45, tMirror)) * 300000,
  );
  const mirrorEnter = easeOutCubic((frame - tMirror) / 36);
  const mOutP = easeInOutCubic(
    (frame - tMirror) / Math.max(40, (tTwoWay - tMirror) * 0.65),
  );
  const mBackP = easeInOutCubic(
    (frame - (tMirror + (tTwoWay - tMirror) * 0.65)) /
      Math.max(45, tMars - (tMirror + (tTwoWay - tMirror) * 0.65) - 8),
  );

  // Stage 2: World 1 (Earth <-> Mars: smooth ruler draw tMars -> tWorld1, then pulses!)
  const marsIntroP = easeInOutCubic(
    (frame - tMars) / Math.max(45, tWorld1 - tMars),
  );
  const w1Dur = Math.max(80, tWorld2Intro - tWorld1);
  const w1OutP = easeInOutCubic((frame - tWorld1) / (w1Dur * 0.46));
  const w1BackP = easeInOutCubic(
    (frame - (tWorld1 + w1Dur * 0.5)) / (w1Dur * 0.46),
  );
  const w1EarthMin = interpolate(
    frame,
    [tWorld1, tWorld2Intro],
    [0, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const w1MarsMin = w1EarthMin;

  // Stage 2b: World 2 Tease (tWorld2Intro -> tInstant)
  const w2TeaseP = clamp01(
    (frame - tWorld2Intro) / Math.max(30, tInstant - tWorld2Intro),
  );

  // Kinetic Punch: INSTANT?!
  const punchDur = Math.max(44, Math.min(70, tCheckClocks - tInstant));

  // Stage 3: Split-Screen Universe 1 (top: c / c) vs Universe 2 (bottom: c/2 / infinity)
  const splitClockMin = interpolate(
    frame,
    [tCheckClocks, tEvenWorse],
    [0, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Top Universe 1: reaches Mars at 10m, returns at 20m
  const topOutP = clamp01(splitClockMin / 10);
  const topBackP = clamp01((splitClockMin - 10) / 10);
  // Bottom Universe 2: crawls at c/2 for ALL 20m, then flashes back INSTANTLY at 20m!
  const botOutP = clamp01(splitClockMin / 19.6);
  const botInstantFlash = clamp01((splitClockMin - 19.3) / 0.7);

  // Stage 4: Mars Sync Secret & Identical Green Readouts (tEvenWorse -> len)
  const syncP = easeInOutCubic(
    (frame - tEvenWorse) / Math.max(50, (tIdentical - tEvenWorse) * 0.85),
  );
  const matchPop = easeOutCubic((frame - tIdentical) / 30);
  const s4Zoom = interpolate(
    frame,
    [tEvenWorse, Math.max(tEvenWorse + 60, len)],
    [0.97, 1.045],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      {/* STAGE 1: One Clock + Mirror Round Trip */}
      <CleanStage from={0} to={tMars + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch2MirrorGrad"
              gradientUnits="userSpaceOnUse"
              x1={1500}
              y1={320}
              x2={1500}
              y2={760}
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <MinimalClock
            cx={390}
            cy={540}
            r={118}
            hours={12}
            minutes={0}
            seconds={interpolate(frame, [0, s1Len], [0, 12], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            color={C.cyan}
            label="ONE CLOCK"
            sub="NO SYNC NEEDED"
          />

          {/* Speed count-up 0 -> 300,000 km/s during opening question */}
          {frame < tMirror + 30 && (
            <text
              x={1010}
              y={558}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={64}
              opacity={1 - clamp01((frame - tMirror) / 28)}
              style={{ filter: svgGlow(C.gold, 14) }}
            >
              {`${speedCount.toLocaleString()} KM/S`}
            </text>
          )}

          {/* Gleaming Mirror */}
          <g
            transform={`translate(${interpolate(mirrorEnter, [0, 1], [1640, 1510])}, 0)`}
            opacity={0.25 + 0.75 * mirrorEnter}
          >
            <rect
              x={-12}
              y={330}
              width={24}
              height={420}
              rx={8}
              fill="url(#ch2MirrorGrad)"
              style={{ filter: svgGlow(C.cyan, 16) }}
            />
            <text
              x={0}
              y={296}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={800}
              fontSize={26}
              letterSpacing={2.5}
            >
              MIRROR
            </text>
          </g>

          {mOutP > 0.01 && mBackP < 0.02 && (
            <PhotonPacket
              id="ch2MirrorOut"
              x1={520}
              y1={506}
              x2={1495}
              y2={506}
              progress={mOutP}
              color={C.gold}
              tailLen={230}
              label="OUTBOUND"
            />
          )}
          {mBackP > 0.01 && (
            <PhotonPacket
              id="ch2MirrorBack"
              x1={1495}
              y1={574}
              x2={520}
              y2={574}
              progress={mBackP}
              color={C.cyan}
              tailLen={230}
              label="RETURN · AVG = 300,000 KM/S"
            />
          )}
        </svg>

        <MinimalLabel
          text={frame >= tTwoWay ? "TWO-WAY AVERAGE ONLY" : "THE MIRROR TRICK"}
          color={frame >= tTwoWay ? C.gold : C.cyan}
          x={960}
          y={104}
          size={44}
        />
      </CleanStage>

      {/* STAGE 2: Earth <-> Mars Standard Universe (stays live under INSTANT?! punch!) */}
      <CleanStage from={tMars} to={tCheckClocks + 10}>
        <AbsoluteFill
          style={{
            transform: `scale(${interpolate(marsIntroP, [0, 1], [0.94, 1.03])})`,
            transformOrigin: "50% 52%",
          }}
        >
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Distance dashed track smoothly drawing across tMars -> tWorld1 */}
          <line
            x1={470}
            y1={530}
            x2={470 + 980 * Math.max(0.08, marsIntroP)}
            y2={530}
            stroke={C.cyan}
            strokeWidth={2.8}
            strokeDasharray="12 14"
            opacity={0.48}
          />
          <text
            x={960}
            y={465}
            textAnchor="middle"
            fill={C.dim}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={24}
            letterSpacing={3}
          >
            10 LIGHT-MINUTES
          </text>

          {/* Earth Orb + Clock */}
          <circle
            cx={340}
            cy={530}
            r={86}
            fill="#0b3a6e"
            stroke={C.cyan}
            strokeWidth={4}
            style={{ filter: svgGlow(C.cyan, 16) }}
          />
          <path
            d="M 290,510 C 315,490 355,495 375,525 C 350,555 315,565 290,545 Z"
            fill="#34d399"
            opacity={0.65}
          />
          <text
            x={340}
            y={412}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={28}
            letterSpacing={3}
          >
            EARTH
          </text>
          <text
            x={340}
            y={678}
            textAnchor="middle"
            fill={C.white}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={44}
          >
            {`12:${pad2(w1EarthMin)}`}
          </text>

          {/* Mars Orb + Clock */}
          <circle
            cx={1580}
            cy={530}
            r={74}
            fill="#882817"
            stroke="#fb923c"
            strokeWidth={4}
            style={{ filter: svgGlow("#fb923c", 16) }}
          />
          <text
            x={1580}
            y={412}
            textAnchor="middle"
            fill="#fb923c"
            fontFamily={MONO}
            fontWeight={800}
            fontSize={28}
            letterSpacing={3}
          >
            MARS
          </text>
          <text
            x={1580}
            y={678}
            textAnchor="middle"
            fill={C.white}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={44}
          >
            {`12:${pad2(w1MarsMin)}`}
          </text>

          {/* World 1 symmetrical pulses */}
          {w1OutP > 0.01 && w1BackP < 0.02 && w2TeaseP < 0.05 && (
            <PhotonPacket
              id="ch2W1Out"
              x1={440}
              y1={515}
              x2={1495}
              y2={515}
              progress={w1OutP}
              color={C.cyan}
              tailLen={220}
              label="c · 10 MIN OUT"
            />
          )}
          {w1BackP > 0.01 && w2TeaseP < 0.05 && (
            <PhotonPacket
              id="ch2W1Back"
              x1={1495}
              y1={550}
              x2={440}
              y2={550}
              progress={w1BackP}
              color={C.gold}
              tailLen={220}
              label="c · 10 MIN BACK"
            />
          )}

          {/* World 2 Tease: slow amber beam half-way out + glowing question */}
          {w2TeaseP > 0.02 && (
            <PhotonPacket
              id="ch2W2Tease"
              x1={440}
              y1={530}
              x2={1495}
              y2={530}
              progress={w2TeaseP * 0.62}
              color={C.red}
              tailLen={260}
              amp={20}
              waves={6}
              label="c / 2 · 20 MIN OUT"
            />
          )}
        </svg>
        </AbsoluteFill>

        <MinimalLabel
          text={w2TeaseP > 0.05 ? "WHAT IF: c/2 OUT · ∞ BACK?" : "UNIVERSE 1 · SYMMETRIC"}
          sub={w2TeaseP > 0.05 ? "HALF SPEED OUT · INSTANT RETURN" : "10 MIN OUT + 10 MIN BACK = 12:20"}
          color={w2TeaseP > 0.05 ? C.red : C.cyan}
          x={960}
          y={104}
          size={42}
        />
      </CleanStage>

      {/* KINETIC PUNCH: INSTANT?! */}
      <Sequence from={tInstant} durationInFrames={punchDur}>
        <KineticPunch
          word="INSTANT?!"
          sub="c/2 OUT · ∞ BACK"
          color={C.gold}
          accent="question"
          size={162}
        />
      </Sequence>

      {/* STAGE 3: Split-Screen Universe 1 (top) vs Universe 2 (bottom) — Both Hit Earth at 12:20! */}
      <CleanStage from={tCheckClocks} to={tEvenWorse + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch2InstantBeam"
              gradientUnits="userSpaceOnUse"
              x1={440}
              y1={790}
              x2={1495}
              y2={790}
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="50%" stopColor={C.cyan} stopOpacity={1} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* Horizontal Divider */}
          <line
            x1={140}
            y1={555}
            x2={1780}
            y2={555}
            stroke={C.white}
            strokeWidth={2}
            opacity={0.18}
          />

          {/* TOP ROW: UNIVERSE 1 (c out, c back) */}
          <text
            x={960}
            y={220}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={28}
            letterSpacing={3}
          >
            UNIVERSE 1 · c OUT (10m) + c BACK (10m)
          </text>
          <circle cx={340} cy={355} r={54} fill="#0b3a6e" stroke={C.cyan} strokeWidth={3.5} />
          <text x={340} y={452} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={36}>
            {`12:${pad2(splitClockMin)}`}
          </text>
          <circle cx={1580} cy={355} r={48} fill="#882817" stroke="#fb923c" strokeWidth={3.5} />
          <text x={1580} y={452} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={36}>
            {`12:${pad2(splitClockMin)}`}
          </text>
          <line x1={415} y1={355} x2={1510} y2={355} stroke={C.cyan} strokeWidth={2} strokeDasharray="10 12" opacity={0.28} />

          {topOutP > 0.01 && topBackP < 0.01 && (
            <PhotonPacket id="ch2TopOut" x1={415} y1={340} x2={1510} y2={340} progress={topOutP} color={C.cyan} tailLen={190} label="c" />
          )}
          {topBackP > 0.01 && (
            <PhotonPacket id="ch2TopBack" x1={1510} y1={372} x2={415} y2={372} progress={topBackP} color={C.cyan} tailLen={190} label="c" />
          )}

          {/* BOTTOM ROW: UNIVERSE 2 (c/2 out = 20m, INFINITE back = 0s!) */}
          <text
            x={960}
            y={640}
            textAnchor="middle"
            fill={C.gold}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={28}
            letterSpacing={3}
          >
            UNIVERSE 2 · c/2 OUT (20m) + ∞ INSTANT BACK (0s)
          </text>
          <circle cx={340} cy={775} r={54} fill="#0b3a6e" stroke={C.gold} strokeWidth={3.5} />
          <text x={340} y={872} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={36}>
            {`12:${pad2(splitClockMin)}`}
          </text>
          <circle cx={1580} cy={775} r={48} fill="#882817" stroke="#fb923c" strokeWidth={3.5} />
          <text x={1580} y={872} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={36}>
            {`12:${pad2(Math.max(0, splitClockMin - 10))}`}
          </text>
          <line x1={415} y1={775} x2={1510} y2={775} stroke={C.gold} strokeWidth={2} strokeDasharray="10 12" opacity={0.28} />

          {botOutP > 0.01 && botInstantFlash < 0.15 && (
            <PhotonPacket id="ch2BotOut" x1={415} y1={758} x2={1510} y2={758} progress={botOutP} color={C.red} tailLen={230} amp={17} waves={5} label="c / 2 · SLOW" />
          )}

          {/* Instantaneous blazing return flash at 12:20! */}
          {botInstantFlash > 0.02 && (
            <g opacity={botInstantFlash}>
              <line
                x1={415}
                y1={790}
                x2={1510}
                y2={790}
                stroke="url(#ch2InstantBeam)"
                strokeWidth={11}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.cyan, 18) }}
              />
              <text
                x={960}
                y={848}
                textAnchor="middle"
                fill="#ffffff"
                fontFamily={MONO}
                fontWeight={900}
                fontSize={32}
                letterSpacing={3}
                style={{ filter: svgGlow(C.cyan, 12) }}
              >
                0 SECONDS · ARRIVES 12:20!
              </text>
            </g>
          )}
        </svg>

        <MinimalLabel
          text={
            splitClockMin >= 19.2
              ? "BOTH RETURN AT 12:20 ✓"
              : `EARTH CLOCK: 12:${pad2(splitClockMin)}`
          }
          color={splitClockMin >= 19.2 ? "#4ade80" : C.white}
          x={960}
          y={82}
          size={44}
        />
      </CleanStage>

      {/* STAGE 4: Identical Timestamps + Hidden Sync Offset + Like Toast */}
      <CleanStage from={tEvenWorse} to={len}>
        <AbsoluteFill style={{ transform: `scale(${s4Zoom})`, transformOrigin: "50% 52%" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Live Mars Sync Offset Pulse Bar above monitors */}
          <line x1={380} y1={245} x2={1540} y2={245} stroke={C.gold} strokeWidth={2.5} strokeDasharray="10 12" opacity={0.38} />
          <PhotonPacket
            id="ch2SyncLate"
            x1={380}
            y1={245}
            x2={1540}
            y2={245}
            progress={syncP}
            color={C.gold}
            tailLen={210}
            label={syncP < 0.85 ? "EARLIER SYNC PULSE (20 MIN)" : "MARS SET -10 MIN BEHIND"}
          />
          {/* Two Earth monitors side by side */}
          {[
            { cx: 560, title: "UNIVERSE 1 (c / c)", col: C.cyan },
            { cx: 1360, title: "UNIVERSE 2 (c/2 / ∞)", col: C.gold },
          ].map((u, idx) => (
            <g key={idx} transform={`translate(${u.cx}, 580)`}>
              <rect
                x={-280}
                y={-210}
                width={560}
                height={420}
                rx={24}
                fill="#071024"
                stroke={matchPop > 0.2 ? "#4ade80" : u.col}
                strokeWidth={3.5}
                style={{ filter: svgGlow(matchPop > 0.2 ? "#4ade80" : u.col, 12) }}
              />
              <text
                x={0}
                y={-150}
                textAnchor="middle"
                fill={u.col}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={24}
                letterSpacing={2}
              >
                {u.title}
              </text>
              <text x={0} y={-55} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontSize={24}>
                SENT: 12:00
              </text>
              <text
                x={0}
                y={18}
                textAnchor="middle"
                fill={C.white}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={34}
                opacity={0.35 + 0.65 * syncP}
              >
                MARS STAMP: 12:10
              </text>
              <text
                x={0}
                y={96}
                textAnchor="middle"
                fill="#4ade80"
                fontFamily={MONO}
                fontWeight={900}
                fontSize={44}
                style={{ filter: svgGlow("#4ade80", 10) }}
              >
                REPLY: 12:20
              </text>
              {matchPop > 0.05 && (
                <text
                  x={0}
                  y={168}
                  textAnchor="middle"
                  fill="#4ade80"
                  fontFamily={MONO}
                  fontWeight={800}
                  fontSize={26}
                  opacity={matchPop}
                  letterSpacing={3}
                >
                  100% IDENTICAL ✓
                </text>
              )}
            </g>
          ))}

          {/* Equals sign in center */}
          <text
            x={960}
            y={610}
            textAnchor="middle"
            fill="#4ade80"
            fontFamily={MONO}
            fontWeight={900}
            fontSize={110}
            opacity={0.25 + 0.75 * matchPop}
            style={{ filter: svgGlow("#4ade80", 16) }}
          >
            =
          </text>
        </svg>
        </AbsoluteFill>

        <MinimalLabel
          text={matchPop > 0.2 ? "INDISTINGUISHABLE" : "MARS SYNC WAS SHIFTED TOO"}
          color={matchPop > 0.2 ? "#4ade80" : C.gold}
          x={960}
          y={104}
          size={46}
        />

        <LikePromptToast
          at={tLike}
          dur={Math.max(100, len - tLike - 18)}
          label="Hit Like!"
        />
      </CleanStage>
    </AbsoluteFill>
  );
};
