import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  BigText,
  Center,
  ChapterCard,
  Kicker,
  LowerThird,
  Panel,
  prog,
  SceneFade,
  Typed,
  useAppear,
} from "./components";
import { EnvelopeIcon, PhoneIcon, PlaneIcon, RouterIcon, ServerIcon } from "./icons";
import { CITIES, HOME, milesBetween, USMap } from "./maps";
import { C, glow, INTER, MONO, svgGlow } from "./theme";
import { makeCue } from "./timing";

// ===========================================================================
// CHAPTER 0 — COLD OPEN
// ===========================================================================
export const Ch0: React.FC = () => {
  const cue = makeCue("ch0");
  const frame = useCurrentFrame();
  const tQuote = cue("We can't send email");
  const tNot = cue("Not \"email is broken");
  const tWorked = cue("Email worked perfectly");
  const tImpossible = cue("That sounds impossible");
  const tReason = cue("And the reason");
  const ringing = frame < cue("phone call", 1.6);
  const shake = ringing ? Math.sin(frame * 2.2) * 6 : 0;

  const farPings = CITIES.filter((c) => milesBetween(HOME, c.ll) > 700).slice(0, 7);
  const nearPings = CITIES.filter((c) => milesBetween(HOME, c.ll) < 450).slice(0, 6);

  return (
    <AbsoluteFill>
      {/* Phone call */}
      <SceneFade from={0} to={tQuote - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={cue("mid nineteen-nineties")} from="down">
              <Kicker>Mid-1990s · A university campus</Kicker>
            </Appear>
            <div style={{ position: "relative", margin: "40px auto", width: 340, height: 340 }}>
              {ringing
                ? [0, 1, 2].map((i) => {
                    const r = ((frame + i * 12) % 36) / 36;
                    return (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          inset: -r * 120,
                          borderRadius: "50%",
                          border: `3px solid ${C.gold}`,
                          opacity: 1 - r,
                        }}
                      />
                    );
                  })
                : null}
              <div style={{ transform: `translateX(${shake}px) rotate(${shake * 0.6}deg)` }}>
                <PhoneIcon size={340} color={C.gold} lift={ringing ? 0.4 + 0.4 * Math.sin(frame) : 0} />
              </div>
            </div>
            <Appear at={cue("head of the statistics")}>
              <BigText size={60} color={C.white}>
                Incoming call: <span style={{ color: C.gold }}>Statistics Department</span>
              </BigText>
            </Appear>
            <Appear at={cue("strange complaint")} style={{ marginTop: 18 }}>
              <Kicker color={C.dim}>“We have a strange problem…”</Kicker>
            </Appear>
          </div>
        </Center>
      </SceneFade>

      {/* The quote */}
      <SceneFade from={tQuote - 4} to={tNot - 6}>
        <Center>
          <Panel style={{ padding: "60px 90px", maxWidth: 1500 }}>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 96,
                color: C.white,
                lineHeight: 1.12,
                letterSpacing: -2,
              }}
            >
              <span style={{ color: C.gold }}>“</span>
              <Typed text="We can't send email more than " at={tQuote} cps={22} />
              {frame >= tQuote + 40 ? (
                <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>
                  <Typed text="500 miles." at={tQuote + 40} cps={16} />
                </span>
              ) : null}
              <span style={{ color: C.gold }}>”</span>
            </div>
          </Panel>
        </Center>
      </SceneFade>

      {/* Not broken, not down */}
      <SceneFade from={tNot - 4} to={tWorked - 6}>
        <Center>
          <div style={{ display: "flex", flexDirection: "column", gap: 50, alignItems: "center" }}>
            {[
              { t: "EMAIL IS BROKEN", at: tNot },
              { t: "THE SERVER IS DOWN", at: cue("Not \"the server is down") },
            ].map(({ t, at }) => {
              const strike = prog(frame, at + 18, at + 30);
              return (
                <Appear key={t} at={at}>
                  <div style={{ position: "relative", padding: "0 20px" }}>
                    <BigText size={110} color={C.dim}>
                      {t}
                    </BigText>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "52%",
                        height: 12,
                        width: `${strike * 100}%`,
                        background: C.red,
                        boxShadow: glow(C.red, 10),
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </Appear>
              );
            })}
          </div>
        </Center>
      </SceneFade>

      {/* Works inside, fails outside */}
      <SceneFade from={tWorked - 4} to={tImpossible - 6}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
            <Appear at={tWorked}>
              <BigText size={64}>
                Works <span style={{ color: C.green }}>inside</span> 500 miles. Fails{" "}
                <span style={{ color: C.red }}>outside</span>.
              </BigText>
            </Appear>
          </div>
          <div style={{ marginTop: 110 }}>
            <USMap
              width={1500}
              height={880}
              circleAt={cue("within about five hundred miles")}
              pings={[
                ...nearPings.map((c, i) => ({ ll: c.ll, at: tWorked + 10 + i * 6, ok: true })),
                ...farPings.map((c, i) => ({ ll: c.ll, at: cue("Beyond that") + i * 6, ok: false })),
              ]}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Impossible? */}
      <SceneFade from={tImpossible - 4} to={tReason - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tImpossible} from="scale">
              <BigText size={150} color={C.red} glowColor={C.red}>
                IMPOSSIBLE?
              </BigText>
            </Appear>
            <Appear at={cue("Email doesn't care")} style={{ marginTop: 40 }}>
              <div style={{ display: "flex", gap: 40, alignItems: "center", justifyContent: "center" }}>
                <EnvelopeIcon size={160} />
                <BigText size={56} color={C.dim}>
                  doesn&apos;t know how far it goes…
                </BigText>
              </div>
            </Appear>
            <Appear at={cue("the department was right")} style={{ marginTop: 40 }}>
              <Kicker color={C.green} style={{ fontSize: 34 }}>
                …but the department was right.
              </Kicker>
            </Appear>
          </div>
        </Center>
      </SceneFade>

      {/* Speed of light title */}
      <SceneFade from={tReason - 4} to={cue.len + 40} zoom={false}>
        <LightTitle at={tReason} titleAt={cue("speed of light itself")} codeAt={cue("not by bad code")} />
      </SceneFade>
    </AbsoluteFill>
  );
};

