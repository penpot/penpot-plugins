import { FastifyInstance } from 'fastify';

const token = process.env.ACCESS_TOKEN;

export default async function (fastify: FastifyInstance) {
  const apiUrl = process.env.API_URL;

  fastify.get('/get-profile', function () {
    console.log('sdfdsf');

    return fetch(`${apiUrl}/get-profile`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}
