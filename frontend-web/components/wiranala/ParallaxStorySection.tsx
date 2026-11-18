"use client";

import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TopoContours } from "@/components/wiranala/TopoContours";
import { storyFrames, type StoryFrame } from "@/lib/team-data";

export interface DetailPayload {
  eyebrow: string;
  title: string;
  summary: string;
  items: string[];
}

function FrameIllustration({ id }: { id: string }) {
  if (id === "frame-chassis") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 280 140"
        className="h-28 w-full text-[#d2ff00]"
        fill="none"
      >
        <path
          d="M36 100h194l24-18-32-22H128l-28 16H52l-16 24Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle cx="78" cy="104" r="20" stroke="#f4f4ed" strokeWidth="2.2" />
        <circle cx="212" cy="104" r="20" stroke="#f4f4ed" strokeWidth="2.2" />
      </svg>
    );
  }
  if (id === "frame-battery") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 280 140"
        className="h-28 w-full text-[#d2ff00]"
        fill="none"
      >
        <rect
          x="52"
          y="34"
          width="84"
          height="72"
          rx="6"
          stroke="#f4f4ed"
          strokeWidth="2"
        />
        <path
          d="M96 48l-10 18h14l-7 18 17-20H96l7-16h-7Z"
          fill="currentColor"
        />
        <line
          x1="136"
          y1="70"
          x2="174"
          y2="70"
          stroke="currentColor"
          strokeWidth="3"
        />
        <rect
          x="174"
          y="42"
          width="58"
          height="56"
          rx="6"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
  if (id === "frame-telemetry") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 280 140"
        className="h-28 w-full text-[#d2ff00]"
        fill="none"
      >
        <rect
          x="44"
          y="26"
          width="192"
          height="88"
          rx="8"
          stroke="#f4f4ed"
          strokeWidth="2"
        />
        <path
          d="M62 88l34-24 26 14 38-36 30 20 28-24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 280 140"
      className="h-28 w-full text-[#d2ff00]"
      fill="none"
    >
      <path
        d="M36 96 C 90 36, 180 118, 244 42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="96" cy="64" r="5" fill="#f4f4ed" />
      <circle cx="186" cy="78" r="5" fill="#f4f4ed" />
    </svg>
  );
}

export function ParallaxStorySection({
  onSelectDetail,
}: {
  onSelectDetail: (detail: DetailPayload) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Lando-style canvas transition: #282c20 -> #535849 -> #f4f4ed
  const bgTransition = useTransform(
    scrollYProgress,
    [0, 0.32, 0.62, 0.85],
    ["#282c20", "#282c20", "#535849", "#f4f4ed"]
  );

  const line1X = useTransform(scrollYProgress, [0, 0.55], [-40, 28]);
  const line2X = useTransform(scrollYProgress, [0, 0.55], [40, -28]);
  const colSlowY = useTransform(scrollYProgress, [0.2, 0.9], [28, -28]);
  const colFastY = useTransform(scrollYProgress, [0.2, 0.9], [68, -68]);

  const toDetail = (frame: StoryFrame): DetailPayload => ({
    eyebrow: frame.tag,
    title: frame.title,
    summary: frame.summary,
    items: frame.highlights,
  });

  return (
    <motion.section
      id="parallax-story"
      ref={sectionRef}
      style={prefersReducedMotion ? { backgroundColor: "#282c20" } : { backgroundColor: bgTransition }}
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-32"
    >
      <TopoContours strokeColor="#f4f4ed" opacity={0.11} />

      <div className="relative z-10 mx-auto max-w-[1320px]">
        {/* Kinetic Statement Band matching lando-2.png */}
        <div className="py-10 text-center text-[#f4f4ed] lg:py-16">
          <motion.div style={prefersReducedMotion ? undefined : { x: line1X }}>
            <h2 className="font-display text-[clamp(2.5rem,7.2vw,6.25rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
              BUILDING ELECTRIC
            </h2>
          </motion.div>

          <motion.div style={prefersReducedMotion ? undefined : { x: line2X }}>
            <div className="font-display text-[clamp(2.5rem,7.2vw,6.25rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
              <span className="font-editorial font-normal text-[#d2ff00]">
                LEGACY
              </span>{" "}
              AT ITS SURABAYA
            </div>
          </motion.div>
        </div>

        {/* Editorial Quote + Asymmetric Parallax Cards matching lando-3/4.png */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[#f4f4ed]/15 bg-[#1d2119]/92 p-7 text-[#f4f4ed] shadow-xl">
              <p className="font-editorial text-2xl leading-snug text-[#f4f4ed] sm:text-3xl">
                &ldquo;From the workshop floor at ITS Surabaya, we build electric karting from chassis to telemetry.&rdquo;
              </p>

              {/* Volt stroke mark */}
              <svg
                aria-hidden="true"
                viewBox="0 0 180 34"
                className="mt-5 h-7 w-32 text-[#d2ff00]"
                fill="none"
              >
                <path
                  d="M6 26 C 36 4, 58 30, 88 12 C 110 2, 134 26, 172 8"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            <motion.div
              style={prefersReducedMotion ? undefined : { y: colSlowY }}
              className="space-y-6"
            >
              {[storyFrames[0], storyFrames[2]].map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => onSelectDetail(toDetail(frame))}
                  className="group block w-full rounded-xl border border-[#f4f4ed]/15 bg-[#1d2119] p-6 text-left text-[#f4f4ed] shadow-xl transition-transform hover:-translate-y-1 hover:border-[#d2ff00]"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-[#d2ff00]">
                    <span>{frame.tag}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <div className="my-5 rounded-lg bg-[#141711] p-4">
                    <FrameIllustration id={frame.id} />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                    {frame.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#f4f4ed]/75">
                    {frame.summary}
                  </p>
                  <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f4f4ed]/55">
                    {frame.slotNote}
                  </div>
                </button>
              ))}
            </motion.div>

            <motion.div
              style={prefersReducedMotion ? undefined : { y: colFastY }}
              className="space-y-6 sm:pt-10"
            >
              {[storyFrames[1], storyFrames[3]].map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => onSelectDetail(toDetail(frame))}
                  className="group block w-full rounded-xl border border-[#f4f4ed]/15 bg-[#1d2119] p-6 text-left text-[#f4f4ed] shadow-xl transition-transform hover:-translate-y-1 hover:border-[#d2ff00]"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-[#d2ff00]">
                    <span>{frame.tag}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <div className="my-5 rounded-lg bg-[#141711] p-4">
                    <FrameIllustration id={frame.id} />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                    {frame.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#f4f4ed]/75">
                    {frame.summary}
                  </p>
                  <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f4f4ed]/55">
                    {frame.slotNote}
                  </div>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
