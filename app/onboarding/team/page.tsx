"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Btn } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/lib/store/app-context";

export default function OnboardingTeamPage() {
  const router = useRouter();
  const { setOnboardingStep, showToast } = useAppStore();

  const [staffEmail, setStaffEmail] = useState("");
  const [role, setRole] = useState("Cashier");
  const [invitedList, setInvitedList] = useState<{ email: string; role: string }[]>([]);

  const handleAddInvite = () => {
    if (!staffEmail.trim()) return;
    setInvitedList([...invitedList, { email: staffEmail, role }]);
    setStaffEmail("");
    showToast(`Added ${role} invitation for ${staffEmail}! ✉️`);
  };

  const handleFinish = () => {
    if (invitedList.length > 0) {
      showToast(`Sent ${invitedList.length} staff invitations! ✉️`);
    }
    setOnboardingStep("complete");
    router.push("/onboarding/complete");
  };

  const handleSkip = () => {
    setOnboardingStep("complete");
    router.push("/onboarding/complete");
  };

  return (
    <OnboardingShell
      currentStep="team"
      title="Who's helping you run the store?"
      subtitle="Invite cashiers, managers, and inventory staff (Optional)"
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px auto", gap: 10, alignItems: "flex-end" }}>
          <Input
            label="Staff Email Address"
            type="email"
            value={staffEmail}
            onChange={setStaffEmail}
            placeholder="cashier@supermarket.com"
          />
          <Select
            label="Role"
            value={role}
            onChange={setRole}
            options={["Cashier", "Manager", "Inventory Staff"]}
          />
          <Btn onClick={handleAddInvite} disabled={!staffEmail} style={{ marginBottom: 14 }}>
            + Add
          </Btn>
        </div>

        {invitedList.length > 0 && (
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
              Pending Invitations ({invitedList.length}):
            </div>
            {invitedList.map((inv, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
                <span>{inv.email}</span>
                <span style={{ fontWeight: 700, color: "#0ea5e9" }}>{inv.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <button
          type="button"
          onClick={() => router.push("/onboarding/pos")}
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
            I'll do this later
          </button>
          <Btn onClick={handleFinish}>
            {invitedList.length > 0 ? "Send Invites & Complete →" : "Finish Setup →"}
          </Btn>
        </div>
      </div>
    </OnboardingShell>
  );
}
