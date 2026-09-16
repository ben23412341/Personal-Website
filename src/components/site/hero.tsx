"use client";

import { MapPin } from "lucide-react";

import { AgeCounter } from "@/components/site/age-counter";
import { ScrollCue } from "@/components/site/scroll-cue";
import { SiteHeader } from "@/components/site/site-header";
import { Waves } from "@/components/ui/wave-background";
import {
  useParallaxLayers,
  type ParallaxLayer,
} from "@/hooks/use-parallax-layers";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Depth for the hero's three bands, scrubbed as it scrolls away toward About.
 * Each drifts *down* as the page scrolls up, so a larger value reads as
 * further back: the wave field lags furthest behind, the name plate travels
 * almost with the scroll. The hairline rules stay put — they're the frame.
 */
const LAYERS: readonly ParallaxLayer[] = [
  { layer: "1", y: 140 }, // wave field — furthest
  { layer: "2", y: 95 }, // header
  { layer: "3", y: 45 }, // name plate — nearest
];

/** Hairline rule that frames the wave field, top and bottom. */
function Rule() {
  return <div aria-hidden="true" className="h-px w-full shrink-0 bg-white/80" />;
}

/**
 * Where the name plate says he is. Rendered at one of two spots depending on
 * width, so only ever one of them is in the accessibility tree.
 */
function LocationLine({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-base font-medium tracking-tight text-white sm:text-lg md:text-xl",
        className,
      )}
    >
      <MapPin
        aria-hidden="true"
        strokeWidth={2}
        className="size-[0.95em] shrink-0 text-white/70"
      />
      {siteConfig.location}
    </p>
  );
}

export function Hero() {
  const ref = useParallaxLayers<HTMLDivElement>(LAYERS);

  return (
    <div ref={ref}>
      <section
        data-parallax-layers
        className="flex h-[100svh] min-h-[640px] w-full flex-col bg-black"
      >
        <div className="shrink-0 overflow-hidden">
          <div data-parallax-layer="2">
            <SiteHeader />
          </div>
        </div>

        <Rule />

        {/* Animated wave field — oversized so the drift never exposes an edge */}
        <div className="relative flex-1 overflow-hidden">
          <div
            data-parallax-layer="1"
            className="absolute inset-x-0 -top-[30%] h-[160%]"
          >
            <Waves className="h-full w-full" xGap={9} yGap={14} />
          </div>
        </div>

        <Rule />

        {/* Name plate */}
        <div className="shrink-0 overflow-hidden bg-black">
          <div
            data-parallax-layer="3"
            className="px-5 pb-9 pt-5 sm:px-8 sm:pb-12 sm:pt-7"
          >
            {/* Wide only: location sits top-right of the bar. Narrow screens
                get it in the closing row instead, under the name. */}
            <div className="mb-8 hidden justify-end md:flex">
              <LocationLine />
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
                <h1 className="font-display text-[clamp(4rem,13.2vw,9.75rem)] font-normal leading-[0.82] tracking-[0.005em] text-white">
                  {siteConfig.name}
                </h1>
                <AgeCounter
                  birthDate={siteConfig.birthDate}
                  className="md:pb-2"
                />
              </div>

              {/* Narrow: the cue and the location close out the plate on one
                  row. Wide: the wrapper dissolves and the cue sits alongside
                  the name, as before. */}
              <div className="flex items-center justify-between gap-4 md:contents">
                <ScrollCue targetId="about" className="md:pb-3" />
                <LocationLine className="md:hidden" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
