import { useState, useEffect, useRef, useCallback } from "react";

// ─── Global App State (Real-time sync across all modules) ──────────────────────
let _globalListeners = [];
let _globalState = null;

function createGlobalStore(initial) {
  _globalState = initial;
  return {
    get: () => _globalState,
    set: (updater) => {
      _globalState = typeof updater === "function" ? updater(_globalState) : updater;
      _globalListeners.forEach(fn => fn(_globalState));
    },
    subscribe: (fn) => {
      _globalListeners.push(fn);
      return () => { _globalListeners = _globalListeners.filter(l => l !== fn); };
    }
  };
}

function useGlobalStore() {
  const [state, setState] = useState(() => store.get());
  useEffect(() => store.subscribe(setState), []);
  return [state, store.set];
}

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  primary: "#1a2e4a", accent: "#0ea5e9", success: "#10b981",
  warning: "#f59e0b", danger: "#ef4444", purple: "#8b5cf6",
  sidebar: "#0f1f35", sidebarHover: "#1e3a5f",
  bg: "#f0f4f8", border: "#e2e8f0", text: "#1e293b", muted: "#64748b",
};

// ─── Initial Data ──────────────────────────────────────────────────────────────
const initialData = {
  products: [
    { id: 1, name: "Basmati Rice 5kg", sku: "RICE001", category: "Grains", brand: "India Gate", mrp: 450, salePrice: 420, purchasePrice: 320, stock: 142, gst: 5, hsn: "1006", unit: "Bag", barcode: "8901234567890", rack: "A1", status: "Active" },
    { id: 2, name: "Toor Dal 1kg", sku: "DAL001", category: "Pulses", brand: "Tata", mrp: 160, salePrice: 148, purchasePrice: 110, stock: 89, gst: 5, hsn: "0713", unit: "Kg", barcode: "8901234567891", rack: "A2", status: "Active" },
    { id: 3, name: "Sunflower Oil 1L", sku: "OIL001", category: "Oils", brand: "Fortune", mrp: 175, salePrice: 162, purchasePrice: 130, stock: 67, gst: 5, hsn: "1512", unit: "Litre", barcode: "8901234567892", rack: "B1", status: "Active" },
    { id: 4, name: "Aashirvaad Atta 5kg", sku: "ATT001", category: "Flour", brand: "Aashirvaad", mrp: 280, salePrice: 265, purchasePrice: 200, stock: 5, gst: 0, hsn: "1101", unit: "Bag", barcode: "8901234567893", rack: "A3", status: "Active" },
    { id: 5, name: "Amul Butter 500g", sku: "BUT001", category: "Dairy", brand: "Amul", mrp: 250, salePrice: 238, purchasePrice: 195, stock: 34, gst: 12, hsn: "0405", unit: "Pack", barcode: "8901234567894", rack: "C1", status: "Active" },
    { id: 6, name: "Maggi Noodles 70g", sku: "MAG001", category: "Instant Food", brand: "Nestle", mrp: 15, salePrice: 14, purchasePrice: 10, stock: 200, gst: 12, hsn: "1902", unit: "Pack", barcode: "8901234567895", rack: "D1", status: "Active" },
    { id: 7, name: "Surf Excel 1kg", sku: "SUR001", category: "Detergent", brand: "HUL", mrp: 220, salePrice: 205, purchasePrice: 160, stock: 45, gst: 18, hsn: "3402", unit: "Kg", barcode: "8901234567896", rack: "E1", status: "Active" },
    { id: 8, name: "Colgate 200g", sku: "COL001", category: "Personal Care", brand: "Colgate", mrp: 95, salePrice: 88, purchasePrice: 65, stock: 78, gst: 18, hsn: "3306", unit: "Tube", barcode: "8901234567897", rack: "E2", status: "Active" },
  ],
  customers: [
    { id: 1, name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@gmail.com", address: "123 Main St, Amritsar", loyaltyPoints: 450, creditLimit: 5000, outstanding: 0, group: "Regular" },
    { id: 2, name: "Priya Sharma", phone: "9876543211", email: "priya@gmail.com", address: "456 Park Ave, Amritsar", loyaltyPoints: 1200, creditLimit: 10000, outstanding: 2500, group: "Premium" },
    { id: 3, name: "Amit Singh", phone: "9876543212", email: "amit@gmail.com", address: "789 Market Rd, Amritsar", loyaltyPoints: 80, creditLimit: 3000, outstanding: 0, group: "Regular" },
  ],
  suppliers: [
    { id: 1, name: "Agro Foods Pvt Ltd", contact: "Suresh Jain", phone: "9812345678", gst: "27AAACH1234A1Z5", address: "Mumbai", outstanding: 45000, creditDays: 30 },
    { id: 2, name: "Punjab Distributors", contact: "Harpreet Singh", phone: "9812345679", gst: "03AAABP5678B1Z3", address: "Amritsar", outstanding: 12000, creditDays: 15 },
    { id: 3, name: "Metro Wholesale", contact: "Ramesh Gupta", phone: "9812345680", gst: "07AAACM9012C1Z1", address: "Delhi", outstanding: 28500, creditDays: 45 },
  ],
  bills: [
    { id: "KC-2024-0001", date: "2024-01-15", customer: "Rajesh Kumar", customerPhone: "9876543210", items: 5, total: 1240, subtotal: 1180, gst: 60, discount: 0, payment: "Cash", status: "Completed", cashier: "Amit", branch: "KC Main Store", cartItems: [{name:"Basmati Rice 5kg",qty:2,salePrice:420,gst:5},{name:"Toor Dal 1kg",qty:1,salePrice:148,gst:5},{name:"Sunflower Oil 1L",qty:2,salePrice:162,gst:5}] },
    { id: "KC-2024-0002", date: "2024-01-15", customer: "Priya Sharma", customerPhone: "9876543211", items: 8, total: 3450, subtotal: 3100, gst: 350, discount: 0, payment: "UPI", status: "Completed", cashier: "Riya", branch: "KC Lawrence Road", cartItems: [{name:"Amul Butter 500g",qty:3,salePrice:238,gst:12},{name:"Maggi Noodles 70g",qty:10,salePrice:14,gst:12},{name:"Surf Excel 1kg",qty:2,salePrice:205,gst:18}] },
    { id: "KC-2024-0003", date: "2024-01-15", customer: "Walk-in", customerPhone: "", items: 3, total: 680, subtotal: 640, gst: 40, discount: 0, payment: "Card", status: "Completed", cashier: "Amit", branch: "KC Main Store", cartItems: [{name:"Colgate 200g",qty:2,salePrice:88,gst:18},{name:"Maggi Noodles 70g",qty:5,salePrice:14,gst:12}] },
    { id: "KC-2024-0004", date: "2024-01-16", customer: "Amit Singh", customerPhone: "9876543212", items: 12, total: 5200, subtotal: 4900, gst: 300, discount: 0, payment: "Mixed", status: "Completed", cashier: "Riya", branch: "KC Main Store", cartItems: [{name:"Basmati Rice 5kg",qty:5,salePrice:420,gst:5},{name:"Toor Dal 1kg",qty:4,salePrice:148,gst:5},{name:"Sunflower Oil 1L",qty:3,salePrice:162,gst:5}] },
  ],
  expenses: [
    { id: 1, date: "2024-01-15", category: "Electricity", amount: 8500, description: "Monthly electricity bill", status: "Approved", paidBy: "Bank" },
    { id: 2, date: "2024-01-14", category: "Staff Salary", amount: 45000, description: "January salaries", status: "Pending", paidBy: "-" },
    { id: 3, date: "2024-01-13", category: "Rent", amount: 25000, description: "Shop rent January", status: "Approved", paidBy: "Cash" },
  ],
  branches: [
    { id: 1, name: "KC Main Store", location: "Hall Bazaar, Amritsar", manager: "Sunil Kapoor", phone: "0183-234567", status: "Active", sales: 285000, type: "Branch", email: "main@kcsuper.com", gst: "03AABCK1234Z1Z5", openTime: "8:00 AM", closeTime: "10:00 PM", staff: 12, franchise: false },
    { id: 2, name: "KC Lawrence Road", location: "Lawrence Road, Amritsar", manager: "Kavita Singh", phone: "0183-345678", status: "Active", sales: 162000, type: "Branch", email: "lawrence@kcsuper.com", gst: "03AABCK1234Z2Z6", openTime: "9:00 AM", closeTime: "9:00 PM", staff: 8, franchise: false },
  ],
  franchises: [
    { id: 1, name: "KC Batala Road", owner: "Manpreet Bains", phone: "9871234567", email: "batala@kcfranchise.com", location: "Batala Road, Amritsar", royaltyPct: 5, startDate: "2023-06-01", status: "Active", sales: 95000, agreement: "5 years", depositPaid: 200000 },
  ],
  users: [
    { id: 1, name: "Admin User", username: "admin", role: "Admin", branch: "All", status: "Active", lastLogin: "2024-01-16 09:00" },
    { id: 2, name: "Amit Cashier", username: "amit_pos", role: "Cashier", branch: "KC Main Store", status: "Active", lastLogin: "2024-01-16 08:45" },
    { id: 3, name: "Riya Manager", username: "riya_mgr", role: "Manager", branch: "KC Lawrence Road", status: "Active", lastLogin: "2024-01-15 18:30" },
  ],
  purchaseOrders: [
    { id: "PO-2024-001", supplier: "Agro Foods Pvt Ltd", date: "2024-01-14", items: 12, amount: 48500, status: "Pending" },
    { id: "PO-2024-002", supplier: "Punjab Distributors", date: "2024-01-15", items: 6, amount: 22000, status: "Approved" },
    { id: "PO-2024-003", supplier: "Metro Wholesale", date: "2024-01-13", items: 18, amount: 95000, status: "Received" },
  ],
  adminProfile: {
    name: "Admin User",
    email: "admin@kcsupermarket.com",
    phone: "9876543210",
    password: "admin123"
  },
  billCounter: 5,
  categories: ["Grains", "Pulses", "Oils", "Flour", "Dairy", "Instant Food", "Detergent", "Personal Care"],
  brands: ["India Gate", "Tata", "Fortune", "Aashirvaad", "Amul", "Nestle", "HUL", "Colgate"],
  hsnCodes: [
    { code: "1006", description: "Rice & Wheat Grains", gst: 5 },
    { code: "0713", description: "Dried Leguminous Vegetables", gst: 5 },
    { code: "1512", description: "Sunflower / Edible Oils", gst: 5 },
    { code: "1101", description: "Wheat Flour (Atta)", gst: 0 },
    { code: "0405", description: "Butter & Dairy Fats", gst: 12 },
    { code: "1902", description: "Instant Noodles (Maggi)", gst: 12 },
    { code: "3402", description: "Organic Surface-Active Agents (Surf)", gst: 18 },
    { code: "3306", description: "Dentifrices & Oral hygiene (Colgate)", gst: 18 }
  ],
  units: ["Kg", "Litre", "Pack", "Bag", "Tube", "Box", "Piece"],
  expiryDamageLogs: [
    { id: 1, date: "2024-01-10", productName: "Amul Butter 500g", qty: 2, type: "Expired", reason: "Expired on shelf", actionTaken: "Written Off & Disposed" },
    { id: 2, date: "2024-01-12", productName: "Basmati Rice 5kg", qty: 1, type: "Damaged", reason: "Bag torn during unloading", actionTaken: "Written Off & Disposed" }
  ],
  returns: [],
  discounts: [
    { id: 1, name: "Republic Day Sale", type: "Bill Discount", valType: "Percentage", value: 10, validity: "2026-05-31", status: "Active", code: "REP10", applicableProducts: ["All Products"] },
    { id: 2, name: "Super Saver 50", type: "Bill Discount", valType: "Flat Amount", value: 50, validity: "2026-06-30", status: "Active", code: "SAVE50", applicableProducts: ["All Products"] },
    { id: 3, name: "Rice Festival Discount", type: "Item Discount", valType: "Percentage", value: 15, validity: "2026-06-15", status: "Active", code: "RICELOVE", applicableProducts: ["Basmati Rice 5kg"] }
  ]
};

const store = createGlobalStore(initialData);

// ─── Nav ──────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "pos", icon: "🛒", label: "POS Billing" },
  { id: "products", icon: "📦", label: "Products" },
  { id: "inventory", icon: "🏪", label: "Inventory" },
  { id: "purchases", icon: "🛍️", label: "Purchases" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "suppliers", icon: "🏭", label: "Suppliers" },
  { id: "expenses", icon: "💸", label: "Expenses" },
  { id: "discounts", icon: "🏷️", label: "Discounts" },
  { id: "accounting", icon: "📒", label: "Accounting" },
  { id: "gst", icon: "📋", label: "GST & Tax" },
  { id: "reports", icon: "📈", label: "Reports" },
  { id: "branches", icon: "🏢", label: "Branches" },
  { id: "franchises", icon: "🏪", label: "Franchises" },
  { id: "users", icon: "🔐", label: "Users & Roles" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Badge({ text, color = "blue" }) {
  const colors = { blue: ["#eff6ff","#1d4ed8"], green: ["#f0fdf4","#166534"], red: ["#fef2f2","#991b1b"], yellow: ["#fefce8","#854d0e"], purple: ["#faf5ff","#6b21a8"], gray: ["#f8fafc","#475569"] };
  const [bg, tc] = colors[color] || colors.blue;
  return <span style={{ background: bg, color: tc, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{text}</span>;
}

function Modal({ title, children, onClose, width = 560 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", fontSize: 18, cursor: "pointer", color: C.muted, lineHeight: 1, borderRadius: "50%", width: 30, height: 30, display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required, style: s }) {
  return (
    <div style={{ marginBottom: 14, ...s }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}{required && " *"}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: C.text, outline: "none", boxSizing: "border-box", background: "#fff" }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: C.text, outline: "none", background: "#fff", boxSizing: "border-box" }}>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: ex }) {
  const vs = { primary: { background: C.accent, color: "#fff", border: "none" }, success: { background: C.success, color: "#fff", border: "none" }, danger: { background: C.danger, color: "#fff", border: "none" }, outline: { background: "transparent", color: C.accent, border: `1.5px solid ${C.accent}` }, ghost: { background: "#f1f5f9", color: C.text, border: "none" }, warning: { background: C.warning, color: "#fff", border: "none" }, purple: { background: C.purple, color: "#fff", border: "none" } };
  const ss = { sm: { padding: "4px 10px", fontSize: 11 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "11px 24px", fontSize: 15 } };
  return <button onClick={onClick} disabled={disabled} style={{ ...vs[variant], ...ss[size], borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 5, ...ex }}>{children}</button>;
}

function Card({ children, style }) {
  return <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 18, ...style }}>{children}</div>;
}

function StatCard({ label, value, icon, sub, color = C.accent }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 18px", flex: 1, minWidth: 150 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
          <p style={{ margin: "5px 0 2px", fontSize: 22, fontWeight: 800, color: C.text }}>{value}</p>
          {sub && <p style={{ margin: 0, fontSize: 11, color: C.success }}>{sub}</p>}
        </div>
        <span style={{ fontSize: 26, opacity: 0.8 }}>{icon}</span>
      </div>
    </div>
  );
}

function Table({ columns, data, onAction }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {columns.map(col => <th key={col.key + col.label} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{col.label}</th>)}
            {onAction && <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid #e2e8f0" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              {columns.map(col => <td key={col.key + col.label} style={{ padding: "10px 12px", color: C.text, whiteSpace: "nowrap" }}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>)}
              {onAction && <td style={{ padding: "7px 12px", textAlign: "center" }}>
                <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                  <Btn size="sm" variant="outline" onClick={() => onAction("view", row)}>👁</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onAction("edit", row)}>✏️</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onAction("delete", row)} style={{ color: C.danger }}>🗑</Btn>
                </div>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div style={{ textAlign: "center", padding: 32, color: C.muted, fontSize: 13 }}>No records found</div>}
    </div>
  );
}

function SearchFilter({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", width: 220, background: "#fff" }} />
    </div>
  );
}

function Toast({ msg, onClose, type = "success" }) {
  useEffect(() => { if (msg) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); } }, [msg]);
  if (!msg) return null;
  const bg = type === "error" ? C.danger : C.success;
  return <div style={{ position: "fixed", bottom: 24, right: 24, background: bg, color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8 }}>{type === "success" ? "✅" : "❌"} {msg}</div>;
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
      {tabs.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: active === k ? C.accent : "#f1f5f9", color: active === k ? "#fff" : C.text, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{l}</button>
      ))}
    </div>
  );
}

// ─── Invoice Print Modal ───────────────────────────────────────────────────────
function InvoiceModal({ bill, onClose, company }) {
  const co = company || { name: "KC Supermarket", gst: "03AABCK1234Z1Z5", address: "Hall Bazaar, Amritsar, Punjab - 143001", phone: "0183-234567" };
  const items = bill.cartItems || [];
  const subtotal = items.reduce((s, i) => s + i.salePrice * i.qty, 0);
  const gstAmt = items.reduce((s, i) => s + (i.salePrice * i.qty * (i.gst || 0) / 100), 0);
  const discAmt = bill.discount || 0;
  const total = bill.total || (subtotal + gstAmt - discAmt);

  const printInvoice = () => {
    const w = window.open("", "_blank");
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
    ${items.map(i => `<tr><td>${i.name}</td><td align="right">${i.qty}</td><td align="right">₹${i.salePrice}</td><td align="right">₹${i.salePrice * i.qty}</td></tr>`).join("")}
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
          <div style={{ color: C.muted, fontSize: 11 }}>{co.address}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Ph: {co.phone} | GSTIN: {co.gst}</div>
        </div>
        <div style={{ borderTop: "2px dashed #ccc", borderBottom: "2px dashed #ccc", padding: "8px 0", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span><b>Bill No:</b> {bill.id}</span><span>{bill.date}</span></div>
          <div><b>Customer:</b> {bill.customer} {bill.customerPhone ? `| Ph: ${bill.customerPhone}` : ""}</div>
          <div><b>Cashier:</b> {bill.cashier || "—"} | <b>Branch:</b> {bill.branch || "—"}</div>
          <div><b>Payment:</b> {bill.payment}</div>
        </div>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "3px 0" }}>Item</th>
            <th style={{ textAlign: "right", padding: "3px 4px" }}>Qty</th>
            <th style={{ textAlign: "right", padding: "3px 4px" }}>Rate</th>
            <th style={{ textAlign: "right", padding: "3px 0" }}>Total</th>
          </tr></thead>
          <tbody>
            {items.map((item, i) => (
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
          {[["Subtotal", `₹${subtotal.toFixed(2)}`], ["GST", `₹${gstAmt.toFixed(2)}`], ...(discAmt > 0 ? [["Discount", `-₹${discAmt.toFixed(2)}`]] : [])].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", color: C.muted, marginBottom: 3 }}><span>{k}</span><span>{v}</span></div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 4, paddingTop: 4, borderTop: "1px solid #ccc" }}><span>TOTAL</span><span style={{ color: C.accent }}>₹{total.toFixed(2)}</span></div>
          {bill.cashPaid > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: C.muted }}><span>Cash Paid</span><span>₹{bill.cashPaid}</span></div>}
          {bill.changeReturn > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: C.success, fontWeight: 700 }}><span>Change Return</span><span>₹{bill.changeReturn.toFixed(2)}</span></div>}
        </div>
        <div style={{ textAlign: "center", marginTop: 12, color: C.muted, fontSize: 11, borderTop: "1px dashed #ccc", paddingTop: 8 }}>
          ✨ Thank you for shopping! Visit again 🙏
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
        <Btn variant="outline" onClick={() => navigator.clipboard?.writeText(bill.id).then(() => {})}>📋 Copy Bill No</Btn>
        <Btn onClick={printInvoice}>🖨️ Print Invoice</Btn>
      </div>
    </Modal>
  );
}

