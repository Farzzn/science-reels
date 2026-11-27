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
  MinimalClock,
  PhotonPacket,
} from "./visuals";

// ===========================================================================
// Chapter 3 — Einstein's 1905 Rule (By Definition + Reichenbach ε Dial)
// ===========================================================================
export const Chapter3Einstein: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = makeOwlCue("ch3");
  const len = cue.len;

  const tDidnt = cue("He didn't");
  const tReadWords = cue("Read his original words");
  const tNotFact = cue("not a physical fact");
  const tByDef = cue("by definition");
  const tRule = cue("Here is Einstein's rule");
  const tHalfway = cue("exact halfway mark");
  const tReichenbach = cue("Hans Reichenbach");
  const tTurnDial = cue("Turn that dial toward one");
  const tConvention = cue("It is a convention");
  const tPickRule = cue("pick Einstein's clean halfway rule");
  const tSameTime = cue("at the same time");

  // Stage 1a: Albert Einstein 1905 Portrait (0 -> tReadWords)
  const s1Prog = clamp01(frame / Math.max(40, tReadWords));
  const didntPop = clamp01((frame - tDidnt) / 20);

  // Stage 1b: 1905 Printed Scientific Paper with Live Highlighter & "by definition" Ink Underline (tReadWords -> tRule)
  const paperDur = Math.max(60, tRule - tReadWords);
  const paperZoom = interpolate(
    frame,
    [tReadWords, tRule],
    [0.95, 1.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const paperRot = interpolate(
    frame,
    [tReadWords, tRule],
    [-1.6, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const hlLine1 = easeOutCubic((frame - (tReadWords + 18)) / 42);
  const hlLine2 = easeOutCubic((frame - tNotFact) / 36);
  const hlLine3 = easeOutCubic((frame - (tNotFact + 38)) / 36);
  const byDefInk = easeOutCubic((frame - tByDef) / Math.max(24, tRule - tByDef - 8));
  const paperDriftY = interpolate(
    frame,
    [tReadWords, tRule],
    [22, -16],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  void paperDur;

  // Stage 2: Einstein's Halfway Rule diagram (tRule -> tReichenbach)
  const ruleOutP = easeInOutCubic(
    (frame - tRule) / Math.max(36, (tHalfway - tRule) * 0.55),
  );
  const ruleBackP = easeInOutCubic(
    (frame - (tRule + (tHalfway - tRule) * 0.52)) /
      Math.max(36, (tHalfway - tRule) * 0.55),
  );
  const bisectP = easeOutCubic(
    (frame - tHalfway) / Math.max(36, tReichenbach - tHalfway),
  );

  // Stage 3: Reichenbach's Continuous ε Dial (tReichenbach -> tSameTime)
  // Continuously animated across every single second (zero static holds!):
  const introNudge = easeInOutCubic(
    (frame - tReichenbach) / Math.max(40, tTurnDial - tReichenbach),
  );
  const sweepUp = easeInOutCubic(
    (frame - tTurnDial) / Math.max(50, tConvention - tTurnDial),
  );
  const convDrift = easeInOutCubic(
    (frame - tConvention) / Math.max(40, tPickRule - tConvention),
  );
  const snapBack = easeInOutCubic(
    (frame - tPickRule) / Math.max(40, tSameTime - tPickRule - 6),
  );
  const eps = 0.5 + introNudge * 0.04 + sweepUp * 0.38 - convDrift * 0.08 - snapBack * 0.34;
  const outMin = 20 * eps;
  const backMin = 20 * (1 - eps);
  const dialX = interpolate(eps, [0.05, 0.95], [460, 1460]);
  const s3Zoom = interpolate(
    frame,
    [tReichenbach, Math.max(tReichenbach + 60, tSameTime)],
    [0.97, 1.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Kinetic Punch 2: AGREED? (tSameTime -> len, exact fit without spilling)
  const punch2Dur = Math.max(30, len - tSameTime);

  return (
    <AbsoluteFill>
      {/* STAGE 1A: Albert Einstein 1905 Portrait (0 -> tReadWords) */}
      <CleanStage from={0} to={tReadWords + 10}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 96,
            padding: "0 130px",
          }}
        >
          <CleanPortrait
            src="onewaylight/portraits/einstein.jpg"
            name="Albert Einstein"
            year="1905"
            credit="Ferdinand Schmutzer · 1921 (Public Domain)"
            accent={C.gold}
            width={390}
            height={520}
            objectPosition="56% 18%"
          />

          <div style={{ width: 760 }}>
            <svg width={760} height={460} viewBox="0 0 760 460">
              <rect
                x={30}
                y={30}
                width={700}
                height={400}
                rx={24}
                fill="#071024"
                stroke={C.gold}
                strokeWidth={2.5}
                opacity={0.92}
                style={{ filter: svgGlow(C.gold, 8) }}
              />
              <text
                x={380}
                y={104}
                textAnchor="middle"
                fill={C.gold}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={28}
                letterSpacing={3}
              >
                SPECIAL RELATIVITY · PAGE 2
              </text>
              <line
                x1={110}
                y1={134}
                x2={110 + 540 * s1Prog}
                y2={134}
                stroke={C.gold}
                strokeWidth={2.5}
                opacity={0.65}
              />

              <text
                x={380}
                y={228}
                textAnchor="middle"
                fill={C.white}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={44}
              >
                t(A → B) = t(B → A)
              </text>

              {didntPop > 0.02 && (
                <g opacity={didntPop}>
                  <text
                    x={380}
                    y={324}
                    textAnchor="middle"
                    fill={C.red}
                    fontFamily={MONO}
                    fontWeight={800}
                    fontSize={36}
                    letterSpacing={2.5}
                    style={{ filter: svgGlow(C.red, 10) }}
                  >
                    NOT PROVEN ✕
                  </text>
                </g>
              )}
            </svg>
          </div>
        </AbsoluteFill>
      </CleanStage>

      {/* STAGE 1B: Authentic 1905 Printed Science Paper + Live Highlighter & Ink Underline (tReadWords -> tRule) */}
      <CleanStage from={tReadWords} to={tRule + 10}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 1260,
              height: 840,
              borderRadius: 10,
              background:
                "radial-gradient(ellipse at 50% 44%, #f8f1e1 0%, #eee2c6 62%, #dfd0ad 100%)",
              boxShadow:
                "0 36px 96px rgba(0, 0, 0, 0.92), 0 0 0 1px rgba(255, 244, 214, 0.25), inset 0 0 90px rgba(139, 104, 52, 0.22)",
              transform: `translateY(${paperDriftY}px) scale(${paperZoom}) rotate(${paperRot}deg)`,
              padding: "56px 92px",
              position: "relative",
              overflow: "hidden",
              color: "#1f1912",
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
            }}
          >
            {/* Subtle aged-paper horizontal fiber lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(110, 82, 42, 0.028) 0px, rgba(110, 82, 42, 0.028) 1px, transparent 1px, transparent 5px)",
                pointerEvents: "none",
              }}
            />

            {/* Top Journal Masthead */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "2px solid rgba(46, 35, 22, 0.48)",
                paddingBottom: 14,
                marginBottom: 30,
                letterSpacing: 2.2,
                fontSize: 18,
                color: "#4a3b29",
                textTransform: "uppercase",
              }}
            >
              <span>Annalen der Physik · Band 17</span>
              <span style={{ fontWeight: 700 }}>A. Einstein · 1905</span>
              <span>p. 894</span>
            </div>

            {/* Paper Title & Section */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  color: "#1b150e",
                }}
              >
                On the Electrodynamics of Moving Bodies
              </div>
              <div
                style={{
                  fontSize: 21,
                  fontStyle: "italic",
                  color: "#524230",
                  marginTop: 8,
                }}
              >
                § 1. Definition of Simultaneity
              </div>
            </div>

            {/* Faint preceding context line */}
            <p
              style={{
                fontSize: 22,
                lineHeight: 1.55,
                color: "rgba(38, 30, 20, 0.42)",
                marginBottom: 24,
                textAlign: "justify",
              }}
            >
              If at the point A of space there is a clock, an observer at A can determine
              the time values of events in the immediate proximity of A. We have thus far
              defined only an &ldquo;A time&rdquo; and a &ldquo;B time,&rdquo; not a common
              &ldquo;time&rdquo; for A and B...
            </p>

            {/* HERO HIGHLIGHTED QUOTE BLOCK */}
            <div
              style={{
                position: "relative",
                fontSize: 29,
                lineHeight: 1.7,
                color: "#14100b",
                fontWeight: 400,
                padding: "20px 28px",
                borderLeft: "4px solid rgba(168, 42, 34, 0.72)",
                background: "rgba(180, 140, 74, 0.08)",
              }}
            >
              <div>
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(251, 191, 36, 0.46) 0%, rgba(251, 191, 36, 0.46) 100%)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${Math.round(hlLine1 * 100)}% 82%`,
                    backgroundPosition: "0 75%",
                    padding: "2px 4px",
                  }}
                >
                  &ldquo;That light requires the same time to travel from{" "}
                  <i>A</i> to <i>B</i> as from <i>B</i> to <i>A</i>
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(251, 191, 36, 0.46) 0%, rgba(251, 191, 36, 0.46) 100%)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${Math.round(hlLine2 * 100)}% 82%`,
                    backgroundPosition: "0 75%",
                    padding: "2px 4px",
                  }}
                >
                  is <b>not a physical fact</b> we can prove about nature &mdash;
                </span>
              </div>
              <div style={{ marginTop: 6 }}>
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(251, 191, 36, 0.42) 0%, rgba(251, 191, 36, 0.42) 100%)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${Math.round(hlLine3 * 100)}% 82%`,
                    backgroundPosition: "0 75%",
                    padding: "2px 4px",
                  }}
                >
                  it is a stipulation we establish{" "}
                </span>
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                    fontWeight: 700,
                    color: byDefInk > 0.1 ? "#991b1b" : "#14100b",
                    padding: "0 4px",
                  }}
                >
                  by definition.&rdquo;
                  {/* Crisp animated crimson fountain-pen underline */}
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: -4,
                      height: 5,
                      width: `${Math.round(byDefInk * 100)}%`,
                      borderRadius: 3,
                      backgroundColor: "#b91c1c",
                      boxShadow: "0 0 10px rgba(185, 28, 28, 0.45)",
                    }}
                  />
                </span>
              </div>
            </div>

            {/* Printed Equation Margin Note */}
            <div
              style={{
                marginTop: 34,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "rgba(38, 30, 20, 0.62)",
                fontSize: 24,
                fontStyle: "italic",
              }}
            >
              <span>
                <i>t</i><sub>B</sub> &minus; <i>t</i><sub>A</sub> = <i>t</i>&prime;<sub>A</sub> &minus; <i>t</i><sub>B</sub>
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontStyle: "normal",
                  fontSize: 16,
                  letterSpacing: 2,
                  color: "#7c2d12",
                  opacity: 0.45 + 0.55 * byDefInk,
                }}
              >
                STIPULATION · NOT MEASUREMENT
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </CleanStage>

      {/* STAGE 2: Einstein's Halfway Synchronization Rule */}
      <CleanStage from={tRule} to={tReichenbach + 8}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <MinimalClock
            cx={400}
            cy={460}
            r={104}
            hours={12}
            minutes={0}
            seconds={ruleOutP * 10 + ruleBackP * 10}
            color={C.cyan}
            label="CLOCK A"
            sub="t_A  →  t'_A"
          />
          <MinimalClock
            cx={1520}
            cy={460}
            r={104}
            hours={12}
            minutes={0}
            seconds={10}
            color={bisectP > 0.2 ? C.gold : C.cyan}
            label="CLOCK B"
            sub="SET AT MIDPOINT"
          />

          {ruleOutP > 0.01 && ruleBackP < 0.02 && (
            <PhotonPacket
              id="ch3RuleOut"
              x1={515}
              y1={435}
              x2={1405}
              y2={435}
              progress={ruleOutP}
              color={C.cyan}
              label="SEND"
            />
          )}
          {ruleBackP > 0.01 && (
            <PhotonPacket
              id="ch3RuleBack"
              x1={1405}
              y1={488}
              x2={515}
              y2={488}
              progress={ruleBackP}
              color={C.gold}
              label="BOUNCE BACK"
            />
          )}

          {/* Round-trip timeline bar bisected cleanly at exact midpoint */}
          <g transform="translate(0, 770)">
            <rect
              x={380}
              y={-18}
              width={1160}
              height={36}
              rx={18}
              fill="#0c1c3d"
              stroke={C.cyan}
              strokeWidth={2.5}
            />
            <rect
              x={380}
              y={-18}
              width={580 * Math.max(0.05, bisectP)}
              height={36}
              rx={18}
              fill={C.cyan}
              opacity={0.45}
            />
            <rect
              x={960}
              y={-18}
              width={580 * Math.max(0.05, bisectP)}
              height={36}
              rx={18}
              fill={C.gold}
              opacity={0.45}
            />
            {/* Midpoint glowing marker */}
            <line
              x1={960}
              y1={-56 - bisectP * 18}
              x2={960}
              y2={56 + bisectP * 18}
              stroke="#ffffff"
              strokeWidth={5}
              strokeLinecap="round"
              style={{ filter: svgGlow(C.gold, 14) }}
              opacity={0.25 + 0.75 * bisectP}
            />
            <text
              x={960}
              y={114}
              textAnchor="middle"
              fill={C.gold}
              fontFamily={MONO}
              fontWeight={900}
              fontSize={38}
              opacity={bisectP}
              style={{ filter: svgGlow(C.gold, 10) }}
            >
              t_B = ½ (t_A + t&apos;_A)
            </text>
          </g>
        </svg>

        <MinimalLabel
          text="EINSTEIN'S HALFWAY RULE"
          color={C.gold}
          x={960}
          y={104}
          size={44}
        />
      </CleanStage>

      {/* STAGE 3: Reichenbach's Continuous ε Dial */}
      <CleanStage from={tReichenbach} to={tSameTime + 6}>
        <AbsoluteFill style={{ transform: `scale(${s3Zoom})`, transformOrigin: "50% 52%" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <linearGradient
              id="ch3DialTrack"
              gradientUnits="userSpaceOnUse"
              x1={460}
              y1={360}
              x2={1460}
              y2={360}
            >
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="50%" stopColor={C.gold} />
              <stop offset="100%" stopColor={C.red} />
            </linearGradient>
          </defs>

          {/* Continuous ε Slider Dial */}
          <line
            x1={460}
            y1={360}
            x2={1460}
            y2={360}
            stroke="url(#ch3DialTrack)"
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* Tick marks at 0, 0.5, 1 */}
          {[
            { x: 460, lbl: "ε → 0" },
            { x: 960, lbl: "ε = 0.5 (EINSTEIN)" },
            { x: 1460, lbl: "ε → 1" },
          ].map((tk, i) => (
            <g key={i}>
              <line
                x1={tk.x}
                y1={335}
                x2={tk.x}
                y2={385}
                stroke={C.white}
                strokeWidth={3}
                opacity={0.7}
              />
              <text
                x={tk.x}
                y={308}
                textAnchor="middle"
                fill={i === 1 ? C.gold : C.dim}
                fontFamily={MONO}
                fontWeight={700}
                fontSize={22}
              >
                {tk.lbl}
              </text>
            </g>
          ))}

          {/* Moving Dial Knob */}
          <circle
            cx={dialX}
            cy={360}
            r={28}
            fill="#ffffff"
            stroke={C.gold}
            strokeWidth={5}
            style={{ filter: svgGlow(C.gold, 16) }}
          />
          <text
            x={dialX}
            y={438}
            textAnchor="middle"
            fill={C.white}
            fontFamily={MONO}
            fontWeight={900}
            fontSize={36}
          >
            {`ε = ${eps.toFixed(2)}`}
          </text>

          {/* Split Outbound / Inbound Travel Time Bars reacting LIVE to ε */}
          <g transform="translate(0, 585)">
            <rect
              x={360}
              y={0}
              width={1200 * eps}
              height={76}
              rx={14}
              fill={C.red}
              fillOpacity={0.35}
              stroke={C.red}
              strokeWidth={3}
            />
            <text
              x={360 + 600 * eps}
              y={48}
              textAnchor="middle"
              fill={C.white}
              fontFamily={MONO}
              fontWeight={800}
              fontSize={28}
            >
              {`OUT: ${outMin.toFixed(1)} MIN`}
            </text>

            <rect
              x={360 + 1200 * eps + 10}
              y={0}
              width={Math.max(12, 1200 * (1 - eps) - 10)}
              height={76}
              rx={14}
              fill={C.cyan}
              fillOpacity={0.35}
              stroke={C.cyan}
              strokeWidth={3}
            />
            {1 - eps > 0.08 && (
              <text
                x={360 + 1200 * eps + 5 + 600 * (1 - eps)}
                y={48}
                textAnchor="middle"
                fill={C.white}
                fontFamily={MONO}
                fontWeight={800}
                fontSize={1 - eps > 0.18 ? 26 : 22}
              >
                {1 - eps > 0.2 ? `BACK: ${backMin.toFixed(1)}m` : `${backMin.toFixed(1)}m`}
              </text>
            )}
          </g>

          {/* Rock-steady unchanged round-trip indicator */}
          <g transform="translate(960, 810)">
            <rect
              x={-450}
              y={-46}
              width={900}
              height={92}
              rx={20}
              fill="#071024"
              stroke="#4ade80"
              strokeWidth={3.2}
              style={{ filter: svgGlow("#4ade80", 12) }}
            />
            <text
              x={0}
              y={12}
              textAnchor="middle"
              fill="#4ade80"
              fontFamily={MONO}
              fontWeight={900}
              fontSize={36}
              letterSpacing={2.5}
            >
              ROUND TRIP: 20.0 MIN · UNCHANGED
            </text>
          </g>
        </svg>
        </AbsoluteFill>

        <MinimalLabel
          text={
            frame >= tPickRule
              ? "LOCKING EINSTEIN'S RULE (ε = 0.5)"
              : "REICHENBACH'S CONVENTION DIAL"
          }
          color={frame >= tPickRule ? C.cyan : C.gold}
          x={960}
          y={94}
          size={42}
        />
      </CleanStage>

      {/* KINETIC PUNCH 2: AGREED? */}
      <Sequence from={tSameTime} durationInFrames={punch2Dur}>
        <KineticPunch
          word="AGREED?"
          sub="WAIT UNTIL SOMEONE MOVES"
          color={C.cyan}
          accent="question"
          size={168}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
