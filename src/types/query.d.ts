import path from "path";

export type getListArticleQuery = {
  title: string; 
  content: string;
  offset: number | string; 
  limit: number | string; 
  order: 'newest' | 'oldest'; 
}

export type getListProductQuery = {
  name: string; 
  description: string;
  offset: number | string; 
  limit: number | string; 
  order: 'newest' | 'oldest';
}