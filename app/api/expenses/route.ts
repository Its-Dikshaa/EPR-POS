import { NextResponse } from "next/server";
import { getExpenses, createExpense } from "@/lib/services/expense-service";

export async function GET() {
  try {
    const expenses = await getExpenses();
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newExpense = await createExpense(body);
    return NextResponse.json({ success: true, data: newExpense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
