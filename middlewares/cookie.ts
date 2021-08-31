import {
  Cookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.103.0/http/cookie.ts";

export type Options = Omit<Cookie, "name" | "value">;

export class CookieMiddleware {
  private key: string;
  private options: Options;

  constructor(key: string, options: Options = {}) {
    this.key = key;
    this.options = options;
  }

  call(
    req: Request extends infer Req ? Req : Request,
    res: Response extends infer Res ? Res : Response,
    next: (...args: unknown[]) => void,
  ) {
    let cookie: string | undefined = getCookies(req)[this.key];
    if (!cookie) cookie = crypto.randomUUID();
    next(req, res, next);
    setCookie(
      res,
      Object.assign({
        name: this.key,
        value: cookie,
      }, this.options),
    );
  }
}
