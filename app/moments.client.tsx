"use client";

import type { Moment } from "@/lib/moments";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMomentText(text: string) {
  return text
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br />");
}

export function MomentsList({
  moments,
  mode,
}: {
  moments: Moment[];
  mode: "preview" | "full";
}) {
  if (!moments || moments.length === 0) {
    return <p className="text-muted">暂无动态</p>;
  }

  return (
    <div className="mt-[14px] grid gap-0 relative pl-[26px] max-[900px]:pl-[18px]">
      <div className="absolute left-[9px] top-[6px] bottom-2 w-[2px] bg-[linear-gradient(180deg,rgba(123,199,255,0.68),rgba(164,190,255,0.58))] max-[900px]" />
      {moments.map((moment, i) => {
        const hasPhoto = Boolean(moment.photo?.src);
        const hasMusic = Boolean(moment.music?.url);

        if (mode === "preview") {
          const preview = moment.text.replace(/\n+/g, " ").trim();
          const compact =
            preview.length > 38 ? `${preview.slice(0, 38)}…` : preview;
          const meta = [];
          if (hasPhoto) meta.push("图片");
          if (hasMusic) meta.push(`音乐 · ${moment.music!.platform || "链接"}`);

          return (
            <article
              key={i}
              className="border border-line rounded-[18px] bg-[rgba(14,18,30,0.78)] p-4 mb-4 ml-[10px] relative max-[900px]:ml-[6px]"
            >
              <div className="absolute -left-[23px] top-[18px] w-[14px] h-[14px] rounded-full bg-[linear-gradient(145deg,var(--color-accent),var(--color-accent-2))] shadow-[0_0_0_4px_rgba(7,8,12,0.86)] max-[900px]:-left-[18px]" />
              <p className="text-accent-2 text-[0.8rem] tracking-[0.08em] mb-[6px]">
                {escapeHtml(moment.date)}
              </p>
              <p className="text-text leading-[1.72] mb-[6px]">
                {compact || "一条动态"}
              </p>
              <p className="text-muted text-[0.84rem]">
                {meta.join(" · ") || "文字"}
              </p>
            </article>
          );
        }

        return (
          <article
            key={i}
            className="border border-line rounded-[18px] bg-[rgba(14,18,30,0.78)] p-4 mb-4 ml-[10px] relative max-[900px]:ml-[6px]"
          >
            <div className="absolute -left-[23px] top-[18px] w-[14px] h-[14px] rounded-full bg-[linear-gradient(145deg,var(--color-accent),var(--color-accent-2))] shadow-[0_0_0_4px_rgba(7,8,12,0.86)] max-[900px]:-left-[18px]" />
            <p className="text-accent-2 text-[0.8rem] tracking-[0.08em] mb-[6px]">
              {escapeHtml(moment.date)}
            </p>
            <p
              className="text-text leading-[1.72] my-2"
              dangerouslySetInnerHTML={{
                __html: renderMomentText(moment.text || ""),
              }}
            />
            {hasPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={moment.photo!.src}
                alt={moment.photo!.alt || "分享照片"}
                className="w-full rounded-xl my-2 max-h-[min(68vh,560px)] object-contain object-center bg-[rgba(8,12,20,0.92)]"
                loading="lazy"
              />
            )}
            {hasMusic && (
              <p className="text-muted mt-0">
                <span className="inline-block mr-1 text-[#d7ffb8]">♫</span>{" "}
                {escapeHtml(moment.music!.platform || "音乐")} ·{" "}
                <a
                  className="text-accent no-underline hover:underline"
                  href={moment.music!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {escapeHtml(moment.music!.title || "打开链接")}
                </a>
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
