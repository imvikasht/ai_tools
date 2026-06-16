const StatCard = ({ label, value, hint }) => (
  <div className="glass-panel rounded-3xl p-5">
    <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
    <h3 className="mt-3 font-display text-3xl font-semibold">{value}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
  </div>
);

export default StatCard;
