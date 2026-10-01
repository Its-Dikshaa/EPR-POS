"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <AuthShell subtitle="Password Recovery">
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#1e293b" }}>
            Forgot password?
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>

          <Input
            label="Work Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@supermarket.com"
            required
          />

          <Btn
            type="submit"
            disabled={loading || !email}
            style={{ width: "100%", justifyContent: "center", padding: "11px 0", marginTop: 8 }}
          >
            {loading ? "Sending..." : "Send Reset Instructions →"}
          </Btn>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12 }}>
            <Link href="/login" style={{ color: "#64748b", textDecoration: "none" }}>
              ← Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#f0fdf4",
              color: "#166534",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              margin: "0 auto 12px",
            }}
          >
            ✓
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, color: "#1e293b" }}>
            Check your inbox
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
            We sent a password reset link to <strong>{email}</strong>.
          </p>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <Btn variant="outline" style={{ width: "100%", justifyContent: "center" }}>
              Return to Login
            </Btn>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
