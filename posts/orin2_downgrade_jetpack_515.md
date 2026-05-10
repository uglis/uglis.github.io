---
title: Orin2 降级刷 JetPack 5.1.5 教程
date: 2026-05-10
summary: 用 x86_64 Ubuntu 20.04 主机将 Jetson Orin 从 JetPack 6.2 降级刷到 JetPack 5.1.5 的完整教程，涵盖 SDK Manager 安装、Force Recovery 进入、刷机流程、环境验证及 FASNRC 三端链路准备。
slug: orin2-downgrade-jetpack-515
tags:
  - Jetson
  - NVIDIA
  - JetPack
  - 刷机
  - 嵌入式
---

# Orin2 降级刷 JetPack 5.1.5 教程

更新时间：2026-05-09

本文目标：用一台 `x86_64 Ubuntu 20.04` 主机，把第二台 Jetson Orin 从当前 `JetPack 6.2` 降级刷到和第一台 Orin 尽量一致的 `JetPack 5.1.5`，用于后续 FASNRC 三端链路中尽量降低 Orin-1 编码与 Orin-2 解码环境差异。

## 0. 重要结论

刷 `JetPack 5.1.5` 推荐主机：

```text
x86_64 PC + Ubuntu 20.04
```

不要优先用：

```text
Ubuntu 22.04
Windows
另一台 Orin
虚拟机
```

原因：

- NVIDIA 官方说明：使用 SDK Manager 刷 Jetson 安装 JetPack 5.1.5 时，需要 `Ubuntu Linux x64 20.04 或 18.04` 主机。
- SDK Manager 软件本身支持更多系统，但具体 JetPack 版本还要看该 JetPack 的安装要求。
- 降级刷机会清空 Orin2 目标盘，请先备份。

官方参考：

- JetPack 5.1.5 页面：https://developer.nvidia.com/embedded/jetpack-sdk-515
- JetPack 5.1.5 安装说明：https://docs.nvidia.com/jetson/jetpack/5.1.5/install-setup/index.html
- SDK Manager 刷 Jetson 教程：https://docs.nvidia.com/sdk-manager/install-with-sdkm-jetson/
- SDK Manager 系统要求：https://docs.nvidia.com/sdk-manager/system-requirements/index.html
- AGX Orin Force Recovery Mode：https://docs.nvidia.com/jetson/agx-orin-devkit/user-guide/howto.html#force-recovery-mode

## 1. 刷机前确认

### 1.1 确认 Orin1 的精确版本

在第一台 Orin 上执行：

```bash
cat /etc/nv_tegra_release
dpkg-query --show nvidia-l4t-core
uname -a
python3 --version
```

记录输出，尤其是：

```text
L4T / R35.x.x
JetPack 版本
Python 版本
CUDA 版本
```

注意：JetPack 5.1.5 页面中提到 Jetson Linux 35.6.1，同时也说明 Jetson Linux 35.6.2 已可用于 JetPack 5.1.5。为了两台 Orin 尽量一致，最终以 Orin1 上 `cat /etc/nv_tegra_release` 的实际结果为准。

### 1.2 备份 Orin2

刷机会覆盖 Orin2 系统盘。至少备份：

```text
~/ThreeNode_FASNRC_Code
~/fasnrc_runs
~/venvs
自定义模型 checkpoint
自定义脚本
网络配置记录
```

如果 Orin2 里没有重要数据，可以直接刷。

### 1.3 Ubuntu 20.04 主机准备

主机建议配置：

```text
系统：Ubuntu 20.04 x86_64
内存：至少 8 GB
磁盘：建议空余 60 GB 以上
网络：可访问 NVIDIA 下载源
账号：NVIDIA Developer 账号
连接：USB-C 数据线，不能只支持充电
```

检查主机系统：

```bash
lsb_release -a
uname -m
df -h
free -h
```

期望：

```text
Ubuntu 20.04
x86_64
磁盘空余足够
```

## 2. 安装 SDK Manager

在 Ubuntu 20.04 主机浏览器打开：

```text
https://developer.nvidia.com/sdk-manager
```

下载 Ubuntu `.deb` 安装包。

假设下载到 `~/Downloads`：

```bash
cd ~/Downloads
sudo apt update
sudo apt install ./sdkmanager_*.deb
```

如果缺依赖：

```bash
sudo apt --fix-broken install
sudo apt install ./sdkmanager_*.deb
```

启动：

```bash
sdkmanager
```

然后登录 NVIDIA Developer 账号。

## 3. Orin2 连线

以 Jetson AGX Orin Developer Kit 为例：

```text
Ubuntu 20.04 主机 USB-A / USB-C
  -> USB-C 数据线
  -> Orin2 靠近 40-pin 的 USB-C 口

Orin2 电源
  -> 原装电源 / DC 电源 / 可供电 USB-C
```

