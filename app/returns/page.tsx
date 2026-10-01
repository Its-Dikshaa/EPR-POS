import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";

export default function ReturnsPage() {
  return (
    <AppLayout>
      <Card>
        <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>🔁 Sales Returns & Refund Management</h3>
        <p style={{ fontSize: 13, color: "#64748b" }}>Process bill refunds, restock returned inventory, and issue store credit vouchers.</p>
      </Card>
    </AppLayout>
  );
}
