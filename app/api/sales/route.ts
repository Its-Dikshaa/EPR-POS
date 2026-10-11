import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        saleItems: true,
      },
    });
    return NextResponse.json({ success: true, data: sales });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const subtotal = Number(body.subtotal ?? body.totalAmount ?? body.total ?? 0);
    const gstAmount = Number(body.gstAmount ?? body.gst ?? body.taxAmount ?? 0);
    const discount = Number(body.discount ?? 0);
    const total = Number(body.total ?? body.totalAmount ?? (subtotal + gstAmount - discount));
    const billNo = body.billNo || body.invoiceNo || `KC-${Date.now()}`;
    const customerName = body.customerName || body.customer || "Walk-in";
    const paymentMethod = (body.paymentMethod || body.payment || "CASH").toUpperCase() as any;

    const newSale = await prisma.sale.create({
      data: {
        billNo,
        customerName,
        customerPhone: body.customerPhone || null,
        subtotal,
        gstAmount,
        discount,
        total,
        paymentMethod,
        cashPaid: body.cashPaid ? Number(body.cashPaid) : null,
        changeReturn: body.changeReturn ? Number(body.changeReturn) : null,
        status: "COMPLETED",
        saleItems: body.items?.length
          ? {
              create: body.items.map((i: any) => ({
                productId: i.productId,
                name: i.name || "Item",
                quantity: Number(i.quantity || 1),
                price: Number(i.price || 0),
                gstRate: Number(i.gstRate || i.tax || 0),
                total: Number(i.total || (i.price * (i.quantity || 1))),
              })),
            }
          : undefined,
      },
      include: {
        saleItems: true,
      },
    });
    return NextResponse.json({ success: true, data: newSale }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create sale" },
      { status: 400 }
    );
  }
}
