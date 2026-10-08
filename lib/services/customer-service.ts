import { prisma } from "@/lib/db/prisma";

export async function getCustomers(search?: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return await prisma.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomer(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  group?: string;
}) {
  return await prisma.customer.create({
    data: {
      ...data,
      loyaltyPoints: 100, // Starter loyalty bonus
    },
  });
}
