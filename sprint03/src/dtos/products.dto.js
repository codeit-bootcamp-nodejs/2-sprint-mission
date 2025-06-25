import { object, string, number, array } from "superstruct";

const CreateDto = object({
  name: string(),
  description: string(),
  price: number(),
  tags: array(string()),
});

export { CreateDto };
