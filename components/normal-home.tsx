import type { Post } from "@/lib/posts";
import type { Moment } from "@/lib/moments";
import Link from "next/link";
import { GlassCard } from "./glass-card";

const tagColors = [
  "text-[#f5c2e7] border-[#f5c2e7]/20 bg-[#f5c2e7]/5",
  "text-[#94e2d5] border-[#94e2d5]/20 bg-[#94e2d5]/5",
  "text-[#89dceb] border-[#89dceb]/20 bg-[#89dceb]/5",
  "text-[#b4befe] border-[#b4befe]/20 bg-[#b4befe]/5",
  "text-[#fab387] border-[#fab387]/20 bg-[#fab387]/5",
];

function GlassTag({ children, i = 0 }: { children: React.ReactNode; i?: number }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${tagColors[i % tagColors.length]}`}>
      {children}
    </span>
  );
}

export function NormalHome({
  posts,
  moments,
}: {
  posts: Post[];
  moments: Moment[];
}) {
  return (
    <div className="space-y-5 pb-12 relative">
      {/* Background orbs — Catppuccin Mocha palette */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#cba6f7]/[0.07] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#89b4fa]/[0.07] blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#a6e3a1]/[0.04] blur-[100px] pointer-events-none" />

      {/* Hero — mauve + sky */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-[-120px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#cba6f7]/[0.1] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#89dceb]/[0.06] blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="text-[10px] sm:text-[11px] tracking-[0.2em] text-[#cba6f7]/80 font-mono mb-4">
            LIN FANGHAO &middot; PERSONAL
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 text-[#cdd6f4]">
            凡心所向
            <br />
            素履可往
          </h1>
          <p className="text-[#a6adc8] text-sm sm:text-base leading-relaxed max-w-xl">
            南京大学 2023 级本科生。关注计算机系统、嵌入式开发与 AI 应用。
            偶尔写博客，喜欢在终端里折腾东西。
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#b4befe]/[0.08] border border-[#b4befe]/[0.12] text-sm text-[#b4befe] hover:bg-[#b4befe]/[0.16] transition-colors no-underline"
            >
              <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              阅读文章
            </Link>
            <Link
              href="/moments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fab387]/[0.06] border border-[#fab387]/[0.1] text-sm text-[#fab387]/80 hover:bg-[#fab387]/[0.12] transition-colors no-underline"
            >
              查看动态
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Blog Posts + About grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Blog posts — lavender section */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-mono tracking-[0.15em] text-[#b4befe]">
              WRITING
            </h2>
            <Link href="/posts" className="text-xs text-[#a6adc8] hover:text-[#b4befe] transition-colors no-underline">
              view all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {posts.slice(0, 4).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="no-underline"
              >
                <GlassCard hover className="h-full flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-[#6c7086] mb-2">
                      {post.date}
                    </p>
                    <h3 className="text-sm font-semibold mb-1.5 leading-snug line-clamp-2 text-[#cdd6f4]">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#a6adc8] leading-relaxed line-clamp-2">
                      {post.summary || "暂无摘要"}
                    </p>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <GlassTag key={tag} i={i}>{tag}</GlassTag>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>

        {/* About — blue section */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono tracking-[0.15em] text-[#89b4fa] px-1">
            ABOUT
          </h2>

          <GlassCard>
            <div className="flex items-start gap-4 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/6af52c916f1b4aa7d9d816a6240ff8b9.JPG"
                alt=""
                className="w-14 h-14 rounded-full object-cover border-2 border-[#89b4fa]/20"
              />
              <div>
                <p className="font-semibold text-sm text-[#cdd6f4]">林方浩</p>
                <p className="text-xs text-[#a6adc8]">NJU CS &rsquo;27</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {[
                ["学校", "南京大学"],
                ["MBTI", "INFP"],
                ["爱好", "书法, 阅读"],
                ["城市", "南京 / 连云港"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#6c7086]">{k}</span>
                  <span className="text-[#cdd6f4]">{v}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Contact — pink */}
          <GlassCard>
            <h3 className="text-xs font-mono tracking-[0.1em] text-[#f5c2e7]/70 mb-3">
              CONTACT
            </h3>
            <div className="space-y-1.5 text-xs">
              <a href="mailto:231098078@smail.nju.edu.cn" className="block text-[#89dceb] hover:text-[#b4befe] no-underline transition-colors">
                231098078@smail.nju.edu.cn
              </a>
              <a href="https://github.com/uglis" target="_blank" rel="noopener noreferrer" className="block text-[#a6adc8] hover:text-[#cdd6f4] no-underline transition-colors">
                github.com/uglis
              </a>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Projects — teal section */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono tracking-[0.15em] text-[#94e2d5] px-1">
          PROJECTS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tag: "01 · 产品增长", title: "Growth Console", desc: "重构指标面板信息架构，缩短关键决策路径" },
            { tag: "02 · 品牌体验", title: "Brand Experience Site", desc: "从视觉语言到交互节奏全链路重做" },
            { tag: "03 · 工程提效", title: "UI System Kit", desc: "统一组件规范与交互准则，减少重复开发" },
          ].map((p) => (
            <GlassCard key={p.tag} hover>
              <p className="text-[10px] font-mono text-[#94e2d5]/70 mb-2">{p.tag}</p>
              <h3 className="font-semibold text-sm mb-1.5 text-[#cdd6f4]">{p.title}</h3>
              <p className="text-xs text-[#a6adc8] leading-relaxed">{p.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent moments — peach section */}
      {moments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-mono tracking-[0.15em] text-[#fab387]">
              MOMENTS
            </h2>
            <Link href="/moments" className="text-xs text-[#a6adc8] hover:text-[#fab387] transition-colors no-underline">
              view all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {moments.slice(0, 3).map((m, i) => (
              <GlassCard key={i}>
                <p className="text-[10px] font-mono text-[#6c7086] mb-2">{m.date}</p>
                <p className="text-xs text-[#bac2de] leading-relaxed line-clamp-3 whitespace-pre-line">
                  {m.text}
                </p>
                {m.music?.title && (
                  <p className="text-[10px] text-[#f5c2e7]/70 mt-2">
                    ♫ {m.music.title}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-6">
        <p className="text-[11px] font-mono text-[#585b70]">
          &copy; {new Date().getFullYear()} 林方浩 &middot; built with Next.js
        </p>
      </div>
    </div>
  );
}
