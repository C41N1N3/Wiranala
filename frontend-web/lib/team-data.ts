export interface NavItem {
  label: string;
  href: string;
}

export interface ScrollChapter {
  index: string;
  eyebrow: string;
  title: string;
  serifWord: string;
  summary: string;
  visualFocus: "chassis" | "powertrain" | "telemetry";
  specs: string[];
}

export interface StoryFrame {
  id: string;
  tag: string;
  title: string;
  summary: string;
  slotNote: string;
  aspect: "portrait" | "landscape" | "square";
  highlights: string[];
}

export interface TeamDivision {
  code: string;
  department: string;
  title: string;
  summary: string;
  highlights: string[];
}

export interface GarageCard {
  id: string;
  tag: string;
  title: string;
  summary: string;
  slotNote: string;
  highlights: string[];
}

export interface SponsorEntry {
  name: string;
  role: string;
  note: string;
}

export interface SponsorCategory {
  category: string;
  code: string;
  entries: SponsorEntry[];
}

export const teamIdentity = {
  name: "Wiranala EV Gokart ITS",
  shortTop: "WIRA",
  shortBottom: "NALA",
  subtitle: "EV GOKART ITS",
  institution: "Institut Teknologi Sepuluh Nopember",
  city: "Surabaya, Indonesia",
} as const;

export const kartModelConfig = {
  // Drop your exported CAD model at public/models/wiranala-kart.glb
  // and set glbPath: "/models/wiranala-kart.glb" to swap out the procedural template.
  glbPath: null as string | null,
  stageNote: "3D WebGL Template · Swap with public/models/wiranala-kart.glb",
} as const;

export const navItems: NavItem[] = [
  { label: "Story", href: "#scroll-story" },
  { label: "Engineering", href: "#parallax-story" },
  { label: "Divisions", href: "#divisions" },
  { label: "Garage", href: "#garage" },
  { label: "Sponsors", href: "#sponsors" },
];

export const scrollChapters: ScrollChapter[] = [
  {
    index: "01",
    eyebrow: "CHASSIS & AERO",
    title: "PRECISION",
    serifWord: "FRAME",
    summary:
      "Tubular steel geometry engineered at ITS Surabaya for balanced cornering grip, driver ergonomics, and compact battery packaging.",
    visualFocus: "chassis",
    specs: [
      "Tubular chassis built for low center of gravity",
      "Aerodynamic front fairing and sidepod airflow channels",
      "Hydraulic rear braking with quick-service axle layout",
    ],
  },
  {
    index: "02",
    eyebrow: "POWERTRAIN & HV",
    title: "ELECTRIC",
    serifWord: "TORQUE",
    summary:
      "High-voltage electric motor drive, programmable inverter, and modular lithium pack protected by multi-layer isolation.",
    visualFocus: "powertrain",
    specs: [
      "Direct electric drive with tunable acceleration maps",
      "Battery Management System monitoring cell temperature and voltage",
      "Accessible HV emergency shutoff and thermal safety routing",
    ],
  },
  {
    index: "03",
    eyebrow: "EMBEDDED & TELEMETRY",
    title: "LIVE",
    serifWord: "DATA",
    summary:
      "Real-time CAN bus logging and cockpit diagnostics connecting trackside engineering directly with driver feedback.",
    visualFocus: "telemetry",
    specs: [
      "CAN bus data capture for stint-by-stint setup tuning",
      "Driver steering readout for battery state and motor temps",
      "Hardware interlock diagnostics for scrutineering readiness",
    ],
  },
];

export const storyFrames: StoryFrame[] = [
  {
    id: "frame-chassis",
    tag: "ITS WORKSHOP / CHASSIS",
    title: "Tubular Frame Fabrication",
    summary:
      "Custom chassis jigging, suspension alignment, and bodywork packaging assembled by student engineers.",
    slotNote: "Photo Slot: Add Chassis Build Photo",
    aspect: "portrait",
    highlights: [
      "Fabricated and aligned in the ITS Surabaya motorsport workshop",
      "Designed around modular electric pack mounting points",
      "Serviceable suspension and steering geometry for rapid track adjustments",
    ],
  },
  {
    id: "frame-battery",
    tag: "HIGH VOLTAGE / PACK",
    title: "Battery & Motor Integration",
    summary:
      "Compact lithium module packaging engineered for thermal stability and clean high-current busbar routing.",
    slotNote: "Photo Slot: Add Battery Pack Photo",
    aspect: "landscape",
    highlights: [
      "Cell-level temperature and voltage monitoring via BMS",
      "Protected high-voltage enclosure with clear service disconnects",
      "Matched controller calibration for smooth throttle delivery",
    ],
  },
  {
    id: "frame-telemetry",
    tag: "CONTROL SYSTEMS / CAN",
    title: "Cockpit & Telemetry Rig",
    summary:
      "Sensor logging and driver interface tuned to turn track runs into repeatable engineering decisions.",
    slotNote: "Photo Slot: Add Cockpit Display Photo",
    aspect: "square",
    highlights: [
      "Live current, voltage, and thermal channel logging",
      "Trackside inspection interface for quick post-run review",
      "Safety fault detection integrated into dashboard readout",
    ],
  },
  {
    id: "frame-track",
    tag: "SURABAYA / TRACK OPS",
    title: "Testing & Driver Feedback",
    summary:
      "Iterative circuit testing pairing driver feel with logged vehicle data before every competition weekend.",
    slotNote: "Photo Slot: Add Track Test Photo",
    aspect: "portrait",
    highlights: [
      "Structured shakedown checklists from pit lane to green flag",
      "Corner-entry braking balance and regen calibration runs",
      "Ready for competition dates and team roster entries",
    ],
  },
];

