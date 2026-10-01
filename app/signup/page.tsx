"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
  const isPasswordValid = password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid work email address (e.g. name@store.com).");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }, 800);
  };

  return (
    <AuthShell subtitle="Create your Store Owner Account">
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="e.g. Sunil Kapoor"
          required
        />

        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="sunil@supermarket.com"
          required
        />

        <div style={{ marginBottom: 16, position: "relative" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase" }}>
            Password *
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 13,
                color: "#1e293b",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: 12,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              {showPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: password.length >= 8 ? "#10b981" : "#64748b", marginTop: 4 }}>
            {password.length >= 8 ? "✓ Password strength good" : "• Minimum 8 characters required"}
          </div>
        </div>

        <Btn
          type="submit"
          disabled={loading || !name || !email || !password}
          style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14, marginTop: 8 }}
        >
          {loading ? "Creating Account..." : "Create Account →"}
        </Btn>
      </form>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#64748b" }}>
        Already registered?{" "}
        <Link href="/login" style={{ color: "#0ea5e9", fontWeight: 700, textDecoration: "none" }}>
          Log in
        </Link>
      </div>
    </AuthShell>
  );
}
