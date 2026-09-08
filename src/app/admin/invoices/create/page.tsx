"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function CreateInvoicePage() {
  const router = useRouter();
  
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
  const [items, setItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState("PAID");
  
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async (query = "") => {
    try {
      const res = await fetch(`/api/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(productSearch);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [productSearch]);

  const addProduct = (product: any) => {
    if (items.find(i => i.productId === product._id)) {
      alert("Product already added.");
      return;
    }
    setItems([...items, {
      productId: product._id,
      name: product.name,
      stock: product.stock,
      quantity: 1,
      unitPrice: product.standardPrice,
    }]);
    setIsProductListOpen(false);
    setProductSearch("");
  };

  const updateItem = (index: number, field: string, value: number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        customer,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
        discount: Number(discount),
        status,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      
      if (json.success) {
        router.push(`/admin/invoices/${json.data._id}`);
      } else {
        setError(json.message || "Failed to create invoice");
      }
    } catch (error) {
      setError("An error occurred while creating the invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/invoices" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-white">Create Invoice</h1>
      </div>

      {error && <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <div className="glass p-6 md:p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Name *</label>
              <input required type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <input type="text" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Address</label>
              <input type="text" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="glass p-6 md:p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Products</h2>
          
          <div className="relative mb-6 z-20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search to add product..." 
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setIsProductListOpen(true);
                }}
                onFocus={() => setIsProductListOpen(true)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            
            {isProductListOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                <div className="p-2 flex justify-end">
                  <button type="button" onClick={() => setIsProductListOpen(false)} className="text-xs text-gray-400 hover:text-white">Close</button>
                </div>
                {products.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No products found</div>
                ) : (
                  products.map(p => (
                    <div 
                      key={p._id} 
                      onClick={() => addProduct(p)}
                      className="p-3 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors border-t border-white/5"
                    >
                      <div>
                        <div className="text-white font-medium">{p.name}</div>
                        <div className="text-xs text-gray-400">Stock: {p.stock}</div>
                      </div>
                      <div className="text-teal-400">৳{p.standardPrice}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-gray-400 font-medium w-1/3">Product</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Quantity</th>
                  <th className="py-3 px-4 text-gray-400 font-medium">Unit Price (৳)</th>
                  <th className="py-3 px-4 text-gray-400 font-medium text-right">Total</th>
                  <th className="py-3 px-4 text-gray-400 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No products added yet. Use the search above to add products.
                    </td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className={`text-xs ${item.quantity > item.stock ? "text-red-400" : "text-gray-400"}`}>
                        Stock: {item.stock}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-teal-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={item.unitPrice} 
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        className="w-24 bg-white/5 border border-teal-500/50 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-teal-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      ৳{(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors inline-block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-6 md:p-8 rounded-2xl h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Invoice Status</h2>
            <div>
              <label className="text-sm font-medium text-gray-300">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="PAID">PAID</option>
                <option value="DUE">DUE</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
          
          <div className="glass p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-300">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-gray-300">
                <span>Discount (৳)</span>
                <input 
                  type="number" 
                  min="0"
                  value={discount} 
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-right focus:outline-none focus:border-teal-500"
                />
              </div>
              
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Grand Total</span>
                <span className="text-2xl font-bold text-teal-400">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full mt-8 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-black font-bold py-3 rounded-lg shadow-lg transition-all"
            >
              {saving ? "Creating Invoice..." : "Save Invoice"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
