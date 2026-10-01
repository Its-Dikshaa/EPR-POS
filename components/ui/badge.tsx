import React from "react";

interface BadgeProps {
  text: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
}

export function Badge({ text, color = "blue" }: BadgeProps) {
  const colors: Record<string, [string, string]> = {
    blue: ["#eff6ff", "#1d4ed8"],
    green: ["#f0fdf4", "#166534"],
    red: ["#fef2f2", "#991b1b"],
    yellow: ["#fefce8", "#854d0e"],
    purple: ["#faf5ff", "#6b21a8"],
    gray: ["#f8fafc", "#475569"],
  };
  const [bg, tc] = colors[color] || colors.blue;
  return (
    <span
      style={{
        background: bg,
        color: tc,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
