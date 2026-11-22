import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, Kicker, Panel, SceneFade } from "../FiveHundredMileEmail/components";
import { C } from "../FiveHundredMileEmail/theme";
import { AnimatedChapterCard } from "../GravityEnergy/visuals";
import { makeCasimirCue } from "./timing";
import { PageHeader, TransientYearBadge } from "./ui";
import {
  Ch2EmptyStageAndOceanSim,
  Ch2GuitarStringZeroPointSim,
  Ch2HeisenbergClampSim,
  Ch2SinglePlateBalanceSim,
  Ch2SuperimposedSpectrumSim,
  PaintColloidToVacuumSim,
  PlatesInDarknessSim,
  VacuumChamberEvacSim,
} from "./animCh012";

// ===========================================================================
// CHAPTER 0 — COLD OPEN (Evacuation -> 3D Mirrors in Darkness + Hair Scale + Slam -> Roadmap)
// ===========================================================================
export const CasimirCh0: React.FC = () => {
  const cue = makeCasimirCue("ch0");
  const frame = useCurrentFrame();

  const tChill = cue("chill it down");
  const tShield = cue("shield it from");
  const tPlates = cue("Inside that perfect");
  const tHair = cue("width of a human hair");
  const tNoElec = cue("no electricity");
  const tGrav = cue("Gravity between");
  const tSlam = cue("Yet the moment");
  const tRoadmap = cue("It's called the Casimir");

  return (
    <AbsoluteFill>
      {/* Beat 1: Evacuate Air -> -273°C -> Faraday Shield */}
      <SceneFade from={0} to={tPlates - 6} zoom={false}>
        <PageHeader kicker="THE IMPOSSIBLE EXPERIMENT" kickerColor={C.cyan}>
          Strip Away Air, Heat &amp; Light — Leave <span style={{ color: C.gold }}>Pure Nothing</span>
        </PageHeader>
        <VacuumChamberEvacSim chillAt={tChill} shieldAt={tShield} />
      </SceneFade>

      {/* Beat 2: Two Uncharged 3D Mirrors in Pitch Darkness + Human Hair Scale + Dramatic Slam! */}
      <SceneFade from={tPlates - 4} to={tRoadmap - 6} zoom={false}>
        <PageHeader kicker="100 NANOMETERS APART · PURE DARKNESS" kickerColor={C.gold}>
          {frame >= tSlam ? (
            <>
              Let Go — and They <span style={{ color: C.red }}>Slam Together</span>
            </>
          ) : (
            <>
              Two Uncharged Metal Mirrors in <span style={{ color: C.cyan }}>Empty Space</span>
            </>
          )}
        </PageHeader>
        <PlatesInDarknessSim hairAt={tHair} noElecAt={tNoElec} gravAt={tGrav} slamAt={tSlam} />
      </SceneFade>

      {/* Beat 3: Clean Visual 3-Step Roadmap (Zero intimidating equations!) */}
      <SceneFade from={tRoadmap - 4} to={cue.len + 30} zoom={false}>
        <Center>
          <div style={{ width: 1680 }}>
            <Kicker style={{ textAlign: "center", marginBottom: 14, fontSize: 28 }}>
              THE CASIMIR EFFECT · 3 LAYERS
            </Kicker>
            <BigText size={56} style={{ textAlign: "center", marginBottom: 44 }}>
              What Is Pushing Inside <span style={{ color: C.gold }}>&ldquo;Nothing&rdquo;?</span>
            </BigText>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
              <Appear at={cue("first, why empty")} from="up">
                <Panel style={{ padding: "38px 36px", height: 390, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.cyan}>
                  <Kicker color={C.cyan} style={{ fontSize: 22 }}>LAYER 01</Kicker>
                  <BigText size={44}>Why Empty Space Is Never Quiet</BigText>
                  <div style={{ height: 6, width: "100%", borderRadius: 4, background: C.cyan }} />
                </Panel>
              </Appear>

              <Appear at={cue("second, why the")} from="up">
                <Panel style={{ padding: "38px 36px", height: 390, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.gold}>
                  <Kicker color={C.gold} style={{ fontSize: 22 }}>LAYER 02</Kicker>
                  <BigText size={44}>How Real Metals Break the Ideal Formula</BigText>
                  <div style={{ height: 6, width: "100%", borderRadius: 4, background: C.gold }} />
                </Panel>
              </Appear>

              <Appear at={cue("and finally, the twist")} from="up">
                <Panel style={{ padding: "38px 36px", height: 390, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.green}>
                  <Kicker color={C.green} style={{ fontSize: 22 }}>LAYER 03</Kicker>
                  <BigText size={44}>The Force That Breaks Microchips</BigText>
                  <div style={{ height: 6, width: "100%", borderRadius: 4, background: C.green }} />
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
// CHAPTER 1 — THE 1948 PAINT-LAB ACCIDENT (Transient YearBadge + Paint -> Vacuum)
// ===========================================================================
export const CasimirCh1: React.FC = () => {
  const cue = makeCasimirCue("ch1");
  const frame = useCurrentFrame();

  const t1948 = cue("nineteen forty-eight");
  const tQuartz = cue("microscopic quartz");
  const tBohr = cue("mentioned the puzzle");
  const tStrip = cue("stripped away the liquid");

  return (
    <AbsoluteFill>
      {/* Year appears for 4.5 seconds when spoken, then disappears cleanly! */}
      <TransientYearBadge year="1948" location="HENDRIK CASIMIR · PHILIPS LABS" at={t1948} dur={135} color={C.gold} />

      <SceneFade from={0} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="FROM PAINT TO PURE VACUUM" kickerColor={C.gold} top={64}>
          {frame >= tStrip ? (
            <>
              Strip Away the Liquid — <span style={{ color: C.cyan }}>Empty Space Still Pulls</span>
            </>
          ) : (
            <>
              It Started With <span style={{ color: C.gold }}>Industrial Paint</span>
            </>
          )}
        </PageHeader>
        <PaintColloidToVacuumSim quartzAt={tQuartz} bohrAt={tBohr} stripAt={tStrip} />
      </SceneFade>

      <AnimatedChapterCard num={1} title="The 1948 Paint-Lab Accident" subtitle="PHILIPS LABS · NETHERLANDS" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 2 — WHY EMPTY SPACE IS NEVER QUIET (5 Fresh Distinct Pages — ZERO Loops!)
// ===========================================================================
export const CasimirCh2: React.FC = () => {
  const cue = makeCasimirCue("ch2");
  const frame = useCurrentFrame();

  const tField = cue("filled with an invisible");
  const tRipple = cue("light is a ripple");
  const tTurnOff = cue("turn the field completely");
  const tHeis = cue("Heisenberg's uncertainty");
  const tGuitar = cue("Just like a guitar string");
  const tZeroPt = cue("zero-point energy");
  const tShort = cue("short wavelengths");
  const tMed = cue("medium wavelengths");
  const tLong = cue("long wavelengths");
  const tMerge = cue("superimposed at every");
  const tSingle = cue("hold up a single");

  return (
    <AbsoluteFill>
      {/* Page 2A: Classical Empty Stage -> Living 3D Ocean Field -> Light Is a Ripple! */}
      <SceneFade from={0} to={tTurnOff - 6} zoom={false}>
        <PageHeader kicker={frame >= tField ? "QUANTUM ELECTRODYNAMICS" : "FORGET THE OLD PICTURE"} kickerColor={C.cyan}>
          {frame >= tRipple ? (
            <>
              Light Isn&apos;t an Object — It&apos;s a <span style={{ color: C.gold }}>Ripple in the Field</span>
            </>
          ) : frame >= tField ? (
            <>
              Space Is Filled With an <span style={{ color: C.cyan }}>Invisible Ocean</span>
            </>
          ) : (
            <>
              Empty Space Is <span style={{ color: C.red }}>Not</span> a Dead, Silent Stage
            </>
          )}
        </PageHeader>
        <Ch2EmptyStageAndOceanSim fieldAt={tField} rippleAt={tRipple} />
      </SceneFade>

      {/* Page 2B: Hydraulic Clamps Trying to Turn Field Off -> Heisenberg Snaps Back! */}
      <SceneFade from={tTurnOff - 4} to={tGuitar - 6} zoom={false}>
        <PageHeader kicker="TRY TURNING THE FIELD OFF" kickerColor={C.red}>
          {frame >= tHeis ? (
            <>
              Heisenberg Forbids a <span style={{ color: C.red }}>Perfectly Still Zero</span>
            </>
          ) : (
            <>
              Can We Flatten the Field to <span style={{ color: C.cyan }}>Absolute Zero?</span>
            </>
          )}
        </PageHeader>
        <Ch2HeisenbergClampSim heisAt={tHeis} />
      </SceneFade>

      {/* Page 2C: Glowing Guitar String Unable to Freeze Dead Still -> Zero-Point Jitter */}
      <SceneFade from={tGuitar - 4} to={tShort - 18} zoom={false}>
        <PageHeader kicker="THE GUITAR STRING INTUITION" kickerColor={C.gold}>
          Every Frequency Keeps an Irreducible <span style={{ color: C.gold }}>Zero-Point Jitter</span>
        </PageHeader>
        <Ch2GuitarStringZeroPointSim zeroPtAt={tZeroPt} />
      </SceneFade>

      {/* Page 2D: Short -> Medium -> Long Waves Arriving & Superimposing Everywhere! */}
      <SceneFade from={tShort - 14} to={tSingle - 6} zoom={false}>
        <PageHeader kicker="CEASELESS QUANTUM HUM" kickerColor={C.cyan}>
          Every Wavelength <span style={{ color: C.gold }}>Humming Together</span> in Empty Space
        </PageHeader>
        <Ch2SuperimposedSpectrumSim shortAt={tShort} medAt={tMed} longAt={tLong} mergeAt={tMerge} />
      </SceneFade>

      {/* Page 2E: Bespoke Single 3D Plate Floating in Perfect Equilibrium */}
      <SceneFade from={tSingle - 4} to={cue.len + 30} zoom={false}>
        <PageHeader kicker="WHY YOU NEVER FEEL IT" kickerColor={C.green}>
          One Plate Alone: Equal Push Cancels to <span style={{ color: C.green }}>Exact Zero</span>
        </PageHeader>
        <Ch2SinglePlateBalanceSim />
      </SceneFade>

      <AnimatedChapterCard num={2} title="Why Empty Space Is Never Quiet" subtitle="FIELDS & ZERO-POINT JITTER" />
    </AbsoluteFill>
  );
};
