import { FastifyRequest } from 'fastify';

export interface ProductRequest extends FastifyRequest {
  user: {
    id: string;
  };
}
