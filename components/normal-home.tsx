import type { Post } from "@/lib/posts";
import type { Moment } from "@/lib/moments";
import Link from "next/link";

function GlassCard({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-8
        bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent
        backdrop-blur-3xl
        border border-white/[0.12] border-b-white/[0.06]
        shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none
        ${hover ? "hover:from-white/[0.12] hover:via-white/[0.06] hover:border-white/[0.18] transition-all duration-300 hover:-translate-y-0.5" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}

function GlassTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-white/[0.1] bg-white/[0.04] text-white/50">
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
      {/* Background orbs for glass effect */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#cba6f7]/[0.06] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#89b4fa]/[0.06] blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#a6e3a1]/[0.04] blur-[100px] pointer-events-none" />

      {/* Hero */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-[-120px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#89b4fa]/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#a6e3a1]/[0.05] blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="text-[10px] sm:text-[11px] tracking-[0.2em] text-[#89b4fa]/80 font-mono mb-4">
            LIN FANGHAO &middot; PERSONAL
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            凡心所向
            <br />
            素履可往
          </h1>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-xl">
            南京大学 2023 级本科生。关注计算机系统、嵌入式开发与 AI 应用。
            偶尔写博客，喜欢在终端里折腾东西。
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.1] text-sm hover:bg-white/[0.14] transition-colors no-underline"
            >
              <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              阅读文章
            </Link>
            <Link
              href="/moments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm text-white/70 hover:bg-white/[0.08] transition-colors no-underline"
            >
              查看动态
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Blog Posts + About grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Blog posts - takes 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-mono tracking-[0.15em] text-[#89b4fa]/80">
              WRITING
            </h2>
            <Link href="/posts" className="text-xs text-white/40 hover:text-white/70 transition-colors no-underline">
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
                    <p className="text-[10px] font-mono text-white/30 mb-2">
                      {post.date}
                    </p>
                    <h3 className="text-sm font-semibold mb-1.5 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                      {post.summary || "暂无摘要"}
                    </p>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <GlassTag key={tag}>{tag}</GlassTag>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono tracking-[0.15em] text-[#89b4fa]/80 px-1">
            ABOUT
          </h2>

          <GlassCard>
            <div className="flex items-start gap-4 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/6af52c916f1b4aa7d9d816a6240ff8b9.JPG"
                alt=""
                className="w-14 h-14 rounded-full object-cover border-2 border-white/[0.08]"
              />
              <div>
                <p className="font-semibold text-sm">林方浩</p>
                <p className="text-xs text-white/40">NJU CS &rsquo;27</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-white/50">
              {[
                ["学校", "南京大学"],
                ["MBTI", "INFP"],
                ["爱好", "书法, 阅读"],
                ["城市", "南京 / 连云港"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/30">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Contact */}
          <GlassCard>
            <h3 className="text-xs font-mono tracking-[0.1em] text-white/30 mb-3">
              CONTACT
            </h3>
            <div className="space-y-1.5 text-xs">
              <a href="mailto:231098078@smail.nju.edu.cn" className="block text-[#89b4fa]/80 hover:text-blue-400 no-underline transition-colors">
                231098078@smail.nju.edu.cn
              </a>
              <a href="https://github.com/uglis" target="_blank" rel="noopener noreferrer" className="block text-white/50 hover:text-white/80 no-underline transition-colors">
                github.com/uglis
              </a>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono tracking-[0.15em] text-[#89b4fa]/80 px-1">
          PROJECTS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tag: "01 · 产品增长", title: "Growth Console", desc: "重构指标面板信息架构，缩短关键决策路径" },
            { tag: "02 · 品牌体验", title: "Brand Experience Site", desc: "从视觉语言到交互节奏全链路重做" },
            { tag: "03 · 工程提效", title: "UI System Kit", desc: "统一组件规范与交互准则，减少重复开发" },
          ].map((p) => (
            <GlassCard key={p.tag} hover>
              <p className="text-[10px] font-mono text-[#89b4fa]/60 mb-2">{p.tag}</p>
              <h3 className="font-semibold text-sm mb-1.5">{p.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent moments */}
      {moments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-mono tracking-[0.15em] text-[#89b4fa]/80">
              MOMENTS
            </h2>
            <Link href="/moments" className="text-xs text-white/40 hover:text-white/70 transition-colors no-underline">
              view all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {moments.slice(0, 3).map((m, i) => (
              <GlassCard key={i}>
                <p className="text-[10px] font-mono text-white/30 mb-2">{m.date}</p>
                <p className="text-xs text-white/60 leading-relaxed line-clamp-3 whitespace-pre-line">
                  {m.text}
                </p>
                {m.music?.title && (
                  <p className="text-[10px] text-white/30 mt-2">
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
        <p className="text-[11px] font-mono text-white/20">
          &copy; {new Date().getFullYear()} 林方浩 &middot; built with Next.js
        </p>
      </div>
    </div>
  );
}
