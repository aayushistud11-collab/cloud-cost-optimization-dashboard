import { useState } from "react";
import { Save, CheckCircle, Info, RefreshCw, Trash2 } from "lucide-react";
import Badge from "../components/Badge";

export default function Settings() {
  const [org, setOrg] = useState({ name: "Demo Organization", currency: "USD", timezone: "UTC", budget: "11000", alertThreshold: "90", reportPeriod: "Monthly" });
  const [notifications, setNotifications] = useState({ budget: true, resource: true, performance: true, ai: true, weekly: false });
  const [theme, setTheme] = useState("dark");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleSave() {
    setSaved(true);
    showToast("Settings saved (Demo Mode — changes are not persisted).");
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleNotif(key: keyof typeof notifications) {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
  }

  return (
    <div className="p-6 space-y-6 max-w-[900px] relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/40 text-green-400 text-sm rounded-xl px-4 py-3 shadow-lg">{toast}</div>
      )}

      {/* Organization */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Organization Settings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Organization Name", key: "name", type: "text" },
            { label: "Default Currency", key: "currency", type: "text" },
            { label: "Time Zone", key: "timezone", type: "text" },
            { label: "Monthly Cloud Budget (USD)", key: "budget", type: "number" },
            { label: "Alert Threshold (%)", key: "alertThreshold", type: "number" },
            { label: "Default Reporting Period", key: "reportPeriod", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
              <input
                type={type}
                value={org[key as keyof typeof org]}
                onChange={(e) => setOrg((o) => ({ ...o, [key]: e.target.value }))}
                className="w-full bg-[#0f2040] border border-[#1e3a6e] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Cloud provider connections */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-semibold text-white">Cloud Provider Connections</h2>
        </div>
        <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2.5 mb-5">
          <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">Cloud credentials must be configured through secure server-side environment variables or a secrets manager. Never enter credentials here. See <code className="text-cyan-400">.env.example</code> for required variables.</p>
        </div>
        <div className="space-y-3">
          {[
            { name: "Amazon Web Services", short: "AWS", color: "#f97316", envVars: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION"] },
            { name: "Microsoft Azure", short: "AZ", color: "#60a5fa", envVars: ["AZURE_SUBSCRIPTION_ID", "AZURE_CLIENT_ID", "AZURE_TENANT_ID"] },
            { name: "Google Cloud Platform", short: "GCP", color: "#4ade80", envVars: ["GOOGLE_CLOUD_PROJECT", "GOOGLE_APPLICATION_CREDENTIALS"] },
          ].map((p) => (
            <div key={p.short} className="flex items-center justify-between p-4 bg-[#0f2040]/60 border border-[#1e3a6e]/40 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30` }}>
                  {p.short}
                </div>
                <div>
                  <p className="text-sm text-white">{p.name}</p>
                  <div className="flex gap-1 mt-1">
                    {p.envVars.map((v) => <code key={v} className="text-[9px] text-slate-500 bg-[#0a1628] px-1.5 py-0.5 rounded font-mono">{v}</code>)}
                  </div>
                </div>
              </div>
              <Badge label="Demo Mode" variant="amber" />
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Notification Preferences</h2>
        <div className="space-y-3">
          {[
            { key: "budget" as const, label: "Budget Alerts", desc: "Alert when spend approaches your monthly budget" },
            { key: "resource" as const, label: "Resource Alerts", desc: "Alert for idle, overprovisioned, or critical resources" },
            { key: "performance" as const, label: "Performance Alerts", desc: "Alert for high CPU, memory, latency, or error rate" },
            { key: "ai" as const, label: "AI Recommendation Alerts", desc: "Alert when new recommendations are generated" },
            { key: "weekly" as const, label: "Weekly Summary Reports", desc: "Receive a weekly digest of your cloud spend and savings" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-[#0f2040]/40 rounded-lg">
              <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(key)}
                className={`relative w-10 h-5 rounded-full transition-colors ${notifications[key] ? "bg-cyan-500" : "bg-[#1e3a6e]"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${notifications[key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Appearance</h2>
        <div className="flex gap-3">
          {["dark", "light", "system"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-xl border text-sm transition-colors ${theme === t ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "border-[#1e3a6e] text-slate-400 hover:border-[#254a88]"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Data settings */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Data Settings</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => showToast("Demo data refreshed.")} className="flex items-center gap-2 border border-[#1e3a6e] text-slate-300 px-4 py-2 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
            <RefreshCw size={13} />Refresh Demo Data
          </button>
          <button onClick={() => showToast("Demo data reset to defaults.")} className="flex items-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm hover:border-red-500/50 transition-colors">
            <Trash2 size={13} />Reset Demo Data
          </button>
          <button onClick={() => showToast("Export not available in Demo Mode.")} className="flex items-center gap-2 border border-[#1e3a6e] text-slate-300 px-4 py-2 rounded-xl text-sm hover:border-cyan-500/40 transition-colors">
            Export Organization Data
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#050d1a] font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
