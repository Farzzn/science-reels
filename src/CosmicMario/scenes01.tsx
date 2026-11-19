import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, ChapterCard, Kicker, Panel, SceneFade } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { makeCosmicCue } from "./timing";
import { BinaryRegister, CapacitorBucketSVG, MarioTowerUpwarpSVG, YearBadge } from "./visuals";

// ===========================================================================
// CHAPTER 0 — COLD OPEN (Sept 2013 Mario Upwarp + $1,000 Bounty + Space Culprit + Roadmap)
// ===========================================================================
export const CosmicCh0: React.FC = () => {
  const cue = makeCosmicCue("ch0");
  const frame = useCurrentFrame();

  const tTeleport = cue("suddenly teleported");
  const tNoOne = cue("No one knew");
  const tWhy = cue("Why? Because");
  const tFirst = cue("First, we'll look");

  return (
    <AbsoluteFill>
      {/* Beat 1: Sept 2013 Speedrun & Upwarp */}
      <SceneFade from={0} to={tNoOne - 6}>
        <YearBadge year="SEPTEMBER 2013" location="SUPER MARIO 64 · 70-STAR SPEEDRUN" at={0} color={C.gold} />
        <div style={{ position: "absolute", left: 86, top: 205, width: 780 }}>
          <Appear at={cue("DOTA TeaBag")}>
            <Kicker color={C.cyan}>SPEEDRUNNER: DOTA_TEABAG</Kicker>
            <BigText size={68} style={{ marginTop: 14 }}>
              Tick Tock Clock
              <br />
              <span style={{ color: C.gold }}>The Impossible Upwarp</span>
            </BigText>
          </Appear>

          <Appear at={cue("Without touching")} style={{ marginTop: 34 }}>
            <Panel style={{ padding: "22px 32px", display: "inline-flex", alignItems: "center", gap: 24 }}>
              {/* N64 Controller A-Button SVG */}
              <svg width={88} height={88} viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={40} fill="rgba(62,224,255,0.12)" stroke={C.cyan} strokeWidth={4} />
                <text x={50} y={64} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={44}>
                  A
                </text>
                <line x1={18} y1={18} x2={82} y2={82} stroke={C.red} strokeWidth={6} />
              </svg>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>JUMP BUTTON INPUT</div>
                <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 38, color: C.red }}>
                  NOT PRESSED (0 INPUTS)
                </div>
              </div>
            </Panel>
          </Appear>

          <Appear at={tTeleport} style={{ marginTop: 32 }}>
            <div style={{ borderRadius: 20, overflow: "hidden", border: `2px solid ${C.gold}`, width: 480, height: 270, boxShadow: glow(C.gold, 12) }}>
              <Img src={staticFile("cosmic/mario-upwarp.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </Appear>
        </div>

        <div style={{ position: "absolute", right: 70, top: 170 }}>
          <MarioTowerUpwarpSVG warpAt={tTeleport} width={860} height={740} />
        </div>
      </SceneFade>

      {/* Beat 2: The $1,000 Bounty & 0 Successes */}
      <SceneFade from={tNoOne - 4} to={tWhy - 6}>
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
            <Appear at={cue("one-thousand-dollar")} from="scale">
              <Panel style={{ padding: "48px 64px", textAlign: "center", width: 660 }} border={C.gold}>
                <Kicker color={C.gold}>PANNENKOEK2012 CHALLENGE</Kicker>
                <BigText size={140} color={C.gold} glowColor={C.gold} style={{ marginTop: 14 }}>
                  $1,000
                </BigText>
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36, color: C.white, marginTop: 8 }}>
                  REWARD TO REPRODUCE IT
                </div>
              </Panel>
            </Appear>

            <div style={{ width: 820 }}>
              <Appear at={cue("thousands of players")}>
                <Kicker color={C.cyan}>GLOBAL SPEEDRUN COMMUNITY</Kicker>
                <BigText size={66} style={{ marginTop: 12 }}>
                  Thousands of attempts…
                </BigText>
              </Appear>

              {/* Grid of failed console attempt badges */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginTop: 32 }}>
                {new Array(18).fill(0).map((_, i) => {
                  const show = frame >= cue("thousands of players") + i * 3;
                  return (
                    <div
                      key={i}
                      style={{
                        height: 62,
                        borderRadius: 12,
                        background: "rgba(255,77,94,0.14)",
                        border: `1.5px solid ${C.red}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: MONO,
                        fontWeight: 800,
                        fontSize: 22,
                        color: C.red,
                        opacity: show ? 1 : 0.1,
                      }}
                    >
                      FAIL ✕
                    </div>
                  );
                })}
              </div>

              <Appear at={cue("Not a single person")} style={{ marginTop: 34 }}>
                <BigText size={68} color={C.red} glowColor={C.red}>
                  0 SUCCESSFUL RECREATIONS
                </BigText>
              </Appear>
            </div>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 3: The Culprit From Outer Space (Supernova + Bit Flip 0 -> 1) */}
      <SceneFade from={tWhy - 4} to={tFirst - 6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 80, top: 120, width: 820 }}>
            <Appear at={cue("outer space")}>
              <div style={{ borderRadius: 24, overflow: "hidden", border: `2px solid ${C.cyan}`, boxShadow: glow(C.cyan, 14) }}>
                <Img src={staticFile("cosmic/supernova-ray.png")} style={{ width: 820, height: 460, objectFit: "cover", display: "block" }} />
              </div>
            </Appear>
            <Appear at={cue("exploding star")} style={{ marginTop: 28 }}>
              <Kicker color={C.gold}>BORN IN AN EXPLODING SUPERNOVA</Kicker>
              <BigText size={54} style={{ marginTop: 10 }}>
                1 Subatomic Particle → N64 RAM Chip
              </BigText>
            </Appear>
          </div>

          <div style={{ position: "absolute", right: 80, top: 210, width: 840, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Kicker color={C.red} style={{ marginBottom: 24 }}>
              SINGLE-BIT MEMORY STRIKE
            </Kicker>
            <BinaryRegister
              bits={[1, 1, 0, 0, 0, 1, 0, 1]}
              flippedIndex={7}
              flipAt={cue("flipped a single")}
              hexBefore="0xC5"
              hexAfter="0xC4"
              valBefore="Y: -1658"
              valAfter="Y: -895"
              scale={0.92}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 4: Carter Studios 3-Step Structural Promise + Year 2008 */}
      <SceneFade from={tFirst - 4} to={cue.len + 30}>
        <YearBadge year="2003 & 2008" location="REAL-WORLD COSMIC INCIDENTS" at={cue("Belgium")} color={C.red} />
        <Center>
          <div style={{ width: 1680, marginTop: 60 }}>
            <Kicker style={{ textAlign: "center", marginBottom: 38, fontSize: 30 }}>
              THE CONCEPTUAL STAIRCASE · HOW IT WORKS
            </Kicker>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
              {/* Step 1 */}
              <Appear at={tFirst} from="up">
                <Panel style={{ padding: "36px 34px", height: 460, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.cyan}>
                  <div>
                    <Kicker color={C.cyan} style={{ fontSize: 22 }}>01 · THE MEMORY BUCKET</Kicker>
                    <BigText size={44} style={{ marginTop: 14 }}>
                      Why Bits Are Puddles of Electrons
                    </BigText>
                  </div>
                  <svg width={240} height={200} viewBox="0 0 240 200" style={{ margin: "0 auto" }}>
                    <path d="M50,30 L50,165 L190,165 L190,30" fill="rgba(62,224,255,0.12)" stroke={C.cyan} strokeWidth={5} />
                    <rect x={56} y={95} width={128} height={64} fill={C.gold} fillOpacity={0.35} />
                    <text x={120} y={140} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={44}>1 / 0</text>
                  </svg>
                </Panel>
              </Appear>

              {/* Step 2 */}
              <Appear at={cue("Then, we'll see")} from="up">
                <Panel style={{ padding: "36px 34px", height: 460, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.red}>
                  <div>
                    <Kicker color={C.red} style={{ fontSize: 22 }}>02 · 2003 VOTE &amp; 2008 JET</Kicker>
                    <BigText size={44} style={{ marginTop: 14 }}>
                      4,096 Extra Votes &amp; Flight 72&apos;s Dive
                    </BigText>
                  </div>
                  <svg width={260} height={200} viewBox="0 0 260 200" style={{ margin: "0 auto" }}>
                    <path d="M30,115 L140,85 L220,45 L180,115 L230,145 L140,125 Z" fill="rgba(255,77,94,0.22)" stroke={C.red} strokeWidth={4} />
                    <line x1={155} y1={10} x2={145} y2={95} stroke={C.gold} strokeWidth={5} />
                    <text x={130} y={185} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={24}>2008 · 37,000 FT</text>
                  </svg>
                </Panel>
              </Appear>

              {/* Step 3 */}
              <Appear at={cue("And finally")} from="up">
                <Panel style={{ padding: "36px 34px", height: 460, display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.green}>
                  <div>
                    <Kicker color={C.green} style={{ fontSize: 22 }}>03 · CATCHING THE COSMOS</Kicker>
                    <BigText size={44} style={{ marginTop: 14 }}>
                      ECC Parity Math &amp; 3-CPU Voting
                    </BigText>
                  </div>
                  <svg width={240} height={200} viewBox="0 0 240 200" style={{ margin: "0 auto" }}>
                    <rect x={30} y={40} width={50} height={50} rx={8} stroke={C.green} strokeWidth={3} fill="rgba(61,255,160,0.15)" />
                    <rect x={95} y={40} width={50} height={50} rx={8} stroke={C.green} strokeWidth={3} fill="rgba(61,255,160,0.15)" />
                    <rect x={160} y={40} width={50} height={50} rx={8} stroke={C.red} strokeWidth={3} fill="rgba(255,77,94,0.2)" />
                    <text x={120} y={150} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={32}>2 vs 1 VOTE ✓</text>
                  </svg>
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
// CHAPTER 1 — THE $1,000 GLITCH (32-Bit Float C5 -> C4 & Height Jump)
// ===========================================================================
export const CosmicCh1: React.FC = () => {
  const cue = makeCosmicCue("ch1");
  const tJust = cue("Just before the teleport");
  const tFlip = cue("manually flipped");
  const tNothing = cue("Nothing in the game's");

  return (
    <AbsoluteFill>
      {/* Beat 1: N64 Memory & 32-Bit Floating Point Height */}
      <SceneFade from={0} to={tJust - 6}>
        <Center>
          <div style={{ width: 1620, textAlign: "center" }}>
            <Kicker color={C.cyan}>REVERSE-ENGINEERING THE NINTENDO 64 RAM</Kicker>
            <BigText size={74} style={{ marginTop: 16 }}>
              Mario&apos;s Vertical Height = <span style={{ color: C.gold }}>32-Bit Float (IEEE 754)</span>
            </BigText>

            {/* 32-bit IEEE 754 layout diagram */}
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 54 }}>
              {/* Sign bit (1) */}
              <div style={{ padding: "22px 26px", borderRadius: 16, background: "rgba(255,77,94,0.18)", border: `2.5px solid ${C.red}` }}>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.red, fontWeight: 700 }}>SIGN (1 BIT)</div>
                <div style={{ fontFamily: MONO, fontSize: 54, color: C.white, fontWeight: 900, marginTop: 8 }}>1</div>
              </div>
              {/* Exponent (8 bits) */}
              <div style={{ padding: "22px 44px", borderRadius: 16, background: "rgba(255,194,77,0.18)", border: `2.5px solid ${C.gold}`, boxShadow: glow(C.gold, 10) }}>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.gold, fontWeight: 700 }}>EXPONENT · FIRST BYTE (0xC5)</div>
                <div style={{ fontFamily: MONO, fontSize: 54, color: C.gold, fontWeight: 900, marginTop: 8 }}>11000101</div>
              </div>
              {/* Mantissa (23 bits) */}
              <div style={{ padding: "22px 48px", borderRadius: 16, background: "rgba(62,224,255,0.1)", border: `2.5px solid ${C.cyan}` }}>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.cyan, fontWeight: 700 }}>MANTISSA (23 BITS · FRACTION)</div>
                <div style={{ fontFamily: MONO, fontSize: 44, color: C.dim, fontWeight: 700, marginTop: 14 }}>10011110100100000000000</div>
              </div>
            </div>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 2 & 3: C5 -> C4 Single Bit Flip & Live Tower Teleport */}
      <SceneFade from={tJust - 4} to={tNothing - 6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 70, top: 135, width: 1020, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Kicker color={C.gold} style={{ marginBottom: 20 }}>
              MARIO HEIGHT BYTE 0 · SINGLE BIT FLIP
            </Kicker>
            <BinaryRegister
              bits={[1, 1, 0, 0, 0, 1, 0, 1]}
              flippedIndex={7}
              flipAt={cue("changing C-five into C-four")}
              hexBefore="0xC5"
              hexAfter="0xC4"
              valBefore="Y = -1,658"
              valAfter="Y = -895"
              bitLabels={["Sign", "2^6", "2^5", "2^4", "2^3", "2^2", "2^1", "LSB"]}
              scale={0.95}
            />

            <Appear at={tFlip} style={{ marginTop: 42 }}>
              <Panel style={{ padding: "24px 42px", textAlign: "center" }} border={C.green}>
                <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 40, color: C.white }}>
                  1 Bit Flipped (<span style={{ color: C.red }}>1 → 0</span>) ={" "}
                  <span style={{ color: C.green }}>+763 Units Instant Upwarp</span>
                </div>
              </Panel>
            </Appear>
          </div>

          <div style={{ position: "absolute", right: 55, top: 140 }}>
            <MarioTowerUpwarpSVG warpAt={cue("changing C-five into C-four")} width={720} height={740} />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 4: Physical Force Inside the Silicon Chip */}
      <SceneFade from={tNothing - 4} to={cue.len + 30}>
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
            {/* Illustrated Microchip being struck by a physical particle */}
            <svg width={440} height={420} viewBox="0 0 440 420" style={{ filter: svgGlow(C.cyan, 6) }}>
              <rect x={90} y={90} width={260} height={240} rx={22} fill="rgba(10,20,48,0.9)" stroke={C.cyan} strokeWidth={5} />
              {new Array(6).fill(0).map((_, i) => (
                <g key={i} stroke={C.cyan} strokeWidth={5}>
                  <line x1={50} y1={125 + i * 34} x2={90} y2={125 + i * 34} />
                  <line x1={350} y1={125 + i * 34} x2={390} y2={125 + i * 34} />
                </g>
              ))}
              <rect x={140} y={140} width={160} height={140} rx={10} fill="rgba(255,77,94,0.18)" stroke={C.red} strokeWidth={3} />
              <line x1={20} y1={10} x2={220} y2={210} stroke={C.gold} strokeWidth={7} />
              <circle cx={220} cy={210} r={18} fill="#fff" />
              <text x={220} y={308} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={22}>
                N64 RDRAM DIE
              </text>
            </svg>

            <div style={{ width: 920 }}>
              <Kicker color={C.red}>ZERO GAME CODE PATHS TO 0xC4</Kicker>
              <BigText size={76} style={{ marginTop: 18 }}>
                Something <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>physical</span> reached inside the memory chip.
              </BigText>
            </div>
          </div>
        </Center>
      </SceneFade>

      <ChapterCard num={1} title="The $1,000 Glitch" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 2 — THE MICROSCOPIC BUCKET (DRAM Capacitor & 1970s vs Modern 3nm)
// ===========================================================================
export const CosmicCh2: React.FC = () => {
  const cue = makeCosmicCue("ch2");
  const t1970 = cue("In the nineteen-seventies");

  return (
    <AbsoluteFill>
      {/* Beat 1 & 2: Puddles of Electricity -> Full Bucket (1) vs Empty Bucket (0) */}
      <SceneFade from={0} to={t1970 - 6}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.cyan}>INSIDE DYNAMIC RAM (DRAM)</Kicker>
          <BigText size={68} style={{ marginTop: 10 }}>
            Bits Aren&apos;t Abstract Math — They Are <span style={{ color: C.gold }}>Buckets of Electrons</span>
          </BigText>

          <div style={{ display: "flex", gap: 130, marginTop: 34, alignItems: "center" }}>
            <Appear at={cue("physical puddles")} from="left">
              <CapacitorBucketSVG
                fillLevel={0.86}
                label="FULL BUCKET = 1"
                sublabel="CHARGED CAPACITOR (+V)"
                electronCount={22}
              />
            </Appear>

            <Appear at={cue("When the bucket is empty") - 20} from="right">
              <CapacitorBucketSVG
                fillLevel={0.04}
                label="EMPTY BUCKET = 0"
                sublabel="DISCHARGED CAPACITOR (0V)"
                electronCount={2}
              />
            </Appear>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3 & 4: 1970s Giant Bucket vs Modern Nanometer Bucket Overflow */}
      <SceneFade from={t1970 - 4} to={cue.len + 30}>
        <YearBadge year="1970s  →  2020s (3nm)" location="MOORE'S LAW CAPACITOR SHRINKAGE" at={t1970} color={C.cyan} />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 185 }}>
          <div style={{ display: "flex", gap: 90, alignItems: "stretch" }}>
            {/* 1970s Huge Bucket */}
            <Panel
              style={{
                padding: "36px 44px",
                textAlign: "center",
                width: 740,
                height: 760,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              border={C.cyan}
            >
              <div>
                <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 40, color: C.cyan }}>1970s DRAM CELL</div>
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: C.dim, marginTop: 8 }}>
                  ~1,000,000+ Electrons Needed to Flip
                </div>
              </div>
              <svg width={420} height={420} viewBox="0 0 420 420">
                <path d="M70,40 L70,350 L350,350 L350,40" fill="rgba(62,224,255,0.12)" stroke={C.cyan} strokeWidth={12} />
                <rect x={78} y={115} width={264} height={227} fill={C.cyan} fillOpacity={0.35} />
                <text x={210} y={245} textAnchor="middle" fill="#fff" fontFamily={INTER} fontWeight={900} fontSize={44}>
                  ROCK SOLID
                </text>
              </svg>
              <div>
                <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 32, color: C.white }}>
                  GIANT CHARGE CAPACITY
                </div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.cyan, marginTop: 6 }}>
                  IMMUNE TO STRAY NOISE ✓
                </div>
              </div>
            </Panel>

            {/* Modern Nanometer Bucket */}
            <Panel
              style={{
                padding: "36px 44px",
                textAlign: "center",
                width: 740,
                height: 760,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              border={C.red}
            >
              <div>
                <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 40, color: C.gold }}>MODERN NANOMETER CELL</div>
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 28, color: C.red, marginTop: 8 }}>
                  Only ~10,000 Electrons (Ultra-Fragile)
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", transform: "scale(0.84)", transformOrigin: "center center" }}>
                <CapacitorBucketSVG
                  fillLevel={0.08}
                  label="TINY STRAY SPLASH = FLIP!"
                  sublabel="0 OVERFLOWS TO 1"
                  strikeAt={cue("overflow the bucket") - 15}
                  width={460}
                  height={520}
                  electronCount={14}
                />
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      </SceneFade>

      <ChapterCard num={2} title="The Microscopic Bucket" />
    </AbsoluteFill>
  );
};
