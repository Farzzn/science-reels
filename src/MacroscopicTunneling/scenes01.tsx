import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import {
  BallVsWaveAnim,
  ChaoticAtomsAnim,
  CooperPairCondenseAnim,
  CrowdToDancerAnim,
  MicroBoundaryShatterAnim,
  MicroVsMacroSplitAnim,
  PalmChipAnim,
  SynchronizedWaveAnim,
  ZeroToVoltageSnapAnim,
} from "./animCh01";
import {
  BerkeleyTrioFilterIntroAnim,
  CopperPowderFilterAnim,
  FakeKickOverHillAnim,
  FlatWashboardAnim,
  IbmEarlyHintsAnim,
  JunctionAnatomyAnim,
  SharedPhaseAcrossGapAnim,
  TiltingWashboardAnim,
  TrappedVsTumblingAnim,
  WarmWireRadiatorAnim,
  ZeroFudgeCalibrationAnim,
} from "./animCh23";
import { makeTunnelCue } from "./timing";
import { PageHeader, PageStage, TransientYearBadge } from "./ui";

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
// CH 0 — COLD OPEN HOOK (4 Voice-Locked Pages — Hand Chip enters EXACTLY when spoken!)
// ===========================================================================
export const TunnelCh0: React.FC = () => {
  const cue = makeTunnelCue("ch0");
  const end = cue.len + 30;
  const p1 = cue("For decades");
  const p2 = cue("Using a superconducting");
  const p3 = cue("sitting calmly");

  return (
    <AbsoluteFill>
      {/* Page 0A: Tennis Ball vs Subatomic Wave */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE QUANTUM RULEBREAKER" kickerColor={C.cyan}>
            Solid Walls Don't Stop <span style={{ color: C.gold }}>Subatomic Waves</span>
          </PageHeader>
          <CenterStage>
            <BallVsWaveAnim quantumAt={cue("In the subatomic world")} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0B1: Microscopic-Only Assumption → Shattered Boundary (2025!) */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="SHATTERING THE BOUNDARY" kickerColor={C.gold}>
            Not Just <span style={{ color: C.cyan }}>Invisible Single Atoms</span>
          </PageHeader>
          <CenterStage>
            <MicroBoundaryShatterAnim shatterAt={Math.max(15, cue("shattered that boundary") - p1)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0B2: Photorealistic AI Hand Holding ~1 cm Chip — EXACTLY on voice cue! */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="HUMAN-SCALE QUANTUM CIRCUIT" kickerColor={C.cyan}>
            A Chip Big Enough to <span style={{ color: C.gold }}>Hold in Your Palm</span>
          </PageHeader>
          <CenterStage top={205}>
            <PalmChipAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0C: Zero Voltage → Sudden Voltage Snap */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="THE IMPOSSIBLE SWITCH" kickerColor={C.gold}>
            Zero Voltage Suddenly <span style={{ color: C.gold }}>Snaps Alive</span>
          </PageHeader>
          <CenterStage>
            <ZeroToVoltageSnapAnim snapAt={Math.max(12, cue("suddenly tunnel") - p3)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2025" location="NOBEL PRIZE IN PHYSICS" at={cue("twenty twenty-five")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 1 — BILLIONS MOVING AS ONE (5 Fresh Pages)
// ===========================================================================
export const TunnelCh1: React.FC = () => {
  const cue = makeTunnelCue("ch1");
  const end = cue.len + 30;
  const p1 = cue("To see quantum behavior at human scale");
  const p2 = cue("That is what happens inside a superconductor");
  const p3 = cue("And here is the magic");
  const p4 = cue("Now, back in nineteen sixty-two");

  return (
    <AbsoluteFill>
      {/* Page 1A1: Chaotic Atoms Cancel Out */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="WHY TENNIS BALLS NEVER TUNNEL" kickerColor={C.red}>
            Trillions of Atoms <span style={{ color: C.red }}>Scramble Each Other</span>
          </PageHeader>
          <CenterStage>
            <ChaoticAtomsAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1A2: Chaotic Crowd Snapping Into One Synchronized Dancer */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE REQUIREMENT" kickerColor={C.gold}>
            Billions Moving as <span style={{ color: C.gold }}>One Synchronized Dancer</span>
          </PageHeader>
          <CenterStage>
            <CrowdToDancerAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1B: Superconductor Cooling → Cooper Pairs */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="NEAR ABSOLUTE ZERO" kickerColor={C.cyan}>
            Electrons Lock Into <span style={{ color: C.cyan }}>Cooper Pairs</span>
          </PageHeader>
          <CenterStage>
            <CooperPairCondenseAnim pairAt={Math.max(12, cue("Cool a metal like niobium") - p2)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1C: Billions Lock Into One Synchronized Wave */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="COLLECTIVE COHERENCE" kickerColor={C.gold}>
            Billions of Pairs Marching as <span style={{ color: C.gold }}>One Wave</span>
          </PageHeader>
          <CenterStage>
            <SynchronizedWaveAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1D: 1962 Microscopic Josephson vs 1980 Leggett Macroscopic Challenge */}
      <PageStage from={p4} to={end}>
        <Sequence from={p4} durationInFrames={Math.max(30, end - p4)}>
          <PageHeader kicker="MICROSCOPIC VS. MACROSCOPIC" kickerColor={C.cyan}>
            One Pair Hopping — or the <span style={{ color: C.gold }}>Entire Circuit?</span>
          </PageHeader>
          <CenterStage>
            <MicroVsMacroSplitAnim macroAt={Math.max(15, cue("In nineteen eighty") - p4)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1962" location="BRIAN JOSEPHSON" at={cue("nineteen sixty-two")} />
      <TransientYearBadge year="1980" location="ANTHONY LEGGETT" at={cue("nineteen eighty")} color={C.cyan} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 2 — THE TILTED WASHBOARD (5 Voice-Synced Pages — Washboard enters RIGHT at "imagine a marble"!)
// ===========================================================================
export const TunnelCh2: React.FC = () => {
  const cue = makeTunnelCue("ch2");
  const end = cue.len + 30;
  const p1 = cue("Inside that junction");
  const p2 = cue("And here is the clearest way");
  const p3 = cue("Now slowly dial up");
  const p4 = cue("As long as the marble stays trapped");

  return (
    <AbsoluteFill>
      {/* Page 2A1: Josephson Junction Cross-Strip Anatomy */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE HARDWARE TRAP" kickerColor={C.gold}>
            Inside a <span style={{ color: C.cyan }}>Josephson Junction</span>
          </PageHeader>
          <CenterStage>
            <JunctionAnatomyAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2A2: Shared Phase Difference Across the Oxide Gap */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="ONE COLLECTIVE PROPERTY" kickerColor={C.gold}>
            The <span style={{ color: C.gold }}>Phase Difference</span> Across the Gap
          </PageHeader>
          <CenterStage>
            <SharedPhaseAcrossGapAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2B: Flat Washboard Landscape — starts RIGHT when narrator introduces the marble & washboard! */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="THE PHASE LANDSCAPE" kickerColor={C.cyan}>
            Picture the Circuit as a <span style={{ color: C.gold }}>Marble on a Washboard</span>
          </PageHeader>
          <CenterStage>
            <FlatWashboardAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2C: Dialing Current Up Tilts the Washboard */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="CONTROLLING THE BARRIER" kickerColor={C.gold}>
            Electric Current <span style={{ color: C.gold }}>Tilts the Entire Washboard</span>
          </PageHeader>
          <CenterStage>
            <TiltingWashboardAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2D: Trapped = 0 V → Tumbling Down = Voltage Spike */}
      <PageStage from={p4} to={end}>
        <Sequence from={p4} durationInFrames={Math.max(30, end - p4)}>
          <PageHeader kicker="THE DETECTION SIGNAL" kickerColor={C.cyan}>
            Trapped Means <span style={{ color: C.cyan }}>Zero Volts</span> — Escaping Means a <span style={{ color: C.gold }}>Spike</span>
          </PageHeader>
          <CenterStage>
            <TrappedVsTumblingAnim escapeAt={Math.max(15, cue("But the exact microsecond") - p4)} />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 3 — THE SABOTEUR IN THE WIRES (6 Fresh Pages — ZERO 40s loop!)
// ===========================================================================
export const TunnelCh3: React.FC = () => {
  const cue = makeTunnelCue("ch3");
  const end = cue.len + 30;
  const p1 = cue("Your chip might be sitting");
  const p2 = cue("Those stray ripples");
  const p3 = cue("In nineteen eighty-four");
  const p4 = cue("Smooth direct current");
  const p5 = cue("Second, before cooling");

  return (
    <AbsoluteFill>
      {/* Page 3A1: 1981 IBM Hints + Skeptics' Brutal Objection */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="EARLY HINTS & DOUBT" kickerColor={C.red}>
            Why Nobody Believed the <span style={{ color: C.red }}>1981 Results Yet</span>
          </PageHeader>
          <CenterStage>
            <IbmEarlyHintsAnim objectionAt={Math.max(15, cue("But skeptics had"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3A2: 300 K Room Wires Radiating Microwaves Down */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE HIDDEN ANTENNA" kickerColor={C.red}>
            Warm Cables Radiate <span style={{ color: C.red }}>300 K Microwaves</span>
          </PageHeader>
          <CenterStage>
            <WarmWireRadiatorAnim radiateAt={Math.max(12, cue("Every warm wire radiates") - p1)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3A3: Stray Pulse Kicks Marble OVER Top (Fake Tunneling!) */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="CLASSICAL IMPOSTOR" kickerColor={C.red}>
            Noise Kicks the Marble <span style={{ color: C.red }}>Over the Top</span>
          </PageHeader>
          <CenterStage>
            <FakeKickOverHillAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3B: Berkeley Trio + Copper Powder Shield */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="UC BERKELEY" kickerColor={C.gold}>
            Eliminating Every <span style={{ color: C.gold }}>Possible Excuse</span>
          </PageHeader>
          <CenterStage>
            <BerkeleyTrioFilterIntroAnim filterAt={Math.max(15, cue("tiny tubes packed solid") - p3)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3C: Inside the Copper-Powder Microwave Filter */}
      <PageStage from={p4} to={p5}>
        <Sequence from={p4} durationInFrames={Math.max(30, p5 - p4)}>
          <PageHeader kicker="THE MICROWAVE BLACK HOLE" kickerColor={C.cyan}>
            DC Glides Through — <span style={{ color: C.red }}>Noise Dies in Copper Powder</span>
          </PageHeader>
          <CenterStage>
            <CopperPowderFilterAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3D: Zero Free Parameters Calibration */}
      <PageStage from={p5} to={end}>
        <Sequence from={p5} durationInFrames={Math.max(30, end - p5)}>
          <PageHeader kicker="RIGOROUS CALIBRATION" kickerColor={C.green}>
            Every Property Locked <span style={{ color: C.green }}>Before Cooling Down</span>
          </PageHeader>
          <CenterStage>
            <ZeroFudgeCalibrationAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1981" location="IBM EARLY HINTS" at={cue("nineteen eighty-one")} color={C.red} />
      <TransientYearBadge year="1984" location="UC BERKELEY LAB" at={cue("nineteen eighty-four")} />
    </AbsoluteFill>
  );
};
