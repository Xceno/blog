---
title: Configure zig fmt in a JetBrains IDE
date: 2023-10-28T16:05:11.142Z
draft: false
layout: post
path: /configure-zig-fmt-for-jetbrains-ide/
next:
previous:
tags:
  - Zig
  - Jetbrains
  - Rider
  - IntelliJ
  - CLion
---

How to use `zig fmt` with any JetBrains IDE in 2023.

<div class="fold"></div>
<br/>

## TL;DR

Add a new custom file watcher in your IDE settings and configure it to run `zig fmt`.

## Detailed version

As of today, [Zig](https://ziglang.org/) is at version `0.11.0` and has _some_ support for various
editors via its language server [zls](https://github.com/zigtools/zls).

I'm personally using the [ZigBrains](https://plugins.jetbrains.com/plugin/22456-zigbrains) extension for *JetBrains Rider* right now (also works in CLion, IntelliJ, etc.),
which seems to only support formatting for `.zon` but not `.zig` files [as of version 0.8.1](https://github.com/FalsePattern/ZigBrains/tree/0.8.1?tab=readme-ov-file#zon-files).

However it may be, you can add file watchers to run `zig fmt` anyway.

Here's how:

- Open Settings -> Tools -> File Watchers
- Add a new `<custom>` watcher.
- Set the **File Type** to `ZigLang file`.
- Set **Scope** to `Current file`.
- Set **Program** to `zig`
- Set **Arguments** to `fmt $FileName$`
- Set **Working directory** to `$FileDir$`
- (optional) Disable `auto-save ...` in the **Advanced Options** tab.

This will run `zig fmt` whenever you save a file.

Happy hacking!