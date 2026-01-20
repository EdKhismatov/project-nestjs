import { config as readEnv } from 'dotenv';
import * as process from 'node:process';
import { validate } from '../validation/validate.dto';
import { AppConfigDto } from './dto';

readEnv();

export const rawConfig = {
  port: process.env.PORT,
};

export const portConfig = validate(AppConfigDto, rawConfig);