const LightTitle: React.FC<{ at: number; titleAt: number; codeAt: number }> = ({ at, titleAt, codeAt }) => {
  const frame = useCurrentFrame();
  const beam = prog(frame, titleAt - 20, titleAt + 6, false);
  const { p } = useAppear(titleAt);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Appear at={at} out={titleAt - 10} style={{ position: "absolute", top: 380, width: "100%", textAlign: "center" }}>
        <BigText size={64} color={C.dim}>
          One of the strangest bugs in computing history
        </BigText>
      </Appear>
      <Appear at={codeAt} out={titleAt - 10} style={{ position: "absolute", top: 500, width: "100%", textAlign: "center" }}>
        <Kicker style={{ fontSize: 34 }}>Not caused by bad code…</Kicker>
      </Appear>
      {/* beam */}
      <div
        style={{
          position: "absolute",
          top: 538,
          left: -400 + beam * 2700,
          width: 600,
          height: 6,
          background: `linear-gradient(90deg, transparent, ${C.gold}, #fff)`,
          boxShadow: glow(C.gold, 20),
          opacity: beam > 0 && beam < 1 ? 1 : 0,
        }}
      />
      <div style={{ textAlign: "center", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
        <Kicker color={C.gold} style={{ fontSize: 32 }}>
          …but by the speed of light
        </Kicker>
        <BigText size={150} glowColor={C.cyan} style={{ marginTop: 20 }}>
          THE 500-MILE EMAIL
        </BigText>
        <div style={{ fontFamily: MONO, color: C.dim, fontSize: 28, marginTop: 24, letterSpacing: 4 }}>
          PHYSICS BUGS · EPISODE 01
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 1 — AN IMPOSSIBLE COMPLAINT
// ===========================================================================
export const Ch1: React.FC = () => {
  const cue = makeCue("ch1");
  const frame = useCurrentFrame();
  const tPlane = cue("Email isn't a paper plane");
  const tAsk = cue("So he asked");
  const tGood = cue("And this is where");
  const tData = cue("Data doesn't lie");

  return (
    <AbsoluteFill>
      {/* Trey intro */}
      <SceneFade from={0} to={tPlane - 6}>
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 90, marginBottom: 120 }}>
            <ServerIcon size={300} blink={frame} />
            <div>
              <Kicker>University mail server · 1990s</Kicker>
              <Appear at={cue("that's not how email works")} style={{ marginTop: 26 }}>
                <BigText size={84}>
                  “That&apos;s not how
                  <br />
                  email <span style={{ color: C.cyan }}>works.</span>”
                </BigText>
              </Appear>
            </div>
          </div>
        </Center>
        <LowerThird at={cue("Trey Harris")} out={tPlane - 20} title="Trey Harris" sub="SYSTEM ADMINISTRATOR · UNC CHAPEL HILL" />
      </SceneFade>

      {/* Paper plane vs network */}
      <SceneFade from={tPlane - 4} to={tAsk - 6}>
        <PlaneVsNetwork at={tPlane} netAt={cue("travels through cables")} streetAt={cue("across the street")} planetAt={cue("across the planet")} />
      </SceneFade>

      {/* The question */}
      <SceneFade from={tAsk - 4} to={tGood - 6}>
        <Center>
          <Appear at={tAsk} from="scale">
            <BigText size={120} style={{ textAlign: "center" }}>
              How do you <span style={{ color: C.gold }}>know</span>
              <br />
              it&apos;s 500 miles?
            </BigText>
          </Appear>
        </Center>
      </SceneFade>

      {/* The statisticians' map */}
      <SceneFade from={tGood - 4} to={tData - 6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 90, top: 90, width: 520 }}>
            <Appear at={cue("these were statisticians")}>
              <Kicker color={C.gold}>They were statisticians</Kicker>
            </Appear>
            <Appear at={cue("they collected data")} style={{ marginTop: 20 }}>
              <BigText size={64}>So they collected data.</BigText>
            </Appear>
            <Appear at={cue("Green for delivered")} style={{ marginTop: 50 }}>
              <Legend color={C.green} label="Delivered" />
            </Appear>
            <Appear at={cue("Red for failed")} style={{ marginTop: 18 }}>
              <Legend color={C.red} label="Failed" />
            </Appear>
            <Appear at={cue("a little over five hundred miles")} style={{ marginTop: 60 }}>
              <BigText size={92} color={C.gold} glowColor={C.gold}>
                ≈ 500 mi
              </BigText>
              <Kicker color={C.dim} style={{ fontSize: 22, marginTop: 8 }}>
                radius of the circle
              </Kicker>
            </Appear>
          </div>
          <div style={{ position: "absolute", right: 40, top: 110 }}>
            <USMap
              width={1260}
              height={860}
              dotsAt={cue("marked every result")}
              dotsEvery={4}
              circleAt={cue("circle centered")}
              circleLabel=""
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Data doesn't lie */}
      <SceneFade from={tData - 4} to={cue.len + 30}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tData} from="scale">
              <BigText size={130}>Data doesn&apos;t lie.</BigText>
            </Appear>
            <Appear at={cue("hit send")} style={{ marginTop: 50 }}>
              <SendButton at={cue("hit send")} />
            </Appear>
          </div>
        </Center>
      </SceneFade>

      <ChapterCard num={1} title="An Impossible Complaint" />
    </AbsoluteFill>
  );
};

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: 26, height: 26, borderRadius: 13, background: color, boxShadow: glow(color, 8) }} />
    <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: C.white }}>{label}</div>
  </div>
);

