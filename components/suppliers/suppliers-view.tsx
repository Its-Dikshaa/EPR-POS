"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { SupplierItem } from "@/types";

export function SuppliersView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    gst: "",
    address: "",
    creditDays: "30",
  });

  const handleSave = () => {
    if (!formData.name) return;
    const newSup: SupplierItem = {
      id: Date.now(),
      name: formData.name,
      contact: formData.contact,
      phone: formData.phone,
      gst: formData.gst,
      address: formData.address,
      outstanding: 0,
      creditDays: parseInt(formData.creditDays),
    };
    setData((prev: any) => ({ ...prev, suppliers: [newSup, ...prev.suppliers] }));
    showToast("Supplier saved! ✅");
    setShowModal(false);
  };

  const columns: Column<SupplierItem>[] = [
    { key: "name", label: "Supplier Company", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>GST: {r.gst || "Unregistered"}</div></div> },
    { key: "contact", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "creditDays", label: "Credit Term", render: (v) => `${v} Days` },
    { key: "outstanding", label: "Outstanding Dues", render: (v) => <span style={{ color: "#ef4444", fontWeight: 700 }}>₹{v.toLocaleString("en-IN")}</span> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Supplier Directory & Payables Ledger</h3>
        <Btn onClick={() => setShowModal(true)}>+ Add Vendor / Supplier</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.suppliers} />
      </Card>

      {showModal && (
        <Modal title="🏭 Add Vendor / Supplier" onClose={() => setShowModal(false)}>
          <Input label="Company Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Contact Representative" value={formData.contact} onChange={(v) => setFormData({ ...formData, contact: v })} />
          <Input label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
          <Input label="GSTIN Number" value={formData.gst} onChange={(v) => setFormData({ ...formData, gst: v })} />
          <Input label="Address / City" value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} />
          <Input label="Allowed Credit Days" type="number" value={formData.creditDays} onChange={(v) => setFormData({ ...formData, creditDays: v })} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Save Supplier</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
