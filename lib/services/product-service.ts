import { prisma } from "@/lib/db/prisma";

export async function getProducts(search?: string, category?: string) {
  try {
    const where: any = {};
    if (category && category !== "All") {
      where.categoryName = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ];
    }

    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to retrieve products from database");
  }
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export async function createProduct(data: {
  name: string;
  sku: string;
  categoryName: string;
  brandName?: string;
  mrp: number;
  salePrice: number;
  purchasePrice: number;
  gstRate?: number;
  hsnCode?: string;
  unit?: string;
  barcode?: string;
  rackPosition?: string;
}) {
  return await prisma.product.create({
    data,
  });
}

export async function updateProduct(id: string, data: Partial<any>) {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: { id },
  });
}
