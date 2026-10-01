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
import { CustomerItem } from "@/types";

export function CustomersView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    creditLimit: "5000",
    group: "Regular",
  });

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      showToast("Name and phone number are required!", "error");
      return;
    }
    const newCust: CustomerItem = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      loyaltyPoints: 100,
      creditLimit: parseFloat(formData.creditLimit),
      outstanding: 0,
      group: formData.group,
    };
    setData((prev: any) => ({ ...prev, customers: [newCust, ...prev.customers] }));
    showToast("Customer added! Welcome bonus 100 loyalty points awarded. ⭐");
    setShowModal(false);
  };

  const columns: Column<CustomerItem>[] = [
    { key: "name", label: "Customer Name", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>{r.phone}</div></div> },
    { key: "email", label: "Email", render: (v) => v || "—" },
    { key: "group", label: "Group", render: (v) => <Badge text={v} color={v === "Premium" ? "purple" : "blue"} /> },
    { key: "loyaltyPoints", label: "Loyalty Points", render: (v) => <strong>⭐ {v} pts</strong> },
    { key: "creditLimit", label: "Credit Limit", render: (v) => `₹${v}` },
    { key: "outstanding", label: "Outstanding Dues", render: (v) => <span style={{ color: v > 0 ? "#ef4444" : "#10b981", fontWeight: 700 }}>₹{v}</span> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Customer Relationship Management (CRM) & Credit Ledger</h3>
        <Btn onClick={() => setShowModal(true)}>+ Register New Customer</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.customers} />
      </Card>

      {showModal && (
        <Modal title="👥 Register New Customer" onClose={() => setShowModal(false)}>
          <Input label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} required />
          <Input label="Email Address" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
          <Input label="City / Address" value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} />
          <Input label="Credit Limit Allowed (₹)" type="number" value={formData.creditLimit} onChange={(v) => setFormData({ ...formData, creditLimit: v })} />
          <Select label="Customer Group" value={formData.group} onChange={(v) => setFormData({ ...formData, group: v })} options={["Regular", "VIP", "Wholesale", "Premium"]} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Save Customer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
