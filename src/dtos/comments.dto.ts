import { IsNotEmpty, Length } from "class-validator";
import { string, object, size } from "superstruct";

export class CommentDto {
    @IsNotEmpty()
    @Length(1, 100)
    content: string = '';
}