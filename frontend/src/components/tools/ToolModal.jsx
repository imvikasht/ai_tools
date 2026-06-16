import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ToolWorkbench from "./ToolWorkbench";

const ToolModal = ({ tool, open, onClose }) => (
  <AnimatePresence>
    {open && tool ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-2 py-2 backdrop-blur-md md:px-4 md:py-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="min-h-[calc(100vh-1rem)] w-full overflow-hidden rounded-[2rem] border border-white/50 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,0.98)_0%,_rgba(241,245,249,0.98)_100%)] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.22)] md:min-h-[calc(100vh-2rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 px-5 py-4 shadow-sm shadow-slate-200/60 backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Tool Workspace</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">{tool.name}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{tool.description}</p>
            </div>
            <button onClick={onClose} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-50">
              <X size={18} />
            </button>
          </div>
          <ToolWorkbench tool={tool} />
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default ToolModal;
