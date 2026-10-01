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
    const newSale = await prisma.sale.create({
      data: {
        billNo: body.billNo || `KC-${Date.now()}`,
        customerName: body.customer || "Walk-in",
        subtotal: parseFloat(body.subtotal),
        gstAmount: parseFloat(body.gst),
        discount: parseFloat(body.discount || 0),
        total: parseFloat(body.total),
        paymentMethod: body.payment?.toUpperCase() || "CASH",
        cashPaid: body.cashPaid ? parseFloat(body.cashPaid) : null,
        changeReturn: body.changeReturn ? parseFloat(body.changeReturn) : null,
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
