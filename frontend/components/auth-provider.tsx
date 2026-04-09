"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useRouter } from "next/navigation";

import { api, authHeaders } from "@/lib/api";
import { demoAdminUser, demoModeEnabled, demoNormalUser } from "@/lib/demo-data";
import type { User } from "@/lib/types";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = window.localStorage.getItem("sarab-token");
    const storedUser = window.localStorage.getItem("sarab-user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (demoModeEnabled && storedToken.startsWith("demo-")) {
        setLoading(false);
        return;
      }
      api
        .get("/auth/me", { headers: authHeaders(storedToken) })
        .then((response) => setUser(response.data.user))
        .catch(() => {
          window.localStorage.removeItem("sarab-token");
          window.localStorage.removeItem("sarab-user");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login: (nextToken: string, nextUser: User) => {
        window.localStorage.setItem("sarab-token", nextToken);
        window.localStorage.setItem("sarab-user", JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        window.localStorage.removeItem("sarab-token");
        window.localStorage.removeItem("sarab-user");
        setToken(null);
        setUser(null);
        router.push("/login");
      }
    }),
    [loading, router, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const getDemoUser = (email: string) =>
  email === demoAdminUser.email ? demoAdminUser : demoNormalUser;
