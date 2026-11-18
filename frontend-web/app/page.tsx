"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/wiranala/Header";
import { ScrollStoryHero } from "@/components/wiranala/ScrollStoryHero";
import {
  ParallaxStorySection,
  type DetailPayload,
} from "@/components/wiranala/ParallaxStorySection";
import { DivisionsSection } from "@/components/wiranala/DivisionsSection";
import { GarageSection } from "@/components/wiranala/GarageSection";
import { Footer } from "@/components/wiranala/Footer";
import { ContactModal, DetailModal } from "@/components/wiranala/Modals";
import type { ScrollChapter } from "@/lib/team-data";

export default function HomePage() {
  const [heroDark, setHeroDark] = useState(false);
  const [darkHeader, setDarkHeader] = useState(false);
  const [activeDetail, setActiveDetail] = useState<DetailPayload | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const syncHeaderTone = () => {
      const probeY = 96;
      const garageEl = document.getElementById("garage");
      const divisionsEl = document.getElementById("divisions");
      const sponsorsEl = document.getElementById("sponsors");

      if (sponsorsEl && sponsorsEl.getBoundingClientRect().top <= probeY) {
        setDarkHeader(true);
        return;
      }
      if (garageEl && garageEl.getBoundingClientRect().top <= probeY) {
        setDarkHeader(false);
        return;
      }
      if (divisionsEl && divisionsEl.getBoundingClientRect().top <= probeY) {
        setDarkHeader(true);
        return;
      }
      setDarkHeader(heroDark);
    };

    syncHeaderTone();
    window.addEventListener("scroll", syncHeaderTone, { passive: true });
    return () => window.removeEventListener("scroll", syncHeaderTone);
  }, [heroDark]);

  const openChapterDetail = (chapter: ScrollChapter) => {
    setActiveDetail({
      eyebrow: `${chapter.index} / ${chapter.eyebrow}`,
      title: `${chapter.title} ${chapter.serifWord}`,
      summary: chapter.summary,
      items: chapter.specs,
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f4ed] text-[#1d2119]">
      <Header
        darkSurface={darkHeader}
        onOpenContact={() => setContactOpen(true)}
      />

      <main>
        <ScrollStoryHero
          onSelectChapter={openChapterDetail}
          onThemeChange={setHeroDark}
        />

        <ParallaxStorySection onSelectDetail={setActiveDetail} />

        <DivisionsSection onSelectDetail={setActiveDetail} />

        <GarageSection onSelectDetail={setActiveDetail} />
      </main>

      <Footer onOpenContact={() => setContactOpen(true)} />

      {activeDetail && (
        <DetailModal
          detail={activeDetail}
          onClose={() => setActiveDetail(null)}
          onContact={() => setContactOpen(true)}
        />
      )}

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
