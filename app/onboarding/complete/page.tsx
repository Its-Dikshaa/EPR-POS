"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Btn } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/app-context";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { businessInfo, storeInfo, setIsOnboardingCompleted, setOnboardingStep } = useAppStore();

  const handleGoDashboard = () => {
    setIsOnboardingCompleted(true);
    setOnboardingStep("complete");
    router.push("/dashboard");
  };

  return (
    <OnboardingShell
      currentStep="complete"
      title="🎉 Your store is ready!"
      subtitle={`${storeInfo.name || "KC Main Store"} (${businessInfo.name || "KC Supermarket"}) is fully initialized.`}
    >
      <div style={{ textAlign: "center", margin: "16px 0 28px" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#f0fdf4",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 16px",
            boxShadow: "0 8px 20px rgba(16,185,129,0.2)",
          }}
        >
          ✓
        </div>

        <div style={{ background: "#fafafa", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, textAlign: "left" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>
            Setup Summary
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
            <div style={{ color: "#10b981", fontWeight: 700 }}>✓ Business Profile</div>
            <div style={{ color: "#10b981", fontWeight: 700 }}>✓ Store & Location</div>
            <div style={{ color: "#10b981", fontWeight: 700 }}>✓ Products Catalog Loaded</div>
            <div style={{ color: "#10b981", fontWeight: 700 }}>✓ POS Counter Configured</div>
            <div style={{ color: "#64748b" }}>○ Team Access (Optional)</div>
            <div style={{ color: "#64748b" }}>○ Receipt Printer (Optional)</div>
          </div>
        </div>
      </div>

      <Btn onClick={handleGoDashboard} style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14 }}>
        🚀 Go to Dashboard & Start Billing →
      </Btn>
    </OnboardingShell>
  );
}
