import { string, size, object } from 'superstruct';

export var CreateCommentDtoStruct = object({
  content: size(string(), 1, 500)
})

export interface CommentListQueryDto {
  cursor: number | null;
  take: number | null;
  relationId: number;
}