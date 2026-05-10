"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function PostsFilter({
  posts,
  allTags,
}: {
  posts: Post[];
  allTags: string[];
}) {
  const [selectedTag, setSelectedTag] = useState("all");
  const [keyword, setKeyword] = useState("");

  const filtered = posts.filter((post) => {
    const matchesTag =
      selectedTag === "all" || post.tags.includes(selectedTag);
    if (!matchesTag) return false;
    if (!keyword) return true;

    const haystack = [
      post.title,
      post.summary,
      post.content,
      post.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });

  return (
    <>
      <section className="panel mt-4 border border-line rounded-2xl bg-surface p-[clamp(22px,3.6vw,38px)] grid gap-[14px]">
        <label className="text-text font-semibold text-[0.92rem]" htmlFor="posts-search">
          搜索文章
        </label>
        <input
          id="posts-search"
          className="w-full border border-line rounded-xl bg-[rgba(10,14,24,0.72)] text-text py-3 px-[14px] outline-none focus-visible:outline-2 focus-visible:outline-accent placeholder:text-muted"
          type="search"
          placeholder="搜索标题、摘要、正文、标签…"
          autoComplete="off"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="flex flex-wrap gap-2" role="group" aria-label="按标签筛选">
          {["all", ...allTags].map((tag) => {
            const active = selectedTag === tag;
            const label = tag === "all" ? "全部" : tag;
            return (
              <button
                key={tag}
                type="button"
                className={`rounded-full px-3 py-[6px] text-[0.82rem] border cursor-pointer transition-colors ${
                  active
                    ? "text-[#081522] bg-[linear-gradient(120deg,var(--color-accent),#d1ebff)] border-transparent"
                    : "border-line bg-[rgba(16,21,35,0.72)] text-muted hover:text-text hover:border-accent/50"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {escapeHtml(label)}
              </button>
            );
          })}
        </div>

        <p className="m-0 text-[0.86rem] text-muted">
          共 {filtered.length} 篇文章
        </p>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-[14px] max-[900px]:grid-cols-1">
        {filtered.length === 0 ? (
          <article className="border border-line rounded-[18px] bg-[rgba(14,18,30,0.78)] p-[18px] col-span-2">
            <p className="text-muted">没有找到匹配的文章，换个关键词或标签试试。</p>
          </article>
        ) : (
          filtered.map((post) => (
            <article
              key={post.slug}
              className="border border-line rounded-[18px] bg-[rgba(14,18,30,0.78)] p-[18px]"
            >
              <p className="text-accent-2 text-[0.8rem] tracking-[0.08em]">
                {escapeHtml(post.date)}
              </p>
              <h3 className="font-serif mt-0">{escapeHtml(post.title)}</h3>
              <p className="text-muted leading-[1.72]">
                {escapeHtml(post.summary || "暂无摘要")}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-[6px] mt-[10px]">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-accent text-[0.76rem] tracking-[0.06em] border border-accent/25 rounded-full px-[10px] py-1 bg-[rgba(14,22,36,0.7)]"
                    >
                      {escapeHtml(tag)}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href={`/posts/${post.slug}`}
                className="inline-block text-accent no-underline hover:underline mt-2"
              >
                阅读更多
              </Link>
            </article>
          ))
        )}
      </section>
    </>
  );
}
