"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ParallaxLayer = {
  /** Matches the element's `data-parallax-layer` value. */
  layer: string;
  /** How far the layer drifts, as a percentage of its own height. */
  yPercent?: number;
  /**
   * How far the layer drifts, in pixels. Use this when layers differ wildly
   * in height — a percentage of a short element's own height is invisible
   * next to the same percentage of a full-bleed one.
   */
  y?: number;
};

/**
 * Scrubbed parallax over `[data-parallax-layer]` children, the same technique
 * as `@/components/ui/parallax-scrolling`. Attach the returned ref to a
 * wrapper containing one `[data-parallax-layers]` element — that element's
 * height is the scroll runway.
 *
 * Pass `layers` as a module-level constant so the effect isn't re-run on
 * every render.
 */
export function useParallaxLayers<T extends HTMLElement>(
  layers: readonly ParallaxLayer[],
  { reverse = false }: { reverse?: boolean } = {},
) {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = root.querySelector("[data-parallax-layers]");
    if (!trigger) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      layers.forEach((layerObj, idx) => {
        const elements = trigger.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`,
        );
        const offset =
          layerObj.y !== undefined
            ? { y: layerObj.y }
            : { yPercent: layerObj.yPercent ?? 0 };
        const rest = idx === 0 ? undefined : "<";

        if (reverse) {
          // Start displaced and settle back to zero — the layers rise up the
          // frame instead of sinking down it.
          const settled = layerObj.y !== undefined ? { y: 0 } : { yPercent: 0 };
          tl.fromTo(elements, offset, { ...settled, ease: "none" }, rest);
        } else {
          tl.to(elements, { ...offset, ease: "none" }, rest);
        }
      });
    }, root);

    return () => ctx.revert();
  }, [layers, reverse]);

  return ref;
}
