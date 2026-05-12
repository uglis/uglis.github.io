import { useState } from "react";
import type { Post } from '../../lib/posts';

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function PostsFilter({
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
    const haystack = [post.title, post.summary, post.content, post.tags.join(" ")]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });

  return (
    <>
      <section className="terminal-window mt-4">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/posts</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">grep -r &quot;{keyword || '...'}&quot; posts/ | sort -r</span>
          </div>
        </div>
      </section>

      <section className="terminal-window mt-3">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">filter</span>
        </div>
        <div className="terminal-body grid gap-3">
          <div>
            <label className="text-xs text-muted block mb-1" htmlFor="posts-search">
              $ grep -i
            </label>
            <input
              id="posts-search"
              className="w-full border border-line rounded bg-bg-alt text-text py-2 px-3 text-sm font-mono outline-none focus:border-accent placeholder:text-muted/50"
              type="search"
              placeholder="keyword..."
              autoComplete="off"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-1.5" role="group">
            {["all", ...allTags].map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  className={`text-xs font-mono px-2 py-1 rounded border cursor-pointer transition-colors ${
                    active
                      ? "border-accent-green text-accent-green bg-accent-green/10"
                      : "border-line text-muted hover:text-text hover:border-muted"
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag === "all" ? "*" : esc(tag)}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted m-0">
            $ found <span className="text-accent-green">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3">
        {filtered.length === 0 ? (
          <div className="terminal-window">
            <div className="terminal-body">
              <p className="text-muted text-sm m-0">
                <span className="text-accent-red">ERROR:</span> no matches found. try a different keyword or tag.
              </p>
            </div>
          </div>
        ) : (
          filtered.map((post) => (
            <article key={post.slug} className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">
                  posts/{post.slug}.md &mdash; {esc(post.date)}
                </span>
              </div>
              <div className="terminal-body">
                <h3 className="text-accent font-mono text-base mt-0 mb-2">
                  {esc(post.title)}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  {esc(post.summary || "no summary")}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {esc(tag)}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href={`/posts/${post.slug}`}
                  className="text-xs text-accent-green hover:underline no-underline"
                >
                  $ cat posts/{post.slug}.md &rarr;
                </a>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  );
}
