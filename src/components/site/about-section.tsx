"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  useParallaxLayers,
  type ParallaxLayer,
} from "@/hooks/use-parallax-layers";
import { siteConfig } from "@/lib/site-config";

/**
 * Depth for the four layers, in pixels. The reference component's percentages
 * are relative to each layer's own height, which here ranges from a 76px label
 * to a 1300px hairline field — the same percentage would move them by wildly
 * different amounts. Pixels keep the composition deliberate at both ends of
 * the scroll. Declared at module scope so the effect isn't rebuilt each render.
 */
const LAYERS: readonly ParallaxLayer[] = [
  { layer: "1", y: 300 }, // ghost word — furthest back
  { layer: "2", y: 200 }, // hairline field
  { layer: "3", y: 120 }, // section index
  { layer: "4", y: 60 }, // the copy — nearest
];

/**
 * The same four layers, at roughly half the travel. Depth is the difference
 * between two layers' drift, and on a phone the index and the copy have only
 * the height of the label between them: 60px of it spent that gap and drove
 * the index down through the heading. Half the travel keeps the layers apart
 * over a runway that is itself a quarter shorter.
 */
const NARROW_LAYERS: readonly ParallaxLayer[] = [
  { layer: "1", y: 180 },
  { layer: "2", y: 130 },
  { layer: "3", y: 80 },
  { layer: "4", y: 50 },
];

/** Faint vertical hairlines — a quieter echo of the hero's wave field. */
function HairlineField() {
  return (
    <div className="flex h-full w-full justify-between">
      {Array.from({ length: 48 }).map((_, i) => (
        <span
          key={i}
          className="h-full w-px bg-white"
          style={{ opacity: 0.04 + (i % 6) * 0.012 }}
        />
      ))}
    </div>
  );
}

export function AboutSection() {
  // Matches the `sm:` breakpoint the copy's own frame changes at. Width, not
  // height: a phone's toolbars collapse as it scrolls, which moves the
  // viewport height by over a hundred pixels, and rebuilding the timeline
  // underneath a scrub the viewer is in the middle of would jump it. Short
  // frames get their room from CSS (`short:`) instead, which cannot jump.
  const narrow = useMediaQuery("(max-width: 639px)");
  // Reversed: the layers start displaced down the frame — where the forward
  // version ended — and rise back into place as the section scrolls through.
  const ref = useParallaxLayers<HTMLDivElement>(
    narrow ? NARROW_LAYERS : LAYERS,
    { reverse: true },
  );
  const { about } = siteConfig;

  return (
    <section id="about" className="relative bg-black">
      <div aria-hidden="true" className="h-px w-full bg-white/80" />

      <div ref={ref}>
        {/* The runway's height is the scroll distance the parallax scrubs
            over. Narrow screens get a quarter less of it, so the section hands
            over to Work without a long stretch where nothing moves. */}
        <div data-parallax-layers className="relative h-[135svh] sm:h-[180svh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {/* 1 — oversized ghost word, drifts the most */}
            <div
              data-parallax-layer="1"
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-[18%] grid h-full place-items-center"
            >
              <span className="whitespace-nowrap font-display text-[30vw] leading-none tracking-tight text-white/[0.05] sm:text-[19vw]">
                About
              </span>
            </div>

            {/* 2 — hairline field, hung high enough and tall enough that it
                still covers the frame at both ends of its drift. */}
            <div
              data-parallax-layer="2"
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-[45%] h-[170%]"
            >
              <HairlineField />
            </div>

            {/* 3 — section index */}
            <div
              data-parallax-layer="3"
              className="absolute inset-x-0 top-0 px-5 pt-10 short:pt-8 sm:px-8 sm:pt-14"
            >
              <p className="font-mono text-xs tracking-[0.25em] text-white/50 sm:text-sm">
                ( {about.index} )&nbsp;&nbsp;ABOUT
              </p>
            </div>

            {/* 4 — the copy, holds nearly still so it stays readable. Narrow
                screens centre it against a frame short of the bottom, which
                lifts the block and trims the gap under its last line, and
                short of the top, which leaves the index its own room: a phone
                in landscape, or in Safari with both toolbars showing, has a
                frame short enough that a block centred against all of it
                started above the label. `content-center-safe` covers the rest
                — once the copy is taller than the room it has, it grows down
                past the fold rather than up through the index. */}
            <div
              data-parallax-layer="4"
              className="absolute inset-x-0 bottom-24 top-28 grid content-center-safe px-5 short:bottom-6 sm:bottom-0 sm:top-0 sm:px-8 sm:short:top-32"
            >
              <div className="w-full max-w-6xl">
                <h2 className="max-w-4xl text-balance font-display text-[clamp(2.25rem,6.5vw,5rem)] leading-[1.06] tracking-tight text-white">
                  {about.heading}
                </h2>

                {/* The copy is the one block here that cannot be made shorter
                    by the viewport, so on a frame under 700px — a small phone,
                    or any phone showing both of Safari's toolbars — its own
                    rhythm tightens rather than letting the last rows fall off
                    the bottom of the pinned frame. */}
                <div className="mt-8 grid gap-10 short:mt-5 short:gap-6 md:mt-12 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-16">
                  <div className="max-w-xl space-y-4 short:space-y-3">
                    {about.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-relaxed text-white/70 sm:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <dl className="grid gap-5 self-end short:gap-3">
                    {about.meta.map((item) => (
                      <div key={item.label} className="flex flex-col gap-1">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                          {item.label}
                        </dt>
                        <dd className="text-sm font-medium text-white sm:text-base">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-px w-full bg-white/80" />
    </section>
  );
}
