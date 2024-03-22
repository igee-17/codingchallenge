'use strict';

const axios = require('axios'); // Importing axios library for making HTTP requests
const {
  STAR_WARS_API: {
    BASE_URL,
    ENDPOINTS: { PEOPLE },
  },
} = require('../../config');

module.exports = async (req, res, context) => {
  const {
    instance: {
      dataValues: { favourites },
    },
  } = context; // Destructure favourites from context

  // Map over each favorite and fetch details from Star Wars API
  const favouritesDetails = await Promise.all(
    favourites.map(async (id) => {
      const response = await axios.get(`${BASE_URL}/${PEOPLE}/${id}`);
      return response.data;
    }),
  );

  // Add fetched details to the context
  context.instance.dataValues.favouritesDetails = favouritesDetails;

  return context.continue;
};
