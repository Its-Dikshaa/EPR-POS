import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KC Supermarket Database...");

  // 1. Create Default Branch
  const mainBranch = await prisma.storeBranch.upsert({
    where: { id: "branch-main" },
    update: {},
    create: {
      id: "branch-main",
      name: "KC Main Store",
      location: "Hall Bazaar, Amritsar",
      manager: "Sunil Kapoor",
      phone: "0183-234567",
      email: "main@kcsuper.com",
      gst: "03AABCK1234Z1Z5",
      openTime: "8:00 AM",
      closeTime: "10:00 PM",
      staffCount: 12,
    },
  });

  // 2. Create Categories
  const categories = ["Grains", "Pulses", "Oils", "Flour", "Dairy", "Instant Food", "Detergent", "Personal Care"];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat },
    });
  }

  // 3. Create Brands
  const brands = ["India Gate", "Tata", "Fortune", "Aashirvaad", "Amul", "Nestle", "HUL", "Colgate"];
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { name: b },
      update: {},
      create: { name: b },
    });
  }

  // 4. Create Initial Products
  const sampleProducts = [
    { name: "Basmati Rice 5kg", sku: "RICE001", categoryName: "Grains", brandName: "India Gate", mrp: 450, salePrice: 420, purchasePrice: 320, gstRate: 5, hsnCode: "1006", unit: "Bag", barcode: "8901234567890", rackPosition: "A1" },
    { name: "Toor Dal 1kg", sku: "DAL001", categoryName: "Pulses", brandName: "Tata", mrp: 160, salePrice: 148, purchasePrice: 110, gstRate: 5, hsnCode: "0713", unit: "Kg", barcode: "8901234567891", rackPosition: "A2" },
    { name: "Sunflower Oil 1L", sku: "OIL001", categoryName: "Oils", brandName: "Fortune", mrp: 175, salePrice: 162, purchasePrice: 130, gstRate: 5, hsnCode: "1512", unit: "Litre", barcode: "8901234567892", rackPosition: "B1" },
  ];

  for (const p of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
