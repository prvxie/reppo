import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import robloxCharImg from "@assets/image_(1)_1780006855729.png";
import { Button } from "@/components/ui/button";

export function CategoryHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30; // ±15px max
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-card overflow-hidden border border-white/10 flex items-center mb-12">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="container relative z-20 flex items-center justify-between px-8 md:px-16 w-full">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
            ivera.priv
          </h1>
          <p className="text-xl text-white/70 font-medium">
            Premium digital exploits for the modern era. Undetected, reliable, and powerful.
          </p>
          <Button 
            className="mt-8 rounded-none font-bold uppercase tracking-wider px-8 h-12 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
            onClick={scrollToProducts}
          >
            Browse Products
          </Button>
        </div>

        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/2 items-center justify-center pointer-events-none pr-16">
          <div className="absolute w-[300px] h-[300px] bg-white/10 blur-[100px] rounded-full" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-full max-w-[400px] transition-transform duration-75 ease-out"
            style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
          >
            <img
              src={robloxCharImg}
              alt="Hero Character"
              className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
