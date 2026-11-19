import { geoAlbers, geoCircle, geoDistance, geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { feature } from "topojson-client";
import usTopo from "us-atlas/states-10m.json";
import worldTopo from "world-atlas/countries-110m.json";
import { clamp01, prog } from "./components";
import { C, INTER, MONO, svgGlow } from "./theme";

/* eslint-disable @typescript-eslint/no-explicit-any */
const EARTH_MI = 3958.8;
export const HOME: [number, number] = [-79.0558, 35.9132]; // Chapel Hill, NC
export const milesBetween = (a: [number, number], b: [number, number]) => geoDistance(a, b) * EARTH_MI;

export const CITIES: { name: string; ll: [number, number] }[] = [
  { name: "Raleigh", ll: [-78.6382, 35.7796] },
  { name: "Richmond", ll: [-77.436, 37.5407] },
  { name: "Washington", ll: [-77.0369, 38.9072] },
  { name: "Atlanta", ll: [-84.388, 33.749] },
  { name: "Philadelphia", ll: [-75.1652, 39.9526] },
  { name: "New York", ll: [-74.006, 40.7128] },
  { name: "Pittsburgh", ll: [-79.9959, 40.4406] },
  { name: "Columbus", ll: [-82.9988, 39.9612] },
  { name: "Nashville", ll: [-86.7816, 36.1627] },
  { name: "Jacksonville", ll: [-81.6557, 30.3322] },
  { name: "Indianapolis", ll: [-86.1581, 39.7684] },
  { name: "Detroit", ll: [-83.0458, 42.3314] },
  { name: "Charleston", ll: [-79.9311, 32.7765] },
  { name: "Knoxville", ll: [-83.9207, 35.9606] },
  { name: "Boston", ll: [-71.0589, 42.3601] },
  { name: "Chicago", ll: [-87.6298, 41.8781] },
  { name: "Memphis", ll: [-90.049, 35.1495] },
  { name: "Miami", ll: [-80.1918, 25.7617] },
  { name: "New Orleans", ll: [-90.0715, 29.9511] },
  { name: "St. Louis", ll: [-90.1994, 38.627] },
  { name: "Dallas", ll: [-96.797, 32.7767] },
  { name: "Minneapolis", ll: [-93.265, 44.9778] },
  { name: "Denver", ll: [-104.9903, 39.7392] },
  { name: "Houston", ll: [-95.3698, 29.7604] },
  { name: "Phoenix", ll: [-112.074, 33.4484] },
  { name: "Los Angeles", ll: [-118.2437, 34.0522] },
  { name: "San Francisco", ll: [-122.4194, 37.7749] },
  { name: "Seattle", ll: [-122.3321, 47.6062] },
  { name: "Salt Lake City", ll: [-111.891, 40.7608] },
  { name: "Kansas City", ll: [-94.5786, 39.0997] },
  { name: "Portland ME", ll: [-70.2553, 43.6615] },
  { name: "Tampa", ll: [-82.4572, 27.9506] },
];

const EXCLUDE = new Set(["02", "15", "60", "66", "69", "72", "78"]);
const STATES = (feature(usTopo as any, (usTopo as any).objects.states) as any).features.filter(
  (f: any) => !EXCLUDE.has(`0${f.id}`.slice(-2)),
);
const LOWER48 = { type: "FeatureCollection", features: STATES } as any;

export type Ping = { ll: [number, number]; at: number; ok: boolean; label?: string };

export const USMap: React.FC<{
  width: number;
  height: number;
  dotsAt?: number; // frame when result dots start appearing
  dotsEvery?: number;
  circleAt?: number; // frame circle starts drawing
  circleMiles?: number;
  circleColor?: string;
  circleLabel?: string;
  circleLabelAt?: number;
  pings?: Ping[];
  homeLabel?: boolean;
}> = ({
  width,
  height,
  dotsAt,
  dotsEvery = 3,
  circleAt,
  circleMiles = 558.85,
  circleColor = C.gold,
  circleLabel,
  circleLabelAt,
  pings = [],
  homeLabel = true,
}) => {
  const frame = useCurrentFrame();
  const { projection, path, statesD } = useMemo(() => {
    const projection = geoAlbers().fitExtent(
      [
        [30, 30],
        [width - 30, height - 30],
      ],
      LOWER48,
    );
    const path = geoPath(projection);
    return { projection, path, statesD: STATES.map((s: any) => path(s) as string) };
  }, [width, height]);

  const home = projection(HOME) as [number, number];
  const circleD = useMemo(
    () => path(geoCircle().center(HOME).radius((circleMiles / EARTH_MI) * (180 / Math.PI)).precision(1)() as any) as string,
    [path, circleMiles],
  );
  const cp = circleAt === undefined ? 0 : prog(frame, circleAt, circleAt + 40);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="usclip">
          {statesD.map((d: string, i: number) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>
      <g>
        {statesD.map((d: string, i: number) => (
          <path key={i} d={d} fill="rgba(62,224,255,0.05)" stroke="rgba(62,224,255,0.35)" strokeWidth={1} />
        ))}
      </g>

      {circleAt !== undefined && cp > 0 ? (
        <g style={{ filter: svgGlow(circleColor, 5) }}>
          <path
            d={circleD}
            fill={circleColor}
            fillOpacity={0.07 * cp}
            stroke={circleColor}
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={`${cp} 1`}
          />
          <line
            x1={home[0]}
            y1={home[1]}
            x2={home[0] + (projection([HOME[0], HOME[1] + (circleMiles / 69.05)])![0] - home[0])}
            y2={projection([HOME[0], HOME[1] + circleMiles / 69.05])![1]}
            stroke={circleColor}
            strokeWidth={2}
            strokeDasharray="8 8"
            opacity={cp}
          />
        </g>
      ) : null}

      {dotsAt !== undefined
        ? CITIES.map((c, i) => {
            const at = dotsAt + i * dotsEvery;
            const p = clamp01((frame - at) / 8);
            if (p <= 0) return null;
            const [x, y] = projection(c.ll) as [number, number];
            const ok = milesBetween(HOME, c.ll) <= circleMiles;
            const col = ok ? C.green : C.red;
            return (
              <g key={c.name} style={{ filter: svgGlow(col, 4) }} opacity={p}>
                <circle cx={x} cy={y} r={7 + (1 - p) * 10} fill={col} />
              </g>
            );
          })
        : null}

      {pings.map((pg, i) => {
        const p = clamp01((frame - pg.at) / 22);
        if (frame < pg.at) return null;
        const [x, y] = projection(pg.ll) as [number, number];
        const col = pg.ok ? C.green : C.red;
        const travel = clamp01((frame - pg.at) / 14);
        return (
          <g key={i}>
            <line
              x1={home[0]}
              y1={home[1]}
              x2={home[0] + (x - home[0]) * travel}
              y2={home[1] + (y - home[1]) * travel}
              stroke={col}
              strokeWidth={3}
              opacity={0.85}
              style={{ filter: svgGlow(col, 4) }}
              strokeDasharray={pg.ok ? undefined : "10 8"}
            />
            <circle cx={x} cy={y} r={9} fill={col} opacity={p} style={{ filter: svgGlow(col, 5) }} />
            {pg.label ? (
              <text x={x + 16} y={y - 14} fill={col} opacity={p} fontFamily={MONO} fontSize={24} fontWeight={700}>
                {pg.label}
              </text>
            ) : null}
          </g>
        );
      })}

      <g style={{ filter: svgGlow(C.gold, 6) }}>
        <circle cx={home[0]} cy={home[1]} r={9 + pulse * 5} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.7} />
        <circle cx={home[0]} cy={home[1]} r={7} fill={C.gold} />
      </g>
      {homeLabel ? (
        <text x={home[0] + 18} y={home[1] + 36} fill={C.gold} fontFamily={MONO} fontSize={22} fontWeight={700}>
          CHAPEL HILL, NC
        </text>
      ) : null}
      {circleLabel && circleLabelAt !== undefined && frame >= circleLabelAt ? (
        <text
          x={home[0] + 12}
          y={projection([HOME[0], HOME[1] + circleMiles / 69.05])![1] - 16}
          fill={circleColor}
          fontFamily={INTER}
          fontWeight={900}
          fontSize={44}
          opacity={clamp01((frame - circleLabelAt) / 10)}
          style={{ filter: svgGlow(circleColor, 4) }}
        >
          {circleLabel}
        </text>
      ) : null}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// World map with a great-circle arc
// ---------------------------------------------------------------------------
const COUNTRIES = (feature(worldTopo as any, (worldTopo as any).objects.countries) as any).features.filter(
  (f: any) => f.id !== "010",
);
export const MUMBAI: [number, number] = [72.8777, 19.076];
export const NYC: [number, number] = [-74.006, 40.7128];

export const WorldMap: React.FC<{
  width: number;
  height: number;
  arcAt?: number;
  arcDur?: number;
  from?: [number, number];
  to?: [number, number];
  nodes?: { ll: [number, number]; at: number }[];
}> = ({ width, height, arcAt, arcDur = 45, from = MUMBAI, to = NYC, nodes = [] }) => {
  const frame = useCurrentFrame();
  const { projection, countriesD } = useMemo(() => {
    const projection = geoNaturalEarth1()
      .rotate([-10, 0])
      .fitExtent(
        [
          [20, 20],
          [width - 20, height - 20],
        ],
        { type: "Sphere" } as any,
      );
    const p = geoPath(projection);
    return { projection, countriesD: COUNTRIES.map((c: any) => p(c) as string) };
  }, [width, height]);

  const interp = geoInterpolate(from, to);
  const N = 120;
  const pts = new Array(N + 1).fill(0).map((_, i) => projection(interp(i / N)) as [number, number]);
  const ap = arcAt === undefined ? 0 : prog(frame, arcAt, arcAt + arcDur);
  const k = Math.round(ap * N);
  // break the polyline where it wraps around the map edge
  const segs: string[] = [];
  let cur = "";
  for (let i = 0; i <= k; i++) {
    const [x, y] = pts[i];
    if (i > 0 && Math.abs(x - pts[i - 1][0]) > width / 3) {
      segs.push(cur);
      cur = "";
    }
    cur += `${cur ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  segs.push(cur);
  const a = projection(from) as [number, number];
  const b = projection(to) as [number, number];

  return (
    <svg width={width} height={height}>
      {countriesD.map((d: string, i: number) => (
        <path key={i} d={d} fill="rgba(62,224,255,0.06)" stroke="rgba(62,224,255,0.3)" strokeWidth={0.8} />
      ))}
      {nodes.map((n, i) => {
        const p = clamp01((frame - n.at) / 10);
        if (p <= 0) return null;
        const [x, y] = projection(n.ll) as [number, number];
        return (
          <g key={i} style={{ filter: svgGlow(C.green, 4) }}>
            <circle cx={x} cy={y} r={6 * p} fill={C.green} />
            <circle cx={x} cy={y} r={6 + 22 * ((frame - n.at) % 40) / 40} fill="none" stroke={C.green} opacity={0.5 * (1 - ((frame - n.at) % 40) / 40)} />
          </g>
        );
      })}
      {arcAt !== undefined && frame >= arcAt ? (
        <g style={{ filter: svgGlow(C.gold, 5) }}>
          {segs.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          ))}
          {k > 0 && k < N ? <circle cx={pts[k][0]} cy={pts[k][1]} r={9} fill="#fff" /> : null}
        </g>
      ) : null}
      {[a, b].map(([x, y], i) => (
        <g key={i} style={{ filter: svgGlow(C.cyan, 5) }}>
          <circle cx={x} cy={y} r={9} fill={C.cyan} />
          <text x={x + (i === 0 ? 16 : -16)} y={y - 16} textAnchor={i === 0 ? "start" : "end"} fill={C.cyan} fontFamily={MONO} fontWeight={700} fontSize={26}>
            {i === 0 ? "MUMBAI" : "NEW YORK"}
          </text>
        </g>
      ))}
    </svg>
  );
};
