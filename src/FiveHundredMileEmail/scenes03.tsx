import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, ChapterCard, Kicker, Panel, prog, SceneFade, Terminal } from "./components";
import { RouterIcon, ServerIcon } from "./icons";
import { CITIES, HOME, milesBetween, USMap } from "./maps";
import { C, glow, INTER, MONO, svgGlow } from "./theme";
import { makeCue } from "./timing";

// ===========================================================================
// CHAPTER 5 — THE PHYSICS
// ===========================================================================
export const Ch5: React.FC = () => {
  const cue = makeCue("ch5");
  const tMs = cue("But a millisecond");
  const tTerm = cue("So Trey opened");
  const tFive = cue("Five hundred miles. Or");
  const tCircle = cue("The circle on the");
  const tBug = cue("The bug didn't just");
  const near = CITIES.filter((c) => milesBetween(HOME, c.ll) < 520).slice(0, 8);
  const far = CITIES.filter((c) => milesBetween(HOME, c.ll) > 620).slice(0, 8);
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tMs - 6}>
        <LightLaps cAt={cue("three hundred thousand")} lapsAt={cue("circle the Earth")} />
      </SceneFade>
      <SceneFade from={tMs - 4} to={tTerm - 6}>
        <MsRuler at={cue("In one millisecond")} miAt={cue("roughly a hundred")} />
      </SceneFade>
      <SceneFade from={tTerm - 4} to={tFive - 6} zoom={false}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 120, top: 200 }}>
            <Terminal
              width={1000}
              height={600}
              fontSize={34}
              title="mailhost — units"
              lines={[
                { at: cue("called \"units\""), text: "units", prompt: true },
                { at: cue("He typed"), text: "You have: 3 millilightseconds", cps: 22, color: C.white },
                { at: cue("Convert to miles"), text: "You want: miles", cps: 22, color: C.white },
                { at: cue("answer came back") + 12, text: "        * 558.84719", color: C.gold },
              ]}
            />
          </div>
          <div style={{ position: "absolute", right: 120, top: 330, textAlign: "center" }}>
            <Appear at={cue("five hundred and fifty-eight")} from="scale">
              <BigText size={190} color={C.gold} glowColor={C.gold}>
                558.8
              </BigText>
              <BigText size={80} color={C.white}>
                miles
              </BigText>
            </Appear>
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tFive - 4} to={tCircle - 6}>
        <Center>
          <Appear at={tFive} from="scale">
            <BigText size={120} style={{ textAlign: "center" }}>
              “500 miles…
              <br />
              <span style={{ color: C.gold }}>or a little bit more.</span>”
            </BigText>
          </Appear>
        </Center>
      </SceneFade>
      <SceneFade from={tCircle - 4} to={tBug - 6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 90, top: 140, width: 560 }}>
            <Appear at={cue("wasn't a coincidence")}>
              <Kicker color={C.gold}>Not a coincidence</Kicker>
            </Appear>
            <Appear at={cue("distance light could travel")} style={{ marginTop: 24 }}>
              <BigText size={66}>
                Radius = how far light goes in <span style={{ color: C.gold }}>3 ms</span>
              </BigText>
            </Appear>
            <Appear at={cue("Any mail server inside")} style={{ marginTop: 50 }}>
              <BigText size={50} color={C.green}>
                Inside → answers in time
              </BigText>
            </Appear>
            <Appear at={cue("Anything outside")} style={{ marginTop: 20 }}>
              <BigText size={50} color={C.red}>
                Outside → physically too far
              </BigText>
            </Appear>
          </div>
          <div style={{ position: "absolute", right: 40, top: 120 }}>
            <USMap
              width={1220}
              height={840}
              circleAt={tCircle}
              circleLabel="558.8 mi"
              circleLabelAt={tCircle + 30}
              pings={[
                ...near.map((c, i) => ({ ll: c.ll, at: cue("Any mail server inside") + i * 4, ok: true })),
                ...far.map((c, i) => ({ ll: c.ll, at: cue("Anything outside") + i * 4, ok: false })),
              ]}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tBug - 4} to={cue.len + 30}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tBug}>
              <Kicker style={{ fontSize: 34 }}>The bug didn&apos;t just break email…</Kicker>
            </Appear>
            <Appear at={cue("measuring stick")} from="scale" style={{ marginTop: 40 }}>
              <BigText size={110}>
                It turned a <span style={{ color: C.cyan }}>timer</span>
                <br />
                into a <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>ruler for light.</span>
              </BigText>
            </Appear>
          </div>
        </Center>
      </SceneFade>
      <ChapterCard num={5} title="The Physics" />
    </AbsoluteFill>
  );
};

