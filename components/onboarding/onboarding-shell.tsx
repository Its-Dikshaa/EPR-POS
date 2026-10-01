"use client";

import React from "react";
import Link from "next/link";
import { ProgressSteps } from "../ui/progress-steps";

interface OnboardingShellProps {
  children: React.ReactNode;
  currentStep: "business" | "store" | "products" | "pos" | "team" | "complete";
  title: string;
  subtitle?: string;
  onSaveExit?: () => void;
}

export function OnboardingShell({
  children,
  currentStep,
  title,
  subtitle,
  onSaveExit,
}: OnboardingShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Navigation */}
      <header
        style={{
          height: 64,
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#0ea5e9",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            KC
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e293b" }}>KC Supermarket</h1>
            <span style={{ fontSize: 10, color: "#0ea5e9", fontWeight: 700 }}>Store Onboarding</span>
          </div>
        </div>

        {onSaveExit && (
          <button
            onClick={onSaveExit}
            style={{
              background: "transparent",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              cursor: "pointer",
            }}
          >
            💾 Save & Exit
          </button>
        )}
      </header>

      {/* Main Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px 20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 600 }}>
          {/* Progress Indicator */}
          {currentStep !== "complete" && <ProgressSteps currentStep={currentStep} />}

          {/* Form Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 36px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>{title}</h2>
              {subtitle && (
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{subtitle}</p>
              )}
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
