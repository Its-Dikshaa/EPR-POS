"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Input } from "../ui/input";

export function SettingsView() {
  const { showToast } = useAppStore();
  const [storeName, setStoreName] = useState("KC Supermarket");
  const [gstNo, setGstNo] = useState("03AABCK1234Z1Z5");
  const [address, setAddress] = useState("Hall Bazaar, Amritsar, Punjab - 143001");
  const [phone, setPhone] = useState("0183-234567");

  const handleSave = () => {
    showToast("System configurations & receipt header updated! ⚙️");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>⚙️ Store Profile & Thermal Receipt Header Settings</h3>
        <Input label="Store Name" value={storeName} onChange={setStoreName} />
        <Input label="GSTIN Registration Code" value={gstNo} onChange={setGstNo} />
        <Input label="Registered Address" value={address} onChange={setAddress} />
        <Input label="Helpline Phone" value={phone} onChange={setPhone} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Btn onClick={handleSave}>Save Store Settings</Btn>
        </div>
      </Card>
    </div>
  );
}
