"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Parts = {
  y: number;
  mo: number;
  d: number;
  h: number;
  mi: number;
  s: number;
};

/** Calendar-accurate elapsed time between two dates. */
function elapsed(from: Date, to: Date): Parts {
  let y = to.getFullYear() - from.getFullYear();
  let mo = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  let h = to.getHours() - from.getHours();
  let mi = to.getMinutes() - from.getMinutes();
  let s = to.getSeconds() - from.getSeconds();

  if (s < 0) {
    s += 60;
    mi -= 1;
  }
  if (mi < 0) {
    mi += 60;
    h -= 1;
  }
  if (h < 0) {
    h += 24;
    d -= 1;
  }
  if (d < 0) {
    // Days in the month preceding `to`.
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    mo -= 1;
  }
  if (mo < 0) {
    mo += 12;
    y -= 1;
  }

  return { y, mo, d, h, mi, s };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live "16 y 7 m 22 d 04 h 12 m 33 s" readout.
 * Renders placeholders on the server so hydration stays clean.
 */
export function AgeCounter({
  birthDate,
  className,
}: {
  birthDate: string;
  className?: string;
}) {
  const [parts, setParts] = React.useState<Parts | null>(null);

  React.useEffect(() => {
    const from = new Date(birthDate);
    if (Number.isNaN(from.getTime())) return;

    const update = () => setParts(elapsed(from, new Date()));
    update();

    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [birthDate]);

  const units: Array<[string, string]> = parts
    ? [
        [String(parts.y), "y"],
        [String(parts.mo), "m"],
        [String(parts.d), "d"],
        [pad(parts.h), "h"],
        [pad(parts.mi), "m"],
        [pad(parts.s), "s"],
      ]
    : [
        ["––", "y"],
        ["––", "m"],
        ["––", "d"],
        ["––", "h"],
        ["––", "m"],
        ["––", "s"],
      ];

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm tabular-nums tracking-tight text-white/70 sm:text-base md:text-lg",
        className,
      )}
      aria-label="Time alive"
    >
      {units.map(([value, unit], i) => (
        <span key={i} className="inline-flex items-baseline gap-x-1">
          <span className="text-white">{value}</span>
          <span className="text-white/60">{unit}</span>
        </span>
      ))}
      <span className="text-white/60">old</span>
    </p>
  );
}
