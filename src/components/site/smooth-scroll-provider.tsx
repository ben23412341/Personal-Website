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

  /**
   * A client-side navigation jumps the window (to the top, or to a hash) with
   * no Lenis involvement, so Lenis's internal position — which is what drives
   * ScrollTrigger.update — goes stale, and every scroll-scrubbed animation on
   * the new page stays frozen at progress 0. Resync both after the route has
   * painted and the browser has done its hash scroll.
   */
  React.useEffect(() => {
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        }
        ScrollTrigger.refresh();
      });
    });

    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [pathname]);

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
