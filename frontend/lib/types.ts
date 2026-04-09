export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
};

export type Campaign = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  coverImage: string;
  gallery: string[];
  status: "draft" | "active" | "completed";
  featured: boolean;
  createdAt: string;
};

export type Donation = {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  campaign: Campaign;
};

export type VolunteerApplication = {
  _id: string;
  interestArea: string;
  message: string;
  profilePhoto: string;
  documents: { label: string; fileUrl: string }[];
  status: "pending" | "verified" | "rejected";
  remarks?: string;
  rejectionReason?: string;
  verifiedVolunteer: boolean;
  createdAt: string;
};

export type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};
