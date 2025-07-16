import { object, string } from "superstruct";

const CreateDto = object({
  content: string(),
});


interface CommentCreateDto {
  content: string;
}

interface CommentUpdateDto {
  content?: string;
}

export { CreateDto, CommentCreateDto, CommentUpdateDto };
