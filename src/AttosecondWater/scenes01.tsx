import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import { LikePromptToast, PageHeader, PageStage, TransientYearBadge } from "../RelativityBonds/ui";
import {
  AttosecondVsUniverseAnim,
  BilliardWaterAnim,
  CenturyAssumptionCrackAnim,
  FourFsRaceColdOpenAnim,
  HummingbirdShutterXFELAnim,
  TimescaleClockZoomAnim,
  TwoClocksLikeBridgeAnim,
} from "./animCh01";
import {
  AugerMeitnerDecayAnim,
  BornOppenheimerPortraitsAnim,
  CleanDivorceCrackAnim,
  CoreHoleClockPrincipleAnim,
  CoreHolePunchAnim,
  FourFemtosecondStopwatchAnim,
  ManyBodyNightmareAnim,
  MassGapBowlingGnatAnim,
} from "./animCh23";
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
// CH 0 — COLD OPEN: THE 4-FEMTOSECOND RACE INSIDE WATER (3 Voice-Locked Pages)
// ===========================================================================
export const AttoCh0: React.FC = () => {
  const cue = makeAttoCue("ch0");
  const end = cue.len + 30;
  const p1 = cue("Yet in November");
  const p2 = cue("For nearly a century");

  return (
    <AbsoluteFill>
      {/* Page 0A: Textbook Slow-Motion Billiard-Ball Water */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE TEXTBOOK PICTURE" kickerColor={C.cyan}>
            How We Usually Imagine <span style={{ color: C.cyan }}>Chemical Bonds Breaking</span>
          </PageHeader>
          <CenterStage>
            <BilliardWaterAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0B: Nov 2026 PRL Breakthrough — Both O-H Bonds Snap < 4 fs! */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="NOVEMBER 2026 · PHYSICAL REVIEW LETTERS" kickerColor={C.gold}>
            Water Ripped Apart <span style={{ color: C.red }}>Before Its Electrons Finished</span>
          </PageHeader>
          <CenterStage>
            <FourFsRaceColdOpenAnim
              hitAt={Math.max(10, cue("high-energy X-ray") - p1)}
              ripAt={Math.max(20, cue("both hydrogen bonds") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 0C: 100-Year Assumption Cracking Under Attosecond X-Ray Lasers */}
      <PageStage from={p2} to={end}>
        <Sequence from={p2} durationInFrames={Math.max(30, end - p2)}>
          <PageHeader kicker="BEYOND TEXTBOOK CHEMISTRY" kickerColor={C.cyan}>
            Inside the First <span style={{ color: C.gold }}>Quintillionth of a Second</span>
          </PageHeader>
          <CenterStage>
            <CenturyAssumptionCrackAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2026" location="PHYSICAL REVIEW LETTERS" at={cue("November twenty twenty-six")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 1 — HOW FAST IS AN ATTOSECOND? (4 Voice-Locked Pages + Natural LIKE!)
// ===========================================================================
export const AttoCh1: React.FC = () => {
  const cue = makeAttoCue("ch1");
  const end = cue.len + 30;
  const p1 = cue("Try wrapping your head");
  const p2 = cue("If realizing");
  const p3 = cue("For decades");

  return (
    <AbsoluteFill>
      {/* Page 1A: Interactive Powers-of-10 Clock Zoom (1 s -> 10^-18 s!) */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="SHRINKING TIME TO THE EXTREME" kickerColor={C.cyan}>
            Zooming From One Heartbeat to <span style={{ color: C.red }}>One Attosecond</span>
          </PageHeader>
          <CenterStage>
            <TimescaleClockZoomAnim
              msAt={Math.max(20, cue("milliseconds"))}
              nsAt={Math.max(30, cue("nanoseconds"))}
              psAt={Math.max(40, cue("picosecond"))}
              fsAt={Math.max(50, cue("femtosecond"))}
              asAt={Math.max(60, cue("attosecond"))}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1B: 1 Second Holds More Attoseconds Than 2x the Age of the Universe! */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="COSMIC SCALE CHECK" kickerColor={C.gold}>
            One Second vs. <span style={{ color: C.gold }}>The Entire Age of the Universe</span>
          </PageHeader>
          <CenterStage>
            <AttosecondVsUniverseAnim
              oneSecAt={Math.max(15, cue("One single second") - p1)}
              ratioAt={Math.max(25, cue("thirty-one billion") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1C: Two Ultrafast Clocks Recap + Natural Mind-Blown LIKE Toast! */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="TWO ULTRAFAST WORLDS" kickerColor={C.cyan}>
            Femtoseconds Move Atoms — <span style={{ color: C.gold }}>Attoseconds Move Electrons</span>
          </PageHeader>
          <CenterStage>
            <TwoClocksLikeBridgeAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 1D: Slow Shutter Blur -> 2023 Nobel Prize -> Oct 2026 300-as European XFEL */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="THE ATOMIC STROBE CAMERA" kickerColor={C.gold}>
            From Muddy Blur to <span style={{ color: C.gold }}>300-Attosecond X-Ray Flashes</span>
          </PageHeader>
          <CenterStage>
            <HummingbirdShutterXFELAnim
              nobelAt={Math.max(15, cue("twenty twenty-three") - p3)}
              xfelAt={Math.max(30, cue("European X-ray") - p3)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="2023" location="NOBEL PRIZE IN PHYSICS" at={cue("twenty twenty-three")} color={C.cyan} />
      <LikePromptToast at={cue("take a quick second to hit that like button")} dur={165} label="Mind blown? Hit Like!" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 2 — THE 1927 PILLAR: BORN & OPPENHEIMER (4 Voice-Locked Pages)
// ===========================================================================
export const AttoCh2: React.FC = () => {
  const cue = makeAttoCue("ch2");
  const end = cue.len + 30;
  const p1 = cue("Back in nineteen");
  const p2 = cue("Look at the mass");
  const p3 = cue("So Born and Oppenheimer");

  return (
    <AbsoluteFill>
      {/* Page 2A: Many-Body Quantum Nightmare */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="THE QUANTUM BOTTLENECK" kickerColor={C.red}>
            Why Solving a Real Molecule Is a <span style={{ color: C.red }}>Mathematical Nightmare</span>
          </PageHeader>
          <CenterStage>
            <ManyBodyNightmareAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2B: Max Born & J. Robert Oppenheimer Portraits (1927, Voice-Locked!) */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="THE 1927 SHORTCUT" kickerColor={C.gold}>
            Max Born &amp; <span style={{ color: C.gold }}>J. Robert Oppenheimer</span>
          </PageHeader>
          <CenterStage>
            <BornOppenheimerPortraitsAnim
              bornAt={Math.max(4, cue("Max Born") - p1)}
              oppAt={Math.max(12, cue("Robert Oppenheimer") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2C: 1,836x Mass Gap — Bowling Ball vs. Weightless Gnat */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="EXTREME MASS GAP" kickerColor={C.cyan}>
            One Proton Outweighs an Electron by <span style={{ color: C.gold }}>1,836×</span>
          </PageHeader>
          <CenterStage>
            <MassGapBowlingGnatAnim oxygenAt={Math.max(15, cue("oxygen nucleus") - p2)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 2D: Clean Divorce (Smooth Energy Valley) Cracking Under X-Rays */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="THE BORN–OPPENHEIMER APPROXIMATION" kickerColor={C.green}>
            Brilliant at Room Temp — <span style={{ color: C.red }}>Broken Under X-Rays</span>
          </PageHeader>
          <CenterStage>
            <CleanDivorceCrackAnim crackAt={Math.max(20, cue("energetic X-ray") - p3)} />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1927" location="BORN & OPPENHEIMER" at={cue("nineteen twenty-seven")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 3 — THE 4-FEMTOSECOND QUANTUM STOPWATCH (4 Voice-Locked Pages)
// ===========================================================================
export const AttoCh3: React.FC = () => {
  const cue = makeAttoCue("ch3");
  const end = cue.len + 30;
  const p1 = cue("Nature hates");
  const p2 = cue("Inside an oxygen atom");
  const p3 = cue("And here is the clever");

  return (
    <AbsoluteFill>
      {/* Page 3A: X-Ray Punches Oxygen's Deepest 1s Core Electron Out */}
      <PageStage from={0} to={p1}>
        <Sequence from={0} durationInFrames={Math.max(30, p1)}>
          <PageHeader kicker="DIRECT CORE STRIKE" kickerColor={C.gold}>
            Punching a Hole Straight Out of <span style={{ color: C.red }}>Oxygen's 1s Core</span>
          </PageHeader>
          <CenterStage>
            <CoreHolePunchAnim punchAt={Math.max(12, cue("punches an innermost"))} />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3B: Lise Meitner Portrait (1922) + Auger-Meitner Electronic Cascade */}
      <PageStage from={p1} to={p2}>
        <Sequence from={p1} durationInFrames={Math.max(30, p2 - p1)}>
          <PageHeader kicker="ELECTRONIC CLEANUP CASCADE" kickerColor={C.gold}>
            Auger–Meitner Decay: <span style={{ color: C.cyan }}>Healing the Core Hole</span>
          </PageHeader>
          <CenterStage>
            <AugerMeitnerDecayAnim
              meitnerAt={Math.max(10, cue("Lise Meitner") - p1)}
              dropAt={Math.max(25, cue("One outer electron") - p1)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3C: ~4.0 Femtosecond Oxygen Core-Hole Stopwatch */}
      <PageStage from={p2} to={p3}>
        <Sequence from={p2} durationInFrames={Math.max(30, p3 - p2)}>
          <PageHeader kicker="BUILT-IN ATOMIC CLOCK" kickerColor={C.gold}>
            An Average Lifetime of Just <span style={{ color: C.gold }}>4 Femtoseconds</span>
          </PageHeader>
          <CenterStage>
            <FourFemtosecondStopwatchAnim />
          </CenterStage>
        </Sequence>
      </PageStage>

      {/* Page 3D: The Core-Hole Clock Principle (Intact Molecular vs Sharp Atomic) */}
      <PageStage from={p3} to={end}>
        <Sequence from={p3} durationInFrames={Math.max(30, end - p3)}>
          <PageHeader kicker="THE CORE-HOLE CLOCK" kickerColor={C.cyan}>
            How One Escaping Electron <span style={{ color: C.gold }}>Times a Breaking Bond</span>
          </PageHeader>
          <CenterStage>
            <CoreHoleClockPrincipleAnim
              intactAt={Math.max(15, cue("still intact") - p3)}
              snappedAt={Math.max(25, cue("already snapped") - p3)}
            />
          </CenterStage>
        </Sequence>
      </PageStage>

      <TransientYearBadge year="1922" location="LISE MEITNER · 1925 AUGER" at={cue("nineteen twenty-two")} />
    </AbsoluteFill>
  );
};
