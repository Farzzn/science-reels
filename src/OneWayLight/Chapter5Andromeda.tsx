import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { C, MONO, svgGlow } from "../FiveHundredMileEmail/theme";
import {
  CleanPortrait,
  CleanStage,
  KineticPunch,
  MinimalLabel,
} from "../CosmicSpeedLimit/ui";
import { makeOwlCue } from "./timing";
import {
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  SpiralGalaxy,
} from "./visuals";

// Sleek modern glowing walker silhouette (far cleaner than crude stick figures)
const SleekWalker: React.FC<{
  x: number;
  y: number;
  dir: 1 | -1;
  color: string;
  stride: number;
}> = ({ x, y, dir, color, stride }) => {
  const swing = Math.sin(stride) * 10;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Soft radial ground aura */}
      <ellipse cx={0} cy={14} rx={22} ry={5} fill={color} opacity={0.28} />
      {/* Back leg */}
      <path
        d={`M ${dir * 1},-16 Q ${dir * (-4 - swing * 0.6)},-2 ${dir * (-11 - swing)},13`}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* Front leg */}
      <path
        d={`M ${dir * 2},-16 Q ${dir * (6 + swing * 0.6)},-2 ${dir * (11 + swing)},13`}
        fill="none"
        stroke={color}
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      {/* Sleek capsule torso */}
      <path
        d={`M ${dir * -4},-44 C ${dir * 6},-45 ${dir * 10},-32 ${dir * 6},-15 L ${dir * -4},-15 C ${dir * -8},-29 ${dir * -8},-42 ${dir * -4},-44 Z`}
        fill={color}
        fillOpacity={0.88}
        stroke="#ffffff"
        strokeOpacity={0.35}
        strokeWidth={1.2}
        style={{ filter: svgGlow(color, 8) }}
      />
      {/* Forward arm */}
      <path
        d={`M ${dir * 3},-38 Q ${dir * (12 - swing * 0.45)},-28 ${dir * (16 - swing * 0.7)},-18`}
        fill="none"
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
        opacity={0.9}
      />
      {/* Glowing head */}
      <circle
        cx={dir * 2}
        cy={-56}
        r={10.5}
        fill="#ffffff"
        stroke={color}
        strokeWidth={3.5}
        style={{ filter: svgGlow(color, 10) }}
      />
      {/* Crisp double velocity chevrons */}
      {[0, 1].map((k) => {
        const cx = dir * (28 + k * 14);
        return (
          <polyline
            key={k}
            points={`${cx - dir * 6},-44 ${cx + dir * 2},-36 ${cx - dir * 6},-28`}
            fill="none"
            stroke={color}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.92 - k * 0.3}
            style={k === 0 ? { filter: svgGlow(color, 6) } : undefined}
          />
        );
      })}
    </g>
  );
};

