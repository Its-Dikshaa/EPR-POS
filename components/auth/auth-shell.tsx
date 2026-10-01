"use client";

import React from "react";
import Link from "next/link";

interface AuthShellProps {
  children: React.ReactNode;
  subtitle?: string;
  badge?: string;
}

export function AuthShell({ children, subtitle, badge }: AuthShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f1f35 0%, #1a2e4a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Brand Top Badge */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: "#0ea5e9",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 26,
              margin: "0 auto 12px",
              boxShadow: "0 8px 20px rgba(14,165,233,0.3)",
            }}
          >
            KC
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.01em" }}>
            KC Supermarket
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            {subtitle || "Enterprise Retail ERP & POS Billing Platform"}
          </p>
          {badge && (
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "3px 12px",
                borderRadius: 20,
                background: "#f0fdf4",
                color: "#166534",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
