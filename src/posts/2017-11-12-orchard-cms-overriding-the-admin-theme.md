---
title: "Orchard CMS: Overriding the Admin Theme"
date: 2017-11-12T20:02:34.733Z
draft: false
layout: post
path: /orchard-cms-overriding-the-admin-theme/
next: /orchard-cms-switching-themes-dynamically/
previous: /orchard-cms-strongly-typed-webapi-routing/
tags:
  - Orchard CMS
  - Themes
  - Customizing
  - C#
  - HowTo
---

Overriding the admin theme is easy, but no one seems to talk about it. Let's change that here.

<div class="fold"></div>

Almost everything in Orchard is achieved by implementing an interface. Orchard will collect all the implementations
and loop through them, or it selects the one with the highest priority; depending on the feature.

Good news everybody, it's the same for overriding themes!

## TLDR;

* Implement [`IThemeSelector`](https://github.com/OrchardCMS/Orchard/blob/1.10.x/src/Orchard/Themes/IThemeSelector.cs)
* Make sure you check the [`AdminFilter`](https://github.com/OrchardCMS/Orchard/blob/1.10.x/src/Orchard/UI/Admin/AdminFilter.cs#L36)
* Return a `ThemeSelectorResult` with a higher priority than the default admin theme.
* `Activate` your custom admin theme. (Do **not** click `Set current`)

```csharp
namespace MyAwesomeAdminTheme
{
    using System.Web.Routing;

    using Orchard.Themes;
    using Orchard.UI.Admin;

    public class OverrideTheAdmin : IThemeSelector
    {
        public ThemeSelectorResult GetTheme(RequestContext context)
        {
            if ( AdminFilter.IsApplied(context) )
            {
                return new ThemeSelectorResult
                {
                  Priority = 110,
                  ThemeName = "MyAwesomeAdminTheme"
                };
            }

            return null;
        }
    }
}
```

And that's about it, from here on it's customizing as usual.

## How it works

This section shines a little light on the code above. If you've got some time and want to know what you're doing (I hope you do), this is for you.

To get a list of all implementations of a certain interface, simply inject it as `IEnumberable<ISomeInterface>` and autofac will take care of the rest.

So on every request that returns a [themed result](https://github.com/OrchardCMS/Orchard/blob/1.10.x/src/Orchard/Themes/ThemeFilter.cs), Orchard will collect all `IThemeSelector` implementations, including your new admin theme selector. Because of this, it's important to check that the current route is actually the admin dashboard by calling `AdminFilter.IsApplied`. Otherwise you would also override your active frontend themes.

It will then [order them by priority](https://github.com/OrchardCMS/Orchard/blob/1.10.x/src/Orchard.Web/Modules/Orchard.Themes/Services/ThemeService.cs#L108) (highest first),
and take the first _active_ theme that matches the name of the current `ThemeSelectorResult`.
The result is assigned as current theme to the current request.

Happy coding!

---

#### Fun fact

For some reason there are two identical implementations of the `GetRequestTheme` function. One in [`Orchard.Themes/Services/ThemeService.cs`](https://github.com/OrchardCMS/Orchard/blob/1.10.x/src/Orchard.Web/Modules/Orchard.Themes/Services/ThemeService.cs#L108) the other in [`Orchard/Themes/ThemeManager.cs`](https://github.com/OrchardCMS/Orchard/blob/1.10.x/src/Orchard/Themes/ThemeManager.cs).
