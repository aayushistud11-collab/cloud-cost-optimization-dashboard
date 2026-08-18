import { useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, RotateCcw, Download, Info } from "lucide-react";
import Badge from "../components/Badge";
import { mockResources, simulationStrategies } from "../data/mockData";

interface SimResult {
  resourceId: string;
  resourceName: string;
  strategy: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  pct: number;
  risk: string;
  effort: string;
  performanceImpact: string;
  sustainabilityImpact: string;
}

export default function Simulator() {
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string[]>([]);
  const [results, setResults] = useState<SimResult[] | null>(null);
  const [ran, setRan] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function toggleResource(id: string) {
    setSelectedResources((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
    setResults(null);
  }

  function toggleStrategy(id: string) {
    setSelectedStrategy((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
    setResults(null);
  }

  function runSimulation() {
    if (!selectedResources.length || !selectedStrategy.length) {
      setToast("Select at least one resource and one strategy.");
      setTimeout(() => setToast(null), 2000);
      return;
    }
    const res: SimResult[] = [];
    for (const rid of selectedResources) {
      const resource = mockResources.find((r) => r.id === rid)!;
      for (const sid of selectedStrategy) {
        const strategy = simulationStrategies.find((s) => s.id === sid)!;
        const savings = resource.monthlyCost * strategy.savingsPct;
        const optimizedCost = resource.monthlyCost - savings;
        res.push({
          resourceId: rid,
          resourceName: resource.name,
          strategy: strategy.label,
          currentCost: resource.monthlyCost,
          optimizedCost: Math.max(0, optimizedCost),
          savings,
          pct: strategy.savingsPct * 100,
          risk: strategy.risk,
          effort: strategy.effort,
          performanceImpact: strategy.performanceImpact,
          sustainabilityImpact: strategy.sustainabilityImpact,
        });
      }
    }
    setResults(res);
    setRan(true);
  }

  function reset() {
    setSelectedResources([]);
    setSelectedStrategy([]);
    setResults(null);
    setRan(false);
  }

  const totalCurrentCost = results?.reduce((s, r) => s + r.currentCost, 0) ?? 0;
  const totalOptimizedCost = results?.reduce((s, r) => s + r.optimizedCost, 0) ?? 0;
  const totalSavings = results?.reduce((s, r) => s + r.savings, 0) ?? 0;

  const chartData = results ? [
    { name: "Current", cost: +totalCurrentCost.toFixed(2) },
    { name: "Optimized", cost: +totalOptimizedCost.toFixed(2) },
  ] : [];

  function handleExport() {
    if (!results) return;
    const csv = ["Resource,Strategy,Current Cost,Optimized Cost,Savings,Savings %",
      ...results.map((r) => `${r.resourceName},${r.strategy},${r.currentCost.toFixed(2)},${r.optimizedCost.toFixed(2)},${r.savings.toFixed(2)},${r.pct.toFixed(0)}%`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "simulation-results.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px] relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-sm rounded-xl px-4 py-3 shadow-lg">{toast}</div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl px-4 py-3 text-xs text-slate-400">
        <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <span>The Optimization Simulator is a <strong className="text-amber-400">planning tool only</strong>. It does not modify, stop, delete, or resize any real cloud infrastructure. All results are estimates in Demo Mode.</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resource picker */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Select Resources</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {mockResources.map((r) => (
              <label key={r.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedResources.includes(r.id) ? "bg-cyan-500/10 border-cyan-500/30" : "border-[#1e3a6e]/40 hover:border-[#254a88]/60"}`}>
                <input
                  type="checkbox"
                  checked={selectedResources.includes(r.id)}
                  onChange={() => toggleResource(r.id)}
                  className="accent-cyan-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">{r.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{r.service} · {r.provider} · ${r.monthlyCost.toFixed(2)}/mo</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Strategy picker */}
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Select Optimization Strategy</h2>
          <div className="space-y-2">
            {simulationStrategies.map((s) => (
              <label key={s.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedStrategy.includes(s.id) ? "bg-cyan-500/10 border-cyan-500/30" : "border-[#1e3a6e]/40 hover:border-[#254a88]/60"}`}>
                <input
                  type="checkbox"
                  checked={selectedStrategy.includes(s.id)}
                  onChange={() => toggleStrategy(s.id)}
                  className="accent-cyan-500 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-xs text-white font-medium">{s.label}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge label={`~${(s.savingsPct * 100).toFixed(0)}% savings`} variant="green" />
                    <Badge label={`${s.effort} effort`} variant={s.effort === "Low" ? "green" : s.effort === "Medium" ? "amber" : "red"} />
                    <Badge label={`${s.risk} risk`} variant={s.risk === "Low" ? "green" : s.risk === "Medium" ? "amber" : "red"} />
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={runSimulation}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#050d1a] font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Play size={14} />
          Run Simulation
        </button>
        <button onClick={reset} className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a6e] text-slate-300 px-4 py-2.5 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
          <RotateCcw size={13} />
          Reset
        </button>
        {results && (
          <button onClick={handleExport} className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a6e] text-slate-300 px-4 py-2.5 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
            <Download size={13} />
            Export CSV
          </button>
        )}
        <span className="text-xs text-slate-500 ml-2">{selectedResources.length} resources · {selectedStrategy.length} strategies</span>
      </div>

      {/* Results */}
      {ran && results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Current Monthly Cost", value: `$${totalCurrentCost.toFixed(2)}`, color: "text-white" },
              { label: "Optimized Monthly Cost", value: `$${totalOptimizedCost.toFixed(2)}`, color: "text-cyan-400" },
              { label: "Monthly Savings", value: `$${totalSavings.toFixed(2)}`, color: "text-green-400" },
              { label: "Annual Savings", value: `$${(totalSavings * 12).toFixed(2)}`, color: "text-green-400" },
            ].map((s) => (
              <div key={s.label} className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-xl font-mono font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Before/after chart */}
          <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Before vs. After Cost</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Cost"]} contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
                <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.name === "Optimized" ? "#22d3ee" : "#1e3a6e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detail table */}
          <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a6e]/60">
              <h2 className="text-sm font-semibold text-white">Resource Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f2040]/60">
                  <tr>
                    {["Resource", "Strategy", "Current", "Optimized", "Savings", "%", "Risk", "Effort", "Perf. Impact"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a6e]/30">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-[#0f2040]/40 transition-colors">
                      <td className="px-4 py-3 text-xs text-white max-w-[140px] truncate">{r.resourceName}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{r.strategy}</td>
                      <td className="px-4 py-3 text-xs font-mono text-white">${r.currentCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-cyan-400">${r.optimizedCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-green-400">${r.savings.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono text-green-400">{r.pct.toFixed(0)}%</td>
                      <td className="px-4 py-3"><Badge label={r.risk} variant={r.risk === "Low" ? "green" : r.risk === "Medium" ? "amber" : "red"} /></td>
                      <td className="px-4 py-3"><Badge label={r.effort} variant={r.effort === "Low" ? "green" : r.effort === "Medium" ? "amber" : "red"} /></td>
                      <td className="px-4 py-3 text-xs text-slate-400">{r.performanceImpact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
