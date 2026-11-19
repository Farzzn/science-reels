import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, ChapterCard, Kicker, Panel, prog, SceneFade } from "./components";
import { TowerIcon } from "./icons";
import { CITIES, USMap, WorldMap } from "./maps";
import { C, glow, INTER, MONO, svgGlow } from "./theme";
import { makeCue } from "./timing";

// ===========================================================================
// CHAPTER 7 — WHY IT MATTERS TO YOU
// ===========================================================================
export const Ch7: React.FC = () => {
  const cue = makeCue("ch7");
  const frame = useCurrentFrame();
  const tSo = cue("So no matter");
  const tGamers = cue("That's why gamers");
  const tNetflix = cue("It's why Netflix");
  const tTraders = cue("It's why stock traders");
  const tMars = cue("And it's why driving");
  const go = cue("sixty milliseconds to get there");
  const back = cue("another sixty to come back");
  const ms =
    frame < back
      ? interpolate(frame, [go, go + 40], [0, 62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(frame, [back, back + 40], [62, 125], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tSo - 6} zoom={false}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 60, top: 140 }}>
            <WorldMap width={1800} height={860} arcAt={cue("Mumbai to New York")} />
          </div>
          <div style={{ position: "absolute", left: 120, bottom: 90, display: "flex", gap: 90, alignItems: "flex-end" }}>
            <Appear at={cue("twelve and a half thousand")}>
              <Kicker color={C.dim}>Straight-line distance</Kicker>
              <BigText size={72}>12,500 km</BigText>
            </Appear>
            <Appear at={go}>
              <Kicker color={C.dim}>Light in perfect fiber {frame >= back ? "· there and back" : "· one way"}</Kicker>
              <BigText size={72} color={C.gold} glowColor={C.gold}>
                {Math.round(ms)} ms
              </BigText>
            </Appear>
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tSo - 4} to={tGamers - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tSo}>
              <Kicker color={C.dim}>Mumbai ⇄ New York · round-trip time</Kicker>
            </Appear>
            <div style={{ display: "flex", gap: 100, marginTop: 34 }}>
              <Appear at={tSo + 15} from="scale">
                <Panel style={{ padding: "50px 70px", textAlign: "center" }} border={C.gold}>
                  <Kicker color={C.gold}>Physics minimum</Kicker>
                  <BigText size={140} color={C.gold} glowColor={C.gold}>
                    125 ms
                  </BigText>
                </Panel>
              </Appear>
              <Appear at={cue("Real cables don't")} from="scale">
                <Panel style={{ padding: "50px 70px", textAlign: "center" }} border={C.red}>
                  <Kicker color={C.red}>Real-world ping</Kicker>
                  <BigText size={140} color={C.red} glowColor={C.red}>
                    ~200 ms
                  </BigText>
                </Panel>
              </Appear>
            </div>
          </div>
        </Center>
      </SceneFade>
      <SceneFade from={tGamers - 4} to={tNetflix - 6}>
        <PingMeter at={tGamers} wifiAt={cue("faster Wi-Fi")} />
      </SceneFade>
      <SceneFade from={tNetflix - 4} to={tTraders - 6} zoom={false}>
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
            <Kicker>Servers placed near you (CDNs)</Kicker>
          </div>
          <div style={{ position: "absolute", left: 60, top: 150 }}>
            <WorldMap
              width={1800}
              height={860}
              nodes={[
                [72.88, 19.08],
                [77.21, 28.61],
                [80.27, 13.08],
                [77.59, 12.97],
                [88.36, 22.57],
                [-0.13, 51.51],
                [139.69, 35.69],
                [-46.63, -23.55],
                [151.21, -33.87],
                [-122.42, 37.77],
                [-74.0, 40.71],
                [103.82, 1.35],
              ].map((ll, i) => ({ ll: ll as [number, number], at: tNetflix + 8 + i * 5 }))}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tTraders - 4} to={tMars - 6}>
        <Traders at={tTraders} costAt={cue("hundreds of millions")} msAt={cue("few milliseconds")} />
      </SceneFade>
      <SceneFade from={tMars - 4} to={cue.len + 30}>
        <MarsScene at={tMars} delayAt={cue("between about three")} waitAt={cue("They send instructions")} />
      </SceneFade>
      <ChapterCard num={7} title="Why It Matters to You" />
    </AbsoluteFill>
  );
};

