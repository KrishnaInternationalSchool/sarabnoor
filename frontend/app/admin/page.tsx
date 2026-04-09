import { AdminPanel } from "@/components/admin-panel";

export default function AdminPage() {
  return (
    <div className="container-shell space-y-8 py-16">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-stone">Admin panel</p>
        <h1 className="font-serif text-5xl">Campaigns, volunteers, donations, and updates.</h1>
      </div>
      <AdminPanel />
    </div>
  );
}
