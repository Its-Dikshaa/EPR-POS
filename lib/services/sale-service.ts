import { prisma } from "@/lib/db/prisma";

export interface CreateSaleInput {
  billNo: string;
  customerName: string;
  customerPhone?: string;
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "MIXED";
  cashPaid?: number;
  changeReturn?: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    gstRate: number;
    total: number;
  }[];
}

export async function createSaleTransaction(input: CreateSaleInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create Sale Record
    const sale = await tx.sale.create({
      data: {
        billNo: input.billNo,
        customerName: input.customerName || "Walk-in",
        customerPhone: input.customerPhone,
        subtotal: input.subtotal,
        gstAmount: input.gstAmount,
        discount: input.discount || 0,
        total: input.total,
        paymentMethod: input.paymentMethod,
        cashPaid: input.cashPaid,
        changeReturn: input.changeReturn,
        status: "COMPLETED",
        saleItems: {
          create: input.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            gstRate: item.gstRate,
            total: item.total,
          })),
        },
        payments: {
          create: {
            paymentMethod: input.paymentMethod,
            amount: input.total,
          },
        },
      },
      include: {
        saleItems: true,
        payments: true,
      },
    });

    // 2. Audit Stock Movements
    for (const item of input.items) {
      if (item.productId) {
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "SALE",
            quantity: -item.quantity,
            reason: `POS Sale Bill #${input.billNo}`,
            referenceId: sale.id,
          },
        });
      }
    }

    return sale;
  });
}

export async function getRecentSales(limit = 20) {
  return await prisma.sale.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      saleItems: true,
      payments: true,
    },
  });
}
