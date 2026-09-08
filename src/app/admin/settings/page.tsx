import { logoutAction } from "@/actions/auth";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      
      <div className="glass p-6 rounded-2xl max-w-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
        
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
