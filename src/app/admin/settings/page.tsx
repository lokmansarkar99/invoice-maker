import { logoutAction } from "@/actions/auth";
import { LogOut, Terminal } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8 border-b border-cyan-500/30 light:border-slate-300 pb-4 inline-block">
        <h1 className="text-2xl font-bold text-cyan-400 light:text-slate-900 tracking-widest light:tracking-normal inline-flex items-center gap-2">
          <Terminal size={24} />
          SYS_SETTINGS
        </h1>
        <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-1 inline-block"></span>
      </div>
      
      <div className="bg-black/80 light:bg-white backdrop-blur-md border border-cyan-500/50 light:border-slate-300 p-6 sm:p-8 max-w-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
        <h2 className="text-lg font-bold text-cyan-400 light:text-slate-900 mb-6 tracking-widest light:tracking-normal border-b border-cyan-900 light:border-slate-300 pb-2">
          // ACCOUNT_ACTIONS
        </h2>
        
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center space-x-3 px-6 py-4 bg-red-950/30 light:bg-red-50 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-500/50 light:border-red-200 hover:border-red-400 transition-colors font-bold text-sm tracking-widest light:tracking-normal shadow-[0_0_15px_rgba(239,68,68,0.2)] group"
          >
            <LogOut size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>
  );
}
