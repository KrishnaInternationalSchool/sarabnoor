"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, HeartHandshake, LayoutDashboard } from "lucide-react";
import { Toaster } from "sonner";

import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/60 bg-cream/90 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-2xl">Sarab Noor</p>
              <p className="text-xs uppercase tracking-[0.35em] text-stone">
                Relief with dignity
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href ? "text-ink" : "text-stone hover:text-ink"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm text-stone sm:inline">
                  {user.name}
                </span>
                <button onClick={logout} className="button-secondary">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="button-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="container-shell py-10 text-sm text-stone">
        <div className="card flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4" />
            <span>Built for compassionate giving, transparent stewardship, and volunteer care.</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Sarab Noor platform</span>
          </div>
        </div>
      </footer>
      <Toaster richColors position="top-right" />
    </>
  );
}
