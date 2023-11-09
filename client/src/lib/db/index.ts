import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) {
    throw new Error('Missing DATABASE_URL');
}

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
