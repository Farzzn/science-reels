import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// CH 0 — PAGE 0A: TENNIS BALL BOUNCE vs. SUBATOMIC WAVE TUNNELING
// ===========================================================================
export const BallVsWaveAnim: React.FC<{
  quantumAt: number; // local chapter frame when switching from tennis ball to subatomic wave
}> = ({ quantumAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const qMix = interpolate(frame, [quantumAt - 8, quantumAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Classical ball bounces cleanly against brick wall on a crisp 1.9s cycle
  const cycle = (t % 1.9) / 1.9;
  let ballX = 280;
  let ballY = 390;
  let squishX = 1;
  let squishY = 1;
  let hitFlash = 0;
  if (cycle < 0.46) {
    const p = cycle / 0.46;
    ballX = interpolate(p, [0, 1], [220, 748]);
    ballY = 390 - Math.sin(p * Math.PI) * 55;
  } else if (cycle < 0.54) {
    ballX = 752;
    ballY = 390;
    squishX = 0.78;
    squishY = 1.24;
    hitFlash = 1;
  } else {
    const p = (cycle - 0.54) / 0.46;
    ballX = interpolate(p, [0, 1], [748, 220]);
    ballY = 390 - Math.sin(p * Math.PI) * 62;
  }

  // Subatomic wave packet approaches barrier, decays exponentially INSIDE wall, emerges on right!
  const qt = Math.max(0, (frame - quantumAt) / fps);
  const packetCycle = (qt % 3.6) / 3.6;
  const waveCenterX = interpolate(packetCycle, [0, 1], [240, 1340]);

  const buildWavePath = () => {
    const pts: string[] = [];
    for (let x = 140; x <= 1460; x += 6) {
      let env = Math.exp(-Math.pow((x - waveCenterX) / 135, 2));
      // Inside barrier (740..860) exponential decay; transmitted right side is smaller coherent wave!
      let damp = 1;
      if (x >= 740 && x <= 860) {
        damp = Math.exp(-((x - 740) / 72));
      } else if (x > 860) {
        damp = 0.42;
      }
      // Also reflected wave bouncing back left when packet hits barrier
      const reflCenter = 740 - Math.max(0, waveCenterX - 740) * 0.9;
      const reflEnv = x < 740 && waveCenterX > 660 ? 0.55 * Math.exp(-Math.pow((x - reflCenter) / 135, 2)) : 0;

      const osc = Math.sin(x * 0.095 - qt * 12);
      const reflOsc = Math.sin(-x * 0.095 - qt * 12);
      const y = 390 - (env * damp * osc + reflEnv * reflOsc) * 115;
      pts.push(`${x === 140 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const ghostAlpha = waveCenterX > 850 ? interpolate(waveCenterX, [850, 960, 1280], [0, 1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      <defs>
        <linearGradient id="brickWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b2b2b" />
          <stop offset="50%" stopColor="#8c3b36" />
          <stop offset="100%" stopColor="#4f1e1e" />
        </linearGradient>
        <linearGradient id="quantumWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ee0ff" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#1b5ea8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3ee0ff" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id="tennisGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#eaff6b" />
          <stop offset="65%" stopColor="#a6d92b" />
          <stop offset="100%" stopColor="#587a10" />
        </radialGradient>
        <radialGradient id="electronOrb" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={C.cyan} />
          <stop offset="100%" stopColor="#0a4c8a" />
        </radialGradient>
      </defs>

      {/* CLASSICAL LAYER */}
      <g opacity={1 - qMix}>
        {/* Ground shadow line */}
        <line x1={140} y1={560} x2={1460} y2={560} stroke="rgba(127,147,196,0.28)" strokeWidth={3} />

        {/* Brick wall */}
        <g>
          <rect x={770} y={145} width={110} height={415} rx={8} fill="url(#brickWall)" stroke="#c7685e" strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => (
            <g key={r}>
              <line x1={770} y1={195 + r * 48} x2={880} y2={195 + r * 48} stroke="#361414" strokeWidth={2.5} />
              <line
                x1={r % 2 === 0 ? 825 : 798}
                y1={147 + r * 48}
                x2={r % 2 === 0 ? 825 : 798}
                y2={195 + r * 48}
                stroke="#361414"
                strokeWidth={2.5}
              />
            </g>
          ))}
        </g>

        {/* Trajectory arc */}
        <path
          d={cycle < 0.5 ? "M220,390 Q485,320 748,390" : "M748,390 Q485,310 220,390"}
          fill="none"
          stroke={C.gold}
          strokeWidth={3}
          strokeDasharray="10 10"
          opacity={0.45}
        />

        {/* Impact spark */}
        {hitFlash > 0 && (
          <g style={{ filter: svgGlow(C.gold, 8) }}>
            <line x1={768} y1={355} x2={734} y2={335} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
            <line x1={768} y1={390} x2={724} y2={390} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
            <line x1={768} y1={425} x2={734} y2={445} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          </g>
        )}

        {/* Tennis ball */}
        <g transform={`translate(${ballX}, ${ballY}) scale(${squishX}, ${squishY})`}>
          <circle r={34} fill="url(#tennisGrad)" stroke="#f6ffba" strokeWidth={2.5} />
          <path d="M-24,-22 Q0,0 -24,22" fill="none" stroke="#ffffff" strokeWidth={3.5} opacity={0.85} />
          <path d="M24,-22 Q0,0 24,22" fill="none" stroke="#ffffff" strokeWidth={3.5} opacity={0.85} />
        </g>

        {/* Clean side labels */}
        <text x={450} y={625} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={26} letterSpacing={2}>
          CLASSICAL BOUNCE · 100% BLOCKED
        </text>
        <text x={1170} y={400} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={24} letterSpacing={2} opacity={0.6}>
          FORBIDDEN SIDE
        </text>
      </g>

      {/* QUANTUM TUNNELING LAYER */}
      <g opacity={qMix}>
        <line x1={140} y1={390} x2={1460} y2={390} stroke="rgba(62,224,255,0.22)" strokeWidth={2} strokeDasharray="8 8" />

        {/* Energy Barrier Wall */}
        <rect
          x={740}
          y={165}
          width={120}
          height={415}
          rx={14}
          fill="url(#quantumWall)"
          stroke={C.cyan}
          strokeWidth={3}
          style={{ filter: svgGlow(C.cyan, 8) }}
        />
        <text x={800} y={140} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22} letterSpacing={2.5}>
          ENERGY BARRIER
        </text>

        {/* Wavefunction curve */}
        <path
          d={buildWavePath()}
          fill="none"
          stroke={C.cyan}
          strokeWidth={5.5}
          strokeLinecap="round"
          style={{ filter: svgGlow(C.cyan, 8) }}
        />

        {/* Emerging tunneled electron particle */}
        {waveCenterX > 840 && (
          <g transform={`translate(${Math.min(1360, waveCenterX)}, 390)`} opacity={ghostAlpha} style={{ filter: svgGlow(C.gold, 10) }}>
            <circle r={22} fill="url(#electronOrb)" stroke={C.gold} strokeWidth={3} />
            <circle r={38} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.55} />
          </g>
        )}

        {/* Arrow showing slip-through */}
        <text x={1160} y={240} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={28} opacity={0.9}>
          Slips Straight Through!
        </text>
        <text x={440} y={625} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={23} letterSpacing={2}>
          SUBATOMIC QUANTUM WAVE
        </text>
        <text x={1160} y={625} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={23} letterSpacing={2}>
          TUNNELED PARTICLE →
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 0 — PAGE 0B1: MICROSCOPIC-ONLY ASSUMPTION → SHATTERED BOUNDARY (2025!)
// ===========================================================================
export const MicroBoundaryShatterAnim: React.FC<{
  shatterAt: number;
}> = ({ shatterAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const shattered = frame >= shatterAt;
  const shSec = Math.max(0, (frame - shatterAt) / fps);
  const shP = interpolate(frame, [shatterAt, shatterAt + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 7 wall shards exploding outward right on "shattered that boundary"!
  const shards = [
    { x: 775, y: 185, vx: -110, vy: -85, rot: -38 },
    { x: 815, y: 235, vx: 135, vy: -70, rot: 45 },
    { x: 785, y: 310, vx: -145, vy: -25, rot: -55 },
    { x: 825, y: 365, vx: 165, vy: 20, rot: 62 },
    { x: 780, y: 440, vx: -120, vy: 75, rot: -42 },
    { x: 820, y: 505, vx: 140, vy: 95, rot: 48 },
  ];

  // Macro wave rushing past the broken wall toward human scale!
  const waveSpan = shattered ? interpolate(shP, [0, 1], [760, 1340]) : 740;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left: Microscopic Atom Zone */}
      <g transform="translate(360, 360)">
        {[56, 98, 138].map((r) => (
          <circle key={r} r={r} fill="none" stroke={C.cyan} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.55} />
        ))}
        <circle r={16} fill={C.cyan} style={{ filter: svgGlow(C.cyan, 8) }} />
        <circle cx={Math.cos(t * 3.5) * 98} cy={Math.sin(t * 3.5) * 98} r={9} fill={C.gold} />
        <text x={0} y={195} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={23}>
          SINGLE ATOMS
        </text>
        <text x={0} y={228} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={18}>
          0.00000001 cm
        </text>
      </g>

      {/* Right: Human Scale Zone (lights up gold once wall shatters!) */}
      <g transform="translate(1250, 360)" opacity={shattered ? 0.35 + 0.65 * shP : 0.25}>
        <rect
          x={-110}
          y={-110}
          width={220}
          height={220}
          rx={24}
          fill="rgba(12, 26, 56, 0.9)"
          stroke={shattered ? C.gold : C.dim}
          strokeWidth={3.5}
          style={shattered ? { filter: svgGlow(C.gold, 10) } : undefined}
        />
        <line x1={-65} y1={0} x2={65} y2={0} stroke={C.cyan} strokeWidth={5} />
        <line x1={0} y1={-65} x2={0} y2={65} stroke={C.gold} strokeWidth={5} />
        <circle r={14} fill={C.gold} />
        <text x={0} y={195} textAnchor="middle" fill={shattered ? C.gold : C.dim} fontFamily={MONO} fontWeight={900} fontSize={23}>
          HUMAN-SCALE CIRCUIT
        </text>
        <text x={0} y={228} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={18}>
          ~1 cm · VISIBLE TO EYE
        </text>
      </g>

      {/* Quantum wave arrow breaking straight across */}
      <line
        x1={520}
        y1={360}
        x2={waveSpan}
        y2={360}
        stroke={shattered ? C.gold : C.cyan}
        strokeWidth={6}
        strokeDasharray="16 10"
        style={{ filter: svgGlow(shattered ? C.gold : C.cyan, 8) }}
      />

      {/* Intact boundary wall BEFORE shatter */}
      {!shattered && (
        <g>
          <rect
            x={770}
            y={145}
            width={60}
            height={420}
            rx={12}
            fill="rgba(75, 14, 24, 0.85)"
            stroke={C.red}
            strokeWidth={3.5}
            style={{ filter: svgGlow(C.red, 8) }}
          />
          <text x={800} y={120} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={22} letterSpacing={2}>
            "QUANTUM LIMIT"
          </text>
        </g>
      )}

      {/* Shattering crimson shards AFTER shatterAt! */}
      {shattered && (
        <g opacity={Math.max(0, 1 - shSec * 0.55)}>
          {shards.map((s, i) => (
            <polygon
              key={i}
              points="-24,-18 28,-10 14,24 -20,16"
              fill="rgba(255, 77, 94, 0.65)"
              stroke={C.gold}
              strokeWidth={2.5}
              transform={`translate(${s.x + s.vx * shP * 1.4}, ${s.y + s.vy * shP * 1.4}) rotate(${s.rot * shP})`}
              style={{ filter: svgGlow(C.gold, 8) }}
            />
          ))}
        </g>
      )}

      {shattered && (
        <text x={800} y={645} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2.5} opacity={shP}>
          BOUNDARY SHATTERED · QUANTUM AT HUMAN SCALE
        </text>
      )}
    </svg>
  );
};

// ===========================================================================
// CH 0 — PAGE 0B2: PHOTOREALISTIC AI HAND HOLDING ~1 CM SUPERCONDUCTING CHIP
// ===========================================================================
export const PalmChipAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enterP = spring({ frame, fps, config: { damping: 16, stiffness: 85 } });
  const kenBurns = interpolate(frame, [0, 260], [1.0, 1.09], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = 0.55 + 0.45 * Math.sin(t * 4.5);

  return (
    <div
      style={{
        position: "relative",
        width: 1520,
        height: 740,
        borderRadius: 32,
        overflow: "hidden",
        boxShadow: "0 24px 70px rgba(0,0,0,0.85)",
        border: "2px solid rgba(62, 224, 255, 0.32)",
      }}
    >
      {/* Photorealistic AI macro studio image of hand cradling glowing superconducting chip */}
      <Img
        src={staticFile("macrotunnel/hand-chip.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${kenBurns})`,
          transformOrigin: "50% 50%",
        }}
      />

      {/* Soft seamless navy radial edge feather so it melts into our dark canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(4,8,20,0) 56%, rgba(4,8,20,0.72) 86%, rgba(4,8,20,0.96) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Crisp minimal SVG overlay: glowing caliper + subtle central pulse */}
      <svg viewBox="0 0 1520 740" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Soft breathing ring right over the chip center */}
        <circle
          cx={760}
          cy={370}
          r={24 + 8 * glowPulse}
          fill="none"
          stroke={C.gold}
          strokeWidth={2.5}
          opacity={0.45 * glowPulse}
        />

        {/* Crisp ~1 cm caliper bracket cleanly below the chip */}
        <g transform="translate(760, 520)" opacity={enterP}>
          <line x1={-110} y1={0} x2={110} y2={0} stroke={C.gold} strokeWidth={3} />
          <line x1={-110} y1={-14} x2={-110} y2={14} stroke={C.gold} strokeWidth={3} />
          <line x1={110} y1={-14} x2={110} y2={14} stroke={C.gold} strokeWidth={3} />
          <rect x={-96} y={-22} width={192} height={44} rx={14} fill="rgba(4, 10, 26, 0.92)" stroke={C.gold} strokeWidth={2.5} style={{ filter: svgGlow(C.gold, 6) }} />
          <text x={0} y={8} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23} letterSpacing={1.5}>
            ~1 cm CHIP
          </text>
        </g>

        {/* Subtle bottom-left floating hardware badge */}
        <g transform="translate(230, 645)" opacity={enterP}>
          <rect x={-180} y={-34} width={360} height={68} rx={18} fill="rgba(4, 10, 26, 0.88)" stroke={C.cyan} strokeWidth={2.5} style={{ boxShadow: glow(C.cyan, 8) }} />
          <text x={0} y={-2} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={17} letterSpacing={2}>
            SUPERCONDUCTING CIRCUIT
          </text>
          <text x={0} y={24} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={22}>
            Billions of Cooper Pairs
          </text>
        </g>
      </svg>
    </div>
  );
};

// ===========================================================================
// CH 0 — PAGE 0C: ZERO VOLTAGE → SUDDEN TUNNELING VOLTAGE SNAP
// ===========================================================================
export const ZeroToVoltageSnapAnim: React.FC<{
  snapAt: number; // local chapter frame when voltage snaps up
}> = ({ snapAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const snapped = frame >= snapAt;
  const snapElapsed = Math.max(0, (frame - snapAt) / fps);
  const snapP = spring({ frame: Math.max(0, frame - snapAt), fps, config: { damping: 12, stiffness: 150 } });

  // Build live oscilloscope trace across x=200..1400
  const tracePts: string[] = [];
  const snapX = 760;
  for (let x = 200; x <= 1400; x += 8) {
    let y = 475;
    if (snapped && x >= snapX) {
      const rise = interpolate(x, [snapX, snapX + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const activeSpan = Math.min(1400, snapX + snapElapsed * 760);
      if (x <= activeSpan) {
        y = 475 - rise * (220 + Math.sin(x * 0.09 - t * 18) * 14);
      }
    }
    if (!snapped && x > 200 + (t * 260) % 560) {
      // keep drawing cleanly up to snapX
    }
    tracePts.push(`${x === 200 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Clean oscilloscope frame */}
      <rect x={160} y={135} width={1280} height={470} rx={26} fill="rgba(6, 12, 30, 0.88)" stroke={snapped ? C.gold : C.cyan} strokeWidth={3} />

      {/* Subtle gridlines */}
      {[215, 295, 385, 475, 555].map((y, i) => (
        <line key={i} x1={185} y1={y} x2={1415} y2={y} stroke="rgba(127,147,196,0.14)" strokeWidth={1.5} />
      ))}

      {/* Zero Voltage label */}
      <text x={210} y={525} fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={24} letterSpacing={1.5}>
        0.00 V · SUPERCONDUCTING TRAP
      </text>

      {/* Active Voltage label when snapped */}
      <text
        x={1080}
        y={205}
        textAnchor="middle"
        fill={C.gold}
        fontFamily={MONO}
        fontWeight={900}
        fontSize={28}
        letterSpacing={1.5}
        opacity={snapP}
        style={{ filter: svgGlow(C.gold, 8) }}
      >
        VOLTAGE STATE · TUNNELED!
      </text>

      {/* Signal trace */}
      <path
        d={tracePts.join(" ")}
        fill="none"
        stroke={snapped ? C.gold : C.cyan}
        strokeWidth={6}
        strokeLinecap="round"
        style={{ filter: svgGlow(snapped ? C.gold : C.cyan, 8) }}
      />

      {/* Tunneling event marker */}
      {snapped && (
        <g transform={`translate(${snapX}, 365)`} opacity={snapP}>
          <line x1={0} y1={-195} x2={0} y2={165} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.7} />
          <circle cx={0} cy={-110} r={14 + 4 * Math.sin(t * 10)} fill={C.gold} style={{ filter: svgGlow(C.gold, 10) }} />
          <rect x={-135} y={-235} width={270} height={46} rx={14} fill="#141005" stroke={C.gold} strokeWidth={2.5} />
          <text x={0} y={-204} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21} letterSpacing={1.5}>
            QUANTUM TUNNELING
          </text>
        </g>
      )}

      {/* Big live voltage readout badge */}
      <g transform="translate(1240, 520)">
        <rect x={-140} y={-44} width={280} height={84} rx={16} fill="#040814" stroke={snapped ? C.gold : C.cyan} strokeWidth={2.5} />
        <text x={0} y={10} textAnchor="middle" fill={snapped ? C.gold : C.cyan} fontFamily={MONO} fontWeight={900} fontSize={38}>
          {snapped ? "2.80 mV" : "0.00 mV"}
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1A: WHY A TENNIS BALL NEVER TUNNELS (CHAOTIC ATOMS)
// ===========================================================================
export const ChaoticAtomsAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 35 deterministic atoms vibrating wildly out of sync inside a circular zoom lens
  const atoms = Array.from({ length: 35 }, (_, i) => {
    const col = i % 7;
    const row = Math.floor(i / 7);
    const bx = 540 + col * 86;
    const by = 185 + row * 82;
    const phX = i * 1.91;
    const phY = i * 2.73;
    const freq = 5.5 + (i % 5) * 1.4;
    const dx = Math.sin(t * freq + phX) * 18;
    const dy = Math.cos(t * (freq * 0.9) + phY) * 18;
    const ang = Math.atan2(Math.cos(t * freq + phX), -Math.sin(t * freq + phY));
    return { bx, by, x: bx + dx, y: by + dy, ang, i };
  });

  // Flat noisy summed wave at bottom showing cancellation
  const noisePts: string[] = [];
  for (let x = 340; x <= 1260; x += 8) {
    const y = 635 + Math.sin(x * 0.35 + t * 22) * 5 + Math.cos(x * 0.61 - t * 17) * 4;
    noisePts.push(`${x === 340 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Macro magnifying lens frame */}
      <rect x={450} y={115} width={700} height={460} rx={36} fill="rgba(16, 12, 24, 0.85)" stroke={C.red} strokeWidth={3} />

      {/* Chaotic jiggling atoms + random velocity arrows */}
      {atoms.map((a) => (
        <g key={a.i} transform={`translate(${a.x}, ${a.y})`}>
          <circle r={24} fill="none" stroke={C.red} strokeWidth={1.5} opacity={0.25} strokeDasharray="4 4" />
          <circle r={13} fill={a.i % 2 === 0 ? C.red : C.gold} opacity={0.9} />
          <line
            x1={0}
            y1={0}
            x2={Math.cos(a.ang) * 28}
            y2={Math.sin(a.ang) * 28}
            stroke={C.white}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.75}
          />
        </g>
      ))}

      {/* Cancelled flat net wave below */}
      <path d={noisePts.join(" ")} fill="none" stroke={C.dim} strokeWidth={3.5} opacity={0.85} />
      <text x={800} y={688} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={24} letterSpacing={2}>
        OUT OF SYNC · QUANTUM WAVES CANCEL OUT
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1A2: CHAOTIC CROWD SNAPPING INTO ONE SYNCHRONIZED DANCER
// ===========================================================================
export const CrowdToDancerAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Smooth lock-in transition across the 11-second beat
  const syncP = interpolate(frame, [20, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 28 particles moving from chaotic scattered crowd -> unified vertical-sine synchronized arc!
  const dancers = Array.from({ length: 28 }, (_, i) => {
    const chaosX = 280 + ((i * 197) % 1040) + Math.sin(t * 7 + i * 2.1) * 38;
    const chaosY = 175 + ((i * 131) % 370) + Math.cos(t * 6.5 + i * 1.7) * 36;
    const syncX = 240 + i * 41.5;
    const syncY = 365 + Math.sin(t * 4.5) * 95; // ALL move identically up and down in unison!
    return {
      x: interpolate(syncP, [0, 1], [chaosX, syncX]),
      y: interpolate(syncP, [0, 1], [chaosY, syncY]),
      i,
    };
  });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Connecting glowing golden pulse line appearing as crowd synchronizes */}
      <line
        x1={240}
        y1={365 + Math.sin(t * 4.5) * 95}
        x2={1360}
        y2={365 + Math.sin(t * 4.5) * 95}
        stroke={C.gold}
        strokeWidth={6}
        opacity={syncP * 0.65}
        style={{ filter: svgGlow(C.gold, 8) }}
      />

      {dancers.map((d) => (
        <circle
          key={d.i}
          cx={d.x}
          cy={d.y}
          r={13 + syncP * 3}
          fill={syncP > 0.5 ? C.cyan : C.red}
          stroke={C.white}
          strokeWidth={2}
          style={{ filter: svgGlow(syncP > 0.5 ? C.cyan : C.red, 6) }}
        />
      ))}

      <text x={800} y={645} textAnchor="middle" fill={syncP > 0.5 ? C.gold : C.red} fontFamily={MONO} fontWeight={900} fontSize={26} letterSpacing={2.2}>
        {syncP > 0.5 ? "BILLIONS LOCKED IN UNISON — ONE SYNCHRONIZED DANCER" : "CHAOTIC CROWD · RANDOM MOTION"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1B: SUPERCONDUCTOR COOLING → COOPER PAIRS FORMING
// ===========================================================================
export const CooperPairCondenseAnim: React.FC<{
  pairAt: number; // local frame when cooling triggers pairing
}> = ({ pairAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const coldP = interpolate(frame, [pairAt - 15, pairAt + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tempK = interpolate(coldP, [0, 1], [300, 0.02]);

  // Crystal lattice nodes (niobium ions)
  const lattice: { x: number; y: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 7; c++) {
      lattice.push({ x: 430 + c * 145, y: 185 + r * 125 });
    }
  }

  // 7 pairs of electrons: when warm, scatter chaotically; when cold, lock into glowing Cooper pairs gliding right!
  const pairs = Array.from({ length: 7 }, (_, i) => {
    const laneY = 247 + (i % 3) * 125;
    const baseFlow = ((t * 175 + i * 210) % 1020) + 360;
    const warmX1 = 420 + ((i * 157 + t * 180) % 920);
    const warmY1 = 175 + ((i * 93) % 360) + Math.sin(t * 9 + i) * 35;
    const warmX2 = 420 + ((i * 233 + 110 + t * 140) % 920);
    const warmY2 = 175 + ((i * 137 + 60) % 360) + Math.cos(t * 8 + i) * 35;

    const x1 = interpolate(coldP, [0, 1], [warmX1, baseFlow - 16]);
    const y1 = interpolate(coldP, [0, 1], [warmY1, laneY]);
    const x2 = interpolate(coldP, [0, 1], [warmX2, baseFlow + 16]);
    const y2 = interpolate(coldP, [0, 1], [warmY2, laneY]);
    return { x1, y1, x2, y2, i };
  });

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Left thermometer bar */}
      <g transform="translate(175, 165)">
        <rect x={-26} y={0} width={52} height={390} rx={26} fill="#0a1430" stroke="rgba(127,147,196,0.5)" strokeWidth={3} />
        <rect
          x={-16}
          y={18 + coldP * 320}
          width={32}
          height={354 - coldP * 320}
          rx={16}
          fill={coldP > 0.6 ? C.cyan : C.red}
          style={{ filter: svgGlow(coldP > 0.6 ? C.cyan : C.red, 8) }}
        />
        <text x={0} y={445} textAnchor="middle" fill={coldP > 0.6 ? C.cyan : C.red} fontFamily={MONO} fontWeight={900} fontSize={28}>
          {tempK < 1 ? "0.02 K" : `${Math.round(tempK)} K`}
        </text>
      </g>

      {/* Niobium crystal chamber */}
      <rect x={330} y={120} width={1120} height={490} rx={28} fill="rgba(7, 16, 38, 0.85)" stroke={coldP > 0.6 ? C.cyan : C.dim} strokeWidth={3} />

      {/* Lattice ions — vibrate strongly when warm, calm when cold */}
      {lattice.map((n, i) => {
        const jiggle = (1 - coldP) * 9;
        const jx = Math.sin(t * 14 + i * 1.7) * jiggle;
        const jy = Math.cos(t * 13 + i * 2.1) * jiggle;
        return (
          <circle
            key={i}
            cx={n.x + jx}
            cy={n.y + jy}
            r={16}
            fill="rgba(127, 160, 220, 0.28)"
            stroke="rgba(160, 195, 255, 0.55)"
            strokeWidth={2}
          />
        );
      })}

      {/* Electrons / Cooper pairs */}
      {pairs.map((p) => (
        <g key={p.i}>
          {coldP > 0.45 && (
            <ellipse
              cx={(p.x1 + p.x2) / 2}
              cy={(p.y1 + p.y2) / 2}
              rx={38}
              ry={20}
              fill="rgba(62, 224, 255, 0.16)"
              stroke={C.cyan}
              strokeWidth={2.5}
              opacity={interpolate(coldP, [0.45, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              style={{ filter: svgGlow(C.cyan, 6) }}
            />
          )}
          <circle cx={p.x1} cy={p.y1} r={10} fill={coldP > 0.5 ? C.cyan : C.gold} style={{ filter: svgGlow(coldP > 0.5 ? C.cyan : C.gold, 5) }} />
          <circle cx={p.x2} cy={p.y2} r={10} fill={coldP > 0.5 ? C.cyan : C.gold} style={{ filter: svgGlow(coldP > 0.5 ? C.cyan : C.gold, 5) }} />
        </g>
      ))}

      <text x={890} y={668} textAnchor="middle" fill={coldP > 0.6 ? C.cyan : C.gold} fontFamily={MONO} fontWeight={800} fontSize={25} letterSpacing={2}>
        {coldP > 0.6 ? "COOPER PAIRS · ZERO RESISTANCE FLOW" : "WARM METAL · RANDOM SCATTERING"}
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1C: BILLIONS LOCK INTO ONE GIANT SYNCHRONIZED WAVE
// ===========================================================================
export const SynchronizedWaveAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lockP = interpolate(frame, [0, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Build 5 synchronized waves that merge cleanly into 1 glowing macro wave
  const layers = [-2, -1, 0, 1, 2];

  const makeWave = (layerIdx: number) => {
    const spreadY = layerIdx * 54 * (1 - lockP * 0.88);
    const phaseOff = layerIdx * 0.9 * (1 - lockP);
    const pts: string[] = [];
    for (let x = 140; x <= 1460; x += 10) {
      const y = 365 + spreadY + Math.sin(x * 0.014 - t * 4.8 + phaseOff) * (88 + lockP * 28);
      pts.push(`${x === 140 ? "M" : "L"}${x},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* Soft glowing backdrop ribbon */}
      <path
        d={makeWave(0)}
        fill="none"
        stroke={C.cyan}
        strokeWidth={34 * lockP + 4}
        opacity={0.14}
        strokeLinecap="round"
      />

      {layers.map((ly) => (
        <path
          key={ly}
          d={makeWave(ly)}
          fill="none"
          stroke={ly === 0 ? C.gold : C.cyan}
          strokeWidth={ly === 0 ? 7 : 3.5}
          opacity={ly === 0 ? 1 : 0.72 - lockP * 0.25}
          strokeLinecap="round"
          style={ly === 0 ? { filter: svgGlow(C.gold, 8) } : undefined}
        />
      ))}

      {/* Riding synchronized Cooper pair dots along the single golden wave */}
      {Array.from({ length: 14 }, (_, i) => {
        const x = 190 + i * 94;
        const y = 365 + Math.sin(x * 0.014 - t * 4.8) * (88 + lockP * 28);
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <circle cx={-8} cy={0} r={7} fill={C.white} />
            <circle cx={8} cy={0} r={7} fill={C.cyan} />
          </g>
        );
      })}

      <text x={800} y={625} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={27} letterSpacing={2.5}>
        ONE SHARED QUANTUM PHASE ACROSS THE ENTIRE CHIP
      </text>
    </svg>
  );
};

// ===========================================================================
// CH 1 — PAGE 1D: MICROSCOPIC (1962 JOSEPHSON) → MACROSCOPIC (1980 LEGGETT)
// ===========================================================================
export const MicroVsMacroSplitAnim: React.FC<{
  macroAt: number; // local chapter frame when shifting from 1962 single-pair to 1980 Leggett collective state
}> = ({ macroAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const macroP = interpolate(frame, [macroAt - 10, macroAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 1962 microscopic single-pair hops
  const hopX = 560 + ((t * 210) % 480);

  // 1980 macroscopic giant glowing orb facing a massive curved hill
  const breath = Math.sin(t * 3.5) * 14;

  return (
    <svg viewBox="0 0 1600 720" style={{ width: 1600, height: 720, overflow: "visible" }}>
      {/* STAGE 1: 1962 MICROSCOPIC JOSEPHSON TUNNELING (ONE PAIR AT A TIME) */}
      <g opacity={1 - macroP}>
        {/* Left superconductor block */}
        <rect x={180} y={205} width={540} height={310} rx={22} fill="rgba(16, 46, 88, 0.85)" stroke={C.cyan} strokeWidth={3} />
        {/* Thin insulating barrier */}
        <rect x={755} y={195} width={90} height={330} rx={10} fill="rgba(255, 194, 77, 0.2)" stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" />
        {/* Right superconductor block */}
        <rect x={880} y={205} width={540} height={310} rx={22} fill="rgba(16, 46, 88, 0.85)" stroke={C.cyan} strokeWidth={3} />

        <text x={450} y={258} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>
          SUPERCONDUCTOR A
        </text>
        <text x={800} y={172} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={800} fontSize={20}>
          OXIDE GAP
        </text>
        <text x={1150} y={258} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>
          SUPERCONDUCTOR B
        </text>

        {/* Single Cooper pair hopping across gap */}
        <g transform={`translate(${hopX}, 365)`} style={{ filter: svgGlow(C.gold, 8) }}>
          <ellipse cx={0} cy={0} rx={44} ry={22} fill="rgba(255,194,77,0.22)" stroke={C.gold} strokeWidth={3} />
          <circle cx={-12} cy={0} r={10} fill={C.white} />
          <circle cx={12} cy={0} r={10} fill={C.gold} />
        </g>

        <text x={800} y={595} textAnchor="middle" fill={C.white} fontFamily={INTER} fontWeight={800} fontSize={32}>
          Brian Josephson: Individual Cooper Pairs Tunneling One by One
        </text>
      </g>

      {/* STAGE 2: 1980 ANTHONY LEGGETT'S MACROSCOPIC CHALLENGE */}
      <g opacity={macroP}>
        {/* Smooth energy hill barrier */}
        <path
          d="M160,490 Q460,570 670,475 Q850,235 1030,455 Q1230,610 1460,595"
          fill="none"
          stroke={C.cyan}
          strokeWidth={6}
          style={{ filter: svgGlow(C.cyan, 8) }}
        />

        {/* Giant collective sphere representing BILLIONS of pairs locked as ONE variable */}
        <g transform={`translate(${480 + breath}, 445)`} style={{ filter: svgGlow(C.gold, 12) }}>
          <circle r={72} fill="rgba(255, 194, 77, 0.24)" stroke={C.gold} strokeWidth={4} />
          <circle r={54} fill="rgba(62, 224, 255, 0.32)" stroke={C.white} strokeWidth={2.5} />
          <text x={0} y={7} textAnchor="middle" fill={C.white} fontFamily={MONO} fontWeight={900} fontSize={18}>
            10⁹ PAIRS
          </text>
        </g>

        {/* Dashed ghostly arrow piercing right through the hill */}
        <path
          d="M570,445 L1145,445"
          fill="none"
          stroke={C.gold}
          strokeWidth={5}
          strokeDasharray="16 12"
          opacity={0.7 + 0.3 * Math.sin(t * 5)}
        />
        <polygon points="1165,445 1132,428 1132,462" fill={C.gold} />

        {/* Ghost silhouette on right side */}
        <circle
          cx={1245}
          cy={445}
          r={58}
          fill="rgba(255, 194, 77, 0.14)"
          stroke={C.gold}
          strokeWidth={3.5}
          strokeDasharray="10 8"
          opacity={0.75}
        />
        <text x={1245} y={456} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={36}>
          ?
        </text>

        <text x={800} y={655} textAnchor="middle" fill={C.gold} fontFamily={INTER} fontWeight={900} fontSize={32}>
          Anthony Leggett: Can the ENTIRE Circuit State Tunnel All at Once?
        </text>
      </g>
    </svg>
  );
};
