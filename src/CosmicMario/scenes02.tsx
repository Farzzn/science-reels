import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Appear, BigText, Center, ChapterCard, Kicker, Panel, prog, SceneFade } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { makeCosmicCue } from "./timing";
import { CapacitorBucketSVG, MidRollSubscribeToast, YearBadge } from "./visuals";

// ===========================================================================
// CHAPTER 3 — THE BULLET FROM DEEP SPACE (Supernova -> 15km Air Shower -> SEU)
// ===========================================================================
export const CosmicCh3: React.FC = () => {
  const cue = makeCosmicCue("ch3");
  const frame = useCurrentFrame();

  const tCollision = cue("When one of these");
  const tShower = cue("That collision triggers");
  const tStrike = cue("When one of those stray");
  const tSubscribe = cue("If you enjoy stories");

  return (
    <AbsoluteFill>
      {/* Beat 1: Supernova Primary Cosmic Ray Protons */}
      <SceneFade from={0} to={tCollision - 6}>
        <Center>
          <div style={{ display: "flex", alignItems: "center", gap: 74, width: 1700 }}>
            <div style={{ borderRadius: 24, overflow: "hidden", border: `2px solid ${C.gold}`, boxShadow: glow(C.gold, 14), width: 880, height: 500 }}>
              <Img src={staticFile("cosmic/supernova-ray.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ width: 740 }}>
              <Kicker color={C.gold}>DEEP SPACE ACCELERATORS</Kicker>
              <BigText size={68} style={{ marginTop: 14 }}>
                Supernovas &amp; Black Holes
              </BigText>
              <Appear at={cue("speed of light")} style={{ marginTop: 28 }}>
                <Panel style={{ padding: "24px 34px" }} border={C.cyan}>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: C.cyan }}>PRIMARY COSMIC RAY</div>
                  <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 44, color: C.white, marginTop: 8 }}>
                    Proton @ 99.999% Speed of Light
                  </div>
                </Panel>
              </Appear>
            </div>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 2 & 3: 15 km Atmospheric Billiard-Ball Collision & Muon/Neutron Shower */}
      <SceneFade from={tCollision - 4} to={tStrike - 6}>
        <AtmosphericShowerSVG
          hitAt={cue("fifteen kilometers")}
          showerAt={tShower}
          roofAt={cue("through your roof")}
        />
        <MidRollSubscribeToast at={tSubscribe} dur={140} />
      </SceneFade>

      {/* Beat 4: Neutron Strikes Silicon Lattice -> Single-Event Upset (0 -> 1) */}
      <SceneFade from={tStrike - 4} to={cue.len + 30}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 84, top: 150, width: 880 }}>
            <Kicker color={C.red}>IONIZATION TRACK IN SILICON</Kicker>
            <BigText size={68} style={{ marginTop: 14 }}>
              Single-Event Upset (<span style={{ color: C.gold }}>SEU</span>)
            </BigText>

            {/* Silicon Crystal Lattice Ionization SVG */}
            <svg width={820} height={470} viewBox="0 0 820 470" style={{ marginTop: 26 }}>
              {/* 4x7 Silicon Atom Lattice Grid */}
              {new Array(4).fill(0).map((_, r) =>
                new Array(7).fill(0).map((__, c) => {
                  const ax = 80 + c * 110;
                  const ay = 75 + r * 105;
                  const nearRay = Math.abs(ax - (120 + r * 165)) < 85;
                  const col = nearRay && frame >= cue("rips electrons") ? C.red : C.cyan;
                  return (
                    <g key={`${r}-${c}`}>
                      {c < 6 && <line x1={ax} y1={ay} x2={ax + 110} y2={ay} stroke="rgba(62,224,255,0.22)" strokeWidth={2} />}
                      {r < 3 && <line x1={ax} y1={ay} x2={ax} y2={ay + 105} stroke="rgba(62,224,255,0.22)" strokeWidth={2} />}
                      <circle cx={ax} cy={ay} r={22} fill="rgba(10,20,48,0.9)" stroke={col} strokeWidth={3} style={{ filter: svgGlow(col, 4) }} />
                      <text x={ax} y={ay + 6} textAnchor="middle" fill={col} fontFamily={MONO} fontWeight={700} fontSize={16}>
                        Si
                      </text>
                    </g>
                  );
                }),
              )}
              {/* Diagonal Neutron Path */}
              <line x1={40} y1={15} x2={680} y2={420} stroke={C.gold} strokeWidth={7} style={{ filter: svgGlow(C.gold, 10) }} />
              <text x={70} y={40} fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={22}>
                HIGH-SPEED NEUTRON
              </text>
            </svg>
          </div>

          <div style={{ position: "absolute", right: 110, top: 185 }}>
            <CapacitorBucketSVG
              fillLevel={0.05}
              label="EMPTY 0  →  FILLED 1"
              sublabel="FLIPPED IN < 1 NANOSECOND"
              strikeAt={cue("empty zero bucket") - 10}
              width={520}
              height={580}
              electronCount={22}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      <ChapterCard num={3} title="The Bullet From Deep Space" />
    </AbsoluteFill>
  );
};

