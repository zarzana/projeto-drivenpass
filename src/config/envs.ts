import dotenv from 'dotenv';

export function loadEnv() {
  const path = '.env';
  dotenv.config({ path });
}
