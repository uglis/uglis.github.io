---
title: 打造一个命令行风格的交互式终端个人主页
date: 2026-05-11
slug: terminal-homepage-design
summary: 把个人主页设计成一个可交互的终端模拟器，支持命令输入、Tab 补全、历史记录、vim 阅读文件，用 CLI 思维重新定义个人站点。
tags:
  - 设计
  - 交互
  - 终端
  - 前端
  - Next.js
---

## 为什么是终端

传统的个人主页本质上是一张名片：头像、简介、链接，访客被动阅读。我想做一个访客可以**主动探索**的主页——他们需要输入命令，系统响应内容。只有真正感兴趣的人才会留下来打字，这本身就是一种过滤。

终端风格的另一个好处是**信息密度可控**。不像传统滚动页面把所有内容堆在一起，终端里每条命令只返回一条结果，信息按需获取，页面干净整洁。

## 架构设计

整个终端是一个 React 客户端组件，但**内容数据通过 RSC 预取**：

```
page.tsx (RSC)
  → getAllPosts() + getAllMoments()  // 服务端读文件
  → <Terminal posts={posts} moments={moments} />  // 传给客户端
```

Terminal 组件内部：

- **命令行处理器** — 解析命令字符串，分发到各处理函数
- **虚拟文件系统** — 用 JavaScript 对象模拟 `/posts/`、`about.md`、`projects.toml` 等目录树
- **输出缓冲** — 所有命令的输出追加到滚动区域，保持命令+输出的对话流
- **历史管理** — `↑↓` 浏览历史命令，`Tab` 自动补全路径

## 核心功能

### 命令系统

```
help         列出所有可用命令
whoami       显示用户信息
neofetch     系统信息 + 色块
banner       大号 UGLIS ASCII 艺术字
ls [path]    列出目录内容（支持 -la 详细模式）
cat <file>   打印文件内容
vim <file>   在 vim 风格界面中阅读文件（q/Esc 退出）
cd <dir>     切换目录（支持 . 和 ..）
pwd          显示当前路径
clear        清屏
date         显示当前时间
echo <text>  回显文本
history      命令历史
```

### vim 模式

这是我最满意的功能。输入 `vim about.md` 后，整个终端变成一个 vim 编辑器：

- 行号左侧对齐
- `~` 填充空白行
- 底部状态栏显示文件名、行数、字节数、`-- NORMAL --` 模式
- 按 `q` 或 `Esc` 退回到终端

访客在"主页"里打开了一个 vim 阅读文件——这个交互本身就是一张名片，告诉对方"这个人会命令行，应该是个搞技术的"。

### neofetch

打开主页的第一个画面就是 neofetch 输出——和你在 Linux 终端里敲 `neofetch` 看到的一模一样：

```
uglis@home
───────────
      OS: NJU CS Undergraduate '27
   Shell: /bin/zsh
 Uptime: 21 years
Location: Nanjing, China
  Editor: VS Code / Vim
Languages: C, Python, Go, TypeScript
    MBTI: INFP
 Hobbies: 书法, 阅读

■■■■■■■■ ■■■■■■■■
```

底部还有 GitHub 风格的贡献热力图，数据来源于实际的博客发布时间和动态时间。

### 虚拟文件系统

```javascript
// 文件树结构
{
  "about.md":      { type: "file", content: "# 关于我\n..." },
  "projects.toml": { type: "file", content: "[projects]\n..." },
  "contact.yml":   { type: "file", content: "email: ...\n..." },
  "posts": {
    type: "dir",
    children: {
      "jetson-orin-flash-notes.md": { ... },
      "go-dev-environment-setup.md": { ... },
      // ...
    }
  }
}
```

`cd`、`ls`、`cat` 都操作这个虚拟文件系统，不需要后端——所有内容在浏览器内存里，响应速度是即时的。

### Tab 自动补全

```typescript
function autocomplete(cwd, input, fs) {
  const partial = getLastPathSegment(input);
  const matches = Object.keys(fs).filter(k => k.startsWith(partial));
  if (matches.length === 1) return complete(matches[0]);
}
```

输入 `cat about` 然后按 Tab → 自动补全成 `cat about.md`。输入 `cd pos` 然后 Tab → `cd posts/`。

## 技术实现要点

### React 状态设计

```typescript
const [lines, setLines] = useState<OutputLine[]>([...]);  // 命令+输出缓冲
const [input, setInput] = useState("");                   // 当前输入
const [cwd, setCwd] = useState("/");                      // 当前目录
const [cmdHistory, setCmdHistory] = useState<string[]>([]); // 历史
const [vimFile, setVimFile] = useState<File | null>(null); // vim 模式
```

### 目录导航的路径解析

```typescript
function resolvePath(cwd: string, target: string): string {
  // "cd .."  → pop last segment
  // "cd ."   → no-op
  // "cd /"   → root
  // "cd posts/" → append to cwd
  // handles both absolute (/about.md) and relative paths
}
```

### 输入处理的键盘事件

```typescript
const handleKey = (e: KeyboardEvent) => {
  Enter   → 执行命令
  ArrowUp → 上一条历史
  ArrowDown → 下一条历史
  Tab     → 自动补全
  Ctrl+L  → 清屏
};
```

## 后续可以做的

1. **连接真实 GitHub API** — 贡献热力图用真实 commit 数据
2. **多语言支持** — `lang zh` / `lang en` 切换
3. **SSH 连接显示** — 用 WebSocket 模拟一个"谁正在访问"的 `w` 命令
4. **cowsay / fortune / cmatrix** — 更多 Unix 风格彩蛋
5. **管道支持** — `cat about.md | grep 南京`

欢迎打开 [uglis.vercel.app](https://uglis.vercel.app) 亲自体验。