const AtmosphericShowerSVG: React.FC<{ hitAt: number; showerAt: number; roofAt: number }> = ({
  hitAt,
  showerAt,
  roofAt,
}) => {
  const frame = useCurrentFrame();
  const pHit = prog(frame, hitAt - 20, hitAt);
  const pShower = prog(frame, showerAt, showerAt + 55);
  const rays = [-420, -280, -140, 0, 140, 280, 420];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 84, top: 90, width: 640 }}>
        <Kicker color={C.cyan}>15 KM ABOVE EARTH · UPPER ATMOSPHERE</Kicker>
        <BigText size={62} style={{ marginTop: 12 }}>
          The Subatomic Billiard Break
        </BigText>
        <Appear at={showerAt} style={{ marginTop: 24 }}>
          <Panel style={{ padding: "20px 28px" }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.gold }}>SECONDARY PARTICLE CASCADE</div>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: C.white, marginTop: 6 }}>
              Pions → Muons &amp; High-Speed Neutrons
            </div>
          </Panel>
        </Appear>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* 15km Atmosphere Line */}
        <line x1={120} y1={310} x2={1800} y2={310} stroke={C.cyan} strokeWidth={2} strokeDasharray="10 10" opacity={0.5} />
        <text x={1780} y={294} textAnchor="end" fill={C.cyan} fontFamily={MONO} fontSize={22} fontWeight={700}>
          ALTITUDE: 15 KILOMETERS
        </text>

        {/* Incoming Primary Proton */}
        <line
          x1={1150}
          y1={40}
          x2={1150}
          y2={40 + 270 * pHit}
          stroke={C.gold}
          strokeWidth={8}
          style={{ filter: svgGlow(C.gold, 10) }}
        />

        {/* Nitrogen Atom at [1150, 310] */}
        <g transform="translate(1150, 310)" style={{ filter: svgGlow(C.cyan, 6) }}>
          <circle cx={0} cy={0} r={34} fill="rgba(10,20,48,0.95)" stroke={pHit >= 1 ? C.red : C.cyan} strokeWidth={4} />
          <text x={0} y={8} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={24}>
            N / O
          </text>
        </g>

        {/* Secondary Shower Cascade */}
        {pShower > 0 &&
          rays.map((dx, i) => (
            <g key={i} style={{ filter: svgGlow(i % 2 === 0 ? C.gold : C.cyan, 5) }}>
              <line
                x1={1150}
                y1={344}
                x2={1150 + dx * pShower}
                y2={344 + 540 * pShower}
                stroke={i % 2 === 0 ? C.gold : C.cyan}
                strokeWidth={3.5}
                strokeDasharray="12 8"
              />
              <circle cx={1150 + dx * pShower} cy={344 + 540 * pShower} r={8} fill="#fff" />
            </g>
          ))}

        {/* Ground Building Roof, Desk & Human Silhouette at Bottom */}
        <g opacity={frame >= roofAt - 15 ? 1 : 0.35} transform="translate(830, 740)">
          {/* House Roof & Walls */}
          <polygon points="0,80 320,0 640,80" fill="rgba(62,224,255,0.08)" stroke={C.cyan} strokeWidth={3} />
          <rect x={60} y={80} width={520} height={170} fill="rgba(10,20,48,0.65)" stroke={C.cyan} strokeWidth={3} />
          {/* Desk + Computer */}
          <rect x={220} y={175} width={180} height={12} fill={C.gold} />
          <rect x={280} y={130} width={60} height={42} rx={4} stroke={C.gold} strokeWidth={3} fill="none" />
          <text x={320} y={235} textAnchor="middle" fill={C.white} fontFamily={MONO} fontSize={20} fontWeight={700}>
            PASSES RIGHT THROUGH ROOFS &amp; CHIPS
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 4 — THE 4,096-VOTE MYSTERY (May 18, 2003 Schaerbeek, Belgium)
// ===========================================================================
export const CosmicCh4: React.FC = () => {
  const cue = makeCosmicCue("ch4");
  const frame = useCurrentFrame();

  const tRecount = cue("Every single candidate's");
  const tWhy = cue("Why four thousand");

  const powers = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

  return (
    <AbsoluteFill>
      <YearBadge year="MAY 18, 2003" location="SCHAERBEEK, BELGIUM · FEDERAL ELECTION" at={0} color={C.gold} />

      {/* Beat 1 & 2: Electronic Voting Machine + 4,096 Anomaly */}
      <SceneFade from={0} to={tWhy - 6}>
        <AbsoluteFill>
          {/* Left: Illustrated Electronic Ballot Machine & Magnetic Card */}
          <div style={{ position: "absolute", left: 84, top: 195, width: 700 }}>
            <Kicker color={C.cyan}>ELECTRONIC VOTING TERMINAL</Kicker>
            <BigText size={62} style={{ marginTop: 10 }}>
              Maria Vindevoghel&apos;s Impossible Tally
            </BigText>

            <svg width={620} height={460} viewBox="0 0 620 460" style={{ marginTop: 24 }}>
              {/* Voting Terminal Kiosk */}
              <rect x={60} y={30} width={300} height={380} rx={22} fill="rgba(10,20,48,0.88)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 6) }} />
              <rect x={95} y={65} width={230} height={155} rx={10} fill="rgba(62,224,255,0.12)" stroke={C.cyan} strokeWidth={2.5} />
              <text x={210} y={130} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={22}>
                BALLOT TALLY
              </text>
              <text x={210} y={175} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={36}>
                +4,096 ERR
              </text>
              {/* Card Slot */}
              <rect x={135} y={265} width={150} height={16} rx={6} fill={C.gold} />
              {/* Magnetic Ballot Card */}
              <g transform="translate(395, 130)">
                <rect x={0} y={0} width={180} height={250} rx={14} fill="rgba(255,194,77,0.15)" stroke={C.gold} strokeWidth={3.5} />
                <rect x={24} y={0} width={32} height={250} fill={C.gold} fillOpacity={0.65} />
                <text x={110} y={125} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={700} fontSize={18}>
                  PAPER CARD
                </text>
                <text x={110} y={155} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={800} fontSize={20}>
                  RECOUNT ✓
                </text>
              </g>
            </svg>
          </div>

          {/* Right: Vote Comparison Bars */}
          <div style={{ position: "absolute", right: 84, top: 215, width: 920 }}>
            <Panel style={{ padding: "40px 48px" }} border={frame >= tRecount ? C.red : C.panelBorder}>
              <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>CANDIDATE VOTE TALLY COMPARISON</div>

              <div style={{ marginTop: 34 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: INTER, fontWeight: 800, fontSize: 32, color: C.white }}>
                  <span>Hand Paper Recount (Actual)</span>
                  <span style={{ color: C.green }}>Baseline ✓</span>
                </div>
                <div style={{ height: 42, width: 240, background: C.green, borderRadius: 10, marginTop: 12, boxShadow: glow(C.green, 8) }} />
              </div>

              <div style={{ marginTop: 42 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: INTER, fontWeight: 800, fontSize: 32, color: C.white }}>
                  <span>Electronic Computer Tally</span>
                  <span style={{ color: C.red }}>+4,096 EXTRA VOTES!</span>
                </div>
                <div
                  style={{
                    height: 42,
                    width: 240 + 560 * prog(frame, cue("far more votes"), cue("far more votes") + 35),
                    background: C.red,
                    borderRadius: 10,
                    marginTop: 12,
                    boxShadow: glow(C.red, 12),
                  }}
                />
              </div>

              <Appear at={cue("exactly four thousand")} style={{ marginTop: 44, textAlign: "center" }}>
                <BigText size={92} color={C.gold} glowColor={C.gold}>
                  +4,096 VOTES
                </BigText>
              </Appear>
            </Panel>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3: Binary Power-of-2 Smoking Gun (2^12 = 4,096) */}
      <SceneFade from={tWhy - 4} to={cue.len + 30}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 175 }}>
          <Kicker color={C.gold}>THE BINARY SMOKING GUN</Kicker>
          <BigText size={74} style={{ marginTop: 12 }}>
            4,096 = <span style={{ color: C.gold, textShadow: glow(C.gold, 14) }}>2¹²</span> (A Single Flipped Bit)
          </BigText>

          {/* 13 Binary Bit Columns from 2^12 down to 2^0 */}
          <div style={{ display: "flex", gap: 14, marginTop: 58 }}>
            {powers
              .slice()
              .reverse()
              .map((val, idx) => {
                const isBit12 = val === 4096;
                const flipped = isBit12 && frame >= cue("two to the power of twelve");
                const col = flipped ? C.red : isBit12 ? C.gold : C.cyan;
                return (
                  <div
                    key={val}
                    style={{
                      width: 118,
                      padding: "20px 10px",
                      borderRadius: 18,
                      background: flipped ? "rgba(255,77,94,0.24)" : "rgba(10,20,48,0.82)",
                      border: `3px solid ${col}`,
                      boxShadow: flipped ? glow(C.red, 18) : "none",
                      textAlign: "center",
                      transform: flipped ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim, fontWeight: 700 }}>2^{12 - idx}</div>
                    <div style={{ fontFamily: MONO, fontSize: 54, fontWeight: 900, color: flipped ? "#fff" : col, marginTop: 10 }}>
                      {flipped ? "1" : "0"}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: flipped ? C.gold : C.white, marginTop: 10 }}>
                      {val}
                    </div>
                  </div>
                );
              })}
          </div>

          <Appear at={cue("Investigators concluded")} style={{ marginTop: 52 }}>
            <Panel style={{ padding: "22px 48px" }} border={C.gold}>
              <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 42, color: C.white }}>
                1 Cosmic Ray Struck Bit #12 (<span style={{ color: C.red }}>0 → 1</span>) ={" "}
                <span style={{ color: C.gold }}>+4,096 Votes</span>
              </div>
            </Panel>
          </Appear>
        </AbsoluteFill>
      </SceneFade>

      <ChapterCard num={4} title="The 4,096-Vote Mystery" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 5 — TERROR AT 37,000 FEET (Oct 7, 2008 Qantas Flight 72)
