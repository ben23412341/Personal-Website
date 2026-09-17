"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { projects, statusLabel } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** Degrees per second the wheel turns on its own. */
const ROTATION_SPEED = 8.5;
/** How sharply the panel wipes as a node leaves the open slot. */
const COLLAPSE_SHARPNESS = 6;
/**
 * Skills shown in the overview panel before it collapses to "+N more".
 * The stack arrays are ranked, so the six that show are the six that matter.
 */
const SKILLS_SHOWN = 6;
/**
 * Below this the panel drops underneath the wheel instead of sitting beside
 * it, so everything keyed to the panel's direction turns with it.
 */
const STACKED = "(max-width: 1023px)";
/**
 * The point on the wheel the open panel hangs off: the right-hand side when
 * the panel is beside it, the bottom when it is underneath. Nodes are still
 * laid out from 0 at the right — this only says which one is open.
 */
const SIDE_SLOT = 0;
const BOTTOM_SLOT = 90;
/**
 * Node ring radius, as a fraction of the wheel's width. Stacked screens pull
 * it in: at 0.37 the labels of the nodes out at the sides hang past the edge
 * of a phone and give the page something to scroll sideways over.
 */
const RADIUS_BESIDE = 0.37;
const RADIUS_STACKED = 0.32;

/** Fold an angle into [-180, 180). 0 is the right-hand side of the circle. */
function normalize(angle: number) {
  const a = ((angle % 360) + 360) % 360;
  return a >= 180 ? a - 360 : a;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smoothstep = (n: number) => n * n * (3 - 2 * n);

/**
 * The wheel's free-spin switch. Rendered at one of two spots depending on
 * width — under the wheel when the panel is beside it, under the panel when
 * the panel is below, so it never comes between the two — so only ever one of
 * them is in the accessibility tree.
 */
function RotationToggle({
  on,
  onToggle,
  className,
}: {
  on: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className="inline-flex items-center gap-3 focus-visible:outline-none"
      >
        <span
          className={cn(
            "relative h-4 w-7 shrink-0 rounded-full border transition-colors duration-300",
            on ? "border-white bg-white" : "border-white/30 bg-transparent",
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 size-2 -translate-y-1/2 rounded-full transition-all duration-300",
              on ? "left-4 bg-black" : "left-1 bg-white/60",
            )}
          />
        </span>
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
            on ? "text-white/70" : "text-white/40",
          )}
        >
          auto-rotating
        </span>
      </button>
    </div>
  );
}

