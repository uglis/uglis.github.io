"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Post } from "@/lib/posts";
import type { Moment } from "@/lib/moments";

interface OutputLine {
  type: "command" | "output" | "error";
  content: ReactNode;
}

type VNode = VFile | VDir;

interface VFile {
  type: "file";
  name: string;
  content: string | (() => string);
}

interface VDir {
  type: "dir";
  name: string;
  children: Record<string, VNode>;
}

function buildVfs(
  posts: Post[],
  moments: Moment[]
): Record<string, VNode> {
  const postFiles: Record<string, VNode> = {};
  for (const p of posts) {
    postFiles[`${p.slug}.md`] = {
      type: "file",
      name: `${p.slug}.md`,
      content: () => `# ${p.title}\n\n${p.summary}\n\ntags: ${p.tags.join(", ")}`,
    };
  }

  return {
    "about.md": {
      type: "file",
      name: "about.md",
      content: `# 关于我
学校: 南京大学（本科在读）
MBTI: INFP
爱好: 书法，阅读
社会身份: 江苏省连云港市书法家协会会员
身高/体重: 175cm / 60kg
生日: 2005-01-10
星座: 摩羯座`,
    },
    "projects.toml": {
      type: "file",
      name: "projects.toml",
      content: `[projects.01_product_growth]
name = "Growth Console"
description = "重构指标面板信息架构，缩短关键决策路径"

[projects.02_brand_exp]
name = "Brand Experience Site"
description = "从视觉语言到交互节奏全链路重做"

[projects.03_eng_tooling]
name = "UI System Kit"
description = "统一组件规范与交互准则，减少重复开发"`,
    },
    "contact.yml": {
      type: "file",
      name: "contact.yml",
      content: `phone: 15896103575
email: 231098078@smail.nju.edu.cn
github: https://github.com/uglis
wechat: 扫码添加 (二维码在 /moments 页)`,
    },
    posts: {
      type: "dir",
      name: "posts",
      children: postFiles,
    },
    moments: {
      type: "dir",
      name: "moments",
      children: {
        "README.md": {
          type: "file",
          name: "README.md",
          content: `type: symlink
target: /moments
recent: ${moments.length} moments`,
        },
      },
    },
  };
}

function resolvePath(cwd: string, target: string): string {
  if (!target) return cwd;
  if (target === "/") return "/";

  const parts = target.startsWith("/")
    ? target.split("/").filter(Boolean)
    : [...cwd.split("/").filter(Boolean), ...target.split("/").filter(Boolean)];

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }
  return "/" + resolved.join("/");
}

function getNode(fs: Record<string, VNode>, path: string): VNode | null {
  const parts = path.split("/").filter(Boolean);
  let current: VNode | null = null;
  let children = fs;

  for (const part of parts) {
    const entry = children[part];
    if (!entry) return null;
    current = entry;
    if (entry.type === "dir") {
      children = entry.children;
    } else {
      children = {};
    }
  }
  return current;
}

function getDirChildren(
  fs: Record<string, VNode>,
  path: string
): Record<string, VNode> | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return fs;

  let children = fs;
  for (const part of parts) {
    const entry = children[part];
    if (!entry || entry.type !== "dir") return null;
    children = entry.children;
  }
  return children;
}

const BANNER = `  ██╗   ██╗  ██████╗  ██╗      ██╗ ███████╗
  ██║   ██║ ██╔════╝  ██║      ██║ ██╔════╝
  ██║   ██║ ██║  ███╗ ██║      ██║ ███████╗
  ██║   ██║ ██║   ██║ ██║      ██║ ╚════██║
  ╚██████╔╝ ╚██████╔╝ ███████╗ ██║ ███████║
   ╚═════╝   ╚═════╝  ╚══════╝ ╚═╝ ╚══════╝`;

const HELP = `Available commands:

  help          Show this message
  whoami        Display user info
  neofetch      System information + ASCII art
  banner        Print the UGLIS banner
  ls [path]     List directory contents
  cat <file>    Print file contents
  vim <file>    Open file in vim (q or Esc to quit)
  cd <dir>      Change directory
  pwd           Print working directory
  clear         Clear terminal
  date          Show current date
  echo <text>   Print text
  history       Show command history

Tips:
  - Tab to autocomplete paths
  - ↑/↓ to browse command history
  - Use .. to go up a directory
  - Try: vim about.md | cd posts/ | ls -la`;

