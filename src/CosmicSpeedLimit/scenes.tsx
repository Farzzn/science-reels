import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../FiveHundredMileEmail/theme";
import {
  BlockedBySpeedLimitAnim,
  BrandNewSpaceAnim,
  HowLightReachedTeaserAnim,
  JwstParadoxAnim,
  LemaitreHubbleExpansionAnim,
  ManyGalaxiesRecedingAnim,
  SpaceBendCurveStretchAnim,
  SpecialRelativityShipAnim,
  SpeedLimitWallAnim,
  TwoMotionsIntroAnim,
  WhatPushesGalaxiesAnim,
} from "./animCh01";
import {
  ExpandingGridHubbleLawAnim,
  HubbleSphereIntroAnim,
  PhotonArrivalLikeBridgeAnim,
  RubberBandAntAnim,
  SweptBackwardQuestionAnim,
  UpstreamPhotonRescueAnim,
} from "./animCh23";
import {
  AnyDistanceQuestionAnim,
  DarkEnergyEventHorizonAnim,
  JadesLightJourneyAnim,
  SteadyVsExponentialBandAnim,
  ThreeNestedShellsAnim,
} from "./animCh45";
import {
  CosmicSubscribeOutroAnim,
  LonelyFutureSkyAnim,
  ReachableVolumeAnim,
} from "./animCh6";
import { makeCosmicCue } from "./timing";
import { CleanStage, CornerBadge, KineticPunch, LikePromptToast } from "./ui";

