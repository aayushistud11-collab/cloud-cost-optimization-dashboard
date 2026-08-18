import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Cloud } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", org: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.org || !form.password) {
      setError("All fields are required."); return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email address."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    sessionStorage.setItem("cloudopti_auth", "true");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Cloud size={15} className="text-[#050d1a]" />
          </div>
          <span className="text-white font-semibold">CloudOpti AI</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-slate-400 text-sm mb-8">Start optimizing your cloud infrastructure</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Full name</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Organization</label>
              <input
                value={form.org}
                onChange={(e) => handleChange("org", e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Confirm password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-[#0a1628] border border-[#1e3a6e] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#050d1a] font-semibold rounded-xl py-3 text-sm transition-all disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
