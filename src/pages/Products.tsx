import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

export default function Products() {
  const [selected, setSelected] = useState("script");
  const filtered = PRODUCTS.filter(p => p.category === selected);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans">
      <NavBar />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Store</p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Products</h1>
          <div className="h-px w-16 bg-white/20 mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10"
        >
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">Category</p>
          <div className="flex gap-2">
            {["script","external"].map(cat => (
              <button
                key={cat}
                data-testid={`tab-${cat}`}
                onClick={() => setSelected(cat)}
                className={`px-7 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${
                  selected === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
