"use client";

import React from "react";

/**
 * Topographic track contour curves inspired by racing circuit elevation lines.
 * Subtle stroke-only background motif reinforcing the Wiranala motorsport identity.
 */
export function TopoContours({
  strokeColor = "currentColor",
  opacity = 0.14,
  svgRef,
}: {
  strokeColor?: string;
  opacity?: number;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}) {
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
      fill="none"
    >
      <g stroke={strokeColor} strokeOpacity={opacity} strokeWidth="1.25">
        <path d="M-80 220 C 160 80, 420 260, 660 150 C 900 40, 1180 220, 1520 110" />
        <path d="M-120 340 C 180 200, 380 420, 690 290 C 980 170, 1210 380, 1540 250" />
        <path d="M-60 490 C 210 390, 440 590, 740 460 C 1020 340, 1240 560, 1520 430" />
        <path d="M-100 660 C 170 570, 460 760, 790 640 C 1090 530, 1290 730, 1540 610" />
        <path d="M180 -60 C 310 190, 140 440, 340 690 C 480 860, 740 820, 960 960" />
        <path d="M980 -80 C 860 160, 1140 370, 960 610 C 820 790, 1080 890, 1290 980" />
        <ellipse
          cx="1160"
          cy="280"
          rx="180"
          ry="120"
          transform="rotate(-18 1160 280)"
        />
        <ellipse
          cx="260"
          cy="640"
          rx="220"
          ry="135"
          transform="rotate(14 260 640)"
        />
      </g>
    </svg>
  );
}
