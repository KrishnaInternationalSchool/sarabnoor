"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-provider";
import { api, authHeaders } from "@/lib/api";
import {
  demoCampaigns,
  demoDonations,
  demoModeEnabled,
  demoVolunteer
} from "@/lib/demo-data";
import type { Campaign, Donation, VolunteerApplication } from "@/lib/types";
import { currency } from "@/lib/utils";

type AdminStats = {
  totalDonations: number;
  totalVolunteers: number;
  activeCampaigns: number;
};

const backendBaseUrl =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "");

const toAbsoluteUploadUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${backendBaseUrl}${url}`;
};

type CampaignFormValues = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  goalAmount: number;
  coverImage: string;
  gallery: string;
  status: "draft" | "active" | "completed";
  featured: boolean;
};

export function AdminPanel() {
  const { token, user, loading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const campaignForm = useForm<CampaignFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      goalAmount: 50000,
      coverImage: "",
      gallery: "",
      status: "active",
      featured: false
    }
  });
  const updateForm = useForm<{ title: string; body: string; image: string }>({
    defaultValues: {
      title: "",
      body: "",
      image: ""
    }
  });

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      setUpdatesLoading(false);
      return;
    }

    if (demoModeEnabled && token.startsWith("demo-")) {
      setStats({
        totalDonations: 1000,
        totalVolunteers: 1,
        activeCampaigns: demoCampaigns.length
      });
      setCampaigns(demoCampaigns);
      setDonations(demoDonations);
      setVolunteers([{ ...demoVolunteer, user: { name: "Demo Supporter" } } as any]);
      setUpdatesLoading(false);
      return;
    }

    Promise.all([
      api.get("/dashboard/admin", { headers: authHeaders(token) }),
      api.get("/campaigns", { headers: authHeaders(token) }),
      api.get("/donations", { headers: authHeaders(token) }),
      api.get("/volunteers", { headers: authHeaders(token) })
    ])
      .then(([statsResponse, campaignsResponse, donationsResponse, volunteersResponse]) => {
        setStats(statsResponse.data.stats);
        setCampaigns(campaignsResponse.data.campaigns);
        setDonations(donationsResponse.data.donations);
        setVolunteers(volunteersResponse.data.applications);
      })
      .catch(() => toast.error("Unable to load admin panel."))
      .finally(() => setUpdatesLoading(false));
  }, [token, user]);

  const exportDonations = () => {
    const header = "Donor,Campaign,Amount,Status\n";
    const rows = donations
      .map(
        (item: any) =>
          `${item.donor?.name || ""},${item.campaign?.title || ""},${item.amount},${item.status}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donations.csv";
    link.click();
  };

  const reviewVolunteer = async (id: string, status: "verified" | "rejected") => {
    if (!token) return;
    try {
      if (demoModeEnabled && token.startsWith("demo-")) {
        toast.success("Demo volunteer status updated.");
        return;
      }
      await api.patch(
        `/volunteers/${id}/review`,
        {
          status,
          remarks:
            status === "verified"
              ? "Reviewed and approved."
              : "Please re-submit with clearer documents.",
          rejectionReason: status === "rejected" ? "Documents could not be validated." : "",
          verifiedVolunteer: status === "verified"
        },
        { headers: authHeaders(token) }
      );
      toast.success("Volunteer status updated.");
      window.location.reload();
    } catch {
      toast.error("Unable to update volunteer status.");
    }
  };

  const submitCampaign = async (values: CampaignFormValues) => {
    if (!token) return;
    try {
      if (demoModeEnabled && token.startsWith("demo-")) {
        toast.success(editingCampaignId ? "Demo campaign updated." : "Demo campaign created.");
        return;
      }
      const payload = {
        ...values,
        gallery:
          values.gallery
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
      };

      if (editingCampaignId) {
        await api.put(`/campaigns/${editingCampaignId}`, payload, {
          headers: authHeaders(token)
        });
        toast.success("Campaign updated.");
      } else {
        await api.post("/campaigns", payload, { headers: authHeaders(token) });
        toast.success("Campaign created.");
      }

      window.location.reload();
    } catch {
      toast.error("Unable to save campaign.");
    }
  };

  const loadCampaignForEdit = (campaign: Campaign) => {
    setEditingCampaignId(campaign._id);
    campaignForm.reset({
      title: campaign.title,
      slug: campaign.slug,
      summary: campaign.summary,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      coverImage: campaign.coverImage,
      gallery: campaign.gallery.join(", "),
      status: campaign.status,
      featured: campaign.featured
    });
  };

  const deleteCampaign = async (id: string) => {
    if (!token) return;
    try {
      if (demoModeEnabled && token.startsWith("demo-")) {
        toast.success("Demo campaign deleted.");
        return;
      }
      await api.delete(`/campaigns/${id}`, { headers: authHeaders(token) });
      toast.success("Campaign deleted.");
      window.location.reload();
    } catch {
      toast.error("Unable to delete campaign.");
    }
  };

  const submitUpdate = async (values: {
    title: string;
    body: string;
    image: string;
  }) => {
    if (!token) return;
    try {
      if (demoModeEnabled && token.startsWith("demo-")) {
        toast.success("Demo update posted.");
        updateForm.reset();
        return;
      }
      await api.post("/updates", values, { headers: authHeaders(token) });
      toast.success("Update posted.");
      updateForm.reset();
    } catch {
      toast.error("Unable to post update.");
    }
  };

  if (loading || updatesLoading) {
    return <div className="card p-8">Loading admin panel...</div>;
  }

  if (!user || user.role !== "admin") {
    return <div className="card p-8">Admin access is required.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-stone">Total donations</p>
          <p className="mt-3 font-serif text-4xl">{currency(stats?.totalDonations || 0)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-stone">Total volunteers</p>
          <p className="mt-3 font-serif text-4xl">{stats?.totalVolunteers || 0}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-stone">Active campaigns</p>
          <p className="mt-3 font-serif text-4xl">{stats?.activeCampaigns || 0}</p>
        </div>
      </div>

      <section className="card space-y-4 p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">Donations</h2>
          <button onClick={exportDonations} className="button-secondary">
            Export CSV
          </button>
        </div>
        <div className="space-y-3">
          {donations.map((item: any) => (
            <div key={item._id} className="rounded-2xl bg-sand/70 p-4">
              <p className="font-medium">
                {item.donor?.name} donated {currency(item.amount)}
              </p>
              <p className="text-sm text-stone">
                {item.campaign?.title} - {item.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-4 p-8">
        <h2 className="font-serif text-3xl">Campaign management</h2>
        <form
          onSubmit={campaignForm.handleSubmit(submitCampaign)}
          className="grid gap-3 rounded-3xl bg-white/80 p-5"
        >
          <input className="input" placeholder="Title" {...campaignForm.register("title")} />
          <input className="input" placeholder="Slug" {...campaignForm.register("slug")} />
          <input className="input" placeholder="Summary" {...campaignForm.register("summary")} />
          <textarea
            className="input min-h-28"
            placeholder="Description"
            {...campaignForm.register("description")}
          />
          <input
            className="input"
            type="number"
            placeholder="Goal amount"
            {...campaignForm.register("goalAmount", { valueAsNumber: true })}
          />
          <input
            className="input"
            placeholder="Cover image URL"
            {...campaignForm.register("coverImage")}
          />
          <input
            className="input"
            placeholder="Gallery URLs, comma separated"
            {...campaignForm.register("gallery")}
          />
          <div className="flex gap-3">
            <button className="button-primary" type="submit">
              {editingCampaignId ? "Update campaign" : "Create campaign"}
            </button>
            {editingCampaignId && (
              <button
                className="button-secondary"
                type="button"
                onClick={() => {
                  setEditingCampaignId(null);
                  campaignForm.reset();
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
        <div className="space-y-3">
          {campaigns.map((item) => (
            <div key={item._id} className="rounded-2xl bg-sand/70 p-4">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-stone">
                Goal {currency(item.goalAmount)} - Raised {currency(item.raisedAmount)}
              </p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => loadCampaignForEdit(item)} className="button-secondary">
                  Edit
                </button>
                <button onClick={() => deleteCampaign(item._id)} className="button-secondary">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-4 p-8">
        <h2 className="font-serif text-3xl">Content management</h2>
        <form onSubmit={updateForm.handleSubmit(submitUpdate)} className="space-y-3">
          <input className="input" placeholder="Update title" {...updateForm.register("title")} />
          <textarea
            className="input min-h-28"
            placeholder="Write an update for supporters"
            {...updateForm.register("body")}
          />
          <input className="input" placeholder="Image URL" {...updateForm.register("image")} />
          <button className="button-primary" type="submit">
            Post update
          </button>
        </form>
      </section>

      <section className="card space-y-4 p-8">
        <h2 className="font-serif text-3xl">Volunteer verification</h2>
        <div className="space-y-4">
          {volunteers.map((item: any) => (
            <div key={item._id} className="rounded-2xl bg-sand/70 p-4">
              <p className="font-medium">{item.user?.name}</p>
              <p className="text-sm text-stone capitalize">{item.status}</p>
              <p className="mt-2 text-sm text-stone">
                <span className="font-medium text-ink">Interest area:</span> {item.interestArea}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {item.profilePhoto && (
                  <a
                    href={toAbsoluteUploadUrl(item.profilePhoto)}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary"
                  >
                    View profile photo
                  </a>
                )}
                {(item.documents || []).map((document: any, index: number) => (
                  <a
                    key={`${item._id}-${index}`}
                    href={toAbsoluteUploadUrl(document.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary"
                  >
                    {document.label || `View document ${index + 1}`}
                  </a>
                ))}
              </div>
              <div className="mt-3 flex gap-3">
                <button onClick={() => reviewVolunteer(item._id, "verified")} className="button-primary">
                  Verify
                </button>
                <button onClick={() => reviewVolunteer(item._id, "rejected")} className="button-secondary">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
