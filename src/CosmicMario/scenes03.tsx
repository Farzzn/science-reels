import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, ChapterCard, Kicker, Panel, SceneFade } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { makeCosmicCue } from "./timing";
import { CapacitorBucketSVG, YearBadge } from "./visuals";

// ===========================================================================
// CHAPTER 6 — THE HONEST PHYSICS CHECK (1978 Intel Uranium + Zero Trace + 1996 IBM)
// ===========================================================================
export const CosmicCh6: React.FC = () => {
  const cue = makeCosmicCue("ch6");
  const frame = useCurrentFrame();

  const tIntel = cue("In the nineteen-seventies");
  const tSecond = cue("Second, can we ever");
  const tIbm = cue("However, IBM measured");

  return (
    <AbsoluteFill>
      {/* Beat 1: 1978 Intel Ceramic Packaging & Colorado River Uranium Alpha Particles */}
      <SceneFade from={0} to={tSecond - 6}>
        <YearBadge year="1978 · INTEL LABS" location="GREEN RIVER, COLORADO · CERAMIC CLAY CONTAMINATION" at={tIntel - 15} color={C.gold} />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
          <Kicker color={C.gold}>HONEST CHECK #1 · NOT EVERY BIT FLIP IS FROM SPACE</Kicker>
          <BigText size={64} style={{ marginTop: 12 }}>
            The Radioactive Ceramic Chip Package
          </BigText>

          <div style={{ display: "flex", gap: 90, marginTop: 42, alignItems: "center" }}>
            {/* Illustrated Cutaway of Ceramic Chip Emitting Alpha Particles onto Silicon Die */}
            <svg width={760} height={470} viewBox="0 0 760 470">
              {/* Outer Ceramic Lid (Uranium-contaminated clay) */}
              <rect x={80} y={40} width={600} height={110} rx={16} fill="rgba(255,194,77,0.18)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 6) }} />
              <text x={380} y={88} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28}>
                CERAMIC CHIP LID (COLORADO RIVER CLAY)
              </text>
              <text x={380} y={122} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={22}>
                TRACE URANIUM-238 &amp; THORIUM ATOMS
              </text>

              {/* Alpha particles shooting down from lid into silicon */}
              {[180, 310, 450, 560].map((x, i) => {
                const p = ((frame + i * 11) % 35) / 35;
                return (
                  <g key={i} style={{ filter: svgGlow(C.red, 6) }}>
                    <line x1={x} y1={150} x2={x} y2={300} stroke={C.red} strokeWidth={3} strokeDasharray="8 8" opacity={0.6} />
                    <circle cx={x} cy={150 + p * 150} r={11} fill={C.red} />
                    <text x={x + 18} y={155 + p * 150} fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={20}>
                      α
                    </text>
                  </g>
                );
              })}

              {/* Silicon Die Below */}
              <rect x={130} y={305} width={500} height={110} rx={14} fill="rgba(10,20,48,0.92)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 6) }} />
              <text x={380} y={368} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={30}>
                UNDERGROUND DRAM SILICON DIE
              </text>
            </svg>

            <div style={{ width: 720 }}>
              <Appear at={cue("deep underground")}>
                <Panel style={{ padding: "32px 40px" }} border={C.gold}>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: C.gold }}>EVEN SHIELDED UNDERGROUND</div>
                  <BigText size={48} style={{ marginTop: 12 }}>
                    Trace Uranium in the chip&apos;s own clay fired <span style={{ color: C.red }}>Alpha Particles</span> at the memory buckets.
                  </BigText>
                </Panel>
              </Appear>
            </div>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 2: Why SEUs Leave Zero Physical Evidence (2013 & 2003) */}
      <SceneFade from={tSecond - 4} to={tIbm - 6}>
        <YearBadge year="2003 & 2013" location="ZERO PERMANENT PHYSICAL TRACE" at={tSecond} color={C.cyan} />
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 90, width: 1620 }}>
            <CapacitorBucketSVG
              fillLevel={0.82}
              label="ZERO HARDWARE DAMAGE"
              sublabel="CRIME SCENE VANISHES ON REBOOT"
              width={480}
              height={520}
            />
            <div style={{ width: 980 }}>
              <Kicker color={C.cyan}>HONEST CHECK #2 · CAN WE PROVE IT 100%?</Kicker>
              <BigText size={68} style={{ marginTop: 14 }}>
                A Single-Event Upset Leaves <span style={{ color: C.gold }}>No Physical Scar</span>
              </BigText>
              <Appear at={cue("crime scene vanishes")} style={{ marginTop: 32 }}>
                <Panel style={{ padding: "28px 38px" }}>
                  <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 36, color: C.white, lineHeight: 1.35 }}>
                    Once the byte is overwritten or the console powers off, the flipped charge is gone forever.
                  </div>
                </Panel>
              </Appear>
            </div>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 3: 1990s IBM Laboratory Measurement */}
      <SceneFade from={tIbm - 4} to={cue.len + 30}>
        <YearBadge year="1996 · IBM RESEARCH" location="J.F. ZIEGLER COSMIC RAY LAB STUDY" at={tIbm} color={C.green} />
        <Center>
          <div style={{ textAlign: "center", width: 1560 }}>
            <Kicker color={C.green}>MEASURED IN A REAL LABORATORY</Kicker>
            <Appear at={cue("two hundred and fifty-six")} from="scale" style={{ marginTop: 28 }}>
              <Panel style={{ padding: "48px 72px", display: "inline-block" }} border={C.green}>
                <BigText size={115} color={C.gold} glowColor={C.gold}>
                  1 Bit Flip / 256 MB / Month
                </BigText>
                <div style={{ fontFamily: MONO, fontSize: 30, color: C.cyan, marginTop: 18 }}>
                  AT SEA LEVEL (AND UP TO 300× MORE AT ALTITUDE)
                </div>
              </Panel>
            </Appear>
          </div>
        </Center>
      </SceneFade>

      <ChapterCard num={6} title="The Honest Physics Check" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 7 — HOW ENGINEERS FIGHT THE UNIVERSE (ECC RAM 64+8 & 3-CPU TMR Voting)
