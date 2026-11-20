"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { KartCanvas3D } from "@/components/wiranala/KartCanvas3D";
import { RollingText } from "@/components/wiranala/RollingText";
import { useSmoothScroll } from "@/components/wiranala/SmoothScrollProvider";
import { TopoContours } from "@/components/wiranala/TopoContours";
import {
  kartModelConfig,
  scrollChapters,
  teamIdentity,
  type ScrollChapter,
} from "@/lib/team-data";

gsap.registerPlugin(ScrollTrigger);

function subscribeDesktop(onChange: () => void) {
  const mql = window.matchMedia("(min-width: 768px)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 768px)").matches;
}

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
  const { scrollTo } = useSmoothScroll();
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getFalseSnapshot
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getFalseSnapshot
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileFocusIdx, setMobileFocusIdx] = useState(0);

  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contoursRef = useRef<SVGSVGElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const strokeSvgRef = useRef<SVGSVGElement>(null);
  const strokePathRef = useRef<SVGPathElement>(null);
  const kartWrapRef = useRef<HTMLDivElement>(null);
  const ch1Ref = useRef<HTMLDivElement>(null);
  const ch2Ref = useRef<HTMLDivElement>(null);
  const ch3Ref = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const mobileProgressRef = useRef(0.28);
  const lastIdxRef = useRef(0);
  const onThemeChangeRef = useRef(onThemeChange);

  useEffect(() => {
    onThemeChangeRef.current = onThemeChange;
  }, [onThemeChange]);

  useEffect(() => {
    if (prefersReducedMotion || !isDesktop) return;
    const track = desktopTrackRef.current;
    const bg = bgRef.current;
    const contours = contoursRef.current;
    const hero = heroRef.current;
    const strokeSvg = strokeSvgRef.current;
    const strokePath = strokePathRef.current;
    const kartWrap = kartWrapRef.current;
    const ch1 = ch1Ref.current;
    const ch2 = ch2Ref.current;
    const ch3 = ch3Ref.current;
    const stepper = stepperRef.current;

    if (
      !track ||
      !bg ||
      !contours ||
      !hero ||
      !strokeSvg ||
      !strokePath ||
      !kartWrap ||
      !ch1 ||
      !ch2 ||
      !ch3 ||
      !stepper
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const pathLen = strokePath.getTotalLength();
      gsap.set(strokePath, {
        strokeDasharray: pathLen,
        strokeDashoffset: pathLen,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;
            onThemeChangeRef.current(p >= 0.17);
            const nextIdx = p < 0.48 ? 0 : p < 0.74 ? 1 : 2;
            if (lastIdxRef.current !== nextIdx) {
              lastIdxRef.current = nextIdx;
              setActiveIndex(nextIdx);
            }
          },
        },
      });

      // Background morph #f4f4ed stone -> #282c20 olive
      tl.fromTo(
        bg,
        { backgroundColor: "#f4f4ed" },
        { backgroundColor: "#282c20", duration: 0.13 },
        0.11
      );

      // Topographic contours parallax span (0 -> 1.0 anchors exact timeline length)
      tl.fromTo(contours, { y: 0 }, { y: -90, duration: 1.0 }, 0);

      // Opening hero exit
      tl.fromTo(
        hero,
        { opacity: 1, y: 0, scale: 1 },
        { opacity: 0, y: -72, scale: 0.94, duration: 0.14 },
        0.06
      );

      // Volt circuit stroke reveal & exit
      tl.fromTo(
        strokeSvg,
        { opacity: 0 },
        { opacity: 0.8, duration: 0.1 },
        0.12
      );
      tl.to(
        strokeSvg,
        { opacity: 0, duration: 0.09, immediateRender: false },
        0.9
      );
      tl.to(strokePath, { strokeDashoffset: 0, duration: 0.3 }, 0.14);

      // Pinned 3D EV Kart choreography (alternating opposite to active chapter card)
      tl.fromTo(
        kartWrap,
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0.14
      );
      tl.to(
        kartWrap,
        { opacity: 0, duration: 0.07, immediateRender: false },
        0.92
      );

      tl.fromTo(
        kartWrap,
        { scale: 0.86 },
        { scale: 1, duration: 0.12 },
        0.14
      );
      tl.to(
        kartWrap,
        { scale: 0.92, duration: 0.07, immediateRender: false },
        0.92
      );

      tl.fromTo(
        kartWrap,
        { xPercent: 0 },
        { xPercent: 22, duration: 0.08 },
        0.2
      );
      tl.to(
        kartWrap,
        { xPercent: -22, duration: 0.08, immediateRender: false },
        0.44
      );
      tl.to(
        kartWrap,
        { xPercent: 22, duration: 0.08, immediateRender: false },
        0.68
      );

      // Chapter 1 (Left Half, 0.23..0.46)
      tl.fromTo(
        ch1,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.05 },
        0.23
      );
      tl.to(
        ch1,
        { opacity: 0, y: -36, duration: 0.04, immediateRender: false },
        0.42
      );

      // Chapter 2 (Right Half, 0.49..0.70)
      tl.fromTo(
        ch2,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.05 },
        0.49
      );
      tl.to(
        ch2,
        { opacity: 0, y: -36, duration: 0.04, immediateRender: false },
        0.66
      );

      // Chapter 3 (Left Half, 0.73..0.98)
      tl.fromTo(
        ch3,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.05 },
        0.73
      );
      tl.to(
        ch3,
        { opacity: 0, y: -36, duration: 0.06, immediateRender: false },
        0.92
      );

      // Interactive stepper visibility
      tl.fromTo(
        stepper,
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0.14
      );
      tl.to(
        stepper,
        { opacity: 0, duration: 0.07, immediateRender: false },
        0.92
      );
    }, track);

    return () => {
      ctx.revert();
    };
  }, [isDesktop, prefersReducedMotion]);

  const activeChapter = scrollChapters[activeIndex] ?? scrollChapters[0];
  const mobileActiveChapter = scrollChapters[mobileFocusIdx] ?? scrollChapters[0];

  const scrollToFraction = (fraction: number) => {
    const el = desktopTrackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const targetY = docTop + (el.offsetHeight - window.innerHeight) * fraction;
    scrollTo(targetY);
  };

  return (
    <section
      id="scroll-story"
      aria-label="Wiranala EV Gokart ITS scroll showcase"
      className="relative"
    >
      {/* Desktop & Tablet Pinned GSAP ScrollTrigger Track */}
      {!prefersReducedMotion && (
        <div
          ref={desktopTrackRef}
          className="relative hidden md:block md:h-[340vh]"
        >
          <div
            ref={bgRef}
            className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#f4f4ed]"
          >
            <TopoContours
              strokeColor="#7b806c"
              opacity={0.22}
              svgRef={contoursRef}
            />

            {/* Volt Signature / Circuit Stroke Path scrubbed by scroll */}
            <svg
              ref={strokeSvgRef}
              aria-hidden="true"
              viewBox="0 0 1200 500"
              className="pointer-events-none absolute inset-0 m-auto h-auto w-[92%] max-w-[1160px] opacity-0"
              fill="none"
            >
              <path
                ref={strokePathRef}
                d="M70 360 C 260 110, 420 430, 590 220 C 740 40, 820 390, 1080 120"
                stroke="#d2ff00"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>

            {/* Opening Hero Screen (fades out as user scrolls in) */}
            <div
              ref={heroRef}
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
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#1d2119]/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1d2119] transition-colors hover:border-[#1d2119] hover:bg-[#1d2119] hover:text-[#f4f4ed]"
                >
                  <RollingText text="Scroll Story" />
                  <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Pinned 3D EV Kart Centerpiece */}
            <div
              ref={kartWrapRef}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 opacity-0"
            >
              <div className="pointer-events-auto w-[46%] max-w-[520px] rounded-2xl border border-[#f4f4ed]/15 bg-[#1b1f17]/94 p-5 shadow-2xl lg:p-6">
                <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
                  <span>{activeChapter.eyebrow}</span>
                  <span>{activeChapter.index} / 03</span>
                </div>
                <div className="h-[230px] w-full overflow-hidden rounded-xl border border-[#f4f4ed]/10 bg-[radial-gradient(circle_at_50%_40%,rgba(210,255,0,0.08),rgba(20,24,18,0.96))] lg:h-[268px]">
                  {isDesktop ? (
                    <KartCanvas3D
                      progressRef={progressRef}
                      focus={activeChapter.visualFocus}
                      modelUrl={kartModelConfig.glbPath}
                      fallback={
                        <div className="flex h-full items-center justify-center p-4">
                          <KartStageDiagram focus={activeChapter.visualFocus} />
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4">
                      <KartStageDiagram focus={activeChapter.visualFocus} />
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center text-xs text-[#f4f4ed]/70">
                  {kartModelConfig.stageNote}
                </div>
              </div>
            </div>

            {/* Chapter 1 Overlay (Left Half) */}
            <div
              ref={ch1Ref}
              className="pointer-events-none absolute inset-x-0 z-20 mx-auto max-w-[1320px] px-6 opacity-0 lg:px-10"
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
            </div>

            {/* Chapter 2 Overlay (Right Half) */}
            <div
              ref={ch2Ref}
              className="pointer-events-none absolute inset-x-0 z-20 mx-auto flex max-w-[1320px] justify-end px-6 opacity-0 lg:px-10"
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
            </div>

            {/* Chapter 3 Overlay (Left Half) */}
            <div
              ref={ch3Ref}
              className="pointer-events-none absolute inset-x-0 z-20 mx-auto max-w-[1320px] px-6 opacity-0 lg:px-10"
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
            </div>

            {/* Interactive Chapter Stepper & Inspect Button */}
            <div
              ref={stepperRef}
              className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#f4f4ed]/20 bg-[#1b1f17]/90 p-1.5 opacity-0 backdrop-blur-sm"
            >
              {scrollChapters.map((chap, idx) => {
                const isActive = idx === activeIndex;
                const jumpPos = idx === 0 ? 0.35 : idx === 1 ? 0.6 : 0.85;
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
                className="group min-h-[44px] rounded-full border border-[#f4f4ed]/25 px-4 text-xs font-semibold uppercase tracking-wider text-[#f4f4ed] hover:border-[#d2ff00] hover:text-[#d2ff00]"
              >
                <RollingText text="Specs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile & Reduced-Motion Reflowed Story Sequence */}
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
          {/* Single interactive WebGL showcase card for Mobile */}
          {!isDesktop && !prefersReducedMotion && (
            <div className="rounded-xl border border-[#f4f4ed]/15 bg-[#1b1f17] p-4">
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
                <span>{mobileActiveChapter.eyebrow}</span>
                <span>{mobileActiveChapter.index} / 03</span>
              </div>
              <div className="h-[220px] w-full overflow-hidden rounded-lg border border-[#f4f4ed]/10 bg-[#141812]">
                <KartCanvas3D
                  progressRef={mobileProgressRef}
                  focus={mobileActiveChapter.visualFocus}
                  modelUrl={kartModelConfig.glbPath}
                  fallback={
                    <div className="flex h-full items-center justify-center p-4">
                      <KartStageDiagram focus={mobileActiveChapter.visualFocus} />
                    </div>
                  }
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {scrollChapters.map((chap, idx) => (
                  <button
                    key={chap.index}
                    type="button"
                    onClick={() => {
                      mobileProgressRef.current =
                        idx === 0 ? 0.28 : idx === 1 ? 0.56 : 0.84;
                      setMobileFocusIdx(idx);
                    }}
                    className={`min-h-[44px] flex-1 rounded-md px-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                      idx === mobileFocusIdx
                        ? "bg-[#d2ff00] text-[#11140d]"
                        : "border border-[#f4f4ed]/20 text-[#f4f4ed]/85"
                    }`}
                  >
                    {chap.index} · {chap.serifWord}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-center text-[11px] text-[#f4f4ed]/65">
                {kartModelConfig.stageNote}
              </div>
            </div>
          )}

          {scrollChapters.map((chap) => (
            <article
              key={chap.index}
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
                className="group mt-4 min-h-[44px] rounded-md bg-[#d2ff00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#11140d]"
              >
                <RollingText text={`Inspect ${chap.serifWord}`} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
