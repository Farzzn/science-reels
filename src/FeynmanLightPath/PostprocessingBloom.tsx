import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useDelayRender } from "remotion";

export function useEffectComposerSync() {
  const frame = useCurrentFrame();
  const { advance, camera } = useThree();
  const { delayRender, continueRender } = useDelayRender();
  const composerRef = useRef<any>(null);

  useLayoutEffect(() => {
    const handle = delayRender(`Waiting for Bloom EffectComposer on frame ${frame}`);
    let rafId: number | null = null;
    let cancelled = false;

    const checkAndRender = () => {
      if (cancelled) return;
      const composer = composerRef.current;
      const pass0Camera = composer?.passes?.[0]?.camera;
      if (
        composer &&
        composer.passes &&
        composer.passes.length >= 2 &&
        pass0Camera === camera
      ) {
        camera.updateMatrixWorld();
        advance(performance.now());
        rafId = requestAnimationFrame(() => {
          if (!cancelled) {
            advance(performance.now());
            continueRender(handle);
          }
        });
      } else {
        rafId = requestAnimationFrame(checkAndRender);
      }
    };

    rafId = requestAnimationFrame(checkAndRender);

    return () => {
      cancelled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      continueRender(handle);
    };
  }, [frame, advance, camera, delayRender, continueRender]);

  return composerRef;
}