// ===========================================================================
// Chapter 5 — The Andromeda Paradox (Roger Penrose · 1989)
// ===========================================================================
export const Chapter5Andromeda: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = makeOwlCue("ch5");
  const len = cue.len;

  const tExtend = cue("farther out you extend it");
  const tAndro = cue("Andromeda Galaxy");
  const tPenrose = cue("Roger Penrose");
  const tFriends = cue("two friends passing");
  const tMagnify = cue("magnifies across space");
  const tVote = cue("days before an alien council");
  const tWeekLater = cue("more than a week later");
  const tEightDays = cue("eight full days");

  // -------------------------------------------------------------------------
  // STAGE 1 (0 -> tPenrose): Living-Room 10m Tilt -> Lever Arm to Andromeda
  // Cleanly separated labels — ZERO overlap at 8:43 or any timestamp!
  // -------------------------------------------------------------------------
  const roomPrepP = easeInOutCubic(frame / Math.max(60, tExtend));
  const leverP = easeInOutCubic(
    (frame - tExtend) / Math.max(55, tPenrose - tExtend - 10),
  );
  const androPop = easeOutCubic((frame - tAndro) / 28);

  const lineEndX =
    frame < tExtend
      ? interpolate(roomPrepP, [0, 1], [360, 740])
      : interpolate(leverP, [0, 1], [740, 1550]);
  const lineEndY =
    frame < tExtend
      ? interpolate(roomPrepP, [0, 1], [650, 610])
      : interpolate(leverP, [0, 1], [610, 355]);
  const roomBoxOpacity = 1 - clamp01(leverP * 3.5);

  // -------------------------------------------------------------------------
  // STAGE 2 (tPenrose -> tFriends): Roger Penrose (1989) Portrait
  // -------------------------------------------------------------------------
  const penP = clamp01(
    (frame - tPenrose) / Math.max(40, tFriends - tPenrose),
  );

  // -------------------------------------------------------------------------
  // STAGE 3 (tFriends -> len): CINEMATIC 3D ANDROMEDA PARADOX
  // 3D receding spacetime grid + Earth horizon + sleek walkers + two wide
  // translucent 3D glowing glass "NOW" planes slicing Andromeda's time column
  // + animated Council Vote & Alien Fleet viewports + glowing 8-Day Rift!
  // -------------------------------------------------------------------------
  const s3Dur = Math.max(90, tEightDays - tFriends);
  const s3Prog = clamp01((frame - tFriends) / s3Dur);
  const walkStride = interpolate(s3Prog, [0, 1], [0, 22]);
  const w1X = interpolate(s3Prog, [0, 1], [238, 174]);
  const w2X = interpolate(s3Prog, [0, 1], [298, 362]);

  const magP = easeOutCubic(
    (frame - tMagnify) / Math.max(32, tVote - tMagnify),
  );
  const awayPlaneP = easeInOutCubic(
    (frame - tVote) / Math.max(45, (tWeekLater - tVote) * 0.62),
  );
  // Council viewport blooms open the exact instant the cyan glass plane slices Andromeda!
  const councilOpen = easeOutCubic((awayPlaneP - 0.78) / 0.22);

  const towardPlaneP = easeInOutCubic(
    (frame - tWeekLater) / Math.max(45, (tEightDays - tWeekLater) * 0.62),
  );
  // Armada viewport & 8-Day Rift ignite the exact instant the amber-gold plane slices Andromeda!
  const fleetOpen = easeOutCubic((towardPlaneP - 0.78) / 0.22);
  const armadaFly = clamp01((towardPlaneP - 0.78) / 0.22) * 0.35 + clamp01(
    (frame - (tWeekLater + (tEightDays - tWeekLater) * 0.5)) /
      Math.max(45, len - (tWeekLater + (tEightDays - tWeekLater) * 0.5)),
  ) * 0.65;
  const riftGlow = easeOutCubic((towardPlaneP - 0.84) / 0.16);

  // Kinetic Punch: 8 DAYS APART. (snappy 2.5s slam over live Stage 3!)
  const punchDur = Math.max(54, Math.min(84, len - tEightDays));

  // Helper endpoints for the two 3D translucent glass "NOW" ribbons
  const colX = 1430;
  const originX = 270;
  const originY = 540;
  const cyanEndX = originX + (colX - originX) * awayPlaneP;
  const cyanEndY = originY + (748 - originY) * awayPlaneP;
  const goldEndX = originX + (colX - originX) * towardPlaneP;
  const goldEndY = originY + (318 - originY) * towardPlaneP;

  return (
    <AbsoluteFill>
      {/* =================================================================== */}
      {/* STAGE 1: 10-Meter Room Tilt -> 2.5M Light-Year Cosmic Lever Arm     */}
      {/* =================================================================== */}
      <CleanStage from={0} to={tPenrose + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch5LeverGrad"
              gradientUnits="userSpaceOnUse"
              x1={290}
              y1={650}
              x2={1550}
              y2={355}
            >
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="55%" stopColor={C.gold} />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>
            <linearGradient
              id="ch5RoomFill"
              gradientUnits="userSpaceOnUse"
              x1={270}
              y1={490}
              x2={760}
              y2={690}
            >
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.14} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0.03} />
            </linearGradient>
          </defs>

          {/* Living Room 10-Meter Architectural Frame (fades smoothly as camera zooms out!) */}
          {roomBoxOpacity > 0.02 && (
            <g opacity={roomBoxOpacity}>
              <rect
                x={270}
                y={490}
                width={490}
                height={200}
                rx={14}
                fill="url(#ch5RoomFill)"
                stroke={C.cyan}
                strokeWidth={2}
                strokeOpacity={0.45}
                strokeDasharray="10 8"
              />
              <text
                x={515}
                y={470}
                textAnchor="middle"
                fill={C.cyan}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={22}
                letterSpacing={3}
                opacity={0.82}
              >
                LIVING ROOM · 10 METERS
              </text>
            </g>
          )}

          {/* Horizontal baseline across space */}
          <line
            x1={290}
            y1={650}
            x2={1600}
            y2={650}
            stroke={C.cyan}
            strokeWidth={2.4}
            strokeDasharray="12 12"
            opacity={0.34}
          />

          {/* Earth Anchor Dot + Clean Non-Overlapping Label ABOVE Earth */}
          <circle
            cx={290}
            cy={650}
            r={17}
            fill={C.cyan}
            style={{ filter: svgGlow(C.cyan, 14) }}
          />
          <text
            x={290}
            y={714}
            textAnchor="middle"
            fill={C.cyan}
            fontFamily={MONO}
            fontWeight={800}
            fontSize={24}
            letterSpacing={2}
          >
            EARTH
          </text>

          {/* Tilted Straight "NOW" Lever Arm extending across space */}
          <line
            x1={290}
            y1={650}
            x2={lineEndX}
            y2={lineEndY}
            stroke="url(#ch5LeverGrad)"
            strokeWidth={6}
            strokeLinecap="round"
            style={{ filter: svgGlow(C.gold, 12) }}
          />

          {/* Vertical Elevation Bar at Tip */}
          <line
            x1={lineEndX}
            y1={650}
            x2={lineEndX}
            y2={lineEndY}
            stroke={C.gold}
            strokeWidth={3.5}
            strokeDasharray="8 8"
          />
          <circle
            cx={lineEndX}
            cy={lineEndY}
            r={11}
            fill="#ffffff"
            style={{ filter: svgGlow(C.gold, 14) }}
          />

          {/* Clean Centered Distance / Tilt Readout Pill at Bottom (ZERO Collision!) */}
          <g transform="translate(960, 845)">
            <rect
              x={-350}
              y={-40}
              width={700}
              height={76}
              rx={18}
              fill="#071024"
              stroke={leverP > 0.45 ? "#e879f9" : C.gold}
              strokeWidth={2.6}
              style={{ filter: svgGlow(leverP > 0.45 ? "#c084fc" : C.gold, 10) }}
            />
            <text
              x={0}
              y={10}
              textAnchor="middle"
              fill={leverP > 0.45 ? "#f0abfc" : C.gold}
              fontFamily={MONO}
              fontWeight={800}
              fontSize={30}
              letterSpacing={2}
            >
              {leverP < 0.08
                ? "10 METERS  ·  Δt < 10⁻¹⁶ SECONDS"
                : leverP < 0.55
                  ? "EXTENDING LINE ACROSS SPACE..."
                  : "2.5 MILLION LIGHT-YEARS"}
            </text>
          </g>

          {/* Andromeda Galaxy blooms at the far upper-right */}
          <SpiralGalaxy
            cx={1550}
            cy={355}
            scale={0.78 + androPop * 0.48}
            rotation={-22 + leverP * 14}
            opacity={0.22 + androPop * 0.78}
          />
          {androPop > 0.15 && (
            <text
              x={1550}
              y={246}
              textAnchor="middle"
              fill="#f0abfc"
              fontFamily={MONO}
              fontWeight={800}
              fontSize={28}
              letterSpacing={2.5}
              opacity={androPop}
              style={{ filter: svgGlow("#c084fc", 10) }}
            >
              ANDROMEDA
            </text>
          )}
        </svg>

        <MinimalLabel
          text={
            leverP > 0.3
              ? "TINY ANGLE · MASSIVE LEVER ARM"
              : "ACROSS A ROOM: TINY TILT"
          }
          color={leverP > 0.3 ? "#e879f9" : C.cyan}
          x={960}
          y={94}
          size={42}
        />
      </CleanStage>

      {/* =================================================================== */}
      {/* STAGE 2: Roger Penrose (1989) Portrait                              */}
      {/* =================================================================== */}
      <CleanStage from={tPenrose} to={tFriends + 8}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 100,
            padding: "0 140px",
          }}
        >
          <CleanPortrait
            src="onewaylight/portraits/penrose.jpg"
            name="Roger Penrose"
            year="1989"
            credit="Festival della Scienza · CC BY-SA 2.0"
            accent="#e879f9"
            width={390}
            height={520}
            objectPosition="54% 18%"
          />

          <svg width={760} height={480} viewBox="0 0 760 480">
            <SpiralGalaxy
              cx={380}
              cy={205}
              scale={1.45 + penP * 0.15}
              rotation={-20 + penP * 16}
            />
            <text
              x={380}
              y={374}
              textAnchor="middle"
              fill={C.white}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={44}
              letterSpacing={3}
              style={{ filter: svgGlow("#c084fc", 12) }}
            >
              ANDROMEDA PARADOX
            </text>
            <text
              x={380}
              y={426}
              textAnchor="middle"
              fill="#f0abfc"
              fontFamily={MONO}
              fontWeight={700}
              fontSize={26}
              letterSpacing={2.5}
            >
              2.5 MILLION LIGHT-YEARS AWAY
            </text>
          </svg>
        </AbsoluteFill>
      </CleanStage>

      {/* =================================================================== */}
      {/* STAGE 3: CINEMATIC 3D ANDROMEDA PARADOX — Glass Planes & Viewports  */}
      {/* =================================================================== */}
      <CleanStage from={tFriends} to={len}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            {/* 3D Cosmic Perspective Floor Fade */}
            <linearGradient
              id="ch5GridFade"
              gradientUnits="userSpaceOnUse"
              x1={960}
              y1={640}
              x2={960}
              y2={1060}
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.04} />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.42} />
            </linearGradient>

            {/* Earth Horizon Arc Glow */}
            <linearGradient
              id="ch5EarthArc"
              gradientUnits="userSpaceOnUse"
              x1={270}
              y1={600}
              x2={270}
              y2={760}
            >
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#050a18" stopOpacity={0.02} />
            </linearGradient>

            {/* Andromeda 3D Spacetime Column Cylinder */}
            <linearGradient
              id="ch5TimeCol"
              gradientUnits="userSpaceOnUse"
              x1={1345}
              y1={540}
              x2={1515}
              y2={540}
            >
              <stop offset="0%" stopColor="#c084fc" stopOpacity={0.24} />
              <stop offset="50%" stopColor="#e879f9" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#c084fc" stopOpacity={0.26} />
            </linearGradient>

            {/* Cyan 3D Glass "NOW" Plane Ribbon */}
            <linearGradient
              id="ch5CyanGlass"
              gradientUnits="userSpaceOnUse"
              x1={270}
              y1={540}
              x2={1430}
              y2={750}
            >
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.48} />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.22} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0.54} />
            </linearGradient>

            {/* Gold-Crimson 3D Glass "NOW" Plane Ribbon */}
            <linearGradient
              id="ch5GoldGlass"
              gradientUnits="userSpaceOnUse"
              x1={270}
              y1={540}
              x2={1430}
              y2={315}
            >
              <stop offset="0%" stopColor={C.gold} stopOpacity={0.5} />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity={0.22} />
              <stop offset="100%" stopColor={C.red} stopOpacity={0.58} />
            </linearGradient>

            {/* 8-Day Temporal Rift Prism Gradient */}
            <linearGradient
              id="ch5RiftGrad"
              gradientUnits="userSpaceOnUse"
              x1={1430}
              y1={318}
              x2={1430}
              y2={748}
            >
              <stop offset="0%" stopColor={C.red} stopOpacity={0.34} />
              <stop offset="50%" stopColor="#c084fc" stopOpacity={0.14} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0.34} />
            </linearGradient>
          </defs>

          {/* 1. RECEDING 3D COSMIC PERSPECTIVE GRID FLOOR */}
          <g opacity={0.55}>
            {/* Perspective radiating longitude lines */}
            {Array.from({ length: 13 }).map((_, i) => {
              const t = (i - 6) / 6;
              const xTop = 960 + t * 520;
              const xBot = 960 + t * 1380;
              return (
                <line
                  key={`lon${i}`}
                  x1={xTop}
                  y1={670}
                  x2={xBot}
                  y2={1080}
                  stroke="url(#ch5GridFade)"
                  strokeWidth={1.5}
                />
              );
            })}
            {/* Perspective receding latitude lines */}
            {[0, 0.14, 0.32, 0.54, 0.8, 1].map((k, i) => {
              const y = 670 + k * 390 + s3Prog * 14;
              return (
                <line
                  key={`lat${i}`}
                  x1={80}
                  y1={y}
                  x2={1840}
                  y2={y}
                  stroke="#38bdf8"
                  strokeWidth={1.3}
                  opacity={0.12 + k * 0.24}
                />
              );
            })}
          </g>

          {/* 2. COSMIC DISTANCE SPAN MARKER (illuminates cleanly at tMagnify) */}
          <g opacity={0.35 + 0.65 * magP}>
            <line
              x1={470}
              y1={912}
              x2={1340}
              y2={912}
              stroke="#a5b4fc"
              strokeWidth={2}
              strokeDasharray="10 10"
            />
            <line x1={470} y1={898} x2={470} y2={926} stroke="#a5b4fc" strokeWidth={2.5} />
            <line x1={1340} y1={898} x2={1340} y2={926} stroke="#a5b4fc" strokeWidth={2.5} />
            <text
              x={905}
              y={952}
              textAnchor="middle"
              fill="#c4b5fd"
              fontFamily={MONO}
              fontWeight={800}
              fontSize={24}
              letterSpacing={3.5}
            >
              2.5 MILLION LIGHT-YEARS
            </text>
          </g>

          {/* 3. LEFT FOREGROUND — EARTH CURVED SIDEWALK HORIZON & SLEEK WALKERS */}
          <g>
            {/* Glowing curved Earth horizon */}
            <path
              d="M 60,675 Q 270,582 480,675 L 480,765 L 60,765 Z"
              fill="url(#ch5EarthArc)"
            />
            <path
              d="M 70,668 Q 270,584 470,668"
              fill="none"
              stroke={C.cyan}
              strokeWidth={3.5}
              style={{ filter: svgGlow(C.cyan, 10) }}
            />
            {/* Sleek Walkers passing each other */}
            <SleekWalker
              x={w1X}
              y={612}
              dir={-1}
              color={C.cyan}
              stride={walkStride}
            />
            <SleekWalker
              x={w2X}
              y={612}
              dir={1}
              color={C.gold}
              stride={walkStride + 2.4}
            />
            {/* Clean non-overlapping walker labels below Earth arc */}
            <text
              x={168}
              y={696}
              textAnchor="middle"
              fill={C.cyan}
              fontFamily={MONO}
              fontWeight={800}
              fontSize={20}
              letterSpacing={1.5}
            >
              ← AWAY
            </text>
            <text
              x={372}
              y={696}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={800}
              fontSize={20}
              letterSpacing={1.5}
            >
              TOWARD →
            </text>
            <text
              x={270}
              y={740}
              textAnchor="middle"
              fill={C.dim}
              fontFamily={MONO}
              fontWeight={700}
              fontSize={20}
              letterSpacing={2.2}
            >
              EARTH · 5 KM/H
            </text>
          </g>

          {/* 4. RIGHT HERO — 3D ANDROMEDA SPACETIME COLUMN ("TIME LOAF") */}
          <g>
            {/* Subtle luminous galaxy embedded inside the spacetime column */}
            <SpiralGalaxy
              cx={colX}
              cy={535}
              scale={1.32}
              rotation={-22 + s3Prog * 14}
              opacity={0.78}
            />

            {/* Translucent 3D Vertical Glass Cylinder (Andromeda's World-Tube across Days!) */}
            <rect
              x={colX - 82}
              y={220}
              width={164}
              height={630}
              fill="url(#ch5TimeCol)"
              stroke="#c084fc"
              strokeOpacity={0.36}
              strokeWidth={2}
            />
            {/* Top & bottom 3D cylinder ellipse caps */}
            <ellipse
              cx={colX}
              cy={220}
              rx={82}
              ry={22}
              fill="#1e1136"
              fillOpacity={0.5}
              stroke="#e879f9"
              strokeWidth={2.5}
            />
            <ellipse
              cx={colX}
              cy={850}
              rx={82}
              ry={22}
              fill="none"
              stroke="#c084fc"
              strokeOpacity={0.45}
              strokeWidth={2}
            />
            {/* Subtle horizontal daily time-slice rings */}
            {[290, 360, 430, 500, 570, 640, 710, 780].map((ry, i) => (
              <ellipse
                key={i}
                cx={colX}
                cy={ry}
                rx={82}
                ry={18}
                fill="none"
                stroke="#e879f9"
                strokeOpacity={0.14}
                strokeWidth={1.2}
              />
            ))}

            {/* 8-Day Temporal Rift Prism Shading between the two slices */}
            {riftGlow > 0.02 && (
              <rect
                x={colX - 80}
                y={318}
                width={160}
                height={430}
                fill="url(#ch5RiftGrad)"
                opacity={riftGlow}
              />
            )}

            {/* Vertical Time Arrow Header */}
            <text
              x={colX}
              y={184}
              textAnchor="middle"
              fill="#f0abfc"
              fontFamily={MONO}
              fontWeight={900}
              fontSize={24}
              letterSpacing={2.5}
              style={{ filter: svgGlow("#c084fc", 8) }}
            >
              ANDROMEDA TIME ↑
            </text>

            {/* Event Slice 1 inside column: COUNCIL VOTE (y=680) */}
            <ellipse
              cx={colX}
              cy={680}
              rx={84}
              ry={20}
              fill={C.cyan}
              fillOpacity={0.18}
              stroke={C.cyan}
              strokeWidth={3}
              style={{ filter: svgGlow(C.cyan, 8) }}
            />
            <text
              x={colX}
              y={687}
              textAnchor="middle"
              fill="#ffffff"
              fontFamily={MONO}
              fontWeight={800}
              fontSize={18}
              letterSpacing={1.4}
            >
              COUNCIL VOTE
            </text>

            {/* Event Slice 2 inside column: FLEET LAUNCH (y=388) */}
            <ellipse
              cx={colX}
              cy={388}
              rx={84}
              ry={20}
              fill={C.red}
              fillOpacity={0.22}
              stroke={C.gold}
              strokeWidth={3}
              style={{ filter: svgGlow(C.gold, 8) }}
            />
            <text
              x={colX}
              y={395}
              textAnchor="middle"
              fill="#ffffff"
              fontFamily={MONO}
              fontWeight={800}
              fontSize={18}
              letterSpacing={1.4}
            >
              FLEET LAUNCH
            </text>
          </g>

          {/* 5. WALKER A'S 3D TRANSLUCENT CYAN GLASS "NOW" PLANE (Slices BELOW Council Vote!) */}
          {awayPlaneP > 0.01 && (
            <g>
              {/* 3D Perspective Glass Ribbon Polygon (tapers cleanly with distance!) */}
              <polygon
                points={`${originX - 16},${originY - 8} ${cyanEndX - (16 + 34 * awayPlaneP)},${cyanEndY - (8 + 14 * awayPlaneP)} ${cyanEndX + (16 + 34 * awayPlaneP)},${cyanEndY + (8 + 14 * awayPlaneP)} ${originX + 16},${originY + 8}`}
                fill="url(#ch5CyanGlass)"
                stroke={C.cyan}
                strokeWidth={3.2}
                style={{ filter: svgGlow(C.cyan, 10) }}
              />
              {/* Center glowing spine ray */}
              <line
                x1={originX}
                y1={originY}
                x2={cyanEndX}
                y2={cyanEndY}
                stroke="#e0f2fe"
                strokeWidth={2.5}
                opacity={0.9}
              />
              {/* Glowing intersection ring where cyan plane slices Andromeda's column */}
              {awayPlaneP > 0.85 && (
                <ellipse
                  cx={colX}
                  cy={748}
                  rx={88}
                  ry={22}
                  fill={C.cyan}
                  fillOpacity={0.3}
                  stroke="#ffffff"
                  strokeWidth={3.5}
                  style={{ filter: svgGlow(C.cyan, 14) }}
                />
              )}
            </g>
          )}

          {/* 6. WALKER B'S 3D TRANSLUCENT AMBER-GOLD GLASS "NOW" PLANE (Slices ABOVE Fleet Launch!) */}
          {towardPlaneP > 0.01 && (
            <g>
              {/* 3D Perspective Glass Ribbon Polygon (tapers cleanly with distance!) */}
              <polygon
                points={`${originX - 16},${originY - 8} ${goldEndX - (16 + 34 * towardPlaneP)},${goldEndY - (8 + 14 * towardPlaneP)} ${goldEndX + (16 + 34 * towardPlaneP)},${goldEndY + (8 + 14 * towardPlaneP)} ${originX + 16},${originY + 8}`}
                fill="url(#ch5GoldGlass)"
                stroke={C.gold}
                strokeWidth={3.2}
                style={{ filter: svgGlow(C.gold, 12) }}
              />
              {/* Center glowing spine ray */}
              <line
                x1={originX}
                y1={originY}
                x2={goldEndX}
                y2={goldEndY}
                stroke="#fef3c7"
                strokeWidth={2.5}
                opacity={0.92}
              />
              {/* Glowing intersection ring where gold plane slices Andromeda's column */}
              {towardPlaneP > 0.85 && (
                <ellipse
                  cx={colX}
                  cy={318}
                  rx={88}
                  ry={22}
                  fill={C.gold}
                  fillOpacity={0.34}
                  stroke="#ffffff"
                  strokeWidth={3.5}
                  style={{ filter: svgGlow(C.gold, 14) }}
                />
              )}
            </g>
          )}

          {/* Central Earth Pivot Glowing Event Node */}
          <circle
            cx={originX}
            cy={originY}
            r={9}
            fill="#ffffff"
            style={{ filter: svgGlow(C.gold, 14) }}
          />

          {/* 7. FLOATING HOLOGRAPHIC VIEWPORT 1 (BOTTOM-RIGHT): ALIEN COUNCIL — UNDECIDED */}
          {councilOpen > 0.02 && (
            <g
              transform={`translate(1730, 748) scale(${0.7 + 0.3 * councilOpen})`}
              opacity={councilOpen}
            >
              {/* Leader connector from column slice */}
              <line
                x1={-210}
                y1={0}
                x2={-114}
                y2={0}
                stroke={C.cyan}
                strokeWidth={2.5}
                strokeDasharray="6 6"
              />
              <circle
                cx={0}
                cy={0}
                r={110}
                fill="#071226"
                stroke={C.cyan}
                strokeWidth={3.5}
                style={{ filter: svgGlow(C.cyan, 14) }}
              />
              {/* Council Chamber Table + 6 Orbiting Delegate Nodes */}
              <circle
                cx={0}
                cy={0}
                r={52}
                fill="none"
                stroke={C.cyan}
                strokeWidth={2}
                strokeDasharray="8 8"
                opacity={0.65}
              />
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = ((deg + s3Prog * 28) * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={Math.cos(rad) * 66}
                    cy={Math.sin(rad) * 66}
                    r={9}
                    fill={C.cyan}
                    opacity={0.85}
                  />
                );
              })}
              <text
                x={0}
                y={16}
                textAnchor="middle"
                fill="#ffffff"
                fontFamily={MONO}
                fontWeight={900}
                fontSize={48}
                style={{ filter: svgGlow(C.cyan, 8) }}
              >
                ?
              </text>
              <text
                x={0}
                y={144}
                textAnchor="middle"
                fill={C.cyan}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={22}
                letterSpacing={1.5}
              >
                BEFORE VOTE
              </text>
            </g>
          )}

          {/* 8. FLOATING HOLOGRAPHIC VIEWPORT 2 (TOP-RIGHT): ALIEN ARMADA ALREADY LAUNCHED! */}
          {fleetOpen > 0.02 && (
            <g
              transform={`translate(1730, 318) scale(${0.7 + 0.3 * fleetOpen})`}
              opacity={fleetOpen}
            >
              {/* Leader connector from column slice */}
              <line
                x1={-210}
                y1={0}
                x2={-114}
                y2={0}
                stroke={C.gold}
                strokeWidth={2.5}
                strokeDasharray="6 6"
              />
              <circle
                cx={0}
                cy={0}
                r={110}
                fill="#160a18"
                stroke={C.gold}
                strokeWidth={3.5}
                style={{ filter: svgGlow(C.gold, 14) }}
              />
              {/* 5 Sleek Glowing Invasion Starships flying leftward in formation */}
              {[
                { ox: -16, oy: 0, s: 1.15 },
                { ox: 14, oy: -32, s: 0.92 },
                { ox: 14, oy: 32, s: 0.92 },
                { ox: 42, oy: -56, s: 0.78 },
                { ox: 42, oy: 56, s: 0.78 },
              ].map((sh, i) => {
                const sx = sh.ox + 26 - armadaFly * 46;
                return (
                  <g
                    key={i}
                    transform={`translate(${sx}, ${sh.oy}) scale(${sh.s})`}
                  >
                    {/* Blazing crimson-gold ion trail */}
                    <line
                      x1={10}
                      y1={0}
                      x2={44}
                      y2={0}
                      stroke={C.red}
                      strokeWidth={4.5}
                      strokeLinecap="round"
                      opacity={0.82}
                      style={{ filter: svgGlow(C.red, 8) }}
                    />
                    {/* Sleek triangular starship hull */}
                    <polygon
                      points="-16,0 12,-9 6,0 12,9"
                      fill="#fef08a"
                      stroke={C.gold}
                      strokeWidth={1.5}
                      style={{ filter: svgGlow(C.gold, 8) }}
                    />
                  </g>
                );
              })}
              <text
                x={0}
                y={-126}
                textAnchor="middle"
                fill={C.gold}
                fontFamily={MONO}
                fontWeight={900}
                fontSize={22}
                letterSpacing={1.5}
              >
                FLEET LAUNCHED!
              </text>
            </g>
          )}

          {/* 9. BOLD "≈ 8 DAYS APART" TEMPORAL GAP BRACKET (Clean Open Space!) */}
          {riftGlow > 0.05 && (
            <g opacity={riftGlow}>
              <line
                x1={1292}
                y1={332}
                x2={1292}
                y2={734}
                stroke="#ffffff"
                strokeWidth={3}
                strokeDasharray="8 8"
              />
              <polyline
                points="1282,348 1292,328 1302,348"
                fill="none"
                stroke={C.gold}
                strokeWidth={3}
              />
              <polyline
                points="1282,718 1292,738 1302,718"
                fill="none"
                stroke={C.cyan}
                strokeWidth={3}
              />
              <rect
                x={1068}
                y={502}
                width={206}
                height={62}
                rx={14}
                fill="#071024"
                stroke={C.gold}
                strokeWidth={3}
                style={{ filter: svgGlow(C.gold, 12) }}
              />
              <text
                x={1171}
                y={544}
                textAnchor="middle"
                fill={C.gold}
                fontFamily={MONO}
                fontWeight={900}
                fontSize={30}
                letterSpacing={1.5}
              >
                ≈ 8 DAYS
              </text>
            </g>
          )}
        </svg>

        <MinimalLabel
          text={
            towardPlaneP > 0.15
              ? "SAME SIDEWALK · OPPOSITE REALITIES"
              : awayPlaneP > 0.15
                ? "WALKING AWAY → DAYS BEFORE VOTE"
                : magP > 0.2
                  ? "WALKING SPEED → DAYS AT ANDROMEDA"
                  : "TWO FRIENDS PASSING BY"
          }
          color={towardPlaneP > 0.15 ? C.gold : C.cyan}
          x={960}
          y={76}
          size={40}
        />
      </CleanStage>

      {/* KINETIC PUNCH: 8 DAYS APART. */}
      <Sequence from={tEightDays} durationInFrames={punchDur}>
        <KineticPunch
          word="8 DAYS APART."
          sub="SAME SIDEWALK · DIFFERENT PRESENT"
          color={C.gold}
          accent="burst"
          size={150}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
