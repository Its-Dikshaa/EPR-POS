"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setSuccess(true);
  };

  return (
    <AuthShell subtitle="Set New Password">
      {!success ? (
        <form onSubmit={handleSubmit}>
          <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "#1e293b" }}>
            Create new password
          </h3>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            required
          />

          <Btn type="submit" style={{ width: "100%", justifyContent: "center", padding: "11px 0", marginTop: 8 }}>
            Reset Password →
          </Btn>
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
            Password updated!
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
            Your password has been successfully reset. You can now log in.
          </p>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <Btn style={{ width: "100%", justifyContent: "center" }}>
              Proceed to Login →
            </Btn>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
