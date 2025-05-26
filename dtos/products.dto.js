const { object, string, number, array } = require('superstruct');

const CreateProductDto = object({
  name: string(),
  description: string(),
  price: number(),
  tags: array(string())
});

module.exports = {
  CreateDto,
};