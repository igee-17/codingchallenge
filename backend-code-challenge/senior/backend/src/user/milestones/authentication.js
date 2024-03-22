'use strict';

const finaleRest = require('finale-rest');
const {
  API: {
    HEADERS: { X_SLUG },
    SLUGS: { MYSELF },
  },
} = require('../../config');

module.exports = (req, res, context) => {
  // Check if the operation involves the special 'MYSELF' slug
  if (req.params.slug === MYSELF) {
    const encodedSlug = req.header(X_SLUG);

    // If no slug is present in the header, throw a BadRequestError
    if (!encodedSlug) {
      throw new finaleRest.Errors.BadRequestError('Missing user slug');
    }

    // Decode the slug from base64 and update req.params
    const decodedSlug = Buffer.from(encodedSlug, 'base64').toString('utf-8');
    req.params.slug = decodedSlug;
  }

  return context.continue;
};
