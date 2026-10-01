"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { ExpenseItem } from "@/types";

export function ExpensesView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: "Electricity",
    amount: "5000",
    description: "",
    paidBy: "Cash",
  });

  const handleSave = () => {
    if (!formData.amount) return;
    const newExp: ExpenseItem = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      status: "Approved",
      paidBy: formData.paidBy,
    };
    setData((prev: any) => ({ ...prev, expenses: [newExp, ...prev.expenses] }));
    showToast("Expense logged successfully! 💸");
    setShowModal(false);
  };

  const totalExpense = data.expenses.reduce((s, e) => s + e.amount, 0);

  const columns: Column<ExpenseItem>[] = [
    { key: "date", label: "Date" },
    { key: "category", label: "Expense Category", render: (v) => <strong>{v}</strong> },
    { key: "description", label: "Description" },
    { key: "amount", label: "Amount", render: (v) => <span style={{ color: "#ef4444", fontWeight: 700 }}>₹{v.toLocaleString("en-IN")}</span> },
    { key: "paidBy", label: "Payment Source" },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color={v === "Approved" ? "green" : "yellow"} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Store Operational Expenses</h3>
          <span style={{ fontSize: 12, color: "#64748b" }}>Total Expenses Recorded: <strong>₹{totalExpense.toLocaleString("en-IN")}</strong></span>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ Record New Expense</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.expenses} />
      </Card>

      {showModal && (
        <Modal title="💸 Record Store Expense" onClose={() => setShowModal(false)}>
          <Select label="Expense Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} options={["Electricity", "Staff Salary", "Rent", "Maintenance", "Tea & Refreshment", "Logistics", "Marketing", "Miscellaneous"]} />
          <Input label="Amount (₹)" type="number" value={formData.amount} onChange={(v) => setFormData({ ...formData, amount: v })} required />
          <Input label="Expense Description / Notes" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} />
          <Select label="Payment Source" value={formData.paidBy} onChange={(v) => setFormData({ ...formData, paidBy: v })} options={["Cash", "Bank", "UPI", "Petty Cash"]} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Record Expense</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