// ===========================================================================
// CH 0 — THE IMPOSSIBLE OBSERVATION
// ===========================================================================
export const CosmicCh0: React.FC = () => {
  const cue = makeCosmicCue("ch0");
  const end = cue.len + 26;
  const forbidAt = cue("nothing in the universe");
  const rocketAt = cue("Not a rocket");
  const jwstAt = cue("Yet right now");
  const manyAt = cue("And it isn't some rare glitch");
  const howAt = cue("So how can entire galaxies");
  const shieldAt = cue("without shattering");
  const twoAt = cue("The answer forces you");

  return (
    <AbsoluteFill>
      {/* Beat 0A: Golden Photon Racing into the Unbreakable c Wall */}
      <CleanStage from={0} to={forbidAt}>
        <Sequence from={0} durationInFrames={Math.max(30, forbidAt)}>
          <SpeedLimitWallAnim wallAt={Math.max(12, cue("unbreakable rule"))} />
        </Sequence>
      </CleanStage>

      {/* Beat 0B: Full-Screen Kinetic Punch — FORBIDDEN (v > c) */}
      <CleanStage from={forbidAt} to={rocketAt} fade={6}>
        <Sequence from={forbidAt} durationInFrames={Math.max(30, rocketAt - forbidAt)}>
          <KineticPunch
            word="FORBIDDEN"
            sub="v > c"
            color={C.red}
            accent="cross"
            size={172}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 0C: Rocket, Radio Wave, and Subatomic Particle Blocked at c */}
      <CleanStage from={rocketAt} to={jwstAt}>
        <Sequence from={rocketAt} durationInFrames={Math.max(30, jwstAt - rocketAt)}>
          <BlockedBySpeedLimitAnim
            radioAt={Math.max(12, cue("radio signal") - rocketAt)}
            particleAt={Math.max(24, cue("subatomic particle") - rocketAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 0D: JWST Deep Field + JADES-GS-z14-0 Receding > 2x c */}
      <CleanStage from={jwstAt} to={manyAt}>
        <Sequence from={jwstAt} durationInFrames={Math.max(30, manyAt - jwstAt)}>
          <JwstParadoxAnim
            zoomAt={Math.max(8, cue("JADES-GS-z14-0") - jwstAt)}
            arrowAt={Math.max(24, cue("racing away from Earth") - jwstAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 0E: Most Visible Galaxies Receding Faster Than Light */}
      <CleanStage from={manyAt} to={howAt}>
        <Sequence from={manyAt} durationInFrames={Math.max(30, howAt - manyAt)}>
          <ManyGalaxiesRecedingAnim
            mostAt={Math.max(10, cue("Most of the galaxies") - manyAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 0F: Full-Screen Kinetic Punch — HOW? */}
      <CleanStage from={howAt} to={shieldAt} fade={6}>
        <Sequence from={howAt} durationInFrames={Math.max(30, shieldAt - howAt)}>
          <KineticPunch
            word="HOW?"
            color={C.gold}
            accent="question"
            size={220}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 0G: Einstein Shield Intact + How Did Their Light Reach Us Teaser */}
      <CleanStage from={shieldAt} to={twoAt}>
        <Sequence from={shieldAt} durationInFrames={Math.max(30, twoAt - shieldAt)}>
          <HowLightReachedTeaserAnim
            reachAt={Math.max(20, cue("And even stranger") - shieldAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 0H: Two Motions Split (THROUGH SPACE vs OF SPACE) -> ~95% Reveal */}
      <CleanStage from={twoAt} to={end}>
        <Sequence from={twoAt} durationInFrames={Math.max(30, end - twoAt)}>
          <TwoMotionsIntroAnim
            splitAt={Math.max(12, cue("two completely different kinds of motion") - twoAt)}
            pctAt={Math.max(30, cue("ninety-five percent") - twoAt)}
          />
        </Sequence>
      </CleanStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 1 — WHAT EINSTEIN ACTUALLY FORBADE
// ===========================================================================
export const CosmicCh1: React.FC = () => {
  const cue = makeCosmicCue("ch1");
  const end = cue.len + 26;

  const banAt = cue("actually bans");
  const shipStart = cue("Picture a spacecraft");
  const pushAt = cue("So if no engine");
  const whatAt = cue("what on Earth");
  const nothingAt = cue("The surprising answer");
  const grAt = cue("Ten years after");
  const lemStageAt = cue("And in nineteen twenty-seven");
  const newSpaceAt = cue("Those galaxies aren't rocketing");

  const y1905 = cue("nineteen-oh-five");
  const y1915 = cue("general relativity");
  const y1927 = cue("nineteen twenty-seven");
  const y1929 = cue("nineteen twenty-nine");

  return (
    <AbsoluteFill>
      {/* Beat 1A: 1905 Special Relativity — Einstein + Spacecraft + E -> Infinity + Fabric Wall */}
      <CleanStage from={0} to={pushAt}>
        <Sequence from={0} durationInFrames={Math.max(30, pushAt)}>
          <SpecialRelativityShipAnim
            einsteinAt={Math.max(0, cue("Einstein's"))}
            shipAt={Math.max(20, shipStart)}
            speedAt={Math.max(30, cue("three hundred thousand"))}
            infAt={Math.max(40, cue("climbs toward infinity"))}
            wallAt={Math.max(50, cue("fabric of space itself"))}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 1A-Punch: Clean Full-Screen BANNED Overlay on "actually bans" -> "Picture a spacecraft" */}
      <CleanStage from={banAt} to={shipStart} fade={5}>
        <Sequence from={banAt} durationInFrames={Math.max(30, shipStart - banAt)}>
          <AbsoluteFill style={{ backgroundColor: "#050a18" }}>
            <KineticPunch
              word="BANNED"
              sub="v > c THROUGH SPACE"
              color={C.red}
              accent="cross"
              size={176}
            />
          </AbsoluteFill>
        </Sequence>
      </CleanStage>

      {/* Beat 1B: No Engine, No Explosion, No Force Pushing Galaxies */}
      <CleanStage from={pushAt} to={whatAt}>
        <Sequence from={pushAt} durationInFrames={Math.max(30, whatAt - pushAt)}>
          <WhatPushesGalaxiesAnim
            expAt={Math.max(10, cue("explosion") - pushAt)}
            forceAt={Math.max(20, cue("or force") - pushAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 1C: Full-Screen Kinetic Punch — WHAT? */}
      <CleanStage from={whatAt} to={nothingAt} fade={6}>
        <Sequence from={whatAt} durationInFrames={Math.max(30, nothingAt - whatAt)}>
          <KineticPunch
            word="WHAT?"
            sub="IS PUSHING THEM"
            color={C.cyan}
            accent="question"
            size={195}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 1D: Full-Screen Kinetic Punch — NOTHING. */}
      <CleanStage from={nothingAt} to={grAt} fade={6}>
        <Sequence from={nothingAt} durationInFrames={Math.max(30, grAt - nothingAt)}>
          <KineticPunch
            word="NOTHING."
            sub="ZERO FORCE THROUGH SPACE"
            color={C.white}
            accent="burst"
            size={175}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 1E (HERO 2:07): General Relativity — Rigid Stage Shatters -> BEND / CURVE / STRETCH */}
      <CleanStage from={grAt} to={lemStageAt}>
        <Sequence from={grAt} durationInFrames={Math.max(30, lemStageAt - grAt)}>
          <SpaceBendCurveStretchAnim
            bendAt={Math.max(20, cue("bend") - grAt - 16)}
            curveAt={Math.max(30, cue("curve") - grAt - 8)}
            stretchAt={Math.max(40, cue("and stretch") - grAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 1F: 1927 Lemaître & 1929 Hubble — Galaxies Drifting Away in Every Direction */}
      <CleanStage from={lemStageAt} to={newSpaceAt}>
        <Sequence from={lemStageAt} durationInFrames={Math.max(30, newSpaceAt - lemStageAt)}>
          <LemaitreHubbleExpansionAnim
            lemaitreAt={Math.max(6, cue("Georges Lemaître") - lemStageAt)}
            hubbleAt={Math.max(20, cue("Edwin Hubble") - lemStageAt)}
            driftAt={Math.max(35, cue("drifting away") - lemStageAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 1G (HERO 2:30–2:37): Not Rocketing -> Brand-New Space Spawning Every Second */}
      <CleanStage from={newSpaceAt} to={end}>
        <Sequence from={newSpaceAt} durationInFrames={Math.max(30, end - newSpaceAt)}>
          <BrandNewSpaceAnim
            spawnAt={Math.max(15, cue("Instead, the space") - newSpaceAt)}
          />
        </Sequence>
      </CleanStage>

      {/* Transient Corner Year Badges — strictly on exact spoken mentions */}
      <CornerBadge
        year="1905"
        label="SPECIAL RELATIVITY"
        at={y1905}
        dur={Math.min(120, Math.max(45, banAt - y1905 - 12))}
        color={C.gold}
      />
      <CornerBadge
        year="1915"
        label="GENERAL RELATIVITY"
        at={y1915}
        dur={Math.min(120, Math.max(45, y1927 - y1915 - 24))}
        color={C.gold}
      />
      <CornerBadge
        year="1927"
        label="GEORGES LEMAÎTRE"
        at={y1927}
        dur={Math.min(120, Math.max(45, y1929 - y1927 - 24))}
        color={C.cyan}
      />
      <CornerBadge
        year="1929"
        label="EDWIN HUBBLE"
        at={y1929}
        dur={Math.min(120, Math.max(45, newSpaceAt - y1929 - 24))}
        color={C.gold}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 2 — THE EXPANDING GRID & THE RUBBER BAND
// ===========================================================================
export const CosmicCh2: React.FC = () => {
  const cue = makeCosmicCue("ch2");
  const end = cue.len + 26;
  const bandAt = cue("You can picture the exact same trick");

  return (
    <AbsoluteFill>
      {/* Beat 2A: Expanding Coordinate Grid & Hubble's Law (v = H0 * d) */}
      <CleanStage from={0} to={bandAt}>
        <Sequence from={0} durationInFrames={Math.max(30, bandAt)}>
          <ExpandingGridHubbleLawAnim
            pinAt={cue("Pin our Milky Way")}
            parkedAt={cue("stays parked")}
            stretchAt={cue("Now stretch the grid uniformly")}
            rateAt={cue("sixty-seven kilometers")}
            oneAt={cue("one grid square away")}
            twoAt={cue("two squares away")}
            threeAt={cue("Three squares away")}
            lawAt={cue("Hubble's Law")}
            exceedAt={cue("combined expansion")}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 2B: Ant (1 cm/s) Walking Along Stretching Rubber Band (5 cm/s) */}
      <CleanStage from={bandAt} to={end}>
        <Sequence from={bandAt} durationInFrames={Math.max(30, end - bandAt)}>
          <RubberBandAntAnim
            antAt={Math.max(10, cue("one centimeter") - bandAt)}
            pullAt={Math.max(20, cue("Now pull both ends") - bandAt)}
            localAt={Math.max(30, cue("never cheats") - bandAt)}
            fiveAt={Math.max(40, cue("five times faster") - bandAt)}
            galaxiesAt={Math.max(50, cue("Galaxies obey the exact same rule") - bandAt)}
          />
        </Sequence>
      </CleanStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 3 — HOW LIGHT SWIMS UPSTREAM
// ===========================================================================
export const CosmicCh3: React.FC = () => {
  const cue = makeCosmicCue("ch3");
  const end = cue.len + 26;
  const puz2At = cue("second, even stranger");
  const sphereStart = cue("Draw a giant sphere");
  const sweptStart = cue("So pause and ask");
  const noAt = cue("Remarkably, the answer is no");
  const mythAt = cue("common misconceptions");
  const rescueStart = cue("Follow a single photon");
  const arriveStart = cue("billions of years later");

  return (
    <AbsoluteFill>
      {/* Beat 3A: Kinetic Punch — SAVED ✓ */}
      <CleanStage from={0} to={puz2At} fade={6}>
        <Sequence from={0} durationInFrames={Math.max(30, puz2At)}>
          <KineticPunch
            word="SAVED ✓"
            sub="EINSTEIN'S RULE HOLDS"
            color={C.green}
            accent="burst"
            size={165}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3B: Kinetic Punch — PUZZLE #2 */}
      <CleanStage from={puz2At} to={sphereStart} fade={6}>
        <Sequence from={puz2At} durationInFrames={Math.max(30, sphereStart - puz2At)}>
          <KineticPunch
            word="PUZZLE #2"
            sub="HOW DOES LIGHT ARRIVE?"
            color={C.gold}
            accent="question"
            size={155}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3C: 14.4 B ly Hubble Sphere (< c inside, v = c on rim, > c outside) */}
      <CleanStage from={sphereStart} to={sweptStart}>
        <Sequence from={sphereStart} durationInFrames={Math.max(30, sweptStart - sphereStart)}>
          <HubbleSphereIntroAnim
            sphereAt={Math.max(4, cue("fourteen-point-four") - sphereStart)}
            nameAt={Math.max(15, cue("Hubble Sphere") - sphereStart)}
            onLineAt={Math.max(25, cue("Right on that line") - sphereStart)}
            beyondAt={Math.max(35, cue("Beyond fourteen-point-four") - sphereStart)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3D: Swept Backward Forever Question Lead-In */}
      <CleanStage from={sweptStart} to={noAt}>
        <Sequence from={sweptStart} durationInFrames={Math.max(30, noAt - sweptStart)}>
          <SweptBackwardQuestionAnim
            beamAt={Math.max(12, cue("shines a beam of light") - sweptStart)}
            sweptAt={Math.max(24, cue("swept backward forever") - sweptStart)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3E (HERO 5:14–5:17): Full-Screen Kinetic Punch — NO. ✕ */}
      <CleanStage from={noAt} to={mythAt} fade={6}>
        <Sequence from={noAt} durationInFrames={Math.max(30, mythAt - noAt)}>
          <KineticPunch
            word="NO."
            sub="NOT TRAPPED FOREVER"
            color={C.red}
            accent="cross"
            size={230}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3F (HERO 5:17–5:20.5): Full-Screen Kinetic Punch — MYTH BUSTED */}
      <CleanStage from={mythAt} to={rescueStart} fade={6}>
        <Sequence from={mythAt} durationInFrames={Math.max(30, rescueStart - mythAt)}>
          <KineticPunch
            word="MYTH"
            sub="BUSTED"
            color={C.gold}
            accent="cross"
            size={195}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3G: Signature Upstream Photon Rescue Simulation */}
      <CleanStage from={rescueStart} to={arriveStart}>
        <Sequence from={rescueStart} durationInFrames={Math.max(30, arriveStart - rescueStart)}>
          <UpstreamPhotonRescueAnim
            fireAt={Math.max(6, cue("emitted toward Earth") - rescueStart)}
            dragAt={Math.max(15, cue("loses ground at first") - rescueStart)}
            howAt={Math.max(25, cue("So how can it possibly") - rescueStart)}
            dropAt={Math.max(35, cue("Hubble parameter") - rescueStart)}
            growAt={Math.max(45, cue("Hubble Sphere itself is growing outward") - rescueStart)}
            rescueAt={Math.max(55, cue("eventually overtakes it") - rescueStart)}
            homeAt={Math.max(65, cue("stops drifting backward") - rescueStart)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 3H: Photon Arriving at Telescope Mirror + Natural Like Bridge */}
      <CleanStage from={arriveStart} to={end}>
        <Sequence from={arriveStart} durationInFrames={Math.max(30, end - arriveStart)}>
          <PhotonArrivalLikeBridgeAnim />
        </Sequence>
      </CleanStage>

      <LikePromptToast
        at={cue("hit that like button")}
        dur={160}
        label="Mind blown? Hit Like!"
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 4 — THE REAL POINT OF NO RETURN
// ===========================================================================
export const CosmicCh4: React.FC = () => {
  const cue = makeCosmicCue("ch4");
  const end = cue.len + 26;
  const askStart = cue("If the Hubble Sphere");
  const no4Start = cue("No and to see why");
  const band4Start = cue("bring back our ant");
  const darkStart = cue("In nineteen ninety-eight");

  return (
    <AbsoluteFill>
      {/* Beat 4A: Kinetic Punch — WAIT... A SECOND */}
      <CleanStage from={0} to={askStart} fade={5}>
        <Sequence from={0} durationInFrames={Math.max(30, askStart)}>
          <KineticPunch
            word="WAIT..."
            sub="A SECOND"
            color={C.gold}
            accent="question"
            size={190}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 4B: Growing Hubble Sphere — Does Light From Any Distance Reach Us? */}
      <CleanStage from={askStart} to={no4Start}>
        <Sequence from={askStart} durationInFrames={Math.max(30, no4Start - askStart)}>
          <AnyDistanceQuestionAnim
            askAt={Math.max(10, cue("any distance") - askStart)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 4C: Kinetic Punch — NO. NOT ANY DISTANCE */}
      <CleanStage from={no4Start} to={band4Start} fade={5}>
        <Sequence from={no4Start} durationInFrames={Math.max(30, band4Start - no4Start)}>
          <KineticPunch
            word="NO."
            sub="NOT ANY DISTANCE"
            color={C.red}
            accent="cross"
            size={220}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 4D: Steady vs Exponential Rubber Band Race */}
      <CleanStage from={band4Start} to={darkStart}>
        <Sequence from={band4Start} durationInFrames={Math.max(30, darkStart - band4Start)}>
          <SteadyVsExponentialBandAnim
            steadyAt={Math.max(8, cue("stretch a rubber band at a steady") - band4Start)}
            tenXAt={Math.max(20, cue("ten times faster") - band4Start)}
            expAt={Math.max(35, cue("accelerate the stretch exponentially") - band4Start)}
            explodeAt={Math.max(45, cue("newly created rubber ahead") - band4Start)}
            trappedAt={Math.max(55, cue("trapped forever") - band4Start)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 4E: Dark Energy, 17.5 B ly Limit, 16.5 B ly Cosmic Event Horizon + Photon Race */}
      <CleanStage from={darkStart} to={end}>
        <Sequence from={darkStart} durationInFrames={Math.max(30, end - darkStart)}>
          <DarkEnergyEventHorizonAnim
            accelAt={Math.max(10, cue("Driven by dark energy") - darkStart)}
            darkAt={Math.max(16, cue("expansion of space is accelerating") - darkStart)}
            maxAt={Math.max(24, cue("seventeen-point-five") - darkStart)}
            horizonAt={Math.max(34, cue("Cosmic Event Horizon") - darkStart)}
            goodPhotonAt={Math.max(44, cue("fifteen-point-five") - darkStart)}
            lostPhotonAt={Math.max(54, cue("seventeen billion") - darkStart)}
            neverAt={Math.max(62, cue("never will") - darkStart)}
          />
        </Sequence>
      </CleanStage>

      <CornerBadge
        year="1998"
        label="ACCELERATING UNIVERSE"
        at={cue("nineteen ninety-eight")}
        dur={120}
        color={C.red}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 5 — WHY WE CAN STILL SEE 46.5 BILLION LIGHT-YEARS
// ===========================================================================
export const CosmicCh5: React.FC = () => {
  const cue = makeCosmicCue("ch5");
  const end = cue.len + 26;
  const how5At = cue("How can we see JADES-GS-z14-0");
  const jadesStart = cue("thirty-three-point-eight");

  return (
    <AbsoluteFill>
      {/* Beat 5A: Three Nested Cosmic Shells (14.4 / 16.5 / 46.5 B ly + 93 B ly Diameter) */}
      <CleanStage from={0} to={how5At}>
        <Sequence from={0} durationInFrames={Math.max(30, how5At)}>
          <ThreeNestedShellsAnim
            hubAt={cue("fourteen-point-four")}
            ehAt={cue("sixteen-point-five")}
            obsAt={cue("Observable Universe")}
            diamAt={cue("ninety-three billion")}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 5B: Kinetic Punch — HOW?! JADES-GS-z14-0 */}
      <CleanStage from={how5At} to={jadesStart} fade={6}>
        <Sequence from={how5At} durationInFrames={Math.max(30, jadesStart - how5At)}>
          <KineticPunch
            word="HOW?!"
            sub="JADES-GS-z14-0"
            color={C.gold}
            accent="question"
            size={210}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 5C: JADES-GS-z14-0 Light Journey (Rewind 33.8 -> 2.2 -> 33.8 B ly over 13.5 B yrs) */}
      <CleanStage from={jadesStart} to={end}>
        <Sequence from={jadesStart} durationInFrames={Math.max(30, end - jadesStart)}>
          <JadesLightJourneyAnim
            rewindAt={Math.max(10, cue("aren't seeing light") - jadesStart)}
            emitAt={Math.max(20, cue("emitted thirteen-point-five") - jadesStart)}
            sweepAt={Math.max(30, cue("swept up by our expanding") - jadesStart)}
            stretchAt={Math.max(40, cue("During the thirteen-point-five") - jadesStart)}
            babyAt={Math.max(50, cue("ancient baby photo") - jadesStart)}
          />
        </Sequence>
      </CleanStage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CH 6 — THE LONELY COSMIC FUTURE
// ===========================================================================
export const CosmicCh6: React.FC = () => {
  const cue = makeCosmicCue("ch6");
  const end = cue.len + 42;
  const lonelyStart = cue("over the next hundreds of billions");
  const outroStart = cue("If you enjoy clear visual breakdowns");

  return (
    <AbsoluteFill>
      {/* Beat 6A: 5% Reachable Core vs 95% Gone Forever Sphere Volume */}
      <CleanStage from={0} to={lonelyStart}>
        <Sequence from={0} durationInFrames={Math.max(30, lonelyStart)}>
          <ReachableVolumeAnim
            fiveAt={cue("five percent")}
            ninetyFiveAt={cue("ninety-five percent")}
            beamAt={cue("launched a beam of light")}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 6B: Lonely Future Sky — Distant Galaxies Redshift & Fade Into Darkness */}
      <CleanStage from={lonelyStart} to={outroStart}>
        <Sequence from={lonelyStart} durationInFrames={Math.max(30, outroStart - lonelyStart)}>
          <LonelyFutureSkyAnim
            fadeAt={Math.max(8, cue("carrying distant galaxies") - lonelyStart)}
            stretchAt={Math.max(20, cue("dimmer red wavelengths") - lonelyStart)}
            localAt={Math.max(32, cue("Trillions of years from now") - lonelyStart)}
            finalLineAt={Math.max(44, cue("Nothing ever broke") - lonelyStart)}
          />
        </Sequence>
      </CleanStage>

      {/* Beat 6C: Clean Minimal Subscribe Outro */}
      <CleanStage from={outroStart} to={end}>
        <Sequence from={outroStart} durationInFrames={Math.max(30, end - outroStart)}>
          <CosmicSubscribeOutroAnim />
        </Sequence>
      </CleanStage>
    </AbsoluteFill>
  );
};
