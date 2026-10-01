import React from "react";

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  style: s,
}: InputProps) {
  return (
    <div style={{ marginBottom: 14, ...s }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: "#64748b",
            marginBottom: 5,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
          {required && " *"}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 13,
          color: "#1e293b",
          outline: "none",
          boxSizing: "border-box",
          background: "#fff",
        }}
      />
    </div>
  );
}
