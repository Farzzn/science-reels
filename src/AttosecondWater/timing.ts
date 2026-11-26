import timingsData from "../../public/attowater/timings.json";
import wordsData from "../../public/attowater/words.json";
import { FPS } from "../FiveHundredMileEmail/theme";

export type AttoChapterTiming = {
  id: string;
  title: string;
  start: number;
  end: number;
};

export type AttoWord = {
  w: string;
  k: string;
  ch: string;
  s: number;
  e: number;
};

export const ATTO_TIMINGS = timingsData as { total: number; chapters: AttoChapterTiming[] };
export const ATTO_WORDS = wordsData as AttoWord[];
export const ATTO_TOTAL_FRAMES = Math.ceil(ATTO_TIMINGS.total * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9']/g, "");

export const makeAttoCue = (chId: string) => {
  const ch = ATTO_TIMINGS.chapters.find((c) => c.id === chId)!;
  const list = ATTO_WORDS.filter((w) => w.ch === chId);
  const len = Math.round((ch.end - ch.start) * FPS);

  const cue = (phrase: string, offsetSec = 0): number => {
    const target = norm(phrase);
    for (let i = 0; i < list.length; i++) {
      let acc = "";
      for (let j = i; j < list.length && acc.length < target.length; j++) {
        acc += norm(list[j].w);
        if (acc === target) {
          return Math.max(0, Math.round((list[i].s - ch.start + offsetSec) * FPS));
        }
        if (!target.startsWith(acc)) break;
      }
    }
    return 0;
  };
  cue.len = len;
  cue.startSec = ch.start;
  cue.endSec = ch.end;
  return cue;
};
