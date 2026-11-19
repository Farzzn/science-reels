import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  BigText,
  Center,
  ChapterCard,
  Kicker,
  Panel,
  prog,
  SceneFade,
  Terminal,
} from "./components";
import { BookIcon, EnvelopeIcon, LaptopIcon, ServerIcon, Stopwatch } from "./icons";
import { CITIES, USMap } from "./maps";
import { C, glow, INTER, MONO, svgGlow } from "./theme";
import { makeCue } from "./timing";

const city = (n: string) => CITIES.find((c) => c.name === n)!.ll;

// ===========================================================================
// CHAPTER 2 — HOW AN EMAIL ACTUALLY TRAVELS
// ===========================================================================
export const Ch2: React.FC = () => {
  const cue = makeCue("ch2");
  const tTcp = cue("That connection is built");
  const tKey = cue("Now here's the key detail");
  const tGen = cue("Normally that timeout");
  const tKeep = cue("Keep that timer in mind");
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tTcp - 6}>
        <MailFlow
          serverAt={cue("hands the message")}
          sendmailAt={cue("called Sendmail")}
          addrAt={cue("looks at the address")}
          dnsAt={cue("Domain Name System")}
          answerAt={cue("which computer accepts mail")}
          connectAt={cue("open a connection")}
        />
      </SceneFade>
      <SceneFade from={tTcp - 4} to={tKey - 6}>
        <Handshake
          titleAt={cue("protocol called TCP")}
          synAt={cue("Hello, are you there")}
          synAckAt={cue("Yes, I'm here")}
          ackAt={cue("Let's talk")}
          mailAt={cue("actual email get sent")}
        />
      </SceneFade>
      <SceneFade from={tKey - 4} to={tGen - 6}>
        <TimeoutScene
          offAt={cue("switched off")}
          brokenAt={cue("or broken")}
          cutAt={cue("cable might be cut")}
          timerAt={cue("called a timeout")}
          giveUpAt={cue("gives up")}
        />
      </SceneFade>
      <SceneFade from={tGen - 4} to={tKeep - 6}>
        <GenerousScene at={tGen} rtAt={cue("round trip across")} neverAt={cue("distance never matters")} />
      </SceneFade>
      <SceneFade from={tKeep - 4} to={cue.len + 30}>
        <KeepTimer at={tKeep} hapAt={cue("something had happened")} />
      </SceneFade>
      <ChapterCard num={2} title="How an Email Actually Travels" />
    </AbsoluteFill>
  );
};

const Node: React.FC<{ x: number; y: number; label: string; sub?: string; children: React.ReactNode; at: number; color?: string }> = ({
  x,
  y,
  label,
  sub,
  children,
  at,
  color = C.cyan,
}) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <Appear at={at} from="scale">
      {children}
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 36, color, marginTop: 8 }}>{label}</div>
      {sub ? <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 4 }}>{sub}</div> : null}
    </Appear>
  </div>
);

