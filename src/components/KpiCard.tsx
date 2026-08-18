import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon?: ReactNode;
  accent?: "blue" | "green" | "amber" | "red" | "cyan" | "purple";
  mono?: boolean;
}

const accentMap = {
  blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  green: "text-green-400 bg-green-400/10 border-green-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function KpiCard({ label, value, sub, trend, icon, accent = "cyan", mono = false }: KpiCardProps) {
  const ac = accentMap[accent];
  return (
    <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4 flex flex-col gap-2 hover:border-[#254a88]/80 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">{label}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${ac}`}>
            {icon}
          </div>
        )}
      </div>
      <div className={`text-2xl font-semibold text-white ${mono ? "font-mono" : ""}`}>{value}</div>
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-mono ${trend > 0 ? "text-red-400" : trend < 0 ? "text-green-400" : "text-slate-500"}`}>
            {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}
