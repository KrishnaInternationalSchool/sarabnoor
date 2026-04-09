import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="container-shell grid gap-8 py-16 md:grid-cols-2 md:items-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-stone">Account access</p>
        <h1 className="font-serif text-5xl">Return to your Sarab Noor dashboard.</h1>
        <p className="text-stone">
          Review donations, volunteer status, and notifications in one calm space.
        </p>
        <Link href="/signup" className="button-secondary">
          Need an account?
        </Link>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
