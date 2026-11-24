import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import {
  BismuthRuleBreakAnim,
  DiracEquationLegacyAnim,
  EinsteinInAtomAnim,
  HeavySpeedClimbAnim,
  IndirectExpansionDominoAnim,
  LightCarbonSpeedAnim,
  PeriodicTableZoomAnim,
  RelativisticContractionAnim,
  RelativityCosmosAnim,
  ScienceRuleShatterAnim,
  TextbookTripleBondAnim,
} from "./animCh01";
import {
  CyanideTripleBondAnim,
  EverydayRelativityRecapAnim,
  GoldBlueAbsorptionAnim,
  GoldWithoutRelativityAnim,
  Group15SwapBismuthAnim,
  LeadCarBatteryAnim,
  LiquidMercuryRelativityAnim,
  SigmaHeadOnAnim,
  TwoPiSideBySideAnim,
} from "./animCh23";
import { makeRelCue } from "./timing";
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
// CH 0 — COLD OPEN HOOK (4 Voice-Locked Pages — Bismuth Reveals ON Mention!)
// ===========================================================================
export const RelCh0: React.FC = () => {
  const cue = makeRelCue("ch0");
  const end = cue.len + 30;
  const p1 = cue("Yet in twenty twenty-six");
  const p2 = cue("super-heavy bismuth");
  const p3 = cue("And the culprit");

  return (
    <AbsoluteFill>
      {/* Page 0A: Sacred Textbook Triple Bond (1 Sigma + 2 Pi) */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE TEXTBOOK RULE" kickerColor={C.cyan}>
            Every Triple Bond: <span style={{ color: C.cyan }}>1 Sigma</span> + <span style={{ color: C.gold }}>2 Pi</span>
          </PageHeader>
          <CenterStage>
            <TextbookTripleBondAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0B: 2026 Science Study Shatters the Textbook Rule & Ejects Light Atom */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="2026 SCIENCE BREAKTHROUGH" kickerColor={C.gold}>
            A Real Molecule <span style={{ color: C.red }}>Flat-Out Broke That Rule</span>
          </PageHeader>
          <CenterStage>
            <ScienceRuleShatterAnim
              breakAt={Math.max(15, cue("breaking") - p1)}
              swapAt={Math.max(30, cue("replaced") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0C: Photorealistic Bismuth Crystal — Enters RIGHT on "super-heavy bismuth"! */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="ENTER ELEMENT 83" kickerColor={C.gold}>
            Super-Heavy Bismuth <span style={{ color: C.red }}>Collapsed the Boundary</span>
          </PageHeader>
          <CenterStage top={205}>
            <BismuthRuleBreakAnim
              bendAt={Math.max(12, cue("bend") - p2)}
              collapseAt={Math.max(20, cue("collapsed completely") - p2)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0D: Albert Einstein Portrait + Relativistic Atom */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="THE UNEXPECTED CULPRIT" kickerColor={C.gold}>
            Einstein's Relativity <span style={{ color: C.gold }}>Inside a Lab Molecule</span>
          </PageHeader>
          <CenterStage top={215}>
            <EinsteinInAtomAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2026" location="SCIENCE · VOL. 393" at={cue("twenty twenty-six")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 1 — SPEED-OF-LIGHT ELECTRONS INSIDE HEAVY ATOMS (7 Voice-Locked Pages!)
// ===========================================================================
export const RelCh1: React.FC = () => {
  const cue = makeRelCue("ch1");
  const end = cue.len + 30;
  const p1 = cue("Inside a light atom");
  const p2 = cue("Now march down");
  const p3 = cue("That gigantic positive charge");
  const p4 = cue("At sixty percent");
  const p5 = cue("And that triggers");
  const p6 = cue("Back in nineteen twenty-eight");

  return (
    <AbsoluteFill>
      {/* Page 1A: Cosmic Relativity — GPS Satellite, Black Hole & Spaceship! */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="COSMIC SCALE VS. ATOMIC SCALE" kickerColor={C.cyan}>
            Where We Usually See <span style={{ color: C.gold }}>Einstein's Relativity</span>
          </PageHeader>
          <CenterStage>
            <RelativityCosmosAnim
              cosmosAt={Math.max(30, cue("We usually associate"))}
              gpsAt={Math.max(40, cue("GPS satellites"))}
              bhAt={Math.max(50, cue("black holes"))}
              shipAt={Math.max(60, cue("spaceships"))}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1B: Light Carbon Atom (4% c) — Enters RIGHT when Carbon is mentioned! */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="LIGHT ELEMENTS" kickerColor={C.green}>
            Inside Carbon, Electrons Barely Hit <span style={{ color: C.green }}>4% Light Speed</span>
          </PageHeader>
          <CenterStage>
            <LightCarbonSpeedAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1C: Animated Periodic Table Zooming Down into Gold (79) & Bismuth (83)! */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="PERIODIC TABLE DESCENT" kickerColor={C.gold}>
            Zooming Down to <span style={{ color: C.gold }}>Gold (79)</span> &amp; <span style={{ color: C.red }}>Bismuth (83)</span>
          </PageHeader>
          <CenterStage top={212}>
            <PeriodicTableZoomAnim
              goldAt={Math.max(30, cue("seventy-nine") - p2)}
              bismuthAt={Math.max(60, cue("eighty-three") - p2)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1D: Gigantic Positive Charge -> 60% Speed of Light! */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="EXTREME NUCLEAR PULL" kickerColor={C.gold}>
            Heavy Nuclei Whip Electrons to <span style={{ color: C.red }}>60% Light Speed</span>
          </PageHeader>
          <CenterStage>
            <HeavySpeedClimbAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1E: Direct Relativistic Contraction of Inner s Orbitals */}
      <PageStage from={p4} to={p5}>
        <Sequence from={p4} durationInFrames={Math.max(30, p5 - p4)}>
          <PageHeader kicker="DIRECT RELATIVISTIC EFFECT" kickerColor={C.cyan}>
            Heavier Electrons Pull <span style={{ color: C.cyan }}>s Orbitals Tightly Inward</span>
          </PageHeader>
          <CenterStage>
            <RelativisticContractionAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1F: Indirect Domino Effect — Outer d & f Orbitals Puff Outward */}
      <PageStage from={p5} to={p6}>
        <Sequence from={p5} durationInFrames={Math.max(30, p6 - p5)}>
          <PageHeader kicker="THE DOMINO EFFECT" kickerColor={C.gold}>
            Outer d &amp; f Orbitals <span style={{ color: C.gold }}>Puff Outward</span>
          </PageHeader>
          <CenterStage>
            <IndirectExpansionDominoAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1G: Paul Dirac Portrait (1928) */}
      <PageStage from={p6} to={end}>
        <Sequence from={p6} durationInFrames={Math.max(30, end - p6)}>
          <PageHeader kicker="THE MATHEMATICAL BRIDGE" kickerColor={C.cyan}>
            Paul Dirac Fused <span style={{ color: C.cyan }}>Quantum</span> &amp; <span style={{ color: C.gold }}>Relativity</span>
          </PageHeader>
          <CenterStage>
            <DiracEquationLegacyAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1928" location="THE DIRAC EQUATION" at={cue("nineteen twenty-eight")} color={C.cyan} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 2 — EVERYDAY OBJECTS BUILT BY EINSTEIN (+ NATURAL MIND-BLOWN LIKE!)
// ===========================================================================
export const RelCh2: React.FC = () => {
  const cue = makeRelCue("ch2");
  const end = cue.len + 30;
  const p1 = cue("Switch relativity back on");
  const p2 = cue("Move just one proton heavier");
  const p3 = cue("Even wilder");
  const p4 = cue("If learning that relativity");

  return (
    <AbsoluteFill>
      {/* Page 2A: Photorealistic Gold Ingot Turning Silver Without Relativity! */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="EVERYDAY RELATIVITY #1" kickerColor={C.gold}>
            Without Einstein, Gold Would Look <span style={{ color: "#cbd5e1" }}>Like Silver</span>
          </PageHeader>
          <CenterStage top={205}>
            <GoldWithoutRelativityAnim switchOffAt={Math.max(15, cue("If you switch relativity off"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2B: Why Gold Swallows Blue Light & Glows Golden Yellow */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE 2.4 eV COLOR GAP" kickerColor={C.gold}>
            Relativity Makes Gold <span style={{ color: "#6ea8ff" }}>Swallow Blue Light</span>
          </PageHeader>
          <CenterStage top={215}>
            <GoldBlueAbsorptionAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2C: Photorealistic Liquid Mercury (-39°C) */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="EVERYDAY RELATIVITY #2" kickerColor={C.cyan}>
            Why Mercury Flows as a <span style={{ color: C.cyan }}>Liquid Metal</span>
          </PageHeader>
          <CenterStage top={205}>
            <LiquidMercuryRelativityAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2D: Pekka Pyykkö Portrait + 80% Relativistic Car Battery */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="EVERYDAY RELATIVITY #3" kickerColor={C.gold}>
            80% of Your Car Battery Voltage Is <span style={{ color: C.gold }}>Relativity</span>
          </PageHeader>
          <CenterStage top={215}>
            <LeadCarBatteryAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2E: Everyday Recap + Natural Mind-Blown LIKE Bridge! */}
      <PageStage from={p4} to={end}>
        <Sequence from={p4} durationInFrames={Math.max(30, end - p4)}>
          <PageHeader kicker="AND IT GOES EVEN DEEPER" kickerColor={C.cyan}>
            Einstein Shapes <span style={{ color: C.gold }}>Everyday Matter</span>
          </PageHeader>
          <CenterStage top={235}>
            <EverydayRelativityRecapAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2011" location="PEKKA PYYKKÖ · PRL" at={cue("twenty eleven")} />
      <LikePromptToast at={cue("take a second to hit that like button")} dur={160} label="Mind blown? Hit Like!" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 3 — THE SACRED RULE: SIGMA & PI TRIPLE BONDS (4 Voice-Locked Pages)
// ===========================================================================
export const RelCh3: React.FC = () => {
  const cue = makeRelCue("ch3");
  const end = cue.len + 30;
  const p1 = cue("First comes one sigma bond");
  const p2 = cue("Wrapped around that central bridge");
  const p3 = cue("Now look straight down");

  return (
    <AbsoluteFill>
      {/* Page 3A: Cyanide Ion [C≡N]⁻ */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE CLASSIC BLUEPRINT" kickerColor={C.cyan}>
            Inside a Textbook Triple Bond: <span style={{ color: C.gold }}>Cyanide [C≡N]⁻</span>
          </PageHeader>
          <CenterStage>
            <CyanideTripleBondAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3B: 1 Sigma Bond — Direct Head-On Overlap */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="BOND TYPE 1" kickerColor={C.cyan}>
            One <span style={{ color: C.cyan }}>Sigma (σ) Bond</span> Straight Down the Axis
          </PageHeader>
          <CenterStage>
            <SigmaHeadOnAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3C: 2 Pi Bonds — Side-by-Side Clouds */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="BOND TYPE 2" kickerColor={C.gold}>
            Two <span style={{ color: C.gold }}>Pi (π) Bonds</span> Leaning Side-by-Side
          </PageHeader>
          <CenterStage>
            <TwoPiSideBySideAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3D: Group 15 Swap Nitrogen → Heavy Bismuth (CBi⁻) */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="PERIODIC TABLE PREDICTION" kickerColor={C.gold}>
            Swap Nitrogen for <span style={{ color: C.gold }}>Heavy Bismuth (Z = 83)</span>
          </PageHeader>
          <CenterStage>
            <Group15SwapBismuthAnim />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};
