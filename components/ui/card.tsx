import React from "react";

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 18, ...style }}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  sub,
  color = "#0ea5e9",
}: {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "16px 18px",
        flex: 1,
        minWidth: 150,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </p>
          <p style={{ margin: "5px 0 2px", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>{value}</p>
          {sub && <p style={{ margin: 0, fontSize: 11, color: "#10b981" }}>{sub}</p>}
        </div>
        <span style={{ fontSize: 26, opacity: 0.8 }}>{icon}</span>
      </div>
    </div>
  );
}
