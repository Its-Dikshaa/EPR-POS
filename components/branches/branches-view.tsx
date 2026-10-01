"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { BranchItem } from "@/types";

export function BranchesView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    manager: "",
    phone: "",
    email: "",
    gst: "",
  });

  const handleSave = () => {
    if (!formData.name) return;
    const newBranch: BranchItem = {
      id: Date.now(),
      name: formData.name,
      location: formData.location,
      manager: formData.manager,
      phone: formData.phone,
      status: "Active",
      sales: 0,
      type: "Branch",
      email: formData.email,
      gst: formData.gst,
      openTime: "8:00 AM",
      closeTime: "10:00 PM",
      staff: 5,
      franchise: false,
    };
    setData((prev: any) => ({ ...prev, branches: [...prev.branches, newBranch] }));
    showToast(`Branch ${newBranch.name} added! 🏢`);
    setShowModal(false);
  };

  const columns: Column<BranchItem>[] = [
    { key: "name", label: "Branch Name", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>{r.location}</div></div> },
    { key: "manager", label: "Store Manager" },
    { key: "phone", label: "Contact Phone" },
    { key: "staff", label: "Staff Count", render: (v) => `${v} Employees` },
    { key: "sales", label: "Total Sales", render: (v) => <strong style={{ color: "#10b981" }}>₹{v.toLocaleString("en-IN")}</strong> },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color="green" /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Multi-Branch Directory & Outlet Management</h3>
        <Btn onClick={() => setShowModal(true)}>+ Onboard New Branch</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.branches} />
      </Card>

      {showModal && (
        <Modal title="🏢 Onboard New Supermarket Branch" onClose={() => setShowModal(false)}>
          <Input label="Branch Outlet Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Location Address" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
          <Input label="Manager Name" value={formData.manager} onChange={(v) => setFormData({ ...formData, manager: v })} />
          <Input label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
          <Input label="Branch Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
          <Input label="Branch GSTIN" value={formData.gst} onChange={(v) => setFormData({ ...formData, gst: v })} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Save Branch</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
