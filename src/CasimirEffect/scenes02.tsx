import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneFade } from "../FiveHundredMileEmail/components";
import { C } from "../FiveHundredMileEmail/theme";
import { AnimatedChapterCard, CleanSubscribeToast } from "../GravityEnergy/visuals";
import { makeCasimirCue } from "./timing";
import { PageHeader, TransientYearBadge } from "./ui";
import {
  Ch3GapMultiplierSim,
  Ch3GuitarMirrorModesSim,
  Ch3TwoShipsOceanSim,
  Ch4GoldTransparencySim,
  Ch4IdealVsRealChartSim,
  Ch4InfinityStackSim,
  Ch4OneAtmIdealSim,
  Ch5LamoreauxPendulumSim,
  Ch5ThermalShiftSim,
  Ch5ThermalWarmupSim,
  Ch5TiltAndRoughnessSim,
} from "./animCh345";

// ===========================================================================
// CHAPTER 3 — GUITAR STRINGS BETWEEN TWO MIRRORS (3 Fresh Distinct Pages + Subscribe)
// ===========================================================================
export const CasimirCh3: React.FC = () => {
  const cue = makeCasimirCue("ch3");
  const frame = useCurrentFrame();

  const tOne = cue("one half-wave");
  const tTwo = cue("two half-waves");
  const tThree = cue("three half-waves");
  const tForbid = cue("strictly forbidden");
  const tOut = cue("Outside the plates");
  const tShips = cue("Think of two ships");
  const tFourth = cue("skyrockets as one");
  const tHalf = cue("Cut the gap");
  const tTenth = cue("Shrink it ten");
  const tSub = cue("If this kind of");

  return (
    <AbsoluteFill>
      {/* Page 3A: Mirror Walls Pin Guitar Harmonics One-by-One -> Open Outer Waves */}
      <SceneFade from={0} to={tShips - 6} zoom={false}>
        <PageHeader kicker="SYMMETRY BREAKS" kickerColor={C.cyan}>
          {frame >= tOut ? (
            <>
              Open Space Outside <span style={{ color: C.gold }}>Outnumbers</span> the Gap Inside
            </>
          ) : (
            <>
              Only <span style={{ color: C.cyan }}>Pinned Half-Waves</span> Fit Between Mirrors
            </>
          )}
        </PageHeader>
        <Ch3GuitarMirrorModesSim oneAt={tOne} twoAt={tTwo} threeAt={tThree} forbidAt={tForbid} outsideAt={tOut} />
      </SceneFade>

      {/* Page 3B: Two Ships in Choppy Ocean Swells Wave Tank */}
      <SceneFade from={tShips - 4} to={tFourth - 6} zoom={false}>
        <PageHeader kicker="THE MARITIME ANALOGY" kickerColor={C.gold}>
          Two Ships in Choppy Swells Get <span style={{ color: C.gold }}>Pushed Together</span>
        </PageHeader>
        <Ch3TwoShipsOceanSim startAt={tShips} />
      </SceneFade>

      {/* Page 3C: Clean Visual Gap Shrink Multiplier (1/2 -> 16×, 1/10 -> 10,000×) */}
      <SceneFade from={tFourth - 4} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="SHRINK THE GAP · FORCE EXPLODES" kickerColor={C.red}>
          Cut the Gap in Half — Force Jumps <span style={{ color: C.gold }}>16×</span>
        </PageHeader>
        <Ch3GapMultiplierSim halfAt={tHalf} tenthAt={tTenth} />
        <CleanSubscribeToast at={tSub} dur={155} />
      </SceneFade>

      <AnimatedChapterCard num={3} title="Guitar Strings Between Two Mirrors" subtitle="STANDING WAVES & PRESSURE" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 4 — WHY ISN'T THE FORCE INFINITE? (4 Fresh Single-Focus Pages!)
// ===========================================================================
export const CasimirCh4: React.FC = () => {
  const cue = makeCasimirCue("ch4");

  const tIdeal = cue("idealized nineteen forty-eight");
  const tBreak = cue("not perfect mirrors");
  const t1956 = cue("nineteen fifty-six");
  const tUv = cue("For higher-frequency");
  const tTrans = cue("Real gold turns");
  const tTight = cue("very tight gaps");

  return (
    <AbsoluteFill>
      {/* Transient Year Badges — Appear for 4.5s when spoken, then vanish! */}
      <TransientYearBadge year="1948" location="IDEAL MIRROR LIMIT" at={tIdeal} dur={120} color={C.cyan} />
      <TransientYearBadge year="1956" location="EVGENY LIFSHITZ · REAL METALS" at={t1956} dur={135} color={C.gold} />

      {/* Page 4A: Visual Infinity Stack (∞ - ∞ ?) */}
      <SceneFade from={0} to={tIdeal - 6} zoom={false}>
        <PageHeader kicker="THE GLARING PROBLEM" kickerColor={C.red}>
          Doesn&apos;t Adding Every Frequency Give <span style={{ color: C.red }}>Infinity Minus Infinity?</span>
        </PageHeader>
        <Ch4InfinityStackSim />
      </SceneFade>

      {/* Page 4B: Ideal 1 Atmosphere at 10 nm -> Shatters on "Not Perfect Mirrors!" */}
      <SceneFade from={tIdeal - 4} to={t1956 - 6} zoom={false}>
        <PageHeader kicker="THE TEXTBOOK IDEALIZATION" kickerColor={C.gold} top={62}>
          Ideal Mirrors Predict <span style={{ color: C.gold }}>Over 1 Atmosphere</span> at 10 nm
        </PageHeader>
        <Ch4OneAtmIdealSim breakAt={tBreak} />
      </SceneFade>

      {/* Page 4C: 100% Full-Screen Real Gold Transparency (Zero side graph clutter!) */}
      <SceneFade from={t1956 - 4} to={tTight - 6} zoom={false}>
        <PageHeader kicker="REAL METAL CONDUCTIVITY" kickerColor={C.gold} top={62}>
          Real Gold Turns <span style={{ color: C.cyan }}>Transparent</span> to Ultra-Fast Waves
        </PageHeader>
        <Ch4GoldTransparencySim uvAt={tUv} transAt={tTrans} />
      </SceneFade>

      {/* Page 4D: FRESH FULL-SCREEN PAGE Dedicated Purely to Ideal vs. Real Gold Curve! */}
      <SceneFade from={tTight - 4} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="IDEAL vs. REAL WORLD" kickerColor={C.cyan}>
          At 10 Nanometers, Real Gold Is <span style={{ color: C.cyan }}>Significantly Weaker</span>
        </PageHeader>
        <Ch4IdealVsRealChartSim startAt={tTight} />
      </SceneFade>

      <AnimatedChapterCard num={4} title="Why Isn't the Force Infinite?" subtitle="REAL METALS & TRANSPARENCY" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 5 — HEAT, ROUGHNESS & THE 1997 BREAKTHROUGH (4 Fresh Single-Focus Pages!)
// ===========================================================================
export const CasimirCh5: React.FC = () => {
  const cue = makeCasimirCue("ch5");

  const t300K = cue("around three hundred");
  const tTiny = cue("At tiny separations");
  const tPush = cue("Push the plates");
  const tNightmare = cue("For nearly fifty");
  const tTilt = cue("microscopic tilt");
  const tRough = cue("surface roughness");
  const t1997 = cue("nineteen ninety-seven");
  const tFive = cue("within five percent");
  const tAfm = cue("followed a year later");

  return (
    <AbsoluteFill>
      <TransientYearBadge year="1997" location="STEVE LAMOREAUX · UNIV. OF WASHINGTON" at={t1997} dur={135} color={C.gold} />

      {/* Page 5A: 0 K -> 300 K Room-Temp Thermal Photons */}
      <SceneFade from={0} to={tTiny - 6} zoom={false}>
        <PageHeader kicker="REAL-WORLD TEMPERATURE" kickerColor={C.gold}>
          Real Labs Aren&apos;t Absolute Zero — <span style={{ color: C.gold }}>Heat Photons</span> Buzz Inside
        </PageHeader>
        <Ch5ThermalWarmupSim warmAt={t300K} />
      </SceneFade>

      {/* Page 5B: FRESH PAGE — Close (Quantum) vs. Far (Thermal Photons) */}
      <SceneFade from={tTiny - 4} to={tNightmare - 6} zoom={false}>
        <PageHeader kicker="DISTANCE CHANGES THE PHYSICS" kickerColor={C.cyan}>
          Close Up: <span style={{ color: C.cyan }}>Quantum</span> · Farther Apart: <span style={{ color: C.gold }}>Thermal Heat</span>
        </PageHeader>
        <Ch5ThermalShiftSim pushAt={tPush} />
      </SceneFade>

      {/* Page 5C: FRESH PAGE — Tilt Disaster -> Zoom Into Rough Surface & Stray Sparks */}
      <SceneFade from={tNightmare - 4} to={t1997 - 6} zoom={false}>
        <PageHeader kicker="50 YEARS OF LAB NIGHTMARES" kickerColor={C.red}>
          Why Two Flat Plates Were <span style={{ color: C.red }}>Nearly Impossible</span> to Measure
        </PageHeader>
        <Ch5TiltAndRoughnessSim tiltAt={tTilt} roughAt={tRough} />
      </SceneFade>

      {/* Page 5D: 100% Full-Screen 1997 Sphere-Plate Torsion Pendulum */}
      <SceneFade from={t1997 - 4} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="THE CLEVER GEOMETRY FIX" kickerColor={C.green} top={62}>
          A Curved Gold Sphere <span style={{ color: C.gold }}>Never Tilts Out of Parallel</span>
        </PageHeader>
        <Ch5LamoreauxPendulumSim fivePctAt={tFive} afmAt={tAfm} />
      </SceneFade>

      <AnimatedChapterCard num={5} title="Heat, Roughness & 1997" subtitle="ROOM TEMP & SPHERE-PLATE TEST" />
    </AbsoluteFill>
  );
};
