"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductItem, CustomerItem, SupplierItem, BillItem, ExpenseItem, BranchItem, FranchiseItem, UserItem, PurchaseOrder, DiscountItem } from "@/types";

const initialData = {
  products: [
    { id: 1, name: "Basmati Rice 5kg", sku: "RICE001", category: "Grains", brand: "India Gate", mrp: 450, salePrice: 420, purchasePrice: 320, stock: 142, gst: 5, hsn: "1006", unit: "Bag", barcode: "8901234567890", rack: "A1", status: "Active" },
    { id: 2, name: "Toor Dal 1kg", sku: "DAL001", category: "Pulses", brand: "Tata", mrp: 160, salePrice: 148, purchasePrice: 110, stock: 89, gst: 5, hsn: "0713", unit: "Kg", barcode: "8901234567891", rack: "A2", status: "Active" },
    { id: 3, name: "Sunflower Oil 1L", sku: "OIL001", category: "Oils", brand: "Fortune", mrp: 175, salePrice: 162, purchasePrice: 130, stock: 67, gst: 5, hsn: "1512", unit: "Litre", barcode: "8901234567892", rack: "B1", status: "Active" },
    { id: 4, name: "Aashirvaad Atta 5kg", sku: "ATT001", category: "Flour", brand: "Aashirvaad", mrp: 280, salePrice: 265, purchasePrice: 200, stock: 5, gst: 0, hsn: "1101", unit: "Bag", barcode: "8901234567893", rack: "A3", status: "Active" },
    { id: 5, name: "Amul Butter 500g", sku: "BUT001", category: "Dairy", brand: "Amul", mrp: 250, salePrice: 238, purchasePrice: 195, stock: 34, gst: 12, hsn: "0405", unit: "Pack", barcode: "8901234567894", rack: "C1", status: "Active" },
    { id: 6, name: "Maggi Noodles 70g", sku: "MAG001", category: "Instant Food", brand: "Nestle", mrp: 15, salePrice: 14, purchasePrice: 10, stock: 200, gst: 12, hsn: "1902", unit: "Pack", barcode: "8901234567895", rack: "D1", status: "Active" },
    { id: 7, name: "Surf Excel 1kg", sku: "SUR001", category: "Detergent", brand: "HUL", mrp: 220, salePrice: 205, purchasePrice: 160, stock: 45, gst: 18, hsn: "3402", unit: "Kg", barcode: "8901234567896", rack: "E1", status: "Active" },
    { id: 8, name: "Colgate 200g", sku: "COL001", category: "Personal Care", brand: "Colgate", mrp: 95, salePrice: 88, purchasePrice: 65, stock: 78, gst: 18, hsn: "3306", unit: "Tube", barcode: "8901234567897", rack: "E2", status: "Active" },
  ],
  customers: [
    { id: 1, name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@gmail.com", address: "123 Main St, Amritsar", loyaltyPoints: 450, creditLimit: 5000, outstanding: 0, group: "Regular" },
    { id: 2, name: "Priya Sharma", phone: "9876543211", email: "priya@gmail.com", address: "456 Park Ave, Amritsar", loyaltyPoints: 1200, creditLimit: 10000, outstanding: 2500, group: "Premium" },
    { id: 3, name: "Amit Singh", phone: "9876543212", email: "amit@gmail.com", address: "789 Market Rd, Amritsar", loyaltyPoints: 80, creditLimit: 3000, outstanding: 0, group: "Regular" },
  ],
  suppliers: [
    { id: 1, name: "Agro Foods Pvt Ltd", contact: "Suresh Jain", phone: "9812345678", gst: "27AAACH1234A1Z5", address: "Mumbai", outstanding: 45000, creditDays: 30 },
    { id: 2, name: "Punjab Distributors", contact: "Harpreet Singh", phone: "9812345679", gst: "03AAABP5678B1Z3", address: "Amritsar", outstanding: 12000, creditDays: 15 },
    { id: 3, name: "Metro Wholesale", contact: "Ramesh Gupta", phone: "9812345680", gst: "07AAACM9012C1Z1", address: "Delhi", outstanding: 28500, creditDays: 45 },
  ],
  bills: [
    { id: "KC-2024-0001", date: "2024-01-15", customer: "Rajesh Kumar", customerPhone: "9876543210", items: 5, total: 1240, subtotal: 1180, gst: 60, discount: 0, payment: "Cash", status: "Completed", cashier: "Amit", branch: "KC Main Store", cartItems: [{id:1,name:"Basmati Rice 5kg",sku:"RICE001",category:"Grains",brand:"India Gate",mrp:450,salePrice:420,purchasePrice:320,stock:142,gst:5,hsn:"1006",unit:"Bag",barcode:"8901234567890",rack:"A1",status:"Active",qty:2},{id:2,name:"Toor Dal 1kg",sku:"DAL001",category:"Pulses",brand:"Tata",mrp:160,salePrice:148,purchasePrice:110,stock:89,gst:5,hsn:"0713",unit:"Kg",barcode:"8901234567891",rack:"A2",status:"Active",qty:1}] },
    { id: "KC-2024-0002", date: "2024-01-15", customer: "Priya Sharma", customerPhone: "9876543211", items: 8, total: 3450, subtotal: 3100, gst: 350, discount: 0, payment: "UPI", status: "Completed", cashier: "Riya", branch: "KC Lawrence Road", cartItems: [{id:5,name:"Amul Butter 500g",sku:"BUT001",category:"Dairy",brand:"Amul",mrp:250,salePrice:238,purchasePrice:195,stock:34,gst:12,hsn:"0405",unit:"Pack",barcode:"8901234567894",rack:"C1",status:"Active",qty:3}] },
  ],
  expenses: [
    { id: 1, date: "2024-01-15", category: "Electricity", amount: 8500, description: "Monthly electricity bill", status: "Approved", paidBy: "Bank" },
    { id: 2, date: "2024-01-14", category: "Staff Salary", amount: 45000, description: "January salaries", status: "Pending", paidBy: "-" },
    { id: 3, date: "2024-01-13", category: "Rent", amount: 25000, description: "Shop rent January", status: "Approved", paidBy: "Cash" },
  ],
  branches: [
    { id: 1, name: "KC Main Store", location: "Hall Bazaar, Amritsar", manager: "Sunil Kapoor", phone: "0183-234567", status: "Active", sales: 285000, type: "Branch", email: "main@kcsuper.com", gst: "03AABCK1234Z1Z5", openTime: "8:00 AM", closeTime: "10:00 PM", staff: 12, franchise: false },
    { id: 2, name: "KC Lawrence Road", location: "Lawrence Road, Amritsar", manager: "Kavita Singh", phone: "0183-345678", status: "Active", sales: 162000, type: "Branch", email: "lawrence@kcsuper.com", gst: "03AABCK1234Z2Z6", openTime: "9:00 AM", closeTime: "9:00 PM", staff: 8, franchise: false },
  ],
  franchises: [
    { id: 1, name: "KC Batala Road", owner: "Manpreet Bains", phone: "9871234567", email: "batala@kcfranchise.com", location: "Batala Road, Amritsar", royaltyPct: 5, startDate: "2023-06-01", status: "Active", sales: 95000, agreement: "5 years", depositPaid: 200000 },
  ],
  users: [
    { id: 1, name: "Admin User", username: "admin", role: "Admin", branch: "All", status: "Active", lastLogin: "2024-01-16 09:00" },
    { id: 2, name: "Amit Cashier", username: "amit_pos", role: "Cashier", branch: "KC Main Store", status: "Active", lastLogin: "2024-01-16 08:45" },
    { id: 3, name: "Riya Manager", username: "riya_mgr", role: "Manager", branch: "KC Lawrence Road", status: "Active", lastLogin: "2024-01-15 18:30" },
  ],
  purchaseOrders: [
    { id: "PO-2024-001", supplier: "Agro Foods Pvt Ltd", date: "2024-01-14", items: 12, amount: 48500, status: "Pending" },
    { id: "PO-2024-002", supplier: "Punjab Distributors", date: "2024-01-15", items: 6, amount: 22000, status: "Approved" },
  ],
  discounts: [
    { id: 1, name: "Republic Day Sale", type: "Bill Discount", valType: "Percentage", value: 10, validity: "2026-05-31", status: "Active", code: "REP10", applicableProducts: ["All Products"] },
    { id: 2, name: "Super Saver 50", type: "Bill Discount", valType: "Flat Amount", value: 50, validity: "2026-06-30", status: "Active", code: "SAVE50", applicableProducts: ["All Products"] },
  ],
  categories: ["Grains", "Pulses", "Oils", "Flour", "Dairy", "Instant Food", "Detergent", "Personal Care"],
  brands: ["India Gate", "Tata", "Fortune", "Aashirvaad", "Amul", "Nestle", "HUL", "Colgate"],
};

export type OnboardingStep = "business" | "store" | "products" | "pos" | "team" | "complete";

export interface BusinessInfo {
  name: string;
  type: string;
  country: string;
}

export interface StoreInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logo?: string;
}