// ===========================================================================
export const CosmicCh7: React.FC = () => {
  const cue = makeCosmicCue("ch7");
  const frame = useCurrentFrame();

  const tTmr = cue("And for spacecraft");

  const strikeFrame = cue("flips a single bucket");
  const healFrame = cue("flips the bit back");
  const isCorrupted = frame >= strikeFrame && frame < healFrame;
  const isHealed = frame >= healFrame;

  return (
    <AbsoluteFill>
      {/* Beat 1 & 2: ECC RAM (64 Data Buckets + 8 Parity Buckets Self-Healing) */}
      <SceneFade from={0} to={tTmr - 6}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.cyan}>DEFENSE #1 · ERROR-CORRECTING CODE (ECC RAM)</Kicker>
          <BigText size={66} style={{ marginTop: 10 }}>
            <span style={{ color: C.cyan }}>64 Data Buckets</span> +{" "}
            <span style={{ color: C.gold }}>8 Parity Math Buckets</span>
          </BigText>

          <div style={{ display: "flex", gap: 64, marginTop: 42, alignItems: "center" }}>
            {/* 8x8 Data Bit Matrix (64 bits) */}
            <Panel style={{ padding: "30px 36px" }} border={isCorrupted ? C.red : C.cyan}>
              <div style={{ fontFamily: MONO, fontSize: 22, color: C.cyan, marginBottom: 16, fontWeight: 700 }}>
                64-BIT DATA MATRIX (8×8)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 52px)", gap: 10 }}>
                {new Array(64).fill(0).map((_, i) => {
                  const isTarget = i === 27; // Row 3, Col 3
                  const col = isTarget
                    ? isCorrupted
                      ? C.red
                      : isHealed
                        ? C.green
                        : C.cyan
                    : i % 3 === 0
                      ? C.cyan
                      : "rgba(62,224,255,0.28)";
                  return (
                    <div
                      key={i}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        background: isTarget && (isCorrupted || isHealed) ? col : "rgba(10,20,48,0.9)",
                        border: `2px solid ${col}`,
                        boxShadow: isTarget && (isCorrupted || isHealed) ? glow(col, 12) : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: MONO,
                        fontWeight: 900,
                        fontSize: 24,
                        color: isTarget && (isCorrupted || isHealed) ? "#040814" : C.white,
                      }}
                    >
                      {isTarget ? (isCorrupted ? "1!" : "0") : i % 2}
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* + 8 Hamming Parity Buckets */}
            <Panel style={{ padding: "30px 36px" }} border={C.gold}>
              <div style={{ fontFamily: MONO, fontSize: 22, color: C.gold, marginBottom: 16, fontWeight: 700 }}>
                +8 PARITY BITS (HAMMING CODE)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 68px)", gap: 14 }}>
                {new Array(8).fill(0).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 12,
                      background: "rgba(255,194,77,0.16)",
                      border: `2.5px solid ${C.gold}`,
                      boxShadow: glow(C.gold, 8),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: MONO,
                      fontWeight: 900,
                      fontSize: 28,
                      color: C.gold,
                    }}
                  >
                    P{i}
                  </div>
                ))}
              </div>
            </Panel>

            {/* Status Readout Panel */}
            <div style={{ width: 520 }}>
              <Panel
                style={{ padding: "32px 36px" }}
                border={isCorrupted ? C.red : isHealed ? C.green : C.panelBorder}
              >
                <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>ECC CONTROLLER STATUS</div>
                <div
                  style={{
                    fontFamily: INTER,
                    fontWeight: 900,
                    fontSize: 42,
                    color: isCorrupted ? C.red : isHealed ? C.green : C.cyan,
                    marginTop: 12,
                  }}
                >
                  {isCorrupted
                    ? "PARITY MISMATCH @ BIT 27!"
                    : isHealed
                      ? "BIT 27 AUTO-HEALED IN 2ns ✓"
                      : "PARITY FINGERPRINT LOCKED"}
                </div>
              </Panel>
            </div>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3: Triple Modular Redundancy (3 Processors Voting 2 vs 1) */}
      <SceneFade from={tTmr - 4} to={cue.len + 30}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <Kicker color={C.green}>DEFENSE #2 · TRIPLE MODULAR REDUNDANCY (SPACECRAFT &amp; JETS)</Kicker>
          <BigText size={68} style={{ marginTop: 10 }}>
            Three Processors Run the Same Math &amp; <span style={{ color: C.gold }}>Hold a Vote</span>
          </BigText>

          <TMRVotingSVG corruptAt={cue("corrupts Processor A")} voteAt={cue("outvote it")} />
        </AbsoluteFill>
      </SceneFade>

      <ChapterCard num={7} title="How Engineers Fight the Universe" />
    </AbsoluteFill>
  );
};

