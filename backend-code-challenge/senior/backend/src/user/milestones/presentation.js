'use strict';

const axios = require('axios'); // Import for making external API calls

const {
  STAR_WARS_API: {
    BASE_URL,
    ENDPOINTS: { PEOPLE },
  },
} = require('../../config');

module.exports = async (req, res, context) => {

  // Check if the user has any favourites
  if (!context.user || !context.user.favourites || context.user.favourites.length === 0) {
    return context.continue; // No favourites, continue processing
  }

  // Fetch character details for each favourite ID concurrently using Promise.all
  const favouriteDetailsPromises = context.user.favourites.map(async (favouriteId) => {
    const characterUrl = `${BASE_URL}/${PEOPLE}/${favouriteId}`;
    try {
      const response = await axios.get(characterUrl);
      return response.data; // Return the fetched character details
    } catch (error) {
      console.error('Error fetching character details:', error);
      return null;
    }
  });

  const favouritesDetails = await Promise.all(favouriteDetailsPromises);

  // Attach the enriched favouritesDetails to the context
  context.favouritesDetails = favouritesDetails;

  return context.continue;
};
