"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ExperienceCard } from "@/components/site/experience-card";
import { experiences } from "@/lib/experience";

/** The deck's spokes fan around straight-down before swinging out. */
const START_ANGLE = 90;
/** Degrees between neighbouring spokes while stacked, so the pile splays. */
const STACK_SPREAD = 5;
/** How far along its spoke each card sits while stacked, in pixels. */
const STACK_RADIUS = 54;
/** Per-card rake across the resting deck, in degrees. */
const STACK_RAKE = 4;
/** Below this the fan is dropped for a plain, scrollable grid. */
const WIDE = 1024;

/**
 * Timeline time the settled grid holds on screen after the fan finishes at
 * 0.72, before the section scrolls on. It was 0.28, about 32svh of scroll
 * where nothing moved; half of that gets to the next section sooner.
 */
const HOLD = 0.14;
/** Scroll the fan itself spreads over, unchanged by the shorter hold. */
const FAN_SVH = 82.8;
const FRAME_SVH = 100;
// The frame plus all the scrub: the fan's scroll, stretched at the same rate
// to cover the hold. With HOLD at 0.14 that is about 198.9svh.
const RUNWAY_SVH = FRAME_SVH + (FAN_SVH * (0.72 + HOLD)) / 0.72;
/** Scrub progress at which the fan has fully spread, about 0.84. */
const FAN_END = 0.72 / (0.72 + HOLD);
/**
 * Scrub progress the #experience anchor points at: the middle of the hold, so
 * arriving from the nav or a detail page lands on the settled grid instead of
 * the stacked pile, with room either side of the short hold.
 */
const ANCHOR_PROGRESS = (FAN_END + 1) / 2;
const ANCHOR_TOP_PCT =
  ((ANCHOR_PROGRESS * (RUNWAY_SVH - FRAME_SVH)) / RUNWAY_SVH) * 100;

type Slot = { x: number; y: number };

/**
 * Final resting places: a straight 4-wide grid, centred on the stage, with a
 * short last row centred under the full ones. No arc and no tilt — the cards
 * travel out along curves but land square.
 */
function computeLayout(width: number, height: number, count: number) {
  const cols = 4;
  const rows = Math.ceil(count / cols);
  const gx = 34;
  const gy = 34;
  /** Never let the grid run flush against the stage edges. */
  const MIN_GUTTER = 40;

  const cardW = Math.min(
    340,
    Math.floor((width - MIN_GUTTER - (cols - 1) * gx) / cols),
  );
  const cardH = Math.min(244, Math.floor((height - (rows - 1) * gy) / rows));

  const slots: Slot[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Full rows hold `cols` cards; the last row may hold fewer.
    const inRow = Math.min(cols, count - row * cols);
    slots.push({
      x: (col - (inRow - 1) / 2) * (cardW + gx),
      y: (row - (rows - 1) / 2) * (cardH + gy),
    });
  }

  return { cardW, cardH, slots };
}

/** Pick the representation of `target` within 180° of `from`. */
function shortestAngle(from: number, target: number) {
  let t = target;
  while (t - from > 180) t -= 360;
  while (t - from < -180) t += 360;
  return t;
}

/** Fine dot grid — a different texture to the hairlines used elsewhere. */
function DotGrid() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(255,255,255,0.13) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
  );
}

function SectionHeading() {
  return (
    <>
      <p className="font-mono text-xs tracking-[0.25em] text-white/50 sm:text-sm">
        ( 03 )&nbsp;&nbsp;EXPERIENCE
      </p>
      <h2 className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.92] tracking-tight text-white">
        Where I&apos;ve been.
      </h2>
    </>
  );
}

