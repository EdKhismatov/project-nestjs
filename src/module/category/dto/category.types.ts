import { FastifyRequest } from 'fastify';

export interface CategoryRequest extends FastifyRequest {
  user: {
    id: string;
  };
}
