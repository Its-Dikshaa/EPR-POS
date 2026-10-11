"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  CalendarClock,
  AlertTriangle,
  Tag,
  RotateCcw,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  TrendingDown,
  Clock,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { ProductItem } from "@/types";

interface BatchItem {
  id: string;
  productId: number | string;
  productName: string;
  category: string;
  batchNo: string;
  mfgDate: string;
  expiryDate: string;
  stock: number;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  status: "expired" | "urgent" | "upcoming" | "safe";
  daysLeft: number;
  isClearance?: boolean;
}

export function ExpiryView() {
  const { data, setData, showToast } = useAppStore();
  const [filter, setFilter] = useState<"all" | "expired" | "urgent" | "upcoming">("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal State for Adding New Batch
  const [selectedProductId, setSelectedProductId] = useState<string>(data.products[0]?.id?.toString() || "");
  const [customProductName, setCustomProductName] = useState("");
  const [batchNoInput, setBatchNoInput] = useState(`BAT-26-${Date.now().toString().slice(-4)}`);
  const [mfgDateInput, setMfgDateInput] = useState("2026-08-01");
  const [expiryDateInput, setExpiryDateInput] = useState("2026-10-25");
  const [stockInput, setStockInput] = useState("15");

  // Derive all active batches directly from data.products
  const batches: BatchItem[] = data.products
    .filter((p) => p.expiryDate || p.batchNo)
    .map((p) => {
      const today = new Date("2026-10-11");
      const exp = p.expiryDate ? new Date(p.expiryDate) : new Date("2027-01-01");
      const diffTime = exp.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status: "expired" | "urgent" | "upcoming" | "safe" = "safe";
      if (daysLeft <= 0) status = "expired";
      else if (daysLeft <= 15) status = "urgent";
      else if (daysLeft <= 30) status = "upcoming";

      return {
        id: `batch-${p.id}`,
        productId: p.id,
        productName: p.name,
        category: p.category,
        batchNo: p.batchNo || `BAT-26-${p.id}`,
        mfgDate: p.mfgDate || "2026-06-01",
        expiryDate: p.expiryDate || "2026-12-31",
        stock: p.stock,
        unit: p.unit || "Pack",
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        status,
        daysLeft,
        isClearance: p.isClearance,
      };
    });

  const expiredCount = batches.filter((b) => b.status === "expired").length;
  const urgentCount = batches.filter((b) => b.status === "urgent").length;
  const upcomingCount = batches.filter((b) => b.status === "upcoming").length;
  const expiredLoss = batches
    .filter((b) => b.status === "expired")
    .reduce((sum, b) => sum + b.purchasePrice * b.stock, 0);

  const filteredBatches = batches.filter((b) => {
    const matchFilter = filter === "all" || b.status === filter;
    const matchSearch =
      b.productName.toLowerCase().includes(search.toLowerCase()) ||
      b.batchNo.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Action 1: Apply 30% Clearance Discount directly to product in POS
  const handleApplyDiscount = (batch: BatchItem, pct = 30) => {
    const discountedPrice = Math.round(batch.salePrice * (1 - pct / 100));

    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((p: ProductItem) =>
        p.id === batch.productId
          ? {
              ...p,
              originalPrice: p.originalPrice || p.salePrice,
              salePrice: discountedPrice,
              isClearance: true,
            }
          : p
      ),
    }));

    showToast(`Applied ${pct}% clearance discount on ${batch.productName}! Price in POS is now ₹${discountedPrice}. 🏷️`);
  };

  // Action 2: Return stock to supplier & adjust supplier balance
  const handleReturnSupplier = (b: BatchItem) => {
    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((p: ProductItem) =>
        p.id === b.productId ? { ...p, stock: 0 } : p
      ),
    }));
    showToast(`Return to Supplier order initiated for ${b.stock} units of ${b.productName}! Stock removed. 📦`);
  };

  // Action 3: Write off expired loss & record expense
  const handleWriteOff = (b: BatchItem) => {
    const lossAmount = b.purchasePrice * b.stock;

    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((p: ProductItem) =>
        p.id === b.productId ? { ...p, stock: 0 } : p
      ),
      expenses: [
        {
          id: Date.now(),
          date: "2026-10-11",
          category: "Damaged / Expired Stock Loss",
          amount: lossAmount,
          description: `Expiry write-off: ${b.stock} ${b.unit} of ${b.productName} (Batch: ${b.batchNo})`,
          status: "Approved",
          paidBy: "Inventory Write-Off",
        },
        ...prev.expenses,
      ],
    }));

    showToast(`Written off ${b.stock} units of ${b.productName} (₹${lossAmount.toLocaleString("en-IN")} loss recorded in expenses). 🗑️`, "error");
  };

  // Action 4: Add New Batch / Register Expiry
  const handleAddBatch = () => {
    if (!batchNoInput || !expiryDateInput) {
      showToast("Please enter batch number and expiry date", "error");
      return;
    }

    const matchedProd = data.products.find((p) => p.id.toString() === selectedProductId);

    if (matchedProd) {
      // Update existing product with fresh batch & expiry
      setData((prev: any) => ({
        ...prev,
        products: prev.products.map((p: ProductItem) =>
          p.id === matchedProd.id
            ? {
                ...p,
                batchNo: batchNoInput,
                mfgDate: mfgDateInput,
                expiryDate: expiryDateInput,
                stock: p.stock + (parseInt(stockInput) || 0),
              }
            : p
        ),
      }));
      showToast(`Updated ${matchedProd.name} with Batch ${batchNoInput} and Expiry ${expiryDateInput}! (+${stockInput} stock added) ✅`);
    } else if (customProductName) {
      // Create new product
      const newProd: ProductItem = {
        id: Date.now(),
        name: customProductName,
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        category: "General",
        brand: "KC Store",
        mrp: 120,
        salePrice: 100,
        purchasePrice: 75,
        stock: parseInt(stockInput) || 10,
        minStock: 10,
        gst: 5,
        hsn: "2106",
        unit: "Pack",
        barcode: `890${Date.now().toString().slice(-10)}`,
        rack: "A1",
        status: "Active",
        batchNo: batchNoInput,
        mfgDate: mfgDateInput,
        expiryDate: expiryDateInput,
      };
      setData((prev: any) => ({ ...prev, products: [newProd, ...prev.products] }));
      showToast(`Created new product ${customProductName} with Expiry ${expiryDateInput}! ✅`);
    }

    setShowAddModal(false);
    setBatchNoInput(`BAT-26-${Date.now().toString().slice(-4)}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Title & Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "18px 22px",
          background: "linear-gradient(135deg, #0f1f35 0%, #1e293b 100%)",
          borderRadius: 14,
          color: "#fff",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CalendarClock size={22} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
              Batch & Expiry Products Intelligence
            </h2>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
            Track near-expiry packaged goods, prevent grocery waste, sync with POS billing, and trigger 30% clearance sales.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/products">
            <Btn variant="outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              📦 View Products Master
            </Btn>
          </Link>
          <Btn onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={16} /> Add Batch & Expiry
          </Btn>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <div
          onClick={() => setFilter("expired")}
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 12,
            border: filter === "expired" ? "2px solid #ef4444" : "1px solid #fee2e2",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#dc2626", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800 }}>🔴 EXPIRED ITEMS</span>
            <AlertTriangle size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#991b1b" }}>{expiredCount} Batches</div>
          <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>Loss Risk: ₹{expiredLoss.toLocaleString("en-IN")}</div>
        </div>

        <div
          onClick={() => setFilter("urgent")}
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 12,
            border: filter === "urgent" ? "2px solid #f97316" : "1px solid #ffedd5",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ea580c", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800 }}>🟠 EXPIRING IN &lt; 15 DAYS</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#c2410c" }}>{urgentCount} Batches</div>
          <div style={{ fontSize: 11, color: "#9a3412", marginTop: 4 }}>Urgent Clearance Recommended</div>
        </div>

        <div
          onClick={() => setFilter("upcoming")}
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 12,
            border: filter === "upcoming" ? "2px solid #eab308" : "1px solid #fef9c3",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ca8a04", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800 }}>🟡 EXPIRING IN 16-30 DAYS</span>
            <TrendingDown size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#854d0e" }}>{upcomingCount} Batches</div>
          <div style={{ fontSize: 11, color: "#713f12", marginTop: 4 }}>Upcoming Review Cycle</div>
        </div>

        <div
          onClick={() => setFilter("all")}
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 12,
            border: filter === "all" ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#0284c7", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800 }}>📋 TOTAL MONITORED</span>
            <CheckCircle2 size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0369a1" }}>{batches.length} Batches</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Active in Master Inventory</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ position: "relative", minWidth: 280 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, batch number, or category..."
            style={{
              width: "100%",
              padding: "9px 12px 9px 36px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "all", label: "All Items" },
            { id: "expired", label: "Expired Only" },
            { id: "urgent", label: "Expiring < 15 Days" },
            { id: "upcoming", label: "Expiring < 30 Days" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: "none",
                background: filter === tab.id ? "#0f1f35" : "#f1f5f9",
                color: filter === tab.id ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Table of Batches */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>PRODUCT & BATCH</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>CATEGORY</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>MFG DATE</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>EXPIRY DATE</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>DAYS REMAINING</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>STOCK</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>POS PRICE</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", textAlign: "right" }}>
                  CLEARANCE ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((b, idx) => {
                const isExpired = b.status === "expired";
                const isUrgent = b.status === "urgent";

                return (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: isExpired ? "#fef2f2" : isUrgent ? "#fffbeb" : idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#1e293b" }}>{b.productName}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Batch: {b.batchNo}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{b.category}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{b.mfgDate}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: isExpired ? "#dc2626" : "#1e293b" }}>
                      {b.expiryDate}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {isExpired ? (
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "#fee2e2",
                            color: "#b91c1c",
                            fontWeight: 800,
                            fontSize: 11,
                          }}
                        >
                          EXPIRED ({Math.abs(b.daysLeft)} days ago)
                        </span>
                      ) : isUrgent ? (
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "#ffedd5",
                            color: "#c2410c",
                            fontWeight: 800,
                            fontSize: 11,
                          }}
                        >
                          ⚠️ {b.daysLeft} Days Left
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "#f0fdf4",
                            color: "#15803d",
                            fontWeight: 700,
                            fontSize: 11,
                          }}
                        >
                          {b.daysLeft} Days Left
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                      {b.stock} {b.unit}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div>
                        <span style={{ fontWeight: 800, color: b.isClearance ? "#ea580c" : "#0ea5e9" }}>
                          ₹{b.salePrice}
                        </span>
                        {b.isClearance && (
                          <div style={{ fontSize: 10, color: "#ea580c", fontWeight: 700 }}>
                            🏷️ Clearance Price
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        {!isExpired && (
                          <button
                            onClick={() => handleApplyDiscount(b, 30)}
                            title="Apply 30% Clearance Discount to POS"
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #f97316",
                              background: b.isClearance ? "#ea580c" : "#fff",
                              color: b.isClearance ? "#fff" : "#ea580c",
                              fontWeight: 700,
                              fontSize: 11,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Tag size={12} /> {b.isClearance ? "30% Active" : "30% Off"}
                          </button>
                        )}
                        <Link
                          href="/barcodes"
                          title="Print Barcode Label"
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #bae6fd",
                            background: "#f0f9ff",
                            color: "#0284c7",
                            fontWeight: 600,
                            fontSize: 11,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Printer size={12} /> Label
                        </Link>
                        <button
                          onClick={() => handleReturnSupplier(b)}
                          title="Return stock to supplier"
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            background: "#fff",
                            color: "#334155",
                            fontWeight: 600,
                            fontSize: 11,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <RotateCcw size={12} /> Return
                        </button>
                        <button
                          onClick={() => handleWriteOff(b)}
                          title="Dispose / Write off expired loss"
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #fecdd3",
                            background: "#fff1f2",
                            color: "#be123c",
                            fontWeight: 600,
                            fontSize: 11,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Trash2 size={12} /> Write-off
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add New Batch Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 24,
              width: 480,
              maxWidth: "92%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarClock size={20} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Add / Register Expiry Batch to Inventory
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                  Select Existing Catalog Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    fontSize: 13,
                    background: "#fff",
                    outline: "none",
                  }}
                >
                  <option value="">-- Or enter new product below --</option>
                  {data.products.map((p) => (
                    <option key={p.id} value={p.id.toString()}>
                      {p.name} ({p.sku}) — Current Stock: {p.stock}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedProductId && (
                <Input
                  label="Custom Product Name"
                  value={customProductName}
                  onChange={(v) => setCustomProductName(v)}
                  placeholder="e.g. Greek Yogurt 200g"
                  required
                />
              )}

              <Input
                label="Batch Number"
                value={batchNoInput}
                onChange={(v) => setBatchNoInput(v)}
                placeholder="e.g. BAT-26-081"
                required
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="Manufacturing Date"
                  type="date"
                  value={mfgDateInput}
                  onChange={(v) => setMfgDateInput(v)}
                />
                <Input
                  label="Expiry Date *"
                  type="date"
                  value={expiryDateInput}
                  onChange={(v) => setExpiryDateInput(v)}
                  required
                />
              </div>

              <Input
                label="Units / Stock to Add to Inventory"
                type="number"
                value={stockInput}
                onChange={(v) => setStockInput(v)}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <Btn variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Btn>
                <Btn onClick={handleAddBatch}>
                  Save & Sync with Products
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
