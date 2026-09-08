"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

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
    if (confirm("Delete Product? This action cannot be undone.")) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-gray-600 font-medium">Product</th>
                <th className="py-3 px-4 text-gray-600 font-medium">Standard Price</th>
                <th className="py-3 px-4 text-gray-600 font-medium">Stock</th>
                <th className="py-3 px-4 text-gray-600 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-gray-600">৳{product.standardPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{modalError}</div>}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Product Name *</label>
                <input 
                  required 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Standard Price (৳) *</label>
                  <input 
                    required 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.standardPrice}
                    onChange={(e) => setFormData({...formData, standardPrice: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock *</label>
                  <input 
                    required 
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={modalSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors disabled:opacity-50"
                >
                  {modalSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