// ─── POS Billing ──────────────────────────────────────────────────────────────
function POS() {
  const [data, setData] = useGlobalStore();
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [tab, setTab] = useState("billing");
  const [heldBills, setHeldBills] = useState([]);
  const [cashPaid, setCashPaid] = useState("");
  const [splitCash, setSplitCash] = useState("");
  const [splitUPI, setSplitUPI] = useState("");
  const [splitCard, setSplitCard] = useState("");
  const [showInvoice, setShowInvoice] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState("");
  const [billDetailView, setBillDetailView] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [posBranch, setPosBranch] = useState(data.branches[0]?.name || "KC Main Store");

  // Exchange & Return States
  const [searchInvoiceNum, setSearchInvoiceNum] = useState("");
  const [foundInvoice, setFoundInvoice] = useState(null);
  const [returnQtys, setReturnQtys] = useState({});
  const [refundMode, setRefundMode] = useState("Cash");

  const handleSearchInvoice = () => {
    const inv = data.bills.find(b => b.id.trim().toUpperCase() === searchInvoiceNum.trim().toUpperCase());
    if (!inv) {
      setToast("Invoice not found!");
      setFoundInvoice(null);
      return;
    }
    setFoundInvoice(inv);
    const initialQtys = {};
    (inv.cartItems || []).forEach(item => {
      initialQtys[item.name] = 0;
    });
    setReturnQtys(initialQtys);
    setToast("Invoice fetched!");
  };

  const calculatedRefund = foundInvoice
    ? (foundInvoice.cartItems || []).reduce((sum, item) => {
        const qty = returnQtys[item.name] || 0;
        const price = item.salePrice || 0;
        const gst = item.gst || 0;
        return sum + (price * qty * (1 + gst / 100));
      }, 0)
    : 0;

  const processExchangeReturn = () => {
    if (!foundInvoice) return;
    const itemsToReturn = Object.entries(returnQtys).filter(([name, qty]) => qty > 0);
    if (itemsToReturn.length === 0) {
      setToast("Please select at least 1 item to return!");
      return;
    }

    const refundValue = Math.round(calculatedRefund * (1 - (foundInvoice.discount || 0) / 100) * 100) / 100;

    const returnRecord = {
      id: `RET-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN"),
      invoiceId: foundInvoice.id,
      customer: foundInvoice.customer,
      refundAmount: refundValue,
      refundMode,
      items: itemsToReturn.map(([name, qty]) => {
        const origItem = foundInvoice.cartItems.find(i => i.name === name);
        return {
          name,
          qty,
          salePrice: origItem.salePrice,
          gst: origItem.gst
        };
      })
    };

    setData(d => ({
      ...d,
      returns: [returnRecord, ...(d.returns || [])],
      products: d.products.map(p => {
        const returnedItem = itemsToReturn.find(([name]) => name === p.name);
        if (returnedItem) {
          return { ...p, stock: p.stock + returnedItem[1] };
        }
        return p;
      }),
      branches: d.branches.map(b => {
        if (b.name === foundInvoice.branch) {
          return { ...b, sales: Math.max(0, b.sales - refundValue) };
        }
        return b;
      }),
      bills: d.bills.map(b => {
        if (b.id === foundInvoice.id) {
          const totalOrigItems = (b.cartItems || []).reduce((sum, item) => sum + item.qty, 0);
          const totalReturnedItems = Object.values(returnQtys).reduce((sum, q) => sum + q, 0);
          const newStatus = totalReturnedItems >= totalOrigItems ? "Returned" : "Partially Returned";
          return {
            ...b,
            status: newStatus,
            returnedAmount: (b.returnedAmount || 0) + refundValue
          };
        }
        return b;
      })
    }));

    setToast("Return processed successfully!");
    setFoundInvoice(null);
    setSearchInvoiceNum("");
    setReturnQtys({});
    setTab("history");
  };

  const products = data.products;
  const customers = data.customers;
  const cats = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p =>
    (catFilter === "All" || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search))
  );

  const addToCart = (p) => {
    if (p.stock <= 0) { setToast("Out of stock!"); return; }
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      if (ex) {
        if (ex.qty >= p.stock) { setToast("Max stock reached!"); return prev; }
        return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    const prod = products.find(p => p.id === id);
    if (prod && qty > prod.stock) { setToast("Insufficient stock!"); return; }
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  // Calculate Item-wise discounts first
  const cartWithDiscounts = cart.map(c => {
    const itemOffer = data.discounts?.find(o => 
      o.status === "Active" && 
      o.type === "Item Discount" && 
      o.applicableProducts?.includes(c.name)
    );
    const unitDiscount = itemOffer 
      ? (itemOffer.valType === "Percentage" ? (c.salePrice * itemOffer.value / 100) : itemOffer.value)
      : 0;
    const finalPrice = Math.max(0, c.salePrice - unitDiscount);
    const totalItemDiscount = unitDiscount * c.qty;
    return { ...c, unitDiscount, finalPrice, totalItemDiscount, itemOfferName: itemOffer?.name };
  });

  const subtotal = cartWithDiscounts.reduce((s, c) => s + c.salePrice * c.qty, 0);
  const totalItemDiscAmt = cartWithDiscounts.reduce((s, c) => s + c.totalItemDiscount, 0);
  const discountedSubtotal = subtotal - totalItemDiscAmt;
  const gstAmt = cartWithDiscounts.reduce((s, c) => s + (c.finalPrice * c.qty * c.gst / 100), 0);

  const selectedOffer = data.discounts?.find(o => String(o.id) === String(selectedOfferId));
  const offerDiscAmt = selectedOffer 
    ? (selectedOffer.valType === "Percentage" ? (discountedSubtotal * selectedOffer.value / 100) : selectedOffer.value)
    : 0;
  const manualDiscAmt = (discountedSubtotal * discount / 100);
  const discAmt = totalItemDiscAmt + offerDiscAmt + manualDiscAmt;
  const total = Math.max(0, discountedSubtotal + gstAmt - (offerDiscAmt + manualDiscAmt));
  const cashPaidNum = parseFloat(cashPaid) || 0;
  const changeReturn = payment === "Cash" ? Math.max(0, cashPaidNum - total) : 0;

  // Split payment validation
  const splitTotal = (parseFloat(splitCash) || 0) + (parseFloat(splitUPI) || 0) + (parseFloat(splitCard) || 0);
  const splitRemaining = total - splitTotal;

  const processBill = () => {
    if (cart.length === 0) return;
    if (payment === "Cash" && cashPaidNum < total) { setToast("Cash received is less than total!"); return; }
    if (payment === "Mixed") {
      if (splitTotal < total) { setToast(`Still ₹${splitRemaining.toFixed(2)} remaining!`); return; }
    }
    const billNo = `KC-${new Date().getFullYear()}-${String(data.billCounter).padStart(4, "0")}`;
    const custObj = customers.find(c => c.name === customer);
    const bill = {
      id: billNo,
      date: new Date().toLocaleDateString("en-IN"),
      customer: customer || "Walk-in",
      customerPhone: custObj?.phone || "",
      items: cart.length,
      total: Math.round(total * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gstAmt * 100) / 100,
      discount: Math.round(discAmt * 100) / 100,
      payment,
      cashPaid: payment === "Cash" ? cashPaidNum : (payment === "Mixed" ? parseFloat(splitCash) || 0 : 0),
      changeReturn: payment === "Cash" ? changeReturn : 0,
      splitPayment: payment === "Mixed" ? { cash: parseFloat(splitCash) || 0, upi: parseFloat(splitUPI) || 0, card: parseFloat(splitCard) || 0 } : null,
      status: "Completed",
      cashier: "Admin",
      branch: posBranch,
      cartItems: cartWithDiscounts.map(c => ({ name: c.name, qty: c.qty, salePrice: c.finalPrice, gst: c.gst, sku: c.sku })),
    };
    // Update stock
    setData(d => ({
      ...d,
      bills: [bill, ...d.bills],
      billCounter: d.billCounter + 1,
      products: d.products.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
      }),
      // Add loyalty points if registered customer
      customers: d.customers.map(c => {
        if (c.name === customer) {
          return { ...c, loyaltyPoints: c.loyaltyPoints + Math.floor(total / 10) };
        }
        return c;
      }),
      // Increment Branch Sales
      branches: d.branches.map(b => {
        if (b.name === posBranch) {
          return { ...b, sales: b.sales + Math.round(total * 100) / 100 };
        }
        return b;
      })
    }));
    setShowInvoice(bill);
    setShowCheckout(false);
    setCart([]); setSearch(""); setDiscount(0); setSelectedOfferId(""); setCustomer(""); setPayment("Cash");
    setCashPaid(""); setSplitCash(""); setSplitUPI(""); setSplitCard("");
  };

  const holdBill = () => {
    if (cart.length === 0) return;
    setHeldBills(prev => [...prev, { id: Date.now(), cart, customer, discount, label: `${customer || "Walk-in"} — ₹${total.toFixed(0)}` }]);
    setCart([]); setCustomer(""); setDiscount(0); setSelectedOfferId("");
    setToast("Bill held successfully!");
  };

  const recallBill = (b) => {
    setCart(b.cart); setCustomer(b.customer); setDiscount(b.discount); setSelectedOfferId("");
    setHeldBills(prev => prev.filter(x => x.id !== b.id));
    setTab("billing");
    setToast("Bill recalled!");
  };

  const allBills = data.bills;

  return (
    <div>
      <Tabs tabs={[["billing","🛒 Billing"],["history","📜 History"],["returns","🔄 Exchange & Return"],["held",`⏸ Held (${heldBills.length})`]]} active={tab} onChange={setTab} />

      {tab === "billing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14, alignItems: "start" }}>
          {/* Left: Product Grid */}
          <div>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                <SearchFilter value={search} onChange={setSearch} placeholder="Search product / SKU / Barcode..." />
                <select value={posBranch} onChange={e => setPosBranch(e.target.value)}
                  style={{ padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: C.text, background: "#fff" }}>
                  {data.branches.map(b => <option key={b.id} value={b.name}>🏬 {b.name}</option>)}
                </select>
                <select value={customer} onChange={e => setCustomer(e.target.value)}
                  style={{ padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: C.text, background: "#fff" }}>
                  <option value="">👤 Walk-in Customer</option>
                  {customers.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {cats.map(c => (
                  <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: catFilter === c ? C.accent : "#f1f5f9", color: catFilter === c ? "#fff" : C.text, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{c}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: 8, maxHeight: 380, overflowY: "auto" }}>
                {filtered.map(p => (
                  <div key={p.id} onClick={() => addToCart(p)}
                    style={{ border: `1.5px solid ${p.stock === 0 ? "#fecaca" : "#e2e8f0"}`, borderRadius: 10, padding: "10px 12px", cursor: p.stock === 0 ? "not-allowed" : "pointer", opacity: p.stock === 0 ? 0.5 : 1, background: "#fafafa", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (p.stock > 0) { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = "#eff6ff"; }}}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = p.stock === 0 ? "#fecaca" : "#e2e8f0"; e.currentTarget.style.background = "#fafafa"; }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{p.sku}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>₹{p.salePrice}</span>
                      <Badge text={p.stock === 0 ? "Out" : `${p.stock}`} color={p.stock === 0 ? "red" : p.stock < 10 ? "yellow" : "green"} />
                    </div>
                    {p.mrp > p.salePrice && <div style={{ fontSize: 10, color: C.muted, textDecoration: "line-through" }}>MRP ₹{p.mrp}</div>}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Cart + Billing */}
          <Card style={{ position: "sticky", top: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: C.text }}>
              🛒 Cart {customer && <span style={{ fontSize: 11, color: C.accent, fontWeight: 400 }}>— {customer}</span>}
              <span style={{ float: "right", fontSize: 12, color: C.muted }}>{cart.length} items</span>
            </div>

            {/* Cart Items */}
            <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 10 }}>
              {cart.length === 0
                ? <div style={{ textAlign: "center", padding: 24, color: C.muted, fontSize: 13 }}>Click products to add</div>
                : cartWithDiscounts.map(c => (
                  <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                      {c.unitDiscount > 0 ? (
                        <div style={{ fontSize: 11, color: C.muted }}>
                          <span style={{ textDecoration: "line-through", color: C.danger, marginRight: 6 }}>₹{c.salePrice}</span>
                          <b style={{ color: C.success }}>₹{c.finalPrice.toFixed(2)}</b> × {c.qty} = <b style={{ color: C.text }}>₹{(c.finalPrice * c.qty).toFixed(2)}</b>
                          <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, marginTop: 1 }}>🏷️ {c.itemOfferName}</div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: C.muted }}>₹{c.salePrice} × {c.qty} = <b style={{ color: C.text }}>₹{(c.salePrice * c.qty).toFixed(2)}</b></div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => updateQty(c.id, c.qty - 1)} style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", fontSize: 14, fontWeight: 700, display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 22, textAlign: "center" }}>{c.qty}</span>
                      <button onClick={() => updateQty(c.id, c.qty + 1)} style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", fontSize: 14, fontWeight: 700, display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(c.id)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 15 }}>✕</button>
                  </div>
                ))
              }
            </div>

            {/* Totals */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
              {/* Dynamic Offers Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>🎟️ Apply Active Offer</span>
                <select 
                  value={selectedOfferId} 
                  onChange={e => setSelectedOfferId(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 12.5, background: "#fff", color: C.text }}
                >
                  <option value="">No Offer Applied</option>
                  {(data.discounts || []).filter(o => o.status === "Active").map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.valType === "Percentage" ? `${o.value}%` : `₹${o.value}`} Off)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>Manual Discount %</span>
                <input type="number" value={discount} onChange={e => setDiscount(Math.min(50, Math.max(0, Number(e.target.value))))} min={0} max={50}
                  style={{ width: 60, padding: "4px 8px", border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: 13 }} />
                <span style={{ fontSize: 11, color: C.danger, marginLeft: "auto" }}>−₹{(offerDiscAmt + manualDiscAmt).toFixed(2)}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, color: C.muted }}>
                <span>Subtotal (Gross)</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              {totalItemDiscAmt > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, color: C.muted }}>
                  <span>Item Discounts</span><span style={{ color: C.success }}>−₹{totalItemDiscAmt.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, color: C.muted }}>
                <span>GST Taxes</span><span>₹{gstAmt.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: C.text, margin: "8px 0 10px" }}>
                <span>Total</span><span style={{ color: C.accent }}>₹{total.toFixed(2)}</span>
              </div>

              {/* Payment Mode */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 10 }}>
                {["Cash", "UPI", "Card", "Mixed"].map(m => (
                  <button key={m} onClick={() => setPayment(m)}
                    style={{ padding: "7px 2px", borderRadius: 7, border: `2px solid ${payment === m ? C.accent : "#e2e8f0"}`, background: payment === m ? "#eff6ff" : "#f8fafc", color: payment === m ? C.accent : C.text, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{m}</button>
                ))}
              </div>

              {/* Cash change calculator */}
              {payment === "Cash" && (
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6 }}>CASH CALCULATOR</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>Cash Received ₹</span>
                    <input type="number" value={cashPaid} onChange={e => setCashPaid(e.target.value)} placeholder="0.00"
                      style={{ flex: 1, padding: "6px 8px", border: "1.5px solid #bbf7d0", borderRadius: 6, fontSize: 14, fontWeight: 700 }} />
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                    {[total, Math.ceil(total / 10) * 10, Math.ceil(total / 50) * 50, Math.ceil(total / 100) * 100, 500, 1000, 2000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6).map(amt => (
                      <button key={amt} onClick={() => setCashPaid(String(amt))}
                        style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #bbf7d0", background: "#dcfce7", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>₹{amt.toFixed(0)}</button>
                    ))}
                  </div>
                  {cashPaidNum > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: cashPaidNum >= total ? C.success : C.danger }}>
                      <span>Change Return:</span>
                      <span>{cashPaidNum >= total ? `₹${changeReturn.toFixed(2)}` : `Short ₹${(total - cashPaidNum).toFixed(2)}`}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Split Payment */}
              {payment === "Mixed" && (
                <div style={{ background: "#eff6ff", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6 }}>SPLIT PAYMENT — Total: ₹{total.toFixed(2)}</div>
                  {[["Cash", splitCash, setSplitCash], ["UPI", splitUPI, setSplitUPI], ["Card", splitCard, setSplitCard]].map(([label, val, setter]) => (
                    <div key={label} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: C.muted, width: 36 }}>{label}</span>
                      <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder="0.00"
                        style={{ flex: 1, padding: "5px 8px", border: "1.5px solid #bfdbfe", borderRadius: 6, fontSize: 13 }} />
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 12 }}>
                    <span>Collected: ₹{splitTotal.toFixed(2)}</span>
                    <span style={{ color: splitRemaining <= 0 ? C.success : C.danger }}>
                      {splitRemaining <= 0 ? `✅ Balanced` : `Remaining: ₹${splitRemaining.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Btn variant="ghost" onClick={holdBill} disabled={cart.length === 0}>⏸ Hold</Btn>
                <Btn variant="success" onClick={() => setShowCheckout(true)} disabled={cart.length === 0}>✅ Checkout ₹{total.toFixed(2)}</Btn>
              </div>
              {cart.length > 0 && <Btn variant="danger" size="sm" onClick={() => { setCart([]); setDiscount(0); }} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>🗑 Clear Cart</Btn>}
            </div>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontWeight: 700 }}>📜 Bill History ({allBills.length} bills)</h4>
          </div>
          <Table
            columns={[
              { key: "id", label: "Bill No", render: v => <span style={{ color: C.accent, fontWeight: 700, cursor: "pointer" }}>{v}</span> },
              { key: "date", label: "Date" },
              { key: "customer", label: "Customer" },
              { key: "items", label: "Items" },
              { key: "total", label: "Total", render: v => <b>₹{v}</b> },
              { key: "payment", label: "Mode", render: v => <Badge text={v} color="blue" /> },
              { key: "status", label: "Status", render: v => <Badge text={v} color="green" /> },
            ]}
            data={allBills}
            onAction={(action, row) => {
              if (action === "view") setBillDetailView(row);
              if (action === "edit") setBillDetailView(row);
            }}
          />
        </Card>
      )}

      {tab === "returns" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, alignItems: "start" }}>
          {/* Left Panel: Invoice Search & Items selection */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>🔄 POS Exchange & Return Center</h4>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input 
                type="text" 
                value={searchInvoiceNum} 
                onChange={e => setSearchInvoiceNum(e.target.value)} 
                placeholder="Enter Invoice Number (e.g. KC-2024-0001)"
                style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13 }}
              />
              <Btn onClick={handleSearchInvoice}>🔍 Fetch Invoice</Btn>
            </div>

            {foundInvoice ? (
              <div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 16, fontSize: 12.5, border: "1px solid #e2e8f0" }}>
                  <div><span style={{ color: C.muted }}>Invoice ID:</span> <strong>{foundInvoice.id}</strong></div>
                  <div><span style={{ color: C.muted }}>Customer:</span> <strong>{foundInvoice.customer}</strong></div>
                  <div><span style={{ color: C.muted }}>Date:</span> <strong>{foundInvoice.date}</strong></div>
                  <div><span style={{ color: C.muted }}>Branch:</span> <strong>{foundInvoice.branch}</strong></div>
                  <div><span style={{ color: C.muted }}>Original Total:</span> <strong>₹{foundInvoice.total}</strong></div>
                  <div><span style={{ color: C.muted }}>Original GST:</span> <strong>₹{foundInvoice.gst}</strong></div>
                  <div><span style={{ color: C.muted }}>Status:</span> <Badge text={foundInvoice.status} color={foundInvoice.status === "Returned" ? "red" : foundInvoice.status === "Partially Returned" ? "yellow" : "green"} /></div>
                </div>

                <h5 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700 }}>Select Quantities to Return / Exchange</h5>
                <Table 
                  columns={[
                    { key: "name", label: "Product Name" },
                    { key: "salePrice", label: "Price", render: (v, r) => `₹${v} (+${r.gst || 0}% GST)` },
                    { key: "qty", label: "Qty Bought", render: v => <Badge text={v} color="blue" /> },
                    { key: "name", label: "Return Qty", render: (name, r) => {
                        const currentVal = returnQtys[name] || 0;
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button 
                              onClick={() => setReturnQtys(prev => ({ ...prev, [name]: Math.max(0, currentVal - 1) }))}
                              style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", fontSize: 13, fontWeight: 700, display:"flex",alignItems:"center",justifyContent:"center" }}
                            >−</button>
                            <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{currentVal}</span>
                            <button 
                              onClick={() => setReturnQtys(prev => ({ ...prev, [name]: Math.min(r.qty, currentVal + 1) }))}
                              style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", fontSize: 13, fontWeight: 700, display:"flex",alignItems:"center",justifyContent:"center" }}
                            >+</button>
                          </div>
                        );
                      }
                    }
                  ]}
                  data={foundInvoice.cartItems || []}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: C.muted, border: "2px dashed #e2e8f0", borderRadius: 10 }}>
                <span style={{ fontSize: 24 }}>🧾</span>
                <div style={{ fontSize: 12.5, marginTop: 8 }}>Search an active invoice number to initiate a return or stock exchange.</div>
              </div>
            )}
          </Card>

          {/* Right Panel: Refund summary */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>💳 Refund Settlement</h4>
            {foundInvoice && calculatedRefund > 0 ? (
              <div>
                <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
                    <span style={{ color: C.muted }}>Taxable Item Value</span>
                    <strong>₹{(calculatedRefund / 1.05).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
                    <span style={{ color: C.muted }}>GST Tax Refund</span>
                    <strong>₹{(calculatedRefund - (calculatedRefund / 1.05)).toFixed(2)}</strong>
                  </div>
                  {foundInvoice.discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 6, color: C.danger }}>
                      <span>Less Discount ({foundInvoice.discount}%)</span>
                      <strong>−₹{(calculatedRefund * foundInvoice.discount / 100).toFixed(2)}</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: C.text, paddingTop: 6 }}>
                    <span>Estimated Refund</span>
                    <span style={{ color: C.accent }}>₹{(calculatedRefund * (1 - (foundInvoice.discount || 0) / 100)).toFixed(2)}</span>
                  </div>
                </div>

                <Select 
                  label="Refund Disbursement Mode" 
                  value={refundMode} 
                  onChange={setRefundMode} 
                  options={["Cash", "Store Credit", "UPI", "Original Payment Mode"]} 
                />

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <Btn variant="ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setFoundInvoice(null); setSearchInvoiceNum(""); }}>Cancel</Btn>
                  <Btn variant="danger" style={{ flex: 1.5, justifyContent: "center" }} onClick={processExchangeReturn}>Confirm Return</Btn>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 32, color: C.muted, fontSize: 12.5 }}>
                Select quantities on the left to calculate refund and complete settlement details.
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "held" && (
        <Card>
          <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>⏸ Held Bills ({heldBills.length})</h4>
          {heldBills.length === 0
            ? <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No bills on hold</div>
            : heldBills.map(b => (
              <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{b.cart.length} items</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" onClick={() => recallBill(b)}>Recall</Btn>
                  <Btn size="sm" variant="danger" onClick={() => setHeldBills(prev => prev.filter(x => x.id !== b.id))}>Delete</Btn>
                </div>
              </div>
            ))}
        </Card>
      )}

      {/* Checkout Confirmation Modal */}
      {showCheckout && (
        <Modal title="✅ Confirm Checkout" onClose={() => setShowCheckout(false)} width={400}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: C.muted }}>{cart.length} item(s) | Customer: <b>{customer || "Walk-in"}</b></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, margin: "10px 0" }}>₹{total.toFixed(2)}</div>
              <Badge text={payment} color="blue" />
              {payment === "Cash" && cashPaidNum >= total && <div style={{ color: C.success, fontWeight: 700, marginTop: 8 }}>Change: ₹{changeReturn.toFixed(2)}</div>}
              {payment === "Mixed" && <div style={{ color: splitRemaining <= 0 ? C.success : C.danger, fontWeight: 700, marginTop: 8 }}>{splitRemaining <= 0 ? "Split Payment OK ✓" : `Remaining ₹${splitRemaining.toFixed(2)}`}</div>}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn variant="ghost" onClick={() => setShowCheckout(false)}>Cancel</Btn>
              <Btn variant="success" size="lg" onClick={processBill}>✅ Confirm & Print</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Bill Detail View */}
      {billDetailView && (
        <InvoiceModal bill={billDetailView} onClose={() => setBillDetailView(null)} />
      )}

      {/* Post-checkout Invoice */}
      {showInvoice && (
        <InvoiceModal bill={showInvoice} onClose={() => setShowInvoice(null)} />
      )}

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [data] = useGlobalStore();
  const today = new Date().toLocaleDateString("en-IN");
  const todayBills = data.bills.filter(b => b.date === today || b.date === "16/1/2024" || b.date === "2024-01-16");
  const totalSales = data.bills.reduce((s, b) => s + b.total, 0);
  const lowStock = data.products.filter(p => p.stock < 10);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <StatCard label="Total Sales" value={`₹${totalSales.toLocaleString()}`} icon="💰" sub={`${data.bills.length} bills`} />
        <StatCard label="Products" value={data.products.length} icon="📦" sub={`${lowStock.length} low stock`} />
        <StatCard label="Customers" value={data.customers.length} icon="👥" />
        <StatCard label="Low Stock Alerts" value={lowStock.length} icon="⚠️" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700 }}>🚨 Alerts</h4>
          {lowStock.length === 0 ? <div style={{ color: C.success, fontSize: 13 }}>✅ All stocks healthy</div> :
            lowStock.map(p => <div key={p.id} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12.5 }}><span>🔴</span><span>{p.name} — Only {p.stock} left</span></div>)
          }
        </Card>
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700 }}>🏆 Top Products</h4>
          {data.products.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 12 }}>{i + 1}. {p.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.success }}>₹{p.salePrice * p.stock}</span>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700 }}>💳 Payment Breakdown</h4>
          {["Cash","UPI","Card","Mixed"].map(m => {
            const count = data.bills.filter(b => b.payment === m).length;
            const amt = data.bills.filter(b => b.payment === m).reduce((s, b) => s + b.total, 0);
            return count > 0 ? (
              <div key={m} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                <span>{m}</span><span style={{ fontWeight: 700 }}>₹{amt.toLocaleString()}</span>
              </div>
            ) : null;
          })}
        </Card>
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700 }}>🏢 Branches</h4>
          {data.branches.map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
              <span>{b.name}</span><span style={{ fontWeight: 700, color: C.success }}>₹{b.sales.toLocaleString()}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700 }}>📋 Recent Bills</h4>
          {data.bills.slice(0, 4).map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 11 }}>
              <span>{b.id}</span><span style={{ fontWeight: 700 }}>₹{b.total}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
