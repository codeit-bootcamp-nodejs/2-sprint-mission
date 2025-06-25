import { object, string, size } from 'superstruct';

export const CreateDto = object({
    title: size(string(), 1, 30),
    content: string(),
});
