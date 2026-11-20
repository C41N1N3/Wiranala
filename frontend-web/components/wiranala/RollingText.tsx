"use client";

import React from "react";

interface RollingTextProps {
  text: string;
  className?: string;
  staggerMs?: number;
}

/**
 * Splits a label into per-character dual tracks that roll vertically in a
 * staggered wave on parent `.group` or `.rolling-trigger` hover/focus.
 */
export function RollingText({
  text,
  className = "",
  staggerMs = 20,
}: RollingTextProps) {
  const chars = Array.from(text);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex leading-[1.1]">
        {chars.map((char, idx) => {
          const display = char === " " ? "\u00A0" : char;
          return (
            <span
              key={`${idx}-${char}`}
              style={{ ["--char-delay" as string]: `${idx * staggerMs}ms` }}
              className="relative inline-block overflow-hidden"
            >
              <span className="rolling-char-primary block">{display}</span>
              <span className="rolling-char-clone absolute left-0 top-full block">
                {display}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
