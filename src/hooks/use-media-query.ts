"use client";

import * as React from "react";

/**
 * Subscribes to a media query.
 *
 * Returns `false` on the server and for the first client render so the two
 * agree, which means it can only drive behaviour that is allowed to settle a
 * frame late — anything that has to be right on the very first paint belongs
 * in a Tailwind responsive variant instead.
 */
export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
