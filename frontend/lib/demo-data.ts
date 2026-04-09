import type { Campaign, Donation, NotificationItem, User, VolunteerApplication } from "@/lib/types";

export const demoModeEnabled =
  process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";

export const demoCampaigns: Campaign[] = [
  {
    _id: "demo-campaign-1",
    title: "Nourish Families With Dignity",
    slug: "nourish-families-with-dignity",
    summary: "Support monthly ration kits and warm meals for families facing hardship.",
    description:
      "This campaign helps Sarab Noor provide essential food support, nutrition kits, and emergency groceries to underserved families with care and transparent distribution.",
    goalAmount: 250000,
    raisedAmount: 92000,
    coverImage:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    status: "active",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "demo-campaign-2",
    title: "Education Support For Young Learners",
    slug: "education-support-for-young-learners",
    summary: "Help provide school supplies, learning access, and compassionate mentoring.",
    description:
      "Sarab Noor supports children with school materials, fee assistance, and volunteer-led learning support so that hardship does not interrupt education.",
    goalAmount: 180000,
    raisedAmount: 64000,
    coverImage:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    status: "active",
    featured: false,
    createdAt: new Date().toISOString()
  }
];

export const demoAdminUser: User = {
  _id: "demo-admin",
  name: "Sarab Noor Admin",
  email: "admin@sarabnoor.com",
  role: "admin"
};

export const demoNormalUser: User = {
  _id: "demo-user",
  name: "Demo Supporter",
  email: "demo@sarabnoor.com",
  role: "user"
};

export const demoDonations: Donation[] = [
  {
    _id: "donation-1",
    amount: 1000,
    status: "paid",
    createdAt: new Date().toISOString(),
    campaign: demoCampaigns[0]
  }
];

export const demoVolunteer: VolunteerApplication = {
  _id: "volunteer-1",
  interestArea: "Food distribution",
  message: "I would like to support weekend field work.",
  profilePhoto: "",
  documents: [{ label: "Aadhar.pdf", fileUrl: "#" }],
  status: "pending",
  remarks: "Documents received and under review.",
  rejectionReason: "",
  verifiedVolunteer: false,
  createdAt: new Date().toISOString()
};

export const demoNotifications: NotificationItem[] = [
  {
    _id: "notice-1",
    title: "Welcome to Sarab Noor",
    message: "Your demo account is ready. Explore campaigns and volunteer opportunities.",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "notice-2",
    title: "Donation received",
    message: "Thank you for supporting our nourishment campaign.",
    read: false,
    createdAt: new Date().toISOString()
  }
];
