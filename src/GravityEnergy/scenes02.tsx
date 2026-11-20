import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, BigText, Kicker, Panel, prog, SceneFade } from "../FiveHundredMileEmail/components";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import { YearBadge } from "../CosmicMario/visuals";
import { makeGravityCue } from "./timing";
import { AnimatedChapterCard, CleanSubscribeToast, SpacetimeFunnelSVG } from "./visuals";
import { GeodesicBowlAnimation } from "./animations";

// Helper: evaluate quadratic Bezier at t in [0,1]
const quadPt = (t: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number): [number, number] => {
  const mt = 1 - t;
  return [
    mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  ];
};

// ===========================================================================
// CHAPTER 3 — THE BANK ACCOUNT OF THE UNIVERSE (PE <-> KE + Mid-Roll Subscribe)
// ===========================================================================
export const GravityCh3: React.FC = () => {
  const cue = makeGravityCue("ch3");
  const frame = useCurrentFrame();

  const tRemember = cue("Remember: the apple");
  const tSnap = cue("When you let go");
  const tSub = cue("If this way of seeing");

  const liftP = prog(frame, tRemember, tRemember + 50);
  const dropP = prog(frame, tSnap, tSnap + 48);
  const heightNorm = frame < tRemember ? 0.92 : frame < tSnap ? 0.15 + liftP * 0.85 : 1 - dropP * 0.95;
  const pePct = Math.round(heightNorm * 100);
  const kePct = 100 - pePct;
  const appleY = 470 - heightNorm * 350;

  return (
    <AbsoluteFill>
      <SceneFade from={0} to={cue.len + 30} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
          <Kicker color={C.gold}>GRAVITATIONAL POTENTIAL ENERGY · THE COSMIC BANK ACCOUNT</Kicker>
          <BigText size={54} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            Earth Never Creates Energy — It Just <span style={{ color: C.cyan }}>Refunds Your Deposit</span>
          </BigText>

          <div style={{ display: "flex", gap: 80, marginTop: 42, alignItems: "center" }}>
            {/* Left: Stretched Invisible Rubber Band + Apple Height Rig */}
            <Panel style={{ width: 620, height: 610, padding: "28px 34px", textAlign: "center" }} border={C.cyan}>
              <div style={{ fontFamily: MONO, fontSize: 22, color: C.cyan, fontWeight: 800 }}>
                GRAVITATIONAL FIELD = INVISIBLE RUBBER BAND
              </div>
              <svg width={550} height={520} viewBox="0 0 550 520">
                <rect x={40} y={480} width={470} height={16} rx={8} fill={C.cyan} opacity={0.6} />
                <text x={275} y={515} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontSize={20} fontWeight={700}>
                  EARTH SURFACE (PE = 0 J)
                </text>

                <line
                  x1={275}
                  y1={480}
                  x2={275}
                  y2={appleY + 34}
                  stroke={C.gold}
                  strokeWidth={5}
                  strokeDasharray="12 8"
                  style={{ filter: svgGlow(C.gold, 6) }}
                />

                <g transform={`translate(275, ${appleY})`} style={{ filter: svgGlow(C.red, 8) }}>
                  <circle cx={0} cy={0} r={38} fill={C.red} />
                  <path d="M0,-38 Q12,-58 26,-54" fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" />
                  <text x={58} y={8} fill={C.white} fontFamily={MONO} fontWeight={800} fontSize={24}>
                    {frame < tSnap ? "STORING PE ↑" : "SNAPPING BACK ↓"}
                  </text>
                </g>
              </svg>
            </Panel>

            {/* Right: Live Energy Bank Account (PE + KE = Constant 100 J) */}
            <Panel style={{ width: 920, height: 610, padding: "36px 46px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} border={C.gold}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 24, color: C.gold, fontWeight: 800 }}>
                  LIVE ENERGY LEDGER (CONSERVED AT ALL TIMES)
                </div>

                <div style={{ marginTop: 34 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 28, fontWeight: 900 }}>
                    <span style={{ color: C.gold }}>POTENTIAL ENERGY (STORED)</span>
                    <span style={{ color: C.gold }}>{pePct} J</span>
                  </div>
                  <div style={{ height: 42, borderRadius: 12, background: "rgba(255,255,255,0.08)", marginTop: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pePct}%`, background: C.gold, boxShadow: glow(C.gold, 10) }} />
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 28, fontWeight: 900 }}>
                    <span style={{ color: C.cyan }}>KINETIC ENERGY (MOTION)</span>
                    <span style={{ color: C.cyan }}>{kePct} J</span>
                  </div>
                  <div style={{ height: 42, borderRadius: 12, background: "rgba(255,255,255,0.08)", marginTop: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${kePct}%`, background: C.cyan, boxShadow: glow(C.cyan, 10) }} />
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 28, fontWeight: 900 }}>
                    <span style={{ color: C.green }}>TOTAL SYSTEM ENERGY</span>
                    <span style={{ color: C.green }}>100 J (CONSTANT ✓)</span>
                  </div>
                  <div style={{ height: 42, borderRadius: 12, background: C.green, marginTop: 10, boxShadow: glow(C.green, 10) }} />
                </div>
              </div>

              <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 32, color: C.white, textAlign: "center" }}>
                Sunlight / Your Hand Deposited It → Gravity Simply Cashes It Out
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
        <CleanSubscribeToast at={tSub} dur={150} />
      </SceneFade>

      <AnimatedChapterCard num={3} title="The Bank Account of the Universe" subtitle="POTENTIAL ⇄ KINETIC" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 4 — WHY ORBITS NEVER FALL DOWN (1687 Newton's Cannonball + 90° Vector)
// (Fixes Issue #4: Zero heading clipping + progressive animated cannonball shots!)
// ===========================================================================
export const GravityCh4: React.FC = () => {
  const cue = makeGravityCue("ch4");
  const frame = useCurrentFrame();

  const tNewton = cue("In sixteen eighty-seven");
  const tSlow = cue("Fire it slowly");
  const tFast = cue("Fire it faster");
  const tOrbit = cue("Fire it fast enough");
  const tGeo = cue("Now look at the geometry");

  // Progressive shot timings synced directly to voiceover!
  const slowP = prog(frame, tSlow, tSlow + 45);
  const fastP = prog(frame, tFast, tFast + 52);
  const orbitStartP = prog(frame, tOrbit, tOrbit + 70);

  // Moving cannonball positions for Shot 1 & Shot 2
  const [s1x, s1y] = quadPt(slowP, 350, 95, 455, 102, 472, 218);
  const [s2x, s2y] = quadPt(fastP, 350, 95, 558, 118, 505, 385);

  // Build progressive SVG polylines for Shot 1 & Shot 2
  const shot1Pts = new Array(24)
    .fill(0)
    .map((_, i) => {
      const [x, y] = quadPt((i / 23) * slowP, 350, 95, 455, 102, 472, 218);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const shot2Pts = new Array(28)
    .fill(0)
    .map((_, i) => {
      const [x, y] = quadPt((i / 27) * fastP, 350, 95, 558, 118, 505, 385);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Orbiting Cannonball (starts at top of mountain -PI/2 once tOrbit fires!)
  const cannonAngle = -Math.PI / 2 + Math.max(0, frame - tOrbit) * 0.048;
  const cannonTrail = new Array(22).fill(0).map((_, i) => {
    const a = cannonAngle - i * 0.055;
    return [350 + Math.cos(a) * 235, 330 + Math.sin(a) * 235];
  });

  // Muzzle flash pulses right when each shot fires
  const flash =
    Math.max(
      interpolate(frame, [tSlow, tSlow + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(frame, [tFast, tFast + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(frame, [tOrbit, tOrbit + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ) * (frame >= tSlow ? 1 : 0);

  // Beat 3 geometry vectors
  const orbitAngle = frame * 0.04;
  const cx = 360;
  const cy = 330;
  const orbitR = 230;
  const mx = cx + Math.cos(orbitAngle) * orbitR;
  const my = cy + Math.sin(orbitAngle) * orbitR;
  const vx = -Math.sin(orbitAngle) * 115;
  const vy = Math.cos(orbitAngle) * 115;
  const gx = -Math.cos(orbitAngle) * 105;
  const gy = -Math.sin(orbitAngle) * 105;

  return (
    <AbsoluteFill>
      <YearBadge year="1687 · ISAAC NEWTON" location="PRINCIPIA · NEWTON'S CANNONBALL" at={tNewton} color={C.gold} />

      {/* Beat 1 & 2: Newton's Mountain Cannonball Thought Experiment (FIX ISSUE #4) */}
      <SceneFade from={0} to={tGeo - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 142 }}>
          <Kicker color={C.cyan}>PERPETUAL FREE-FALL</Kicker>
          <BigText size={50} style={{ marginTop: 8, maxWidth: 1620, textAlign: "center" }}>
            Orbits Never Fall Down — Because They <span style={{ color: C.gold }}>Keep Missing the Earth</span>
          </BigText>

          <div style={{ display: "flex", gap: 76, marginTop: 28, alignItems: "center" }}>
            {/* Animated Newton's Cannonball Planet SVG */}
            <svg width={700} height={620} viewBox="0 0 700 620">
              <defs>
                <radialGradient id="nEarth" cx="38%" cy="34%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="65%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#091d45" />
                </radialGradient>
                <clipPath id="nEarthClip">
                  <circle cx={350} cy={330} r={165} />
                </clipPath>
              </defs>

              {/* Full Circular Orbit Path (brightens dramatically when Shot 3 launches) */}
              <circle
                cx={350}
                cy={330}
                r={235}
                fill="none"
                stroke={C.gold}
                strokeWidth={4}
                strokeDasharray="12 8"
                opacity={0.18 + orbitStartP * 0.78}
                style={{ filter: svgGlow(C.gold, 5) }}
              />

              {/* Mountain & Cannon Barrel on top of Earth */}
              <polygon points="324,175 350,95 376,175" fill="#0ea5e9" stroke={C.cyan} strokeWidth={2.5} />
              <rect x={346} y={84} width={28} height={14} rx={4} fill={C.gold} />
              {/* Muzzle Flash on Fire */}
              {flash > 0.05 && (
                <circle
                  cx={382}
                  cy={91}
                  r={10 + (1 - flash) * 26}
                  fill={C.gold}
                  opacity={flash}
                  style={{ filter: svgGlow(C.gold, 12) }}
                />
              )}

              {/* 3D Earth Sphere with Rotating Continents */}
              <circle cx={350} cy={330} r={165} fill="url(#nEarth)" stroke={C.cyan} strokeWidth={3.5} />
              <g clipPath="url(#nEarthClip)">
                <g transform={`translate(350, 330) rotate(${frame * 0.35})`}>
                  <path d="M-95,-68 Q-35,-96 22,-54 Q44,-6 -16,22 Q-78,34 -95,-68 Z" fill="#10b981" opacity={0.45} />
                  <path d="M40,-20 Q112,-44 128,28 Q90,92 36,60 Q18,16 40,-20 Z" fill="#10b981" opacity={0.4} />
                  <path d="M-88,58 Q-32,46 -6,102 Q-58,136 -98,102 Z" fill="#10b981" opacity={0.38} />
                </g>
              </g>
              <text x={350} y={342} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={32}>
                EARTH
              </text>

              {/* Shot 1 (Slow - Red): Draws Progressively + Impact Ring */}
              {slowP > 0 && (
                <>
                  <polyline points={shot1Pts} fill="none" stroke={C.red} strokeWidth={4.5} style={{ filter: svgGlow(C.red, 5) }} />
                  <circle cx={s1x} cy={s1y} r={9} fill={C.red} style={{ filter: svgGlow(C.red, 8) }} />
                </>
              )}

              {/* Shot 2 (Faster - Cyan): Draws Progressively + Impact Ring */}
              {fastP > 0 && (
                <>
                  <polyline points={shot2Pts} fill="none" stroke={C.cyan} strokeWidth={4.5} style={{ filter: svgGlow(C.cyan, 5) }} />
                  <circle cx={s2x} cy={s2y} r={9} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 8) }} />
                </>
              )}

              {/* Shot 3 (Orbital 7.8 km/s - Gold): Luminous Comet Trail + Perpetual Orbit! */}
              {frame >= tOrbit && (
                <>
                  {cannonTrail.map(([tx, ty], i) => (
                    <circle key={i} cx={tx} cy={ty} r={12 * (1 - i / 22)} fill={C.gold} opacity={0.85 * (1 - i / 22)} />
                  ))}
                  <circle
                    cx={350 + Math.cos(cannonAngle) * 235}
                    cy={330 + Math.sin(cannonAngle) * 235}
                    r={14}
                    fill="#fff"
                    stroke={C.gold}
                    strokeWidth={3}
                    style={{ filter: svgGlow(C.gold, 10) }}
                  />
                </>
              )}

              {/* Pre-Newton Moon Orbiting Before tNewton */}
              {frame < tSlow && (
                <g transform={`translate(${350 + Math.cos(frame * 0.045) * 235}, ${330 + Math.sin(frame * 0.045) * 235})`}>
                  <circle cx={0} cy={0} r={16} fill="#e2e8f0" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
                </g>
              )}
            </svg>

            <div style={{ width: 780, display: "flex", flexDirection: "column", gap: 24 }}>
              <Appear at={tSlow - 8}>
                <Panel style={{ padding: "24px 34px" }} border={C.red}>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 800 }}>SHOT 1 · SLOW</div>
                  <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 33, color: C.white, marginTop: 6 }}>
                    Gravity pulls it down onto the ground
                  </div>
                </Panel>
              </Appear>
              <Appear at={tFast - 8}>
                <Panel style={{ padding: "24px 34px" }} border={C.cyan}>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: C.cyan, fontWeight: 800 }}>SHOT 2 · FASTER</div>
                  <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 33, color: C.white, marginTop: 6 }}>
                    Travels farther around before landing
                  </div>
                </Panel>
              </Appear>
              <Appear at={tOrbit - 8}>
                <Panel style={{ padding: "26px 34px" }} border={C.gold}>
                  <div style={{ fontFamily: MONO, fontSize: 24, color: C.gold, fontWeight: 900 }}>
                    SHOT 3 · ORBITAL VELOCITY (7.8 km/s)
                  </div>
                  <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 35, color: C.white, marginTop: 6 }}>
                    Earth curves away at the exact same rate it falls!
                  </div>
                </Panel>
              </Appear>
            </div>
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3: The 90-Degree Perpendicular Proof (W = F·d·cos(90°) = 0) */}
      <SceneFade from={tGeo - 4} to={cue.len + 30} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 142 }}>
          <Kicker color={C.gold}>THE 90° ORBITAL GEOMETRY PROOF</Kicker>
          <BigText size={54} style={{ marginTop: 8, maxWidth: 1640, textAlign: "center" }}>
            Gravity Pulls <span style={{ color: C.cyan }}>Sideways</span> to Motion — Never Adding Speed
          </BigText>

          <div style={{ display: "flex", gap: 84, marginTop: 34, alignItems: "center" }}>
            <svg width={720} height={640} viewBox="0 0 720 640">
              <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="rgba(255,194,77,0.35)" strokeWidth={3} strokeDasharray="10 8" />
              <circle cx={cx} cy={cy} r={66} fill="#1456b8" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 8) }} />
              <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={24}>EARTH</text>

              <line x1={mx} y1={my} x2={mx + gx} y2={my + gy} stroke={C.red} strokeWidth={7} style={{ filter: svgGlow(C.red, 6) }} />
              <line x1={mx} y1={my} x2={mx + vx} y2={my + vy} stroke={C.cyan} strokeWidth={7} style={{ filter: svgGlow(C.cyan, 6) }} />
              <circle cx={mx} cy={my} r={22} fill="#e2e8f0" stroke={C.gold} strokeWidth={3} />
              <text x={mx + vx * 1.15} y={my + vy * 1.15} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={24}>v</text>
              <text x={mx + gx * 1.15} y={my + gy * 1.15} fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={24}>F (90°)</text>
            </svg>

            <Panel style={{ width: 820, padding: "42px 48px" }} border={C.green}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.cyan, fontWeight: 800 }}>WORK FORMULA AT 90 DEGREES</div>
              <BigText size={64} color={C.gold} style={{ marginTop: 18 }}>
                W = F · d · cos(90°)
              </BigText>
              <div style={{ fontFamily: MONO, fontSize: 44, color: C.green, fontWeight: 900, marginTop: 22 }}>
                cos(90°) = 0  →  W = 0 JOULES ✓
              </div>
              <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: C.white, marginTop: 28, lineHeight: 1.4 }}>
                Changes <span style={{ color: C.gold }}>direction</span>, never <span style={{ color: C.cyan }}>speed</span>.
                <br />
                Zero net energy added. Zero fuel burned.
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      </SceneFade>

      <AnimatedChapterCard num={4} title="Why Orbits Never Fall Down" subtitle="1687 · NEWTON'S CANNONBALL" />
    </AbsoluteFill>
  );
};

