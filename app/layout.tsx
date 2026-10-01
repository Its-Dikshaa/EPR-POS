import type { Metadata } from "next";
import { AppProvider } from "@/lib/store/app-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "KC Supermarket - ERP & POS Billing System",
  description: "Enterprise Retail ERP and Point of Sale Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
