---
title: Jetson AGX Orin 刷机排障记录
date: 2026-05-10
summary: 整理 Jetson AGX Orin 开机、Force Recovery、SDK Manager 刷机和 Target Components 安装排障的操作记录，涵盖 USB 通信超时、SSH 连接失败、System Configuration 卡住、APT 锁占用等常见问题。
slug: jetson-orin-flash-notes
tags:
  - Jetson
  - NVIDIA
  - 刷机
  - 排障
  - 嵌入式
---

本文整理本次对话中关于 Jetson AGX Orin 开机、Force Recovery、SDK Manager 刷机和 Target Components 安装排障的操作记录。

## 1. 板子按键含义

常见按键含义如下：

- `Power` / 电源符号：开机、关机相关。
- 单个环形箭头：`Reset`，重启/复位键。
- 两个箭头首尾相连：`Force Recovery` / `REC`，进入刷机恢复模式用。

注意：

- `Reset` 不是关机键，只是重启。
- `Force Recovery` 不是普通重启键，主要用于刷机。

## 2. 开机、关机和判断状态

### 开机

如果板子已经接好电源但没有启动：

1. 短按 `Power` 电源键。
2. 等待电源灯、风扇、网口灯、显示器画面变化。

有些开发板接入电源后会自动开机。

### 关机

推荐在系统里正常关机：

```bash
sudo shutdown -h now
```

或：

```bash
sudo poweroff
```

如果系统卡死，才考虑长按电源键或断电。

### 判断是否开机

- 电源灯亮：说明至少有供电。
- 状态灯闪烁、网口灯闪、能 SSH、显示器有登录界面：大概率已经正常启动。
- 主机 `lsusb` 看到 `NVIDIA Corp. APX`：说明板子在 Force Recovery 模式，不是正常 Ubuntu 系统。

## 3. 进入 Force Recovery 模式

### 关机状态进入

1. 接好电源和连接主机的 USB 数据线。
2. 按住两个箭头首尾相连的 `Force Recovery` 键。
3. 短按 `Power` 键开机。
4. 等 1-2 秒后松开 `Force Recovery`。
5. 主机执行：

```bash
lsusb
```

成功时一般能看到：

```text
NVIDIA Corp. APX
```

### 开机状态进入

1. 用 USB 数据线连接 Jetson 和刷机主机。
2. 按住两个箭头首尾相连的 `Force Recovery` 键。
3. 保持按住，同时短按单个环形箭头 `Reset`。
4. 松开 `Reset`。
5. 等 1-2 秒后松开 `Force Recovery`。
6. 主机执行：

```bash
lsusb
```

看到 `NVIDIA Corp. APX` 即表示进入成功。

## 4. SDK Manager 登录选项

SDK Manager 启动后常见选项：

- `NVIDIA Developer`：普通开发者账号，刷 Jetson 一般选这个。
- `NVONLINE`：企业/合作伙伴账号，普通用户一般不用。
- `Install Only from Local Folder`：离线安装，只有提前下载好本地安装包时才选。

本次刷 Jetson 应选择：

```text
NVIDIA Developer
```

## 5. Flash 目标选择：NVMe 和 eMMC

SDK Manager 到 Flash 步骤时，可能要选择刷机目标：

- `eMMC` / `internal storage`：刷到板载存储，最稳，适合第一次刷机验证。
- `NVMe` / `external storage`：刷到 M.2 NVMe SSD，容量大、速度快，但要求 SSD 正确安装且兼容。

建议：

- 第一次刷机优先选 `eMMC`。
- 确认板子能正常启动后，再考虑刷到 `NVMe`。

## 6. Flash Jetson Linux 失败：sdram_config 相关报错

日志中出现：

```text
Error: Skip generating mem_bct because sdram_config is not defined
```

这行不一定是真正失败原因。本次截图中的关键失败原因是：

```text
ERROR: might be timeout in USB write.
Error: Return value 3
--- Error: Reading board information failed.
```

含义：

SDK Manager 在通过 USB 与 Recovery 模式下的 Jetson 通信时超时，读不到板子信息。

处理顺序：

1. 重新进入 Force Recovery。
2. 主机确认：

```bash
lsusb | grep -i nvidia
```

应看到 `NVIDIA Corp. APX`。

3. 更换 USB 数据线，必须是能传数据的线。
4. 不要使用 Hub 或扩展坞，直接插主机 USB 口。
5. 如果使用虚拟机或 WSL，优先改用原生 Ubuntu 主机刷机；虚拟机需要重新透传 APX USB 设备。
6. SDK Manager 中点击 `Retry Failed Items`。

