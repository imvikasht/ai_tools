import { History, LayoutDashboard, MoonStar, Sparkles, SunMedium, Wrench } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/tools", label: "Tools", icon: Wrench },
  { to: "/app/history", label: "History", icon: History }
];

const AppShell = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 -z-10 bg-hero-mesh dark:block" />
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel rounded-3xl p-5">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-400">AI Multi Tool</p>
            <h1 className="mt-3 font-display text-2xl font-semibold">Command center</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">One dashboard for productivity, business, student, and AI tools.</p>
          </div>
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-500 text-white shadow-glow"
                      : "text-slate-600 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-white">
            <p className="text-sm text-slate-300">Instant access mode</p>
            <h2 className="mt-1 font-semibold">No login required</h2>
            <p className="mt-2 text-sm text-slate-400">Saved tools and history are stored in your browser for a smooth demo workflow.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={toggleTheme} className="btn-secondary flex-1 justify-center">
              {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className="btn-secondary flex-1 justify-center">
              <Sparkles size={16} />
              Ready
            </button>
          </div>
        </aside>
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
