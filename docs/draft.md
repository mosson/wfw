ユーザーコードのイメージ

```typescript
// main.ts
import { init } from "init.ts";
import { routes } from "routes.ts";
const port = 8000;
init().then(routes).then((app) => app.listen({ port: port }));
```

```typescript
// init.ts
import { Application } from "application.ts";
import { NotFound } from "actions/not-found.ts";
import { NotAcceptable } from "actions/not-acceptable.ts";
export async () => {
  const app = new Application({
    // here goes configurations...
  })
  app.catch(Application.NotFound, [NotFound]);
  app.catch(Application.NotAcceptable, [NotAcceptable]);
  return app;
}
```

```typescript
// routes.ts
import { Application } from "application.ts";
import { Auth } from "middlewares/auth.ts";
import { FooAction } from "actions/foo.ts";
import { BarAction } from "actions/bar.ts";
export async (app: Application) => {
  app.get<{foo_value: string}>("/foo/:foo_value", [FooBarAction])
  // request.bodyの型もGenericsで指定できる
  app.post<{email: string}>("/bar", [Auth, BarBarAction])
  return app;
}
```

```typescript
// actions/foo.ts
export async (ctx: Context) => {
  const bindings = ctx.params;
  switch(true) {
    case ctx.isHTML:
      ctx.renderHTML("index.html.erb", bindings);
      break;
    case ctx.isJSON:
      ctx.renderJSON({params});
      break;
    default:
      throw new Application.NotAcceptable("Unhandled Content-Type");
      break;
  }
  ctx.render("index.ejs", bindings);
}
```

```typescript
// actions/bar.ts
interface Params {
  url: string;
}
export async (ctx: Context) => {
  const body = await ctx.body.read();
  const params: Params = JSON.parse(body);
  if(!params.url) {
    throw new Application.NotFound("url parameter missing.");
    return;
  }
  ctx.redirect(url);
}
```
