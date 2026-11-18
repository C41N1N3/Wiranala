import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Instrument_Serif,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Wiranala EV Gokart ITS | Electric Motorsport Engineering Team",
  description:
    "Scroll-driven team portfolio for Wiranala EV Gokart ITS, Institut Teknologi Sepuluh Nopember, Surabaya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${barlowCondensed.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen overflow-x-clip bg-[#f4f4ed] text-[#1d2119] antialiased selection:bg-[#d2ff00] selection:text-[#11140d]">
        {children}
      </body>
    </html>
  );
}
