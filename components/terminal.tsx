"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Post } from "@/lib/posts";
import type { Moment } from "@/lib/moments";

interface OutputLine {
  type: "command" | "output" | "error";
  content: string;
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

const BANNER = `   __  __  ____  __  __    __  __  ____  __  _
  / / / / / __ \\/ / / /   / / / / / __ \\/ / (_)
 / / / / / / / / / / /   / / / / / / / /_/ / /
/ /_/ / / /_/ / /_/ /   / /_/ / / /_/ / /_/ / /
\\____/  \\____/\\____/    \\____/  \\____/\\____/_/
`;

const HELP = `Available commands:

  help          Show this message
  whoami        Display user info
  neofetch      System information + ASCII art
  banner        Print the UGLIS banner
  ls [path]     List directory contents
  cat <file>    Print file contents
  cd <dir>      Change current directory
  pwd           Print working directory
  clear         Clear terminal
  date          Show current date
  echo <text>   Print text
  history       Show command history

Tips:
  - Tab to autocomplete paths
  - ↑/↓ to browse command history
  - Try: cat about.md | cat projects.toml | cd posts/ | ls`;

function NeoFetch() {
  const now = new Date();
  return `${BANNER}
  ┌──────────────────────────────────┐
  │  uglis@home                      │
  │  ─────────────────────────────── │
  │  OS: NJU CS Undergraduate '27    │
  │  Shell: /bin/zsh                 │
  │  Uptime: ${Math.floor((now.getTime() - new Date("2005-01-10").getTime()) / 31556952000)} years        │
  │  Location: Nanjing, China        │
  │  Editor: VS Code / Vim           │
  │  Languages: C, Python, Go, TS    │
  │  MBTI: INFP                      │
  │  Hobbies: 书法, 阅读              │
  └──────────────────────────────────┘
  ${["🟦", "🟩", "🟨", "🟥", "🟪", "🟧", "⬛", "⬜"].join(" ")}`;
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
  const [lines, setLines] = useState<OutputLine[]>([
    { type: "output", content: NeoFetch() },
    { type: "output", content: 'Type "help" to get started.' },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
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
        case "banner":
        case "neofetch": {
          newLines.push({ type: "output", content: NeoFetch() });
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
          const filePath = resolvePath(cwd, args[0]);
          const node = getNode(fs.current, filePath);
          if (!node) {
            newLines.push({
              type: "error",
              content: `cat: no such file: ${args[0]}`,
            });
          } else if (node.type === "dir") {
            newLines.push({
              type: "error",
              content: `cat: is a directory: ${args[0]}`,
            });
          } else {
            const content =
              typeof node.content === "function"
                ? node.content()
                : node.content;
            newLines.push({ type: "output", content });
          }
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
            {line.type === "command" && i === lines.length - 1 && (
              <div className="text-accent-red hidden">
                {line.content}
              </div>
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
    </section>
  );
}