const PingMeter: React.FC<{ at: number; wifiAt: number }> = ({ at, wifiAt }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at + 5, at + 40], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jitter = frame > at + 40 ? Math.sin(frame / 3) * 6 : 0;
  const a = (-120 + ((v + jitter) / 250) * 240) * (Math.PI / 180);
  return (
    <Center>
      <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
        <svg width={600} height={460} style={{ overflow: "visible" }}>
          <path d="M60 380 A240 240 0 1 1 540 380" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={30} strokeLinecap="round" />
          <path d="M60 380 A240 240 0 0 1 300 140" fill="none" stroke={C.green} strokeWidth={30} strokeLinecap="round" opacity={0.6} />
          <path d="M300 140 A240 240 0 0 1 540 380" fill="none" stroke={C.red} strokeWidth={30} strokeLinecap="round" opacity={0.6} />
          <line x1={300} y1={380} x2={300 + Math.sin(a) * 210} y2={380 - Math.cos(a) * 210} stroke="#fff" strokeWidth={8} strokeLinecap="round" style={{ filter: svgGlow(C.red, 5) }} />
          <circle cx={300} cy={380} r={16} fill="#fff" />
          <text x={300} y={460} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={700} fontSize={56}>
            {Math.round(v + jitter)} ms
          </text>
        </svg>
        <div style={{ width: 760 }}>
          <Kicker color={C.red}>Playing on a US server from India</Kicker>
          <BigText size={80} style={{ marginTop: 20 }}>
            High ping isn&apos;t your router&apos;s fault.
          </BigText>
          <Appear at={wifiAt} style={{ marginTop: 40 }}>
            <BigText size={56} color={C.gold}>
              Faster Wi-Fi can&apos;t beat the speed of light.
            </BigText>
          </Appear>
        </div>
      </div>
    </Center>
  );
};

const Traders: React.FC<{ at: number; costAt: number; msAt: number }> = ({ at, costAt, msAt }) => {
  const frame = useCurrentFrame();
  const n = 7;
  const beam = ((frame - at) % 45) / 45;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center" }}>
        <Kicker>Stock traders · Chicago ⇄ New York</Kicker>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={200} y1={520} x2={1720} y2={520} stroke={C.cyan} strokeWidth={3} strokeDasharray="6 12" opacity={0.6} />
        {frame > at ? <circle cx={200 + beam * 1520} cy={520} r={12} fill={C.gold} style={{ filter: svgGlow(C.gold, 8) }} /> : null}
      </svg>
      {new Array(n).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 200 + (i * 1520) / (n - 1) - 60, top: 400 }}>
          <Appear at={at + i * 6} from="scale">
            <TowerIcon size={120} />
          </Appear>
        </div>
      ))}
      <div style={{ position: "absolute", left: 150, top: 590, fontFamily: INTER, fontWeight: 900, fontSize: 44, color: C.white }}>CHICAGO</div>
      <div style={{ position: "absolute", right: 150, top: 590, fontFamily: INTER, fontWeight: 900, fontSize: 44, color: C.white }}>NEW YORK</div>
      <div style={{ position: "absolute", bottom: 130, width: "100%", display: "flex", justifyContent: "center", gap: 140 }}>
        <Appear at={costAt}>
          <BigText size={80} color={C.gold} glowColor={C.gold}>
            $ hundreds of millions
          </BigText>
        </Appear>
        <Appear at={msAt}>
          <BigText size={80} color={C.green}>
            − a few ms
          </BigText>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

