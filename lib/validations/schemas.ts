import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(2, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  mrp: z.coerce.number().min(0, "MRP must be positive"),
  salePrice: z.coerce.number().min(0, "Sale price must be positive"),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  gst: z.coerce.number().min(0, "GST rate is required"),
  hsn: z.string().optional(),
  unit: z.string().default("Pack"),
  barcode: z.string().optional(),
  rack: z.string().optional(),
  status: z.string().default("Active"),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  creditLimit: z.coerce.number().min(0).default(5000),
  group: z.string().default("Regular"),
});

export const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name is required"),
  contact: z.string().optional(),
  phone: z.string().optional(),
  gst: z.string().optional(),
  address: z.string().optional(),
  creditDays: z.coerce.number().default(30),
});

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["Admin", "Super Admin", "Manager", "Cashier", "Inventory Staff"]),
  branch: z.string().default("KC Main Store"),
  status: z.string().default("Active"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
