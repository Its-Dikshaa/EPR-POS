"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "amit_cashier@kcsuper.com";
  const role = searchParams.get("role") || "Cashier";
  const storeName = searchParams.get("store") || "KC Main Store";

  const [name, setName] = useState("Amit Kumar");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "Cashier") {
        router.push("/pos");
      } else {
        router.push("/dashboard");
      }
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, marginBottom: 18, fontSize: 12, border: "1px solid #e2e8f0" }}>
        <div>Assigned Store: <strong>{storeName}</strong></div>
        <div>Your Email: <strong>{email}</strong></div>
        <div>Role Rights: <strong style={{ color: "#0ea5e9" }}>{role} Access</strong></div>
      </div>

      <Input
        label="Your Full Name"
        value={name}
        onChange={setName}
        required
      />

      <Input
        label="Set Account Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="At least 8 characters"
        required
      />

      <Btn
        type="submit"
        disabled={loading || !name || !password}
        style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14, marginTop: 8 }}
      >
        {loading ? "Activating Account..." : "Accept Invitation & Open POS →"}
      </Btn>
    </form>
  );
}

export default function AcceptInvitePage() {
  return (
    <AuthShell badge="Staff Invitation" subtitle="Invitation to join Store">
      <Suspense fallback={<div style={{ textAlign: "center", color: "#64748b", padding: 20 }}>Loading invitation...</div>}>
        <AcceptInviteForm />
      </Suspense>
    </AuthShell>
  );
}
