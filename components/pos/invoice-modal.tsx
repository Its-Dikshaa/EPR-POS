"use client";

import React from "react";
import { Modal } from "../ui/modal";
import { Btn } from "../ui/button";

interface InvoiceModalProps {
  bill: any;
  onClose: () => void;
  company?: { name: string; gst: string; address: string; phone: string };
}

export function InvoiceModal({ bill, onClose, company }: InvoiceModalProps) {
  const co = company || {
    name: "KC Supermarket",
    gst: "03AABCK1234Z1Z5",
    address: "Hall Bazaar, Amritsar, Punjab - 143001",
    phone: "0183-234567",
  };
  const items = bill.cartItems || [];
  const subtotal = items.reduce((s: number, i: any) => s + i.salePrice * i.qty, 0);
  const gstAmt = items.reduce((s: number, i: any) => s + (i.salePrice * i.qty * (i.gst || 0)) / 100, 0);
  const discAmt = bill.discount || 0;
  const total = bill.total || subtotal + gstAmt - discAmt;

  const printInvoice = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Invoice ${bill.id}</title><style>
      body{font-family:monospace;font-size:12px;max-width:320px;margin:0 auto;padding:10px}
      .center{text-align:center}.bold{font-weight:bold}.line{border-top:1px dashed #000;margin:6px 0}
      .row{display:flex;justify-content:space-between}table{width:100%}td{padding:2px 0}
    </style></head><body>
    <div class="center bold">${co.name}</div>
    <div class="center">${co.address}</div>
    <div class="center">Ph: ${co.phone} | GST: ${co.gst}</div>
    <div class="line"></div>
    <div class="row"><span>Bill No: <b>${bill.id}</b></span><span>${bill.date}</span></div>
    <div>Customer: ${bill.customer}</div>
    ${bill.customerPhone ? `<div>Phone: ${bill.customerPhone}</div>` : ""}
    <div>Cashier: ${bill.cashier || "—"} | Branch: ${bill.branch || "—"}</div>
    <div class="line"></div>
    <table><tr><td><b>Item</b></td><td align="right"><b>Qty</b></td><td align="right"><b>Rate</b></td><td align="right"><b>Amt</b></td></tr>
    ${items.map((i: any) => `<tr><td>${i.name}</td><td align="right">${i.qty}</td><td align="right">₹${i.salePrice}</td><td align="right">₹${i.salePrice * i.qty}</td></tr>`).join("")}
    </table>
    <div class="line"></div>
    <div class="row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
    <div class="row"><span>GST</span><span>₹${gstAmt.toFixed(2)}</span></div>
    ${discAmt > 0 ? `<div class="row"><span>Discount</span><span>-₹${discAmt.toFixed(2)}</span></div>` : ""}
    <div class="line"></div>
    <div class="row bold" style="font-size:14px"><span>TOTAL</span><span>₹${total.toFixed(2)}</span></div>
    <div class="row"><span>Payment</span><span>${bill.payment}</span></div>
    ${bill.cashPaid ? `<div class="row"><span>Cash Paid</span><span>₹${bill.cashPaid}</span></div>` : ""}
    ${bill.changeReturn ? `<div class="row"><span>Change</span><span>₹${bill.changeReturn}</span></div>` : ""}
    <div class="line"></div>
    <div class="center">Thank you for shopping at ${co.name}!</div>
    <div class="center">Visit again 🙏</div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <Modal title={`🧾 Invoice — ${bill.id}`} onClose={onClose} width={520}>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 20, background: "#fafafa", fontFamily: "monospace", fontSize: 13 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{co.name}</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>{co.address}</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>Ph: {co.phone} | GSTIN: {co.gst}</div>
        </div>
        <div style={{ borderTop: "2px dashed #ccc", borderBottom: "2px dashed #ccc", padding: "8px 0", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span><b>Bill No:</b> {bill.id}</span><span>{bill.date}</span></div>
          <div><b>Customer:</b> {bill.customer} {bill.customerPhone ? `| Ph: ${bill.customerPhone}` : ""}</div>
          <div><b>Cashier:</b> {bill.cashier || "—"} | <b>Branch:</b> {bill.branch || "—"}</div>
          <div><b>Payment:</b> {bill.payment}</div>
        </div>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "3px 0" }}>Item</th>
              <th style={{ textAlign: "right", padding: "3px 4px" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "3px 4px" }}>Rate</th>
              <th style={{ textAlign: "right", padding: "3px 0" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px dotted #ddd" }}>
                <td style={{ padding: "4px 0" }}>{item.name}</td>
                <td style={{ textAlign: "right", padding: "4px" }}>{item.qty}</td>
                <td style={{ textAlign: "right", padding: "4px" }}>₹{item.salePrice}</td>
                <td style={{ textAlign: "right", padding: "4px 0" }}>₹{(item.salePrice * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: "2px dashed #ccc", marginTop: 8, paddingTop: 8 }}>
          {[
            ["Subtotal", `₹${subtotal.toFixed(2)}`],
            ["GST", `₹${gstAmt.toFixed(2)}`],
            ...(discAmt > 0 ? [["Discount", `-₹${discAmt.toFixed(2)}`]] : []),
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 3 }}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 4, paddingTop: 4, borderTop: "1px solid #ccc" }}>
            <span>TOTAL</span>
            <span style={{ color: "#0ea5e9" }}>₹{total.toFixed(2)}</span>
          </div>
          {bill.cashPaid > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Cash Paid</span><span>₹{bill.cashPaid}</span></div>}
          {bill.changeReturn > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontWeight: 700 }}><span>Change Return</span><span>₹{bill.changeReturn.toFixed(2)}</span></div>}
        </div>
        <div style={{ textAlign: "center", marginTop: 12, color: "#64748b", fontSize: 11, borderTop: "1px dashed #ccc", paddingTop: 8 }}>
          ✨ Thank you for shopping! Visit again 🙏
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
        <Btn variant="outline" onClick={() => navigator.clipboard?.writeText(bill.id)}>📋 Copy Bill No</Btn>
        <Btn onClick={printInvoice}>🖨️ Print Invoice</Btn>
      </div>
    </Modal>
  );
}
