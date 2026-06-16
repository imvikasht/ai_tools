import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Layers3,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchTools } from "../api/toolApi";
import ToolModal from "../components/tools/ToolModal";
import { getSavedTools, toggleSavedTool } from "../utils/localData";

const stats = [
  { label: "Tool library", value: "118+" },
  { label: "Usage mode", value: "No Login" },
  { label: "Result history", value: "Local Save" },
];

const capabilities = [
  {
    title: "AI tools",
    description:
      "Notes, summary, script, email, SWOT, agenda, and prompt-based generators.",
    icon: Sparkles,
  },
  {
    title: "Student tools",
    description:
      "Attendance, CGPA, percentage, study planning, and academic helper utilities.",
    icon: BookOpen,
  },
  {
    title: "Business tools",
    description:
      "GST, EMI, invoice, meeting, and idea-planning support for practical demos.",
    icon: BriefcaseBusiness,
  },
];

const heroHighlights = [
  "Single-page tool access",
  "AI + utility + business mix",
  "Works without login or database",
];

const sectionAnimation = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.35 },
};

const HomePage = () => {
  const [catalog, setCatalog] = useState({ tools: [], categories: [] });
  const [savedTools, setSavedTools] = useState(getSavedTools());
  const [selectedTool, setSelectedTool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetchTools();
        setCatalog(response);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const featuredTools = useMemo(
    () => catalog.tools.filter((tool) => tool.featured).slice(0, 4),
    [catalog.tools]
  );
  const showcaseTools = useMemo(
    () => catalog.tools.slice(0, 8),
    [catalog.tools]
  );

  const handleSave = (slug) => {
    setSavedTools(toggleSavedTool(slug));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between xl:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Wand2 size={20} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">
                AI MultiTools
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
            <a href="#overview" className="transition hover:text-slate-900">
              Overview
            </a>
            <a href="#featured" className="transition hover:text-slate-900">
              Featured
            </a>
            <a href="#showcase" className="transition hover:text-slate-900">
              Showcase
            </a>
            <a href="#benefits" className="transition hover:text-slate-900">
              Benefits
            </a>
          </nav>

          <Link to="/tools" className="btn-primary">
            Open All Tools
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 xl:px-8">
        <section id="overview">
          <motion.div
            {...sectionAnimation}
            className="glass-panel overflow-hidden p-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              <Layers3 size={16} />
              Dashboard-first product experience
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
              One workspace for AI tools, productivity utilities, and student
              calculators.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              This version focuses on a cleaner SaaS-like interface. The
              homepage is now the main product screen, and each tool opens in a
              focused modal without taking users away from the page.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/tools" className="btn-primary">
                Browse All Tools
              </Link>
              <button
                onClick={() => setSelectedTool(featuredTools[0] || null)}
                className="btn-secondary"
              >
                Try Featured Tool
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {heroHighlights.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 size={16} className="text-slate-900" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 font-display text-3xl font-semibold">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="featured" className="section-shell mt-8 bg-white">
          <motion.div {...sectionAnimation}>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="section-heading">Featured Tools</h2>
                <p className="section-copy">
                  Recommended tools for first-time demo flow and quick
                  presentation value.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredTools.map((tool) => (
                <button
                  key={tool.slug}
                  onClick={() => setSelectedTool(tool)}
                  className="glass-panel p-5 text-left transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      Featured
                    </span>
                    <Star size={16} className="text-slate-400" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold">
                    {tool.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {tool.description}
                  </p>
                  <p className="mt-5 text-sm font-semibold text-slate-900">
                    Open workspace
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="showcase" className="section-shell mt-8">
          <motion.div {...sectionAnimation}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="section-heading">Homepage Tool Showcase</h2>
                <p className="section-copy">
                  A curated set of tools is shown here for quick access. Use the
                  full tools page to explore the complete catalog in one place.
                </p>
              </div>
              <Link to="/tools" className="btn-secondary">
                View All Tools
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {showcaseTools.map((tool) => (
                <div
                  key={tool.slug}
                  onClick={() => setSelectedTool(tool)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTool(tool);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="glass-panel p-5 text-left transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {tool.category}
                      </span>
                      <h3 className="mt-4 font-display text-2xl font-semibold text-slate-900">
                        {tool.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {tool.description}
                      </p>
                    </div>
                    {tool.featured ? (
                      <Star className="mt-1 text-slate-400" size={18} />
                    ) : null}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      Use tool
                      <ArrowRight size={16} />
                    </span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSave(tool.slug);
                      }}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        savedTools.includes(tool.slug)
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {savedTools.includes(tool.slug) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="benefits" className="section-shell mt-8 bg-white">
          <motion.div {...sectionAnimation}>
            <h2 className="section-heading">Why This Layout Works Better</h2>
            <p className="section-copy">
              This version is intentionally simpler: clear information
              hierarchy, clean cards, section separation, and fewer distracting
              visuals.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {capabilities.map(({ title, description, icon: Icon }) => (
                <div key={title} className="glass-panel p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="section-shell mt-8">
          <motion.div
            {...sectionAnimation}
            className="glass-panel overflow-hidden"
          >
            <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
                  Project Footer
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight">
                  Present the platform like a polished product, not just a
                  collection of forms.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  Use the homepage to show the architecture, launch tools in the
                  modal workspace, and demonstrate clean structured results
                  during viva or project review.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/tools" className="btn-primary">
                    Explore Full Library
                  </Link>
                  <button
                    onClick={() =>
                      setSelectedTool(
                        featuredTools[1] || featuredTools[0] || null
                      )
                    }
                    className="btn-secondary"
                  >
                    Open Sample Tool
                  </button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="grid gap-4">
                  <div className="rounded-[1.25rem] bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                      Best use case
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      College demo, viva, mini SaaS showcase
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                      Primary value
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      40+ tools with instant modal interaction
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] bg-gradient-to-r from-indigo-600 to-slate-900 p-5 text-white">
                    <p className="text-sm font-medium text-indigo-100">
                      Positioning
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      Simple, professional, and easy to explain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between xl:px-8">
          <div>
            <p className="font-display text-lg font-semibold text-slate-900">
              AI MultiTools
            </p>
            <p className="mt-1">
              Single-page multi-tool platform for final year project demos.
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="#overview" className="transition hover:text-slate-900">
              Overview
            </a>
            <a href="#showcase" className="transition hover:text-slate-900">
              Showcase
            </a>
            <a href="#benefits" className="transition hover:text-slate-900">
              Benefits
            </a>
            <Link to="/tools" className="transition hover:text-slate-900">
              All Tools
            </Link>
          </div>
        </div>
      </footer>

      <ToolModal
        tool={selectedTool}
        open={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
};

export default HomePage;
