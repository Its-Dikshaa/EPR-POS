"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { MapPin, Search, Layers, Plus, Edit2, ArrowRight, Printer } from "lucide-react";

export function LocationsView() {
  const { data, setData, showToast } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("All");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newRack, setNewRack] = useState("");
  const [newSlab, setNewSlab] = useState("Slab 1 (Top)");
  const [newAisle, setNewAisle] = useState("Aisle 1");

  const sections = [
    "All",
    "Section A (Grains & Pulses)",
    "Section B (Oils & Ghee)",
    "Section C (Dairy & Cold)",
    "Section D (Instant Foods)",
    "Section E (Detergents & Care)",
  ];

  // Map products with enriched location metadata
  const productsWithLocation = data.products.map((p) => {
    let section = "Section A (Grains & Pulses)";
    let slab = "Slab 1 (Top)";
    let aisle = "Aisle 1";

    if (p.category === "Oils") {
      section = "Section B (Oils & Ghee)";
      aisle = "Aisle 2";
      slab = "Slab 2 (Middle)";
    } else if (p.category === "Dairy") {
      section = "Section C (Dairy & Cold)";
      aisle = "Aisle 3 (Chiller)";
      slab = "Slab 1 (Top)";
    } else if (p.category === "Instant Food") {
      section = "Section D (Instant Foods)";
      aisle = "Aisle 4";
      slab = "Slab 3 (Bottom)";
    } else if (p.category === "Detergent" || p.category === "Personal Care") {
      section = "Section E (Detergents & Care)";
      aisle = "Aisle 5";
      slab = "Slab 2 (Middle)";
    }

    return {
      ...p,
      section,
      slab,
      aisle,
      fullLocation: `${aisle} • Rack ${p.rack || "A1"} • ${slab}`,
    };
  });

  const filtered = productsWithLocation.filter((p) => {
    const matchSec = selectedSection === "All" || p.section === selectedSection;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.rack && p.rack.toLowerCase().includes(search.toLowerCase()));
    return matchSec && matchSearch;
  });

  const handleSaveLocation = () => {
    if (!editingProduct) return;
    setData((prev: any) => ({
      ...prev,
      products: prev.products.map((prod: any) =>
        prod.id === editingProduct.id ? { ...prod, rack: newRack || prod.rack } : prod
      ),
    }));
    showToast(`Updated location for ${editingProduct.name} to ${newAisle} • ${newRack} • ${newSlab}! 📍`);
    setEditingProduct(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
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
            <MapPin size={22} color="#0ea5e9" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Shelf, Rack & Slab Location Manager</h2>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
            Track exact supermarket aisle, rack position, and shelf slab for every item to speed up restocking and billing.
          </p>
        </div>
      </div>

      {/* Visual Aisle Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {[
          { name: "Aisle 1", desc: "Grains & Rice", racks: "Racks A1 - A3", count: 4, color: "#3b82f6" },
          { name: "Aisle 2", desc: "Edible Oils & Ghee", racks: "Racks B1 - B2", count: 2, color: "#eab308" },
          { name: "Aisle 3", desc: "Dairy & Chiller", racks: "Racks C1 - C2", count: 3, color: "#10b981" },
          { name: "Aisle 4", desc: "Instant Foods", racks: "Racks D1 - D3", count: 6, color: "#f97316" },
          { name: "Aisle 5", desc: "Soaps & Detergents", racks: "Racks E1 - E4", count: 5, color: "#8b5cf6" },
        ].map((aisle) => (
          <div
            key={aisle.name}
            style={{
              padding: 16,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: aisle.color }}>📍 {aisle.name}</span>
              <span style={{ fontSize: 11, background: "#f1f5f9", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                {aisle.count} Products
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{aisle.desc}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{aisle.racks}</div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <Card style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU, or rack code (e.g. A1)..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
                background: "#fff",
              }}
            />
          </div>
        </div>

        {/* Section Pill Selectors */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              style={{
                padding: "6px 12px",
                borderRadius: 16,
                border: "none",
                background: selectedSection === sec ? "#0ea5e9" : "#f1f5f9",
                color: selectedSection === sec ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {sec.split(" (")[0]}
            </button>
          ))}
        </div>
      </Card>

      {/* Main Table: Product Location Inventory */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>PRODUCT & BARCODE</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>SECTION / ZONE</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>AISLE</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>RACK POSITION</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>SLAB LEVEL</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569" }}>STOCK</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: idx % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#1e293b" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      SKU: {item.sku} | Barcode: {item.barcode}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{item.section}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {item.aisle}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#f0fdf4",
                        color: "#15803d",
                        fontWeight: 800,
                        fontSize: 12,
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      Rack {item.rack || "A1"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, color: "#475569" }}>{item.slab}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontWeight: 700, color: item.stock > 10 ? "#1e293b" : "#e11d48" }}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <Btn
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(item);
                          setNewRack(item.rack || "A1");
                        }}
                        style={{ padding: "6px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Edit2 size={13} /> Edit Slab
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Shelf Location Modal */}
      {editingProduct && (
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
                <Layers size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Assign Shelf Slab & Rack
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{editingProduct.name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>SKU: {editingProduct.sku} | Barcode: {editingProduct.barcode}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  AISLE / ZONE
                </label>
                <select
                  value={newAisle}
                  onChange={(e) => setNewAisle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 8,
                    fontSize: 13,
                    background: "#fff",
                  }}
                >
                  <option value="Aisle 1">Aisle 1 (Grains & Cereals)</option>
                  <option value="Aisle 2">Aisle 2 (Edible Oils & Ghee)</option>
                  <option value="Aisle 3">Aisle 3 (Dairy Chiller)</option>
                  <option value="Aisle 4">Aisle 4 (Instant Foods)</option>
                  <option value="Aisle 5">Aisle 5 (Soaps & Cleaning)</option>
                </select>
              </div>

              <Input
                label="Rack Code (e.g. A1, B2, C1)"
                value={newRack}
                onChange={setNewRack}
                placeholder="A1"
              />

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  SLAB / SHELF LEVEL
                </label>
                <select
                  value={newSlab}
                  onChange={(e) => setNewSlab(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 8,
                    fontSize: 13,
                    background: "#fff",
                  }}
                >
                  <option value="Slab 1 (Top)">Slab 1 (Top Shelf - Eye Level)</option>
                  <option value="Slab 2 (Middle)">Slab 2 (Middle Shelf)</option>
                  <option value="Slab 3 (Bottom)">Slab 3 (Bottom Heavy Goods)</option>
                  <option value="Side Cap Display">Side Endcap Promotional Display</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <Btn variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Btn>
              <Btn onClick={handleSaveLocation}>Save Shelf Position</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
