import { prisma } from "@/lib/db/prisma";

export async function getExpenses() {
  return await prisma.expense.findMany({
    orderBy: { date: "desc" },
  });
}

export async function createExpense(data: {
  category: string;
  amount: number;
  description?: string;
  paidBy?: string;
  storeBranchId?: string;
}) {
  return await prisma.expense.create({
    data: {
      ...data,
      status: "Approved",
    },
  });
}
