import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH0 BEAT 1 — CLEAN VACUUM CHAMBER EVACUATION, -273°C CHILL & EM SHIELD
// ===========================================================================
export const VacuumChamberEvacSim: React.FC<{
  chillAt: number;
  shieldAt: number;
}> = ({ chillAt, shieldAt }) => {
  const frame = useCurrentFrame();

  const evacP = interpolate(frame, [6, Math.max(40, chillAt - 6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chillP = interpolate(frame, [chillAt, chillAt + 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shieldP = interpolate(frame, [shieldAt, shieldAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const molecules = React.useMemo(
    () =>
      new Array(34).fill(0).map((_, i) => ({
        x0: 270 + random(`vx${i}`) * 840,
        y0: 360 + random(`vy${i}`) * 430,
        evacDelay: random(`vd${i}`) * 0.72,
        r: 4 + random(`vr${i}`) * 4,
      })),
    [],
  );

  const tempC = Math.round(20 - chillP * 293);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="vSteel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="vVoid" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={chillP > 0.3 ? "#051933" : "#0b1a36"} />
          <stop offset="100%" stopColor="#020612" />
        </radialGradient>
      </defs>

      {/* Top Vacuum Pump Exhaust */}
      <rect x={640} y={205} width={110} height={115} fill="url(#vSteel)" stroke={C.cyan} strokeWidth={3} />
      {[0, 1, 2].map((i) => {
        const yp = (frame * 0.05 + i * 0.33) % 1;
        return (
          <polygon
            key={i}
            points={`695,${296 - yp * 86} 679,${314 - yp * 86} 711,${314 - yp * 86}`}
            fill={C.cyan}
            opacity={(1 - yp) * (1 - evacP * 0.6)}
          />
        );
      })}
      <text x={695} y={188} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
        VACUUM PUMP ↑
      </text>

      {/* Main Steel Chamber */}
      <rect x={210} y={310} width={970} height={540} rx={28} fill="url(#vSteel)" stroke="#64748b" strokeWidth={5} />
      <rect x={244} y={344} width={902} height={472} rx={18} fill="url(#vVoid)" stroke={chillP > 0.2 ? C.cyan : "#334155"} strokeWidth={3} />

      {chillP > 0.05 && (
        <rect x={244} y={344} width={902} height={472} rx={18} fill="none" stroke={C.cyan} strokeWidth={8} opacity={chillP * 0.72} style={{ filter: svgGlow(C.cyan, 14) }} />
      )}

      {/* Air Molecules Sucked Out */}
      {molecules.map((m, idx) => {
        const pull = interpolate(evacP, [m.evacDelay, m.evacDelay + 0.28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (pull >= 0.99) return null;
        const jx = Math.sin(frame * 0.2 + idx) * 26 * (1 - pull);
        const jy = Math.cos(frame * 0.17 + idx) * 22 * (1 - pull);
        const px = m.x0 + jx + (695 - (m.x0 + jx)) * (pull * pull);
        const py = m.y0 + jy + (225 - (m.y0 + jy)) * (pull * pull);
        return <circle key={idx} cx={px} cy={py} r={m.r} fill={idx % 2 === 0 ? C.cyan : "#93c5fd"} opacity={(1 - pull) * 0.85} />;
      })}

      {/* Center Status */}
      <text x={695} y={592} textAnchor="middle" fill={shieldP > 0.5 ? C.gold : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={40} opacity={0.45 + evacP * 0.55}>
        {shieldP > 0.5 ? "PERFECT DARKNESS" : chillP > 0.4 ? "ABSOLUTE ZERO (-273°C)" : evacP > 0.7 ? "NO AIR REMAINING" : "PUMPING OUT AIR..."}
      </text>

      {/* Faraday Shield */}
      {shieldP > 0 && (
        <g opacity={shieldP}>
          <rect x={192} y={292} width={1006} height={576} rx={34} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="24 12" style={{ filter: svgGlow(C.gold, 10) }} />
          {[430, 580, 730].map((wy, idx) => {
            const bx = 55 + ((frame * 3 + idx * 38) % 105);
            return (
              <g key={idx}>
                <line x1={bx} y1={wy} x2={Math.min(182, bx + 52)} y2={wy} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
                <circle cx={188} cy={wy} r={8 + Math.sin(frame * 0.3 + idx) * 3} fill={C.gold} opacity={0.85} />
              </g>
            );
          })}
        </g>
      )}

      {/* Clean Minimal 3-Step Checklist on Right (Zero clutter!) */}
      <g transform="translate(1285, 315)">
        {[
          { y: 0, label: "AIR MOLECULES", status: evacP > 0.85 ? "PUMPED OUT ✓" : "REMOVING...", done: evacP > 0.85, color: C.cyan },
          { y: 185, label: "HEAT RADIATION", status: chillP > 0.85 ? "-273°C (0 K) ✓" : `${tempC}°C`, done: chillP > 0.85, color: C.cyan },
          { y: 370, label: "LIGHT & FIELDS", status: shieldP > 0.6 ? "SHIELDED ✓" : "WAITING...", done: shieldP > 0.6, color: C.gold },
        ].map((item, i) => (
          <g key={i} transform={`translate(0, ${item.y})`}>
            <rect x={0} y={0} width={520} height={148} rx={22} fill="rgba(8,15,36,0.9)" stroke={item.done ? C.green : item.color} strokeWidth={3} />
            <text x={34} y={56} fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
              {item.label}
            </text>
            <text x={34} y={114} fill={item.done ? C.green : C.white} fontFamily={INTER} fontWeight={900} fontSize={40}>
              {item.status}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// ===========================================================================
// CH0 BEAT 2 — BESPOKE 3D MIRRORS IN DARKNESS + HUMAN HAIR SCALE + SLAM!
// (NO wave spoilers here — pure cinematic mystery matching exact narration!)
// ===========================================================================
export const PlatesInDarknessSim: React.FC<{
  hairAt: number;
  noElecAt: number;
  gravAt: number;
  slamAt: number;
}> = ({ hairAt, noElecAt, gravAt, slamAt }) => {
  const frame = useCurrentFrame();

  const hairP = interpolate(frame, [hairAt, hairAt + 18, noElecAt - 8, noElecAt + 8], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const elecP = interpolate(frame, [noElecAt, noElecAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gravP = interpolate(frame, [gravAt, gravAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Plates accelerate realistically and SLAM shut right at slamAt!
  const rawSlam = interpolate(frame, [slamAt + 8, slamAt + 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slamEase = rawSlam * rawSlam * rawSlam;
  const shockP = interpolate(frame, [slamAt + 40, slamAt + 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const halfGap = 155 * (1 - slamEase) + 8;
  const cx = 960;
  const cy = 545;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="darkPlateL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="70%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="darkPlateR" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#d97706" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* HUMAN HAIR SCALE COMPARISON (Cleanly below the plates — zero overlap with 100 nm ruler!) */}
      {hairP > 0.02 && (
        <g opacity={hairP} transform={`translate(0, ${(1 - hairP) * 24})`}>
          <rect x={140} y={822} width={1640} height={106} rx={53} fill="url(#hairGrad)" stroke={C.gold} strokeWidth={3} />
          <text x={960} y={888} textAnchor="middle" fill="#040814" fontFamily={INTER} fontWeight={900} fontSize={36}>
            WIDTH OF 1 HUMAN HAIR (~100,000 nm) — 1,000× WIDER THAN THIS GAP
          </text>
        </g>
      )}

      {/* Subtle Dark Chamber Spotlight Behind Plates */}
      <ellipse cx={cx} cy={cy} rx={520} ry={290} fill="rgba(56,189,248,0.06)" />

      {/* 3D Perspective Left Metallic Mirror Plate */}
      <g transform={`translate(${cx - halfGap}, ${cy})`} style={{ filter: svgGlow(rawSlam > 0.1 ? C.gold : C.cyan, 10) }}>
        {/* Back 3D face */}
        <polygon points="-95,-215 -14,-180 -14,180 -95,215" fill="#0f172a" stroke="#64748b" strokeWidth={2.5} />
        {/* Mirror front edge */}
        <rect x={-26} y={-180} width={26} height={360} rx={4} fill="url(#darkPlateL)" stroke={C.gold} strokeWidth={2.5} />
      </g>

      {/* 3D Perspective Right Metallic Mirror Plate */}
      <g transform={`translate(${cx + halfGap}, ${cy})`} style={{ filter: svgGlow(rawSlam > 0.1 ? C.gold : C.cyan, 10) }}>
        <polygon points="95,-215 14,-180 14,180 95,215" fill="#0f172a" stroke="#64748b" strokeWidth={2.5} />
        <rect x={0} y={-180} width={26} height={360} rx={4} fill="url(#darkPlateR)" stroke={C.gold} strokeWidth={2.5} />
      </g>

      {/* Gap Ruler (fades when slammed shut) */}
      {slamEase < 0.7 && (
        <g opacity={1 - slamEase}>
          <line x1={cx - halfGap} y1={cy - 215} x2={cx + halfGap} y2={cy - 215} stroke={C.cyan} strokeWidth={4} />
          <line x1={cx - halfGap} y1={cy - 230} x2={cx - halfGap} y2={cy - 200} stroke={C.cyan} strokeWidth={4} />
          <line x1={cx + halfGap} y1={cy - 230} x2={cx + halfGap} y2={cy - 200} stroke={C.cyan} strokeWidth={4} />
          <text x={cx} y={cy - 242} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={30}>
            100 NANOMETERS
          </text>
        </g>
      )}

      {/* Mystery Invisible Push Arrows appear RIGHT as plates slam together! */}
      {rawSlam > 0.05 && (
        <g style={{ filter: svgGlow(C.red, 12) }}>
          <line x1={cx - halfGap - 220} y1={cy} x2={cx - halfGap - 115} y2={cy} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
          <polygon points={`${cx - halfGap - 85},${cy} ${cx - halfGap - 128},${cy - 26} ${cx - halfGap - 128},${cy + 26}`} fill={C.red} />
          <line x1={cx + halfGap + 220} y1={cy} x2={cx + halfGap + 115} y2={cy} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
          <polygon points={`${cx + halfGap + 85},${cy} ${cx + halfGap + 128},${cy - 26} ${cx + halfGap + 128},${cy + 26}`} fill={C.red} />
        </g>
      )}

      {/* Dramatic Kinetic Slam Shockwave Ring! */}
      {shockP > 0 && shockP < 1 && (
        <g style={{ filter: svgGlow(C.gold, 14) }}>
          <circle cx={cx} cy={cy} r={30 + shockP * 320} fill="none" stroke={C.gold} strokeWidth={10 * (1 - shockP)} opacity={1 - shockP} />
          <circle cx={cx} cy={cy} r={15 + shockP * 200} fill="none" stroke="#ffffff" strokeWidth={6 * (1 - shockP)} opacity={1 - shockP} />
        </g>
      )}

      {/* Clean Visual Icons Left & Right: NO Electricity / NO Gravity */}
      {elecP > 0 && (
        <g opacity={elecP * (1 - rawSlam * 0.6)} transform="translate(260, 520)">
          <circle cx={0} cy={0} r={76} fill="rgba(8,15,36,0.88)" stroke={C.dim} strokeWidth={3} />
          <polygon points="10,-38 -24,6 2,6 -12,42 26,-6 0,-6" fill="#475569" />
          <line x1={-52} y1={-52} x2={52} y2={52} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
          <text x={0} y={118} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
            No Charge
          </text>
        </g>
      )}

      {gravP > 0 && (
        <g opacity={gravP * (1 - rawSlam * 0.6)} transform="translate(1660, 520)">
          <circle cx={0} cy={0} r={76} fill="rgba(8,15,36,0.88)" stroke={C.dim} strokeWidth={3} />
          <line x1={0} y1={-34} x2={0} y2={24} stroke="#475569" strokeWidth={8} strokeLinecap="round" />
          <polygon points="0,42 -16,18 16,18" fill="#475569" />
          <line x1={-52} y1={-52} x2={52} y2={52} stroke={C.red} strokeWidth={7} strokeLinecap="round" />
          <text x={0} y={118} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={28}>
            100M× Too Weak
          </text>
        </g>
      )}

      {shockP > 0.15 && (
        <text x={cx} y={885} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={44} style={{ filter: svgGlow(C.gold, 8) }}>
          Pushed Together by &ldquo;Nothing&rdquo;!
        </text>
      )}
    </svg>
  );
};

// ===========================================================================
// CH1 — 1948 PAINT LAB COLLOIDS -> NIELS BOHR WALK -> LIQUID DRAINS TO VACUUM
// ===========================================================================
export const PaintColloidToVacuumSim: React.FC<{
  quartzAt: number;
  bohrAt: number;
  stripAt: number;
}> = ({ quartzAt, bohrAt, stripAt }) => {
  const frame = useCurrentFrame();

  const paintP = interpolate(frame, [0, Math.max(30, quartzAt)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clumpP = interpolate(frame, [quartzAt, Math.max(quartzAt + 40, bohrAt + 10)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bohrP = interpolate(frame, [bohrAt, bohrAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stripP = interpolate(frame, [stripAt, stripAt + 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const centers = [
    [660, 565],
    [960, 505],
    [1250, 605],
  ];
  const particles = React.useMemo(
    () =>
      new Array(24).fill(0).map((_, i) => ({
        x0: 470 + random(`px${i}`) * 980,
        y0: 365 + random(`py${i}`) * 430,
        cluster: i % 3,
        offAngle: (i / 8) * Math.PI * 2,
        offR: 26 + random(`pr${i}`) * 42,
        r: 13 + random(`ps${i}`) * 9,
      })),
    [],
  );

  const liquidLevel = interpolate(stripP, [0, 0.72], [510, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plateSlide = (1 - stripP) * 260;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="pAmber" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.52" />
        </linearGradient>
        <radialGradient id="pQuartz" cx="35%" cy="32%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        <linearGradient id="pMirror" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* STAGE 1: Paint Suspension Beaker + Clumping Quartz Particles */}
      {stripP < 0.98 && (
        <g opacity={1 - stripP}>
          {/* Animated amber paint drops falling into beaker during first few seconds */}
          {paintP < 0.95 && (
            <circle cx={960} cy={220 + paintP * 140} r={22} fill={C.gold} opacity={1 - paintP} style={{ filter: svgGlow(C.gold, 8) }} />
          )}

          <rect x={390} y={310} width={1140} height={535} rx={30} fill="rgba(8,15,36,0.78)" stroke={C.gold} strokeWidth={3.5} />
          <rect x={396} y={839 - liquidLevel} width={1128} height={liquidLevel} rx={24} fill="url(#pAmber)" />

          {particles.map((p, idx) => {
            const [tx, ty] = centers[p.cluster];
            const gx = tx + Math.cos(p.offAngle + frame * 0.016) * p.offR;
            const gy = ty + Math.sin(p.offAngle + frame * 0.016) * p.offR;
            const px = p.x0 + (gx - p.x0) * clumpP + Math.sin(frame * 0.14 + idx) * 6;
            const py = p.y0 + (gy - p.y0) * clumpP + Math.cos(frame * 0.12 + idx) * 6;
            return (
              <g key={idx}>
                {clumpP > 0.25 && (
                  <line x1={px} y1={py} x2={tx} y2={ty} stroke={C.cyan} strokeWidth={1.8} strokeDasharray="5 5" opacity={clumpP * 0.52} />
                )}
                <circle cx={px} cy={py} r={p.r} fill="url(#pQuartz)" stroke={C.cyan} strokeWidth={2} />
              </g>
            );
          })}

          <text x={960} y={910} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={32}>
            Microscopic Quartz Clumping in Industrial Paint
          </text>
        </g>
      )}

      {/* STAGE 2: Niels Bohr's Hint Bubble (Cleanly disappears before Stage 3!) */}
      {bohrP > 0 && stripP < 0.7 && (
        <g opacity={bohrP * Math.max(0, 1 - stripP * 1.45)} transform={`translate(1135, ${245 + (1 - bohrP) * 24})`}>
          <rect x={0} y={0} width={665} height={114} rx={20} fill="rgba(8,15,36,0.95)" stroke={C.cyan} strokeWidth={3} style={{ filter: svgGlow(C.cyan, 8) }} />
          <text x={32} y={44} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
            NIELS BOHR DURING A WALK:
          </text>
          <text x={32} y={86} fill={C.white} fontFamily={INTER} fontWeight={900} fontSize={32}>
            &ldquo;Must be <tspan fill={C.gold}>Zero-Point Energy</tspan>...&rdquo;
          </text>
        </g>
      )}

      {/* STAGE 3: Liquid Gone -> Pure Vacuum Two Mirrors Pulled Together */}
      {stripP > 0.05 && (
        <g opacity={stripP}>
          {[435, 565, 695].map((wy, idx) => {
            const ptsL: string[] = [];
            const ptsR: string[] = [];
            for (let i = 0; i <= 40; i++) {
              const u = i / 40;
              const y = wy + Math.sin(u * 14 - frame * 0.18 + idx) * 20;
              ptsL.push(`${(210 + u * 500).toFixed(1)},${y.toFixed(1)}`);
              ptsR.push(`${(1710 - u * 500).toFixed(1)},${y.toFixed(1)}`);
            }
            return (
              <React.Fragment key={idx}>
                <polyline points={ptsL.join(" ")} fill="none" stroke={idx === 1 ? C.gold : C.cyan} strokeWidth={3.5} opacity={0.78} />
                <polyline points={ptsR.join(" ")} fill="none" stroke={idx === 1 ? C.gold : C.cyan} strokeWidth={3.5} opacity={0.78} />
              </React.Fragment>
            );
          })}

          <rect x={755 - plateSlide} y={370} width={38} height={390} rx={8} fill="url(#pMirror)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />
          <rect x={1127 + plateSlide} y={370} width={38} height={390} rx={8} fill="url(#pMirror)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 10) }} />

          {/* Clean Inward Push Arrows */}
          <line x1={620 - plateSlide} y1={565} x2={722 - plateSlide} y2={565} stroke={C.red} strokeWidth={12} strokeLinecap="round" style={{ filter: svgGlow(C.red, 8) }} />
          <polygon points={`${742 - plateSlide},565 ${710 - plateSlide},545 ${710 - plateSlide},585`} fill={C.red} />
          <line x1={1300 + plateSlide} y1={565} x2={1198 + plateSlide} y2={565} stroke={C.red} strokeWidth={12} strokeLinecap="round" style={{ filter: svgGlow(C.red, 8) }} />
          <polygon points={`${1178 + plateSlide},565 ${1210 + plateSlide},545 ${1210 + plateSlide},585`} fill={C.red} />

          <text x={960} y={850} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={36}>
            Even Pure Empty Space Presses Them Together
          </text>
        </g>
      )}
    </svg>
  );
};

// ===========================================================================
// CH2 — 6 COMPLETELY DISTINCT VOICE-MATCHED SCENES (Fixes 2:30-4:00 Loop!)
// ===========================================================================

// 2A. Classical Empty Stage Shatters into Living Quantum Field
export const Ch2EmptyStageAndOceanSim: React.FC<{
  fieldAt: number;
  rippleAt: number;
}> = ({ fieldAt, rippleAt }) => {
  const frame = useCurrentFrame();
  const fieldP = interpolate(frame, [fieldAt, fieldAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleP = interpolate(frame, [rippleAt, rippleAt + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Living 3D ocean field grid
  const rows = 10;
  const cols = 22;
  const pt = (c: number, r: number): [number, number] => {
    const u = c / (cols - 1);
    const v = r / (rows - 1);
    const x = 180 + u * 1560 + (v - 0.5) * 180;
    // Propagating photon ripple crest moving smoothly left-to-right!
    const crestCenter = ((frame * 0.014) % 1.4) - 0.2;
    const dist = Math.abs(u - crestCenter);
    const photonWave = rippleP * Math.exp(-dist * dist * 42) * Math.cos((u - crestCenter) * 28) * 75;
    const ambient = Math.sin(u * 10 + frame * 0.1 + v * 3) * 16;
    const y = 370 + v * 420 - photonWave + ambient;
    return [x, y];
  };

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Stage 1: Cold Empty Classical Box Stage dissolving away! */}
      {fieldP < 0.98 && (
        <g opacity={1 - fieldP}>
          <rect x={440} y={320} width={1040} height={500} rx={24} fill="rgba(8,14,28,0.85)" stroke="#475569" strokeWidth={4} strokeDasharray="16 12" />
          <text x={960} y={560} textAnchor="middle" fill="#64748b" fontFamily={INTER} fontWeight={900} fontSize={54}>
            CLASSICAL &ldquo;EMPTY STAGE&rdquo;
          </text>
          <text x={960} y={625} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={30}>
            DEAD · SILENT · WRONG ✕
          </text>
        </g>
      )}

      {/* Stage 2: Living 3D Electromagnetic Ocean Field + Light Is a Ripple! */}
      {fieldP > 0.02 && (
        <g opacity={fieldP}>
          {new Array(rows).fill(0).map((_, r) => {
            const pts = new Array(cols)
              .fill(0)
              .map((__, c) => {
                const [px, py] = pt(c, r);
                return `${px.toFixed(1)},${py.toFixed(1)}`;
              })
              .join(" ");
            const isCenter = r === 4 || r === 5;
            return (
              <polyline
                key={`or-${r}`}
                points={pts}
                fill="none"
                stroke={isCenter && rippleP > 0.2 ? C.gold : C.cyan}
                strokeWidth={isCenter ? 4.5 : 2}
                opacity={isCenter ? 0.95 : 0.45}
                style={isCenter && rippleP > 0.2 ? { filter: svgGlow(C.gold, 8) } : undefined}
              />
            );
          })}
          {new Array(cols).fill(0).map((_, c) => {
            const pts = new Array(rows)
              .fill(0)
              .map((__, r) => {
                const [px, py] = pt(c, r);
                return `${px.toFixed(1)},${py.toFixed(1)}`;
              })
              .join(" ");
            return <polyline key={`oc-${c}`} points={pts} fill="none" stroke={C.cyan} strokeWidth={1.3} opacity={0.28} />;
          })}

          {/* Label showing Light = Ripple in Field (Not a Separate Floating Ball!) */}
          <text x={960} y={885} textAnchor="middle" fill={rippleP > 0.3 ? C.gold : C.cyan} fontFamily={INTER} fontWeight={900} fontSize={38}>
            {rippleP > 0.3 ? "Light = A Traveling Ripple Across the Field Ocean" : "Space Is Filled With an Invisible Quantum Field"}
          </text>
        </g>
      )}
    </svg>
  );
};

// 2B. Trying to Turn the Field to ZERO -> Heisenberg Clamps Snap Back!
export const Ch2HeisenbergClampSim: React.FC<{
  heisAt: number;
}> = ({ heisAt }) => {
  const frame = useCurrentFrame();

  // Hydraulic clamps squeeze down toward flat zero, then snap back violently on Heisenberg!
  const squeezeP = interpolate(frame, [10, Math.max(45, heisAt - 8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reboundP = interpolate(frame, [heisAt, heisAt + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const clampClose = squeezeP * (1 - reboundP * 0.72);
  const clampGap = 210 - clampClose * 175;
  const waveAmp = 105 * (1 - clampClose * 0.78) + reboundP * 48;
  const jitterFreq = 0.24 + reboundP * 0.22;

  const wavePts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const x = 220 + u * 1480;
    const y = 550 + Math.sin(u * 16 - frame * jitterFreq) * waveAmp + Math.cos(u * 34 + frame * 0.35) * (waveAmp * 0.28);
    wavePts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Target Flat Zero Reference Line */}
      <line x1={220} y1={550} x2={1700} y2={550} stroke={C.dim} strokeWidth={2.5} strokeDasharray="12 10" />
      <text x={1730} y={558} fill={C.dim} fontFamily={MONO} fontWeight={900} fontSize={26}>0</text>

      {/* Top & Bottom Mechanical Clamps Trying to Flatten Field to 0 */}
      <rect x={460} y={550 - clampGap - 52} width={1000} height={46} rx={12} fill="#1e293b" stroke={reboundP > 0.2 ? C.red : C.cyan} strokeWidth={4} />
      <rect x={460} y={550 + clampGap + 6} width={1000} height={46} rx={12} fill="#1e293b" stroke={reboundP > 0.2 ? C.red : C.cyan} strokeWidth={4} />

      {/* Living Quantum Wave Refusing to Die to Zero */}
      <polyline
        points={wavePts.join(" ")}
        fill="none"
        stroke={reboundP > 0.2 ? C.gold : C.cyan}
        strokeWidth={7}
        style={{ filter: svgGlow(reboundP > 0.2 ? C.gold : C.cyan, 10) }}
      />

      {/* Clean Verdict Pill Below */}
      <rect x={460} y={845} width={1000} height={78} rx={20} fill={reboundP > 0.2 ? "rgba(255,77,94,0.14)" : "rgba(8,15,36,0.9)"} stroke={reboundP > 0.2 ? C.red : C.cyan} strokeWidth={3} />
      <text x={960} y={896} textAnchor="middle" fill={reboundP > 0.2 ? C.gold : C.white} fontFamily={INTER} fontWeight={900} fontSize={34}>
        {reboundP > 0.2 ? "Heisenberg's Uncertainty Principle Forbids Flat Zero!" : "Trying to Flatten the Quantum Field to Zero..."}
      </text>
    </svg>
  );
};

// 2C. Glowing Guitar String Unable to Freeze Still -> Zero-Point Jitter Halo
export const Ch2GuitarStringZeroPointSim: React.FC<{
  zeroPtAt: number;
}> = ({ zeroPtAt }) => {
  const frame = useCurrentFrame();
  const zP = interpolate(frame, [zeroPtAt, zeroPtAt + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Multiple subtle blurred quantum string ghost curves creating a glowing irreducible jitter halo!
  const makeString = (phaseShift: number, amp: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 64; i++) {
      const u = i / 64;
      const x = 220 + u * 1480;
      const env = Math.sin(u * Math.PI);
      const y = 550 + env * Math.sin(frame * 0.32 + phaseShift + u * 6) * amp;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Stylized Dark Guitar Fretboard Behind String */}
      <rect x={220} y={405} width={1480} height={290} rx={18} fill="rgba(15,23,42,0.85)" stroke="#334155" strokeWidth={4} />
      {/* Metallic Frets */}
      {[380, 560, 740, 920, 1100, 1280, 1460].map((fx) => (
        <line key={fx} x1={fx} y1={410} x2={fx} y2={690} stroke="rgba(148,163,184,0.28)" strokeWidth={5} />
      ))}
      {/* Bridge & Nut Pins */}
      <rect x={206} y={395} width={28} height={310} rx={8} fill={C.gold} />
      <rect x={1686} y={395} width={28} height={310} rx={8} fill={C.gold} />

      {/* Center Dead-Zero Dotted Line */}
      <line x1={234} y1={550} x2={1686} y2={550} stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray="10 8" />

      {/* Quantum Zero-Point Jitter Halo (Fuzzy glowing probability envelope!) */}
      {[-2, -1, 0, 1, 2].map((k) => (
        <polyline
          key={k}
          points={makeString(k * 1.1, 46 - Math.abs(k) * 8)}
          fill="none"
          stroke={k === 0 ? "#ffffff" : k % 2 === 0 ? C.gold : C.cyan}
          strokeWidth={k === 0 ? 6 : 3.5}
          opacity={k === 0 ? 0.95 : 0.45}
          style={{ filter: svgGlow(k === 0 ? C.cyan : C.gold, 8) }}
        />
      ))}

      {/* Clean Minimal Badge Below (No intimidating parabola clutter!) */}
      <g opacity={0.35 + zP * 0.65}>
        <rect x={510} y={765} width={900} height={116} rx={22} fill="rgba(8,15,36,0.92)" stroke={C.gold} strokeWidth={3} style={{ filter: svgGlow(C.gold, 8) }} />
        <text x={960} y={818} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={40}>
          Zero-Point Energy Floor (½ ℏω)
        </text>
        <text x={960} y={858} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={23}>
          TINY IRREDUCIBLE QUANTUM JITTER — CAN NEVER STOP
        </text>
      </g>
    </svg>
  );
};

// 2D. Short + Medium + Long Wavelengths Arrive One-by-One -> Superimpose!
export const Ch2SuperimposedSpectrumSim: React.FC<{
  shortAt: number;
  medAt: number;
  longAt: number;
  mergeAt: number;
}> = ({ shortAt, medAt, longAt, mergeAt }) => {
  const frame = useCurrentFrame();

  const pShort = interpolate(frame, [shortAt - 6, shortAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pMed = interpolate(frame, [medAt - 6, medAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pLong = interpolate(frame, [longAt - 6, longAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pMerge = interpolate(frame, [mergeAt, mergeAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const makeWave = (yCenter: number, cycles: number, amp: number, speed: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 90; i++) {
      const u = i / 90;
      pts.push(`${(200 + u * 1520).toFixed(1)},${(yCenter + Math.sin(u * cycles * Math.PI * 2 - frame * speed) * amp).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Combined chaotic shimmering vacuum wave once merged!
  const mergedPts: string[] = [];
  for (let i = 0; i <= 110; i++) {
    const u = i / 110;
    const y =
      565 +
      Math.sin(u * 14 * Math.PI * 2 - frame * 0.24) * 32 +
      Math.sin(u * 6 * Math.PI * 2 - frame * 0.16) * 46 +
      Math.sin(u * 2.2 * Math.PI * 2 - frame * 0.09) * 58;
    mergedPts.push(`${(200 + u * 1520).toFixed(1)},${y.toFixed(1)}`);
  }

  const yShort = interpolate(pMerge, [0, 1], [355, 565]);
  const yMed = 565;
  const yLong = interpolate(pMerge, [0, 1], [775, 565]);

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      {/* Short Cyan Wave */}
      {pShort > 0 && (
        <g opacity={pShort * (1 - pMerge * 0.65)}>
          <polyline points={makeWave(yShort, 14, 34, 0.24)} fill="none" stroke={C.cyan} strokeWidth={5} style={{ filter: svgGlow(C.cyan, 6) }} />
          {pMerge < 0.4 && (
            <text x={200} y={302} fill={C.cyan} fontFamily={INTER} fontWeight={900} fontSize={30}>
              Short Wavelengths
            </text>
          )}
        </g>
      )}

      {/* Medium Gold Wave */}
      {pMed > 0 && (
        <g opacity={pMed * (1 - pMerge * 0.65)}>
          <polyline points={makeWave(yMed, 6, 46, 0.16)} fill="none" stroke={C.gold} strokeWidth={5} style={{ filter: svgGlow(C.gold, 6) }} />
          {pMerge < 0.4 && (
            <text x={200} y={502} fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={30}>
              Medium Wavelengths
            </text>
          )}
        </g>
      )}

      {/* Long Violet Wave */}
      {pLong > 0 && (
        <g opacity={pLong * (1 - pMerge * 0.65)}>
          <polyline points={makeWave(yLong, 2.2, 56, 0.09)} fill="none" stroke="#c084fc" strokeWidth={5} style={{ filter: svgGlow("#c084fc", 6) }} />
          {pMerge < 0.4 && (
            <text x={200} y={702} fill="#c084fc" fontFamily={INTER} fontWeight={900} fontSize={30}>
              Long Wavelengths
            </text>
          )}
        </g>
      )}

      {/* Combined Superimposed Quantum Vacuum Hum! */}
      {pMerge > 0.2 && (
        <g opacity={pMerge}>
          <polyline points={mergedPts.join(" ")} fill="none" stroke="#ffffff" strokeWidth={6} style={{ filter: svgGlow(C.cyan, 12) }} />
          <text x={960} y={845} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={40}>
            Superimposed Everywhere in Empty Space
          </text>
        </g>
      )}
    </svg>
  );
};

// 2E. Bespoke 3D-Angled Single Metal Plate Floating in Balanced Quantum Sparkles
export const Ch2SinglePlateBalanceSim: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.86 + 0.14 * Math.sin(frame * 0.16);

  // Symmetric quantum ripple rings arriving equally from left and right
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="soloPlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Symmetric Quantum Wave Arcs Pressing Equally From Left & Right */}
      {[0, 1, 2, 3].map((i) => {
        const p = (frame * 0.025 + i * 0.25) % 1;
        const dist = 490 * (1 - p) + 75;
        return (
          <React.Fragment key={i}>
            <path
              d={`M${960 - dist},360 Q${960 - dist + 55},560 ${960 - dist},760`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={5}
              opacity={Math.sin(p * Math.PI) * 0.8}
            />
            <path
              d={`M${960 + dist},360 Q${960 + dist - 55},560 ${960 + dist},760`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={5}
              opacity={Math.sin(p * Math.PI) * 0.8}
            />
          </React.Fragment>
        );
      })}

      {/* Sculpted 3D Angled Single Metal Mirror */}
      <g style={{ filter: svgGlow(C.cyan, 12) }}>
        <polygon points="915,310 1005,355 1005,795 915,750" fill="url(#soloPlate)" stroke={C.gold} strokeWidth={4} />
      </g>

      {/* Equal Opposing Green Balance Arrows */}
      <g opacity={pulse} style={{ filter: svgGlow(C.green, 10) }}>
        <line x1={620} y1={555} x2={855} y2={555} stroke={C.green} strokeWidth={16} strokeLinecap="round" />
        <polygon points="888,555 844,528 844,582" fill={C.green} />
        <line x1={1300} y1={555} x2={1065} y2={555} stroke={C.green} strokeWidth={16} strokeLinecap="round" />
        <polygon points="1032,555 1076,528 1076,582" fill={C.green} />
      </g>

      <text x={500} y={565} textAnchor="end" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={36}>
        Equal Push →
      </text>
      <text x={1420} y={565} textAnchor="start" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={36}>
        ← Equal Push
      </text>

      <rect x={635} y={855} width={650} height={74} rx={18} fill="rgba(61,255,155,0.14)" stroke={C.green} strokeWidth={3} />
      <text x={960} y={904} textAnchor="middle" fill={C.green} fontFamily={INTER} fontWeight={900} fontSize={36}>
        Net Force = Zero (Perfect Balance)
      </text>
    </svg>
  );
};
