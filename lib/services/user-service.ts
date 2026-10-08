import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      storeBranch: true,
    },
  });
}

export async function createUser(data: {
  name: string;
  username: string;
  email?: string;
  password?: string;
  role: Role;
  storeBranchId?: string;
}) {
  return await prisma.user.create({
    data,
  });
}
