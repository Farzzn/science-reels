import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import shortData from "../../public/cosmic/short-words.json";
import { Appear, BigText, Kicker, Panel, SceneFade } from "../FiveHundredMileEmail/components";
import { C, FPS, glow, INTER, MONO } from "../FiveHundredMileEmail/theme";
import { BinaryRegister, CapacitorBucketSVG, MarioTowerUpwarpSVG } from "./visuals";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const COSMIC_MARIO_SHORT_FRAMES = Math.ceil((shortData.duration + 0.6) * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, "");

const scue = (phrase: string, offsetSec = 0): number => {
  const target = norm(phrase);
  for (let i = 0; i < SHORT_WORDS.length; i++) {
    let acc = "";
    for (let j = i; j < SHORT_WORDS.length && acc.length < target.length; j++) {
      acc += norm(SHORT_WORDS[j].w);
      if (acc === target) return Math.round((SHORT_WORDS[i].s + offsetSec) * FPS);
      if (!target.startsWith(acc)) break;
    }
  }
  return 0;
};

// ===========================================================================
// 9:16 VERTICAL BACKGROUND (1080x1920)
// ===========================================================================
const VerticalBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 80;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 35%, ${C.bg1} 0%, ${C.bg0} 75%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 35%, transparent 82%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// BURNED-IN WORD-ALIGNED SUBTITLES (WITH UNCONDITIONAL marginRight: '0.32em')
// ===========================================================================
const HIGHLIGHT_SET = new Set([
  "twenty",
  "thirteen",
  "mario",
  "teleported",
  "ceiling",
  "jump",
  "thousand",
  "dollar",
  "bounty",
  "succeeded",
  "bit",
  "height",
  "cfive",
  "cfour",
  "particle",
  "exploding",
  "star",
  "space",
  "bucket",
  "ninety",
  "six",
  "belgium",
  "jet",
  "thirty",
  "seven",
  "channel",
]);

const ShortSubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const chunks = useMemo(() => {
    const out: { words: ShortWord[]; s: number; e: number }[] = [];
    let cur: ShortWord[] = [];
    for (let i = 0; i < SHORT_WORDS.length; i++) {
      const w = SHORT_WORDS[i];
      cur.push(w);
      const isEnd = /[.?!:"]$/.test(w.w) || cur.length >= 4;
      if (isEnd) {
        out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
        cur = [];
      }
    }
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    return out;
  }, []);

  const activeChunk = useMemo(() => {
    for (let i = 0; i < chunks.length; i++) {
      const nextS = i + 1 < chunks.length ? chunks[i + 1].s : 999;
      if (t >= chunks[i].s - 0.12 && t < nextS) return chunks[i];
    }
    return chunks[chunks.length - 1];
  }, [chunks, t]);

  if (!activeChunk || t > shortData.duration + 0.3) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 195,
        paddingLeft: 54,
        paddingRight: 54,
      }}
    >
      <div
        style={{
          background: "rgba(4, 8, 20, 0.82)",
          border: "1.5px solid rgba(62, 224, 255, 0.26)",
          borderRadius: 24,
          padding: "20px 32px",
          textAlign: "center",
          maxWidth: 960,
          boxShadow: "0 14px 40px rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        {activeChunk.words.map((w, idx) => {
          const isCurrent = t >= w.s - 0.05 && t <= w.e + 0.18;
          const clean = norm(w.w);
          const isKeyword = HIGHLIGHT_SET.has(clean);
          const color = isCurrent ? C.gold : isKeyword ? "#ffe082" : C.white;
          return (
            <span
              key={`${idx}-${w.s}`}
              style={{
                display: "inline-block",
                marginRight: "0.32em",
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 52,
                lineHeight: 1.25,
                color,
                transform: isCurrent ? "scale(1.06)" : "scale(1)",
                textShadow: isCurrent ? glow(C.gold, 10) : "0 4px 16px rgba(0,0,0,0.95)",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
//VERTICAL YEAR BANNER FOR SHORT (1080x1920)
// ===========================================================================
const ShortYearPill: React.FC<{ year: string; sub: string; color?: string }> = ({
  year,
  sub,
  color = C.gold,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      padding: "10px 26px",
      borderRadius: 40,
      background: "rgba(8, 15, 36, 0.88)",
      border: `2px solid ${color}`,
      boxShadow: glow(color, 10),
    }}
  >
    <span style={{ fontFamily: MONO, fontWeight: 900, fontSize: 30, color, letterSpacing: 2 }}>
      {year}
    </span>
    <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 22, color: C.white, letterSpacing: 1 }}>
      · {sub}
    </span>
  </div>
);

// ===========================================================================
// MAIN 9:16 SHORT COMPOSITION: CosmicMarioShort
// ===========================================================================
export const CosmicMarioShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tBounty = scue("A famous analyst");
  const tProgrammers = scue("When programmers worked");
  const tNothing = scue("Nothing in the game's");
  const tWait = scue("Wait till you see");
  const tBelgium = scue("added four thousand");
  const tJet = scue("nearly crashed");
  const tToWatch = scue("To watch the full");

  const belgiumPop = spring({
    frame: Math.max(0, frame - (tBelgium - 6)),
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const jetPop = spring({
    frame: Math.max(0, frame - (tJet - 6)),
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const jetDiveAngle = interpolate(frame, [tJet, tJet + 45], [0, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const teaserFadeOut = interpolate(frame, [tToWatch - 14, tToWatch - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardPop = spring({
    frame: Math.max(0, frame - (tToWatch - 6)),
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const pulse = 1 + 0.024 * Math.sin(frame / 6);

  return (
    <AbsoluteFill>
      <VerticalBackground />

      {/* SCENE 1 (0.0s -> ~9.7s): Sept 2013 Mario Upwarp Through Ceiling */}
      <SceneFade from={0} to={tBounty - 4}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
          <ShortYearPill year="SEPTEMBER 2013" sub="SUPER MARIO 64 SPEEDRUN" color={C.gold} />
          <BigText size={68} style={{ textAlign: "center", marginTop: 22 }}>
            The Impossible
            <br />
            <span style={{ color: C.gold, textShadow: glow(C.gold, 12) }}>Ceiling Teleport</span>
          </BigText>

          {/* Hero Upwarp Image + Live Animated Tower SVG */}
          <div style={{ position: "relative", marginTop: 28, width: 920, height: 960, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 820,
                height: 440,
                borderRadius: 28,
                overflow: "hidden",
                border: `3px solid ${C.gold}`,
                boxShadow: glow(C.gold, 16),
              }}
            >
              <Img
                src={staticFile("cosmic/mario-upwarp.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "22% 50%" }}
              />
            </div>

            <div style={{ marginTop: -20, transform: "scale(0.84)", transformOrigin: "top center" }}>
              <MarioTowerUpwarpSVG warpAt={scue("suddenly teleported")} width={780} height={640} />
            </div>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 2 (~9.7s -> ~18.6s): $1,000 Bounty & 0 Successful Recreations */}
      <SceneFade from={tBounty - 4} to={tProgrammers - 4}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
          <Kicker color={C.gold} style={{ fontSize: 28 }}>
            UNSOLVED GAMING MYSTERY
          </Kicker>

          <Panel style={{ padding: "40px 56px", textAlign: "center", width: 880, marginTop: 28 }} border={C.gold}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.cyan, fontWeight: 700 }}>
              BOUNTY TO REPEAT IT ON N64
            </div>
            <BigText size={150} color={C.gold} glowColor={C.gold} style={{ marginTop: 10 }}>
              $1,000
            </BigText>
          </Panel>

          <Appear at={scue("Thousands tried")} style={{ marginTop: 38, width: 880 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {new Array(12).fill(0).map((_, i) => {
                const show = frame >= scue("Thousands tried") + i * 2;
                return (
                  <div
                    key={i}
                    style={{
                      height: 76,
                      borderRadius: 16,
                      background: "rgba(255,77,94,0.16)",
                      border: `2px solid ${C.red}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: MONO,
                      fontWeight: 900,
                      fontSize: 26,
                      color: C.red,
                      opacity: show ? 1 : 0.15,
                    }}
                  >
                    FAIL ✕
                  </div>
                );
              })}
            </div>
          </Appear>

          <Appear at={scue("Not a single person")} style={{ marginTop: 42 }}>
            <BigText size={74} color={C.red} glowColor={C.red} style={{ textAlign: "center" }}>
              0 PLAYERS SUCCEEDED
            </BigText>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 3 (~18.6s -> ~29.9s): The 1-Bit Memory Flip (C5 -> C4) */}
      <SceneFade from={tProgrammers - 4} to={tNothing - 4}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
          <Kicker color={C.cyan} style={{ fontSize: 28 }}>
            INSIDE THE N64 RAM CHIP
          </Kicker>
          <BigText size={66} style={{ textAlign: "center", marginTop: 14 }}>
            Mario&apos;s Height Byte
            <br />
            <span style={{ color: C.gold }}>1 Single Bit Flipped</span>
          </BigText>

          <div style={{ marginTop: 38 }}>
            <BinaryRegister
              bits={[1, 1, 0, 0, 0, 1, 0, 1]}
              flippedIndex={7}
              flipAt={scue("changing hexadecimal C-five")}
              hexBefore="0xC5"
              hexAfter="0xC4"
              valBefore="Y = -1658"
              valAfter="Y = -895"
              scale={0.94}
            />
          </div>

          <div style={{ marginTop: 10, transform: "scale(0.82)", transformOrigin: "top center" }}>
            <MarioTowerUpwarpSVG warpAt={scue("changing hexadecimal C-five")} width={780} height={640} />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 4 (~29.9s -> ~43.7s): Supernova Cosmic Ray Hits Microscopic Memory Bucket */}
      <SceneFade from={tNothing - 4} to={tWait - 4}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 115 }}>
          <Kicker color={C.red} style={{ fontSize: 28 }}>
            ZERO GAME CODE COULD WRITE 0xC4
          </Kicker>
          <BigText size={64} style={{ textAlign: "center", marginTop: 12 }}>
            A Particle From an <span style={{ color: C.gold }}>Exploding Star</span>
          </BigText>

          <div
            style={{
              width: 880,
              height: 420,
              borderRadius: 26,
              overflow: "hidden",
              border: `3px solid ${C.cyan}`,
              boxShadow: glow(C.cyan, 14),
              marginTop: 28,
            }}
          >
            <Img src={staticFile("cosmic/supernova-ray.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ marginTop: 18, transform: "scale(0.88)", transformOrigin: "top center" }}>
            <CapacitorBucketSVG
              fillLevel={0.08}
              label="SINGLE-EVENT UPSET (0 → 1)"
              sublabel="COSMIC RAY OVERFLOWS THE BUCKET"
              strikeAt={scue("physically flipped") - 10}
              width={460}
              height={500}
              electronCount={18}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 5 (~44.1s -> end): 2003 Election + 2008 Airliner Visuals -> YouTube Video Card CTA */}
      <SceneFade from={tWait - 4} to={COSMIC_MARIO_SHORT_FRAMES + 30} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 95 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <ShortYearPill year="2003" sub="+4,096 VOTES" color={C.gold} />
            <ShortYearPill year="2008" sub="FLIGHT 72 DIVE" color={C.red} />
          </div>

          <Appear at={tWait} style={{ marginTop: 22, padding: "0 50px", textAlign: "center" }}>
            <BigText size={54} color={C.white}>
              The same cosmic bit-flip rigged a <span style={{ color: C.gold }}>Belgian election</span> &amp; pitched an{" "}
              <span style={{ color: C.red }}>Airbus jet into a dive!</span>
            </BigText>
          </Appear>

          {/* Visual Showcase Area (44.1s -> 53.2s): Belgium Flag + Ballot Box & Qantas A330 Diving */}
          <div style={{ position: "relative", width: 940, height: 960, marginTop: 30 }}>
            {frame < tToWatch && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  opacity: teaserFadeOut,
                }}
              >
                {/* Card A: 2003 Belgium Flag + Electronic Voting Box (+4,096 = 2^12) */}
                <div
                  style={{
                    opacity: interpolate(belgiumPop, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(belgiumPop, [0, 1], [50, 0])}px) scale(${interpolate(belgiumPop, [0, 1], [0.92, 1])})`,
                  }}
                >
                  <Panel
                    style={{
                      padding: "28px 34px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 28,
                    }}
                    border={C.gold}
                  >
                    {/* Crisp Belgium Flag SVG + Ballot Box Icon */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <svg width={186} height={124} viewBox="0 0 186 124" style={{ borderRadius: 12, overflow: "hidden", border: `2px solid rgba(255,255,255,0.28)` }}>
                        <rect x={0} y={0} width={62} height={124} fill="#141414" />
                        <rect x={62} y={0} width={62} height={124} fill="#FDDA24" />
                        <rect x={124} y={0} width={62} height={124} fill="#EF3340" />
                      </svg>
                      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.gold, letterSpacing: 2 }}>
                        SCHAERBEEK, BELGIUM
                      </div>
                    </div>

                    {/* Animated Ballot Tally + 2^12 Flip */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontSize: 22, color: C.cyan, fontWeight: 700 }}>
                        MAY 18, 2003 · VOTING MACHINE
                      </div>
                      <div
                        style={{
                          fontFamily: INTER,
                          fontWeight: 900,
                          fontSize: 64,
                          color: C.gold,
                          textShadow: glow(C.gold, 12),
                          marginTop: 6,
                        }}
                      >
                        +4,096 VOTES
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 24, color: C.white, marginTop: 8 }}>
                        BIT #12 FLIPPED (<span style={{ color: C.red }}>0 → 1</span>) = <span style={{ color: C.gold }}>2¹²</span>
                      </div>
                    </div>
                  </Panel>
                </div>

                {/* Card B: 2008 Qantas Flight 72 Airbus A330 Diving at 37,000 ft */}
                <div
                  style={{
                    opacity: interpolate(jetPop, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(jetPop, [0, 1], [50, 0])}px) scale(${interpolate(jetPop, [0, 1], [0.92, 1])})`,
                  }}
                >
                  <Panel style={{ padding: "24px 28px" }} border={C.red}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 22, color: C.red, letterSpacing: 1.5, whiteSpace: "nowrap" }}>
                        OCT 7, 2008 · QANTAS FLIGHT 72
                      </div>
                      <div
                        style={{
                          fontFamily: MONO,
                          fontWeight: 900,
                          fontSize: 21,
                          color: C.gold,
                          padding: "6px 14px",
                          borderRadius: 10,
                          background: "rgba(255,77,94,0.22)",
                          border: `1.5px solid ${C.red}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        37,000 FT · -650 FT DIVE!
                      </div>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: 360,
                        borderRadius: 20,
                        overflow: "hidden",
                        border: `2.5px solid ${C.red}`,
                        boxShadow: glow(C.red, 14),
                      }}
                    >
                      <Img
                        src={staticFile("cosmic/qantas-a330.png")}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: `scale(1.12) rotate(${jetDiveAngle}deg)`,
                        }}
                      />
                    </div>
                  </Panel>
                </div>
              </div>
            )}

            {/* Uploaded YouTube Video Screenshot Card (appears cleanly on "To watch the full...") */}
            {frame >= tToWatch - 8 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(cardPop, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(cardPop, [0, 1], [0.78, 1]) * pulse})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 900,
                    fontSize: 28,
                    color: C.gold,
                    letterSpacing: 3,
                    marginBottom: 18,
                    textShadow: glow(C.gold, 10),
                  }}
                >
                  ▼ FULL 11-MIN VIDEO ON THE CHANNEL ▼
                </div>

                <div
                  style={{
                    width: 920,
                    borderRadius: 28,
                    overflow: "hidden",
                    border: `4px solid ${C.gold}`,
                    boxShadow: `0 24px 70px rgba(0,0,0,0.88), ${glow(C.gold, 18)}`,
                    background: "#ffffff",
                    padding: 14,
                  }}
                >
                  <Img
                    src={staticFile("cosmic/yt-video-card.png")}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: 18,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </SceneFade>

      <ShortSubtitleLayer />
      <Audio src={staticFile("cosmic/short-voiceover.wav")} />
    </AbsoluteFill>
  );
};