const SendButton: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [at + 10, at + 14, at + 20], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 20,
        padding: "22px 54px",
        borderRadius: 60,
        background: C.cyan,
        color: C.bg0,
        fontFamily: INTER,
        fontWeight: 900,
        fontSize: 52,
        transform: `scale(${press})`,
        boxShadow: glow(C.cyan, 16),
      }}
    >
      SEND ➤
    </div>
  );
};

const PlaneVsNetwork: React.FC<{ at: number; netAt: number; streetAt: number; planetAt: number }> = ({
  at,
  netAt,
  streetAt,
  planetAt,
}) => {
  const frame = useCurrentFrame();
  const fly = prog(frame, at, at + 70, false);
  const fall = prog(frame, at + 45, at + 75);
  const px = 200 + fly * 900;
  const py = 520 - Math.sin(fly * Math.PI * 0.7) * 160 + fall * 320;
  const netP = prog(frame, netAt, netAt + 30);
  const nodes = [
    [260, 760],
    [560, 640],
    [860, 760],
    [1160, 620],
    [1460, 740],
    [1700, 600],
  ];
  const packet = Math.max(0, (frame - netAt) % 75) / 75;
  const seg = Math.max(0, Math.min(nodes.length - 2, Math.floor(packet * (nodes.length - 1))));
  const lt = packet * (nodes.length - 1) - seg;
  const pk = [
    nodes[seg][0] + (nodes[seg + 1][0] - nodes[seg][0]) * lt,
    nodes[seg][1] + (nodes[seg + 1][1] - nodes[seg][1]) * lt,
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center" }}>
        <Appear at={at}>
          <BigText size={68}>Email isn&apos;t a paper plane…</BigText>
        </Appear>
      </div>
      <div
        style={{
          position: "absolute",
          left: px - 80,
          top: py - 80,
          opacity: frame < netAt ? 1 : interpolate(frame, [netAt, netAt + 10], [1, 0.25]),
          transform: `rotate(${fall * 50}deg)`,
        }}
      >
        <PlaneIcon size={160} color={C.dim} />
      </div>
      {fall > 0.6 && frame < netAt ? (
        <div style={{ position: "absolute", left: px + 70, top: py - 40, fontFamily: MONO, color: C.red, fontSize: 28 }}>
          OUT OF FUEL?
        </div>
      ) : null}
      {/* network */}
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: netP }}>
        <polyline
          points={nodes.map((n) => n.join(",")).join(" ")}
          fill="none"
          stroke={C.cyan}
          strokeWidth={4}
          style={{ filter: svgGlow(C.cyan, 4) }}
        />
        {frame > netAt ? <circle cx={pk[0]} cy={pk[1]} r={12} fill={C.gold} style={{ filter: svgGlow(C.gold, 6) }} /> : null}
      </svg>
      {nodes.map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 45, top: y - 70, opacity: netP }}>
          <RouterIcon size={90} />
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 90, width: "100%", display: "flex", justifyContent: "center", gap: 120 }}>
        <Appear at={streetAt}>
          <Kicker style={{ fontSize: 34 }}>Across the street</Kicker>
        </Appear>
        <Appear at={planetAt}>
          <Kicker color={C.gold} style={{ fontSize: 34 }}>
            = Across the planet
          </Kicker>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};