const MailFlow: React.FC<{
  serverAt: number;
  sendmailAt: number;
  addrAt: number;
  dnsAt: number;
  answerAt: number;
  connectAt: number;
}> = ({ serverAt, sendmailAt, addrAt, dnsAt, answerAt, connectAt }) => {
  const frame = useCurrentFrame();
  const env1 = prog(frame, serverAt, serverAt + 30);
  const conn = prog(frame, connectAt, connectAt + 35);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={300} y1={560} x2={300 + 520 * prog(frame, serverAt - 10, serverAt + 15)} y2={560} stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 4) }} />
        <line x1={960} y1={560} x2={960 + 660 * conn} y2={560} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" style={{ filter: svgGlow(C.gold, 4) }} />
      </svg>
      <Node x={240} y={540} label="Your computer" at={0}>
        <LaptopIcon size={200} />
      </Node>
      <Node x={900} y={540} label="Mail server" sub={frame >= sendmailAt ? "running SENDMAIL" : undefined} at={serverAt}>
        <ServerIcon size={210} blink={frame} />
      </Node>
      <Node x={1660} y={540} label="University in California" sub="mail server" at={connectAt} color={C.gold}>
        <ServerIcon size={210} color={C.gold} blink={frame + 7} />
      </Node>
      {frame >= serverAt ? (
        <div style={{ position: "absolute", left: 300 + env1 * 520 - 45, top: 470 }}>
          <EnvelopeIcon size={90} color={C.gold} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 640, top: 150, width: 640, textAlign: "center" }}>
        <Appear at={addrAt}>
          <Panel style={{ padding: "18px 28px", display: "inline-block" }}>
            <span style={{ fontFamily: MONO, fontSize: 34, color: C.white }}>
              To: someone@<span style={{ color: C.gold }}>university.edu</span>
            </span>
          </Panel>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 610, top: 760, width: 700 }}>
        <Appear at={dnsAt}>
          <Panel style={{ padding: "22px 30px", display: "flex", gap: 26, alignItems: "center" }}>
            <BookIcon size={110} color={C.green} />
            <div>
              <Kicker color={C.green} style={{ fontSize: 22 }}>DNS · the internet&apos;s phone book</Kicker>
              <div style={{ fontFamily: MONO, fontSize: 28, color: C.white, marginTop: 10 }}>mail for university.edu → ?</div>
              {frame >= answerAt ? (
                <div style={{ fontFamily: MONO, fontSize: 28, color: C.green, marginTop: 6 }}>→ mail.university.edu ✓</div>
              ) : null}
            </div>
          </Panel>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 1290, top: 620, width: 420, textAlign: "center" }}>
        <Appear at={connectAt + 10}>
          <Kicker color={C.gold} style={{ fontSize: 24 }}>open a connection…</Kicker>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

const Arrow: React.FC<{ at: number; dir: 1 | -1; y: number; label: string; tag: string; color: string }> = ({ at, dir, y, label, tag, color }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, at + 22);
  if (frame < at) return null;
  const x1 = dir === 1 ? 470 : 1450;
  const x2 = dir === 1 ? 1450 : 470;
  const xe = x1 + (x2 - x1) * p;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x1} y1={y} x2={xe} y2={y} stroke={color} strokeWidth={5} style={{ filter: svgGlow(color, 5) }} />
        <polygon
          points={`${xe},${y} ${xe - dir * 26},${y - 14} ${xe - dir * 26},${y + 14}`}
          fill={color}
          style={{ filter: svgGlow(color, 5) }}
        />
      </svg>
      <div style={{ position: "absolute", left: 470, width: 980, top: y - 74, textAlign: "center", opacity: p }}>
        <span style={{ fontFamily: MONO, fontSize: 24, color, letterSpacing: 3, marginRight: 18 }}>{tag}</span>
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, color: C.white }}>{label}</span>
      </div>
    </>
  );
};

const Handshake: React.FC<{ titleAt: number; synAt: number; synAckAt: number; ackAt: number; mailAt: number }> = ({
  titleAt,
  synAt,
  synAckAt,
  ackAt,
  mailAt,
}) => {
  const frame = useCurrentFrame();
  const env = prog(frame, mailAt, mailAt + 40);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
        <Appear at={titleAt}>
          <Kicker>TCP · the digital handshake</Kicker>
        </Appear>
      </div>
      <Node x={300} y={560} label="Our server" at={0}>
        <ServerIcon size={220} blink={frame} />
      </Node>
      <Node x={1620} y={560} label="Their server" at={0} color={C.gold}>
        <ServerIcon size={220} color={C.gold} blink={frame + 5} />
      </Node>
      <Arrow at={synAt} dir={1} y={330} label="“Hello, are you there?”" tag="SYN" color={C.cyan} />
      <Arrow at={synAckAt} dir={-1} y={500} label="“Yes, I'm here. Are you?”" tag="SYN-ACK" color={C.gold} />
      <Arrow at={ackAt} dir={1} y={670} label="“Yes. Let's talk.”" tag="ACK" color={C.cyan} />
      {frame >= mailAt ? (
        <div style={{ position: "absolute", left: 470 + env * 900, top: 790 }}>
          <EnvelopeIcon size={110} color={C.green} />
        </div>
      ) : null}
      <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center" }}>
        <Appear at={mailAt}>
          <Kicker color={C.green}>then: sender · recipient · subject · message</Kicker>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

const TimeoutScene: React.FC<{ offAt: number; brokenAt: number; cutAt: number; timerAt: number; giveUpAt: number }> = ({
  offAt,
  brokenAt,
  cutAt,
  timerAt,
  giveUpAt,
}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - timerAt) / 30;
  const gaveUp = frame >= giveUpAt;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 200, display: "flex", flexDirection: "column", gap: 34 }}>
        <Appear at={offAt - 20}>
          <Kicker color={C.dim}>What if the other side…</Kicker>
        </Appear>
        {[
          { t: "…is switched off", at: offAt },
          { t: "…is broken", at: brokenAt },
          { t: "…lost its cable", at: cutAt },
        ].map((x) => (
          <Appear key={x.t} at={x.at} from="left">
            <BigText size={70} color={C.white}>
              <span style={{ color: C.red }}>✕ </span>
              {x.t}
            </BigText>
          </Appear>
        ))}
      </div>
      <div style={{ position: "absolute", right: 200, top: 190, textAlign: "center" }}>
        <Appear at={timerAt} from="scale">
          <Stopwatch size={420} t={t} max={gaveUp ? t : 6} danger={gaveUp} />
          <BigText size={80} color={gaveUp ? C.red : C.cyan} glowColor={gaveUp ? C.red : C.cyan} style={{ marginTop: 10 }}>
            TIMEOUT
          </BigText>
          {gaveUp ? (
            <Kicker color={C.red} style={{ marginTop: 14 }}>
              give up · retry later
            </Kicker>
          ) : null}
        </Appear>
      </div>
    </AbsoluteFill>
  );
};

