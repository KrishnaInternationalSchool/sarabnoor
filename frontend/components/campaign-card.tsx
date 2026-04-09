import Image from "next/image";
import Link from "next/link";

import type { Campaign } from "@/lib/types";
import { currency } from "@/lib/utils";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min(
    100,
    Math.round((campaign.raisedAmount / Math.max(campaign.goalAmount, 1)) * 100)
  );

  return (
    <article className="card overflow-hidden">
      <div className="relative h-64">
        <Image src={campaign.coverImage} alt={campaign.title} fill className="object-cover" />
      </div>
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <h3 className="font-serif text-3xl">{campaign.title}</h3>
          <p className="text-sm leading-6 text-stone">{campaign.summary}</p>
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-sand">
            <div className="h-2 rounded-full bg-sage" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-sm text-stone">
            <span>{currency(campaign.raisedAmount)} raised</span>
            <span>{currency(campaign.goalAmount)} goal</span>
          </div>
        </div>
        <Link href={`/campaigns/${campaign.slug}`} className="button-secondary w-full">
          View campaign
        </Link>
      </div>
    </article>
  );
}
