import scriptImg from "@assets/Screenshot_2026-05-28_221142_1780007511425.webp";
import externalImg from "@assets/image_1780007536480.webp";

export interface Product {
  id: string;
  category: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  stock: number;
  badge: string;
  description: string;
  features: string[];
  delivery: string;
  requirements: string;
  note: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "script",
    category: "script",
    name: "ivera.priv Script",
    tagline: "Premium Roblox script — dominate every server.",
    price: 9.99,
    originalPrice: 19.99,
    stock: 3,
    badge: "SALE",
    description:
      "ivera.priv Script is an undetected Roblox exploit script with game-breaking advantages across 500+ supported experiences. Features auto-updates so you're always ahead.",
    features: [
      "Aimbot & Target Tracking",
      "ESP / Wallhack",
      "Speed & Jump Hacks",
      "Auto-farm & Teleport",
      "God Mode (Supported Games)",
      "500+ Experiences Supported",
      "Lifetime Auto-updates",
    ],
    delivery: "Instant via Email",
    requirements: "Roblox Account, Windows 10/11, Executor (Synapse X / KRNL)",
    note: "Use on alt accounts only for safety.",
    image: scriptImg,
  },
  {
    id: "external",
    category: "external",
    name: "ivera.priv External",
    tagline: "External overlay — fully undetectable.",
    price: 14.99,
    originalPrice: 29.99,
    stock: 5,
    badge: "NEW",
    description:
      "ivera.priv External operates completely outside the Roblox process — no injection, fully undetectable. Includes ESP, aimbot, and radar overlays.",
    features: [
      "Fully External (no injection)",
      "Player & Item ESP",
      "Silent Aimbot",
      "Radar Overlay",
      "Stream-proof Mode",
      "Instant Updates",
      "24/7 Support",
    ],
    delivery: "Instant via Email",
    requirements: "Roblox Account, Windows 10/11, Admin Rights",
    note: "Safest option — usable on main account.",
    image: externalImg,
  },
];

export const FAQS = [
  {
    q: "Is the ivera.priv script safe to use?",
    a: "We prioritize security and undetectability. The script is regularly updated to bypass standard anti-cheats. We strongly recommend using it only on secondary accounts.",
  },
  {
    q: "What executors are supported?",
    a: "ivera.priv supports leading PC executors like Synapse X, KRNL, and Script-Ware. Mobile executors are currently not supported.",
  },
  {
    q: "Do I get updates for free?",
    a: "Yes. Once purchased, you receive lifetime access to updates. As games patch vulnerabilities, our developers push automatic updates.",
  },
  {
    q: "How fast will I receive the script after paying?",
    a: "Cryptocurrency payments are processed automatically after network confirmations (usually under 15 minutes). Robux payments require manual verification and take roughly 10–15 minutes.",
  },
  {
    q: "Can I get a refund?",
    a: "Due to the nature of digital exploits, all sales are final. If the script is entirely non-functional and our support cannot resolve the issue, contact us.",
  },
  {
    q: "What is the External version?",
    a: "The External version runs completely outside the Roblox process — no DLL injection — making it fully undetectable. It's the safest option and can be used on your main account.",
  },
];
