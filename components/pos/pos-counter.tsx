"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Badge } from "../ui/badge";
import { InvoiceModal } from "./invoice-modal";
import { CartItem, ProductItem } from "@/types";

export function PosCounter() {
  const { data, setData, showToast, currentUser, currentBranch } = useAppStore();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customer, setCustomer] = useState("Walk-in");
  const [payment, setPayment] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [heldBills, setHeldBills] = useState<any[]>([]);
  const [cashPaid, setCashPaid] = useState("");
  const [splitCash, setSplitCash] = useState("");
  const [splitUPI, setSplitUPI] = useState("");
  const [splitCard, setSplitCard] = useState("");
  const [showInvoice, setShowInvoice] = useState<any | null>(null);

  const filteredProducts = data.products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search);
    return matchCat && matchSearch;
  });

  const addToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is Out of Stock!`, "error");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast(`Cannot add more. Max stock available: ${product.stock}`, "error");
          return prev;
        }
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number | string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCashPaid("");
    setSplitCash("");
    setSplitUPI("");
    setSplitCard("");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.salePrice * item.qty, 0);
  const gstAmount = cart.reduce((sum, item) => sum + (item.salePrice * item.qty * (item.gst || 0)) / 100, 0);
  const total = Math.max(0, subtotal + gstAmount - discount);
  const changeReturn = cashPaid ? Math.max(0, parseFloat(cashPaid) - total) : 0;

  const handleHoldBill = () => {
    if (cart.length === 0) return;
    const held = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString(),
      cart,
      customer,
      total,
    };
    setHeldBills((prev) => [...prev, held]);
    clearCart();
    showToast("Bill put on Hold ⏸️");
  };

  const handleResumeBill = (held: any) => {
    setCart(held.cart);
    setCustomer(held.customer);
    setHeldBills((prev) => prev.filter((b) => b.id !== held.id));
    showToast(`Resumed ${held.id} ⏩`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Cart is empty!", "error");
      return;
    }

    const billNo = `KC-2026-${(data.bills.length + 1).toString().padStart(4, "0")}`;
    const newBill = {
      id: billNo,
      date: new Date().toISOString().split("T")[0],
      customer,
      customerPhone: data.customers.find((c) => c.name === customer)?.phone || "",
      items: cart.reduce((sum, item) => sum + item.qty, 0),
      subtotal,
      gst: gstAmount,
      discount,
      total,
      payment,
      cashPaid: cashPaid ? parseFloat(cashPaid) : total,
      changeReturn,
      status: "Completed",
      cashier: currentUser?.name || "Amit Cashier",
      branch: currentBranch,
      cartItems: [...cart],
    };

    // Deduct Stock in inventory
    const updatedProducts = data.products.map((prod) => {
      const inCart = cart.find((item) => item.id === prod.id);
      if (inCart) {
        return { ...prod, stock: Math.max(0, prod.stock - inCart.qty) };
      }
      return prod;
    });

    setData((prev: any) => ({
      ...prev,
      products: updatedProducts,
      bills: [newBill, ...prev.bills],
    }));

    setShowInvoice(newBill);
    clearCart();
    showToast(`Bill ${billNo} completed & stock updated! ✅`);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20 }}>
      {/* Left Column: Category Filters & Product Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Search & Barcode Input */}
        <Card style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Scan Barcode or Search by Product Name / SKU..."
              style={{
                width: "100%",
                paddingLeft: 36,
                paddingRight: 12,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 8,
                border: "1.5px solid #0ea5e9",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          {heldBills.length > 0 && (
            <Badge text={`⏸️ ${heldBills.length} Held Bills`} color="yellow" />
          )}
        </Card>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {["All", ...data.categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: "none",
                background: selectedCategory === cat ? "#1a2e4a" : "#fff",
                color: selectedCategory === cat ? "#fff" : "#1e293b",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {filteredProducts.map((p) => {
            const isLow = p.stock <= 10;
            return (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  padding: 14,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0ea5e9")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>{p.category}</span>
                    <Badge text={isLow ? `Low: ${p.stock}` : `Stock: ${p.stock}`} color={isLow ? "red" : "green"} />
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{p.name}</h4>
                  <div style={{ fontSize: 11, color: "#64748b" }}>SKU: {p.sku} | HSN: {p.hsn}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0ea5e9" }}>₹{p.salePrice}</span>
                    <span style={{ fontSize: 10, color: "#64748b", textDecoration: "line-through", marginLeft: 4 }}>
                      ₹{p.mrp}
                    </span>
                  </div>
                  <button
                    style={{
                      background: "#0ea5e9",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: POS Cart & Checkout */}
      <Card style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", position: "sticky", top: 80 }}>
        {/* Cart Header */}
        <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 12, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1e293b" }}>🛒 Current Order</h3>
            <span style={{ fontSize: 11, color: "#64748b" }}>{cart.length} item types in cart</span>
          </div>
          <Btn variant="ghost" size="sm" onClick={clearCart} style={{ color: "#ef4444" }}>Clear</Btn>
        </div>

        {/* Customer Select */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Customer</label>
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12, marginTop: 3 }}
          >
            <option value="Walk-in">Walk-in Customer</option>
            {data.customers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: "auto", border: "1px solid #f1f5f9", borderRadius: 8, padding: 8, marginBottom: 12 }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{item.name}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  ₹{item.salePrice} x {item.qty} = <strong>₹{item.salePrice * item.qty}</strong> (GST {item.gst}%)
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => updateQty(item.id, -1)}
                  style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  -
                </button>
                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  style={{ width: 22, height: 22, borderRadius: 4, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", marginLeft: 4 }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontSize: 12 }}>
              Cart is empty.<br />Click on items or scan barcode to add.
            </div>
          )}
        </div>

        {/* Calculation Summary */}
        <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>GST Amount:</span> <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#ef4444" }}>
            <span>Discount:</span>
            <span>-₹{discount}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontWeight: 800,
              color: "#1e293b",
              borderTop: "1px solid #cbd5e1",
              paddingTop: 6,
              marginTop: 4,
            }}
          >
            <span>TOTAL:</span>
            <span style={{ color: "#0ea5e9" }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {["Cash", "UPI", "Card", "Mixed"].map((m) => (
              <button
                key={m}
                onClick={() => setPayment(m)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  borderRadius: 6,
                  border: "none",
                  background: payment === m ? "#1a2e4a" : "#e2e8f0",
                  color: payment === m ? "#fff" : "#1e293b",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {payment === "Cash" && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                placeholder="Cash Paid (₹)"
                value={cashPaid}
                onChange={(e) => setCashPaid(e.target.value)}
                style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}
              />
              {changeReturn > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Change: ₹{changeReturn.toFixed(2)}</span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="warning" onClick={handleHoldBill} disabled={cart.length === 0} style={{ flex: 1 }}>
            ⏸️ Hold
          </Btn>
          <Btn variant="success" size="lg" onClick={handleCheckout} disabled={cart.length === 0} style={{ flex: 2, justifyContent: "center" }}>
            💳 Complete & Print
          </Btn>
        </div>
      </Card>

      {/* Invoice Modal */}
      {showInvoice && <InvoiceModal bill={showInvoice} onClose={() => setShowInvoice(null)} />}
    </div>
  );
}
