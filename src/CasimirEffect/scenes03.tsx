import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, BigText, Kicker, SceneFade } from "../FiveHundredMileEmail/components";
import { C, glow, INTER } from "../FiveHundredMileEmail/theme";
import { AnimatedChapterCard } from "../GravityEnergy/visuals";
import { makeCasimirCue } from "./timing";
import { PageHeader, TransientYearBadge } from "./ui";
import {
  Ch6ChargeSwitchSim,
  Ch6FreeEnergyMythSim,
  Ch6SpringEnergyLoopSim,
  Ch6TwoLanguagesSim,
  Ch7HarvardLevitationSim,
  Ch7MemsStictionSim,
  Ch7SmartphoneZoomSim,
  Ch8CosmicFinaleSim,
} from "./animCh678";

// ===========================================================================
// CHAPTER 6 — VACUUM PRESSURE OR VAN DER WAALS? (4 Fresh Single-Focus Pages!)
// ===========================================================================
export const CasimirCh6: React.FC = () => {
  const cue = makeCasimirCue("ch6");

  const t2005 = cue("two thousand five");
  const tTurnOff = cue("Turn off the electric");
  const tTwoLang = cue("two completely different");
  const tFieldLang = cue("In the field language");
  const tMatterLang = cue("In the matter language");
  const tSpring = cue("just like gravity");

  return (
    <AbsoluteFill>
      <TransientYearBadge year="2005" location="ROBERT JAFFE · MIT" at={t2005} dur={135} color={C.gold} />

      {/* Page 6A: Free Vacuum Energy Myth Debunked */}
      <SceneFade from={0} to={tTurnOff - 14} zoom={false}>
        <PageHeader kicker="REAL PHYSICS vs. SCI-FI HYPE" kickerColor={C.red} top={62}>
          Can We Harvest <span style={{ color: C.gold }}>Free Energy</span> From Empty Space?
        </PageHeader>
        <Ch6FreeEnergyMythSim stampAt={t2005 - 8} />
      </SceneFade>

      {/* Page 6B: Giant Tactile Electron Charge Switch (ON -> OFF = Force Vanishes!) */}
      <SceneFade from={tTurnOff - 10} to={tTwoLang - 6} zoom={false}>
        <PageHeader kicker="THE DECISIVE TEST" kickerColor={C.gold}>
          Turn Off Electron Charge — <span style={{ color: C.red }}>The Force Disappears</span>
        </PageHeader>
        <Ch6ChargeSwitchSim offAt={tTurnOff} />
      </SceneFade>

      {/* Page 6C: Two Equivalent Languages (Field Pressure = Retarded van der Waals Dipoles) */}
      <SceneFade from={tTwoLang - 4} to={tSpring - 6} zoom={false}>
        <PageHeader kicker="TWO LANGUAGES · EXACT SAME FORCE" kickerColor={C.green}>
          Vacuum Waves <span style={{ color: C.green }}>=</span> <span style={{ color: C.gold }}>Fluctuating Atomic Dipoles</span>
        </PageHeader>
        <Ch6TwoLanguagesSim fieldAt={tFieldLang} matterAt={tMatterLang} />
      </SceneFade>

      {/* Page 6D: FRESH FULL-SCREEN PAGE — Coiled Spring Energy Conservation Loop */}
      <SceneFade from={tSpring - 4} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="CONSERVATIVE FORCE" kickerColor={C.cyan}>
          Just Like a Spring — <span style={{ color: C.gold }}>No Perpetual Motion</span>
        </PageHeader>
        <Ch6SpringEnergyLoopSim />
      </SceneFade>

      <AnimatedChapterCard num={6} title="Vacuum Pressure or van der Waals?" subtitle="TWO LANGUAGES · ONE REALITY" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 7 — STICKING MICROCHIPS & REVERSE LEVITATION (3 Fresh Single-Focus Pages!)
// ===========================================================================
export const CasimirCh7: React.FC = () => {
  const cue = makeCasimirCue("ch7");

  const tPhone = cue("smartphone's accelerometer");
  const tScales = cue("At those scales");
  const tWeld = cue("permanently weld");
  const t2009 = cue("two thousand nine");
  const tFluid = cue("liquid bromobenzene");
  const tRepulse = cue("genuinely repulsive");

  return (
    <AbsoluteFill>
      <TransientYearBadge year="2009" location="FEDERICO CAPASSO · HARVARD" at={t2009} dur={135} color={C.green} />

      {/* Page 7A: FRESH PAGE — Zoom Into Smartphone -> Accelerometer -> MEMS Micro-Switches */}
      <SceneFade from={0} to={tScales - 6} zoom={false}>
        <PageHeader kicker="INSIDE YOUR POCKET" kickerColor={C.cyan}>
          Microscopic Silicon Switches Sit <span style={{ color: C.gold }}>Nanometers Apart</span>
        </PageHeader>
        <Ch7SmartphoneZoomSim zoomAt={tPhone} />
      </SceneFade>

      {/* Page 7B: FRESH PAGE — MEMS Silicon Cantilever Snapping Permanently Shut (Stiction) */}
      <SceneFade from={tScales - 4} to={t2009 - 6} zoom={false}>
        <PageHeader kicker="REAL-WORLD ENGINEERING HEADACHE" kickerColor={C.red}>
          The Casimir Force Can <span style={{ color: C.red }}>Weld Microchips Shut</span>
        </PageHeader>
        <Ch7MemsStictionSim snapAt={tWeld} />
      </SceneFade>

      {/* Page 7C: 100% Full-Screen 2009 Harvard Repulsive Quantum Levitation in Fluid */}
      <SceneFade from={t2009 - 4} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="REVERSE CASIMIR · QUANTUM LEVITATION" kickerColor={C.green} top={62}>
          Inside Bromobenzene, the Force Flips and <span style={{ color: C.green }}>Pushes Upward</span>
        </PageHeader>
        <Ch7HarvardLevitationSim fluidAt={tFluid} levAt={tRepulse} />
      </SceneFade>

      <AnimatedChapterCard num={7} title="Sticking Microchips & Levitation" subtitle="MEMS STICTION & QUANTUM PUSH" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 8 — THE RULES OF EMPTY SPACE (Fresh Cosmic Field Finale + Subscribe CTA)
// ===========================================================================
export const CasimirCh8: React.FC = () => {
  const cue = makeCasimirCue("ch8");
  const frame = useCurrentFrame();

  const tSub = cue("hit subscribe");
  const press = interpolate(frame, [tSub + 10, tSub + 15, tSub + 22], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subbed = frame > tSub + 15;

  return (
    <AbsoluteFill>
      <SceneFade from={0} to={cue.len + 40} zoom={false}>
        <Ch8CosmicFinaleSim />

        <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
          <Kicker color={C.cyan} style={{ fontSize: 28 }}>
            THE RULES OF EMPTY SPACE
          </Kicker>
          <BigText size={64} style={{ marginTop: 16, maxWidth: 1620, textAlign: "center" }}>
            Empty Space Isn&apos;t Empty —
            <br />
            It&apos;s a <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>Living Quantum Field</span>
          </BigText>

          <Appear at={cue("If you enjoy")} style={{ marginTop: 420 }}>
            <div
              style={{
                display: "inline-block",
                padding: "24px 72px",
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

      <AnimatedChapterCard num={8} title="The Rules of Empty Space" />
    </AbsoluteFill>
  );
};
