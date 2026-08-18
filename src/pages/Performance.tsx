import { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Badge from "../components/Badge";
import { mockResources, mockAlerts, generatePerformanceMetrics } from "../data/mockData";

type Range = "1h" | "6h" | "24h" | "7d" | "30d";

const rangeHours: Record<Range, number> = { "1h": 1, "6h": 6, "24h": 24, "7d": 168, "30d": 720 };

function healthBadge(cpu: number, mem: number): "green" | "amber" | "red" {
  if (cpu > 85 || mem > 90) return "red";
  if (cpu > 65 || mem > 70) return "amber";
  return "green";
}

function fmt(ts: string, range: Range) {
  const d = new Date(ts);
  if (range === "1h" || range === "6h") return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (range === "24h") return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Performance() {
  const [range, setRange] = useState<Range>("24h");
  const [selectedResource, setSelectedResource] = useState("All");

  const hours = rangeHours[range];
  const metrics = useMemo(() => generatePerformanceMetrics(hours), [hours]);

  const step = Math.max(1, Math.floor(metrics.length / 40));
  const chartData = metrics.filter((_, i) => i % step === 0).map((m) => ({
    ...m,
    time: fmt(m.timestamp, range),
    cpu: Math.round(m.cpu),
    memory: Math.round(m.memory),
    latency: Math.round(m.latency),
    errorRate: +m.errorRate.toFixed(2),
  }));

  const latest = metrics[metrics.length - 1];
  const avgCpu = Math.round(metrics.reduce((s, m) => s + m.cpu, 0) / metrics.length);
  const avgMem = Math.round(metrics.reduce((s, m) => s + m.memory, 0) / metrics.length);
  const avgLatency = Math.round(metrics.reduce((s, m) => s + m.latency, 0) / metrics.length);
  const avgAvail = (metrics.reduce((s, m) => s + m.availability, 0) / metrics.length).toFixed(2);

  const runningResources = mockResources.filter((r) => r.status === "Running");
  const overutilized = runningResources.filter((r) => r.cpuUtilization > 80 || r.memoryUtilization > 85);
  const underutilized = runningResources.filter((r) => r.cpuUtilization < 20 && r.memoryUtilization < 25);

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: "CPU Util.", value: `${Math.round(latest.cpu)}%`, color: latest.cpu > 80 ? "text-red-400" : "text-cyan-400" },
          { label: "Memory", value: `${Math.round(latest.memory)}%`, color: latest.memory > 85 ? "text-red-400" : "text-blue-400" },
          { label: "Network", value: `${Math.round(latest.network)}%`, color: "text-purple-400" },
          { label: "Latency", value: `${Math.round(latest.latency)}ms`, color: latest.latency > 100 ? "text-amber-400" : "text-green-400" },
          { label: "Availability", value: `${avgAvail}%`, color: "text-green-400" },
          { label: "Error Rate", value: `${latest.errorRate.toFixed(2)}%`, color: latest.errorRate > 2 ? "text-red-400" : "text-green-400" },
          { label: "Requests/h", value: latest.requests.toLocaleString(), color: "text-white" },
        ].map((k) => (
          <div key={k.label} className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{k.label}</p>
            <p className={`text-xl font-mono font-semibold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Range selector */}
      <div className="flex items-center gap-2">
        {(["1h", "6h", "24h", "7d", "30d"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${range === r ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white border border-transparent"}`}
          >
            {r}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">Simulated data — Demo Mode</span>
      </div>

      {/* CPU & Memory chart */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">CPU & Memory Utilization</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cpuG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="memG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#22d3ee" fill="url(#cpuG)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="memory" name="Memory %" stroke="#60a5fa" fill="url(#memG)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Latency & Error Rate */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Request Latency (ms)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Line type="monotone" dataKey="latency" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Error Rate (%)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="errG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a6e" strokeOpacity={0.4} />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #1e3a6e", borderRadius: 8 }} />
              <Area type="monotone" dataKey="errorRate" stroke="#ef4444" fill="url(#errG)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource health grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <XCircle size={14} className="text-red-400" />
            Overutilized Resources ({overutilized.length})
          </h2>
          <div className="space-y-2">
            {overutilized.length === 0 ? <p className="text-xs text-slate-500">No overutilized resources.</p> : overutilized.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <p className="text-xs text-white font-medium">{r.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{r.service} · {r.region}</p>
                </div>
                <div className="text-right text-xs font-mono">
                  <p className="text-red-400">CPU {r.cpuUtilization}%</p>
                  <p className="text-amber-400">Mem {r.memoryUtilization}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            Underutilized Resources ({underutilized.length})
          </h2>
          <div className="space-y-2">
            {underutilized.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <div>
                  <p className="text-xs text-white font-medium">{r.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{r.service} · {r.region}</p>
                </div>
                <div className="text-right text-xs font-mono">
                  <p className="text-amber-400">CPU {r.cpuUtilization}%</p>
                  <p className="text-amber-400">Mem {r.memoryUtilization}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Performance Alerts</h2>
        <div className="space-y-2">
          {mockAlerts.map((a) => (
            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${a.severity === "Critical" ? "bg-red-500/5 border-red-500/20" : a.severity === "Warning" ? "bg-amber-500/5 border-amber-500/20" : "bg-blue-500/5 border-blue-500/20"}`}>
              {a.resolved ? <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" /> : a.severity === "Critical" ? <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <Badge label={a.severity} variant={a.severity === "Critical" ? "red" : a.severity === "Warning" ? "amber" : "blue"} />
                  {a.resolved && <Badge label="Resolved" variant="green" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{a.description}</p>
                <p className="text-[10px] text-slate-600 mt-1 font-mono">{a.resourceName} · {new Date(a.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
