"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "dashboard", href: "/dashboard", icon: "📊", label: "Dashboard" },
  { id: "pos", href: "/pos", icon: "🛒", label: "POS Billing" },
  { id: "products", href: "/products", icon: "📦", label: "Products" },
  { id: "inventory", href: "/inventory", icon: "🏪", label: "Inventory" },
  { id: "purchases", href: "/purchases", icon: "🛍️", label: "Purchases" },
  { id: "customers", href: "/customers", icon: "👥", label: "Customers" },
  { id: "suppliers", href: "/suppliers", icon: "🏭", label: "Suppliers" },
  { id: "expenses", href: "/expenses", icon: "💸", label: "Expenses" },
  { id: "discounts", href: "/discounts", icon: "🏷️", label: "Discounts" },
  { id: "accounting", href: "/accounting", icon: "📒", label: "Accounting" },
  { id: "gst", href: "/gst", icon: "📋", label: "GST & Tax" },
  { id: "reports", href: "/reports", icon: "📈", label: "Reports" },
  { id: "branches", href: "/branches", icon: "🏢", label: "Branches" },
  { id: "franchises", href: "/franchises", icon: "🏪", label: "Franchises" },
  { id: "users", href: "/users", icon: "🔐", label: "Users & Roles" },
  { id: "settings", href: "/settings", icon: "⚙️", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        background: "#0f1f35",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "20px 18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "#0ea5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          KC
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: "0.02em" }}>KC Supermarket</h1>
          <span style={{ fontSize: 10, color: "#0ea5e9", fontWeight: 600 }}>ERP & POS Billing v2.0</span>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.id === "dashboard");
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 12px",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "#0ea5e9" : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Store Footer */}
      <div
        style={{
          padding: 14,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "#0b1728",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        <div style={{ fontWeight: 700, color: "#fff", marginBottom: 2 }}>📍 KC Main Store</div>
        <div>Hall Bazaar, Amritsar</div>
        <div style={{ fontSize: 10, color: "#0ea5e9", marginTop: 4 }}>🟢 Database Online</div>
      </div>
    </aside>
  );
}
