import { useEffect, useState } from "react";
import HistoryList from "../components/tools/HistoryList";
import { deleteHistoryItemById, getHistory } from "../utils/localData";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setHistory(getHistory());
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id) => {
    const nextHistory = deleteHistoryItemById(id);
    setHistory(nextHistory);
  };

  if (loading) {
    return <div className="glass-panel rounded-3xl p-8">Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6">
        <h1 className="font-display text-4xl font-semibold">Execution history</h1>
        <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-300">
          Every tool run is stored with its input and output so users can revisit previous work.
        </p>
      </section>
      {history.length ? <HistoryList items={history} onDelete={handleDelete} /> : (
        <div className="glass-panel rounded-3xl p-8 text-slate-500 dark:text-slate-300">
          No history available yet. Run a tool from the Tool Studio to generate records.
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
