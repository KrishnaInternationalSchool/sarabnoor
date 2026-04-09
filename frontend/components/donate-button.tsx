"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-provider";
import { api, authHeaders } from "@/lib/api";
import { demoModeEnabled } from "@/lib/demo-data";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

async function loadRazorpayScript() {
  if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function DonateButton({
  campaignId,
  amount
}: {
  campaignId: string;
  amount: number;
}) {
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  const handleDonate = async () => {
    if (!token || !user) {
      toast.error("Please login before making a donation.");
      return;
    }

    setLoading(true);
    try {
      if (demoModeEnabled && token.startsWith("demo-")) {
        toast.success("Demo donation recorded for presentation mode.");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout.");
        return;
      }

      const orderResponse = await api.post(
        "/donations/create-order",
        { campaignId, amount },
        { headers: authHeaders(token) }
      );

      const { order, donationId, razorpayKey } = orderResponse.data;
      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Sarab Noor",
        description: "Compassionate giving",
        order_id: order.id,
        prefill: {
          name: user.name,
          email: user.email
        },
        handler: async (response: Record<string, string>) => {
          await api.post(
            "/donations/verify",
            {
              donationId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            },
            { headers: authHeaders(token) }
          );
          toast.success("Donation completed successfully.");
        }
      });

      razorpay.open();
    } catch {
      toast.error("Unable to start the donation flow.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDonate} className="button-primary w-full" disabled={loading}>
      {loading ? "Preparing checkout..." : `Donate INR ${amount}`}
    </button>
  );
}
