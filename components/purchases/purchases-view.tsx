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
import { PurchaseOrder, ProductItem } from "@/types";

export function PurchasesView() {
  const { data, setData, showToast } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState<PurchaseOrder | null>(null);

  // New PO State
  const [supplier, setSupplier] = useState(data.suppliers[0]?.name || "Agro Foods Pvt Ltd");
  const [items, setItems] = useState("10");
  const [amount, setAmount] = useState("15000");

  // GRN Receipt State (Receiving Stock & Expiry)
  const [targetProductId, setTargetProductId] = useState(data.products[0]?.id?.toString() || "");
  const [receivedQty, setReceivedQty] = useState("20");
  const [grnBatchNo, setGrnBatchNo] = useState(`BAT-26-${Date.now().toString().slice(-4)}`);
  const [grnMfgDate, setGrnMfgDate] = useState("2026-09-01");
  const [grnExpiryDate, setGrnExpiryDate] = useState("2027-03-01");
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("INV-AGRO-8821");

  const handleCreatePO = () => {
    const newPO: PurchaseOrder = {
      id: `PO-2026-${(data.purchaseOrders.length + 1).toString().padStart(3, "0")}`,
      supplier,
      date: new Date().toISOString().split("T")[0],
      items: parseInt(items),
      amount: parseFloat(amount),
      status: "Pending",
    };
    setData((prev: any) => ({ ...prev, purchaseOrders: [newPO, ...prev.purchaseOrders] }));
    showToast(`Purchase Order ${newPO.id} generated! ✅`);
    setShowModal(false);
  };

  const handleOpenGRN = (po: PurchaseOrder) => {
    setShowGRNModal(po);
    setGrnBatchNo(`BAT-26-${Date.now().toString().slice(-4)}`);
    setSupplierInvoiceNo(`INV-${po.supplier.split(" ")[0].toUpperCase()}-${Date.now().toString().slice(-4)}`);
  };

  const handleReceiveGRN = () => {
    if (!showGRNModal) return;
    if (!grnBatchNo || !grnExpiryDate) {
      showToast("Batch number and Expiry date are mandatory for receiving goods!", "error");
      return;
    }

    const qty = parseInt(receivedQty) || 0;
    const matchedProduct = data.products.find((p) => p.id.toString() === targetProductId);

    setData((prev: any) => ({
      ...prev,
      // 1. Mark PO as Received
      purchaseOrders: prev.purchaseOrders.map((po: PurchaseOrder) =>
        po.id === showGRNModal.id ? { ...po, status: "Received" } : po
      ),
      // 2. Restock target product & register new batch + expiry
      products: prev.products.map((p: ProductItem) =>
        p.id.toString() === targetProductId
          ? {
              ...p,
              stock: p.stock + qty,
              batchNo: grnBatchNo,
              mfgDate: grnMfgDate,
              expiryDate: grnExpiryDate,
            }
          : p
      ),
      // 3. Update supplier payable balance
      suppliers: prev.suppliers.map((s: any) =>
        s.name === showGRNModal.supplier
          ? { ...s, outstanding: (s.outstanding || 0) + showGRNModal.amount }
          : s
      ),
    }));

    showToast(
      `Goods Received Note (GRN) Processed! Restocked ${qty} units of ${matchedProduct?.name || "Product"} with Batch ${grnBatchNo} & Expiry ${grnExpiryDate}! 📦`
    );
    setShowGRNModal(null);
  };

  const columns: Column<PurchaseOrder>[] = [
    { key: "id", label: "PO Number", render: (v) => <strong style={{ color: "#0ea5e9" }}>{v}</strong> },
    { key: "supplier", label: "Supplier & Vendor", render: (v) => <strong>{v}</strong> },
    { key: "date", label: "PO Date" },
    { key: "items", label: "Ordered Items" },
    { key: "amount", label: "Order Amount", render: (v) => <strong>₹{v.toLocaleString("en-IN")}</strong> },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <Badge
          text={v}
          color={v === "Received" ? "green" : v === "Approved" ? "blue" : "yellow"}
        />
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 6 }}>
          {r.status !== "Received" ? (
            <Btn size="sm" variant="success" onClick={() => handleOpenGRN(r)}>
              📥 Receive & GRN
            </Btn>
          ) : (
            <span style={{ fontSize: 11, color: "#166534", fontWeight: 700, padding: "4px 8px", background: "#dcfce7", borderRadius: 4 }}>
              ✅ Stock Inwarded
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Banner */}
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
            Purchase Orders (PO) & Inventory Goods Arrival (GRN)
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
            Issue purchase orders to verified distributors and receive stock inwards with batch numbers & expiry dates.
          </p>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ Create Purchase Order</Btn>
      </Card>

      <Card style={{ padding: 0 }}>
        <Table columns={columns} data={data.purchaseOrders} />
      </Card>

      {/* Create New PO Modal */}
      {showModal && (
        <Modal title="🛍️ Create New Purchase Order" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Select
              label="Supplier"
              value={supplier}
              onChange={setSupplier}
              options={data.suppliers.map((s) => s.name)}
            />
            <Input label="Expected Item Count" type="number" value={items} onChange={setItems} />
            <Input label="Estimated Order Amount (₹)" type="number" value={amount} onChange={setAmount} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Btn>
              <Btn onClick={handleCreatePO}>Submit PO</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Receive Goods & GRN (Batch & Expiry Inwarding) Modal */}
      {showGRNModal && (
        <Modal
          title={`📥 Goods Received Note (GRN) — ${showGRNModal.id}`}
          onClose={() => setShowGRNModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Supplier: {showGRNModal.supplier}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                PO Amount: <strong>₹{showGRNModal.amount.toLocaleString("en-IN")}</strong> | Order Ref: {showGRNModal.id}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                Product Replenished in Catalog *
              </label>
              <select
                value={targetProductId}
                onChange={(e) => setTargetProductId(e.target.value)}
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
                {data.products.map((p) => (
                  <option key={p.id} value={p.id.toString()}>
                    {p.name} ({p.sku}) — Current Stock: {p.stock} {p.unit}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input
                label="Received Quantity (Units)"
                type="number"
                value={receivedQty}
                onChange={(v) => setReceivedQty(v)}
                required
              />
              <Input
                label="Supplier Invoice / DC #"
                value={supplierInvoiceNo}
                onChange={(v) => setSupplierInvoiceNo(v)}
                required
              />
            </div>

            {/* BATCH & EXPIRY CAPTURE (ESSENTIAL RETAIL WORKFLOW) */}
            <div style={{ background: "#f0fdf4", padding: 12, borderRadius: 8, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", marginBottom: 6 }}>
                ⏳ Batch & Expiry Tagging (Auto-registers in Expiry Tracker)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 8 }}>
                <Input
                  label="New Batch #"
                  value={grnBatchNo}
                  onChange={(v) => setGrnBatchNo(v)}
                  placeholder="BAT-26-001"
                  required
                />
                <Input
                  label="Mfg Date"
                  type="date"
                  value={grnMfgDate}
                  onChange={(v) => setGrnMfgDate(v)}
                />
                <Input
                  label="Expiry Date *"
                  type="date"
                  value={grnExpiryDate}
                  onChange={(v) => setGrnExpiryDate(v)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <Btn variant="ghost" onClick={() => setShowGRNModal(null)}>
                Cancel
              </Btn>
              <Btn variant="success" onClick={handleReceiveGRN}>
                ✅ Inward Stock & Update Expiry
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
