"use client";

import React from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card, StatCard } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";

export function GstView() {
  const { data, showToast } = useAppStore();

  const totalGstCollected = data.bills.reduce((s, b) => s + b.gst, 0);
  const cgstCollected = totalGstCollected / 2;
  const sgstCollected = totalGstCollected / 2;

  const exportGstr1 = () => {
    showToast("GSTR-1 JSON & Excel file ready for CA Filing! 📄");
  };

  const gstSlabBreakdown = [
    { slab: "GST 0% (Exempted)", hsn: "1101 (Atta/Flour)", taxableVal: 2650, cgst: 0, sgst: 0, totalTax: 0 },
    { slab: "GST 5%", hsn: "1006, 0713, 1512", taxableVal: 4500, cgst: 112.5, sgst: 112.5, totalTax: 225 },
    { slab: "GST 12%", hsn: "0405, 1902", taxableVal: 3200, cgst: 192, sgst: 192, totalTax: 384 },
    { slab: "GST 18%", hsn: "3402, 3306", taxableVal: 2800, cgst: 252, sgst: 252, totalTax: 504 },
  ];

  const columns: Column[] = [
    { key: "slab", label: "GST Tax Slab", render: (v) => <strong>{v}</strong> },
    { key: "hsn", label: "HSN Codes" },
    { key: "taxableVal", label: "Taxable Turnover", render: (v) => `₹${v.toLocaleString("en-IN")}` },
    { key: "cgst", label: "CGST (Central)", render: (v) => `₹${v.toFixed(2)}` },
    { key: "sgst", label: "SGST (State)", render: (v) => `₹${v.toFixed(2)}` },
    { key: "totalTax", label: "Total Liability", render: (v) => <strong style={{ color: "#ef4444" }}>₹{v.toFixed(2)}</strong> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard label="Total Output GST Collected" value={`₹${totalGstCollected.toFixed(2)}`} icon="📋" color="#0ea5e9" />
        <StatCard label="CGST Share (Central)" value={`₹${cgstCollected.toFixed(2)}`} icon="🏛️" color="#8b5cf6" />
        <StatCard label="SGST Share (Punjab)" value={`₹${sgstCollected.toFixed(2)}`} icon="🌾" color="#10b981" />
      </div>

      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>GST Tax Portal & Filing Reports</h3>
          <span style={{ fontSize: 12, color: "#64748b" }}>Registered GSTIN: <strong>03AABCK1234Z1Z5</strong> (Punjab Region)</span>
        </div>
        <Btn variant="success" onClick={exportGstr1}>📥 Export GSTR-1 Data</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={gstSlabBreakdown} />
      </Card>
    </div>
  );
}
