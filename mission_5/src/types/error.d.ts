declare global {
  interface Error {
    status?: number;
    code?: string;
  }
}

export {};