import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: INTER } = loadInter("normal", {
  weights: ["400", "600", "800", "900"],
  subsets: ["latin"],
});
export const { fontFamily: MONO } = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const C = {
  bg0: "#040814",
  bg1: "#0a1430",
  grid: "rgba(90, 140, 255, 0.07)",
  cyan: "#3ee0ff",
  gold: "#ffc24d",
  red: "#ff4d5e",
  green: "#3dffa0",
  white: "#f2f6ff",
  dim: "#7f93c4",
  panel: "rgba(10, 20, 48, 0.72)",
  panelBorder: "rgba(62, 224, 255, 0.28)",
};

export const glow = (color: string, px = 18) =>
  `0 0 ${px}px ${color}, 0 0 ${px * 2.2}px ${color}55`;

export const svgGlow = (color: string, px = 6) =>
  `drop-shadow(0 0 ${px}px ${color}) drop-shadow(0 0 ${px * 2.5}px ${color}66)`;
