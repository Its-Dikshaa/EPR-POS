"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-context";

export default function OnboardingProductsPage() {
  const router = useRouter();
  const { data, setOnboardingStep, showToast } = useAppStore();

  const [mode, setMode] = useState<"choose" | "manual" | "import">("choose");
  const [csvUploaded, setCsvUploaded] = useState(false);

  // Quick manual item state
  const [prodName, setProdName] = useState("");
  const [mrp, setMrp] = useState("100");
  const [salePrice, setSalePrice] = useState("90");

  const handleNext = () => {
    setOnboardingStep("pos");
    router.push("/onboarding/pos");
  };

  const handleSkip = () => {
    showToast("Product setup skipped. You can add products anytime from the Products tab.");
    setOnboardingStep("pos");
    router.push("/onboarding/pos");
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    showToast(`Added starter product "${prodName}" to inventory! 📦`);
    setProdName("");
    handleNext();
  };

  const handleSimulateImport = () => {
    setCsvUploaded(true);
    showToast("CSV imported! 8 starter retail products loaded into catalog. 🚀");
    setTimeout(handleNext, 800);
  };

  return (
    <OnboardingShell
      currentStep="products"
      title="Let's add your products"
      subtitle="How would you like to populate your store inventory?"
      onSaveExit={() => {
        setOnboardingStep("products");
        router.push("/dashboard");
      }}
    >
      {mode === "choose" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Path 1: Pre-loaded Demo Catalogue */}
          <div
            onClick={handleSimulateImport}
            style={{
              border: "2px solid #0ea5e9",
              background: "#f0f9ff",
              borderRadius: 12,
              padding: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 32 }}>📁</div>
            <div>
              <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#1e293b" }}>
                Import Product List (CSV / Excel)
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Already have a product list? Upload CSV to bulk import products in seconds.
              </p>
            </div>
          </div>

          {/* Path 2: Add manually */}
          <div
            onClick={() => setMode("manual")}
            style={{
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 32 }}>✍️</div>
            <div>
              <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#1e293b" }}>
                Add Products Manually
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Add your first few products one by one with prices and barcodes.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <button
              type="button"
              onClick={() => router.push("/onboarding/store")}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSkip}
              style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Skip for now →
            </button>
          </div>
        </div>
      )}

      {mode === "manual" && (
        <form onSubmit={handleManualAdd}>
          <Input
            label="First Product Name"
            value={prodName}
            onChange={setProdName}
            placeholder="e.g. Basmati Rice 5kg"
            required
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="MRP (₹)" type="number" value={mrp} onChange={setMrp} />
            <Input label="Sale Price (₹)" type="number" value={salePrice} onChange={setSalePrice} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setMode("choose")}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
            >
              ← Back to options
            </button>
            <Btn type="submit" disabled={!prodName}>
              Add Item & Continue →
            </Btn>
          </div>
        </form>
      )}
    </OnboardingShell>
  );
}
