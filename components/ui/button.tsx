import React from "react";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "success" | "danger" | "outline" | "ghost" | "warning" | "purple";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  style: ex,
  type = "button",
}: BtnProps) {
  const vs: Record<string, React.CSSProperties> = {
    primary: { background: "#0ea5e9", color: "#fff", border: "none" },
    success: { background: "#10b981", color: "#fff", border: "none" },
    danger: { background: "#ef4444", color: "#fff", border: "none" },
    outline: { background: "transparent", color: "#0ea5e9", border: "1.5px solid #0ea5e9" },
    ghost: { background: "#f1f5f9", color: "#1e293b", border: "none" },
    warning: { background: "#f59e0b", color: "#fff", border: "none" },
    purple: { background: "#8b5cf6", color: "#fff", border: "none" },
  };

  const ss: Record<string, React.CSSProperties> = {
    sm: { padding: "4px 10px", fontSize: 11 },
    md: { padding: "8px 16px", fontSize: 13 },
    lg: { padding: "11px 24px", fontSize: 15 },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...vs[variant],
        ...ss[size],
        borderRadius: 8,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        ...ex,
      }}
    >
      {children}
    </button>
  );
}
