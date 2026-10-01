import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        categoryName: body.category || "Grains",
        brandName: body.brand || "India Gate",
        mrp: parseFloat(body.mrp),
        salePrice: parseFloat(body.salePrice),
        purchasePrice: parseFloat(body.purchasePrice),
        gstRate: parseFloat(body.gst || 5),
        hsnCode: body.hsn,
        unit: body.unit || "Pack",
        barcode: body.barcode,
        rackPosition: body.rack,
      },
    });
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
