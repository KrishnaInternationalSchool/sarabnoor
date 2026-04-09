const validate = (schema, payload) => {
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationError = new Error("Validation failed");
    validationError.statusCode = 400;
    validationError.details = error.details.map((item) => item.message);
    throw validationError;
  }

  return value;
};

module.exports = { validate };
