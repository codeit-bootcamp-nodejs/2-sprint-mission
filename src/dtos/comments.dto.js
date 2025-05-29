const { object, string } = require('superstruct');

const CreateDto = object({
  content: string()
});

module.exports = {
  CreateDto,
};