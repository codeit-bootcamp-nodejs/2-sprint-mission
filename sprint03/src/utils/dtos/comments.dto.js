import { object, string } from "superstruct";

const CreateDto = object({
  content: string(),
});

export { CreateDto };
