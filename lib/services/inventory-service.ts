import { prisma } from "@/lib/db/prisma";

export async function getInventoryStock(branchId?: string) {
  const where = branchId ? { storeBranchId: branchId } : {};
  return await prisma.inventory.findMany({
    where,
    include: {
      product: true,
      storeBranch: true,
    },
  });
}

export async function adjustStockQuantity(data: {
  productId: string;
  storeBranchId: string;
  adjustment: number;
  reason: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.upsert({
      where: {
        productId_storeBranchId: {
          productId: data.productId,
          storeBranchId: data.storeBranchId,
        },
      },
      update: {
        stockQuantity: {
          increment: data.adjustment,
        },
      },
      create: {
        productId: data.productId,
        storeBranchId: data.storeBranchId,
        stockQuantity: Math.max(0, data.adjustment),
      },
    });

    await tx.stockMovement.create({
      data: {
        productId: data.productId,
        type: data.adjustment >= 0 ? "PURCHASE" : "ADJUSTMENT",
        quantity: data.adjustment,
        reason: data.reason,
      },
    });

    return inv;
  });
}
