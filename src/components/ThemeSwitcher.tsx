"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Terminal } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "retro" ? "light" : "retro")}
      className={`
        flex items-center gap-2 px-3 py-1.5 transition-all
        ${
          theme === "retro"
            ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:shadow-md rounded-md"
        }
      `}
      aria-label="Toggle theme"
    >
      {theme === "retro" ? (
        <>
          <Sun size={16} />
          <span className="text-[10px] font-bold tracking-widest light:tracking-normal hidden sm:inline">LIGHT_MODE</span>
        </>
      ) : (
        <>
          <Terminal size={16} />
          <span className="text-xs font-semibold hidden sm:inline">Retro UI</span>
        </>
      )}
    </button>
  );
}
