---
title: Install lombok to Eclipse snap
date: 2019-05-14T15:04:41.655Z
draft: false
layout: post
path: /install-lombok-to-eclipse-snap/
next:
previous:
tags:
  - Eclipse
  - Linux
  - Snap
  - Lombok
  - Java
---

A short tutorial on how to install lombok for a snap install of the Eclipse IDE.

<div class="fold"></div>

## TL;DR

- Download lombok
- Extract to wherever
- Customize a `.desktop` file to let eclipse start with lombok or a customized `eclipse.ini`

## Detailed version

First [download lombok](https://projectlombok.org/download) and extract it to wherver you see fit. I chose `~/bin/lombok.jar`.

If you try to run the installer it won't find your eclipse installation and pointing it to your snap install also won't work.
But have a look at \*Show me what this installer will do to my IDE installation."
You should see the following message:

```
1. First, I copy myself (lombok.jar) to your Eclipse install directory.
2. Then, I edit the eclipse.ini file to add the following entry:
   -javaagent:lombok.jar
```

So this is what we'll end up doing (sort of).
Since snaps are immutable we cannot copy `lombok.jar` to the installation directory. That's why we've chosen another dir.
Now all that's left to do is pointing eclipse to it.

To do this, create or copy an `eclipse.ini` file to your preferred location and add the following line to the bottom:\
`-javaagent:/PATH/TO/YOUR/LOMBOK.jar`.
You can copy the original one from `/snap/eclipse/current/eclipse.ini`.

Now create a [`.desktop`](https://wiki.archlinux.org/index.php/Desktop_entries) file like `~/.local/share/applications/eclipse_eclipse.desktop` with the following content:

```
[Desktop Entry]
X-SnapInstanceName=eclipse
Version=1.0
Type=Application
Name=Eclipse+Lombok
Icon=/snap/eclipse/40/icon.xpm
Exec=env BAMF_DESKTOP_FILE_HINT=/var/lib/snapd/desktop/applications/eclipse_eclipse.desktop /snap/bin/eclipse --launcher.ini /PATH/TO/YOUR/ECLIPSE.INI %U
Comment=Eclipse IDE
Categories=Development;IDE;
Terminal=false
StartupWMClass=eclipse
```

With this in place you'll find an `Eclipse+Lombok` entry in your applications menu. Happy coding!

###### References

<small>
<ul>
<li><a href="https://github.com/rzwitserloot/lombok/issues/1700">https://github.com/rzwitserloot/lombok/issues/1700</a></li>
<li><a href="https://askubuntu.com/questions/1051926/how-to-make-eclipse-installed-via-snap-use-a-differerent-configuration-when-star/1051927#1051927">https://askubuntu.com/questions/1051926/how-to-make-eclipse-installed-via-snap-use-a-differerent-configuration-when-star/1051927#1051927</a></li>
</ul>
</small>
