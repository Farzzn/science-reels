import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import {
  AtomVsChipParallelAnim,
  DiscreteRungsWellAnim,
  HigherRungsFasterTunnelAnim,
  MagneticFieldCheckmateAnim,
  MicrowaveProbeAnim,
  PlateauGraphAnim,
  SkepticPlateauChallengeAnim,
  ThermalVsQuantumTunnelAnim,
  ThreePeaksSpectrumAnim,
} from "./animCh45";
import {
  AnharmonicJosephsonQubitAnim,
  CaldeiraLeggettHoneyAnim,
  FinalChipTakeawayAnim,
  GoldenChandelierFridgeAnim,
  HarmonicLadderLeakAnim,
  PeaksGapClueAnim,
  QuantumProcessorGridAnim,
  QubitLineageAnim,
  SubscribeOutroAnim,
  SymmetricLCBowlAnim,
} from "./animCh67";
import { makeTunnelCue } from "./timing";
import { LikePromptToast, PageHeader, PageStage, TransientYearBadge } from "./ui";

const CenterStage: React.FC<{ top?: number; children: React.ReactNode }> = ({ top = 215, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

// ===========================================================================
// CH 4 — TUNNELING THROUGH THE HILL (4 Fresh Voice-Synced Pages)
// ===========================================================================
export const TunnelCh4: React.FC = () => {
  const cue = makeTunnelCue("ch4");
  const end = cue.len + 30;
  const p1 = cue("On a chart");
  const p2 = cue("Still, a great experimentalist");
  const p3 = cue("In nineteen eighty-five");

  return (
    <AbsoluteFill>
      {/* Page 4A: Thermal Hopping vs. Cold Quantum Tunneling */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="COOLING TOWARD ABSOLUTE ZERO" kickerColor={C.cyan}>
            From Thermal Hopping to <span style={{ color: C.cyan }}>Quantum Tunneling</span>
          </PageHeader>
          <CenterStage>
            <ThermalVsQuantumTunnelAnim coolAt={Math.max(15, cue("Cool the fridge down"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4B: Fresh Full-Screen Data Graph — The 37 mK Plateau */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE BREAKAWAY CURVE" kickerColor={C.gold}>
            Below 30 mK, the Escape Rate Goes <span style={{ color: C.gold }}>Completely Flat</span>
          </PageHeader>
          <CenterStage>
            <PlateauGraphAnim
              plateauAt={Math.max(15, cue("Until thirty millikelvin") - p1)}
              deepSpaceAt={Math.max(40, cue("all the way down to nineteen millikelvin") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4C: The Skeptic's Last Question */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="RULE OUT EVERY DOUBT" kickerColor={C.red}>
            Real Tunneling — or a <span style={{ color: C.red }}>Hidden Noise Floor?</span>
          </PageHeader>
          <CenterStage>
            <SkepticPlateauChallengeAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4D: The Magnetic-Field Checkmate */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="THE CHECKMATE CONTROL TEST" kickerColor={C.green}>
            A Magnetic Field Proves <span style={{ color: C.green }}>No Noise Floor Exists</span>
          </PageHeader>
          <CenterStage>
            <MagneticFieldCheckmateAnim
              magOnAt={Math.max(10, cue("They turned on a gentle magnetic field") - p3)}
              dropAt={Math.max(30, cue("Instantly, the flat plateau vanished") - p3)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1985" location="PRL 55, 1908 · BERKELEY" at={cue("nineteen eighty-five")} color={C.green} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 5 — THE FIRST ARTIFICIAL ATOM (5 Fresh Pages + Mind-Blown LIKE Toast!)
// ===========================================================================
export const TunnelCh5: React.FC = () => {
  const cue = makeTunnelCue("ch5");
  const end = cue.len + 30;
  const p1 = cue("So in a companion");
  const p2 = cue("If the circuit were classical");
  const p3 = cue("Because higher rungs sit closer");
  const p4 = cue("A centimeter-sized electrical circuit");

  return (
    <AbsoluteFill>
      {/* Page 5A: Discrete Quantized Energy Rungs Inside Well */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE SECOND QUANTUM SIGNATURE" kickerColor={C.cyan}>
            Discrete Energy Rungs <span style={{ color: C.gold }}>Inside a Circuit</span>
          </PageHeader>
          <CenterStage>
            <DiscreteRungsWellAnim rungsAt={Math.max(15, cue("Inside an atom"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5B: 2.0 GHz Microwave Spectroscopy */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="PROBING THE LADDER" kickerColor={C.gold}>
            Beaming <span style={{ color: C.gold }}>2.0 GHz Microwaves</span> Into the Trap
          </PageHeader>
          <CenterStage>
            <MicrowaveProbeAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5C: Fresh Full-Screen Spectrum — Classical Smudge → Voice-Synced Three Peaks */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="QUANTIZED SPECTRUM" kickerColor={C.gold}>
            Three Razor-Sharp <span style={{ color: C.gold }}>Quantum Jumps</span>
          </PageHeader>
          <CenterStage>
            <ThreePeaksSpectrumAnim
              clearAt={Math.max(30, cue("Instead, as they slowly swept") - p2)}
              peak1At={Math.max(90, cue("One peak where") - p2)}
              peak2At={Math.max(140, cue("A second peak") - p2)}
              peak3At={Math.max(190, cue("And a third") - p2)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5D: Higher Rungs Face a Paper-Thin Barrier → 1000x Faster Tunneling */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="WHY EACH RUNG LIGHTS UP" kickerColor={C.green}>
            Higher Rungs Face a <span style={{ color: C.green }}>Paper-Thin Barrier</span>
          </PageHeader>
          <CenterStage>
            <HigherRungsFasterTunnelAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5E: Hydrogen Atom vs. Macroscopic Artificial Atom + Mind-Blown LIKE Nudge! */}
      <PageStage from={p4} to={end}>
        <Sequence from={p4} durationInFrames={Math.max(30, end - p4)}>
          <PageHeader kicker="A NEW CLASS OF MATTER" kickerColor={C.cyan}>
            Humanity's First <span style={{ color: C.gold }}>Macroscopic Artificial Atom</span>
          </PageHeader>
          <CenterStage>
            <AtomVsChipParallelAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1985" location="PRL 55, 1543 · 2.0 GHz" at={cue("nineteen eighty-five")} />
      <LikePromptToast at={cue("take a second to hit that like button")} dur={160} label="Mind blown? Hit Like!" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 6 — WHY UNEVEN RUNGS BUILT MODERN QUANTUM COMPUTERS (6 Fresh Pages — ZERO 46s loop!)
// ===========================================================================
export const TunnelCh6: React.FC = () => {
  const cue = makeTunnelCue("ch6");
  const end = cue.len + 30;
  const p1 = cue("Suppose you tried");
  const p2 = cue("Try sending a microwave pulse");
  const p3 = cue("A Josephson junction breaks that symmetry");
  const p4 = cue("Over the next decades");
  const p5 = cue("to the transmon architecture");

  return (
    <AbsoluteFill>
      {/* Page 6A1: Zoom Back Into the Uneven Spacing of the 1985 Peaks */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE HIDDEN CLUE FROM 1985" kickerColor={C.gold}>
            Look Closer at the <span style={{ color: C.gold }}>Gaps Between Those Peaks</span>
          </PageHeader>
          <CenterStage>
            <PeaksGapClueAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6A2: Linear LC Circuit → Perfectly Symmetric Bowl With Equal Gaps */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE LINEAR CIRCUIT TRAP" kickerColor={C.cyan}>
            Ordinary Coils & Capacitors Make a <span style={{ color: C.gold }}>Symmetric Bowl</span>
          </PageHeader>
          <CenterStage>
            <SymmetricLCBowlAnim bowlAt={Math.max(15, cue("its energy valley") - p1)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6A3: One Microwave Pulse Leaks Uncontrollably 0 → 1 → 2 → 3! */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="WHY LINEAR CIRCUITS FAIL" kickerColor={C.red}>
            One Pulse Blasts Straight Up <span style={{ color: C.red }}>the Whole Ladder</span>
          </PageHeader>
          <CenterStage>
            <HarmonicLadderLeakAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6B: Josephson Junction Uneven Rungs (Anharmonicity!) */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="THE JOSEPHSON SUPERPOWER" kickerColor={C.green}>
            Uneven Rungs Unlock a <span style={{ color: C.green }}>Clean 0 / 1 Qubit</span>
          </PageHeader>
          <CenterStage>
            <AnharmonicJosephsonQubitAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6C: Four-Decade Qubit Lineage */}
      <PageStage from={p4} to={p5}>
        <Sequence from={p4} durationInFrames={Math.max(30, p5 - p4)}>
          <PageHeader kicker="FROM BERKELEY TO QUANTUM HARDWARE" kickerColor={C.gold}>
            Every Generation Shares That <span style={{ color: C.gold }}>Same Junction</span>
          </PageHeader>
          <CenterStage>
            <QubitLineageAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6D: Modern Superconducting Transmon Processors */}
      <PageStage from={p5} to={end}>
        <Sequence from={p5} durationInFrames={Math.max(30, end - p5)}>
          <PageHeader kicker="TODAY'S QUANTUM CHIPS" kickerColor={C.cyan}>
            Scaling Artificial Atoms Into <span style={{ color: C.cyan }}>Quantum Processors</span>
          </PageHeader>
          <CenterStage>
            <QuantumProcessorGridAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1999" location="COOPER-PAIR BOX" at={cue("nineteen ninety-nine")} dur={100} />
      <TransientYearBadge year="2007" location="YALE TRANSMON QUBIT" at={cue("two thousand seven")} dur={125} color={C.cyan} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 7 — THE FRAGILE EDGE OF REALITY (3 Physics Pages + Clean SUBSCRIBE Outro!)
// ===========================================================================
export const TunnelCh7: React.FC = () => {
  const cue = makeTunnelCue("ch7");
  const end = cue.len + 30;
  const p1 = cue("That is why the quantum world");
  const p2 = cue("The nineteen eighty-five Berkeley experiment");
  const p3 = cue("If you enjoy deep");

  return (
    <AbsoluteFill>
      {/* Page 7A: Caldeira-Leggett Friction & Dissipation */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE REAL-WORLD ENEMY" kickerColor={C.red}>
            Electrical Friction <span style={{ color: C.red }}>Chokes Off Tunneling</span>
          </PageHeader>
          <CenterStage>
            <CaldeiraLeggettHoneyAnim
              honeyStartAt={cue("connect even a tiny trace")}
              honeyEndAt={cue("chokes off macroscopic tunneling")}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7B: Golden Dilution Refrigerator Chandelier */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="PROTECTING MACROSCOPIC COHERENCE" kickerColor={C.gold}>
            Why Quantum Computers Hang at <span style={{ color: C.cyan }}>15 Millikelvin</span>
          </PageHeader>
          <CenterStage>
            <GoldenChandelierFridgeAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7C: Closing Takeaway — Not a Wall of Nature, Just Noise */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="THE DEEP LESSON" kickerColor={C.gold}>
            Quantum Rules Don't Stop <span style={{ color: C.cyan }}>at the Edge of an Atom</span>
          </PageHeader>
          <CenterStage>
            <FinalChipTakeawayAnim partAt={Math.max(15, cue("The wall separating") - p2)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7D: Clean Animated Subscribe + Bell Outro */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <CenterStage top={180}>
            <SubscribeOutroAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2025" location="NOBEL PRIZE IN PHYSICS" at={cue("twenty twenty-five")} />
    </AbsoluteFill>
  );
};
