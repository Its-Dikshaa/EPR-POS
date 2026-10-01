"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/lib/store/app-context";

export default function OnboardingBusinessPage() {
  const router = useRouter();
  const { businessInfo, setBusinessInfo, setOnboardingStep, setIsOnboardingCompleted } = useAppStore();

  const [name, setName] = useState(businessInfo.name || "");
  const [type, setType] = useState(businessInfo.type || "Supermarket");
  const [country, setCountry] = useState(businessInfo.country || "India");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setBusinessInfo({ name, type, country });
    setOnboardingStep("store");
    setIsOnboardingCompleted(false);
    router.push("/onboarding/store");
  };

  const handleSaveExit = () => {
    setBusinessInfo({ name, type, country });
    setOnboardingStep("business");
    setIsOnboardingCompleted(false);
    router.push("/dashboard");
  };

  return (
    <OnboardingShell
      currentStep="business"
      title="Let's set up your business"
      subtitle="This will take about 2 minutes."
      onSaveExit={handleSaveExit}
    >
      <form onSubmit={handleNext}>
        <Input
          label="Business / Enterprise Name"
          value={name}
          onChange={setName}
          placeholder="e.g. KC Supermarket Pvt Ltd"
          required
        />

        <Select
          label="Business Type"
          value={type}
          onChange={setType}
          options={["Supermarket", "Grocery Store", "Retail Store", "Franchise", "Other"]}
        />

        <Select
          label="Country"
          value={country}
          onChange={setCountry}
          options={["India", "United Arab Emirates", "Singapore", "United Kingdom", "United States"]}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <button
            type="button"
            onClick={handleSaveExit}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}
          >
            Save & Exit
          </button>
          <Btn type="submit" disabled={!name} style={{ padding: "10px 24px" }}>
            Continue to Store Setup →
          </Btn>
        </div>
      </form>
    </OnboardingShell>
  );
}
