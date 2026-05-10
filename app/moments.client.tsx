"use client";

import type { Moment } from "@/lib/moments";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function MomentsList({
  moments,
  mode,
}: {
  moments: Moment[];
  mode: "preview" | "full";
}) {
  if (!moments || moments.length === 0) {
    return (
      <div className="text-muted text-sm font-mono">
        <span className="text-accent-green">$ </span>no moments yet
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      {moments.map((moment, i) => {
        const hasPhoto = Boolean(moment.photo?.src);
        const hasMusic = Boolean(moment.music?.url);
        const lines = (moment.text || "").split("\n");

        if (mode === "preview") {
          const preview = moment.text.replace(/\n+/g, " ").trim();
          const compact = preview.length > 50 ? `${preview.slice(0, 50)}...` : preview;
          return (
            <div key={i} className="mb-2 text-muted">
              <span className="text-accent-green">[{moment.date}]</span>{" "}
              <span className="text-accent">{">"}</span> {esc(compact)}
              {hasPhoto && <span className="text-xs text-muted ml-1">[img]</span>}
              {hasMusic && <span className="text-xs text-muted ml-1">[music]</span>}
            </div>
          );
        }

        return (
          <div key={i} className="mb-4 border border-line rounded p-3 bg-bg-alt">
            <div className="text-accent-green text-xs mb-2">
              {">>"} {moment.date}
            </div>
            {lines.map((line, j) => (
              <div key={j} className="text-text leading-relaxed">
                {line ? `${esc(line)}` : " "}
              </div>
            ))}
            {hasPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={moment.photo!.src}
                alt={moment.photo!.alt || ""}
                className="w-full max-h-[400px] object-contain rounded border border-line mt-2"
                loading="lazy"
              />
            )}
            {hasMusic && (
              <div className="mt-2 text-xs">
                <span className="text-accent-purple">music</span>{" "}
                <a
                  href={moment.music!.url}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {esc(moment.music!.title || "link")}
                </a>
                <span className="text-muted">
                  {" "}via {esc(moment.music!.platform || "")}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
