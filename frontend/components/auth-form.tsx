"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { demoAdminUser, demoModeEnabled, demoNormalUser } from "@/lib/demo-data";

type Mode = "login" | "signup";

type FormValues = {
  name?: string;
  email: string;
  password: string;
  phone?: string;
};

export function AuthForm({ mode }: { mode: Mode }) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      try {
        const response = await api.post(
          mode === "login" ? "/auth/login" : "/auth/register",
          values
        );
        login(response.data.token, response.data.user);
      } catch {
        if (!demoModeEnabled) {
          throw new Error("API unavailable");
        }
        const demoUser =
          values.email === demoAdminUser.email ? demoAdminUser : {
            ...demoNormalUser,
            name: values.name || demoNormalUser.name,
            email: values.email
          };
        login(`demo-${demoUser.role}`, demoUser);
      }
      toast.success(mode === "login" ? "Welcome back." : "Account created.");
      router.push("/dashboard");
    } catch {
      toast.error("Unable to continue. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-8">
      {mode === "signup" && (
        <>
          <input className="input" placeholder="Full name" {...register("name")} />
          <input className="input" placeholder="Phone number" {...register("phone")} />
        </>
      )}
      <input className="input" placeholder="Email" type="email" {...register("email")} />
      <input className="input" placeholder="Password" type="password" {...register("password")} />
      <button className="button-primary w-full" disabled={submitting}>
        {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
      </button>
    </form>
  );
}
