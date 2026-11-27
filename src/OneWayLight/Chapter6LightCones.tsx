import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, INTER, MONO, glow, svgGlow } from "../FiveHundredMileEmail/theme";
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
  PhotonPacket,
  SpiralGalaxy,
} from "./visuals";

// ===========================================================================
// Chapter 6 — Light Cones & Why Causality Never Breaks + Subscribe Outro
// ===========================================================================
export const Chapter6LightCones: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = makeOwlCue("ch6");
  const len = cue.len;

  const tNo = cue("No. And the reason");
  const tLightCone = cue("Light Cone");
  const tPast = cue("observable past");
  const tFuture = cue("reachable future");
  const tElsewhere = cue("Elsewhere");
  const tAndroNow = cue("Andromeda's right now");
  const tInsideCone = cue("Inside the light cone");
  const tTwoClocks = cue("two clocks across your room");
  const tWeb = cue("web of local clocks");
  const tSubscribe = cue("subscribe");

  // Stage 1: Hypothetical Warning Signal Shatters (0 -> tLightCone, stays live under NO. punch!)
  const warnP = easeInOutCubic(frame / Math.max(45, tNo + 12));

  // Kinetic Punch: NO.
  const punchDur = Math.max(46, Math.min(72, tLightCone - tNo));

  // Stage 2: 3D-Projected 4D Light Cone (Past / Future / Elsewhere + Andromeda Outside!)
  const coneGrow = easeOutCubic((frame - tLightCone) / 48);
  const pastGlow = clamp01((frame - tPast) / 26);
  const futGlow = clamp01((frame - tFuture) / 26);
  const elseGlow = clamp01((frame - tElsewhere) / 30);
  const androDotP = easeOutCubic(
    (frame - tAndroNow) / Math.max(45, tInsideCone - tAndroNow - 15),
  );
  // Monotonic subtle 3D cone ring breathing/yaw (never looping!)
  const coneTiltRY = interpolate(
    frame,
    [tLightCone, Math.max(tLightCone + 60, tInsideCone)],
    [42, 62],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Stage 3: Inside the Light Cone — Cause ALWAYS Precedes Effect Across Tilting Planes!
  const s3Dur = Math.max(60, tTwoClocks - tInsideCone);
  const s3P = clamp01((frame - tInsideCone) / s3Dur);
  // Smooth monotonic sweep of observer's "NOW" slice from -22° -> +22° while Cause -> Effect stays locked!
  const planeAngle = interpolate(s3P, [0, 1], [-22, 22]);

  // Stage 4: Callback to Opening Two Clocks + Clean Subscribe Outro (tTwoClocks -> len)
  const s4P = clamp01((frame - tTwoClocks) / Math.max(50, len - tTwoClocks));
  const webP = easeInOutCubic(
    (frame - tWeb) / Math.max(45, tSubscribe - tWeb),
  );
  const subEnter = spring({
    frame: Math.max(0, frame - tSubscribe),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const clocksLiftY = frame >= tSubscribe ? -95 * clamp01(subEnter) : 0;

  return (
    <AbsoluteFill>
      {/* STAGE 1: Can Walker 2 Warn Earth Before the Vote? Signal Blocked! (stays live under NO. punch!) */}
      <CleanStage from={0} to={tLightCone + 10}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <circle
            cx={340}
            cy={560}
            r={62}
            fill="#0b3a6e"
            stroke={C.cyan}
            strokeWidth={4}
            style={{ filter: svgGlow(C.cyan, 14) }}
          />
          <text x={340} y={666} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={26}>
            EARTH
          </text>

          <SpiralGalaxy cx={1540} cy={560} scale={1.15} rotation={-18 + warnP * 12} />
          <text x={1540} y={666} textAnchor="middle" fill="#f0abfc" fontFamily={MONO} fontWeight={800} fontSize={26}>
            ANDROMEDA
          </text>

          {/* Dashed red hypothetical FTL peek arrow hitting an unbreakable barrier at center */}
          <line
            x1={1420}
            y1={560}
            x2={1420 - Math.min(0.46, warnP) * 980}
            y2={560}
            stroke={C.red}
            strokeWidth={6}
            strokeDasharray="16 14"
            style={{ filter: svgGlow(C.red, 12) }}
          />

          {/* Barrier wall & shatter burst */}
          {warnP > 0.35 && (
            <g opacity={clamp01((warnP - 0.35) * 3)}>
              <line
                x1={960}
                y1={330}
                x2={960}
                y2={790}
                stroke={C.gold}
                strokeWidth={5}
                strokeLinecap="round"
                style={{ filter: svgGlow(C.gold, 14) }}
              />
              <text
                x={960}
                y={300}
                textAnchor="middle"
                fill={C.red}
                fontFamily={MONO}
                fontWeight={900}
                fontSize={32}
                letterSpacing={2.5}
              >
                PEEK AHEAD? BLOCKED ✕
              </text>
            </g>
          )}
        </svg>

        <MinimalLabel
          text="DOES REALITY BREAK?"
          color={C.red}
          x={960}
          y={104}
          size={46}
        />
      </CleanStage>

      {/* KINETIC PUNCH: NO. */}
      <Sequence from={tNo} durationInFrames={punchDur}>
        <KineticPunch
          word="NO."
          sub="CAUSALITY NEVER BREAKS"
          color={C.red}
          accent="cross"
          size={195}
        />
      </Sequence>

      {/* STAGE 2: 3D-Projected 4D Light Cone + ELSEWHERE + Andromeda Outside */}
      <CleanStage from={tLightCone} to={tInsideCone + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch6FutureFill"
              gradientUnits="userSpaceOnUse"
              x1={960}
              y1={560}
              x2={960}
              y2={210}
            >
              <stop offset="0%" stopColor={C.gold} stopOpacity={0.38} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0.12} />
            </linearGradient>
            <linearGradient
              id="ch6PastFill"
              gradientUnits="userSpaceOnUse"
              x1={960}
              y1={560}
              x2={960}
              y2={910}
            >
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Outer ELSEWHERE subtle highlight bands */}
          {elseGlow > 0.02 && (
            <g opacity={elseGlow}>
              <rect
                x={120}
                y={340}
                width={420}
                height={440}
                rx={28}
                fill="#1e1b4b"
                fillOpacity={0.35}
                stroke="#818cf8"
                strokeOpacity={0.38}
                strokeWidth={2}
                strokeDasharray="10 10"
              />
              <rect
                x={1380}
                y={340}
                width={420}
                height={440}
                rx={28}
                fill="#1e1b4b"
                fillOpacity={0.35}
                stroke="#818cf8"
                strokeOpacity={0.38}
                strokeWidth={2}
                strokeDasharray="10 10"
              />
              <text
                x={330}
                y={570}
                textAnchor="middle"
                fill="#a5b4fc"
                fontFamily={MONO}
                fontWeight={900}
                fontSize={34}
                letterSpacing={4}
              >
                ELSEWHERE
              </text>
              <text
                x={1590}
                y={402}
                textAnchor="middle"
                fill="#a5b4fc"
                fontFamily={MONO}
                fontWeight={900}
                fontSize={34}
                letterSpacing={4}
              >
                ELSEWHERE
              </text>
            </g>
          )}

          {/* Central Time Axis */}
          <line
            x1={960}
            y1={950}
            x2={960}
            y2={170}
            stroke={C.white}
            strokeWidth={2.5}
            opacity={0.32}
            strokeDasharray="8 10"
          />

          {/* Horizontal Present Plane Line */}
          <line
            x1={220}
            y1={560}
            x2={1700}
            y2={560}
            stroke={C.white}
            strokeWidth={2}
            opacity={0.22}
          />

          {/* UPPER FUTURE CONE */}
          <g opacity={coneGrow}>
            <polygon
              points={`960,560 ${960 - 340 * coneGrow},${560 - 340 * coneGrow} ${960 + 340 * coneGrow},${560 - 340 * coneGrow}`}
              fill="url(#ch6FutureFill)"
            />
            {[0.35, 0.68, 1.0].map((k, idx) => (
              <ellipse
                key={`f${idx}`}
                cx={960}
                cy={560 - 340 * coneGrow * k}
                rx={340 * coneGrow * k}
                ry={coneTiltRY * k}
                fill="none"
                stroke={futGlow > 0.2 ? C.gold : C.cyan}
                strokeWidth={idx === 2 ? 3.5 : 2}
                opacity={idx === 2 ? 0.92 : 0.48}
                style={idx === 2 ? { filter: svgGlow(C.gold, 10) } : undefined}
              />
            ))}
            <line
              x1={960}
              y1={560}
              x2={960 - 340 * coneGrow}
              y2={560 - 340 * coneGrow}
              stroke={C.gold}
              strokeWidth={4}
              style={{ filter: svgGlow(C.gold, 10) }}
            />
            <line
              x1={960}
              y1={560}
              x2={960 + 340 * coneGrow}
              y2={560 - 340 * coneGrow}
              stroke={C.gold}
              strokeWidth={4}
              style={{ filter: svgGlow(C.gold, 10) }}
            />
            <text
              x={960}
              y={326}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={30}
              letterSpacing={3}
              opacity={0.35 + 0.65 * futGlow}
            >
              FUTURE CONE
            </text>
          </g>

          {/* LOWER PAST CONE */}
          <g opacity={coneGrow}>
            <polygon
              points={`960,560 ${960 - 340 * coneGrow},${560 + 340 * coneGrow} ${960 + 340 * coneGrow},${560 + 340 * coneGrow}`}
              fill="url(#ch6PastFill)"
            />
            {[0.35, 0.68, 1.0].map((k, idx) => (
              <ellipse
                key={`p${idx}`}
                cx={960}
                cy={560 + 340 * coneGrow * k}
                rx={340 * coneGrow * k}
                ry={coneTiltRY * k}
                fill="none"
                stroke={pastGlow > 0.2 ? C.cyan : "#818cf8"}
                strokeWidth={idx === 2 ? 3.5 : 2}
                opacity={idx === 2 ? 0.92 : 0.48}
                style={idx === 2 ? { filter: svgGlow(C.cyan, 10) } : undefined}
              />
            ))}
            <line
              x1={960}
              y1={560}
              x2={960 - 340 * coneGrow}
              y2={560 + 340 * coneGrow}
              stroke={C.cyan}
              strokeWidth={4}
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
            <line
              x1={960}
              y1={560}
              x2={960 + 340 * coneGrow}
              y2={560 + 340 * coneGrow}
              stroke={C.cyan}
              strokeWidth={4}
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
            <text
              x={960}
              y={818}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={30}
              letterSpacing={3}
              opacity={0.35 + 0.65 * pastGlow}
            >
              PAST CONE
            </text>
          </g>

          {/* Central HERE & NOW Vertex */}
          <circle
            cx={960}
            cy={560}
            r={14}
            fill="#ffffff"
            style={{ filter: svgGlow(C.gold, 16) }}
          />
          <text
            x={960}
            y={534}
            textAnchor="middle"
            fill="#ffffff"
            fontFamily={MONO}
            fontWeight={800}
            fontSize={20}
            letterSpacing={2}
          >
            HERE &amp; NOW
          </text>

          {/* Andromeda "Right Now" placed squarely inside ELSEWHERE, light climbs 45° for 2.5M yrs */}
          {androDotP > 0.02 && (
            <g opacity={androDotP}>
              <SpiralGalaxy cx={1590} cy={560} scale={0.78} rotation={-20 + androDotP * 20} />
              <text
                x={1590}
                y={645}
                textAnchor="middle"
                fill="#f0abfc"
                fontFamily={MONO}
                fontWeight={800}
                fontSize={22}
              >
                ANDROMEDA &ldquo;NOW&rdquo;
              </text>
              {/* 45-degree photon climbing toward Earth's far future */}
              <line
                x1={1590}
                y1={560}
                x2={1590 - androDotP * 400}
                y2={560 - androDotP * 400}
                stroke="#f0abfc"
                strokeWidth={4}
                strokeDasharray="10 10"
                style={{ filter: svgGlow("#c084fc", 10) }}
              />
              <text
                x={1450}
                y={476}
                textAnchor="end"
                fill="#f0abfc"
                fontFamily={MONO}
                fontWeight={800}
                fontSize={20}
              >
                2.5M YEARS TO REACH EARTH
              </text>
            </g>
          )}
        </svg>

        <MinimalLabel
          text={
            frame >= tAndroNow
              ? "OUTSIDE THE CONE · OUT OF REACH"
              : frame >= tElsewhere
                ? "ELSEWHERE: NO SIGNAL CAN BRIDGE IT"
                : "YOUR SPACETIME LIGHT CONE"
          }
          color={frame >= tAndroNow ? "#f0abfc" : C.gold}
          x={960}
          y={76}
          size={40}
        />
      </CleanStage>

      {/* STAGE 3: Inside the Light Cone — Cause ALWAYS Comes Before Effect */}
      <CleanStage from={tInsideCone} to={tTwoClocks + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Magnified Future Light Cone Interior */}
          <polygon
            points="960,860 520,240 1400,240"
            fill={C.cyan}
            fillOpacity={0.12}
          />
          <line x1={960} y1={860} x2={520} y2={240} stroke={C.gold} strokeWidth={4} />
          <line x1={960} y1={860} x2={1400} y2={240} stroke={C.gold} strokeWidth={4} />

          {/* Tilting Observer "NOW" Plane rotating monotonically -22° -> +22° */}
          <g transform={`translate(960, 560) rotate(${planeAngle})`}>
            <line
              x1={-560}
              y1={0}
              x2={560}
              y2={0}
              stroke={C.white}
              strokeWidth={3.5}
              strokeDasharray="14 10"
              opacity={0.62}
            />
            <text
              x={540}
              y={-18}
              textAnchor="end"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={22}
            >
              ANY OBSERVER &ldquo;NOW&rdquo;
            </text>
          </g>

          {/* CAUSE (bottom) -> EFFECT (top): Strictly timelike, NEVER flips! */}
          <line
            x1={960}
            y1={770}
            x2={960}
            y2={370}
            stroke="#4ade80"
            strokeWidth={6}
            style={{ filter: svgGlow("#4ade80", 12) }}
          />
          <polyline
            points="942,398 960,364 978,398"
            fill="none"
            stroke="#4ade80"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx={960} cy={770} r={22} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 14) }} />
          <text x={1006} y={780} textAnchor="start" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={34}>
            1. CAUSE
          </text>

          <circle cx={960} cy={350} r={22} fill="#4ade80" style={{ filter: svgGlow("#4ade80", 14) }} />
          <text x={1006} y={360} textAnchor="start" fill="#4ade80" fontFamily={MONO} fontWeight={900} fontSize={34}>
            2. EFFECT
          </text>
        </svg>

        <MinimalLabel
          text="INSIDE THE CONE: ORDER LOCKED ✓"
          sub="SAME CAUSE → EFFECT FOR EVERY OBSERVER & EVERY ε RULE"
          color="#4ade80"
          x={960}
          y={88}
          size={42}
        />
      </CleanStage>

      {/* STAGE 4: Poetic Callback to Opening Clocks + Subscribe Outro */}
      <CleanStage from={tTwoClocks} to={len}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <g transform={`translate(0, ${clocksLiftY})`}>
            <MinimalClock
              cx={460}
              cy={530}
              r={108}
              hours={3}
              minutes={0}
              seconds={s4P * 18}
              color={C.cyan}
              label="LOCAL CLOCK A"
            />
            <MinimalClock
              cx={1460}
              cy={530}
              r={108}
              hours={3}
              minutes={0}
              seconds={s4P * 18}
              color={C.gold}
              label="LOCAL CLOCK B"
            />

            {/* Luminous connecting web of light between local clocks */}
            <PhotonPacket
              id="ch6OutWeb"
              x1={585}
              y1={504}
              x2={1335}
              y2={504}
              progress={clamp01(0.15 + webP * 0.85)}
              color={C.cyan}
              tailLen={260}
            />
            <PhotonPacket
              id="ch6BackWeb"
              x1={1335}
              y1={556}
              x2={585}
              y2={556}
              progress={clamp01(0.08 + webP * 0.88)}
              color={C.gold}
              tailLen={260}
            />
          </g>
        </svg>

        <MinimalLabel
          text={frame >= tWeb ? "LOCAL CLOCKS · LINKED BY LIGHT" : "NO COSMIC MASTER CLOCK"}
          color={frame >= tWeb ? C.gold : C.cyan}
          x={960}
          y={94}
          size={44}
        />

        {/* Clean Subscribe Outro Card */}
        {frame >= tSubscribe && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 112,
              transform: `translate(-50%, ${(1 - subEnter) * 34}px) scale(${0.92 + 0.08 * subEnter})`,
              opacity: clamp01(subEnter * 1.3),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 54px",
                borderRadius: 60,
                background: "linear-gradient(135deg, #e62429 0%, #b91c1c 100%)",
                boxShadow: `${glow("#e62429", 18)}, 0 18px 42px rgba(0,0,0,0.8)`,
                border: "2px solid rgba(255,255,255,0.28)",
              }}
            >
              <svg width={36} height={36} viewBox="0 0 36 36">
                <polygon points="10,7 30,18 10,29" fill="#ffffff" />
              </svg>
              <span
                style={{
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontSize: 34,
                  color: "#ffffff",
                  letterSpacing: 3.5,
                }}
              >
                SUBSCRIBE
              </span>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 22,
                color: C.dim,
                letterSpacing: 3,
              }}
            >
              MORE COSMIC PUZZLES COMING NEXT
            </div>
          </div>
        )}
      </CleanStage>
    </AbsoluteFill>
  );
};
