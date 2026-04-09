import Link from "next/link";

import { CampaignCard } from "@/components/campaign-card";
import { SectionHeading } from "@/components/section-heading";
import { api } from "@/lib/api";
import { demoCampaigns, demoModeEnabled } from "@/lib/demo-data";
import type { Campaign } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getCampaigns() {
  try {
    const response = await api.get<{ campaigns: Campaign[] }>("/campaigns");
    return response.data.campaigns;
  } catch {
    return demoModeEnabled ? demoCampaigns : [];
  }
}

export default async function HomePage() {
  const campaigns = await getCampaigns();

  return (
    <div className="space-y-20 pb-20">
      <section className="container-shell grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-8">
          <p className="text-sm uppercase tracking-[0.4em] text-stone">
            Hope. Care. Human dignity.
          </p>
          <div className="space-y-5">
            <h1 className="font-serif text-5xl leading-tight md:text-7xl">
              Humanitarian giving designed with grace and clarity.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-stone">
              Sarab Noor brings together transparent campaigns, thoughtful updates,
              and a caring volunteer network so support reaches people with warmth.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/campaigns" className="button-primary">
              Explore campaigns
            </Link>
            <Link href="/dashboard" className="button-secondary">
              Volunteer with us
            </Link>
          </div>
        </div>
        <div className="card grid gap-6 p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] bg-sand p-5">
              <p className="text-sm text-stone">Active campaigns</p>
              <p className="mt-3 font-serif text-4xl">{campaigns.length}</p>
            </div>
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-sm text-stone">Volunteer system</p>
              <p className="mt-3 font-serif text-4xl">Live</p>
            </div>
          </div>
          <p className="rounded-[24px] bg-blush/50 p-6 text-sm leading-7 text-stone">
            The visual direction is intentionally soft, light, and restrained to reflect
            a humanitarian organization centered on trust, care, and emotional warmth.
          </p>
        </div>
      </section>

      <section className="container-shell space-y-8">
        <SectionHeading
          eyebrow="Featured campaigns"
          title="Support work that feels close to real people."
          description="Each campaign shows clear goals, progress, and a direct route to contribute."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {campaigns.slice(0, 2).map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      </section>
    </div>
  );
}
