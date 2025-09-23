export type Map = {
  id: string;
  name: string;
  data: number[][];
  createdAt: string;
  updatedAt: string;
};

export type GetMapRequest = {
  id: string;
};

export type CreateMapRequest = {
  name: string;
  data: number[][];
};

export type ListMapListRequest = {};
export type ListMapListResponse = Map[];