const LightLaps: React.FC<{ cAt: number; lapsAt: number }> = ({ cAt, lapsAt }) => {
  const frame = useCurrentFrame();
  const laps = interpolate(frame, [lapsAt, lapsAt + 120], [0, 7.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ang = laps * Math.PI * 2 - Math.PI / 2;
  const R = 300;
  const cx = 1320;
  const cy = 560;
  const trail = new Array(26).fill(0).map((_, i) => {
    const a = ang - i * 0.06;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 300, width: 700 }}>
        <Kicker>Speed of light (vacuum)</Kicker>
        <Appear at={cAt} style={{ marginTop: 24 }}>
          <BigText size={110} color={C.gold} glowColor={C.gold}>
            300,000
          </BigText>
          <BigText size={56}>km every second</BigText>
        </Appear>
        <Appear at={lapsAt} style={{ marginTop: 60 }}>
          <BigText size={64}>
            <span style={{ color: C.cyan }}>{laps.toFixed(1)}</span> laps of Earth
          </BigText>
          <Kicker color={C.dim} style={{ fontSize: 22, marginTop: 8 }}>in one second</Kicker>
        </Appear>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="earthg" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#1f5fbf" />
            <stop offset="100%" stopColor="#081a3d" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R - 40} fill="url(#earthg)" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} style={{ filter: svgGlow(C.cyan, 6) }} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.gold} strokeOpacity={0.15} strokeWidth={2} />
        {frame >= lapsAt
          ? trail.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={10 - i * 0.35} fill={i === 0 ? "#fff" : C.gold} opacity={1 - i / 26} style={{ filter: i === 0 ? svgGlow(C.gold, 8) : undefined }} />
            ))
          : null}
      </svg>
    </AbsoluteFill>
  );
};

const MsRuler: React.FC<{ at: number; miAt: number }> = ({ at, miAt }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, at + 45);
  return (
    <Center>
      <div style={{ width: 1500 }}>
        <Kicker>One millisecond = 0.001 s</Kicker>
        <div style={{ position: "relative", height: 160, marginTop: 70 }}>
          <div style={{ position: "absolute", top: 70, left: 0, width: 1500, height: 4, background: "rgba(255,255,255,0.15)" }} />
          {new Array(11).fill(0).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 150, top: 56, width: 2, height: 32, background: "rgba(255,255,255,0.3)" }} />
          ))}
          <div style={{ position: "absolute", top: 62, left: 0, width: 1500 * p, height: 20, background: C.gold, borderRadius: 10, boxShadow: glow(C.gold, 14) }} />
          <div style={{ position: "absolute", top: 50, left: 1500 * p - 22, width: 44, height: 44, borderRadius: 22, background: "#fff", boxShadow: glow(C.gold, 18), opacity: p > 0 ? 1 : 0 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
          <Appear at={at + 30}>
            <BigText size={100} color={C.gold}>
              ≈ 300 km
            </BigText>
          </Appear>
          <Appear at={miAt}>
            <BigText size={100} color={C.white}>
              ≈ 186 miles
            </BigText>
          </Appear>
        </div>
      </div>
    </Center>
  );
};