export function ExperienceSection() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 1440, h: 620 });

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) =>
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wide = box.w >= WIDE;

  const { cardW, cardH, slots } = React.useMemo(
    () => computeLayout(box.w, box.h, experiences.length),
    [box],
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !wide) return;

    const trigger = root.querySelector("[data-experience-runway]");
    if (!trigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const angles = slots.map((s) => (Math.atan2(s.y, s.x) * 180) / Math.PI);
    const radii = slots.map((s) => Math.hypot(s.x, s.y));

    const ctx = gsap.context(() => {
      const spokes = gsap.utils.toArray<HTMLElement>("[data-spoke]");
      const holders = gsap.utils.toArray<HTMLElement>("[data-holder]");
      const faces = gsap.utils.toArray<HTMLElement>("[data-card]");

      gsap.set(faces, { xPercent: -50, yPercent: -50 });

      if (reduced) {
        spokes.forEach((el, i) => gsap.set(el, { rotation: angles[i] }));
        holders.forEach((el, i) => gsap.set(el, { x: radii[i] }));
        faces.forEach((el, i) => gsap.set(el, { rotation: -angles[i] }));
        gsap.set("[data-fade], [data-card-body]", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top top",
          // "bottom bottom" ends the scrub as the pinned frame releases, so the
          // grid has settled before the next section scrolls into view.
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      // Title and backdrop are already legible when the section lands, so the
      // resting frame reads as composed rather than as an empty black screen.
      // They only firm up from there.
      tl.fromTo(
        "[data-fade]",
        { opacity: 0.62, y: 14 },
        { opacity: 1, y: 0, duration: 0.2, ease: "none" },
        0,
      );

      slots.forEach((_slot, i) => {
        // Offset from the middle of the deck, negative on the left.
        const rank = i - (experiences.length - 1) / 2;
        // Each card leaves on its own spoke, so the pile splays rather than
        // sitting as one flat stack on the centre point.
        const from = START_ANGLE + rank * STACK_SPREAD;
        const to = shortestAngle(from, angles[i]);
        // Only the stack is raked; every card still lands square.
        const tilt = rank * STACK_RAKE;

        // Spoke swings, holder pushes the card out along it, and the card
        // counter-rotates so it lands square rather than radial.
        tl.fromTo(
          spokes[i],
          { rotation: from },
          { rotation: to, duration: 0.72, ease: "none" },
          0,
        )
          .fromTo(
            holders[i],
            { x: STACK_RADIUS },
            { x: radii[i], duration: 0.72, ease: "none" },
            0,
          )
          .fromTo(
            faces[i],
            { rotation: -from + tilt, scale: 0.92 },
            { rotation: -to, scale: 1, duration: 0.72, ease: "none" },
            0,
          );
      });

      // The deck's numerals carry the resting state, and clear early so
      // they never fight the real writing.
      tl.fromTo(
        "[data-card-stub]",
        { opacity: 1 },
        { opacity: 0, duration: 0.24, ease: "none" },
        0,
      );

      // The writing stays hidden while the cards are still piled up, then
      // comes in over the back half of the spread.
      tl.fromTo(
        "[data-card-body]",
        { opacity: 0 },
        { opacity: 1, duration: 0.34, ease: "none" },
        0.38,
      );

      // Solid while stacked, easing to translucent as they move out so the
      // backdrop reads through the settled grid.
      tl.fromTo(
        "[data-card-fill]",
        { opacity: 1 },
        { opacity: 0.45, duration: 0.72, ease: "none" },
        0,
      );

      // Empty tail so the grid finishes early and holds on screen.
      tl.to({}, { duration: HOLD }, 0.72);
    }, root);

    return () => ctx.revert();
  }, [slots, wide]);

  // Narrow screens: no pin, no fan — a plain grid that just scrolls.
  if (!wide) {
    return (
      <section id="experience" className="relative overflow-hidden bg-black">
        <div aria-hidden="true" className="h-px w-full bg-white/80" />
        <DotGrid />

        <div ref={stageRef} className="relative px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {experiences.map((item, i) => (
              <div key={item.slug} className="min-h-[220px]">
                <ExperienceCard item={item} index={i} />
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="h-px w-full bg-white/80" />
      </section>
    );
  }

  return (
    <section className="relative bg-black">
      <div aria-hidden="true" className="h-px w-full bg-white/80" />

      <div ref={rootRef}>
        <div
          data-experience-runway
          className="relative"
          style={{ height: `${RUNWAY_SVH}svh` }}
        >
          {/* The anchor sits partway down the runway, not at its top, so
              /#experience arrives on the finished grid. */}
          <span
            id="experience"
            aria-hidden="true"
            className="absolute left-0 block w-px"
            style={{ top: `${ANCHOR_TOP_PCT}%`, height: 1 }}
          />

          <div
            className="sticky top-0 flex flex-col overflow-hidden"
            style={{ height: `${FRAME_SVH}svh` }}
          >
            {/* Backdrop — fades in */}
            <div
              data-fade
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <DotGrid />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[15vw] leading-none tracking-tight text-white/[0.05]">
                Experience
              </span>
            </div>

            {/* Title — fades in */}
            <div
              data-fade
              className="relative shrink-0 px-5 pt-10 sm:px-8 sm:pt-12"
            >
              <SectionHeading />
            </div>

            {/* Stage — cards start stacked at its centre */}
            <div
              ref={stageRef}
              className="relative mx-5 mb-10 mt-8 flex-1 sm:mx-8"
            >
              {experiences.map((item, i) => (
                <div
                  key={item.slug}
                  data-spoke
                  className="absolute left-1/2 top-1/2 h-0 w-0"
                >
                  <div data-holder className="relative h-0 w-0">
                    <div
                      data-card
                      className="absolute left-0 top-0"
                      style={{ width: cardW, height: cardH }}
                    >
                      <ExperienceCard item={item} index={i} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-px w-full bg-white/80" />
    </section>
  );
}
