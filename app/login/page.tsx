"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-context";

export default function LoginPage() {
  const router = useRouter();
  const { isOnboardingCompleted, onboardingStep } = useAppStore();

  const [email, setEmail] = useState("admin@kcsupermarket.com");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Check Onboarding status
      if (isOnboardingCompleted) {
        router.push("/dashboard");
      } else {
        // Resume incomplete onboarding step
        router.push(`/onboarding/${onboardingStep || "business"}`);
      }
    }, 600);
  };

  return (
    <AuthShell subtitle="Log in to your store account">
      <form onSubmit={handleLogin}>
        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="admin@kcsupermarket.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, fontSize: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link href="/forgot-password" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>

        <Btn
          type="submit"
          disabled={loading || !email || !password}
          style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14 }}
        >
          {loading ? "Authenticating..." : "Log in to Store →"}
        </Btn>
      </form>

      <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#64748b" }}>
        Don't have an account?{" "}
        <Link href="/signup" style={{ color: "#0ea5e9", fontWeight: 700, textDecoration: "none" }}>
          Create your store
        </Link>
      </div>
    </AuthShell>
  );
}
