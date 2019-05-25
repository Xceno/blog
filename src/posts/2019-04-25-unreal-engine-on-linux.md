---
title: "Developing with UnrealEngine 4 on Linux"
date: 2019-04-25T23:55:29.683Z
draft: false
layout: post
path: /unreal-engine-on-linux/
next:
previous:
tags:
  - Linux
  - Pop!_OS
  - UnrealEngine
  - HowTo
---

EpicGames has a neat little QuickStart Guide for getting UnrealEngine up and running on Linux, but you might still run into some gotchas.
Unfortunately, the new Docs aren't accepting PRs (yet?), so here's a quick braindump of what I've run into.

<div class="fold"></div>

# Getting started

I was following the guide mentioned above on a fresh install of [Pop!\_OS 19.04](https://system76.com/pop).

By all means, read the official [Linux Quick Start](https://docs.unrealengine.com/en-us/Platforms/Linux/BeginnerLinuxDeveloper/SettingUpAnUnrealWorkflow) first. After you're done, continue here.

If you're lucky and use UE >= 4.20 check out the [Native Toolchain](https://docs.unrealengine.com/en-us/Platforms/Linux/NativeToolchain) provided by Epic Games.

# Various problems I ran into

## Problem 1: UE can't be built with clang-8

While running `make` i noticed that pop comes installed with `clang-8` which is currently unsupported by UE.
You can easily solve this by installing `clang-7` and setting it up as an alternative like so:

```bash
sudo update-alternatives
  --install /usr/bin/clang clang /usr/bin/clang-7 100
  --slave /usr/bin/clang++ clang++ /usr/bin/clang++-7

sudo update-alternatives
  --install /usr/bin/clang clang /usr/bin/clang-8 100
  --slave /usr/bin/clang++ clang++ /usr/bin/clang++-8
```

This results in `clang++` following the version of `clang` so you can easily switch between your installs by running
`sudo update-alternatives --config clang`, which in my case looks like this:

```text
There are 2 choices for the alternative clang (providing /usr/bin/clang).

  Selection    Path              Priority   Status
------------------------------------------------------------
* 0            /usr/bin/clang-7   100       auto mode
  1            /usr/bin/clang-7   100       manual mode
  2            /usr/bin/clang-8   100       manual mode
```

I do this for a lot of tools and SDKs and it works beautifully.
If you find yourself changing alternatives often, register yourself an alias in `.bashrc` like so: `alias change-clang="sudo update-alternatives --config clang`.

## Problem 2: Fresh install of QTCreator 5 + QT5

The quick start guide jumps from compiling the engine straight into the project setup inside QTCreator. However, only installing QTCreator via apt is not enough - Run the official QT5 setup instead, which comes with all necessary dependencies (qt 5.12.3 at the time of writing).

## Problem 3: clang error: invalid linker name in argument '-fuse-ld=lld'

You're missing [LLD](https://lld.llvm.org/) on your system.
Either run `SetupToolchain.sh` in the engines root folder or install `lld` via your package manager.

# Wrapping up

That's basically it.
If you're lucky you won't even need to read this post!

All in all, it was surprisingly easy considering that Linux isn't exactly a first class citizen for game development [yet](https://youtu.be/Nuqlf0KCSdY).

What comes next is setting up a CI environment, but I'll save that for another post.
