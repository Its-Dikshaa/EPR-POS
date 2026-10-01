"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/lib/store/app-context";

export default function OnboardingStorePage() {
  const router = useRouter();
  const { storeInfo, setStoreInfo, setOnboardingStep } = useAppStore();

  const [name, setName] = useState(storeInfo.name || "KC Main Store");
  const [phone, setPhone] = useState(storeInfo.phone || "0183-234567");
  const [address, setAddress] = useState(storeInfo.address || "Hall Bazaar");
  const [city, setCity] = useState(storeInfo.city || "Amritsar");
  const [state, setState] = useState(storeInfo.state || "Punjab");
  const [pincode, setPincode] = useState(storeInfo.pincode || "143001");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStoreInfo({ name, phone, address, city, state, pincode });
    setOnboardingStep("products");
    router.push("/onboarding/products");
  };

  const handleSaveExit = () => {
    setStoreInfo({ name, phone, address, city, state, pincode });
    setOnboardingStep("store");
    router.push("/dashboard");
  };

  return (
    <OnboardingShell
      currentStep="store"
      title="Tell us about your store"
      subtitle="Where will your primary POS counter operate?"
      onSaveExit={handleSaveExit}
    >
      <form onSubmit={handleNext}>
        {/* Section 1: Store Details */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 8 }}>
            1. Store Details
          </div>
          <Input
            label="Primary Outlet / Store Name"
            value={name}
            onChange={setName}
            placeholder="e.g. KC Main Store"
            required
          />
        </div>

        {/* Section 2: Contact Details */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 8 }}>
            2. Store Contact
          </div>
          <Input
            label="Store Helpline Phone"
            value={phone}
            onChange={setPhone}
            placeholder="0183-234567"
          />
        </div>

        {/* Section 3: Location */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 8 }}>
            3. Address & Location
          </div>
          <Input
            label="Street Address / Market"
            value={address}
            onChange={setAddress}
            placeholder="Hall Bazaar"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Input label="City" value={city} onChange={setCity} placeholder="Amritsar" />
            <Input label="State" value={state} onChange={setState} placeholder="Punjab" />
            <Input label="Pincode" value={pincode} onChange={setPincode} placeholder="143001" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
          <button
            type="button"
            onClick={() => router.push("/onboarding/business")}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
          >
            ← Back
          </button>

          <Btn type="submit" disabled={!name} style={{ padding: "10px 24px" }}>
            Continue to Products →
          </Btn>
        </div>
      </form>
    </OnboardingShell>
  );
}
