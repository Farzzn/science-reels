import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import { PageHeader, PageStage, TransientYearBadge } from "../RelativityBonds/ui";
import {
  AtomicOxygenSpectrumAnim,
  AttosecondPumpProbeAnim,
  DoubleDissociationRaceAnim,
  EuropeanXFEL300AsAnim,
  FlipToAttosecondLensAnim,
  LindaYoungWaterJetAnim,
  SingleBondExpectationAnim,
  SynchrotronFacilitiesAnim,
  TrinterPRLTeamAnim,
} from "./animCh45";
import {
  AttoSubscribeOutroAnim,
  DnaWaterRadiolysisAnim,
  HumanCellWaterStatAnim,
  QuantumDanceSynthesisAnim,
  RadiotherapyChannelsAnim,
  SpaceRadiationPlateAnim,
  TextbookStickToWaveAnim,
} from "./animCh67";
import { makeAttoCue } from "./timing";

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
// CH 4 — NOVEMBER 2026: BOTH BONDS SNAP FIRST! (5 Voice-Locked Pages)
// ===========================================================================
export const AttoCh4: React.FC = () => {
  const cue = makeAttoCue("ch4");
  const end = cue.len + 30;
  const p1 = cue("Led by Florian");
  const p2 = cue("For years, radiation");
  const p3 = cue("Yet when the team");
  const p4 = cue("When the team inspected");

  return (
    <AbsoluteFill>
      {/* Page 4A: Photorealistic European Synchrotrons (PETRA III & MAX IV) */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="EUROPE'S BRIGHTEST X-RAY RINGS" kickerColor={C.cyan}>
            Inside <span style={{ color: C.cyan }}>PETRA III</span> &amp; <span style={{ color: C.gold }}>MAX IV</span>
          </PageHeader>
          <CenterStage top={205}>
            <SynchrotronFacilitiesAnim
              petraAt={Math.max(10, cue("PETRA"))}
              maxAt={Math.max(20, cue("MAX"))}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4B: Dr. Florian Trinter Portrait + Nov 5, 2026 PRL Team */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="PHYSICAL REVIEW LETTERS · NOV 2026" kickerColor={C.gold}>
            The Team That <span style={{ color: C.gold }}>Caught Double Dissociation</span>
          </PageHeader>
          <CenterStage>
            <TrinterPRLTeamAnim
              trinterAt={Math.max(2, cue("Florian Trinter") - p1)}
              prlAt={Math.max(20, cue("Physical Review Letters") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4C: Old Expectation — Only Single H Detaches Leaving OH */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="WHAT CHEMISTS EXPECTED" kickerColor={C.cyan}>
            One Hydrogen Peels Off — <span style={{ color: C.cyan }}>Leaving an OH Fragment</span>
          </PageHeader>
          <CenterStage>
            <SingleBondExpectationAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4D: Explosive Double-Dissociation Race — Both O-H Bonds Snap < 4 fs! */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="THE 4-FEMTOSECOND RACE" kickerColor={C.red}>
            Both Bonds Explode — <span style={{ color: C.red }}>Beating Electronic Relaxation</span>
          </PageHeader>
          <CenterStage>
            <DoubleDissociationRaceAnim
              explodeAt={Math.max(15, cue("both lightweight hydrogen") - p3)}
              winAt={Math.max(30, cue("winning the race") - p3)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4E: Smoking Gun in Electron Detector — Sharp Neutral Atomic Oxygen Spikes! */}
      <PageStage from={p4} to={end}>
        <Sequence from={p4} durationInFrames={Math.max(30, end - p4)}>
          <PageHeader kicker="THE SMOKING GUN SPECTRUM" kickerColor={C.gold}>
            Razor-Sharp <span style={{ color: C.gold }}>Neutral Atomic Oxygen Spikes</span>
          </PageHeader>
          <CenterStage>
            <AtomicOxygenSpectrumAnim spikeAt={Math.max(15, cue("razor-sharp") - p4)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2026" location="PRL · VOL. 137 · NOV 5" at={cue("November twenty twenty-six")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 5 — FREEZING ATOMS WITH ATTOSECOND X-RAYS (4 Voice-Locked Pages)
// ===========================================================================
export const AttoCh5: React.FC = () => {
  const cue = makeAttoCue("ch5");
  const end = cue.len + 30;
  const p1 = cue("In a landmark");
  const p2 = cue("By firing synchronized");
  const p3 = cue("And with the October");

  return (
    <AbsoluteFill>
      {/* Page 5A: Flip the Lens — Stepping Below 1 Femtosecond */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="FLIPPING THE EXPERIMENT" kickerColor={C.cyan}>
            How to Freeze Even <span style={{ color: C.cyan }}>Hydrogen Atoms Still</span>
          </PageHeader>
          <CenterStage>
            <FlipToAttosecondLensAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5B: Prof. Linda Young Portrait + Photorealistic Liquid Water Microjet */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="SLAC LCLS · SCIENCE (2024)" kickerColor={C.cyan}>
            Attosecond X-Rays Inside <span style={{ color: C.gold }}>Liquid Water</span>
          </PageHeader>
          <CenterStage>
            <LindaYoungWaterJetAnim youngAt={Math.max(15, cue("Linda Young") - p1)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5C: Attosecond-Pump / Attosecond-Probe Settling Water's X-Ray Debate */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="SUB-FEMTOSECOND SNAPSHOT" kickerColor={C.gold}>
            Photographing Electrons <span style={{ color: C.green }}>Before Nuclei Budge</span>
          </PageHeader>
          <CenterStage>
            <AttosecondPumpProbeAnim
              probeAt={Math.max(15, cue("second pulse") - p2)}
              debateAt={Math.max(35, cue("settled a decades-old") - p2)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5D: Oct 2026 Optica World Record — 300-Attosecond Hard X-Ray Flashes */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="WORLD RECORD STROBE CAMERA" kickerColor={C.gold}>
            European XFEL: <span style={{ color: C.gold }}>300-Attosecond Hard X-Rays</span>
          </PageHeader>
          <CenterStage top={205}>
            <EuropeanXFEL300AsAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2024" location="SCIENCE · SLAC LCLS" at={cue("twenty twenty-four")} color={C.cyan} />
      <TransientYearBadge year="2026" location="OPTICA · 300 ATTOSECONDS" at={cue("October twenty twenty-six")} color={C.gold} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 6 — WHY THIS MATTERS: RADIOTHERAPY & DEEP SPACE (4 Voice-Locked Pages)
// ===========================================================================
export const AttoCh6: React.FC = () => {
  const cue = makeAttoCue("ch6");
  const end = cue.len + 30;
  const p1 = cue("When ionizing radiation");
  const p2 = cue("Classical radiation-biology");
  const p3 = cue("And the exact same");

  return (
    <AbsoluteFill>
      {/* Page 6A: 60-70% of Every Living Human Cell Is Liquid Water */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="WHY THIS MATTERS TO YOU" kickerColor={C.cyan}>
            Every Living Human Cell Is <span style={{ color: C.cyan }}>60–70% Water</span>
          </PageHeader>
          <CenterStage>
            <HumanCellWaterStatAnim statAt={Math.max(15, cue("sixty to seventy"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6B: Photorealistic DNA & Water Radiolysis */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="INSIDE LIVING TISSUE" kickerColor={C.cyan}>
            Radiation Hits <span style={{ color: C.cyan }}>Cell Water First</span> — Not DNA
          </PageHeader>
          <CenterStage top={205}>
            <DnaWaterRadiolysisAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6C: Classical OH Radicals vs New < 4 fs Neutral Atomic Oxygen Channel */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="CANCER RADIATION THERAPY" kickerColor={C.gold}>
            An Overlooked <span style={{ color: C.gold }}>First-Femtosecond Pathway</span>
          </PageHeader>
          <CenterStage>
            <RadiotherapyChannelsAnim newChannelAt={Math.max(15, cue("Discovering that") - p2)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6D: Photorealistic Deep Space Cosmic Radiation & Astrochemistry */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="SPACE & ASTROCHEMISTRY" kickerColor={C.gold}>
            Protecting Astronauts &amp; <span style={{ color: C.cyan }}>Decoding Cosmic Ice</span>
          </PageHeader>
          <CenterStage top={205}>
            <SpaceRadiationPlateAnim />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 7 — BEYOND FROZEN CHEMISTRY + SUBSCRIBE OUTRO (3 Voice-Locked Pages)
// ===========================================================================
export const AttoCh7: React.FC = () => {
  const cue = makeAttoCue("ch7");
  const end = cue.len + 30;
  const p1 = cue("Electrons race across");
  const p2 = cue("If you enjoy");

  return (
    <AbsoluteFill>
      {/* Page 7A: Quiet V-Shaped Stick Figure -> Exploding Quantum Choreography */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="BEYOND FROZEN DIAGRAMS" kickerColor={C.cyan}>
            From Static Stick Figures to <span style={{ color: C.gold }}>Living Chemistry</span>
          </PageHeader>
          <CenterStage>
            <TextbookStickToWaveAnim explodeAt={Math.max(20, cue("Yet zoom down"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7B: Live Sub-Femtosecond Quantum Dance Synthesis */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="CHEMISTRY IN MOTION" kickerColor={C.gold}>
            Watching Chemical Bonds <span style={{ color: C.cyan }}>Break Live</span>
          </PageHeader>
          <CenterStage>
            <QuantumDanceSynthesisAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7C: Clean Animated Subscribe + Bell Outro */}
      <PageStage from={p2} to={end}>
        <Sequence from={p2} durationInFrames={Math.max(30, end - p2)}>
          <CenterStage top={180}>
            <AttoSubscribeOutroAnim />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};
