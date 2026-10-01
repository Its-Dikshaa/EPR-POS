"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/app-context";
import { Card } from "../ui/card";
import { Btn } from "../ui/button";
import { Table, Column } from "../ui/table";
import { SearchFilter } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { ProductItem } from "@/types";

export function ProductsView() {
  const { data, setData, showToast } = useAppStore();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Grains",
    brand: "India Gate",
    mrp: "100",
    salePrice: "90",
    purchasePrice: "70",
    stock: "50",
    gst: "5",
    hsn: "1006",
    unit: "Kg",
    barcode: "8900000000000",
    rack: "A1",
    status: "Active",
  });

  const filtered = data.products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      category: "Grains",
      brand: "India Gate",
      mrp: "100",
      salePrice: "90",
      purchasePrice: "70",
      stock: "50",
      gst: "5",
      hsn: "1006",
      unit: "Kg",
      barcode: `890${Date.now().toString().slice(-10)}`,
      rack: "A1",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.sku) {
      showToast("Product name and SKU are required!", "error");
      return;
    }

    if (editingProduct) {
      setData((prev: any) => ({
        ...prev,
        products: prev.products.map((p: ProductItem) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                sku: formData.sku,
                category: formData.category,
                brand: formData.brand,
                mrp: parseFloat(formData.mrp),
                salePrice: parseFloat(formData.salePrice),
                purchasePrice: parseFloat(formData.purchasePrice),
                stock: parseInt(formData.stock),
                gst: parseFloat(formData.gst),
                hsn: formData.hsn,
                unit: formData.unit,
                barcode: formData.barcode,
                rack: formData.rack,
              }
            : p
        ),
      }));
      showToast("Product updated successfully! ✅");
    } else {
      const newProd: ProductItem = {
        id: Date.now(),
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        brand: formData.brand,
        mrp: parseFloat(formData.mrp),
        salePrice: parseFloat(formData.salePrice),
        purchasePrice: parseFloat(formData.purchasePrice),
        stock: parseInt(formData.stock),
        gst: parseFloat(formData.gst),
        hsn: formData.hsn,
        unit: formData.unit,
        barcode: formData.barcode,
        rack: formData.rack,
        status: "Active",
      };
      setData((prev: any) => ({ ...prev, products: [newProd, ...prev.products] }));
      showToast("New Product created successfully! ✅");
    }
    setShowModal(false);
  };

  const handleAction = (action: string, row: ProductItem) => {
    if (action === "edit") {
      setEditingProduct(row);
      setFormData({
        name: row.name,
        sku: row.sku,
        category: row.category,
        brand: row.brand,
        mrp: String(row.mrp),
        salePrice: String(row.salePrice),
        purchasePrice: String(row.purchasePrice),
        stock: String(row.stock),
        gst: String(row.gst),
        hsn: row.hsn,
        unit: row.unit,
        barcode: row.barcode,
        rack: row.rack,
        status: row.status,
      });
      setShowModal(true);
    } else if (action === "delete") {
      setData((prev: any) => ({
        ...prev,
        products: prev.products.filter((p: ProductItem) => p.id !== row.id),
      }));
      showToast("Product deleted!", "error");
    }
  };

  const columns: Column<ProductItem>[] = [
    { key: "name", label: "Product Name", render: (v, r) => <div><strong>{v}</strong><div style={{ fontSize: 10, color: "#64748b" }}>SKU: {r.sku}</div></div> },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "mrp", label: "MRP", render: (v) => `₹${v}` },
    { key: "salePrice", label: "Sale Price", render: (v) => <strong>₹{v}</strong> },
    { key: "stock", label: "Stock", render: (v) => <Badge text={`${v}`} color={v <= 10 ? "red" : "green"} /> },
    { key: "gst", label: "GST %", render: (v) => `${v}%` },
    { key: "rack", label: "Rack" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SearchFilter value={search} onChange={setSearch} placeholder="Search product, SKU..." />
        <Btn onClick={handleOpenAdd}>+ Add New Product</Btn>
      </Card>

      <Card>
        <Table columns={columns} data={filtered} onAction={handleAction} />
      </Card>

      {showModal && (
        <Modal title={editingProduct ? "Edit Product" : "Add New Product"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Product Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
            <Input label="SKU Code" value={formData.sku} onChange={(v) => setFormData({ ...formData, sku: v })} required />
            <Select label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} options={data.categories} />
            <Select label="Brand" value={formData.brand} onChange={(v) => setFormData({ ...formData, brand: v })} options={data.brands} />
            <Input label="MRP (₹)" type="number" value={formData.mrp} onChange={(v) => setFormData({ ...formData, mrp: v })} />
            <Input label="Sale Price (₹)" type="number" value={formData.salePrice} onChange={(v) => setFormData({ ...formData, salePrice: v })} />
            <Input label="Purchase Price (₹)" type="number" value={formData.purchasePrice} onChange={(v) => setFormData({ ...formData, purchasePrice: v })} />
            <Input label="Stock Quantity" type="number" value={formData.stock} onChange={(v) => setFormData({ ...formData, stock: v })} />
            <Input label="GST %" type="number" value={formData.gst} onChange={(v) => setFormData({ ...formData, gst: v })} />
            <Input label="HSN Code" value={formData.hsn} onChange={(v) => setFormData({ ...formData, hsn: v })} />
            <Input label="Barcode" value={formData.barcode} onChange={(v) => setFormData({ ...formData, barcode: v })} />
            <Input label="Rack Location" value={formData.rack} onChange={(v) => setFormData({ ...formData, rack: v })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave}>Save Product</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
