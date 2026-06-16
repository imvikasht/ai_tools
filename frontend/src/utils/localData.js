const savedToolsKey = "ai-multi-tool-saved-tools";
const historyKey = "ai-multi-tool-history";

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
};

export const getSavedTools = () => readJson(savedToolsKey, []);

export const toggleSavedTool = (slug) => {
  const current = getSavedTools();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  localStorage.setItem(savedToolsKey, JSON.stringify(next));
  return next;
};

export const getHistory = () => readJson(historyKey, []);

export const addHistoryItem = (item) => {
  const history = getHistory();
  const next = [item, ...history].slice(0, 50);
  localStorage.setItem(historyKey, JSON.stringify(next));
  return next;
};

export const deleteHistoryItemById = (id) => {
  const next = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(historyKey, JSON.stringify(next));
  return next;
};
