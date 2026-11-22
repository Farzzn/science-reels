import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH6 PAGE A — FREE VACUUM ENERGY MYTH DEBUNKED
// ===========================================================================
export const Ch6FreeEnergyMythSim: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const stampP = interpolate(frame, [stampAt, stampAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = Math.sin(frame * 0.45) * 4 * (1 - stampP);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Glowing Sci-Fi "Infinite Vacuum Battery" Icon */}
      <g transform={`translate(960, 560) translate(${shake}, 0)`}>
        <rect x={-230} y={-155} width={460} height={310} rx={34} fill="rgba(8,15,36,0.9)" stroke={stampP > 0.3 ? "#475569" : C.gold} strokeWidth={5} />
        <rect x={-65} y={-195} width={130} height={40} rx={10} fill={stampP > 0.3 ? "#475569" : C.gold} />
        {/* Lightning Bolt */}
        <polygon points="22,-95 -62,15 4,15 -26,105 64,-15 0,-15" fill={stampP > 0.3 ? "#475569" : C.gold} style={stampP < 0.3 ? { filter: svgGlow(C.gold, 12) } : undefined} />
        <text x={0} y={225} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={38}>
          &ldquo;Infinite Free Energy From Empty Space&rdquo;
        </text>
      </g>

      {/* Bold Crimson Stamp Slamming Down */}
      {stampP > 0.05 && (
        <g transform={`translate(960, 555) rotate(-12) scale(${interpolate(stampP, [0, 1], [2.2, 1])})`} opacity={stampP} style={{ filter: svgGlow(C.red, 12) }}>
          <rect x={-285} y={-72} width={570} height={144} rx={22} fill="rgba(185,28,28,0.22)" stroke={C.red} strokeWidth={9} />
          <text x={0} y={24} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={78} letterSpacing={6}>
            MISLEADING ✕
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH6 PAGE B — GIANT TACTILE ELECTRON CHARGE SWITCH (ON -> OFF = ZERO FORCE!)
// ===========================================================================
export const Ch6ChargeSwitchSim: React.FC<{ offAt: number }> = ({ offAt }) => {
  const frame = useCurrentFrame();
  const offP = interpolate(frame, [offAt, offAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const charge = 1 - offP;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Giant Tactile Toggle Switch at Top */}
      <g transform="translate(960, 315)">
        <text x={-165} y={14} textAnchor="end" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={36}>
          Electron Charge:
        </text>
        <rect x={-130} y={-36} width={180} height={72} rx={36} fill={charge > 0.5 ? "rgba(255,194,77,0.25)" : "rgba(255,77,94,0.2)"} stroke={charge > 0.5 ? C.gold : C.red} strokeWidth={4} />
        <circle cx={-94 + offP * 108} cy={0} r={28} fill={charge > 0.5 ? C.gold : C.red} style={{ filter: svgGlow(charge > 0.5 ? C.gold : C.red, 10) }} />
        <text x={78} y={14} fill={charge > 0.5 ? C.gold : C.red} fontFamily={INTER} fontWeight={900} fontSize={40}>
          {charge > 0.5 ? "ON" : "OFF (ZERO)"}
        </text>
      </g>

      {/* Waves Passing Straight Through Once Charge Turns OFF! */}
      {[490, 595, 700].map((wy, idx) => {
        const pts: string[] = [];
        for (let i = 0; i <= 74; i++) {
          const u = i / 74;
          pts.push(`${(240 + u * 1440).toFixed(1)},${(wy + Math.sin(u * 18 - frame * 0.18 + idx) * 24).toFixed(1)}`);
        }
        return <polyline key={idx} points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.3 + offP * 0.65} />;
      })}

      {/* Two Plates Fading Ghost-Transparent When Charge = OFF */}
      <rect x={760} y={425} width={44} height={340} rx={8} fill="#fbbf24" fillOpacity={0.1 + charge * 0.85} stroke={C.gold} strokeWidth={3.5} strokeDasharray={charge < 0.2 ? "10 8" : undefined} />
      <rect x={1116} y={425} width={44} height={340} rx={8} fill="#fbbf24" fillOpacity={0.1 + charge * 0.85} stroke={C.gold} strokeWidth={3.5} strokeDasharray={charge < 0.2 ? "10 8" : undefined} />

      {/* Force Arrows Shrinking to Nothing! */}
      {charge > 0.04 && (
        <g opacity={charge} style={{ filter: svgGlow(C.red, 10) }}>
          <line x1={730 - 180 * charge} y1={595} x2={730} y2={595} stroke={C.red} strokeWidth={15} strokeLinecap="round" />
          <polygon points="755,595 720,572 720,618" fill={C.red} />
          <line x1={1190 + 180 * charge} y1={595} x2={1190} y2={595} stroke={C.red} strokeWidth={15} strokeLinecap="round" />
          <polygon points="1165,595 1200,572 1200,618" fill={C.red} />
        </g>
      )}

      <text x={960} y={870} textAnchor="middle" fill={charge < 0.15 ? C.red : C.white} fontFamily={INTER} fontWeight={900} fontSize={40}>
        {charge < 0.15 ? "No Electric Charge → The Casimir Force Vanishes Completely!" : "The Force Only Exists Because Real Charges Couple to the Field"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH6 PAGE C — SEQUENTIAL TWO LANGUAGES: VACUUM MODES === RETARDED VAN DER WAALS
// ===========================================================================
export const Ch6TwoLanguagesSim: React.FC<{
  fieldAt: number;
  matterAt: number;
}> = ({ fieldAt, matterAt }) => {
  const frame = useCurrentFrame();
  const fieldP = interpolate(frame, [fieldAt - 4, fieldAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const matterP = interpolate(frame, [matterAt - 4, matterAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dip = Math.sin(frame * 0.22);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* LEFT: Field Language (Appears right on "In the field language") */}
      {fieldP > 0.02 && (
        <g opacity={fieldP}>
          <rect x={110} y={295} width={790} height={545} rx={28} fill="rgba(8,15,36,0.88)" stroke={C.cyan} strokeWidth={3.5} />
          <text x={505} y={362} textAnchor="middle" fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={36}>
            Field Language
          </text>
          <rect x={380} y={420} width={32} height={275} rx={6} fill="#fbbf24" stroke={C.gold} strokeWidth={3} />
          <rect x={598} y={420} width={32} height={275} rx={6} fill="#fbbf24" stroke={C.gold} strokeWidth={3} />
          <polyline
            points={new Array(26).fill(0).map((_, i) => `${(412 + (i / 25) * 186).toFixed(1)},${(558 + Math.sin((i / 25) * Math.PI) * 34 * Math.cos(frame * 0.2)).toFixed(1)}`).join(" ")}
            fill="none"
            stroke={C.cyan}
            strokeWidth={5}
          />
          <line x1={225} y1={558} x2={352} y2={558} stroke={C.red} strokeWidth={13} strokeLinecap="round" />
          <polygon points="374,558 342,538 342,578" fill={C.red} />
          <line x1={785} y1={558} x2={658} y2={558} stroke={C.red} strokeWidth={13} strokeLinecap="round" />
          <polygon points="636,558 668,538 668,578" fill={C.red} />
          <text x={505} y={778} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
            Quantum Vacuum Wave Pressure
          </text>
        </g>
      )}

      {/* CENTER = SIGN & RIGHT: Matter Language (Appears ONLY when "In the matter language" is spoken!) */}
      {matterP > 0.02 && (
        <g opacity={matterP}>
          <text x={960} y={590} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={92} style={{ filter: svgGlow(C.green, 10) }}>
            =
          </text>

          <rect x={1020} y={295} width={790} height={545} rx={28} fill="rgba(8,15,36,0.88)" stroke={C.gold} strokeWidth={3.5} />
          <text x={1415} y={362} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={36}>
            Matter Language (van der Waals)
          </text>

          <rect x={1155} y={420} width={126} height={275} rx={14} fill="rgba(255,194,77,0.16)" stroke={C.gold} strokeWidth={3} />
          <rect x={1550} y={420} width={126} height={275} rx={14} fill="rgba(255,194,77,0.16)" stroke={C.gold} strokeWidth={3} />

          {[482, 558, 634].map((dy, i) => {
            const sh = dip * (i % 2 === 0 ? 1 : -1);
            const pulseX = 1286 + ((frame * 6 + i * 95) % 258);
            return (
              <g key={i}>
                <circle cx={1198 + sh * 14} cy={dy} r={15} fill={C.red} />
                <text x={1198 + sh * 14} y={dy + 6} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={20}>+</text>
                <circle cx={1240 - sh * 14} cy={dy} r={15} fill={C.cyan} />
                <text x={1240 - sh * 14} y={dy + 6} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={20}>−</text>

                <line x1={1284} y1={dy} x2={1546} y2={dy} stroke="rgba(62,224,255,0.3)" strokeWidth={2.5} strokeDasharray="8 6" />
                <circle cx={pulseX} cy={dy} r={8} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 8) }} />

                <circle cx={1592 + sh * 14} cy={dy} r={15} fill={C.red} />
                <text x={1592 + sh * 14} y={dy + 6} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={20}>+</text>
                <circle cx={1634 - sh * 14} cy={dy} r={15} fill={C.cyan} />
                <text x={1634 - sh * 14} y={dy + 6} textAnchor="middle" fill="#040814" fontFamily={MONO} fontWeight={900} fontSize={20}>−</text>
              </g>
            );
          })}

          <text x={1415} y={778} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
            Fluctuating Dipoles Attract Across Gap
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH6 PAGE D — FRESH FULL-SCREEN SPRING CONSERVATIVE ENERGY LOOP!
// ===========================================================================
export const Ch6SpringEnergyLoopSim: React.FC = () => {
  const frame = useCurrentFrame();
  // Smooth cycle: snap inward -> pull back apart!
  const cycle = (Math.sin(frame * 0.055) + 1) / 2; // 0 = snapped close, 1 = pulled wide apart
  const pulling = Math.cos(frame * 0.055) > 0;
  const halfGap = 95 + cycle * 245;
  const cx = 960;
  const cy = 545;

  // Build coiled spring between plates
  const coils = 10;
  const springPts: string[] = [];
  for (let i = 0; i <= coils * 2; i++) {
    const u = i / (coils * 2);
    const x = cx - halfGap + u * (halfGap * 2);
    const y = i === 0 || i === coils * 2 ? cy : cy + (i % 2 === 0 ? -36 : 36);
    springPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Coiled Spring Between Plates */}
      <polyline points={springPts.join(" ")} fill="none" stroke={pulling ? C.gold : C.cyan} strokeWidth={6} strokeLinejoin="round" style={{ filter: svgGlow(pulling ? C.gold : C.cyan, 8) }} />

      {/* Two Plates */}
      <rect x={cx - halfGap - 42} y={cy - 175} width={42} height={350} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} />
      <rect x={cx + halfGap} y={cy - 175} width={42} height={350} rx={8} fill="#fbbf24" stroke="#fef08a" strokeWidth={3} />

      {/* Dynamic Arrows Showing Snap In vs Pulling Apart */}
      {pulling ? (
        <g style={{ filter: svgGlow(C.gold, 8) }}>
          <line x1={cx - halfGap - 60} y1={cy} x2={cx - halfGap - 185} y2={cy} stroke={C.gold} strokeWidth={14} strokeLinecap="round" />
          <polygon points={`${cx - halfGap - 210},${cy} ${cx - halfGap - 172},${cy - 24} ${cx - halfGap - 172},${cy + 24}`} fill={C.gold} />
          <line x1={cx + halfGap + 60} y1={cy} x2={cx + halfGap + 185} y2={cy} stroke={C.gold} strokeWidth={14} strokeLinecap="round" />
          <polygon points={`${cx + halfGap + 210},${cy} ${cx + halfGap + 172},${cy - 24} ${cx + halfGap + 172},${cy + 24}`} fill={C.gold} />
        </g>
      ) : (
        <g style={{ filter: svgGlow(C.cyan, 8) }}>
          <line x1={cx - halfGap - 185} y1={cy} x2={cx - halfGap - 75} y2={cy} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" />
          <polygon points={`${cx - halfGap - 52},${cy} ${cx - halfGap - 88},${cy - 24} ${cx - halfGap - 88},${cy + 24}`} fill={C.cyan} />
          <line x1={cx + halfGap + 185} y1={cy} x2={cx + halfGap + 75} y2={cy} stroke={C.cyan} strokeWidth={14} strokeLinecap="round" />
          <polygon points={`${cx + halfGap + 52},${cy} ${cx + halfGap + 88},${cy - 24} ${cx + halfGap + 88},${cy + 24}`} fill={C.cyan} />
        </g>
      )}

      <rect x={440} y={825} width={1040} height={94} rx={22} fill="rgba(8,15,36,0.92)" stroke={pulling ? C.gold : C.green} strokeWidth={3} />
      <text x={960} y={885} textAnchor="middle" fill={pulling ? C.gold : C.green} fontFamily={INTER} fontWeight={900} fontSize={38}>
        {pulling ? "Pulling Back Apart Costs the Exact Same Energy" : "Snaps Together Like a Spring — Zero Free Energy"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH7 PAGE A — FRESH FULL-SCREEN ZOOM INTO SMARTPHONE -> MEMS SILICON CHIP
// ===========================================================================
export const Ch7SmartphoneZoomSim: React.FC<{ zoomAt: number }> = ({ zoomAt }) => {
  const frame = useCurrentFrame();
  const zP = interpolate(frame, [zoomAt, zoomAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Left: Stylized Glowing Smartphone */}
      <g transform="translate(360, 560)">
        <rect x={-135} y={-255} width={270} height={510} rx={36} fill="#0f172a" stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 10) }} />
        <rect x={-112} y={-215} width={224} height={410} rx={18} fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.35)" strokeWidth={2} />
        {/* Highlighted Accelerometer Chip Inside Phone */}
        <rect x={-34} y={-34} width={68} height={68} rx={10} fill="rgba(255,194,77,0.32)" stroke={C.gold} strokeWidth={4} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={0} y={305} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Your Smartphone
        </text>
      </g>

      {/* Optical Zoom Cone Expanding Rightward Into Silicon MEMS Chip */}
      <g opacity={zP}>
        <polygon points="394,526 980,305 980,815" fill="rgba(255,194,77,0.1)" />
        <line x1={394} y1={526} x2={980} y2={305} stroke={C.gold} strokeWidth={3} strokeDasharray="12 8" />
        <line x1={394} y1={594} x2={980} y2={815} stroke={C.gold} strokeWidth={3} strokeDasharray="12 8" />

        {/* Magnified MEMS Accelerometer Chip */}
        <rect x={980} y={305} width={740} height={510} rx={28} fill="rgba(8,15,36,0.92)" stroke={C.gold} strokeWidth={4} />
        {/* Microscopic Interdigitated Silicon Comb Fingers Oscillating! */}
        {[385, 465, 545, 625, 705].map((y, idx) => (
          <g key={idx}>
            <rect x={1055} y={y} width={245} height={26} rx={6} fill={C.cyan} opacity={0.8} />
            <rect x={1340 + Math.sin(frame * 0.25) * 14} y={y + 22} width={285} height={26} rx={6} fill={C.gold} opacity={0.85} />
          </g>
        ))}
        <text x={1350} y={872} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={34}>
          Microscopic MEMS Silicon Switches (Nanometer Gaps)
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH7 PAGE B — FULL-SCREEN MEMS SILICON CANTILEVER STICTION FAILURE
// ===========================================================================
export const Ch7MemsStictionSim: React.FC<{ snapAt: number }> = ({ snapAt }) => {
  const frame = useCurrentFrame();
  const bendP = interpolate(frame, [10, snapAt - 8], [0, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const snapP = interpolate(frame, [snapAt - 6, snapAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vib = (1 - snapP) * Math.sin(frame * 0.65) * 9;
  const tipY = 515 + bendP * 110 + snapP * 170 + vib;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Bottom Silicon Substrate & Gold Electrode */}
      <rect x={190} y={770} width={1540} height={74} rx={12} fill="#1e293b" stroke="#64748b" strokeWidth={3.5} />
      <rect x={860} y={752} width={720} height={20} rx={5} fill={C.gold} />
      <text x={1220} y={820} textAnchor="middle" fill={C.dim} fontFamily={INTER} fontWeight={800} fontSize={26}>
        Silicon Chip Floor
      </text>

      {/* Left Anchor Pillar */}
      <rect x={235} y={465} width={125} height={305} rx={10} fill="#334155" stroke={C.cyan} strokeWidth={3.5} />

      {/* Flexible Silicon Micro-Cantilever Beam */}
      <path
        d={`M360,510 Q915,${510 + (tipY - 515) * 0.28} 1480,${tipY}`}
        fill="none"
        stroke={snapP > 0.7 ? C.red : C.cyan}
        strokeWidth={32}
        strokeLinecap="round"
        style={{ filter: svgGlow(snapP > 0.7 ? C.red : C.cyan, 12) }}
      />

      {/* Downward Casimir Pull Arrows */}
      {[1040, 1220, 1400].map((ax, i) => (
        <g key={i} opacity={0.45 + bendP + snapP * 0.4} style={{ filter: svgGlow(C.red, 8) }}>
          <line x1={ax} y1={tipY - 102} x2={ax} y2={tipY - 34} stroke={C.red} strokeWidth={9} strokeLinecap="round" />
          <polygon points={`${ax},${tipY - 16} ${ax - 15},${tipY - 42} ${ax + 15},${tipY - 42}`} fill={C.red} />
        </g>
      ))}

      {snapP > 0.82 && (
        <g style={{ filter: svgGlow(C.red, 12) }}>
          <circle cx={1480} cy={752} r={38 + Math.sin(frame * 0.5) * 10} fill="none" stroke={C.red} strokeWidth={6} />
          <text x={960} y={918} textAnchor="middle" fill={C.red} fontFamily={INTER} fontWeight={900} fontSize={44}>
            Stiction: Permanently Welded Shut ✕
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH7 PAGE C — 100% FULL-SCREEN 2009 HARVARD REPULSIVE QUANTUM LEVITATION
// (ZERO equation walls — pure visual fluid + levitating gold sphere!)
// ===========================================================================
export const Ch7HarvardLevitationSim: React.FC<{
  fluidAt: number;
  levAt: number;
}> = ({ fluidAt, levAt }) => {
  const frame = useCurrentFrame();
  const fluidP = interpolate(frame, [fluidAt, fluidAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const levP = interpolate(frame, [levAt, levAt + 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fluidH = fluidP * 510;
  const sphereY = 675 - levP * 185 + Math.sin(frame * 0.1) * 9 * levP;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="hFluid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.48" />
        </linearGradient>
        <radialGradient id="hGold" cx="35%" cy="32%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
      </defs>

      {/* Large Centered Optical Liquid Chamber */}
      <rect x={280} y={295} width={1360} height={585} rx={30} fill="rgba(8,15,36,0.9)" stroke={C.green} strokeWidth={4} />
      <rect x={286} y={874 - fluidH} width={1348} height={fluidH} rx={24} fill="url(#hFluid)" />

      {/* Liquid Label */}
      {fluidP > 0.3 && (
        <text x={960} y={358} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={32} opacity={fluidP}>
          Liquid Bromobenzene
        </text>
      )}

      {/* Silica Glass Floor Plate */}
      <rect x={460} y={762} width={1000} height={56} rx={12} fill="rgba(147,197,253,0.34)" stroke={C.cyan} strokeWidth={3.5} />
      <text x={960} y={800} textAnchor="middle" fill="#fff" fontFamily={INTER} fontWeight={900} fontSize={28}>
        Silica Glass Plate
      </text>

      {/* Repulsive Upward Green Arrows Levitating Gold Sphere! */}
      {levP > 0.08 &&
        [840, 960, 1080].map((ax, i) => (
          <g key={i} opacity={levP} style={{ filter: svgGlow(C.green, 10) }}>
            <line x1={ax} y1={748} x2={ax} y2={sphereY + 122} stroke={C.green} strokeWidth={11} strokeLinecap="round" />
            <polygon points={`${ax},${sphereY + 96} ${ax - 18},${sphereY + 130} ${ax + 18},${sphereY + 130}`} fill={C.green} />
          </g>
        ))}

      {/* Levitating 3D Gold Sphere */}
      <g transform={`translate(960, ${sphereY})`} style={{ filter: svgGlow(C.gold, 14) }}>
        <circle cx={0} cy={0} r={88} fill="url(#hGold)" stroke={C.gold} strokeWidth={4.5} />
        <text x={0} y={-4} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={28}>
          Gold
        </text>
        <text x={0} y={28} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={28}>
          Sphere
        </text>
      </g>

      {levP > 0.35 && (
        <text x={960} y={945} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={40} opacity={levP}>
          Quantum Levitation — Without a Single Magnet ✓
        </text>
      )}
    </svg>
  );
};

// ===========================================================================
// CH8 — SERENE COSMIC QUANTUM FIELD FINALE (Completely Fresh Closing Visual!)
// ===========================================================================
export const Ch8CosmicFinaleSim: React.FC = () => {
  const frame = useCurrentFrame();
  const stars = React.useMemo(
    () =>
      new Array(45).fill(0).map((_, i) => ({
        x: random(`fsx${i}`) * 1920,
        y: 260 + random(`fsy${i}`) * 520,
        r: 1.5 + random(`fsr${i}`) * 3,
        ph: random(`fsp${i}`) * Math.PI * 2,
      })),
    [],
  );

  // Flowing cosmic silk ribbons representing the living quantum field of empty space
  const ribbons = [
    { y: 520, amp: 54, freq: 2.2, spd: 0.05, col: C.cyan },
    { y: 560, amp: 42, freq: 3.1, spd: 0.07, col: C.gold },
    { y: 600, amp: 60, freq: 1.6, spd: 0.04, col: "#818cf8" },
  ];

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Twinkling Deep-Space Stars */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.25 + 0.55 * Math.abs(Math.sin(frame * 0.04 + s.ph))} />
      ))}

      {/* Ethereal Flowing Quantum Field Ribbons */}
      {ribbons.map((rb, k) => {
        const pts: string[] = [];
        for (let i = 0; i <= 90; i++) {
          const u = i / 90;
          const x = 140 + u * 1640;
          const y = rb.y + Math.sin(u * rb.freq * Math.PI * 2 - frame * rb.spd + k) * rb.amp * Math.sin(u * Math.PI);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        return (
          <polyline
            key={k}
            points={pts.join(" ")}
            fill="none"
            stroke={rb.col}
            strokeWidth={5}
            opacity={0.78}
            style={{ filter: svgGlow(rb.col, 10) }}
          />
        );
      })}
    </svg>
  );
};
