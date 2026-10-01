"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-context";

export default function OnboardingPosPage() {
  const router = useRouter();
  const { posInfo, setPosInfo, setOnboardingStep } = useAppStore();

  const [terminalName, setTerminalName] = useState(posInfo.terminalName || "Main Billing Counter");
  const [terminalsCount, setTerminalsCount] = useState(posInfo.terminalsCount || 1);
  const [cash, setCash] = useState(true);
  const [upi, setUpi] = useState(true);
  const [card, setCard] = useState(true);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentMethods = [];
    if (cash) paymentMethods.push("Cash");
    if (upi) paymentMethods.push("UPI");
    if (card) paymentMethods.push("Card");

    setPosInfo({ terminalName, terminalsCount, paymentMethods });
    setOnboardingStep("team");
    router.push("/onboarding/team");
  };

  const handleSkip = () => {
    setOnboardingStep("team");
    router.push("/onboarding/team");
  };

  return (
    <OnboardingShell
      currentStep="pos"
      title="Set up your billing counter"
      subtitle="Configure basic POS payment channels and counter names"
      onSaveExit={() => {
        setOnboardingStep("pos");
        router.push("/dashboard");
      }}
    >
      <form onSubmit={handleNext}>
        <Input
          label="Primary Terminal / Counter Name"
          value={terminalName}
          onChange={setTerminalName}
          placeholder="Main Counter"
          required
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase" }}>
            How many POS terminals do you operate?
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={terminalsCount}
            onChange={(e) => setTerminalsCount(parseInt(e.target.value) || 1)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase" }}>
            Accepted Payment Methods
          </label>
          <div style={{ display: "flex", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={cash} onChange={(e) => setCash(e.target.checked)} />
              💵 Cash
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={upi} onChange={(e) => setUpi(e.target.checked)} />
              📱 UPI / QR Code
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={card} onChange={(e) => setCard(e.target.checked)} />
              💳 Credit / Debit Card
            </label>
          </div>
        </div>

        <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, fontSize: 11, color: "#64748b", marginBottom: 20 }}>
          ℹ️ Thermal receipt printer configuration & barcode hardware setup can be configured later from Settings.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
          <button
            type="button"
            onClick={() => router.push("/onboarding/products")}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
          >
            ← Back
          </button>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              type="button"
              onClick={handleSkip}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
            >
              Configure later
            </button>
            <Btn type="submit">Continue →</Btn>
          </div>
        </div>
      </form>
    </OnboardingShell>
  );
}
