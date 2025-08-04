const axios = require('axios');
require('dotenv').config();

// PUBLIC_INTERFACE
/**
 * Fetch group or member data from third-party API
 * @param {'groups' | 'members'} resource
 * @returns {Promise<any[]>}
 */
async function fetchResource(resource) {
  // Example URL: ${API_BASE_URL}/groups, ${API_BASE_URL}/members
  const url = `${process.env.API_BASE_URL}/${resource}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    }
  });
  return res.data;
}

module.exports = { fetchResource };
