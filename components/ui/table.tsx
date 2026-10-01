import React from "react";
import { Btn } from "./button";

export interface Column<T = any> {
  key: string;
  label: string;
  render?: (val: any, row: T) => React.ReactNode;
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onAction?: (action: "view" | "edit" | "delete", row: T) => void;
}

export function Table<T extends Record<string, any>>({ columns, data, onAction }: TableProps<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {columns.map((col) => (
              <th
                key={col.key + col.label}
                style={{
                  padding: "9px 12px",
                  textAlign: "left",
                  fontWeight: 700,
                  color: "#64748b",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: "2px solid #e2e8f0",
                  whiteSpace: "nowrap",
                }}
              >
                {col.label}
              </th>
            ))}
            {onAction && (
              <th
                style={{
                  padding: "9px 12px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: "#64748b",
                  fontSize: 11,
                  textTransform: "uppercase",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: "1px solid #f1f5f9" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              {columns.map((col) => (
                <td key={col.key + col.label} style={{ padding: "10px 12px", color: "#1e293b", whiteSpace: "nowrap" }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {onAction && (
                <td style={{ padding: "7px 12px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                    <Btn size="sm" variant="outline" onClick={() => onAction("view", row)}>
                      👁
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={() => onAction("edit", row)}>
                      ✏️
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={() => onAction("delete", row)} style={{ color: "#ef4444" }}>
                      🗑
                    </Btn>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div style={{ textAlign: "center", padding: 32, color: "#64748b", fontSize: 13 }}>No records found</div>
      )}
    </div>
  );
}
