"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card, StatCard } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { ProductItem } from "@/types";
import Link from "next/link";

export function InventoryView() {
  const { data, setData, showToast } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "low" | "out" | "healthy">("all");
  const [showAdjustModal, setShowAdjustModal] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("Stock Arrival");

  const getDaysLeft = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date("2026-10-11");
    const exp = new Date(expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filtered = data.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.batchNo && p.batchNo.toLowerCase().includes(search.toLowerCase())) ||
      (p.rack && p.rack.toLowerCase().includes(search.toLowerCase())) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    const isLow = p.stock > 0 && p.stock <= (p.minStock || 10);
    const isOut = p.stock === 0;

    if (filterType === "low") return isLow;
    if (filterType === "out") return isOut;
    if (filterType === "healthy") return p.stock > (p.minStock || 10);

    return true;
  });

  const totalValuation = data.products.reduce((s, p) => s + p.purchasePrice * p.stock, 0);
  const outOfStockCount = data.products.filter((p) => p.stock === 0).length;
  const lowStockCount = data.products.filter((p) => p.stock > 0 && p.stock <= (p.minStock || 10)).length;
  const healthyCount = data.products.filter((p) => p.stock > (p.minStock || 10)).length;

  const handleAdjustSave = () => {
    if (!showAdjustModal || !adjustQty) return;
    const added = parseInt(adjustQty);
    if (isNaN(added)) return;

    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((p: ProductItem) =>
        p.id === showAdjustModal.id ? { ...p, stock: Math.max(0, p.stock + added) } : p
      ),
    }));
    showToast(`Stock updated for ${showAdjustModal.name}: ${added > 0 ? "+" : ""}${added} ${showAdjustModal.unit} (${adjustReason})! ✅`);
    setShowAdjustModal(null);
    setAdjustQty("");
  };

  const columns: Column<ProductItem>[] = [
    {
      key: "name",
      label: "Item Details & SKU",
      render: (v, r) => (
        <div>
          <strong style={{ color: "#0f172a", fontSize: 13 }}>{v}</strong>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            SKU: {r.sku} | Barcode: {r.barcode}
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "rack",
      label: "Rack & Slab",
      render: (v) => (
        <span
          style={{
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "3px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          📍 {v || "A1"}
        </span>
      ),
    },
    {
      key: "batchNo",
      label: "Batch & Expiry",
      render: (v, r) => {
        const days = getDaysLeft(r.expiryDate);
        return (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{v || "BAT-26-01"}</div>
            {r.expiryDate && (
              <div style={{ marginTop: 2 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background:
                      days === null
                        ? "#f1f5f9"
                        : days <= 0
                        ? "#fee2e2"
                        : days <= 30
                        ? "#ffedd5"
                        : "#f0fdf4",
                    color:
                      days === null
                        ? "#64748b"
                        : days <= 0
                        ? "#b91c1c"
                        : days <= 30
                        ? "#c2410c"
                        : "#166534",
                  }}
                >
                  {days === null
                    ? r.expiryDate
                    : days <= 0
                    ? `Expired (${r.expiryDate})`
                    : `${days}d left`}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "stock",
      label: "Stock Level",
      render: (v, r) => (
        <div>
          <Badge
            text={`${v} ${r.unit}`}
            color={v === 0 ? "red" : v <= (r.minStock || 10) ? "yellow" : "green"}
          />
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
            Min Alert: {r.minStock || 10}
          </div>
        </div>
      ),
    },
    {
      key: "purchasePrice",
      label: "Cost / Rate",
      render: (v) => `₹${v}`,
    },
    {
      key: "salePrice",
      label: "Stock Valuation",
      render: (_, r) => (
        <strong style={{ color: "#0f172a" }}>
          ₹{(r.purchasePrice * r.stock).toLocaleString("en-IN")}
        </strong>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            type="button"
            title="Adjust Stock Quantity"
            onClick={() => {
              setShowAdjustModal(r);
              setAdjustQty("");
              setAdjustReason("Stock Arrival");
            }}
            style={{
              padding: "4px 8px",
              background: "#0ea5e9",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            📦 ±Stock
          </button>
          <Link
            href="/barcodes"
            title="Generate Barcode Sticker"
            style={{
              padding: "4px 8px",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#1e293b",
              textDecoration: "none",
            }}
          >
            🏷️
          </Link>
          <Link
            href="/expiry"
            title="View Expiry Details"
            style={{
              padding: "4px 8px",
              background: "#fef3c7",
              border: "1px solid #fde68a",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#b45309",
              textDecoration: "none",
            }}
          >
            ⏳
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <StatCard label="Total Stock Value" value={`₹${totalValuation.toLocaleString("en-IN")}`} icon="🏬" sub="At warehouse cost price" color="#0ea5e9" />
        <StatCard label="Low Stock Items" value={lowStockCount} icon="⚠️" sub="Needs replenishment" color="#f59e0b" />
        <StatCard label="Out of Stock Items" value={outOfStockCount} icon="❌" sub="Urgent PO required" color="#ef4444" />
        <StatCard label="Optimal Stock Items" value={healthyCount} icon="✅" sub="Safe buffer levels" color="#10b981" />
      </div>

      {/* Header and Filter Controls */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              Warehouse Inventory & Batch Tracking
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
              Monitor physical quantities, reorder points, batch codes, and perform fast stock count reconciliations.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/products">
              <Btn variant="primary">+ Add New Product / SKU</Btn>
            </Link>
          </div>
        </div>

        {/* Search & Filter pills */}
        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <input
              type="text"
              placeholder="🔍 Search product name, SKU, rack, or batch number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setFilterType("all")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "all" ? "#0f1f35" : "#f1f5f9",
                color: filterType === "all" ? "#fff" : "#475569",
                border: "none",
              }}
            >
              All ({data.products.length})
            </button>
            <button
              onClick={() => setFilterType("low")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "low" ? "#d97706" : "#fef3c7",
                color: filterType === "low" ? "#fff" : "#b45309",
                border: "none",
              }}
            >
              ⚠️ Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterType("out")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "out" ? "#dc2626" : "#fee2e2",
                color: filterType === "out" ? "#fff" : "#991b1b",
                border: "none",
              }}
            >
              ❌ Out of Stock ({outOfStockCount})
            </button>
            <button
              onClick={() => setFilterType("healthy")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "healthy" ? "#10b981" : "#d1fae5",
                color: filterType === "healthy" ? "#fff" : "#065f46",
                border: "none",
              }}
            >
              ✅ In Stock ({healthyCount})
            </button>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <Modal title={`📦 Adjust Stock — ${showAdjustModal.name}`} onClose={() => setShowAdjustModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{showAdjustModal.name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                Current Stock: <strong>{showAdjustModal.stock} {showAdjustModal.unit}</strong> | Rack: <strong>{showAdjustModal.rack}</strong> | Batch: <strong>{showAdjustModal.batchNo || "N/A"}</strong>
              </div>
            </div>

            <Input
              label="Quantity Difference (+ to add, - to reduce)"
              type="number"
              value={adjustQty}
              onChange={setAdjustQty}
              placeholder="e.g. +25 or -5"
              required
            />

            <Select
              label="Adjustment Reason"
              value={adjustReason}
              onChange={setAdjustReason}
              options={[
                "Stock Arrival / Replenishment",
                "Damaged / Leaked Goods",
                "Expired Stock Disposal",
                "Physical Inventory Count Correction",
                "Returned to Supplier",
              ]}
            />

            {adjustQty && (
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                New Stock After Adjustment:{" "}
                {Math.max(0, showAdjustModal.stock + (parseInt(adjustQty) || 0))} {showAdjustModal.unit}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setShowAdjustModal(null)}>
                Cancel
              </Btn>
              <Btn variant="success" onClick={handleAdjustSave}>
                Confirm Stock Adjustment
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
