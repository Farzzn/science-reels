import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH 6 — PAGE 6A: DON'T THROW AWAY YOUR ORGANIC CHEMISTRY TEXTBOOK YET!
// ===========================================================================
export const KeepTextbookAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const bookIn = spring({ frame, fps, config: { damping: 14, stiffness: 115 } });
  const keepPop = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 12, stiffness: 130 } });
  const floatY = Math.sin(t * 2.8) * 7;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <g transform={`translate(800, ${325 + floatY}) scale(${0.86 + 0.14 * bookIn})`} opacity={bookIn}>
        {/* Stylized Glowing Hardcover Organic Chemistry Textbook */}
        <rect x={-195} y={-225} width={390} height={450} rx={24} fill="rgba(8, 22, 52, 0.96)" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 10) }} />
        {/* Book spine */}
        <rect x={-195} y={-225} width={44} height={450} rx={12} fill="rgba(62, 224, 255, 0.22)" stroke={C.cyan} strokeWidth={2.5} />
        {/* Benzene hexagon emblem on cover */}
        <polygon points="22,-95 82,-60 82,10 22,45 -38,10 -38,-60" fill="rgba(61, 255, 160, 0.12)" stroke={C.green} strokeWidth={4.5} />
        <circle cx={22} cy={-25} r={34} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="8 6" />
        <text x={22} y={-148} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={20} letterSpacing={2.2}>
          ORGANIC CHEMISTRY
        </text>
        <text x={22} y={118} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
          TEXTBOOK
        </text>
        <text x={22} y={156} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={18}>
          σ &amp; π BONDING RULES
        </text>

        {/* Crisp Green "KEEP IT! ✓" Shield Stamp popping in on "keep the science completely honest"! */}
        <g transform={`translate(232, -205) rotate(10) scale(${0.7 + 0.3 * keepPop})`} opacity={keepPop}>
          <rect x={-125} y={-36} width={250} height={72} rx={36} fill="rgba(6, 40, 26, 0.97)" stroke={C.green} strokeWidth={3.5} style={{ filter: svgGlow(C.green, 12) }} />
          <text x={0} y={10} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2}>
            KEEP IT! ✓
          </text>
        </g>
      </g>

      <g transform="translate(800, 620)">
        <rect x={-390} y={-34} width={780} height={68} rx={34} fill="rgba(6, 18, 42, 0.94)" stroke={C.green} strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.6}>
          LET'S KEEP THE SCIENCE COMPLETELY HONEST
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6B: LIGHT ELEMENTS OF LIFE (C, H, N, O) — VOICE-LOCKED REVEAL!
// ===========================================================================
export const LightElementsSafeAnim: React.FC<{
  cAt: number;
  hAt: number;
  nAt: number;
  oAt: number;
  dnaAt: number;
}> = ({ cAt, hAt, nAt, oAt, dnaAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Ordered EXACTLY as spoken: "carbon, hydrogen, nitrogen, and oxygen"!
  const elems = [
    { z: "6", sym: "C", name: "Carbon", pct: "4.4% c", at: cAt },
    { z: "1", sym: "H", name: "Hydrogen", pct: "0.7% c", at: hAt },
    { z: "7", sym: "N", name: "Nitrogen", pct: "5.1% c", at: nAt },
    { z: "8", sym: "O", name: "Oxygen", pct: "5.8% c", at: oAt },
  ];

  const pillP = spring({ frame: Math.max(0, frame - dnaAt), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {elems.map((el, i) => {
        const sp = spring({ frame: Math.max(0, frame - el.at), fps, config: { damping: 13, stiffness: 130 } });
        const cx = 305 + i * 330;
        const floatY = Math.sin(t * 2.5 + i) * 6;
        return (
          <g key={el.sym} transform={`translate(${cx}, ${315 + floatY})`}>
            {/* Subtle empty slot outline before its word is spoken */}
            <rect x={-128} y={-148} width={256} height={296} rx={26} fill="rgba(6, 20, 22, 0.35)" stroke="rgba(61, 255, 160, 0.18)" strokeWidth={2} strokeDasharray="10 8" />
            <g transform={`scale(${0.75 + 0.25 * sp})`} opacity={sp}>
              <rect x={-128} y={-148} width={256} height={296} rx={26} fill="rgba(6, 30, 24, 0.94)" stroke={C.green} strokeWidth={3.5} style={{ filter: svgGlow(C.green, 8) }} />
              <text x={-96} y={-100} fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={24}>{el.z}</text>
              <text x={0} y={10} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={86}>{el.sym}</text>
              <text x={0} y={64} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={800} fontSize={24}>{el.name}</text>
              <text x={0} y={108} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20}>{el.pct}</text>
            </g>
          </g>
        );
      })}

      <g transform={`translate(800, 610) scale(${0.88 + 0.12 * pillP})`} opacity={pillP}>
        <rect x={-545} y={-38} width={1090} height={76} rx={38} fill="rgba(6, 36, 24, 0.95)" stroke={C.green} strokeWidth={3} />
        <text x={0} y={9} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          WATER · PROTEINS · DNA → TEXTBOOK σ &amp; π STAY ROCK SOLID ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6B: THE HEAVY FRONTIER (GOLD → MERCURY → LEAD → BISMUTH → URANIUM!)
// ===========================================================================
export const HeavyFrontierGlowAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const heavy = [
    { z: "79", sym: "Au", name: "Gold", pct: "58% c", col: C.gold },
    { z: "80", sym: "Hg", name: "Mercury", pct: "58% c", col: C.cyan },
    { z: "82", sym: "Pb", name: "Lead", pct: "60% c", col: "#9bb3e0" },
    { z: "83", sym: "Bi", name: "Bismuth", pct: "61% c", col: "#ff7de9" },
    { z: "92", sym: "U", name: "Uranium", pct: "67% c", col: C.red },
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {heavy.map((el, i) => {
        const sp = spring({ frame: Math.max(0, frame - i * 16), fps, config: { damping: 14, stiffness: 115 } });
        const cx = 220 + i * 290;
        const pulse = 1 + 0.03 * Math.sin(t * 4.5 + i);
        return (
          <g key={el.sym} transform={`translate(${cx}, 320) scale(${(0.8 + 0.2 * sp) * pulse})`} opacity={sp}>
            <rect x={-118} y={-148} width={236} height={296} rx={26} fill="rgba(26, 16, 8, 0.94)" stroke={el.col} strokeWidth={3.5} style={{ filter: svgGlow(el.col, 8) }} />
            <text x={-86} y={-100} fill={el.col} fontFamily={MONO} fontWeight={900} fontSize={24}>{el.z}</text>
            <text x={0} y={10} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={78}>{el.sym}</text>
            <text x={0} y={64} textAnchor="middle" fill={el.col} fontFamily={INTER} fontWeight={800} fontSize={24}>{el.name}</text>
            <text x={0} y={108} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>{el.pct}</text>
          </g>
        );
      })}

      <g transform="translate(800, 610)">
        <rect x={-515} y={-38} width={1030} height={76} rx={38} fill="rgba(42, 14, 16, 0.94)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={1.4}>
          HEAVY END OF PERIODIC TABLE → EINSTEIN TAKES OVER!
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6C: REAL-WORLD IMPACT (CATALYSTS · NUCLEAR SEPARATION · QUANTUM MATERIALS)
// ===========================================================================
export const HeavyChemistryImpactAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cards = [
    {
      title: "Heavy Catalysts",
      sub: "Gold, Platinum & Medicine",
      col: C.gold,
      delay: 0,
      icon: "hex",
    },
    {
      title: "Nuclear Separation",
      sub: "Teasing Apart Actinides",
      col: C.red,
      delay: 35,
      icon: "atom",
    },
    {
      title: "Quantum Materials",
      sub: "Bismuth Topological Insulators",
      col: C.cyan,
      delay: 70,
      icon: "wave",
    },
  ];

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {cards.map((c, i) => {
        const sp = spring({ frame: Math.max(0, frame - c.delay), fps, config: { damping: 14, stiffness: 110 } });
        const cx = 320 + i * 480;
        const rot = t * 26;
        return (
          <g key={c.title} transform={`translate(${cx}, ${360 + (1 - sp) * 40})`} opacity={sp}>
            <rect x={-205} y={-195} width={410} height={390} rx={30} fill="rgba(8, 16, 38, 0.92)" stroke={c.col} strokeWidth={3.5} style={{ filter: svgGlow(c.col, 8) }} />
            {/* Minimal clean geometric icon per card */}
            <g transform="translate(0, -58)">
              {c.icon === "hex" && (
                <polygon
                  points="0,-64 56,-32 56,32 0,64 -56,32 -56,-32"
                  fill="rgba(255,194,77,0.16)"
                  stroke={C.gold}
                  strokeWidth={5}
                  transform={`rotate(${rot * 0.4})`}
                />
              )}
              {c.icon === "atom" && (
                <g>
                  <ellipse rx={68} ry={26} fill="none" stroke={C.red} strokeWidth={4} transform={`rotate(${rot})`} />
                  <ellipse rx={68} ry={26} fill="none" stroke={C.red} strokeWidth={4} transform={`rotate(${rot + 60})`} />
                  <ellipse rx={68} ry={26} fill="none" stroke={C.red} strokeWidth={4} transform={`rotate(${rot + 120})`} />
                  <circle r={14} fill={C.red} />
                </g>
              )}
              {c.icon === "wave" && (
                <g>
                  <rect x={-56} y={-56} width={112} height={112} rx={18} fill="rgba(62,224,255,0.12)" stroke={C.cyan} strokeWidth={4.5} />
                  <path d="M-40,0 Q-20,-35 0,0 T40,0" fill="none" stroke={C.cyan} strokeWidth={5.5} />
                  <circle cx={Math.cos(t * 3) * 56} cy={Math.sin(t * 3) * 56} r={9} fill={C.gold} />
                </g>
              )}
            </g>
            <text x={0} y={82} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
              {c.title}
            </text>
            <text x={0} y={124} textAnchor="middle" fill={c.col} fontFamily={INTER} fontWeight={700} fontSize={21}>
              {c.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ===========================================================================
// CH 6 — PAGE 6D: CALIBRATING NEW RELATIVISTIC QUANTUM MODELS
// ===========================================================================
export const NewBondingLanguageAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const shift = interpolate(frame, [20, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Old rigid boxes fading left */}
      <g transform="translate(415, 355)" opacity={1 - shift * 0.58}>
        <rect x={-230} y={-150} width={460} height={300} rx={26} fill="rgba(26, 12, 18, 0.85)" stroke={C.dim} strokeWidth={3} strokeDasharray="10 8" />
        <text x={0} y={-68} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={22}>CLASSICAL GUESSWORK</text>
        <rect x={-165} y={-20} width={145} height={70} rx={14} fill="rgba(127,147,196,0.16)" stroke={C.dim} strokeWidth={2.5} />
        <text x={-92} y={24} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={28}>σ</text>
        <rect x={20} y={-20} width={145} height={70} rx={14} fill="rgba(127,147,196,0.16)" stroke={C.dim} strokeWidth={2.5} />
        <text x={92} y={24} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={28}>π</text>
        <text x={0} y={108} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={20}>FAILS FOR HEAVY ATOMS ✕</text>
      </g>

      {/* Arrow */}
      <line x1={680} y1={355} x2={875} y2={355} stroke={C.gold} strokeWidth={6} />
      <polygon points="895,355 862,336 862,374" fill={C.gold} />

      {/* New unified relativistic framework glowing right */}
      <g transform="translate(1170, 355)" style={{ filter: svgGlow(C.cyan, 10) }}>
        <rect x={-255} y={-165} width={510} height={330} rx={28} fill="rgba(6, 22, 48, 0.94)" stroke={C.cyan} strokeWidth={4} />
        <text x={0} y={-102} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>EINSTEIN'S TRUE RULES</text>
        {/* Unified glowing spin-orbit angular momentum rings */}
        <circle r={68} fill="rgba(62, 224, 255, 0.16)" stroke={C.cyan} strokeWidth={4.5} />
        <ellipse rx={102} ry={34} fill="none" stroke={C.gold} strokeWidth={4} transform={`rotate(${t * 35})`} />
        <text x={0} y={12} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={36}>ω</text>
        <text x={0} y={122} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={20}>
          PRECISION HEAVY-ELEMENT DESIGN ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7A: UNITY SYNTHESIS (GOLD · MERCURY · BISMUTH · EINSTEIN!)
// ===========================================================================
export const UnitySynthesisAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { img: "relbonds/gold-bar.jpg", label: "Golden Ring", col: C.gold, delay: 0 },
    { img: "relbonds/liquid-mercury.jpg", label: "Liquid Mercury", col: C.cyan, delay: 18 },
    { img: "relbonds/bismuth-crystal.jpg", label: "Bismuth Bonds", col: "#ff7de9", delay: 36 },
    { img: "relbonds/portraits/einstein.jpg", label: "Special Relativity", col: C.green, delay: 54 },
  ];

  return (
    <div style={{ width: 1540, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 45px" }}>
      {items.map((it) => {
        const sp = spring({ frame: Math.max(0, frame - it.delay), fps, config: { damping: 14, stiffness: 110 } });
        return (
          <div
            key={it.label}
            style={{
              width: 345,
              borderRadius: 26,
              overflow: "hidden",
              background: "rgba(8, 16, 38, 0.94)",
              border: `3px solid ${it.col}`,
              boxShadow: `${glow(it.col, 10)}, 0 18px 46px rgba(0,0,0,0.82)`,
              opacity: sp,
              transform: `translateY(${(1 - sp) * 28}px)`,
            }}
          >
            <div style={{ height: 320, overflow: "hidden" }}>
              <Img
                src={staticFile(it.img)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }}
              />
            </div>
            <div style={{ padding: "18px 16px", textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 26, color: it.col }}>
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ===========================================================================
// CH 7 — PAGE 7B: EVERY HEAVY BOND IS A MINIATURE RELATIVISTIC LABORATORY
// ===========================================================================
export const MiniatureRelativityLabAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Subtle curved spacetime grid beneath heavy glowing bond */}
      {[-2, -1, 0, 1, 2].map((r) => (
        <path
          key={r}
          d={`M160,${480 + r * 36} Q800,${545 + r * 42} 1440,${480 + r * 36}`}
          fill="none"
          stroke="rgba(62, 224, 255, 0.2)"
          strokeWidth={2.5}
        />
      ))}

      {/* Glowing relativistic CBi⁻ molecule floating cleanly above spacetime */}
      <g transform={`translate(800, ${310 + Math.sin(t * 2.4) * 10})`}>
        <ellipse rx={280} ry={95} fill="none" stroke={C.gold} strokeWidth={4.5} strokeDasharray="20 12" strokeDashoffset={-t * 100} style={{ filter: svgGlow(C.gold, 8) }} />
        <path d={`M-145,0 Q0,${-60 * Math.sin(t * 3)} 145,0`} fill="none" stroke={C.cyan} strokeWidth={10} style={{ filter: svgGlow(C.cyan, 10) }} />
        <path d={`M-145,0 Q0,${60 * Math.sin(t * 3)} 145,0`} fill="none" stroke={C.gold} strokeWidth={10} style={{ filter: svgGlow(C.gold, 10) }} />
        <circle cx={-160} cy={0} r={46} fill="#0c284d" stroke={C.cyan} strokeWidth={4} />
        <text x={-160} y={12} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={30}>C</text>
        <circle cx={160} cy={0} r={66} fill="#362006" stroke={C.gold} strokeWidth={4.5} style={{ filter: svgGlow(C.gold, 12) }} />
        <text x={160} y={14} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={38}>Bi</text>
      </g>

      <g transform="translate(800, 625)">
        <rect x={-495} y={-38} width={990} height={76} rx={38} fill="rgba(6, 14, 34, 0.94)" stroke={C.gold} strokeWidth={3.5} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={9} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28}>
          Every Heavy Bond Is a Miniature Relativistic Lab.
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 7 — PAGE 7C: CLEAN SUBSCRIBE + BELL OUTRO (WITH END-SCREEN SPACE ON RIGHT)
// ===========================================================================
export const SubscribeOutroAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enterP = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const clicked = frame >= 48;
  const clickPop = spring({ frame: Math.max(0, frame - 48), fps, config: { damping: 10, stiffness: 170 } });
  const bellSwing = clicked ? Math.sin((frame - 48) * 0.55) * Math.exp(-(frame - 48) / 38) * 24 : 0;

  return (
    <div
      style={{
        position: "relative",
        width: 1600,
        height: 720,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 90px",
      }}
    >
      {/* Left Hero Column: Bismuth Crystal Preview + Subscribe CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: 760,
          opacity: enterP,
          transform: `translateY(${(1 - enterP) * 24}px)`,
        }}
      >
        <div
          style={{
            width: 440,
            height: 245,
            borderRadius: 24,
            overflow: "hidden",
            border: `2.5px solid ${C.gold}`,
            boxShadow: `${glow(C.gold, 10)}, 0 18px 46px rgba(0,0,0,0.8)`,
            marginBottom: 34,
          }}
        >
          <Img
            src={staticFile("relbonds/bismuth-crystal.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + Math.sin(t) * 0.02})` }}
          />
        </div>

        <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 48, color: C.white, lineHeight: 1.15 }}>
          Frontier Physics & Chemistry,
          <br />
          <span style={{ color: C.gold }}>Explained Visually.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 34 }}>
          <div
            style={{
              padding: "20px 50px",
              borderRadius: 50,
              background: clicked ? "rgba(18, 34, 62, 0.96)" : "#ff2b45",
              border: `3px solid ${clicked ? C.green : "#ff6b7d"}`,
              boxShadow: clicked ? glow(C.green, 14) : glow("#ff2b45", 16),
              transform: `scale(${clicked ? 0.95 + 0.08 * clickPop : 1 + 0.025 * Math.sin(t * 5)})`,
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: 30,
              color: clicked ? C.green : "#ffffff",
              letterSpacing: 1.5,
            }}
          >
            {clicked ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
          </div>

          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(12, 24, 52, 0.94)",
              border: `2.5px solid ${clicked ? C.gold : C.dim}`,
              boxShadow: clicked ? glow(C.gold, 10) : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={38} height={38} viewBox="0 0 38 38" style={{ transform: `rotate(${bellSwing}deg)` }}>
              <path
                d="M19 5 C13 5 10 9.5 10 15.5 V22 L7 26.5 H31 L28 22 V15.5 C28 9.5 25 5 19 5 Z"
                fill={clicked ? C.gold : "none"}
                stroke={clicked ? C.gold : C.white}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              <path d="M15.5 29 C16.3 31.5 21.7 31.5 22.5 29" fill="none" stroke={clicked ? C.gold : C.white} strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column: Clean End-Screen Zone for YouTube Next Video */}
      <div
        style={{
          width: 560,
          height: 360,
          borderRadius: 28,
          border: "2.5px dashed rgba(62, 224, 255, 0.35)",
          background: "rgba(6, 14, 34, 0.48)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: enterP * 0.85,
        }}
      >
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, color: C.cyan, letterSpacing: 3 }}>
          WATCH NEXT ↑
        </div>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 22, color: C.dim, marginTop: 10 }}>
          Next Deep Science Breakdown
        </div>
      </div>
    </div>
  );
};
