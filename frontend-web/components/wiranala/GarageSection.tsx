"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { garageCards, marqueeItems, type GarageCard } from "@/lib/team-data";
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

export function GarageSection({
  onSelectDetail,
}: {
  onSelectDetail: (detail: DetailPayload) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLButtonElement>(null);
  const rightCardRef = useRef<HTMLButtonElement>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getFalseSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;

    if (!section || !marquee) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(marquee, { xPercent: 4 }, { xPercent: -14, duration: 1.0 }, 0);

      if (leftCard) {
        tl.fromTo(leftCard, { rotate: -6 }, { rotate: -2, duration: 0.6 }, 0.1);
      }
      if (rightCard) {
        tl.fromTo(rightCard, { rotate: 6 }, { rotate: 2, duration: 0.6 }, 0.1);
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const openCard = (card: GarageCard) => {
    onSelectDetail({
      eyebrow: card.tag,
      title: card.title,
      summary: card.summary,
      items: card.highlights,
    });
  };

  return (
    <section
      id="garage"
      ref={sectionRef}
      className="scroll-mt-20 overflow-hidden bg-[#f4f4ed] py-20 text-[#1d2119] lg:py-28"
    >
      {/* Scroll-linked Partner & Capability Ribbon */}
      <div className="border-y border-[#1d2119]/15 py-5">
        <div
          ref={marqueeRef}
          className="flex w-max items-center gap-8 px-6 will-change-transform lg:gap-14"
        >
          {marqueeItems.map((item) => (
            <span
              key={item}
              className="whitespace-nowrap font-display text-lg font-extrabold uppercase tracking-[0.14em] text-[#4a5041] sm:text-xl"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
        <div className="text-center">
          <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-[#1d2119] sm:text-6xl">
            INSIDE
            <span className="mt-1 block font-editorial font-normal">
              THE GARAGE
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#4a5041]">
            Build milestones and workshop slots ready for your team photography, bench testing logs, and race documentation.
          </p>
        </div>

        {/* Fanned Interactive Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-center">
          {garageCards.map((card, idx) => (
            <button
              key={card.id}
              ref={idx === 0 ? leftCardRef : idx === 2 ? rightCardRef : undefined}
              type="button"
              onClick={() => openCard(card)}
              className={`group flex min-h-[280px] flex-col justify-between rounded-2xl border p-7 text-left shadow-lg transition-transform hover:-translate-y-1.5 ${
                idx === 1
                  ? "border-[#1d2119] bg-[#1d2119] text-[#f4f4ed]"
                  : "border-[#1d2119]/20 bg-white text-[#1d2119] hover:border-[#1d2119]"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em]">
                <span
                  className={idx === 1 ? "text-[#d2ff00]" : "text-[#4a5041]"}
                >
                  {card.tag}
                </span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </div>

              <div className="my-6">
                <h3 className="font-display text-3xl font-extrabold uppercase leading-[0.95]">
                  {card.title}
                </h3>
                <p
                  className={`mt-3 text-sm leading-6 ${
                    idx === 1 ? "text-[#f4f4ed]/80" : "text-[#4a5041]"
                  }`}
                >
                  {card.summary}
                </p>
              </div>

              <div
                className={`border-t pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  idx === 1
                    ? "border-[#f4f4ed]/15 text-[#f4f4ed]/60"
                    : "border-[#1d2119]/10 text-[#4a5041]"
                }`}
              >
                {card.slotNote}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
