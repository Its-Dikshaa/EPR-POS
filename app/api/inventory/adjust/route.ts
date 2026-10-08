import { NextResponse } from "next/server";
import { adjustStockQuantity } from "@/lib/services/inventory-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await adjustStockQuantity({
      productId: body.productId,
      storeBranchId: body.storeBranchId || "branch-main",
      adjustment: parseInt(body.adjustment),
      reason: body.reason || "Manual Stock Adjustment",
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
