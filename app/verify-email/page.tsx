"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "owner@supermarket.com";

  const [cooldown, setCooldown] = useState(30);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown === 0) {
      setResent(true);
      setCooldown(45);
    }
  };

  const handleVerifiedContinue = () => {
    router.push("/onboarding/business");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "#eff6ff",
          color: "#0ea5e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          margin: "0 auto 14px",
        }}
      >
        ✉️
      </div>

      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#1e293b" }}>
        Verify your email
      </h2>

      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
        We sent a verification link to:<br />
        <strong style={{ color: "#1e293b" }}>{email}</strong>
      </p>

      {resent && (
        <div
          style={{
            background: "#f0fdf4",
            color: "#166534",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          ✓ Verification email re-sent! Check your inbox.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
        <Btn onClick={handleVerifiedContinue} style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}>
          ✓ I've verified my email — Continue →
        </Btn>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginTop: 6 }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            style={{
              background: "none",
              border: "none",
              color: cooldown > 0 ? "#94a3b8" : "#0ea5e9",
              fontWeight: 700,
              cursor: cooldown > 0 ? "not-allowed" : "pointer",
              padding: 0,
            }}
          >
            {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email"}
          </button>

          <Link href="/signup" style={{ color: "#64748b", textDecoration: "none" }}>
            Change email
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell subtitle="Email Verification Required">
      <Suspense fallback={<div style={{ textAlign: "center", color: "#64748b", padding: 20 }}>Loading email verification...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthShell>
  );
}
