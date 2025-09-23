declare global {
  namespace passport {
    export interface payload {
      sub: number;
      iat: number;
      exp: number;
    }
    export interface VerifyCallback {
      (err: Error | null, user?: any, info?: any): void;
    }
  }
}
export {};
