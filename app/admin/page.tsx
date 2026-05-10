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
      `<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;line-height:1.6;padding:24px;">${content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre>`
    );
    w.document.close();
  };

  const handlePublish = async () => {
    if (!file.startsWith("posts/")) {
      setStatus({
        message: "文件路径必须以 posts/ 开头",
        type: "error",
      });
      return;
    }
    if (!content.trim()) {
      setStatus({ message: "Markdown 内容不能为空", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "发布中...", type: "" });

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file, content }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "发布失败");
      }
      setStatus({ message: `发布成功：${data.slug}`, type: "ok" });
    } catch (err) {
      setStatus({
        message: `发布失败：${err instanceof Error ? err.message : "未知错误"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="panel border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)]">
        <div className="flex justify-between items-baseline gap-3">
          <p className="m-0 text-[0.78rem] tracking-[0.2em] text-accent-2">
            ADMIN
          </p>
          <h1 className="font-serif">Markdown 发布</h1>
        </div>
        <p className="text-muted leading-[1.84]">
          本地编写 Markdown 文章，发布到博客。
        </p>
      </section>

      <section className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)] grid gap-3">
        <div className="grid grid-cols-2 gap-[10px] max-[900px]:grid-cols-1">
          <div className="grid gap-[6px]">
            <label className="text-text text-[0.9rem] font-semibold" htmlFor="md-file">
              Markdown 文件路径（必须以 posts/ 开头）
            </label>
            <input
              id="md-file"
              className="border border-line rounded-xl bg-[rgba(10,14,24,0.72)] text-text py-[10px] px-3 outline-none focus-visible:outline-2 focus-visible:outline-accent"
              type="text"
              value={file}
              onChange={(e) => setFile(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-[6px]">
          <label className="text-text text-[0.9rem] font-semibold" htmlFor="md-content">
            Markdown 内容
          </label>
          <textarea
            id="md-content"
            className="border border-line rounded-xl bg-[rgba(10,14,24,0.72)] text-text py-[10px] px-3 outline-none focus-visible:outline-2 focus-visible:outline-accent min-h-[48vh] resize-y leading-relaxed"
            spellCheck={false}
            placeholder="在这里写 Markdown，包括 frontmatter"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-3 flex-wrap mt-3">
          <button
            type="button"
            className="no-underline rounded-full px-5 py-[11px] border border-transparent cursor-pointer bg-[linear-gradient(120deg,var(--color-accent),#d1ebff)] text-[#081522] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            onClick={handlePublish}
            disabled={loading}
          >
            发布文章
          </button>
          <button
            type="button"
            className="no-underline rounded-full px-5 py-[11px] border border-line text-text cursor-pointer transition-transform hover:-translate-y-0.5"
            onClick={handlePreview}
          >
            预览到新窗口
          </button>
        </div>

        {status.message && (
          <p
            className={`m-0 min-h-[1.3em] ${
              status.type === "ok"
                ? "text-accent-2"
                : status.type === "error"
                  ? "text-[#ff8a8a]"
                  : "text-muted"
            }`}
          >
            {status.message}
          </p>
        )}
      </section>
    </>
  );
}
