import { useState, useMemo } from "react";
import { Search, Filter, ChevronUp, ChevronDown, Eye, CheckCircle, Zap, X } from "lucide-react";
import Badge from "../components/Badge";
import { mockResources, type CloudResource } from "../data/mockData";

function statusBadge(s: string): "green" | "amber" | "red" | "gray" {
  if (s === "Running") return "green";
  if (s === "Warning" || s === "Critical") return "red";
  if (s === "Idle") return "amber";
  return "gray";
}
function optiBadge(s: string): "green" | "amber" | "red" | "gray" | "blue" {
  if (s === "Optimized") return "green";
  if (s === "Overprovisioned") return "amber";
  if (s === "Idle") return "red";
  if (s === "Needs Review") return "blue";
  return "gray";
}
function riskBadge(r: string): "green" | "amber" | "red" | "gray" {
  if (r === "Low") return "green";
  if (r === "Medium") return "amber";
  if (r === "High" || r === "Critical") return "red";
  return "gray";
}

type SortKey = keyof CloudResource;

export default function Resources() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("All");
  const [service, setService] = useState("All");
  const [status, setStatus] = useState("All");
  const [opti, setOpti] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("monthlyCost");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<CloudResource | null>(null);
  const [optimized, setOptimized] = useState<Set<string>>(new Set());
  const PAGE_SIZE = 10;

  const services = ["All", ...Array.from(new Set(mockResources.map((r) => r.service))).sort()];

  const filtered = useMemo(() => {
    return mockResources
      .filter((r) => {
        if (provider !== "All" && r.provider !== provider) return false;
        if (service !== "All" && r.service !== service) return false;
        if (status !== "All" && r.status !== status) return false;
        if (opti !== "All" && r.optimizationStatus !== opti) return false;
        if (search) {
          const q = search.toLowerCase();
          return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.service.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, provider, service, status, opti, sortKey, sortDir]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  function toggleSort(k: SortKey) {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (k !== sortKey) return <ChevronUp size={12} className="text-slate-600" />;
    return sortDir === "asc" ? <ChevronUp size={12} className="text-cyan-400" /> : <ChevronDown size={12} className="text-cyan-400" />;
  }

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th className="px-4 py-3 text-left text-xs text-slate-500 font-medium cursor-pointer hover:text-slate-300 select-none" onClick={() => toggleSort(k)}>
        <div className="flex items-center gap-1">{label}<SortIcon k={k} /></div>
      </th>
    );
  }

  function UtilBar({ val }: { val: number }) {
    const color = val > 80 ? "#ef4444" : val > 50 ? "#22d3ee" : val < 20 ? "#fbbf24" : "#4ade80";
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-[#1e3a6e]/60 rounded-full overflow-hidden">
          <div style={{ width: `${val}%`, background: color }} className="h-full rounded-full" />
        </div>
        <span className="text-xs font-mono text-slate-400">{val}%</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-[1600px]">
      {/* Filters */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-[#0f2040] border border-[#1e3a6e] rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search resources…"
              className="bg-transparent text-sm text-white placeholder-slate-600 outline-none flex-1"
            />
          </div>
          <Filter size={14} className="text-slate-500" />
          {[
            { label: "Provider", value: provider, set: setProvider, opts: ["All", "AWS", "Azure", "GCP"] },
            { label: "Service", value: service, set: setService, opts: services },
            { label: "Status", value: status, set: setStatus, opts: ["All", "Running", "Stopped", "Idle", "Warning", "Critical"] },
            { label: "Optimization", value: opti, set: setOpti, opts: ["All", "Optimized", "Needs Review", "Overprovisioned", "Idle", "Unreviewed"] },
          ].map((f) => (
            <select key={f.label} value={f.value} onChange={(e) => { f.set(e.target.value); setPage(0); }} className="bg-[#0f2040] border border-[#1e3a6e] text-slate-300 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-cyan-500/40">
              {f.opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
          <span className="text-xs text-slate-500 font-mono ml-auto">{filtered.length} resources</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f2040]/60 border-b border-[#1e3a6e]/60">
              <tr>
                <Th label="Name" k="name" />
                <Th label="Provider" k="provider" />
                <Th label="Service" k="service" />
                <Th label="Region" k="region" />
                <Th label="Status" k="status" />
                <Th label="Cost/mo" k="monthlyCost" />
                <Th label="CPU" k="cpuUtilization" />
                <Th label="Memory" k="memoryUtilization" />
                <Th label="Optimization" k="optimizationStatus" />
                <Th label="Risk" k="riskLevel" />
                <th className="px-4 py-3 text-xs text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a6e]/30">
              {paged.length === 0 ? (
                <tr><td colSpan={11} className="px-4 py-12 text-center text-slate-500 text-sm">No resources match your filters.</td></tr>
              ) : paged.map((r) => (
                <tr key={r.id} className="hover:bg-[#0f2040]/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white font-medium truncate max-w-[180px]">{r.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{r.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono font-semibold ${r.provider === "AWS" ? "text-orange-400" : r.provider === "Azure" ? "text-blue-400" : "text-green-400"}`}>{r.provider}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{r.service}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.region}</td>
                  <td className="px-4 py-3"><Badge label={r.status} variant={statusBadge(r.status)} /></td>
                  <td className="px-4 py-3 text-sm font-mono text-white">${r.monthlyCost.toFixed(2)}</td>
                  <td className="px-4 py-3"><UtilBar val={r.cpuUtilization} /></td>
                  <td className="px-4 py-3"><UtilBar val={r.memoryUtilization} /></td>
                  <td className="px-4 py-3"><Badge label={optimized.has(r.id) ? "Optimized" : r.optimizationStatus} variant={optimized.has(r.id) ? "green" : optiBadge(r.optimizationStatus)} /></td>
                  <td className="px-4 py-3"><Badge label={r.riskLevel} variant={riskBadge(r.riskLevel)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(r)} className="p-1.5 rounded hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-colors" title="View details">
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => setOptimized((s) => { const ns = new Set(s); ns.has(r.id) ? ns.delete(r.id) : ns.add(r.id); return ns; })}
                        className="p-1.5 rounded hover:bg-green-500/10 text-slate-400 hover:text-green-400 transition-colors"
                        title="Mark as optimized"
                      >
                        <CheckCircle size={13} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors" title="View recommendation">
                        <Zap size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e3a6e]/60">
          <span className="text-xs text-slate-500">Page {page + 1} of {Math.max(totalPages, 1)}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-[#1e3a6e] text-xs text-slate-400 disabled:opacity-30 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">Prev</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-[#1e3a6e] text-xs text-slate-400 disabled:opacity-30 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-[#0a1628] border border-[#1e3a6e] rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#1e3a6e]/60">
              <div>
                <h2 className="text-white font-semibold">{selected.name}</h2>
                <p className="text-xs text-slate-500 font-mono">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-[#1e3a6e]/60 text-slate-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                ["Provider", selected.provider], ["Service", selected.service],
                ["Region", selected.region], ["Environment", selected.environment],
                ["Status", selected.status], ["Instance Type", selected.instanceType ?? "N/A"],
                ["Monthly Cost", `$${selected.monthlyCost.toFixed(2)}`], ["Last Activity", selected.lastActivity],
                ["CPU Util.", `${selected.cpuUtilization}%`], ["Memory Util.", `${selected.memoryUtilization}%`],
                ["Network Util.", `${selected.networkUtilization}%`], ["Risk", selected.riskLevel],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">{k}</p>
                  <p className="text-sm text-white font-mono">{v}</p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(selected.tags).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-[#0f2040] border border-[#1e3a6e] rounded text-[11px] text-slate-400 font-mono">{k}={v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
