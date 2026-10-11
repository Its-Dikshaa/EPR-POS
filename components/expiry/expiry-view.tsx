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
} from "lucide-react";

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
}

export function ExpiryView() {
  const { data, showToast } = useAppStore();
  const [filter, setFilter] = useState<"all" | "expired" | "urgent" | "upcoming">("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample batch data with varied expiry timelines
  const [batches, setBatches] = useState<BatchItem[]>([
    {
      id: "b-1",
      productId: 5,
      productName: "Amul Butter 500g",
      category: "Dairy",
      batchNo: "AM-26-081",
      mfgDate: "2026-08-01",
      expiryDate: "2026-10-05", // Expired
      stock: 12,
      unit: "Pack",
      purchasePrice: 195,
      salePrice: 238,
      status: "expired",
      daysLeft: -6,
    },
    {
      id: "b-2",
      productId: 6,
      productName: "Maggi Noodles 70g",
      category: "Instant Food",
      batchNo: "MAG-26-09A",
      mfgDate: "2026-04-10",
      expiryDate: "2026-10-18", // 7 days left
      stock: 45,
      unit: "Pack",
      purchasePrice: 10,
      salePrice: 14,
      status: "urgent",
      daysLeft: 7,
    },
    {
      id: "b-3",
      productId: 2,
      productName: "Toor Dal 1kg",
      category: "Pulses",
      batchNo: "TD-26-03",
      mfgDate: "2026-02-15",
      expiryDate: "2026-10-25", // 14 days left
      stock: 20,
      unit: "Kg",
      purchasePrice: 110,
      salePrice: 148,
      status: "urgent",
      daysLeft: 14,
    },
    {
      id: "b-4",
      productId: 4,
      productName: "Aashirvaad Atta 5kg",
      category: "Flour",
      batchNo: "ATT-26-05",
      mfgDate: "2026-07-01",
      expiryDate: "2026-11-02", // 22 days left
      stock: 8,
      unit: "Bag",
      purchasePrice: 200,
      salePrice: 265,
      status: "upcoming",
      daysLeft: 22,
    },
    {
      id: "b-5",
      productId: 1,
      productName: "Basmati Rice 5kg",
      category: "Grains",
      batchNo: "RICE-26-11",
      mfgDate: "2026-01-10",
      expiryDate: "2027-01-10", // Safe
      stock: 140,
      unit: "Bag",
      purchasePrice: 320,
      salePrice: 420,
      status: "safe",
      daysLeft: 91,
    },
  ]);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(data.products[0]?.name || "");
  const [batchNoInput, setBatchNoInput] = useState("");
  const [mfgDateInput, setMfgDateInput] = useState("");
  const [expiryDateInput, setExpiryDateInput] = useState("");
  const [stockInput, setStockInput] = useState("10");

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

  const handleApplyDiscount = (id: string, pct = 30) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, salePrice: Math.round(b.salePrice * (1 - pct / 100)) }
          : b
      )
    );
    showToast(`Applied ${pct}% clearance discount! Updated price on POS shelf. 🏷️`);
  };

  const handleReturnSupplier = (b: BatchItem) => {
    setBatches((prev) => prev.filter((item) => item.id !== b.id));
    showToast(`Return to Supplier order initiated for ${b.stock} units of ${b.productName}! 📦`);
  };

  const handleWriteOff = (b: BatchItem) => {
    setBatches((prev) => prev.filter((item) => item.id !== b.id));
    showToast(`Written off ${b.stock} units of ${b.productName} as expired inventory loss. 🗑️`, "error");
  };

  const handleAddBatch = () => {
    if (!batchNoInput || !expiryDateInput) {
      showToast("Please enter batch number and expiry date", "error");
      return;
    }
    const today = new Date();
    const exp = new Date(expiryDateInput);
    const diffTime = exp.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: "expired" | "urgent" | "upcoming" | "safe" = "safe";
    if (daysLeft < 0) status = "expired";
    else if (daysLeft <= 15) status = "urgent";
    else if (daysLeft <= 30) status = "upcoming";

    const matchedProd = data.products.find((p) => p.name === selectedProduct);

    const newBatch: BatchItem = {
      id: `b-${Date.now()}`,
      productId: matchedProd?.id || 1,
      productName: selectedProduct,
      category: matchedProd?.category || "General",
      batchNo: batchNoInput,
      mfgDate: mfgDateInput || new Date().toISOString().split("T")[0],
      expiryDate: expiryDateInput,
      stock: parseInt(stockInput) || 10,
      unit: matchedProd?.unit || "Unit",
      purchasePrice: matchedProd?.purchasePrice || 100,
      salePrice: matchedProd?.salePrice || 120,
      status,
      daysLeft,
    };

    setBatches((prev) => [newBatch, ...prev]);
    showToast(`Added batch ${batchNoInput} for ${selectedProduct}! ✅`);
    setShowAddModal(false);
    setBatchNoInput("");
    setExpiryDateInput("");
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
            Track near-expiry packaged goods, prevent grocery waste, and trigger automated clearance sales.
          </p>
        </div>
        <Btn onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={16} /> Add Batch & Expiry
        </Btn>
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
          <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>Loss Risk: ₹{expiredLoss.toLocaleString()}</div>
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
                      <span style={{ fontWeight: 800, color: "#0ea5e9" }}>₹{b.salePrice}</span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        {!isExpired && (
                          <button
                            onClick={() => handleApplyDiscount(b.id, 30)}
                            title="Apply 30% Clearance Discount"
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #f97316",
                              background: "#fff",
                              color: "#ea580c",
                              fontWeight: 700,
                              fontSize: 11,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Tag size={12} /> 30% Off
                          </button>
                        )}
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
              width: 440,
              maxWidth: "90%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarClock size={20} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Record New Stock Batch & Expiry
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  SELECT PRODUCT
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 8,
                    fontSize: 13,
                    background: "#fff",
                  }}
                >
                  {data.products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Batch / Lot Number"
                value={batchNoInput}
                onChange={setBatchNoInput}
                placeholder="e.g. B-2026-10A"
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Input
                  label="Mfg Date"
                  type="date"
                  value={mfgDateInput}
                  onChange={setMfgDateInput}
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  value={expiryDateInput}
                  onChange={setExpiryDateInput}
                  required
                />
              </div>

              <Input
                label="Batch Quantity (Units)"
                type="number"
                value={stockInput}
                onChange={setStockInput}
                placeholder="10"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <Btn variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Btn>
              <Btn onClick={handleAddBatch}>Save Batch</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
