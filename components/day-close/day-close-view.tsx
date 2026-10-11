"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";

interface ShiftRecord {
  shiftId: string;
  date: string;
  cashier: string;
  supervisor: string;
  openingFloat: number;
  cashSales: number;
  digitalSales: number;
  totalSales: number;
  cashExpenses: number;
  expectedCash: number;
  countedCash: number;
  variance: number;
  status: "Balanced" | "Surplus" | "Shortage";
  notes: string;
}

const initialShiftLogs: ShiftRecord[] = [
  {
    shiftId: "SHIFT-20261010-02",
    date: "10 Oct 2026, 09:30 PM",
    cashier: "Amit Cashier",
    supervisor: "Sunil Kapoor (Manager)",
    openingFloat: 2000,
    cashSales: 18450,
    digitalSales: 26800,
    totalSales: 45250,
    cashExpenses: 450,
    expectedCash: 20000,
    countedCash: 20000,
    variance: 0,
    status: "Balanced",
    notes: "Shift handed over with zero discrepancy.",
  },
  {
    shiftId: "SHIFT-20261010-01",
    date: "10 Oct 2026, 02:30 PM",
    cashier: "Riya Cashier",
    supervisor: "Sunil Kapoor (Manager)",
    openingFloat: 2000,
    cashSales: 14200,
    digitalSales: 19500,
    totalSales: 33700,
    cashExpenses: 0,
    expectedCash: 16200,
    countedCash: 16250,
    variance: 50,
    status: "Surplus",
    notes: "Customer left ₹50 tip / roundoff change.",
  },
];

