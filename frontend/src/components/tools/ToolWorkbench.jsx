import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Download, Play, Sparkles, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { runToolRequest } from "../../api/toolApi";
import { getToolTemplate } from "../../data/toolTemplates";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { addHistoryItem } from "../../utils/localData";

const downloadOutput = (toolName, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-output.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const formatFieldLabel = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const renderRichText = (text) => {
  const lines = String(text)
    .split("\n")
    .map((line) => line.trim());

  const elements = [];
  let bulletItems = [];
  let paragraphLines = [];

  const flushBullets = () => {
    if (!bulletItems.length) return;
    elements.push(
      <ul key={`bullets-${elements.length}`} className="space-y-2 pl-5 text-sm leading-7 text-slate-700 marker:text-slate-400">
        {bulletItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    );
    bulletItems = [];
  };

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    elements.push(
      <p key={`paragraph-${elements.length}`} className="text-sm leading-7 text-slate-700">
        {paragraphLines.join(" ")}
      </p>
    );
    paragraphLines = [];
  };

  lines.forEach((line) => {
    if (!line) {
      flushBullets();
      flushParagraph();
      return;
    }

    if (line.startsWith("## ")) {
      flushBullets();
      flushParagraph();
      elements.push(
        <h4 key={`heading-${elements.length}`} className="text-base font-semibold text-slate-900">
          {line.slice(3)}
        </h4>
      );
      return;
    }

    if (line.startsWith("# ")) {
      flushBullets();
      flushParagraph();
      elements.push(
        <h3 key={`title-${elements.length}`} className="text-xl font-semibold leading-8 text-slate-950">
          {line.slice(2)}
        </h3>
      );
      return;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      bulletItems.push(line.slice(2));
      return;
    }

    paragraphLines.push(line);
  });

  flushBullets();
  flushParagraph();

  return <div className="space-y-4">{elements}</div>;
};

const renderAiStructuredValue = (value) => (
  <div className="space-y-4">
    {value.title ? (
      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xl font-semibold leading-8 text-slate-900">{value.title}</p>
        {value.overview ? <p className="mt-2 text-sm leading-7 text-slate-600">{value.overview}</p> : null}
      </div>
    ) : null}

    {Array.isArray(value.sections) && value.sections.length ? (
      <div className="space-y-3">
        {value.sections.map((section, index) => (
          <div key={`${section.heading}-${index}`} className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{section.heading}</p>
            <div className="mt-3 space-y-2">
              {section.content.map((item, itemIndex) => (
                <div key={`${section.heading}-${itemIndex}`} className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : null}

    {Array.isArray(value.quickTips) && value.quickTips.length ? (
      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Quick Tips</p>
        <div className="mt-3 space-y-2">
          {value.quickTips.map((tip, index) => (
            <div key={`${tip}-${index}`} className="rounded-xl bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm shadow-slate-100">
              {tip}
            </div>
          ))}
        </div>
      </div>
    ) : null}

    {value.nextStep ? (
      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-900 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Next Step</p>
        <p className="mt-3 text-sm leading-7 text-slate-100">{value.nextStep}</p>
      </div>
    ) : null}
  </div>
);

const renderValue = (value) => {
  if (Array.isArray(value)) {
    const isStructuredSections =
      value.length > 0 && value.every((item) => typeof item === "object" && item !== null && "heading" in item && "content" in item);

    if (isStructuredSections) {
      return renderAiStructuredValue({ sections: value });
    }

    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={`${index}-${item}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {String(item)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    const isAiStructuredResult =
      "title" in value || "overview" in value || "sections" in value || "quickTips" in value || "nextStep" in value;

    if (isAiStructuredResult) {
      return renderAiStructuredValue(value);
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6">{JSON.stringify(value, null, 2)}</pre>
      </div>
    );
  }

  const textValue = String(value);
  const isLongText = textValue.length > 120 || textValue.includes("\n") || textValue.includes("#") || textValue.includes("- ");

  if (isLongText) {
    return (
      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
        {renderRichText(textValue)}
      </div>
    );
  }

  return <p className="text-lg font-semibold leading-8 text-slate-900">{textValue}</p>;
};

const getResultHighlights = (result) => {
  if (!result || typeof result !== "object") {
    return [];
  }

  return Object.entries(result)
    .filter(([, value]) => ["string", "number"].includes(typeof value) && String(value).length <= 40)
    .slice(0, 3)
    .map(([key, value]) => ({
      label: formatFieldLabel(key),
      value: String(value)
    }));
};

const ToolWorkbench = ({ tool }) => {
  const [payload, setPayload] = useState(getToolTemplate(tool.slug));
  const [result, setResult] = useState(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const { run, loading } = useAsyncAction((slug, values) => runToolRequest(slug, values));
  const resultEntries = result ? Object.entries(result) : [];
  const resultHighlights = getResultHighlights(result);

  useEffect(() => {
    setPayload(getToolTemplate(tool.slug));
    setResult(null);
    setShowRawResponse(false);
  }, [tool]);

  const updateField = (key, value) => {
    setPayload((current) => ({ ...current, [key]: value }));
  };

  const handleRun = async () => {
    const response = await run(tool.slug, payload);
    setResult(response.result);
    addHistoryItem({
      id: `${tool.slug}-${Date.now()}`,
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      input: payload,
      output: response.result,
      createdAt: new Date().toISOString()
    });
    toast.success(`${tool.name} completed`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success("Output copied");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,_rgba(248,250,252,1)_0%,_rgba(255,255,255,1)_55%,_rgba(241,245,249,0.9)_100%)] px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {tool.category}
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900">{tool.name}</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{tool.description}</p>
            </div>
            <span className="hidden rounded-2xl bg-slate-900 p-3 text-white shadow-lg shadow-slate-300/40 sm:inline-flex">
              <Wand2 size={18} />
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Workspace</p>
              <p className="mt-2 text-sm font-medium text-slate-700">Configure your inputs and launch the tool from here.</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white/80 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Output Style</p>
              <p className="mt-2 text-sm font-medium text-slate-700">Designed for quick scanning, copying, and presentation.</p>
            </div>
          </div>
        </div>
        <div className="space-y-5 p-6">
          {Object.entries(payload).map(([key, value]) => {
            if (typeof value === "boolean") {
              return (
                <label key={key} className="flex items-center justify-between rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm shadow-slate-100/80">
                  <span className="text-sm font-medium">{formatFieldLabel(key)}</span>
                  <input type="checkbox" checked={value} onChange={(event) => updateField(key, event.target.checked)} />
                </label>
              );
            }
            return (
              <label key={key} className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{formatFieldLabel(key)}</span>
                <textarea
                  rows={String(value).length > 60 ? 5 : 2}
                  value={value}
                  onChange={(event) => updateField(key, event.target.value)}
                  className="input-field min-h-[5rem] rounded-[1.2rem] border-slate-200 bg-slate-50/70 leading-7 shadow-sm shadow-slate-100/70 focus:bg-white"
                />
              </label>
            );
          })}
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Ready To Run</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review your inputs, then launch the tool to generate a polished result in the output panel.
            </p>
            <button onClick={handleRun} disabled={loading} className="btn-primary mt-4 w-full justify-center rounded-[1.15rem] py-3.5">
              <Play size={16} />
              {loading ? "Processing..." : "Run Tool"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(241,245,249,0.88)_100%)] p-6 shadow-sm shadow-slate-200/60">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Output</p>
            <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">Generated Result</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Clean, presentation-ready output with structured sections, clearer hierarchy, and quick export actions.
            </p>
          </div>
          {result ? (
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary rounded-[1.1rem]">
                <Copy size={16} />
                Copy
              </button>
              <button onClick={() => downloadOutput(tool.name, JSON.stringify(result, null, 2))} className="btn-secondary rounded-[1.1rem]">
                <Download size={16} />
                Download
              </button>
            </div>
          ) : null}
        </div>
        {result ? (
          <div className="mt-5 space-y-4">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-900 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
              <div className="grid gap-5 px-5 py-5 md:grid-cols-[1.05fr_0.95fr] md:items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200">
                    <Sparkles size={14} />
                    Result Ready
                  </div>
                  <h4 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">{tool.name} completed successfully</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Your output has been structured for quick reading, copying, and presentation. Use the cards below to review the key details first.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                  {(resultHighlights.length ? resultHighlights : [{ label: "Output Fields", value: String(resultEntries.length) }]).map((item) => (
                    <div key={item.label} className="rounded-[1.2rem] bg-white/10 px-4 py-4 backdrop-blur">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">{item.label}</p>
                      <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
              <div className="border-b border-slate-200 bg-[linear-gradient(135deg,_rgba(248,250,252,1)_0%,_rgba(255,255,255,1)_100%)] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Structured Output</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Formatted sections designed to make the result easier to scan and present.</p>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2">
                {resultEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className={`rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100 ${
                      resultEntries.length === 1 ||
                      typeof value === "string" && String(value).length > 180 ||
                      Array.isArray(value) ||
                      typeof value === "object" && value !== null
                        ? "md:col-span-2"
                        : ""
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{formatFieldLabel(key)}</p>
                    <div className="mt-3 w-full">{renderValue(value)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
              <button
                onClick={() => setShowRawResponse((current) => !current)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">Raw Response</p>
                  <p className="mt-1 text-sm text-slate-500">Expand this only when you need the exact machine-formatted output.</p>
                </div>
                {showRawResponse ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
              </button>

              {showRawResponse ? (
                <div className="border-t border-slate-200 px-5 pb-5">
                  <pre className="mt-4 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-white">
            <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                <Sparkles size={14} />
                Awaiting Output
              </div>
            </div>
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-lg shadow-slate-300/40">
                <Wand2 size={24} />
              </div>
              <p className="mt-5 font-display text-3xl font-semibold tracking-tight text-slate-900">Your result will appear here</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                Add your inputs on the left, run the tool, and this panel will transform into a polished output view with organized sections and quick actions.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ToolWorkbench;
