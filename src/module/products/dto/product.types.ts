import { FastifyRequest } from 'fastify';

export interface ProductRequest extends FastifyRequest {
  user: {
    id: string;
    role: string;
    email: string;
  };
}

export interface IActiveUser {
  id: string;
  role: string;
  email: string;
}