const GenerousScene: React.FC<{ at: number; rtAt: number; neverAt: number }> = ({ at, rtAt, neverAt }) => {
  const frame = useCurrentFrame();
  const a = prog(frame, at + 10, at + 50);
  const b = prog(frame, rtAt, rtAt + 25);
  return (
    <Center>
      <div style={{ width: 1500 }}>
        <Kicker>Normal settings</Kicker>
        <div style={{ marginTop: 50 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: C.white }}>
            Timeout <span style={{ color: C.dim, fontSize: 32 }}>· seconds to minutes</span>
          </div>
          <div style={{ height: 54, width: 1500 * a, background: C.cyan, boxShadow: glow(C.cyan, 10), borderRadius: 10, marginTop: 14 }} />
        </div>
        <div style={{ marginTop: 50, opacity: b > 0 ? 1 : 0 }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: C.white }}>
            Round trip across the internet <span style={{ color: C.dim, fontSize: 32 }}>· a fraction of a second</span>
          </div>
          <div style={{ height: 54, width: 18 * b, background: C.gold, boxShadow: glow(C.gold, 10), borderRadius: 10, marginTop: 14 }} />
        </div>
        <Appear at={neverAt} style={{ marginTop: 70, textAlign: "center" }}>
          <BigText size={84} color={C.green}>
            → distance never matters
          </BigText>
        </Appear>
      </div>
    </Center>
  );
};

const KeepTimer: React.FC<{ at: number; hapAt: number }> = ({ at, hapAt }) => {
  const frame = useCurrentFrame();
  const glitch = frame >= hapAt ? Math.sin(frame * 3.1) * 8 * (Math.floor(frame / 4) % 2) : 0;
  return (
    <Center>
      <div style={{ textAlign: "center" }}>
        <Appear at={at} from="scale">
          <div style={{ transform: `translateX(${glitch}px)` }}>
            <Stopwatch size={380} t={(frame - at) / 30} max={4} danger={frame >= hapAt} />
          </div>
        </Appear>
        <Appear at={hapAt} style={{ marginTop: 30 }}>
          <BigText size={70} color={C.red} glowColor={C.red}>
            Something happened to it…
          </BigText>
        </Appear>
      </div>
    </Center>
  );
};

