const { object, string } = require('superstruct');

const CreateDto = object({
  name: string(),
  title: string(),
  content: string()
});

module.exports = {
  CreateDto,
};