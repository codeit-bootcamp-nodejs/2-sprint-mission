import { object, string } from "superstruct";

const CreateDto = object({
  title: string(),
  content: string(),
});

export { CreateDto };