// ===========================================================================
// CHAPTER 5 — EINSTEIN'S TWIST (1915: Curved Spacetime Geometry & Geodesics)
// (Fixes Issue #5: Replaces static 6:30–7:08 frame with Live 3D Geodesic Bowl!)
// ===========================================================================
export const GravityCh5: React.FC = () => {
  const cue = makeGravityCue("ch5");
  const frame = useCurrentFrame();

  const t1915 = cue("Then, in nineteen fifteen");
  const tMarble = cue("Think of a marble");
  const tStraight = cue("straightest possible");
  const tEarth = cue("Earth doesn't spend");
  const tMass = cue("Mass simply tells");
  const depth = prog(frame, t1915, t1915 + 70);

  return (
    <AbsoluteFill>
      <YearBadge year="1915 · ALBERT EINSTEIN" location="GENERAL RELATIVITY · CURVED SPACETIME" at={t1915} color={C.gold} />

      {/* Beat 1 & 2: Flat Newton Grid Morphs Smoothly Into Deep Einstein Spacetime Funnel */}
      <SceneFade from={0} to={tMarble - 6} zoom={false}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 145 }}>
          <Kicker color={C.cyan}>
            {frame < t1915 ? "NEWTON'S MYSTERY (FLAT SPACE)" : "EINSTEIN'S REVELATION (4D GEOMETRY)"}
          </Kicker>
          <BigText size={54} style={{ marginTop: 10, maxWidth: 1640, textAlign: "center" }}>
            {frame < t1915 ? (
              <>How Does Earth Yank Across Empty Space?</>
            ) : (
              <>
                Gravity Isn&apos;t a Pulling Force — It&apos;s <span style={{ color: C.gold }}>Curved Spacetime</span>
              </>
            )}
          </BigText>

          <div style={{ marginTop: 14 }}>
            <SpacetimeFunnelSVG
              depth={depth}
              showMoon
              showForceRope={frame < t1915 + 15}
              width={1180}
              height={730}
            />
          </div>
        </AbsoluteFill>
      </SceneFade>

      {/* Beat 3 (FIX ISSUE #5): Full-Canvas Live 3D Geodesic Bowl Animation (Zero Static JPG / Zero Text Walls!) */}
      <SceneFade from={tMarble - 4} to={cue.len + 30} zoom={false}>
        <GeodesicBowlAnimation straightAt={tStraight} earthAt={tEarth} />

        {/* Clean Top Title Bar (Clears top-left YearBadge nicely!) */}
        <div style={{ position: "absolute", top: 140, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Kicker color={C.gold}>
            {frame >= tMass ? "GENERAL RELATIVITY · PURE GEOMETRY" : "FOLLOWING A GEODESIC"}
          </Kicker>
          <BigText size={52} style={{ marginTop: 6, maxWidth: 1620, textAlign: "center" }}>
            {frame >= tMass ? (
              <>
                <span style={{ color: C.gold }}>Mass</span> Curves Spacetime ·{" "}
                <span style={{ color: C.cyan }}>Geometry</span> Guides Motion
              </>
            ) : (
              <>
                No Rope. No Engine. <span style={{ color: C.green }}>Just Curved Geometry.</span>
              </>
            )}
          </BigText>
        </div>

        {/* Clean Compact Bottom Telemetry Strip */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 150,
            right: 150,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 40px",
            borderRadius: 18,
            background: "rgba(8, 15, 36, 0.88)",
            border: `2.5px solid ${C.green}`,
            boxShadow: glow(C.green, 10),
          }}
        >
          <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 25, color: C.cyan }}>
            GEODESIC = STRAIGHTEST PATH IN CURVED SPACETIME
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 25, color: C.green }}>
            SHAPE BURNS 0.00 FUEL TO EXIST ✓
          </div>
        </div>
      </SceneFade>

      <AnimatedChapterCard num={5} title="Einstein's Twist" subtitle="1915 · GENERAL RELATIVITY" />
    </AbsoluteFill>
  );
};
