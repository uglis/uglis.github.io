---
title: GitHub 实战指南
date: 2026-05-12
summary: 面向日常开发场景的 GitHub 协作指南，涵盖 PR 生命周期、分支管理、冲突解决、gh CLI 使用等。
slug: github-guide
tags:
  - GitHub
  - Git
  - 开发工具
---

# GitHub 实战指南

> 面向日常开发场景，不讲基本概念，只讲怎么做。

---

## 一、一个 PR 的完整生命周期

```bash
# 1. Fork（在网页点一下）
gh repo fork 原仓库 --clone

# 2. 分支（永远不要在 main/master 上直接改）
git checkout -b fix/描述

# 3. 改代码，然后
git add 改了的文件
git commit -m "fix: 干了什么"

# 4. 推送
git push origin 分支名

# 5. 开 PR
gh pr create --base main --title "标题" --body "描述"
```

> commit message 用现在时祈使句（"fix" 不是 "fixed"），这是整个开源界的惯例。

---

## 二、本地仓库与上游同步

当你 fork 了别人的仓库，对方也在更新：

```bash
# 第一次：添加上游（upstream）为远程仓库
git remote add upstream https://github.com/原仓库地址

# 之后每次同步：
git fetch upstream
git checkout main          # 切回主分支
git merge upstream/main    # 合并上游更新
git push origin main       # 推到你自己的 fork
```

> 在开新分支前先同步上游——否则 PR 可能基于过时代码，产生不必要的冲突。

---

## 三、PR Review 后需要修改

维护者提了修改意见，更新 PR：

```bash
# 回到 PR 分支
git checkout 你的分支名

# 改代码...

# 追加提交（不要开新 PR）
git add .
git commit -m "address review feedback"

# 推送——会自动更新 PR
git push origin 你的分支名
```

> 不要 `git commit --amend` 已推送的提交然后 force push——会乱掉 review 历史。普通 commit + push 即可。

---

## 四、用 `gh` 替代浏览器

```bash
gh pr status           # 所有 PR 状态一览
gh pr view --web       # 在浏览器打开当前 PR
gh pr checkout 19      # 把别人的 PR 拉到你本地
gh issue list -L 10    # 最近 10 个 issue
gh browse              # 打开当前仓库的 GitHub 页面
gh repo view           # 在终端看仓库信息
gh search prs --assignee @me   # 找所有 assign 给我的 PR
```

---

## 五、撤销与回滚

```bash
# 还没 commit：撤销文件修改
git checkout -- 文件名

# 已经 commit 但还没 push：撤销最近一次 commit（保留改动）
git reset --soft HEAD~1

# 已经 push：创建一个反向 commit
git revert HEAD

# 完全回到某个干净状态（丢弃所有本地改动）
git reset --hard origin/main
```

> `reset --hard` 不可逆。`revert` 永远是安全的。

---

## 六、合并 commit（squash）

```bash
# 把最近 3 个 commit 合并成 1 个
git rebase -i HEAD~3

# 编辑器中把第 2、3 行的 pick 改成 squash (s)
# 保存退出，重写 commit message
```

> 只在 push 之前做 rebase。push 之后用 GitHub 自带的 "Squash and merge"。

---

## 七、解决合并冲突

```bash
# 把上游 main 合进你的分支
git fetch upstream
git merge upstream/main

# 如果有冲突，手动编辑冲突文件，然后：
git add 解决冲突的文件
git commit -m "resolve merge conflicts"
```

冲突标记：
```
<<<<<<< HEAD    # 你改的
  你的代码
=======         # 分隔线
  对方的代码
>>>>>>> upstream/main  # 对方的
```
删掉标记，保留正确代码，保存即可。

---

## 八、`.gitignore` 原则

```gitignore
# 编译产物
*.o
*.class
*.pyc
__pycache__/

# 依赖
node_modules/
venv/

# 系统文件
.DS_Store
Thumbs.db

# 密钥和本地配置（绝不入库！）
.env
*.key
*.pem
```

> `.gitignore` 应该在首次 commit 之前就写好。已被追踪的文件再加 `.gitignore` 无效——需要先 `git rm --cached`。

---

## 九、日常工作流

```bash
# 早晨：同步上游
git checkout main
git fetch upstream && git merge upstream/main
git push origin main

# 开新功能
git checkout -b feat/新功能

# 写代码...改代码...

# 提交
git add -A
git commit -m "feat: 完成新功能"

# 推送 + 开 PR
git push origin feat/新功能
gh pr create --fill --web
```

---

## 常用 `gh` 命令速查

| 命令 | 作用 |
|------|------|
| `gh repo clone 仓库` | 克隆仓库 |
| `gh repo fork 仓库 --clone` | Fork 并克隆 |
| `gh pr create --fill` | 从当前分支自动创建 PR |
| `gh pr status` | 查看所有 PR 状态 |
| `gh pr view` | 在终端显示 PR 详情 |
| `gh pr view --web` | 在浏览器打开 PR |
| `gh pr checkout 编号` | 把别人的 PR 拉到本地 |
| `gh issue list` | 列出 issue |
| `gh issue view 编号` | 查看 issue 详情 |
| `gh browse` | 打开当前仓库页面 |
| `gh auth login` | 登录 GitHub |
| `gh auth status` | 查看登录状态 |

---

## 常用 Git 命令速查

| 命令 | 作用 |
|------|------|
| `git status` | 查看改动状态 |
| `git diff` | 查看具体改动 |
| `git log --oneline` | 简洁提交历史 |
| `git branch` | 查看本地分支 |
| `git checkout -b 分支名` | 创建并切换分支 |
| `git add -A` | 添加所有改动 |
| `git commit -m "消息"` | 提交 |
| `git push origin 分支名` | 推送到远程 |
| `git pull` | 拉取并合并 |
| `git fetch` | 拉取不合并 |
| `git stash` | 暂存当前改动 |
| `git stash pop` | 恢复暂存改动 |
