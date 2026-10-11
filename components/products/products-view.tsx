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
import { ProductItem } from "@/types";
import Link from "next/link";

export function ProductsView() {
  const { data, setData, showToast } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState<"all" | "low_stock" | "expiring" | "expired">("all");
  const [showModal, setShowModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("Stock Arrival");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State with Expiry and Batch
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Grains",
    brand: "India Gate",
    mrp: "100",
    salePrice: "90",
    purchasePrice: "70",
    stock: "50",
    minStock: "10",
    gst: "5",
    hsn: "1006",
    unit: "Kg",
    barcode: "8900000000000",
    rack: "A1",
    status: "Active",
    batchNo: "BAT-2026-01",
    mfgDate: "",
    expiryDate: "",
  });

  const getDaysLeft = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date("2026-10-11");
    const exp = new Date(expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter products
  const filtered = data.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      (p.batchNo && p.batchNo.toLowerCase().includes(search.toLowerCase())) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;

    if (!matchesSearch || !matchesCat) return false;

    const daysLeft = getDaysLeft(p.expiryDate);
    const isLowStock = p.stock <= (p.minStock || 10);

    if (filterType === "low_stock") return isLowStock;
    if (filterType === "expiring") return daysLeft !== null && daysLeft > 0 && daysLeft <= 30;
    if (filterType === "expired") return daysLeft !== null && daysLeft <= 0;

    return true;
  });

  // KPI Calculations
  const totalProducts = data.products.length;
  const lowStockCount = data.products.filter((p) => p.stock <= (p.minStock || 10)).length;
  const expiringSoonCount = data.products.filter((p) => {
    const d = getDaysLeft(p.expiryDate);
    return d !== null && d > 0 && d <= 30;
  }).length;
  const expiredCount = data.products.filter((p) => {
    const d = getDaysLeft(p.expiryDate);
    return d !== null && d <= 0;
  }).length;
  const totalValuation = data.products.reduce((acc, p) => acc + p.purchasePrice * p.stock, 0);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const timestamp = Date.now().toString().slice(-4);
    const todayStr = "2026-10-11";
    // Default expiry 6 months from today
    const expDate = new Date("2026-10-11");
    expDate.setMonth(expDate.getMonth() + 6);
    const expStr = expDate.toISOString().split("T")[0];

    setFormData({
      name: "",
      sku: `SKU-${timestamp}`,
      category: data.categories[0] || "Grains",
      brand: data.brands[0] || "India Gate",
      mrp: "100",
      salePrice: "90",
      purchasePrice: "70",
      stock: "50",
      minStock: "10",
      gst: "5",
      hsn: "1006",
      unit: "Kg",
      barcode: `890${Date.now().toString().slice(-10)}`,
      rack: "A1",
      status: "Active",
      batchNo: `BAT-26-${timestamp}`,
      mfgDate: todayStr,
      expiryDate: expStr,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      brand: p.brand,
      mrp: String(p.mrp),
      salePrice: String(p.salePrice),
      purchasePrice: String(p.purchasePrice),
      stock: String(p.stock),
      minStock: String(p.minStock || 10),
      gst: String(p.gst),
      hsn: p.hsn,
      unit: p.unit,
      barcode: p.barcode,
      rack: p.rack || "A1",
      status: p.status,
      batchNo: p.batchNo || `BAT-26-${p.id}`,
      mfgDate: p.mfgDate || "2026-06-01",
      expiryDate: p.expiryDate || "2027-06-01",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.sku) {
      showToast("Product name and SKU are required!", "error");
      return;
    }
    if (!formData.expiryDate) {
      showToast("Expiry date is required for inventory batch tracking!", "error");
      return;
    }

    if (editingProduct) {
      setData((prev: any) => ({
        ...prev,
        products: prev.products.map((p: ProductItem) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                sku: formData.sku,
                category: formData.category,
                brand: formData.brand,
                mrp: parseFloat(formData.mrp),
                salePrice: parseFloat(formData.salePrice),
                purchasePrice: parseFloat(formData.purchasePrice),
                stock: parseInt(formData.stock),
                minStock: parseInt(formData.minStock) || 10,
                gst: parseFloat(formData.gst),
                hsn: formData.hsn,
                unit: formData.unit,
                barcode: formData.barcode,
                rack: formData.rack,
                batchNo: formData.batchNo,
                mfgDate: formData.mfgDate,
                expiryDate: formData.expiryDate,
              }
            : p
        ),
      }));
      showToast(`Product ${formData.name} updated with Expiry ${formData.expiryDate}! ✅`);
    } else {
      const newProd: ProductItem = {
        id: Date.now(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        brand: formData.brand,
        mrp: parseFloat(formData.mrp),
        salePrice: parseFloat(formData.salePrice),
        purchasePrice: parseFloat(formData.purchasePrice),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock) || 10,
        gst: parseFloat(formData.gst),
        hsn: formData.hsn,
        unit: formData.unit,
        barcode: formData.barcode,
        rack: formData.rack,
        status: "Active",
        batchNo: formData.batchNo,
        mfgDate: formData.mfgDate,
        expiryDate: formData.expiryDate,
      };
      setData((prev: any) => ({ ...prev, products: [newProd, ...prev.products] }));
      showToast(`Added ${newProd.name} (Batch: ${newProd.batchNo}, Expiry: ${newProd.expiryDate})! ⭐`);
    }
    setShowModal(false);
  };

  const handleDelete = (prod: ProductItem) => {
    if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
      setData((prev: any) => ({
        ...prev,
        products: prev.products.filter((p: ProductItem) => p.id !== prod.id),
      }));
      showToast(`Deleted ${prod.name}`, "error");
    }
  };

  const handleStockAdjustSave = () => {
    if (!showAdjustModal || !adjustQty) return;
    const delta = parseInt(adjustQty);
    if (isNaN(delta)) return;

    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((p: ProductItem) =>
        p.id === showAdjustModal.id
          ? { ...p, stock: Math.max(0, p.stock + delta) }
          : p
      ),
    }));
    showToast(`Stock updated: ${showAdjustModal.name} (${delta > 0 ? "+" : ""}${delta} units). Reason: ${adjustReason} ✅`);
    setShowAdjustModal(null);
    setAdjustQty("");
  };

  const columns: Column<ProductItem>[] = [
    {
      key: "name",
      label: "Product Name & SKU",
      render: (v, r) => (
        <div>
          <strong style={{ color: "#0f172a", fontSize: 13 }}>{v}</strong>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            SKU: <span style={{ fontFamily: "monospace" }}>{r.sku}</span> | Brand: {r.brand}
          </div>
          <div style={{ fontSize: 10, color: "#0ea5e9", marginTop: 1 }}>
            Bar: {r.barcode}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (v) => <span style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>,
    },
    {
      key: "rack",
      label: "Rack & Shelf",
      render: (v) => (
        <span
          style={{
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "3px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          📍 {v || "A1"}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock & Alert",
      render: (v, r) => {
        const isLow = v <= (r.minStock || 10);
        const isOut = v === 0;
        return (
          <div>
            <span
              style={{
                background: isOut ? "#fee2e2" : isLow ? "#fef3c7" : "#dcfce7",
                color: isOut ? "#b91c1c" : isLow ? "#b45309" : "#15803d",
                padding: "3px 8px",
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              {v} {r.unit}
            </span>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
              Min: {r.minStock || 10} {isLow ? "⚠️ Low" : ""}
            </div>
          </div>
        );
      },
    },
    {
      key: "expiryDate",
      label: "Batch & Expiry Date",
      render: (v, r) => {
        const days = getDaysLeft(v);
        return (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>
              Batch: {r.batchNo || "BAT-26-01"}
            </div>
            {v ? (
              <div style={{ marginTop: 2 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background:
                      days === null
                        ? "#f1f5f9"
                        : days <= 0
                        ? "#fee2e2"
                        : days <= 15
                        ? "#ffedd5"
                        : days <= 30
                        ? "#fef3c7"
                        : "#f0fdf4",
                    color:
                      days === null
                        ? "#64748b"
                        : days <= 0
                        ? "#b91c1c"
                        : days <= 15
                        ? "#c2410c"
                        : days <= 30
                        ? "#b45309"
                        : "#166534",
                  }}
                >
                  {days === null
                    ? v
                    : days <= 0
                    ? `🔴 Expired (${v})`
                    : days <= 30
                    ? `⚠️ ${days}d left (${v})`
                    : `🟢 ${v}`}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: 10, color: "#94a3b8" }}>No Expiry Set</span>
            )}
          </div>
        );
      },
    },
    {
      key: "salePrice",
      label: "Pricing (MRP / Sale)",
      render: (v, r) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
            ₹{v}
          </div>
          <div style={{ fontSize: 11, textDecoration: "line-through", color: "#94a3b8" }}>
            MRP ₹{r.mrp}
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Quick Stock Adjust Button */}
          <button
            type="button"
            title="Adjust Stock"
            onClick={() => {
              setShowAdjustModal(r);
              setAdjustQty("");
              setAdjustReason("Stock Arrival");
            }}
            style={{
              padding: "4px 8px",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              color: "#0f172a",
            }}
          >
            📦 ±Stock
          </button>

          {/* Barcode Sticker Generator Shortcut */}
          <Link
            href="/barcodes"
            title="Print Barcode Label"
            style={{
              padding: "4px 8px",
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#0284c7",
              textDecoration: "none",
            }}
          >
            🏷️
          </Link>

          {/* Edit */}
          <button
            type="button"
            title="Edit Product"
            onClick={() => handleOpenEdit(r)}
            style={{
              padding: "4px 8px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✏️
          </button>

          {/* Delete */}
          <button
            type="button"
            title="Delete Product"
            onClick={() => handleDelete(r)}
            style={{
              padding: "4px 8px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Top Executive Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <Card style={{ padding: 14, borderLeft: "4px solid #0ea5e9" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Product SKUs</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{totalProducts}</div>
          <div style={{ fontSize: 11, color: "#0ea5e9", marginTop: 2, fontWeight: 600 }}>Active in POS Catalog</div>
        </Card>

        <Card style={{ padding: 14, borderLeft: "4px solid #f59e0b", background: lowStockCount > 0 ? "#fffbeb" : "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Low Stock Reorder Alert</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#d97706", marginTop: 4 }}>{lowStockCount}</div>
          <div style={{ fontSize: 11, color: "#b45309", marginTop: 2, fontWeight: 600 }}>Below min threshold</div>
        </Card>

        <Card style={{ padding: 14, borderLeft: "4px solid #ef4444", background: expiringSoonCount > 0 || expiredCount > 0 ? "#fef2f2" : "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#991b1b", textTransform: "uppercase" }}>Expiring Soon / Expired</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#dc2626", marginTop: 4 }}>
            {expiringSoonCount + expiredCount}
          </div>
          <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 2, fontWeight: 600 }}>
            {expiredCount} Expired | {expiringSoonCount} &lt; 30 Days
          </div>
        </Card>

        <Card style={{ padding: 14, borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Catalog Valuation (Cost)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            ₹{totalValuation.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 2, fontWeight: 600 }}>Total stock worth</div>
        </Card>
      </div>

      {/* Header & Action Controls */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              📦 Product Inventory & Expiry Master Catalog
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
              Manage retail SKUs, batches, manufacturing & expiry dates, shelf rack allocations, and stock alerts.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/barcodes">
              <Btn variant="outline">🏷️ Barcode Generator</Btn>
            </Link>
            <Link href="/expiry">
              <Btn variant="warning">⏳ Expiry Dashboard</Btn>
            </Link>
            <Btn onClick={handleOpenAdd}>+ Add New Product</Btn>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <input
              type="text"
              placeholder="🔍 Search product name, SKU, barcode, batch number, or rack..."
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

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: "#fff",
              outline: "none",
            }}
          >
            <option value="All">All Categories</option>
            {data.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Quick Filter Pills */}
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
              All ({totalProducts})
            </button>
            <button
              onClick={() => setFilterType("low_stock")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "low_stock" ? "#d97706" : "#fef3c7",
                color: filterType === "low_stock" ? "#fff" : "#b45309",
                border: "none",
              }}
            >
              ⚠️ Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterType("expiring")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "expiring" ? "#ea580c" : "#ffedd5",
                color: filterType === "expiring" ? "#fff" : "#c2410c",
                border: "none",
              }}
            >
              ⏳ Expiring &lt;30d ({expiringSoonCount})
            </button>
            <button
              onClick={() => setFilterType("expired")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "expired" ? "#dc2626" : "#fee2e2",
                color: filterType === "expired" ? "#fff" : "#991b1b",
                border: "none",
              }}
            >
              🔴 Expired ({expiredCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        <Table columns={columns} data={filtered} />
      </Card>

      {/* Add / Edit Product Modal with FULL BATCH & EXPIRY TRACKING */}
      {showModal && (
        <Modal
          title={editingProduct ? `✏️ Edit Product — ${editingProduct.name}` : "📦 Add New Product with Expiry & Batch"}
          onClose={() => setShowModal(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Basic Info */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase" }}>
              1. Basic Information & Classification
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
              <Input label="Product Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
              <Input label="SKU Code" value={formData.sku} onChange={(v) => setFormData({ ...formData, sku: v })} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Select
                label="Category"
                value={formData.category}
                onChange={(v) => setFormData({ ...formData, category: v })}
                options={data.categories}
              />
              <Select
                label="Brand"
                value={formData.brand}
                onChange={(v) => setFormData({ ...formData, brand: v })}
                options={data.brands}
              />
              <Select
                label="Unit of Measurement"
                value={formData.unit}
                onChange={(v) => setFormData({ ...formData, unit: v })}
                options={["Kg", "Gram", "Litre", "Pack", "Bag", "Bottle", "Box", "Piece"]}
              />
            </div>

            {/* BATCH & EXPIRY DATE (CRITICAL RETAIL UX) */}
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>2. ⏳ Batch Number & Expiry Date (Mandatory for Retail ERP)</span>
                <span style={{ fontSize: 10, color: "#64748b" }}>Synced with Expiry Management</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 10 }}>
                <div>
                  <Input
                    label="Batch Number"
                    value={formData.batchNo}
                    onChange={(v) => setFormData({ ...formData, batchNo: v })}
                    placeholder="e.g. BAT-26-081"
                    required
                  />
                </div>
                <Input
                  label="Mfg Date"
                  type="date"
                  value={formData.mfgDate}
                  onChange={(v) => setFormData({ ...formData, mfgDate: v })}
                />
                <Input
                  label="Expiry Date *"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(v) => setFormData({ ...formData, expiryDate: v })}
                  required
                />
              </div>

              {formData.expiryDate && (
                <div style={{ marginTop: 6, fontSize: 11, color: "#475569" }}>
                  Status Preview:{" "}
                  <strong>
                    {getDaysLeft(formData.expiryDate)! <= 0
                      ? "🔴 Expired already!"
                      : getDaysLeft(formData.expiryDate)! <= 30
                      ? `⚠️ Expiring in ${getDaysLeft(formData.expiryDate)} days!`
                      : `🟢 Valid for ${getDaysLeft(formData.expiryDate)} days`}
                  </strong>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase" }}>
              3. Pricing, GST & Taxes
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              <Input label="MRP (₹)" type="number" value={formData.mrp} onChange={(v) => setFormData({ ...formData, mrp: v })} required />
              <Input label="Sale Price (₹)" type="number" value={formData.salePrice} onChange={(v) => setFormData({ ...formData, salePrice: v })} required />
              <Input label="Purchase Price (₹)" type="number" value={formData.purchasePrice} onChange={(v) => setFormData({ ...formData, purchasePrice: v })} required />
              <Select
                label="GST Slab"
                value={formData.gst}
                onChange={(v) => setFormData({ ...formData, gst: v })}
                options={["0", "5", "12", "18", "28"]}
              />
            </div>

            {/* Inventory & Rack */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase" }}>
              4. Warehouse Stock & Rack Allocation
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              <Input label="Current Stock" type="number" value={formData.stock} onChange={(v) => setFormData({ ...formData, stock: v })} required />
              <Input label="Min Stock Alert" type="number" value={formData.minStock} onChange={(v) => setFormData({ ...formData, minStock: v })} placeholder="10" />
              <Select
                label="Rack / Shelf"
                value={formData.rack}
                onChange={(v) => setFormData({ ...formData, rack: v })}
                options={["A1", "A2", "A3", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2"]}
              />
              <Input label="HSN Code" value={formData.hsn} onChange={(v) => setFormData({ ...formData, hsn: v })} />
            </div>

            {/* Barcode */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <Input label="Barcode Number (EAN-13)" value={formData.barcode} onChange={(v) => setFormData({ ...formData, barcode: v })} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Btn>
              <Btn onClick={handleSave}>
                {editingProduct ? "Update Product" : "Save Product & Register Batch"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Stock Adjust Modal */}
      {showAdjustModal && (
        <Modal title={`📦 Quick Stock Adjustment — ${showAdjustModal.name}`} onClose={() => setShowAdjustModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{showAdjustModal.name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                Current Physical Stock: <strong>{showAdjustModal.stock} {showAdjustModal.unit}</strong> | Batch: {showAdjustModal.batchNo || "N/A"}
              </div>
            </div>

            <Input
              label="Quantity Difference (+ to add, - to deduct)"
              type="number"
              value={adjustQty}
              onChange={(v) => setAdjustQty(v)}
              placeholder="e.g. +20 (new arrival) or -5 (damaged/expired)"
              required
            />

            <Select
              label="Adjustment Reason"
              value={adjustReason}
              onChange={(v) => setAdjustReason(v)}
              options={[
                "Stock Arrival / Replenishment",
                "Damaged / Leaked Goods",
                "Expired Stock Write-off",
                "Physical Inventory Count Correction",
                "Customer Return",
              ]}
            />

            {adjustQty && (
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                New Stock After Adjustment:{" "}
                {Math.max(0, showAdjustModal.stock + (parseInt(adjustQty) || 0))} {showAdjustModal.unit}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <Btn variant="ghost" onClick={() => setShowAdjustModal(null)}>
                Cancel
              </Btn>
              <Btn variant="success" onClick={handleStockAdjustSave}>
                Confirm Adjustment
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
