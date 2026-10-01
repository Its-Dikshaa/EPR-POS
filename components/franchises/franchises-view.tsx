"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { FranchiseItem } from "@/types";

export function FranchisesView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    phone: "",
    email: "",
    location: "",
    royaltyPct: "5",
    depositPaid: "200000",
  });

  const handleSave = () => {
    if (!formData.name || !formData.owner) return;
    const newFran: FranchiseItem = {
      id: Date.now(),
      name: formData.name,
      owner: formData.owner,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
      royaltyPct: parseFloat(formData.royaltyPct),
      startDate: new Date().toISOString().split("T")[0],
      status: "Active",
      sales: 0,
      agreement: "5 years",
      depositPaid: parseFloat(formData.depositPaid),
    };
    setData((prev: any) => ({ ...prev, franchises: [...prev.franchises, newFran] }));
    showToast(`Franchise partner ${newFran.name} onboarded! 🏪`);
    setShowModal(false);
  };

  const columns: Column<FranchiseItem>[] = [
    { key: "name", label: "Franchise Store", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>Owner: {r.owner}</div></div> },
    { key: "location", label: "Location" },
    { key: "phone", label: "Phone" },
    { key: "royaltyPct", label: "Royalty %", render: (v) => <strong>{v}%</strong> },
    { key: "depositPaid", label: "Deposit Paid", render: (v) => `₹${v.toLocaleString("en-IN")}` },
    { key: "sales", label: "Monthly Sales", render: (v) => <strong style={{ color: "#10b981" }}>₹{v.toLocaleString("en-IN")}</strong> },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color="green" /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Franchise Partner Network & Royalty Tracking</h3>
        <Btn onClick={() => setShowModal(true)}>+ Onboard Franchise Partner</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.franchises} />
      </Card>

      {showModal && (
        <Modal title="🏪 Onboard Franchise Partner" onClose={() => setShowModal(false)}>
          <Input label="Franchise Store Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Franchise Owner Name" value={formData.owner} onChange={(v) => setFormData({ ...formData, owner: v })} required />
          <Input label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
          <Input label="Email Address" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
          <Input label="Store Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
          <Input label="Royalty Share (%)" type="number" value={formData.royaltyPct} onChange={(v) => setFormData({ ...formData, royaltyPct: v })} />
          <Input label="Security Deposit (₹)" type="number" value={formData.depositPaid} onChange={(v) => setFormData({ ...formData, depositPaid: v })} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Save Franchise</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