// ===========================================================================
// CHAPTER 6 — THE NITPICK
// ===========================================================================
export const Ch6: React.FC = () => {
  const cue = makeCue("ch6");
  const tFirst = cue("First, signals");
  const tSecond = cue("Second, the handshake");
  const tRouter = cue("And on top of that");
  const tNumbers = cue("So the numbers");
  const tCore = cue("But the core");
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tFirst - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={cue("checks the math")} from="scale">
              <div
                style={{
                  display: "inline-block",
                  transform: "rotate(-6deg)",
                  border: `8px solid ${C.red}`,
                  borderRadius: 24,
                  padding: "10px 60px",
                  boxShadow: glow(C.red, 14),
                }}
              >
                <BigText size={200} color={C.red}>
                  WAIT…
                </BigText>
              </div>
            </Appear>
            <Appear at={cue("And you'd be right")} style={{ marginTop: 60 }}>
              <BigText size={64}>The math doesn&apos;t quite add up.</BigText>
            </Appear>
          </div>
        </Center>
      </SceneFade>
      <SceneFade from={tFirst - 4} to={tSecond - 6}>
        <FiberRace at={tFirst} glassAt={cue("Inside glass fiber")} />
      </SceneFade>
      <SceneFade from={tSecond - 4} to={tRouter - 6}>
        <RoundTrip at={tSecond} backAt={cue("reply has to come back")} shrinkAt={cue("hundred and eighty miles")} />
      </SceneFade>
      <SceneFade from={tRouter - 4} to={tNumbers - 6}>
        <RouterChain at={cue("every router")} />
      </SceneFade>
      <SceneFade from={tNumbers - 4} to={tCore - 6}>
        <Center>
          <div style={{ textAlign: "center", width: 1500 }}>
            <Appear at={tNumbers}>
              <BigText size={80}>The numbers don&apos;t line up perfectly.</BigText>
            </Appear>
            <Appear at={cue("Trey Harris himself")} style={{ marginTop: 60 }}>
              <Panel style={{ padding: "40px 60px", display: "inline-block", textAlign: "left" }} border={C.gold}>
                <Kicker color={C.gold}>Trey Harris, later</Kicker>
                <BigText size={56} style={{ marginTop: 16 }}>
                  Some details were simplified and rounded.
                </BigText>
              </Panel>
            </Appear>
            <Appear at={cue("never measured in a lab")} style={{ marginTop: 40 }}>
              <Kicker color={C.dim} style={{ fontSize: 30 }}>The exact timing was never lab-measured</Kicker>
            </Appear>
          </div>
        </Center>
      </SceneFade>
      <SceneFade from={tCore - 4} to={cue.len + 30}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tCore} from="scale">
              <BigText size={120} color={C.green} glowColor={C.green}>
                THE CORE IS REAL
              </BigText>
            </Appear>
            <Appear at={cue("time limit into a distance limit")} style={{ marginTop: 50 }}>
              <BigText size={76}>
                <span style={{ color: C.cyan }}>time limit</span> → <span style={{ color: C.gold }}>distance limit</span>
              </BigText>
            </Appear>
            <Appear at={cue("It's physics")} style={{ marginTop: 50 }}>
              <Kicker style={{ fontSize: 40 }}>Not a story. Physics.</Kicker>
            </Appear>
          </div>
        </Center>
      </SceneFade>
      <ChapterCard num={6} title="The Nitpick" />
    </AbsoluteFill>
  );
};

