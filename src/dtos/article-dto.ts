import { object , string , size } from "superstruct";


export const articleDto = object({
  title : size(string(), 1, 30),
  content : size(string(), 1, 300),
});

