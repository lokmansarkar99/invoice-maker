import connectToDatabase from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { Product } from "@/models/Product";
import { Briefcase, Code, FileText, TrendingUp } from "lucide-react";

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
      title: "Total Invoices",
      value: stats.totalInvoices.toLocaleString(),
      icon: <FileText size={24} className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: <Code size={24} className="text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      title: "Today's Invoices",
      value: stats.todaysInvoices.toLocaleString(),
      icon: <Briefcase size={24} className="text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "Today's Sales",
      value: `৳${stats.todaysSales.toLocaleString()}`,
      icon: <TrendingUp size={24} className="text-emerald-600" />,
      color: "bg-emerald-50",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl ${stat.color} border border-gray-100 shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              <div className="p-2 rounded-lg bg-white shadow-sm">{stat.icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
