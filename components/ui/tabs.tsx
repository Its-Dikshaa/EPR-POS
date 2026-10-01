"use client";

import React, { useEffect } from "react";

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: 32,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 13,
          outline: "none",
          width: 220,
          background: "#fff",
        }}
      />
    </div>
  );
}

export function Toast({
  msg,
  onClose,
  type = "success",
}: {
  msg: string | null;
  onClose: () => void;
  type?: "success" | "error";
}) {
  useEffect(() => {
    if (msg) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [msg, onClose]);

  if (!msg) return null;
  const bg = type === "error" ? "#ef4444" : "#10b981";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: bg,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {type === "success" ? "✅" : "❌"} {msg}
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: [string, string][];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
      {tabs.map(([k, l]) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            background: active === k ? "#0ea5e9" : "#f1f5f9",
            color: active === k ? "#fff" : "#1e293b",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