注意：

- AGX Orin 上用于刷机的 UFP 口是靠近 `40-pin` 的 USB-C 口。
- 靠近 DC jack 的 USB-C 口可供电，但官方说明中用于刷机和 USB Device mode 的是靠近 `40-pin` 的 USB-C 口。
- 不要只用一根只支持充电的线，必须是数据线。

## 4. 进入 Force Recovery / RCM

Orin2 必须进入 Force Recovery Mode，SDK Manager 才能刷机。

### 4.1 Orin2 已经开机时

按键顺序：

```text
1. 按住 Force Recovery 按钮不放
2. 按住 Reset 按钮
3. 松开两个按钮
```

### 4.2 Orin2 关机时

按键顺序：

```text
1. 按住 Force Recovery 按钮不放
2. 接入电源
3. 如果白色 LED 没亮，按 Power 按钮
4. 松开 Force Recovery 按钮
```

### 4.3 在 Ubuntu 主机确认 RCM

执行：

```bash
lsusb | grep -i nvidia
```

如果看到 NVIDIA 设备，说明主机识别到了 RCM 状态的 Orin2。

如果没有看到：

```text
1. 换 USB 数据线
2. 换主机 USB 口
3. 确认连接的是 Orin2 靠近 40-pin 的 USB-C 口
4. 重新执行 Force Recovery 按键流程
5. 尽量不要用 USB hub
```

## 5. SDK Manager 刷机流程

打开 SDK Manager：

```bash
sdkmanager
```

### 5.1 STEP 01

选择：

```text
Product Category: Jetson
Target Hardware: 根据你的 Orin2 实际型号选择
SDK Version: JetPack 5.1.5
Host Machine: 可不选，除非你需要主机端开发组件
Target Operating System / Target Components: 选择刷到 Orin2
```

如果 SDK Manager 已识别 RCM 设备，会自动检测 Target Hardware。如果没识别，点 Refresh。

### 5.2 STEP 02

接受 License。

建议把下载目录设置到空间足够的位置，例如：

```text
/home/<user>/nvidia_sdk_downloads
```

继续。

### 5.3 STEP 03

在刷机弹窗里选择：

```text
Force Recovery Mode: Manual setup
OEM Configuration: Pre-Config 或 Runtime 均可
Storage: 按你的目标盘选择 eMMC / NVMe / USB
```

建议：

```text
如果只是尽快部署并减少交互：Pre-Config
如果想刷完后在 Orin2 上手动创建用户：Runtime
```

如果目标系统盘是 NVMe，需要在 Storage 里明确选择 NVMe；如果是开发套件默认 eMMC，则选择 eMMC。

开始 Flash。

### 5.4 刷机后第一次启动

如果选择 Runtime：

```text
Orin2 接显示器、键盘、鼠标
按界面创建用户名、密码
进入 Ubuntu 桌面
```

如果选择 Pre-Config：

```text
SDK Manager 会把预设用户名密码写入目标系统
刷完后 Orin2 自动启动到已配置系统
```

### 5.5 安装 Target 组件

刷机完成后，SDK Manager 通常会继续安装 CUDA、cuDNN、TensorRT、OpenCV 等 JetPack 组件。

如果网络或 SSH 失败：

```text
1. 确认 Orin2 已正常进入系统
2. 确认 Orin2 和 Ubuntu 主机在同一网络，或 USB 虚拟网卡可连通
3. 在 SDK Manager 里 Retry Failed Items
```

如果你只完成了系统刷写，后续也可以在 Orin2 上执行：

```bash
sudo apt update
sudo apt install nvidia-jetpack
```

## 6. 刷完后的版本核验

在 Orin2 上执行：

```bash
cat /etc/nv_tegra_release
dpkg-query --show nvidia-l4t-core
python3 --version
nvcc --version
python3 - <<'PY'
import sys
print(sys.version)
try:
    import torch
    print("torch:", torch.__version__)
    print("cuda available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("cuda:", torch.version.cuda)
        print("device:", torch.cuda.get_device_name(0))
except Exception as e:
    print("torch check failed:", repr(e))
PY
```

记录结果，和 Orin1 对比。

建议目标：

```text
Orin1 与 Orin2 的 L4T 尽量一致
Orin1 与 Orin2 的 JetPack 尽量一致
Orin1 与 Orin2 的 Python 大版本一致
Orin1 与 Orin2 的 PyTorch / torchvision / CompressAI / numpy 尽量一致
FASNRC checkpoint 文件一致
FASNRC models 目录一致
```

## 7. 刷完后为 FASNRC 做准备