export function WorkSection() {
  const total = projects.length;

  const stacked = useMediaQuery(STACKED);
  const slot = stacked ? BOTTOM_SLOT : SIDE_SLOT;

  const [rotation, setRotation] = React.useState(0);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [onScreen, setOnScreen] = React.useState(false);
  const [width, setWidth] = React.useState(460);
  const radius = width * (stacked ? RADIUS_STACKED : RADIUS_BESIDE);

  const orbitRef = React.useRef<HTMLDivElement>(null);
  const rotationRef = React.useRef(0);
  /** Set when a node is picked — the wheel eases here instead of free-running. */
  const targetRef = React.useRef<number | null>(null);

  // Radius follows the container so the orbit scales with the viewport.
  React.useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Only spin while the section is actually on screen.
  React.useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * One loop drives both behaviours: free rotation, and easing to a picked
   * node. Running it per frame (rather than on an interval) is what lets the
   * panel's open/close read as a continuous function of the wheel's angle.
   */
  React.useEffect(() => {
    if (!onScreen) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;

      let next = rotationRef.current;

      if (targetRef.current !== null) {
        const diff = targetRef.current - next;
        if (reducedMotion || Math.abs(diff) < 0.05) {
          next = targetRef.current;
          targetRef.current = null;
        } else {
          next += diff * Math.min(1, dt / 180);
        }
      } else if (autoRotate && !reducedMotion) {
        next += (ROTATION_SPEED * dt) / 1000;
      }

      if (next !== rotationRef.current) {
        rotationRef.current = next;
        setRotation(next);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onScreen, autoRotate]);

  /** Bring a project round to the open slot by the shortest path. */
  const select = React.useCallback(
    (index: number) => {
      const desired = slot - (index / total) * 360;
      const current = rotationRef.current;
      const shortest = ((((desired - current) % 360) + 540) % 360) - 180;

      targetRef.current = current + shortest;
      setAutoRotate(false);
    },
    [slot, total],
  );

  const nodes = projects.map((project, index) => {
    const angle = (index / total) * 360 + rotation;
    const radian = (angle * Math.PI) / 180;
    const delta = normalize(angle - slot);
    // 1 when the node is in the open slot, 0 when it is diametrically opposite.
    const proximity = 1 - Math.abs(delta) / 180;

    return {
      project,
      index,
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
      delta,
      proximity,
    };
  });

  const active = nodes.reduce((closest, node) =>
    Math.abs(node.delta) < Math.abs(closest.delta) ? node : closest,
  );
  const activeProject = active.project;

  // The panel is a function of how centred the active node is: it retracts
  // into the departing node and opens back out of the arriving one. The
  // content swaps at the hand-over point, where openness is already 0.
  const halfStep = 180 / total;
  const openness = smoothstep(
    clamp01((1 - Math.abs(active.delta) / halfStep) * COLLAPSE_SHARPNESS),
  );

  return (
    <section id="work" className="relative bg-black">
      <div aria-hidden="true" className="h-px w-full bg-white/80" />

      <div className="px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14">
        {/* Section header — mirrors the About section's treatment */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[30vw] leading-none tracking-tight text-white/[0.05] sm:text-[13vw]"
          >
            Work
          </span>

          <div className="relative">
            <p className="font-mono text-xs tracking-[0.25em] text-white/50 sm:text-sm">
              ( 02 )&nbsp;&nbsp;WORK
            </p>

            <h2 className="mt-8 max-w-4xl text-balance font-display text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.92] tracking-tight text-white">
              Selected work &amp; projects.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              The things I&apos;ve built. Pick a node to bring it round the
              orbit, then open it for more details.
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="mt-14 h-px w-full bg-white/10" />

        {/* Orbit and panel are centred as a pair */}
        <div className="mt-12 flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-16">
          {/* Orbit. The bottom node's label hangs below the square it is laid
              out in, and stacked that is the one node the panel sits under —
              the padding is the room it needs. */}
          <div className="relative w-full max-w-[min(34rem,88vw)] pb-6 lg:pb-0">
            <div
              ref={orbitRef}
              className="relative aspect-square w-full"
              onClick={(event) => {
                // Clicking the empty field resumes the rotation.
                if (event.target === event.currentTarget) setAutoRotate(true);
              }}
            >
              {/* Orbit rings. The outer one carries the nodes, so its inset is
                  the other half of whichever radius is in play. */}
              <div className="pointer-events-none absolute inset-[18%] rounded-full border border-white/12 lg:inset-[13%]" />
              <div className="pointer-events-none absolute inset-[32%] rounded-full border border-white/6 lg:inset-[30%]" />

              {/* Hub */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center">
                <span className="absolute size-14 rounded-full border border-white/20 motion-safe:animate-ping" />
                <span
                  className="absolute size-20 rounded-full border border-white/10 motion-safe:animate-ping"
                  style={{ animationDelay: "0.6s" }}
                />
                <span className="size-3 rounded-full bg-white" />
              </div>

              {/* Nodes */}
              {nodes.map(({ project, index, x, y, proximity }) => {
                const isActive = project.slug === activeProject.slug;
                const Icon = project.icon;
                const scale = 0.82 + proximity * 0.38;
                const opacity = 0.28 + Math.pow(proximity, 1.4) * 0.72;

                const visual = (
                  <>
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-full border transition-colors duration-300",
                        isActive
                          ? "border-white bg-white text-black"
                          : "border-white/40 bg-black text-white hover:border-white",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span
                      className={cn(
                        "absolute left-1/2 top-[calc(100%+0.6rem)] w-28 -translate-x-1/2 text-balance text-center font-mono text-[11px] uppercase leading-tight tracking-[0.18em] transition-colors duration-300 lg:w-36",
                        isActive ? "text-white" : "text-white/60",
                      )}
                    >
                      {project.title}
                    </span>
                  </>
                );

                return (
                  <div
                    key={project.slug}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
                      zIndex: Math.round(100 + proximity * 100),
                      opacity,
                    }}
                  >
                    {isActive ? (
                      <Link
                        href={`/work/${project.slug}`}
                        aria-label={`View ${project.title}`}
                        className="relative block focus-visible:outline-none"
                      >
                        {visual}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => select(index)}
                        aria-label={`Show ${project.title}`}
                        className="relative block cursor-pointer focus-visible:outline-none"
                      >
                        {visual}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Wide only: the switch closes out the orbit column. */}
            <RotationToggle
              on={autoRotate}
              onToggle={() => setAutoRotate((v) => !v)}
              className="mt-6 hidden lg:flex"
            />
          </div>

          {/* Panel for whichever project has come round to the open slot */}
          <div className="relative w-full max-w-[38rem]">
            {/* Hairline connecting the orbit to the panel */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 top-1/2 hidden h-px w-16 bg-gradient-to-r from-transparent to-white/40 lg:block"
              style={{ opacity: openness }}
            />

            <Link
              href={`/work/${activeProject.slug}`}
              className="group flex min-h-[20rem] flex-col border border-white/15 bg-black/60 p-6 transition-colors duration-300 hover:border-white/50 focus-visible:border-white focus-visible:outline-none sm:min-h-[22rem] sm:p-8"
              style={{
                // Anchored at whichever edge faces the wheel: beside it, the
                // panel wipes away right-to-left and the next is revealed
                // left-to-right; below it, the panel retracts bottom-to-top
                // into the wheel and the next unrolls top-to-bottom out of it.
                clipPath: stacked
                  ? `inset(0 0 ${(1 - openness) * 100}% 0)`
                  : `inset(0 ${(1 - openness) * 100}% 0 0)`,
                transform: stacked
                  ? `translateY(${(1 - openness) * -24}px)`
                  : `translateX(${(1 - openness) * -24}px)`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                  {String(active.index + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                  <span
                    className={cn(
                      "border px-2 py-0.5",
                      activeProject.status === "shipped"
                        ? "border-white bg-white text-black"
                        : "border-white/40 text-white/80",
                    )}
                  >
                    {statusLabel[activeProject.status]}
                  </span>
                  {activeProject.year}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[0.95] tracking-tight text-white">
                {activeProject.title}
              </h3>

              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                {activeProject.category}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {activeProject.summary}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {activeProject.stack.slice(0, SKILLS_SHOWN).map((tool) => (
                  <li
                    key={tool}
                    className="border border-white/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-white/60"
                  >
                    {tool}
                  </li>
                ))}
                {activeProject.stack.length > SKILLS_SHOWN && (
                  <li className="px-2 py-0.5 font-mono text-[10px] tracking-wide text-white/40">
                    +{activeProject.stack.length - SKILLS_SHOWN} more
                  </li>
                )}
              </ul>

              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-white">
                View project
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* The wipe front, drawn as a hairline — the same 1px rule the
                rest of the page is built from, here used as a scan edge. It
                runs across the wipe, so it turns with the panel. */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute bg-white transition-opacity duration-200",
                stacked ? "-left-2 -right-2 h-px" : "-bottom-2 -top-2 w-px",
              )}
              style={{
                ...(stacked
                  ? { top: `calc(${openness * 100}% - ${(1 - openness) * 24}px)` }
                  : {
                      left: `calc(${openness * 100}% - ${(1 - openness) * 24}px)`,
                    }),
                opacity: openness > 0.002 && openness < 0.998 ? 0.9 : 0,
              }}
            />
          </div>

          {/* Narrow: the switch sits under the panel instead, so nothing
              stands between the wheel and the card it throws out. */}
          <RotationToggle
            on={autoRotate}
            onToggle={() => setAutoRotate((v) => !v)}
            className="lg:hidden"
          />
        </div>
      </div>
    </section>
  );
}
