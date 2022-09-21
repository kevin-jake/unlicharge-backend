const { UserInputError } = require("apollo-server-express");

module.exports = (inputs, validateFunction) => {
  const { valid, errors } = validateFunction(inputs);
  if (!valid) {
    throw new UserInputError("Errors", { errors });
  }
};
