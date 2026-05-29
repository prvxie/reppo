import { useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { BuyModal } from "@/components/BuyModal";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleBuyNow = () => {
    setModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full bg-card border border-white/10 rounded-none overflow-hidden hover:border-white/30 transition-colors duration-500"
      data-testid={`product-card-${product.id}`}
    >
      <div className="flex flex-col md:flex-row md:items-center p-8 gap-8 border-b border-white/5">
        {/* Left: Image */}
        <div className="w-full md:w-64 h-64 shrink-0 bg-background/50 border border-white/10 rounded-none flex items-center justify-center relative overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Center: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-3xl font-bold tracking-tight text-white uppercase">{product.name}</h3>
            <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] uppercase tracking-widest font-mono border border-white/10">
              {product.badge}
            </span>
          </div>
          <p className="text-muted-foreground font-medium mb-6 text-lg">{product.tagline}</p>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-white">${product.price.toFixed(2)}</div>
            <div className="text-lg font-mono text-white/50 line-through">${product.originalPrice.toFixed(2)}</div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-white/80 bg-white/5 px-3 py-1.5 border border-white/10 ml-2">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              {product.stock} Left
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="shrink-0 flex flex-col justify-center w-full md:w-auto mt-6 md:mt-0">
          <Button 
            className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wider px-10 h-14 rounded-none shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all w-full md:w-auto text-lg"
            data-testid={`buy-now-${product.id}`}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full px-8 py-4">
        <AccordionItem value="details" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white">
            View Details & Requirements
          </AccordionTrigger>
          <AccordionContent className="pt-6 pb-4">
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Features</h4>
                  <ul className="text-muted-foreground space-y-1 font-mono text-xs">
                    {product.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 border border-white/10 bg-background/50 space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">Delivery</span>
                    <span className="text-white text-right">{product.delivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Requirements</span>
                    <span className="text-white text-right">{product.requirements}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
                    <span className="text-white/50">Security Note</span>
                    <span className="text-white text-right text-[10px] leading-tight max-w-[150px]">{product.note}</span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <BuyModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={{ name: product.name, price: product.price, id: product.id }} 
      />
    </motion.div>
  );
}
