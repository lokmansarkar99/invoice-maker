"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Save, Terminal } from "lucide-react";

export default function StorePage() {
  const [formData, setFormData] = useState({
    storeName: "",
    proprietorName: "",
    address: "",
    phone: "",
    email: "",
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
            email: json.data.email || "",
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
        setMessage("[SYS.MSG] NODE_DATA_UPDATED_SUCCESSFULLY");
      } else {
        setMessage(`[ERR] ${json.message || "UPDATE_FAILED"}`);
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-cyan-400 light:text-slate-900 font-bold tracking-widest light:tracking-normal p-8 animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 border-b border-cyan-500/30 light:border-slate-300 pb-4 inline-block">
        <h1 className="text-2xl font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal inline-flex items-center gap-2">
          <Terminal size={24} />
          NODE_CONFIGURATION
        </h1>
        <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1 inline-block"></span>
      </div>
      
      <div className="bg-black/80 light:bg-white backdrop-blur-md p-6 md:p-8 max-w-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] border border-cyan-500/50 light:border-slate-300 relative">
        {message && (
          <div className={`p-4 mb-6 text-xs font-bold tracking-widest border-l-4 ${message.includes("[ERR]") ? "bg-red-950/30 text-red-500 border-red-500" : "bg-cyan-950/50 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal">
                // STORE_LOGO
              </label>
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
                      className="w-32 h-32 border border-cyan-900 light:border-slate-300 bg-black/50 light:bg-white flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 light:hover:border-indigo-400 transition-colors overflow-hidden group shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                    >
                      {formData.storeImageUrl ? (
                        <img src={formData.storeImageUrl} alt="Store Logo" className="w-full h-full object-cover mix-blend-screen light:mix-blend-normal opacity-90 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <>
                          <ImagePlus className="text-cyan-600 light:text-slate-700 mb-2 group-hover:text-cyan-400 transition-colors" />
                          <span className="text-[10px] text-cyan-600 light:text-slate-700 text-center px-2 font-bold tracking-widest light:tracking-normal group-hover:text-cyan-400 transition-colors">Upload Logo</span>
                        </>
                      )}
                    </div>
                  );
                }}
              </CldUploadWidget>
              <p className="text-[10px] text-cyan-700 light:text-slate-600 font-bold tracking-widest light:tracking-normal">Format: 1x1 Square</p>
            </div>
            
            <div className="flex-1 space-y-5">
              <div className="group">
                <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
                  // STORE_NAME *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                  <input required name="storeName" value={formData.storeName} onChange={handleChange} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-8 py-3 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900" placeholder="Store Name" />
                </div>
              </div>
              
              <div className="group">
                <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
                  // ADMIN_NAME *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                  <input required name="proprietorName" value={formData.proprietorName} onChange={handleChange} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-8 py-3 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900" placeholder="Proprietor Name" />
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
              // PHYSICAL_ADDRESS *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
              <input required name="address" value={formData.address} onChange={handleChange} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-8 py-3 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900" placeholder="Address" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 group">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
                // COMMS_LINK (PHONE) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-8 py-3 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900" placeholder="+00 0000 000" />
              </div>
            </div>

            <div className="flex-1 group">
              <label className="text-[10px] sm:text-xs font-bold text-cyan-600 light:text-slate-700 tracking-widest light:tracking-normal block mb-1 group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600 transition-colors">
                // EXTERNAL_MAIL (OPTIONAL)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 light:text-slate-600 font-bold">{">"}</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 light:bg-white border border-cyan-900 light:border-slate-300 text-cyan-300 light:text-slate-900 px-8 py-3 focus:outline-none focus:border-cyan-400 light:focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all placeholder-cyan-900" placeholder="Email" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-cyan-900/50">
            <button disabled={saving} type="submit" className="bg-cyan-950/50 light:bg-slate-200 disabled:opacity-50 text-cyan-400 light:text-slate-900 font-bold text-sm py-4 px-8 border border-cyan-500/50 light:border-slate-300 hover:bg-cyan-900/50 light:hover:bg-indigo-50 hover:text-cyan-300 light:hover:text-indigo-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3 tracking-widest light:tracking-normal w-full sm:w-auto">
              <Save size={18} />
              <span>{saving ? "EXECUTING_WRITE..." : "EXECUTE_WRITE"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
