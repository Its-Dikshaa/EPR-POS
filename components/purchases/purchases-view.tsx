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
import { PurchaseOrder } from "@/types";

export function PurchasesView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [supplier, setSupplier] = useState(data.suppliers[0]?.name || "Agro Foods Pvt Ltd");
  const [items, setItems] = useState("10");
  const [amount, setAmount] = useState("15000");

  const handleCreatePO = () => {
    const newPO: PurchaseOrder = {
      id: `PO-2026-${(data.purchaseOrders.length + 1).toString().padStart(3, "0")}`,
      supplier,
      date: new Date().toISOString().split("T")[0],
      items: parseInt(items),
      amount: parseFloat(amount),
      status: "Pending",
    };
    setData((prev: any) => ({ ...prev, purchaseOrders: [newPO, ...prev.purchaseOrders] }));
    showToast(`Purchase Order ${newPO.id} generated! ✅`);
    setShowModal(false);
  };

  const columns: Column<PurchaseOrder>[] = [
    { key: "id", label: "PO Number", render: (v) => <strong>{v}</strong> },
    { key: "supplier", label: "Supplier" },
    { key: "date", label: "PO Date" },
    { key: "items", label: "Item Count" },
    { key: "amount", label: "PO Total", render: (v) => `₹${v.toLocaleString("en-IN")}` },
    { key: "status", label: "Status", render: (v) => <Badge text={v} color={v === "Received" ? "green" : v === "Approved" ? "blue" : "yellow"} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Purchase Orders (PO) & Inventory Goods Arrival</h3>
        <Btn onClick={() => setShowModal(true)}>+ Create Purchase Order</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={data.purchaseOrders} />
      </Card>

      {showModal && (
        <Modal title="🛍️ Create New Purchase Order" onClose={() => setShowModal(false)}>
          <Select label="Supplier" value={supplier} onChange={setSupplier} options={data.suppliers.map((s) => s.name)} />
          <Input label="Expected Item Count" type="number" value={items} onChange={setItems} />
          <Input label="Estimated Order Amount (₹)" type="number" value={amount} onChange={setAmount} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleCreatePO}>Submit PO</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