// ===========================================================================
// CHAPTER 3 — THE EXPERIMENT
// ===========================================================================
export const Ch3: React.FC = () => {
  const cue = makeCue("ch3");
  const tTest = cue("He logged into");
  const tRight = cue("The statisticians were right");
  const tRemember = cue("And that's when");
  const near = cue("A server close by");
  const mid = cue("a couple of hundred miles");
  const far = cue("much farther away");
  const far2 = cue("another distant server");
  const inside = cue("just inside");
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tTest - 6}>
        <Center>
          <Appear at={cue("tested it himself")} from="scale">
            <BigText size={120} style={{ textAlign: "center" }}>
              So he <span style={{ color: C.cyan }}>tested it</span> himself.
            </BigText>
          </Appear>
        </Center>
      </SceneFade>
      <SceneFade from={tTest - 4} to={tRight - 6} zoom={false}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 70, top: 200 }}>
            <Terminal
              width={860}
              height={640}
              fontSize={25}
              lines={[
                { at: tTest, text: "telnet smtp.raleigh.edu 25", prompt: true },
                { at: near, text: "Connected.  ✓   (~25 mi)", color: C.green },
                { at: mid - 30, text: "telnet smtp.washington.edu 25", prompt: true },
                { at: mid + 12, text: "Connected.  ✓   (~230 mi)", color: C.green },
                { at: far - 20, text: "telnet smtp.sanfrancisco.edu 25", prompt: true },
                { at: far + 30, text: "Connection failed ✗ (~2,400 mi)", color: C.red },
                { at: far2 - 20, text: "telnet smtp.dallas.edu 25", prompt: true },
                { at: far2 + 18, text: "Connection failed ✗ (~1,000 mi)", color: C.red },
                { at: inside - 20, text: "telnet smtp.detroit.edu 25", prompt: true },
                { at: inside + 30, text: "Connected.  ✓   (~510 mi)", color: C.green },
              ]}
            />
          </div>
          <div style={{ position: "absolute", right: 30, top: 170 }}>
            <USMap
              width={980}
              height={700}
              circleAt={inside + 20}
              pings={[
                { ll: city("Raleigh"), at: near, ok: true },
                { ll: city("Washington"), at: mid + 10, ok: true },
                { ll: city("San Francisco"), at: far + 26, ok: false },
                { ll: city("Dallas"), at: far2 + 14, ok: false },
                { ll: city("Detroit"), at: inside + 26, ok: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }}>
            <Kicker>Connecting to mail servers by hand</Kicker>
          </div>
        </AbsoluteFill>
      </SceneFade>
      <SceneFade from={tRight - 4} to={tRemember - 6}>
        <Center>
          <div style={{ textAlign: "center" }}>
            <Appear at={tRight}>
              <Kicker color={C.green} style={{ fontSize: 34 }}>The statisticians were right</Kicker>
            </Appear>
            <Appear at={cue("physically close")} style={{ marginTop: 30 }}>
              <BigText size={100}>
                Only <span style={{ color: C.gold }}>physically close</span>
                <br />
                machines could be reached.
              </BigText>
            </Appear>
          </div>
        </Center>
      </SceneFade>
      <SceneFade from={tRemember - 4} to={cue.len + 30}>
        <UpdateScene at={cue("consultant had installed")} noticeAt={cue("nobody noticed")} />
      </SceneFade>
      <ChapterCard num={3} title="The Experiment" />
    </AbsoluteFill>
  );
};

const UpdateScene: React.FC<{ at: number; noticeAt: number }> = ({ at, noticeAt }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at + 10, at + 110, false);
  const bad = frame >= noticeAt;
  const col = bad ? C.red : C.cyan;
  return (
    <Center>
      <div style={{ width: 1200, textAlign: "center" }}>
        <Appear at={at - 30}>
          <Kicker color={C.dim}>A few days earlier…</Kicker>
        </Appear>
        <Appear at={at} style={{ marginTop: 40 }}>
          <Panel style={{ padding: "50px 60px", textAlign: "left" }} border={bad ? C.red : C.panelBorder}>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 48, color: C.white }}>Operating system update</div>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 8 }}>installed by a consultant · “routine”</div>
            <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.08)", marginTop: 34, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p * 100}%`, background: col, boxShadow: glow(col, 10) }} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: col, marginTop: 16 }}>
              {p < 1 ? `Installing… ${Math.round(p * 100)}%` : bad ? "Complete. (something changed…)" : "Complete ✓"}
            </div>
          </Panel>
        </Appear>
      </div>
    </Center>
  );
};

