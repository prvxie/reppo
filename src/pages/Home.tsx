import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import robloxCharImg from "@assets/image_(1)_1780006855729.png";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "p0rtal";

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [, navigate] = useLocation();
  const [konamiIdx, setKonamiIdx] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[konamiIdx];
      if (e.key === expected) {
        const next = konamiIdx + 1;
        if (next === KONAMI.length) {
          navigate(`/${ADMIN_SLUG}`);
          setKonamiIdx(0);
        } else {
          setKonamiIdx(next);
        }
      } else {
        setKonamiIdx(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [konamiIdx, navigate]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans overflow-hidden">
      <NavBar />

      <main className="relative h-[calc(100dvh-64px)] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-8 md:px-16 relative z-10 flex items-center justify-between w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl space-y-6"
          >
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Premium Digital Exploits</p>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
              ivera<span className="text-white/25">.priv</span>
            </h1>
            <p className="text-lg text-white/60 font-medium leading-relaxed max-w-md">
              Undetected, reliable, and powerful. The only Roblox exploit shop you need.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Button
                data-testid="hero-browse"
                onClick={() => navigate("/products")}
                className="rounded-none font-bold uppercase tracking-widest px-10 h-12 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
              >
                Browse Products
              </Button>
              <button
                onClick={() => navigate("/faq")}
                className="text-sm font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors"
              >
                FAQ →
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              {["Undetected","Instant Delivery","24/7 Support"].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/2 items-center justify-end pointer-events-none pr-8">
            <div className="absolute w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full right-0" />
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
              className="transition-transform duration-75 ease-out"
            >
              <img
                src={robloxCharImg}
                alt="ivera character"
                className="w-[420px] object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.12)]"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Scroll or browse</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </main>
    </div>
  );
}
