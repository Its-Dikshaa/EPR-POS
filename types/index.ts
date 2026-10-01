export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER' | 'INVENTORY_STAFF';

export interface ProductItem {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  mrp: number;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  gst: number;
  hsn: string;
  unit: string;
  barcode: string;
  rack: string;
  status: string;
}

export interface CustomerItem {
  id: number | string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  creditLimit: number;
  outstanding: number;
  group: string;
}

export interface SupplierItem {
  id: number | string;
  name: string;
  contact?: string;
  phone?: string;
  gst?: string;
  address?: string;
  outstanding: number;
  creditDays: number;
}

export interface CartItem extends ProductItem {
  qty: number;
}

export interface BillItem {
  id: string;
  date: string;
  customer: string;
  customerPhone?: string;
  items: number;
  total: number;
  subtotal: number;
  gst: number;
  discount: number;
  payment: string;
  status: string;
  cashier?: string;
  branch?: string;
  cartItems: CartItem[];
  cashPaid?: number;
  changeReturn?: number;
}

export interface ExpenseItem {
  id: number | string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: string;
  paidBy: string;
}

export interface BranchItem {
  id: number | string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  status: string;
  sales: number;
  type: string;
  email: string;
  gst: string;
  openTime: string;
  closeTime: string;
  staff: number;
  franchise: boolean;
}

export interface FranchiseItem {
  id: number | string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  location: string;
  royaltyPct: number;
  startDate: string;
  status: string;
  sales: number;
  agreement: string;
  depositPaid: number;
}

export interface UserItem {
  id: number | string;
  name: string;
  username: string;
  role: string;
  branch: string;
  status: string;
  lastLogin: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  items: number;
  amount: number;
  status: string;
}

export interface DiscountItem {
  id: number | string;
  name: string;
  type: string;
  valType: string;
  value: number;
  validity: string;
  status: string;
  code: string;
  applicableProducts: string[];
}
