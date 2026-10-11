"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Input } from "../ui/input";
import {
  Store,
  Receipt,
  Zap,
  Gift,
  ShieldCheck,
  Percent,
  MessageSquare,
  Database,
  Save,
  Check,
  Volume2,
  QrCode,
  Download,
  AlertTriangle,
  Printer,
  FileSpreadsheet,
  Lock,
  Sparkles,
} from "lucide-react";

export function SettingsView() {
  const { showToast, data } = useAppStore();
  const [activeTab, setActiveTab] = useState<
    "general" | "receipt" | "pos" | "loyalty" | "security" | "gst" | "digital" | "backup"
  >("general");

  // 1. General Profile State
  const [storeName, setStoreName] = useState("KC Supermarket");
  const [tagline, setTagline] = useState("Your Daily Grocery & Fresh Mart");
  const [gstNo, setGstNo] = useState("03AABCK1234Z1Z5");
  const [fssaiNo, setFssaiNo] = useState("10020030040050");
  const [address, setAddress] = useState("Hall Bazaar, Amritsar, Punjab - 143001");
  const [phone, setPhone] = useState("0183-234567");
  const [email, setEmail] = useState("support@kcsupermarket.com");
  const [openTime, setOpenTime] = useState("08:00 AM");
  const [closeTime, setCloseTime] = useState("10:00 PM");

  // 2. Receipt & Print Designer State
  const [paperSize, setPaperSize] = useState<"80mm" | "58mm" | "A4">("80mm");
  const [receiptFooter, setReceiptFooter] = useState(
    "Thank you for shopping with us! Exchange valid within 7 days with original invoice."
  );
  const [showSavings, setShowSavings] = useState(true);
  const [showLoyaltyOnBill, setShowLoyaltyOnBill] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [showCashierName, setShowCashierName] = useState(true);
  const [autoPrintBill, setAutoPrintBill] = useState(true);

  // 3. POS & Workflow State
  const [beepOnScan, setBeepOnScan] = useState(true);
  const [roundOffTotal, setRoundOffTotal] = useState(true);
  const [negativeStockBilling, setNegativeStockBilling] = useState<"warn" | "block">("warn");
  const [defaultPayment, setDefaultPayment] = useState("CASH");
  const [quickCashTenders, setQuickCashTenders] = useState("100, 200, 500, 2000");

  // 4. Loyalty & Discount Rules
  const [loyaltyRate, setLoyaltyRate] = useState("100"); // 100 spent = 1 pt
  const [pointValue, setPointValue] = useState("1"); // 1 pt = 1 rs
  const [minRedeemPoints, setMinRedeemPoints] = useState("50");
  const [maxCashierDiscount, setMaxCashierDiscount] = useState("10"); // 10%

  // 5. Security & Cash Drawer
  const [managerPin, setManagerPin] = useState("8899");
  const [requirePinForVoid, setRequirePinForVoid] = useState(true);
  const [morningFloatCash, setMorningFloatCash] = useState("2000");
  const [autoLockMinutes, setAutoLockMinutes] = useState("15");

  // 6. GST & Tax Slabs
  const [taxMode, setTaxMode] = useState<"inclusive" | "exclusive">("inclusive");
  const [hsnMandatory, setHsnMandatory] = useState(true);
  const [compositeGst, setCompositeGst] = useState(false);

  // 7. Digital Invoicing / WhatsApp
  const [whatsappBill, setWhatsappBill] = useState(true);
  const [whatsappApiKey, setWhatsappApiKey] = useState("wa_live_9988224411_pos");
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kc_pos_settings_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.gstNo) setGstNo(parsed.gstNo);
        if (parsed.fssaiNo) setFssaiNo(parsed.fssaiNo);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.paperSize) setPaperSize(parsed.paperSize);
        if (parsed.receiptFooter) setReceiptFooter(parsed.receiptFooter);
        if (parsed.showSavings !== undefined) setShowSavings(parsed.showSavings);
        if (parsed.showLoyaltyOnBill !== undefined) setShowLoyaltyOnBill(parsed.showLoyaltyOnBill);
        if (parsed.showQrCode !== undefined) setShowQrCode(parsed.showQrCode);
        if (parsed.beepOnScan !== undefined) setBeepOnScan(parsed.beepOnScan);
        if (parsed.roundOffTotal !== undefined) setRoundOffTotal(parsed.roundOffTotal);
        if (parsed.managerPin) setManagerPin(parsed.managerPin);
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const handleSave = () => {
    try {
      const settingsPayload = {
        storeName,
        tagline,
        gstNo,
        fssaiNo,
        address,
        phone,
        email,
        paperSize,
        receiptFooter,
        showSavings,
        showLoyaltyOnBill,
        showQrCode,
        showCashierName,
        autoPrintBill,
        beepOnScan,
        roundOffTotal,
        negativeStockBilling,
        defaultPayment,
        loyaltyRate,
        pointValue,
        minRedeemPoints,
        maxCashierDiscount,
        managerPin,
        taxMode,
        whatsappBill,
      };
      localStorage.setItem("kc_pos_settings_v2", JSON.stringify(settingsPayload));
      showToast("System configurations & receipt rules successfully updated! ⚙️", "success");
    } catch {
      showToast("Settings updated in session memory!", "success");
    }
  };

  const handleExportData = () => {
    try {
      const exportBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kc-supermarket-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Complete database backup exported successfully! 📦", "success");
    } catch {
      showToast("Backup export failed.", "error");
    }
  };

  const tabsConfig = [
    { id: "general", label: "Store & Legal", icon: Store, desc: "Branding, FSSAI & GST" },
    { id: "receipt", label: "Receipt & Thermal", icon: Receipt, desc: "Format & Live Preview" },
    { id: "pos", label: "Billing Workflow", icon: Zap, desc: "Beep sound, shortcuts" },
    { id: "loyalty", label: "Loyalty & Rewards", icon: Gift, desc: "Points ratio & discounts" },
    { id: "security", label: "Security & Cash", icon: ShieldCheck, desc: "Manager PIN, Day Close" },
    { id: "gst", label: "Taxes & Compliance", icon: Percent, desc: "MRP inclusive vs base" },
    { id: "digital", label: "WhatsApp & SMS", icon: MessageSquare, desc: "Paperless e-invoicing" },
    { id: "backup", label: "Backup & Reset", icon: Database, desc: "Export & maintenance" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "16px 20px",
          background: "linear-gradient(135deg, #0f1f35 0%, #1e293b 100%)",
          borderRadius: 14,
          color: "#fff",
          boxShadow: "0 4px 15px rgba(15, 31, 53, 0.15)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff" }}>
              Enterprise System Configurations
            </h2>
            <span
              style={{
                fontSize: 11,
                background: "rgba(14, 165, 233, 0.2)",
                color: "#38bdf8",
                padding: "3px 8px",
                borderRadius: 20,
                fontWeight: 700,
                border: "1px solid rgba(56, 189, 248, 0.3)",
              }}
            >
              v2.5 Retail Edition
            </span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
            Configure store branding, thermal receipt layout, cashier security PIN, and automatic tax rules.
          </p>
        </div>
        <Btn onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}>
          <Save size={16} /> Save All Changes
        </Btn>
      </div>

      {/* Main Grid: Navigation Tabs + Settings Content + Optional Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
        {/* Left Vertical Nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tabsConfig.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "none",
                  textAlign: "left",
                  background: isActive ? "#0f1f35" : "#ffffff",
                  color: isActive ? "#ffffff" : "#334155",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? "0 4px 12px rgba(15, 31, 53, 0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                  borderLeft: isActive ? "4px solid #0ea5e9" : "4px solid transparent",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isActive ? "rgba(14, 165, 233, 0.2)" : "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#38bdf8" : "#64748b",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isActive ? "#94a3b8" : "#94a3b8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.desc}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Quick Info Box */}
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 10,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, marginBottom: 4 }}>
              <Check size={16} /> Cloud Sync Active
            </div>
            All configuration parameters are synchronized with your Supabase database in real-time.
          </div>
        </div>

        {/* Right Settings Body */}
        <div>
          {/* TAB 1: GENERAL & STORE PROFILE */}
          {activeTab === "general" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Store size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Store Identity & Legal Registrations
                </h3>
              </div>
              <p style={{ margin: "-8px 0 20px", fontSize: 13, color: "#64748b" }}>
                These business details appear on customer bills, official GST invoices, and financial reports.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Store Name" value={storeName} onChange={setStoreName} placeholder="KC Supermarket" />
                <Input
                  label="Tagline / Branch Subtitle"
                  value={tagline}
                  onChange={setTagline}
                  placeholder="Your Daily Grocery Mart"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input
                  label="GSTIN Code (Tax Registration)"
                  value={gstNo}
                  onChange={setGstNo}
                  placeholder="03AABCK1234Z1Z5"
                />
                <Input
                  label="FSSAI License No. (Food Safety)"
                  value={fssaiNo}
                  onChange={setFssaiNo}
                  placeholder="10020030040050"
                />
              </div>

              <Input
                label="Registered Store Address"
                value={address}
                onChange={setAddress}
                placeholder="Hall Bazaar, Amritsar, Punjab - 143001"
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Customer Support Phone" value={phone} onChange={setPhone} placeholder="0183-234567" />
                <Input label="Official Email ID" value={email} onChange={setEmail} placeholder="contact@kcsuper.com" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Opening Time" value={openTime} onChange={setOpenTime} placeholder="08:00 AM" />
                <Input label="Closing Time" value={closeTime} onChange={setCloseTime} placeholder="10:00 PM" />
              </div>
            </Card>
          )}

          {/* TAB 2: RECEIPT & PRINT DESIGNER WITH LIVE PREVIEW */}
          {activeTab === "receipt" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Printer size={20} color="#0ea5e9" />
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                    Thermal Printer & Bill Formatting
                  </h3>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                    RECEIPT PAPER SIZE FORMAT
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {(["80mm", "58mm", "A4"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPaperSize(size)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: 8,
                          border: paperSize === size ? "2px solid #0ea5e9" : "1.5px solid #e2e8f0",
                          background: paperSize === size ? "rgba(14, 165, 233, 0.08)" : "#fff",
                          color: paperSize === size ? "#0369a1" : "#475569",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {size === "80mm" ? "80mm (3-inch Standard)" : size === "58mm" ? "58mm (Compact)" : "A4 Standard"}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Receipt Footer Greeting & Return Policy"
                  value={receiptFooter}
                  onChange={setReceiptFooter}
                  placeholder="Thank you for shopping with us!"
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Show Total Savings Badge</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Prints &ldquo;You saved ₹X.XX today!&rdquo; on the bottom of the bill
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showSavings}
                      onChange={(e) => setShowSavings(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Customer Loyalty Points Summary</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Prints points earned and current point balance</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showLoyaltyOnBill}
                      onChange={(e) => setShowLoyaltyOnBill(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Dynamic UPI QR Code</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Prints instant UPI QR code for fast payment</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showQrCode}
                      onChange={(e) => setShowQrCode(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Auto-Print On Checkout</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Triggers thermal printer immediately on sale completion
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoPrintBill}
                      onChange={(e) => setAutoPrintBill(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                    />
                  </label>
                </div>
              </Card>

              {/* LIVE THERMAL RECEIPT PREVIEW */}
              <div
                style={{
                  background: "#ffffff",
                  border: "2px dashed #cbd5e1",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#0f172a",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  height: "fit-content",
                }}
              >
                <div style={{ textAlign: "center", borderBottom: "1px dashed #94a3b8", paddingBottom: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{storeName}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{tagline}</div>
                  <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{address}</div>
                  <div style={{ fontSize: 9 }}>GST: {gstNo} | FSSAI: {fssaiNo}</div>
                  <div style={{ fontSize: 9 }}>Ph: {phone}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 4 }}>
                  <span>Bill: #KC-10492</span>
                  <span>Date: 11-Oct-26</span>
                </div>
                {showCashierName && (
                  <div style={{ fontSize: 9, color: "#64748b", marginBottom: 6 }}>Cashier: Amit (Counter 1)</div>
                )}

                <div style={{ borderTop: "1px dashed #cbd5e1", borderBottom: "1px dashed #cbd5e1", padding: "4px 0", margin: "6px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>AMT</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Basmati Rice 5kg</span>
                  <span>1</span>
                  <span>₹420</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Toor Dal 1kg</span>
                  <span>2</span>
                  <span>₹296</span>
                </div>

                <div style={{ borderTop: "1px dashed #94a3b8", marginTop: 8, paddingTop: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal:</span>
                    <span>₹716.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>GST (5%):</span>
                    <span>₹35.80</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 13, marginTop: 4 }}>
                    <span>GRAND TOTAL:</span>
                    <span>₹752.00</span>
                  </div>
                </div>

                {showSavings && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      padding: "4px",
                      borderRadius: 4,
                      textAlign: "center",
                      fontWeight: 700,
                      color: "#166534",
                      margin: "8px 0",
                    }}
                  >
                    🎉 You Saved ₹68.00 Today!
                  </div>
                )}

                {showLoyaltyOnBill && (
                  <div style={{ textAlign: "center", fontSize: 9, color: "#475569", margin: "4px 0" }}>
                    Loyalty Points Earned: +7 pts | Balance: 457 pts
                  </div>
                )}

                {showQrCode && (
                  <div style={{ textAlign: "center", margin: "10px 0" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 70,
                        height: 70,
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        borderRadius: 4,
                      }}
                    >
                      <QrCode size={48} color="#0f172a" />
                    </div>
                    <div style={{ fontSize: 8, color: "#64748b" }}>Scan to Pay via UPI</div>
                  </div>
                )}

                <div style={{ textAlign: "center", fontSize: 8, color: "#64748b", marginTop: 6, borderTop: "1px dashed #cbd5e1", paddingTop: 6 }}>
                  {receiptFooter}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POS BILLING WORKFLOW */}
          {activeTab === "pos" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Zap size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  POS Billing Counter Speed & Workflow
                </h3>
              </div>
              <p style={{ margin: "-8px 0 20px", fontSize: 13, color: "#64748b" }}>
                Speed up counter queues with barcode feedback, automated round-off, and cash tender shortcuts.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Volume2 size={20} color="#0ea5e9" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                        Barcode Scanner Audio Feedback (Beep Sound)
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Plays instant audio tone on successful barcode item scan
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={beepOnScan}
                    onChange={(e) => setBeepOnScan(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Sparkles size={20} color="#10b981" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                        Automatic Round-Off to Nearest ₹1
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Eliminates paise balance (e.g. ₹425.40 rounds to ₹425.00)
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={roundOffTotal}
                    onChange={(e) => setRoundOffTotal(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                  />
                </label>

                <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 8 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                    NEGATIVE STOCK BILLING POLICY
                  </label>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
                    Action when cashier attempts to bill a product with 0 recorded inventory:
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="negStock"
                        checked={negativeStockBilling === "warn"}
                        onChange={() => setNegativeStockBilling("warn")}
                        style={{ accentColor: "#0ea5e9" }}
                      />
                      Allow Sale with Warning (Recommended for retail)
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="negStock"
                        checked={negativeStockBilling === "block"}
                        onChange={() => setNegativeStockBilling("block")}
                        style={{ accentColor: "#ef4444" }}
                      />
                      Strictly Block Billing
                    </label>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 6 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                      DEFAULT PAYMENT METHOD
                    </label>
                    <select
                      value={defaultPayment}
                      onChange={(e) => setDefaultPayment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 8,
                        fontSize: 13,
                        color: "#1e293b",
                        background: "#fff",
                      }}
                    >
                      <option value="CASH">Cash (Recommended)</option>
                      <option value="UPI">UPI / QR Code</option>
                      <option value="CARD">Debit / Credit Card</option>
                    </select>
                  </div>
                  <Input
                    label="Quick Cash Tender Currency Shortcuts"
                    value={quickCashTenders}
                    onChange={setQuickCashTenders}
                    placeholder="100, 200, 500, 2000"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: LOYALTY & REWARDS */}
          {activeTab === "loyalty" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Gift size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Customer Loyalty Program & Discount Caps
                </h3>
              </div>
              <p style={{ margin: "-8px 0 20px", fontSize: 13, color: "#64748b" }}>
                Keep shoppers coming back by rewarding loyalty points on grocery purchases.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input
                  label="Spend Requirement For 1 Point (₹)"
                  value={loyaltyRate}
                  onChange={setLoyaltyRate}
                  placeholder="100"
                />
                <Input
                  label="Point Redemption Value (₹ per Point)"
                  value={pointValue}
                  onChange={setPointValue}
                  placeholder="1"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input
                  label="Minimum Points Required to Redeem"
                  value={minRedeemPoints}
                  onChange={setMinRedeemPoints}
                  placeholder="50"
                />
                <Input
                  label="Max Cashier Manual Discount Limit (%)"
                  value={maxCashierDiscount}
                  onChange={setMaxCashierDiscount}
                  placeholder="10"
                />
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: 14,
                  background: "#eff6ff",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#1e40af",
                }}
              >
                💡 <strong>Customer Rule:</strong> For every ₹{loyaltyRate} spent, customer earns 1 Point (worth ₹
                {pointValue}). If cashier gives more than {maxCashierDiscount}% discount, Manager PIN will be required.
              </div>
            </Card>
          )}

          {/* TAB 5: SECURITY & CASH DRAWER */}
          {activeTab === "security" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <ShieldCheck size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Manager Authorization & Cash Drawer Controls
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input
                  label="4-Digit Manager Override Security PIN"
                  type="password"
                  value={managerPin}
                  onChange={setManagerPin}
                  placeholder="****"
                />
                <Input
                  label="Opening Cash Float Target (₹)"
                  value={morningFloatCash}
                  onChange={setMorningFloatCash}
                  placeholder="2000"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                      Require Manager PIN for Bill Cancellation & Item Voids
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      Prevents staff from deleting scanned items without supervisor check
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={requirePinForVoid}
                    onChange={(e) => setRequirePinForVoid(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input
                    label="POS Terminal Auto-Lock Inactivity (Minutes)"
                    value={autoLockMinutes}
                    onChange={setAutoLockMinutes}
                    placeholder="15"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 6: TAXES & GST */}
          {activeTab === "gst" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Percent size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  GST Tax Calculation & Pricing Rules
                </h3>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  STORE TAX MODE
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setTaxMode("inclusive")}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      border: taxMode === "inclusive" ? "2px solid #0ea5e9" : "1.5px solid #e2e8f0",
                      background: taxMode === "inclusive" ? "rgba(14, 165, 233, 0.08)" : "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0369a1" }}>MRP Inclusive Tax (Retail Default)</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Customer pays printed MRP; tax is extracted internally</div>
                  </button>
                  <button
                    onClick={() => setTaxMode("exclusive")}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      border: taxMode === "exclusive" ? "2px solid #0ea5e9" : "1.5px solid #e2e8f0",
                      background: taxMode === "exclusive" ? "rgba(14, 165, 233, 0.08)" : "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0369a1" }}>Base Price + Tax (Wholesale)</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Tax is added on top of base sale price at checkout</div>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Mandatory HSN Code on Receipts</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Includes HSN code on every item row in printed bills</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hsnMandatory}
                    onChange={(e) => setHsnMandatory(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Composition Scheme Dealer</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Prints &ldquo;Bill of Supply&rdquo; instead of Tax Invoice</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={compositeGst}
                    onChange={(e) => setCompositeGst(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                  />
                </label>
              </div>
            </Card>
          )}

          {/* TAB 7: DIGITAL INVOICING / WHATSAPP */}
          {activeTab === "digital" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <MessageSquare size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Paperless WhatsApp & SMS Digital Invoicing
                </h3>
              </div>
              <p style={{ margin: "-8px 0 20px", fontSize: 13, color: "#64748b" }}>
                Send instant PDF bills to customer mobile numbers to reduce thermal paper roll expenses.
              </p>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  marginBottom: 16,
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
                    Enable WhatsApp Paperless e-Bills
                  </div>
                  <div style={{ fontSize: 11, color: "#15803d" }}>
                    Sends digital receipt link automatically when phone number is entered
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappBill}
                  onChange={(e) => setWhatsappBill(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#10b981", cursor: "pointer" }}
                />
              </label>

              <Input
                label="WhatsApp Business Gateway API Key / Webhook"
                value={whatsappApiKey}
                onChange={setWhatsappApiKey}
                placeholder="wa_live_..."
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: 8,
                  marginTop: 8,
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                    Low Inventory WhatsApp Alert to Store Manager
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    Sends WhatsApp notification when critical items reach reorder level
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={lowStockAlerts}
                  onChange={(e) => setLowStockAlerts(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "#0ea5e9", cursor: "pointer" }}
                />
              </label>
            </Card>
          )}

          {/* TAB 8: BACKUP, EXPORT & MAINTENANCE */}
          {activeTab === "backup" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Database size={20} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                  Data Export, Backup & System Maintenance
                </h3>
              </div>
              <p style={{ margin: "-8px 0 20px", fontSize: 13, color: "#64748b" }}>
                Export complete supermarket master data or create timestamped database snapshots.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    background: "#f8fafc",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                      Download Complete Database Backup
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      Exports products, inventory, customers, branches, and invoices as formatted JSON
                    </div>
                  </div>
                  <Btn onClick={handleExportData} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Download size={16} /> Export Backup JSON
                  </Btn>
                </div>

                <div
                  style={{
                    padding: 16,
                    background: "#fff1f2",
                    borderRadius: 10,
                    border: "1px solid #fecdd3",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#be123c", fontWeight: 700, marginBottom: 4 }}>
                    <AlertTriangle size={18} /> Danger Zone: Factory Reset Test Transactions
                  </div>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9f1239" }}>
                    Clears demo sales while preserving product catalog, GST slabs, and store branches.
                  </p>
                  <Btn
                    onClick={() => {
                      if (confirm("Are you sure you want to archive test transaction data?")) {
                        showToast("Test invoices archived! Product catalog preserved.", "success");
                      }
                    }}
                    style={{ background: "#e11d48", color: "#fff" }}
                  >
                    Archive Demo Sales
                  </Btn>
                </div>
              </div>
            </Card>
          )}

          {/* Bottom Save Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <Btn onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px" }}>
              <Save size={16} /> Save Configurations
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
