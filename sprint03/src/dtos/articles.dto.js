const { object, string } = require('superstruct');

const CreateDto = object({
  title: string(),
  content: string()
});

module.exports = {
  CreateDto,
};