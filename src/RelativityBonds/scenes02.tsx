import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import {
  CryoIonTrapLabAnim,
  ElectronBarMagnetAnim,
  ElectronFrameMagnetAnim,
  PhotoelectronLaserAnim,
  ResearchTeam2026Anim,
  SchrodingerVsDiracSpectrumAnim,
  SigmaPiWobblePreviewAnim,
  SpinOrbitScalingAnim,
  TheoristsSuspectedAnim,
  TripleBondCollapseAnim,
} from "./animCh45";
import {
  HeavyChemistryImpactAnim,
  HeavyFrontierGlowAnim,
  KeepTextbookAnim,
  LightElementsSafeAnim,
  MiniatureRelativityLabAnim,
  NewBondingLanguageAnim,
  SubscribeOutroAnim,
  UnitySynthesisAnim,
} from "./animCh67";
import { makeRelCue } from "./timing";
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
// CH 4 — THE RELATIVISTIC WILDCARD: SPIN-ORBIT COUPLING (4 Voice-Locked Pages)
// ===========================================================================
export const RelCh4: React.FC = () => {
  const cue = makeRelCue("ch4");
  const end = cue.len + 30;
  const p1 = cue("Now pull an Einstein trick");
  const p2 = cue("Inside light carbon");
  const p3 = cue("The electron's spin locks");

  return (
    <AbsoluteFill>
      {/* Page 4A: Electron Spin — Microscopic Bar Magnet */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="BISMUTH'S SECOND SUPERPOWER" kickerColor={C.cyan}>
            Spin–Orbit Coupling: The <span style={{ color: C.red }}>Spinning Electron Magnet</span>
          </PageHeader>
          <CenterStage>
            <ElectronBarMagnetAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4B: Electron's Reference Frame → Giant Internal Magnetic Field */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="EINSTEIN'S REFERENCE FRAME" kickerColor={C.green}>
            An Orbiting +83 Nucleus Creates a <span style={{ color: C.green }}>Giant Magnetic Field</span>
          </PageHeader>
          <CenterStage>
            <ElectronFrameMagnetAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4C: Spin-Orbit Coupling Explodes From Carbon to Bismuth */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="SCALING WITH NUCLEAR CHARGE" kickerColor={C.red}>
            Tiny in Carbon — <span style={{ color: C.red }}>Explosive in Bismuth</span>
          </PageHeader>
          <CenterStage>
            <SpinOrbitScalingAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 4D: Pure Sigma & Pi Labels Start to Dissolve */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="SYMMETRY BREAKDOWN" kickerColor={C.gold}>
            When Spin & Orbit Lock, <span style={{ color: C.gold }}>Pure Labels Dissolve</span>
          </PageHeader>
          <CenterStage>
            <SigmaPiWobblePreviewAnim />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 5 — CATCHING THE COLLAPSE IN THE LAB (6 Voice-Locked Pages + Exact Portraits!)
// ===========================================================================
export const RelCh5: React.FC = () => {
  const cue = makeRelCue("ch5");
  const end = cue.len + 30;
  const p1 = cue("In twenty twenty-six");
  const p2 = cue("Inside their lab");
  const p3 = cue("Next, they fired");
  const p4 = cue("When Kirk Peterson compared");
  const p5 = cue("The verdict was unmistakable");

  return (
    <AbsoluteFill>
      {/* Page 5A: Theorists Suspected Breakdown — Brutally Hard to Catch in Lab */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE EXPERIMENTAL CHALLENGE" kickerColor={C.cyan}>
            Suspected for Years — <span style={{ color: C.red }}>Brutally Hard to Catch</span>
          </PageHeader>
          <CenterStage>
            <TheoristsSuspectedAnim hardAt={Math.max(15, cue("brutally hard"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5B: Prof. Lai-Sheng Wang, PhD Team & Prof. Kirk Peterson — Reveal ON Mention! */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="BROWN UNIVERSITY & WSU" kickerColor={C.gold}>
            The Team That <span style={{ color: C.gold }}>Caught Relativity Red-Handed</span>
          </PageHeader>
          <CenterStage top={215}>
            <ResearchTeam2026Anim
              wangAt={Math.max(10, cue("Professor") - p1)}
              phdAt={Math.max(20, cue("Deniz") - p1)}
              petersonAt={Math.max(30, cue("Kirk Peterson") - p1)}
              scienceAt={Math.max(40, cue("finally captured") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5C: Photorealistic Cryogenic Laser Trap Making CBi⁻ Ions */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="FREEZING OUT THERMAL NOISE" kickerColor={C.cyan}>
            Forging & Trapping <span style={{ color: C.gold }}>CBi⁻ Near Absolute Zero</span>
          </PageHeader>
          <CenterStage top={205}>
            <CryoIonTrapLabAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5D: Cryogenic Photoelectron Spectroscopy */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="X-RAY FINGERPRINT OF A BOND" kickerColor={C.cyan}>
            Knocking Bonding Electrons Out <span style={{ color: "#d099ff" }}>With a Probe Laser</span>
          </PageHeader>
          <CenterStage>
            <PhotoelectronLaserAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5E: Non-Relativistic Misses ✕ vs. 4-Component Dirac Matches ✓ */}
      <PageStage from={p4} to={p5}>
        <Sequence from={p4} durationInFrames={Math.max(30, p5 - p4)}>
          <PageHeader kicker="THEORY FACE-OFF" kickerColor={C.gold}>
            Classical Theory Failed — <span style={{ color: C.green }}>Dirac Relativity Nailed It</span>
          </PageHeader>
          <CenterStage>
            <SchrodingerVsDiracSpectrumAnim diracAt={Math.max(15, cue("Only full four-component") - p4)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 5F: The Relativistic Collapse of the Classical Triple Bond! */}
      <PageStage from={p5} to={end}>
        <Sequence from={p5} durationInFrames={Math.max(30, end - p5)}>
          <PageHeader kicker="THE 2026 VERDICT" kickerColor={C.gold}>
            The Classical Triple Bond <span style={{ color: C.red }}>Collapses Into Hybrids</span>
          </PageHeader>
          <CenterStage>
            <TripleBondCollapseAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2026" location="SCIENCE · BROWN & WSU" at={cue("twenty twenty-six")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 6 — WHAT TEXTBOOKS STILL GET RIGHT & WHY IT MATTERS (5 Voice-Locked Pages!)
// ===========================================================================
export const RelCh6: React.FC = () => {
  const cue = makeRelCue("ch6");
  const end = cue.len + 30;
  const p1 = cue("For the light elements");
  const p2 = cue("Relativity quietly waits");
  const p3 = cue("And that isn't just");
  const p4 = cue("By directly measuring");

  return (
    <AbsoluteFill>
      {/* Page 6A: Don't Throw Away Your Organic Chemistry Textbook Yet! */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="HONEST CHEMISTRY CHECK" kickerColor={C.green}>
            Don't Throw Away Your <span style={{ color: C.cyan }}>Chemistry Textbook</span> Yet
          </PageHeader>
          <CenterStage>
            <KeepTextbookAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6B: Light Elements of Life (C, H, N, O) — Pop In ON Exact Spoken Word! */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="LIGHT ELEMENTS OF LIFE" kickerColor={C.green}>
            For Light Elements, Textbook Rules <span style={{ color: C.green }}>Still Hold</span>
          </PageHeader>
          <CenterStage>
            <LightElementsSafeAnim
              cAt={Math.max(8, cue("carbon") - p1)}
              hAt={Math.max(16, cue("hydrogen") - p1)}
              nAt={Math.max(24, cue("nitrogen") - p1)}
              oAt={Math.max(32, cue("oxygen") - p1)}
              dnaAt={Math.max(45, cue("Inside water") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6C: Heavy End of the Periodic Table */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="THE HEAVY FRONTIER" kickerColor={C.gold}>
            Bottom of the Periodic Table: <span style={{ color: C.gold }}>Einstein Takes Over</span>
          </PageHeader>
          <CenterStage>
            <HeavyFrontierGlowAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6D: Real-World Impact (Catalysts, Nuclear Separation, Quantum Materials) */}
      <PageStage from={p3} to={p4}>
        <Sequence from={p3} durationInFrames={Math.max(30, p4 - p3)}>
          <PageHeader kicker="WHY THIS MATTERS TODAY" kickerColor={C.cyan}>
            Catalysts, Nuclear Separation & <span style={{ color: C.cyan }}>Quantum Materials</span>
          </PageHeader>
          <CenterStage>
            <HeavyChemistryImpactAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 6E: Calibrating New Relativistic Quantum Models */}
      <PageStage from={p4} to={end}>
        <Sequence from={p4} durationInFrames={Math.max(30, end - p4)}>
          <PageHeader kicker="DESIGNING NEW MOLECULES" kickerColor={C.gold}>
            Using Einstein's <span style={{ color: C.cyan }}>True Relativistic Rules</span>
          </PageHeader>
          <CenterStage>
            <NewBondingLanguageAnim />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 7 — THE HIDDEN UNITY OF PHYSICS & CHEMISTRY + SUBSCRIBE OUTRO (3 Pages)
// ===========================================================================
export const RelCh7: React.FC = () => {
  const cue = makeRelCue("ch7");
  const end = cue.len + 30;
  const p1 = cue("Go heavy enough");
  const p2 = cue("If you enjoy deep");

  return (
    <AbsoluteFill>
      {/* Page 7A: Unity Synthesis Collage (Gold, Mercury, Bismuth, Einstein) */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="NO WALL BETWEEN SUBJECTS" kickerColor={C.gold}>
            One Set of Laws Governs <span style={{ color: C.gold }}>Stars & Chemical Bonds</span>
          </PageHeader>
          <CenterStage top={235}>
            <UnitySynthesisAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7B: Every Heavy Bond Is a Miniature Relativistic Lab */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE DEEP TAKEAWAY" kickerColor={C.cyan}>
            Go Heavy Enough, and <span style={{ color: C.gold }}>Relativity Rewrites Chemistry</span>
          </PageHeader>
          <CenterStage>
            <MiniatureRelativityLabAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 7C: Clean Animated Subscribe + Bell Outro */}
      <PageStage from={p2} to={end}>
        <Sequence from={p2} durationInFrames={Math.max(30, end - p2)}>
          <CenterStage top={180}>
            <SubscribeOutroAnim />
          </CenterStage>
        </Sequence>
      </PageStage>
    </AbsoluteFill>
  );
};
