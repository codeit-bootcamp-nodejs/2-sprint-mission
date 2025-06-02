const { object, string, number, array } = require('superstruct');

const CreateDto = object({
  name: string(),
  description: string(),
  price: number(),
  tags: array(string())
});

module.exports = {
  CreateDto,
};