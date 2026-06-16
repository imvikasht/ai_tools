import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchTools } from "../api/toolApi";
import StatCard from "../components/tools/StatCard";
import { getHistory, getSavedTools } from "../utils/localData";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetchTools();
        const history = getHistory();
        const savedTools = getSavedTools();
        const topToolsMap = history.reduce((accumulator, item) => {
          accumulator[item.toolSlug] = accumulator[item.toolSlug] || { _id: item.toolSlug, toolName: item.toolName, count: 0 };
          accumulator[item.toolSlug].count += 1;
          return accumulator;
        }, {});
        const usageByCategory = response.tools.reduce((accumulator, tool) => {
          accumulator[tool.category] = (accumulator[tool.category] || 0) + 1;
          return accumulator;
        }, {});

        setData({
          stats: {
            totalTools: response.tools.length,
            savedTools: savedTools.length,
            totalRuns: history.length
          },
          recentActivity: history.slice(0, 6).map((item) => ({ ...item, _id: item.id })),
          topTools: Object.values(topToolsMap).sort((a, b) => b.count - a.count).slice(0, 5),
          usageByCategory
        });
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="glass-panel rounded-3xl p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-sm text-brand-400">
              <Sparkles size={16} />
              Premium multi-tool workspace
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold">Your AI productivity dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-300">
              Track tool usage, access recent executions, and launch new tools from one place.
            </p>
          </div>
          <Link to="/app/tools" className="btn-primary">
            Explore Tools
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total tools" value={data?.stats.totalTools || 0} hint="Available in the shared catalog" />
        <StatCard label="Saved tools" value={data?.stats.savedTools || 0} hint="Pinned to your account" />
        <StatCard label="Total runs" value={data?.stats.totalRuns || 0} hint="Count of completed executions" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Recent activity</h2>
          <div className="mt-5 space-y-4">
            {data?.recentActivity?.length ? data.recentActivity.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200/70 px-4 py-4 dark:border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{item.toolName}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )) : <p className="text-slate-500 dark:text-slate-300">No activity yet. Run a tool to populate your dashboard.</p>}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="font-display text-2xl font-semibold">Top tools</h2>
          <div className="mt-5 space-y-4">
            {data?.topTools?.length ? data.topTools.map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
                <p className="font-semibold">{item.toolName}</p>
                <p className="mt-1 text-sm text-slate-300">Used {item.count} times</p>
              </div>
            )) : <p className="text-slate-500 dark:text-slate-300">Your most-used tools will appear here.</p>}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-2xl font-semibold">Platform coverage</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Tool distribution by category makes the project architecture easy to explain during viva and demo.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(data?.usageByCategory || {}).map(([category, count]) => (
            <div key={category} className="rounded-2xl bg-slate-900 px-4 py-5 text-white">
              <p className="text-sm text-slate-300">{category}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold">{count}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-brand-300">available tools</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
