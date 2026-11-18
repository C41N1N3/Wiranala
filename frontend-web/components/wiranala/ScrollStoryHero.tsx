"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { TopoContours } from "@/components/wiranala/TopoContours";
import { scrollChapters, teamIdentity, type ScrollChapter } from "@/lib/team-data";

function KartStageDiagram({
  focus,
}: {
  focus: "chassis" | "powertrain" | "telemetry";
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 560 250"
      className="h-auto w-full max-w-[520px]"
      fill="none"
    >
      {/* Track baseline */}
      <line
        x1="36"
        y1="205"
        x2="524"
        y2="205"
        stroke="#f4f4ed"
        strokeOpacity="0.2"
        strokeDasharray="6 6"
      />

      {/* Chassis Spaceframe */}
      <path
        d="M84 166h346l48-26-54-22H260l-42 20H116l-32 28Z"
        stroke={focus === "chassis" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "chassis" ? 1 : 0.45}
        strokeWidth={focus === "chassis" ? 3 : 1.8}
      />
      <path
        d="M214 140l26-52h50l18 52"
        stroke={focus === "chassis" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "chassis" ? 1 : 0.4}
        strokeWidth={focus === "chassis" ? 2.6 : 1.6}
      />

      {/* Sidepod & Nose Cone */}
      <path
        d="M318 114l56 18 110 18c8 2 10 12 2 15l-136 3-32-54Z"
        fill={focus === "chassis" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "chassis" ? 0.2 : 0.08}
        stroke={focus === "chassis" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "chassis" ? 0.95 : 0.35}
        strokeWidth="1.8"
      />

      {/* HV Battery Pack & Rear Electric Motor */}
      <rect
        x="182"
        y="112"
        width="74"
        height="48"
        rx="6"
        fill={focus === "powertrain" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "powertrain" ? 0.24 : 0.07}
        stroke={focus === "powertrain" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "powertrain" ? 1 : 0.35}
        strokeWidth={focus === "powertrain" ? 2.8 : 1.5}
      />
      <rect
        x="96"
        y="118"
        width="56"
        height="38"
        rx="6"
        fill={focus === "powertrain" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "powertrain" ? 0.24 : 0.07}
        stroke={focus === "powertrain" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "powertrain" ? 1 : 0.35}
        strokeWidth={focus === "powertrain" ? 2.8 : 1.5}
      />
      <path
        d="M182 132 C168 132, 162 138, 152 138"
        stroke={focus === "powertrain" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "powertrain" ? 1 : 0.35}
        strokeWidth={focus === "powertrain" ? 3.5 : 1.8}
      />
      <path
        d="M222 122l-8 14h11l-5 14 14-16h-11l5-12h-6Z"
        fill={focus === "powertrain" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "powertrain" ? 1 : 0.4}
      />

      {/* Steering Column, Cockpit & Telemetry Bus Nodes */}
      <line
        x1="340"
        y1="152"
        x2="306"
        y2="98"
        stroke={focus === "telemetry" ? "#d2ff00" : "#f4f4ed"}
        strokeOpacity={focus === "telemetry" ? 1 : 0.45}
        strokeWidth={focus === "telemetry" ? 3 : 2}
      />
      <rect
        x="286"
        y="84"
        width="34"
        height="18"
        rx="4"
        fill={focus === "telemetry" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "telemetry" ? 0.25 : 0.08}
        stroke={focus === "telemetry" ? "#d2ff00" : "#f4f4ed"}
        strokeWidth={focus === "telemetry" ? 2.5 : 1.4}
      />
      <path
        d="M124 156 L220 156 L306 102"
        stroke={focus === "telemetry" ? "#d2ff00" : "transparent"}
        strokeWidth="2.2"
        strokeDasharray="5 4"
      />
      <circle
        cx="124"
        cy="156"
        r="5"
        fill={focus === "telemetry" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "telemetry" ? 1 : 0.3}
      />
      <circle
        cx="220"
        cy="156"
        r="5"
        fill={focus === "telemetry" ? "#d2ff00" : "#f4f4ed"}
        fillOpacity={focus === "telemetry" ? 1 : 0.3}
      />

      {/* Rear & Front Wheel Assemblies */}
      {[
        { cx: 138, cy: 172, r: 30 },
        { cx: 408, cy: 174, r: 28 },
      ].map((w) => (
        <g key={w.cx}>
          <circle
            cx={w.cx}
            cy={w.cy}
            r={w.r}
            fill="#141812"
            stroke="#f4f4ed"
            strokeOpacity="0.65"
            strokeWidth="2.2"
          />
          <circle
            cx={w.cx}
            cy={w.cy}
            r={w.r - 12}
            stroke={focus === "chassis" ? "#d2ff00" : "#f4f4ed"}
            strokeOpacity={focus === "chassis" ? 0.9 : 0.35}
            strokeWidth="1.6"
          />
          <circle cx={w.cx} cy={w.cy} r="5" fill="#d2ff00" />
        </g>
      ))}
    </svg>
  );
}

