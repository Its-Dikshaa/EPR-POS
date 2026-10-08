"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function fetchProductsAction() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch products" };
  }
}

export async function createProductAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const categoryName = formData.get("category") as string;
    const mrp = parseFloat(formData.get("mrp") as string);
    const salePrice = parseFloat(formData.get("salePrice") as string);
    const purchasePrice = parseFloat(formData.get("purchasePrice") as string);

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        categoryName: categoryName || "Grains",
        mrp,
        salePrice,
        purchasePrice,
      },
    });

    revalidatePath("/products");
    revalidatePath("/pos");
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create product action" };
  }
}