export interface PosInfo {
  terminalName: string;
  terminalsCount: number;
  paymentMethods: string[];
}

interface AppContextType {
  data: typeof initialData;
  setData: React.Dispatch<React.SetStateAction<typeof initialData>>;
  toast: { msg: string; type: "success" | "error" } | null;
  showToast: (msg: string, type?: "success" | "error") => void;
  clearToast: () => void;
  currentUser: UserItem;
  setCurrentUser: (u: UserItem) => void;
  currentBranch: string;
  setCurrentBranch: (b: string) => void;

  // Onboarding state
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (val: boolean) => void;
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  storeInfo: StoreInfo;
  setStoreInfo: React.Dispatch<React.SetStateAction<StoreInfo>>;
  posInfo: PosInfo;
  setPosInfo: React.Dispatch<React.SetStateAction<PosInfo>>;
  dismissChecklist: boolean;
  setDismissChecklist: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialData);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [currentUser, setCurrentUser] = useState<UserItem>(initialData.users[0]);
  const [currentBranch, setCurrentBranch] = useState("KC Main Store");

  // Onboarding States
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("business");
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(true); // set true by default for demo, toggled dynamically
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "KC Supermarket Pvt Ltd",
    type: "Supermarket",
    country: "India",
  });
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "KC Main Store",
    phone: "0183-234567",
    address: "Hall Bazaar",
    city: "Amritsar",
    state: "Punjab",
    pincode: "143001",
  });
  const [posInfo, setPosInfo] = useState<PosInfo>({
    terminalName: "Main Billing Counter",
    terminalsCount: 1,
    paymentMethods: ["Cash", "UPI", "Card"],
  });
  const [dismissChecklist, setDismissChecklist] = useState<boolean>(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        toast,
        showToast,
        clearToast,
        currentUser,
        setCurrentUser,
        currentBranch,
        setCurrentBranch,
        onboardingStep,
        setOnboardingStep,
        isOnboardingCompleted,
        setIsOnboardingCompleted,
        businessInfo,
        setBusinessInfo,
        storeInfo,
        setStoreInfo,
        posInfo,
        setPosInfo,
        dismissChecklist,
        setDismissChecklist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
