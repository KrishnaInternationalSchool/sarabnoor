"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-provider";
import { api, authHeaders } from "@/lib/api";
import {
  demoDonations,
  demoModeEnabled,
  demoNotifications,
  demoVolunteer
} from "@/lib/demo-data";
import type { Donation, NotificationItem, VolunteerApplication } from "@/lib/types";
import { currency } from "@/lib/utils";

type DashboardData = {
  donations: Donation[];
  application: VolunteerApplication | null;
  notifications: NotificationItem[];
};

export function DashboardClient() {
  const { token, user, loading } = useAuth();
  const [data, setData] = useState<DashboardData>({
    donations: [],
    application: null,
    notifications: []
  });
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setFetching(false);
      return;
    }

    if (demoModeEnabled && token.startsWith("demo-")) {
      setData({
        donations: demoDonations,
        application: demoVolunteer,
        notifications: demoNotifications
      });
      setFetching(false);
      return;
    }

    Promise.all([
      api.get("/donations/mine", { headers: authHeaders(token) }),
      api.get("/volunteers/mine", { headers: authHeaders(token) }),
      api.get("/notifications", { headers: authHeaders(token) })
    ])
      .then(([donations, volunteer, notifications]) => {
        setData({
          donations: donations.data.donations,
          application: volunteer.data.application,
          notifications: notifications.data.notifications
        });
      })
      .catch(() => toast.error("Unable to load your dashboard."))
      .finally(() => setFetching(false));
  }, [token]);

  const handleVolunteerApply = async (formData: FormData) => {
    if (!token) return;
    setSubmitting(true);
    try {
      if (demoModeEnabled && token.startsWith("demo-")) {
        toast.success("Demo volunteer application submitted.");
        setData((current) => ({
          ...current,
          application: {
            ...demoVolunteer,
            interestArea: String(formData.get("interestArea") || "Community support"),
            message: String(formData.get("message") || "")
          }
        }));
        return;
      }
      await api.post("/volunteers/apply", formData, {
        headers: {
          ...authHeaders(token),
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Volunteer application submitted.");
      window.location.reload();
    } catch {
      toast.error("Unable to submit volunteer application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || fetching) {
    return <div className="card p-8">Loading your dashboard...</div>;
  }

  if (!user) {
    return <div className="card p-8">Please login to access your dashboard.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-stone">Total donations</p>
          <p className="mt-3 font-serif text-4xl">{data.donations.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-stone">Volunteer status</p>
          <p className="mt-3 font-serif text-4xl capitalize">
            {data.application?.status || "Not started"}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-stone">Unread notifications</p>
          <p className="mt-3 font-serif text-4xl">
            {data.notifications.filter((item) => !item.read).length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="card space-y-5 p-8">
          <h2 className="font-serif text-3xl">Donation history</h2>
          <div className="space-y-4">
            {data.donations.length === 0 && (
              <p className="text-stone">You have not made a donation yet.</p>
            )}
            {data.donations.map((donation) => (
              <div
                key={donation._id}
                className="flex items-center justify-between rounded-2xl bg-sand/70 p-4"
              >
                <div>
                  <p className="font-medium">{donation.campaign.title}</p>
                  <p className="text-sm text-stone">
                    {format(new Date(donation.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{currency(donation.amount)}</p>
                  <p className="text-sm capitalize text-stone">{donation.status}</p>
                  {donation.status === "paid" && (
                    <Link
                      href={`/receipt?donor=${encodeURIComponent(user.name)}&email=${encodeURIComponent(
                        user.email
                      )}&campaign=${encodeURIComponent(
                        donation.campaign.title
                      )}&amount=${donation.amount}&date=${encodeURIComponent(
                        format(new Date(donation.createdAt), "dd MMM yyyy")
                      )}&donationId=${donation._id}`}
                      target="_blank"
                      className="mt-2 inline-flex text-sm text-ink underline"
                    >
                      Receipt
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card space-y-5 p-8">
          <h2 className="font-serif text-3xl">Volunteer application</h2>
          {data.application ? (
            <div className="space-y-3 rounded-3xl bg-sand/70 p-5">
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{data.application.status}</span>
              </p>
              <p>
                <span className="font-medium">Area:</span> {data.application.interestArea}
              </p>
              {data.application.remarks && (
                <p>
                  <span className="font-medium">Remarks:</span> {data.application.remarks}
                </p>
              )}
              {data.application.rejectionReason && (
                <p>
                  <span className="font-medium">Reason:</span>{" "}
                  {data.application.rejectionReason}
                </p>
              )}
            </div>
          ) : (
            <form
              action={handleVolunteerApply}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <input className="input" name="interestArea" placeholder="Interest area" />
              <textarea
                className="input min-h-28"
                name="message"
                placeholder="Why would you like to volunteer?"
              />
              <div className="space-y-2">
                <label className="text-sm text-stone">Profile photo</label>
                <input className="input" type="file" name="profilePhoto" accept="image/*" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-stone">Identity documents</label>
                <input
                  className="input"
                  type="file"
                  name="documents"
                  accept=".pdf,image/*"
                  multiple
                />
              </div>
              <button className="button-primary w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit volunteer application"}
              </button>
            </form>
          )}
        </section>
      </div>

      <section className="card space-y-4 p-8">
        <h2 className="font-serif text-3xl">Notifications</h2>
        {data.notifications.length === 0 && (
          <p className="text-stone">No notifications yet.</p>
        )}
        {data.notifications.map((item) => (
          <div key={item._id} className="rounded-2xl bg-white p-4">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-stone">{item.message}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
