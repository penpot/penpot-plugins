import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(function (fastify: FastifyInstance) {
  void fastify.register(cors);
});