export function ScrollStoryHero({
  onSelectChapter,
  onThemeChange,
}: {
  onSelectChapter: (chapter: ScrollChapter) => void;
  onThemeChange: (dark: boolean) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    onThemeChange(latest >= 0.17);
    if (latest < 0.48) setActiveIndex(0);
    else if (latest < 0.74) setActiveIndex(1);
    else setActiveIndex(2);
  });

  // Smooth Lando-style canvas background morph from #f4f4ed stone -> #282c20 olive charcoal
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25, 1],
    ["#f4f4ed", "#f4f4ed", "#282c20", "#282c20"]
  );

  // Opening Hero typography exit on scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -72]);
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.94]);

  // Volt-lime signature/circuit stroke draws across the canvas as you scroll
  const strokeDraw = useTransform(scrollYProgress, [0.14, 0.44], [0, 1]);
  const strokeOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.22, 0.9, 0.99],
    [0, 0.8, 0.8, 0]
  );

  // Pinned kart centerpiece: enters, shifts into opposite half from active text, fades out cleanly
  const kartOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.22, 0.92, 0.99],
    [0, 1, 1, 0]
  );
  const kartScale = useTransform(
    scrollYProgress,
    [0.14, 0.27, 0.92, 0.99],
    [0.84, 1, 1, 0.92]
  );
  const kartX = useTransform(
    scrollYProgress,
    [0.2, 0.28, 0.44, 0.52, 0.68, 0.76, 0.94],
    ["0%", "22%", "22%", "-22%", "-22%", "22%", "22%"]
  );

  // 3 Chapters that come and go smoothly along scroll with zero overlap collision
  const ch1Opacity = useTransform(
    scrollYProgress,
    [0.23, 0.28, 0.42, 0.46],
    [0, 1, 1, 0]
  );
  const ch1Y = useTransform(
    scrollYProgress,
    [0.24, 0.3, 0.44, 0.5],
    [40, 0, 0, -40]
  );

  const ch2Opacity = useTransform(
    scrollYProgress,
    [0.49, 0.54, 0.66, 0.7],
    [0, 1, 1, 0]
  );
  const ch2Y = useTransform(
    scrollYProgress,
    [0.48, 0.54, 0.68, 0.74],
    [40, 0, 0, -40]
  );

  const ch3Opacity = useTransform(
    scrollYProgress,
    [0.73, 0.78, 0.92, 0.98],
    [0, 1, 1, 0]
  );
  const ch3Y = useTransform(
    scrollYProgress,
    [0.72, 0.78, 0.89, 0.95],
    [40, 0, 0, -40]
  );

  const contourParallax = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const activeChapter = scrollChapters[activeIndex];

  const scrollToFraction = (fraction: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const targetY =
      docTop + (trackRef.current.offsetHeight - window.innerHeight) * fraction;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section
      id="scroll-story"
      ref={trackRef}
      aria-label="Wiranala EV Gokart ITS scroll showcase"
      className="relative"
    >
      {/* Desktop & Tablet Pinned Scrollytelling Track */}
      {!prefersReducedMotion && (
        <div className="relative hidden md:block md:h-[340vh]">
          <motion.div
            style={{ backgroundColor: bgColor }}
            className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden"
          >
            <TopoContours
              strokeColor="#7b806c"
              opacity={0.22}
              parallaxY={contourParallax}
            />

            {/* Volt Signature / Circuit Stroke Path drawn by scroll */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 1200 500"
              style={{ opacity: strokeOpacity }}
              className="pointer-events-none absolute inset-0 m-auto h-auto w-[92%] max-w-[1160px]"
              fill="none"
            >
              <motion.path
                d="M70 360 C 260 110, 420 430, 590 220 C 740 40, 820 390, 1080 120"
                stroke="#d2ff00"
                strokeWidth="7"
                strokeLinecap="round"
                style={{ pathLength: strokeDraw }}
              />
            </motion.svg>

            {/* Opening Hero Screen (fades out as user scrolls in) */}
            <motion.div
              style={{
                opacity: heroOpacity,
                y: heroY,
                scale: heroScale,
              }}
              className="relative z-20 flex h-full w-full max-w-[1360px] flex-col justify-between px-6 pb-10 pt-28 lg:px-10"
            >
              <div className="my-auto text-center">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.26em] text-[#4a5041]">
                  {teamIdentity.institution} · {teamIdentity.city}
                </p>
                <h1 className="mt-4 font-display text-[clamp(3.75rem,10vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.02em] text-[#1d2119]">
                  WIRANALA
                  <span className="mt-1 block font-editorial text-[clamp(2.4rem,6vw,5.25rem)] font-normal tracking-normal text-[#1d2119]">
                    EV Gokart ITS
                  </span>
                </h1>
              </div>

              <div className="flex items-end justify-between">
                {/* Lando-style bottom-left telemetry corner card */}
                <div className="rounded-lg border border-[#1d2119]/25 bg-[#f4f4ed]/90 p-4 text-left text-[#1d2119]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a5041]">
                    HOME BASE
                  </div>
                  <div className="mt-1 font-display text-lg font-extrabold uppercase tracking-tight">
                    ITS SURABAYA
                  </div>
                  <div className="mt-0.5 text-xs text-[#4a5041]">
                    Electric Karting Team
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToFraction(0.35)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#1d2119]/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1d2119] transition-colors hover:border-[#1d2119] hover:bg-[#1d2119] hover:text-[#f4f4ed]"
                >
                  <span>Scroll Story</span>
                  <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Pinned EV Kart Centerpiece */}
            <motion.div
              style={{
                opacity: kartOpacity,
                scale: kartScale,
                x: kartX,
              }}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6"
            >
              <div className="w-[46%] max-w-[520px] rounded-2xl border border-[#f4f4ed]/15 bg-[#1b1f17]/94 p-6 shadow-2xl lg:p-7">
                <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
                  <span>{activeChapter.eyebrow}</span>
                  <span>{activeChapter.index} / 03</span>
                </div>
                <KartStageDiagram focus={activeChapter.visualFocus} />
                <div className="mt-3 text-center text-xs text-[#f4f4ed]/65">
                  CAD Stage Preview (Swap with Team Kart Photo or 3D Render)
                </div>
              </div>
            </motion.div>

            {/* Chapter 1 Overlay (Left Half) */}
            <motion.div
              style={{ opacity: ch1Opacity, y: ch1Y }}
              className="pointer-events-none absolute inset-x-0 z-20 mx-auto max-w-[1320px] px-6 lg:px-10"
            >
              <div className="w-[44%] max-w-[460px] rounded-xl border border-[#f4f4ed]/15 bg-[#282c20]/95 p-7 text-[#f4f4ed] shadow-xl">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#d2ff00]">
                  {scrollChapters[0].index} / {scrollChapters[0].eyebrow}
                </div>
                <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-[0.9] text-[#f4f4ed] lg:text-5xl">
                  {scrollChapters[0].title}{" "}
                  <span className="font-editorial font-normal text-[#d2ff00]">
                    {scrollChapters[0].serifWord}
                  </span>
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#f4f4ed]/80">
                  {scrollChapters[0].summary}
                </p>
              </div>
            </motion.div>

            {/* Chapter 2 Overlay (Right Half) */}
            <motion.div
              style={{ opacity: ch2Opacity, y: ch2Y }}
              className="pointer-events-none absolute inset-x-0 z-20 mx-auto flex max-w-[1320px] justify-end px-6 lg:px-10"
            >
              <div className="w-[44%] max-w-[460px] rounded-xl border border-[#f4f4ed]/15 bg-[#282c20]/95 p-7 text-[#f4f4ed] shadow-xl">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#d2ff00]">
                  {scrollChapters[1].index} / {scrollChapters[1].eyebrow}
                </div>
                <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-[0.9] text-[#f4f4ed] lg:text-5xl">
                  {scrollChapters[1].title}{" "}
                  <span className="font-editorial font-normal text-[#d2ff00]">
                    {scrollChapters[1].serifWord}
                  </span>
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#f4f4ed]/80">
                  {scrollChapters[1].summary}
                </p>
              </div>
            </motion.div>

            {/* Chapter 3 Overlay (Left Half) */}
            <motion.div
              style={{ opacity: ch3Opacity, y: ch3Y }}
              className="pointer-events-none absolute inset-x-0 z-20 mx-auto max-w-[1320px] px-6 lg:px-10"
            >
              <div className="w-[44%] max-w-[460px] rounded-xl border border-[#f4f4ed]/15 bg-[#282c20]/95 p-7 text-[#f4f4ed] shadow-xl">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#d2ff00]">
                  {scrollChapters[2].index} / {scrollChapters[2].eyebrow}
                </div>
                <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-[0.9] text-[#f4f4ed] lg:text-5xl">
                  {scrollChapters[2].title}{" "}
                  <span className="font-editorial font-normal text-[#d2ff00]">
                    {scrollChapters[2].serifWord}
                  </span>
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#f4f4ed]/80">
                  {scrollChapters[2].summary}
                </p>
              </div>
            </motion.div>

            {/* Interactive Chapter Stepper & Inspect Button */}
            <motion.div
              style={{ opacity: kartOpacity }}
              className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#f4f4ed]/20 bg-[#1b1f17]/90 p-1.5 backdrop-blur-sm"
            >
              {scrollChapters.map((chap, idx) => {
                const isActive = idx === activeIndex;
                const jumpPos = idx === 0 ? 0.37 : idx === 1 ? 0.61 : 0.83;
                return (
                  <button
                    key={chap.index}
                    type="button"
                    onClick={() => scrollToFraction(jumpPos)}
                    aria-current={isActive ? "step" : undefined}
                    className={`min-h-[44px] rounded-full px-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#d2ff00] text-[#11140d]"
                        : "text-[#f4f4ed]/80 hover:text-[#d2ff00]"
                    }`}
                  >
                    {chap.index} · {chap.serifWord}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => onSelectChapter(activeChapter)}
                className="min-h-[44px] rounded-full border border-[#f4f4ed]/25 px-4 text-xs font-semibold uppercase tracking-wider text-[#f4f4ed] hover:border-[#d2ff00] hover:text-[#d2ff00]"
              >
                Specs
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Mobile & Reduced-Motion Reflowed Story Sequence (No Tall Empty Scroll Trap) */}
      <div
        className={`${
          prefersReducedMotion ? "block" : "md:hidden"
        } bg-[#f4f4ed] text-[#1d2119]`}
      >
        <div className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6">
          <TopoContours strokeColor="#4a5041" opacity={0.16} />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4a5041]">
              {teamIdentity.institution}
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-[#1d2119] sm:text-6xl">
              WIRANALA
              <span className="mt-1 block font-editorial text-4xl font-normal tracking-normal">
                EV Gokart ITS
              </span>
            </h1>
          </div>
        </div>

        <div className="space-y-5 bg-[#282c20] px-4 py-12 text-[#f4f4ed] sm:px-6">
          {scrollChapters.map((chap) => (
            <motion.article
              key={chap.index}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="rounded-xl border border-[#f4f4ed]/15 bg-[#1b1f17] p-5"
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
                {chap.index} / {chap.eyebrow}
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase text-[#f4f4ed]">
                {chap.title}{" "}
                <span className="font-editorial font-normal text-[#d2ff00]">
                  {chap.serifWord}
                </span>
              </h2>
              <div className="my-4">
                <KartStageDiagram focus={chap.visualFocus} />
              </div>
              <p className="text-sm leading-6 text-[#f4f4ed]/80">
                {chap.summary}
              </p>
              <button
                type="button"
                onClick={() => onSelectChapter(chap)}
                className="mt-4 min-h-[44px] rounded-md bg-[#d2ff00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#11140d]"
              >
                Inspect {chap.serifWord}
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
