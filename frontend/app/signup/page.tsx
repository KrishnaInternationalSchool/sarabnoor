import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="container-shell grid gap-8 py-16 md:grid-cols-2 md:items-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-stone">Join Sarab Noor</p>
        <h1 className="font-serif text-5xl">Create your account and support with intention.</h1>
        <p className="text-stone">
          Donate, volunteer, and stay informed about the care your support enables.
        </p>
        <Link href="/login" className="button-secondary">
          Already have an account?
        </Link>
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
