import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pt-16 px-4 pb-6 sm:pt-8 sm:px-6 sm:pb-8 md:p-8 lg:p-12 overflow-y-auto w-full min-w-0 max-w-[100vw] md:max-w-[calc(100vw-16rem)]">
        {children}
      </main>
    </div>
  );
}
