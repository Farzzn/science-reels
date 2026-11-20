import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, Kicker, Panel, prog, SceneFade } from "../FiveHundredMileEmail/components";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { YearBadge } from "../CosmicMario/visuals";
import { makeGravityCue } from "./timing";
import { AnimatedChapterCard, ForceVsWorkGauge, SpacetimeFunnelSVG } from "./visuals";
import { ArmMuscleZoomAnimation, FallingAppleSVG, PersonInChairSVG } from "./animations";

// ===========================================================================
// CHAPTER 0 — COLD OPEN (4.5B Years Paradox + 200 Quintillion N + Arm vs Earth + Roadmap)
// ===========================================================================
export const GravityCh0: React.FC = () => {
  const cue = makeGravityCue("ch0");
  const frame = useCurrentFrame();

  const tYet = cue("Yet Earth doesn't");
  const tSoHow = cue("So how can gravity");
  const tNo = cue("No, and the real");
  const armShake = Math.sin(frame * 1.9) * 5;
  const beat2Scale = interpolate(frame, [tYet, tSoHow], [1.0, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Beat 1: Earth Pulling Moon with 200 Quintillion N for 4.5 Billion Years */}
      <SceneFade from={0} to={tYet - 6} zoom={false}>
        <YearBadge year="4.5 BILLION YEARS" location="NONSTOP GRAVITATIONAL PULL" at={cue("four and a half")} color={C.gold} />
        <div style={{ position: "absolute", left: 76, top: 195, width: 790 }}>
          <Kicker color={C.cyan}>EARTH ⇄ MOON GRAVITATIONAL FORCE</Kicker>
          <BigText size={90} color={C.gold} glowColor={C.gold} style={{ marginTop: 14 }}>
            1.98 × 10²⁰ N
          </BigText>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, color: C.white, marginTop: 10 }}>
            200 Quintillion Newtons
          </div>

          <Appear at={cue("ten trillion rocket")} style={{ marginTop: 36 }}>
            <Panel style={{ padding: "24px 34px" }} border={C.red}>
              <div style={{ fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 800 }}>EQUIVALENT THRUST</div>
              <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 42, color: C.white, marginTop: 6 }}>
                10,000,000,000,000 Rocket Engines
              </div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 6 }}>
                FIRING AT FULL POWER · 24 HOURS A DAY
              </div>
            </Panel>
          </Appear>
        </div>

        <div style={{ position: "absolute", right: 35, top: 175 }}>
          <SpacetimeFunnelSVG depth={0.75} showMoon showForceRope width={980} height={740} />
        </div>
      </SceneFade>

      {/* Beat 2: Zero Fuel vs Shaking Arm Holding Dumbbell */}
      <SceneFade from={tYet - 4} to={tSoHow - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.gold}>THE EVERYDAY PARADOX</Kicker>
          <BigText size={54} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            Earth Burns <span style={{ color: C.green }}>Zero Fuel</span> — Yet Your Arm Gives Out in 2 Minutes
          </BigText>

          <div style={{ display: "flex", gap: 84, marginTop: 48 }}>
            {/* Left Card: Earth Fuel Gauge = 0.00 */}
            <Panel style={{ width: 760, height: 640, padding: "36px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.green}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 800 }}>PLANET EARTH (4.5 BILLION YRS)</div>
                <BigText size={46} style={{ marginTop: 8 }}>Zero Fuel · Zero Mass Lost</BigText>
              </div>
              <div style={{ borderRadius: 20, overflow: "hidden", border: `2px solid ${C.cyan}`, height: 340 }}>
                <Img
                  src={staticFile("gravity/spacetime-well.jpg")}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${beat2Scale})` }}
                />
              </div>
              <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 32, color: C.green, textAlign: "center" }}>
                FUEL CONSUMED: 0.0000 JOULES ✓
              </div>
            </Panel>

            {/* Right Card: 3D-Shaded Human Arm Shaking Holding Dumbbell */}
            <Panel style={{ width: 760, height: 640, padding: "36px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.red}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 24, color: C.red, fontWeight: 800 }}>HUMAN ARM (JUST 2 MINUTES)</div>
                <BigText size={46} style={{ marginTop: 8 }}>Muscles Burn &amp; Exhausted</BigText>
              </div>
              <svg width={660} height={340} viewBox="0 0 660 340">
                <defs>
                  <linearGradient id="ch0Arm3d" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff9ca6" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#7f1d1d" />
                  </linearGradient>
                  <linearGradient id="ch0Torso" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#082f49" />
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#082f49" />
                  </linearGradient>
                </defs>
                {/* Sculpted Torso */}
                <circle cx={115} cy={76} r={38} fill="url(#ch0Torso)" stroke={C.cyan} strokeWidth={3.5} />
                <path d="M72,126 Q115,114 158,126 L168,315 Q115,326 62,315 Z" fill="url(#ch0Torso)" stroke={C.cyan} strokeWidth={3.5} />
                {/* Outstretched Trembling Muscular Arm + Dumbbell */}
                <g transform={`translate(0, ${armShake})`}>
                  <path
                    d="M152,150 Q260,115 350,158 L475,160 L475,196 L350,198 Q260,204 152,190 Z"
                    fill="url(#ch0Arm3d)"
                    stroke="#fda4af"
                    strokeWidth={3}
                    style={{ filter: svgGlow(C.red, 8) }}
                  />
                  {/* Dumbbell */}
                  <rect x={462} y={114} width={28} height={128} rx={7} fill={C.gold} stroke="#fef08a" strokeWidth={2} />
                  <rect x={542} y={114} width={28} height={128} rx={7} fill={C.gold} stroke="#fef08a" strokeWidth={2} />
                  <rect x={488} y={166} width={56} height={24} rx={4} fill="#e2e8f0" />
                  {/* Rising red strain heat waves */}
                  {[220, 265, 310].map((hx, idx) => {
                    const dy = (frame * 2 + idx * 18) % 52;
                    return (
                      <line
                        key={idx}
                        x1={hx}
                        y1={134 - dy}
                        x2={hx}
                        y2={114 - dy}
                        stroke={C.red}
                        strokeWidth={4}
                        strokeLinecap="round"
                        opacity={1 - dy / 52}
                      />
                    );
                  })}
                  <text x={335} y={76} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={25}>
                    SHAKING · BURNING ATP!
                  </text>
                </g>
              </svg>
              <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 32, color: C.red, textAlign: "center" }}>
                BATTERY DRAINING FAST ✕
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3: Does Gravity Break Conservation of Energy? (FIX ISSUE #1: Cleanly padded inside circle!) */}
      <SceneFade from={tSoHow - 4} to={tNo - 6} zoom={false}>
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 84, width: 1640 }}>
            <svg width={520} height={520} viewBox="0 0 520 520">
              {/* Soft Inner Glow Ring */}
              <circle cx={260} cy={260} r={218} fill="rgba(255,77,94,0.1)" />
              {/* Slowly Rotating Outer Dashed Warning Ring */}
              <circle
                cx={260}
                cy={260}
                r={218}
                fill="none"
                stroke={C.red}
                strokeWidth={5.5}
                strokeDasharray="20 12"
                transform={`rotate(${frame * 0.35} 260 260)`}
                style={{ filter: svgGlow(C.red, 8) }}
              />
              {/* Inner crisp ring */}
              <circle cx={260} cy={260} r={198} fill="none" stroke="rgba(255,194,77,0.28)" strokeWidth={2} />

              <text x={260} y={202} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={58} style={{ filter: svgGlow(C.gold, 8) }}>
                ΔE = 0
              </text>
              <text x={260} y={260} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={29} letterSpacing={1.5}>
                CONSERVATION
              </text>
              <text x={260} y={296} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={29} letterSpacing={1.5}>
                OF ENERGY
              </text>
              <text x={260} y={356} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={36} style={{ filter: svgGlow(C.red, 6) }}>
                BROKEN?!
              </text>
            </svg>
            <div style={{ width: 1030 }}>
              <Kicker color={C.red}>THE FUNDAMENTAL LAW OF PHYSICS</Kicker>
              <BigText size={72} style={{ marginTop: 16 }}>
                How can gravity pull forever without <span style={{ color: C.gold }}>creating free energy?</span>
              </BigText>
            </div>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 4: Carter Studios 3-Stage Structural Promise */}
      <SceneFade from={tNo - 4} to={cue.len + 30} zoom={false}>
        <Center>
          <div style={{ width: 1680 }}>
            <Kicker style={{ textAlign: "center", marginBottom: 38, fontSize: 30 }}>
              3 STEPS TO SOLVE THE GRAVITY PARADOX
            </Kicker>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
              <Appear at={cue("First, we'll separate")} from="up">
                <Panel style={{ padding: "36px 34px", height: 470, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.cyan}>
                  <div>
                    <Kicker color={C.cyan} style={{ fontSize: 22 }}>01 · FORCE vs. WORK</Kicker>
                    <BigText size={44} style={{ marginTop: 14 }}>Why Pushing Still Costs Zero Energy</BigText>
                  </div>
                  <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 54, color: C.gold, textAlign: "center" }}>
                    W = F × 0 = 0 J
                  </div>
                </Panel>
              </Appear>

              <Appear at={cue("Then, we'll see")} from="up">
                <Panel style={{ padding: "36px 34px", height: 470, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.gold}>
                  <div>
                    <Kicker color={C.gold} style={{ fontSize: 22 }}>02 · COSMIC BANK ACCOUNT</Kicker>
                    <BigText size={44} style={{ marginTop: 14 }}>Why Falling Apples &amp; Orbits Break Even</BigText>
                  </div>
                  <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 44, color: C.cyan, textAlign: "center" }}>
                    PE ⇄ KE (90° ORBIT)
                  </div>
                </Panel>
              </Appear>

              <Appear at={cue("And finally")} from="up">
                <Panel style={{ padding: "36px 34px", height: 470, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.green}>
                  <div>
                    <Kicker color={C.green} style={{ fontSize: 22 }}>03 · EINSTEIN&apos;S TWIST</Kicker>
                    <BigText size={44} style={{ marginTop: 14 }}>Gravity Isn&apos;t Even a Pulling Force</BigText>
                  </div>
                  <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 44, color: C.green, textAlign: "center" }}>
                    CURVED SPACETIME
                  </div>
                </Panel>
              </Appear>
            </div>
          </div>
        </Center>
      </SceneFade>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 1 — WHY YOUR ARM GETS TIRED (3D Arm Zoom into Muscle Fibers vs Wooden Table)
// ===========================================================================
export const GravityCh1: React.FC = () => {
  const cue = makeGravityCue("ch1");

  const tZoom = cue("But look closer");
  const tTwitch = cue("To hold a weight");
  const tHeat = cue("Every single microscopic");
  const tTable = cue("Now put that exact");

  return (
    <AbsoluteFill>
      {/* Beat 1 & 2 (FIX ISSUE #2): Full-Canvas 3D Arm Holding 20kg -> Smooth Bicep Zoom -> Live Sarcomere Filaments + ATP Heat */}
      <SceneFade from={0} to={tTable - 6} zoom={false}>
        <ArmMuscleZoomAnimation zoomAt={tZoom} twitchAt={tTwitch} heatAt={tHeat} />
      </SceneFade>

      {/* Beat 3: The Wooden Table Test (100 Years, 0 Joules) */}
      <SceneFade from={tTable - 4} to={cue.len + 30} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.green}>CLUE #1 · APPLYING A FORCE IS FREE</Kicker>
          <BigText size={54} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            A Wooden Table Holds the <span style={{ color: C.gold }}>Exact Same Box</span> for 100 Years
          </BigText>

          <div style={{ display: "flex", gap: 84, marginTop: 46, alignItems: "center" }}>
            {/* Animated Table + 3D 20kg Box with Balanced Force Arrows */}
            <svg width={740} height={580} viewBox="0 0 740 580">
              {/* Floor */}
              <line x1={60} y1={520} x2={680} y2={520} stroke={C.dim} strokeWidth={4} />
              {/* Wooden Table */}
              <rect x={120} y={320} width={500} height={32} rx={6} fill="rgba(255,194,77,0.24)" stroke={C.gold} strokeWidth={4} />
              <rect x={165} y={352} width={28} height={168} fill="rgba(255,194,77,0.18)" stroke={C.gold} strokeWidth={3} />
              <rect x={547} y={352} width={28} height={168} fill="rgba(255,194,77,0.18)" stroke={C.gold} strokeWidth={3} />
              {/* 3D 20kg Box */}
              <g style={{ filter: svgGlow(C.cyan, 6) }}>
                <polygon points="275,175 445,175 445,320 275,320" fill="rgba(62,224,255,0.18)" stroke={C.cyan} strokeWidth={4} />
                <polygon points="275,175 312,145 482,145 445,175" fill="rgba(62,224,255,0.28)" stroke={C.cyan} strokeWidth={3} />
                <polygon points="445,175 482,145 482,290 445,320" fill="rgba(62,224,255,0.1)" stroke={C.cyan} strokeWidth={3} />
                <text x={360} y={262} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={44}>
                  20 kg
                </text>
              </g>
              {/* Upward Normal Force Arrow */}
              <line x1={370} y1={135} x2={370} y2={48} stroke={C.green} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.green, 6) }} />
              <polygon points="370,26 352,60 388,60" fill={C.green} />
              <text x={402} y={82} fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={24}>
                NORMAL FORCE = 196 N ↑
              </text>
              {/* Downward Gravity Arrow */}
              <line x1={370} y1={356} x2={370} y2={468} stroke={C.gold} strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.gold, 6) }} />
              <polygon points="370,492 352,456 388,456" fill={C.gold} />
              <text x={402} y={445} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
                GRAVITY = 196 N ↓
              </text>
            </svg>

            <ForceVsWorkGauge
              forceText="196 NEWTONS (UPWARD)"
              forceFill={0.78}
              distText="0.00 METERS (NO MOTION)"
              distFill={0}
              workText="0.00 JOULES / CENTURY"
              workFill={0}
              verdict="STATIC FORCE = ZERO ENERGY ✓"
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      <AnimatedChapterCard num={1} title="Why Your Arm Gets Tired" subtitle="BIOLOGY vs. PHYSICS" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 2 — FORCE vs. WORK (W = F·d, Fridge Magnet, Person in Chair -> Falling Apple)
// ===========================================================================
export const GravityCh2: React.FC = () => {
  const cue = makeGravityCue("ch2");
  const frame = useCurrentFrame();

  const tMagnet = cue("Think of a magnet");
  const tChair = cue("The exact same rule");
  const tApple = cue("Wait a second");

  const slideP = prog(frame, cue("moves something"), cue("moves something") + 55);
  const appleFallP = prog(frame, tApple + 12, tApple + 64);

  return (
    <AbsoluteFill>
      {/* Beat 1: W = F * d Formula Live Demo */}
      <SceneFade from={0} to={tMagnet - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.cyan}>THE EQUATION THAT SAVES PHYSICS</Kicker>
          <BigText size={82} color={C.gold} glowColor={C.gold} style={{ marginTop: 12, maxWidth: 1680, textAlign: "center" }}>
            WORK = FORCE × DISTANCE
          </BigText>

          <div style={{ display: "flex", gap: 76, marginTop: 44, alignItems: "center" }}>
            <Panel style={{ width: 820, height: 540, padding: "34px 40px" }} border={C.cyan}>
              <div style={{ fontFamily: MONO, fontSize: 24, color: C.cyan, fontWeight: 800 }}>
                ENERGY TRANSFERS ONLY WHEN SOMETHING MOVES
              </div>
              <svg width={740} height={410} viewBox="0 0 740 410" style={{ marginTop: 20 }}>
                <line x1={40} y1={310} x2={700} y2={310} stroke={C.dim} strokeWidth={4} />
                {/* Distance Ruler */}
                <line x1={120} y1={350} x2={120 + 440 * slideP} y2={350} stroke={C.cyan} strokeWidth={5} />
                <text x={340} y={392} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={26}>
                  DISTANCE d = {(slideP * 5).toFixed(1)} METERS
                </text>
                {/* Sliding Box */}
                <g transform={`translate(${120 + 440 * slideP}, 170)`}>
                  <rect x={0} y={0} width={140} height={140} rx={14} fill="rgba(255,194,77,0.2)" stroke={C.gold} strokeWidth={4} />
                  <text x={70} y={84} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={36}>
                    MASS
                  </text>
                  <line x1={-85} y1={70} x2={-12} y2={70} stroke={C.gold} strokeWidth={7} />
                  <polygon points="-4,70 -26,56 -26,84" fill={C.gold} />
                </g>
              </svg>
            </Panel>

            <ForceVsWorkGauge
              forceText="100 N"
              forceFill={0.6}
              distText={`${(slideP * 5).toFixed(1)} m`}
              distFill={slideP * 0.85}
              workText={`${Math.round(slideP * 500)} JOULES`}
              workFill={slideP * 0.85}
              verdict={slideP > 0.1 ? "MOTION = ENERGY TRANSFERRED" : "NO MOTION = ZERO WORK"}
              verdictColor={slideP > 0.1 ? C.gold : C.green}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 2: Fridge Magnet Holding Against Gravity Forever */}
      <SceneFade from={tMagnet - 4} to={tChair - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
          <Kicker color={C.gold}>REAL-WORLD EXAMPLE · ZERO BATTERY</Kicker>
          <BigText size={58} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            Why a Fridge Magnet Never Runs Out of Power
          </BigText>

          <div style={{ display: "flex", gap: 90, marginTop: 50, alignItems: "center" }}>
            <svg width={620} height={540} viewBox="0 0 620 540">
              {/* Fridge Steel Door */}
              <rect x={80} y={40} width={150} height={460} rx={16} fill="rgba(62,224,255,0.12)" stroke={C.cyan} strokeWidth={4} />
              <text x={155} y={280} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={26} transform="rotate(-90 155 280)">
                STEEL FRIDGE DOOR
              </text>
              {/* Horseshoe Magnet */}
              <path
                d="M235,190 L380,190 Q460,190 460,270 Q460,350 380,350 L235,350"
                fill="none"
                stroke={C.red}
                strokeWidth={44}
                strokeLinecap="butt"
                style={{ filter: svgGlow(C.red, 8) }}
              />
              <rect x={235} y={168} width={54} height={44} fill="#cbd5e1" />
              <rect x={235} y={328} width={54} height={44} fill="#cbd5e1" />
              <text x={262} y={198} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={24}>N</text>
              <text x={262} y={358} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={24}>S</text>
              {/* Magnetic field arcs */}
              <path d="M235,230 Q180,270 235,310" fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="8 6" />
              <text x={375} y={445} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={28}>
                STUCK STILL → d = 0
              </text>
            </svg>

            <ForceVsWorkGauge
              forceText="MAGNETIC PULL > 0 N"
              forceFill={0.82}
              distText="0.00 METERS (STUCK)"
              distFill={0}
              workText="0.00 JOULES (DECADES)"
              workFill={0}
              verdict="FORCE × 0 DISTANCE = 0 ENERGY ✓"
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3A (FIX ISSUE #3): Person Sitting in Chair — Balanced Forces (NO APPLE!) */}
      <SceneFade from={tChair - 4} to={tApple - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
          <Kicker color={C.cyan}>RIGHT NOW · IN YOUR CHAIR</Kicker>
          <BigText size={58} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            Balanced Forces = <span style={{ color: C.green }}>Zero Watts Used</span>
          </BigText>

          <div style={{ display: "flex", gap: 76, marginTop: 44, alignItems: "center" }}>
            <ForceVsWorkGauge
              forceText="YOUR WEIGHT (~700 N)"
              forceFill={0.75}
              distText="0.00 METERS"
              distFill={0}
              workText="0.00 JOULES"
              workFill={0}
              verdict="EARTH SPENDS 0 ENERGY HOLDING YOU ✓"
              verdictColor={C.green}
            />

            <PersonInChairSVG />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3B (FIX ISSUE #3): Apple ONLY Appears When Narration Asks About Letting Go of an Apple! */}
      <SceneFade from={tApple - 4} to={cue.len + 30} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
          <Kicker color={C.gold}>THE NEXT QUESTION · GRAVITY IN MOTION</Kicker>
          <BigText size={56} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            Wait… What When Gravity <span style={{ color: C.gold }}>Does</span> Move an Apple?
          </BigText>

          <div style={{ display: "flex", gap: 76, marginTop: 44, alignItems: "center" }}>
            <ForceVsWorkGauge
              forceText="APPLE WEIGHT (2.0 N)"
              forceFill={0.62}
              distText={`FALLING (${(appleFallP * appleFallP * 4.9).toFixed(1)} m)`}
              distFill={appleFallP * appleFallP * 0.9}
              workText={`WORK > ${(appleFallP * appleFallP * 9.8).toFixed(1)} JOULES!`}
              workFill={appleFallP * appleFallP * 0.9}
              verdict="WHERE DOES THAT ENERGY COME FROM?!"
              verdictColor={C.gold}
            />

            <FallingAppleSVG dropAt={tApple} />
          </div>
        </AbsoluteFill>
      </SceneFade>

      <AnimatedChapterCard num={2} title="Force vs. Work" subtitle="W = F × d" />
    </AbsoluteFill>
  );
};