const MarsScene: React.FC<{ at: number; delayAt: number; waitAt: number }> = ({ at, delayAt, waitAt }) => {
  const frame = useCurrentFrame();
  const sig = ((frame - at) % 120) / 120;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="e" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#3a8bff" />
            <stop offset="100%" stopColor="#0a2250" />
          </radialGradient>
          <radialGradient id="m" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ff8a4d" />
            <stop offset="100%" stopColor="#5a1a08" />
          </radialGradient>
        </defs>
        <circle cx={300} cy={540} r={150} fill="url(#e)" style={{ filter: svgGlow(C.cyan, 8) }} />
        <circle cx={1640} cy={540} r={90} fill="url(#m)" style={{ filter: svgGlow("#ff8a4d", 8) }} />
        <line x1={460} y1={540} x2={1540} y2={540} stroke={C.gold} strokeWidth={2} strokeDasharray="4 14" opacity={0.6} />
        {frame > at ? <circle cx={460 + sig * 1080} cy={540} r={12} fill="#fff" style={{ filter: svgGlow(C.gold, 8) }} /> : null}
        <text x={300} y={760} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={700} fontSize={32}>EARTH</text>
        <text x={1640} y={700} textAnchor="middle" fill="#ff8a4d" fontFamily={MONO} fontWeight={700} fontSize={32}>MARS</text>
      </svg>
      <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center" }}>
        <Appear at={delayAt}>
          <Kicker color={C.dim}>One-way signal delay</Kicker>
          <BigText size={110} color={C.gold} glowColor={C.gold}>
            3 – 22 minutes
          </BigText>
        </Appear>
      </div>
      <div style={{ position: "absolute", bottom: 130, width: "100%", textAlign: "center" }}>
        <Appear at={waitAt}>
          <BigText size={70}>Send instructions… and wait.</BigText>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 8 — OUTRO
// ===========================================================================
export const Ch8: React.FC = () => {
  const cue = makeCue("ch8");
  const tBack = cue("Back in Chapel Hill");
  const tStuck = cue("But the story stuck");
  const tEp = cue("This is the first episode");
  const tNext = cue("Next time: the day");
  const sf = CITIES.find((c) => c.name === "San Francisco")!.ll;
  const la = CITIES.find((c) => c.name === "Los Angeles")!.ll;
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tBack - 6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 100, top: 220, width: 640 }}>
            <Appear at={0}>
              <Kicker color={C.dim}>Slow page? Laggy call?</Kicker>
            </Appear>
            <Appear at={cue("speed limit")} style={{ marginTop: 30 }}>
              <BigText size={80}>
                There&apos;s a <span style={{ color: C.gold }}>speed limit</span> under all our software.
              </BigText>
            </Appear>
            <Appear at={cue("no update can change")} style={{ marginTop: 30 }}>
              <Kicker color={C.cyan} style={{ fontSize: 30 }}>c = 299,792 km/s · no patch for that</Kicker>
            </Appear>
          </div>
          <div style={{ position: "absolute", right: 40, top: 150 }}>
            <USMap width={1100} height={780} circleAt={cue("their map") - 20} dotsAt={cue("their map")} dotsEvery={2} />
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tBack - 4} to={tStuck - 6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 120, top: 330 }}>
            <Appear at={cue("put the right version")} from="scale">
              <div
                style={{
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontSize: 84,
                  color: C.green,
                  border: `5px solid ${C.green}`,
                  borderRadius: 26,
                  padding: "18px 44px",
                  boxShadow: glow(C.green, 12),
                }}
              >
                SENDMAIL v8 ✓
              </div>
            </Appear>
            <Appear at={cue("timeout returned to normal")} style={{ marginTop: 40 }}>
              <Kicker color={C.white} style={{ fontSize: 30 }}>timeout restored</Kicker>
            </Appear>
          </div>
          <div style={{ position: "absolute", right: 40, top: 160 }}>
            <USMap
              width={1100}
              height={780}
              pings={[
                { ll: sf, at: cue("Emails flew"), ok: true, label: "✓" },
                { ll: la, at: cue("Emails flew") + 8, ok: true },
              ]}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tStuck - 4} to={tEp - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tStuck}>
              <Kicker color={C.dim}>Why the story stuck around for decades</Kicker>
            </Appear>
            <Appear at={cue("magical digital world") - 45} style={{ marginTop: 26 }}>
              <BigText size={74} color={C.dim}>
                Computers don&apos;t live in a magical digital world.
              </BigText>
            </Appear>
            <div style={{ display: "flex", gap: 90, justifyContent: "center", marginTop: 70 }}>
              {[
                { t: "GLASS", c: C.cyan, at: cue("made of glass") },
                { t: "COPPER", c: "#ff9a4d", at: cue("copper") },
                { t: "LIGHT", c: C.gold, at: cue("and light") },
              ].map((x) => (
                <Appear key={x.t} at={x.at} from="scale">
                  <BigText size={110} color={x.c} glowColor={x.c}>
                    {x.t}
                  </BigText>
                </Appear>
              ))}
            </div>
          </div>
        </Center>
      </SceneFade>
      <SceneFade from={tEp - 4} to={tNext - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tEp} from="scale">
              <BigText size={170} glowColor={C.cyan}>
                PHYSICS BUGS
              </BigText>
            </Appear>
            <Appear at={cue("real moments")} style={{ marginTop: 20 }}>
              <Kicker style={{ fontSize: 32 }}>When the laws of the universe break our computers</Kicker>
            </Appear>
          </div>
        </Center>
      </SceneFade>
      <SceneFade from={tNext - 4} to={cue.len + 40} zoom={false}>
        <NextUp at={tNext} subAt={cue("Subscribe")} />
      </SceneFade>
    </AbsoluteFill>
  );
};

const NextUp: React.FC<{ at: number; subAt: number }> = ({ at, subAt }) => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [subAt + 20, subAt + 25, subAt + 32], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subbed = frame > subAt + 25;
  const p = prog(frame, at, at + 20);
  return (
    <Center>
      <div style={{ textAlign: "center" }}>
        <Kicker color={C.dim} style={{ opacity: p }}>Next episode</Kicker>
        <Appear at={at + 5} from="scale" style={{ marginTop: 20 }}>
          <BigText size={200} color={C.red} glowColor={C.red}>
            +1 SECOND
          </BigText>
          <BigText size={56} style={{ marginTop: 10 }}>
            The day one extra second crashed half the internet
          </BigText>
        </Appear>
        <Appear at={subAt} style={{ marginTop: 70 }}>
          <div
            style={{
              display: "inline-block",
              padding: "24px 70px",
              borderRadius: 60,
              background: subbed ? "rgba(255,255,255,0.15)" : C.red,
              color: "#fff",
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 54,
              transform: `scale(${press})`,
              boxShadow: subbed ? "none" : glow(C.red, 14),
            }}
          >
            {subbed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
          </div>
        </Appear>
      </div>
    </Center>
  );
};
