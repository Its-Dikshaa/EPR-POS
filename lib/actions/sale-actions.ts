"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function createSaleAction(saleData: {
  billNo: string;
  customerName: string;
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "MIXED";
}) {
  try {
    const sale = await prisma.sale.create({
      data: {
        billNo: saleData.billNo,
        customerName: saleData.customerName,
        subtotal: saleData.subtotal,
        gstAmount: saleData.gstAmount,
        discount: saleData.discount,
        total: saleData.total,
        paymentMethod: saleData.paymentMethod,
        status: "COMPLETED",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/pos");
    return { success: true, data: sale };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to process sale action" };
  }
}