const TMRVotingSVG: React.FC<{ corruptAt: number; voteAt: number }> = ({ corruptAt, voteAt }) => {
  const frame = useCurrentFrame();
  const isHit = frame >= corruptAt;
  const isVoted = frame >= voteAt;

  const cpus = [
    { name: "PROCESSOR A", out: isHit ? "0xC4 (CORRUPTED!)" : "0xC5", ok: !isHit, y: 110 },
    { name: "PROCESSOR B", out: "0xC5 (VALID)", ok: true, y: 310 },
    { name: "PROCESSOR C", out: "0xC5 (VALID)", ok: true, y: 510 },
  ];

  return (
    <svg width={1560} height={680} viewBox="0 0 1560 680" style={{ marginTop: 20 }}>
      {cpus.map((cpu) => {
        const col = cpu.ok ? C.cyan : C.red;
        return (
          <g key={cpu.name}>
            {/* Line to Voter Gate */}
            <line
              x1={480}
              y1={cpu.y + 60}
              x2={920}
              y2={370}
              stroke={col}
              strokeWidth={4}
              strokeDasharray={cpu.ok ? undefined : "10 8"}
              style={{ filter: svgGlow(col, 5) }}
            />
            {/* CPU Box */}
            <rect
              x={80}
              y={cpu.y}
              width={400}
              height={120}
              rx={18}
              fill="rgba(10,20,48,0.9)"
              stroke={col}
              strokeWidth={4}
              style={{ filter: svgGlow(col, 6) }}
            />
            <text x={280} y={cpu.y + 48} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
              {cpu.name}
            </text>
            <text x={280} y={cpu.y + 88} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={800} fontSize={24}>
              {cpu.out}
            </text>
          </g>
        );
      })}

      {/* Cosmic Ray Striking Processor A */}
      {isHit && (
        <g style={{ filter: svgGlow(C.red, 10) }}>
          <line x1={20} y1={10} x2={260} y2={130} stroke={C.red} strokeWidth={7} />
          <circle cx={260} cy={130} r={14} fill="#fff" />
        </g>
      )}

      {/* Majority Voter Gate */}
      <g transform="translate(920, 250)" style={{ filter: svgGlow(C.green, 8) }}>
        <rect x={0} y={0} width={540} height={240} rx={24} fill="rgba(10,20,48,0.95)" stroke={C.green} strokeWidth={5} />
        <text x={270} y={70} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={26}>
          MAJORITY VOTING GATE
        </text>
        <text x={270} y={135} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={54}>
          {isVoted ? "2 vs 1 VOTE ✓" : "3 vs 0 MATCH"}
        </text>
        <text x={270} y={195} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={800} fontSize={28}>
          OUTPUT: 0xC5 (ZERO CRASH)
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CHAPTER 8 — THE COSMIC TAKEAWAY (Unshielded Home RAM + 3 Outcomes + Next Ep)
// ===========================================================================
export const CosmicCh8: React.FC = () => {
  const cue = makeCosmicCue("ch8");
  const frame = useCurrentFrame();

  const tMostTime = cue("Most of the time");
  const tHumbling = cue("It's a humbling");
  const tEp = cue("This was Episode Two");

  const press = interpolate(
    frame,
    [cue("Subscribe") + 15, cue("Subscribe") + 20, cue("Subscribe") + 28],
    [1, 0.9, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const subbed = frame > cue("Subscribe") + 20;

  return (
    <AbsoluteFill>
      {/* Beat 1 & 2: Unshielded Consumer RAM & 3 Outcomes (Pixel -> Crash -> Mario) */}
      <SceneFade from={0} to={tHumbling - 6}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
          <Kicker color={C.gold}>YOUR LAPTOP &amp; CONSOLE RIGHT NOW: NO ECC RAM</Kicker>
          <BigText size={66} style={{ marginTop: 12 }}>
            What Happens When a Cosmic Ray Hits Your Device?
          </BigText>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 520px)", gap: 38, marginTop: 52 }}>
            {/* Outcome 1: 1 Pixel Flash */}
            <Appear at={tMostTime} from="up">
              <Panel style={{ padding: "36px 34px", height: 470, textAlign: "center" }} border={C.cyan}>
                <Kicker color={C.cyan} style={{ fontSize: 22 }}>99.99% OF THE TIME</Kicker>
                <BigText size={44} style={{ marginTop: 14 }}>
                  1 Pixel Flashes for 1/60th Sec
                </BigText>
                <svg width={240} height={220} viewBox="0 0 240 220" style={{ marginTop: 28 }}>
                  {new Array(5).fill(0).map((_, r) =>
                    new Array(5).fill(0).map((__, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={30 + c * 38}
                        y={20 + r * 38}
                        width={32}
                        height={32}
                        rx={4}
                        fill={r === 2 && c === 2 ? C.gold : "rgba(62,224,255,0.18)"}
                      />
                    )),
                  )}
                </svg>
              </Panel>
            </Appear>

            {/* Outcome 2: Program Crash */}
            <Appear at={cue("Once in a million")} from="up">
              <Panel style={{ padding: "36px 34px", height: 470, textAlign: "center" }} border={C.red}>
                <Kicker color={C.red} style={{ fontSize: 22 }}>1 IN 1,000,000 TIMES</Kicker>
                <BigText size={44} style={{ marginTop: 14 }}>
                  Random App Freeze or Blue Screen
                </BigText>
                <svg width={240} height={220} viewBox="0 0 240 220" style={{ marginTop: 28 }}>
                  <rect x={25} y={25} width={190} height={150} rx={14} fill="rgba(255,77,94,0.2)" stroke={C.red} strokeWidth={4} />
                  <text x={120} y={115} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={48}>
                    :( BSOD
                  </text>
                </svg>
              </Panel>
            </Appear>

            {/* Outcome 3: Mario Teleport */}
            <Appear at={cue("once in gaming history")} from="up">
              <Panel style={{ padding: "36px 34px", height: 470, textAlign: "center" }} border={C.gold}>
                <Kicker color={C.gold} style={{ fontSize: 22 }}>1 IN GAMING HISTORY</Kicker>
                <BigText size={44} style={{ marginTop: 14 }}>
                  Mario Teleports Through a Ceiling
                </BigText>
                <svg width={240} height={220} viewBox="0 0 240 220" style={{ marginTop: 28 }}>
                  <rect x={30} y={40} width={180} height={16} rx={4} fill={C.gold} />
                  <line x1={120} y1={180} x2={120} y2={55} stroke={C.cyan} strokeWidth={8} strokeDasharray="10 6" />
                  <text x={120} y={135} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={32}>
                    C5 → C4
                  </text>
                </svg>
              </Panel>
            </Appear>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3: The Cosmic Takeaway (Bucket + Dying Star Echo) */}
      <SceneFade from={tHumbling - 4} to={tEp - 6}>
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 90, width: 1620 }}>
            <CapacitorBucketSVG
              fillLevel={0.75}
              label="NANOMETER MEMORY CELL"
              sublabel="FEELS THE ECHO OF ANCIENT STARS"
              width={460}
              height={500}
            />
            <div style={{ width: 1020 }}>
              <Kicker color={C.gold}>THE COSMIC PERSPECTIVE</Kicker>
              <BigText size={74} style={{ marginTop: 18, lineHeight: 1.15 }}>
                We built machines so small that they feel the echo of{" "}
                <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>stars that died millions of years ago.</span>
              </BigText>
            </div>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 4: Physics Bugs Ep 2 End Card & Next Episode Teaser */}
      <SceneFade from={tEp - 4} to={cue.len + 40} zoom={false}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Kicker color={C.cyan} style={{ fontSize: 30 }}>
              PHYSICS BUGS · EPISODE 02
            </Kicker>
            <Appear at={cue("Next time")} from="scale" style={{ marginTop: 24 }}>
              <BigText size={160} color={C.red} glowColor={C.red}>
                +1 SECOND
              </BigText>
              <BigText size={54} style={{ marginTop: 12 }}>
                Next Episode: The day one extra second crashed half the internet
              </BigText>
            </Appear>

            <Appear at={cue("Subscribe")} style={{ marginTop: 58 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "24px 72px",
                  borderRadius: 60,
                  background: subbed ? C.green : C.red,
                  color: subbed ? "#040814" : "#fff",
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontSize: 52,
                  transform: `scale(${press})`,
                  boxShadow: glow(subbed ? C.green : C.red, 14),
                }}
              >
                {subbed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
              </div>
            </Appear>
          </div>
        </Center>
      </SceneFade>

      <ChapterCard num={8} title="The Cosmic Takeaway" />
    </AbsoluteFill>
  );
};