export function DayCloseView() {
  const { data, showToast, currentBranch, currentUser } = useAppStore();

  const [openingFloat, setOpeningFloat] = useState<number>(2000);
  const [cashierName, setCashierName] = useState<string>(currentUser?.name || "Amit Cashier");
  const [supervisorName, setSupervisorName] = useState<string>("Sunil Kapoor (Branch Manager)");
  const [handoverNotes, setHandoverNotes] = useState<string>("Day-end drawer audit and shift handover completed.");
  const [shiftLogs, setShiftLogs] = useState<ShiftRecord[]>(initialShiftLogs);
  const [showZReportModal, setShowZReportModal] = useState<boolean>(false);

  // Denominations count state
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    "2000": 0,
    "500": 18,
    "200": 15,
    "100": 34,
    "50": 20,
    "20": 25,
    "10": 40,
    coins: 150, // total value of coins
  });

  const handleCountChange = (denom: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setCounts((prev) => ({ ...prev, [denom]: num }));
  };

  // Denomination multipliers
  const total2000 = (counts["2000"] || 0) * 2000;
  const total500 = (counts["500"] || 0) * 500;
  const total200 = (counts["200"] || 0) * 200;
  const total100 = (counts["100"] || 0) * 100;
  const total50 = (counts["50"] || 0) * 50;
  const total20 = (counts["20"] || 0) * 20;
  const total10 = (counts["10"] || 0) * 10;
  const totalCoins = counts["coins"] || 0;

  const totalPhysicalCash =
    total2000 + total500 + total200 + total100 + total50 + total20 + total10 + totalCoins;

  // System Sales calculation from bills
  const bills = data.bills || [];
  const cashSales = bills
    .filter((b) => b.payment?.toLowerCase().includes("cash"))
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const upiSales = bills
    .filter((b) => b.payment?.toLowerCase().includes("upi"))
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const cardSales = bills
    .filter((b) => b.payment?.toLowerCase().includes("card"))
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const totalGrossSales = cashSales + upiSales + cardSales;

  // Cash Expenses from expenses list
  const expenses = data.expenses || [];
  const cashExpenses = expenses
    .filter((e) => e.paidBy?.toLowerCase().includes("cash"))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  // Expected Cash Drawer Total
  const expectedCashInDrawer = openingFloat + cashSales - cashExpenses;
  const variance = totalPhysicalCash - expectedCashInDrawer;

  const varianceStatus: "Balanced" | "Surplus" | "Shortage" =
    variance === 0 ? "Balanced" : variance > 0 ? "Surplus" : "Shortage";

  const handleCloseShift = () => {
    const newRecord: ShiftRecord = {
      shiftId: `SHIFT-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      cashier: cashierName,
      supervisor: supervisorName,
      openingFloat,
      cashSales,
      digitalSales: upiSales + cardSales,
      totalSales: totalGrossSales,
      cashExpenses,
      expectedCash: expectedCashInDrawer,
      countedCash: totalPhysicalCash,
      variance,
      status: varianceStatus,
      notes: handoverNotes,
    };

    setShiftLogs([newRecord, ...shiftLogs]);
    setShowZReportModal(true);
    showToast(`Shift closed & locked successfully! Status: ${varianceStatus} (${variance >= 0 ? "+₹" : "-₹"}${Math.abs(variance)})`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header Card */}
      <Card style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              🔒 Day-End Cash Drawer & Shift Handover (Z-Report)
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
              Reconcile physical cash drawer with POS register totals, verify cash denominations, and generate official shift handover Z-Reports.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" onClick={() => setShowZReportModal(true)}>
              📄 View Live Z-Report Slip
            </Btn>
            <Btn variant="success" onClick={handleCloseShift}>
              ✅ Close Shift & Lock Drawer
            </Btn>
          </div>
        </div>
      </Card>

      {/* Overview Metric Banners */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <Card style={{ padding: 14, borderLeft: "4px solid #64748b" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Morning Cash Float</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            ₹{openingFloat.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Starting drawer change</div>
        </Card>

        <Card style={{ padding: 14, borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Register Cash Sales</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", marginTop: 4 }}>
            ₹{cashSales.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>Total cash bills collected</div>
        </Card>

        <Card style={{ padding: 14, borderLeft: "4px solid #0ea5e9" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>UPI & Digital Sales</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0ea5e9", marginTop: 4 }}>
            ₹{(upiSales + cardSales).toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#0284c7", marginTop: 2 }}>Bank settlement auto-cleared</div>
        </Card>

        <Card style={{ padding: 14, borderLeft: "4px solid #ef4444" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Cash Payouts / Expenses</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444", marginTop: 4 }}>
            ₹{cashExpenses.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>Petty cash paid from counter</div>
        </Card>

        <Card
          style={{
            padding: 14,
            borderLeft: `4px solid ${variance === 0 ? "#10b981" : variance > 0 ? "#0ea5e9" : "#ef4444"}`,
            background: variance === 0 ? "#f0fdf4" : variance > 0 ? "#f0f9ff" : "#fef2f2",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
            Drawer Variance (Diff)
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: variance === 0 ? "#16a34a" : variance > 0 ? "#0284c7" : "#dc2626",
              marginTop: 4,
            }}
          >
            {variance === 0 ? "₹0 (Balanced)" : `${variance > 0 ? "+₹" : "-₹"}${Math.abs(variance).toLocaleString("en-IN")}`}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: variance === 0 ? "#15803d" : variance > 0 ? "#0369a1" : "#b91c1c" }}>
            {variance === 0 ? "🎯 Exact Match" : variance > 0 ? "📈 Cash Surplus" : "⚠️ Cash Shortage"}
          </div>
        </Card>
      </div>

      {/* Main Grid: Denomination Counter vs System Totals */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
        {/* Physical Cash Denomination Counter */}
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>💵 Physical Cash Denomination Counter</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Enter number of physical currency notes inside the cash drawer:</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Total Counted</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0ea5e9" }}>
                ₹{totalPhysicalCash.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "₹2,000 Notes", denom: "2000", total: total2000 },
              { label: "₹500 Notes", denom: "500", total: total500 },
              { label: "₹200 Notes", denom: "200", total: total200 },
              { label: "₹100 Notes", denom: "100", total: total100 },
              { label: "₹50 Notes", denom: "50", total: total50 },
              { label: "₹20 Notes", denom: "20", total: total20 },
              { label: "₹10 Notes", denom: "10", total: total10 },
            ].map((row) => (
              <div
                key={row.denom}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 100px 1fr",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: "#f8fafc",
                  borderRadius: 6,
                  border: "1px solid #e2e8f0",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{row.label}</span>
                <input
                  type="number"
                  min="0"
                  value={counts[row.denom] || 0}
                  onChange={(e) => handleCountChange(row.denom, e.target.value)}
                  style={{
                    width: 80,
                    padding: "4px 8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  = ₹{row.total.toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            {/* Coins / Small Change */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 100px 1fr",
                alignItems: "center",
                padding: "6px 10px",
                background: "#f8fafc",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Coins & Change</span>
              <input
                type="number"
                min="0"
                value={counts["coins"] || 0}
                onChange={(e) => handleCountChange("coins", e.target.value)}
                style={{
                  width: 80,
                  padding: "4px 8px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                = ₹{totalCoins.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </Card>

        {/* System Reconciliation & Shift Handover Sign-off */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12, borderBottom: "1px solid #e2e8f0", paddingBottom: 6 }}>
              📊 Cash Drawer Reconciliation Formula
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>(+) Morning Opening Float:</span>
                <span style={{ fontWeight: 600 }}>₹{openingFloat.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                <span>(+) Register Cash Sales Today:</span>
                <span style={{ fontWeight: 600 }}>₹{cashSales.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#dc2626" }}>
                <span>(-) Cash Expenses / Counter Payouts:</span>
                <span style={{ fontWeight: 600 }}>- ₹{cashExpenses.toLocaleString("en-IN")}</span>
              </div>

              <div
                style={{
                  borderTop: "1px solid #cbd5e1",
                  paddingTop: 8,
                  marginTop: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#0f172a",
                }}
              >
                <span>(=) System Expected Cash:</span>
                <span>₹{expectedCashInDrawer.toLocaleString("en-IN")}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#0284c7",
                }}
              >
                <span>Counted Physical Cash:</span>
                <span>₹{totalPhysicalCash.toLocaleString("en-IN")}</span>
              </div>

              {/* Status Box */}
              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  borderRadius: 6,
                  background: variance === 0 ? "#f0fdf4" : variance > 0 ? "#eff6ff" : "#fef2f2",
                  border: `1px solid ${variance === 0 ? "#bbf7d0" : variance > 0 ? "#bfdbfe" : "#fecaca"}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: variance === 0 ? "#166534" : variance > 0 ? "#1d4ed8" : "#b91c1c" }}>
                  {variance === 0
                    ? "✅ REGISTER CASH BALANCED PERFECTLY"
                    : variance > 0
                    ? `📈 SURPLUS DETECTED: +₹${variance.toLocaleString("en-IN")}`
                    : `⚠️ SHORTAGE DETECTED: -₹${Math.abs(variance).toLocaleString("en-IN")}`}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  {variance === 0
                    ? "Drawer count matches system records exactly."
                    : "Supervisor approval required for discrepancy audit."}
                </div>
              </div>
            </div>
          </Card>

          {/* Shift Handover Sign-off */}
          <Card style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>✍️ Shift Handover Sign-Off</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="Cashier On Duty" value={cashierName} onChange={(v) => setCashierName(v)} required />
              <Input label="Supervisor / Manager" value={supervisorName} onChange={(v) => setSupervisorName(v)} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <Input label="Float for Tomorrow (₹)" type="number" value={openingFloat.toString()} onChange={(v) => setOpeningFloat(parseFloat(v) || 0)} />
            </div>

            <Input label="Shift Handover Remarks / Notes" value={handoverNotes} onChange={(v) => setHandoverNotes(v)} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
              <Btn variant="primary" onClick={handleCloseShift}>
                🔒 Sign & Print Z-Report
              </Btn>
            </div>
          </Card>
        </div>
      </div>

      {/* Shift Audit History Table */}
      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
          📜 Shift Close & Z-Report History Logs
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                <th style={{ padding: 10 }}>Shift Ref</th>
                <th style={{ padding: 10 }}>Date & Time</th>
                <th style={{ padding: 10 }}>Cashier</th>
                <th style={{ padding: 10 }}>Gross Sales</th>
                <th style={{ padding: 10 }}>Expected Cash</th>
                <th style={{ padding: 10 }}>Counted Cash</th>
                <th style={{ padding: 10 }}>Variance</th>
                <th style={{ padding: 10 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shiftLogs.map((log) => (
                <tr key={log.shiftId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10, fontWeight: 700, color: "#0ea5e9" }}>{log.shiftId}</td>
                  <td style={{ padding: 10, color: "#64748b" }}>{log.date}</td>
                  <td style={{ padding: 10, fontWeight: 600 }}>{log.cashier}</td>
                  <td style={{ padding: 10, fontWeight: 700 }}>₹{log.totalSales.toLocaleString("en-IN")}</td>
                  <td style={{ padding: 10 }}>₹{log.expectedCash.toLocaleString("en-IN")}</td>
                  <td style={{ padding: 10, fontWeight: 700 }}>₹{log.countedCash.toLocaleString("en-IN")}</td>
                  <td style={{ padding: 10, fontWeight: 700, color: log.variance === 0 ? "#16a34a" : log.variance > 0 ? "#0284c7" : "#dc2626" }}>
                    {log.variance === 0 ? "₹0" : `${log.variance > 0 ? "+" : "-"}₹${Math.abs(log.variance)}`}
                  </td>
                  <td style={{ padding: 10 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        background: log.status === "Balanced" ? "#dcfce7" : log.status === "Surplus" ? "#e0f2fe" : "#fee2e2",
                        color: log.status === "Balanced" ? "#166534" : log.status === "Surplus" ? "#0369a1" : "#991b1b",
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Printable Thermal Z-Report Modal */}
      {showZReportModal && (
        <Modal title="🖨️ Shift Handover Z-Report Slip" onClose={() => setShowZReportModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 80mm Thermal Slip Area */}
            <div
              className="thermal-receipt-80mm"
              style={{
                border: "1px dashed #94a3b8",
                padding: 16,
                background: "#fafafa",
                borderRadius: 6,
                fontFamily: "Courier, monospace",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              <div style={{ textAlign: "center", borderBottom: "1px dashed #333", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>KC SUPERMARKET</div>
                <div style={{ fontSize: 10, color: "#555" }}>{currentBranch} | Hall Bazaar, Amritsar</div>
                <div style={{ fontSize: 10, color: "#555" }}>GSTIN: 03AABCK1234Z1Z5</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginTop: 4, letterSpacing: 1 }}>
                  *** DAY-END SHIFT Z-REPORT ***
                </div>
              </div>

              <div style={{ fontSize: 11, marginBottom: 6 }}>
                <div>Report ID: <strong>SHIFT-{Date.now().toString().slice(-6)}</strong></div>
                <div>Date & Time: <strong>{new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong></div>
                <div>Terminal: <strong>POS Register #01</strong></div>
                <div>Cashier: <strong>{cashierName}</strong></div>
                <div>Supervisor: <strong>{supervisorName}</strong></div>
              </div>

              <div style={{ borderTop: "1px dashed #333", borderBottom: "1px dashed #333", padding: "6px 0", margin: "6px 0" }}>
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>--- SALES BREAKDOWN ---</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cash Sales:</span>
                  <span>₹{cashSales.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>UPI / QR Sales:</span>
                  <span>₹{upiSales.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Card Sales:</span>
                  <span>₹{cardSales.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginTop: 2, borderTop: "1px solid #ccc", paddingTop: 2 }}>
                  <span>GROSS SALES:</span>
                  <span>₹{totalGrossSales.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div style={{ borderBottom: "1px dashed #333", paddingBottom: 6, marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>--- CASH DRAWER RECONCILIATION ---</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Opening Float:</span>
                  <span>₹{openingFloat.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cash Sales (+):</span>
                  <span>₹{cashSales.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cash Expenses (-):</span>
                  <span>- ₹{cashExpenses.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #ccc", paddingTop: 2, marginTop: 2 }}>
                  <span>Expected Drawer Cash:</span>
                  <span>₹{expectedCashInDrawer.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
                  <span>Counted Cash (Physical):</span>
                  <span>₹{totalPhysicalCash.toLocaleString("en-IN")}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    fontSize: 13,
                    borderTop: "1px solid #333",
                    paddingTop: 3,
                    marginTop: 3,
                  }}
                >
                  <span>VARIANCE / DIFF:</span>
                  <span>{variance === 0 ? "₹0.00 (EXACT)" : `${variance > 0 ? "+₹" : "-₹"}${Math.abs(variance).toLocaleString("en-IN")}`}</span>
                </div>
                <div style={{ textAlign: "right", fontSize: 10, fontWeight: 700, marginTop: 2 }}>
                  STATUS: {varianceStatus.toUpperCase()}
                </div>
              </div>

              <div style={{ borderBottom: "1px dashed #333", paddingBottom: 6, marginBottom: 8, fontSize: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>DENOMINATIONS AUDITED:</div>
                <div>₹2000x{counts["2000"] || 0} | ₹500x{counts["500"] || 0} | ₹200x{counts["200"] || 0} | ₹100x{counts["100"] || 0}</div>
                <div>₹50x{counts["50"] || 0} | ₹20x{counts["20"] || 0} | ₹10x{counts["10"] || 0} | Coins: ₹{counts["coins"] || 0}</div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 6, fontSize: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                  <span>____________________</span>
                  <span>____________________</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 2 }}>
                  <span>Cashier Signature</span>
                  <span>Manager Signature</span>
                </div>
                <div style={{ textAlign: "center", marginTop: 12, fontWeight: 700, fontSize: 10 }}>
                  *** SHIFT SAFELY CLOSED ***
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Btn variant="ghost" onClick={() => setShowZReportModal(false)}>
                Close
              </Btn>
              <Btn
                variant="primary"
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Print 80mm Z-Report
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
