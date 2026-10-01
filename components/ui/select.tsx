import React from "react";

interface OptionItem {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string | number;
  onChange: (val: string) => void;
  options: (string | OptionItem)[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div style={{ marginBottom: 14 }}>
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
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 13,
          color: "#1e293b",
          outline: "none",
          background: "#fff",
          boxSizing: "border-box",
        }}
      >
        {options.map((o) => {
          const val = typeof o === "object" ? o.value : o;
          const lbl = typeof o === "object" ? o.label : o;
          return (
            <option key={String(val)} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}
