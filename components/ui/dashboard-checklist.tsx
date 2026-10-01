"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "./card";
import { Btn } from "./button";

export function DashboardChecklist() {
  const { dismissChecklist, setDismissChecklist } = useAppStore();
  const [minimized, setMinimized] = useState(false);

  if (dismissChecklist) return null;

  return (
    <Card
      style={{
        background: "linear-gradient(135deg, #0f1f35 0%, #1a2e4a 100%)",
        color: "#fff",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 20,
        boxShadow: "0 10px 25px rgba(15, 31, 53, 0.2)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#0ea5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🚀
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff" }}>
                Complete your Store Setup
              </h4>
              <span
                style={{
                  background: "#10b981",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                75% Complete
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
              Finish configuring your store to unlock receipt printing & team access.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/onboarding/team" style={{ textDecoration: "none" }}>
            <Btn variant="primary" size="sm">
              Continue setup →
            </Btn>
          </Link>
          <button
            onClick={() => setMinimized(!minimized)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {minimized ? "▼" : "▲"}
          </button>
          <button
            onClick={() => setDismissChecklist(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {!minimized && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            fontSize: 12,
          }}
        >
          <div style={{ color: "#10b981", fontWeight: 600 }}>✓ Business Information</div>
          <div style={{ color: "#10b981", fontWeight: 600 }}>✓ Store Details</div>
          <div style={{ color: "#10b981", fontWeight: 600 }}>✓ Products Catalog</div>
          <div style={{ color: "#10b981", fontWeight: 600 }}>✓ POS Terminal Setup</div>
          <div style={{ color: "#94a3b8" }}>○ Configure Receipt Printer</div>
          <div style={{ color: "#0ea5e9", fontWeight: 700 }}>
            <Link href="/onboarding/team" style={{ color: "#0ea5e9", textDecoration: "none" }}>
              ○ Invite Team Members
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
