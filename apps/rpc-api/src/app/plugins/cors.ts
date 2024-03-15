import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

// eslint-disable-next-line @typescript-eslint/require-await
export default fp(async function (fastify: FastifyInstance) {
  void fastify.register(cors);
});
