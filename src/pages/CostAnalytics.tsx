import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import KpiCard from "../components/KpiCard";
import Badge from "../components/Badge";
import { mockCostHistory, mockResources } from "../data/mockData";

type View = "monthly" | "weekly" | "daily";

function generateDailyData(days: number) {
  const data = [];
  const base = 350;
  for (let i = days; i >= 0; i--) {
    const d = new Date("2026-08-18");
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;
    const noise = (Math.random() - 0.5) * 60;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cost: Math.round(base * (isWeekend ? 0.6 : 1) + noise),
    });
  }
  return data;
}

export default function CostAnalytics() {
  const [view, setView] = useState<View>("monthly");
  const [budget, setBudget] = useState(11000);
  const [alertThreshold, setAlertThreshold] = useState(90);

  const total = mockCostHistory.reduce((s, m) => s + m.total, 0);
  const avgDaily = Math.round(mockCostHistory.reduce((s, m) => s + m.total, 0) / (mockCostHistory.length * 30));
  const last = mockCostHistory[mockCostHistory.length - 2].total;
  const prev = mockCostHistory[mockCostHistory.length - 3].total;
  const mom = ((last - prev) / prev) * 100;
  const projected = Math.round((mockCostHistory[mockCostHistory.length - 1].total / 18) * 31);
  const budgetVariance = projected - budget;

  const topResources = [...mockResources].sort((a, b) => b.monthlyCost - a.monthlyCost).slice(0, 8);

  const dailyData = generateDailyData(29);

  const chartData = view === "monthly" ? mockCostHistory : view === "daily" ? dailyData : dailyData.filter((_, i) => i % 7 === 0);

  const regionMap: Record<string, number> = {};
  mockResources.forEach((r) => { regionMap[r.region] = (regionMap[r.region] ?? 0) + r.monthlyCost; });
  const regionData = Object.entries(regionMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value: Math.round(value) }));

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Total (12mo)" value={`$${(total / 1000).toFixed(1)}k`} accent="cyan" mono />
        <KpiCard label="Avg Daily" value={`$${avgDaily}`} accent="blue" mono />
        <KpiCard label="MoM Change" value={`${mom > 0 ? "+" : ""}${mom.toFixed(1)}%`} trend={mom} accent={mom > 0 ? "red" : "green"} mono />
        <KpiCard label="Projected" value={`$${projected.toLocaleString()}`} sub="this month" accent="purple" mono />
        <KpiCard label="Budget Variance" value={`${budgetVariance > 0 ? "+" : ""}$${Math.abs(budgetVariance).toLocaleString()}`} accent={budgetVariance > 0 ? "red" : "green"} mono />
        <KpiCard label="Potential Savings" value="$2,379/mo" accent="green" mono />
      </div>

      {/* Budget alert */}
      {(projected / budget) * 100 >= alertThreshold && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-400 text-sm">
          <AlertTriangle size={16} />
          <span>Projected spend is <strong className="font-mono">{((projected / budget) * 100).toFixed(0)}%</strong> of monthly budget. Alert threshold: {alertThreshold}%.</span>
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center gap-2">
        {(["monthly", "weekly", "daily"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === v ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white border border-transparent"}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Trend chart */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Spending Trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
            <XAxis dataKey={view === "monthly" ? "date" : "date"} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Spend"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
            <Area type="monotone" dataKey={view === "monthly" ? "total" : "cost"} stroke="#22d3ee" fill="url(#costGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Region + provider stacked */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Cost by Region</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Cost"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Bar dataKey="value" fill="#60a5fa" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Provider Cost Breakdown (12mo)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockCostHistory.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              <Bar dataKey="aws" name="AWS" fill="#f97316" stackId="a" />
              <Bar dataKey="azure" name="Azure" fill="#60a5fa" stackId="a" />
              <Bar dataKey="gcp" name="GCP" fill="#4ade80" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top resources + budget config */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e3a6e]/60">
            <h2 className="text-sm font-semibold text-white">Most Expensive Resources</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#0f2040]/60">
              <tr>
                {["Resource", "Provider", "Service", "Monthly Cost", "% of Total"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a6e]/30">
              {topResources.map((r) => {
                const totalRes = mockResources.reduce((s, x) => s + x.monthlyCost, 0);
                const pct = ((r.monthlyCost / totalRes) * 100).toFixed(1);
                return (
                  <tr key={r.id} className="hover:bg-[#0f2040]/40 transition-colors">
                    <td className="px-4 py-2.5 text-sm text-white font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-slate-400">{r.provider}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{r.service}</td>
                    <td className="px-4 py-2.5 text-sm font-mono text-white">${r.monthlyCost.toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-[#1e3a6e]/60 rounded-full overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-cyan-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Budget Configuration</h2>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Monthly Budget (USD)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-[#0f2040] border border-[#1e3a6e] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Alert Threshold: {alertThreshold}%</label>
            <input
              type="range"
              min={50}
              max={100}
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
          <div className="pt-2 space-y-2 border-t border-[#1e3a6e]/60">
            {[
              { label: "Budget", value: `$${budget.toLocaleString()}` },
              { label: "Projected Spend", value: `$${projected.toLocaleString()}` },
              { label: "Variance", value: `${budgetVariance > 0 ? "+" : ""}$${Math.abs(budgetVariance).toLocaleString()}`, warn: budgetVariance > 0 },
              { label: "Utilization", value: `${((projected / budget) * 100).toFixed(0)}%` },
            ].map((s) => (
              <div key={s.label} className="flex justify-between text-xs">
                <span className="text-slate-400">{s.label}</span>
                <span className={`font-mono ${(s as { warn?: boolean }).warn ? "text-red-400" : "text-white"}`}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {budgetVariance > 0 ? <TrendingUp size={13} className="text-red-400" /> : <TrendingDown size={13} className="text-green-400" />}
            {budgetVariance > 0 ? "Projected to exceed budget" : "Within budget"}
          </div>
          <Badge label="Estimated — Demo Mode" variant="amber" />
        </div>
      </div>
    </div>
  );
}
