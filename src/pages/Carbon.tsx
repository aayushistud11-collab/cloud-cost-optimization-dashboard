import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Leaf, Info } from "lucide-react";
import Badge from "../components/Badge";
import { mockResources, mockCostHistory, estimateCarbonKg, carbonFactors } from "../data/mockData";

const PROVIDER_COLORS: Record<string, string> = { AWS: "#f97316", Azure: "#60a5fa", GCP: "#4ade80" };

export default function Carbon() {
  const totalKg = mockResources.reduce((s, r) => s + estimateCarbonKg(r), 0);
  const totalTons = totalKg / 1000;

  const byProvider = ["AWS", "Azure", "GCP"].map((p) => ({
    name: p,
    value: +mockResources.filter((r) => r.provider === p).reduce((s, r) => s + estimateCarbonKg(r), 0).toFixed(2),
  }));

  const byService: Record<string, number> = {};
  mockResources.forEach((r) => { byService[r.service] = (byService[r.service] ?? 0) + estimateCarbonKg(r); });
  const serviceData = Object.entries(byService).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value: +value.toFixed(2) }));

  const byRegion = Object.entries(carbonFactors).map(([region, factor]) => {
    const resources = mockResources.filter((r) => r.region === region);
    return { name: region, value: +resources.reduce((s, r) => s + estimateCarbonKg(r), 0).toFixed(2), factor };
  }).filter((r) => r.value > 0).sort((a, b) => b.value - a.value);

  const monthlyTrend = mockCostHistory.slice(0, 11).map((m) => ({
    date: m.date,
    emissions: +(m.total * 0.000280).toFixed(3),
  }));

  const sustainScore = Math.max(0, Math.min(100, 100 - (totalTons / 10) * 20));

  const recommendations = [
    { title: "Shut down 4 idle resources", saving: "~0.8 tCO₂/mo" },
    { title: "Schedule non-prod workloads off-hours", saving: "~0.4 tCO₂/mo" },
    { title: "Migrate workloads to europe-west1 (low carbon)", saving: "~0.3 tCO₂/mo" },
    { title: "Enable autoscaling on 3 clusters", saving: "~0.2 tCO₂/mo" },
    { title: "Move cold S3 data to Glacier", saving: "~0.1 tCO₂/mo" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4 text-xs text-slate-400">
        <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <span>Carbon emission estimates depend on cloud provider methodology, grid energy mix, region, and workload type. All figures shown are <strong className="text-amber-400">simulated estimates in Demo Mode</strong> and should not be used for compliance reporting.</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Monthly Emissions", value: `${totalTons.toFixed(2)} tCO₂`, sub: "Estimated", color: "text-green-400" },
          { label: "Emissions per $1k", value: `${(totalKg / (mockResources.reduce((s, r) => s + r.monthlyCost, 0) / 1000)).toFixed(1)} kg`, sub: "CO₂ intensity", color: "text-amber-400" },
          { label: "Sustainability Score", value: `${sustainScore.toFixed(0)}/100`, sub: "Higher is better", color: sustainScore > 70 ? "text-green-400" : sustainScore > 40 ? "text-amber-400" : "text-red-400" },
          { label: "vs Last Month", value: "-3.2%", sub: "Improvement (Demo)", color: "text-green-400" },
        ].map((k) => (
          <div key={k.label} className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{k.label}</p>
            <p className={`text-xl font-mono font-semibold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Monthly trend */}
        <div className="lg:col-span-2 bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Monthly Emissions Trend (tCO₂)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}t`} />
              <Tooltip formatter={(v: number) => [`${v} tCO₂`, "Emissions"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Line type="monotone" dataKey="emissions" stroke="#4ade80" strokeWidth={2} dot={{ fill: "#4ade80", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By provider */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Emissions by Provider</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={byProvider} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {byProvider.map((e) => <Cell key={e.name} fill={PROVIDER_COLORS[e.name]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} kgCO₂`, ""]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {byProvider.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: PROVIDER_COLORS[p.name] }} />
                  <span className="text-slate-400">{p.name}</span>
                </div>
                <span className="font-mono text-white">{p.value.toFixed(1)} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service + Region */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Emissions by Service (kgCO₂)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v: number) => [`${v} kgCO₂`, "Emissions"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Bar dataKey="value" fill="#4ade80" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Emissions by Region</h2>
          <div className="space-y-2">
            {byRegion.map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-28 truncate font-mono">{r.name}</span>
                <div className="flex-1 h-1.5 bg-[#1e3a6e]/60 rounded-full overflow-hidden">
                  <div style={{ width: `${(r.value / byRegion[0].value) * 100}%`, background: "#4ade80" }} className="h-full rounded-full" />
                </div>
                <span className="text-xs font-mono text-green-400 w-16 text-right">{r.value.toFixed(1)} kg</span>
                <span className="text-[10px] text-slate-600 w-20 text-right font-mono">{(r.factor * 1000).toFixed(0)}g/kWh</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability recommendations */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Leaf size={15} className="text-green-400" />
          <h2 className="text-sm font-semibold text-white">Sustainability Recommendations</h2>
          <Badge label="Estimated — Demo Mode" variant="amber" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendations.map((r) => (
            <div key={r.title} className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <Leaf size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white">{r.title}</p>
                <p className="text-[10px] text-green-400 font-mono mt-0.5">{r.saving}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
