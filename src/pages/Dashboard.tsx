import { useState } from "react";
import {
  DollarSign, TrendingUp, Zap, Server, AlertTriangle, Leaf,
  Activity, RefreshCw, Download, CheckCircle, XCircle, Clock
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from "recharts";
import KpiCard from "../components/KpiCard";
import Badge from "../components/Badge";
import {
  mockResources, mockCostHistory, mockRecommendations, mockAlerts,
  getTotalMonthlyCost, getPotentialSavings, getIdleResourceCount,
  getAvgCpuUtilization, getOptimizationScore, estimateCarbonKg
} from "../data/mockData";

const PROVIDER_COLORS: Record<string, string> = {
  AWS: "#f97316",
  Azure: "#60a5fa",
  GCP: "#4ade80",
};
const ENV_COLORS = ["#22d3ee", "#fbbf24", "#a78bfa"];

export default function Dashboard() {
  const [provider, setProvider] = useState("All");
  const [env, setEnv] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const totalCost = getTotalMonthlyCost();
  const savings = getPotentialSavings();
  const idleCount = getIdleResourceCount();
  const avgCpu = getAvgCpuUtilization();
  const score = getOptimizationScore();
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "Critical" && !a.resolved).length;
  const totalCarbon = mockResources.reduce((s, r) => s + estimateCarbonKg(r), 0);

  const prevMonthCost = mockCostHistory[mockCostHistory.length - 2]?.total ?? 0;
  const currentMonthPartial = mockCostHistory[mockCostHistory.length - 1]?.total ?? 0;
  const projectedCost = Math.round((currentMonthPartial / 18) * 31);
  const mom = ((projectedCost - prevMonthCost) / prevMonthCost) * 100;

  // Provider breakdown
  const providerData = [
    { name: "AWS", value: mockResources.filter((r) => r.provider === "AWS").reduce((s, r) => s + r.monthlyCost, 0) },
    { name: "Azure", value: mockResources.filter((r) => r.provider === "Azure").reduce((s, r) => s + r.monthlyCost, 0) },
    { name: "GCP", value: mockResources.filter((r) => r.provider === "GCP").reduce((s, r) => s + r.monthlyCost, 0) },
  ];

  // Service breakdown
  const serviceMap: Record<string, number> = {};
  mockResources.forEach((r) => { serviceMap[r.service] = (serviceMap[r.service] ?? 0) + r.monthlyCost; });
  const serviceData = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value: Math.round(value) }));

  // Env breakdown
  const envMap: Record<string, number> = {};
  mockResources.forEach((r) => { envMap[r.environment] = (envMap[r.environment] ?? 0) + r.monthlyCost; });
  const envData = Object.entries(envMap).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Budget data
  const budget = 11000;
  const budgetData = mockCostHistory.slice(-6).map((m) => ({
    date: m.date.slice(5),
    actual: m.total,
    budget,
  }));

  // Forecast next 3 months
  const lastCost = mockCostHistory[mockCostHistory.length - 2].total;
  const forecastData = [
    { date: "Sep", projected: Math.round(lastCost * 1.04) },
    { date: "Oct", projected: Math.round(lastCost * 1.07) },
    { date: "Nov", projected: Math.round(lastCost * 1.10) },
  ];

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  const severityColor: Record<string, string> = {
    Critical: "text-red-400",
    Warning: "text-amber-400",
    Info: "text-blue-400",
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Demo banner */}
      <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <Zap size={14} />
          <span className="font-medium">Demo Mode</span>
          <span className="text-amber-500/70">— All data is simulated. No real cloud credentials are used.</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="bg-[#0a1628] border border-[#1e3a6e]/60 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none">
            <option>All</option><option>AWS</option><option>Azure</option><option>GCP</option>
          </select>
          <select value={env} onChange={(e) => setEnv(e.target.value)} className="bg-[#0a1628] border border-[#1e3a6e]/60 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none">
            <option>All</option><option>Production</option><option>Staging</option><option>Development</option>
          </select>
          <button onClick={handleRefresh} className="flex items-center gap-1 bg-[#0a1628] border border-[#1e3a6e]/60 text-slate-300 text-xs rounded-lg px-2 py-1 hover:border-cyan-500/40 transition-colors">
            <RefreshCw size={11} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="flex items-center gap-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs rounded-lg px-2 py-1 hover:bg-cyan-500/20 transition-colors">
            <Download size={11} />
            Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard label="Monthly Spend" value={`$${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} trend={mom} sub="vs last month" icon={<DollarSign size={15} />} accent="cyan" mono />
        <KpiCard label="Projected Spend" value={`$${projectedCost.toLocaleString()}`} sub="end of month" icon={<TrendingUp size={15} />} accent="blue" mono />
        <KpiCard label="Potential Savings" value={`$${savings.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo`} sub={`$${(savings * 12).toLocaleString("en-US", { maximumFractionDigits: 0 })}/yr`} icon={<DollarSign size={15} />} accent="green" mono />
        <KpiCard label="Optimization Score" value={`${score}%`} sub="of resources optimized" icon={<Activity size={15} />} accent="purple" mono />
        <KpiCard label="Avg CPU Util." value={`${avgCpu.toFixed(1)}%`} sub="across all resources" icon={<Server size={15} />} accent="amber" mono />
        <KpiCard label="Idle Resources" value={`${idleCount}`} sub="need attention" icon={<AlertTriangle size={15} />} accent="red" mono />
        <KpiCard label="Critical Alerts" value={`${criticalAlerts}`} sub="unresolved" icon={<AlertTriangle size={15} />} accent="red" mono />
        <KpiCard label="Carbon Emissions" value={`${(totalCarbon / 1000).toFixed(2)} tCO₂`} sub="estimated monthly" icon={<Leaf size={15} />} accent="green" mono />
        <KpiCard label="Total Resources" value={`${mockResources.length}`} sub="monitored" icon={<Server size={15} />} accent="blue" mono />
        <KpiCard label="AI Recommendations" value={`${mockRecommendations.filter((r) => r.status === "Pending").length}`} sub="awaiting review" icon={<Zap size={15} />} accent="cyan" mono />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Spending trend */}
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">12-Month Spending Trend</h2>
            <span className="text-xs text-slate-500 font-mono">USD / month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockCostHistory}>
              <defs>
                <linearGradient id="awsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="azureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gcpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" dataKey="aws" name="AWS" stroke="#f97316" fill="url(#awsGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="azure" name="Azure" stroke="#60a5fa" fill="url(#azureGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="gcp" name="GCP" stroke="#4ade80" fill="url(#gcpGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Provider pie */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Cost by Provider</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={providerData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {providerData.map((entry) => (
                  <Cell key={entry.name} fill={PROVIDER_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {providerData.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PROVIDER_COLORS[p.name] }} />
                  <span className="text-xs text-slate-400">{p.name}</span>
                </div>
                <span className="text-xs font-mono text-white">${p.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Service breakdown */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Cost by Service</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Cost"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Bar dataKey="value" fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Budget vs Actual</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="actual" name="Actual" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget" name="Budget" fill="#1e3a6e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">3-Month Forecast</h2>
          <p className="text-xs text-slate-500 mb-4">Estimated — Demo Mode</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Projected"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Bar dataKey="projected" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {forecastData.map((f) => (
              <div key={f.date} className="flex justify-between text-xs">
                <span className="text-slate-400">{f.date} 2026</span>
                <span className="font-mono text-purple-400">${f.projected.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent recommendations */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent AI Recommendations</h2>
            <Badge label="Demo AI" variant="amber" />
          </div>
          <div className="space-y-3">
            {mockRecommendations.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-3 bg-[#0f2040]/60 rounded-lg border border-[#1e3a6e]/40">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${r.priority === "Critical" ? "bg-red-400" : r.priority === "High" ? "bg-amber-400" : "bg-blue-400"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.resourceName}</p>
                </div>
                <span className="text-xs font-mono text-green-400 flex-shrink-0">+${r.monthlySavings.toFixed(0)}/mo</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {mockAlerts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-3 bg-[#0f2040]/60 rounded-lg border border-[#1e3a6e]/40">
                {a.resolved
                  ? <CheckCircle size={15} className="text-green-400 flex-shrink-0 mt-0.5" />
                  : a.severity === "Critical"
                  ? <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                  : <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                }
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${severityColor[a.severity]}`}>{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{a.description}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-600 text-[10px] flex-shrink-0">
                  <Clock size={9} />
                  {new Date(a.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Provider connections */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Cloud Provider Connections</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "Amazon Web Services", short: "AWS", color: "#f97316", status: "Demo Mode", resources: mockResources.filter((r) => r.provider === "AWS").length, cost: providerData[0].value },
            { name: "Microsoft Azure", short: "Azure", color: "#60a5fa", status: "Demo Mode", resources: mockResources.filter((r) => r.provider === "Azure").length, cost: providerData[1].value },
            { name: "Google Cloud Platform", short: "GCP", color: "#4ade80", status: "Demo Mode", resources: mockResources.filter((r) => r.provider === "GCP").length, cost: providerData[2].value },
          ].map((p) => (
            <div key={p.short} className="flex items-center gap-3 p-4 bg-[#0f2040]/60 border border-[#1e3a6e]/40 rounded-xl">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30` }}>
                {p.short}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{p.name}</p>
                <p className="text-xs text-slate-500 font-mono">{p.resources} resources · ${p.cost.toFixed(0)}/mo</p>
                <Badge label={p.status} variant="amber" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
