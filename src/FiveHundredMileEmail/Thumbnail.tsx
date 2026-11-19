import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "./components";
import { EnvelopeIcon } from "./icons";
import { CITIES, USMap } from "./maps";
import { C, glow, INTER } from "./theme";

// 1920x1080 YouTube thumbnail (export as JPG/PNG still)
export const EmailThumbnail: React.FC = () => {
  const far = ["Chicago", "Dallas", "Miami", "Denver", "Boston", "St. Louis", "Memphis"].map((n) => CITIES.find((c) => c.name === n)!.ll);
  const near = ["Washington", "Atlanta", "New York", "Philadelphia", "Nashville"].map((n) => CITIES.find((c) => c.name === n)!.ll);
  return (
    <AbsoluteFill>
      <Background />
      <div style={{ position: "absolute", right: -120, top: 40, transform: "scale(1.25)", transformOrigin: "right top" }}>
        <USMap
          width={1400}
          height={980}
          circleAt={-100}
          homeLabel={false}
          pings={[...near.map((ll) => ({ ll, at: -100, ok: true })), ...far.map((ll) => ({ ll, at: -100, ok: false }))]}
        />
      </div>
      <div style={{ position: "absolute", left: 80, top: 110 }}>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: 230,
            lineHeight: 0.92,
            color: C.white,
            letterSpacing: -8,
            textShadow: "0 10px 40px rgba(0,0,0,0.9)",
          }}
        >
          500
          <br />
          <span style={{ color: C.gold, textShadow: glow(C.gold, 24) }}>MILES?</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 50 }}>
          <EnvelopeIcon size={170} color={C.red} />
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 84, color: C.red, textShadow: glow(C.red, 14) }}>✕ FAILED</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
