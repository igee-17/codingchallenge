'use strict';

const { Errors: { BadRequestError } } = require('finale-rest'); // Import for error handling

const {
  API: {
    HEADERS: { X_SLUG },
    SLUGS: { MYSELF },
  },
} = require('../../config');
const { UserModel } = require('../model');

module.exports = (req, res, context) => {
  // Get the encoded slug from the request header
  const encodedSlug = req.headers[X_SLUG];

  // Check if the x-slug header is present
  if (!encodedSlug) {
    throw new BadRequestError('Missing x-slug header');
  }

  // Try decoding the base64 encoded slug
  let decodedSlug;
  try {
    decodedSlug = Buffer.from(encodedSlug, 'base64').toString('utf-8');
  } catch (error) {
    throw new BadRequestError('Invalid x-slug format (Base64 required)');
  }

  // Validate the decoded slug format (assuming it's a string)
  if (typeof decodedSlug !== 'string') {
    throw new BadRequestError('Invalid x-slug format (String expected)');
  }

  // // Fetch the user object based on the decoded slug
  const user = getUserBySlug(decodedSlug);

  // Handle cases where the user is not found or there's an error
  if (!user) {
    throw new BadRequestError('Invalid x-slug (user not found)');
  } else if (user instanceof Error) {
    throw user;
  }

  // Simulate user identification based on the decoded slug 
  const identifiedUser = decodedSlug === MYSELF ? user : null;

  // Attach the identified user to the context
  context.user = identifiedUser;


  // Attach the identified user to the context
  context.user = user;

  return context.continue;
};

async function getUserBySlug(slug) {
  try {
    // Using Sequelize instance to fetch the user
    const user = await UserModel.findOne({ where: { slug } });
    return user;
  } catch (error) {
    console.error('Error fetching user by slug:', error);
    throw error;
  }
}

