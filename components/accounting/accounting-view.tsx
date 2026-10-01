"use client";

import React from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card, StatCard } from "../ui/card";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";

export function AccountingView() {
  const { data } = useAppStore();

  const totalRevenue = data.bills.reduce((s, b) => s + b.total, 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const ledgerEntries = [
    ...data.bills.map((b) => ({
      date: b.date,
      ref: b.id,
      particulars: `Sales Collection (${b.customer})`,
      type: "Credit (Income)",
      amount: b.total,
      mode: b.payment,
    })),
    ...data.expenses.map((e) => ({
      date: e.date,
      ref: `EXP-${e.id}`,
      particulars: `Store Expense (${e.category})`,
      type: "Debit (Expense)",
      amount: e.amount,
      mode: e.paidBy,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "ref", label: "Reference" },
    { key: "particulars", label: "Particulars" },
    { key: "type", label: "Type", render: (v) => <Badge text={v} color={v.includes("Credit") ? "green" : "red"} /> },
    { key: "amount", label: "Amount", render: (v, r) => <strong style={{ color: r.type.includes("Credit") ? "#10b981" : "#ef4444" }}>₹{v.toLocaleString("en-IN")}</strong> },
    { key: "mode", label: "Payment Mode" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard label="Total Revenue (Income)" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon="📈" color="#10b981" />
        <StatCard label="Total Expenses (Outflow)" value={`₹${totalExpenses.toLocaleString("en-IN")}`} icon="📉" color="#ef4444" />
        <StatCard label="Net Operating Profit" value={`₹${netProfit.toLocaleString("en-IN")}`} icon="💎" sub={netProfit > 0 ? "Positive Cashflow" : "Deficit"} color="#0ea5e9" />
      </div>

      <Card>
        <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>📒 General Ledger & Cash Book Statements</h3>
        <Table columns={columns} data={ledgerEntries} />
      </Card>
    </div>
  );
}
