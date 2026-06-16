import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { fetchTools } from "../api/toolApi";
import ToolCard from "../components/tools/ToolCard";
import ToolModal from "../components/tools/ToolModal";
import { getSavedTools, toggleSavedTool } from "../utils/localData";

const ToolsPage = () => {
  const [catalog, setCatalog] = useState({ tools: [], categories: [] });
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTool, setSelectedTool] = useState(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedTools, setSavedTools] = useState(getSavedTools());

  const handleOpenTool = (tool) => {
    setSelectedTool(tool);
    setIsToolModalOpen(true);
  };

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetchTools();
        setCatalog(response);
        setSelectedTool(response.tools[0]);
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
  }, []);

  const filteredTools = useMemo(() => {
    return catalog.tools.filter((tool) => {
      const categoryMatch = activeCategory === "All" || tool.category === activeCategory;
      const searchMatch =
        !searchTerm ||
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, catalog.tools, searchTerm]);

  const groupedTools = useMemo(() => {
    const groups = catalog.categories
      .filter((category) => category !== "All")
      .map((category) => ({
        category,
        tools: filteredTools.filter((tool) => tool.category === category)
      }))
      .filter((group) => group.tools.length);

    return activeCategory === "All" ? groups : groups.filter((group) => group.category === activeCategory);
  }, [activeCategory, catalog.categories, filteredTools]);

  const handleSave = (slug) => {
    const nextSavedTools = toggleSavedTool(slug);
    setSavedTools(nextSavedTools);
    toast.success("Saved tools updated");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 xl:px-8">
        <section className="glass-panel relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-slate-100 via-white to-slate-100 opacity-80" />
          <div className="pointer-events-none absolute -right-20 top-10 h-44 w-44 rounded-full bg-slate-200/50 blur-3xl" />
          <div className="pointer-events-none absolute left-10 top-16 h-24 w-24 rounded-full bg-white/70 blur-2xl" />
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
              <span className="mt-4 inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Workspace Catalog
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-5xl">All Tools In One Place</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Browse the complete tool catalog, filter by category, search by use case, save favorites, and launch any tool from a single dedicated page.
              </p>
            </div>
            <div className="relative grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 px-5 py-4 shadow-sm shadow-slate-200/60 backdrop-blur">
                <p className="text-sm text-slate-500">Catalog size</p>
                <p className="mt-2 font-display text-3xl font-semibold">{loading ? "..." : catalog.tools.length}</p>
                <p className="mt-1 text-sm text-slate-500">Ready to launch in a popup workspace</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-900 px-5 py-4 text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)]">
                <p className="text-sm text-slate-300">Active view</p>
                <p className="mt-2 font-display text-2xl font-semibold">{activeCategory}</p>
                <p className="mt-1 text-sm text-slate-300">{searchTerm ? "Search is narrowing your catalog." : "Use category chips or search to refine."}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/50">
              <Search size={18} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tools by name or use case"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {catalog.categories.map((category) => (
                <button key={category} onClick={() => setActiveCategory(category)} className={category === activeCategory ? "btn-primary" : "btn-secondary"}>
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-8">
          <section>
            {loading ? (
              <div className="glass-panel p-8">Loading tools...</div>
            ) : groupedTools.length ? (
              <div className="space-y-10">
                {groupedTools.map((group) => (
                  <section key={group.category} className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92)_0%,_rgba(248,250,252,0.98)_100%)] px-6 py-5 shadow-[0_14px_38px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Category Section</p>
                        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">{group.category}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Explore the tools in the {group.category.toLowerCase()} section and open any one in the workspace popup.
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                        {group.tools.length} tool{group.tools.length === 1 ? "" : "s"}
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {group.tools.map((tool) => (
                        <ToolCard
                          key={tool.slug}
                          tool={tool}
                          isSaved={savedTools.includes(tool.slug)}
                          isActive={selectedTool?.slug === tool.slug}
                          onOpen={handleOpenTool}
                          onSave={handleSave}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-8 text-slate-500">
                No tools matched your search. Try a different keyword or switch category.
              </div>
            )}
          </section>
        </div>
      </div>
      <ToolModal tool={selectedTool} open={isToolModalOpen} onClose={() => setIsToolModalOpen(false)} />
    </div>
  );
};

export default ToolsPage;
