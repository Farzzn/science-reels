import words from "../../public/macrotunnel/words.json";
import timings from "../../public/macrotunnel/timings.json";
import { FPS } from "../FiveHundredMileEmail/theme";

type Word = { w: string; k: string; ch: string; s: number; e: number };
const WORDS = words as Word[];

export const TUNNEL_TIMINGS = timings as {
  total: number;
  chapters: { id: string; title: string; start: number; end: number }[];
};

export const TUNNEL_TOTAL_FRAMES = Math.ceil(TUNNEL_TIMINGS.total * FPS);

const norm = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, "");

export const tunnelChapterOf = (id: string) => {
  const c = TUNNEL_TIMINGS.chapters.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown chapter ${id}`);
  return c;
};

export const tunnelPhraseTime = (
  ch: string,
  phrase: string,
  nth = 0,
  edge: "start" | "end" = "start",
): number => {
  const target = norm(phrase);
  const list = WORDS.filter((w) => w.ch === ch);
  let found = 0;
  for (let i = 0; i < list.length; i++) {
    let acc = "";
    for (let j = i; j < list.length && acc.length < target.length; j++) {
      acc += norm(list[j].w);
      if (acc === target) {
        if (found === nth) return edge === "start" ? list[i].s : list[j].e;
        found++;
        break;
      }
      if (!target.startsWith(acc)) break;
    }
  }
  return tunnelChapterOf(ch).start;
};

export const makeTunnelCue = (ch: string) => {
  const start = tunnelChapterOf(ch).start;
  const cue = (phrase: string, offsetSec = 0, nth = 0) =>
    Math.round((tunnelPhraseTime(ch, phrase, nth) - start + offsetSec) * FPS);
  cue.end = (phrase: string, offsetSec = 0, nth = 0) =>
    Math.round((tunnelPhraseTime(ch, phrase, nth, "end") - start + offsetSec) * FPS);
  cue.len = Math.round((tunnelChapterOf(ch).end - start) * FPS);
  return cue;
};
