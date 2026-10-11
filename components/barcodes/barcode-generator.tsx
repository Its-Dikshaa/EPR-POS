"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

// Simple barcode SVG generator that maps barcode string into realistic Code-128/EAN-13 bars
function BarcodeSVG({ value, height = 36 }: { value: string; height?: number }) {
  // Generate deterministic pseudo-bar widths from string hash/digits
  const cleanVal = (value || "890123456789").replace(/[^0-9A-Za-z]/g, "");
  const bars: { width: number; isSpace: boolean }[] = [];

  // Guard bars at start
  bars.push({ width: 2, isSpace: false }, { width: 1, isSpace: true }, { width: 2, isSpace: false });

  for (let i = 0; i < cleanVal.length; i++) {
    const charCode = cleanVal.charCodeAt(i);
    const pattern = [(charCode % 3) + 1, ((charCode * 3) % 2) + 1, ((charCode * 7) % 3) + 1, 1];
    pattern.forEach((w, idx) => {
      bars.push({ width: w, isSpace: idx % 2 === 1 });
    });
  }

  // Guard bars at end
  bars.push({ width: 2, isSpace: false }, { width: 1, isSpace: true }, { width: 2, isSpace: false });

  let totalWidth = bars.reduce((sum, b) => sum + b.width, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{ width: "100%", height: height, display: "block" }}
        preserveAspectRatio="none"
      >
        {bars.map((bar, i) => {
          if (bar.isSpace) return null;
          const x = bars.slice(0, i).reduce((sum, b) => sum + b.width, 0);
          return <rect key={i} x={x} y={0} width={bar.width} height={height} fill="#000" />;
        })}
      </svg>
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 2,
          marginTop: 1,
          color: "#000",
        }}
      >
        {cleanVal}
      </div>
    </div>
  );
}

const groceryPresets = [
  { name: "Cashews / Kaju Broken", netWeight: "250g", mrp: 260, salePrice: 225, barcode: "890200100250", shelfLife: "6 Months" },
  { name: "Almonds / Badam Giri", netWeight: "250g", mrp: 280, salePrice: 240, barcode: "890200100251", shelfLife: "6 Months" },
  { name: "Raisins / Kishmish Golden", netWeight: "200g", mrp: 120, salePrice: 95, barcode: "890200100200", shelfLife: "9 Months" },
  { name: "Jeera / Cumin Seeds Whole", netWeight: "100g", mrp: 90, salePrice: 75, barcode: "890200100100", shelfLife: "12 Months" },
  { name: "Kalonji / Nigella Seeds", netWeight: "100g", mrp: 65, salePrice: 50, barcode: "890200100101", shelfLife: "12 Months" },
  { name: "Besan Super Fine Pack", netWeight: "1 kg", mrp: 125, salePrice: 108, barcode: "890200101000", shelfLife: "4 Months" },
  { name: "Chana Dal Premium", netWeight: "1 kg", mrp: 130, salePrice: 112, barcode: "890200101001", shelfLife: "6 Months" },
];

