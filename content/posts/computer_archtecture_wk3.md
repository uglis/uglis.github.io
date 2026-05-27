---
title: 计算机体系结构（第3周）
date: 2026-03-24
slug: computer-architecture-wk3
summary: 计算机体系结构第3周课程内容
tags:
  - 计算机体系结构
---
## RISC-V指令集介绍
### RISC-V指令集快速回顾
- 三地址架构，Load/Store架构
- 基础最小整数指令集：RV32I，RV64I
- 标准扩展集：M A F D C
### RV32I基础指令集
- 可见状态
    - PC
    - Memory
    - Registers
- 数据格式
  - 指令/地址，以及有无符号的整型均是32bit
  - 支持16bit和8bit内存访问
### 指令格式
- 4类基本指令格式：
  R-type, I_type, S-type, U-type
- 固定解码方式
### 指令类型
- ALU指令
- Load/Store指令
- Branches and jumps
### RV32I寄存器使用规约
### RV32I算术指令
### RV32I跳转指令
### RV32I访存指令


## 单周期及多周期处理器
### ISA的实际实现
- 指令执行的过程：状态转换
根据指令集的规定吗，将处理器的状态从AS转换到AS'
AS----->AS'
architectural state: 程序员可见的状态

### 指令执行过程
- 架构ISA部分
  规定处理器在初始AS状态下，执行特定指令后应该转换到哪一个AS'状态
  有限状态机FSM：状态， 转换逻辑
- 微架构Microarchitecture部分
  实际完成 AS到AS'的转换
  单周期：AS-->AS'在一个时钟周期内完成
  多周期：AS--> AS + MS1 --> AS + MS2 --> AS' 需要多个时钟周期完成
### 从另一个角度来看指令的具体实现
- 指令是对数据的处理： Data（AS）--> Data'（AS'）
- 指令执行引擎的两大部件：
  - 数据通路Datapath
  - 控制逻辑Control logic
### RISIC-V基本指令执行过程
Instruction Fetch --> Instruction Decode and Register operand fetch --> Execute --> Menory oprand fetch --> Store/writeback result 
### 性能分析
- 单条指令的执行时间： CPI * Clock cycle time
- 程序的执行时间： Instruction count * CPI * Clock cycle time
- 单周期处理器：CPI = 1，时钟周期较长
- 多周期处理器：
- 影响处理器的性能的两个主要因素：
  - CPI
  - clock cycle time 
  

## 高级流水线技术
