import Link from "next/link";
import { getRecentMoments } from "@/lib/moments";
import { MomentsList } from "./moments.client";

export default async function HomePage() {
  const recentMoments = await getRecentMoments(3);

  return (
    <>
      {/* Hero */}
      <section className="terminal-window mb-4">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/about</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line mb-1">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">cat banner.txt</span>
          </div>

          <pre className="text-accent-green text-[clamp(0.45rem,1vw,0.65rem)] leading-tight my-3 select-none">
{`   __  __  ____  __  __    __  __  ____  __  _
  / / / / / __ \\/ / / /   / / / / / __ \\/ / (_)
 / / / / / / / / / / /   / / / / / / / /_/ / /
/ /_/ / / /_/ / /_/ /   / /_/ / / /_/ / /_/ / /
\\____/  \\____/\\____/    \\____/  \\____/\\____/_/
`}
          </pre>

          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">whoami</span>
          </div>
          <div className="cmd-output">
            林方浩 &mdash; NJU CS undergrad &rsquo;27 &middot; INFP
            &middot; 书法/阅读
            <span className="cursor-blink" />
          </div>

          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">
              echo $MOTD
            </span>
          </div>
          <div className="cmd-output">
            <span className="text-accent-purple">
              凡心所向，素履可往。
            </span>{" "}
            分享一些学习 CS 的经历，或者有趣的东西，也会不定期更新一些我的日常。
          </div>

          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">
              ls -la /home/uglis/
            </span>
          </div>
          <div className="cmd-output">
            <div className="flex gap-4 flex-wrap font-mono text-sm">
              <Link href="/posts" className="text-accent-green hover:underline no-underline">
                drwxr-xr-x posts/
              </Link>
              <Link href="/moments" className="text-accent-green hover:underline no-underline">
                drwxr-xr-x moments/
              </Link>
              <Link href="/#about" className="text-accent hover:underline no-underline">
                -rw-r--r-- about.md
              </Link>
              <Link href="/#projects" className="text-accent hover:underline no-underline">
                -rw-r--r-- projects.toml
              </Link>
              <Link href="/#contact" className="text-accent hover:underline no-underline">
                -rw-r--r-- contact.yml
              </Link>
            </div>
            <span className="cursor-blink" />
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="terminal-window mb-4" id="posts">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/posts</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">ls -lh posts/</span>
          </div>
          <div className="cmd-output">
            <Link
              href="/posts"
              className="no-underline text-accent-green hover:underline inline-flex items-center gap-2 text-sm"
            >
              <span className="text-muted">total 6</span>
              {" "}&rarr; view all posts/
            </Link>
          </div>
        </div>
      </section>

      {/* Moments preview */}
      <section className="terminal-window mb-4">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/moments</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">tail -3 moments.jsonl</span>
          </div>
          <div className="cmd-output">
            <MomentsList moments={recentMoments} mode="preview" />
          </div>
          <Link
            href="/moments"
            className="link text-xs"
          >
            $ cat moments.jsonl  # view all
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="terminal-window mb-4" id="about">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/about.md</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">cat about.md</span>
          </div>
          <div className="cmd-output">
            <table className="w-full border-collapse text-sm font-mono">
              <tbody>
                {[
                  ["学校", "南京大学（本科在读）"],
                  ["MBTI", "INFP"],
                  ["爱好", "书法，阅读"],
                  ["社会身份", "江苏省连云港市书法家协会会员"],
                  ["身高 / 体重", "175cm / 60kg"],
                  ["生日", "2005-01-10"],
                  ["星座", "摩羯座"],
                ].map(([key, val]) => (
                  <tr key={key} className="border-b border-line last:border-0">
                    <td className="py-1.5 pr-6 text-accent whitespace-nowrap align-top">
                      {key}
                    </td>
                    <td className="py-1.5 text-text">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="terminal-window mb-4" id="projects">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/projects.toml</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">cat projects.toml</span>
          </div>
          <div className="cmd-output">
            {[
              ["01_product_growth", "Growth Console", "重构指标面板信息架构，缩短关键决策路径"],
              ["02_brand_exp", "Brand Experience Site", "从视觉语言到交互节奏全链路重做"],
              ["03_eng_tooling", "UI System Kit", "统一组件规范与交互准则，减少重复开发"],
            ].map(([id, name, desc]) => (
              <div key={id} className="mb-3 last:mb-0">
                <div className="text-xs text-muted">
                  [projects.<span className="text-accent-orange">{id}</span>]
                </div>
                <div>
                  <span className="text-accent-purple">name</span> ={" "}
                  <span className="text-accent-green">&quot;{name}&quot;</span>
                </div>
                <div>
                  <span className="text-accent-purple">description</span> ={" "}
                  <span className="text-text">&quot;{desc}&quot;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="terminal-window mb-4" id="contact">
        <div className="terminal-header">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">uglis@home:~/contact.yml</span>
        </div>
        <div className="terminal-body">
          <div className="cmd-line">
            <span className="cmd-prompt">$ </span>
            <span className="cmd-command">cat contact.yml</span>
          </div>
          <div className="cmd-output">
            <div className="font-mono text-sm space-y-1">
              {[
                ["phone", "15896103575", "tel:15896103575"],
                ["email", "231098078@smail.nju.edu.cn", "mailto:231098078@smail.nju.edu.cn"],
                ["github", "github.com/uglis", "https://github.com/uglis"],
                ["wechat", "扫码添加 ↓", null],
              ].map(([key, val, href]) => (
                <div key={key}>
                  <span className="text-accent-purple">{key}</span>
                  {": "}
                  {href ? (
                    <a href={href} className="link" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {val}
                    </a>
                  ) : (
                    <span className="text-muted">{val}</span>
                  )}
                </div>
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/IMG_5955.jpg"
              alt="微信二维码"
              className="w-[140px] mt-3 rounded border border-line"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Status bar */}
      <div className="flex items-center gap-3 text-xs text-muted font-mono mt-6">
        <span className="status-bar">
          <span className="status-dot" />
          systemctl status: running
        </span>
        <span className="status-bar">
          uptime: {Math.floor(Math.random() * 30 + 10)}d{" "}
          {Math.floor(Math.random() * 24)}h
        </span>
        <span className="status-bar">
          <span className="text-accent-green">●</span> live
        </span>
      </div>
    </>
  );
}
