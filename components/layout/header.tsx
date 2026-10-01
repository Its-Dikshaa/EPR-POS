"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import Link from "next/link";

export function Header() {
  const { data, currentUser, currentBranch, setCurrentBranch } = useAppStore();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <header
      style={{
        height: 60,
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Branch Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Active Branch:</span>
        <select
          value={currentBranch}
          onChange={(e) => setCurrentBranch(e.target.value)}
          style={{
            padding: "5px 10px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            fontSize: 12,
            fontWeight: 700,
            color: "#1e293b",
            background: "#f8fafc",
            outline: "none",
          }}
        >
          {data.branches.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Quick POS, Auth Portal Switcher & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href="/pos"
          style={{
            background: "#10b981",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🛒 POS Counter
        </Link>

        {/* Quick Auth & Onboarding Navigation Menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowAuthMenu(!showAuthMenu)}
            style={{
              background: "#0ea5e9",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🔐 Auth & Onboarding ▾
          </button>

          {showAuthMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 42,
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                padding: "8px 0",
                minWidth: 180,
                zIndex: 200,
              }}
              onClick={() => setShowAuthMenu(false)}
            >
              <Link
                href="/login"
                style={{
                  display: "block",
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                  textDecoration: "none",
                }}
              >
                🔑 Login Screen (`/login`)
              </Link>
              <Link
                href="/signup"
                style={{
                  display: "block",
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                  textDecoration: "none",
                }}
              >
                ✍️ Registration (`/signup`)
              </Link>
              <Link
                href="/welcome"
                style={{
                  display: "block",
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                  textDecoration: "none",
                }}
              >
                🏬 Welcome Page (`/welcome`)
              </Link>
              <Link
                href="/onboarding/business"
                style={{
                  display: "block",
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e293b",
                  textDecoration: "none",
                }}
              >
                🚀 Start Onboarding Wizard
              </Link>
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 24, background: "#e2e8f0" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#0f1f35",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {currentUser?.name ? currentUser.name.charAt(0) : "A"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>
              {currentUser?.name || "Admin User"}
            </div>
            <div style={{ fontSize: 11, color: "#0ea5e9", fontWeight: 600 }}>{currentUser?.role || "Admin"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
