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
import shortData from "../../public/email500/short-words.json";
import { Appear, BigText, Center, Kicker, Panel, prog, SceneFade, Terminal } from "./components";
import { EnvelopeIcon, PhoneIcon, Stopwatch } from "./icons";
import { CITIES, HOME, milesBetween, USMap } from "./maps";
import { C, FPS, glow, INTER, MONO } from "./theme";

type ShortWord = { w: string; k: string; s: number; e: number };
const SHORT_WORDS = shortData.words as ShortWord[];
export const FIVE_HUNDRED_MILE_SHORT_FRAMES = Math.ceil((shortData.duration + 0.8) * FPS);

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
  "nineteen",
  "nineties",
  "impossible",
  "five",
  "hundred",
  "miles",
  "broken",
  "circle",
  "failed",
  "distance",
  "instantly",
  "downgraded",
  "timeout",
  "zero",
  "three",
  "milliseconds",
  "speed",
  "light",
  "math",
  "catch",
  "eleven",
  "minute",
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
        paddingBottom: 220,
        paddingLeft: 56,
        paddingRight: 56,
      }}
    >
      <div
        style={{
          background: "rgba(4, 8, 20, 0.78)",
          border: "1.5px solid rgba(62, 224, 255, 0.24)",
          borderRadius: 24,
          padding: "20px 32px",
          textAlign: "center",
          maxWidth: 960,
          boxShadow: "0 14px 40px rgba(0,0,0,0.75)",
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
// MAIN 9:16 SHORT COMPOSITION
// ===========================================================================
export const FiveHundredMileShort: React.FC = () => {
  const frame = useCurrentFrame();

  const tQuote = scue("We can't send email");
  const tNot = scue("Not \"email is broken");
  const tHow = scue("How can an email");
  const tWhen = scue("When he logged");
  const tThen = scue("Then he noticed");
  const tAnd = scue("And how far");
  const tWait = scue("Wait till you see");
  const tToWatch = scue("To watch the full");

  const city = (n: string) => CITIES.find((c) => c.name === n)!.ll;
  const nearPings = CITIES.filter((c) => milesBetween(HOME, c.ll) < 460).slice(0, 7);
  const farPings = CITIES.filter((c) => milesBetween(HOME, c.ll) > 650).slice(0, 8);

  const ringing = frame < tQuote;
  const shake = ringing ? Math.sin(frame * 2.2) * 6 : 0;

  return (
    <AbsoluteFill>
      <VerticalBackground />

      {/* SCENE 1 (0.0s - 8.5s): Ringing Phone + 500 Miles Quote */}
      <SceneFade from={0} to={tNot - 4}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
          <Kicker style={{ fontSize: 28 }}>TRUE 1990s SYSADMIN MYSTERY</Kicker>
          <div style={{ position: "relative", marginTop: 70, width: 290, height: 290 }}>
            {ringing
              ? [0, 1, 2].map((i) => {
                  const r = ((frame + i * 12) % 36) / 36;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        inset: -r * 100,
                        borderRadius: "50%",
                        border: `3px solid ${C.gold}`,
                        opacity: 1 - r,
                      }}
                    />
                  );
                })
              : null}
            <div style={{ transform: `translateX(${shake}px) rotate(${shake * 0.6}deg)` }}>
              <PhoneIcon size={290} color={C.gold} lift={ringing ? 0.4 + 0.4 * Math.sin(frame) : 0} />
            </div>
          </div>

          <Appear at={scue("impossible complaint")} style={{ marginTop: 40 }}>
            <Kicker color={C.cyan} style={{ fontSize: 28 }}>
              STATISTICS DEPT COMPLAINT:
            </Kicker>
          </Appear>

          <Appear at={tQuote - 4} style={{ marginTop: 34, padding: "0 56px" }}>
            <Panel style={{ padding: "42px 48px", textAlign: "center" }} border={C.gold}>
              <div
                style={{
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontSize: 68,
                  color: C.white,
                  lineHeight: 1.14,
                }}
              >
                <span style={{ color: C.gold }}>“</span>
                We can&apos;t send email more than{" "}
                <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>500 miles.</span>
                <span style={{ color: C.gold }}>”</span>
              </div>
            </Panel>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 2 (8.5s - 17.7s): The 500-Mile Circle on the US Map */}
      <SceneFade from={tNot - 4} to={tHow - 4}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
          <Kicker color={C.gold} style={{ fontSize: 26 }}>
            THE STATISTICIANS MAPPED IT
          </Kicker>
          <BigText size={68} style={{ textAlign: "center", marginTop: 16 }}>
            Works <span style={{ color: C.green }}>inside</span> 500 mi.
            <br />
            Fails <span style={{ color: C.red }}>outside</span>.
          </BigText>
          <div style={{ marginTop: 40 }}>
            <USMap
              width={1020}
              height={740}
              circleAt={scue("five-hundred-mile circle")}
              circleLabel="500 MI"
              circleLabelAt={scue("five-hundred-mile circle") + 15}
              pings={[
                ...nearPings.map((c, i) => ({ ll: c.ll, at: scue("worked perfectly") + i * 4, ok: true })),
                ...farPings.map((c, i) => ({ ll: c.ll, at: scue("Outside that circle") + i * 4, ok: false })),
              ]}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 3 (17.7s - 20.1s): How can an email run out of distance? */}
      <SceneFade from={tHow - 4} to={tWhen - 4}>
        <Center>
          <div style={{ textAlign: "center", padding: "0 60px", marginBottom: 180 }}>
            <EnvelopeIcon size={200} color={C.red} />
            <BigText size={82} color={C.white} style={{ marginTop: 30 }}>
              How can an email
              <br />
              run out of <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>distance?!</span>
            </BigText>
          </div>
        </Center>
      </SceneFade>

      {/* SCENE 4 (20.1s - 27.4s): Testing Servers by Hand (Terminal + Map) */}
      <SceneFade from={tWhen - 4} to={tThen - 4} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
          <Kicker style={{ fontSize: 26 }}>LIVE SERVER TEST</Kicker>
          <div style={{ marginTop: 24 }}>
            <Terminal
              width={960}
              height={420}
              fontSize={26}
              title="mailhost — telnet test"
              lines={[
                { at: tWhen + 4, text: "telnet smtp.raleigh.edu 25", prompt: true },
                { at: scue("nearby universities"), text: "Connected.  ✓   (~25 mi)", color: C.green },
                { at: scue("connected instantly"), text: "telnet smtp.washington.edu 25", prompt: true },
                { at: scue("connected instantly") + 12, text: "Connected.  ✓   (~230 mi)", color: C.green },
                { at: scue("Distant servers") - 10, text: "telnet smtp.california.edu 25", prompt: true },
                { at: scue("failed on the spot"), text: "Connection timed out ✗ (~2,400 mi)", color: C.red },
              ]}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <USMap
              width={980}
              height={660}
              circleAt={tWhen}
              pings={[
                { ll: city("Raleigh"), at: scue("nearby universities"), ok: true },
                { ll: city("Washington"), at: scue("connected instantly") + 10, ok: true },
                { ll: city("San Francisco"), at: scue("failed on the spot"), ok: false },
                { ll: city("Dallas"), at: scue("failed on the spot") + 8, ok: false },
              ]}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* SCENE 5 (27.4s - 39.2s): Sendmail v8 -> v5 Downgrade & Timeout = 0 (3ms) */}
      <SceneFade from={tThen - 4} to={tAnd - 4}>
        <ShortCulpritScene
          downAt={scue("quietly downgraded")}
          zeroAt={scue("timeout setting to zero")}
          msAt={scue("three milliseconds")}
        />
      </SceneFade>

      {/* SCENE 6 (39.2s - 45.7s): Speed of Light 3ms = 558.8 Miles */}
      <SceneFade from={tAnd - 4} to={tWait - 4}>
        <ShortPhysicsScene
          at={tAnd}
          lightAt={scue("speed of light")}
          fiveAt={scue("Right around five hundred")}
        />
      </SceneFade>

      {/* SCENE 7 (45.7s - end): The Math Catch + Full Video Thumbnail CTA */}
      <SceneFade from={tWait - 4} to={FIVE_HUNDRED_MILE_SHORT_FRAMES + 30} zoom={false}>
        <ShortOutroCardScene at={tWait} catchAt={scue("actually has a catch")} watchAt={tToWatch} />
      </SceneFade>

      <ShortSubtitleLayer />
      <Audio src={staticFile("email500/short-voiceover.wav")} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// HELPER SCENES FOR VERTICAL SHORT