// ===========================================================================
export const CosmicCh5: React.FC = () => {
  const cue = makeCosmicCue("ch5");
  const frame = useCurrentFrame();

  const tQantas = cue("On October seventh");
  const tValue = cue("A value inside");
  const tPilots = cue("The pilots fought");

  const diveP = prog(frame, cue("violently pitched"), cue("violently pitched") + 40);
  const pitchAngle = interpolate(diveP, [0, 1], [0, 22]);
  const altDrop = Math.round(interpolate(diveP, [0, 1], [37000, 36350]));

  return (
    <AbsoluteFill>
      {/* Beat 1: 37,000 Feet = 300x Cosmic Radiation Multiplier */}
      <SceneFade from={0} to={tQantas - 6}>
        <Center>
          <div style={{ width: 1580, display: "flex", alignItems: "center", gap: 100 }}>
            <div style={{ width: 760 }}>
              <Kicker color={C.gold}>ALTITUDE vs. COSMIC RADIATION</Kicker>
              <BigText size={72} style={{ marginTop: 14 }}>
                37,000 Feet Above Sea Level
              </BigText>
              <Appear at={cue("three hundred times")} style={{ marginTop: 34 }}>
                <BigText size={135} color={C.red} glowColor={C.red}>
                  300× STRONGER
                </BigText>
                <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 10 }}>
                  THIN AIR = LESS SHIELDING AGAINST NEUTRONS
                </div>
              </Appear>
            </div>

            {/* Vertical Altitude Flux Bar Chart */}
            <Panel style={{ width: 720, height: 560, padding: "40px 50px", display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 32, color: C.cyan, fontWeight: 900 }}>1×</div>
                <div style={{ width: 130, height: 32, background: C.cyan, borderRadius: 8, marginTop: 12, boxShadow: glow(C.cyan, 8) }} />
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: C.white, marginTop: 16 }}>SEA LEVEL</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 44, color: C.red, fontWeight: 900 }}>300× FLUX</div>
                <div
                  style={{
                    width: 130,
                    height: 360 * prog(frame, cue("thirty-seven thousand"), cue("three hundred times") + 20),
                    background: `linear-gradient(180deg, ${C.red}, ${C.gold})`,
                    borderRadius: 12,
                    marginTop: 12,
                    boxShadow: glow(C.red, 14),
                  }}
                />
                <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 26, color: C.gold, marginTop: 16 }}>37,000 FEET</div>
              </div>
            </Panel>
          </div>
        </Center>
      </SceneFade>

      {/* Beat 2 & 3: Oct 7, 2008 Qantas Flight 72 ADIRU-1 Corruption & -650ft Nose Dive */}
      <SceneFade from={tQantas - 4} to={tPilots - 6}>
        <YearBadge year="OCTOBER 7, 2008" location="QANTAS FLIGHT 72 · AIRBUS A330 (315 ABOARD)" at={tQantas} color={C.red} />
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 76, top: 190, width: 840 }}>
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: `3px solid ${frame >= tValue ? C.red : C.cyan}`,
                boxShadow: glow(frame >= tValue ? C.red : C.cyan, 14),
                transform: `rotate(${pitchAngle}deg)`,
                transition: "transform 0.1s",
              }}
            >
              <Img src={staticFile("cosmic/qantas-a330.png")} style={{ width: 840, height: 470, objectFit: "cover", display: "block" }} />
            </div>

            <div style={{ display: "flex", gap: 36, marginTop: 42 }}>
              <Panel style={{ padding: "20px 32px", flex: 1 }} border={C.gold}>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>ALTITUDE</div>
                <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 48, color: C.gold }}>{altDrop.toLocaleString()} FT</div>
              </Panel>
              <Panel style={{ padding: "20px 32px", flex: 1 }} border={C.red}>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>UNCOMMANDED DIVE</div>
                <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 48, color: C.red }}>
                  {diveP > 0 ? `-${Math.round(diveP * 650)} FT` : "LEVEL"}
                </div>
              </Panel>
            </div>
          </div>

          <div style={{ position: "absolute", right: 76, top: 190, width: 860 }}>
            <Panel style={{ padding: "36px 42px" }} border={C.red}>
              <Kicker color={C.red}>FLIGHT COMPUTER: ADIRU-1 CORRUPTION</Kicker>
              <BigText size={54} style={{ marginTop: 12 }}>
                Altitude Data Mislabeled as <span style={{ color: C.red }}>Angle of Attack</span>
              </BigText>

              <div style={{ marginTop: 32, padding: "24px 30px", borderRadius: 16, background: "rgba(255,77,94,0.14)", border: `2px solid ${C.red}` }}>
                <div style={{ fontFamily: MONO, fontSize: 24, color: C.white }}>
                  ACTUAL WING ANGLE: <span style={{ color: C.green }}>+2.1° (NORMAL CRUISE)</span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 900, color: C.red, marginTop: 14 }}>
                  ADIRU-1 SPIKE: +42.0° (FALSE STALL!)
                </div>
              </div>

              <Appear at={cue("violently pitched")} style={{ marginTop: 32 }}>
                <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 44, color: C.gold }}>
                  → Computer Pitches Nose Down (-650 ft in 20s)
                </div>
              </Appear>
            </Panel>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 4: ATSB Official Investigation Findings */}
      <SceneFade from={tPilots - 4} to={cue.len + 30}>
        <Center>
          <div style={{ textAlign: "center", width: 1540 }}>
            <Kicker color={C.cyan}>AUSTRALIAN TRANSPORT SAFETY BUREAU (ATSB REPORT AO-2008-070)</Kicker>
            <Appear at={cue("three times")} from="scale" style={{ marginTop: 28 }}>
              <BigText size={120} color={C.gold} glowColor={C.gold}>
                3 Times in 128,000,000 Hours
              </BigText>
            </Appear>
            <Appear at={cue("Single-Event Upset")} style={{ marginTop: 42 }}>
              <Panel style={{ padding: "32px 54px", display: "inline-block" }} border={C.cyan}>
                <BigText size={52}>
                  Trigger: <span style={{ color: C.gold }}>Single-Event Upset (SEU)</span> + Software Spike Filter Gap
                </BigText>
              </Panel>
            </Appear>
          </div>
        </Center>
      </SceneFade>

      <ChapterCard num={5} title="Terror at 37,000 Feet" />
    </AbsoluteFill>
  );
};
