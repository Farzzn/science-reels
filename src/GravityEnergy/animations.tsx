import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, glow, INTER, MONO, svgGlow } from "../FiveHundredMileEmail/theme";

// ===========================================================================
// 1. MULTI-STAGE 3D-SHADED ARM LIFTING WEIGHT -> BICEP ZOOM -> MICROSCOPIC
//    MUSCLE FILAMENTS FIRING + ATP BURNING TO HEAT (Fixes Issue #2: 1:15–2:05)
// ===========================================================================
export const ArmMuscleZoomAnimation: React.FC<{
  zoomAt: number;
  twitchAt: number;
  heatAt: number;
}> = ({ zoomAt, twitchAt, heatAt }) => {
  const frame = useCurrentFrame();

  // Stage 1 (0 -> zoomAt): Smooth upward curl/lift of the 20kg weight into steady hold
  const liftP = interpolate(frame, [6, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const liftEase = 1 - Math.pow(1 - liftP, 3);

  // Stage 2 (zoomAt -> zoomAt+42): Cinematic 3D camera zoom directly into the bicep
  const zoomP = interpolate(frame, [zoomAt, zoomAt + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoomEase = zoomP < 0.5 ? 2 * zoomP * zoomP : 1 - Math.pow(-2 * zoomP + 2, 2) / 2;

  // Stage 4 (heatAt+): ATP sparks & thermal body heat rising off bicep and filaments
  const heatP = interpolate(frame, [heatAt, heatAt + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strain tremor builds up once weight is lifted into steady hold
  const tremorAmp = liftEase * (2.5 + 3.5 * Math.min(1, frame / Math.max(1, zoomAt)));
  const armTremor = Math.sin(frame * 1.95) * tremorAmp;
  const forearmLiftY = (1 - liftEase) * 145;

  // Rising thermal heat particles across microscopic stage
  const heatParticles = React.useMemo(
    () =>
      new Array(28).fill(0).map((_, i) => ({
        x: 590 + random(`hx${i}`) * 1240,
        phase: random(`hp${i}`),
        size: 4 + random(`hs${i}`) * 7,
        speed: 0.011 + random(`hv${i}`) * 0.016,
      })),
    [],
  );

  const showMacro = zoomP < 0.98;
  const showMicro = zoomP > 0.25;
  const twitchActive = frame >= twitchAt - 25;

  return (
    <AbsoluteFill>
      {/* ================================================================ */}
      {/* MACRO STAGE: Sculpted 3D-Shaded Muscular Arm Lifting 20kg Weight */}
      {/*              + Smooth Cinematic Zoom Straight Into the Bicep     */}
      {/* ================================================================ */}
      {showMacro && (
        <AbsoluteFill
          style={{
            opacity: interpolate(zoomP, [0.55, 0.98], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `scale(${1 + zoomEase * 3.1}) translate(${-zoomEase * 60}px, ${zoomEase * 28}px)`,
            transformOrigin: "38% 51%",
          }}
        >
          {/* Compact Top Header (fades cleanly as zoom begins) */}
          <div
            style={{
              position: "absolute",
              top: 56,
              width: "100%",
              textAlign: "center",
              opacity: interpolate(zoomP, [0, 0.3], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 25, color: C.red, letterSpacing: 6 }}>
              BIOLOGICAL ILLUSION · INSIDE YOUR ARM
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 56,
                color: C.white,
                marginTop: 8,
                letterSpacing: -1.4,
              }}
            >
              Why Holding Still Feels Like <span style={{ color: C.red }}>Hard Work</span>
            </div>
          </div>

          <svg width={1920} height={1080} viewBox="0 0 1920 1080">
            <defs>
              {/* 3D Cylindrical Shading Gradients for Sculpted Arm */}
              <linearGradient id="torso3d" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="35%" stopColor="#0284c7" stopOpacity="0.6" />
                <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
              <linearGradient id="bicep3d" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9ba5" />
                <stop offset="32%" stopColor="#ff3b4e" />
                <stop offset="72%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
              <linearGradient id="forearm3d" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.72" />
                <stop offset="45%" stopColor="#0284c7" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0.82" />
              </linearGradient>
              <radialGradient id="bicepHot" cx="50%" cy="42%" r="55%">
                <stop offset="0%" stopColor="#ffd166" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#ff4d5e" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#ff4d5e" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="crateFront" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#92400e" stopOpacity="0.28" />
              </linearGradient>
              <linearGradient id="crateTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.34" />
              </linearGradient>
            </defs>

            <g transform="translate(210, 246)">
              {/* Sculpted 3D Head & Neck */}
              <ellipse cx={210} cy={125} rx={64} ry={76} fill="url(#torso3d)" stroke={C.cyan} strokeWidth={3.5} style={{ filter: svgGlow(C.cyan, 6) }} />
              <rect x={182} y={196} width={56} height={46} rx={12} fill="url(#torso3d)" stroke={C.cyan} strokeWidth={3} />

              {/* Sculpted Anatomical Torso + Deltoid Shoulder */}
              <path
                d="M115,245 Q210,218 318,250 L335,660 Q210,690 88,660 Z"
                fill="url(#torso3d)"
                stroke={C.cyan}
                strokeWidth={4}
              />
              {/* Specular rim highlight down torso */}
              <path d="M160,260 L150,625" stroke="rgba(255,255,255,0.22)" strokeWidth={8} strokeLinecap="round" />

              {/* Sculpted 3D Deltoid Shoulder Cap */}
              <ellipse cx={322} cy={312} rx={68} ry={62} fill="url(#forearm3d)" stroke={C.cyan} strokeWidth={4} />

              {/* Upper Arm + Bulging 3D Bicep (Trembles under load) */}
              <g transform={`translate(0, ${armTremor})`}>
                {/* Outer X-Ray Arm Skin Shell */}
                <path
                  d="M342,268 Q525,215 688,308 L685,408 Q520,425 335,368 Z"
                  fill="rgba(56,189,248,0.12)"
                  stroke={C.cyan}
                  strokeWidth={3.5}
                />

                {/* 3D Sculpted Bicep Muscle Belly inside arm (bulges as weight lifts!) */}
                <path
                  d={`M372,300 Q518,${218 - liftEase * 24} 655,326 Q520,392 372,348 Z`}
                  fill="url(#bicep3d)"
                  stroke="#ff8a95"
                  strokeWidth={3}
                  style={{ filter: svgGlow(C.red, 10) }}
                />
                {/* Striated longitudinal 3D muscle bundle fibers visible inside bicep */}
                {[-20, -6, 8, 22].map((dy, idx) => (
                  <path
                    key={idx}
                    d={`M388,${318 + dy * 0.5} Q518,${274 + dy - liftEase * 12} 642,${336 + dy * 0.4}`}
                    fill="none"
                    stroke="rgba(255,220,180,0.45)"
                    strokeWidth={2.5}
                    strokeDasharray="18 8"
                  />
                ))}
                {/* Hot internal tension glow */}
                <ellipse cx={518} cy={308} rx={115} ry={44} fill="url(#bicepHot)" opacity={0.45 + 0.25 * Math.sin(frame * 0.25)} />

                {/* Elbow Joint */}
                <circle cx={686} cy={358} r={42} fill="url(#forearm3d)" stroke={C.cyan} strokeWidth={3.5} />

                {/* Forearm + Hand lifting the 3D 20 kg crate */}
                <g transform={`translate(686, 358)`}>
                  <path
                    d={`M0,-34 L318,${-26 + forearmLiftY} L318,${32 + forearmLiftY} L0,38 Z`}
                    fill="url(#forearm3d)"
                    stroke={C.cyan}
                    strokeWidth={4}
                  />
                  {/* Specular highlight along forearm */}
                  <line
                    x1={24}
                    y1={-16}
                    x2={292}
                    y2={-12 + forearmLiftY}
                    stroke="rgba(255,255,255,0.28)"
                    strokeWidth={7}
                    strokeLinecap="round"
                  />
                  {/* Gripping Palm / Fist */}
                  <rect
                    x={306}
                    y={-34 + forearmLiftY}
                    width={62}
                    height={72}
                    rx={20}
                    fill="url(#forearm3d)"
                    stroke={C.cyan}
                    strokeWidth={4}
                  />

                  {/* Isometric 3D Heavy 20 kg Weight Resting on Hand */}
                  <g transform={`translate(285, ${-258 + forearmLiftY})`} style={{ filter: svgGlow(C.gold, 10) }}>
                    {/* Front face */}
                    <polygon points="0,52 215,52 215,248 0,248" fill="url(#crateFront)" stroke={C.gold} strokeWidth={4} />
                    {/* Top 3D face */}
                    <polygon points="0,52 62,0 277,0 215,52" fill="url(#crateTop)" stroke={C.gold} strokeWidth={3.5} />
                    {/* Right 3D face */}
                    <polygon points="215,52 277,0 277,196 215,248" fill="rgba(180,83,9,0.34)" stroke={C.gold} strokeWidth={3.5} />
                    {/* Metallic rivets/frame detail */}
                    <rect x={16} y={68} width={183} height={164} rx={8} fill="none" stroke="rgba(255,230,150,0.32)" strokeWidth={2} />
                    <text x={108} y={168} textAnchor="middle" fill="#fff" fontFamily={MONO} fontWeight={900} fontSize={54}>
                      20 kg
                    </text>

                    {/* Upward Arm Force Arrow (Cyan) */}
                    <line x1={135} y1={-16} x2={135} y2={-114} stroke={C.cyan} strokeWidth={9} strokeLinecap="round" />
                    <polygon points="135,-138 115,-102 155,-102" fill={C.cyan} />
                    <text x={168} y={-68} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={28}>
                      ARM FORCE: 196 N ↑
                    </text>

                    {/* Downward Gravity Arrow (Red) */}
                    <line x1={135} y1={270} x2={135} y2={382} stroke={C.red} strokeWidth={9} strokeLinecap="round" />
                    <polygon points="135,408 115,372 155,372" fill={C.red} />
                    <text x={168} y={358} fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={28}>
                      GRAVITY: 196 N ↓
                    </text>
                  </g>
                </g>

                {/* High-Tech Scanning Zoom Reticle Locking Onto the Bicep */}
                <g
                  transform={`translate(518, 308)`}
                  opacity={interpolate(frame, [Math.max(10, zoomAt - 45), zoomAt - 8], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                  style={{ filter: svgGlow(C.gold, 8) }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={96 + Math.sin(frame * 0.25) * 6}
                    fill="none"
                    stroke={C.gold}
                    strokeWidth={4}
                    strokeDasharray="22 12"
                    transform={`rotate(${frame * 1.4})`}
                  />
                  <circle cx={0} cy={0} r={68} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.7} />
                  {/* Crosshair ticks */}
                  <line x1={-118} y1={0} x2={-82} y2={0} stroke={C.gold} strokeWidth={3.5} />
                  <line x1={82} y1={0} x2={118} y2={0} stroke={C.gold} strokeWidth={3.5} />
                  <line x1={0} y1={-118} x2={0} y2={-82} stroke={C.gold} strokeWidth={3.5} />
                  <line x1={0} y1={82} x2={0} y2={118} stroke={C.gold} strokeWidth={3.5} />
                  <rect x={-165} y={-158} width={330} height={36} rx={10} fill="rgba(4,8,20,0.88)" stroke={C.gold} strokeWidth={2} />
                  <text x={0} y={-133} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>
                    ZOOMING INSIDE BICEP ×10,000
                  </text>
                </g>
              </g>
            </g>
          </svg>
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* MICRO STAGE: Live 3D Arm Holding Weight (Left) Optical Zoom Beam ->  */}
      {/* Giant 3D Cylindrical Actin/Myosin Filaments Firing & Burning ATP     */}
      {/* ==================================================================== */}
      {showMicro && (
        <AbsoluteFill
          style={{
            opacity: interpolate(zoomP, [0.35, 0.85], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Crisp Single-Line Top Header (Zero walls of text!) */}
          <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.gold, letterSpacing: 6 }}>
              MICROSCOPIC VIEW (×10,000) · INSIDE YOUR BICEP
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 900,
                fontSize: 54,
                color: C.white,
                marginTop: 6,
                letterSpacing: -1.2,
              }}
            >
              {heatP > 0.25 ? (
                <>
                  Every Twitch Burns <span style={{ color: C.gold }}>ATP</span> →{" "}
                  <span style={{ color: C.red }}>Body Heat</span>
                </>
              ) : (
                <>
                  Protein Filaments <span style={{ color: C.red }}>Fire · Release · Re-Grab</span>
                </>
              )}
            </div>
          </div>

          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
            <defs>
              <linearGradient id="myosinCyl" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9ca6" />
                <stop offset="45%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#6b0c17" />
              </linearGradient>
              <linearGradient id="actinCyl" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#082f49" />
              </linearGradient>
              <linearGradient id="zoomCone" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
              </linearGradient>
              <linearGradient id="miniBicep" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9ba5" />
                <stop offset="45%" stopColor="#ff3b4e" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>

            {/* Optical Magnifying Beam connecting Left 3D Arm Bicep -> Right Sarcomere Chamber */}
            <polygon points="278,520 585,205 585,905" fill="url(#zoomCone)" />
            <line x1={278} y1={520} x2={585} y2={205} stroke={C.gold} strokeWidth={2} strokeDasharray="10 8" opacity={0.55} />
            <line x1={278} y1={520} x2={585} y2={905} stroke={C.gold} strokeWidth={2} strokeDasharray="10 8" opacity={0.55} />

            {/* LEFT PANEL: Live Animated 3D Arm Lifting/Holding 20 kg Weight Steady */}
            <rect
              x={68}
              y={205}
              width={462}
              height={700}
              rx={26}
              fill="rgba(8, 16, 40, 0.88)"
              stroke={heatP > 0.25 ? C.red : C.cyan}
              strokeWidth={3}
            />
            <text x={299} y={252} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
              HOLDING WEIGHT STEADY
            </text>

            {/* Compact 3D Muscular Arm Holding 20kg Dumbbell/Weight */}
            <g transform={`translate(90, ${415 + Math.sin(frame * 2.1) * 3.5})`}>
              {/* Shoulder & Upper Arm */}
              <circle cx={68} cy={135} r={40} fill="rgba(14,165,233,0.34)" stroke={C.cyan} strokeWidth={3} />
              <path
                d="M78,108 Q168,52 246,122 L242,174 Q165,188 74,162 Z"
                fill="rgba(56,189,248,0.16)"
                stroke={C.cyan}
                strokeWidth={3}
              />
              {/* Pulsing 3D Bicep Muscle */}
              <path
                d="M96,120 Q168,62 232,130 Q168,170 96,148 Z"
                fill="url(#miniBicep)"
                stroke="#fda4af"
                strokeWidth={2.5}
                style={{ filter: svgGlow(C.red, 8 + heatP * 8) }}
              />
              {/* Elbow & Forearm angled upward holding weight */}
              <circle cx={246} cy={148} r={24} fill="rgba(14,165,233,0.36)" stroke={C.cyan} strokeWidth={3} />
              <path d="M254,132 L348,24 L378,50 L264,166 Z" fill="rgba(14,165,233,0.42)" stroke={C.cyan} strokeWidth={3.5} />
              {/* 3D Dumbbell / 20 kg Weight Held Steady */}
              <g transform="translate(328, -55)" style={{ filter: svgGlow(C.gold, 8) }}>
                <rect x={-26} y={-22} width={22} height={96} rx={7} fill={C.gold} stroke="#fef08a" strokeWidth={2} />
                <rect x={44} y={-22} width={22} height={96} rx={7} fill={C.gold} stroke="#fef08a" strokeWidth={2} />
                <rect x={-4} y={18} width={48} height={16} rx={4} fill="#e2e8f0" />
                <text x={20} y={-34} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
                  20 kg
                </text>
              </g>
              {/* Wavy Infrared Heat Waves radiating off bicep once heatP > 0 */}
              {heatP > 0.05 &&
                [125, 165, 205].map((hx, idx) => {
                  const waveOff = ((frame * 2.2 + idx * 24) % 90);
                  return (
                    <path
                      key={idx}
                      d={`M${hx},${92 - waveOff} Q${hx - 12},${70 - waveOff} ${hx},${48 - waveOff} Q${hx + 12},${26 - waveOff} ${hx},${6 - waveOff}`}
                      fill="none"
                      stroke={C.red}
                      strokeWidth={4}
                      strokeLinecap="round"
                      opacity={(1 - waveOff / 90) * heatP * 0.9}
                      style={{ filter: svgGlow(C.red, 5) }}
                    />
                  );
                })}
              {/* Glowing target circle on bicep */}
              <circle cx={182} cy={106} r={34} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="10 6" />
            </g>

            {/* Bottom status inside left arm box */}
            <text x={299} y={760} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={20}>
              BOX POSITION: STATIC
            </text>
            <text x={299} y={802} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={24}>
              DISTANCE d = 0.00 m
            </text>
            <text
              x={299}
              y={860}
              textAnchor="middle"
              fill={heatP > 0.25 ? C.red : C.gold}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={22}
            >
              {heatP > 0.25 ? "BICEP RADIATING HEAT 🔥" : "FIBERS CANNOT LOCK!"}
            </text>

            {/* RIGHT MAIN CHAMBER: Giant 3D Cylindrical Sarcomere Muscle Filaments */}
            <rect
              x={585}
              y={205}
              width={1265}
              height={700}
              rx={26}
              fill="rgba(7, 14, 34, 0.9)"
              stroke={C.gold}
              strokeWidth={3}
            />

            {/* Compact legend pills inside top of chamber */}
            <g transform="translate(625, 245)">
              <rect x={0} y={-14} width={28} height={14} rx={7} fill="url(#actinCyl)" />
              <text x={40} y={-1} fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={20}>
                ACTIN TRACK
              </text>
              <rect x={245} y={-15} width={32} height={16} rx={8} fill="url(#myosinCyl)" />
              <text x={288} y={-1} fill={C.red} fontFamily={MONO} fontWeight={800} fontSize={20}>
                MYOSIN MOTOR HEADS
              </text>
              <text x={1185} y={-1} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={20}>
                DOZENS OF TWITCHES / SEC
              </text>
            </g>

            {/* 3 Parallel 3D Sarcomere Muscle Tracks */}
            {[365, 565, 765].map((cy, row) => (
              <g key={row}>
                {/* Top & Bottom 3D Shaded Actin Filaments */}
                <rect x={635} y={cy - 70} width={1165} height={22} rx={11} fill="url(#actinCyl)" style={{ filter: svgGlow(C.cyan, 4) }} />
                <rect x={635} y={cy + 48} width={1165} height={22} rx={11} fill="url(#actinCyl)" style={{ filter: svgGlow(C.cyan, 4) }} />

                {/* Central 3D Shaded Myosin Fiber Core */}
                <rect x={685} y={cy - 17} width={1065} height={34} rx={17} fill="url(#myosinCyl)" style={{ filter: svgGlow(C.red, 6) }} />

                {/* 8 Animated Myosin Cross-Bridge Heads Firing, Pulling, Releasing & Re-Grabbing */}
                {new Array(8).fill(0).map((_, i) => {
                  const hx = 740 + i * 136;
                  const cycle = twitchActive ? (frame * 0.25 + i * 0.78 + row * 1.4) % (Math.PI * 2) : 0;
                  const grab = Math.sin(cycle);
                  const firing = grab > 0.72;
                  return (
                    <g key={i}>
                      {/* Upper articulated cross-bridge */}
                      <line
                        x1={hx}
                        y1={cy - 15}
                        x2={hx + grab * 24}
                        y2={cy - 48}
                        stroke={firing ? "#ffffff" : C.gold}
                        strokeWidth={firing ? 7 : 5}
                        strokeLinecap="round"
                      />
                      <circle
                        cx={hx + grab * 24}
                        cy={cy - 48}
                        r={firing ? 11 : 8}
                        fill={firing ? C.gold : C.red}
                        style={firing ? { filter: svgGlow(C.gold, 8) } : undefined}
                      />
                      {/* Lower articulated cross-bridge */}
                      <line
                        x1={hx + 22}
                        y1={cy + 15}
                        x2={hx + 22 - grab * 24}
                        y2={cy + 48}
                        stroke={firing ? "#ffffff" : C.gold}
                        strokeWidth={firing ? 7 : 5}
                        strokeLinecap="round"
                      />
                      <circle
                        cx={hx + 22 - grab * 24}
                        cy={cy + 48}
                        r={firing ? 11 : 8}
                        fill={firing ? C.gold : C.red}
                      />
                      {/* ATP Spark Burst when filament fires */}
                      {firing && heatP > 0.05 && (
                        <text
                          x={hx + 12}
                          y={cy - 80}
                          textAnchor="middle"
                          fill={C.gold}
                          fontFamily={MONO}
                          fontWeight={900}
                          fontSize={20}
                          opacity={heatP}
                        >
                          ATP⚡
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}

            {/* Rising Crimson/Gold Thermal Heat Particles */}
            {heatP > 0 &&
              heatParticles.map((p, idx) => {
                const yProg = (p.phase + frame * p.speed) % 1;
                const py = 885 - yProg * 620;
                const px = p.x + Math.sin(frame * 0.1 + idx) * 16;
                return (
                  <circle
                    key={idx}
                    cx={px}
                    cy={py}
                    r={p.size}
                    fill={idx % 2 === 0 ? C.red : C.gold}
                    opacity={Math.sin(yProg * Math.PI) * 0.72 * heatP}
                    style={{ filter: svgGlow(C.red, 5) }}
                  />
                );
              })}
          </svg>

          {/* Compact Bottom Live Energy Bar */}
          <div
            style={{
              position: "absolute",
              bottom: 42,
              left: 68,
              right: 70,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 38px",
              borderRadius: 18,
              background: "rgba(8, 15, 36, 0.92)",
              border: `2.5px solid ${heatP > 0.25 ? C.red : C.cyan}`,
              boxShadow: glow(heatP > 0.25 ? C.red : C.cyan, 10),
            }}
          >
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 27, color: C.red }}>
              MUSCLE ATP → BODY HEAT: {Math.round(45 + heatP * 115 + Math.sin(frame * 0.3) * 6)} WATTS 🔥
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 27, color: C.green }}>
              ENERGY GIVEN TO BOX: 0.00 JOULES ✓
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. PERSON SITTING IN CHAIR — BALANCED FORCES (Fixes Issue #3 at ~3:16)
// ===========================================================================
export const PersonInChairSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.86 + 0.14 * Math.sin(frame * 0.14);
  const breathe = Math.sin(frame * 0.08) * 2;

  return (
    <svg width={680} height={560} viewBox="0 0 680 560">
      <defs>
        <linearGradient id="chairCushion" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="personFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      {/* Floor */}
      <line x1={40} y1={495} x2={640} y2={495} stroke={C.cyan} strokeWidth={4} />
      <text x={340} y={534} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
        FLOOR · DISTANCE MOVED = 0.00 m
      </text>

      {/* Stylized 3D-Shaded Modern Chair */}
      <g style={{ filter: svgGlow(C.cyan, 4) }}>
        {/* Backrest cushion */}
        <rect x={212} y={160} width={28} height={192} rx={12} fill="url(#chairCushion)" stroke={C.cyan} strokeWidth={3.5} />
        {/* Seat cushion */}
        <rect x={212} y={338} width={196} height={28} rx={12} fill="url(#chairCushion)" stroke={C.cyan} strokeWidth={3.5} />
        {/* Chair legs */}
        <line x1={232} y1={366} x2={232} y2={495} stroke={C.cyan} strokeWidth={9} strokeLinecap="round" />
        <line x1={388} y1={366} x2={388} y2={495} stroke={C.cyan} strokeWidth={9} strokeLinecap="round" />
      </g>

      {/* Seated Human Silhouette (Subtle natural breathing) */}
      <g transform={`translate(0, ${breathe})`} style={{ filter: svgGlow(C.white, 3) }}>
        {/* Head */}
        <circle cx={288} cy={135} r={35} fill="url(#personFill)" stroke={C.white} strokeWidth={5} />
        {/* Torso */}
        <path
          d="M262,182 Q288,174 314,182 L322,318 Q288,328 258,318 Z"
          fill="url(#personFill)"
          stroke={C.white}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {/* Seated Thighs & Legs */}
        <path
          d="M286,314 L410,314 L410,486 L448,486"
          fill="none"
          stroke={C.white}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Relaxed Arm */}
        <path
          d="M294,218 L345,274 L398,274"
          fill="none"
          stroke={C.white}
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Equilibrium Glow Line between Seat & Person */}
      <line
        x1={238}
        y1={336}
        x2={394}
        y2={336}
        stroke={C.green}
        strokeWidth={4}
        opacity={pulse}
        style={{ filter: svgGlow(C.green, 8) }}
      />

      {/* Downward Gravity Arrow (Left of Chair — Zero Overlap!) */}
      <g opacity={pulse} style={{ filter: svgGlow(C.gold, 8) }}>
        <line x1={124} y1={240} x2={124} y2={388} stroke={C.gold} strokeWidth={10} strokeLinecap="round" />
        <polygon points="124,414 104,376 144,376" fill={C.gold} />
        <text x={115} y={182} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
          GRAVITY ↓
        </text>
        <text x={115} y={214} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
          700 N
        </text>
      </g>

      {/* Upward Chair Normal Force Arrow (Right of Chair — Zero Overlap!) */}
      <g opacity={pulse} style={{ filter: svgGlow(C.green, 8) }}>
        <line x1={542} y1={392} x2={542} y2={244} stroke={C.green} strokeWidth={10} strokeLinecap="round" />
        <polygon points="542,218 522,256 562,256" fill={C.green} />
        <text x={542} y={172} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={24}>
          CHAIR PUSH ↑
        </text>
        <text x={542} y={204} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={24}>
          700 N
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// 3. ANIMATED FALLING APPLE WITH QUADRATIC ACCELERATION & DISTANCE RULER
//    (For Ch2 Beat 3B — ONLY appears when narration mentions letting go of an apple!)
// ===========================================================================
export const FallingAppleSVG: React.FC<{ dropAt: number }> = ({ dropAt }) => {
  const frame = useCurrentFrame();
  const rawP = interpolate(frame, [dropAt + 12, dropAt + 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Realistic free-fall acceleration d = 0.5 * g * t^2
  const fallP = rawP * rawP;
  const appleY = 115 + fallP * 328;
  const distM = fallP * 4.9;
  const impactP = interpolate(frame, [dropAt + 64, dropAt + 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={640} height={560} viewBox="0 0 640 560">
      <defs>
        <radialGradient id="apple3d" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ff94a0" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>

      {/* Ground */}
      <line x1={60} y1={490} x2={600} y2={490} stroke={C.cyan} strokeWidth={4} />
      <text x={330} y={528} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={800} fontSize={22}>
        GROUND
      </text>

      {/* Vertical Distance Ruler on Left (generous left padding so "d = 4.9 m" never clips!) */}
      <line x1={172} y1={115} x2={172} y2={appleY} stroke={C.gold} strokeWidth={5} strokeDasharray="10 6" />
      <line x1={156} y1={115} x2={188} y2={115} stroke={C.gold} strokeWidth={4} />
      <line x1={156} y1={appleY} x2={188} y2={appleY} stroke={C.gold} strokeWidth={4} />
      <text x={152} y={Math.max(170, (115 + appleY) / 2 + 8)} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23}>
        d = {distM.toFixed(1)} m
      </text>

      {/* Motion Speed Trail behind Falling Apple */}
      {rawP > 0.05 && rawP < 0.99 &&
        [1, 2, 3, 4].map((k) => {
          const prevP = Math.max(0, rawP - k * 0.07);
          const py = 115 + prevP * prevP * 328;
          return (
            <circle
              key={k}
              cx={330}
              cy={py}
              r={42 - k * 7}
              fill={C.red}
              opacity={0.28 - k * 0.055}
            />
          );
        })}

      {/* Impact Shockwave Ring on Ground */}
      {impactP > 0 && impactP < 1 && (
        <ellipse
          cx={330}
          cy={488}
          rx={35 + impactP * 145}
          ry={8 + impactP * 24}
          fill="none"
          stroke={C.gold}
          strokeWidth={4 * (1 - impactP)}
          opacity={1 - impactP}
        />
      )}

      {/* 3D Shaded Apple + Downward Acceleration Arrow */}
      <g transform={`translate(330, ${appleY})`} style={{ filter: svgGlow(C.red, 10) }}>
        <circle cx={0} cy={0} r={44} fill="url(#apple3d)" stroke="#fca5a5" strokeWidth={2} />
        <ellipse cx={-14} cy={-14} rx={10} ry={16} fill="rgba(255,255,255,0.34)" transform="rotate(-25 -14 -14)" />
        {/* Stem & Leaf */}
        <path d="M0,-42 Q5,-64 14,-66" fill="none" stroke="#a16207" strokeWidth={5} strokeLinecap="round" />
        <path d="M8,-56 Q30,-74 40,-54 Q22,-44 8,-56 Z" fill={C.green} />

        {/* Live Label */}
        <text x={68} y={-4} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
          {rawP < 0.98 ? "ACCELERATING ↓" : "KINETIC ENERGY!"}
        </text>
        <text x={68} y={28} fill={C.cyan} fontFamily={MONO} fontWeight={800} fontSize={22}>
          v = {(rawP * 9.8).toFixed(1)} m/s
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// 4. 3D GEODESIC CURVED SPACETIME BOWL ANIMATION (Fixes Issue #5: 6:30–7:08)
// ===========================================================================
export const GeodesicBowlAnimation: React.FC<{
  straightAt: number;
  earthAt: number;
}> = ({ straightAt, earthAt }) => {
  const frame = useCurrentFrame();
  const cx = 960;
  const cy = 548;
  const rings = 9;
  const spokes = 22;

  const straightP = interpolate(frame, [straightAt, straightAt + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const earthP = interpolate(frame, [earthAt, earthAt + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const proj = (r: number, theta: number): [number, number] => {
    const x = cx + Math.cos(theta) * r;
    const dip = 335 / (1 + Math.pow(r / 175, 1.85));
    const y = cy + Math.sin(theta) * (r * 0.35) + dip - 85;
    return [x, y];
  };

  // Two marbles/moons gliding smoothly around curved geodesics
  const a1 = frame * 0.038 + 0.4;
  const a2 = -frame * 0.024 + 2.4;
  const r1 = 305;
  const r2 = 520;
  const [m1x, m1y] = proj(r1, a1);
  const [m2x, m2y] = proj(r2, a2);

  // Tangent direction along geodesic for marble 1
  const [m1nx, m1ny] = proj(r1, a1 + 0.14);
  const tdx = m1nx - m1x;
  const tdy = m1ny - m1y;
  const tLen = Math.hypot(tdx, tdy) || 1;
  const tvx = (tdx / tLen) * 115;
  const tvy = (tdy / tLen) * 115;

  const trail1 = new Array(32).fill(0).map((_, i) => proj(r1, a1 - i * 0.042));
  const trail2 = new Array(30).fill(0).map((_, i) => proj(r2, a2 + i * 0.032));

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="bowlAmbient" cx="50%" cy="62%" r="48%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#0369a1" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bowlCore" cx="35%" cy="32%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#081a3e" />
        </radialGradient>
        <radialGradient id="marbleGold" cx="32%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <clipPath id="bowlEarthClip">
          <circle cx={0} cy={0} r={74} />
        </clipPath>
      </defs>

      {/* Soft Volumetric Glow Inside the Curved Bowl */}
      <ellipse cx={cx} cy={cy + 85} rx={720} ry={340} fill="url(#bowlAmbient)" />

      {/* Curved 3D Bowl Spokes */}
      {new Array(spokes).fill(0).map((_, s) => {
        const th = (s / spokes) * Math.PI * 2 + frame * 0.0025;
        const pts: string[] = [];
        for (let st = 0; st <= 28; st++) {
          const r = 64 + (st / 28) * 680;
          const [px, py] = proj(r, th);
          pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        return <polyline key={`sp-${s}`} points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={1.6} opacity={0.34} />;
      })}

      {/* Concentric Bowl Contours */}
      {new Array(rings).fill(0).map((_, k) => {
        const r = 92 + k * 82;
        const pts: string[] = [];
        for (let st = 0; st <= 76; st++) {
          const th = (st / 76) * Math.PI * 2;
          const [px, py] = proj(r, th);
          pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        const isTrack = k === 2 || k === 5;
        return (
          <polyline
            key={`rg-${k}`}
            points={pts.join(" ")}
            fill="none"
            stroke={isTrack ? C.gold : C.cyan}
            strokeWidth={isTrack ? 3 : 1.7}
            opacity={isTrack ? 0.65 : 0.38}
          />
        );
      })}

      {/* Luminous Geodesic Trail 1 */}
      {trail1.map(([tx, ty], i) => (
        <circle key={`t1-${i}`} cx={tx} cy={ty} r={14 * (1 - i / 32)} fill={C.gold} opacity={0.85 * (1 - i / 32)} />
      ))}
      {/* Luminous Geodesic Trail 2 */}
      {trail2.map(([tx, ty], i) => (
        <circle key={`t2-${i}`} cx={tx} cy={ty} r={11 * (1 - i / 30)} fill={C.cyan} opacity={0.75 * (1 - i / 30)} />
      ))}

      {/* Central Mass / Earth Bending the Spacetime Bowl */}
      <g transform={`translate(${cx}, ${cy + 168})`} style={{ filter: svgGlow(C.cyan, 14) }}>
        <circle cx={0} cy={0} r={74} fill="url(#bowlCore)" stroke={C.cyan} strokeWidth={3.5} />
        {/* Continents fade in when narrator switches analogy from marble -> Earth & Moon */}
        <g clipPath="url(#bowlEarthClip)" opacity={earthP * 0.72} transform={`rotate(${frame * 0.45})`}>
          <path d="M-45,-32 Q-10,-48 16,-22 Q28,6 -12,18 Q-42,22 -45,-32 Z" fill="#10b981" />
          <path d="M18,-6 Q52,-18 58,20 Q36,48 12,28 Z" fill="#10b981" />
        </g>
        <text x={0} y={108} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={23}>
          {earthP > 0.4 ? "EARTH CURVES SPACETIME" : "MASS BENDS THE BOWL"}
        </text>
      </g>

      {/* Local Straight-Line Geodesic Vector on Marble 1 */}
      {straightP > 0 && (
        <g opacity={straightP} style={{ filter: svgGlow(C.green, 8) }}>
          <line x1={m1x} y1={m1y} x2={m1x + tvx} y2={m1y + tvy} stroke={C.green} strokeWidth={6} strokeLinecap="round" />
          <circle cx={m1x + tvx} cy={m1y + tvy} r={7} fill={C.green} />
        </g>
      )}

      {/* Rolling Marble 1 (Inner Geodesic) */}
      <g transform={`translate(${m1x}, ${m1y})`} style={{ filter: svgGlow(C.gold, 10) }}>
        <circle cx={0} cy={0} r={22} fill="url(#marbleGold)" stroke="#fff" strokeWidth={2.5} />
        <rect x={-78} y={-56} width={156} height={28} rx={8} fill="rgba(4,8,20,0.84)" stroke={C.gold} strokeWidth={1.8} />
        <text x={0} y={-36} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={18}>
          {earthP > 0.4 ? "MOON GEODESIC" : "GEODESIC PATH"}
        </text>
      </g>

      {/* Rolling Marble 2 (Outer Geodesic) */}
      <g transform={`translate(${m2x}, ${m2y})`} style={{ filter: svgGlow(C.cyan, 8) }}>
        <circle cx={0} cy={0} r={16} fill="#e2e8f0" stroke={C.cyan} strokeWidth={2.5} />
      </g>
    </svg>
  );
};

// ===========================================================================
// 5. HIGH-DETAIL TIDAL TORQUE & RECEDING MOON (Fixes Issue #6: 7:09–7:54)
//    Zero overlapping text; live ocean swelling, tilted bulge, friction sparks,
//    energy packets transferring into receding Moon!
// ===========================================================================
export const HighDetailTidalAnimation: React.FC<{
  tidesAt: number;
  brakeAt: number;
  recedeAt: number;
}> = ({ tidesAt, brakeAt, recedeAt }) => {
  const frame = useCurrentFrame();

  // Ocean swells dramatically into elongated tidal ellipse at tidesAt
  const swellP = interpolate(frame, [tidesAt - 10, tidesAt + 35], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Earth's fast spin drags the tidal bulge 17° ahead at brakeAt
  const tiltDeg = interpolate(frame, [brakeAt - 18, brakeAt + 28], [0, -17], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brakeGlow = interpolate(frame, [brakeAt, brakeAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const moonDrift = interpolate(frame, [recedeAt, recedeAt + 110], [0, 125], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const earthSpin = frame * 2.4;
  const ex = 450;
  const ey = 545;
  const bulgeRx = 166 + swellP * 88;
  const bulgeRy = 166 + swellP * 10;
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const peakX = ex + Math.cos(tiltRad) * bulgeRx;
  const peakY = ey + Math.sin(tiltRad) * bulgeRx;

  const mx = 1355 + moonDrift;
  const my = 545;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="52%" stopColor="#0ea5e9" stopOpacity="0.12" />
          <stop offset="86%" stopColor="#38bdf8" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.88" />
        </radialGradient>
        <radialGradient id="earthCore2" cx="34%" cy="32%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="58%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#091634" />
        </radialGradient>
        <radialGradient id="earthShadow" cx="28%" cy="50%" r="72%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.65" />
        </radialGradient>
        <radialGradient id="moonSurf" cx="32%" cy="32%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="60%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>
        <clipPath id="earthGlobeClip">
          <circle cx={0} cy={0} r={148} />
        </clipPath>
      </defs>

      {/* Subtle Orbital Arc Track Behind the Moon */}
      <path
        d={`M${mx - 70},215 A950,950 0 0,1 ${mx - 70},875`}
        fill="none"
        stroke="rgba(255,194,77,0.22)"
        strokeWidth={3}
        strokeDasharray="12 10"
      />

      {/* Expanding Ocean Wave Ripples */}
      {[0, 1, 2].map((i) => {
        const p = (frame * 0.017 + i * 0.33) % 1;
        return (
          <ellipse
            key={i}
            cx={ex}
            cy={ey}
            rx={bulgeRx + p * 60}
            ry={bulgeRy + p * 40}
            transform={`rotate(${tiltDeg} ${ex} ${ey})`}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2.2}
            opacity={(1 - p) * 0.45 * swellP}
          />
        );
      })}

      {/* Elongated Ocean Tidal Bulge */}
      <g transform={`translate(${ex}, ${ey}) rotate(${tiltDeg})`} style={{ filter: svgGlow(C.cyan, 10) }}>
        <ellipse cx={0} cy={0} rx={bulgeRx} ry={bulgeRy} fill="url(#oceanGlow)" stroke={C.cyan} strokeWidth={5} />
        {/* High-tide peak markers */}
        <circle cx={bulgeRx} cy={0} r={10} fill={C.gold} />
        <circle cx={-bulgeRx} cy={0} r={9} fill={C.cyan} />
      </g>

      {/* Clean Leader Callout for Near Bulge (High Above Torque Beam — Zero Overlap!) */}
      <g opacity={swellP}>
        <polyline
          points={`${peakX.toFixed(1)},${(peakY - 12).toFixed(1)} ${(peakX + 26).toFixed(1)},330 ${(peakX + 60).toFixed(1)},330`}
          fill="none"
          stroke={C.gold}
          strokeWidth={2.5}
        />
        <text x={peakX + 70} y={337} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={22}>
          {brakeGlow > 0.2 ? "TIDAL BULGE DRAGGED AHEAD 17°" : "HIGH TIDE OCEAN BULGE"}
        </text>
      </g>

      {/* Rotating 3D Earth with Clipped Continents & Terminator Shadow */}
      <g transform={`translate(${ex}, ${ey})`}>
        <circle cx={0} cy={0} r={148} fill="url(#earthCore2)" stroke="#60a5fa" strokeWidth={4} />
        <g clipPath="url(#earthGlobeClip)">
          <g transform={`rotate(${earthSpin})`}>
            <path d="M-92,-68 Q-32,-98 22,-56 Q46,-8 -16,22 Q-76,32 -92,-68 Z" fill="#10b981" opacity={0.62} />
            <path d="M38,-22 Q106,-42 122,26 Q86,86 34,56 Q18,16 38,-22 Z" fill="#10b981" opacity={0.56} />
            <path d="M-86,54 Q-34,44 -8,96 Q-56,128 -96,96 Z" fill="#10b981" opacity={0.52} />
            <circle cx={0} cy={0} r={148} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} />
            <line x1={-148} y1={0} x2={148} y2={0} stroke="rgba(255,255,255,0.16)" strokeWidth={1.8} />
            <line x1={0} y1={-148} x2={0} y2={148} stroke="rgba(255,255,255,0.16)" strokeWidth={1.8} />
          </g>
          {/* 3D Spherical Lighting Shadow */}
          <circle cx={0} cy={0} r={148} fill="url(#earthShadow)" />
        </g>

        {/* Counter-Clockwise Green Earth Spin Arrow (Top-Left of Earth) */}
        <path d="M-38,-204 A208,208 0 0,0 -192,-86" fill="none" stroke={C.green} strokeWidth={7} strokeLinecap="round" />
        <polygon points="-204,-68 -176,-82 -202,-104" fill={C.green} />
        <text x={-225} y={-196} fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={22}>
          EARTH SPIN
        </text>

        {/* Red Tidal Friction Brake Arc (Cleanly Placed at BOTTOM of Earth — Zero Overlap!) */}
        {brakeGlow > 0 && (
          <g opacity={brakeGlow} style={{ filter: svgGlow(C.red, 8) }}>
            <path d="M-112,175 A208,208 0 0,0 112,175" fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" />
            <polygon points="-132,162 -100,158 -114,188" fill={C.red} />
            {/* Animated friction sparks along seabed-ocean interface */}
            {[-60, 0, 60].map((sx, idx) => {
              const sp = (frame * 0.14 + idx * 0.33) % 1;
              return (
                <circle
                  key={idx}
                  cx={sx + Math.sin(frame * 0.4 + idx) * 8}
                  cy={148 + sp * 28}
                  r={5 * (1 - sp)}
                  fill={C.gold}
                  opacity={1 - sp}
                />
              );
            })}
            <text x={0} y={248} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={24}>
              OCEAN FRICTION BRAKE
            </text>
          </g>
        )}
      </g>

      {/* Asymmetric Forward-Pulling Gravitational Torque Beam from Near Bulge -> Moon */}
      <g style={{ filter: svgGlow(C.gold, 8) }}>
        {/* Center-to-center baseline */}
        <line x1={ex} y1={ey} x2={mx} y2={my} stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="8 8" />
        {/* Off-axis torque beam from forward-dragged tidal bulge */}
        <line x1={peakX} y1={peakY} x2={mx} y2={my} stroke={C.gold} strokeWidth={6} strokeDasharray="16 8" />
        {/* Glowing rotational energy packets flowing from Earth's spin to the Moon */}
        {[0, 1, 2, 3, 4].map((k) => {
          const p = (frame * 0.024 + k * 0.2) % 1;
          const bx = peakX + (mx - peakX) * p;
          const by = peakY + (my - peakY) * p;
          return <circle key={k} cx={bx} cy={by} r={8.5} fill="#fff" />;
        })}
        <text x={(peakX + mx) / 2} y={ey + 62} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={23}>
          STOLEN ROTATIONAL ENERGY →
        </text>
      </g>

      {/* Cratered 3D Moon Being Boosted Forward & Drifting Outward */}
      <g transform={`translate(${mx}, ${my})`} style={{ filter: svgGlow(C.gold, 10) }}>
        <circle cx={0} cy={0} r={60} fill="url(#moonSurf)" stroke={C.gold} strokeWidth={4} />
        <circle cx={-18} cy={-16} r={14} fill="rgba(51,65,85,0.45)" />
        <circle cx={20} cy={16} r={17} fill="rgba(51,65,85,0.38)" />
        <circle cx={-10} cy={25} r={9} fill="rgba(51,65,85,0.42)" />
        {/* Forward orbital boost vector (upward tangent) */}
        <line x1={0} y1={-68} x2={0} y2={-168} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
        <polygon points="0,-192 -16,-158 16,-158" fill={C.cyan} />
        <text x={0} y={-208} textAnchor="middle" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={22}>
          ORBITAL BOOST ↑
        </text>
        {/* Outward Drift Arrow (+3.8 cm/year) */}
        <line x1={72} y1={0} x2={198} y2={0} stroke={C.green} strokeWidth={9} strokeLinecap="round" />
        <polygon points="222,0 188,-18 188,18" fill={C.green} />
        <text x={24} y={108} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={26}>
          DRIFTS AWAY →
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// 6. LIVE SPIRALING BINARY BLACK HOLES, QUADRUPOLE WAVES & LIGO CHIRP MONITOR
//    (Fixes Issue #7: 7:54–8:18 — Inspiral syncs directly to "until they collide"!)
// ===========================================================================
export const BinaryBlackHoleWavesSVG: React.FC<{
  startAt: number;
  collideAt: number;
}> = ({ startAt, collideAt }) => {
  const frame = useCurrentFrame();
  const cx = 525;
  const cy = 590;

  // Progress from inspiral start -> exact collision moment!
  const span = Math.max(120, collideAt - startAt);
  const rawP = interpolate(frame, [startAt, collideAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const postP = interpolate(frame, [collideAt, collideAt + 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Separation shrinks smoothly as orbital energy radiates away
  const sep = rawP < 1 ? interpolate(Math.pow(rawP, 1.45), [0, 1], [150, 0]) : 0;
  // Chirp orbital phase accelerates dramatically into merger!
  const angle = rawP * Math.PI * 10 + Math.pow(rawP, 3.2) * Math.PI * 16 + postP * Math.PI * 6;
  const b1x = cx + Math.cos(angle) * sep;
  const b1y = cy + Math.sin(angle) * sep;
  const b2x = cx - Math.cos(angle) * sep;
  const b2y = cy - Math.sin(angle) * sep;

  // Quadrupole spiral wave arms radiating out to r=380 (strictly inside arena!)
  const buildArm = (offsetAngle: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 90; i++) {
      const r = 34 + i * 3.85;
      const th = offsetAngle + angle - r * 0.025;
      pts.push(`${(cx + Math.cos(th) * r).toFixed(1)},${(cy + Math.sin(th) * r).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Live LIGO Gravitational Wave Chirp Oscilloscope (GW150914) synced to inspiral & ringdown!
  const playhead = Math.min(1, interpolate(frame, [startAt, collideAt + 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const mergerFrac = span / (span + 65);
  const ligoPts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    if (t > playhead) break;
    let amp = 0;
    if (t <= mergerFrac) {
      const u = t / mergerFrac;
      amp = 8 + Math.pow(u, 2.7) * 96;
    } else {
      const v = (t - mergerFrac) / Math.max(0.01, 1 - mergerFrac);
      amp = 104 * Math.exp(-v * 6.5);
    }
    const phase = t <= mergerFrac
      ? 18 * t + 70 * Math.pow(t / mergerFrac, 3.2)
      : 18 * mergerFrac + 70 + (t - mergerFrac) * 210;
    const wx = 1065 + t * 725;
    const wy = 485 + Math.sin(phase) * amp;
    ligoPts.push(`${wx.toFixed(1)},${wy.toFixed(1)}`);
  }

  // Energy bars: Orbital Energy drains while Radiated Wave Energy rises
  const radiatedPct = Math.round(Math.min(100, Math.pow(rawP, 1.5) * 82 + postP * 18));
  const orbitalPct = 100 - radiatedPct;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="bhHalo" cx="50%" cy="50%" r="50%">
          <stop offset="42%" stopColor="#000000" />
          <stop offset="68%" stopColor="#ff9900" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff9900" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arenaMaskGrad" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id="arenaFadeMask">
          <circle cx={cx} cy={cy} r={395} fill="url(#arenaMaskGrad)" />
        </mask>
      </defs>

      {/* LEFT ARENA: Binary Black Holes & Quadrupole Spacetime Ripples (Smoothly Masked!) */}
      <g mask="url(#arenaFadeMask)">
        {/* Subtle Quadrupole-Warping Spacetime Grid */}
        {new Array(11).fill(0).map((_, idx) => {
          const offset = (idx - 5) * 72;
          const strain = Math.sin(angle * 2) * (10 + rawP * 14) * (1 - postP * 0.8);
          return (
            <React.Fragment key={`mesh-${idx}`}>
              <line
                x1={cx - 390}
                y1={cy + offset + strain * (offset / 300)}
                x2={cx + 390}
                y2={cy + offset + strain * (offset / 300)}
                stroke={C.cyan}
                strokeWidth={1.2}
                opacity={0.2}
              />
              <line
                x1={cx + offset - strain * (offset / 300)}
                y1={cy - 390}
                x2={cx + offset - strain * (offset / 300)}
                y2={cy + 390}
                stroke={C.cyan}
                strokeWidth={1.2}
                opacity={0.2}
              />
            </React.Fragment>
          );
        })}

        {/* Expanding Concentric Spacetime Ripple Rings */}
        {new Array(8).fill(0).map((_, i) => {
          const rp = (frame * 0.018 + i / 8) % 1;
          const rr = 48 + rp * 345;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={rr}
              fill="none"
              stroke={i % 2 === 0 ? C.gold : C.cyan}
              strokeWidth={3.5 * (1 - rp * 0.45)}
              opacity={(1 - rp) * 0.72}
            />
          );
        })}

        {/* Quadrupole Spiral Gravitational Wave Arms */}
        <polyline
          points={buildArm(0)}
          fill="none"
          stroke={C.gold}
          strokeWidth={5.5}
          opacity={0.78 * (1 - postP * 0.65)}
          style={{ filter: svgGlow(C.gold, 8) }}
        />
        <polyline
          points={buildArm(Math.PI)}
          fill="none"
          stroke={C.cyan}
          strokeWidth={5.5}
          opacity={0.78 * (1 - postP * 0.65)}
          style={{ filter: svgGlow(C.cyan, 8) }}
        />

        {/* Shrinking Orbit Ring */}
        {sep > 4 && (
          <circle cx={cx} cy={cy} r={sep} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="8 6" />
        )}

        {/* Two Orbiting Black Holes -> Merge Into Single Ringing Black Hole at collideAt! */}
        {rawP < 1 ? (
          [
            [b1x, b1y],
            [b2x, b2y],
          ].map(([bx, by], idx) => (
            <g key={idx} transform={`translate(${bx}, ${by})`}>
              <circle cx={0} cy={0} r={54} fill="url(#bhHalo)" />
              <circle cx={0} cy={0} r={27} fill="#000000" stroke={C.gold} strokeWidth={3} />
            </g>
          ))
        ) : (
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Merger Burst Shockwave */}
            {postP < 0.95 && (
              <circle
                cx={0}
                cy={0}
                r={50 + postP * 330}
                fill="none"
                stroke="#ffffff"
                strokeWidth={10 * (1 - postP)}
                opacity={1 - postP}
                style={{ filter: svgGlow(C.gold, 12) }}
              />
            )}
            <circle cx={0} cy={0} r={78 + Math.sin(frame * 0.9) * (1 - postP) * 10} fill="url(#bhHalo)" />
            <circle cx={0} cy={0} r={42} fill="#000000" stroke={C.gold} strokeWidth={4} />
          </g>
        )}
      </g>

      <text x={cx} y={1004} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={24}>
        {rawP < 1 ? "ORBIT SHRINKS AS SPACETIME RIPPLES CARRY ENERGY AWAY" : "BLACK HOLES MERGED · ENERGY CARRIED OFF AS WAVES"}
      </text>

      {/* RIGHT PANEL: Live LIGO Chirp Oscilloscope + Real-Time Energy Ledger */}
      <rect x={1025} y={258} width={810} height={670} rx={26} fill="rgba(8,15,36,0.9)" stroke={C.gold} strokeWidth={3} />
      <text x={1065} y={310} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={25}>
        LIGO GRAVITATIONAL WAVE CHIRP (2015)
      </text>
      <text x={1065} y={344} fill={C.cyan} fontFamily={MONO} fontWeight={700} fontSize={20}>
        GW150914 · STRAIN WAVEFORM (INSPIRAL → MERGER → RINGDOWN)
      </text>

      {/* Oscilloscope Grid */}
      <rect x={1065} y={368} width={725} height={234} rx={14} fill="rgba(4,9,24,0.85)" stroke="rgba(62,224,255,0.28)" strokeWidth={2} />
      <line x1={1065} y1={485} x2={1790} y2={485} stroke="rgba(255,255,255,0.16)" strokeWidth={2} />
      {/* Merger vertical marker */}
      <line
        x1={1065 + mergerFrac * 725}
        y1={368}
        x2={1065 + mergerFrac * 725}
        y2={602}
        stroke={C.red}
        strokeWidth={2}
        strokeDasharray="6 6"
        opacity={0.75}
      />
      <text x={1065 + mergerFrac * 725} y={360} textAnchor="middle" fill={C.red} fontFamily={MONO} fontWeight={900} fontSize={16}>
        COLLISION
      </text>
      {ligoPts.length > 1 && (
        <polyline points={ligoPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={4} style={{ filter: svgGlow(C.cyan, 6) }} />
      )}

      {/* Real-Time Energy Conservation Bars Below Waveform */}
      <g transform="translate(1065, 642)">
        <text x={0} y={0} fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>
          BINARY ORBITAL ENERGY
        </text>
        <text x={725} y={0} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={21}>
          {orbitalPct}%
        </text>
        <rect x={0} y={12} width={725} height={28} rx={9} fill="rgba(255,255,255,0.08)" />
        <rect x={0} y={12} width={Math.max(12, (725 * orbitalPct) / 100)} height={28} rx={9} fill={C.gold} />

        <text x={0} y={84} fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          RADIATED GRAVITATIONAL WAVE ENERGY
        </text>
        <text x={725} y={84} textAnchor="end" fill={C.cyan} fontFamily={MONO} fontWeight={900} fontSize={21}>
          {radiatedPct}%
        </text>
        <rect x={0} y={96} width={725} height={28} rx={9} fill="rgba(255,255,255,0.08)" />
        <rect x={0} y={96} width={Math.max(12, (725 * radiatedPct) / 100)} height={28} rx={9} fill={C.cyan} />

        {/* Verdict */}
        <rect x={0} y={162} width={725} height={64} rx={14} fill="rgba(61,255,155,0.12)" stroke={C.green} strokeWidth={2.5} />
        <text x={362} y={203} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={900} fontSize={25}>
          ENERGY BILL PAID IN FULL · 100% CONSERVED ✓
        </text>
      </g>
    </svg>
  );
};

// ===========================================================================
// 7. ANIMATED PROTO-PLANETARY NEBULA COLLAPSE -> MOLTEN EARTH + CURVED BOWL
//    (Proactive Polish for Ch7 Beat 2: 8:45–9:01 — replaces static JPG!)
// ===========================================================================
export const NebulaCollapseAnimation: React.FC<{ startAt: number }> = ({ startAt }) => {
  const frame = useCurrentFrame();
  const collapseP = interpolate(frame, [startAt, startAt + 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 960;
  const cy = 535;

  const dust = React.useMemo(
    () =>
      new Array(54).fill(0).map((_, i) => ({
        angle0: random(`na${i}`) * Math.PI * 2,
        r0: 190 + random(`nr${i}`) * 540,
        speed: 0.015 + random(`ns${i}`) * 0.024,
        size: 3 + random(`nz${i}`) * 6,
        gold: i % 3 !== 0,
      })),
    [],
  );

  // Depth of spacetime curve deepens as stardust collapses into molten Earth!
  const wellDepth = 60 + collapseP * 230;
  const proj = (r: number, th: number): [number, number] => {
    const x = cx + Math.cos(th) * r;
    const dip = wellDepth / (1 + Math.pow(r / 190, 1.85));
    const y = cy + 95 + Math.sin(th) * (r * 0.3) + dip;
    return [x, y];
  };

  const coreR = 38 + collapseP * 64;

  return (
    <AbsoluteFill>
      {/* Subtle cinematic slowly zooming cosmic nebula backdrop */}
      <Img
        src={staticFile("gravity/nebula-collapse.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.3,
          transform: `scale(${1 + collapseP * 0.14})`,
        }}
      />

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="moltenEarth" cx="38%" cy="35%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="42%" stopColor="#f97316" />
            <stop offset="78%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
          <radialGradient id="nebulaAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#ea580c" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Live Deepening Spacetime Grid Beneath Collapsing Planet */}
        {[120, 210, 310, 420, 540, 670].map((r, k) => {
          const pts: string[] = [];
          for (let st = 0; st <= 64; st++) {
            const th = (st / 64) * Math.PI * 2;
            const [px, py] = proj(r, th);
            pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
          }
          return (
            <polyline
              key={`ng-${k}`}
              points={pts.join(" ")}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2}
              opacity={0.25 + collapseP * 0.35}
            />
          );
        })}

        {/* Spiraling Inward Stardust Particles Collapsing Under Gravity */}
        {dust.map((p, idx) => {
          const pull = (collapseP * 0.85 + ((frame * 0.008 + idx * 0.07) % 1) * 0.45) % 1;
          const r = Math.max(coreR + 6, p.r0 * (1 - pull * 0.88));
          const th = p.angle0 + frame * p.speed + pull * 2.8;
          const px = cx + Math.cos(th) * r;
          const py = cy + Math.sin(th) * (r * 0.42);
          return (
            <circle
              key={idx}
              cx={px}
              cy={py}
              r={p.size}
              fill={p.gold ? C.gold : C.cyan}
              opacity={Math.sin(pull * Math.PI) * 0.9}
              style={{ filter: svgGlow(p.gold ? C.gold : C.cyan, 4) }}
            />
          );
        })}

        {/* Blazing Molten Proto-Earth Core Forming at Center */}
        <circle cx={cx} cy={cy} r={coreR * 2.4} fill="url(#nebulaAura)" opacity={0.45 + collapseP * 0.55} />
        <circle
          cx={cx}
          cy={cy}
          r={coreR}
          fill="url(#moltenEarth)"
          stroke={C.gold}
          strokeWidth={3.5}
          style={{ filter: svgGlow(C.gold, 14) }}
        />

        {/* Expanding Thermal Heat Rings */}
        {[0, 1].map((i) => {
          const hp = (frame * 0.025 + i * 0.5) % 1;
          return (
            <circle
              key={`ht-${i}`}
              cx={cx}
              cy={cy}
              r={coreR + hp * 165}
              fill="none"
              stroke={C.red}
              strokeWidth={3 * (1 - hp)}
              opacity={(1 - hp) * 0.6 * collapseP}
            />
          );
        })}

        <text x={cx} y={cy + coreR + 58} textAnchor="middle" fill={C.gold} fontFamily={MONO} fontWeight={900} fontSize={26}>
          {collapseP < 0.45 ? "ANCIENT STARDUST COLLAPSING INWARD..." : "MOLTEN PROTO-EARTH FORGES SPACETIME WELL"}
        </text>
      </svg>

      {/* Compact Bottom Telemetry Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 140,
          right: 140,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 40px",
          borderRadius: 18,
          background: "rgba(8,15,36,0.9)",
          border: `2.5px solid ${C.gold}`,
          boxShadow: glow(C.gold, 10),
        }}
      >
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 25, color: C.gold }}>
          NEBULA POTENTIAL ENERGY → BLAZING CORE HEAT
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 900, fontSize: 25, color: C.cyan }}>
          SPACETIME CURVE LOCKED IN · 0 FUEL SINCE ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};
