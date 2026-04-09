import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <div className="container-shell space-y-8 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-stone">User dashboard</p>
        <h1 className="font-serif text-5xl">Your giving, volunteering, and updates.</h1>
      </div>
      <DashboardClient />
    </div>
  );
}
