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
import { DiscountItem } from "@/types";

export function DiscountsView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Bill Discount",
    valType: "Percentage",
    value: "10",
    validity: "2026-12-31",
  });

  const handleSave = () => {
    if (!formData.name || !formData.code) return;
    const newDisc: DiscountItem = {
      id: Date.now(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      type: formData.type,
      valType: formData.valType,
      value: parseFloat(formData.value),
      validity: formData.validity,
      status: "Active",
      applicableProducts: ["All Products"],
    };
    setData((prev: any) => ({ ...prev, discounts: [newDisc, ...prev.discounts] }));
    showToast("Promotional Discount scheme launched! 🏷️");
    setShowModal(false);
  };

  const columns: Column<DiscountItem>[] = [
    { key: "name", label: "Campaign Name", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>Code: <code>{r.code}</code></div></div> },
    { key: "type", label: "Discount Scope" },
    { key: "value", label: "Discount Rate", render: (v, r) => <strong>{r.valType === "Percentage" ? `${v}% OFF` : `₹${v} OFF`}</strong> },
    { key: "validity", label: "Valid Until" },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color={v === "Active" ? "green" : "gray"} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Promotional Offers, Coupons & Bill Discounts</h3>
        <Btn onClick={() => setShowModal(true)}>+ Create Discount Offer</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.discounts} />
      </Card>

      {showModal && (
        <Modal title="🏷️ Create Discount Coupon" onClose={() => setShowModal(false)}>
          <Input label="Campaign Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Coupon Code" value={formData.code} onChange={(v) => setFormData({ ...formData, code: v })} placeholder="e.g. SAVE10" required />
          <Select label="Discount Type" value={formData.type} onChange={(v) => setFormData({ ...formData, type: v })} options={["Bill Discount", "Item Discount"]} />
          <Select label="Value Type" value={formData.valType} onChange={(v) => setFormData({ ...formData, valType: v })} options={["Percentage", "Flat Amount"]} />
          <Input label="Discount Value (% or ₹)" type="number" value={formData.value} onChange={(v) => setFormData({ ...formData, value: v })} />
          <Input label="Validity Expiry Date" type="date" value={formData.validity} onChange={(v) => setFormData({ ...formData, validity: v })} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Create Discount</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