const FiberRace: React.FC<{ at: number; glassAt: number }> = ({ at, glassAt }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - glassAt);
  const v = ((t * 14) % 1700) as number;
  const g = ((t * 14 * 0.67) % 1700) as number;
  const lane = (y: number, x: number, color: string, label: string, sub: string) => (
    <>
      <div style={{ position: "absolute", left: 110, top: y - 60, fontFamily: INTER, fontWeight: 800, fontSize: 40, color }}>
        {label} <span style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{sub}</span>
      </div>
      <div style={{ position: "absolute", left: 110, top: y, width: 1700, height: 34, borderRadius: 17, background: "rgba(62,224,255,0.08)", border: `1px solid ${C.panelBorder}` }} />
      {frame >= glassAt ? (
        <div style={{ position: "absolute", left: 110 + x - 60, top: y + 7, width: 80, height: 20, borderRadius: 10, background: `linear-gradient(90deg, transparent, ${color})`, boxShadow: glow(color, 14) }} />
      ) : null}
    </>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 100, width: "100%", textAlign: "center" }}>
        <Appear at={at}>
          <Kicker style={{ fontSize: 30 }}>Nitpick #1 · light is slower in glass</Kicker>
        </Appear>
      </div>
      {lane(420, v, C.gold, "Vacuum", "c")}
      {lane(680, g, C.cyan, "Glass fiber", "≈ ⅔ c")}
    </AbsoluteFill>
  );
};

const RoundTrip: React.FC<{ at: number; backAt: number; shrinkAt: number }> = ({ at, backAt, shrinkAt }) => {
  const frame = useCurrentFrame();
  const out = prog(frame, at + 10, at + 40);
  const back = prog(frame, backAt, backAt + 30);
  const miles = interpolate(frame, [shrinkAt, shrinkAt + 40], [558.85, 186], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 120, width: 760 }}>
        <Kicker style={{ fontSize: 30 }}>Nitpick #2 · it&apos;s a round trip</Kicker>
        <div style={{ position: "relative", height: 300, marginTop: 50 }}>
          <div style={{ position: "absolute", left: 0, top: 40 }}>
            <ServerIcon size={150} />
          </div>
          <div style={{ position: "absolute", right: 0, top: 40 }}>
            <ServerIcon size={150} color={C.gold} />
          </div>
          <svg width={760} height={300} style={{ position: "absolute" }}>
            <line x1={160} y1={90} x2={160 + 440 * out} y2={90} stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 4) }} />
            <line x1={600} y1={170} x2={600 - 440 * back} y2={170} stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 4) }} />
          </svg>
          <div style={{ position: "absolute", left: 250, top: 40, fontFamily: MONO, color: C.cyan, fontSize: 26, opacity: out }}>hello →</div>
          <div style={{ position: "absolute", left: 250, top: 190, fontFamily: MONO, color: C.gold, fontSize: 26, opacity: back }}>← reply</div>
        </div>
        <Appear at={shrinkAt}>
          <BigText size={64}>
            Real reach in fiber: <span style={{ color: C.gold }}>~{Math.round(miles)} mi</span>
          </BigText>
          <Kicker color={C.dim} style={{ fontSize: 22, marginTop: 12 }}>
            3 ms total · ⅔ c · there and back
          </Kicker>
        </Appear>
      </div>
      <div style={{ position: "absolute", right: 30, top: 160 }}>
        <USMap width={1000} height={720} circleAt={0} circleMiles={miles} circleLabel={`${Math.round(miles)} mi`} circleLabelAt={shrinkAt} />
      </div>
    </AbsoluteFill>
  );
};

const RouterChain: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const n = 5;
  const total = Math.min(n, Math.max(0, Math.floor((frame - at) / 14) + 1));
  return (
    <Center>
      <div style={{ textAlign: "center" }}>
        <Kicker style={{ fontSize: 30 }}>Nitpick #3 · every router adds delay</Kicker>
        <div style={{ display: "flex", gap: 60, marginTop: 80, justifyContent: "center" }}>
          {new Array(n).fill(0).map((_, i) => (
            <Appear key={i} at={at + i * 14} from="scale">
              <RouterIcon size={180} color={i < total ? C.cyan : C.dim} />
              <div style={{ fontFamily: MONO, fontSize: 30, color: C.red, marginTop: 8 }}>+ delay</div>
            </Appear>
          ))}
        </div>
      </div>
    </Center>
  );
};
