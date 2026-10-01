"use client";

import React from "react";
import { useAppStore } from "@/lib/store/app-context";
import { StatCard, Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, Column } from "../ui/table";
import { DashboardChecklist } from "../ui/dashboard-checklist";
import { BillItem } from "@/types";

export function DashboardView() {
  const { data } = useAppStore();

  const totalSales = data.bills.reduce((sum, b) => sum + b.total, 0);
  const lowStockCount = data.products.filter((p) => p.stock <= 10).length;

  const billColumns: Column<BillItem>[] = [
    { key: "id", label: "Bill No" },
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total", render: (v) => `₹${v}` },
    { key: "payment", label: "Payment", render: (v) => <Badge text={v} color={v === "Cash" ? "green" : v === "UPI" ? "purple" : "blue"} /> },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color="green" /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Post-Onboarding Setup Checklist Widget */}
      <DashboardChecklist />

      {/* Top Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard label="Total Sales Today" value={`₹${totalSales.toLocaleString("en-IN")}`} icon="💰" sub="▲ +14% vs yesterday" color="#10b981" />
        <StatCard label="Total Bills" value={data.bills.length} icon="🧾" sub="Active POS counter" color="#0ea5e9" />
        <StatCard label="Total Products" value={data.products.length} icon="📦" sub="Active catalog" color="#8b5cf6" />
        <StatCard label="Low Stock Alerts" value={lowStockCount} icon="⚠️" sub={lowStockCount > 0 ? "Requires reorder" : "All good"} color="#ef4444" />
      </div>

      {/* Main Grid Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Left Column: Recent Bills */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Recent Transactions</h3>
            <span style={{ fontSize: 12, color: "#0ea5e9", fontWeight: 600 }}>Live Feed 🟢</span>
          </div>
          <Table columns={billColumns} data={data.bills} />
        </Card>

        {/* Right Column: Quick Widgets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Low Stock Warnings */}
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>⚠️ Low Stock Warnings</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.products
                .filter((p) => p.stock <= 10)
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#fef2f2",
                      borderRadius: 8,
                      borderLeft: "4px solid #ef4444",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#991b1b" }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>Rack: {p.rack || "A1"}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#ef4444" }}>{p.stock} left</span>
                  </div>
                ))}
              {lowStockCount === 0 && <div style={{ fontSize: 12, color: "#64748b" }}>No low stock alerts right now</div>}
            </div>
          </Card>

          {/* Payment Mode Distribution */}
          <Card>
            <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#1e293b" }}>💳 Payment Breakdown</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Cash:</span> <strong>₹4,420 (42%)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>UPI / QR:</span> <strong>₹3,450 (33%)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Card:</span> <strong>₹2,700 (25%)</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
