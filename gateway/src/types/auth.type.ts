export interface Payload {
  id: string;
  username: string;
}

export type RefreshRequest = {
  refreshToken: string;
};
