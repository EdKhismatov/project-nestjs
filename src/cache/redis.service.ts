/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType, SetOptions } from '@redis/client';
import { REDIS } from './cache.provider';

@Injectable()
export class RedisService {
  @Inject(REDIS)
  private readonly redis: RedisClientType;

  async set(key: string, value: Record<string, any>, options?: SetOptions) {
    const json = JSON.stringify(value);

    return this.redis.set(key, json, options);
  }

  async get<T extends Record<string, any>>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async deleteForPattern(pattern: string): Promise<number> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }

    return keys.length;
  }
}
