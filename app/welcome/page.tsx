"use client";

import React from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Btn } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <AuthShell subtitle="Retail ERP & Point of Sale Management System">
      <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.01em" }}>
          Run your store smarter
        </h2>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
          Manage sales, POS billing, inventory stock, customer credit, supplier purchases, and GST tax filings — all in one unified platform.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <Btn style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14 }}>
              🏬 Create your store
            </Btn>
          </Link>

          <Link href="/login" style={{ textDecoration: "none" }}>
            <Btn variant="ghost" style={{ width: "100%", justifyContent: "center", padding: "10px 0", fontSize: 13, color: "#64748b" }}>
              Already have an account? Log in
            </Btn>
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