function buildContributions(
  posts: Post[],
  moments: Moment[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of posts) {
    if (p.date) {
      const d = p.date.slice(0, 10);
      map.set(d, Math.min((map.get(d) || 0) + 2, 4));
    }
  }
  for (const m of moments) {
    if (m.date) {
      const d = m.date.slice(0, 10);
      map.set(d, Math.min((map.get(d) || 0) + 1, 4));
    }
  }
  return map;
}

function ContributionGraph({
  contributions,
}: {
  contributions: Map<string, number>;
}) {
  const greenShades = [
    "bg-[#161b22]",
    "bg-[#0e4429]",
    "bg-[#006d32]",
    "bg-[#26a641]",
    "bg-[#39d353]",
  ];

  const msPerDay = 86400000;

  // Start from first day of earliest data month, but go back at least 16 weeks
  const now = new Date();
  let earliest: Date | null = null;
  for (const key of contributions.keys()) {
    const d = new Date(key + "T00:00:00");
    if (!earliest || d < earliest) earliest = d;
  }
  const dataStart = earliest
    ? new Date(earliest.getFullYear(), earliest.getMonth(), 1)
    : new Date(now.getFullYear(), now.getMonth() - 3, 1);
  // Ensure at least 16 weeks shown
  const minStart = new Date(now.getTime() - 16 * 7 * msPerDay);
  const startDate = dataStart < minStart ? dataStart : minStart;
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = now;
  const totalWeeks = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (7 * msPerDay)
  );

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  // Build grid: weeks × 7 (Sunday=0 ... Saturday=6)
  const grid: number[][] = [];
  const monthMarks: { weekIdx: number; label: string }[] = [];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  let lastMonth = -1;

  for (let w = 0; w < totalWeeks; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate.getTime() + (w * 7 + d) * msPerDay);
      const key = date.toISOString().slice(0, 10);
      col.push(contributions.get(key) || 0);

      if (d === 0 || (w === 0 && d === 0)) {
        const month = date.getMonth();
        if (month !== lastMonth) {
          monthMarks.push({ weekIdx: w, label: months[month] });
          lastMonth = month;
        }
      }
    }
    grid.push(col);
  }

  // Count total contributions
  let total = 0;
  for (const count of contributions.values()) total += count;

  return (
    <div className="mt-2">
      <div className="text-xs text-muted mb-1">
        <span className="text-accent-green">{total} contributions</span> in the
        last {totalWeeks} weeks
      </div>

      {/* Month labels row */}
      <div className="text-[10px] text-[#484f58] relative h-[14px]" style={{ marginLeft: "32px" }}>
        {monthMarks.map((m) => (
          <div
            key={m.label}
            className="absolute"
            style={{ left: `${m.weekIdx * 13}px` }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Grid + day labels */}
      <div className="flex gap-[2px]">
        <div className="flex flex-col gap-[2px] mr-0.5">
          {dayLabels.map((label, i) => (
            <div
              key={`day-${i}`}
              className="text-[10px] text-[#484f58] leading-[11px] h-[11px] flex items-center"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-[2px]">
          {grid.map((col, w) => (
            <div key={w} className="flex flex-col gap-[2px]">
              {col.map((level, d) => (
                <div
                  key={`${w}-${d}`}
                  className={`w-[11px] h-[11px] ${greenShades[level] || greenShades[0]}`}
                  title={`${level} on ${new Date(startDate.getTime() + (w * 7 + d) * msPerDay).toISOString().slice(0, 10)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 mt-1 text-[10px] text-[#484f58]">
        <span>Less</span>
        {greenShades.map((shade, i) => (
          <div key={i} className={`w-[11px] h-[11px] ${shade}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function NeoFetch({
  contributions,
}: {
  contributions: Map<string, number>;
}) {
  const now = new Date();
  const uptime = Math.floor(
    (now.getTime() - new Date("2005-01-10").getTime()) / 31556952000
  );

  const info = [
    { label: "OS", value: "NJU CS Undergraduate '27" },
    { label: "Shell", value: "/bin/zsh" },
    { label: "Uptime", value: `${uptime} years` },
    { label: "Location", value: "Nanjing, China" },
    { label: "Editor", value: "VS Code / Vim" },
    { label: "Languages", value: "C, Python, Go, TypeScript" },
    { label: "MBTI", value: "INFP" },
    { label: "Hobbies", value: "书法, 阅读" },
  ];

  const colorBlocks = [
    "#0d1117", "#161b22", "#30363d", "#484f58", "#6e7681",
    "#8b949e", "#e6edf3", "#ffffff",
    "#f85149", "#d29922", "#3fb950", "#58a6ff",
    "#a371f7", "#db61a2", "#f0883e", "#2ea043",
  ];

  const maxLabelLen = Math.max(...info.map((i) => i.label.length));

  return (
    <div className="font-mono text-xs leading-snug">
      <div>
        <span className="text-accent-green font-bold">uglis</span>
        <span className="text-accent">@</span>
        <span className="text-accent-green font-bold">home</span>
      </div>
      <div className="text-muted">
        {"─".repeat(maxLabelLen + 12)}
      </div>

      {info.map((item, i) => (
        <div key={i} className="mt-0.5">
          <span className="text-accent font-bold">
            {item.label.padStart(maxLabelLen)}
          </span>
          <span className="text-muted">: </span>
          <span className="text-text">{item.value}</span>
        </div>
      ))}

      <div className="flex gap-0.5 mt-2">
        {colorBlocks.map((color, i) => (
          <span
            key={i}
            className="w-3 h-3 inline-block"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <ContributionGraph contributions={contributions} />
    </div>
  );
}

function autocomplete(cwd: string, input: string, fs: Record<string, VNode>): string | null {
  const parts = input.split(" ");
  const lastArg = parts[parts.length - 1] || "";
  const rest = parts.slice(0, -1).join(" ");

  const lastSlash = lastArg.lastIndexOf("/");
  const dirPart = lastSlash >= 0 ? lastArg.slice(0, lastSlash + 1) : "";
  const filePart = lastSlash >= 0 ? lastArg.slice(lastSlash + 1) : lastArg;

  const searchPath = resolvePath(cwd, dirPart || ".");
  const children = getDirChildren(fs, searchPath);
  if (!children) return null;

  const matches = Object.keys(children).filter((k) => k.startsWith(filePart));
  if (matches.length === 0) return null;
  if (matches.length === 1) {
    const match = matches[0];
    const isDir = children[match].type === "dir";
    const suffix = isDir ? "/" : " ";
    const prefix = rest ? rest + " " : "";
    return `${prefix}${dirPart}${match}${suffix}`;
  }
  return null;
}

export function Terminal({
  posts,
  moments,
}: {
  posts: Post[];
  moments: Moment[];
}) {
  const contributions = useRef(buildContributions(posts, moments));

  const [lines, setLines] = useState<OutputLine[]>([
    {
      type: "output",
      content: (
        <div className="text-xs text-muted mb-1">
          Welcome to <span className="text-accent-green">uglis@home</span>!
          This is 林方浩&apos;s personal homepage, powered by a fully
          interactive terminal. Everything you see is command-driven — no
          buttons, no scrolling galleries. Just type.
        </div>
      ),
    },
    { type: "output", content: NeoFetch({ contributions: contributions.current }) },
    {
      type: "output",
      content: (
        <div className="mt-1">
          <span className="text-accent-green">$ </span>
          <span className="text-muted">
            Type{" "}
            <span className="text-accent font-bold">help</span>{" "}
            to see what you can do.
          </span>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [vimFile, setVimFile] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fs = useRef(buildVfs(posts, moments));

  const addLines = useCallback((newLines: OutputLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    scrollBottom();
    inputRef.current?.focus();
  }, [lines, scrollBottom]);

  useEffect(() => {
    if (!vimFile) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "q") {
        setVimFile(null);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [vimFile]);

  const exec = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const newLines: OutputLine[] = [
        {
          type: "command",
          content: `${cwd === "/" ? "" : cwd}$ ${trimmed}`,
        },
      ];

      setCmdHistory((prev) => [trimmed, ...prev].slice(0, 100));
      setHistoryIdx(-1);

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case "help": {
          newLines.push({ type: "output", content: HELP });
          break;
        }
        case "whoami": {
          newLines.push({
            type: "output",
            content: "林方浩 — NJU CS undergrad '27",
          });
          break;
        }
        case "banner": {
          newLines.push({ type: "output", content: <pre className="text-accent-green my-1 text-xs">{BANNER}</pre> });
          break;
        }
        case "neofetch": {
          newLines.push({ type: "output", content: NeoFetch({ contributions: contributions.current }) });
          break;
        }
        case "clear": {
          setLines([]);
          return;
        }
        case "date": {
          newLines.push({
            type: "output",
            content: new Date().toString(),
          });
          break;
        }
        case "pwd": {
          newLines.push({ type: "output", content: cwd || "/" });
          break;
        }
        case "echo": {
          newLines.push({ type: "output", content: args.join(" ") });
          break;
        }
        case "history": {
          const hist = cmdHistory
            .slice(0, 20)
            .reverse()
            .map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`)
            .join("\n");
          newLines.push({
            type: "output",
            content: hist || "  (empty)",
          });
          break;
        }
        case "cd": {
          const target = args[0] || "/";
          const newPath = resolvePath(cwd, target);
          const node = getNode(fs.current, newPath);
          if (!node) {
            newLines.push({
              type: "error",
              content: `cd: no such directory: ${target}`,
            });
          } else if (node.type === "file") {
            newLines.push({
              type: "error",
              content: `cd: not a directory: ${target}`,
            });
          } else {
            setCwd(newPath);
          }
          break;
        }
        case "ls": {
          const dir = args[0] || ".";
          const targetPath = resolvePath(cwd, dir);
          const children = getDirChildren(fs.current, targetPath);

          if (!children) {
            const node = getNode(fs.current, targetPath);
            if (node) {
              newLines.push({ type: "output", content: node.name });
            } else {
              newLines.push({
                type: "error",
                content: `ls: no such file or directory: ${dir}`,
              });
            }
            break;
          }

          const showAll = args.includes("-la") || args.includes("-a") || args.includes("-l");
          const entries = Object.values(children);
          if (entries.length === 0) {
            newLines.push({ type: "output", content: "(empty)" });
            break;
          }

          if (showAll) {
            const lines_out = entries.map((e) => {
              const isDir = e.type === "dir";
              const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
              const size = String(isDir ? 4096 : e.name.length * 10 + 42);
              const name = isDir ? `${e.name}/` : e.name;
              return `${perms}  uglis  staff  ${size.padStart(6)}  -- --  ${name}`;
            });
            newLines.push({ type: "output", content: lines_out.join("\n") });
          } else {
            const names = entries.map((e) =>
              e.type === "dir" ? `${e.name}/` : e.name
            );
            newLines.push({ type: "output", content: names.join("  ") });
          }
          break;
        }
        case "cat": {
          if (args.length === 0) {
            newLines.push({
              type: "error",
              content: "cat: missing file operand",
            });
            break;
          }
          const catPath = resolvePath(cwd, args[0]);
          const catNode = getNode(fs.current, catPath);
          if (!catNode) {
            newLines.push({
              type: "error",
              content: `cat: no such file: ${args[0]}`,
            });
          } else if (catNode.type === "dir") {
            newLines.push({
              type: "error",
              content: `cat: is a directory: ${args[0]}`,
            });
          } else {
            const content =
              typeof catNode.content === "function"
                ? catNode.content()
                : catNode.content;
            newLines.push({ type: "output", content });
          }
          break;
        }
        case "vim": {
          if (args.length === 0) {
            newLines.push({
              type: "error",
              content: "vim: missing file operand",
            });
            break;
          }
          const vimPath = resolvePath(cwd, args[0]);
          const vimNode = getNode(fs.current, vimPath);
          if (!vimNode) {
            newLines.push({
              type: "error",
              content: `vim: no such file: ${args[0]}`,
            });
          } else if (vimNode.type === "dir") {
            newLines.push({
              type: "error",
              content: `vim: is a directory: ${args[0]}`,
            });
          } else {
            const content =
              typeof vimNode.content === "function"
                ? vimNode.content()
                : vimNode.content;
            newLines.push({
              type: "output",
              content: `Opening ${args[0]} in vim...`,
            });
            addLines(newLines);
            setVimFile({ name: args[0], content });
            return;
          }
          break;
        }
        case ".": {
          if (args.length > 0) {
            // treat as relative path execution attempt
            newLines.push({
              type: "error",
              content: `command not found: ${trimmed}`,
            });
          }
          // cd . is a no-op, just don't error
          break;
        }
        case "..": {
          setCwd(resolvePath(cwd, ".."));
          break;
        }
        default: {
          newLines.push({
            type: "error",
            content: `command not found: ${cmd}. Type "help" for available commands.`,
          });
          break;
        }
      }

      addLines(newLines);
    },
    [cwd, cmdHistory, addLines, addLines]
  );

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = historyIdx + 1;
      if (idx < cmdHistory.length) {
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = historyIdx - 1;
      if (idx >= 0) {
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const completed = autocomplete(cwd, input, fs.current);
      if (completed) setInput(completed);
      return;
    }

    if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setLines([]);
      return;
    }
  };

  return (
    <section className="terminal-window h-[85vh] flex flex-col">
      <div className="terminal-header shrink-0">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">
          uglis@home:{cwd || "/"}
        </span>
      </div>

      <div
        ref={containerRef}
        className="terminal-body flex-1 overflow-y-auto font-mono text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.type === "command" && (
              <div className="text-accent-green">{line.content}</div>
            )}
            {line.type === "output" && (
              <div className="text-text my-0.5">{line.content}</div>
            )}
            {line.type === "error" && (
              <div className="text-accent-red">{line.content}</div>
            )}
          </div>
        ))}

        <div className="flex items-center mt-0.5">
          <span className="text-accent-green shrink-0">
            {cwd === "/" ? "" : cwd}$&nbsp;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent border-none outline-none text-text font-mono text-sm caret-accent-green"
            spellCheck={false}
            autoComplete="off"
            autoFocus
            aria-label="Terminal input"
          />
          <span className="w-[8px] h-[1em] bg-accent-green animate-pulse shrink-0" />
        </div>
      </div>

      {/* Vim modal */}
      {vimFile && (
        <div className="fixed inset-0 z-50 bg-[#0d1117] flex flex-col font-mono">
          {/* Vim header - file tabs */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs text-muted">
            <span>1</span>
            <span className="text-accent-green">{vimFile.name}</span>
          </div>

          {/* Vim body - content with line numbers */}
          <div className="flex-1 overflow-y-auto px-2 py-1 text-sm leading-6">
            {vimFile.content.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="text-[#484f58] select-none w-[36px] text-right mr-4 shrink-0">
                  {i + 1}
                </span>
                <span className="text-[#e6edf3] whitespace-pre-wrap">
                  {line || " "}
                </span>
              </div>
            ))}
            {/* Fill remaining space with ~ */}
            {Array.from({
              length: Math.max(
                0,
                20 - vimFile.content.split("\n").length
              ),
            }).map((_, i) => (
              <div key={`tilde-${i}`} className="flex">
                <span className="text-[#484f58] select-none w-[36px] text-right mr-4 shrink-0">
                  {vimFile.content.split("\n").length + i + 1}
                </span>
                <span className="text-[#1c2128]">~</span>
              </div>
            ))}
          </div>

          {/* Vim status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-[#30363d] text-xs">
            <span>
              <span className="text-accent-green font-bold">
                &quot;{vimFile.name}&quot;
              </span>{" "}
              <span className="text-muted">[readonly]</span>{" "}
              <span className="text-[#484f58]">
                {vimFile.content.split("\n").length}L,{" "}
                {vimFile.content.length}B
              </span>
            </span>
            <span>
              <span className="text-accent-green font-bold">-- NORMAL --</span>
              <span className="text-muted ml-2">
                :q  Esc  quit
              </span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