// ===========================================================================
const ShortCulpritScene: React.FC<{
  downAt: number;
  zeroAt: number;
  msAt: number;
}> = ({ downAt, zeroAt, msAt }) => {
  const frame = useCurrentFrame();
  const isV5 = frame >= downAt;
  const isZero = frame >= zeroAt;
  const msVal = interpolate(frame, [msAt, msAt + 24], [0, 3.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
      <Kicker color={C.red} style={{ fontSize: 28 }}>
        THE SILENT DOWNGRADE
      </Kicker>
      <div
        style={{
          marginTop: 34,
          fontFamily: INTER,
          fontWeight: 900,
          fontSize: 78,
          color: isV5 ? C.red : C.green,
          border: `5px solid ${isV5 ? C.red : C.green}`,
          borderRadius: 28,
          padding: "16px 46px",
          boxShadow: glow(isV5 ? C.red : C.green, 12),
        }}
      >
        {isV5 ? "SENDMAIL v8 → v5" : "SENDMAIL v8"}
      </div>

      <Panel style={{ width: 920, padding: "28px 36px", marginTop: 40 }} border={isZero ? C.red : C.panelBorder}>
        <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}># sendmail.cf (v8 config)</div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 32,
            color: "rgba(127,147,196,0.45)",
            textDecoration: isV5 ? "line-through" : "none",
            marginTop: 12,
          }}
        >
          O DeliveryMode=background
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 36,
            fontWeight: 700,
            color: isZero ? C.red : C.white,
            textShadow: isZero ? glow(C.red, 10) : "none",
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{isZero ? "O Timeout.connect = 0s" : "O Timeout.connect = 1m"}</span>
          {isZero ? <span>◀ WIPED!</span> : null}
        </div>
      </Panel>

      {frame >= msAt - 6 ? (
        <div style={{ marginTop: 50, textAlign: "center", display: "flex", alignItems: "center", gap: 40 }}>
          <Stopwatch size={210} t={msVal} max={3} danger />
          <div style={{ textAlign: "left" }}>
            <Kicker color={C.gold} style={{ fontSize: 24 }}>
              MAX WAIT TIME
            </Kicker>
            <BigText size={120} color={C.gold} glowColor={C.gold}>
              {msVal.toFixed(1)} ms
            </BigText>
            <div style={{ fontFamily: MONO, fontSize: 28, color: C.dim }}>0.003 SECONDS</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ShortPhysicsScene: React.FC<{ at: number; lightAt: number; fiveAt: number }> = ({ at, lightAt, fiveAt }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, lightAt, lightAt + 40);
  const miles = interpolate(p, [0, 1], [0, 558.8]);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
      <Kicker color={C.gold} style={{ fontSize: 28 }}>
        SPEED OF LIGHT × 3 MILLISECONDS
      </Kicker>
      <BigText size={62} style={{ marginTop: 18, textAlign: "center" }}>
        c = 300,000 km/s
      </BigText>

      <div style={{ marginTop: 44 }}>
        <Terminal
          width={920}
          height={340}
          fontSize={30}
          title="unix — units"
          lines={[
            { at: at + 4, text: "units", prompt: true },
            { at: lightAt - 6, text: "You have: 3 millilightseconds", color: C.white },
            { at: lightAt + 12, text: "You want: miles", color: C.white },
            { at: fiveAt - 6, text: "        * 558.84719", color: C.gold },
          ]}
        />
      </div>

      <div style={{ marginTop: 54, textAlign: "center" }}>
        <BigText size={160} color={C.gold} glowColor={C.gold}>
          {miles.toFixed(1)}
        </BigText>
        <BigText size={74} color={C.white}>
          MILES IN 3 MS
        </BigText>
      </div>
    </AbsoluteFill>
  );
};

