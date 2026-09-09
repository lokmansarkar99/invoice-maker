"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Terminal } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  standardPrice: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", standardPrice: 0, stock: 0 });
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchProducts = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product._id);
      setFormData({ name: product.name, standardPrice: product.standardPrice, stock: product.stock });
    } else {
      setEditingId(null);
      setFormData({ name: "", standardPrice: 0, stock: 0 });
    }
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalSaving(true);
    setModalError("");

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          standardPrice: Number(formData.standardPrice),
          stock: Number(formData.stock),
        }),
      });
      const json = await res.json();
      
      if (json.success) {
        handleCloseModal();
        fetchProducts(search);
      } else {
        setModalError(json.message || "An error occurred");
      }
    } catch (error) {
      setModalError("Failed to save product");
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("EXECUTE DELETE? Action cannot be reversed.")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (json.success) {
          fetchProducts(search);
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-cyan-400 tracking-widest inline-flex items-center gap-2">
            <Terminal size={24} />
            SYS_INVENTORY
          </h1>
          <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1 inline-block"></span>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-400 font-bold py-2 px-4 border border-cyan-500/50 hover:border-cyan-400 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] tracking-widest text-sm"
        >
          <Plus size={18} />
          <span>ADD_NODE</span>
        </button>
      </div>

      <div className="bg-black/80 backdrop-blur-md p-6 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
        <div className="relative mb-6 group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">{">"}</span>
          <input 
            type="text" 
            placeholder="QUERY_INVENTORY..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-cyan-900 text-cyan-300 rounded-none pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyan-900 bg-cyan-950/30">
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">Product Name</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">Price</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest">Stock</th>
                <th className="py-3 px-4 text-cyan-600 font-bold text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-cyan-700 animate-pulse tracking-widest text-xs font-bold">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-red-500 tracking-widest text-xs font-bold">
                    NULL_RESULT: No records found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-cyan-900/50 hover:bg-cyan-950/30 transition-colors group">
                    <td className="py-3 px-4 font-medium text-cyan-400">{product.name}</td>
                    <td className="py-3 px-4 text-cyan-300">৳{product.standardPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-cyan-300">{product.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-cyan-600 hover:text-cyan-300 hover:bg-cyan-950/80 border border-transparent hover:border-cyan-500/50 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-700 hover:text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-500/50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 border border-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.3)] w-full max-w-md overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400"></div>
            <div className="flex justify-between items-center p-6 border-b border-cyan-900">
              <h2 className="text-lg font-bold text-cyan-400 tracking-widest inline-flex items-center gap-2">
                <Terminal size={18} />
                {editingId ? "EDIT_NODE_DATA" : "INITIALIZE_NODE"}
              </h2>
              <button onClick={handleCloseModal} className="text-cyan-600 hover:text-cyan-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {modalError && <div className="p-3 bg-red-950/50 text-red-500 border border-red-500/50 text-xs font-bold tracking-widest">{modalError}</div>}
              
              <div className="group">
                <label className="text-[10px] font-bold text-cyan-600 tracking-widest block mb-1">
                  // PRODUCT_IDENTIFIER *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 font-bold">{">"}</span>
                  <input 
                    required 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black border border-cyan-900 text-cyan-300 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-cyan-600 tracking-widest block mb-1">
                    // BASE_VAL (৳) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 font-bold">{">"}</span>
                    <input 
                      required 
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.standardPrice}
                      onChange={(e) => setFormData({...formData, standardPrice: Number(e.target.value)})}
                      className="w-full bg-black border border-cyan-900 text-cyan-300 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="text-[10px] font-bold text-cyan-600 tracking-widest block mb-1">
                    // UNITS_AVAILABLE *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 font-bold">{">"}</span>
                    <input 
                      required 
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full bg-black border border-cyan-900 text-cyan-300 pl-8 pr-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-colors" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-cyan-900 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-cyan-700 hover:text-cyan-400 border border-transparent hover:border-cyan-900 transition-colors font-bold text-xs tracking-widest"
                >
                  ABORT
                </button>
                <button 
                  type="submit" 
                  disabled={modalSaving}
                  className="bg-cyan-950/50 disabled:opacity-50 text-cyan-400 font-bold py-2 px-6 border border-cyan-500/50 hover:bg-cyan-900/50 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all text-xs tracking-widest"
                >
                  {modalSaving ? "EXECUTING..." : "COMMIT_DATA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
