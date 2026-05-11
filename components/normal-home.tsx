import type { Post } from "@/lib/posts";
import type { Moment } from "@/lib/moments";
import Link from "next/link";
import { BentoCard } from "./bento-card";

const tagAccents = ["#f5c2e7", "#94e2d5", "#89dceb", "#b4befe", "#fab387"];

export function NormalHome({
  posts,
  moments,
}: {
  posts: Post[];
  moments: Moment[];
}) {
  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Hero — no card, just typography */}
      <div className="px-2 sm:px-4 pt-4 sm:pt-8 pb-2">
        <p className="text-[11px] tracking-[0.2em] text-[#a6adc8] font-mono mb-4">
          LIN FANGHAO · PERSONAL
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#cdd6f4] mb-4 leading-[1.05]">
          凡心所向<br />素履可往
        </h1>
        <p className="text-[#a6adc8] text-sm sm:text-base leading-relaxed max-w-xl mb-6">
          南京大学 2023 级本科生。关注计算机系统、嵌入式开发与 AI 应用。
        </p>
        <div className="flex gap-3">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b4befe] text-[#1e1e2e] text-sm font-semibold no-underline hover:bg-[#cdd6f4] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            阅读文章
          </Link>
          <Link
            href="/moments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#45475a] text-sm text-[#cdd6f4] no-underline hover:border-[#6c7086] transition-colors"
          >
            查看动态
          </Link>
        </div>
      </div>

      {/* Bento grid: Posts (2 cols) + Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Posts — 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#b4befe]" />
              <h2 className="text-xs font-mono tracking-[0.15em] text-[#b4befe]">WRITING</h2>
            </div>
            <Link href="/posts" className="text-[11px] text-[#6c7086] hover:text-[#a6adc8] no-underline transition-colors">
              all posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {posts.slice(0, 4).map((post, i) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="no-underline">
                <BentoCard
                  hover
                  accent={tagAccents[i % tagAccents.length]}
                  className="h-full flex flex-col justify-between"
                >
                  <p className="text-[10px] font-mono text-[#585b70] mb-2">{post.date}</p>
                  <h3 className="text-sm font-semibold text-[#cdd6f4] mb-2 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#9399b2] leading-relaxed line-clamp-2 mb-3">
                    {post.summary}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {post.tags.slice(0, 3).map((tag, j) => (
                        <span key={tag} className="text-[10px] font-mono text-[#6c7086]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </BentoCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-[#89b4fa]" />
            <h2 className="text-xs font-mono tracking-[0.15em] text-[#89b4fa]">ABOUT</h2>
          </div>

          <BentoCard accent="#89b4fa">
            <div className="flex items-center gap-4 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/6af52c916f1b4aa7d9d816a6240ff8b9.JPG"
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-[#45475a]"
              />
              <div>
                <p className="font-semibold text-[#cdd6f4]">林方浩</p>
                <p className="text-xs text-[#6c7086]">NJU CS '27</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ["学校", "南京大学"],
                ["位置", "南京 / 连云港"],
                ["MBTI", "INFP"],
                ["爱好", "书法, 阅读"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-[#45475a]/50 last:border-0">
                  <span className="text-[#585b70]">{k}</span>
                  <span className="text-[#cdd6f4]">{v}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard accent="#f5c2e7">
            <div className="text-xs space-y-2">
              <p className="text-[11px] font-mono text-[#f5c2e7]/70 mb-2">CONTACT</p>
              <a href="mailto:231098078@smail.nju.edu.cn" className="block text-[#89dceb] hover:underline no-underline">
                231098078@smail.nju.edu.cn
              </a>
              <a href="https://github.com/uglis" target="_blank" rel="noopener noreferrer" className="block text-[#a6adc8] hover:text-[#cdd6f4] no-underline">
                github.com/uglis
              </a>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* Projects row */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 rounded-full bg-[#94e2d5]" />
          <h2 className="text-xs font-mono tracking-[0.15em] text-[#94e2d5]">PROJECTS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { tag: "01", title: "Growth Console", desc: "重构指标面板信息架构，缩短关键决策路径" },
            { tag: "02", title: "Brand Experience Site", desc: "从视觉语言到交互节奏全链路重做，打造品牌辨识度" },
            { tag: "03", title: "UI System Kit", desc: "统一组件规范与交互准则，减少重复开发提高交付一致性" },
          ].map((p) => (
            <BentoCard key={p.tag} hover accent="#94e2d5">
              <p className="text-[10px] font-mono text-[#94e2d5]/60 mb-2">{p.tag}</p>
              <h3 className="text-sm font-semibold text-[#cdd6f4] mb-1.5">{p.title}</h3>
              <p className="text-xs text-[#9399b2] leading-relaxed">{p.desc}</p>
            </BentoCard>
          ))}
        </div>
      </div>

      {/* Moments */}
      {moments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#fab387]" />
              <h2 className="text-xs font-mono tracking-[0.15em] text-[#fab387]">MOMENTS</h2>
            </div>
            <Link href="/moments" className="text-[11px] text-[#6c7086] hover:text-[#a6adc8] no-underline transition-colors">
              all moments →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {moments.slice(0, 3).map((m, i) => (
              <BentoCard key={i} accent="#fab387">
                <p className="text-[10px] font-mono text-[#585b70] mb-2">{m.date}</p>
                <p className="text-xs text-[#bac2de] leading-relaxed whitespace-pre-line line-clamp-3">
                  {m.text}
                </p>
                {m.music?.title && (
                  <p className="text-[10px] text-[#f5c2e7]/70 mt-2">♫ {m.music.title}</p>
                )}
              </BentoCard>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <p className="text-[11px] font-mono text-[#45475a]">
          © {new Date().getFullYear()} 林方浩 · built with Next.js
        </p>
      </div>
    </div>
  );
}
