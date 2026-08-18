import { Cloud, Zap, Server, DollarSign, Leaf, Activity, Shield, Code2, GitBranch } from "lucide-react";
import Badge from "../components/Badge";

export default function About() {
  return (
    <div className="p-6 max-w-[900px] space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2040] to-[#0a1628] border border-[#1e3a6e]/60 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
            <Cloud size={22} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CloudOpti AI</h1>
            <p className="text-slate-400 text-sm">AI-Powered Cloud Cost & Performance Optimization Platform</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge label="Demo Mode" variant="amber" />
          <Badge label="v1.0.0" variant="gray" />
          <Badge label="Academic Project" variant="blue" />
          <Badge label="Open Source Ready" variant="cyan" />
        </div>
      </div>

      {/* Problem statement */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-3">Problem Statement</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Organizations migrating to cloud infrastructure frequently encounter uncontrolled spending, idle resources, overprovisioned compute, and lack of visibility into carbon emissions. Traditional monitoring tools focus on uptime rather than cost efficiency. CloudOpti AI addresses this gap by providing a unified platform for cloud cost analytics, AI-generated optimization recommendations, performance monitoring, and sustainability tracking.
        </p>
      </section>

      {/* Objectives */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Project Objectives</h2>
        <ul className="space-y-2">
          {[
            "Provide real-time visibility into cloud infrastructure costs across AWS, Azure, and GCP",
            "Generate AI-powered optimization recommendations based on utilization patterns",
            "Enable safe simulation of cost-reduction strategies without modifying infrastructure",
            "Track and reduce carbon footprint from cloud workloads",
            "Produce exportable reports for FinOps and sustainability teams",
          ].map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="text-cyan-400 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
              {o}
            </li>
          ))}
        </ul>
      </section>

      {/* Features */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Main Features</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: DollarSign, label: "Cost Analytics", desc: "Daily, weekly, monthly spending views with forecasting and budget tracking" },
            { icon: Zap, label: "AI Recommendations", desc: "Rule-based demo engine with real LLM integration interface for production" },
            { icon: Server, label: "Resource Inventory", desc: "Searchable, sortable table of 22+ mock resources across all three providers" },
            { icon: Activity, label: "Performance Monitoring", desc: "CPU, memory, latency, error rate, and availability charts with anomaly detection" },
            { icon: Leaf, label: "Carbon Footprint", desc: "Estimated emissions by provider, region, and service with sustainability recommendations" },
            { icon: Cloud, label: "Optimization Simulator", desc: "Safe planning tool for evaluating cost-reduction strategies without infrastructure changes" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 p-4 bg-[#0f2040]/60 border border-[#1e3a6e]/40 rounded-xl">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Code2 size={15} className="text-cyan-400" />
          Technology Stack
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { cat: "Frontend", items: ["React 19 + TypeScript", "Vite 8", "Tailwind CSS v4", "Recharts", "Lucide React"] },
            { cat: "Routing & State", items: ["React Router v7", "React useState/useMemo", "Session storage auth", "Component-level state"] },
            { cat: "Future Integrations", items: ["AWS SDK (server-side)", "Azure SDK (server-side)", "Google Cloud SDK", "OpenAI / Anthropic API"] },
          ].map(({ cat, items }) => (
            <div key={cat} className="bg-[#0f2040]/60 border border-[#1e3a6e]/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-3">{cat}</p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item} className="text-xs text-slate-400 font-mono">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch size={15} className="text-cyan-400" />
          System Architecture
        </h2>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p><span className="text-white font-medium">Data Layer</span> — All mock data resides in <code className="text-cyan-400 text-xs">src/data/mockData.ts</code>. Cloud provider services (<code className="text-cyan-400 text-xs">awsService, azureService, googleCloudService</code>) expose a shared adapter interface so the UI receives a consistent format regardless of provider.</p>
          <p><span className="text-white font-medium">AI Recommendation Engine</span> — The demo engine in <code className="text-cyan-400 text-xs">src/data/mockData.ts</code> applies utilization rules (CPU {"<"}15%, idle {">"} 14 days, storage {"<"}30%) to generate recommendations. The interface in <code className="text-cyan-400 text-xs">src/services/aiService.ts</code> can be connected to any LLM API.</p>
          <p><span className="text-white font-medium">Routing</span> — React Router v7 provides client-side routing with protected routes. Authentication state is stored in <code className="text-cyan-400 text-xs">sessionStorage</code> for the demo. Production implementations should use JWT or OAuth.</p>
          <p><span className="text-white font-medium">Security</span> — No cloud credentials appear in client-side code. Environment variable placeholders are documented in settings. All "Apply" actions are simulations only.</p>
        </div>
      </section>

      {/* Security */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={15} className="text-cyan-400" />
          Security Considerations
        </h2>
        <ul className="space-y-2">
          {[
            "No cloud credentials are stored or exposed in the frontend",
            "The simulator never executes real infrastructure changes",
            "All recommendations are advisory; apply actions require explicit server-side confirmation",
            "Future integrations should use IAM roles with least-privilege policies",
            "Credentials must be stored in environment variables or a secrets manager (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager)",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <Shield size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Demo credentials */}
      <section className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <h2 className="text-base font-semibold text-amber-400 mb-3">Demo Mode Credentials</h2>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex gap-4">
            <span className="text-slate-500">Email:</span>
            <span className="text-white">admin@cloudopti.ai</span>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">Password:</span>
            <span className="text-white">demo1234</span>
          </div>
        </div>
        <p className="text-xs text-amber-500/70 mt-3">Or use the "Continue with Demo Login" button — no credentials required.</p>
      </section>

      {/* Limitations & future */}
      <section className="bg-[#0a1628] border border-[#1e3a6e]/60 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Current Limitations & Future Scope</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Limitations</p>
            <ul className="space-y-1 text-xs text-slate-400">
              {["Uses simulated data, no live cloud connection", "Rule-based AI engine, no real LLM", "Session-only authentication", "No server-side persistence", "Carbon estimates are approximations"].map((l) => (
                <li key={l} className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">·</span>{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Future Scope</p>
            <ul className="space-y-1 text-xs text-slate-400">
              {["Real AWS, Azure, GCP SDK integrations", "LLM-powered recommendation engine (Claude, GPT-4)", "Multi-tenant database (PostgreSQL)", "OAuth2 / SSO authentication", "Real-time anomaly detection pipeline", "Kubernetes operator for in-cluster metrics"].map((l) => (
                <li key={l} className="flex items-start gap-1.5"><span className="text-green-400 mt-0.5">·</span>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