// ===========================================================================
// CHAPTER 4 — THE CULPRIT
// ===========================================================================
export const Ch4: React.FC = () => {
  const cue = makeCue("ch4");
  const tConfig = cue("But the configuration file");
  const tZeroTime = cue("Now, a computer can't");
  const tSend = cue("So the server would send");
  const tQ = cue("Which raises the question");
  return (
    <AbsoluteFill>
      <SceneFade from={0} to={tConfig - 6}>
        <VersionSwap olderAt={cue("An older one")} v8At={cue("Sendmail version 8")} v5At={cue("swapped in Sendmail version 5")} />
      </SceneFade>
      <SceneFade from={tConfig - 4} to={tZeroTime - 6}>
        <ConfigScene
          at={tConfig}
          manualAt={cue("Imagine handing")}
          skipAt={cue("just skip them")}
          timeoutAt={cue("skipped was the timeout")}
          zeroAt={cue("set to zero")}
        />
      </SceneFade>
      <SceneFade from={tZeroTime - 4} to={tSend - 6}>
        <ZeroTimeScene at={tZeroTime} stepsAt={cue("Starting the connection")} msAt={cue("roughly three milliseconds")} />
      </SceneFade>
      <SceneFade from={tSend - 4} to={tQ - 6}>
        <WindowScene at={tSend} okAt={cue("If the reply arrived")} failAt={cue("If it didn't")} />
      </SceneFade>
      <SceneFade from={tQ - 4} to={cue.len + 30}>
        <Center>
          <Appear at={cue("how far can anything travel")} from="scale">
            <BigText size={130} style={{ textAlign: "center" }}>
              How far can anything
              <br />
              travel in <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>3 ms</span>?
            </BigText>
          </Appear>
        </Center>
      </SceneFade>
      <ChapterCard num={4} title="The Culprit" />
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ text: string; color: string; size?: number }> = ({ text, color, size = 120 }) => (
  <div
    style={{
      fontFamily: INTER,
      fontWeight: 900,
      fontSize: size,
      color,
      border: `5px solid ${color}`,
      borderRadius: 30,
      padding: "20px 50px",
      boxShadow: glow(color, 12),
      textShadow: glow(color, 8),
    }}
  >
    {text}
  </div>
);

const VersionSwap: React.FC<{ olderAt: number; v8At: number; v5At: number }> = ({ olderAt, v8At, v5At }) => {
  const frame = useCurrentFrame();
  const flip = prog(frame, v5At, v5At + 18);
  const rot = flip * 180;
  const showV5 = rot > 90;
  return (
    <Center>
      <div style={{ textAlign: "center" }}>
        <Kicker>The update replaced Sendmail…</Kicker>
        <div style={{ marginTop: 60, transform: `perspective(1200px) rotateY(${showV5 ? rot - 180 : rot}deg)`, display: "inline-block" }}>
          <Appear at={Math.min(v8At, olderAt)} from="scale">
            <Badge text={showV5 ? "SENDMAIL v5" : "SENDMAIL v8"} color={showV5 ? C.red : C.green} />
          </Appear>
        </div>
        <Appear at={olderAt} style={{ marginTop: 60 }}>
          <BigText size={72} color={showV5 ? C.red : C.white}>
            Not newer. <span style={{ color: C.red }}>Older.</span>
          </BigText>
        </Appear>
      </div>
    </Center>
  );
};

const CONFIG = [
  "# sendmail.cf  (written for v8)",
  "O QueueDirectory=/var/spool/mqueue",
  "O DeliveryMode=background",
  "O Timeout.queuereturn=5d",
  "O Timeout.connect=1m",
  "O MaxMessageSize=1000000",
  "O LogLevel=9",
];

const ConfigScene: React.FC<{ at: number; manualAt: number; skipAt: number; timeoutAt: number; zeroAt: number }> = ({
  at,
  manualAt,
  skipAt,
  timeoutAt,
  zeroAt,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 170 }}>
        <Appear at={at}>
          <Panel style={{ width: 1020, padding: "34px 40px" }}>
            {CONFIG.map((l, i) => {
              const skipped = i > 0 && i !== 1 && frame >= skipAt + i * 5;
              const isTimeout = i === 4;
              const hot = isTimeout && frame >= timeoutAt;
              const zero = isTimeout && frame >= zeroAt;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: MONO,
                    fontSize: 32,
                    lineHeight: 1.75,
                    color: i === 0 ? C.dim : hot ? C.red : skipped ? "rgba(127,147,196,0.35)" : C.white,
                    textDecoration: skipped && !hot ? "line-through" : "none",
                    textShadow: hot ? glow(C.red, 8) : "none",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{zero ? "O Timeout.connect = 0" : l}</span>
                  {skipped && !hot ? <span style={{ fontSize: 22, color: C.dim }}>ignored</span> : null}
                  {hot ? <span style={{ fontSize: 22 }}>{zero ? "◀ ZERO" : "◀ skipped!"}</span> : null}
                </div>
              );
            })}
          </Panel>
        </Appear>
      </div>
      <div style={{ position: "absolute", right: 110, top: 220, width: 560 }}>
        <Appear at={at + 10}>
          <Badge text="v5" color={C.red} size={90} />
        </Appear>
        <Appear at={manualAt} style={{ marginTop: 50 }}>
          <BigText size={54}>Reads a manual for a newer machine…</BigText>
        </Appear>
        <Appear at={skipAt} style={{ marginTop: 30 }}>
          <BigText size={54} color={C.gold}>
            …and skips what it doesn&apos;t understand.
          </BigText>
        </Appear>
        <Appear at={zeroAt + 10} style={{ marginTop: 40 }}>
          <BigText size={110} color={C.red} glowColor={C.red}>
            wait = 0 s
          </BigText>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 60 }}>
        <Kicker color={C.dim} style={{ fontSize: 18 }}>illustrative config</Kicker>
      </div>
    </AbsoluteFill>
  );
};

