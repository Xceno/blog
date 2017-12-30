---
title: "Orchard CMS: Beware of SQL Keywords"
date: 2017-12-01T19:23:20.516Z
draft: false
layout: post
path: /orchard-cms-beware-of-sql-keywords/
next:  /managing-state-with-rxjs-in-react/
previous: /orchard-cms-strongly-typed-webapi-routing/
tags:
  - Orchard CMS
  - nHibernate
  - SQL
  - C#
  - Random
---

Just a quick reminder, before you debug hours on end (like me).

<div class="fold"></div>

Sometimes while developing a new Orchard module I get carried away and forget about other stuff.
Reserved SQL keywords for example. Then we might end up with a class like this:

```csharp
public class ShoppingCartEntryPart : ContentPart<ShoppingCartEntryRecord>
{
  public int Order
  {
    get { return this.Retrieve(x => x.Order); }
    set { this.Store(x => x.Order, value); }
  }

  public int Price
  {
    get { return this.Retrieve(x => x.Price); }
    set { this.Store(x => x.Price, value); }
  }
}
```

and a migration like this:

```csharp
public int Create()
{
  SchemaBuilder.CreateTable(
    "ShoppingCartEntryRecord",
    table => table
      .ContentPartRecord()
      .Column<int>("Price")
      .Column<int>("Order"));

  ContentDefinitionManager.AlterPartDefinition(
    typeof(ShoppingCartEntryPart).Name,
    config => config.Attachable());

  return 1;
}
```

The module will of course compile, but as soon as we use the `ContentManager` to retrieve or store it, it will crash with an exception like this:

> **NHibernate.Exceptions.GenericADOException:**<br/>
> 'could not insert: \[ReservedKeywordsTest.Models.ShoppingCartEntryRecord#12\][sql: insert into reservedkeywordstest_shoppingcartentryrecord (price, order, id) values (?, ?, ?)]'<br/><br/>
 > **InnerException**<br/>
> SqlCeException: There was an error parsing the query.<br/>
 > [ Token line number = 1, Token line offset = 66, Token in error = Order ]

That's because we're using SQL-Server or SQLCE where `ORDER` is a reserved keyword.
Check [this list on MSDN](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/reserved-keywords-transact-sql) for all reserved keywords.

In the example above we'd just need to rename `Order` to something like `SortOrder` and we're good to go again.
