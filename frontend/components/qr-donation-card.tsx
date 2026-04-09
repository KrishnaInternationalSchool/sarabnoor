"use client";

import Image from "next/image";
import { toast } from "sonner";

import { donationConfig } from "@/lib/payment";

export function QrDonationCard({ campaignTitle }: { campaignTitle: string }) {
  const copyUpiId = async () => {
    await navigator.clipboard.writeText(donationConfig.upiId);
    toast.success("UPI ID copied.");
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-stone">Donate via UPI QR</p>
        <h3 className="font-serif text-3xl">{donationConfig.payeeName}</h3>
        <p className="text-sm leading-7 text-stone">
          Scan the QR code below for {campaignTitle}, or copy the UPI ID and pay from any UPI app.
        </p>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-stone/10 bg-white p-4">
        <div className="relative mx-auto aspect-square w-full max-w-[320px]">
          <Image
            src={donationConfig.qrImageUrl}
            alt="Donation QR code"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
      <div className="rounded-[24px] bg-sand/70 p-5">
        <p className="text-sm text-stone">UPI ID</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="font-medium">{donationConfig.upiId}</p>
          <button type="button" onClick={copyUpiId} className="button-secondary">
            Copy UPI ID
          </button>
        </div>
      </div>
      <p className="text-sm leading-7 text-stone">
        After payment, the donor can share the screenshot with the NGO team so that a receipt and
        confirmation can be recorded manually.
      </p>
    </div>
  );
}
