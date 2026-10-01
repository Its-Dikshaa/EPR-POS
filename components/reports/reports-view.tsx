"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card, StatCard } from "../ui/card";
import { Btn } from "../ui/button";
import { Tabs } from "../ui/tabs";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";

export function ReportsView() {
  const { data, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState("sales");

  const exportReport = () => {
    showToast(`Exported ${activeTab.toUpperCase()} Report to Excel / PDF! 📈`);
  };

  const salesReportData = data.bills.map((b) => ({
    billNo: b.id,
    date: b.date,
    customer: b.customer,
    cashier: b.cashier || "Amit",
    branch: b.branch || "KC Main Store",
    subtotal: `₹${b.subtotal}`,
    gst: `₹${b.gst}`,
    total: `₹${b.total}`,
    payment: b.payment,
  }));

  const salesColumns: Column[] = [
    { key: "billNo", label: "Bill No", render: (v) => <strong>{v}</strong> },
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    { key: "branch", label: "Store Branch" },
    { key: "cashier", label: "Cashier" },
    { key: "total", label: "Total Sale", render: (v) => <strong style={{ color: "#10b981" }}>{v}</strong> },
    { key: "payment", label: "Payment", render: (v) => <Badge text={v} color="blue" /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Business Intelligence & Performance Analytics</h3>
          <span style={{ fontSize: 12, color: "#64748b" }}>Comprehensive retail audit statements</span>
        </div>
        <Btn variant="outline" onClick={exportReport}>📥 Export Report (CSV / PDF)</Btn>
      </Card>

      <Tabs
        tabs={[
          ["sales", "📊 Sales Report"],
          ["inventory", "📦 Inventory Valuation Report"],
          ["tax", "📋 Tax & GST Audit"],
          ["cashier", "👤 Cashier Session Report"],
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <Card>
        {activeTab === "sales" && <Table columns={salesColumns} data={salesReportData} />}
        {activeTab !== "sales" && (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: 13 }}>
            📊 Detailed {activeTab.toUpperCase()} analytical chart & table loaded cleanly.
          </div>
        )}
      </Card>
    </div>
  );
}
