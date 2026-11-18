"use client";

import React, { useState } from "react";
import { sponsorCategories, teamIdentity } from "@/lib/team-data";

export function Footer({ onOpenContact }: { onOpenContact: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState(
    sponsorCategories[0].category
  );

  const activeGroup =
    sponsorCategories.find((c) => c.category === selectedCategory) ??
    sponsorCategories[0];

  return (
    <footer
      id="sponsors"
      className="scroll-mt-20 bg-gradient-to-b from-[#f4f4ed] via-[#e7f896] to-[#d2ff00] pt-10 text-[#f4f4ed]"
    >
      {/* Signature Top-Notched Dark Footer Container matching lando-deep-3.png */}
      <div className="relative mx-auto max-w-[1440px]">
        <div
          aria-hidden="true"
          className="mx-auto h-7 w-56 rounded-t-3xl bg-[#1d2119]"
        />

        <div className="rounded-t-3xl bg-[#1d2119] px-4 pb-12 pt-14 sm:px-8 lg:px-14">
          {/* Center Signature & Stacked Editorial Statement */}
          <div className="mx-auto max-w-2xl text-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 180 34"
              className="mx-auto h-7 w-32 text-[#d2ff00]"
              fill="none"
            >
              <path
                d="M6 26 C 36 4, 58 30, 88 12 C 110 2, 134 26, 172 8"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-[#f4f4ed] sm:text-6xl">
              ALWAYS{" "}
              <span className="font-editorial font-normal text-[#d2ff00]">
                PUSHING
              </span>
              <br />
              THE{" "}
              <span className="font-editorial font-normal text-[#d2ff00]">
                CHARGE.
              </span>
            </h2>
          </div>

          {/* Left Navigation / Right Team & Sponsor Columns */}
          <div className="mt-14 grid gap-10 border-t border-[#f4f4ed]/15 pt-10 md:grid-cols-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4f4ed]/50">
                Sections
              </div>
              <ul className="mt-4 space-y-2 font-display text-2xl font-extrabold uppercase tracking-tight">
                <li>
                  <a href="#scroll-story" className="hover:text-[#d2ff00]">
                    Story
                  </a>
                </li>
                <li>
                  <a href="#parallax-story" className="hover:text-[#d2ff00]">
                    Engineering
                  </a>
                </li>
                <li>
                  <a href="#divisions" className="hover:text-[#d2ff00]">
                    Divisions
                  </a>
                </li>
                <li>
                  <a href="#garage" className="hover:text-[#d2ff00]">
                    Garage
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:text-right">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f4f4ed]/50">
                Team Base
              </div>
              <div className="mt-4 font-display text-2xl font-extrabold uppercase tracking-tight text-[#f4f4ed]">
                {teamIdentity.name}
              </div>
              <p className="mt-2 text-sm text-[#f4f4ed]/75">
                {teamIdentity.institution}
                <br />
                {teamIdentity.city}
              </p>
              <button
                type="button"
                onClick={onOpenContact}
                className="mt-5 min-h-[44px] rounded-md bg-[#d2ff00] px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-[#11140d] hover:bg-[#dcff33]"
              >
                Partner / Contact Team
              </button>
            </div>
          </div>

          {/* Interactive Sponsor Category Drawer */}
          <div className="mt-12 border-t border-[#f4f4ed]/15 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4f4ed]/60">
                Sponsors &amp; Support Categories
              </span>
              <div
                role="tablist"
                aria-label="Sponsor categories"
                className="flex flex-wrap gap-2"
              >
                {sponsorCategories.map((group) => {
                  const isSelected = group.category === activeGroup.category;
                  return (
                    <button
                      key={group.category}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(group.category)}
                      className={`min-h-[44px] rounded-md border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isSelected
                          ? "border-[#d2ff00] bg-[#d2ff00] text-[#11140d]"
                          : "border-[#f4f4ed]/20 text-[#f4f4ed]/80 hover:border-[#d2ff00]"
                      }`}
                    >
                      {group.category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              role="tabpanel"
              aria-label={`${activeGroup.category} sponsors`}
              className="mt-4 rounded-xl border border-[#f4f4ed]/15 bg-[#151812] p-5"
            >
              {activeGroup.entries.map((entry) => (
                <div
                  key={entry.name}
                  className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="text-sm font-bold text-[#f4f4ed]">
                      {entry.name}
                    </div>
                    <div className="mt-1 text-xs text-[#f4f4ed]/70">
                      {entry.role} · {entry.note}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="min-h-[44px] shrink-0 rounded-md border border-[#f4f4ed]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f4f4ed] hover:border-[#d2ff00] hover:text-[#d2ff00]"
                  >
                    Inquire
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-[#f4f4ed]/15 pt-6 text-center text-xs text-[#f4f4ed]/55 sm:flex sm:items-center sm:justify-between sm:text-left">
            <p>© 2026 {teamIdentity.name}. All Rights Reserved.</p>
            <p className="mt-2 sm:mt-0">{teamIdentity.institution}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
