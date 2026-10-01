"use client";

import React from "react";

export interface ProgressStepItem {
  id: "business" | "store" | "products" | "pos" | "team" | "complete";
  label: string;
}

const mainSteps: ProgressStepItem[] = [
  { id: "business", label: "Business" },
  { id: "store", label: "Store" },
  { id: "products", label: "Products" },
  { id: "pos", label: "POS Setup" },
];

export function ProgressSteps({ currentStep }: { currentStep: string }) {
  const stepOrder = ["business", "store", "products", "pos", "team", "complete"];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "between", position: "relative" }}>
        {mainSteps.map((step, idx) => {
          const isDone = stepOrder.indexOf(step.id) < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Line Connector */}
              {idx > 0 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: isDone || isCurrent ? "#0ea5e9" : "#e2e8f0",
                    transition: "background 0.3s ease",
                    margin: "0 8px",
                  }}
                />
              )}

              {/* Step Circle & Label */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isDone ? "#10b981" : isCurrent ? "#0ea5e9" : "#fff",
                    border: isCurrent ? "2px solid #0ea5e9" : isDone ? "2px solid #10b981" : "2px solid #cbd5e1",
                    color: isDone || isCurrent ? "#fff" : "#64748b",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: isCurrent ? 800 : isDone ? 700 : 500,
                    color: isCurrent ? "#0f1f35" : isDone ? "#10b981" : "#64748b",
                  }}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
