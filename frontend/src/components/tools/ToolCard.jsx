import { motion } from "framer-motion";
import { Bookmark, Sparkles } from "lucide-react";

const ToolCard = ({ tool, isSaved, isActive, onOpen, onSave }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`glass-panel relative flex h-full flex-col rounded-[1.75rem] border border-slate-200/90 bg-white/95 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] ${
      isActive ? "ring-2 ring-slate-300 shadow-[0_20px_45px_rgba(15,23,42,0.08)]" : ""
    }`}
  >
    <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    <div className="pointer-events-none absolute right-5 top-5 h-16 w-16 rounded-full bg-slate-100/80 blur-2xl" />
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {tool.category}
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-slate-900">{tool.name}</h3>
        <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">{tool.description}</p>
      </div>
      {tool.featured ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          <Sparkles size={14} />
          Featured
        </span>
      ) : null}
    </div>
    <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-200 pt-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Status</p>
        <p className="mt-2 text-sm font-medium text-slate-600">{isActive ? "Currently selected" : "Ready to open"}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button onClick={() => onOpen(tool)} className="btn-primary">
          {isActive ? "Open Tool" : "Launch Tool"}
        </button>
        <button onClick={() => onSave(tool.slug)} className="btn-secondary">
          <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  </motion.div>
);

export default ToolCard;
