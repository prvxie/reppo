import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/data/products";

export default function FAQ() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans">
      <NavBar />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">Help</p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">FAQ</h1>
          <div className="h-px w-16 bg-white/20 mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left text-white hover:text-white/80 transition-colors text-sm font-bold uppercase tracking-widest py-6 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm font-mono leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-6 border border-white/10 bg-white/3 text-center"
        >
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Still have questions?</p>
          <p className="text-sm text-white/60">
            Join our Discord community for live support.
          </p>
          <a
            href="#"
            className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-white border border-white/20 px-6 py-2.5 hover:bg-white hover:text-black transition-all"
          >
            Discord →
          </a>
        </motion.div>
      </main>
    </div>
  );
}
