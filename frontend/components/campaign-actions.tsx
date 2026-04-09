"use client";

import { useMemo } from "react";
import { toast } from "sonner";

type Props = {
  title: string;
  summary: string;
  slug: string;
};

export function CampaignActions({ title, summary, slug }: Props) {
  const campaignUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `https://sarabnoor.vercel.app/campaigns/${slug}`;
    }

    return `${window.location.origin}/campaigns/${slug}`;
  }, [slug]);

  const shareText = `${title}\n\n${summary}\n\nSupport here: ${campaignUrl}`;

  const copyText = async (value: string, message: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(message);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.35em] text-stone">Share campaign</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          className="button-secondary"
        >
          Share on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => copyText(campaignUrl, "Campaign link copied.")}
          className="button-secondary"
        >
          Copy link
        </button>
        <button
          type="button"
          onClick={() =>
            copyText(
              `${title}\n${summary}\nAdd this link in your Instagram story: ${campaignUrl}`,
              "Instagram story caption copied."
            )
          }
          className="button-secondary"
        >
          Copy for Instagram
        </button>
      </div>
    </div>
  );
}