const ZeroTimeScene: React.FC<{ at: number; stepsAt: number; msAt: number }> = ({ at, stepsAt, msAt }) => {
  const frame = useCurrentFrame();
  const steps = ["start the connection", "check the clock", "decide to give up"];
  const ms = interpolate(frame, [msAt, msAt + 30], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Center>
      <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
        <div>
          <Appear at={at}>
            <Kicker color={C.dim}>Even “zero” takes time</Kicker>
          </Appear>
          {steps.map((s, i) => (
            <Appear key={s} at={stepsAt + i * 28} from="left" style={{ marginTop: 34 }}>
              <BigText size={60}>
                <span style={{ color: C.cyan, fontFamily: MONO, fontSize: 40 }}>{i + 1}. </span>
                {s}
              </BigText>
            </Appear>
          ))}
        </div>
        <Appear at={msAt} from="scale">
          <div style={{ textAlign: "center" }}>
            <BigText size={210} color={C.gold} glowColor={C.gold}>
              {ms.toFixed(1)} ms
            </BigText>
            <div style={{ fontFamily: MONO, fontSize: 34, color: C.dim }}>= 0.003 seconds</div>
          </div>
        </Appear>
      </div>
    </Center>
  );
};

const WindowScene: React.FC<{ at: number; okAt: number; failAt: number }> = ({ at, okAt, failAt }) => {
  const frame = useCurrentFrame();
  const out = prog(frame, at + 10, at + 40, false);
  const t = Math.min(3, Math.max(0, ((frame - at - 10) / 30) * 3));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}>
        <Kicker>A 3-millisecond window</Kicker>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={380} y1={420} x2={380 + 1160 * out} y2={420} stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 5) }} />
      </svg>
      <div style={{ position: "absolute", left: 160, top: 300 }}>
        <ServerIcon size={220} blink={frame} />
      </div>
      <div style={{ position: "absolute", left: 830, top: 300, fontFamily: MONO, fontSize: 40, color: C.white }}>“hello…”</div>
      <div style={{ position: "absolute", right: 180, top: 280, textAlign: "center" }}>
        <Stopwatch size={240} t={t} max={3} danger={t >= 3} />
        <div style={{ fontFamily: MONO, fontSize: 38, color: t >= 3 ? C.red : C.gold }}>{t.toFixed(2)} ms</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", gap: 120 }}>
        <Appear at={okAt}>
          <Panel style={{ padding: "30px 46px" }} border={C.green}>
            <BigText size={52} color={C.green}>
              Reply in time → ✓ delivered
            </BigText>
          </Panel>
        </Appear>
        <Appear at={failAt}>
          <Panel style={{ padding: "30px 46px" }} border={C.red}>
            <BigText size={52} color={C.red}>
              Too late → ✗ failed
            </BigText>
          </Panel>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};
