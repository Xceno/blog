---
title: Unable to resolve symbol ZWNBSP in this context 
date: 2023-11-20T13:57:01.319Z
draft: false
layout: post
path: /unable-to-resolve-symbol-zwnbsp-in-this-context/
next:
previous:
tags:
  - File Encodings
  - Compile Errors
---

So, you got a mysterious compile error and if you're lucky, your compiler will
at least show you `ZWNBSP` instead of just a space.

Chances are your file got encoded in `UTF-8 BOM` instead of just `UTF-8`, and your compiler
is choking on the [Byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark).

To fix it, convert the file to `UTF-8` **without BOM**.

This has happened to me several times over my career in various languages and has cost me hours of senseless debugging.
Maybe you're lucky enough to find this post quickly when it happened to you.

As an example, here's an error message from the Clojure compiler:

```clojure
Syntax error compiling at (somefile.clj:3:1)
Unable to resolve symbol: ZWNBSP in this context
```


## Convert to UTF-8 without BOM
### VIM

- `:set fileencoding=utf8`
- `:set nobomb`
- Save the file.

### IntelliJ

You should see your current encoding in the lower right status line.
Click on it and choose `Remove BOM`.

#### Configure IntelliJ to prevent this

- Open `Settings -> Editor -> File Encodings`
- Set `Create UTF-8 files` to **wih NO BOM**


###### References

- https://stackoverflow.com/questions/2223882/whats-the-difference-between-utf-8-and-utf-8-with-bom
- https://en.wikipedia.org/wiki/Byte_order_mark
- https://www.jetbrains.com/help/idea/encoding.html#file-encoding-settings
- https://vimdoc.sourceforge.net/htmldoc/options.html#%27bomb%27
