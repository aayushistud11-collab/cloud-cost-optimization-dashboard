import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Server, DollarSign, Zap, Activity, Leaf,
  Play, FileText, Settings, Info, Bell, Search, LogOut,
  ChevronLeft, ChevronRight, Menu, X, User, Cloud
} from "lucide-react";
import { mockAlerts } from "../data/mockData";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/resources", icon: Server, label: "Resources" },
  { to: "/cost-analytics", icon: DollarSign, label: "Cost Analytics" },
  { to: "/recommendations", icon: Zap, label: "Recommendations" },
  { to: "/performance", icon: Activity, label: "Performance" },
  { to: "/carbon", icon: Leaf, label: "Carbon Footprint" },
  { to: "/simulator", icon: Play, label: "Simulator" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/about", icon: Info, label: "About" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved).length;

  const pageTitle = navItems.find((n) => location.pathname.startsWith(n.to))?.label ?? "CloudOpti AI";

  function handleLogout() {
    sessionStorage.removeItem("cloudopti_auth");
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-[#050d1a] text-slate-200 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 flex flex-col bg-[#0a1628] border-r border-[#1e3a6e]/60
          transition-all duration-300 h-full flex-shrink-0
          ${collapsed ? "w-16" : "w-56"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1e3a6e]/60">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Cloud size={16} className="text-[#050d1a]" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-wide text-white truncate">CloudOpti AI</span>
          )}
        </div>

        {/* Demo badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-[10px] font-mono tracking-widest text-center">
            DEMO MODE
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
                ${isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-[#152b58]/60 hover:text-slate-200"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-[#1e3a6e]/60">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-[#152b58]/60 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
        <header className="flex items-center justify-between px-4 py-3 bg-[#0a1628]/80 backdrop-blur border-b border-[#1e3a6e]/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#152b58]/60"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="font-semibold text-base text-white">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[#0f2040] border border-[#1e3a6e] rounded-lg px-3 py-1.5">
                <Search size={14} className="text-slate-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { setSearchOpen(false); setSearchQuery(""); }}
                  placeholder="Search resources, recommendations…"
                  className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-52"
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#152b58]/60 transition-all"
              >
                <Search size={17} />
              </button>
            )}

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#152b58]/60 transition-all">
              <Bell size={17} />
              {unresolvedAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#152b58]/60 transition-all"
              >
                <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center">
                  <User size={14} className="text-cyan-400" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-white leading-none">Demo User</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Admin</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-10 w-44 bg-[#0f2040] border border-[#1e3a6e] rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-[#1e3a6e]/60">
                    <p className="text-xs font-medium text-white">Demo User</p>
                    <p className="text-[10px] text-slate-500">demo@cloudopti.ai</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
