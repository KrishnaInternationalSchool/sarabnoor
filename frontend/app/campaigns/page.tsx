import { CampaignCard } from "@/components/campaign-card";
import { SectionHeading } from "@/components/section-heading";
import { api } from "@/lib/api";
import { demoCampaigns, demoModeEnabled } from "@/lib/demo-data";
import type { Campaign } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  let campaigns: Campaign[] = [];

  try {
    const response = await api.get<{ campaigns: Campaign[] }>("/campaigns");
    campaigns = response.data.campaigns;
  } catch {
    campaigns = demoModeEnabled ? demoCampaigns : [];
  }

  return (
    <div className="container-shell space-y-10 py-16">
      <SectionHeading
        eyebrow="Campaigns"
        title="Give toward urgent and ongoing relief efforts."
        description="Browse Sarab Noor campaigns, view progress, and support the causes that resonate with you."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {campaigns.length === 0 && (
          <div className="card p-8 text-stone">
            Campaigns will appear here once the backend is connected and seeded.
          </div>
        )}
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
