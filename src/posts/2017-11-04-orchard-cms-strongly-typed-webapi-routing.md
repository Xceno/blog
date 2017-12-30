---
title: "Orchard CMS: Strongly typed WebApi routing"
date: 2017-12-04T22:12:45.031Z
draft: false
layout: post
path: /orchard-cms-strongly-typed-webapi-routing/
next: /orchard-cms-overriding-the-admin-theme/
previous:
tags:
  - Orchard CMS
  - WebApi
  - Routing
  - C#
---

If you're developing WebApi projects in Orchard, you're probably used to declare your API routes as a simple string array. However, we can get fully compile-time checked routes that are also easy to refactor.

<div class="fold"></div>

If you check the [Orchard Docs](http://docs.orchardproject.net/en/latest/Documentation/WebApi-In-Orchard/) or any tutorials for setting up API routes you'll
quickly end up with a RouteConfig like this:

```csharp
public class ApiRoutes : IHttpRouteProvider
{
    public IEnumerable<RouteDescriptor> GetRoutes()
    {
        return new RouteDescriptor[]
        {
            new HttpRouteDescriptor
            {
              Name = "Default Api",
              Priority = 0,
              RouteTemplate = "api/users",
              Defaults = new
              {
                area = "MyCustomModule",
                controller = "Users"
              }
            },

            new HttpRouteDescriptor
            {
              Name = "Default Api",
              Priority = 0,
              RouteTemplate = "api/users/{id}",
              Defaults = new
              {
                area = "MyCustomModule",
                controller = "Users",
                id = RouteParameter.Optional
              }
            },

            // etc...

        };
    }

  // ...
}
```

I have some problems with this approach: It becomes quite unwieldy pretty soon, it's hard to refactor and easy to introduce bugs.<br/> If you've ever searched
for hours on end why a route isn't hit, called with wrong or messed up parameters just to find a dumb typo in your `RouteConfig`, you know what I'm talking
about.

So what to do about it?

Initially, I spent some time trying to implement my own
[`AttributeRouting`](https://blogs.msdn.microsoft.com/webdev/2013/10/17/attribute-routing-in-asp-net-mvc-5/) in Orchard, but it just didn't go too well. So
after a while I ditched that idea and began from scratch. You can see the result below:

```csharp
// C#7 syntax for brevity
public class ExampleController : ApiController
{
    public IHttpActionResult GetList() => this.Ok(new string[] { "value1", "value2" });

    public GetDetails(int id) => this.Ok("value");

    public IHttpActionResult Post([FromBody]string value) => this.Created("example", value);

    public IHttpActionResult Put(int id, [FromBody]string value) => this.Ok();

    public IHttpActionResult Delete(int id) => this.Ok();
}
```

```csharp
public class ApiRoutes : IHttpRouteProvider
{
    public IEnumerable<RouteDescriptor> GetRoutes()
    {
        var route = new ApiRouteFactory(Statics.ModuleAreaName, "api");

        return new[] {
            route.BuildRoute<ExampleController>              (x => x.GetList,    "example"),
            route.BuildRoute<ExampleController, int>         (x => x.GetDetails, "example", "{id:int}"),
            route.BuildRoute<ExampleController, string>      (x => x.Post,       "example"),
            route.BuildRoute<ExampleController, int, string> (x => x.Put,        "example", "{id:int}"),
            route.BuildRoute<ExampleController, int>         (x => x.Delete,     "example", "{id:int}"),
        };
    }

    //...
}
```

If you're in a hurry, go grab the source from [Github](https://github.com/xceno/Orchard.Tools) and get back coding. Read on for some details about the
implementation.

## How it works

Let's start with the call to `BuildRoute` and dig deeper from there.

```csharp
// ExampleController.cs
public IHttpActionResult GetDetails(int id) => this.Ok("value");


// ApiRoutes.cs
route.BuildRoute<ExampleController, int> (x => x.GetDetails, "example", "{id:int}"),


// ApiRouteFactory.cs
public HttpRouteDescriptor BuildRoute<TController, TParam>(
    Expression<Func<TController, Func<TParam, IHttpActionResult>>> expression,
    params string[] routeParts)
    where TController : ApiController
{
    var actionName = ReflectOnMethod<TController>.NameOf(expression);
    return this.MakeRouteDescriptor(typeof(TController), string.Join("/", routeParts), actionName);
}
```

If you're not familiar with `Func<T, TResult>` [MSDN explains it pretty good](<https://msdn.microsoft.com/en-us/library/bb549151(v=vs.110).aspx>):

> [Func] encapsulates a method that has one parameter and returns a value of the type specified by the TResult parameter.

Therefore, `BuildRoute`s first parameter is an expression that takes a controller as input and expects a function as result, which itself takes one parameter and returns `IHttpActionResult`. (Yeah, read that again slowly.)

This expression is what brings us all the intellisense, type safety and refactoring goodness. If we change the signature of `GetDetails`, our module will no longer compile.
The code that makes this possible resides in `ReflectOnMethod` and was shamelessly stolen from [this excellent StackOverflow answer](https://stackoverflow.com/questions/8225302/get-the-name-of-a-method-using-an-expression/26976055#26976055). (Thanks kędrzu!)

#### MakeRouteDescriptor

At this point, all that remains is some string parsing and building the `HttpRouteDescriptor`.

```csharp
public HttpRouteDescriptor MakeRouteDescriptor(Type controller, string routeSlug, string action)
{
    var route = this.routePrefix + routeSlug;
    var ctrlIndex = controller.Name.LastIndexOf("Controller", StringComparison.Ordinal);
    var controllerName = controller.Name.Substring(0, ctrlIndex);

    return MakeRouteDescriptor(
        this.moduleAreaName,
        route,
        controllerName,
        action,
        httpMethod: HttpMethodOfAction(action));
}

public static HttpRouteDescriptor MakeRouteDescriptor(
    string area,
    string route,
    string controller,
    string action,
    int priority = 5,
    HttpMethod httpMethod = null)
{
    var defaults = new ExpandoObject();
    var underlyingObject = (IDictionary<string, object>)defaults;
    underlyingObject.Add("area", area);
    underlyingObject.Add("controller", controller);
    underlyingObject.Add("action", action);

    var constraints = ParseRouteAttributeConstraints(route, defaults, httpMethod);

    return new HttpRouteDescriptor
    {
        RouteTemplate = CleanupRoute(route),
        Defaults = defaults,
        Priority = priority,
        Constraints = constraints
    };
}
```

There are two interesting things going on, but first things first.
You're probably asking yourself: WTF is the `ExpandoObject` doing here?
Well, in this example absolutely nothing. You could use a dictionary instead. It just happened that I wrote some modules which fiddle around with the generated routes and having an `ExpandoObject` makes it easier to do so.

With that out of the way, let's continue.

#### HttpMethodOfAction

Maybe you noticed that every action in the `ExampleController` starts with a `HttpVerb`. This is the only important thing you'll need to remember when using the module.

The `BuildRoute<TController>(...)` function will parse the action name for the verb and assign it to the resulting `RouteDescriptor`.
Sounds fancy, but again, there's absolutely no magic going on there:

```csharp
// The inner workings of the ApiRouteFactory
// when determining the HTTP Verb for a controller action.
private static HttpMethod HttpMethodOfAction(string actionName)
{
    if (actionName.StartsWith(HttpMethod.Post.Method, StringComparison.OrdinalIgnoreCase))
        return HttpMethod.Post;

    if (actionName.StartsWith(HttpMethod.Put.Method, StringComparison.OrdinalIgnoreCase))
        return HttpMethod.Put;

    // Yep, there is no official HttpMethod.Patch!
    if (actionName.StartsWith("Patch", StringComparison.OrdinalIgnoreCase))
        return new HttpMethod("PATCH");

    if (actionName.StartsWith(HttpMethod.Delete.Method, StringComparison.OrdinalIgnoreCase))
        return HttpMethod.Delete;

    return HttpMethod.Get;
}
```

So an `actionName` of `"GetSomething"` will result in `HttpMethod.Get` and so on.

#### ParseRouteAttributeConstraints

And once again some string parsing. When defining routes, we can use [`RouteContstraints`](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/controllers-and-routing/creating-a-route-constraint-cs) to narrow down the request that matches a particular route.
So if we define a route like this: `GET "api/example/{id}"`, any requests that fill in **anything** for the id parameter will match. This may be wanted in some cases, but most of the time it's a good idea to restrict parameters to a certain type, like an integer: `GET "api/example/{id:int}"`.

This is exactly what the following code does. It looks at all the parts of our route and extracts the `RouteContstraints`.

```csharp
/// <summary>
/// <para>
/// Creates route constraints from the given route.
/// Use the return value as input for <c>HttpRouteDescriptor.Contraints</c>.
/// </para>
/// <example>
/// "http://example.com/api/users/{id:int}" will create an integer contstraint for the id parameter.
/// </example>
/// </summary>
/// <param name="route">The absolute route to be parsed.</param>
/// <param name="defaults">
/// An object that will be filled with all optional parameters.
/// Should be used as value for <c>HttpRouteDescriptor.Defaults</c>.</param>
/// <param name="httpMethod">The routes http-verb.</param>
private static dynamic ParseRouteAttributeConstraints(string route, ExpandoObject defaults, HttpMethod httpMethod = null)
{
    var split = route.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
    var attributes = split.Where(x => x.StartsWith("{") && x.EndsWith("}"));

    dynamic constraints = new ExpandoObject();
    var underlyingObject = (IDictionary<string, object>)constraints;

    foreach (var attr in attributes)
    {
        var tmpSplit = attr.Trim('{', '}').Split(':');
        var key = tmpSplit[0];
        if (tmpSplit.Length == 2 && !underlyingObject.ContainsKey(key))
        {
            var typeName = tmpSplit[1];
            var isOptional = typeName.EndsWith("?");

            if (isOptional)
            {
                typeName = typeName.TrimEnd('?');
                ((IDictionary<string, object>)defaults).Add(key, RouteParameter.Optional);
            }

            var constraint = GetConstraintForTypename(typeName, isOptional);
            if (constraint != null)
            {
                underlyingObject.Add(key, constraint);
            }
            else
            {
                Debug.WriteLine("No matching IHttpRouteConstraint found for type '{0}'", typeName);
            }
        }
    }

    if (httpMethod != null)
    {
        underlyingObject.Add("httpMethod", new HttpMethodConstraint(httpMethod, HttpMethod.Options));
    }

    return constraints;
}

private static IHttpRouteConstraint GetConstraintForTypename(string typename, bool isOptional)
{
    /* List of all route constraints:
        * https://msdn.microsoft.com/en-us/library/system.web.http.routing.constraints(v=vs.118).aspx
        */

    IHttpRouteConstraint constraint = null;
    switch (typename)
    {
        case "bool":
        case "boolean":
            constraint = new BoolRouteConstraint();
            break;
        case "int":
            constraint = new IntRouteConstraint();
            break;
        case "long":
            constraint = new LongRouteConstraint();
            break;
        case "float":
            constraint = new FloatRouteConstraint();
            break;
        case "double":
            constraint = new DoubleRouteConstraint();
            break;
        case "string":
            constraint = new AlphaRouteConstraint();
            break;
    }

    return isOptional ? new OptionalRouteConstraint(constraint) : constraint;
}
```

I chose to only implement the most commonly used constraints, but feel free to extend the code above by going through [this list on MSDN](<https://msdn.microsoft.com/en-us/library/system.web.http.routing.constraints(v=vs.118).aspx>).

The TLDR version of this code: Take an attribute like `{id:int}`, split it into `key = "id"` and `constraint = "int"`, and update the `RouteConstraints` and `RouteDefaults` accordingly.

And that's it!

If you read until this point, thanks!<br/>
I'd warmly welcome any comments, ideas, and bug reports. Just Shoot me a mail. Also, check out the full source on [Github](https://github.com/xceno/Orchard.Tools).

Over and out.
