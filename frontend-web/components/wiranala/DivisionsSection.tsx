"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { teamDivisions, type TeamDivision } from "@/lib/team-data";
import type { DetailPayload } from "@/components/wiranala/ParallaxStorySection";

gsap.registerPlugin(ScrollTrigger);

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getFalseSnapshot() {
  return false;
}

function DivisionEmblem({ code }: { code: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 80"
      className="h-20 w-28 text-[#f4f4ed]"
      fill="none"
    >
      <path
        d="M22 58 L38 22 H84 L98 58 Z"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2"
      />
      <path
        d="M36 42 H84"
        stroke="#d2ff00"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x="60"
        y="34"
        textAnchor="middle"
        fill="#f4f4ed"
        fontSize="13"
        fontWeight="700"
        letterSpacing="2"
      >
        {code}
      </text>
    </svg>
  );
}

export function DivisionsSection({
  onSelectDetail,
}: {
  onSelectDetail: (detail: DetailPayload) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getFalseSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-division-card]");
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, grid);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const handleOpen = (div: TeamDivision) => {
    onSelectDetail({
      eyebrow: `DIVISION ${div.code} / ${div.department}`,
      title: div.title,
      summary: div.summary,
      items: div.highlights,
    });
  };

  return (
    <section
      id="divisions"
      className="scroll-mt-20 bg-[#111310] px-4 py-20 text-[#f4f4ed] sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-6 border-b border-[#f4f4ed]/15 pb-12 lg:grid-cols-2 lg:items-end">
          <div>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.88] tracking-tight sm:text-6xl">
              DIVISIONS
              <span className="mt-1 block font-editorial font-normal text-[#d2ff00]">
                Engineering Hall
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#f4f4ed]/75 lg:justify-self-end">
            Four focused student squads inside Wiranala EV Gokart ITS collaborating from CAD architecture through circuit shakedown.
          </p>
        </div>

        {/* Chamfered Dark Cards with GSAP Staggered ScrollTrigger Reveal */}
        <div
          ref={gridRef}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {teamDivisions.map((div) => (
            <button
              key={div.code}
              data-division-card
              type="button"
              onClick={() => handleOpen(div)}
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%)",
              }}
              className="group relative flex min-h-[290px] flex-col justify-between border border-[#f4f4ed]/15 bg-[#181b15] p-6 text-left transition-colors hover:border-[#d2ff00] hover:bg-[#1e221a]"
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em]">
                <span className="text-[#f4f4ed]/60">{div.department}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-[#d2ff00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <div className="my-6 flex justify-center">
                <DivisionEmblem code={div.code} />
              </div>

              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#f4f4ed]">
                  {div.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-[#f4f4ed]/70">
                  {div.summary}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[#f4f4ed]/10 pt-3 text-xs font-bold uppercase tracking-wider">
                  <span className="text-[#f4f4ed]/55">Division</span>
                  <span className="text-[#d2ff00]">{div.code}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
