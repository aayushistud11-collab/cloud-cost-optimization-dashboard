import { useState } from "react";
import { FileText, Download, Printer, Copy, CheckCircle } from "lucide-react";
import Badge from "../components/Badge";
import {
  mockResources, mockRecommendations, mockAlerts,
  getTotalMonthlyCost, getPotentialSavings, getOptimizationScore, estimateCarbonKg
} from "../data/mockData";

interface Report {
  id: string;
  date: string;
  period: string;
  status: "Complete";
}

const pastReports: Report[] = [
  { id: "R-2026-07", date: "2026-08-01", period: "July 2026", status: "Complete" },
  { id: "R-2026-06", date: "2026-07-01", period: "June 2026", status: "Complete" },
  { id: "R-2026-05", date: "2026-06-01", period: "May 2026", status: "Complete" },
];

export default function Reports() {
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const totalCost = getTotalMonthlyCost();
  const savings = getPotentialSavings();
  const score = getOptimizationScore();
  const topRecs = mockRecommendations.slice(0, 5);
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "Critical");
  const totalCarbon = mockResources.reduce((s, r) => s + estimateCarbonKg(r), 0);

  async function generate() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setGenerated(true);
    setGenerating(false);
  }

  function handleCopy() {
    const summary = `CloudOpti AI Report — August 2026\nTotal Cloud Spend: $${totalCost.toFixed(0)}\nPotential Monthly Savings: $${savings.toFixed(0)}\nOptimization Score: ${score}%\nEstimated Carbon: ${(totalCarbon / 1000).toFixed(2)} tCO₂`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function exportCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Organization", "Demo Organization"],
      ["Report Date", "2026-08-18"],
      ["Period", "August 2026"],
      ["Total Cloud Spend", `$${totalCost.toFixed(2)}`],
      ["Potential Monthly Savings", `$${savings.toFixed(2)}`],
      ["Annual Savings Potential", `$${(savings * 12).toFixed(2)}`],
      ["Optimization Score", `${score}%`],
      ["Estimated Carbon (tCO₂)", `${(totalCarbon / 1000).toFixed(2)}`],
      ["Total Resources", String(mockResources.length)],
      ["Critical Alerts", String(criticalAlerts.length)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cloudopti-report-aug2026.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-4">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Organization</p>
          <p className="text-sm text-white font-medium">Demo Organization</p>
        </div>
        <div className="ml-4">
          <p className="text-xs text-slate-500 mb-0.5">Period</p>
          <p className="text-sm text-white font-mono">August 2026</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#050d1a] font-semibold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            <FileText size={13} />
            {generating ? "Generating…" : "Generate Report"}
          </button>
          {generated && (
            <>
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a6e] text-slate-300 px-3 py-2 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
                <Printer size={13} />Print
              </button>
              <button onClick={exportCSV} className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a6e] text-slate-300 px-3 py-2 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
                <Download size={13} />CSV
              </button>
              <button onClick={handleCopy} className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a6e] text-slate-300 px-3 py-2 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
                {copied ? <CheckCircle size={13} className="text-green-400" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report body */}
      {generated ? (
        <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f2040] to-[#0a1628] px-8 py-6 border-b border-[#1e3a6e]/60">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Cloud Optimization Report</h1>
                <p className="text-sm text-slate-400 mt-1">Demo Organization · August 2026 · Generated 2026-08-18</p>
              </div>
              <Badge label="Demo Mode" variant="amber" />
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Executive summary */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Executive Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Cloud Spend", value: `$${totalCost.toFixed(0)}`, color: "text-white" },
                  { label: "Monthly Savings Opportunity", value: `$${savings.toFixed(0)}`, color: "text-green-400" },
                  { label: "Optimization Score", value: `${score}%`, color: "text-cyan-400" },
                  { label: "Carbon Footprint", value: `${(totalCarbon / 1000).toFixed(2)} tCO₂`, color: "text-green-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0f2040]/60 border border-[#1e3a6e]/40 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                    <p className={`text-xl font-mono font-semibold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Top resources */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Top Expensive Resources</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-[#1e3a6e]/40">
                    {["Resource", "Provider", "Service", "Monthly Cost"].map((h) => (
                      <th key={h} className="py-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a6e]/20">
                  {[...mockResources].sort((a, b) => b.monthlyCost - a.monthlyCost).slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 text-sm text-white">{r.name}</td>
                      <td className="py-2 text-xs text-slate-400">{r.provider}</td>
                      <td className="py-2 text-xs text-slate-400">{r.service}</td>
                      <td className="py-2 text-sm font-mono text-white">${r.monthlyCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Recommendations */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Top AI Recommendations</h2>
              <div className="space-y-2">
                {topRecs.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-[#0f2040]/40 border border-[#1e3a6e]/30 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{r.title}</p>
                      <p className="text-xs text-slate-500">{r.category} · {r.resourceName}</p>
                    </div>
                    <span className="text-sm font-mono text-green-400 flex-shrink-0 ml-4">+${r.monthlySavings.toFixed(0)}/mo</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Critical alerts */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Critical Alerts</h2>
              {criticalAlerts.length === 0 ? (
                <p className="text-sm text-slate-500">No critical alerts in this period.</p>
              ) : (
                <div className="space-y-2">
                  {criticalAlerts.map((a) => (
                    <div key={a.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">{a.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="text-xs text-slate-600 pt-4 border-t border-[#1e3a6e]/40">
              Generated by CloudOpti AI · Demo Mode · All figures are simulated estimates
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FileText size={40} className="mb-4 text-slate-700" />
          <p className="text-sm">Click <strong className="text-slate-400">Generate Report</strong> to create a full report for August 2026.</p>
        </div>
      )}

      {/* Report history */}
      <div className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e3a6e]/60">
          <h2 className="text-sm font-semibold text-white">Report History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#0f2040]/60">
            <tr>
              {["Report ID", "Period", "Generated", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a6e]/30">
            {pastReports.map((r) => (
              <tr key={r.id} className="hover:bg-[#0f2040]/40 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.id}</td>
                <td className="px-4 py-3 text-sm text-white">{r.period}</td>
                <td className="px-4 py-3 text-xs text-slate-400 font-mono">{r.date}</td>
                <td className="px-4 py-3"><Badge label={r.status} variant="green" /></td>
                <td className="px-4 py-3">
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                    <Download size={11} />Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
