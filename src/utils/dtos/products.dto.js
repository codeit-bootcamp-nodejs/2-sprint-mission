const { object, string, size, number, array, optional } = require('superstruct');

export const CreateDto = object({
    name: size(string(), 1, 30),
    description: string(),
    price: number(),
    tags: size(array(string()), 1, 10),
    imageUrl: optional(string()),
});
