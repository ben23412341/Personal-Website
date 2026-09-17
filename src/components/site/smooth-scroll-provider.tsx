"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

type LenisRef = React.RefObject<Lenis | null>;

const LenisContext = React.createContext<LenisRef | null>(null);

/**
 * Ref to the app-wide Lenis instance — read `.current` inside an event
 * handler. It is null before mount and when the viewer prefers reduced
 * motion, in which case fall back to native scrolling.
 */
export function useLenisRef() {
  return React.useContext(LenisContext);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Where the viewer last was on each route. Next keeps the scroll position
 * whenever it judges the incoming page to already be in view, which is why
 * opening a project from halfway down the home page sometimes landed halfway
 * down the project. The provider takes that decision over, and this is what
 * it decides from.
 */
const scrollMemory = new Map<string, number>();

/** How far down `path` the viewer was, if they have been there this session. */
export function rememberedScroll(path: string) {
  return scrollMemory.get(path);
}

/**
 * Set by a link that knows where the route it opens should land — a back link
 * returning someone to the spot they left. Consumed by the next route change,
 * whether or not that route asked for it.
 */
let requestedScroll: number | null = null;

export function requestScrollRestore(y: number) {
  requestedScroll = y;
}

/** Run `fn` once the route has painted and the browser has had its say. */
function afterPaint(fn: () => void) {
  let second = 0;
  const first = window.requestAnimationFrame(() => {
    second = window.requestAnimationFrame(fn);
  });

  return () => {
    window.cancelAnimationFrame(first);
    window.cancelAnimationFrame(second);
  };
}

/**
 * Drives Lenis smooth scrolling off the GSAP ticker and keeps ScrollTrigger
 * in sync, so every scroll-scrubbed animation on the page shares one clock.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = React.useRef<Lenis | null>(null);
  const pathname = usePathname();

  /** False until the first client-side navigation, true for every one after. */
  const navigatedRef = React.useRef(false);
  /** The route the last settled navigation left us on. */
  const pathRef = React.useRef(pathname);
  /** Set by a popstate that changes route, read by the change it starts. */
  const poppedRef = React.useRef(false);

  /**
   * Put the window, Lenis and ScrollTrigger at the same place. Lenis holds
   * its own idea of the scroll position and writes it to the window every
   * frame, so moving one without the other leaves whichever wrote last in
   * charge — a race, and the reason a project page opened at the top only
   * most of the time.
   */
  const settleAt = React.useCallback((y: number) => {
    const lenis = lenisRef.current;

    window.scrollTo(0, y);
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(y, { immediate: true, force: true });
    }
    ScrollTrigger.refresh();
  }, []);

  // Bank the scroll position against the route it belongs to. Reading the
  // path off `location` rather than the render keeps the two in step: by the
  // time a scroll fires for a new route, the URL has already changed.
  React.useEffect(() => {
    let frame = 0;
    let cancelSync: (() => void) | undefined;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        scrollMemory.set(window.location.pathname, window.scrollY);
      });
    };

    const onPop = () => {
      if (window.location.pathname !== pathRef.current) {
        // Crossing routes — the route effect below does the work.
        poppedRef.current = true;
        return;
      }

      // Same route, so no re-render is coming: this is the browser stepping
      // back through the hash entries the nav links push. It moves the window
      // on its own, and Lenis would go on believing it had not.
      cancelSync?.();
      cancelSync = afterPaint(() => settleAt(window.scrollY));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      if (frame) window.cancelAnimationFrame(frame);
      cancelSync?.();
    };
  }, [settleAt]);

  /**
   * Every route change lands somewhere deliberate: back where the viewer was
   * if they are going back, at the top of the page if they are going forward.
   */
  React.useEffect(() => {
    const first = !navigatedRef.current;
    navigatedRef.current = true;
    pathRef.current = pathname;

    const popped = poppedRef.current;
    poppedRef.current = false;

    const requested = requestedScroll;
    requestedScroll = null;

    const { hash } = window.location;

    /** Read after the route has painted, so a hash target is measurable. */
    const resolveTarget = () => {
      // A first paint is a load or a reload: the browser has already put the
      // window where it belongs, and Lenis only has to agree with it.
      if (first) return window.scrollY;
      if (requested !== null) return requested;
      if (popped) return scrollMemory.get(pathname) ?? 0;

      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          return window.scrollY + target.getBoundingClientRect().top;
        }
      }

      return 0;
    };

    return afterPaint(() => {
      const y = resolveTarget();
      settleAt(y);
      scrollMemory.set(pathname, y);
    });
  }, [pathname, settleAt]);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    lenisRef.current = instance;

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Route same-page hash links (header nav, scroll cue) through Lenis so they
  // ease instead of jumping.
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();

      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target as HTMLElement);
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }

      window.history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
