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
import { UserItem } from "@/types";

export function UsersView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "Cashier",
    branch: "KC Main Store",
  });

  const handleSave = () => {
    if (!formData.name || !formData.username) return;
    const newUser: UserItem = {
      id: Date.now(),
      name: formData.name,
      username: formData.username,
      role: formData.role,
      branch: formData.branch,
      status: "Active",
      lastLogin: "Never",
    };
    setData((prev: any) => ({ ...prev, users: [...prev.users, newUser] }));
    showToast(`Staff User account ${newUser.username} created! 🔐`);
    setShowModal(false);
  };

  const columns: Column<UserItem>[] = [
    { key: "name", label: "Staff Name", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>@{r.username}</div></div> },
    { key: "role", label: "Assigned Role", render: (v) => <Badge text={v} color={v === "Admin" ? "purple" : v === "Manager" ? "blue" : "green"} /> },
    { key: "branch", label: "Assigned Branch" },
    { key: "lastLogin", label: "Last Active" },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color="green" /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Users, Cashiers & Role-Based Access Control (RBAC)</h3>
        <Btn onClick={() => setShowModal(true)}>+ Create Staff Account</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.users} />
      </Card>

      {showModal && (
        <Modal title="🔐 Create Staff User Account" onClose={() => setShowModal(false)}>
          <Input label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Login Username" value={formData.username} onChange={(v) => setFormData({ ...formData, username: v })} required />
          <Select label="User Role" value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} options={["Admin", "Super Admin", "Manager", "Cashier", "Inventory Staff"]} />
          <Select label="Assigned Branch" value={formData.branch} onChange={(v) => setFormData({ ...formData, branch: v })} options={["All", ...data.branches.map((b) => b.name)]} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Create User</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
