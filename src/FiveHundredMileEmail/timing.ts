import words from "../../public/email500/words.json";
import timings from "../../public/email500/timings.json";
import { FPS } from "./theme";

type Word = { w: string; k: string; ch: string; s: number; e: number };
const WORDS = words as Word[];

export const TIMINGS = timings as {
  total: number;
  chapters: { id: string; title: string; start: number; end: number }[];
};

export const TOTAL_FRAMES = Math.ceil(TIMINGS.total * FPS);

const norm = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, "");

export const chapterOf = (id: string) => {
  const c = TIMINGS.chapters.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown chapter ${id}`);
  return c;
};

/**
 * Absolute time (seconds) at which `phrase` starts being spoken inside chapter `ch`.
 * `nth` picks a later occurrence (0 = first). Returns the word *end* time if `edge` = "end".
 */
export const phraseTime = (
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
  // eslint-disable-next-line no-console
  console.warn(`[cue] phrase not found in ${ch}: "${phrase}"`);
  return chapterOf(ch).start;
};

/** Cue helper bound to a chapter: returns frames relative to chapter start. */
export const makeCue = (ch: string) => {
  const start = chapterOf(ch).start;
  const cue = (phrase: string, offsetSec = 0, nth = 0) =>
    Math.round((phraseTime(ch, phrase, nth) - start + offsetSec) * FPS);
  cue.end = (phrase: string, offsetSec = 0, nth = 0) =>
    Math.round((phraseTime(ch, phrase, nth, "end") - start + offsetSec) * FPS);
  cue.len = Math.round((chapterOf(ch).end - start) * FPS);
  return cue;
};
export type Cue = ReturnType<typeof makeCue>;
