declare module 'koa-proxies' {
  import { Middleware } from 'koa';

  export interface ProxyOptions {
    target: string;
    changeOrigin?: boolean;
    logs?: boolean;
    ws?: boolean;
    [key: string]: any; // 확장 허용
  }

  function proxy(path: string, options: ProxyOptions): Middleware;

  export = proxy;
}
