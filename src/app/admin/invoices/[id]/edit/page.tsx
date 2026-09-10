"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Trash2, ArrowLeft, Search, Terminal } from "lucide-react";
import Link from "next/link";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "" });
  const [items, setItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState("PAID");
  const [dueDate, setDueDate] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState(0);
  
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCustomer(json.data.customer);
        setItems(json.data.items.map((i: any) => ({ ...i, stock: '?' }))); // Real stock will update if we search
        setDiscount(json.data.discount);
        setStatus(json.data.status);
        if (json.data.dueDate) {
          const date = new Date(json.data.dueDate);
          setDueDate(date.toISOString().split('T')[0]);
        }
        if (json.data.advanceAmount) {
          setAdvanceAmount(json.data.advanceAmount);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (query = "") => {
    try {
      const res = await fetch(`/api/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoice();
    fetchProducts();
  }, [id]);

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
        dueDate: (status === "DUE" || status === "PARTIAL DUE") && dueDate ? dueDate : undefined,
        advanceAmount: (status === "DUE" || status === "PARTIAL DUE") ? Number(advanceAmount) : 0,
      };

      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      
      if (json.success) {
        router.push(`/admin/invoices/${id}`);
      } else {
        setError(json.message || "Failed to update invoice");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-cyan-400 light:text-slate-900 font-bold tracking-widest light:tracking-normal p-8 animate-pulse">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8 border-b border-cyan-500/30 light:border-slate-300 pb-4">
        <Link href={`/admin/invoices/${id}`} className="p-2 border border-cyan-900 light:border-slate-300 bg-black/50 light:bg-white hover:bg-cyan-950/50 hover:border-cyan-500/50 transition-colors text-cyan-600 light:text-slate-700 hover:text-cyan-400 light:hover:text-indigo-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal inline-flex items-center gap-2">
          <Terminal size={24} />
          Edit Invoice
        </h1>
        <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1 inline-block"></span>
      </div>

      {error && <div className="p-4 mb-6 bg-red-950/30 light:bg-red-50 border border-red-500/50 light:border-red-200 text-red-500 font-bold tracking-widest light:tracking-normal text-xs shadow-[0_0_15px_rgba(239,68,68,0.2)]">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <div className="bg-black/80 light:bg-white backdrop-blur-md p-6 md:p-8 border border-cyan-500/50 light:border-slate-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
          <h2 className="text-lg font-bold text-cyan-400 light:text-slate-900 mb-6 tracking-widest light:tracking-normal border-b border-cyan-900 light:border-slate-300 pb-2">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1">Name *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                <input required type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors placeholder-cyan-900" placeholder="Customer Name" />
              </div>
            </div>
            <div className="group">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                <input type="text" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors placeholder-cyan-900" placeholder="+00 0000" />
              </div>
            </div>
            <div className="group">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1">Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                <input type="text" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors placeholder-cyan-900" placeholder="Address" />
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-black/80 light:bg-white backdrop-blur-md p-6 md:p-8 border border-cyan-500/50 light:border-slate-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
          <h2 className="text-lg font-bold text-cyan-400 light:text-slate-900 mb-6 tracking-widest light:tracking-normal border-b border-cyan-900 light:border-slate-300 pb-2">
            Products
          </h2>
          
          <div className="relative mb-6 z-20">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 light:text-slate-700 font-bold">{">"}</span>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setIsProductListOpen(true);
                }}
                onFocus={() => setIsProductListOpen(true)}
                className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors placeholder-cyan-900"
              />
            </div>
            
            {isProductListOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 light:bg-white border border-cyan-500/80 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] max-h-60 overflow-y-auto z-50">
                <div className="p-2 flex justify-end border-b border-cyan-900/50">
                  <button type="button" onClick={() => setIsProductListOpen(false)} className="text-[10px] font-bold tracking-widest light:tracking-normal text-cyan-600 light:text-slate-700 hover:text-cyan-400 light:hover:text-indigo-600 transition-colors">ABORT</button>
                </div>
                {products.length === 0 ? (
                  <div className="p-4 text-center text-cyan-700 light:text-slate-600 text-xs font-bold tracking-widest light:tracking-normal">No results found</div>
                ) : (
                  products.map(p => (
                    <div 
                      key={p._id} 
                      onClick={() => addProduct(p)}
                      className="p-3 hover:bg-cyan-950/50 cursor-pointer flex justify-between items-center transition-colors border-b border-cyan-900/30 group"
                    >
                      <div>
                        <div className="text-cyan-300 light:text-slate-900 font-bold group-hover:text-cyan-100">{p.name}</div>
                        <div className="text-[10px] tracking-widest light:tracking-normal text-cyan-600 light:text-slate-700">Stock: {p.stock}</div>
                      </div>
                      <div className="text-cyan-400 light:text-slate-900 font-bold tracking-widest light:tracking-normal">৳{p.standardPrice}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-cyan-900 light:border-slate-300 bg-cyan-950/30 light:bg-white">
                  <th className="py-3 px-4 text-cyan-600 light:text-slate-700 font-bold text-xs tracking-widest light:tracking-normal w-1/3">Product</th>
                  <th className="py-3 px-4 text-cyan-600 light:text-slate-700 font-bold text-xs tracking-widest light:tracking-normal">Quantity</th>
                  <th className="py-3 px-4 text-cyan-600 light:text-slate-700 font-bold text-xs tracking-widest light:tracking-normal">Price</th>
                  <th className="py-3 px-4 text-cyan-600 light:text-slate-700 font-bold text-xs tracking-widest light:tracking-normal text-right">Total</th>
                  <th className="py-3 px-4 text-cyan-600 light:text-slate-700 font-bold text-xs tracking-widest light:tracking-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-cyan-700 light:text-slate-600 text-xs font-bold tracking-widest light:tracking-normal">
                      No items added to the invoice.
                    </td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={index} className="border-b border-cyan-900/50 hover:bg-cyan-950/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-cyan-300 light:text-slate-900">{item.name}</div>
                      {item.stock !== '?' && <div className={`text-[10px] tracking-widest ${item.quantity > item.stock ? "text-red-500" : "text-cyan-600"}`}>Stock: {item.stock}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-20 bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-2 py-1 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value={item.unitPrice} 
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        className="w-24 bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-2 py-1 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      />
                    </td>
                    <td className="py-3 px-4 text-right text-cyan-400 light:text-slate-900 font-bold tracking-widest light:tracking-normal">
                      ৳{(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-500/50 transition-colors inline-block"
                      >
                        <Trash2 size={16} />
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
          <div className="bg-black/80 light:bg-white backdrop-blur-md p-6 md:p-8 border border-cyan-500/50 light:border-slate-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] h-fit relative">
            <h2 className="text-lg font-bold text-cyan-400 light:text-slate-900 mb-6 tracking-widest light:tracking-normal border-b border-cyan-900 light:border-slate-300 pb-2">
              Invoice Status
            </h2>
            <div className="group">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1">Status</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors appearance-none"
                >
                  <option value="PAID">Paid</option>
                  <option value="DUE">Due</option>
                  <option value="PARTIAL DUE">Partial Due</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            
            {(status === "DUE" || status === "PARTIAL DUE") && (
              <div className="group mt-4">
                <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1">Due Date *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                  <input 
                    required 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-black/80 light:bg-white backdrop-blur-md p-6 md:p-8 border border-cyan-500/50 light:border-slate-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
            <h2 className="text-lg font-bold text-cyan-400 light:text-slate-900 mb-6 tracking-widest light:tracking-normal border-b border-cyan-900 light:border-slate-300 pb-2">
              Summary
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal text-sm font-bold">
                <span>Subtotal</span>
                <span className="text-cyan-300 light:text-slate-900">৳{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal text-sm font-bold">
                <span>Discount (৳)</span>
                <input 
                  type="number" 
                  min="0"
                  value={discount} 
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 px-2 py-1 text-cyan-300 light:text-slate-900 text-right focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                />
              </div>
              
              <div className="pt-4 border-t border-cyan-900/50 flex justify-between items-center">
                <span className="text-lg font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal">Grand Total</span>
                <span className="text-2xl font-bold text-cyan-300 light:text-slate-900 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">৳{grandTotal.toLocaleString()}</span>
              </div>
              
              {(status === "DUE" || status === "PARTIAL DUE") && (
                <>
                  <div className="flex justify-between items-center text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal text-sm font-bold mt-4">
                    <span>Advance Paid (৳)</span>
                    <input 
                      type="number" 
                      min="0"
                      value={advanceAmount} 
                      onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                      className="w-24 bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 px-2 py-1 text-cyan-300 light:text-slate-900 text-right focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    />
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-red-400 light:text-red-600 tracking-widest light:tracking-normal">Total Due</span>
                    <span className="text-xl font-bold text-red-500 light:text-red-600">৳{Math.max(0, grandTotal - advanceAmount).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full mt-8 bg-cyan-950/50 light:bg-slate-200 disabled:opacity-50 text-cyan-400 light:text-slate-900 font-bold py-4 border border-cyan-500/50 light:border-slate-300 hover:bg-cyan-900/50 light:hover:bg-indigo-50 hover:text-cyan-300 light:hover:text-indigo-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all tracking-widest light:tracking-normal text-sm"
            >
              {saving ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