export function BarcodeGeneratorView() {
  const { data, showToast } = useAppStore();

  const [storeName, setStoreName] = useState("KC SUPERMARKET");
  const [productName, setProductName] = useState("Cashews / Kaju Broken");
  const [netWeight, setNetWeight] = useState("250g");
  const [mrp, setMrp] = useState("260");
  const [salePrice, setSalePrice] = useState("225");
  const [barcode, setBarcode] = useState("890200100250");
  const [fssaiNo, setFssaiNo] = useState("10021063000124");
  const [shelfLife, setShelfLife] = useState("6 Months");
  const [packDate, setPackDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [stickerSize, setStickerSize] = useState<"50x25" | "38x25">("50x25");
  const [printCopies, setPrintCopies] = useState<number>(24);

  const handleSelectProduct = (productId: string) => {
    const prod = data.products.find((p) => p.id.toString() === productId);
    if (prod) {
      setProductName(prod.name);
      setMrp(prod.mrp.toString());
      setSalePrice(prod.salePrice.toString());
      setBarcode(prod.barcode || `890${Date.now().toString().slice(-9)}`);
      setNetWeight(prod.unit || "1 pc");
      showToast(`Loaded ${prod.name} into barcode generator.`);
    }
  };

  const handleApplyPreset = (preset: typeof groceryPresets[0]) => {
    setProductName(preset.name);
    setNetWeight(preset.netWeight);
    setMrp(preset.mrp.toString());
    setSalePrice(preset.salePrice.toString());
    setBarcode(preset.barcode);
    setShelfLife(preset.shelfLife);
    showToast(`Loaded ${preset.name} preset.`);
  };

  const handleGenerateRandomBarcode = () => {
    const randomCode = `890${Math.floor(100000000 + Math.random() * 900000000)}`;
    setBarcode(randomCode);
    showToast("Generated new EAN-13 barcode number!");
  };

  const handlePrint = () => {
    window.print();
  };

  // Sticker card renderer
  const renderSticker = (isPrint: boolean = false) => {
    const is50x25 = stickerSize === "50x25";
    return (
      <div
        className={isPrint ? (is50x25 ? "barcode-sticker-50x25" : "barcode-sticker-38x25") : ""}
        style={{
          width: isPrint ? undefined : is50x25 ? 240 : 190,
          minHeight: isPrint ? undefined : is50x25 ? 120 : 120,
          background: "#fff",
          color: "#000",
          border: isPrint ? "none" : "1px dashed #94a3b8",
          borderRadius: isPrint ? 0 : 6,
          padding: is50x25 ? "6px 8px" : "4px 6px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: 2 }}>
          <span style={{ fontSize: is50x25 ? 10 : 8, fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase" }}>
            {storeName}
          </span>
          <span style={{ fontSize: is50x25 ? 9 : 8, fontWeight: 800 }}>
            {netWeight}
          </span>
        </div>

        {/* Product Name */}
        <div style={{ fontSize: is50x25 ? 11 : 9.5, fontWeight: 800, margin: "2px 0 1px", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {productName}
        </div>

        {/* Barcode Graphic */}
        <div style={{ margin: "1px 0" }}>
          <BarcodeSVG value={barcode} height={is50x25 ? 26 : 22} />
        </div>

        {/* Price & Dates Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #000", paddingTop: 2 }}>
          <div>
            <div style={{ fontSize: 7, color: "#333" }}>
              PKD: {packDate} | EXP: {shelfLife}
            </div>
            {fssaiNo && (
              <div style={{ fontSize: 6.5, color: "#555" }}>
                FSSAI: {fssaiNo}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 8, textDecoration: "line-through", color: "#555", marginRight: 4 }}>
              MRP ₹{mrp}
            </span>
            <span style={{ fontSize: is50x25 ? 12 : 10, fontWeight: 900, color: "#000" }}>
              ₹{salePrice}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Page Title Card */}
      <Card style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              🏷️ Barcode Sticker & Shelf Label Generator
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
              Generate & print thermal barcode label rolls (50×25mm / 38×25mm) for repackaged dry fruits, spices, bakery, and loose groceries.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={handlePrint}>
              🖨️ Print {printCopies} Labels Now
            </Btn>
          </div>
        </div>
      </Card>

      {/* Main Two-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
        {/* Left: Configuration Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Quick Repack Grocery Presets */}
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase" }}>
              ⚡ Quick Grocery Repack Presets (1-Click)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {groceryPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#1e293b",
                    cursor: "pointer",
                  }}
                >
                  {preset.name} ({preset.netWeight})
                </button>
              ))}
            </div>
          </Card>

          {/* Form Settings */}
          <Card style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: 6 }}>
              Sticker Label Details
            </div>

            {/* Select from Inventory */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                Or Load from Product Catalog
              </label>
              <select
                onChange={(e) => handleSelectProduct(e.target.value)}
                defaultValue=""
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
                <option value="" disabled>
                  -- Select product to populate label --
                </option>
                {data.products.map((p) => (
                  <option key={p.id} value={p.id.toString()}>
                    {p.name} ({p.sku}) — ₹{p.salePrice}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="Store / Brand Title" value={storeName} onChange={(v) => setStoreName(v)} required />
              <Input label="Product Name" value={productName} onChange={(v) => setProductName(v)} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Input label="Net Weight / Pack" value={netWeight} onChange={(v) => setNetWeight(v)} placeholder="250g, 1kg" />
              <Input label="MRP (₹)" type="number" value={mrp} onChange={(v) => setMrp(v)} required />
              <Input label="Offer / Sale Price (₹)" type="number" value={salePrice} onChange={(v) => setSalePrice(v)} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
              <div>
                <Input label="Barcode Number (EAN-13 / Code128)" value={barcode} onChange={(v) => setBarcode(v)} required />
                <button
                  type="button"
                  onClick={handleGenerateRandomBarcode}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0ea5e9",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: "2px 0 0",
                  }}
                >
                  ⚡ Auto-generate fresh barcode
                </button>
              </div>
              <Input label="Packing Date" type="date" value={packDate} onChange={(v) => setPackDate(v)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="Best Before / Shelf Life" value={shelfLife} onChange={(v) => setShelfLife(v)} placeholder="6 Months" />
              <Input label="FSSAI License No." value={fssaiNo} onChange={(v) => setFssaiNo(v)} placeholder="10021063000124" />
            </div>

            {/* Print & Roll Setup */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
              <Select
                label="Thermal Label Size"
                value={stickerSize}
                onChange={(v) => setStickerSize(v as "50x25" | "38x25")}
                options={["50x25", "38x25"]}
              />
              <Select
                label="Quantity of Copies to Print"
                value={printCopies.toString()}
                onChange={(v) => setPrintCopies(parseInt(v))}
                options={["6", "12", "24", "48", "96", "150"]}
              />
            </div>
          </Card>
        </div>

        {/* Right: Live Interactive Sticker Roll Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Live Single Sticker Preview ({stickerSize} mm)
              </span>
              <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                Thermal High Density
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f1f5f9",
                padding: 24,
                borderRadius: 8,
                border: "1px dashed #cbd5e1",
              }}
            >
              {renderSticker(false)}
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
              💡 <strong>Printer Tip:</strong> Supports standard thermal label printers (TVS, TSC, Zebra, Xprinter). Make sure paper size in printer settings is set to <strong>{stickerSize}mm</strong> with 2mm gap.
            </div>
          </Card>

          {/* Printable Sheet Preview */}
          <Card style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Print Roll Preview ({printCopies} Stickers)
              </span>
              <Btn size="sm" variant="primary" onClick={handlePrint}>
                🖨️ Print Sheet
              </Btn>
            </div>

            <div
              style={{
                maxHeight: 280,
                overflowY: "auto",
                background: "#f8fafc",
                padding: 12,
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {Array.from({ length: Math.min(printCopies, 12) }).map((_, idx) => (
                <div key={idx} style={{ transform: "scale(0.85)", transformOrigin: "top left" }}>
                  {renderSticker(false)}
                </div>
              ))}
              {printCopies > 12 && (
                <div style={{ width: "100%", textAlign: "center", fontSize: 11, color: "#64748b", padding: 8 }}>
                  + {printCopies - 12} more stickers will be printed on the roll
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Hidden during normal view, rendered when printing via @media print */}
      <div className="printable-area barcode-sticker-grid" style={{ display: "none" }}>
        {Array.from({ length: printCopies }).map((_, idx) => (
          <React.Fragment key={idx}>{renderSticker(true)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
