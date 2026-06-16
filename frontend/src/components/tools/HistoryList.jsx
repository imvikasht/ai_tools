import { Trash2 } from "lucide-react";

const HistoryList = ({ items, onDelete }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item._id || item.id} className="glass-panel rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand-400">{item.category}</p>
            <h3 className="mt-2 font-display text-xl font-semibold">{item.toolName}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={() => onDelete(item._id || item.id)} className="btn-secondary">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
            <p className="mb-2 font-semibold">Input</p>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(item.input, null, 2)}</pre>
          </div>
          <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
            <p className="mb-2 font-semibold">Output</p>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(item.output, null, 2)}</pre>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default HistoryList;
