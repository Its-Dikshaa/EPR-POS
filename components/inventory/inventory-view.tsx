"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card, StatCard } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { SearchFilter } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { ProductItem } from "@/types";

export function InventoryView() {
  const { data, setData, showToast } = useAppStore();
  const [search, setSearch] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("Manual Adjustment");

  const filtered = data.products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.rack.toLowerCase().includes(search.toLowerCase())
  );

  const totalValuation = data.products.reduce((s, p) => s + p.purchasePrice * p.stock, 0);
  const outOfStockCount = data.products.filter((p) => p.stock === 0).length;
  const lowStockCount = data.products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  const handleAdjustSave = () => {
    if (!showAdjustModal || !adjustQty) return;
    const added = parseInt(adjustQty);

    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((p: ProductItem) =>
        p.id === showAdjustModal.id ? { ...p, stock: Math.max(0, p.stock + added) } : p
      ),
    }));
    showToast(`Stock updated for ${showAdjustModal.name}! ✅`);
    setShowAdjustModal(null);
    setAdjustQty("");
  };

  const columns: Column<ProductItem>[] = [
    { key: "name", label: "Item Name", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>SKU: {r.sku}</div></div> },
    { key: "category", label: "Category" },
    { key: "rack", label: "Rack Position", render: (v) => <strong>{v || "A1"}</strong> },
    { key: "stock", label: "Stock Quantity", render: (v) => <Badge text={`${v} Units`} color={v === 0 ? "red" : v <= 10 ? "yellow" : "green"} /> },
    { key: "purchasePrice", label: "Purchase Rate", render: (v) => `₹${v}` },
    { key: "salePrice", label: "Valuation", render: (v, r) => `₹${(r.purchasePrice * r.stock).toLocaleString("en-IN")}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <StatCard label="Total Stock Value" value={`₹${totalValuation.toLocaleString("en-IN")}`} icon="🏬" sub="At cost price" color="#0ea5e9" />
        <StatCard label="Low Stock Items" value={lowStockCount} icon="⚠️" sub="Needs reorder" color="#f59e0b" />
        <StatCard label="Out of Stock Items" value={outOfStockCount} icon="❌" sub="Action required" color="#ef4444" />
      </div>

      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SearchFilter value={search} onChange={setSearch} placeholder="Search product or rack position..." />
        <span style={{ fontSize: 12, color: "#64748b" }}>Tip: Click 'Edit' icon in table to adjust stock levels</span>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filtered}
          onAction={(act, row) => {
            if (act === "edit") {
              setShowAdjustModal(row);
            }
          }}
        />
      </Card>

      {showAdjustModal && (
        <Modal title={`📦 Adjust Stock — ${showAdjustModal.name}`} onClose={() => setShowAdjustModal(null)}>
          <div style={{ marginBottom: 12, fontSize: 13 }}>
            Current Stock: <strong>{showAdjustModal.stock} {showAdjustModal.unit}</strong>
          </div>
          <Input
            label="Quantity Difference (+ to add, - to reduce)"
            type="number"
            value={adjustQty}
            onChange={setAdjustQty}
            placeholder="e.g. +20 or -5"
          />
          <Input
            label="Adjustment Reason"
            value={adjustReason}
            onChange={setAdjustReason}
            placeholder="e.g. Stock Arrival, Damage, Discrepancy"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowAdjustModal(null)}>Cancel</Btn>
            <Btn onClick={handleAdjustSave}>Confirm Stock Adjustment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
