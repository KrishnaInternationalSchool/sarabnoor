import { ReceiptPrintButton } from "@/components/receipt-print-button";
import { currency } from "@/lib/utils";

export default function ReceiptPage({
  searchParams
}: {
  searchParams: {
    donor?: string;
    email?: string;
    campaign?: string;
    amount?: string;
    date?: string;
    donationId?: string;
  };
}) {
  const amount = Number(searchParams.amount || 0);

  return (
    <div className="container-shell py-16">
      <div className="card mx-auto max-w-3xl space-y-8 p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-stone">Donation receipt</p>
            <h1 className="mt-3 font-serif text-5xl">Sarab Noor</h1>
            <p className="mt-2 text-stone">Relief with dignity</p>
          </div>
          <ReceiptPrintButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-sand/70 p-5">
            <p className="text-sm text-stone">Donor</p>
            <p className="mt-2 font-medium">{searchParams.donor || "Supporter"}</p>
          </div>
          <div className="rounded-3xl bg-sand/70 p-5">
            <p className="text-sm text-stone">Email</p>
            <p className="mt-2 font-medium">{searchParams.email || "-"}</p>
          </div>
          <div className="rounded-3xl bg-sand/70 p-5">
            <p className="text-sm text-stone">Campaign</p>
            <p className="mt-2 font-medium">{searchParams.campaign || "-"}</p>
          </div>
          <div className="rounded-3xl bg-sand/70 p-5">
            <p className="text-sm text-stone">Amount</p>
            <p className="mt-2 font-medium">{currency(amount)}</p>
          </div>
          <div className="rounded-3xl bg-sand/70 p-5">
            <p className="text-sm text-stone">Date</p>
            <p className="mt-2 font-medium">{searchParams.date || "-"}</p>
          </div>
          <div className="rounded-3xl bg-sand/70 p-5">
            <p className="text-sm text-stone">Reference</p>
            <p className="mt-2 font-medium">{searchParams.donationId || "-"}</p>
          </div>
        </div>

        <p className="text-sm leading-7 text-stone">
          Thank you for supporting Sarab Noor. This receipt can be saved as PDF from the print
          dialog for donor records.
        </p>
      </div>
    </div>
  );
}
