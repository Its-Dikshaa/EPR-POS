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
import { CustomerItem } from "@/types";

interface KhataReceipt {
  receiptNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  previousBalance: number;
  paidAmount: number;
  remainingBalance: number;
  paymentMode: string;
  notes: string;
  cashier: string;
}

export function CustomersView() {
  const { data, setData, showToast, currentBranch, currentUser } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [filterType, setFilterType] = useState<"all" | "dues" | "zero" | "vip">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Settlement Form State
  const [settleAmount, setSettleAmount] = useState<string>("");
  const [settleMode, setSettleMode] = useState<string>("UPI");
  const [settleNotes, setSettleNotes] = useState<string>("Paid at counter");
  const [receiptData, setReceiptData] = useState<KhataReceipt | null>(null);

  // New Customer Form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    creditLimit: "5000",
    group: "Regular",
  });

  // KPI Calculations
  const totalCustomers = data.customers.length;
  const totalOutstanding = data.customers.reduce((acc, c) => acc + (c.outstanding || 0), 0);
  const totalCreditLimit = data.customers.reduce((acc, c) => acc + (c.creditLimit || 0), 0);
  const customersWithDues = data.customers.filter((c) => (c.outstanding || 0) > 0).length;

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      showToast("Name and phone number are required!", "error");
      return;
    }
    const newCust: CustomerItem = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      loyaltyPoints: 100,
      creditLimit: parseFloat(formData.creditLimit) || 5000,
      outstanding: 0,
      group: formData.group,
    };
    setData((prev: any) => ({ ...prev, customers: [newCust, ...prev.customers] }));
    showToast("Customer registered! 100 bonus loyalty points added. ⭐");
    setShowAddModal(false);
    setFormData({ name: "", phone: "", email: "", address: "", creditLimit: "5000", group: "Regular" });
  };

  const handleOpenSettle = (customer: CustomerItem) => {
    setSelectedCustomer(customer);
    setSettleAmount(customer.outstanding.toString());
    setSettleMode("UPI");
    setSettleNotes("Khata cleared at billing counter");
    setShowSettleModal(true);
  };

  const handleExecuteSettlement = () => {
    if (!selectedCustomer) return;
    const amountToPay = parseFloat(settleAmount);

    if (isNaN(amountToPay) || amountToPay <= 0) {
      showToast("Please enter a valid payment amount!", "error");
      return;
    }

    if (amountToPay > selectedCustomer.outstanding) {
      showToast("Amount exceeds pending dues! Maximum due is ₹" + selectedCustomer.outstanding, "error");
      return;
    }

    const prevBalance = selectedCustomer.outstanding;
    const newBalance = Math.max(0, prevBalance - amountToPay);
    const bonusPoints = Math.floor(amountToPay / 100) * 5; // 5 points per ₹100 settled

    // Update customer in store
    setData((prev: any) => ({
      ...prev,
      customers: prev.customers.map((c: CustomerItem) =>
        c.id === selectedCustomer.id
          ? {
              ...c,
              outstanding: newBalance,
              loyaltyPoints: (c.loyaltyPoints || 0) + bonusPoints,
            }
          : c
      ),
    }));

    // Prepare printable receipt voucher
    const receipt: KhataReceipt = {
      receiptNo: `KHATA-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      previousBalance: prevBalance,
      paidAmount: amountToPay,
      remainingBalance: newBalance,
      paymentMode: settleMode,
      notes: settleNotes,
      cashier: currentUser?.name || "Admin",
    };

    setReceiptData(receipt);
    setShowSettleModal(false);
    setShowReceiptModal(true);
    showToast(`Payment of ₹${amountToPay.toLocaleString("en-IN")} received successfully! +${bonusPoints} Loyalty Pts. ⭐`);
  };

  // Filter list
  const filteredCustomers = data.customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterType === "dues") return (c.outstanding || 0) > 0;
    if (filterType === "zero") return (c.outstanding || 0) === 0;
    if (filterType === "vip") return c.group === "VIP" || c.group === "Premium";
    return true;
  });

  const columns: Column<CustomerItem>[] = [
    {
      key: "name",
      label: "Customer & Contact",
      render: (v, r) => (
        <div>
          <strong style={{ color: "#0f172a", fontSize: 13 }}>{v}</strong>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>📞 {r.phone}</div>
          {r.address && <div style={{ fontSize: 10, color: "#94a3b8" }}>📍 {r.address}</div>}
        </div>
      ),
    },
    {
      key: "group",
      label: "Tier / Group",
      render: (v) => <Badge text={v} color={v === "VIP" ? "red" : v === "Premium" ? "purple" : "blue"} />,
    },
    {
      key: "loyaltyPoints",
      label: "Loyalty Points",
      render: (v) => (
        <span style={{ fontWeight: 700, color: "#d97706", fontSize: 13 }}>
          ⭐ {v || 0} pts
        </span>
      ),
    },
    {
      key: "creditLimit",
      label: "Credit Limit",
      render: (v, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>₹{(v || 0).toLocaleString("en-IN")}</div>
          <div style={{ fontSize: 10, color: "#64748b" }}>
            Available: ₹{Math.max(0, (v || 0) - (r.outstanding || 0)).toLocaleString("en-IN")}
          </div>
        </div>
      ),
    },
    {
      key: "outstanding",
      label: "Outstanding Khata Due",
      render: (v) =>
        v > 0 ? (
          <div>
            <span
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "4px 8px",
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 13,
                display: "inline-block",
              }}
            >
              ₹{v.toLocaleString("en-IN")}
            </span>
            <div style={{ fontSize: 10, color: "#ef4444", marginTop: 2, fontWeight: 600 }}>Due Pending</div>
          </div>
        ) : (
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>₹0 (Cleared)</span>
        ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {r.outstanding > 0 ? (
            <Btn
              size="sm"
              variant="success"
              onClick={() => handleOpenSettle(r)}
            >
              💳 Settle Khata
            </Btn>
          ) : (
            <Btn
              size="sm"
              variant="outline"
              onClick={() => {
                showToast(`${r.name} has no pending dues! Zero balance.`);
              }}
            >
              ✅ All Paid
            </Btn>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <Card style={{ padding: 16, borderLeft: "4px solid #0ea5e9" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Registered Customers</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{totalCustomers}</div>
          <div style={{ fontSize: 11, color: "#0ea5e9", marginTop: 4, fontWeight: 600 }}>KC Supermarket Loyalty Club</div>
        </Card>

        <Card style={{ padding: 16, borderLeft: "4px solid #ef4444", background: customersWithDues > 0 ? "#fef2f2" : "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#991b1b", textTransform: "uppercase" }}>Total Outstanding Khata (Udhar)</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#dc2626", marginTop: 4 }}>
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 4, fontWeight: 600 }}>
            {customersWithDues} Customers with unpaid balance
          </div>
        </Card>

        <Card style={{ padding: 16, borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Approved Credit Limit</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            ₹{totalCreditLimit.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, fontWeight: 600 }}>Store revolving credit pool</div>
        </Card>

        <Card style={{ padding: 16, borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Average Credit Utilization</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#d97706", marginTop: 4 }}>
            {totalCreditLimit > 0 ? ((totalOutstanding / totalCreditLimit) * 100).toFixed(1) : 0}%
          </div>
          <div style={{ fontSize: 11, color: "#d97706", marginTop: 4, fontWeight: 600 }}>Safe operating risk exposure</div>
        </Card>
      </div>

      {/* Action Header & Filters */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              Customer Relationship Management (CRM) & Khata Ledger
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
              Manage customer loyalty profiles, credit lines, and settle pending credit (udhar) balances with instant thermal receipts.
            </p>
          </div>
          <Btn onClick={() => setShowAddModal(true)}>+ Register New Customer</Btn>
        </div>

        {/* Search & Filter pills */}
        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <input
              type="text"
              placeholder="🔍 Search customer name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              All ({totalCustomers})
            </button>
            <button
              onClick={() => setFilterType("dues")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "dues" ? "#ef4444" : "#fee2e2",
                color: filterType === "dues" ? "#fff" : "#991b1b",
                border: "none",
              }}
            >
              ⚠️ Dues Pending ({customersWithDues})
            </button>
            <button
              onClick={() => setFilterType("zero")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "zero" ? "#10b981" : "#d1fae5",
                color: filterType === "zero" ? "#fff" : "#065f46",
                border: "none",
              }}
            >
              ✅ Zero Dues
            </button>
            <button
              onClick={() => setFilterType("vip")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: filterType === "vip" ? "#8b5cf6" : "#ede9fe",
                color: filterType === "vip" ? "#fff" : "#5b21b6",
                border: "none",
              }}
            >
              ⭐ VIP Members
            </button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        <Table columns={columns} data={filteredCustomers} />
      </Card>

      {/* Settle Khata Payment Modal */}
      {showSettleModal && selectedCustomer && (
        <Modal title={`💳 Settle Khata / Receive Due — ${selectedCustomer.name}`} onClose={() => setShowSettleModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Account Summary Banner */}
            <div style={{ background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{selectedCustomer.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>📞 {selectedCustomer.phone} | Group: {selectedCustomer.group}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Total Current Due:</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
                    ₹{selectedCustomer.outstanding.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Settle Buttons */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Quick Select Amount</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {[500, 1000, 2000].map((amt) => {
                  if (amt > selectedCustomer.outstanding) return null;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSettleAmount(amt.toString())}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        background: "#f1f5f9",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSettleAmount(selectedCustomer.outstanding.toString())}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1px solid #0ea5e9",
                    background: "#e0f2fe",
                    color: "#0284c7",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Full Due (₹{selectedCustomer.outstanding})
                </button>
              </div>
            </div>

            {/* Amount input */}
            <Input
              label="Payment Amount Received (₹)"
              type="number"
              value={settleAmount}
              onChange={(v) => setSettleAmount(v)}
              required
            />

            {/* Payment Mode */}
            <Select
              label="Payment Mode"
              value={settleMode}
              onChange={(v) => setSettleMode(v)}
              options={["UPI / QR Code", "Cash", "Debit / Credit Card", "Bank Transfer / NEFT"]}
            />

            {/* Notes */}
            <Input
              label="Payment Reference / Notes"
              value={settleNotes}
              onChange={(v) => setSettleNotes(v)}
            />

            {/* Remaining balance preview */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "#166534", fontWeight: 700 }}>REMAINING KHATA BALANCE AFTER PAYMENT</div>
                <div style={{ fontSize: 11, color: "#15803d" }}>Reward: +{Math.floor((parseFloat(settleAmount) || 0) / 100) * 5} Loyalty Points</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>
                ₹{Math.max(0, selectedCustomer.outstanding - (parseFloat(settleAmount) || 0)).toLocaleString("en-IN")}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <Btn variant="ghost" onClick={() => setShowSettleModal(false)}>
                Cancel
              </Btn>
              <Btn variant="success" onClick={handleExecuteSettlement}>
                ✅ Settle & Generate Receipt
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Khata Payment Slip Modal */}
      {showReceiptModal && receiptData && (
        <Modal title="🖨️ Khata Settlement Payment Slip" onClose={() => setShowReceiptModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Thermal Receipt Preview Area */}
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
                <div style={{ fontSize: 10, color: "#555" }}>Hall Bazaar, Amritsar, Punjab - 143001</div>
                <div style={{ fontSize: 10, color: "#555" }}>GSTIN: 03AABCK1234Z1Z5 | Ph: 0183-234567</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4, textDecoration: "underline" }}>
                  CUSTOMER KHATA PAYMENT RECEIPT
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span>Voucher #: <strong>{receiptData.receiptNo}</strong></span>
                <span>Branch: <strong>{currentBranch}</strong></span>
              </div>
              <div style={{ fontSize: 11, marginBottom: 8 }}>
                Date: <strong>{receiptData.date}</strong>
              </div>

              <div style={{ borderTop: "1px dashed #ccc", borderBottom: "1px dashed #ccc", padding: "6px 0", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Customer:</span>
                  <strong>{receiptData.customerName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Phone:</span>
                  <strong>{receiptData.customerPhone}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Mode:</span>
                  <strong>{receiptData.paymentMode}</strong>
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Previous Balance:</span>
                  <span>₹{receiptData.previousBalance.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, color: "#166534" }}>
                  <span>Amount Paid:</span>
                  <span>- ₹{receiptData.paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    fontSize: 14,
                    borderTop: "1px solid #333",
                    paddingTop: 4,
                    marginTop: 4,
                  }}
                >
                  <span>Remaining Due:</span>
                  <span>₹{receiptData.remainingBalance.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {receiptData.notes && (
                <div style={{ fontSize: 10, fontStyle: "italic", marginBottom: 8, color: "#666" }}>
                  Remarks: {receiptData.notes}
                </div>
              )}

              <div style={{ textAlign: "center", borderTop: "1px dashed #333", paddingTop: 8, marginTop: 8, fontSize: 10 }}>
                <div>Cashier: <strong>{receiptData.cashier}</strong></div>
                <div style={{ marginTop: 4 }}>Thank you for clearing your account dues!</div>
                <div style={{ fontWeight: 700 }}>*** HAVE A NICE DAY ***</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Btn variant="ghost" onClick={() => setShowReceiptModal(false)}>
                Close
              </Btn>
              <Btn
                variant="primary"
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Print Slip (80mm)
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Register Customer Modal */}
      {showAddModal && (
        <Modal title="👥 Register New Customer" onClose={() => setShowAddModal(false)}>
          <Input label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
          <Input label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} required />
          <Input label="Email Address" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
          <Input label="City / Address" value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} />
          <Input label="Credit Limit Allowed (₹)" type="number" value={formData.creditLimit} onChange={(v) => setFormData({ ...formData, creditLimit: v })} />
          <Select label="Customer Group" value={formData.group} onChange={(v) => setFormData({ ...formData, group: v })} options={["Regular", "VIP", "Wholesale", "Premium"]} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Save Customer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
