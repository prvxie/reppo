import { motion } from "framer-motion";
import { SiBitcoin, SiLitecoin, SiEthereum } from "react-icons/si";
import { Zap } from "lucide-react";

const methods = [
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    icon: <SiBitcoin className="w-6 h-6 text-white" />,
    steps: [
      "Add item to cart, select BTC",
      "Copy the BTC wallet address shown",
      "Send exact amount from your wallet",
      "Wait for 1 confirmation (~10 min)",
      "Receive script automatically"
    ]
  },
  {
    id: "ltc",
    name: "Litecoin (LTC)",
    icon: <SiLitecoin className="w-6 h-6 text-white" />,
    steps: [
      "Add item to cart, select LTC",
      "Copy the LTC wallet address shown",
      "Send exact amount from your wallet",
      "Wait for confirmation (~2.5 min)",
      "Receive script automatically"
    ]
  },
  {
    id: "eth",
    name: "Ethereum (ETH)",
    icon: <SiEthereum className="w-6 h-6 text-white" />,
    steps: [
      "Add item to cart, select ETH",
      "Copy the ETH wallet address shown",
      "Send exact amount from your wallet",
      "Wait for confirmation (~15 sec)",
      "Receive script automatically"
    ]
  },
  {
    id: "robux",
    name: "Robux",
    icon: <Zap className="w-6 h-6 text-white" />,
    steps: [
      "Add item to cart, select Robux",
      "Receive gamepass link or group fund request",
      "Purchase gamepass / donate",
      "Send proof to our Discord support",
      "Delivered within 15 minutes"
    ]
  }
];

export function PaymentSection() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {methods.map((method, i) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-white/10 p-6 hover:border-white/30 transition-colors"
          data-testid={`payment-method-${method.id}`}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2 border border-white/10 bg-white/5">
              {method.icon}
            </div>
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">{method.name}</h3>
          </div>
          <ol className="space-y-3">
            {method.steps.map((step, stepIdx) => (
              <li key={stepIdx} className="flex gap-3 text-xs text-muted-foreground font-mono leading-relaxed">
                <span className="text-white/40">0{stepIdx + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      ))}
    </div>
  );
}