export const teamDivisions: TeamDivision[] = [
  {
    code: "01",
    department: "Mechanical",
    title: "Chassis & Aero",
    summary:
      "Tubular frame geometry, braking, steering dynamics, and composite bodywork.",
    highlights: [
      "Frame CAD modeling, welding fixture design, and structural validation",
      "Front fairing and sidepod packaging for battery and inverter cooling",
      "Tire, axle, and brake hardware maintenance trackside",
    ],
  },
  {
    code: "02",
    department: "Electrical",
    title: "Powertrain & HV",
    summary:
      "Electric motor drive, inverter tuning, lithium pack design, and HV safety.",
    highlights: [
      "High-voltage harness routing, fusing, and isolation monitoring",
      "Modular battery pack assembly and thermal management",
      "Inverter torque mapping and regenerative braking setup",
    ],
  },
  {
    code: "03",
    department: "Control Systems",
    title: "Embedded & Telemetry",
    summary:
      "CAN bus architecture, sensor acquisition, and driver cockpit display.",
    highlights: [
      "Microcontroller data logging across powertrain and chassis sensors",
      "Custom dashboard UI displaying live battery and thermal states",
      "Telemetry review tools for race engineering debriefs",
    ],
  },
  {
    code: "04",
    department: "Operations",
    title: "Race & Management",
    summary:
      "Scrutineering readiness, event logistics, sponsorship, and media.",
    highlights: [
      "Competition rulebook compliance and technical inspection prep",
      "Track day scheduling, spare parts inventory, and driver briefing",
      "Industry partner outreach and team documentation",
    ],
  },
];

export const garageCards: GarageCard[] = [
  {
    id: "garage-1",
    tag: "BUILD LOG 01",
    title: "Design to Rolling Chassis",
    summary: "From CAD assembly checks to physical frame fabrication at ITS.",
    slotNote: "Media Slot: Workshop Reel or Photo",
    highlights: [
      "Track-width and wheelbase packaged for electric kart agility",
      "Clean mounting brackets for battery tray and rear motor carrier",
    ],
  },
  {
    id: "garage-2",
    tag: "BUILD LOG 02",
    title: "Bench Testing & Wiring",
    summary: "Low-voltage control checks before energizing the HV bus.",
    slotNote: "Media Slot: Bench Test Reel or Photo",
    highlights: [
      "Pre-charge circuit verification and emergency stop validation",
      "Throttle pedal calibration and inverter bench spin-up",
    ],
  },
  {
    id: "garage-3",
    tag: "BUILD LOG 03",
    title: "Shakedown & Setup",
    summary: "Trackside telemetry capture and driver balance refinement.",
    slotNote: "Media Slot: Track Day Reel or Photo",
    highlights: [
      "Stint-by-stint battery temperature and current draw checks",
      "Iterative brake bias and steering response adjustments",
    ],
  },
];

export const marqueeItems = [
  "WIRANALA EV GOKART",
  "ITS SURABAYA",
  "CHASSIS & AERO",
  "HIGH-VOLTAGE DRIVE",
  "CAN TELEMETRY",
  "RACE OPERATIONS",
  "SPONSOR SLOT OPEN",
] as const;

export const sponsorCategories: SponsorCategory[] = [
  {
    category: "Academic",
    code: "EDU",
    entries: [
      {
        name: "Institut Teknologi Sepuluh Nopember (ITS)",
        role: "Home University, Surabaya",
        note: "Student electric motorsport engineering base",
      },
    ],
  },
  {
    category: "Technical",
    code: "TECH",
    entries: [
      {
        name: "Technical Partner Slot (Available)",
        role: "Powertrain, battery, or telemetry hardware partner",
        note: "Ready to display confirmed sponsor logo and details",
      },
    ],
  },
  {
    category: "Manufacturing",
    code: "FAB",
    entries: [
      {
        name: "Fabrication Partner Slot (Available)",
        role: "Machining, welding, or composite tooling partner",
        note: "Ready to display confirmed sponsor logo and details",
      },
    ],
  },
  {
    category: "Media & Apparel",
    code: "MEDIA",
    entries: [
      {
        name: "Media & Gear Partner Slot (Available)",
        role: "Driver racewear, helmet livery, or documentation partner",
        note: "Ready to display confirmed sponsor logo and details",
      },
    ],
  },
];