function Products() {
  const [data, setData] = useGlobalStore();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("list");
  const [detailView, setDetailView] = useState(null);

  const [subModal, setSubModal] = useState(null);
  const [subForm, setSubForm] = useState({});

  const saveCategory = () => {
    if (!subForm.name) return;
    if (subModal === "add_category") {
      if (data.categories.includes(subForm.name)) { setToast("Category already exists!"); return; }
      setData(d => ({ ...d, categories: [...d.categories, subForm.name] }));
    } else {
      setData(d => ({
        ...d,
        categories: d.categories.map(c => c === subForm.oldName ? subForm.name : c),
        products: d.products.map(p => p.category === subForm.oldName ? { ...p, category: subForm.name } : p)
      }));
    }
    setSubModal(null); setToast("Category saved!");
  };

  const saveBrand = () => {
    if (!subForm.name) return;
    if (subModal === "add_brand") {
      if (data.brands.includes(subForm.name)) { setToast("Brand already exists!"); return; }
      setData(d => ({ ...d, brands: [...d.brands, subForm.name] }));
    } else {
      setData(d => ({
        ...d,
        brands: d.brands.map(b => b === subForm.oldName ? subForm.name : b),
        products: d.products.map(p => p.brand === subForm.oldName ? { ...p, brand: subForm.name } : p)
      }));
    }
    setSubModal(null); setToast("Brand saved!");
  };

  const saveHsn = () => {
    if (!subForm.code || subForm.gst === undefined) return;
    const newHsn = { code: subForm.code, description: subForm.description || "", gst: +subForm.gst };
    if (subModal === "add_hsn") {
      if (data.hsnCodes.some(h => h.code === subForm.code)) { setToast("HSN code already exists!"); return; }
      setData(d => ({ ...d, hsnCodes: [...d.hsnCodes, newHsn] }));
    } else {
      setData(d => ({
        ...d,
        hsnCodes: d.hsnCodes.map(h => h.code === subForm.oldCode ? newHsn : h),
        products: d.products.map(p => p.hsn === subForm.oldCode ? { ...p, hsn: subForm.code, gst: +subForm.gst } : p)
      }));
    }
    setSubModal(null); setToast("HSN code saved!");
  };

  const deleteCategory = (cat) => {
    const inUse = data.products.some(p => p.category === cat);
    if (inUse) { setToast("Cannot delete! Category is in use."); return; }
    setData(d => ({ ...d, categories: d.categories.filter(c => c !== cat) }));
    setToast("Category deleted!");
  };

  const deleteBrand = (brand) => {
    const inUse = data.products.some(p => p.brand === brand);
    if (inUse) { setToast("Cannot delete! Brand is in use."); return; }
    setData(d => ({ ...d, brands: d.brands.filter(b => b !== brand) }));
    setToast("Brand deleted!");
  };

  const deleteHsn = (code) => {
    const inUse = data.products.some(p => p.hsn === code);
    if (inUse) { setToast("Cannot delete! HSN code is in use."); return; }
    setData(d => ({ ...d, hsnCodes: d.hsnCodes.filter(h => h.code !== code) }));
    setToast("HSN code deleted!");
  };

  const cats = ["All", ...(data.categories || [])];
  const filtered = data.products.filter(p =>
    (catFilter === "All" || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const saveProduct = () => {
    if (!form.name || !form.sku) return;
    const prod = { ...form, mrp: +form.mrp, salePrice: +form.salePrice, purchasePrice: +form.purchasePrice, stock: +form.stock, gst: +form.gst };
    if (modal === "add") setData(d => ({ ...d, products: [...d.products, { ...prod, id: Date.now() }] }));
    else setData(d => ({ ...d, products: d.products.map(p => p.id === form.id ? prod : p) }));
    setModal(null); setToast(modal === "add" ? "Product added!" : "Product updated!");
  };

  const F = (k, label, type = "text") => <Input label={label} value={form[k] || ""} onChange={v => setForm(f => ({ ...f, [k]: v }))} type={type} required={["name","sku"].includes(k)} />;

  if (detailView) {
    const p = detailView;
    const totalSold = data.bills.reduce((s, b) => s + (b.cartItems?.filter(i => i.sku === p.sku).reduce((ss, i) => ss + i.qty, 0) || 0), 0);
    const revenue = data.bills.reduce((s, b) => s + (b.cartItems?.filter(i => i.sku === p.sku).reduce((ss, i) => ss + i.salePrice * i.qty, 0) || 0), 0);
    return (
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Btn variant="ghost" onClick={() => setDetailView(null)}>← Back</Btn>
          <Btn variant="outline" onClick={() => { setForm({ ...p }); setModal("edit"); }}>✏️ Edit</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <h3 style={{ margin: "0 0 14px" }}>{p.name}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["SKU", p.sku], ["Category", p.category], ["Brand", p.brand], ["Unit", p.unit], ["Rack", p.rack], ["HSN", p.hsn], ["Barcode", p.barcode], ["GST", `${p.gst}%`]].map(([k, v]) => (
                <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 11, color: C.muted }}>{k}</div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card>
              <h4 style={{ margin: "0 0 12px" }}>💰 Pricing</h4>
              {[["MRP", `₹${p.mrp}`], ["Sale Price", `₹${p.salePrice}`], ["Purchase Price", `₹${p.purchasePrice}`], ["Margin", `${Math.round((p.salePrice - p.purchasePrice) / p.purchasePrice * 100)}%`]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                  <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <h4 style={{ margin: "0 0 12px" }}>📊 Performance</h4>
              {[["Current Stock", p.stock], ["Total Sold", totalSold], ["Revenue", `₹${revenue.toLocaleString()}`], ["Status", p.status]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                  <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
        {modal && (
          <Modal title="Edit Product" onClose={() => setModal(null)} width={640}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              {F("name","Product Name")}{F("sku","SKU")}
              <Select label="Brand" value={form.brand||""} onChange={v => setForm(f=>({...f,brand:v}))} options={["", ...(data.brands || [])]} />
              {F("mrp","MRP","number")}{F("salePrice","Sale Price","number")}{F("purchasePrice","Purchase Price","number")}{F("stock","Stock","number")}
              <Select 
                label="HSN Code" 
                value={form.hsn || ""} 
                onChange={v => {
                  const matchingHsn = data.hsnCodes?.find(h => h.code === v);
                  setForm(f => ({
                    ...f,
                    hsn: v,
                    gst: matchingHsn ? matchingHsn.gst : f.gst
                  }));
                }} 
                options={["", ...(data.hsnCodes?.map(h => ({ value: h.code, label: `${h.code} — ${h.description} (${h.gst}%)` })) || [])]} 
              />
              {F("gst","GST%","number")}{F("barcode","Barcode")}{F("rack","Rack")}
              <Select label="Category" value={form.category||""} onChange={v => setForm(f=>({...f,category:v}))} options={["", ...(data.categories || [])]} />
              <Select label="Unit" value={form.unit||"Kg"} onChange={v => setForm(f=>({...f,unit:v}))} options={data.units || ["Kg","Litre","Pack","Bag","Tube","Box","Piece"]} />
              <Select label="Status" value={form.status||"Active"} onChange={v => setForm(f=>({...f,status:v}))} options={["Active","Inactive"]} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={saveProduct}>Save</Btn>
            </div>
          </Modal>
        )}
        <Toast msg={toast} onClose={() => setToast("")} />
      </div>
    );
  }

  return (
    <div>
      <Tabs tabs={[
        ["list","📋 Products"],
        ["barcode","🔖 Barcodes"],
        ["pricing","💰 Pricing"],
        ["categories","🏷️ Categories"],
        ["brands","💎 Brands"],
        ["hsn","📋 HSN Codes"]
      ]} active={tab} onChange={setTab} />

      {tab === "list" && <>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <SearchFilter value={search} onChange={setSearch} />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff" }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
            <div style={{ marginLeft: "auto" }}>
              <Btn onClick={() => { setForm({ name:"",sku:"",category:data.categories[0]||"",brand:data.brands[0]||"",mrp:"",salePrice:"",purchasePrice:"",stock:"",gst:"5",hsn:"",unit:"Kg",barcode:"",rack:"",status:"Active" }); setModal("add"); }}>+ Add Product</Btn>
            </div>
          </div>
        </Card>
        <Card>
          <Table
            columns={[
              { key: "sku", label: "SKU" },
              { key: "name", label: "Product Name" },
              { key: "category", label: "Category" },
              { key: "mrp", label: "MRP", render: v => `₹${v}` },
              { key: "salePrice", label: "Sale Price", render: v => `₹${v}` },
              { key: "stock", label: "Stock", render: v => <Badge text={v} color={v < 10 ? "red" : v < 30 ? "yellow" : "green"} /> },
              { key: "gst", label: "GST", render: v => `${v}%` },
              { key: "status", label: "Status", render: v => <Badge text={v} color={v === "Active" ? "green" : "red"} /> },
            ]}
            data={filtered}
            onAction={(a, r) => {
              if (a === "view") setDetailView(r);
              if (a === "edit") { setForm({ ...r }); setModal("edit"); }
              if (a === "delete") { setData(d => ({ ...d, products: d.products.filter(x => x.id !== r.id) })); setToast("Deleted!"); }
            }}
          />
        </Card>
      </>}
      {tab === "pricing" && (
        <Card>
          <Table columns={[
            { key: "name", label: "Product" },
            { key: "purchasePrice", label: "Purchase", render: v => `₹${v}` },
            { key: "mrp", label: "MRP", render: v => `₹${v}` },
            { key: "salePrice", label: "Sale", render: v => `₹${v}` },
            { key: "gst", label: "GST%", render: v => `${v}%` },
            { key: "salePrice", label: "Margin", render: (v, r) => <span style={{ color: C.success, fontWeight: 700 }}>{Math.round((r.salePrice - r.purchasePrice) / r.purchasePrice * 100)}%</span> },
          ]} data={data.products} />
        </Card>
      )}
      {tab === "barcode" && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {data.products.map(p => (
              <div key={p.id} style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted }}>{p.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 3, margin: "8px 0", color: C.text }}>||||||||||||</div>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>{p.barcode || p.sku}</div>
                <Btn size="sm" variant="outline">🖨 Print</Btn>
              </div>
            ))}
          </div>
        </Card>
      )}
      {tab === "categories" && (
        <>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🏷️ Manage Categories</div>
              <Btn onClick={() => { setSubForm({ name: "" }); setSubModal("add_category"); }}>+ Add Category</Btn>
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {(data.categories || []).map(cat => {
              const productCount = data.products.filter(p => p.category === cat).length;
              return (
                <Card key={cat} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{cat}</span>
                      <Badge text={`${productCount} Products`} color="blue" />
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>System registered product category for stocking and sales tracking.</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                    <Btn size="sm" variant="ghost" onClick={() => { setSubForm({ name: cat, oldName: cat }); setSubModal("edit_category"); }}>✏️ Edit</Btn>
                    <Btn size="sm" variant="ghost" style={{ color: C.danger }} onClick={() => deleteCategory(cat)}>🗑 Delete</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
      {tab === "brands" && (
        <>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>💎 Manage Brands</div>
              <Btn onClick={() => { setSubForm({ name: "" }); setSubModal("add_brand"); }}>+ Add Brand</Btn>
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {(data.brands || []).map(brand => {
              const productCount = data.products.filter(p => p.brand === brand).length;
              return (
                <Card key={brand} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{brand}</span>
                      <Badge text={`${productCount} Products`} color="purple" />
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Stock partner brand and supplier identification details.</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                    <Btn size="sm" variant="ghost" onClick={() => { setSubForm({ name: brand, oldName: brand }); setSubModal("edit_brand"); }}>✏️ Edit</Btn>
                    <Btn size="sm" variant="ghost" style={{ color: C.danger }} onClick={() => deleteBrand(brand)}>🗑 Delete</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
      {tab === "hsn" && (
        <>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>📋 Manage HSN Codes & GST Rates</div>
              <Btn onClick={() => { setSubForm({ code: "", description: "", gst: 5 }); setSubModal("add_hsn"); }}>+ Add HSN Code</Btn>
            </div>
          </Card>
          <Card>
            <Table
              columns={[
                { key: "code", label: "HSN Code", render: v => <span style={{ fontWeight: 700, color: C.accent }}>{v}</span> },
                { key: "description", label: "Description" },
                { key: "gst", label: "GST Rate %", render: v => <Badge text={`${v}%`} color={v > 12 ? "red" : v > 5 ? "yellow" : "green"} /> },
                { key: "code", label: "Products Linked", render: (v, r) => data.products.filter(p => p.hsn === v).length },
              ]}
              data={data.hsnCodes || []}
              onAction={(a, r) => {
                if (a === "edit") {
                  setSubForm({ ...r, oldCode: r.code });
                  setSubModal("edit_hsn");
                }
                if (a === "delete") {
                  deleteHsn(r.code);
                }
              }}
            />
          </Card>
        </>
      )}

      {modal && (
        <Modal title={modal === "add" ? "Add Product" : "Edit Product"} onClose={() => setModal(null)} width={640}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            {F("name","Product Name")}{F("sku","SKU")}
            <Select label="Brand" value={form.brand||""} onChange={v => setForm(f=>({...f,brand:v}))} options={["", ...(data.brands || [])]} />
            {F("mrp","MRP","number")}{F("salePrice","Sale Price","number")}{F("purchasePrice","Purchase Price","number")}{F("stock","Stock","number")}
            <Select 
              label="HSN Code" 
              value={form.hsn || ""} 
              onChange={v => {
                const matchingHsn = data.hsnCodes?.find(h => h.code === v);
                setForm(f => ({
                  ...f,
                  hsn: v,
                  gst: matchingHsn ? matchingHsn.gst : f.gst
                }));
              }} 
              options={["", ...(data.hsnCodes?.map(h => ({ value: h.code, label: `${h.code} — ${h.description} (${h.gst}%)` })) || [])]} 
            />
            {F("gst","GST%","number")}{F("barcode","Barcode")}{F("rack","Rack")}
            <Select label="Category" value={form.category||""} onChange={v => setForm(f=>({...f,category:v}))} options={["", ...(data.categories || [])]} />
            <Select label="Unit" value={form.unit||"Kg"} onChange={v => setForm(f=>({...f,unit:v}))} options={data.units || ["Kg","Litre","Pack","Bag","Tube","Box","Piece"]} />
            <Select label="Status" value={form.status||"Active"} onChange={v => setForm(f=>({...f,status:v}))} options={["Active","Inactive"]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={saveProduct}>{modal === "add" ? "Add Product" : "Save"}</Btn>
          </div>
        </Modal>
      )}

      {/* Category Sub-Modal */}
      {(subModal === "add_category" || subModal === "edit_category") && (
        <Modal title={subModal === "add_category" ? "Add Category" : "Edit Category"} onClose={() => setSubModal(null)} width={400}>
          <Input label="Category Name" value={subForm.name || ""} onChange={v => setSubForm(f => ({ ...f, name: v }))} required />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setSubModal(null)}>Cancel</Btn>
            <Btn onClick={saveCategory}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* Brand Sub-Modal */}
      {(subModal === "add_brand" || subModal === "edit_brand") && (
        <Modal title={subModal === "add_brand" ? "Add Brand" : "Edit Brand"} onClose={() => setSubModal(null)} width={400}>
          <Input label="Brand Name" value={subForm.name || ""} onChange={v => setSubForm(f => ({ ...f, name: v }))} required />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setSubModal(null)}>Cancel</Btn>
            <Btn onClick={saveBrand}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* HSN Code Sub-Modal */}
      {(subModal === "add_hsn" || subModal === "edit_hsn") && (
        <Modal title={subModal === "add_hsn" ? "Add HSN Code" : "Edit HSN Code"} onClose={() => setSubModal(null)} width={460}>
          <Input label="HSN Code" value={subForm.code || ""} onChange={v => setSubForm(f => ({ ...f, code: v }))} required />
          <Input label="Description" value={subForm.description || ""} onChange={v => setSubForm(f => ({ ...f, description: v }))} />
          <Select 
            label="Default GST Rate %" 
            value={subForm.gst === undefined ? 5 : subForm.gst} 
            onChange={v => setSubForm(f => ({ ...f, gst: +v }))} 
            options={[0, 5, 12, 18, 28]} 
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setSubModal(null)}>Cancel</Btn>
            <Btn onClick={saveHsn}>Save</Btn>
          </div>
        </Modal>
      )}

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────
function Inventory() {
  const [data, setData] = useGlobalStore();
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState("");
  const [transferForm, setTransferForm] = useState({ from: "KC Main Store", to: "KC Lawrence Road", product: "", qty: "" });
  const [adjForm, setAdjForm] = useState({ product: "", type: "Damage", qty: "", reason: "" });
  const [transferCart, setTransferCart] = useState([]);
  const [adjCart, setAdjCart] = useState([]);
  const [selectedReorders, setSelectedReorders] = useState({});
  const [reorderQtys, setReorderQtys] = useState({});
  const [reorderSupplier, setReorderSupplier] = useState("");

  // Expiry & Damage + Units States
  const [expiryForm, setExpiryForm] = useState({ product: "", qty: "", type: "Expired", reason: "", actionTaken: "Written Off & Disposed" });
  const [unitForm, setUnitForm] = useState({ name: "" });
  const [editingUnit, setEditingUnit] = useState(null);

  const recordExpiryDamage = () => {
    if (!expiryForm.product || !expiryForm.qty) { setToast("Please fill out product and quantity!"); return; }
    const productObj = data.products.find(p => p.name === expiryForm.product);
    if (!productObj) return;

    if (productObj.stock < +expiryForm.qty) {
      setToast(`Insufficient stock! Only ${productObj.stock} left.`);
      return;
    }

    const logEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      productName: expiryForm.product,
      qty: +expiryForm.qty,
      type: expiryForm.type,
      reason: expiryForm.reason || "Standard wastage write-off",
      actionTaken: expiryForm.actionTaken
    };

    setData(d => ({
      ...d,
      expiryDamageLogs: [logEntry, ...(d.expiryDamageLogs || [])],
      products: d.products.map(p => p.name === expiryForm.product ? { ...p, stock: p.stock - +expiryForm.qty } : p)
    }));

    setToast("Wastage logged successfully!");
    setExpiryForm({ product: "", qty: "", type: "Expired", reason: "", actionTaken: "Written Off & Disposed" });
  };

  const saveUnit = () => {
    if (!unitForm.name.trim()) return;
    const unitName = unitForm.name.trim();

    if (editingUnit) {
      setData(d => ({
        ...d,
        units: d.units.map(u => u === editingUnit ? unitName : u),
        products: d.products.map(p => p.unit === editingUnit ? { ...p, unit: unitName } : p)
      }));
      setToast("Packaging unit updated!");
      setEditingUnit(null);
    } else {
      if (data.units?.includes(unitName)) { setToast("Unit already exists!"); return; }
      setData(d => ({
        ...d,
        units: [...(d.units || []), unitName]
      }));
      setToast("Packaging unit added!");
    }
    setUnitForm({ name: "" });
  };

  const deleteUnit = (unit) => {
    const isUsed = data.products.some(p => p.unit === unit);
    if (isUsed) {
      setToast("Cannot delete! Unit is linked to active products.");
      return;
    }
    setData(d => ({
      ...d,
      units: d.units.filter(u => u !== unit)
    }));
    setToast("Unit deleted successfully!");
  };

  const addToTransferCart = () => {
    if (!transferForm.product || !transferForm.qty) {
      setToast("Please select product and quantity!");
      return;
    }
    const productObj = data.products.find(p => p.name === transferForm.product);
    if (!productObj) return;

    if (productObj.stock < +transferForm.qty) {
      setToast(`Insufficient stock! Only ${productObj.stock} left.`);
      return;
    }

    const existingIndex = transferCart.findIndex(item => item.product === transferForm.product);
    if (existingIndex > -1) {
      const newQty = transferCart[existingIndex].qty + +transferForm.qty;
      if (productObj.stock < newQty) {
        setToast(`Insufficient stock! Total in cart (${newQty}) exceeds stock.`);
        return;
      }
      const newCart = [...transferCart];
      newCart[existingIndex].qty = newQty;
      setTransferCart(newCart);
    } else {
      setTransferCart([...transferCart, { product: transferForm.product, qty: +transferForm.qty, sku: productObj.sku, unit: productObj.unit || "Unit" }]);
    }
    setTransferForm(f => ({ ...f, product: "", qty: "" }));
    setToast("Product added to transfer list!");
  };

  const initiateTransfer = () => {
    if (transferCart.length === 0) {
      setToast("Transfer list is empty!");
      return;
    }

    setData(d => {
      const updatedProducts = d.products.map(p => {
        const cartItem = transferCart.find(item => item.product === p.name);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      });
      return { ...d, products: updatedProducts };
    });

    setToast(`Bulk transfer of ${transferCart.length} item(s) completed!`);
    setTransferCart([]);
  };

  const addToAdjCart = () => {
    if (!adjForm.product || !adjForm.qty) {
      setToast("Please select product and quantity!");
      return;
    }
    const productObj = data.products.find(p => p.name === adjForm.product);
    if (!productObj) return;

    if (["Damage", "Wastage", "Shortage", "Theft"].includes(adjForm.type) && productObj.stock < +adjForm.qty) {
      setToast(`Insufficient stock for write-off! Only ${productObj.stock} left.`);
      return;
    }

    const existingIndex = adjCart.findIndex(item => item.product === adjForm.product && item.type === adjForm.type);
    if (existingIndex > -1) {
      const newCart = [...adjCart];
      newCart[existingIndex].qty += +adjForm.qty;
      setAdjCart(newCart);
    } else {
      setAdjCart([...adjCart, { product: adjForm.product, type: adjForm.type, qty: +adjForm.qty, reason: adjForm.reason || "Stock Audit correction" }]);
    }
    setAdjForm(f => ({ ...f, product: "", qty: "", reason: "" }));
    setToast("Adjustment added to list!");
  };

  const recordBulkAdjustments = () => {
    if (adjCart.length === 0) {
      setToast("Adjustment list is empty!");
      return;
    }

    setData(d => {
      const updatedProducts = d.products.map(p => {
        const items = adjCart.filter(item => item.product === p.name);
        if (items.length > 0) {
          let finalStock = p.stock;
          items.forEach(item => {
            if (["Damage", "Wastage", "Shortage", "Theft"].includes(item.type)) {
              finalStock = Math.max(0, finalStock - item.qty);
            } else if (item.type === "Excess") {
              finalStock = finalStock + item.qty;
            }
          });
          return { ...p, stock: finalStock };
        }
        return p;
      });
      return { ...d, products: updatedProducts };
    });

    setToast(`Successfully updated stock for ${adjCart.length} adjustments!`);
    setAdjCart([]);
  };

  const generateBulkPO = () => {
    const checkedProducts = lowStock.filter(p => selectedReorders[p.id]);
    if (checkedProducts.length === 0) {
      setToast("Please select at least one product to reorder!");
      return;
    }
    if (!reorderSupplier) {
      setToast("Please select a Supplier for the Purchase Order!");
      return;
    }

    let totalAmount = 0;
    checkedProducts.forEach(p => {
      const qty = reorderQtys[p.id] || (50 - p.stock);
      totalAmount += qty * p.purchasePrice;
    });

    const newPo = {
      id: `PO-${Date.now()}`,
      supplier: reorderSupplier,
      date: new Date().toLocaleDateString("en-IN"),
      items: checkedProducts.length,
      amount: totalAmount,
      status: "Pending"
    };

    setData(d => ({
      ...d,
      purchaseOrders: [newPo, ...(d.purchaseOrders || [])]
    }));

    setToast(`Bulk PO generated successfully for ${checkedProducts.length} items from ${reorderSupplier}!`);
    setSelectedReorders({});
    setReorderSupplier("");
  };

  const toggleSelectReorder = (id) => {
    setSelectedReorders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReorderQtyChange = (id, val) => {
    setReorderQtys(prev => ({ ...prev, [id]: Math.max(1, +val) }));
  };

  const toggleSelectAll = () => {
    const allSelected = lowStock.length > 0 && lowStock.every(p => selectedReorders[p.id]);
    if (allSelected) {
      setSelectedReorders({});
    } else {
      const next = {};
      lowStock.forEach(p => {
        next[p.id] = true;
      });
      setSelectedReorders(next);
    }
  };

  const lowStock = data.products.filter(p => p.stock < 10);

  return (
    <div>
      <Tabs tabs={[
        ["overview","📊 Overview"],
        ["transfer","🔄 Transfer"],
        ["adjustment","⚠️ Adjustments"],
        ["expiry_damage","💔 Expired & Damaged"],
        ["units","⚖️ Units"],
        ["reorder","🔔 Reorder"],
        ["audit","🔍 Audit"]
      ]} active={tab} onChange={setTab} />
      {tab === "overview" && <>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <StatCard label="Total Products" value={data.products.length} icon="📦" />
          <StatCard label="Stock Value" value={`₹${data.products.reduce((s,p)=>s+p.salePrice*p.stock,0).toLocaleString()}`} icon="💰" />
          <StatCard label="Low Stock" value={lowStock.length} icon="⚠️" />
        </div>
        <Card>
          <Table columns={[
            { key: "name", label: "Product" }, { key: "category", label: "Category" }, { key: "rack", label: "Rack" },
            { key: "stock", label: "Stock", render: (v, r) => <div style={{ display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 50, height: 6, background: "#e2e8f0", borderRadius: 99 }}><div style={{ height: "100%", width: `${Math.min(100, v * 100 / 200)}%`, background: v < 10 ? C.danger : C.success, borderRadius: 99 }} /></div><span style={{ fontSize: 12, fontWeight: 700, color: v < 10 ? C.danger : C.text }}>{v}</span></div> },
            { key: "unit", label: "Unit" },
            { key: "salePrice", label: "Stock Value", render: (v, r) => `₹${(v * r.stock).toLocaleString()}` },
          ]} data={data.products} />
        </Card>
      </>}
      {tab === "transfer" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <h4 style={{ margin: "0 0 14px" }}>🔄 New Bulk Stock Transfer</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Select label="From Outlet" value={transferForm.from} onChange={v => setTransferForm(f=>({...f,from:v}))} options={["KC Main Store","KC Lawrence Road","Central Warehouse"]} />
              <Select label="To Outlet" value={transferForm.to} onChange={v => setTransferForm(f=>({...f,to:v}))} options={["KC Main Store","KC Lawrence Road","Central Warehouse"]} />
            </div>
            
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", marginTop: 10, marginBottom: 14 }}>
              <h5 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.text }}>Add Product to Cart</h5>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 10 }}>
                <Select label="Select Product" value={transferForm.product} onChange={v => setTransferForm(f=>({...f,product:v}))} options={["", ...data.products.map(p=>p.name)]} />
                <Input label="Quantity" value={transferForm.qty} onChange={v => setTransferForm(f=>({...f,qty:v}))} type="number" />
              </div>
              <Btn size="sm" style={{ marginTop: 10, width: "100%" }} onClick={addToTransferCart}>➕ Add to Transfer List</Btn>
            </div>

            {transferCart.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <h5 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700 }}>Items to Transfer ({transferCart.length})</h5>
                <Table 
                  columns={[
                    { key: "product", label: "Product" },
                    { key: "qty", label: "Qty", render: (v, r) => <b>{v} {r.unit}s</b> },
                    { key: "product", label: "Action", render: v => (
                        <Btn size="xs" variant="ghost" style={{ color: C.danger }} onClick={() => setTransferCart(transferCart.filter(item => item.product !== v))}>❌</Btn>
                      )
                    }
                  ]}
                  data={transferCart}
                />
                <Btn variant="accent" style={{ marginTop: 12, width: "100%" }} onClick={initiateTransfer}>🔄 Initiate Bulk Transfer</Btn>
              </div>
            )}
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 14px" }}>📜 Transfer History</h4>
            {[["KC Main → Lawrence","Basmati Rice","20 Bags","Completed"],["Warehouse → Main","Sunflower Oil","50 L","In Transit"]].map(([f,p,q,s],i)=>(
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{p} — {q}</div><div style={{ fontSize: 11, color: C.muted }}>{f}</div></div>
                  <Badge text={s} color={s === "Completed" ? "green" : "yellow"} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
      {tab === "adjustment" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <h4 style={{ margin: "0 0 14px" }}>⚠️ Bulk Stock Adjustment</h4>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 14 }}>
              <h5 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.text }}>Add Stock Adjustment</h5>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
                <Select label="Adjustment Type" value={adjForm.type} onChange={v => setAdjForm(f=>({...f,type:v}))} options={["Damage","Wastage","Shortage","Excess","Theft"]} />
                <Select label="Select Product" value={adjForm.product} onChange={v => setAdjForm(f=>({...f,product:v}))} options={["", ...data.products.map(p=>p.name)]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 10, marginTop: 8 }}>
                <Input label="Adjustment Qty" value={adjForm.qty} onChange={v => setAdjForm(f=>({...f,qty:v}))} type="number" />
                <Input label="Reason / Notes" value={adjForm.reason} onChange={v => setAdjForm(f=>({...f,reason:v}))} placeholder="e.g. Audit variance" />
              </div>
              <Btn size="sm" variant="warning" style={{ marginTop: 10, width: "100%" }} onClick={addToAdjCart}>➕ Add to Adjustment List</Btn>
            </div>

            {adjCart.length > 0 && (
              <div>
                <h5 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700 }}>Adjustments Queue ({adjCart.length})</h5>
                <Table 
                  columns={[
                    { key: "product", label: "Product" },
                    { key: "type", label: "Type", render: v => <Badge text={v} color={["Damage","Theft","Wastage","Shortage"].includes(v) ? "red" : "green"} /> },
                    { key: "qty", label: "Qty", render: v => <b>{v}</b> },
                    { key: "reason", label: "Reason" },
                    { key: "product", label: "Action", render: v => (
                        <Btn size="xs" variant="ghost" style={{ color: C.danger }} onClick={() => setAdjCart(adjCart.filter(item => item.product !== v))}>❌</Btn>
                      )
                    }
                  ]}
                  data={adjCart}
                />
                <Btn variant="warning" style={{ marginTop: 12, width: "100%" }} onClick={recordBulkAdjustments}>⚠️ Commit Bulk Adjustments</Btn>
              </div>
            )}
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 14px" }}>📋 Current Stock Status (Low Stock)</h4>
            {lowStock.map(p => <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 12 }}>{p.name}</span><Badge text={`${p.stock} left`} color="red" />
            </div>)}
          </Card>
        </div>
      )}

      {tab === "expiry_damage" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 14 }}>
          {/* Left panel: Log wastage form */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>💔 Record Expired or Damaged Goods</h4>
            <Select label="Select Product" value={expiryForm.product} onChange={v => setExpiryForm(f=>({...f,product:v}))} options={["", ...data.products.map(p=>p.name)]} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Wastage Qty" value={expiryForm.qty} onChange={v => setExpiryForm(f=>({...f,qty:v}))} type="number" placeholder="e.g. 5" />
              <Select label="Wastage Type" value={expiryForm.type} onChange={v => setExpiryForm(f=>({...f,type:v}))} options={["Expired", "Damaged", "Leakage", "Theft", "Defective"]} />
            </div>
            <Select label="Action Taken" value={expiryForm.actionTaken} onChange={v => setExpiryForm(f=>({...f,actionTaken:v}))} options={["Written Off & Disposed", "Returned to Supplier", "Damaged Stock Room", "Scrapped"]} />
            <Input label="Reason / Notes" value={expiryForm.reason} onChange={v => setExpiryForm(f=>({...f,reason:v}))} placeholder="e.g. Best before date exceeded" />
            <Btn variant="danger" style={{ marginTop: 12 }} onClick={recordExpiryDamage}>Record Stock Loss</Btn>
          </Card>

          {/* Right panel: History log */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>📋 Expiry & Damage Write-off Log</h4>
            <Table 
              columns={[
                { key: "date", label: "Date" },
                { key: "productName", label: "Product Name" },
                { key: "qty", label: "Qty", render: (v, r) => <strong style={{ color: C.danger }}>{v}</strong> },
                { key: "type", label: "Type", render: v => <Badge text={v} color={v === "Expired" ? "red" : "yellow"} /> },
                { key: "reason", label: "Notes" },
                { key: "actionTaken", label: "Action Taken" },
              ]}
              data={data.expiryDamageLogs || []}
            />
          </Card>
        </div>
      )}

      {tab === "units" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 14 }}>
          {/* Left panel: Add/Edit Unit */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>{editingUnit ? "✏️ Edit Packaging Unit" : "⚖️ Register Packaging Unit"}</h4>
            <Input label="Unit Name" value={unitForm.name} onChange={v => setUnitForm(f=>({...f,name:v}))} placeholder="e.g. Dozen, Bundle, Gram" />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {editingUnit && <Btn variant="ghost" onClick={() => { setEditingUnit(null); setUnitForm({ name: "" }); }}>Cancel</Btn>}
              <Btn onClick={saveUnit}>{editingUnit ? "Update Unit" : "Save Packaging Unit"}</Btn>
            </div>
          </Card>

          {/* Right panel: Units directory */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700 }}>📋 Packaging Units List</h4>
            <Table 
              columns={[
                { key: "name", label: "Packaging Unit", render: v => <strong>{v}</strong> },
                { key: "name", label: "Products Configured", render: v => data.products.filter(p => p.unit === v).length },
                { key: "name", label: "Actions", render: v => (
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="ghost" onClick={() => { setEditingUnit(v); setUnitForm({ name: v }); }}>✏️ Edit</Btn>
                      <Btn size="sm" variant="ghost" style={{ color: C.danger }} onClick={() => deleteUnit(v)}>🗑 Delete</Btn>
                    </div>
                  ) 
                }
              ]}
              data={(data.units || []).map(u => ({ name: u }))}
            />
          </Card>
        </div>
      )}

      {tab === "reorder" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>🔔 Reorder Alerts (Consolidated Purchase Orders)</h4>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, background: "#f8fafc", padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <div style={{ flex: 1 }}>
              <Select label="Select Target Supplier" value={reorderSupplier} onChange={v => setReorderSupplier(v)} options={["", ...data.suppliers.map(s => s.name)]} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>ESTIMATED TOTAL</span>
              <strong style={{ fontSize: 16, color: C.accent }}>
                ₹{lowStock.filter(p => selectedReorders[p.id]).reduce((sum, p) => sum + (reorderQtys[p.id] !== undefined ? reorderQtys[p.id] : (50 - p.stock)) * p.purchasePrice, 0).toLocaleString()}
              </strong>
            </div>
            <div>
              <Btn onClick={generateBulkPO} disabled={!reorderSupplier} variant="accent">
                📋 Generate PO for Selected ({lowStock.filter(p => selectedReorders[p.id]).length})
              </Btn>
            </div>
          </div>

          <Table 
            columns={[
              { 
                key: "id", 
                label: (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input 
                      type="checkbox" 
                      checked={lowStock.length > 0 && lowStock.every(p => selectedReorders[p.id])} 
                      onChange={toggleSelectAll} 
                    />
                    <span>All</span>
                  </div>
                ),
                render: (v, r) => (
                  <input 
                    type="checkbox" 
                    checked={!!selectedReorders[r.id]} 
                    onChange={() => toggleSelectReorder(r.id)} 
                  />
                )
              },
              { key: "name", label: "Product Name" },
              { key: "stock", label: "Current Stock", render: v => <span style={{ color: v < 10 ? C.danger : C.text, fontWeight: 700 }}>{v}</span> },
              { key: "unit", label: "Unit" },
              { key: "purchasePrice", label: "Unit Cost", render: v => `₹${v}` },
              { 
                key: "stock", 
                label: "Reorder Qty", 
                render: (v, r) => (
                  <input 
                    type="number" 
                    value={reorderQtys[r.id] !== undefined ? reorderQtys[r.id] : (50 - v)} 
                    onChange={e => handleReorderQtyChange(r.id, e.target.value)} 
                    style={{ width: 70, padding: "5px 8px", border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} 
                  />
                ) 
              },
              {
                key: "stock",
                label: "Estimated Cost",
                render: (v, r) => {
                  const qty = reorderQtys[r.id] !== undefined ? reorderQtys[r.id] : (50 - v);
                  return <b>₹{(qty * r.purchasePrice).toLocaleString()}</b>;
                }
              }
            ]} 
            data={lowStock} 
          />
        </Card>
      )}
      {tab === "audit" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>🔍 Physical Stock Audit</h4>
          <Table columns={[
            { key: "name", label: "Product" },
            { key: "stock", label: "System Stock" },
            { key: "stock", label: "Physical Count", render: v => <input type="number" defaultValue={v} style={{ width: 70, padding: "4px 8px", border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: 12 }} /> },
            { key: "stock", label: "Variance", render: () => <Badge text="0" color="green" /> },
          ]} data={data.products.slice(0, 6)} />
          <div style={{ marginTop: 12 }}><Btn onClick={() => setToast("Audit submitted!")}>Submit Audit</Btn></div>
        </Card>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Purchases ────────────────────────────────────────────────────────────────
function Purchases() {
  const [data, setData] = useGlobalStore();
  const [tab, setTab] = useState("po");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [poForm, setPoForm] = useState({ supplier: "", product: "", qty: "", rate: "", notes: "" });

  return (
    <div>
      <Tabs tabs={[["po","📋 Purchase Orders"],["grn","📦 GRN / Challan"],["invoice","🧾 Invoices"],["returns","↩️ Returns"],["payment","💳 Payments"]]} active={tab} onChange={setTab} />
      {tab === "po" && <>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Btn onClick={() => setModal("po")}>+ Create PO</Btn>
        </div>
        <Card>
          <Table
            columns={[
              { key: "id", label: "PO No" }, { key: "supplier", label: "Supplier" }, { key: "date", label: "Date" },
              { key: "items", label: "Items" }, { key: "amount", label: "Amount", render: v => `₹${v.toLocaleString()}` },
              { key: "status", label: "Status", render: v => <Badge text={v} color={v==="Approved"?"blue":v==="Received"?"green":"yellow"} /> },
            ]}
            data={data.purchaseOrders}
            onAction={(a, r) => {
              if (a === "edit") {
                setData(d => ({ ...d, purchaseOrders: d.purchaseOrders.map(p => p.id === r.id ? { ...p, status: "Approved" } : p) }));
                setToast("PO Approved!");
              }
            }}
          />
        </Card>
      </>}
      {tab === "grn" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📦 Goods Receipt Note</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Select label="Select PO" value="" onChange={() => {}} options={["", ...data.purchaseOrders.map(p=>p.id)]} />
              <Select label="Supplier" value="" onChange={() => {}} options={["", ...data.suppliers.map(s=>s.name)]} />
              <Input label="Challan Number" value="" onChange={() => {}} />
              <Input label="Challan Date" value="" onChange={() => {}} type="date" />
            </div>
            <div>
              <Input label="Vehicle No" value="" onChange={() => {}} />
              <Input label="Driver Name" value="" onChange={() => {}} />
              <Input label="Remarks" value="" onChange={() => {}} />
              <Btn onClick={() => setToast("GRN saved!")}>Save GRN</Btn>
            </div>
          </div>
        </Card>
      )}
      {tab === "invoice" && (
        <Card>
          <Table columns={[
            { key: "id", label: "Invoice #" }, { key: "supplier", label: "Supplier" }, { key: "date", label: "Date" },
            { key: "amount", label: "Amount", render: v => `₹${v.toLocaleString()}` },
            { key: "status", label: "GST Status", render: v => <Badge text={v==="Received"?"Filed":"Pending"} color={v==="Received"?"green":"yellow"} /> },
          ]} data={data.purchaseOrders} />
        </Card>
      )}
      {tab === "returns" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>↩️ Purchase Returns</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Select label="Supplier" value="" onChange={() => {}} options={["", ...data.suppliers.map(s=>s.name)]} />
              <Select label="Reason" value="" onChange={() => {}} options={["Damaged","Wrong Product","Quality Issue","Expired"]} />
              <Input label="Invoice #" value="" onChange={() => {}} />
              <Input label="Qty" value="" onChange={() => {}} type="number" />
              <Btn variant="warning" onClick={() => setToast("Return + Debit Note created!")}>Create Return</Btn>
            </div>
            <div>
              <h5 style={{ margin: "0 0 10px", fontSize: 13, color: C.muted }}>Recent Returns</h5>
              {[["DN-001","Agro Foods","₹2,400","Damage"],["DN-002","Metro Wholesale","₹8,000","Wrong Product"]].map(([id,sup,amt,r])=>(
                <div key={id} style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><div style={{ fontSize: 12, fontWeight: 600 }}>{id} — {sup}</div><div style={{ fontSize: 11, color: C.muted }}>{r}</div></div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.danger }}>{amt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      {tab === "payment" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>💳 Supplier Payment</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Select label="Supplier" value="" onChange={() => {}} options={["", ...data.suppliers.map(s=>s.name)]} />
              <Input label="Amount (₹)" value="" onChange={() => {}} type="number" />
              <Select label="Mode" value="" onChange={() => {}} options={["Cash","Bank Transfer","Cheque","UPI"]} />
              <Input label="Reference No" value="" onChange={() => {}} />
              <Btn onClick={() => setToast("Payment recorded!")}>Record Payment</Btn>
            </div>
            <div>
              <h5 style={{ margin: "0 0 10px", fontSize: 13, color: C.muted }}>Outstanding</h5>
              {data.suppliers.map(s => <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div><div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 11, color: C.muted }}>{s.creditDays} days</div></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.danger }}>₹{s.outstanding.toLocaleString()}</span>
              </div>)}
            </div>
          </div>
        </Card>
      )}
      {modal === "po" && (
        <Modal title="Create Purchase Order" onClose={() => setModal(null)}>
          <Select label="Supplier" value={poForm.supplier} onChange={v => setPoForm(f=>({...f,supplier:v}))} options={["", ...data.suppliers.map(s=>s.name)]} />
          <Select label="Product" value={poForm.product} onChange={v => setPoForm(f=>({...f,product:v}))} options={["", ...data.products.map(p=>p.name)]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Qty" value={poForm.qty} onChange={v => setPoForm(f=>({...f,qty:v}))} type="number" />
            <Input label="Rate ₹" value={poForm.rate} onChange={v => setPoForm(f=>({...f,rate:v}))} type="number" />
          </div>
          <Input label="Notes" value={poForm.notes} onChange={v => setPoForm(f=>({...f,notes:v}))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => {
              if (!poForm.supplier || !poForm.product) return;
              const po = { id: `PO-${Date.now()}`, supplier: poForm.supplier, date: new Date().toLocaleDateString("en-IN"), items: 1, amount: +poForm.qty * +poForm.rate || 0, status: "Pending" };
              setData(d => ({ ...d, purchaseOrders: [po, ...d.purchaseOrders] }));
              setModal(null); setToast("PO Created!");
            }}>Create PO</Btn>
          </div>
        </Modal>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Customers ────────────────────────────────────────────────────────────────
function Customers() {
  const [data, setData] = useGlobalStore();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("list");
  const [detailView, setDetailView] = useState(null);

  const filtered = data.customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const save = () => {
    if (!form.name || !form.phone) return;
    if (modal === "add") setData(d => ({ ...d, customers: [...d.customers, { ...form, id: Date.now(), loyaltyPoints: +form.loyaltyPoints || 0, creditLimit: +form.creditLimit || 3000, outstanding: 0 }] }));
    else setData(d => ({ ...d, customers: d.customers.map(c => c.id === form.id ? { ...form } : c) }));
    setModal(null); setToast(modal === "add" ? "Customer added!" : "Updated!");
  };

  if (detailView) {
    const c = detailView;
    const custBills = data.bills.filter(b => b.customer === c.name);
    const totalSpend = custBills.reduce((s, b) => s + b.total, 0);
    return (
      <div>
        <Btn variant="ghost" onClick={() => setDetailView(null)} style={{ marginBottom: 14 }}>← Back</Btn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <Card>
            <h3 style={{ margin: "0 0 14px" }}>👤 {c.name}</h3>
            {[["Phone", c.phone], ["Email", c.email || "—"], ["Address", c.address || "—"], ["Group", c.group], ["Credit Limit", `₹${c.creditLimit}`], ["Outstanding", `₹${c.outstanding}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <Btn size="sm" onClick={() => { setForm({ ...c }); setModal("edit"); }}>✏️ Edit</Btn>
            </div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card>
              <h4 style={{ margin: "0 0 12px" }}>📊 Stats</h4>
              {[["Total Bills", custBills.length], ["Total Spend", `₹${totalSpend.toLocaleString()}`], ["Loyalty Points", `⭐ ${c.loyaltyPoints}`], ["Avg Bill", `₹${custBills.length ? Math.round(totalSpend / custBills.length) : 0}`]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                  <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
        <Card>
          <h4 style={{ margin: "0 0 12px" }}>🧾 Purchase History</h4>
          {custBills.length === 0
            ? <div style={{ textAlign: "center", padding: 24, color: C.muted }}>No bills found</div>
            : <Table columns={[
                { key: "id", label: "Bill No" }, { key: "date", label: "Date" }, { key: "items", label: "Items" },
                { key: "total", label: "Total", render: v => `₹${v}` }, { key: "payment", label: "Mode", render: v => <Badge text={v} color="blue" /> },
              ]} data={custBills} />
          }
        </Card>
        {modal && (
          <Modal title="Edit Customer" onClose={() => setModal(null)}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Input label="Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} required />
              <Input label="Phone" value={form.phone||""} onChange={v=>setForm(f=>({...f,phone:v}))} required />
              <Input label="Email" value={form.email||""} onChange={v=>setForm(f=>({...f,email:v}))} />
              <Select label="Group" value={form.group||"Regular"} onChange={v=>setForm(f=>({...f,group:v}))} options={["Regular","Premium","VIP","Wholesale"]} />
              <Input label="Credit Limit" value={form.creditLimit||""} onChange={v=>setForm(f=>({...f,creditLimit:v}))} type="number" />
            </div>
            <Input label="Address" value={form.address||""} onChange={v=>setForm(f=>({...f,address:v}))} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </Modal>
        )}
        <Toast msg={toast} onClose={() => setToast("")} />
      </div>
    );
  }

  return (
    <div>
      <Tabs tabs={[["list","👥 Customers"],["loyalty","⭐ Loyalty"],["credit","💳 Credit"],["comms","📱 Comms"]]} active={tab} onChange={setTab} />
      {tab === "list" && <>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <SearchFilter value={search} onChange={setSearch} />
            <div style={{ marginLeft: "auto" }}>
              <Btn onClick={() => { setForm({ name:"",phone:"",email:"",address:"",group:"Regular",loyaltyPoints:0,creditLimit:3000,outstanding:0 }); setModal("add"); }}>+ Add Customer</Btn>
            </div>
          </div>
        </Card>
        <Card>
          <Table
            columns={[
              { key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" },
              { key: "group", label: "Group", render: v => <Badge text={v} color={v==="Premium"?"purple":"blue"} /> },
              { key: "loyaltyPoints", label: "Points", render: v => <span style={{ color: C.warning, fontWeight: 700 }}>⭐ {v}</span> },
              { key: "outstanding", label: "Outstanding", render: v => v > 0 ? <span style={{ color: C.danger, fontWeight: 700 }}>₹{v}</span> : <Badge text="Clear" color="green" /> },
            ]}
            data={filtered}
            onAction={(a, r) => {
              if (a === "view") setDetailView(r);
              if (a === "edit") { setForm({ ...r }); setModal("edit"); }
              if (a === "delete") { setData(d => ({ ...d, customers: d.customers.filter(x => x.id !== r.id) })); setToast("Deleted!"); }
            }}
          />
        </Card>
      </>}
      {tab === "loyalty" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <h4 style={{ margin: "0 0 12px" }}>⭐ Loyalty Rules</h4>
            {[["Earning Rate","1 point per ₹10"],["Redemption","100 pts = ₹10 off"],["Expiry","1 year"],["Min Redemption","200 pts"]].map(([k,v])=>(
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 12px" }}>Top Loyalty Customers</h4>
            {[...data.customers].sort((a,b)=>b.loyaltyPoints-a.loyaltyPoints).map(c=>(
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div><div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 11, color: C.muted }}>{c.group}</div></div>
                <span style={{ fontWeight: 700, color: C.warning }}>⭐ {c.loyaltyPoints}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
      {tab === "credit" && (
        <Card>
          <Table columns={[
            { key: "name", label: "Customer" }, { key: "phone", label: "Phone" },
            { key: "creditLimit", label: "Limit", render: v => `₹${v.toLocaleString()}` },
            { key: "outstanding", label: "Outstanding", render: v => <span style={{ color: v>0?C.danger:C.success, fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
            { key: "creditLimit", label: "Available", render: (v,r) => `₹${(v-r.outstanding).toLocaleString()}` },
          ]} data={data.customers} />
        </Card>
      )}
      {tab === "comms" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📱 Customer Communications</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Select label="Send To" value="" onChange={() => {}} options={["All Customers","Premium Customers","Regular Customers"]} />
              <Select label="Channel" value="" onChange={() => {}} options={["SMS","WhatsApp","Both"]} />
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5, textTransform: "uppercase" }}>Message</label>
                <textarea rows={4} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, boxSizing: "border-box", resize: "vertical" }} />
              </div>
              <Btn onClick={() => setToast("Message sent!")}>📤 Send</Btn>
            </div>
            <div>
              <h5 style={{ margin: "0 0 10px", fontSize: 13, color: C.muted }}>Recent Campaigns</h5>
              {[["Republic Day Offer","WhatsApp","118 sent"],["Loyalty Reminder","SMS","45 sent"]].map(([n,ch,c])=>(
                <div key={n} style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{ch} · {c}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      {modal && (
        <Modal title={modal === "add" ? "Add Customer" : "Edit Customer"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} required />
            <Input label="Phone" value={form.phone||""} onChange={v=>setForm(f=>({...f,phone:v}))} required />
            <Input label="Email" value={form.email||""} onChange={v=>setForm(f=>({...f,email:v}))} />
            <Select label="Group" value={form.group||"Regular"} onChange={v=>setForm(f=>({...f,group:v}))} options={["Regular","Premium","VIP","Wholesale"]} />
            <Input label="Credit Limit" value={form.creditLimit||""} onChange={v=>setForm(f=>({...f,creditLimit:v}))} type="number" />
          </div>
          <Input label="Address" value={form.address||""} onChange={v=>setForm(f=>({...f,address:v}))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>{modal === "add" ? "Add" : "Save"}</Btn>
          </div>
        </Modal>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Suppliers ────────────────────────────────────────────────────────────────
function Suppliers() {
  const [data, setData] = useGlobalStore();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [detailView, setDetailView] = useState(null);

  const save = () => {
    if (!form.name) return;
    if (modal === "add") setData(d => ({ ...d, suppliers: [...d.suppliers, { ...form, id: Date.now(), outstanding: 0, creditDays: +form.creditDays || 30 }] }));
    else setData(d => ({ ...d, suppliers: d.suppliers.map(s => s.id === form.id ? form : s) }));
    setModal(null); setToast("Saved!");
  };

  if (detailView) {
    const s = detailView;
    return (
      <div>
        <Btn variant="ghost" onClick={() => setDetailView(null)} style={{ marginBottom: 14 }}>← Back</Btn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <h3 style={{ margin: "0 0 14px" }}>🏭 {s.name}</h3>
            {[["Contact",s.contact],["Phone",s.phone],["GST",s.gst],["Address",s.address],["Credit Days",`${s.creditDays} days`],["Outstanding",`₹${s.outstanding.toLocaleString()}`]].map(([k,v])=>(
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 14 }}><Btn size="sm" onClick={() => { setForm({ ...s }); setModal("edit"); }}>✏️ Edit</Btn></div>
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 12px" }}>📋 Purchase Orders</h4>
            {data.purchaseOrders.filter(p => p.supplier === s.name).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
                <div><div style={{ fontWeight: 600 }}>{p.id}</div><div style={{ color: C.muted }}>{p.date}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700 }}>₹{p.amount.toLocaleString()}</div><Badge text={p.status} color={p.status==="Received"?"green":"yellow"} /></div>
              </div>
            ))}
          </Card>
        </div>
        {modal && (
          <Modal title="Edit Supplier" onClose={() => setModal(null)}>
            <Input label="Company Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Input label="Contact" value={form.contact||""} onChange={v=>setForm(f=>({...f,contact:v}))} />
              <Input label="Phone" value={form.phone||""} onChange={v=>setForm(f=>({...f,phone:v}))} />
              <Input label="GST" value={form.gst||""} onChange={v=>setForm(f=>({...f,gst:v}))} />
              <Input label="Credit Days" value={form.creditDays||""} onChange={v=>setForm(f=>({...f,creditDays:v}))} type="number" />
            </div>
            <Input label="Address" value={form.address||""} onChange={v=>setForm(f=>({...f,address:v}))} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </Modal>
        )}
        <Toast msg={toast} onClose={() => setToast("")} />
      </div>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0 }}>🏭 Suppliers</h4>
          <Btn onClick={() => { setForm({ name:"",contact:"",phone:"",gst:"",address:"",creditDays:"30" }); setModal("add"); }}>+ Add Supplier</Btn>
        </div>
      </Card>
      <Card>
        <Table
          columns={[
            { key: "name", label: "Supplier" }, { key: "contact", label: "Contact" }, { key: "phone", label: "Phone" },
            { key: "gst", label: "GST" }, { key: "creditDays", label: "Credit Days" },
            { key: "outstanding", label: "Outstanding", render: v => <span style={{ fontWeight: 700, color: v>0?C.danger:C.success }}>₹{v.toLocaleString()}</span> },
          ]}
          data={data.suppliers}
          onAction={(a, r) => {
            if (a === "view") setDetailView(r);
            if (a === "edit") { setForm({ ...r }); setModal("edit"); }
            if (a === "delete") { setData(d => ({ ...d, suppliers: d.suppliers.filter(x => x.id !== r.id) })); setToast("Deleted!"); }
          }}
        />
      </Card>
      {modal && (
        <Modal title={modal === "add" ? "Add Supplier" : "Edit Supplier"} onClose={() => setModal(null)}>
          <Input label="Company Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Contact" value={form.contact||""} onChange={v=>setForm(f=>({...f,contact:v}))} />
            <Input label="Phone" value={form.phone||""} onChange={v=>setForm(f=>({...f,phone:v}))} />
            <Input label="GST" value={form.gst||""} onChange={v=>setForm(f=>({...f,gst:v}))} />
            <Input label="Credit Days" value={form.creditDays||""} onChange={v=>setForm(f=>({...f,creditDays:v}))} type="number" />
          </div>
          <Input label="Address" value={form.address||""} onChange={v=>setForm(f=>({...f,address:v}))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Expenses ────────────────────────────────────────────────────────────────
function Expenses() {
  const [data, setData] = useGlobalStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], category: "Electricity", amount: "", description: "", paidBy: "Cash" });
  const [toast, setToast] = useState("");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <StatCard label="Total Expenses" value={`₹${data.expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()}`} icon="💸" />
          <StatCard label="Pending" value={data.expenses.filter(e=>e.status==="Pending").length} icon="⏳" />
        </div>
        <Btn onClick={() => setModal(true)}>+ Add Expense</Btn>
      </div>
      <Card>
        <Table
          columns={[
            { key: "date", label: "Date" }, { key: "category", label: "Category" }, { key: "description", label: "Description" },
            { key: "amount", label: "Amount", render: v => `₹${v.toLocaleString()}` }, { key: "paidBy", label: "Paid By" },
            { key: "status", label: "Status", render: (v, r) => (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Badge text={v} color={v==="Approved"?"green":"yellow"} />
                {v === "Pending" && <Btn size="sm" variant="success" onClick={() => { setData(d => ({ ...d, expenses: d.expenses.map(e => e.id === r.id ? { ...e, status: "Approved" } : e) })); setToast("Approved!"); }}>Approve</Btn>}
              </div>
            )},
          ]}
          data={data.expenses}
          onAction={(a, r) => { if (a === "delete") { setData(d => ({ ...d, expenses: d.expenses.filter(e => e.id !== r.id) })); setToast("Deleted!"); }}}
        />
      </Card>
      {modal && (
        <Modal title="Add Expense" onClose={() => setModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date" />
            <Input label="Amount (₹)" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))} type="number" required />
            <Select label="Category" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={["Electricity","Rent","Staff Salary","Transport","Marketing","Repairs","Other"]} />
            <Select label="Paid By" value={form.paidBy} onChange={v=>setForm(f=>({...f,paidBy:v}))} options={["Cash","Bank","UPI","Credit Card"]} />
          </div>
          <Input label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={() => {
              if (!form.amount) return;
              setData(d => ({ ...d, expenses: [{ id: Date.now(), ...form, amount: +form.amount, status: "Pending" }, ...d.expenses] }));
              setModal(false); setToast("Expense recorded!");
            }}>Save</Btn>
          </div>
        </Modal>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}// ─── Branches ─────────────────────────────────────────────────────────────────
function Branches() {
  const [data, setData] = useGlobalStore();
  const [tab, setTab] = useState("directory");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);

  const saveBranch = () => {
    if (!form.name) return;
    const branchData = { 
      ...form, 
      staff: form.staff ? +form.staff : 0, 
      sales: form.sales ? +form.sales : 0,
      franchise: false 
    };
    if (modal === "add") {
      setData(d => ({ ...d, branches: [...d.branches, { ...branchData, id: Date.now(), sales: 0 }] }));
      setToast("Branch added successfully!");
    } else {
      setData(d => ({ ...d, branches: d.branches.map(b => b.id === form.id ? branchData : b) }));
      setToast("Branch details updated!");
      if (selectedBranch && selectedBranch.id === form.id) {
        setSelectedBranch(branchData);
      }
    }
    setModal(null);
  };

  const startOnboarding = () => {
    setForm({ 
      name: "", location: "", manager: "", phone: "", email: "", 
      gst: "", openTime: "08:00 AM", closeTime: "10:00 PM", staff: "", status: "Active" 
    });
    setTab("setup");
  };

  const handleEdit = (b) => {
    setForm({ ...b });
    setModal("edit");
  };

  const handleViewDetails = (b) => {
    setSelectedBranch(b);
    setTab("details");
  };

  const activeBranches = data.branches || [];

  return (
    <div>
      <Tabs tabs={[
        ["directory", "📋 Branch Directory"],
        ["setup", "🏢 Setup New Branch"],
        ...(selectedBranch ? [["details", `🔍 Details — ${selectedBranch.name}`]] : [])
      ]} active={tab} onChange={setTab} />

      {tab === "directory" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.muted }}>
              Active Store Fronts: <b>{activeBranches.filter(b=>b.status==="Active").length}</b> | Total Own Sales: <b style={{ color: C.success }}>₹{activeBranches.reduce((s,b)=>s+b.sales,0).toLocaleString()}</b>
            </div>
            <Btn onClick={startOnboarding}>+ Setup New Branch</Btn>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
            {activeBranches.map(b => (
              <Card key={b.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>📍 {b.location}</div>
                  </div>
                  <Badge text={b.status} color={b.status === "Active" ? "green" : "red"} />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 12, fontSize: 12.5 }}>
                  <div><span style={{ color: C.muted }}>Manager:</span> <strong style={{ color: C.text }}>{b.manager || "—"}</strong></div>
                  <div><span style={{ color: C.muted }}>Timings:</span> <strong style={{ color: C.text }}>{b.openTime || "8 AM"} - {b.closeTime || "10 PM"}</strong></div>
                  <div><span style={{ color: C.muted }}>Phone:</span> <strong style={{ color: C.text }}>{b.phone || "—"}</strong></div>
                  <div><span style={{ color: C.muted }}>Staff:</span> <strong style={{ color: C.text }}>{b.staff || "0"} Employees</strong></div>
                </div>

                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Monthly Sales Revenue</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.success }}>₹{b.sales.toLocaleString()}</span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" onClick={() => handleViewDetails(b)}>👁 View Details</Btn>
                  <Btn size="sm" variant="outline" onClick={() => handleEdit(b)}>✏️ Edit</Btn>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "setup" && (
        <Card style={{ maxWidth: 700, margin: "0 auto" }}>
          <h3 style={{ margin: "0 0 4px", color: C.text }}>🏢 Setup & Register New Branch</h3>
          <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 20 }}>Onboard a new supermarket store front into the KC Supermarket ERP network. Fill out all profiles and operations.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Branch Name" value={form.name || ""} onChange={v => setForm(f => ({ ...f, name: v }))} required placeholder="e.g. KC Lawrence Road" />
            <Input label="Location/City Area" value={form.location || ""} onChange={v => setForm(f => ({ ...f, location: v }))} required placeholder="e.g. Lawrence Road, Amritsar" />
            <Input label="Manager Name" value={form.manager || ""} onChange={v => setForm(f => ({ ...f, manager: v }))} placeholder="e.g. Sunil Kapoor" />
            <Input label="Store Phone No" value={form.phone || ""} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="e.g. 0183-234567" />
            <Input label="Operational Email ID" value={form.email || ""} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="e.g. lawrence@kcsuper.com" />
            <Input label="GSTIN Number" value={form.gst || ""} onChange={v => setForm(f => ({ ...f, gst: v }))} placeholder="e.g. 03AABCK1234Z1Z5" />
            <Input label="Opening Time" value={form.openTime || "09:00 AM"} onChange={v => setForm(f => ({ ...f, openTime: v }))} placeholder="e.g. 9:00 AM" />
            <Input label="Closing Time" value={form.closeTime || "10:00 PM"} onChange={v => setForm(f => ({ ...f, closeTime: v }))} placeholder="e.g. 9:00 PM" />
            <Input label="Initial Staff Count" value={form.staff || ""} onChange={v => setForm(f => ({ ...f, staff: v }))} type="number" placeholder="e.g. 8" />
            <Select label="Status" value={form.status || "Active"} onChange={v => setForm(f => ({ ...f, status: v }))} options={["Active", "Inactive", "Under Renovation"]} />
          </div>
          
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
            <Btn variant="ghost" onClick={() => { setForm({}); setTab("directory"); }}>Cancel</Btn>
            <Btn onClick={() => { setModal("add"); saveBranch(); setTab("directory"); }}>Register & Launch Store</Btn>
          </div>
        </Card>
      )}

      {tab === "details" && selectedBranch && (() => {
        const b = selectedBranch;
        const branchBills = data.bills.filter(bill => bill.branch === b.name);
        const branchRevenue = branchBills.reduce((s, bill) => s + bill.total, 0);
        return (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <Btn variant="ghost" onClick={() => setTab("directory")}>← Back to Directory</Btn>
              <Btn variant="outline" onClick={() => handleEdit(b)}>✏️ Edit Branch Profile</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              <StatCard label="Total Revenue Generated" value={`₹${branchRevenue.toLocaleString()}`} icon="💰" />
              <StatCard label="Active Billings Filed" value={branchBills.length} icon="🧾" />
              <StatCard label="On-duty Staff Members" value={b.staff || "0"} icon="👥" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, marginBottom: 14 }}>
              <Card>
                <h4 style={{ margin: "0 0 14px", color: C.text }}>🏢 Complete Store Information Profile</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                  {[
                    ["Registered Branch Name", b.name],
                    ["Store Location", b.location],
                    ["Assigned Manager", b.manager],
                    ["Timings", `${b.openTime || "9 AM"} to ${b.closeTime || "10 PM"}`],
                    ["Direct Hotline", b.phone],
                    ["Operational Email ID", b.email || "—"],
                    ["GSTIN Number", b.gst || "—"],
                    ["Staff Deployment Count", `${b.staff || 0} Employees`],
                    ["Operational Status", b.status],
                    ["Ownership Type", "KC Own Retail Outlet"]
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                      <span style={{ color: C.muted }}>{k}</span>
                      <span style={{ fontWeight: 700, color: C.text }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Card>
                  <h4 style={{ margin: "0 0 12px", color: C.text }}>💳 Payment Channels Breakdown</h4>
                  {["Cash", "UPI", "Card", "Mixed"].map(m => {
                    const amt = branchBills.filter(bi => bi.payment === m).reduce((s, bi) => s + bi.total, 0);
                    return (
                      <div key={m} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                        <span style={{ color: C.muted }}>{m} Payments</span>
                        <span style={{ fontWeight: 800, color: amt > 0 ? C.success : C.muted }}>₹{amt.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </Card>
                <Card>
                  <h4 style={{ margin: "0 0 12px", color: C.text }}>🏪 Stock Operations</h4>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.4 }}>
                    This branch has access to all <b>{data.products.length}</b> cataloged products from the central database. Stock replenishment can be transferred via the Inventory module.
                  </div>
                </Card>
              </div>
            </div>

            <Card>
              <h4 style={{ margin: "0 0 14px", color: C.text }}>🧾 Recent Billing Transactions at {b.name}</h4>
              {branchBills.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, color: C.muted }}>No recent bills filed under this branch yet.</div>
              ) : (
                <Table columns={[
                  { key: "id", label: "Bill No", render: v => <strong style={{ color: C.accent }}>{v}</strong> },
                  { key: "date", label: "Date" },
                  { key: "customer", label: "Customer" },
                  { key: "total", label: "Total Sale", render: v => <b>₹{v}</b> },
                  { key: "payment", label: "Payment Mode", render: v => <Badge text={v} color="blue" /> },
                ]} data={branchBills.slice(0, 5)} />
              )}
            </Card>
          </div>
        );
      })()}

      {modal === "edit" && (
        <Modal title="Edit Branch Information" onClose={() => setModal(null)}>
          <Input label="Branch Name" value={form.name || ""} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="Location" value={form.location || ""} onChange={v => setForm(f => ({ ...f, location: v }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Manager" value={form.manager || ""} onChange={v => setForm(f => ({ ...f, manager: v }))} />
            <Input label="Phone" value={form.phone || ""} onChange={v => setForm(f => ({ ...f, phone: v }))} />
            <Input label="Email" value={form.email || ""} onChange={v => setForm(f => ({ ...f, email: v }))} />
            <Input label="GST Number" value={form.gst || ""} onChange={v => setForm(f => ({ ...f, gst: v }))} />
            <Input label="Open Time" value={form.openTime || ""} onChange={v => setForm(f => ({ ...f, openTime: v }))} />
            <Input label="Close Time" value={form.closeTime || ""} onChange={v => setForm(f => ({ ...f, closeTime: v }))} />
            <Input label="Staff Count" value={form.staff || ""} onChange={v => setForm(f => ({ ...f, staff: v }))} type="number" />
            <Select label="Status" value={form.status || "Active"} onChange={v => setForm(f => ({ ...f, status: v }))} options={["Active", "Inactive", "Under Renovation"]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={saveBranch}>Save Profile</Btn>
          </div>
        </Modal>
      )}

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Franchises ───────────────────────────────────────────────────────────────
function Franchises() {
  const [data, setData] = useGlobalStore();
  const [tab, setTab] = useState("network");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState(null);

  const saveFranchise = () => {
    if (!form.name) return;
    const franchiseData = {
      ...form,
      royaltyPct: form.royaltyPct ? +form.royaltyPct : 5,
      depositPaid: form.depositPaid ? +form.depositPaid : 0,
      sales: form.sales ? +form.sales : 0,
      franchise: true
    };
    if (modal === "add") {
      setData(d => ({ ...d, franchises: [...(d.franchises || []), { ...franchiseData, id: Date.now(), sales: 0 }] }));
      setToast("Franchise registered successfully!");
    } else {
      setData(d => ({ ...d, franchises: d.franchises.map(f => f.id === form.id ? franchiseData : f) }));
      setToast("Franchise details updated!");
      if (selectedFranchise && selectedFranchise.id === form.id) {
        setSelectedFranchise(franchiseData);
      }
    }
    setModal(null);
  };

  const startOnboarding = () => {
    setForm({
      name: "", owner: "", phone: "", email: "", location: "",
      royaltyPct: 5, agreement: "5 years", depositPaid: "", startDate: new Date().toISOString().split("T")[0], status: "Active"
    });
    setTab("onboarding");
  };

  const handleEdit = (fr) => {
    setForm({ ...fr });
    setModal("edit");
  };

  const handleViewDetails = (fr) => {
    setSelectedFranchise(fr);
    setTab("analytics");
  };

  const activeFranchises = data.franchises || [];
  const totalRoyalty = activeFranchises.reduce((s, f) => s + Math.round(f.sales * f.royaltyPct / 100), 0);

  return (
    <div>
      <Tabs tabs={[
        ["network", "🌐 Franchise Network"],
        ["onboarding", "🏪 Franchise Onboarding"],
        ...(selectedFranchise ? [["analytics", `📊 Analytics — ${selectedFranchise.name}`]] : [])
      ]} active={tab} onChange={setTab} />

      {tab === "network" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.muted }}>
              Active Franchise Network: <b>{activeFranchises.length} Outlets</b> | Total Royalty Revenue Due: <b style={{ color: C.purple }}>₹{totalRoyalty.toLocaleString()}</b>
            </div>
            <Btn onClick={startOnboarding}>+ Onboard Franchise</Btn>
          </div>

          {activeFranchises.length === 0 ? (
            <Card><div style={{ textAlign: "center", padding: 40, color: C.muted }}>No franchises onboarded yet. Click Onboard Franchise to setup.</div></Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {activeFranchises.map(fr => {
                const royaltyDue = Math.round(fr.sales * fr.royaltyPct / 100);
                return (
                  <Card key={fr.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fr.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>📍 {fr.location}</div>
                      </div>
                      <Badge text={fr.status} color={fr.status === "Active" ? "green" : fr.status === "Terminated" ? "red" : "yellow"} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 12, fontSize: 12.5 }}>
                      <div><span style={{ color: C.muted }}>Owner:</span> <strong style={{ color: C.text }}>{fr.owner || "—"}</strong></div>
                      <div><span style={{ color: C.muted }}>Royalty Rate:</span> <strong style={{ color: C.purple }}>{fr.royaltyPct}%</strong></div>
                      <div><span style={{ color: C.muted }}>Hotline:</span> <strong style={{ color: C.text }}>{fr.phone || "—"}</strong></div>
                      <div><span style={{ color: C.muted }}>Agreement:</span> <strong style={{ color: C.text }}>{fr.agreement || "5 years"}</strong></div>
                    </div>

                    <div style={{ background: "#faf5ff", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>Monthly Royalty Due</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.purple }}>₹{royaltyDue.toLocaleString()}</span>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn size="sm" onClick={() => handleViewDetails(fr)}>👁 View Details</Btn>
                      <Btn size="sm" variant="outline" onClick={() => handleEdit(fr)}>✏️ Edit</Btn>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "onboarding" && (
        <Card style={{ maxWidth: 700, margin: "0 auto" }}>
          <h3 style={{ margin: "0 0 4px", color: C.text }}>🏪 Setup & Onboard New Franchise</h3>
          <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 20 }}>Launch a new franchised retail store under the KC Supermarket brand. Set financial parameters, deposits, and agreements.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Franchise Outlet Name" value={form.name || ""} onChange={v => setForm(f => ({ ...f, name: v }))} required placeholder="e.g. KC Batala Road" />
            <Input label="Owner Full Name" value={form.owner || ""} onChange={v => setForm(f => ({ ...f, owner: v }))} required placeholder="e.g. Manpreet Bains" />
            <Input label="Owner Phone" value={form.phone || ""} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="e.g. 9871234567" />
            <Input label="Owner Email Address" value={form.email || ""} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="e.g. batala@kcfranchise.com" />
            <Input label="Royalty Rate % (Sales)" value={form.royaltyPct || ""} onChange={v => setForm(f => ({ ...f, royaltyPct: +v }))} type="number" placeholder="e.g. 5" />
            <Input label="Agreement Duration" value={form.agreement || "5 years"} onChange={v => setForm(f => ({ ...f, agreement: v }))} placeholder="e.g. 5 years" />
            <Input label="Franchise Security Deposit ₹" value={form.depositPaid || ""} onChange={v => setForm(f => ({ ...f, depositPaid: +v }))} type="number" placeholder="e.g. 200000" />
            <Input label="Agreement Start Date" value={form.startDate || ""} onChange={v => setForm(f => ({ ...f, startDate: v }))} type="date" />
            <Select label="Status" value={form.status || "Active"} onChange={v => setForm(f => ({ ...f, status: v }))} options={["Active", "Inactive", "Terminated"]} />
          </div>
          <Input label="Franchise Outlet Address" value={form.location || ""} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="Full physical street address..." />
          
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
            <Btn variant="ghost" onClick={() => { setForm({}); setTab("network"); }}>Cancel</Btn>
            <Btn onClick={() => { setModal("add"); saveFranchise(); setTab("network"); }}>Onboard Franchise</Btn>
          </div>
        </Card>
      )}

      {tab === "analytics" && selectedFranchise && (() => {
        const fr = selectedFranchise;
        const royaltyDue = Math.round(fr.sales * fr.royaltyPct / 100);
        return (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <Btn variant="ghost" onClick={() => setTab("network")}>← Back to Network</Btn>
              <Btn variant="outline" onClick={() => handleEdit(fr)}>✏️ Edit Franchise Agreement</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Card>
                <h4 style={{ margin: "0 0 14px", color: C.text }}>🏪 Complete Franchise & Owner Profile</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                  {[
                    ["Outlet Name", fr.name],
                    ["Franchise Owner", fr.owner],
                    ["Contact Mobile", fr.phone],
                    ["Email Address", fr.email || "—"],
                    ["Registered Location", fr.location],
                    ["Agreement Starting Date", fr.startDate],
                    ["Agreement Period", fr.agreement],
                    ["Deposit Paid to Brand", `₹${(fr.depositPaid || 0).toLocaleString()}`],
                    ["Monthly Sales Filed", `₹${(fr.sales || 0).toLocaleString()}`],
                    ["Royalty Rate", `${fr.royaltyPct}%`],
                    ["Contract Status", fr.status]
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                      <span style={{ color: C.muted }}>{k}</span>
                      <span style={{ fontWeight: 700, color: C.text }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <StatCard label="Monthly Billing Filed" value={`₹${fr.sales.toLocaleString()}`} icon="💰" />
                <Card style={{ background: "#faf5ff", border: "1.5px solid #d8b4fe" }}>
                  <h4 style={{ margin: "0 0 12px", color: C.text }}>📊 Royalty Calculation Worksheet</h4>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e9d5ff" }}>
                      <span style={{ color: C.muted }}>Monthly Gross Sales</span>
                      <strong>₹{fr.sales.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e9d5ff" }}>
                      <span style={{ color: C.muted }}>Brand Royalty Rate</span>
                      <strong>{fr.royaltyPct}%</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontSize: 15, fontWeight: 800, color: C.purple }}>
                      <span>Royalty Revenue Due</span>
                      <span>₹{royaltyDue.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h4 style={{ margin: "0 0 12px", color: C.text }}>📑 Agreement Terms</h4>
                  <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.4 }}>
                    Franchises operate as independent legal entities under brand compliance guidelines. Royalties are calculated on monthly gross revenue and are due on the 5th working day of each calendar month.
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      {modal === "edit" && (
        <Modal title="Edit Franchise Details" onClose={() => setModal(null)} width={600}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Franchise Name" value={form.name || ""} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <Input label="Owner Name" value={form.owner || ""} onChange={v => setForm(f => ({ ...f, owner: v }))} required />
            <Input label="Phone" value={form.phone || ""} onChange={v => setForm(f => ({ ...f, phone: v }))} />
            <Input label="Email" value={form.email || ""} onChange={v => setForm(f => ({ ...f, email: v }))} />
            <Input label="Royalty %" value={form.royaltyPct || ""} onChange={v => setForm(f => ({ ...f, royaltyPct: +v }))} type="number" />
            <Input label="Agreement Duration" value={form.agreement || ""} onChange={v => setForm(f => ({ ...f, agreement: v }))} />
            <Input label="Deposit Paid ₹" value={form.depositPaid || ""} onChange={v => setForm(f => ({ ...f, depositPaid: +v }))} type="number" />
            <Select label="Status" value={form.status || "Active"} onChange={v => setForm(f => ({ ...f, status: v }))} options={["Active", "Inactive", "Terminated"]} />
          </div>
          <Input label="Location" value={form.location || ""} onChange={v => setForm(f => ({ ...f, location: v }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={saveFranchise}>Save Terms</Btn>
          </div>
        </Modal>
      )}

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
function Users() {
  const [data, setData] = useGlobalStore();
  const [tab, setTab] = useState("users");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");

  return (
    <div>
      <Tabs tabs={[["users","👤 Users"],["roles","🎭 Roles"],["permissions","🔒 Permissions"],["audit","📝 Audit Log"]]} active={tab} onChange={setTab} />
      {tab === "users" && <>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Btn onClick={() => { setForm({ name:"",username:"",role:"Cashier",branch:"KC Main Store",status:"Active" }); setModal("add"); }}>+ Add User</Btn>
        </div>
        <Card>
          <Table
            columns={[
              { key: "name", label: "Name" }, { key: "username", label: "Username" },
              { key: "role", label: "Role", render: v => <Badge text={v} color={v==="Admin"?"purple":v==="Manager"?"blue":"gray"} /> },
              { key: "branch", label: "Branch" }, { key: "lastLogin", label: "Last Login" },
              { key: "status", label: "Status", render: v => <Badge text={v} color={v==="Active"?"green":"red"} /> },
            ]}
            data={data.users}
            onAction={(a, r) => {
              if (a === "edit") { setForm({ ...r }); setModal("edit"); }
              if (a === "delete") { setData(d => ({ ...d, users: d.users.filter(u => u.id !== r.id) })); setToast("User removed!"); }
            }}
          />
        </Card>
      </>}
      {tab === "roles" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[["Admin","Full access","purple","All modules"],["Manager","Branch management","blue","Reports, transactions"],["Cashier","POS only","gray","Billing, returns"],["Purchase Mgr","Procurement","green","Suppliers, PO, GRN"],["Accountant","Accounting","yellow","Ledger, vouchers"]].map(([role,desc,color,perms])=>(
            <div key={role} style={{ border: "1.5px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
              <Badge text={role} color={color} />
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, marginBottom: 4 }}>{desc}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{perms}</div>
              <Btn size="sm" variant="outline" onClick={() => setToast(`Editing ${role}...`)}>Edit Permissions</Btn>
            </div>
          ))}
        </div>
      )}
      {tab === "permissions" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>🔒 Module Permissions Matrix</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left" }}>Module</th>
                  {["Admin","Manager","Cashier","Purchase Mgr","Accountant"].map(r => <th key={r} style={{ padding: "8px 12px" }}>{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {["POS Billing","Products","Inventory","Purchases","Customers","Suppliers","Expenses","Reports","Branches","Settings"].map(mod => (
                  <tr key={mod} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{mod}</td>
                    {["Admin","Manager","Cashier","Purchase Mgr","Accountant"].map(role => {
                      const allowed = role === "Admin" || (role === "Manager" && !["Settings"].includes(mod)) || (role === "Cashier" && ["POS Billing","Customers"].includes(mod)) || (role === "Purchase Mgr" && ["Purchases","Suppliers","Inventory","Products"].includes(mod)) || (role === "Accountant" && ["Expenses","Reports"].includes(mod));
                      return <td key={role} style={{ textAlign: "center", padding: "8px 12px" }}>{allowed ? "✅" : "❌"}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {tab === "audit" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📝 Audit Log</h4>
          <Table columns={[
            { key: "time", label: "Time" }, { key: "user", label: "User" }, { key: "action", label: "Action" },
            { key: "module", label: "Module" }, { key: "ip", label: "IP" },
          ]} data={[
            { time: "09:15 AM", user: "admin", action: "Login", module: "System", ip: "192.168.1.5" },
            { time: "09:22 AM", user: "amit_pos", action: "New Bill #KC-0142", module: "POS", ip: "192.168.1.10" },
            { time: "09:45 AM", user: "riya_mgr", action: "Approved PO-2024-002", module: "Purchases", ip: "192.168.1.15" },
            { time: "10:12 AM", user: "admin", action: "Added Product SKU: RICE002", module: "Products", ip: "192.168.1.5" },
          ]} />
        </Card>
      )}
      {modal && (
        <Modal title={modal === "add" ? "Add User" : "Edit User"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Full Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} required />
            <Input label="Username" value={form.username||""} onChange={v=>setForm(f=>({...f,username:v}))} required />
            {modal === "add" && <Input label="Password" value={form.password||""} onChange={v=>setForm(f=>({...f,password:v}))} type="password" />}
            <Select label="Role" value={form.role||"Cashier"} onChange={v=>setForm(f=>({...f,role:v}))} options={["Admin","Manager","Cashier","Purchase Manager","Accountant"]} />
            <Select label="Branch" value={form.branch||"KC Main Store"} onChange={v=>setForm(f=>({...f,branch:v}))} options={["All","KC Main Store","KC Lawrence Road"]} />
            <Select label="Status" value={form.status||"Active"} onChange={v=>setForm(f=>({...f,status:v}))} options={["Active","Inactive"]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => {
              if (modal === "add") setData(d => ({ ...d, users: [...d.users, { ...form, id: Date.now(), lastLogin: "Never" }] }));
              else setData(d => ({ ...d, users: d.users.map(u => u.id === form.id ? form : u) }));
              setModal(null); setToast("User saved!");
            }}>{modal === "add" ? "Create" : "Save"}</Btn>
          </div>
        </Modal>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Discounts ────────────────────────────────────────────────────────────────
function Discounts() {
  const [data, setData] = useGlobalStore();
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("bill");
  
  const [form, setForm] = useState({ name: "", type: "Bill Discount", valType: "Percentage", value: "", validity: "", code: "", status: "Active" });
  const [selectedProds, setSelectedProds] = useState([]);

  const mapping = {
    bill: "Bill Discount",
    item: "Item Discount",
    combo: "Combo Offer",
    buyx: "Buy X Get Y",
    coupons: "Coupon"
  };

  const activeTabType = mapping[tab] || "Bill Discount";
  const filteredOffers = (data.discounts || []).filter(o => o.type === activeTabType);

  const createOffer = () => {
    if (!form.name || !form.value) {
      setToast("Please fill out name and value!");
      return;
    }
    const newOffer = {
      id: Date.now(),
      name: form.name,
      type: form.type,
      valType: form.valType,
      value: Number(form.value),
      validity: form.validity || new Date().toISOString().split("T")[0],
      code: form.code || form.name.replace(/\s+/g, "").toUpperCase(),
      status: form.status,
      applicableProducts: selectedProds.length > 0 ? selectedProds : ["All Products"]
    };
    setData(d => ({
      ...d,
      discounts: [...(d.discounts || []), newOffer]
    }));
    setToast("Discount offer created successfully!");
    setForm({ name: "", type: activeTabType, valType: "Percentage", value: "", validity: "", code: "", status: "Active" });
    setSelectedProds([]);
  };

  const deleteOffer = (id) => {
    setData(d => ({
      ...d,
      discounts: d.discounts.filter(x => x.id !== id)
    }));
    setToast("Offer deleted!");
  };

  const toggleOfferStatus = (id) => {
    setData(d => ({
      ...d,
      discounts: d.discounts.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x)
    }));
    setToast("Offer status toggled!");
  };

  // Sync default type in creation form on tab change
  useEffect(() => {
    setForm(f => ({ ...f, type: activeTabType }));
    setSelectedProds([]);
  }, [tab]);

  return (
    <div>
      <Tabs tabs={[["bill","🧾 Bill Discounts"],["item","🏷 Item Discounts"],["combo","🎁 Combos"],["buyx","🛒 Buy X Get Y"],["coupons","🎟 Coupons"]]} active={tab} onChange={setTab} />
      
      <Card style={{ marginBottom: 14 }}>
        <h4 style={{ margin: "0 0 12px" }}>📋 Active {activeTabType}s ({filteredOffers.length})</h4>
        <Table 
          columns={[
            { key: "name", label: "Offer Name" },
            { key: "code", label: "Coupon Code", render: v => <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontWeight: 700, color: C.accent }}>{v}</code> },
            { key: "value", label: "Discount Value", render: (v, r) => <b>{r.valType === "Percentage" ? `${v}%` : `₹${v.toLocaleString()}`} Off</b> },
            { key: "validity", label: "Valid Till", render: v => new Date(v).toLocaleDateString("en-IN") },
            { key: "applicableProducts", label: "Target Products", render: v => (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 220 }}>
                  {(v || ["All Products"]).map(p => (
                    <Badge text={p} color={p === "All Products" ? "blue" : "green"} key={p} />
                  ))}
                </div>
              )
            },
            { key: "status", label: "Status", render: v => <Badge text={v} color={v === "Active" ? "green" : "gray"} /> },
            { key: "id", label: "Actions", render: (v, r) => (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="xs" variant="outline" onClick={() => toggleOfferStatus(r.id)}>
                    {r.status === "Active" ? "Deactivate" : "Activate"}
                  </Btn>
                  <Btn size="xs" variant="ghost" style={{ color: C.danger }} onClick={() => deleteOffer(r.id)}>🗑 Delete</Btn>
                </div>
              )
            }
          ]} 
          data={filteredOffers} 
        />
      </Card>

      <Card>
        <h4 style={{ margin: "0 0 14px" }}>➕ Create New {activeTabType}</h4>
        
        {/* Dynamic Products Checklist */}
        <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 14 }}>
          <h5 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: C.text }}>🎯 Select Target Product(s) for this Discount</h5>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 120, overflowY: "auto", padding: "4px 0" }}>
            {data.products.map(p => {
              const isChecked = selectedProds.includes(p.name);
              return (
                <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, background: isChecked ? "#eff6ff" : "#fff", padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${isChecked ? C.accent : "#e2e8f0"}`, cursor: "pointer", userSelect: "none" }}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedProds(selectedProds.filter(name => name !== p.name));
                      } else {
                        setSelectedProds([...selectedProds, p.name]);
                      }
                    }}
                  />
                  <strong>{p.name}</strong>
                </label>
              );
            })}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: C.muted }}>
            {selectedProds.length === 0 
              ? "⚠️ No specific products selected. This discount will be treated as applicable to All Products." 
              : `Selected ${selectedProds.length} product(s).`}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 12 }}>
          <Input label="Offer Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Festival Sale" />
          <Input label="Coupon Code (Optional)" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} placeholder="e.g. FESTIVAL10" />
          <Select label="Value Type" value={form.valType} onChange={v => setForm(f => ({ ...f, valType: v }))} options={["Percentage", "Flat Amount"]} />
          <Input label="Discount Value" value={form.value} onChange={v => setForm(f => ({ ...f, value: v }))} type="number" placeholder="e.g. 10 or 100" />
          <Input label="Valid Till" value={form.validity} onChange={v => setForm(f => ({ ...f, validity: v }))} type="date" />
          <Select label="Offer Type Category" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={["Bill Discount", "Item Discount", "Combo Offer", "Buy X Get Y", "Coupon"]} />
        </div>
        <Btn onClick={createOffer}>Create Offer</Btn>
      </Card>
      
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Accounting ───────────────────────────────────────────────────────────────
function Accounting() {
  const [tab, setTab] = useState("ledger");
  const [toast, setToast] = useState("");
  return (
    <div>
      <Tabs tabs={[["ledger","📒 Ledger"],["vouchers","🧾 Vouchers"],["cashbank","💰 Cash & Bank"],["outstanding","📊 Outstanding"],["reports","📈 P&L"]]} active={tab} onChange={setTab} />
      {tab === "ledger" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📒 Account Ledger</h4>
          <Table columns={[
            { key: "date", label: "Date" }, { key: "narration", label: "Narration" }, { key: "debit", label: "Debit", render: v => v ? <span style={{ color: C.danger }}>₹{v.toLocaleString()}</span> : "—" },
            { key: "credit", label: "Credit", render: v => v ? <span style={{ color: C.success }}>₹{v.toLocaleString()}</span> : "—" }, { key: "balance", label: "Balance" },
          ]} data={[
            { date: "16/01/24", narration: "Opening Balance", debit: null, credit: 500000, balance: "₹5,00,000" },
            { date: "16/01/24", narration: "Cash Sales (Bill KC-0001)", debit: null, credit: 1240, balance: "₹5,01,240" },
            { date: "16/01/24", narration: "Supplier Payment - Agro Foods", debit: 15000, credit: null, balance: "₹4,86,240" },
          ]} />
        </Card>
      )}
      {tab === "vouchers" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>🧾 Voucher Entry</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Select label="Type" value="" onChange={() => {}} options={["Receipt","Payment","Journal","Contra"]} />
            <Input label="Date" value="" onChange={() => {}} type="date" />
            <Input label="Ledger Account" value="" onChange={() => {}} />
            <Input label="Amount" value="" onChange={() => {}} type="number" />
          </div>
          <Input label="Narration" value="" onChange={() => {}} />
          <Btn onClick={() => setToast("Voucher saved!")}>Save Voucher</Btn>
        </Card>
      )}
      {tab === "cashbank" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatCard label="Cash in Hand" value="₹48,240" icon="💵" />
          <StatCard label="Bank Balance" value="₹3,45,000" icon="🏦" />
          <StatCard label="UPI Received" value="₹18,300" icon="📱" />
        </div>
      )}
      {tab === "outstanding" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📊 Outstanding Summary</h4>
          <Table columns={[
            { key: "party", label: "Party" }, { key: "type", label: "Type" }, { key: "amount", label: "Amount", render: v => `₹${v.toLocaleString()}` }, { key: "due", label: "Due Date" },
          ]} data={[
            { party: "Priya Sharma", type: "Customer", amount: 2500, due: "Feb 15" },
            { party: "Agro Foods", type: "Supplier", amount: 45000, due: "Feb 13" },
            { party: "Metro Wholesale", type: "Supplier", amount: 28500, due: "Feb 28" },
          ]} />
        </Card>
      )}
      {tab === "reports" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatCard label="Revenue" value="₹2,84,820" icon="📈" sub="This Month" />
          <StatCard label="Expenses" value="₹78,500" icon="📉" sub="This Month" />
          <StatCard label="Gross Profit" value="₹2,06,320" icon="💰" sub="72.4% margin" />
        </div>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── GST ─────────────────────────────────────────────────────────────────────
function GST() {
  const [data] = useGlobalStore();
  const [tab, setTab] = useState("summary");
  const [toast, setToast] = useState("");

  const outputGst = data.bills.reduce((s, b) => s + (b.gst || 0), 0);
  const inputGst = Math.round(data.purchaseOrders.reduce((s, po) => s + (po.amount || 0), 0) * 0.12);
  const netPayable = Math.max(0, outputGst - inputGst);

  // Group GST slabs
  const slabs = {
    0: { taxable: 0, cgst: 0, sgst: 0, total: 0 },
    5: { taxable: 0, cgst: 0, sgst: 0, total: 0 },
    12: { taxable: 0, cgst: 0, sgst: 0, total: 0 },
    18: { taxable: 0, cgst: 0, sgst: 0, total: 0 },
    28: { taxable: 0, cgst: 0, sgst: 0, total: 0 }
  };
  
  data.bills.forEach(b => {
    (b.cartItems || []).forEach(item => {
      const slab = item.gst === undefined ? 5 : item.gst;
      const taxable = item.salePrice * item.qty;
      const tax = taxable * slab / 100;
      if (slabs[slab] === undefined) {
        slabs[slab] = { taxable: 0, cgst: 0, sgst: 0, total: 0 };
      }
      slabs[slab].taxable += taxable;
      slabs[slab].total += tax;
      slabs[slab].cgst += tax / 2;
      slabs[slab].sgst += tax / 2;
    });
  });

  const slabData = Object.keys(slabs).map(slab => ({
    slab: `${slab}%`,
    taxable: `₹${Math.round(slabs[slab].taxable).toLocaleString()}`,
    cgst: `₹${Math.round(slabs[slab].cgst).toLocaleString()}`,
    sgst: `₹${Math.round(slabs[slab].sgst).toLocaleString()}`,
    total: `₹${Math.round(slabs[slab].total).toLocaleString()}`
  }));

  const salesRegisterData = data.bills.map(b => ({
    id: b.id,
    date: b.date,
    customer: b.customer || "Walk-in",
    taxable: `₹${Math.round(b.subtotal).toLocaleString()}`,
    gst: `₹${Math.round(b.gst).toLocaleString()}`,
    total: `₹${Math.round(b.total).toLocaleString()}`
  }));

  const purchaseRegisterData = data.purchaseOrders.map(po => {
    const taxable = Math.round(po.amount / 1.12);
    const gst = po.amount - taxable;
    return {
      id: po.id,
      date: po.date,
      customer: po.supplier,
      taxable: `₹${taxable.toLocaleString()}`,
      gst: `₹${gst.toLocaleString()}`,
      total: `₹${po.amount.toLocaleString()}`
    };
  });

  // Group by HSN code
  const hsnMap = {};
  data.bills.forEach(b => {
    (b.cartItems || []).forEach(item => {
      const prod = data.products.find(p => p.sku === item.sku);
      const hsn = prod?.hsn || "Unassigned";
      const hsnDesc = data.hsnCodes?.find(h => h.code === hsn)?.description || "Other Supplies";
      const taxable = item.salePrice * item.qty;
      const tax = taxable * (item.gst || 0) / 100;
      
      if (!hsnMap[hsn]) {
        hsnMap[hsn] = { code: hsn, desc: hsnDesc, qty: 0, unit: prod?.unit || "Unit", taxable: 0, gst: item.gst || 0, tax: 0 };
      }
      hsnMap[hsn].qty += item.qty;
      hsnMap[hsn].taxable += taxable;
      hsnMap[hsn].tax += tax;
    });
  });

  const hsnRegisterData = Object.values(hsnMap).map(h => ({
    hsn: h.code,
    desc: h.desc,
    qty: `${h.qty} ${h.unit}s`,
    taxable: `₹${Math.round(h.taxable).toLocaleString()}`,
    rate: `${h.gst}%`,
    tax: `₹${Math.round(h.tax).toLocaleString()}`
  }));

  return (
    <div>
      <Tabs tabs={[["summary","📋 Summary"],["sales","📤 Sales Register"],["purchase","📥 Purchase Register"],["hsn","🔖 HSN"],["gstr","📑 GSTR Export"]]} active={tab} onChange={setTab} />
      {tab === "summary" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <StatCard label="Output GST" value={`₹${Math.round(outputGst).toLocaleString()}`} icon="📤" />
            <StatCard label="Input GST" value={`₹${Math.round(inputGst).toLocaleString()}`} icon="📥" />
            <StatCard label="Net Payable" value={`₹${Math.round(netPayable).toLocaleString()}`} icon="💰" />
          </div>
          <Card>
            <Table columns={[
              { key: "slab", label: "GST Slab" }, { key: "taxable", label: "Taxable" }, { key: "cgst", label: "CGST" }, { key: "sgst", label: "SGST" }, { key: "total", label: "Total Tax" },
            ]} data={slabData} />
          </Card>
        </>
      )}
      {(tab === "sales" || tab === "purchase") && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>{tab === "sales" ? "📤 Sales Register" : "📥 Purchase Register"}</h4>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <select style={{ padding: "7px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff" }}>
              <option>May 2026</option>
              <option>April 2026</option>
            </select>
            <Btn size="sm" variant="outline" onClick={() => setToast(`${tab === "sales" ? "Sales" : "Purchase"} Register exported!`)}>📥 Export</Btn>
          </div>
          <Table columns={[
            { key: "id", label: "Invoice / PO #" }, { key: "date", label: "Date" }, { key: "customer", label: "Party" },
            { key: "taxable", label: "Taxable" }, { key: "gst", label: "GST" }, { key: "total", label: "Total" },
          ]} data={tab === "sales" ? salesRegisterData : purchaseRegisterData} />
        </Card>
      )}
      {tab === "hsn" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>🔖 HSN Register Summary</h4>
          <Table columns={[
            { key: "hsn", label: "HSN" }, { key: "desc", label: "Description" }, { key: "qty", label: "Qty" }, { key: "taxable", label: "Taxable" }, { key: "rate", label: "Rate" }, { key: "tax", label: "Tax" },
          ]} data={hsnRegisterData} />
        </Card>
      )}
      {tab === "gstr" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📑 GSTR Filing Hub</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[["GSTR-1","Outward Supply","Monthly"],["GSTR-3B","Summary Return","Monthly"],["GSTR-2A","Inward Supply","Auto"]].map(([name,desc,freq])=>(
              <div key={name} style={{ border: "2px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{desc}</div>
                <Badge text={freq} color="blue" />
                <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                  <Btn size="sm" variant="outline" onClick={() => setToast(`${name} exported!`)}>📥 Download</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setToast(`${name} filed!`)}>📤 File</Btn>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <Btn variant="outline" onClick={() => setToast("E-Invoice generated!")}>🔗 E-Invoice</Btn>
            <Btn variant="outline" onClick={() => setToast("E-Way Bill created!")}>🚚 E-Way Bill</Btn>
          </div>
        </Card>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Reports ─────────────────────────────────────────────────────────────────
function Reports() {
  const [data] = useGlobalStore();
  const [toast, setToast] = useState("");
  const [viewingReport, setViewingReport] = useState(null);

  const cats = [
    { icon: "💰", title: "Sales Reports", items: ["Daily Sales","Item-wise Sales","Cashier-wise","Payment-wise","Category-wise"] },
    { icon: "📦", title: "Inventory Reports", items: ["Current Stock","Stock Movement","Near Expiry","Reorder List","Stock Valuation"] },
    { icon: "🛍️", title: "Purchase Reports", items: ["Purchase Summary","Supplier-wise","GRN Report","Rate Analysis"] },
    { icon: "📋", title: "GST Reports", items: ["GSTR-1","GSTR-3B","HSN Summary","Tax Register"] },
    { icon: "💸", title: "Expense Reports", items: ["Expense Summary","Category-wise","Monthly Trend"] },
    { icon: "📈", title: "Profitability", items: ["P&L Statement","Branch P&L","Product Margin","Trend Analysis"] },
  ];

  const renderReportContent = () => {
    if (!viewingReport) return null;
    const title = viewingReport.title;

    if (title.includes("Sales") || title.includes("Cashier") || title.includes("Payment")) {
      const totalSales = data.bills.reduce((s, b) => s + b.total, 0);
      const totalTax = data.bills.reduce((s, b) => s + b.gst, 0);
      const paymentBreakdown = { Cash: 0, UPI: 0, Card: 0, Mixed: 0 };
      data.bills.forEach(b => {
        paymentBreakdown[b.payment] = (paymentBreakdown[b.payment] || 0) + b.total;
      });

      return (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <StatCard label="Gross Sales" value={`₹${totalSales.toLocaleString()}`} icon="💰" />
            <StatCard label="GST Taxes" value={`₹${totalTax.toLocaleString()}`} icon="📋" />
            <StatCard label="Total Invoices" value={data.bills.length} icon="🧾" />
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 13, margin: "0 0 10px", color: C.text }}>💳 Payment Breakdown</h5>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
            {Object.entries(paymentBreakdown).map(([mode, amt]) => (
              <div key={mode} style={{ background: "#f8fafc", borderRadius: 8, padding: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>{mode.toUpperCase()}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.accent, marginTop: 4 }}>₹{amt.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 13, margin: "0 0 10px", color: C.text }}>🧾 Invoice Details</h5>
          <Table 
            columns={[
              { key: "id", label: "Invoice #" },
              { key: "date", label: "Date" },
              { key: "customer", label: "Customer" },
              { key: "total", label: "Amount", render: v => <b>₹{v}</b> },
              { key: "payment", label: "Payment Mode" }
            ]}
            data={data.bills}
          />
        </div>
      );
    }

    if (title.includes("Stock") || title.includes("Valuation") || title.includes("Expiry")) {
      const totalStockVal = data.products.reduce((s, p) => s + (p.salePrice * p.stock), 0);
      const totalCostVal = data.products.reduce((s, p) => s + (p.purchasePrice * p.stock), 0);
      const potentialProfit = totalStockVal - totalCostVal;

      return (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <StatCard label="Cost Valuation" value={`₹${totalCostVal.toLocaleString()}`} icon="💰" />
            <StatCard label="Retail Valuation" value={`₹${totalStockVal.toLocaleString()}`} icon="🏪" />
            <StatCard label="Potential Margin" value={`₹${potentialProfit.toLocaleString()}`} icon="📈" />
          </div>
          <h5 style={{ fontWeight: 800, fontSize: 13, margin: "0 0 10px", color: C.text }}>📦 High Value Inventory Valuation</h5>
          <Table 
            columns={[
              { key: "sku", label: "SKU" },
              { key: "name", label: "Product Name" },
              { key: "stock", label: "In Stock" },
              { key: "purchasePrice", label: "Cost Price", render: v => `₹${v}` },
              { key: "salePrice", label: "Retail Price", render: v => `₹${v}` },
              { key: "stock", label: "Retail Value", render: (v, r) => <b>₹{(v * r.salePrice).toLocaleString()}</b> }
            ]}
            data={data.products}
          />
        </div>
      );
    }

    if (title.includes("P&L") || title.includes("Profitability") || title.includes("Margin")) {
      const totalSales = data.bills.reduce((s, b) => s + b.total, 0);
      
      let cogs = 0;
      data.bills.forEach(b => {
        (b.cartItems || []).forEach(item => {
          const prodObj = data.products.find(p => p.sku === item.sku || p.name === item.name);
          const cost = prodObj ? prodObj.purchasePrice : item.salePrice * 0.75;
          cogs += cost * item.qty;
        });
      });

      const approvedExpenses = data.expenses.filter(e => e.status === "Approved").reduce((s, e) => s + e.amount, 0);
      const grossProfit = totalSales - cogs;
      const netProfit = grossProfit - approvedExpenses;

      return (
        <div>
          <Card style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", padding: 18, marginBottom: 14 }}>
            <h5 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 800, color: C.text, textTransform: "uppercase" }}>Profit & Loss Ledger (Dynamic)</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 6 }}>
                <span style={{ color: C.muted }}>(+) Gross Revenue / Billings</span>
                <strong>₹{totalSales.toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 6, color: C.danger }}>
                <span>(−) Cost of Goods Sold (COGS)</span>
                <strong>−₹{cogs.toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #cbd5e1", paddingBottom: 8, fontSize: 14, fontWeight: 800, color: C.success }}>
                <span>(=) Gross Profit Margin</span>
                <span>₹{grossProfit.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 6, color: C.danger }}>
                <span>(−) Operating Expenses (Rent, Salary, etc.)</span>
                <strong>−₹{approvedExpenses.toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontSize: 18, fontWeight: 800, color: netProfit >= 0 ? C.accent : C.danger }}>
                <span>(=) Net Operating Income (Profit)</span>
                <span>₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          </Card>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>* COGS is dynamically calculated from exact supplier procurement costs mapped against active customer checkout metrics.</p>
        </div>
      );
    }

    return (
      <div>
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: "14px 16px", border: `1.5px solid ${C.accent}`, marginBottom: 16 }}>
          <h5 style={{ margin: "0 0 4px", color: C.text, fontSize: 13.5 }}>📊 Consolidating dynamic logs...</h5>
          <p style={{ margin: 0, fontSize: 12, color: C.muted }}>The specific report ledger has been compiled and is ready for brand dispatch.</p>
        </div>
        <h5 style={{ fontWeight: 800, fontSize: 13, margin: "0 0 10px", color: C.text }}>📋 Historic Ledger Logs</h5>
        <Table 
          columns={[
            { key: "id", label: "Ledger ID", render: (v, r) => <b style={{ color: C.accent }}>REG-{(r.id || 102)}</b> },
            { key: "supplier", label: "Counterparty", render: (v, r) => v || r.customer || "System" },
            { key: "date", label: "Date" },
            { key: "amount", label: "Ledger Amount", render: (v, r) => <b>₹{(v || r.total || 0).toLocaleString()}</b> }
          ]}
          data={[...data.purchaseOrders, ...data.bills].slice(0, 5)}
        />
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <StatCard label="Total Bills" value={data.bills.length} icon="🧾" />
        <StatCard label="Revenue" value={`₹${data.bills.reduce((s,b)=>s+b.total,0).toLocaleString()}`} icon="💰" />
        <StatCard label="Avg Bill" value={`₹${data.bills.length ? Math.round(data.bills.reduce((s,b)=>s+b.total,0)/data.bills.length) : 0}`} icon="📊" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
        {cats.map(cat => (
          <Card key={cat.title}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700 }}>{cat.icon} {cat.title}</h4>
            {cat.items.map(item => (
              <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 12 }}>{item}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <Btn size="sm" variant="ghost" onClick={() => setViewingReport({ title: item })}>View</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setToast(`${item} downloaded!`)}>📥</Btn>
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>

      {viewingReport && (
        <Modal title={`📊 Live Report — ${viewingReport.title}`} onClose={() => setViewingReport(null)} width={700}>
          {renderReportContent()}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", marginTop: 16, paddingTop: 14 }}>
            <Btn variant="ghost" onClick={() => setViewingReport(null)}>Close Report</Btn>
            <Btn variant="outline" onClick={() => setToast("Excel Export Initiated!")}>📊 Export Excel</Btn>
            <Btn onClick={() => window.print()}>🖨️ Print Report</Btn>
          </div>
        </Modal>
      )}

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function Settings() {
  const [tab, setTab] = useState("company");
  const [toast, setToast] = useState("");
  const [company, setCompany] = useState({ name: "KC Supermarket", gst: "03AABCK1234Z1Z5", address: "Hall Bazaar, Amritsar, Punjab - 143001", phone: "0183-234567", email: "info@kcsupermarket.com", financialYear: "Apr-Mar", currency: "INR" });
  return (
    <div>
      <Tabs tabs={[["company","🏢 Company"],["gst","📋 GST"],["receipt","🧾 Receipt"],["notifications","🔔 Notifications"],["security","🔐 Security"]]} active={tab} onChange={setTab} />
      {tab === "company" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>🏢 Company Details</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Company Name" value={company.name} onChange={v=>setCompany(c=>({...c,name:v}))} />
            <Input label="GST Number" value={company.gst} onChange={v=>setCompany(c=>({...c,gst:v}))} />
            <Input label="Phone" value={company.phone} onChange={v=>setCompany(c=>({...c,phone:v}))} />
            <Input label="Email" value={company.email} onChange={v=>setCompany(c=>({...c,email:v}))} />
            <Select label="Financial Year" value={company.financialYear} onChange={v=>setCompany(c=>({...c,financialYear:v}))} options={["Apr-Mar","Jan-Dec"]} />
            <Select label="Currency" value={company.currency} onChange={v=>setCompany(c=>({...c,currency:v}))} options={["INR","USD"]} />
          </div>
          <Input label="Address" value={company.address} onChange={v=>setCompany(c=>({...c,address:v}))} />
          <Btn onClick={() => setToast("Settings saved!")}>Save Settings</Btn>
        </Card>
      )}
      {tab === "gst" && (
        <Card>
          <h4 style={{ margin: "0 0 14px" }}>📋 GST Configuration</h4>
          {["0%","5%","12%","18%","28%"].map(slab=>(
            <div key={slab} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f8fafc", borderRadius: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>{slab}</span>
              <div style={{ fontSize: 12, color: C.muted }}>CGST: {parseFloat(slab)/2}% | SGST: {parseFloat(slab)/2}%</div>
              <Btn size="sm" variant="ghost" onClick={() => setToast("HSN viewed!")}>View HSN</Btn>
            </div>
          ))}
        </Card>
      )}
      {tab === "receipt" && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <Select label="Receipt Template" value="" onChange={() => {}} options={["Standard A4","POS Thermal 80mm","POS Thermal 58mm"]} />
              <Select label="Invoice Template" value="" onChange={() => {}} options={["GST Invoice","Non-GST Bill","Retail Receipt"]} />
              {[["Print Logo",true],["Print QR Code",true],["Print GST Breakup",true]].map(([label,def])=>(
                <div key={label} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input type="checkbox" defaultChecked={def} id={label} onChange={() => setToast("Saved!")} />
                  <label htmlFor={label} style={{ fontSize: 13 }}>{label}</label>
                </div>
              ))}
              <Btn onClick={() => setToast("Template saved!")}>Save</Btn>
            </div>
            <div style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: 16, textAlign: "center", background: "#f8fafc", fontFamily: "monospace", fontSize: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{company.name}</div>
              <div style={{ fontSize: 10, color: C.muted }}>GSTIN: {company.gst}</div>
              <div style={{ borderTop: "1px dashed #ccc", margin: "8px 0", padding: "4px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Basmati Rice</span><span>₹420</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Toor Dal</span><span>₹148</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>TOTAL</span><span>₹568</span></div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>Thank you! 🙏</div>
            </div>
          </div>
        </Card>
      )}
      {tab === "notifications" && (
        <Card>
          {[["Low Stock Alerts",true],["Expiry Alerts",true],["Daily Summary",true],["PO Approval",true],["Payment Receipts",true]].map(([name,def])=>(
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
              <input type="checkbox" defaultChecked={def} onChange={() => setToast("Saved!")} />
            </div>
          ))}
        </Card>
      )}
      {tab === "security" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <h4 style={{ margin: "0 0 12px" }}>🔑 Password Policy</h4>
            {[["Min Length","8 characters"],["Numbers","Required"],["Symbols","Required"],["Expiry","90 days"]].map(([k,v])=>(
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
                <span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}><Btn size="sm" onClick={() => setToast("Policy updated!")}>Update</Btn></div>
          </Card>
          <Card>
            <h4 style={{ margin: "0 0 12px" }}>🔒 Session</h4>
            <Select label="Auto Logout" value="" onChange={() => {}} options={["15 minutes","30 minutes","1 hour","Never"]} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" id="twofa" />
              <label htmlFor="twofa" style={{ fontSize: 13 }}>Enable 2FA</label>
            </div>
            <div style={{ marginTop: 12 }}><Btn size="sm" onClick={() => setToast("Saved!")}>Save</Btn></div>
          </Card>
        </div>
      )}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useGlobalStore();

  // Overlays
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [clearedNotifIds, setClearedNotifIds] = useState([]);
  const [toast, setToast] = useState("");

  // Profile Edit
  const admin = data.adminProfile || { name: "Admin User", email: "admin@kcsupermarket.com", phone: "9876543210", password: "admin123" };
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", curPass: "", newPass: "", confPass: "" });

  const startEditProfile = () => {
    setProfileForm({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      curPass: "",
      newPass: "",
      confPass: ""
    });
    setShowProfileModal(true);
  };

  const saveProfile = () => {
    if (!profileForm.name) { setToast("Name is required!"); return; }
    
    // Check if password change is requested
    if (profileForm.curPass || profileForm.newPass || profileForm.confPass) {
      if (profileForm.curPass !== admin.password) {
        setToast("Current password is incorrect!");
        return;
      }
      if (!profileForm.newPass || profileForm.newPass.length < 8) {
        setToast("New password must be at least 8 characters long!");
        return;
      }
      if (profileForm.newPass !== profileForm.confPass) {
        setToast("New passwords do not match!");
        return;
      }
    }

    setData(d => ({
      ...d,
      adminProfile: {
        name: profileForm.name,
        email: profileForm.email || "",
        phone: profileForm.phone || "",
        password: profileForm.newPass ? profileForm.newPass : admin.password
      }
    }));
    
    setToast("Profile settings saved successfully!");
    setShowProfileModal(false);
  };

  // Dynamic notifications aggregation
  const lowStockAlerts = data.products
    .filter(p => p.stock < 10)
    .map(p => ({
      id: `stock-${p.id}`,
      type: "stock",
      icon: "⚠️",
      title: "Low Stock Alert",
      text: `${p.name} has only ${p.stock} units remaining (Rack ${p.rack || "—"}).`,
      color: "red",
      actionLabel: "Restock Inventory",
      targetNav: "products"
    }));

  const pendingExpenseAlerts = data.expenses
    .filter(e => e.status === "Pending")
    .map(e => ({
      id: `expense-${e.id}`,
      type: "expense",
      icon: "💸",
      title: "Pending Expense Approval",
      text: `${e.category} request of ₹${e.amount} requires authorization.`,
      color: "yellow",
      actionLabel: "View Expenses",
      targetNav: "expenses"
    }));

  const pendingPOAlerts = data.purchaseOrders
    .filter(po => po.status === "Pending")
    .map(po => ({
      id: `po-${po.id}`,
      type: "po",
      icon: "🛍️",
      title: "PO Awaiting Review",
      text: `Purchase Order PO-${po.id} from ${po.supplier} (₹${po.amount.toLocaleString()}) needs approval.`,
      color: "blue",
      actionLabel: "Review PO",
      targetNav: "purchases"
    }));

  const allNotificationsList = [...lowStockAlerts, ...pendingExpenseAlerts, ...pendingPOAlerts];
  const visibleNotifications = allNotificationsList.filter(n => !clearedNotifIds.includes(n.id));
  const notificationsCount = visibleNotifications.length;

  const pageTitle = navItems.find(n => n.id === activeNav)?.label || "";
  const pageIcon = navItems.find(n => n.id === activeNav)?.icon || "";

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 58 : 218, background: C.sidebar, color: "#fff", display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: sidebarCollapsed ? "16px 12px" : "16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarCollapsed(c => !c)}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🛒</span>
          {!sidebarCollapsed && <div><div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.02em" }}>KC Supermarket</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>ERP System v3.0</div></div>}
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sidebarCollapsed ? "10px 16px" : "9px 14px", background: activeNav === item.id ? "rgba(14,165,233,0.2)" : "transparent", border: "none", color: activeNav === item.id ? "#38bdf8" : "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 12.5, fontWeight: activeNav === item.id ? 700 : 400, borderLeft: activeNav === item.id ? "3px solid #38bdf8" : "3px solid transparent", transition: "all 0.12s", textAlign: "left", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </nav>
        {!sidebarCollapsed && (
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            <strong style={{ color: "rgba(255,255,255,0.65)" }}>{admin.name}</strong> · KC Main Store
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 20px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{pageIcon}</span>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>{pageTitle}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Dynamic Notification Bell */}
            <div style={{ position: "relative", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#f8fafc" }} onClick={() => setShowNotifDrawer(true)}>
              <span style={{ fontSize: 16 }}>🔔</span>
              {notificationsCount > 0 && <span style={{ position: "absolute", top: -2, right: -2, background: C.danger, color: "#fff", borderRadius: 99, fontSize: 8, fontWeight: 800, padding: "1px 4.5px", lineHeight: 1 }}>{notificationsCount}</span>}
            </div>
            {/* Dynamic Admin Profile Block */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 8px", borderRadius: 8, transition: "background 0.15s" }} 
              onClick={startEditProfile}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{admin.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
          {activeNav === "dashboard" && <Dashboard />}
          {activeNav === "pos" && <POS />}
          {activeNav === "products" && <Products />}
          {activeNav === "inventory" && <Inventory />}
          {activeNav === "purchases" && <Purchases />}
          {activeNav === "customers" && <Customers />}
          {activeNav === "suppliers" && <Suppliers />}
          {activeNav === "expenses" && <Expenses />}
          {activeNav === "discounts" && <Discounts />}
          {activeNav === "accounting" && <Accounting />}
          {activeNav === "gst" && <GST />}
          {activeNav === "reports" && <Reports />}
          {activeNav === "branches" && <Branches />}
          {activeNav === "franchises" && <Franchises />}
          {activeNav === "users" && <Users />}
          {activeNav === "settings" && <Settings />}
        </div>
      </div>

      {/* Notification Drawer (Slide Over Panel) */}
      {showNotifDrawer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", justifyContent: "flex-end" }} onClick={() => setShowNotifDrawer(false)}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 360, height: "100%", display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(15,23,42,0.12)" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🔔</span>
                <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: C.text }}>Notifications Drawer ({visibleNotifications.length})</h3>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {visibleNotifications.length > 0 && (
                  <button onClick={() => { setClearedNotifIds(allNotificationsList.map(n => n.id)); setToast("All notifications dismissed"); }} style={{ border: "none", background: "none", color: C.accent, fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Dismiss All</button>
                )}
                <button onClick={() => setShowNotifDrawer(false)} style={{ background: "#f1f5f9", border: "none", fontSize: 16, cursor: "pointer", color: C.muted, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {visibleNotifications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "100px 20px", color: C.muted }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: C.text }}>All cleared up!</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>No system alerts or approvals are pending.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {visibleNotifications.map(n => (
                    <div key={n.id} style={{ border: "1.5px solid #e2e8f0", borderRadius: 10, padding: 12, display: "flex", gap: 10, position: "relative", background: "#fcfdfd" }}>
                      <span style={{ fontSize: 18, flexShrink: 0, padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", height: 26, width: 26, background: n.color === "red" ? "#fee2e2" : n.color === "yellow" ? "#fef3c7" : "#dbeafe" }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 12.5, color: C.text }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                          <button onClick={() => { setActiveNav(n.targetNav); setShowNotifDrawer(false); }} style={{ background: "rgba(14,165,233,0.1)", border: "none", color: C.accent, padding: "4px 10px", borderRadius: 6, fontSize: 10.5, fontWeight: 800, cursor: "pointer" }}>{n.actionLabel}</button>
                          <button onClick={() => setClearedNotifIds(prev => [...prev, n.id])} style={{ background: "transparent", border: "none", color: C.muted, padding: "4px 8px", borderRadius: 6, fontSize: 10.5, cursor: "pointer" }}>Dismiss</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Profile Settings Modal */}
      {showProfileModal && (
        <Modal title="👤 Edit Admin Profile Settings" onClose={() => setShowProfileModal(false)} width={500}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e2e8f0" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{admin.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>System Super Administrator · {admin.email}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              <Input label="Administrator Name" value={profileForm.name} onChange={v => setProfileForm(f => ({ ...f, name: v }))} required />
              <Input label="Email Address" value={profileForm.email} onChange={v => setProfileForm(f => ({ ...f, email: v }))} type="email" />
              <Input label="Contact Mobile" value={profileForm.phone} onChange={v => setProfileForm(f => ({ ...f, phone: v }))} />
            </div>

            <div style={{ borderTop: "1.5px dashed #e2e8f0", marginTop: 8, paddingTop: 14 }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 13, color: C.text, fontWeight: 800 }}>🔒 Change Account Password</h4>
              <p style={{ margin: "0 0 12px", fontSize: 11, color: C.muted }}>Leave password fields blank if you do not wish to modify your account password.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <Input label="Current Password" value={profileForm.curPass} onChange={v => setProfileForm(f => ({ ...f, curPass: v }))} type="password" placeholder="Enter current admin password" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="New Password" value={profileForm.newPass} onChange={v => setProfileForm(f => ({ ...f, newPass: v }))} type="password" placeholder="Min. 8 characters" />
                  <Input label="Confirm New Password" value={profileForm.confPass} onChange={v => setProfileForm(f => ({ ...f, confPass: v }))} type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
              <Btn variant="ghost" onClick={() => setShowProfileModal(false)}>Cancel</Btn>
              <Btn onClick={saveProfile}>Save Profile Settings</Btn>
            </div>
          </div>
        </Modal>
      )}

      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}
