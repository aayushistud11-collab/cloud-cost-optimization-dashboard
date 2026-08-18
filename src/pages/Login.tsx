import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Cloud, Zap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 900));
    if (email === "admin@cloudopti.ai" && password === "demo1234") {
      sessionStorage.setItem("cloudopti_auth", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Use the Demo Login button below.");
    }
    setLoading(false);
  }

  function demoLogin() {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("cloudopti_auth", "true");
      navigate("/dashboard");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-[#050d1a] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0a1628] border-r border-[#1e3a6e]/60 p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center">
            <Cloud size={18} className="text-[#050d1a]" />
          </div>
          <span className="text-white font-semibold text-lg">CloudOpti AI</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            AI-Powered Cloud<br />Cost Optimization
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Monitor spend, detect idle resources, and receive intelligent recommendations across AWS, Azure, and Google Cloud.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avg. Monthly Savings", value: "$2,379" },
              { label: "Optimization Score", value: "68%" },
              { label: "Resources Monitored", value: "22" },
              { label: "AI Recommendations", value: "10" },
            ].map((s) => (
              <div key={s.label} className="bg-[#0f2040] border border-[#1e3a6e]/60 rounded-xl p-4">
                <div className="text-cyan-400 font-mono text-xl font-semibold">{s.value}</div>
                <div className="text-slate-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <Zap size={12} className="text-amber-500" />
          Demo Mode — No real cloud credentials required
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Cloud size={15} className="text-[#050d1a]" />
            </div>
            <span className="text-white font-semibold">CloudOpti AI</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-slate-400 text-sm mb-8">Access your cloud optimization dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cloudopti.ai"
                className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-[#1e3a6e] bg-[#0a1628] accent-cyan-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-400">Remember me</label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#050d1a] font-semibold rounded-xl py-3 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e3a6e]/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#050d1a] text-slate-600 text-xs">or</span>
            </div>
          </div>

          <button
            onClick={demoLogin}
            disabled={loading}
            className="w-full bg-[#0a1628] border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 font-semibold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap size={14} />
            Continue with Demo Login
          </button>

          <p className="text-center text-xs text-slate-500 mt-6">
            No account?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
