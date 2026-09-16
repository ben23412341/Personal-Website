import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The "BD" monogram, white on transparent so it sits on any background.
 * Cropped to the mark itself: the source still carried a transparent margin
 * that would otherwise eat into the rendered height.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.png"
      alt=""
      aria-hidden="true"
      width={1214}
      height={1066}
      priority
      className={cn("h-9 w-auto", className)}
    />
  );
}
