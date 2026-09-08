"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Save } from "lucide-react";

export default function StorePage() {
  const [formData, setFormData] = useState({
    storeName: "",
    proprietorName: "",
    address: "",
    phone: "",
    storeImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData({
            storeName: json.data.storeName || "",
            proprietorName: json.data.proprietorName || "",
            address: json.data.address || "",
            phone: json.data.phone || "",
            storeImageUrl: json.data.storeImageUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to load store information", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setMessage("Store information updated successfully!");
      } else {
        setMessage(json.message || "Failed to update store");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Store Information</h1>
      
      <div className="glass p-6 md:p-8 rounded-2xl max-w-2xl">
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes("success") ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Store Logo</label>
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "inv_app"}
                onSuccess={(result: any) => {
                  setFormData({ ...formData, storeImageUrl: result.info.secure_url });
                }}
              >
                {({ open }) => {
                  return (
                    <div 
                      onClick={() => open()}
                      className="w-32 h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors bg-white/5 overflow-hidden"
                    >
                      {formData.storeImageUrl ? (
                        <img src={formData.storeImageUrl} alt="Store Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImagePlus className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-400 text-center px-2">Upload Logo</span>
                        </>
                      )}
                    </div>
                  );
                }}
              </CldUploadWidget>
              <p className="text-xs text-gray-500">Recommended: Square image</p>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Store Name *</label>
                <input required name="storeName" value={formData.storeName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Proprietor Name *</label>
                <input required name="proprietorName" value={formData.proprietorName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Address *</label>
            <input required name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Phone *</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-teal-500 transition-colors" />
          </div>

          <button disabled={saving} type="submit" className="flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-all">
            <Save size={18} />
            <span>{saving ? "Saving..." : "Save Information"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
