import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface StripeCheckoutProps {
  productName: string;
  price: number;
  email: string;
  discordUserId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function StripeCheckout({ productName, price, email, discordUserId, onSuccess, onError }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          price,
          email,
          discordUserId,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      onError?.(error.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-white text-black hover:bg-white/90 rounded-none font-bold uppercase tracking-widest h-12"
    >
      {loading ? "Processing..." : "Pay with Card"}
    </Button>
  );
}