后续日志中类似：

```text
CUDA / cuDNN / TensorRT depends on failed component
```

只是因为 Jetson Linux 刷机失败导致后续组件被跳过，不是主因。

## 7. Target Components 安装阶段 SSH 失败

刷机完成后，SDK Manager 会尝试通过 USB 网络 SSH 到 Jetson 安装 CUDA、cuDNN、TensorRT 等组件。

报错：

```text
Could not connect to the device via SSH.
Check the IP address, and make sure that SSH service is running on the device.
```

截图中 IP 为：

```text
192.168.55.1
```

常见原因：

- Jetson 还没完成第一次开机的 Ubuntu System Configuration。
- SDK Manager 中填写的用户名或密码不对。
- Jetson 还在 Force Recovery 模式，而不是正常 Ubuntu 系统。
- USB 网络没有起来。
- Jetson 上 SSH 服务没启动。

处理方法：

1. 在 Jetson 本机显示器和键盘上完成 Ubuntu 首次配置。
2. 创建正常 Linux 用户名，例如：

```text
username: jetson
password: 123456
hostname: orin
```

不要用纯数字做用户名。

3. 等 Jetson 进入登录界面或桌面。
4. SDK Manager 中填写同样的用户名和密码。
5. 主机测试：

```bash
ping 192.168.55.1
ssh jetson@192.168.55.1
```

6. 如果 SSH 服务未启动，在 Jetson 上执行：

```bash
sudo systemctl enable --now ssh
```

## 8. Jetson 卡在 System Configuration，没法点 Continue

可能原因：

- 首次启动后台仍在初始化。
- 必填项没有通过校验。
- 鼠标焦点或分辨率问题导致按钮点不到。
- 用户名不合法，例如纯数字。

建议：

1. 等 2-3 分钟。
2. 确认所有必填项填写完整。
3. 用户名使用英文小写，例如 `jetson`。
4. 主机名使用英文，例如 `orin`。
5. 密码两次输入一致。
6. 用键盘操作：

```text
Tab
Shift + Tab
Enter
Alt + Tab
```

7. 如果完全卡死，短按 `Reset` 重启，不要按 `Force Recovery`。
8. 如果反复卡住，可考虑 SDK Manager 重新刷机时选择 `Pre-Config`，提前设置用户名和密码，跳过首次配置界面。

## 9. APT repository access 检查失败

SDK Manager 安装 Target Components 时出现：

```text
APT repository check failure
Could not get lock /var/lib/apt/lists/lock
It is held by process 10636 (apt-get)
Unable to lock directory /var/lib/apt/lists/
```

含义：

Jetson 上另一个 `apt-get` 进程正在运行，占用了 apt 锁。SDK Manager 无法执行 `apt update` 或安装包。

处理：

1. 在 Jetson 本机终端或 SSH 后检查进程：

```bash
ps -fp 10636
```

2. 如果进程还在正常运行，先等 3-5 分钟，然后回 SDK Manager 点 `Retry`。
3. 如果长时间卡住，再执行：

```bash
sudo kill 10636
sudo dpkg --configure -a
sudo apt-get update
```

4. `apt-get update` 正常完成后，回 SDK Manager 点 `Retry`。

不要直接删除：

```text
/var/lib/apt/lists/lock
```

直接删除 lock 文件可能破坏 apt/dpkg 状态。

## 10. 本次排障的核心判断

本次问题经历了几个阶段：

1. `lsusb` 识别不到：重点排查是否进入 Force Recovery、USB 线和 USB 口。
2. `Flash Jetson Linux` 失败：真正关键是 USB write timeout 和 Reading board information failed。
3. 刷机后安装组件失败：关键变成 SSH 到 Jetson，而不是 APX Recovery。
4. System Configuration 卡住：需要在 Jetson 本机完成首次 Ubuntu 用户配置。
5. APT 检查失败：Jetson 上 apt 被另一个进程占用，等待或清理 apt 状态后重试。

## 11. 常用命令

主机查看 Recovery 设备：

```bash
lsusb | grep -i nvidia
```

主机测试 USB 网络：

```bash
ping 192.168.55.1
```

主机 SSH 到 Jetson：

```bash
ssh jetson@192.168.55.1
```

Jetson 启动 SSH：

```bash
sudo systemctl enable --now ssh
```

Jetson 检查 apt 占用进程：

```bash
ps -fp 10636
```

Jetson 修复 dpkg/apt：

```bash
sudo dpkg --configure -a
sudo apt-get update
```