const ShortOutroCardScene: React.FC<{ at: number; catchAt: number; watchAt: number }> = ({
  at,
  catchAt,
  watchAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardPop = spring({
    frame: Math.max(0, frame - (watchAt - 12)),
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const pulse = 1 + 0.025 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 115 }}>
      <Appear at={at}>
        <div
          style={{
            display: "inline-block",
            border: `4px solid ${C.red}`,
            borderRadius: 18,
            padding: "10px 36px",
            boxShadow: glow(C.red, 12),
          }}
        >
          <Kicker color={C.red} style={{ fontSize: 32 }}>
            WAIT… THERE&apos;S A CATCH
          </Kicker>
        </div>
      </Appear>

      <Appear at={catchAt - 10} style={{ marginTop: 24, padding: "0 56px", textAlign: "center" }}>
        <BigText size={54} color={C.white}>
          Light slows down by <span style={{ color: C.cyan }}>33%</span> in fiber
          <br />&amp; TCP takes a <span style={{ color: C.gold }}>round trip!</span>
        </BigText>
      </Appear>

      {/* YouTube Uploaded Video Screenshot Card */}
      <div
        style={{
          marginTop: 48,
          opacity: interpolate(cardPop, [0, 1], [0, 1]),
          transform: `scale(${interpolate(cardPop, [0, 1], [0.78, 1]) * pulse})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
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
            boxShadow: `0 24px 70px rgba(0,0,0,0.85), ${glow(C.gold, 18)}`,
            background: "#ffffff",
            padding: 14,
          }}
        >
          <Img
            src={staticFile("email500/yt-video-card.png")}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 18,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
