"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  User,
  Shield,
  KeyRound,
  Smartphone,
  Lock,
  CheckCircle2,
  Bell,
  Clock,
  Laptop,
  Check,
  Save,
  LogOut,
} from "lucide-react";

export function ProfileView() {
  const { currentUser, currentBranch, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<"details" | "security" | "permissions" | "sessions">("details");

  // Profile Form States
  const [name, setName] = useState(currentUser?.name || "Diksha (Super Admin)");
  const [username, setUsername] = useState(currentUser?.username || "dikshaa_admin");
  const [email, setEmail] = useState("admin@kcsupermarket.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [designation, setDesignation] = useState("Chief Operating Officer / Super Admin");

  // Password States
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSaveProfile = () => {
    showToast("Profile information updated successfully! 👤");
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }
    showToast("Security password changed successfully! 🔐");
    setCurrPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Admin Profile Hero Banner */}
      <div
        style={{
          padding: "24px",
          background: "linear-gradient(135deg, #0f1f35 0%, #1e293b 100%)",
          borderRadius: 16,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 4px 20px rgba(15, 31, 53, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              border: "3px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 15px rgba(14, 165, 233, 0.4)",
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{name}</h2>
              <span
                style={{
                  fontSize: 11,
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#34d399",
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontWeight: 700,
                  border: "1px solid rgba(52, 211, 153, 0.3)",
                }}
              >
                SUPER ADMIN
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
              {designation} • Active Store: <strong style={{ color: "#38bdf8" }}>{currentBranch}</strong>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{email} • {phone}</div>
          </div>
        </div>

        <Btn onClick={handleSaveProfile} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}>
          <Save size={16} /> Save Changes
        </Btn>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
        {/* Left Nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { id: "details", label: "Profile Information", icon: User },
            { id: "security", label: "Security & 2FA", icon: Lock },
            { id: "permissions", label: "Roles & Permissions", icon: Shield },
            { id: "sessions", label: "Active Sessions & Logs", icon: Laptop },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
                  boxShadow: isActive ? "0 4px 12px rgba(15, 31, 53, 0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
                  borderLeft: isActive ? "4px solid #0ea5e9" : "4px solid transparent",
                }}
              >
                <Icon size={18} color={isActive ? "#38bdf8" : "#64748b"} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div>
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === "details" && (
            <Card>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                Super Admin Account Details
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Full Name" value={name} onChange={setName} />
                <Input label="Username (Login Handle)" value={username} onChange={setUsername} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Official Email Address" value={email} onChange={setEmail} />
                <Input label="Direct Phone Number" value={phone} onChange={setPhone} />
              </div>
              <Input label="Job Title / Designation" value={designation} onChange={setDesignation} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                <Btn onClick={handleSaveProfile}>Update Profile Details</Btn>
              </div>
            </Card>
          )}

          {/* TAB 2: SECURITY & PASSWORDS */}
          {activeTab === "security" && (
            <Card>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                Authentication & Credential Security
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 500 }}>
                <Input
                  label="Current Password"
                  type="password"
                  value={currPassword}
                  onChange={setCurrPassword}
                  placeholder="••••••••"
                />
                <Input
                  label="New Strong Password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="At least 8 characters..."
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat new password..."
                />
                <Btn onClick={handleUpdatePassword} style={{ alignSelf: "flex-start" }}>
                  Save New Password
                </Btn>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                    Two-Factor Authentication (2FA Authenticator)
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Secures admin access with Google Authenticator or Microsoft Authenticator OTP
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => {
                    setTwoFactor(e.target.checked);
                    showToast(e.target.checked ? "2FA enabled!" : "2FA disabled!");
                  }}
                  style={{ width: 20, height: 20, accentColor: "#0ea5e9", cursor: "pointer" }}
                />
              </div>
            </Card>
          )}

          {/* TAB 3: PERMISSIONS MATRIX */}
          {activeTab === "permissions" && (
            <Card>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                Super Admin Access Privileges
              </h3>
              <p style={{ margin: "-8px 0 16px", fontSize: 13, color: "#64748b" }}>
                Super Admin has unrestricted root access across all 16 ERP modules, multi-branch stores, and cloud database.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  "Full POS Counter & Bill Cancellation Authority",
                  "Inventory Reorder, Damage & Stock Adjustments",
                  "Financial P&L, Expense Approval & Ledgers",
                  "GST Tax Slabs & GSTR-1 Excel Exports",
                  "Create & Manage Store Staff / Cashier Accounts",
                  "Cloud Database Backup & Factory Reset",
                  "Multi-Store & Franchise Royalty Management",
                  "Customer Khata Credit Limit Approvals",
                ].map((perm) => (
                  <div
                    key={perm}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      background: "#f0fdf4",
                      borderRadius: 8,
                      border: "1px solid #bbf7d0",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#166534",
                    }}
                  >
                    <CheckCircle2 size={16} color="#16a34a" /> {perm}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 4: SESSIONS & AUDIT LOGS */}
          {activeTab === "sessions" && (
            <Card>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
                Active Devices & Security Audit Log
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { device: "MacBook Pro (Chrome 122)", ip: "192.168.1.5 (Amritsar, IN)", status: "Current Active Session", isCurrent: true },
                  { device: "POS Touch Terminal 1 (Edge)", ip: "192.168.1.20 (Main Counter)", status: "Last active 15m ago", isCurrent: false },
                  { device: "iPhone 15 (Safari iOS)", ip: "103.21.12.8 (Mobile LTE)", status: "Last active 2h ago", isCurrent: false },
                ].map((s) => (
                  <div
                    key={s.device}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Laptop size={20} color="#0ea5e9" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{s.device}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{s.ip}</div>
                      </div>
                    </div>
                    <div>
                      {s.isCurrent ? (
                        <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
                          🟢 Active Now
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#64748b" }}>{s.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
