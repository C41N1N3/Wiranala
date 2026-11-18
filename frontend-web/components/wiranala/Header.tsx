"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems, teamIdentity } from "@/lib/team-data";

interface HeaderProps {
  onOpenContact: () => void;
  darkSurface?: boolean;
}

export function Header({ onOpenContact, darkSurface = false }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const inkClass = darkSurface ? "text-[#f4f4ed]" : "text-[#1d2119]";
  const borderBtnClass = darkSurface
    ? "border-[#f4f4ed]/35 bg-[#1b1f17]/88 text-[#f4f4ed] hover:border-[#d2ff00] hover:text-[#d2ff00]"
    : "border-[#1d2119]/25 bg-[#f4f4ed]/92 text-[#1d2119] hover:border-[#1d2119]";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Stacked WIRA / NALA Brand Lockup */}
          <a
            href="#scroll-story"
            aria-label={teamIdentity.name}
            className={`pointer-events-auto inline-flex flex-col rounded-md px-2 py-1 leading-none transition-colors duration-150 ${
              darkSurface
                ? "bg-[#1b1f17]/88 backdrop-blur-sm"
                : "bg-[#f4f4ed]/92 backdrop-blur-sm"
            } ${inkClass}`}
          >
            <span className="font-editorial text-xl leading-[0.88] tracking-tight sm:text-2xl">
              {teamIdentity.shortTop}
            </span>
            <span className="font-display text-xl font-extrabold uppercase leading-[0.88] tracking-tight sm:text-2xl">
              {teamIdentity.shortBottom}
            </span>
          </a>

          {/* Center Geometric Emblem */}
          <a
            href="#scroll-story"
            aria-label="Back to top"
            className={`pointer-events-auto hidden rounded-md px-2.5 py-1.5 transition-colors duration-150 md:inline-flex ${
              darkSurface
                ? "bg-[#1b1f17]/88 text-[#f4f4ed]"
                : "bg-[#f4f4ed]/92 text-[#1d2119]"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 36 28"
              className="h-6 w-8"
              fill="none"
            >
              <path
                d="M4 5l6 18 8-12 8 12 6-18"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
          </a>

          {/* Right Volt CTA + Menu Toggle */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenContact}
              className="min-h-[44px] rounded-md bg-[#d2ff00] px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.08em] text-[#11140d] shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#dcff33] sm:px-5"
            >
              Contact
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md border px-3 transition-colors duration-150 ${borderBtnClass}`}
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
              <span className="hidden font-display text-xs font-bold uppercase tracking-[0.14em] sm:inline">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/70"
          />
          <aside className="relative z-10 flex h-full w-full max-w-sm flex-col justify-between overflow-y-auto bg-[#1d2119] p-7 text-[#f4f4ed] shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#f4f4ed]/15 pb-5">
                <div>
                  <span className="font-display text-xl font-extrabold uppercase tracking-tight">
                    WIRANALA
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d2ff00]">
                    {teamIdentity.subtitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#f4f4ed]/25 text-[#f4f4ed] hover:border-[#d2ff00] hover:text-[#d2ff00]"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Drawer navigation" className="mt-8 space-y-2">
                {navItems.map((item, idx) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="group flex items-baseline justify-between border-b border-[#f4f4ed]/10 py-3.5 transition-colors hover:border-[#d2ff00]"
                  >
                    <span className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#f4f4ed] transition-colors group-hover:text-[#d2ff00]">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold tracking-widest text-[#f4f4ed]/50 group-hover:text-[#d2ff00]">
                      0{idx + 1}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-8 space-y-4 border-t border-[#f4f4ed]/15 pt-6">
              <div className="text-xs leading-6 text-[#f4f4ed]/70">
                {teamIdentity.institution}
                <br />
                {teamIdentity.city}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenContact();
                }}
                className="min-h-[44px] w-full rounded-md bg-[#d2ff00] px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-[#11140d] hover:bg-[#dcff33]"
              >
                Contact Team
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
