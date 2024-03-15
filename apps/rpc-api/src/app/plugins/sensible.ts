import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import sensible from '@fastify/sensible';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
// eslint-disable-next-line @typescript-eslint/require-await
export default fp(async function (fastify: FastifyInstance) {
  void fastify.register(sensible);
});
