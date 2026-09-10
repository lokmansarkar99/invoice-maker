import connectToDatabase from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { Product } from "@/models/Product";
import { Briefcase, Code, FileText, TrendingUp, Terminal } from "lucide-react";

async function getDashboardStats() {
  await connectToDatabase();

  const totalInvoices = await Invoice.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Today's boundaries
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todaysInvoices = await Invoice.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const todaysSalesAgg = await Invoice.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$grandTotal" },
      },
    },
  ]);

  const todaysSales = todaysSalesAgg[0]?.totalSales || 0;

  return {
    totalInvoices,
    totalProducts,
    todaysInvoices,
    todaysSales,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "TOTAL_INVOICES",
      value: stats.totalInvoices.toLocaleString(),
      icon: <FileText size={20} className="text-cyan-400 light:text-slate-900" />,
    },
    {
      title: "TOTAL_PRODUCTS",
      value: stats.totalProducts.toLocaleString(),
      icon: <Code size={20} className="text-cyan-400 light:text-slate-900" />,
    },
    {
      title: "TODAYS_INVOICES",
      value: stats.todaysInvoices.toLocaleString(),
      icon: <Briefcase size={20} className="text-cyan-400 light:text-slate-900" />,
    },
    {
      title: "TODAYS_SALES",
      value: `৳${stats.todaysSales.toLocaleString()}`,
      icon: <TrendingUp size={20} className="text-cyan-400 light:text-slate-900" />,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 border-b border-cyan-500/30 light:border-slate-300 pb-4 inline-block">
        <h1 className="text-2xl font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal inline-flex items-center gap-2">
          <Terminal size={24} />
          SYS_OVERVIEW
        </h1>
        <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1 inline-block"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-black/80 light:bg-white backdrop-blur-sm border border-cyan-500/50 light:border-slate-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400 light:hover:border-indigo-400 transition-colors group relative overflow-hidden"
          >
            {/* Scanline effect inside card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
               <h3 className="text-cyan-600 light:text-slate-700 font-bold text-xs tracking-widest light:tracking-normal group-hover:text-cyan-400 transition-colors">
                 // {stat.title}
               </h3>
              <div className="p-2 bg-cyan-950/50 light:bg-slate-200 border border-cyan-900 light:border-slate-300 group-hover:border-cyan-500/50 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-black text-cyan-300 light:text-slate-900 relative z-10 tracking-wider light:tracking-normal">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
