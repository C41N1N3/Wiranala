"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { DetailPayload } from "@/components/wiranala/ParallaxStorySection";

export function DetailModal({
  detail,
  onClose,
  onContact,
}: {
  detail: DetailPayload;
  onClose: () => void;
  onContact: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={detail.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-[#f4f4ed]/20 bg-[#1d2119] p-6 text-[#f4f4ed] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
              {detail.eyebrow}
            </div>
            <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              {detail.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details dialog"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border border-[#f4f4ed]/20 text-[#f4f4ed] hover:border-[#d2ff00] hover:text-[#d2ff00]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#f4f4ed]/80">
          {detail.summary}
        </p>

        <div className="mt-6 space-y-3 border-t border-[#f4f4ed]/15 pt-5">
          {detail.items.map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[#d2ff00]"
              />
              <span className="text-[#f4f4ed]/90">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#f4f4ed]/15 pt-5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onContact();
            }}
            className="min-h-[44px] rounded-md bg-[#d2ff00] px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-[#11140d] hover:bg-[#dcff33]"
          >
            Contact Wiranala ITS
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-3 text-sm font-semibold text-[#f4f4ed]/75 hover:text-[#f4f4ed]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email address, and message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact Wiranala EV Gokart ITS"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-[#1d2119]/20 bg-[#f4f4ed] p-6 text-[#1d2119] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight">
              Contact Wiranala ITS
            </h3>
            <p className="mt-1 text-sm text-[#4a5041]">
              Reach out regarding sponsorship, engineering collaboration, or joining the team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border border-[#1d2119]/20 text-[#1d2119] hover:bg-[#1d2119] hover:text-[#f4f4ed]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-lg border border-[#1d2119]/20 bg-white p-5 text-sm text-[#1d2119]">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Inquiry prepared
            </div>
            <p className="mt-2 leading-6 text-[#4a5041]">
              Thank you, {name}. Connect this form to your official Wiranala EV Gokart ITS email or webhook endpoint to deliver messages live.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 min-h-[44px] rounded-md bg-[#1d2119] px-5 py-2 text-sm font-semibold text-[#f4f4ed]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-md border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-semibold text-[#1d2119]"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 block w-full rounded-md border border-[#1d2119]/25 bg-white px-3.5 py-2.5 text-sm text-[#1d2119] placeholder:text-[#4a5041]/60"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-semibold text-[#1d2119]"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-md border border-[#1d2119]/25 bg-white px-3.5 py-2.5 text-sm text-[#1d2119] placeholder:text-[#4a5041]/60"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-semibold text-[#1d2119]"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Share your sponsorship, partnership, or team message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 block w-full rounded-md border border-[#1d2119]/25 bg-white px-3.5 py-2.5 text-sm text-[#1d2119] placeholder:text-[#4a5041]/60"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] rounded-md border border-[#1d2119]/25 px-4 py-2 text-sm font-medium text-[#1d2119] hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] rounded-md bg-[#d2ff00] px-5 py-2 font-display text-sm font-bold uppercase tracking-wider text-[#11140d] hover:bg-[#dcff33]"
              >
                Send Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
