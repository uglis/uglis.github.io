"use client";

import { useState } from "react";

export default function AdminPage() {
  const [file, setFile] = useState("posts/new-post.md");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handlePreview = () => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      setStatus({ message: "预览窗口被拦截，请允许弹窗后重试", type: "error" });
      return;
    }
    w.document.write(
      `<pre style="white-space:pre-wrap;font-family:monospace;line-height:1.6;padding:24px;background:#0d1117;color:#e6edf3;">${content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre>`
    );
    w.document.close();
  };

  const handlePublish = async () => {
    if (!file.startsWith("posts/")) {
      setStatus({ message: "ERROR: path must start with posts/", type: "error" });
      return;
    }
    if (!content.trim()) {
      setStatus({ message: "ERROR: content cannot be empty", type: "error" });
      return;
    }
    setLoading(true);
    setStatus({ message: "publishing...", type: "" });
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file, content }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "publish failed");
      setStatus({ message: `OK: published ${data.slug}`, type: "ok" });
    } catch (err) {
      setStatus({
        message: `ERROR: ${err instanceof Error ? err.message : "unknown"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="terminal-window mb-3">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/admin</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">./publish.sh</span>
          </div>
          <div className="cmd-output text-xs text-muted">
            write markdown with frontmatter, then POST /api/publish
          </div>
        </div>
      </section>

      <section className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">editor</span>
        </div>
        <div className="terminal-body grid gap-3">
          <div>
            <label className="text-xs text-muted block mb-1 font-mono" htmlFor="md-file">
              $ file_path
            </label>
            <input
              id="md-file"
              className="w-full border border-line rounded bg-bg-alt text-text py-2 px-3 text-sm font-mono outline-none focus:border-accent"
              type="text"
              value={file}
              onChange={(e) => setFile(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-muted block mb-1 font-mono" htmlFor="md-content">
              $ cat &gt;&gt; {file} &lt;&lt; &apos;EOF&apos;
            </label>
            <textarea
              id="md-content"
              className="w-full border border-line rounded bg-bg-alt text-text py-3 px-3 text-sm font-mono outline-none focus:border-accent min-h-[50vh] resize-y leading-relaxed"
              spellCheck={false}
              placeholder="write markdown with frontmatter..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              className="text-xs font-mono px-4 py-2 rounded bg-accent-green/10 border border-accent-green text-accent-green cursor-pointer hover:bg-accent-green/20 transition-colors disabled:opacity-50"
              onClick={handlePublish}
              disabled={loading}
            >
              $ ./publish.sh
            </button>
            <button
              type="button"
              className="text-xs font-mono px-4 py-2 rounded border border-line text-muted cursor-pointer hover:text-text hover:border-muted transition-colors"
              onClick={handlePreview}
            >
              $ preview
            </button>
          </div>

          {status.message && (
            <p
              className={`text-xs font-mono m-0 ${
                status.type === "ok"
                  ? "text-accent-green"
                  : status.type === "error"
                    ? "text-accent-red"
                    : "text-muted"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
