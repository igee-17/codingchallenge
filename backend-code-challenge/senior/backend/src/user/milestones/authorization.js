'use strict';

const {
  Errors: { ForbiddenError },
} = require('finale-rest'); // Import ForbiddenError

const {
  API: {
    KEY,
    HEADERS: { X_API_KEY },
  },
} = require('../../config');

module.exports = (req, res, context) => {
  const apiKey = req.header(X_API_KEY);

  // Check if the API key is present and matches the configured key
  if (!apiKey || apiKey !== KEY) {
    throw new ForbiddenError('Wrong API key'); // Throw error if invalid
  }

  return context.continue;
};
