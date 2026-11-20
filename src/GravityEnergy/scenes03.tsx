import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, BigText, Kicker, Panel, SceneFade } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { YearBadge } from "../CosmicMario/visuals";
import { makeGravityCue } from "./timing";
import { AnimatedChapterCard, SpacetimeFunnelSVG } from "./visuals";
import { BinaryBlackHoleWavesSVG, HighDetailTidalAnimation, NebulaCollapseAnimation } from "./animations";

// ===========================================================================
// CHAPTER 6 — WHEN GRAVITY DOES DRAIN ENERGY (Ocean Tides + 2015 LIGO Waves)
// (Fixes Issue #6 at 7:40 & Issue #7 at 8:10 with full-canvas live animations!)
// ===========================================================================
export const GravityCh6: React.FC = () => {
  const cue = makeGravityCue("ch6");

  const tTides = cue("lifts billions");
  const tBrake = cue("acts like a giant brake");
  const tRecede = cue("three point eight");
  const tDeepSpace = cue("Even in deep space");
  const tLigo = cue("LIGO");
  const tCollide = cue("until they collide");

  return (
    <AbsoluteFill>
      {/* Beat 1 & 2 (FIX ISSUE #6): Full-Canvas High-Detail Tidal Bulge, Friction Brake & Receding Moon */}
      <SceneFade from={0} to={tDeepSpace - 6} zoom={false}>
        <HighDetailTidalAnimation tidesAt={tTides} brakeAt={tBrake} recedeAt={tRecede} />

        {/* Crisp Single-Line Top Title */}
        <div style={{ position: "absolute", top: 48, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Kicker color={C.cyan}>THE HONEST PHYSICS CHECK · OCEAN TIDES</Kicker>
          <BigText size={54} style={{ marginTop: 6, maxWidth: 1640, textAlign: "center" }}>
            Tidal Energy Isn&apos;t Free — It&apos;s <span style={{ color: C.gold }}>Stolen From Earth&apos;s Spin</span>
          </BigText>
        </div>

        {/* Compact Bottom Live Telemetry Pills (Zero text walls!) */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: 110,
            right: 110,
            display: "flex",
            justifyContent: "space-between",
            gap: 44,
          }}
        >
          <Appear at={tBrake - 10} style={{ flex: 1 }}>
            <div
              style={{
                padding: "18px 34px",
                borderRadius: 18,
                background: "rgba(8, 15, 36, 0.9)",
                border: `2.5px solid ${C.red}`,
                boxShadow: glow(C.red, 10),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.dim }}>EARTH ROTATION SLOWS</span>
              <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 32, color: C.red }}>+1.7 ms / CENTURY</span>
            </div>
          </Appear>

          <Appear at={tRecede - 10} style={{ flex: 1 }}>
            <div
              style={{
                padding: "18px 34px",
                borderRadius: 18,
                background: "rgba(8, 15, 36, 0.9)",
                border: `2.5px solid ${C.green}`,
                boxShadow: glow(C.green, 10),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.dim }}>MOON ORBIT EXPANDS</span>
              <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 32, color: C.green }}>+3.8 cm / YEAR →</span>
            </div>
          </Appear>
        </div>
      </SceneFade>

      {/* Beat 3 (FIX ISSUE #7): Full-Canvas Live Binary Black Hole Inspiral, Gravitational Waves & LIGO Chirp */}
      <SceneFade from={tDeepSpace - 4} to={cue.len + 30} zoom={false}>
        <YearBadge year="2015 · LIGO" location="FIRST DETECTION OF GRAVITATIONAL WAVES" at={tLigo} color={C.gold} />
        <BinaryBlackHoleWavesSVG startAt={tDeepSpace} collideAt={tCollide} />

        {/* Clean Title Clearing YearBadge */}
        <div style={{ position: "absolute", top: 152, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Kicker color={C.gold}>RIPPLES IN SPACETIME · GRAVITATIONAL WAVES</Kicker>
          <BigText size={52} style={{ marginTop: 6, maxWidth: 1640, textAlign: "center" }}>
            Gravitational Waves Carry <span style={{ color: C.cyan }}>Orbital Energy</span> Away
          </BigText>
        </div>
      </SceneFade>

      <AnimatedChapterCard num={6} title="When Gravity Does Drain Energy" subtitle="TIDES & GRAVITATIONAL WAVES" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 7 — WHO PAID THE ENERGY BILL (Hydroelectric Dam + 4.5B Yrs Nebula Collapse)
// ===========================================================================
export const GravityCh7: React.FC = () => {
  const cue = makeGravityCue("ch7");
  const frame = useCurrentFrame();

  const tDam = cue("In a hydroelectric dam");
  const tBowl = cue("And the deep spacetime");
  const dropCycle = (frame % 60) / 60;

  return (
    <AbsoluteFill>
      {/* Beat 1 (Benchmark quality scene praised by user!): Hydroelectric Dam — The Sun Paid the Bill */}
      <SceneFade from={0} to={tBowl - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.gold}>WHO PAID THE ENERGY BILL UP FRONT?</Kicker>
          <BigText size={54} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            In a Hydroelectric Dam, <span style={{ color: C.gold }}>The Sun</span> Lifted the Water
          </BigText>

          <div style={{ display: "flex", gap: 76, marginTop: 46, alignItems: "center" }}>
            {/* Animated Water Cycle + Dam Turbine Diagram */}
            <Panel style={{ width: 960, height: 590, padding: "28px 34px" }} border={C.cyan}>
              <svg width={890} height={530} viewBox="0 0 890 530">
                {/* Glowing Sun at Top-Left */}
                <circle cx={130} cy={100} r={54} fill={C.gold} style={{ filter: svgGlow(C.gold, 14) }} />
                <text x={130} y={182} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
                  SUNLIGHT (PAYS ENERGY)
                </text>

                {/* Evaporation Arrows Rising Up to Cloud */}
                {[110, 150, 190].map((x, i) => (
                  <line
                    key={i}
                    x1={x}
                    y1={420 - dropCycle * 160}
                    x2={x}
                    y2={375 - dropCycle * 160}
                    stroke={C.gold}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                ))}

                {/* Mountain Cloud */}
                <ellipse cx={450} cy={95} rx={125} ry={44} fill="rgba(62,224,255,0.22)" stroke={C.cyan} strokeWidth={3} />
                <text x={450} y={102} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={800} fontSize={22}>
                  STORED PE IN CLOUDS
                </text>

                {/* Rain falling onto mountain reservoir */}
                {[410, 450, 490].map((x, i) => (
                  <circle key={i} cx={x} cy={145 + dropCycle * 120} r={5} fill={C.cyan} />
                ))}

                {/* Mountain Dam Structure */}
                <polygon points="360,460 520,240 650,240 650,460" fill="rgba(10,20,48,0.9)" stroke={C.cyan} strokeWidth={4} />
                {/* Waterfall Dropping Through Turbine */}
                <line x1={650} y1={270} x2={750} y2={420} stroke={C.cyan} strokeWidth={18} strokeLinecap="round" style={{ filter: svgGlow(C.cyan, 8) }} />

                {/* Spinning Turbine Wheel */}
                <g transform={`translate(755, 425) rotate(${frame * 6})`}>
                  <circle cx={0} cy={0} r={42} fill="rgba(255,194,77,0.2)" stroke={C.gold} strokeWidth={4} />
                  <line x1={-38} y1={0} x2={38} y2={0} stroke={C.gold} strokeWidth={5} />
                  <line x1={0} y1={-38} x2={0} y2={38} stroke={C.gold} strokeWidth={5} />
                </g>
                <text x={755} y={505} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
                  TURBINE (CASHES CHECK)
                </text>

                {/* Ocean at Bottom Left */}
                <rect x={40} y={440} width={310} height={40} rx={8} fill="rgba(62,224,255,0.3)" stroke={C.cyan} strokeWidth={2} />
                <text x={195} y={468} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={20}>
                  OCEAN
                </text>
              </svg>
            </Panel>

            <div style={{ width: 640 }}>
              <Appear at={tDam - 10}>
                <Panel style={{ padding: "36px 40px" }} border={C.gold}>
                  <Kicker color={C.gold}>THE SOLAR DEPOSIT</Kicker>
                  <BigText size={48} style={{ marginTop: 14 }}>
                    1. Sun evaporates ocean water upward
                    <br />
                    <span style={{ color: C.cyan }}>2. Gravity returns that energy as electricity</span>
                  </BigText>
                </Panel>
              </Appear>
            </div>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 2 (Proactive Upgrade): Live Animated Stardust Nebula Collapse -> Molten Proto-Earth + Deepening Spacetime Well */}
      <SceneFade from={tBowl - 4} to={cue.len + 30} zoom={false}>
        <YearBadge year="4.5 BILLION YEARS AGO" location="PROTO-PLANETARY NEBULA COLLAPSE" at={tBowl} color={C.gold} />
        <NebulaCollapseAnimation startAt={tBowl} />

        <div style={{ position: "absolute", top: 154, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Kicker color={C.gold}>ORIGIN OF EARTH&apos;S GRAVITY WELL</Kicker>
          <BigText size={52} style={{ marginTop: 6, maxWidth: 1640, textAlign: "center" }}>
            Ancient Stardust Collapsed Into <span style={{ color: C.gold }}>Molten Rock</span>
          </BigText>
        </div>
      </SceneFade>

      <AnimatedChapterCard num={7} title="Who Paid the Energy Bill" subtitle="SUNLIGHT & ANCIENT STARDUST" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 8 — THE SHAPE OF REALITY (Closing Takeaway + Standalone Subscribe CTA)
// ===========================================================================
export const GravityCh8: React.FC = () => {
  const cue = makeGravityCue("ch8");
  const frame = useCurrentFrame();

  const tSub = cue("hit subscribe");
  const press = interpolate(frame, [tSub + 12, tSub + 17, tSub + 24], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subbed = frame > tSub + 17;

  return (
    <AbsoluteFill>
      <SceneFade from={0} to={cue.len + 40} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
          <Kicker color={C.cyan} style={{ fontSize: 28 }}>
            THE SHAPE OF REALITY
          </Kicker>
          <BigText size={68} style={{ marginTop: 12, maxWidth: 1680, textAlign: "center" }}>
            Gravity Isn&apos;t an Engine Burning Fuel —
            <br />
            It&apos;s <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>the Geometry of Spacetime</span>
          </BigText>

          <div style={{ marginTop: -25 }}>
            <SpacetimeFunnelSVG depth={1} showMoon width={1040} height={580} />
          </div>

          <Appear at={cue("If you love breaking")} style={{ marginTop: -10 }}>
            <div
              style={{
                display: "inline-block",
                padding: "22px 68px",
                borderRadius: 60,
                background: subbed ? C.green : C.red,
                color: subbed ? "#040814" : "#fff",
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 48,
                transform: `scale(${press})`,
                boxShadow: glow(subbed ? C.green : C.red, 14),
              }}
            >
              {subbed ? "SUBSCRIBED ✓" : "SUBSCRIBE FOR MORE PHYSICS"}
            </div>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      <AnimatedChapterCard num={8} title="The Shape of Reality" />
    </AbsoluteFill>
  );
};