### 7.1 复制三端工程的 Orin2 部分

从 Windows 或移动盘复制：

```text
E:\PROJECT\ThreeNode_FASNRC_Code\orin2
```

到 Orin2，例如：

```text
~/ThreeNode_FASNRC_Code/orin2
```

### 7.2 检查环境

在 Orin2：

```bash
cd ~/ThreeNode_FASNRC_Code/orin2
bash check_orin2_env.sh
```

如果不使用 `.sh`，看：

```text
~/ThreeNode_FASNRC_Code/orin2/docs/MANUAL_NO_BASH_RUN_AND_DECODE.md
```

### 7.3 安装 Python 环境

按三端项目文档执行：

```text
ThreeNode_FASNRC_Code/ORIN_ENV_SETUP_AND_DEEPSEEK.md
ThreeNode_FASNRC_Code/docs/02_three_node_runbook.md
```

注意：Jetson 上 PyTorch 必须匹配 JetPack / L4T，不要直接装普通 x86 CUDA wheel。

## 8. 常见问题

### 8.1 SDK Manager 看不到设备

优先检查：

```bash
lsusb | grep -i nvidia
```

如果没有：

```text
USB-C 口可能接错
线可能不是数据线
没有进入 RCM
用了 USB hub
Orin2 未供电
```

### 8.2 SDK Manager 里没有 JetPack 5.1.5

检查：

```text
是否登录 NVIDIA Developer 账号
Target Hardware 是否选对
Host 是否是 Ubuntu 20.04 x86_64
SDK Manager 是否联网
```

如果仍没有，尝试：

```text
1. 更新 SDK Manager
2. 用 SDK Manager Archives 找旧版本 SDK Manager
3. 换 Ubuntu 20.04 实体机
```

### 8.3 刷机失败

不要急着反复重刷，先导出日志：

```text
SDK Manager 右上角菜单
Export Debug Logs
```

然后检查：

```text
是否断网
是否磁盘不足
是否 USB 断开
是否目标盘选错
是否 Orin2 掉电
```

### 8.4 刷完系统能启动，但 Target 组件安装失败

可以先进入 Orin2 系统后执行：

```bash
sudo apt update
sudo apt install nvidia-jetpack
```

再回 SDK Manager 选择 Retry Failed Items。

### 8.5 两台 Orin 仍然编解码效果不一致

刷成同一个 JetPack 只是第一步，还需要继续统一：

```text
PyTorch 版本
torchvision 版本
CompressAI 版本
numpy 版本
FASNRC 源码
checkpoint
device 选择
随机种子 / deterministic 设置
```

如果仍然存在差异，后续再考虑：

```text
1. 两端都用 CPU 做一致性验证
2. 固定 PyTorch deterministic 行为
3. 修改码流，把必要 side-info 一并传回
4. 模型量化到 INT8，但这可能涉及模型结构改造和重新校准/训练
```

## 9. 给 DeepSeek 的执行提示词

如果你在 Ubuntu 20.04 主机或 Orin2 上接入 DeepSeek，可以直接让它读本文并执行检查。

提示词：

```text
你现在负责协助我把 Jetson Orin2 从 JetPack 6.2 降级刷到 JetPack 5.1.5。
请先阅读当前文档：
ThreeNode_FASNRC_Code/docs/05_orin2_flash_jetpack_515_ubuntu2004.md

你的任务：
1. 不要自行编造 NVIDIA 刷机步骤，遇到不确定步骤必须参考 NVIDIA 官方文档。
2. 先检查主机是否是 Ubuntu 20.04 x86_64。
3. 检查磁盘空间、网络、SDK Manager 是否安装。
4. 指导我让 Orin2 进入 Force Recovery Mode。
5. 用 lsusb 确认 NVIDIA RCM 设备是否出现。
6. 指导我在 SDK Manager 中选择 Jetson、目标硬件、JetPack 5.1.5。
7. 刷机完成后，检查 /etc/nv_tegra_release、nvidia-l4t-core、Python、CUDA、PyTorch。
8. 输出每一步的实际结果和下一步，不要跳步。
```

## 10. 本项目后续接入点

刷机完成后，回到三端链路：

```text
Windows sender:
  E:\PROJECT\ThreeNode_FASNRC_Code\win

Orin-1 receiver / compressor:
  E:\PROJECT\ThreeNode_FASNRC_Code\orin1

Orin-2 bitstream receiver / decoder:
  E:\PROJECT\ThreeNode_FASNRC_Code\orin2

全流程手册:
  E:\PROJECT\ThreeNode_FASNRC_Code\docs\02_three_node_runbook.md
```

刷机完成后的第一件事不是直接跑链路，而是先确认 Orin2 与 Orin1 的基础环境是否一致。
