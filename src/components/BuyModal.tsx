import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WALLET_ADDRESSES: Record<string, string> = {
  BTC: import.meta.env.VITE_BTC_ADDRESS || "Configure your BTC address in Vercel env vars",
  LTC: import.meta.env.VITE_LTC_ADDRESS || "Configure your LTC address in Vercel env vars",
  ETH: import.meta.env.VITE_ETH_ADDRESS || "Configure your ETH address in Vercel env vars",
};

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { name: string; price: number; id: string };
}

type PaymentMethod = "BTC" | "LTC" | "ETH" | "Robux";

export function BuyModal({ isOpen, onClose, product }: BuyModalProps) {
  const [email, setEmail] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [discordUserId, setDiscordUserId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BTC");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveOrderLocally = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("ivera_orders") || "[]");
      const order = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        productName: product.name,
        price: product.price,
        email,
        paymentMethod,
        discordUsername: discordUsername || undefined,
        status: "pending",
      };
      localStorage.setItem("ivera_orders", JSON.stringify([order, ...existing]));
    } catch {
      // localStorage unavailable — order still goes through Discord
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          price: product.price,
          email,
          paymentMethod,
          discordUsername,
          discordUserId
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to place order");
      }
      
      saveOrderLocally();
      setSuccess(true);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentInstructions = () => {
    if (paymentMethod === "Robux") {
      const robuxAmount = Math.round(product.price * 100); // Rough conversion: $1 = 100 R$
      return (
        <div className="mt-4 p-4 border border-white/10 bg-white/5 space-y-3">
          <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
            <span>Robux Amount:</span>
            <span className="text-white">{robuxAmount} R$</span>
          </div>
          <div className="text-xs text-white/70 leading-relaxed">
            1. Purchase our Roblox Gamepass for {robuxAmount} R$
            2. Send screenshot of purchase to our Discord support
            3. Include your order email in the message
            4. Product delivered within 15 minutes
          </div>
          <div className="p-2 bg-black/50 border border-white/10">
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Gamepass Link:</div>
            <a 
              href={import.meta.env.VITE_GAMEPASS_LINK || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-white/90 font-mono hover:text-white underline"
            >
              {import.meta.env.VITE_GAMEPASS_LINK || "Configure gamepass link in Vercel env vars"}
            </a>
          </div>
        </div>
      );
    }

    const address = WALLET_ADDRESSES[paymentMethod];
    
    return (
      <div className="mt-4 p-4 border border-white/10 bg-white/5 space-y-2">
        <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground mb-1">
          <span>Amount to send:</span>
          <span className="text-white">${product.price.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground mb-1">
          <span>{paymentMethod} Address:</span>
        </div>
        <div className="flex items-center justify-between gap-2 p-2 bg-black/50 border border-white/10">
          <code className="text-xs text-white/90 font-mono break-all">{address}</code>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 h-8 w-8 hover:bg-white/10 text-white/70 hover:text-white"
            onClick={() => handleCopy(address)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {copied && <div className="text-[10px] text-green-400 uppercase tracking-widest text-right">Copied to clipboard</div>}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="bg-[#080808] border-white/10 sm:max-w-md p-0 overflow-hidden rounded-none"
        data-testid="buy-modal"
      >
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <DialogHeader className="mb-6 space-y-1">
                <DialogTitle className="text-2xl font-bold uppercase tracking-widest text-white">Checkout</DialogTitle>
                <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  {product.name} — ${product.price.toFixed(2)}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Your Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/50 border-white/10 rounded-none focus-visible:ring-1 focus-visible:ring-white/30 text-white font-mono placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discord" className="text-xs uppercase tracking-widest text-muted-foreground">Discord Username (optional)</Label>
                    <Input 
                      id="discord" 
                      type="text" 
                      placeholder="username#0000"
                      value={discordUsername}
                      onChange={(e) => setDiscordUsername(e.target.value)}
                      className="bg-black/50 border-white/10 rounded-none focus-visible:ring-1 focus-visible:ring-white/30 text-white font-mono placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discordId" className="text-xs uppercase tracking-widest text-muted-foreground">Discord User ID (for delivery)</Label>
                    <Input 
                      id="discordId" 
                      type="text" 
                      placeholder="123456789012345678"
                      value={discordUserId}
                      onChange={(e) => setDiscordUserId(e.target.value)}
                      className="bg-black/50 border-white/10 rounded-none focus-visible:ring-1 focus-visible:ring-white/30 text-white font-mono placeholder:text-white/20"
                    />
                    <p className="text-[9px] text-white/30">Enter your Discord User ID to receive product via DM</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["BTC", "LTC", "ETH", "Robux"] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        data-testid={`payment-method-${method.toLowerCase()}`}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-3 text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${
                          paymentMethod === method 
                            ? "bg-white text-black border-white" 
                            : "bg-transparent text-white border-white/20 hover:border-white/50"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {renderPaymentInstructions()}

                <div className="pt-4">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/90 rounded-none font-bold uppercase tracking-widest h-12"
                    onClick={handleSubmit}
                    disabled={loading}
                    data-testid="modal-submit"
                  >
                    {loading ? "Sending..." : "Place Order"}
                  </Button>
                  {error && (
                    <div className="mt-3 text-xs text-red-500 text-center uppercase tracking-widest">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-white mb-6" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-4">Order Received!</h2>
              <p className="text-sm text-muted-foreground uppercase tracking-wider leading-relaxed mb-8">
                Check the payment instructions above. Send payment and we'll deliver to your email within 15 minutes.
              </p>
              
              {paymentMethod !== "Robux" && (
                <div className="w-full p-4 bg-white/5 border border-white/10 mb-6">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{paymentMethod} Address</div>
                  <div className="flex items-center justify-between gap-2 p-2 bg-black/50 border border-white/10">
                    <code className="text-xs text-white/90 font-mono break-all">{WALLET_ADDRESSES[paymentMethod]}</code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 h-8 w-8 hover:bg-white/10 text-white/70 hover:text-white"
                      onClick={() => handleCopy(WALLET_ADDRESSES[paymentMethod])}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none uppercase tracking-widest"
                onClick={onClose}
              >
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}