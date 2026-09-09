import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-black text-cyan-300 font-mono relative overflow-hidden">
      {/* Fixed Full Screen Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/studio-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      </div>

      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 pb-6 sm:pt-8 sm:px-6 sm:pb-8 md:p-8 lg:p-12 overflow-y-auto w-full min-w-0 max-w-[100vw] md:max-w-[calc(100vw-16rem)] relative z-10">
        {children}
      </main>
    </div>
  );
}
