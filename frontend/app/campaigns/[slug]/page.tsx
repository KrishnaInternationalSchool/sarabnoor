import Image from "next/image";

import { DonateButton } from "@/components/donate-button";
import { api } from "@/lib/api";
import { demoCampaigns, demoModeEnabled } from "@/lib/demo-data";
import type { Campaign } from "@/lib/types";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params
}: {
  params: { slug: string };
}) {
  let campaign: Campaign | null = null;

  try {
    const response = await api.get<{ campaign: Campaign }>(`/campaigns/${params.slug}`);
    campaign = response.data.campaign;
  } catch {
    campaign = demoModeEnabled
      ? demoCampaigns.find((item) => item.slug === params.slug) || null
      : null;
  }

  if (!campaign) {
    return (
      <div className="container-shell py-16">
        <div className="card p-8 text-stone">
          Campaign details are not available right now. Please reconnect the backend and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell space-y-8 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="relative h-[420px] overflow-hidden rounded-[32px]">
            <Image src={campaign.coverImage} alt={campaign.title} fill className="object-cover" />
          </div>
          <div className="card space-y-5 p-8">
            <h1 className="font-serif text-5xl">{campaign.title}</h1>
            <p className="text-lg leading-8 text-stone">{campaign.description}</p>
          </div>
        </div>
        <aside className="card h-fit space-y-6 p-8">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-stone">Campaign progress</p>
            <h2 className="font-serif text-4xl">{currency(campaign.raisedAmount)}</h2>
            <p className="text-sm text-stone">Raised of {currency(campaign.goalAmount)}</p>
          </div>
          <DonateButton campaignId={campaign._id} amount={500} />
          <DonateButton campaignId={campaign._id} amount={1000} />
          <DonateButton campaignId={campaign._id} amount={2500} />
          <p className="text-sm leading-7 text-stone">
            Donations are processed in Razorpay test mode with backend signature verification.
          </p>
        </aside>
      </div>
    </div>
  );
}
